package com.opencritique.presentation.feature.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.opencritique.presentation.design.components.OCBottomNavigation
import com.opencritique.presentation.design.components.OCBottomNavItem
import com.opencritique.presentation.design.components.OCButton
import com.opencritique.presentation.design.components.OCIconButton
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.OCTypographyCustom
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToWorkout: () -> Unit = {},
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
                        icon = Icons.Rounded.Person,
                        selected = true,
                    ),
                    OCBottomNavItem(
                        label = "Workout",
                        icon = Icons.Rounded.Person,
                        selected = false,
                        onClick = onNavigateToWorkout,
                    ),
                    OCBottomNavItem(
                        label = "AI Coach",
                        icon = Icons.Rounded.Person,
                        selected = false,
                        onClick = onNavigateToAiCoach,
                    ),
                    OCBottomNavItem(
                        label = "Profile",
                        icon = Icons.Rounded.Person,
                        selected = false,
                        onClick = {
                            onNavigateToProfile()
                            viewModel.onProfileClicked()
                        },
                    ),
                ),
            )
        },
    ) { paddingValues ->
        when (val state = uiState) {
            is HomeUiState.Loading -> {
                HomeLoadingState(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }
            is HomeUiState.NewUser -> {
                HomeNewUserState(
                    viewModel = viewModel,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }
            is HomeUiState.Populated -> {
                HomePopulatedState(
                    data = state.data,
                    viewModel = viewModel,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                )
            }
            is HomeUiState.Error -> {
                HomeErrorState(
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
private fun HomeLoadingState(modifier: Modifier = Modifier) {
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
private fun HomeNewUserState(
    viewModel: HomeViewModel,
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
            verticalArrangement = Arrangement.spacedBy(OCSpacing.xl),
        ) {
            Text(
                text = "Welcome to OpenCritique",
                style = ocTypography.headlineSmall,
                color = OCColors.TextPrimary,
            )

            Text(
                text = "Set up your training profile to generate your first 7-day training program.",
                style = ocTypography.bodyMedium,
                color = OCColors.TextSecondary,
            )

            OCButton(
                text = "Set Up Training",
                onClick = { viewModel.onSetUpTrainingClicked() },
            )
        }
    }
}

@Composable
private fun HomeErrorState(
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
            verticalArrangement = Arrangement.spacedBy(OCSpacing.base),
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
            )
        }
    }
}

@Composable
private fun HomePopulatedState(
    data: HomeScreenData,
    viewModel: HomeViewModel,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState()),
    ) {
        // Top greeting and profile action
        HomeTopArea(
            onProfileClicked = { viewModel.onProfileClicked() },
        )

        // Rank / progression section
        HomeRankSection(data = data)

        // Today's Training section
        HomeTodayTrainingSection(
            todayWorkout = data.todayWorkout,
            onStartWorkout = { viewModel.onStartWorkoutClicked() },
            onViewPlan = { viewModel.onViewPlanClicked() },
        )

        // Today's Tasks section
        HomeTodayTasksSection(
            tasks = data.todayTasks,
            onTaskClicked = { viewModel.onTaskClicked(it) },
        )

        // Recent Activity section
        HomeRecentActivitySection(activities = data.recentActivity)

        // Bottom padding for bottom navigation
        Box(modifier = Modifier.padding(bottom = OCSpacing.xl))
    }
}
