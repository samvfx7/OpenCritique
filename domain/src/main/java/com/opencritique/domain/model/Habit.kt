package com.opencritique.domain.model

enum class HabitDifficulty(val xpValue: Long) {
    EASY(10L),
    MODERATE(20L),
    HARD(35L),
    VERY_HARD(50L),
}

data class Habit(
    val id: String,
    val name: String,
    val description: String? = null,
    val difficulty: HabitDifficulty = HabitDifficulty.MODERATE,
    val createdAtEpochMillis: Long = 0L,
)

data class HabitCompletion(
    val id: String,
    val habitId: String,
    val completedAtEpochMillis: Long = 0L,
)

object HabitXpPolicy {
    fun xpFor(difficulty: HabitDifficulty): Long = difficulty.xpValue
}
