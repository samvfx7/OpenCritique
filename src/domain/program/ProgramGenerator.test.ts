import { describe, it, expect } from 'vitest';
import { ProgramGenerator } from './ProgramGenerator';
import { ProgramSetupInput } from '../model/types';
import { SetValidator } from '../validation/SetValidator';
import { RestTimerEngine } from '../timer/RestTimerEngine';
import { LocalStorageService } from '../storage/localStorageService';

describe('ProgramGenerator & Domain Rules', () => {
  it('strictly guarantees 100% bodyweight exercises for Home — No Equipment', () => {
    const input: ProgramSetupInput = {
      goal: 'STRENGTH',
      experience: 'BEGINNER',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 3,
      selectedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      sessionDurationMinutes: 45,
      limitations: [],
      defaultRestSeconds: 60,
    };

    const { program, workouts } = ProgramGenerator.generateProgram(input);

    expect(program.equipment).toEqual(['NONE']);

    for (const workout of workouts) {
      for (const ex of workout.exercises) {
        expect(ex.equipmentRequired).toBe('NONE');
        // Must never include pull-up bar, dumbbells, barbell
        expect(ex.name.toLowerCase()).not.toContain('dumbbell');
        expect(ex.name.toLowerCase()).not.toContain('barbell');
        expect(ex.name.toLowerCase()).not.toContain('pull-up');
        expect(ex.name.toLowerCase()).not.toContain('cable');
      }
    }
  });

  it('generates a complete 7-day schedule with distinct training and recovery days', () => {
    const input: ProgramSetupInput = {
      goal: 'MUSCLE_GROWTH',
      experience: 'INTERMEDIATE',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 4,
      selectedDays: ['MONDAY', 'TUESDAY', 'THURSDAY', 'FRIDAY'],
      sessionDurationMinutes: 30,
      limitations: [],
      defaultRestSeconds: 75,
    };

    const { program, workouts } = ProgramGenerator.generateProgram(input);

    // Schedule must have all 7 days of the week
    expect(program.schedule.length).toBe(7);

    const trainingDays = program.schedule.filter((d) => !d.isRestDay);
    const recoveryDays = program.schedule.filter((d) => d.isRestDay);

    expect(trainingDays.length).toBe(4);
    expect(recoveryDays.length).toBe(3);

    // Training days must match selected days
    const trainingDayNames = trainingDays.map((d) => d.dayOfWeek);
    expect(trainingDayNames).toEqual(['MONDAY', 'TUESDAY', 'THURSDAY', 'FRIDAY']);

    // Recovery days should have Rest Focus
    for (const rec of recoveryDays) {
      expect(rec.workoutId).toBeNull();
      expect(rec.approximateMinutes).toBe(0);
    }
  });

  it('applies physical limitations and substitutes unsafe exercises', () => {
    const inputWithKneePain: ProgramSetupInput = {
      goal: 'GENERAL_FITNESS',
      experience: 'BEGINNER',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 3,
      selectedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      sessionDurationMinutes: 45,
      limitations: ['KNEE_PAIN'],
      defaultRestSeconds: 60,
    };

    const { workouts } = ProgramGenerator.generateProgram(inputWithKneePain);

    for (const workout of workouts) {
      for (const ex of workout.exercises) {
        // Bodyweight squats and reverse lunges must not be prescribed for knee pain
        expect(ex.name).not.toBe('Bodyweight Squat');
        expect(ex.name).not.toBe('Reverse Lunge');
      }
    }
  });

  it('scales exercise count to match session duration constraints', () => {
    const input20Min: ProgramSetupInput = {
      goal: 'ENDURANCE',
      experience: 'BEGINNER',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 3,
      selectedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      sessionDurationMinutes: 20,
      limitations: [],
      defaultRestSeconds: 45,
    };

    const { workouts: w20 } = ProgramGenerator.generateProgram(input20Min);
    expect(w20[0].exercises.length).toBe(3);

    const input45Min: ProgramSetupInput = {
      ...input20Min,
      sessionDurationMinutes: 45,
    };
    const { workouts: w45 } = ProgramGenerator.generateProgram(input45Min);
    expect(w45[0].exercises.length).toBe(5);
  });

  it('applies goal-specific programming rules for strength vs endurance', () => {
    const strengthInput: ProgramSetupInput = {
      goal: 'STRENGTH',
      experience: 'BEGINNER',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 3,
      selectedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      sessionDurationMinutes: 45,
      limitations: [],
      defaultRestSeconds: 90,
    };

    const { workouts: strengthWorkouts } = ProgramGenerator.generateProgram(strengthInput);
    const squatEx = strengthWorkouts[0].exercises.find((e) => e.name === 'Bodyweight Squat');
    if (squatEx) {
      // Strength targets controlled low/medium reps (6 reps) with longer rest (60-90s)
      expect(squatEx.sets[0].targetReps).toBeLessThanOrEqual(8);
    }

    const enduranceInput: ProgramSetupInput = {
      ...strengthInput,
      goal: 'ENDURANCE',
      defaultRestSeconds: 45,
    };
    const { workouts: enduranceWorkouts } = ProgramGenerator.generateProgram(enduranceInput);
    const endurSquatEx = enduranceWorkouts[0].exercises.find((e) => e.name === 'Bodyweight Squat');
    if (endurSquatEx) {
      // Endurance targets high reps (20 reps)
      expect(endurSquatEx.sets[0].targetReps).toBeGreaterThanOrEqual(15);
    }
  });
});

