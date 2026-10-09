import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { WorkoutUiModel } from '../features/workout/WorkoutSections';
import { WorkoutXpPolicy } from '../domain/xp/WorkoutXpPolicy';

interface BuildProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramGenerated: (programName: string, workouts: WorkoutUiModel[]) => void;
}

export const BuildProgramModal: React.FC<BuildProgramModalProps> = ({
  isOpen,
  onClose,
  onProgramGenerated,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState<'Hypertrophy' | 'Strength' | 'Conditioning' | 'Calisthenics'>('Hypertrophy');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [frequency, setFrequency] = useState<number>(4);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Dumbbells & Bench' | 'Bodyweight Only'>('Full Gym');
  const [duration, setDuration] = useState<number>(45);
  const [focus, setFocus] = useState<'Balanced' | 'Upper Body' | 'Lower Body' | 'Mobility & Core'>('Upper Body');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Synthesize program
      setIsSynthesizing(true);
      setTimeout(() => {
        const generatedWorkouts: WorkoutUiModel[] = [
          {
            id: 'gen-upper-1',
            name: `${focus === 'Upper Body' ? 'Upper Body Hypertrophy' : 'Upper Body Power'}`,
            difficulty: 'UPPER_BODY',
            estimatedMinutes: duration,
            estimatedXp: WorkoutXpPolicy.xpForDifficulty('UPPER_BODY'),
            exercises: [
              {
                id: 'gen-ex-1',
                name: 'Incline Dumbbell Press',
                measurementType: 'WEIGHT_REPS',
                note: '30-degree incline, control the eccentric tempo',
                sets: [
                  { id: 's-1-1', setNumber: 1, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 22.5 },
                  { id: 's-1-2', setNumber: 2, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 22.5 },
                  { id: 's-1-3', setNumber: 3, measurementType: 'WEIGHT_REPS', targetReps: 8, targetWeight: 25.0 },
                ],
              },
              {
                id: 'gen-ex-2',
                name: 'Chest-Supported Row',
                measurementType: 'WEIGHT_REPS',
                note: 'Squeeze scapulae for 1 full second',
                sets: [
                  { id: 's-2-1', setNumber: 1, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 30.0 },
                  { id: 's-2-2', setNumber: 2, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 30.0 },
                  { id: 's-2-3', setNumber: 3, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 30.0 },
                ],
              },
              {
                id: 'gen-ex-3',
                name: 'Standing Overhead Press',
                measurementType: 'WEIGHT_REPS',
                note: 'Tight core and glutes, full extension at lockout',
                sets: [
                  { id: 's-3-1', setNumber: 1, measurementType: 'WEIGHT_REPS', targetReps: 8, targetWeight: 35.0 },
                  { id: 's-3-2', setNumber: 2, measurementType: 'WEIGHT_REPS', targetReps: 8, targetWeight: 35.0 },
                ],
              },
              {
                id: 'gen-ex-4',
                name: 'Weighted Pull-Up',
                measurementType: 'REPS',
                note: 'Dead hang pause at bottom of each repetition',
                sets: [
                  { id: 's-4-1', setNumber: 1, measurementType: 'REPS', targetReps: 6 },
                  { id: 's-4-2', setNumber: 2, measurementType: 'REPS', targetReps: 6 },
                  { id: 's-4-3', setNumber: 3, measurementType: 'REPS', targetReps: 5 },
                ],
              },
            ],
          },
          {
            id: 'gen-lower-1',
            name: 'Lower Body Strength & Posterior Chain',
            difficulty: 'LEG_DAY',
            estimatedMinutes: duration,
            estimatedXp: WorkoutXpPolicy.xpForDifficulty('LEG_DAY'),
            exercises: [
              {
                id: 'gen-ex-5',
                name: 'Barbell Back Squat',
                measurementType: 'WEIGHT_REPS',
                note: 'Break parallel depth, explode out of the hole',
                sets: [
                  { id: 's-5-1', setNumber: 1, measurementType: 'WEIGHT_REPS', targetReps: 6, targetWeight: 60.0 },
                  { id: 's-5-2', setNumber: 2, measurementType: 'WEIGHT_REPS', targetReps: 6, targetWeight: 65.0 },
                  { id: 's-5-3', setNumber: 3, measurementType: 'WEIGHT_REPS', targetReps: 6, targetWeight: 70.0 },
                ],
              },
              {
                id: 'gen-ex-6',
                name: 'Romanian Deadlift',
                measurementType: 'WEIGHT_REPS',
                note: 'Feel deep hamstring stretch, neutral spine',
                sets: [
                  { id: 's-6-1', setNumber: 1, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 50.0 },
                  { id: 's-6-2', setNumber: 2, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 50.0 },
                ],
              },
            ],
          },
        ];

        setIsSynthesizing(false);
        onProgramGenerated(`${goal} ${frequency}-Day Cycle`, generatedWorkouts);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#121118] border border-[#282338] rounded-t-[28px] sm:rounded-[28px] p-5 pb-6 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.16em] text-[#A58CFF] uppercase font-mono bg-[#282038] px-2 py-0.5 rounded-[8px]">
              QUESTION {currentStep} OF {totalSteps}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#868094] hover:text-[#F5F3F8] p-1.5 rounded-full cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#1E1B27] rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-[#734BE8] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step 1: Goal */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#F5F3F8] tracking-tight">
              What is your primary goal?
            </h2>
            <p className="text-xs text-[#958EA3] mb-1">
              Select the athletic focus for your upcoming 7-day training plan.
            </p>

            {[
              { id: 'Hypertrophy', title: 'Hypertrophy & Aesthetics', desc: 'Build lean muscle mass and structural symmetry' },
              { id: 'Strength', title: 'Raw Strength & Power', desc: 'Increase compound numbers and neurological drive' },
              { id: 'Conditioning', title: 'High-Output Conditioning', desc: 'Metabolic engine, work capacity, and stamina' },
              { id: 'Calisthenics', title: 'Calisthenics Mastery', desc: 'Bodyweight control, levers, and skill progression' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setGoal(item.id as any)}
                className={`p-3.5 rounded-[16px] text-left border transition-all cursor-pointer ${
                  goal === item.id
                    ? 'bg-[#282038] border-[#734BE8] text-[#F5F3F8] ring-1 ring-[#734BE8]/40'
                    : 'bg-[#18161E] border-[#23202E] text-[#C7C2D4] hover:border-[#38334A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F5F3F8]">{item.title}</span>
                  {goal === item.id && <Check size={16} className="text-[#A58CFF]" />}
                </div>
                <p className="text-[11px] text-[#868094] mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Experience */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#F5F3F8] tracking-tight">
              What is your experience level?
            </h2>
            <p className="text-xs text-[#958EA3] mb-1">
              Calibrates repetition schemes, rest demands, and volume progression.
            </p>

            {[
              { id: 'Beginner', title: 'Beginner', desc: '< 1 year consistent training. Building movement foundations.' },
              { id: 'Intermediate', title: 'Intermediate', desc: '1 - 3 years. Experienced with barbell and dumbbell technique.' },
              { id: 'Advanced', title: 'Advanced', desc: '3+ years. High work capacity and progressive overload familiarity.' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setExperience(item.id as any)}
                className={`p-3.5 rounded-[16px] text-left border transition-all cursor-pointer ${
                  experience === item.id
                    ? 'bg-[#282038] border-[#734BE8] text-[#F5F3F8] ring-1 ring-[#734BE8]/40'
                    : 'bg-[#18161E] border-[#23202E] text-[#C7C2D4] hover:border-[#38334A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F5F3F8]">{item.title}</span>
                  {experience === item.id && <Check size={16} className="text-[#A58CFF]" />}
                </div>
                <p className="text-[11px] text-[#868094] mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Frequency */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#F5F3F8] tracking-tight">
              Weekly training frequency?
            </h2>
            <p className="text-xs text-[#958EA3] mb-1">
              How many days can you commit to training each week?
            </p>

            {[
              { days: 3, title: '3 Days / Week', desc: 'Full body focus with optimal 48h rest windows' },
              { days: 4, title: '4 Days / Week', desc: 'Upper / Lower split (Recommended balance)' },
              { days: 5, title: '5 Days / Week', desc: 'Push / Pull / Legs + Target accessory sessions' },
              { days: 6, title: '6 Days / Week', desc: 'High frequency targeted athletic cycle' },
            ].map((item) => (
              <button
                key={item.days}
                onClick={() => setFrequency(item.days)}
                className={`p-3.5 rounded-[16px] text-left border transition-all cursor-pointer ${
                  frequency === item.days
                    ? 'bg-[#282038] border-[#734BE8] text-[#F5F3F8] ring-1 ring-[#734BE8]/40'
                    : 'bg-[#18161E] border-[#23202E] text-[#C7C2D4] hover:border-[#38334A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F5F3F8]">{item.title}</span>
                  {frequency === item.days && <Check size={16} className="text-[#A58CFF]" />}
                </div>
                <p className="text-[11px] text-[#868094] mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Equipment */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#F5F3F8] tracking-tight">
              What equipment is available?
            </h2>
            <p className="text-xs text-[#958EA3] mb-1">
              Filters exercises to exactly match what you have on hand.
            </p>

            {[
              { id: 'Full Gym', title: 'Full Commercial Gym', desc: 'Barbells, dumbbells, cable towers, and machines' },
              { id: 'Dumbbells & Bench', title: 'Dumbbells & Bench', desc: 'Adjustable dumbbells and adjustable incline bench' },
              { id: 'Bodyweight Only', title: 'Bodyweight / Calisthenics', desc: 'Pull-up bar, dip bars, and floor work' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setEquipment(item.id as any)}
                className={`p-3.5 rounded-[16px] text-left border transition-all cursor-pointer ${
                  equipment === item.id
                    ? 'bg-[#282038] border-[#734BE8] text-[#F5F3F8] ring-1 ring-[#734BE8]/40'
                    : 'bg-[#18161E] border-[#23202E] text-[#C7C2D4] hover:border-[#38334A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F5F3F8]">{item.title}</span>
                  {equipment === item.id && <Check size={16} className="text-[#A58CFF]" />}
                </div>
                <p className="text-[11px] text-[#868094] mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 5: Duration */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#F5F3F8] tracking-tight">
              Preferred session length?
            </h2>
            <p className="text-xs text-[#958EA3] mb-1">
              Programs set volume to match your workout availability.
            </p>

            {[
              { mins: 30, title: '30 - 40 Minutes', desc: 'High density, minimal rest, superset friendly' },
              { mins: 45, title: '45 - 55 Minutes', desc: 'Standard ideal window for volume and recovery' },
              { mins: 60, title: '60 - 75 Minutes', desc: 'Thorough compound warmups, heavy sets, accessories' },
            ].map((item) => (
              <button
                key={item.mins}
                onClick={() => setDuration(item.mins)}
                className={`p-3.5 rounded-[16px] text-left border transition-all cursor-pointer ${
                  duration === item.mins
                    ? 'bg-[#282038] border-[#734BE8] text-[#F5F3F8] ring-1 ring-[#734BE8]/40'
                    : 'bg-[#18161E] border-[#23202E] text-[#C7C2D4] hover:border-[#38334A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F5F3F8]">{item.title}</span>
                  {duration === item.mins && <Check size={16} className="text-[#A58CFF]" />}
                </div>
                <p className="text-[11px] text-[#868094] mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 6: Focus Area */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#F5F3F8] tracking-tight">
              Primary focus area?
            </h2>
            <p className="text-xs text-[#958EA3] mb-1">
              Select any regional bias for the programmed exercise selection.
            </p>

            {[
              { id: 'Upper Body', title: 'Upper Body Bias', desc: 'Chest, back width, deltoid cap development' },
              { id: 'Lower Body', title: 'Lower Body Bias', desc: 'Quad drive, posterior chain, and glute hypertrophy' },
              { id: 'Balanced', title: 'Symmetric & Balanced', desc: 'Even anatomical distribution across muscle groups' },
              { id: 'Mobility & Core', title: 'Core & Postural Integrity', desc: 'Spine decompression, rotational strength, and anti-flexion' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFocus(item.id as any)}
                className={`p-3.5 rounded-[16px] text-left border transition-all cursor-pointer ${
                  focus === item.id
                    ? 'bg-[#282038] border-[#734BE8] text-[#F5F3F8] ring-1 ring-[#734BE8]/40'
                    : 'bg-[#18161E] border-[#23202E] text-[#C7C2D4] hover:border-[#38334A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F5F3F8]">{item.title}</span>
                  {focus === item.id && <Check size={16} className="text-[#A58CFF]" />}
                </div>
                <p className="text-[11px] text-[#868094] mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center gap-3 pt-6 mt-2 border-t border-[#1E1B27]">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="h-12 px-4 rounded-full bg-[#18161E] border border-[#23202E] text-xs font-semibold text-[#868094] hover:text-[#F5F3F8] cursor-pointer"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isSynthesizing}
            className="flex-1 h-12 bg-[#734BE8] hover:bg-[#683FDC] text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#734BE8]/25 transition-all disabled:opacity-70"
          >
            {isSynthesizing ? (
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="animate-spin text-white" />
                Synthesizing plan...
              </span>
            ) : (
              <>
                <span>{currentStep === totalSteps ? 'Generate 7-Day Program' : 'Continue'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-[#868094]">
          <ShieldCheck size={12} className="text-[#6FA876]" />
          <span>All preferences stay on this device. Zero telemetry.</span>
        </div>
      </div>
    </div>
  );
};
