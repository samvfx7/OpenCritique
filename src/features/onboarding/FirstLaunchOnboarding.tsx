import React, { useState } from 'react';
import {
  TrainingGoal,
  ExperienceLevel,
  TrainingLocation,
  AvailableEquipment,
  PhysicalLimitation,
  DayOfWeek,
  ProgramSetupInput,
  UserPreferences,
  WeeklyProgram,
} from '../../domain/model/types';
import { ProgramGenerator } from '../../domain/program/ProgramGenerator';
import { LocalStorageService } from '../../domain/storage/localStorageService';
import { WorkoutUiModel } from '../workout/WorkoutSections';
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from 'lucide-react';

interface FirstLaunchOnboardingProps {
  onComplete: (program: WeeklyProgram, workouts: WorkoutUiModel[]) => void;
  initialPreferences?: UserPreferences | null;
  isModalMode?: boolean;
  onCancel?: () => void;
}

const GOAL_OPTIONS: {
  id: TrainingGoal;
  title: string;
  desc: string;
}[] = [
  { id: 'STRENGTH', title: 'Build strength', desc: 'Progressive overload, high motor unit recruitment, adequate recovery' },
  { id: 'MUSCLE_GROWTH', title: 'Build muscle', desc: 'Targeted volume, hypertrophy tempo, and mechanical tension' },
  { id: 'GENERAL_FITNESS', title: 'Improve general fitness', desc: 'Balanced strength, mobility, and cardiovascular conditioning' },
  { id: 'ENDURANCE', title: 'Improve endurance', desc: 'Aerobic capacity, sustained work capacity, and fatigue resistance' },
  { id: 'CALISTHENICS', title: 'Master calisthenics', desc: 'Strict bodyweight progressions, joint stability, and core tension' },
  { id: 'SPORT_PERFORMANCE', title: 'Improve sports performance', desc: 'Explosive power, agility, multi-planar movement, and durability' },
];

const EXPERIENCE_OPTIONS: {
  id: ExperienceLevel;
  title: string;
  desc: string;
}[] = [
  { id: 'BEGINNER', title: 'Beginner', desc: 'New to structured training or returning after an extended break' },
  { id: 'INTERMEDIATE', title: 'Intermediate', desc: 'Consistent training for 6+ months with sound movement technique' },
  { id: 'ADVANCED', title: 'Advanced', desc: 'Multiple years of disciplined training and high work capacity' },
];

const DURATION_OPTIONS = [
  { minutes: 20, label: '15–20 min', desc: 'Compact & focused (3 exercises)' },
  { minutes: 30, label: '30 min', desc: 'Efficient standard (4 exercises)' },
  { minutes: 45, label: '45 min', desc: 'Full progressive session (5 exercises)' },
  { minutes: 60, label: '60 min', desc: 'Comprehensive volume (6 exercises)' },
];

const ALL_DAYS: { key: DayOfWeek; short: string; name: string }[] = [
  { key: 'MONDAY', short: 'M', name: 'Mon' },
  { key: 'TUESDAY', short: 'T', name: 'Tue' },
  { key: 'WEDNESDAY', short: 'W', name: 'Wed' },
  { key: 'THURSDAY', short: 'T', name: 'Thu' },
  { key: 'FRIDAY', short: 'F', name: 'Fri' },
  { key: 'SATURDAY', short: 'S', name: 'Sat' },
  { key: 'SUNDAY', short: 'S', name: 'Sun' },
];

const LOCATION_OPTIONS: {
  id: TrainingLocation;
  title: string;
  desc: string;
}[] = [
  { id: 'HOME_NO_EQUIPMENT', title: 'Home, no equipment', desc: '100% bodyweight movements. Zero gear required.' },
  { id: 'HOME_WITH_EQUIPMENT', title: 'Home, with equipment', desc: 'Select your available gear (dumbbells, bands, bench, etc.)' },
  { id: 'GYM', title: 'Gym', desc: 'Full access to free weights, racks, and machines.' },
];

