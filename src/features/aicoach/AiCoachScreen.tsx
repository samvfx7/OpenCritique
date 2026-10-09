import React, { useState } from 'react';
import { OCTopHeader } from '../../components/OCTopHeader';
import { ArrowUpRight, Sparkles, X, Activity, Flame, Shield, Check, Dumbbell } from 'lucide-react';
import { WorkoutUiModel } from '../workout/WorkoutSections';
import { WorkoutDifficulty } from '../../domain/model/types';

interface AiCoachScreenProps {
  onApplyNewProgram: (programName: string, workouts: WorkoutUiModel[]) => void;
  onNavigateToWorkout: () => void;
  workoutsCompletedCount?: number;
  totalXp?: number;
}

export const AiCoachScreen: React.FC<AiCoachScreenProps> = ({
  onApplyNewProgram,
  onNavigateToWorkout,
  workoutsCompletedCount = 0,
  totalXp = 0,
}) => {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [appliedProgram, setAppliedProgram] = useState<string | null>(null);

  const programs: {
    id: string;
    title: string;
    split: string;
    focus: string;
    xpEstimate: number;
    exercises: { name: string; sets: string }[];
  }[] = [
    {
      id: 'upper-hyper',
      title: 'Upper Body Hypertrophy',
      split: 'Push & Pull Compound',
      focus: 'Chest, lats, deltoids & arm density',
      xpEstimate: 280,
      exercises: [
        { name: 'Barbell Bench Press', sets: '4 sets × 8-10 reps' },
        { name: 'Neutral Grip Pull-Up', sets: '3 sets × 8-12 reps' },
        { name: 'Incline Dumbbell Press', sets: '3 sets × 10-12 reps' },
        { name: 'Cable Lateral Raise', sets: '4 sets × 12-15 reps' },
      ],
    },
    {
      id: 'lower-power',
      title: 'Lower Body Strength & Power',
      split: 'Squat & Posterior Chain',
      focus: 'Quadriceps, hamstrings & glute power',
      xpEstimate: 320,
      exercises: [
        { name: 'Back Squat (Tempo 3-1-1)', sets: '4 sets × 6 reps' },
        { name: 'Romanian Deadlift', sets: '3 sets × 8 reps' },
        { name: 'Bulgarian Split Squat', sets: '3 sets × 10 reps/side' },
        { name: 'Standing Calf Raise', sets: '4 sets × 15 reps' },
      ],
    },
    {
      id: 'full-athletic',
      title: 'Athletic Conditioning & Core',
      split: 'Full Body Density',
      focus: 'Work capacity, stamina & anti-rotation',
      xpEstimate: 260,
      exercises: [
        { name: 'Dumbbell Clean & Press', sets: '4 sets × 8 reps' },
        { name: 'Goblet Squat to Press', sets: '3 sets × 12 reps' },
        { name: 'Renegade Rows', sets: '3 sets × 10 reps/side' },
        { name: 'Hanging Knee Raises', sets: '3 sets × 15 reps' },
      ],
    },
  ];

  const handleApplyPreset = (prog: typeof programs[0]) => {
    const difficultyMap: Record<string, WorkoutDifficulty> = {
      'upper-hyper': 'UPPER_BODY',
      'lower-power': 'LEG_DAY',
      'full-athletic': 'FULL_BODY',
    };

    const formattedWorkout: WorkoutUiModel = {
      id: `workout-${Date.now()}`,
      name: prog.title,
      difficulty: difficultyMap[prog.id] || 'FULL_BODY',
      estimatedMinutes: 45,
      estimatedXp: prog.xpEstimate,
      exercises: prog.exercises.map((e, idx) => ({
        id: `ex-${Date.now()}-${idx}`,
        name: e.name,
        measurementType: 'WEIGHT_REPS',
        sets: [
          { id: `s1-${idx}`, setNumber: 1, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 60, isCompleted: false },
          { id: `s2-${idx}`, setNumber: 2, measurementType: 'WEIGHT_REPS', targetReps: 10, targetWeight: 60, isCompleted: false },
          { id: `s3-${idx}`, setNumber: 3, measurementType: 'WEIGHT_REPS', targetReps: 8, targetWeight: 65, isCompleted: false },
        ],
      })),
    };

    onApplyNewProgram(prog.title, [formattedWorkout]);
    setAppliedProgram(prog.id);
    setTimeout(() => {
      onNavigateToWorkout();
    }, 600);
  };

  const handleAnalyze = () => {
    setIsAnalysisOpen(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 900);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto px-5 pb-32 flex flex-col font-sans selection:bg-[#8B5CF6]/30">
      {/* Top Header */}
      <OCTopHeader />

      {/* Screen Title */}
      <div className="mb-5 mt-1">
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-1">
          BIOMETRIC & OVERLOAD ENGINE
        </div>
        <h1 className="text-[2.75rem] font-display font-extrabold tracking-[-0.04em] leading-[0.9] text-white">
          AI Coach<span className="text-[#8B5CF6]">.</span>
        </h1>
      </div>

      {/* Performance Intelligence Status Card */}
      <div className="bg-[#121214] border border-white/10 rounded-[24px] p-5 mb-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#8B5CF6] font-bold">
            TRAINING READINESS
          </div>
          <span className="font-mono text-[0.6rem] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
            OPTIMAL (94%)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black/60 rounded-[14px] p-3 border border-white/5 flex flex-col">
            <span className="font-mono text-[0.55rem] uppercase text-white/40">SESSIONS</span>
            <span className="font-mono text-xl font-bold text-white mt-1">{workoutsCompletedCount}</span>
          </div>

          <div className="bg-black/60 rounded-[14px] p-3 border border-white/5 flex flex-col">
            <span className="font-mono text-[0.55rem] uppercase text-white/40">TOTAL XP</span>
            <span className="font-mono text-xl font-bold text-white mt-1">{totalXp}</span>
          </div>

          <div className="bg-black/60 rounded-[14px] p-3 border border-white/5 flex flex-col">
            <span className="font-mono text-[0.55rem] uppercase text-white/40">BIAS</span>
            <span className="font-mono text-xl font-bold text-[#8B5CF6] mt-1">+2.5kg</span>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full mt-4 py-3 rounded-[14px] bg-[#18181B] hover:bg-[#202024] border border-white/10 hover:border-[#8B5CF6]/50 flex items-center justify-between px-4 cursor-pointer transition-all text-left"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles size={14} className="text-[#8B5CF6]" />
            <span className="text-xs font-semibold text-white">
              Run Biometric Overload Scan
            </span>
          </div>
          <ArrowUpRight size={14} className="text-white/40" />
        </button>
      </div>

      {/* Recommended Training Programs */}
      <div className="bg-[#121214] border border-white/10 rounded-[24px] p-5 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40 mb-0.5">
              CUSTOM PROTOCOLS
            </div>
            <h2 className="text-lg font-display font-bold text-white tracking-tight">
              Calibrated Programs
            </h2>
          </div>
          <span className="font-mono text-[0.65rem] text-white/40">
            3 AVAILABLE
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {programs.map((prog) => {
            const isApplied = appliedProgram === prog.id;
            return (
              <div
                key={prog.id}
                className="bg-black/60 border border-white/5 hover:border-white/15 rounded-[18px] p-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#8B5CF6] font-bold">
                      {prog.split}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 tracking-tight">
                      {prog.title}
                    </h3>
                    <p className="text-[11px] text-white/50 mt-1 leading-snug">
                      {prog.focus}
                    </p>
                  </div>

                  <span className="font-mono text-xs font-bold text-white/80 bg-white/5 px-2 py-1 rounded-[8px] border border-white/10 shrink-0">
                    +{prog.xpEstimate} XP
                  </span>
                </div>

                {/* Exercise Preview Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {prog.exercises.map((ex, i) => (
                    <span
                      key={i}
                      className="font-mono text-[9px] bg-white/[0.04] text-white/60 px-2 py-0.5 rounded-full border border-white/5"
                    >
                      {ex.name}
                    </span>
                  ))}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApplyPreset(prog)}
                  className={`w-full mt-3.5 py-2.5 rounded-[12px] font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    isApplied
                      ? 'bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20'
                      : 'bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white shadow-md shadow-[#8B5CF6]/20'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check size={14} strokeWidth={3} />
                      <span>PROGRAM ACTIVATED</span>
                    </>
                  ) : (
                    <>
                      <Dumbbell size={13} />
                      <span>APPLY PROGRAM TO SCHEDULE</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Modal */}
      {isAnalysisOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-[#121214] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 flex flex-col shadow-2xl font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#8B5CF6]" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  BIOMETRIC OVERLOAD SCAN
                </span>
              </div>
              <button
                onClick={() => setIsAnalysisOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {analyzing ? (
              <div className="py-10 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-[#8B5CF6] rounded-full animate-spin mb-3" />
                <span className="font-mono text-xs text-white/60">Calibrating volume waves & capacity...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2 bg-black/50 p-3 rounded-[16px] border border-white/10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[0.55rem] uppercase text-white/40">RECOVERY RATIO</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">92% PRIME</span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-3">
                    <span className="font-mono text-[0.55rem] uppercase text-white/40">SUGGESTED LOAD</span>
                    <span className="font-mono text-sm font-bold text-[#8B5CF6]">+2.5% INCREMENT</span>
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  Volume baseline recorded. Progressive overload calibration indicates your nervous system is fully adapted. Apply your next scheduled compound session to harvest maximum adaptation XP.
                </p>

                <button
                  onClick={() => {
                    setIsAnalysisOpen(false);
                    onNavigateToWorkout();
                  }}
                  className="w-full py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-[14px] font-mono font-bold text-xs cursor-pointer shadow-lg shadow-[#8B5CF6]/25 transition-all mt-1"
                >
                  START SCHEDULED SESSION
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
