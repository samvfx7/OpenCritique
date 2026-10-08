package com.opencritique.domain.model

enum class WorkoutDifficulty {
    LEG_DAY,
    UPPER_BODY,
    FULL_BODY,
    CONDITIONING,
    CALISTHENICS,
    SPORT_PERFORMANCE,
}

data class WorkoutSet(
    val id: String,
    val index: Int,
    val measurementType: MeasurementType,
    val repetitions: Int? = null,
    val weightKg: Double? = null,
    val durationSeconds: Long? = null,
    val distanceMeters: Double? = null,
)

data class WorkoutExercise(
    val id: String,
    val exerciseId: String,
    val order: Int,
    val sets: List<WorkoutSet> = emptyList(),
    val note: String? = null,
)

data class Workout(
    val id: String,
    val name: String,
    val difficulty: WorkoutDifficulty,
    val description: String? = null,
    val exercises: List<WorkoutExercise> = emptyList(),
    val createdAtEpochMillis: Long = 0L,
)
