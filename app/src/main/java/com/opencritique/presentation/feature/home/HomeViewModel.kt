package com.opencritique.presentation.feature.home

import androidx.lifecycle.ViewModel
import com.opencritique.domain.model.HabitDifficulty
import com.opencritique.domain.model.RankTier
import com.opencritique.domain.model.WorkoutDifficulty
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor() : ViewModel() {
    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadHome()
    }

    private fun loadHome() {
        // Demo/preview state for populated user
        val demoData = HomeScreenData(
            currentRank = RankTier.INTERMEDIATE,
            currentXp = 1240L,
            nextRankXp = 1500L,
            nextRankName = "Skilled",
            todayWorkout = TodayWorkoutState.Scheduled(
                HomeWorkoutInfo(
                    id = "workout-1",
                    name = "Upper Body",
                    difficulty = WorkoutDifficulty.UPPER_BODY,
                    estimatedMinutes = 45,
                    exerciseCount = 3,
                    estimatedXp = 90L,
                )
            ),
            todayTasks = listOf(
                HomeTaskItem(
                    id = "task-1",
                    name = "Mobility",
                    difficulty = HabitDifficulty.MODERATE,
                    completed = false,
                ),
                HomeTaskItem(
                    id = "task-2",
                    name = "Drink water",
                    difficulty = HabitDifficulty.EASY,
                    completed = true,
                ),
                HomeTaskItem(
                    id = "task-3",
                    name = "Stretch",
                    difficulty = HabitDifficulty.EASY,
                    completed = false,
                ),
            ),
            recentActivity = listOf(
                RecentActivityItem(
                    id = "activity-1",
                    title = "Upper Body completed",
                    date = "Today",
                    xpEarned = 90L,
                ),
                RecentActivityItem(
                    id = "activity-2",
                    title = "Mobility completed",
                    date = "Yesterday",
                    xpEarned = 20L,
                ),
                RecentActivityItem(
                    id = "activity-3",
                    title = "Full Body completed",
                    date = "Monday",
                    xpEarned = 150L,
                ),
            ),
        )

        _uiState.value = HomeUiState.Populated(demoData)
    }

    fun onStartWorkoutClicked() {
        // Navigate to workout screen - to be implemented
    }

    fun onSetUpTrainingClicked() {
        // Navigate to workout setup - to be implemented
    }

    fun onViewPlanClicked() {
        // Navigate to workout program view - to be implemented
    }

    fun onTaskClicked(taskId: String) {
        // Toggle task completion - to be implemented
    }

    fun onProfileClicked() {
        // Navigate to profile - to be implemented
    }
}
