import React, { useState } from 'react';
import { OCTopHeader } from '../../components/OCTopHeader';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import { WorkoutUiModel } from '../workout/WorkoutSections';

interface AiCoachScreenProps {
  onApplyNewProgram: (programName: string, workouts: WorkoutUiModel[]) => void;
  onNavigateToWorkout: () => void;
  workoutsCompletedCount?: number;
  totalXp?: number;
}

export const AiCoachScreen: React.FC<AiCoachScreenProps> = ({
  onNavigateToWorkout,
  workoutsCompletedCount = 0,
  totalXp = 0,
}) => {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalysisOpen(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(
        'Baseline recorded. Your progressive overload curve is ready to calibrate. Complete your next scheduled training session to generate volume recommendations.'
      );
    }, 800);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist">
      {/* Top Header */}
      <OCTopHeader />

      {/* Screen Title */}
      <div className="mb-6 mt-2">
        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-2">
          Performance Intelligence
        </div>
        <h1 className="text-[2.5rem] font-[800] tracking-[-0.04em] leading-[0.95] text-white">
          AI Coach<span className="text-[#8B5CF6]">.</span>
        </h1>
      </div>

      {/* YOUR TRAINING Section */}
      <div className="bg-[#121214] border border-white/10 rounded-[24px] p-6 mb-6 shadow-xl">
        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-4">
          Your Training
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Workouts completed */}
          <div className="flex flex-col">
            <span className="text-3xl font-[700] font-space text-white tracking-tight">
              {workoutsCompletedCount}
            </span>
            <span className="font-space text-[0.6rem] text-white/50 leading-tight mt-1">
              workouts
            </span>
          </div>

          {/* XP earned locally */}
          <div className="flex flex-col border-x border-white/10 px-2 text-center">
            <span className="text-3xl font-[700] font-space text-white tracking-tight">
              {totalXp}
            </span>
            <span className="font-space text-[0.6rem] text-white/50 leading-tight mt-1">
              XP earned
            </span>
          </div>

          {/* Personal records */}
          <div className="flex flex-col text-right">
            <span className="text-3xl font-[700] font-space text-white tracking-tight">
              0
            </span>
            <span className="font-space text-[0.6rem] text-white/50 leading-tight mt-1">
              records
            </span>
          </div>
        </div>
      </div>

      {/* INSIGHTS Section */}
      <div className="bg-[#121214] border border-white/10 rounded-[24px] p-6 mb-6 shadow-xl">
        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-2">
          Insights
        </div>

        <h2 className="text-[1.25rem] font-[600] text-white tracking-tight leading-snug">
          Your first session is the starting point.
        </h2>

        <p className="text-xs text-white/60 mt-2.5 leading-relaxed">
          Complete comparable workouts to reveal progress. Insights use only training data recorded on this device.
        </p>
      </div>

      {/* ASK YOUR COACH Section */}
      <div className="w-full flex flex-col mb-4">
        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-2 px-1">
          Ask Your Coach
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full bg-[#121214] hover:bg-[#1A1A1E] border border-white/10 rounded-[20px] p-5 flex items-center justify-between cursor-pointer transition-all text-left shadow-lg"
        >
          <span className="text-sm font-semibold text-white">
            Analyze my recent training
          </span>
          <ArrowUpRight size={18} className="text-[#8B5CF6]" />
        </button>
      </div>

      {/* Analysis Modal / Drawer */}
      {isAnalysisOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121214] rounded-[24px] border border-white/10 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#8B5CF6]" />
                <span className="font-space text-xs font-bold text-white uppercase tracking-wider">
                  Analysis
                </span>
              </div>
              <button
                onClick={() => setIsAnalysisOpen(false)}
                className="text-white/60 hover:text-white p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {analyzing ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/10 border-t-[#8B5CF6] rounded-full animate-spin mb-3" />
                <span className="font-space text-xs text-white/50">Processing local biometric data...</span>
              </div>
            ) : (
              <div className="py-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 bg-black/40 p-3 rounded-[16px] border border-white/10">
                  <div className="flex flex-col">
                    <span className="font-space text-[0.6rem] uppercase text-white/50">Volume</span>
                    <span className="text-sm font-bold text-white">Optimal (88%)</span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-3">
                    <span className="font-space text-[0.6rem] uppercase text-white/50">Overload Bias</span>
                    <span className="text-sm font-bold text-[#8B5CF6]">+2.5 kg target</span>
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  {analysisResult}
                </p>

                <button
                  onClick={() => {
                    setIsAnalysisOpen(false);
                    onNavigateToWorkout();
                  }}
                  className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white rounded-[12px] font-semibold text-xs cursor-pointer shadow-lg shadow-[#8B5CF6]/20 transition-all"
                >
                  Go to Training Program
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
