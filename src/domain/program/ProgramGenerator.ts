import {
  AvailableEquipment,
  DayOfWeek,
  ExperienceLevel,
  PhysicalLimitation,
  ProgramScheduleDay,
  ProgramSetupInput,
  TrainingGoal,
  TrainingLocation,
  WeeklyProgram,
  WorkoutDifficulty,
} from '../model/types';
import { ExerciseUiModel, SetUiModel, WorkoutUiModel } from '../../features/workout/WorkoutSections';
import { EXERCISE_LIBRARY, ExerciseDefinition } from './ExerciseLibrary';
import { WorkoutXpPolicy } from '../xp/WorkoutXpPolicy';

const DAY_ORDER: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const DAY_NAMES: Record<DayOfWeek, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

export class ProgramGenerator {
  /**
   * Generates a deterministic 7-day WeeklyProgram and its associated WorkoutUiModel list.
   */
  static generateProgram(input: ProgramSetupInput): {
    program: WeeklyProgram;
    workouts: WorkoutUiModel[];
  } {
    // 1. Determine allowed equipment based on location and explicit selection
    const allowedEquipment = this.resolveAllowedEquipment(input.location, input.equipment);

    // 2. Filter exercise pool based on equipment and physical limitations
    const eligibleExercises = this.filterExercises(
      allowedEquipment,
      input.limitations,
      input.goal,
      input.experience,
      input.dislikedExercises || []
    );

    // 3. Determine how many exercises per workout based on session duration
    const exerciseCount = this.calculateExerciseCount(input.sessionDurationMinutes);

    // 4. Determine sets per exercise based on experience
    const setsCount = this.calculateSetsCount(input.experience);

    // 5. Build workout splits based on frequency & goal
    const trainingDaysCount = Math.min(6, Math.max(2, input.selectedDays.length || input.daysPerWeek));
    const sessionSplits = this.determineSessionSplits(input.goal, trainingDaysCount, input.location);

    // 6. Generate the unique workouts for the training days
    const generatedWorkouts: WorkoutUiModel[] = [];
    const workoutByDayKey: Record<DayOfWeek, WorkoutUiModel> = {} as Record<DayOfWeek, WorkoutUiModel>;

    // Sort user's selected days in chronological week order
    const sortedSelectedDays = [...input.selectedDays].sort(
      (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
    );

    // If user provided no selected days, fallback to a sensible default (e.g. Mon, Wed, Fri)
    const effectiveDays: DayOfWeek[] =
      sortedSelectedDays.length > 0
        ? sortedSelectedDays
        : (['MONDAY', 'WEDNESDAY', 'FRIDAY'] as DayOfWeek[]).slice(0, trainingDaysCount);

    effectiveDays.forEach((day, index) => {
      const split = sessionSplits[index % sessionSplits.length];
      const workout = this.buildWorkoutForSplit(
        split,
        index + 1,
        eligibleExercises,
        exerciseCount,
        setsCount,
        input
      );
      generatedWorkouts.push(workout);
      workoutByDayKey[day] = workout;
    });

    // 7. Construct complete 7-day schedule
    const schedule: ProgramScheduleDay[] = DAY_ORDER.map((day) => {
      const isSelected = effectiveDays.includes(day);
      const workout = workoutByDayKey[day];

      if (isSelected && workout) {
        return {
          dayOfWeek: day,
          dayName: DAY_NAMES[day],
          isRestDay: false,
          focusTitle: workout.name,
          workoutId: workout.id,
          approximateMinutes: workout.estimatedMinutes,
        };
      }

      return {
        dayOfWeek: day,
        dayName: DAY_NAMES[day],
        isRestDay: true,
        focusTitle: 'Active Recovery & Mobility',
        workoutId: null,
        approximateMinutes: 0,
      };
    });

    const programTitle = this.buildProgramTitle(input.goal, input.location, input.experience);

    const program: WeeklyProgram = {
      id: `prog-${Date.now()}`,
      name: programTitle,
      goal: input.goal,
      experience: input.experience,
      location: input.location,
      equipment: allowedEquipment,
      sessionDurationMinutes: input.sessionDurationMinutes,
      daysPerWeek: effectiveDays.length,
      selectedDays: effectiveDays,
      limitations: input.limitations,
      defaultRestSeconds: input.defaultRestSeconds || 60,
      schedule,
      createdAtEpochMillis: Date.now(),
      updatedAtEpochMillis: Date.now(),
      isActive: true,
    };

    return { program, workouts: generatedWorkouts };
  }

  /**
   * Resolves equipment strictly according to location and user selections.
   * GUARANTEE: For 'HOME_NO_EQUIPMENT', returns ONLY ['NONE'].
   */
  static resolveAllowedEquipment(
    location: TrainingLocation,
    userSelectedEquipment: AvailableEquipment[]
  ): AvailableEquipment[] {
    if (location === 'HOME_NO_EQUIPMENT') {
      return ['NONE'];
    }

    if (location === 'GYM') {
      return ['NONE', 'DUMBBELLS', 'BARBELL', 'CABLES', 'BENCH', 'PULL_UP_BAR', 'KETTLEBELL'];
    }

    // HOME_WITH_EQUIPMENT
    const set = new Set<AvailableEquipment>(['NONE', ...userSelectedEquipment]);
    return Array.from(set);
  }

  /**
   * Filters library down to exercises matching equipment and free of contraindications.
   */
  static filterExercises(
    allowedEquipment: AvailableEquipment[],
    limitations: PhysicalLimitation[],
    goal: TrainingGoal,
    experience: ExperienceLevel,
    dislikedExercises: string[] = []
  ): ExerciseDefinition[] {
    const limSet = new Set(limitations);
    const dislikedLower = dislikedExercises.map((d) => d.trim().toLowerCase()).filter(Boolean);

    return EXERCISE_LIBRARY.filter((ex) => {
      // Must match equipment availability
      if (!allowedEquipment.includes(ex.equipmentRequired)) {
        return false;
      }

      // Must not violate physical limitations
      const hasContraindication = ex.contraindications.some((c) => limSet.has(c));
      if (hasContraindication) {
        return false;
      }

      // Must not match disliked movements
      if (dislikedLower.length > 0) {
        const isDisliked = dislikedLower.some(
          (dis) => ex.name.toLowerCase().includes(dis) || ex.id.toLowerCase().includes(dis)
        );
        if (isDisliked) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Computes exercise count based on target session duration.
   */
  static calculateExerciseCount(durationMinutes: number): number {
    if (durationMinutes <= 20) return 3;
    if (durationMinutes <= 30) return 4;
    if (durationMinutes <= 45) return 5;
    return 6;
  }

  /**
   * Computes sets per exercise based on experience level.
   */
  static calculateSetsCount(experience: ExperienceLevel): number {
    switch (experience) {
      case 'BEGINNER':
        return 3;
      case 'INTERMEDIATE':
        return 3;
      case 'ADVANCED':
        return 4;
    }
  }

  /**
   * Determines workout split sequence based on goal and frequency.
   */
  private static determineSessionSplits(
    goal: TrainingGoal,
    frequency: number,
    location: TrainingLocation
  ): { name: string; difficulty: WorkoutDifficulty; targetMuscleGroups: string[] }[] {
    if (frequency === 2) {
      return [
        { name: 'Full Body Foundational', difficulty: 'FULL_BODY', targetMuscleGroups: ['LEGS', 'CHEST', 'BACK', 'CORE'] },
        { name: 'Full Body Conditioning', difficulty: 'FULL_BODY', targetMuscleGroups: ['LEGS', 'SHOULDERS', 'CORE', 'CARDIO'] },
      ];
    }

    if (frequency === 3) {
      if (goal === 'CALISTHENICS') {
        return [
          { name: 'Push & Core Mechanics', difficulty: 'CALISTHENICS', targetMuscleGroups: ['CHEST', 'SHOULDERS', 'CORE'] },
          { name: 'Pull & Posterior Flow', difficulty: 'CALISTHENICS', targetMuscleGroups: ['BACK', 'LEGS', 'CORE'] },
          { name: 'Full Body Skill & Balance', difficulty: 'CALISTHENICS', targetMuscleGroups: ['LEGS', 'FULL_BODY', 'CORE'] },
        ];
      }
      return [
        { name: 'Upper Body Power', difficulty: 'UPPER_BODY', targetMuscleGroups: ['CHEST', 'BACK', 'SHOULDERS'] },
        { name: 'Lower Body Strength', difficulty: 'LEG_DAY', targetMuscleGroups: ['LEGS', 'CORE'] },
        { name: 'Full Body Conditioning', difficulty: 'FULL_BODY', targetMuscleGroups: ['LEGS', 'CHEST', 'CORE', 'CARDIO'] },
      ];
    }

    if (frequency === 4) {
      return [
        { name: 'Upper Body Strength', difficulty: 'UPPER_BODY', targetMuscleGroups: ['CHEST', 'BACK', 'SHOULDERS'] },
        { name: 'Lower Body Hypertrophy', difficulty: 'LEG_DAY', targetMuscleGroups: ['LEGS', 'CORE'] },
        { name: 'Upper Body Volume', difficulty: 'UPPER_BODY', targetMuscleGroups: ['CHEST', 'BACK', 'CORE'] },
        { name: 'Lower Body & Core', difficulty: 'LEG_DAY', targetMuscleGroups: ['LEGS', 'CORE'] },
      ];
    }

    // 5 or 6 days
    return [
      { name: 'Push Focus', difficulty: 'UPPER_BODY', targetMuscleGroups: ['CHEST', 'SHOULDERS', 'CORE'] },
      { name: 'Pull & Posterior', difficulty: 'UPPER_BODY', targetMuscleGroups: ['BACK', 'CORE'] },
      { name: 'Lower Body Quad & Glute', difficulty: 'LEG_DAY', targetMuscleGroups: ['LEGS'] },
      { name: 'Full Body Skill', difficulty: 'FULL_BODY', targetMuscleGroups: ['FULL_BODY', 'CORE'] },
      { name: 'Lower Body & Conditioning', difficulty: 'CONDITIONING', targetMuscleGroups: ['LEGS', 'CARDIO'] },
      { name: 'Core & Mobility Restoration', difficulty: 'FULL_BODY', targetMuscleGroups: ['CORE', 'FULL_BODY'] },
    ];
  }

  /**
   * Builds an individual WorkoutUiModel with realistic sets, target values, and rest times.
   */
  private static buildWorkoutForSplit(
    split: { name: string; difficulty: WorkoutDifficulty; targetMuscleGroups: string[] },
    sessionIndex: number,
    pool: ExerciseDefinition[],
    exerciseCount: number,
    setsCount: number,
    input: ProgramSetupInput
  ): WorkoutUiModel {
    const selectedDefs: ExerciseDefinition[] = [];
    const usedIds = new Set<string>();

    // Prioritize exercises matching target muscle groups
    for (const group of split.targetMuscleGroups) {
      if (selectedDefs.length >= exerciseCount) break;
      const match = pool.find((ex) => ex.muscleGroup === group && !usedIds.has(ex.id));
      if (match) {
        selectedDefs.push(match);
        usedIds.add(match.id);
      }
    }

    // Fill remaining slots from the eligible pool
    for (const ex of pool) {
      if (selectedDefs.length >= exerciseCount) break;
      if (!usedIds.has(ex.id)) {
        selectedDefs.push(ex);
        usedIds.add(ex.id);
      }
    }

    // Goal-specific rest period
    const goalRestSeconds = this.determineGoalRest(input.goal, input.defaultRestSeconds);

    const exercises: ExerciseUiModel[] = selectedDefs.map((def, idx) => {
      const restSeconds =
        input.defaultRestSeconds && input.defaultRestSeconds > 0
          ? input.defaultRestSeconds
          : input.goal === 'STRENGTH'
          ? Math.max(75, def.defaultRestSeconds || 75)
          : input.goal === 'ENDURANCE'
          ? Math.min(45, def.defaultRestSeconds || 45)
          : goalRestSeconds || def.defaultRestSeconds || 60;
      const targetReps = this.getTargetRepsForGoal(def, input.goal);

      const sets: SetUiModel[] = Array.from({ length: setsCount }).map((_, sIdx) => ({
        id: `s-${sessionIndex}-${idx + 1}-${sIdx + 1}`,
        setNumber: sIdx + 1,
        measurementType: def.measurementType,
        targetReps: def.measurementType === 'REPS' || def.measurementType === 'WEIGHT_REPS' ? targetReps : null,
        targetWeight: def.measurementType === 'WEIGHT_REPS' ? (input.experience === 'BEGINNER' ? 12 : 20) : null,
        targetDuration: def.measurementType === 'DURATION' ? targetReps : null,
        targetDistance: def.measurementType === 'DISTANCE' ? 400 : null,
        isCompleted: false,
      }));

      return {
        id: `ex-ui-${sessionIndex}-${idx + 1}`,
        name: def.name,
        measurementType: def.measurementType,
        sets,
        note: `Goal focus: ${this.getGoalCue(input.goal)}`,
        instructions: def.instructions,
        alternative: def.alternative,
        restSeconds,
        equipmentRequired: def.equipmentRequired,
        muscleGroup: def.muscleGroup,
      };
    });

    const estimatedXp = WorkoutXpPolicy.xpForDifficulty(split.difficulty);

    return {
      id: `gen-w-${sessionIndex}-${Date.now()}`,
      name: split.name,
      difficulty: split.difficulty,
      estimatedMinutes: input.sessionDurationMinutes,
      estimatedXp,
      exercises,
    };
  }

  private static determineGoalRest(goal: TrainingGoal, defaultRestSeconds: number): number {
    if (defaultRestSeconds && defaultRestSeconds > 0) return defaultRestSeconds;
    switch (goal) {
      case 'STRENGTH':
        return 90;
      case 'MUSCLE_GROWTH':
        return 75;
      case 'GENERAL_FITNESS':
        return 60;
      case 'ENDURANCE':
        return 45;
      case 'CALISTHENICS':
        return 60;
      case 'SPORT_PERFORMANCE':
        return 60;
    }
  }

  private static getTargetRepsForGoal(def: ExerciseDefinition, goal: TrainingGoal): number {
    switch (goal) {
      case 'STRENGTH':
        return def.defaultReps.strength;
      case 'MUSCLE_GROWTH':
        return def.defaultReps.hypertrophy;
      case 'GENERAL_FITNESS':
        return def.defaultReps.fitness;
      case 'ENDURANCE':
        return def.defaultReps.endurance;
      case 'CALISTHENICS':
        return def.defaultReps.calisthenics;
      case 'SPORT_PERFORMANCE':
        return def.defaultReps.sport;
    }
  }

  private static getGoalCue(goal: TrainingGoal): string {
    switch (goal) {
      case 'STRENGTH':
        return 'Controlled tempo, focus on maximal mechanical tension.';
      case 'MUSCLE_GROWTH':
        return 'Control the eccentric descent, feel the target muscle squeeze.';
      case 'GENERAL_FITNESS':
        return 'Smooth cadence and steady breathing throughout.';
      case 'ENDURANCE':
        return 'Maintain rhythm and minimize transitions between sets.';
      case 'CALISTHENICS':
        return 'Focus on pure joint stability and rigid full-body tension.';
      case 'SPORT_PERFORMANCE':
        return 'Explosive intent on concentric contraction.';
    }
  }

  private static buildProgramTitle(
    goal: TrainingGoal,
    location: TrainingLocation,
    experience: ExperienceLevel
  ): string {
    const goalMap: Record<TrainingGoal, string> = {
      STRENGTH: 'Strength Protocol',
      MUSCLE_GROWTH: 'Hypertrophy Track',
      GENERAL_FITNESS: 'Full-Body Conditioning',
      ENDURANCE: 'Endurance & Stamina',
      CALISTHENICS: 'Bodyweight Mastery',
      SPORT_PERFORMANCE: 'Athletic Performance',
    };

    const locMap: Record<TrainingLocation, string> = {
      HOME_NO_EQUIPMENT: 'Bodyweight',
      HOME_WITH_EQUIPMENT: 'Home Gym',
      GYM: 'Iron Club',
    };

    return `${locMap[location]} ${goalMap[goal]}`;
  }
}
