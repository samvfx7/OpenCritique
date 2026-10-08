package com.opencritique.domain.model

data class Exercise(
    val id: String,
    val name: String,
    val measurementType: MeasurementType,
    val muscleGroup: String? = null,
    val notes: String? = null,
    val isCustom: Boolean = false,
)
