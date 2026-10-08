package com.opencritique.domain.validation

import com.opencritique.domain.model.MeasurementType
import com.opencritique.domain.model.WorkoutSet

sealed class SetValidationIssue(val message: String) {
    data object MissingRepetitions : SetValidationIssue("Repetitions are required.")
    data object MissingWeight : SetValidationIssue("Weight is required.")
    data object MissingDuration : SetValidationIssue("Duration is required.")
    data object MissingDistance : SetValidationIssue("Distance is required.")
    data object InvalidRepetitions : SetValidationIssue("Repetitions must be greater than zero.")
    data object InvalidWeight : SetValidationIssue("Weight must be greater than zero.")
    data object InvalidDuration : SetValidationIssue("Duration must be greater than zero.")
    data object InvalidDistance : SetValidationIssue("Distance must be greater than zero.")
}

data class SetValidationResult(
    val isValid: Boolean,
    val issues: List<SetValidationIssue> = emptyList(),
) {
    companion object {
        fun valid(): SetValidationResult = SetValidationResult(true)
    }
}

class SetValidator {
    fun validate(set: WorkoutSet): SetValidationResult {
        val issues = mutableListOf<SetValidationIssue>()

        when (set.measurementType) {
            MeasurementType.REPS -> {
                if (set.repetitions == null) {
                    issues += SetValidationIssue.MissingRepetitions
                } else if (set.repetitions <= 0) {
                    issues += SetValidationIssue.InvalidRepetitions
                }
            }

            MeasurementType.WEIGHT_REPS -> {
                if (set.repetitions == null) {
                    issues += SetValidationIssue.MissingRepetitions
                } else if (set.repetitions <= 0) {
                    issues += SetValidationIssue.InvalidRepetitions
                }

                if (set.weightKg == null) {
                    issues += SetValidationIssue.MissingWeight
                } else if (set.weightKg <= 0.0) {
                    issues += SetValidationIssue.InvalidWeight
                }
            }

            MeasurementType.DURATION -> {
                if (set.durationSeconds == null) {
                    issues += SetValidationIssue.MissingDuration
                } else if (set.durationSeconds <= 0L) {
                    issues += SetValidationIssue.InvalidDuration
                }
            }

            MeasurementType.DISTANCE -> {
                if (set.distanceMeters == null) {
                    issues += SetValidationIssue.MissingDistance
                } else if (set.distanceMeters <= 0.0) {
                    issues += SetValidationIssue.InvalidDistance
                }
            }
        }

        return SetValidationResult(issues.isEmpty(), issues)
    }
}
