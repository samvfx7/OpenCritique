package com.opencritique.domain

import com.opencritique.domain.model.HabitDifficulty
import com.opencritique.domain.model.HabitXpPolicy
import com.opencritique.domain.model.MeasurementType
import com.opencritique.domain.model.Rank
import com.opencritique.domain.model.RankTier
import com.opencritique.domain.model.Workout
import com.opencritique.domain.model.WorkoutDifficulty
import com.opencritique.domain.model.WorkoutSet
import com.opencritique.domain.validation.SetValidationIssue
import com.opencritique.domain.validation.SetValidator
import com.opencritique.domain.xp.WorkoutXpPolicy
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class SetValidatorTest {
    private val validator = SetValidator()

    @Test
    fun `reps set requires repetitions`() {
        val set = WorkoutSet(
            id = "1",
            index = 1,
            measurementType = MeasurementType.REPS,
            repetitions = null,
        )

        val result = validator.validate(set)
        assertFalse(result.isValid)
        assertTrue(result.issues.contains(SetValidationIssue.MissingRepetitions))
    }

    @Test
    fun `weight reps requires both repetitions and weight`() {
        val set = WorkoutSet(
            id = "2",
            index = 1,
            measurementType = MeasurementType.WEIGHT_REPS,
            repetitions = 8,
            weightKg = null,
        )

        val result = validator.validate(set)
        assertFalse(result.isValid)
        assertTrue(result.issues.contains(SetValidationIssue.MissingWeight))
    }

    @Test
    fun `duration set accepts positive duration`() {
        val set = WorkoutSet(
            id = "3",
            index = 1,
            measurementType = MeasurementType.DURATION,
            durationSeconds = 60L,
        )

        val result = validator.validate(set)
        assertTrue(result.isValid)
        assertEquals(0, result.issues.size)
    }

    @Test
    fun `distance set requires distance`() {
        val set = WorkoutSet(
            id = "4",
            index = 1,
            measurementType = MeasurementType.DISTANCE,
            distanceMeters = null,
        )

        val result = validator.validate(set)
        assertFalse(result.isValid)
        assertTrue(result.issues.contains(SetValidationIssue.MissingDistance))
    }
}

class HabitXpPolicyTest {
    @Test
    fun `habit difficulty maps to the expected xp values`() {
        assertEquals(10L, HabitXpPolicy.xpFor(HabitDifficulty.EASY))
        assertEquals(20L, HabitXpPolicy.xpFor(HabitDifficulty.MODERATE))
        assertEquals(35L, HabitXpPolicy.xpFor(HabitDifficulty.HARD))
        assertEquals(50L, HabitXpPolicy.xpFor(HabitDifficulty.VERY_HARD))
    }
}

class RankRepresentationTest {
    @Test
    fun `rank tier list contains exactly twelve progression ranks`() {
        assertEquals(12, RankTier.entries.size)
    }

    @Test
    fun `rank tiers have stable names and order`() {
        assertEquals("Beginner", RankTier.BEGINNER.title)
        assertEquals("Bronze", RankTier.BEGINNER.color)
        assertEquals(1, RankTier.BEGINNER.order)
        assertEquals("Apex", RankTier.APEX.title)
        assertEquals("Diamond", RankTier.APEX.color)
        assertEquals(12, RankTier.APEX.order)
    }

    @Test
    fun `rank separates tier from xp and leaderboard concerns`() {
        val rank = Rank(tier = RankTier.NOVICE, totalXp = 250L)
        assertEquals(RankTier.NOVICE, rank.tier)
        assertEquals(250L, rank.totalXp)
        assertTrue(rank.title.contains("Novice"))
    }
}

class WorkoutXpPolicyTest {
    @Test
    fun `workout difficulty produces expected xp values`() {
        assertEquals(80L, WorkoutXpPolicy.xpFor(WorkoutDifficulty.LEG_DAY))
        assertEquals(90L, WorkoutXpPolicy.xpFor(WorkoutDifficulty.UPPER_BODY))
        assertEquals(150L, WorkoutXpPolicy.xpFor(WorkoutDifficulty.FULL_BODY))
        assertEquals(85L, WorkoutXpPolicy.xpFor(WorkoutDifficulty.CONDITIONING))
        assertEquals(110L, WorkoutXpPolicy.xpFor(WorkoutDifficulty.CALISTHENICS))
        assertEquals(120L, WorkoutXpPolicy.xpFor(WorkoutDifficulty.SPORT_PERFORMANCE))
    }

    @Test
    fun `xp is derived from workout difficulty and not user supplied`() {
        val workout = Workout(
            id = "workout-1",
            name = "Leg Day",
            difficulty = WorkoutDifficulty.LEG_DAY,
        )

        assertEquals(80L, WorkoutXpPolicy.xpFor(workout).value)
    }
}
