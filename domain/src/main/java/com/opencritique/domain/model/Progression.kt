package com.opencritique.domain.model

enum class RankTier(
    val title: String,
    val color: String,
    val order: Int,
) {
    BEGINNER("Beginner", "Bronze", 1),
    NOVICE("Novice", "Silver", 2),
    APPRENTICE("Apprentice", "Jade", 3),
    INTERMEDIATE("Intermediate", "Garnet", 4),
    SKILLED("Skilled", "Topaz", 5),
    ADVANCED("Advanced", "Citrine", 6),
    ELITE("Elite", "Sapphire", 7),
    EXPERT("Expert", "Emerald", 8),
    MASTER("Master", "Ruby", 9),
    GRANDMASTER("Grandmaster", "Amethyst", 10),
    LEGEND("Legend", "Opal", 11),
    APEX("Apex", "Diamond", 12),
}

data class Rank(
    val tier: RankTier,
    val totalXp: Long = 0L,
) {
    val title: String
        get() = tier.title

    val color: String
        get() = tier.color
}

@JvmInline
value class XpValue(val value: Long) {
    init {
        require(value >= 0L) { "XP cannot be negative." }
    }
}

enum class XpEventType {
    WORKOUT_COMPLETED,
    HABIT_COMPLETED,
    PROGRAM_COMPLETED,
    MILESTONE_UNLOCKED,
}

data class XpEvent(
    val id: String,
    val type: XpEventType,
    val xp: XpValue,
    val sourceId: String? = null,
    val createdAtEpochMillis: Long = 0L,
)
