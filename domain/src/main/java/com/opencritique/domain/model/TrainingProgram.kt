package com.opencritique.domain.model

data class TrainingDay(
    val id: String,
    val name: String,
    val workoutIds: List<String> = emptyList(),
    val order: Int,
)

data class TrainingProgram(
    val id: String,
    val name: String,
    val description: String? = null,
    val days: List<TrainingDay> = emptyList(),
    val createdAtEpochMillis: Long = 0L,
)
