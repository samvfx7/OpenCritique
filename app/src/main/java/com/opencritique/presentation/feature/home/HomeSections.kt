package com.opencritique.presentation.feature.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.sp
import com.opencritique.domain.model.HabitDifficulty
import com.opencritique.presentation.design.components.OCButton
import com.opencritique.presentation.design.components.OCIconButton
import com.opencritique.presentation.design.components.OCMetric
import com.opencritique.presentation.design.components.OCProgress
import com.opencritique.presentation.design.components.OCRow
import com.opencritique.presentation.design.components.OCSectionHeader
import com.opencritique.presentation.design.components.RankGemstone
import com.opencritique.presentation.design.components.RankGemstoneSize
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.OCTypographyCustom
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun HomeTopArea(
    modifier: Modifier = Modifier,
    onProfileClicked: () -> Unit = {},
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(top = OCSpacing.xl, bottom = OCSpacing.xl),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(OCSpacing.sm),
        ) {
            Text(
                text = "Good afternoon",
                style = ocTypography.bodySmall,
                color = OCColors.TextSecondary,
            )

            Text(
                text = "Ready to train?",
                style = ocTypography.titleMedium,
                color = OCColors.TextPrimary,
            )
        }

        OCIconButton(
            onClick = onProfileClicked,
            icon = { androidx.compose.material3.Icon(Icons.Rounded.Person, null) },
        )
    }
}

@Composable
fun HomeRankSection(
    modifier: Modifier = Modifier,
    data: HomeScreenData,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxxl),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
    ) {
        // Gemstone
        RankGemstone(
            rankTier = data.currentRank,
            size = RankGemstoneSize.LARGE,
        )

        // Rank name
        Text(
            text = data.currentRank.title,
            style = ocTypography.titleLarge,
            color = OCColors.TextPrimary,
        )

        // Current XP
        Text(
            text = data.currentXp.toString(),
            style = OCTypographyCustom.numericMedium,
            color = OCColors.PurpleAccent,
        )

        // Progress bar
        OCProgress(
            progress = data.currentXp.toFloat() / data.nextRankXp,
            label = "${data.currentXp} / ${data.nextRankXp} XP",
            percentage = false,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = OCSpacing.base),
        )

        // Next rank info
        Text(
            text = "${data.nextRankXp - data.currentXp} XP to ${data.nextRankName}",
            style = ocTypography.bodySmall,
            color = OCColors.TextSecondary,
        )
    }
}

@Composable
fun HomeTodayTrainingSection(
    modifier: Modifier = Modifier,
    todayWorkout: TodayWorkoutState,
    onStartWorkout: () -> Unit = {},
    onViewPlan: () -> Unit = {},
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxxl),
        verticalArrangement = Arrangement.spacedBy(OCSpacing.lg),
    ) {
        OCSectionHeader(
            title = "Today's Training",
            action = {
                if (todayWorkout is TodayWorkoutState.Scheduled) {
                    Text(
                        text = "View plan",
                        style = ocTypography.labelSmall,
                        color = OCColors.PurpleAccent,
                        modifier = Modifier.padding(end = OCSpacing.sm),
                    )
                }
            },
        )

        when (todayWorkout) {
            is TodayWorkoutState.None -> {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(OCSpacing.base),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(OCSpacing.sm),
                ) {
                    Text(
                        text = "Rest day",
                        style = ocTypography.titleSmall,
                        color = OCColors.TextPrimary,
                    )

                    Text(
                        text = "Your next session is tomorrow.",
                        style = ocTypography.bodySmall,
                        color = OCColors.TextSecondary,
                    )
                }
            }

            is TodayWorkoutState.Scheduled -> {
                val workout = todayWorkout.workout

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
                            text = workout.name,
                            style = ocTypography.titleSmall,
                            color = OCColors.TextPrimary,
                        )

                        Text(
                            text = "${workout.difficulty.name.replace("_", " ")} · ${workout.estimatedMinutes} min",
                            style = ocTypography.bodySmall,
                            color = OCColors.TextSecondary,
                        )

                        Text(
                            text = "${workout.exerciseCount} exercises",
                            style = ocTypography.labelSmall,
                            color = OCColors.TextSecondary,
                        )

                        Text(
                            text = "Estimated XP ${workout.estimatedXp}",
                            style = ocTypography.labelSmall,
                            color = OCColors.PurpleAccent,
                        )
                    }

                    OCButton(
                        text = "Start",
                        onClick = onStartWorkout,
                        modifier = Modifier.align(Alignment.CenterVertically),
                    )
                }
            }
        }
    }
}

@Composable
fun HomeTodayTasksSection(
    modifier: Modifier = Modifier,
    tasks: List<HomeTaskItem>,
    onTaskClicked: (String) -> Unit = {},
) {
    if (tasks.isEmpty()) {
        return
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxxl),
        verticalArrangement = Arrangement.spacedBy(OCSpacing.lg),
    ) {
        OCSectionHeader(title = "Today's Tasks")

        Column(
            verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
        ) {
            tasks.forEach { task ->
                HomeTaskRow(
                    task = task,
                    onClick = { onTaskClicked(task.id) },
                )
            }
        }
    }
}

@Composable
fun HomeTaskRow(
    task: HomeTaskItem,
    onClick: () -> Unit = {},
) {
    OCRow(
        modifier = Modifier
            .fillMaxWidth(),
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(end = OCSpacing.base),
            verticalArrangement = Arrangement.spacedBy(OCSpacing.sm),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(OCSpacing.sm),
            ) {
                Text(
                    text = if (task.completed) "✓" else "○",
                    style = ocTypography.bodyLarge,
                    color = if (task.completed) OCColors.Success else OCColors.TextSecondary,
                )

                Text(
                    text = task.name,
                    style = ocTypography.bodyMedium,
                    color = OCColors.TextPrimary,
                )
            }

            Text(
                text = "${task.difficulty.name.replace("_", " ")} · +${task.difficulty.xpValue} XP",
                style = ocTypography.labelSmall,
                color = OCColors.TextSecondary,
            )
        }
    }
}

@Composable
fun HomeRecentActivitySection(
    modifier: Modifier = Modifier,
    activities: List<RecentActivityItem>,
) {
    if (activities.isEmpty()) {
        return
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding)
            .padding(bottom = OCSpacing.xxxl),
        verticalArrangement = Arrangement.spacedBy(OCSpacing.lg),
    ) {
        OCSectionHeader(title = "Recent Activity")

        Column(
            verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
        ) {
            activities.forEach { activity ->
                HomeActivityRow(activity = activity)
            }
        }
    }
}

@Composable
fun HomeActivityRow(
    activity: RecentActivityItem,
) {
    OCRow(
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(end = OCSpacing.base),
            verticalArrangement = Arrangement.spacedBy(OCSpacing.xs),
        ) {
            Text(
                text = activity.date,
                style = ocTypography.labelSmall,
                color = OCColors.TextTertiary,
            )

            Text(
                text = activity.title,
                style = ocTypography.bodyMedium,
                color = OCColors.TextPrimary,
            )
        }

        Text(
            text = "+${activity.xpEarned} XP",
            style = OCTypographyCustom.numericSmall,
            color = OCColors.PurpleAccent,
            modifier = Modifier.align(Alignment.CenterVertically),
        )
    }
}
