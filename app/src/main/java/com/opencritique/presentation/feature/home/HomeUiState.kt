package com.opencritique.presentation.feature.home

import com.opencritique.domain.model.Habit
import com.opencritique.domain.model.HabitDifficulty
import com.opencritique.domain.model.RankTier
import com.opencritique.domain.model.Workout
import com.opencritique.domain.model.WorkoutDifficulty

sealed class HomeUiState {
    data object Loading : HomeUiState()
    data object NewUser : HomeUiState()
    data class Populated(val data: HomeScreenData) : HomeUiState()
    data class Error(val message: String) : HomeUiState()
}

data class HomeScreenData(
    val currentRank: RankTier = RankTier.INTERMEDIATE,
    val currentXp: Long = 1240L,
    val nextRankXp: Long = 1500L,
    val nextRankName: String = "Skilled",
    val todayWorkout: TodayWorkoutState = TodayWorkoutState.None,
    val todayTasks: List<HomeTaskItem> = emptyList(),
    val recentActivity: List<RecentActivityItem> = emptyList(),
)

sealed class TodayWorkoutState {
    data object None : TodayWorkoutState()
    data class Scheduled(val workout: HomeWorkoutInfo) : TodayWorkoutState()
}

data class HomeWorkoutInfo(
    val id: String,
    val name: String,
    val difficulty: WorkoutDifficulty,
    val estimatedMinutes: Int,
    val exerciseCount: Int,
    val estimatedXp: Long,
)

data class HomeTaskItem(
    val id: String,
    val name: String,
    val difficulty: HabitDifficulty,
    val completed: Boolean,
)

data class RecentActivityItem(
    val id: String,
    val title: String,
    val date: String,
    val xpEarned: Long,
)
