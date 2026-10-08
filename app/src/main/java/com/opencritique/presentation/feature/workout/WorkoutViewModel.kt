package com.opencritique.presentation.feature.workout

import androidx.lifecycle.ViewModel
import com.opencritique.domain.model.MeasurementType
import com.opencritique.domain.model.WorkoutDifficulty
import com.opencritique.domain.xp.WorkoutXpPolicy
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class WorkoutViewModel @Inject constructor() : ViewModel() {
    private val _uiState = MutableStateFlow<WorkoutUiState>(WorkoutUiState.Loading)
    val uiState: StateFlow<WorkoutUiState> = _uiState.asStateFlow()

    init {
        loadWorkout()
    }

    private fun loadWorkout() {
        // Demo state: planned workout
        val demoWorkout = WorkoutUiModel(
            id = "workout-1",
            name = "Upper Body",
            difficulty = WorkoutDifficulty.UPPER_BODY,
            estimatedMinutes = 45,
            estimatedXp = WorkoutXpPolicy.xpFor(WorkoutDifficulty.UPPER_BODY).value,
            exercises = listOf(
                ExerciseUiModel(
                    id = "ex-1",
                    name = "Bench Press",
                    measurementType = MeasurementType.WEIGHT_REPS,
                    sets = listOf(
                        SetUiModel(
                            id = "set-1-1",
                            setNumber = 1,
                            targetReps = 8,
                            targetWeight = 40.0,
                        ),
                        SetUiModel(
                            id = "set-1-2",
                            setNumber = 2,
                            targetReps = 8,
                            targetWeight = 40.0,
                        ),
                        SetUiModel(
                            id = "set-1-3",
                            setNumber = 3,
                            targetReps = 8,
                            targetWeight = 40.0,
                        ),
                    ),
                ),
                ExerciseUiModel(
                    id = "ex-2",
                    name = "Pull-Up",
                    measurementType = MeasurementType.REPS,
                    sets = listOf(
                        SetUiModel(
                            id = "set-2-1",
                            setNumber = 1,
                            targetReps = 6,
                        ),
                        SetUiModel(
                            id = "set-2-2",
                            setNumber = 2,
                            targetReps = 6,
                        ),
                        SetUiModel(
                            id = "set-2-3",
                            setNumber = 3,
                            targetReps = 6,
                        ),
                    ),
                ),
                ExerciseUiModel(
                    id = "ex-3",
                    name = "Shoulder Press",
                    measurementType = MeasurementType.WEIGHT_REPS,
                    sets = listOf(
                        SetUiModel(
                            id = "set-3-1",
                            setNumber = 1,
                            targetReps = 10,
                            targetWeight = 25.0,
                        ),
                        SetUiModel(
                            id = "set-3-2",
                            setNumber = 2,
                            targetReps = 10,
                            targetWeight = 25.0,
                        ),
                        SetUiModel(
                            id = "set-3-3",
                            setNumber = 3,
                            targetReps = 10,
                            targetWeight = 25.0,
                        ),
                    ),
                ),
                ExerciseUiModel(
                    id = "ex-4",
                    name = "Biceps Curl",
                    measurementType = MeasurementType.WEIGHT_REPS,
                    sets = listOf(
                        SetUiModel(
                            id = "set-4-1",
                            setNumber = 1,
                            targetReps = 12,
                            targetWeight = 12.0,
                        ),
                        SetUiModel(
                            id = "set-4-2",
                            setNumber = 2,
                            targetReps = 12,
                            targetWeight = 12.0,
                        ),
                    ),
                ),
            ),
        )

        _uiState.value = WorkoutUiState.Planned(demoWorkout)
    }

    fun onStartWorkout() {
        val currentState = _uiState.value
        if (currentState is WorkoutUiState.Planned) {
            _uiState.value = WorkoutUiState.Active(
                workout = currentState.workout,
                sessionState = WorkoutSessionState(currentExerciseIndex = 0),
            )
        }
    }

    fun onCompleteSet(setId: String) {
        val currentState = _uiState.value
        if (currentState is WorkoutUiState.Active) {
            val updatedWorkout = currentState.workout.copy(
                exercises = currentState.workout.exercises.map { exercise ->
                    exercise.copy(
                        sets = exercise.sets.map { set ->
                            if (set.id == setId) set.copy(isCompleted = true) else set
                        },
                    )
                },
            )
            _uiState.value = currentState.copy(workout = updatedWorkout)
        }
    }

    fun onNextExercise() {
        val currentState = _uiState.value
        if (currentState is WorkoutUiState.Active) {
            val nextIndex = currentState.sessionState.currentExerciseIndex + 1
            val completedCount = currentState.sessionState.completedExercisesCount + 1

            if (nextIndex >= currentState.workout.exercises.size) {
                // Workout complete
                _uiState.value = WorkoutUiState.Completed(
                    workout = currentState.workout,
                    totalXpEarned = currentState.workout.estimatedXp,
                )
            } else {
                _uiState.value = currentState.copy(
                    sessionState = currentState.sessionState.copy(
                        currentExerciseIndex = nextIndex,
                        completedExercisesCount = completedCount,
                    ),
                )
            }
        }
    }

    fun onUpdateSet(setId: String, reps: Int? = null, weight: Double? = null) {
        val currentState = _uiState.value
        if (currentState is WorkoutUiState.Active) {
            val updatedWorkout = currentState.workout.copy(
                exercises = currentState.workout.exercises.map { exercise ->
                    exercise.copy(
                        sets = exercise.sets.map { set ->
                            if (set.id == setId) {
                                set.copy(
                                    actualReps = reps ?: set.actualReps,
                                    actualWeight = weight ?: set.actualWeight,
                                )
                            } else {
                                set
                            }
                        },
                    )
                },
            )
            _uiState.value = currentState.copy(workout = updatedWorkout)
        }
    }

    fun onSetUpTrainingClicked() {
        // Navigation hook to training setup - not implemented
    }

    fun onCompleteWorkout() {
        // Transition back to Planned or mark as done
        val currentState = _uiState.value
        if (currentState is WorkoutUiState.Completed) {
            loadWorkout() // Reset to planned state for demo
        }
    }
}
