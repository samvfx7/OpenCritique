package com.opencritique.presentation.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencritique.domain.model.RankTier
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCRadius

enum class RankGemstoneSize {
    SMALL,
    MEDIUM,
    LARGE,
    HERO,
}

data class GemstoneColors(
    val backgroundColor: Color,
    val accentColor: Color,
    val textColor: Color,
)

fun getRankGemstoneColors(rankTier: RankTier): GemstoneColors {
    return when (rankTier) {
        RankTier.BEGINNER -> GemstoneColors(
            backgroundColor = Color(0xFF8B7355),
            accentColor = Color(0xFFD4AF37),
            textColor = Color.White,
        ) // Bronze
        RankTier.NOVICE -> GemstoneColors(
            backgroundColor = Color(0xFFC0C0C0),
            accentColor = Color(0xFFE8E8E8),
            textColor = Color(0xFF333333),
        ) // Silver
        RankTier.APPRENTICE -> GemstoneColors(
            backgroundColor = Color(0xFF00A86B),
            accentColor = Color(0xFF00C878),
            textColor = Color.White,
        ) // Jade
        RankTier.INTERMEDIATE -> GemstoneColors(
            backgroundColor = Color(0xFF960018),
            accentColor = Color(0xFFE71E3B),
            textColor = Color.White,
        ) // Garnet
        RankTier.SKILLED -> GemstoneColors(
            backgroundColor = Color(0xFFFFC000),
            accentColor = Color(0xFFFFD700),
            textColor = Color(0xFF333333),
        ) // Topaz
        RankTier.ADVANCED -> GemstoneColors(
            backgroundColor = Color(0xFFFFA500),
            accentColor = Color(0xFFFFD700),
            textColor = Color(0xFF333333),
        ) // Citrine
        RankTier.ELITE -> GemstoneColors(
            backgroundColor = Color(0xFF0F52BA),
            accentColor = Color(0xFF1E90FF),
            textColor = Color.White,
        ) // Sapphire
        RankTier.EXPERT -> GemstoneColors(
            backgroundColor = Color(0xFF50C878),
            accentColor = Color(0xFF7FFF00),
            textColor = Color.White,
        ) // Emerald
        RankTier.MASTER -> GemstoneColors(
            backgroundColor = Color(0xFFE0115F),
            accentColor = Color(0xFFFF69B4),
            textColor = Color.White,
        ) // Ruby
        RankTier.GRANDMASTER -> GemstoneColors(
            backgroundColor = Color(0xFF9966CC),
            accentColor = Color(0xFFBB86FC),
            textColor = Color.White,
        ) // Amethyst
        RankTier.LEGEND -> GemstoneColors(
            backgroundColor = Color(0xFF71C5BA),
            accentColor = Color(0xFFA3E4D7),
            textColor = Color.White,
        ) // Opal
        RankTier.APEX -> GemstoneColors(
            backgroundColor = Color(0xFF9DC4E0),
            accentColor = Color(0xFFFFFFFF),
            textColor = Color.White,
        ) // Diamond
    }
}

@Composable
fun RankGemstone(
    rankTier: RankTier,
    size: RankGemstoneSize = RankGemstoneSize.MEDIUM,
    modifier: Modifier = Modifier,
) {
    val (diameterDp, fontSize) = when (size) {
        RankGemstoneSize.SMALL -> Pair(48.dp, 10.sp)
        RankGemstoneSize.MEDIUM -> Pair(72.dp, 14.sp)
        RankGemstoneSize.LARGE -> Pair(96.dp, 18.sp)
        RankGemstoneSize.HERO -> Pair(144.dp, 24.sp)
    }

    val colors = getRankGemstoneColors(rankTier)
    val abbreviation = rankTier.title.take(1).uppercase()

    Box(
        modifier = modifier
            .size(diameterDp)
            .background(
                color = colors.backgroundColor,
                shape = RoundedCornerShape(OCRadius.standard),
            ),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = abbreviation,
            style = TextStyle(
                fontSize = fontSize,
                color = colors.textColor,
            ),
        )
    }
}
