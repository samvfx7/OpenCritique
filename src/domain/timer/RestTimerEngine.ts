/**
 * RestTimerEngine
 *
 * Lifecycle-aware, deterministic timer calculations based on absolute deadlines.
 * Avoids tying timer correctness to UI recomposition or cancelled coroutines.
 * Recovers accurately if the application temporarily leaves the foreground.
 */

export interface RestTimerState {
  totalSeconds: number;
  remainingSeconds: number;
  deadlineEpochMillis: number;
  isComplete: boolean;
  progressRatio: number; // 0 (just started) to 1.0 (finished)
}

export class RestTimerEngine {
  /**
   * Initializes a deadline-based timer state.
   */
  static createTimer(durationSeconds: number, nowEpochMillis: number = Date.now()): RestTimerState {
    const total = Math.max(1, Math.round(durationSeconds));
    const deadline = nowEpochMillis + total * 1000;
    return {
      totalSeconds: total,
      remainingSeconds: total,
      deadlineEpochMillis: deadline,
      isComplete: false,
      progressRatio: 0,
    };
  }

  /**
   * Calculates remaining time from the absolute deadline.
   * If the app was backgrounded for 20 seconds, this correctly reflects that time passed.
   */
  static calculateRemaining(
    deadlineEpochMillis: number,
    totalSeconds: number,
    nowEpochMillis: number = Date.now()
  ): RestTimerState {
    const remainingMillis = Math.max(0, deadlineEpochMillis - nowEpochMillis);
    const remainingSeconds = Math.max(0, Math.ceil(remainingMillis / 1000));
    const isComplete = remainingSeconds === 0;
    const elapsedSeconds = Math.max(0, totalSeconds - remainingSeconds);
    const progressRatio = totalSeconds > 0 ? Math.min(1.0, elapsedSeconds / totalSeconds) : 1.0;

    return {
      totalSeconds,
      remainingSeconds,
      deadlineEpochMillis,
      isComplete,
      progressRatio,
    };
  }

  /**
   * Formats remaining seconds to mm:ss display string.
   */
  static formatTime(remainingSeconds: number): string {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Adds bonus seconds to an ongoing deadline.
   */
  static addBonusSeconds(
    currentDeadlineEpochMillis: number,
    currentTotalSeconds: number,
    bonusSeconds: number
  ): { deadlineEpochMillis: number; totalSeconds: number } {
    return {
      deadlineEpochMillis: currentDeadlineEpochMillis + bonusSeconds * 1000,
      totalSeconds: currentTotalSeconds + bonusSeconds,
    };
  }
}
