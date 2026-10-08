package com.opencritique.presentation.design.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.opencritique.presentation.design.theme.OCColors

@Composable
fun OCIconButton(
    onClick: () -> Unit,
    icon: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    selected: Boolean = false,
    contentDescription: String? = null,
) {
    val tintColor = when {
        !enabled -> OCColors.TextTertiary
        selected -> OCColors.PurpleAccent
        else -> OCColors.TextPrimary
    }

    IconButton(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        colors = IconButtonDefaults.iconButtonColors(
            contentColor = tintColor,
            disabledContentColor = OCColors.TextTertiary,
        ),
        interactionSource = remember { MutableInteractionSource() },
    ) {
        icon()
    }
}
