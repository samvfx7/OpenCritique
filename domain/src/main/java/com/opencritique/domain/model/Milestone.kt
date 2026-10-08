package com.opencritique.domain.model

enum class MilestoneCode {
    FIRST_WORKOUT,
    FIRST_PROGRAM,
    FIVE_HABITS_COMPLETED,
    ONE_THOUSAND_XP,
    RANK_APPRENTICE,
    RANK_ELITE,
}

data class Milestone(
    val id: String,
    val code: MilestoneCode,
    val title: String,
    val description: String,
    val requiredXp: Long = 0L,
    val unlocksFeature: String? = null,
)

object MilestoneCatalog {
    val all: List<Milestone> = listOf(
        Milestone(
            id = "first-workout",
            code = MilestoneCode.FIRST_WORKOUT,
            title = "First Workout",
            description = "Complete your first workout.",
            requiredXp = 0L,
            unlocksFeature = "Workout history view",
        ),
        Milestone(
            id = "first-program",
            code = MilestoneCode.FIRST_PROGRAM,
            title = "Program Started",
            description = "Start a training program.",
            requiredXp = 0L,
            unlocksFeature = "Program tracking",
        ),
        Milestone(
            id = "five-habits",
            code = MilestoneCode.FIVE_HABITS_COMPLETED,
            title = "Habit Builder",
            description = "Complete five habit entries.",
            requiredXp = 0L,
            unlocksFeature = "Habit insights",
        ),
        Milestone(
            id = "one-thousand-xp",
            code = MilestoneCode.ONE_THOUSAND_XP,
            title = "XP Milestone",
            description = "Reach 1,000 total XP.",
            requiredXp = 1000L,
            unlocksFeature = "Progression summary",
        ),
    )
}

class MilestoneEvaluator {
    fun evaluate(
        totalXp: Long,
        completedHabitCount: Int,
        completedWorkoutCount: Int,
    ): List<Milestone> {
        val unlocked = mutableListOf<Milestone>()

        if (completedWorkoutCount >= 1) {
            unlocked += MilestoneCatalog.all.first { it.code == MilestoneCode.FIRST_WORKOUT }
        }

        if (completedHabitCount >= 5) {
            unlocked += MilestoneCatalog.all.first { it.code == MilestoneCode.FIVE_HABITS_COMPLETED }
        }

        if (totalXp >= 1000L) {
            unlocked += MilestoneCatalog.all.first { it.code == MilestoneCode.ONE_THOUSAND_XP }
        }

        return unlocked.distinctBy { it.code }
    }
}
