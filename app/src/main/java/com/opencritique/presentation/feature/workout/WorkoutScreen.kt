package com.opencritique.presentation.feature.workout

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.FitnessCenter
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import com.opencritique.presentation.design.components.OCBottomNavigation
import com.opencritique.presentation.design.components.OCBottomNavItem
import com.opencritique.presentation.design.components.OCButton
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun WorkoutScreen(
    viewModel: WorkoutViewModel,
    onNavigateToHome: () -> Unit = {},
    onNavigateToAiCoach: () -> Unit = {},
    onNavigateToProfile: () -> Unit = {},
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        bottomBar = {
            OCBottomNavigation(
                items = listOf(
                    OCBottomNavItem(
                        label = "Home",
                        icon = Icons.Rounded.FitnessCenter,
                        selected = false,
                        onClick = onNavigateToHome,
                    ),
                    OCBottomNavItem(
                        label = "Workout",
                        icon = Icons.Rounded.FitnessCenter,
                        selected = true,
                    ),
                    OCBottomNavItem(
                        label = "AI Coach",
                        icon = Icons.Rounded.FitnessCenter,
                        selected = false,
                        onClick = onNavigateToAiCoach,
                    ),
                    OCBottomNavItem(
                        label = "Profile",
                        icon = Icons.Rounded.FitnessCenter,
                        selected = false,
                        onClick = onNavigateToProfile,
                    ),
                ),
            )
        },
    ) { paddingValues ->
        when (val state = uiState) {
            is WorkoutUiState.Loading -> {
                WorkoutLoadingState(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }

            is WorkoutUiState.NoProgram -> {
                WorkoutNoProgramState(
                    viewModel = viewModel,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }

            is WorkoutUiState.Planned -> {
                WorkoutPlannedState(
                    workout = state.workout,
                    viewModel = viewModel,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }

            is WorkoutUiState.Active -> {
                WorkoutActiveState(
                    workout = state.workout,
                    sessionState = state.sessionState,
                    viewModel = viewModel,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }

            is WorkoutUiState.Completed -> {
                WorkoutCompletedState(
                    workout = state.workout,
                    totalXp = state.totalXpEarned,
                    viewModel = viewModel,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }

            is WorkoutUiState.Error -> {
                WorkoutErrorState(
                    message = state.message,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }
        }
    }
}

@Composable
private fun WorkoutLoadingState(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center,
    ) {
        CircularProgressIndicator(
            color = OCColors.PurpleAccent,
        )
    }
}

@Composable
private fun WorkoutNoProgramState(
    viewModel: WorkoutViewModel,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = OCSpacing.screenHorizontalPadding),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "No training plan yet",
                style = ocTypography.headlineSmall,
                color = OCColors.TextPrimary,
            )

            Text(
                text = "Set your goals, experience, schedule, equipment, and limitations to create your 7-day training program.",
                style = ocTypography.bodyMedium,
                color = OCColors.TextSecondary,
                modifier = Modifier.padding(top = OCSpacing.xl, bottom = OCSpacing.xl),
                textAlign = TextAlign.Center,
            )

            OCButton(
                text = "Set Up Training",
                onClick = { viewModel.onSetUpTrainingClicked() },
            )
        }
    }
}

@Composable
private fun WorkoutPlannedState(
    workout: WorkoutUiModel,
    viewModel: WorkoutViewModel,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState()),
    ) {
        WorkoutTopBar(
            workoutName = workout.name,
        )

        WorkoutOverviewSection(workout = workout)

        ExerciseListSection(exercises = workout.exercises)

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = OCSpacing.screenHorizontalPadding)
                .padding(bottom = OCSpacing.xl),
        ) {
            OCButton(
                text = "Start Workout",
                onClick = { viewModel.onStartWorkout() },
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun WorkoutActiveState(
    workout: WorkoutUiModel,
    sessionState: WorkoutSessionState,
    viewModel: WorkoutViewModel,
    modifier: Modifier = Modifier,
) {
    val currentExercise = workout.exercises.getOrNull(sessionState.currentExerciseIndex)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState()),
    ) {
        WorkoutTopBar(
            workoutName = currentExercise?.name ?: "Workout",
            exerciseIndex = sessionState.currentExerciseIndex,
            totalExercises = workout.exercises.size,
        )

        if (currentExercise != null) {
            ActiveExerciseSection(
                exercise = currentExercise,
                onCompleteSet = { setId -> viewModel.onCompleteSet(setId) },
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = OCSpacing.screenHorizontalPadding)
                    .padding(bottom = OCSpacing.xl),
            ) {
                OCButton(
                    text = "Complete Set",
                    onClick = { viewModel.onNextExercise() },
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

@Composable
private fun WorkoutCompletedState(
    workout: WorkoutUiModel,
    totalXp: Long,
    viewModel: WorkoutViewModel,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = OCSpacing.screenHorizontalPadding),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            WorkoutCompletionSection(
                workout = workout,
                totalXp = totalXp,
            )

            OCButton(
                text = "Done",
                onClick = { viewModel.onCompleteWorkout() },
                modifier = Modifier
                    .padding(top = OCSpacing.xl)
                    .fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun WorkoutErrorState(
    message: String,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = OCSpacing.screenHorizontalPadding),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "Something went wrong",
                style = ocTypography.headlineSmall,
                color = OCColors.Error,
            )

            Text(
                text = message,
                style = ocTypography.bodyMedium,
                color = OCColors.TextSecondary,
                modifier = Modifier.padding(top = OCSpacing.base),
            )
        }
    }
}