describe('SetValidator', () => {
  const validator = new SetValidator();

  it('validates REPS measurements correctly', () => {
    expect(validator.validate({ id: '1', index: 1, measurementType: 'REPS', repetitions: 10 }).isValid).toBe(true);
    expect(validator.validate({ id: '2', index: 1, measurementType: 'REPS', repetitions: 0 }).isValid).toBe(false);
    expect(validator.validate({ id: '3', index: 1, measurementType: 'REPS', repetitions: null }).isValid).toBe(false);
  });

  it('validates WEIGHT_REPS measurements correctly', () => {
    expect(validator.validate({ id: '1', index: 1, measurementType: 'WEIGHT_REPS', repetitions: 8, weightKg: 20 }).isValid).toBe(true);
    expect(validator.validate({ id: '2', index: 1, measurementType: 'WEIGHT_REPS', repetitions: 8, weightKg: 0 }).isValid).toBe(false);
    expect(validator.validate({ id: '3', index: 1, measurementType: 'WEIGHT_REPS', repetitions: 0, weightKg: 20 }).isValid).toBe(false);
  });
});

describe('RestTimerEngine', () => {
  it('accurately calculates remaining seconds and handles simulated backgrounding', () => {
    const startTime = 1000000;
    const timer = RestTimerEngine.createTimer(60, startTime);

    expect(timer.totalSeconds).toBe(60);
    expect(timer.remainingSeconds).toBe(60);
    expect(timer.deadlineEpochMillis).toBe(startTime + 60000);

    // App backgrounded for 25 seconds
    const timeAfter25s = startTime + 25000;
    const state25s = RestTimerEngine.calculateRemaining(timer.deadlineEpochMillis, timer.totalSeconds, timeAfter25s);

    expect(state25s.remainingSeconds).toBe(35);
    expect(state25s.isComplete).toBe(false);

    // App backgrounded past deadline (70 seconds elapsed)
    const timeAfter70s = startTime + 70000;
    const stateFinished = RestTimerEngine.calculateRemaining(timer.deadlineEpochMillis, timer.totalSeconds, timeAfter70s);

    expect(stateFinished.remainingSeconds).toBe(0);
    expect(stateFinished.isComplete).toBe(true);
    expect(stateFinished.progressRatio).toBe(1.0);
  });

  it('formats time to mm:ss correctly', () => {
    expect(RestTimerEngine.formatTime(60)).toBe('01:00');
    expect(RestTimerEngine.formatTime(90)).toBe('01:30');
    expect(RestTimerEngine.formatTime(5)).toBe('00:05');
  });
});

