import { WorkoutSet, MeasurementType } from '../model/types';

export type SetValidationIssueCode =
  | 'MissingRepetitions'
  | 'MissingWeight'
  | 'MissingDuration'
  | 'MissingDistance'
  | 'InvalidRepetitions'
  | 'InvalidWeight'
  | 'InvalidDuration'
  | 'InvalidDistance';

export interface SetValidationIssue {
  code: SetValidationIssueCode;
  message: string;
}

export const SET_VALIDATION_MESSAGES: Record<SetValidationIssueCode, string> = {
  MissingRepetitions: 'Repetitions are required.',
  MissingWeight: 'Weight is required.',
  MissingDuration: 'Duration is required.',
  MissingDistance: 'Distance is required.',
  InvalidRepetitions: 'Repetitions must be greater than zero.',
  InvalidWeight: 'Weight must be greater than zero.',
  InvalidDuration: 'Duration must be greater than zero.',
  InvalidDistance: 'Distance must be greater than zero.',
};

export interface SetValidationResult {
  isValid: boolean;
  issues: SetValidationIssue[];
}

export class SetValidator {
  validate(set: WorkoutSet): SetValidationResult {
    const issues: SetValidationIssue[] = [];

    switch (set.measurementType) {
      case 'REPS': {
        if (set.repetitions === undefined || set.repetitions === null) {
          issues.push({ code: 'MissingRepetitions', message: SET_VALIDATION_MESSAGES.MissingRepetitions });
        } else if (set.repetitions <= 0) {
          issues.push({ code: 'InvalidRepetitions', message: SET_VALIDATION_MESSAGES.InvalidRepetitions });
        }
        break;
      }

      case 'WEIGHT_REPS': {
        if (set.repetitions === undefined || set.repetitions === null) {
          issues.push({ code: 'MissingRepetitions', message: SET_VALIDATION_MESSAGES.MissingRepetitions });
        } else if (set.repetitions <= 0) {
          issues.push({ code: 'InvalidRepetitions', message: SET_VALIDATION_MESSAGES.InvalidRepetitions });
        }

        if (set.weightKg === undefined || set.weightKg === null) {
          issues.push({ code: 'MissingWeight', message: SET_VALIDATION_MESSAGES.MissingWeight });
        } else if (set.weightKg <= 0.0) {
          issues.push({ code: 'InvalidWeight', message: SET_VALIDATION_MESSAGES.InvalidWeight });
        }
        break;
      }

      case 'DURATION': {
        if (set.durationSeconds === undefined || set.durationSeconds === null) {
          issues.push({ code: 'MissingDuration', message: SET_VALIDATION_MESSAGES.MissingDuration });
        } else if (set.durationSeconds <= 0) {
          issues.push({ code: 'InvalidDuration', message: SET_VALIDATION_MESSAGES.InvalidDuration });
        }
        break;
      }

      case 'DISTANCE': {
        if (set.distanceMeters === undefined || set.distanceMeters === null) {
          issues.push({ code: 'MissingDistance', message: SET_VALIDATION_MESSAGES.MissingDistance });
        } else if (set.distanceMeters <= 0.0) {
          issues.push({ code: 'InvalidDistance', message: SET_VALIDATION_MESSAGES.InvalidDistance });
        }
        break;
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
