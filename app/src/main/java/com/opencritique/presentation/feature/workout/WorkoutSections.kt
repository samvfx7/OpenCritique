package com.opencritique.presentation.feature.workout

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.opencritique.domain.model.MeasurementType
import com.opencritique.presentation.design.components.OCButton
import com.opencritique.presentation.design.components.OCSectionHeader
import com.opencritique.presentation.design.components.OCRow
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.OCTypographyCustom
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun WorkoutTopBar(
    modifier: Modifier = Modifier,
    workoutName: String,
    exerciseIndex: Int? = null,
    totalExercises: Int? = null,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(top = OCSpacing.lg, bottom = OCSpacing.lg),
    ) {
        Text(
            text = "Workout",
            style = ocTypography.bodySmall,
            color = OCColors.TextSecondary,
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = workoutName,
                style = ocTypography.titleLarge,
                color = OCColors.TextPrimary,
                modifier = Modifier.weight(1f),
            )

            if (exerciseIndex != null && totalExercises != null) {
                Text(
                    text = "${exerciseIndex + 1} / $totalExercises",
                    style = ocTypography.labelSmall,
                    color = OCColors.TextSecondary,
                )
            }
        }
    }
}

@Composable
fun WorkoutOverviewSection(
    modifier: Modifier = Modifier,
    workout: WorkoutUiModel,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxl),
        verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
    ) {
        Text(
            text = "${workout.difficulty.name.replace("_", " ")} · ${workout.estimatedMinutes} min",
            style = ocTypography.bodySmall,
            color = OCColors.TextSecondary,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(OCSpacing.lg),
        ) {
            Text(
                text = "${workout.exercises.size} exercises",
                style = ocTypography.bodyMedium,
                color = OCColors.TextPrimary,
            )

            Text(
                text = "Estimated XP ${workout.estimatedXp}",
                style = ocTypography.bodyMedium,
                color = OCColors.PurpleAccent,
            )
        }
    }
}

@Composable
fun ExerciseListSection(
    modifier: Modifier = Modifier,
    exercises: List<ExerciseUiModel>,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxl),
        verticalArrangement = Arrangement.spacedBy(OCSpacing.lg),
    ) {
        OCSectionHeader(title = "Exercises")

        Column(
            verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
        ) {
            exercises.forEach { exercise ->
                ExerciseListItem(exercise = exercise)
            }
        }
    }
}

@Composable
fun ExerciseListItem(
    exercise: ExerciseUiModel,
) {
    OCRow(
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(end = OCSpacing.base),
            verticalArrangement = Arrangement.spacedBy(OCSpacing.sm),
        ) {
            Text(
                text = exercise.name,
                style = ocTypography.bodyMedium,
                color = OCColors.TextPrimary,
            )

            Text(
                text = "${exercise.sets.size} × ${formatSetTarget(exercise.sets.firstOrNull())}",
                style = ocTypography.labelSmall,
                color = OCColors.TextSecondary,
            )
        }
    }
}

@Composable
private fun formatSetTarget(set: SetUiModel?): String {
    if (set == null) return ""
    return when {
        set.targetReps != null && set.targetWeight != null -> "${set.targetWeight} kg × ${set.targetReps}"
        set.targetReps != null -> "${set.targetReps} reps"
        set.targetDuration != null -> "${set.targetDuration / 60}:${(set.targetDuration % 60).toString().padStart(2, '0')}"
        set.targetDistance != null -> "${set.targetDistance} km"
        else -> ""
    }
}

@Composable
fun ActiveExerciseSection(
    modifier: Modifier = Modifier,
    exercise: ExerciseUiModel,
    onCompleteSet: (String) -> Unit = {},
    onUpdateSet: (String, Int?, Double?) -> Unit = { _, _, _ -> },
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxl),
        verticalArrangement = Arrangement.spacedBy(OCSpacing.lg),
    ) {
        OCSectionHeader(title = exercise.name)

        Column(
            verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
        ) {
            exercise.sets.forEach { set ->
                ActiveSetRow(
                    set = set,
                    measurementType = exercise.measurementType,
                    onComplete = { onCompleteSet(set.id) },
                    onUpdate = { reps, weight -> onUpdateSet(set.id, reps, weight) },
                )
            }
        }
    }
}

@Composable
fun ActiveSetRow(
    set: SetUiModel,
    measurementType: MeasurementType,
    onComplete: () -> Unit = {},
    onUpdate: (Int?, Double?) -> Unit = { _, _ -> },
) {
    OCRow(
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(end = OCSpacing.base),
            verticalArrangement = Arrangement.spacedBy(OCSpacing.sm),
        ) {
            Text(
                text = "Set ${set.setNumber}",
                style = ocTypography.bodyMedium,
                color = OCColors.TextPrimary,
            )

            Text(
                text = formatSetMeasurement(set, measurementType),
                style = ocTypography.labelSmall,
                color = OCColors.TextSecondary,
            )
        }

        Box(
            modifier = Modifier.align(Alignment.CenterVertically),
        ) {
            Text(
                text = if (set.isCompleted) "✓" else "○",
                style = ocTypography.bodyLarge,
                color = if (set.isCompleted) OCColors.Success else OCColors.TextSecondary,
            )
        }
    }
}

@Composable
private fun formatSetMeasurement(set: SetUiModel, measurementType: MeasurementType): String {
    return when (measurementType) {
        MeasurementType.REPS -> "${set.actualReps ?: set.targetReps ?: "?"} reps"
        MeasurementType.WEIGHT_REPS -> {
            val weight = set.actualWeight ?: set.targetWeight ?: "?"
            val reps = set.actualReps ?: set.targetReps ?: "?"
            "$weight kg × $reps"
        }
        MeasurementType.DURATION -> {
            val duration = set.actualDuration ?: set.targetDuration ?: 0
            "${duration / 60}:${(duration % 60).toString().padStart(2, '0')}"
        }
        MeasurementType.DISTANCE -> "${set.actualDistance ?: set.targetDistance ?: "?"} km"
    }
}

@Composable
fun WorkoutCompletionSection(
    modifier: Modifier = Modifier,
    workout: WorkoutUiModel,
    totalXp: Long,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxl),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
    ) {
        Text(
            text = "Workout Complete",
            style = ocTypography.headlineSmall,
            color = OCColors.TextPrimary,
        )

        Text(
            text = workout.name,
            style = ocTypography.titleSmall,
            color = OCColors.TextSecondary,
        )

        Text(
            text = "${workout.exercises.size} exercises · ${workout.exercises.sumOf { it.sets.size }} sets",
            style = ocTypography.bodySmall,
            color = OCColors.TextSecondary,
            modifier = Modifier.padding(top = OCSpacing.base),
        )

        Text(
            text = "+$totalXp XP",
            style = OCTypographyCustom.numericMedium,
            color = OCColors.PurpleAccent,
            modifier = Modifier.padding(top = OCSpacing.base),
        )
    }
}
