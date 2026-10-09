import React, { useState } from 'react';
import { ExerciseUiModel, SetUiModel } from './WorkoutSections';
import { AvailableEquipment, PhysicalLimitation } from '../../domain/model/types';
import { EXERCISE_LIBRARY, ExerciseDefinition } from '../../domain/program/ExerciseLibrary';
import { X, Check, RefreshCw, Minus, Plus } from 'lucide-react';

interface EditExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseUiModel;
  allowedEquipment?: AvailableEquipment[];
  limitations?: PhysicalLimitation[];
  onSave: (updatedExercise: ExerciseUiModel) => void;
}

const REST_OPTIONS = [30, 45, 60, 75, 90, 120];

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  isOpen,
  onClose,
  exercise,
  allowedEquipment = ['NONE'],
  limitations = [],
  onSave,
}) => {
  const [selectedExerciseName, setSelectedExerciseName] = useState(exercise.name);
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
  const [setsCount, setSetsCount] = useState<number>(exercise.sets.length);
  const [targetReps, setTargetReps] = useState<number>(
    exercise.sets[0]?.targetReps || exercise.sets[0]?.targetDuration || 10
  );
  const [restSeconds, setRestSeconds] = useState<number>(exercise.restSeconds || 60);

  if (!isOpen) return null;

  // Filter available alternative exercises matching equipment and limitations
  const limSet = new Set(limitations);
  const alternativeChoices: ExerciseDefinition[] = EXERCISE_LIBRARY.filter((def) => {
    if (!allowedEquipment.includes(def.equipmentRequired)) return false;
    if (def.contraindications.some((c) => limSet.has(c))) return false;
    return true;
  });

  const handleSelectAlternative = (def: ExerciseDefinition) => {
    setSelectedDefId(def.id);
    setSelectedExerciseName(def.name);
  };

  const handleApplyChanges = () => {
    const chosenDef = selectedDefId
      ? EXERCISE_LIBRARY.find((d) => d.id === selectedDefId)
      : null;

    const measurementType = chosenDef
      ? chosenDef.measurementType
      : exercise.measurementType;

    // Reconstruct sets array with new count and targets
    const updatedSets: SetUiModel[] = Array.from({ length: setsCount }).map((_, idx) => {
      const existingSet = exercise.sets[idx];
      return {
        id: existingSet?.id || `edit-s-${Date.now()}-${idx + 1}`,
        setNumber: idx + 1,
        measurementType,
        targetReps: measurementType === 'REPS' || measurementType === 'WEIGHT_REPS' ? targetReps : null,
        targetWeight: existingSet?.targetWeight || (measurementType === 'WEIGHT_REPS' ? 16 : null),
        targetDuration: measurementType === 'DURATION' ? targetReps : null,
        targetDistance: measurementType === 'DISTANCE' ? 400 : null,
        actualReps: existingSet?.actualReps || null,
        actualWeight: existingSet?.actualWeight || null,
        actualDuration: existingSet?.actualDuration || null,
        actualDistance: existingSet?.actualDistance || null,
        isCompleted: existingSet ? existingSet.isCompleted : false,
      };
    });

    const updated: ExerciseUiModel = {
      ...exercise,
      name: selectedExerciseName,
      measurementType,
      restSeconds,
      sets: updatedSets,
      instructions: chosenDef ? chosenDef.instructions : exercise.instructions,
      alternative: chosenDef ? chosenDef.alternative : exercise.alternative,
      equipmentRequired: chosenDef ? chosenDef.equipmentRequired : exercise.equipmentRequired,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-[#121214] border border-white/10 rounded-t-[24px] sm:rounded-[24px] p-5 flex flex-col gap-4 font-geist text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <span className="font-space text-[0.62rem] uppercase tracking-[0.2em] text-[#8B5CF6] font-bold">
              Secondary Action
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Edit Exercise Prescription
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* 1. Replace Exercise */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-space text-[0.68rem] text-white/60 uppercase tracking-wider">
              Movement Selection
            </span>
            <span className="font-space text-[0.65rem] text-[#8B5CF6]">
              {selectedExerciseName}
            </span>
          </div>

          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
            {alternativeChoices.map((alt) => {
              const isSelected = selectedExerciseName === alt.name;
              return (
                <button
                  key={alt.id}
                  type="button"
                  onClick={() => handleSelectAlternative(alt)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white'
                      : 'bg-[#18181B] border-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="font-medium truncate pr-2">{alt.name}</span>
                  <span className="font-space text-[0.62rem] text-white/40 uppercase shrink-0">
                    {alt.equipmentRequired === 'NONE' ? 'Bodyweight' : alt.equipmentRequired.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Sets and Target Repetitions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Sets Adjuster */}
          <div className="p-3 bg-[#18181B] border border-white/5 rounded-xl flex flex-col gap-2">
            <span className="font-space text-[0.65rem] text-white/50 uppercase tracking-wider">
              Sets
            </span>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSetsCount((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <Minus size={13} />
              </button>
              <span className="font-space text-lg font-bold text-white">
                {setsCount}
              </span>
              <button
                type="button"
                onClick={() => setSetsCount((prev) => Math.min(8, prev + 1))}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Reps / Target Adjuster */}
          <div className="p-3 bg-[#18181B] border border-white/5 rounded-xl flex flex-col gap-2">
            <span className="font-space text-[0.65rem] text-white/50 uppercase tracking-wider">
              {exercise.measurementType === 'DURATION' ? 'Target Sec' : 'Target Reps'}
            </span>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTargetReps((prev) => Math.max(1, prev - (exercise.measurementType === 'DURATION' ? 5 : 1)))}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <Minus size={13} />
              </button>
              <span className="font-space text-lg font-bold text-white">
                {targetReps}
              </span>
              <button
                type="button"
                onClick={() => setTargetReps((prev) => Math.min(120, prev + (exercise.measurementType === 'DURATION' ? 5 : 1)))}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Rest Duration */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-space text-[0.65rem] text-white/50 uppercase tracking-wider">
            Inter-Set Rest Duration
          </span>
          <div className="grid grid-cols-6 gap-1">
            {REST_OPTIONS.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setRestSeconds(sec)}
                className={`py-2 rounded-lg border font-space text-[0.68rem] font-semibold transition-colors cursor-pointer ${
                  restSeconds === sec
                    ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                    : 'bg-[#18181B] border-white/5 text-white/50 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 h-11 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white text-xs font-space font-medium cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyChanges}
            className="flex-1 h-11 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white text-xs font-space font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer"
          >
            <Check size={14} />
            <span>Save Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
};
