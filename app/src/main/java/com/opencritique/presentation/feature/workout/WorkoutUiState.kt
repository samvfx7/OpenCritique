package com.opencritique.presentation.feature.workout

import com.opencritique.domain.model.Exercise
import com.opencritique.domain.model.MeasurementType
import com.opencritique.domain.model.Workout
import com.opencritique.domain.model.WorkoutDifficulty
import com.opencritique.domain.model.WorkoutExercise
import com.opencritique.domain.model.WorkoutSet

sealed class WorkoutUiState {
    data object Loading : WorkoutUiState()
    data object NoProgram : WorkoutUiState()
    data class Planned(val workout: WorkoutUiModel) : WorkoutUiState()
    data class Active(val workout: WorkoutUiModel, val sessionState: WorkoutSessionState) : WorkoutUiState()
    data class Completed(val workout: WorkoutUiModel, val totalXpEarned: Long) : WorkoutUiState()
    data class Error(val message: String) : WorkoutUiState()
}

data class WorkoutUiModel(
    val id: String,
    val name: String,
    val difficulty: WorkoutDifficulty,
    val estimatedMinutes: Int,
    val estimatedXp: Long,
    val exercises: List<ExerciseUiModel>,
)

data class ExerciseUiModel(
    val id: String,
    val name: String,
    val measurementType: MeasurementType,
    val sets: List<SetUiModel>,
    val isCompleted: Boolean = false,
)

data class SetUiModel(
    val id: String,
    val setNumber: Int,
    val targetReps: Int? = null,
    val targetWeight: Double? = null,
    val targetDuration: Long? = null,
    val targetDistance: Double? = null,
    val actualReps: Int? = null,
    val actualWeight: Double? = null,
    val actualDuration: Long? = null,
    val actualDistance: Double? = null,
    val isCompleted: Boolean = false,
)

data class WorkoutSessionState(
    val currentExerciseIndex: Int = 0,
    val completedExercisesCount: Int = 0,
    val restingAfterSetId: String? = null,
    val restEndTimeMillis: Long? = null,
)

data class WorkoutDayInfo(
    val dayOfWeek: String,
    val workoutName: String,
    val isToday: Boolean = false,
)
