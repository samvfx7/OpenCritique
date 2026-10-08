package com.opencritique.domain.xp

import com.opencritique.domain.model.Workout
import com.opencritique.domain.model.WorkoutDifficulty
import com.opencritique.domain.model.XpValue

object WorkoutXpPolicy {
    private val baseXpByDifficulty = mapOf(
        WorkoutDifficulty.LEG_DAY to 80L,
        WorkoutDifficulty.UPPER_BODY to 90L,
        WorkoutDifficulty.FULL_BODY to 150L,
        WorkoutDifficulty.CONDITIONING to 85L,
        WorkoutDifficulty.CALISTHENICS to 110L,
        WorkoutDifficulty.SPORT_PERFORMANCE to 120L,
    )

    fun xpFor(difficulty: WorkoutDifficulty): Long =
        baseXpByDifficulty[difficulty] ?: error("No XP rule configured for $difficulty")

    fun xpFor(workout: Workout): XpValue = XpValue(xpFor(workout.difficulty))
}
