package com.opencritique.presentation.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCRadius
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.ocTypography

enum class OCStatusPillVariant {
    SUCCESS,
    WARNING,
    ERROR,
    INFO,
}

@Composable
fun OCStatusPill(
    text: String,
    variant: OCStatusPillVariant = OCStatusPillVariant.INFO,
    modifier: Modifier = Modifier,
) {
    val (backgroundColor, textColor) = when (variant) {
        OCStatusPillVariant.SUCCESS -> Pair(
            OCColors.Success.copy(alpha = 0.2f),
            OCColors.Success,
        )
        OCStatusPillVariant.WARNING -> Pair(
            OCColors.Warning.copy(alpha = 0.2f),
            OCColors.Warning,
        )
        OCStatusPillVariant.ERROR -> Pair(
            OCColors.Error.copy(alpha = 0.2f),
            OCColors.Error,
        )
        OCStatusPillVariant.INFO -> Pair(
            OCColors.PurpleAccent.copy(alpha = 0.2f),
            OCColors.PurpleAccent,
        )
    }

    Box(
        modifier = modifier
            .background(
                color = backgroundColor,
                shape = RoundedCornerShape(OCRadius.compact),
            )
            .padding(horizontal = OCSpacing.sm, vertical = OCSpacing.xs),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = text,
            style = ocTypography.labelSmall,
            color = textColor,
        )
    }
}