describe('LocalStorageService Idempotent Session Recording and Onboarding State', () => {
  it('prevents recording duplicate XP for the same workout session ID', () => {
    const workoutId = `test-workout-${Date.now()}`;
    const firstRecord = LocalStorageService.recordCompletedSession(workoutId);
    expect(firstRecord).toBe(true);

    // Second completion of same session ID must return false (idempotent)
    const secondRecord = LocalStorageService.recordCompletedSession(workoutId);
    expect(secondRecord).toBe(false);
  });

  it('persists onboarding completion status and user preferences correctly', () => {
    LocalStorageService.setOnboardingCompleted(false);
    expect(LocalStorageService.isOnboardingCompleted()).toBe(false);

    LocalStorageService.setOnboardingCompleted(true);
    expect(LocalStorageService.isOnboardingCompleted()).toBe(true);

    const prefs = {
      primaryGoal: 'STRENGTH' as const,
      experience: 'INTERMEDIATE' as const,
      daysPerWeek: 4,
      selectedDays: ['MONDAY', 'TUESDAY', 'THURSDAY', 'FRIDAY'] as any,
      sessionDurationMinutes: 45,
      location: 'HOME_NO_EQUIPMENT' as const,
      equipment: ['NONE'] as any,
      limitations: [],
    };
    LocalStorageService.saveUserPreferences(prefs);
    const loaded = LocalStorageService.getUserPreferences();
    expect(loaded?.primaryGoal).toBe('STRENGTH');
    expect(loaded?.daysPerWeek).toBe(4);

    LocalStorageService.resetAll();
    expect(LocalStorageService.isOnboardingCompleted()).toBe(false);
    expect(LocalStorageService.getUserPreferences()).toBeNull();
  });
});

describe('ProgramGenerator Disliked Exercises & Goal Behaviors', () => {
  it('excludes disliked exercises from generated workouts', () => {
    const input: ProgramSetupInput = {
      goal: 'MUSCLE_GROWTH',
      experience: 'BEGINNER',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 3,
      selectedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      sessionDurationMinutes: 45,
      limitations: [],
      defaultRestSeconds: 60,
      dislikedExercises: ['Push-Up', 'Wall Sit'],
    };

    const { workouts } = ProgramGenerator.generateProgram(input);
    for (const w of workouts) {
      for (const ex of w.exercises) {
        expect(ex.name.toLowerCase()).not.toContain('push-up');
        expect(ex.name.toLowerCase()).not.toContain('wall sit');
      }
    }
  });

  it('prescribes distinct rest periods according to training goal', () => {
    const strengthInput: ProgramSetupInput = {
      goal: 'STRENGTH',
      experience: 'BEGINNER',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 3,
      selectedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      sessionDurationMinutes: 30,
      limitations: [],
      defaultRestSeconds: 0,
    };
    const { workouts: strengthWorkouts } = ProgramGenerator.generateProgram(strengthInput);

    const enduranceInput: ProgramSetupInput = {
      goal: 'ENDURANCE',
      experience: 'BEGINNER',
      location: 'HOME_NO_EQUIPMENT',
      equipment: [],
      daysPerWeek: 3,
      selectedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      sessionDurationMinutes: 30,
      limitations: [],
      defaultRestSeconds: 0,
    };
    const { workouts: enduranceWorkouts } = ProgramGenerator.generateProgram(enduranceInput);

    expect(strengthWorkouts[0].exercises[0].restSeconds).toBeGreaterThanOrEqual(75);
    expect(enduranceWorkouts[0].exercises[0].restSeconds).toBeLessThanOrEqual(60);
  });
});
