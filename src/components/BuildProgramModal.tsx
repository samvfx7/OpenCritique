import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  ShieldAlert,
  Calendar,
  Clock,
  Dumbbell,
  Home,
  Building,
  RotateCcw,
  Edit2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  AvailableEquipment,
  DayOfWeek,
  ExperienceLevel,
  PhysicalLimitation,
  ProgramSetupInput,
  TrainingGoal,
  TrainingLocation,
  WeeklyProgram,
} from '../domain/model/types';
import { ProgramGenerator } from '../domain/program/ProgramGenerator';
import { WorkoutUiModel, ExerciseUiModel } from '../features/workout/WorkoutSections';
import { LocalStorageService } from '../domain/storage/localStorageService';

interface BuildProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramGenerated: (programName: string, workouts: WorkoutUiModel[], program: WeeklyProgram) => void;
}

const ALL_DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'MONDAY', label: 'Monday', short: 'Mon' },
  { key: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { key: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { key: 'FRIDAY', label: 'Friday', short: 'Fri' },
  { key: 'SATURDAY', label: 'Saturday', short: 'Sat' },
  { key: 'SUNDAY', label: 'Sunday', short: 'Sun' },
];

export const BuildProgramModal: React.FC<BuildProgramModalProps> = ({
  isOpen,
  onClose,
  onProgramGenerated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalWizardSteps = 7; // Steps 1 to 7 are questionnaire, Step 8 is Preview & Editor

  // Questionnaire state
  const [goal, setGoal] = useState<TrainingGoal>('MUSCLE_GROWTH');
  const [experience, setExperience] = useState<ExperienceLevel>('BEGINNER');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(45);
  const [location, setLocation] = useState<TrainingLocation>('HOME_NO_EQUIPMENT');
  const [equipment, setEquipment] = useState<AvailableEquipment[]>([]);
  const [limitations, setLimitations] = useState<PhysicalLimitation[]>([]);
  const [defaultRestSeconds, setDefaultRestSeconds] = useState<number>(60);

  // Program Preview & Editor state
  const [generatedResult, setGeneratedResult] = useState<{
    program: WeeklyProgram;
    workouts: WorkoutUiModel[];
  } | null>(null);
  const [inspectedWorkoutId, setInspectedWorkoutId] = useState<string | null>(null);
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);

  if (!isOpen) return null;

  // Toggle days selection
  const handleToggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 2) {
        const next = selectedDays.filter((d) => d !== day);
        setSelectedDays(next);
        setDaysPerWeek(next.length);
      }
    } else {
      if (selectedDays.length < 6) {
        const next = [...selectedDays, day];
        setSelectedDays(next);
        setDaysPerWeek(next.length);
      }
    }
  };

  // Toggle limitation
  const handleToggleLimitation = (lim: PhysicalLimitation) => {
    if (lim === 'NONE') {
      setLimitations([]);
      return;
    }
    if (limitations.includes(lim)) {
      setLimitations(limitations.filter((l) => l !== lim));
    } else {
      setLimitations([...limitations.filter((l) => l !== 'NONE'), lim]);
    }
  };

  // Toggle equipment item for Home With Equipment
  const handleToggleEquipment = (eq: AvailableEquipment) => {
    if (equipment.includes(eq)) {
      setEquipment(equipment.filter((e) => e !== eq));
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  // Run generator
  const runGeneration = () => {
    const input: ProgramSetupInput = {
      goal,
      experience,
      location,
      equipment,
      daysPerWeek: selectedDays.length,
      selectedDays,
      sessionDurationMinutes,
      limitations,
      defaultRestSeconds,
    };

    const res = ProgramGenerator.generateProgram(input);
    setGeneratedResult(res);
    if (res.workouts.length > 0) {
      setInspectedWorkoutId(res.workouts[0].id);
    }
    setCurrentStep(8); // Move to Preview / Editor
  };

  const handleNextStep = () => {
    if (currentStep < totalWizardSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      runGeneration();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final Accept Program
  const handleAcceptProgram = () => {
    if (!generatedResult) return;

    // Check if an existing program is already saved
    const existing = LocalStorageService.getWeeklyProgram();
    if (existing && !showConfirmOverwrite) {
      setShowConfirmOverwrite(true);
      return;
    }

    LocalStorageService.saveWeeklyProgram(generatedResult.program);
    onProgramGenerated(
      generatedResult.program.name,
      generatedResult.workouts,
      generatedResult.program
    );
    onClose();
  };

  // Edit target values in preview
  const handleUpdateExerciseTarget = (
    workoutId: string,
    exerciseId: string,
    updates: { reps?: number; setsCount?: number; restSeconds?: number }
  ) => {
    if (!generatedResult) return;
    const updatedWorkouts = generatedResult.workouts.map((w) => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          const nextRest = updates.restSeconds !== undefined ? updates.restSeconds : ex.restSeconds;
          let nextSets = [...ex.sets];
          if (updates.setsCount !== undefined && updates.setsCount > 0) {
            if (updates.setsCount < nextSets.length) {
              nextSets = nextSets.slice(0, updates.setsCount);
            } else if (updates.setsCount > nextSets.length) {
              const diff = updates.setsCount - nextSets.length;
              const lastSet = nextSets[nextSets.length - 1];
              for (let i = 0; i < diff; i++) {
                nextSets.push({
                  id: `${ex.id}-s-${nextSets.length + 1}`,
                  setNumber: nextSets.length + 1,
                  measurementType: ex.measurementType,
                  targetReps: updates.reps ?? lastSet?.targetReps ?? 10,
                  targetWeight: lastSet?.targetWeight ?? null,
                  targetDuration: lastSet?.targetDuration ?? null,
                  targetDistance: lastSet?.targetDistance ?? null,
                  isCompleted: false,
                });
              }
            }
          }
          if (updates.reps !== undefined) {
            nextSets = nextSets.map((s) => ({ ...s, targetReps: updates.reps }));
          }
          return {
            ...ex,
            restSeconds: nextRest,
            sets: nextSets,
          };
        }),
      };
    });

    setGeneratedResult({
      ...generatedResult,
      workouts: updatedWorkouts,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 font-geist">
      <div className="w-full max-w-sm bg-[#121214] border border-white/10 rounded-t-[28px] sm:rounded-[28px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 bg-[#121214] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-space text-[0.65rem] tracking-[0.2em] font-bold text-[#8B5CF6] uppercase">
              {currentStep === 8 ? 'PROGRAM PREVIEW' : `SETUP ${currentStep} OF ${totalWizardSteps}`}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable Wizard Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* STEP 1: PRIMARY GOAL */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                  Step 01
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  What is your primary goal?
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Programs use distinct mechanical adaptations and rest strategies for each goal.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {(
                  [
                    {
                      key: 'STRENGTH',
                      label: 'Strength',
                      desc: 'Heavy mechanical tension, controlled tempo, and longer recovery.',
                    },
                    {
                      key: 'MUSCLE_GROWTH',
                      label: 'Muscle Growth (Hypertrophy)',
                      desc: 'High volume, eccentric control, and progressive overload.',
                    },
                    {
                      key: 'GENERAL_FITNESS',
                      label: 'General Fitness',
                      desc: 'Balanced strength, mobility, and functional conditioning.',
                    },
                    {
                      key: 'ENDURANCE',
                      label: 'Endurance & Stamina',
                      desc: 'High repetition density, aerobic capacity, and minimal rest.',
                    },
                    {
                      key: 'CALISTHENICS',
                      label: 'Calisthenics / Bodyweight Skills',
                      desc: 'Bodyweight control, strict joint stability, and skill progressions.',
                    },
                    {
                      key: 'SPORT_PERFORMANCE',
                      label: 'Sports Performance',
                      desc: 'Multi-planar power, unilateral balance, speed, and agility.',
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setGoal(opt.key)}
                    className={`p-3.5 rounded-[16px] border text-left transition-all cursor-pointer ${
                      goal === opt.key
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                        : 'bg-[#18181B] border-white/5 text-white/70 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{opt.label}</span>
                      {goal === opt.key && <Check size={14} className="text-[#8B5CF6]" />}
                    </div>
                    <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: EXPERIENCE */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                  Step 02
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Your training experience
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Calibrates starting volume, exercise complexity, and set targets.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {(
                  [
                    {
                      key: 'BEGINNER',
                      label: 'Beginner',
                      desc: 'Learning movement mechanics. 3 sets per exercise with gentle volume and accessible alternatives.',
                    },
                    {
                      key: 'INTERMEDIATE',
                      label: 'Intermediate',
                      desc: 'Consistent training history. Balanced progressive overload across 3–4 sets per movement.',
                    },
                    {
                      key: 'ADVANCED',
                      label: 'Advanced',
                      desc: 'High work capacity. 4 high-density sets per exercise with advanced variations.',
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setExperience(opt.key)}
                    className={`p-4 rounded-[16px] border text-left transition-all cursor-pointer ${
                      experience === opt.key
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                        : 'bg-[#18181B] border-white/5 text-white/70 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{opt.label}</span>
                      {experience === opt.key && <Check size={14} className="text-[#8B5CF6]" />}
                    </div>
                    <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE & DAYS */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                  Step 03
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Weekly training schedule
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Choose which days you are available. Realistic rest days promote physiological recovery.
                </p>
              </div>

              {/* Day Picker Pills */}
              <div className="flex flex-col gap-2">
                <label className="font-space text-[0.65rem] uppercase tracking-wider text-white/50">
                  Select Training Days ({selectedDays.length} Selected)
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {ALL_DAYS.map((d) => {
                    const isSelected = selectedDays.includes(d.key);
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => handleToggleDay(d.key)}
                        className={`py-3 rounded-[12px] font-space text-[0.65rem] uppercase font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/25'
                            : 'bg-[#18181B] text-white/40 border border-white/5 hover:text-white'
                        }`}
                      >
                        <span>{d.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recovery Banner */}
              <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-[14px] flex items-center justify-between font-space text-xs">
                <div className="flex flex-col">
                  <span className="text-white font-bold">{selectedDays.length} Training Sessions</span>
                  <span className="text-white/40 text-[10px]">High-focus stimulus</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[#8B5CF6] font-bold">{7 - selectedDays.length} Recovery Days</span>
                  <span className="text-white/40 text-[10px]">Rest & tissue adaptation</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SESSION DURATION */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                  Step 04
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Preferred workout duration
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Workout density and exercise counts scale precisely to your chosen time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { mins: 20, label: '15–20 min', desc: '3 concise movements' },
                    { mins: 30, label: '30 min', desc: '4 focused movements' },
                    { mins: 45, label: '45 min', desc: '5 balanced movements' },
                    { mins: 60, label: '60+ min', desc: '6 comprehensive movements' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.mins}
                    type="button"
                    onClick={() => setSessionDurationMinutes(opt.mins)}
                    className={`p-3.5 rounded-[16px] border text-left transition-all cursor-pointer ${
                      sessionDurationMinutes === opt.mins
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                        : 'bg-[#18181B] border-white/5 text-white/70 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <span className="font-space text-sm font-bold block">{opt.label}</span>
                    <span className="text-[11px] text-white/50 mt-1 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: LOCATION & EQUIPMENT */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                  Step 05
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Location & equipment
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Selecting no equipment strictly guarantees 100% bodyweight exercises only.
                </p>
              </div>

              {/* Location Selector */}
              <div className="flex flex-col gap-2">
                {(
                  [
                    {
                      key: 'HOME_NO_EQUIPMENT',
                      label: 'Home — No Equipment',
                      desc: 'Bodyweight only. Zero dumbbells, pull-up bars, or bands required.',
                      icon: <Home size={16} />,
                    },
                    {
                      key: 'HOME_WITH_EQUIPMENT',
                      label: 'Home — With Equipment',
                      desc: 'Select available dumbbells, bench, pull-up bar, or bands.',
                      icon: <Dumbbell size={16} />,
                    },
                    {
                      key: 'GYM',
                      label: 'Gym',
                      desc: 'Full access to barbells, cables, dumbbells, and racks.',
                      icon: <Building size={16} />,
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setLocation(opt.key);
                      if (opt.key === 'HOME_NO_EQUIPMENT') {
                        setEquipment([]);
                      }
                    }}
                    className={`p-3.5 rounded-[16px] border text-left transition-all cursor-pointer ${
                      location === opt.key
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                        : 'bg-[#18181B] border-white/5 text-white/70 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={location === opt.key ? 'text-[#8B5CF6]' : 'text-white/40'}>
                          {opt.icon}
                        </span>
                        <span className="text-sm font-semibold text-white">{opt.label}</span>
                      </div>
                      {location === opt.key && <Check size={14} className="text-[#8B5CF6]" />}
                    </div>
                    <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* Equipment sub-picker if HOME_WITH_EQUIPMENT */}
              {location === 'HOME_WITH_EQUIPMENT' && (
                <div className="pt-2 flex flex-col gap-2">
                  <label className="font-space text-[0.65rem] uppercase tracking-wider text-white/60">
                    Select Available Home Equipment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { key: 'DUMBBELLS', label: 'Dumbbells' },
                        { key: 'PULL_UP_BAR', label: 'Pull-Up Bar' },
                        { key: 'BENCH', label: 'Workout Bench' },
                        { key: 'RESISTANCE_BANDS', label: 'Bands' },
                      ] as const
                    ).map((eq) => {
                      const isSel = equipment.includes(eq.key);
                      return (
                        <button
                          key={eq.key}
                          type="button"
                          onClick={() => handleToggleEquipment(eq.key)}
                          className={`p-2.5 rounded-[12px] border font-space text-xs text-left flex items-center justify-between cursor-pointer transition-all ${
                            isSel
                              ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white font-bold'
                              : 'bg-[#18181B] border-white/5 text-white/50 hover:text-white'
                          }`}
                        >
                          <span>{eq.label}</span>
                          {isSel && <Check size={12} className="text-[#8B5CF6]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: LIMITATIONS & PREFERENCES */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                  Step 06
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Limitations & preferences
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Identify movements or joint angles to avoid. We automatically substitute safe alternatives.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {(
                  [
                    {
                      key: 'NONE',
                      label: 'No Physical Limitations',
                      desc: 'Full range of motion across all compound movements.',
                    },
                    {
                      key: 'KNEE_PAIN',
                      label: 'Knee Discomfort',
                      desc: 'Avoids deep knee flexion & high impact. Prefers hip bridges and isometric wall sits.',
                    },
                    {
                      key: 'SHOULDER_IMPINGEMENT',
                      label: 'Shoulder Impingement',
                      desc: 'Avoids overhead pressing and flared elbows. Prefers floor presses & neutral rows.',
                    },
                    {
                      key: 'LOWER_BACK',
                      label: 'Lower Back Sensitivity',
                      desc: 'Avoids heavy spinal loading. Substitutes bird-dogs, dead bugs, and supported bridges.',
                    },
                    {
                      key: 'WRIST_DISCOMFORT',
                      label: 'Wrist Discomfort',
                      desc: 'Avoids flat-palm floor pushing. Substitutes forearm planks and wall presses.',
                    },
                  ] as const
                ).map((opt) => {
                  const isSel =
                    opt.key === 'NONE' ? limitations.length === 0 : limitations.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleToggleLimitation(opt.key)}
                      className={`p-3 rounded-[14px] border text-left transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                          : 'bg-[#18181B] border-white/5 text-white/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{opt.label}</span>
                        {isSel && <Check size={13} className="text-[#8B5CF6]" />}
                      </div>
                      <p className="text-[10.5px] text-white/50 mt-0.5 leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[12px] flex items-start gap-2 text-white/40 text-[10px] leading-relaxed">
                <ShieldAlert size={14} className="shrink-0 text-white/50 mt-0.5" />
                <span>
                  OpenCritique provides algorithmic movement modifications and does not diagnose medical conditions.
                  Always consult a qualified professional for injury rehabilitation.
                </span>
              </div>
            </div>
          )}

          {/* STEP 7: REST DURATION */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                  Step 07
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Rest after every exercise
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  A rest countdown starts automatically between exercises after your final set. Choose your baseline.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { secs: 30, label: '30 Seconds', tag: 'Fast Pace / Conditioning' },
                    { secs: 60, label: '60 Seconds', tag: 'Standard Balanced Rest' },
                    { secs: 90, label: '90 Seconds', tag: 'Strength / Hypertrophy' },
                    { secs: 120, label: '120 Seconds', tag: 'Heavy Compound Recovery' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.secs}
                    type="button"
                    onClick={() => setDefaultRestSeconds(opt.secs)}
                    className={`p-3.5 rounded-[16px] border text-left transition-all cursor-pointer ${
                      defaultRestSeconds === opt.secs
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                        : 'bg-[#18181B] border-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <span className="font-space text-sm font-bold block">{opt.label}</span>
                    <span className="text-[10.5px] text-white/50 mt-1 block">{opt.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: PROGRAM PREVIEW & EDITOR */}
          {currentStep === 8 && generatedResult && (
            <div className="flex flex-col gap-4">
              {/* Program Overview Card */}
              <div className="p-4 bg-[#18181B] border border-white/10 rounded-[20px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-space text-[0.6rem] uppercase tracking-wider text-[#8B5CF6] font-bold">
                    CUSTOM 7-DAY SCHEDULE
                  </span>
                  <span className="font-space text-[0.65rem] text-white/50">
                    {generatedResult.program.daysPerWeek} Days/Wk
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {generatedResult.program.name}
                </h3>
                <div className="flex items-center gap-2 font-space text-[0.65rem] text-white/50 mt-1">
                  <span>{sessionDurationMinutes} min / session</span>
                  <span>•</span>
                  <span>{defaultRestSeconds}s rest</span>
                  <span>•</span>
                  <span>{location === 'HOME_NO_EQUIPMENT' ? 'Zero Equipment' : 'Equipment Included'}</span>
                </div>
              </div>

              {/* 7-Day Schedule List */}
              <div className="flex flex-col gap-2">
                <span className="font-space text-[0.65rem] uppercase tracking-wider text-white/50">
                  Seven-Day Program Roadmap
                </span>

                <div className="flex flex-col gap-1.5">
                  {generatedResult.program.schedule.map((day) => {
                    const workout = generatedResult.workouts.find((w) => w.id === day.workoutId);
                    const isInspected = inspectedWorkoutId === day.workoutId && workout;

                    return (
                      <div
                        key={day.dayOfWeek}
                        className={`p-3 rounded-[14px] border transition-all ${
                          day.isRestDay
                            ? 'bg-white/[0.01] border-white/5'
                            : isInspected
                            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]'
                            : 'bg-[#18181B] border-white/10 hover:border-white/20 cursor-pointer'
                        }`}
                        onClick={() => {
                          if (workout) {
                            setInspectedWorkoutId(workout.id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-space text-xs font-bold text-white/50 w-8">
                              {day.dayName.slice(0, 3)}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                day.isRestDay ? 'text-white/40' : 'text-white'
                              }`}
                            >
                              {day.focusTitle}
                            </span>
                          </div>

                          {day.isRestDay ? (
                            <span className="font-space text-[0.6rem] text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded-full">
                              Rest Day
                            </span>
                          ) : (
                            <span className="font-space text-[0.6rem] text-[#8B5CF6] font-bold bg-[#8B5CF6]/15 px-2 py-0.5 rounded-full border border-[#8B5CF6]/30">
                              {workout ? `${workout.exercises.length} Exercises` : 'Training'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inspected Workout Exercise Details & Editor */}
              {(() => {
                const currentWorkout = generatedResult.workouts.find((w) => w.id === inspectedWorkoutId);
                if (!currentWorkout) return null;

                return (
                  <div className="pt-2 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-space text-[0.65rem] uppercase tracking-wider text-white/50">
                        Inspecting: {currentWorkout.name}
                      </span>
                      <span className="font-space text-[0.6rem] text-[#8B5CF6]">
                        Tap values to customize
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {currentWorkout.exercises.map((ex, idx) => (
                        <div
                          key={ex.id}
                          className="p-3 bg-[#18181B] border border-white/5 rounded-[14px] flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-space text-xs text-[#8B5CF6] font-bold">
                                {idx + 1}.
                              </span>
                              <span className="text-sm font-semibold text-white">{ex.name}</span>
                            </div>
                            <span className="font-space text-[0.65rem] text-white/50">
                              {ex.restSeconds || defaultRestSeconds}s rest
                            </span>
                          </div>

                          {/* Instructions & Alternative */}
                          {ex.instructions && (
                            <p className="text-[11px] text-white/50 leading-relaxed">
                              {ex.instructions}
                            </p>
                          )}

                          {ex.alternative && (
                            <div className="font-space text-[0.6rem] text-white/40">
                              Alternative: <span className="text-white/60">{ex.alternative}</span>
                            </div>
                          )}

                          {/* Quick Adjusters for Sets & Reps */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                            <span className="font-space text-white/40">
                              {ex.sets.length} sets × {ex.sets[0]?.targetReps || 10}{' '}
                              {ex.measurementType === 'DURATION' ? 'sec' : 'reps'}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateExerciseTarget(currentWorkout.id, ex.id, {
                                    setsCount: Math.max(2, ex.sets.length - 1),
                                  })
                                }
                                className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white/60 flex items-center justify-center cursor-pointer font-space"
                                title="Decrease sets"
                              >
                                -
                              </button>
                              <span className="font-space text-xs text-white">{ex.sets.length}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateExerciseTarget(currentWorkout.id, ex.id, {
                                    setsCount: Math.min(5, ex.sets.length + 1),
                                  })
                                }
                                className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white/60 flex items-center justify-center cursor-pointer font-space"
                                title="Increase sets"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Overwrite confirmation dialog */}
              {showConfirmOverwrite && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-[14px] flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-space text-[0.65rem] uppercase">
                    <AlertCircle size={13} />
                    <span>Confirm Program Overwrite</span>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    You currently have an active program saved. Overwrite it with this new 7-day schedule?
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setShowConfirmOverwrite(false)}
                      className="px-3 py-1.5 rounded-[8px] bg-white/5 text-white/60 text-xs cursor-pointer font-space"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmOverwrite(false);
                        handleAcceptProgram();
                      }}
                      className="px-3 py-1.5 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer font-space"
                    >
                      Confirm & Replace
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#121214] flex items-center justify-between shrink-0">
          {currentStep > 1 && currentStep < 8 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-space text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
          ) : currentStep === 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-space text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw size={13} />
              <span>Change Goal</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-[12px] bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white font-space text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#8B5CF6]/25 transition-all"
            >
              <span>{currentStep === totalWizardSteps ? 'Generate Program' : 'Next'}</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runGeneration}
                className="px-3 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-white/70 font-space text-xs cursor-pointer"
                title="Regenerate"
              >
                Regenerate
              </button>

              <button
                type="button"
                onClick={handleAcceptProgram}
                className="px-5 py-2.5 rounded-[12px] bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white font-space text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#8B5CF6]/25 transition-all"
              >
                <span>Accept Program</span>
                <Check size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