const HOME_EQUIPMENT_CHOICES: { id: AvailableEquipment; label: string }[] = [
  { id: 'DUMBBELLS', label: 'Dumbbells' },
  { id: 'RESISTANCE_BANDS', label: 'Resistance Bands' },
  { id: 'PULL_UP_BAR', label: 'Pull-Up Bar' },
  { id: 'BENCH', label: 'Flat / Incline Bench' },
  { id: 'KETTLEBELL', label: 'Kettlebell' },
];

const LIMITATION_OPTIONS: { id: PhysicalLimitation; label: string; desc: string }[] = [
  { id: 'KNEE_PAIN', label: 'Knee sensitivity', desc: 'Eliminates deep loaded squats and lunges' },
  { id: 'SHOULDER_IMPINGEMENT', label: 'Shoulder impingement', desc: 'Replaces overhead pressing and dips with safe planes' },
  { id: 'LOWER_BACK', label: 'Lower back sensitivity', desc: 'Replaces spinal compression with supported exercises' },
  { id: 'WRIST_DISCOMFORT', label: 'Wrist discomfort', desc: 'Replaces floor pushups and crawls with neutral wrist variants' },
];

const COMMON_DISLIKED = ['Burpees', 'Lunges', 'Mountain Climbers', 'Plank Holds', 'Pike Push-Ups'];

