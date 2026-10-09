import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, Plus, SkipForward, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { RestTimerEngine, RestTimerState } from '../../domain/timer/RestTimerEngine';
import { ExerciseUiModel } from './WorkoutSections';

interface BetweenExerciseRestOverlayProps {
  isOpen: boolean;
  completedExercise: ExerciseUiModel | null;
  nextExercise: ExerciseUiModel | null;
  durationSeconds: number;
  onFinishRest: () => void;
  onSkipRest: () => void;
}

export const BetweenExerciseRestOverlay: React.FC<BetweenExerciseRestOverlayProps> = ({
  isOpen,
  completedExercise,
  nextExercise,
  durationSeconds,
  onFinishRest,
  onSkipRest,
}) => {
  const [timerState, setTimerState] = useState<RestTimerState>(() =>
    RestTimerEngine.createTimer(durationSeconds)
  );
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeRef = useRef<number | null>(null);

  // Initialize or reset timer whenever overlay opens with a new duration
  useEffect(() => {
    if (isOpen) {
      setTimerState(RestTimerEngine.createTimer(durationSeconds));
      setIsPaused(false);
      pauseTimeRef.current = null;
    }
  }, [isOpen, durationSeconds]);

  // Lifecycle-safe, deadline-based timer tick
  useEffect(() => {
    if (!isOpen || isPaused || timerState.isComplete) return;

    const interval = setInterval(() => {
      setTimerState((prev) => {
        const next = RestTimerEngine.calculateRemaining(
          prev.deadlineEpochMillis,
          prev.totalSeconds,
          Date.now()
        );
        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, timerState.isComplete]);

  if (!isOpen) return null;

  const handleTogglePause = () => {
    if (!isPaused) {
      // Pausing
      pauseTimeRef.current = Date.now();
      setIsPaused(true);
    } else {
      // Resuming: extend deadline by the paused duration
      const pausedDuration = pauseTimeRef.current ? Date.now() - pauseTimeRef.current : 0;
      setTimerState((prev) => ({
        ...prev,
        deadlineEpochMillis: prev.deadlineEpochMillis + pausedDuration,
      }));
      pauseTimeRef.current = null;
      setIsPaused(false);
    }
  };

  const handleAdd30s = () => {
    setTimerState((prev) => {
      const updated = RestTimerEngine.addBonusSeconds(
        prev.deadlineEpochMillis,
        prev.totalSeconds,
        30
      );
      return {
        ...prev,
        deadlineEpochMillis: updated.deadlineEpochMillis,
        totalSeconds: updated.totalSeconds,
        remainingSeconds: prev.remainingSeconds + 30,
        isComplete: false,
      };
    });
  };

  const progressPercent = Math.min(100, Math.max(0, timerState.progressRatio * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 font-geist">
      <div className="w-full max-w-sm bg-[#121214] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl flex flex-col">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="font-space text-[0.65rem] tracking-[0.2em] uppercase font-bold text-[#8B5CF6]">
              INTER-EXERCISE RECOVERY
            </span>
          </div>

          <button
            onClick={onSkipRest}
            className="font-space text-[0.65rem] uppercase tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            Skip Rest
          </button>
        </div>

        {/* Completed Exercise Banner */}
        {completedExercise && (
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[14px] flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 size={16} className="text-[#8B5CF6] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-space text-white/40 uppercase">Exercise Complete</span>
                <span className="text-sm font-semibold text-white truncate">{completedExercise.name}</span>
              </div>
            </div>
            <span className="font-space text-[0.65rem] font-bold text-[#8B5CF6] bg-[#8B5CF6]/15 px-2 py-0.5 rounded-full border border-[#8B5CF6]/30 shrink-0">
              {completedExercise.sets.length}/{completedExercise.sets.length} SETS
            </span>
          </div>
        )}

        {/* Central Giant Countdown */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          <div className="font-space text-[3.25rem] font-[800] tracking-tight leading-none text-white font-mono">
            {RestTimerEngine.formatTime(timerState.remainingSeconds)}
          </div>

          <span className="font-space text-[0.65rem] uppercase tracking-[0.15em] text-white/50 mt-2">
            {timerState.isComplete
              ? 'Recovery period concluded'
              : isPaused
              ? 'Timer paused'
              : 'Recover breathing & reset posture'}
          </span>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-black rounded-full overflow-hidden mt-4 border border-white/5">
            <div
              className="h-full bg-[#8B5CF6] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer Modifier Actions */}
        {!timerState.isComplete && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={handleTogglePause}
              className="px-3.5 py-1.5 rounded-[10px] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-space text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleAdd30s}
              className="px-3.5 py-1.5 rounded-[10px] bg-white/5 hover:bg-white/10 text-[#8B5CF6] hover:text-white font-space text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={12} />
              <span>30s</span>
            </button>
          </div>
        )}

        {/* Upcoming Exercise Preview */}
        {nextExercise && (
          <div className="p-3.5 bg-[#18181B] border border-white/10 rounded-[16px] mb-5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-space text-[0.6rem] uppercase tracking-wider text-[#8B5CF6] font-bold">
                UPCOMING MOVEMENT
              </span>
              <span className="font-space text-[0.6rem] text-white/40">
                {nextExercise.sets.length} Prescribed Sets
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">{nextExercise.name}</h4>
            {nextExercise.instructions && (
              <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed">
                {nextExercise.instructions}
              </p>
            )}
            {nextExercise.alternative && (
              <div className="font-space text-[0.6rem] text-white/40 mt-1.5">
                Safe Alternative: <span className="text-white/60">{nextExercise.alternative}</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onSkipRest}
            className="flex-1 py-3.5 rounded-[12px] bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/60 hover:text-white cursor-pointer transition-colors"
          >
            Skip Rest
          </button>

          <button
            onClick={onFinishRest}
            className="flex-1 py-3.5 rounded-[12px] bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#8B5CF6]/25 transition-all"
          >
            <span>{timerState.isComplete ? 'Start Next Exercise' : "I'm Ready Now"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
