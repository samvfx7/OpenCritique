package com.opencritique.presentation.design.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCRadius
import com.opencritique.presentation.design.theme.OCTypographyCustom

enum class OCButtonVariant {
    PRIMARY,
    SECONDARY,
    TERTIARY,
    DESTRUCTIVE,
}

@Composable
fun OCButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: OCButtonVariant = OCButtonVariant.PRIMARY,
    enabled: Boolean = true,
    isLoading: Boolean = false,
) {
    val (backgroundColor, textColor, disabledBackgroundColor) = when (variant) {
        OCButtonVariant.PRIMARY -> Triple(
            OCColors.PurpleAccent,
            OCColors.TextPrimary,
            OCColors.Disabled,
        )
        OCButtonVariant.SECONDARY -> Triple(
            OCColors.Surface2,
            OCColors.TextPrimary,
            OCColors.Surface1,
        )
        OCButtonVariant.TERTIARY -> Triple(
            Color.Transparent,
            OCColors.PurpleAccent,
            OCColors.Disabled,
        )
        OCButtonVariant.DESTRUCTIVE -> Triple(
            OCColors.Error,
            OCColors.TextPrimary,
            OCColors.Disabled,
        )
    }

    Button(
        onClick = onClick,
        modifier = modifier.height(48.dp),
        enabled = enabled && !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = backgroundColor,
            contentColor = textColor,
            disabledContainerColor = disabledBackgroundColor,
            disabledContentColor = OCColors.TextTertiary,
        ),
        shape = RoundedCornerShape(OCRadius.standard),
        contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp),
        interactionSource = remember { MutableInteractionSource() },
    ) {
        if (isLoading) {
            Text("Loading", style = OCTypographyCustom.captionLarge)
        } else {
            Text(text, style = OCTypographyCustom.captionLarge)
        }
    }
}