export const FirstLaunchOnboarding: React.FC<FirstLaunchOnboardingProps> = ({
  onComplete,
  initialPreferences,
  isModalMode = false,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Form state
  const [primaryGoal, setPrimaryGoal] = useState<TrainingGoal>(
    initialPreferences?.primaryGoal || 'BUILD_STRENGTH' as any || 'STRENGTH'
  );
  const [secondaryGoals, setSecondaryGoals] = useState<TrainingGoal[]>(
    initialPreferences?.secondaryGoals || []
  );

  const [experience, setExperience] = useState<ExperienceLevel>(
    initialPreferences?.experience || 'BEGINNER'
  );

  const [daysPerWeek, setDaysPerWeek] = useState<number>(
    initialPreferences?.daysPerWeek || 3
  );
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(
    initialPreferences?.selectedDays || ['MONDAY', 'WEDNESDAY', 'FRIDAY']
  );
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(
    initialPreferences?.sessionDurationMinutes || 45
  );

  const [location, setLocation] = useState<TrainingLocation>(
    initialPreferences?.location || 'HOME_NO_EQUIPMENT'
  );
  const [equipment, setEquipment] = useState<AvailableEquipment[]>(
    initialPreferences?.equipment || []
  );

  const [limitations, setLimitations] = useState<PhysicalLimitation[]>(
    initialPreferences?.limitations || []
  );
  const [dislikedExercises, setDislikedExercises] = useState<string[]>(
    initialPreferences?.dislikedExercises || []
  );
  const [preferredStyle, setPreferredStyle] = useState<string>(
    initialPreferences?.preferredStyle || 'Balanced'
  );

  // Generated preview state (Step 6)
  const [previewResult, setPreviewResult] = useState<{
    program: WeeklyProgram;
    workouts: WorkoutUiModel[];
  } | null>(null);

  // Toggle secondary goal
  const handleToggleSecondaryGoal = (goal: TrainingGoal) => {
    if (goal === primaryGoal) return;
    if (secondaryGoals.includes(goal)) {
      setSecondaryGoals(secondaryGoals.filter((g) => g !== goal));
    } else {
      if (secondaryGoals.length < 2) {
        setSecondaryGoals([...secondaryGoals, goal]);
      }
    }
  };

  // Toggle convenient days
  const handleToggleDay = (dayKey: DayOfWeek) => {
    if (selectedDays.includes(dayKey)) {
      if (selectedDays.length > 2) {
        const updated = selectedDays.filter((d) => d !== dayKey);
        setSelectedDays(updated);
        setDaysPerWeek(updated.length);
      }
    } else {
      if (selectedDays.length < 6) {
        const updated = [...selectedDays, dayKey];
        setSelectedDays(updated);
        setDaysPerWeek(updated.length);
      }
    }
  };

  // Toggle equipment item
  const handleToggleEquipment = (eq: AvailableEquipment) => {
    if (equipment.includes(eq)) {
      setEquipment(equipment.filter((e) => e !== eq));
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  // Toggle limitation
  const handleToggleLimitation = (lim: PhysicalLimitation) => {
    if (limitations.includes(lim)) {
      setLimitations(limitations.filter((l) => l !== lim));
    } else {
      setLimitations([...limitations, lim]);
    }
  };

  // Toggle disliked exercise
  const handleToggleDisliked = (exerciseName: string) => {
    if (dislikedExercises.includes(exerciseName)) {
      setDislikedExercises(dislikedExercises.filter((e) => e !== exerciseName));
    } else {
      setDislikedExercises([...dislikedExercises, exerciseName]);
    }
  };

  // Generate Program
  const handleBuildProgram = () => {
    const input: ProgramSetupInput = {
      goal: primaryGoal,
      secondaryGoals,
      experience,
      location,
      equipment: location === 'HOME_NO_EQUIPMENT' ? ['NONE'] : equipment,
      daysPerWeek: selectedDays.length,
      selectedDays,
      sessionDurationMinutes,
      limitations,
      defaultRestSeconds:
        primaryGoal === 'STRENGTH'
          ? 90
          : primaryGoal === 'MUSCLE_GROWTH'
          ? 75
          : primaryGoal === 'ENDURANCE'
          ? 45
          : 60,
      dislikedExercises,
      preferredStyle,
    };

    const result = ProgramGenerator.generateProgram(input);
    setPreviewResult(result);
    setStep(6); // Move to Preview Step
  };

  // Accept generated program and persist
  const handleAcceptProgram = () => {
    if (!previewResult) return;

    const userPrefs: UserPreferences = {
      primaryGoal,
      secondaryGoals,
      experience,
      daysPerWeek: selectedDays.length,
      selectedDays,
      sessionDurationMinutes,
      location,
      equipment: location === 'HOME_NO_EQUIPMENT' ? ['NONE'] : equipment,
      limitations,
      dislikedExercises,
      preferredStyle,
      completedAtEpochMillis: Date.now(),
    };

    LocalStorageService.saveUserPreferences(userPrefs);
    LocalStorageService.saveWeeklyProgram(previewResult.program);
    if (previewResult.workouts.length > 0) {
      LocalStorageService.saveWorkout(previewResult.workouts[0] as any);
    }
    LocalStorageService.setOnboardingCompleted(true);

    onComplete(previewResult.program, previewResult.workouts);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white flex flex-col justify-between font-geist px-5 py-6 sm:px-8 max-w-[440px] mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-lg bg-[#141417] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous step"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <span className="font-space text-[0.65rem] uppercase tracking-[0.2em] text-[#8B5CF6] font-bold">
              {step <= 5 ? `Step ${step} of ${totalSteps}` : 'Program Preview'}
            </span>
            <div className="text-xs text-white/40">
              {step === 1 && 'Goal'}
              {step === 2 && 'Experience'}
              {step === 3 && 'Schedule'}
              {step === 4 && 'Environment'}
              {step === 5 && 'Preferences & Limitations'}
              {step === 6 && 'Personalized Plan'}
            </div>
          </div>
        </div>

        {isModalMode && onCancel && (
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg bg-[#141417] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Main Step Body */}
      <div className="flex-1 py-5 flex flex-col justify-start">
        {/* STEP 1: GOAL */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                What do you want to achieve?
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Select your primary training focus. Tap an additional option for secondary emphasis.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {GOAL_OPTIONS.map((g) => {
                const isPrimary = primaryGoal === g.id;
                const isSecondary = secondaryGoals.includes(g.id);

                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      if (isPrimary) {
                        // Keep primary
                      } else if (isSecondary) {
                        setSecondaryGoals(secondaryGoals.filter((x) => x !== g.id));
                      } else {
                        setPrimaryGoal(g.id);
                        setSecondaryGoals(secondaryGoals.filter((x) => x !== g.id));
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isPrimary
                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-sm'
                        : isSecondary
                        ? 'bg-white/5 border-white/20'
                        : 'bg-[#121214] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white tracking-tight">
                          {g.title}
                        </span>
                        {isPrimary && (
                          <span className="font-space text-[0.6rem] text-[#8B5CF6] bg-[#8B5CF6]/15 px-1.5 py-0.2 rounded border border-[#8B5CF6]/30 uppercase font-bold">
                            Primary
                          </span>
                        )}
                        {isSecondary && (
                          <span className="font-space text-[0.6rem] text-white/60 bg-white/5 px-1.5 py-0.2 rounded border border-white/10 uppercase">
                            Secondary
                          </span>
                        )}
                      </div>
                      <p className="text-[0.72rem] text-white/50 mt-0.5 leading-snug line-clamp-1">
                        {g.desc}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSecondaryGoal(g.id);
                          }}
                          className={`font-space text-[0.6rem] px-2 py-1 rounded border transition-colors ${
                            isSecondary
                              ? 'bg-white/10 border-white/30 text-white'
                              : 'bg-transparent border-white/10 text-white/40 hover:text-white'
                          }`}
                        >
                          {isSecondary ? 'Added' : '+ Optional'}
                        </button>
                      )}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isPrimary
                            ? 'bg-[#8B5CF6] border-[#8B5CF6]'
                            : isSecondary
                            ? 'bg-white/20 border-white/40'
                            : 'border-white/20 bg-black/40'
                        }`}
                      >
                        {(isPrimary || isSecondary) && <Check size={11} className="text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                What's your experience?
              </h2>
              <p className="text-xs text-white/50 mt-1">
                OpenCritique sets volume, intensity progressions, and exercise complexity based on this.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              {EXPERIENCE_OPTIONS.map((exp) => {
                const isSelected = experience === exp.id;
                return (
                  <div
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-sm'
                        : 'bg-[#121214] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="pr-3">
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {exp.title}
                      </span>
                      <p className="text-[0.75rem] text-white/50 mt-1 leading-snug">
                        {exp.desc}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-white/20 bg-black/40'
                      }`}
                    >
                      {isSelected && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Training schedule
              </h2>
              <p className="text-xs text-white/50 mt-1">
                We distribute training and recovery periods across your week.
              </p>
            </div>

            {/* Frequency selection */}
            <div className="flex flex-col gap-1.5">
              <span className="font-space text-[0.68rem] text-white/60 uppercase tracking-wider">
                How many days per week can you train?
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setDaysPerWeek(num);
                      // Adjust selected days to match count
                      const defaultOrder: DayOfWeek[] = ['MONDAY', 'WEDNESDAY', 'FRIDAY', 'SATURDAY', 'TUESDAY', 'THURSDAY'];
                      setSelectedDays(defaultOrder.slice(0, num));
                    }}
                    className={`h-11 rounded-lg border font-space text-xs font-semibold cursor-pointer transition-all ${
                      daysPerWeek === num
                        ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                        : 'bg-[#121214] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {num} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Convenient days selection */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-space text-[0.68rem] text-white/60 uppercase tracking-wider">
                  Which days are convenient?
                </span>
                <span className="font-space text-[0.65rem] text-[#8B5CF6]">
                  {selectedDays.length} selected
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {ALL_DAYS.map((day) => {
                  const isChecked = selectedDays.includes(day.key);
                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => handleToggleDay(day.key)}
                      className={`h-12 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                          : 'bg-[#121214] border-white/5 text-white/40 hover:text-white/70'
                      }`}
                    >
                      <span className="text-[0.68rem] font-bold font-space">{day.short}</span>
                      <span className="text-[0.55rem] text-white/40">{day.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[0.68rem] text-white/40 mt-0.5">
                Remaining days will automatically be scheduled as Active Recovery & Mobility.
              </p>
            </div>

            {/* Session duration */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-space text-[0.68rem] text-white/60 uppercase tracking-wider">
                How long should a typical session take?
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((dur) => {
                  const isDur = sessionDurationMinutes === dur.minutes;
                  return (
                    <div
                      key={dur.minutes}
                      onClick={() => setSessionDurationMinutes(dur.minutes)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isDur
                          ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]'
                          : 'bg-[#121214] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white font-space">
                          {dur.label}
                        </span>
                        {isDur && <Check size={12} className="text-[#8B5CF6]" />}
                      </div>
                      <p className="text-[0.65rem] text-white/40 mt-0.5">{dur.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION & EQUIPMENT */}
        {step === 4 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Where will you train?
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Exercise selection strictly conforms to your available gear.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {LOCATION_OPTIONS.map((loc) => {
                const isSelected = location === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setLocation(loc.id);
                      if (loc.id === 'HOME_NO_EQUIPMENT') {
                        setEquipment([]);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] shadow-sm'
                        : 'bg-[#121214] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="pr-3">
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {loc.title}
                      </span>
                      <p className="text-[0.75rem] text-white/50 mt-0.5 leading-snug">
                        {loc.desc}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-white/20 bg-black/40'
                      }`}
                    >
                      {isSelected && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Equipment selection if Home with equipment */}
            {location === 'HOME_WITH_EQUIPMENT' && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                <span className="font-space text-[0.68rem] text-white/60 uppercase tracking-wider">
                  Which equipment is available?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {HOME_EQUIPMENT_CHOICES.map((eq) => {
                    const isChecked = equipment.includes(eq.id);
                    return (
                      <div
                        key={eq.id}
                        onClick={() => handleToggleEquipment(eq.id)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white/10 border-[#8B5CF6] text-white'
                            : 'bg-[#121214] border-white/5 text-white/50 hover:text-white'
                        }`}
                      >
                        <span>{eq.label}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-white/20'
                          }`}
                        >
                          {isChecked && <Check size={10} className="text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {location === 'HOME_NO_EQUIPMENT' && (
              <div className="p-3 bg-[#121214] border border-white/5 rounded-xl text-[0.75rem] text-white/60 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                <span>
                  Guaranteed zero equipment: no weights, bars, bands, machines, or furniture will ever be prescribed.
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: PREFERENCES & LIMITATIONS (OPTIONAL) */}
        {step === 5 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Preferences & limitations
                </h2>
                <span className="font-space text-[0.65rem] text-white/40 uppercase">
                  Optional
                </span>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Tell us about any joint sensitivities or movements you prefer to avoid. You can skip any of these.
              </p>
            </div>

            {/* Physical limitations */}
            <div className="flex flex-col gap-1.5">
              <span className="font-space text-[0.68rem] text-white/60 uppercase tracking-wider">
                Relevant physical limitations
              </span>
              <div className="flex flex-col gap-1.5">
                {LIMITATION_OPTIONS.map((lim) => {
                  const isChecked = limitations.includes(lim.id);
                  return (
                    <div
                      key={lim.id}
                      onClick={() => handleToggleLimitation(lim.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]'
                          : 'bg-[#121214] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold text-white tracking-tight">
                          {lim.label}
                        </span>
                        <p className="text-[0.68rem] text-white/50 mt-0.5">{lim.desc}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'border-white/20'
                        }`}
                      >
                        {isChecked && <Check size={10} className="text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disliked exercises */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-space text-[0.68rem] text-white/60 uppercase tracking-wider">
                Exercises to exclude (optional)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_DISLIKED.map((name) => {
                  const isSelected = dislikedExercises.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleToggleDisliked(name)}
                      className={`px-2.5 py-1 rounded-lg border font-space text-[0.7rem] transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                          : 'bg-[#121214] border-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      {isSelected ? `✕ ${name}` : name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PREVIEW & ACCEPT */}
        {step === 6 && previewResult && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="font-space text-[0.65rem] text-[#8B5CF6] uppercase font-bold tracking-wider">
                Generated Protocol
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                {previewResult.program.name}
              </h2>
              <div className="flex items-center gap-2 font-space text-[0.68rem] text-white/50 mt-1">
                <span>{previewResult.program.daysPerWeek} training days</span>
                <span>·</span>
                <span>{previewResult.program.sessionDurationMinutes} min / session</span>
                <span>·</span>
                <span>{previewResult.program.defaultRestSeconds}s rest</span>
              </div>
            </div>

            {/* Schedule preview strip */}
            <div className="p-3 bg-[#121214] border border-white/5 rounded-xl flex flex-col gap-1.5">
              <span className="font-space text-[0.65rem] text-white/40 uppercase tracking-wider">
                Weekly Split
              </span>
              <div className="flex flex-col gap-1">
                {previewResult.program.schedule.map((day) => (
                  <div
                    key={day.dayOfWeek}
                    className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none"
                  >
                    <span className="font-space text-white/60 w-16">{day.dayName}</span>
                    <span
                      className={`truncate font-medium text-left flex-1 px-2 ${
                        day.isRestDay ? 'text-white/40 italic' : 'text-white'
                      }`}
                    >
                      {day.focusTitle}
                    </span>
                    <span className="font-space text-[0.68rem] text-white/40 shrink-0">
                      {day.isRestDay ? 'Recovery' : `${day.approximateMinutes} min`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* First Workout Preview */}
            {previewResult.workouts.length > 0 && (
              <div className="p-3 bg-[#121214] border border-white/5 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-space text-[0.65rem] text-[#8B5CF6] uppercase font-bold tracking-wider">
                    First Session: {previewResult.workouts[0].name}
                  </span>
                  <span className="font-space text-[0.65rem] text-white/40">
                    {previewResult.workouts[0].exercises.length} Exercises
                  </span>
                </div>

                <div className="flex flex-col divide-y divide-white/5">
                  {previewResult.workouts[0].exercises.map((ex, idx) => (
                    <div key={ex.id} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-space text-white/30 text-[0.68rem]">
                          0{idx + 1}
                        </span>
                        <span className="text-white font-medium">{ex.name}</span>
                      </div>
                      <span className="font-space text-[0.68rem] text-white/60">
                        {ex.sets.length} sets ×{' '}
                        {ex.sets[0]?.targetReps
                          ? `${ex.sets[0].targetReps} reps`
                          : ex.sets[0]?.targetDuration
                          ? `${ex.sets[0].targetDuration}s`
                          : 'reps'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation CTA */}
      <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
        {step < 5 && (
          <button
            type="button"
            onClick={() => setStep((prev) => prev + 1)}
            className="w-full h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white rounded-[14px] font-semibold text-xs font-space flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/20 transition-all cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight size={15} />
          </button>
        )}

        {step === 5 && (
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleBuildProgram}
              className="flex-1 h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white rounded-[14px] font-semibold text-xs font-space flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/20 transition-all cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Build My Program</span>
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAcceptProgram}
              className="w-full h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white rounded-[14px] font-semibold text-xs font-space flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/20 transition-all cursor-pointer"
            >
              <Check size={15} />
              <span>Accept & Start Training</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-center text-xs text-white/50 hover:text-white transition-colors cursor-pointer font-space"
            >
              Back to adjust preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
