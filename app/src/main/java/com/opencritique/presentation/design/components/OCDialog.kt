package com.opencritique.presentation.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.window.DialogProperties
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCRadius
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun OCDialog(
    title: String,
    message: String,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit,
    confirmText: String = "Confirm",
    dismissText: String = "Cancel",
    isDestructive: Boolean = false,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = title,
                style = ocTypography.headlineSmall,
                color = OCColors.TextPrimary,
            )
        },
        text = {
            Text(
                text = message,
                style = ocTypography.bodyMedium,
                color = OCColors.TextSecondary,
            )
        },
        confirmButton = {
            OCButton(
                text = confirmText,
                onClick = onConfirm,
                variant = if (isDestructive) OCButtonVariant.DESTRUCTIVE else OCButtonVariant.PRIMARY,
            )
        },
        dismissButton = {
            OCButton(
                text = dismissText,
                onClick = onDismiss,
                variant = OCButtonVariant.SECONDARY,
            )
        },
        containerColor = OCColors.Surface2,
        properties = DialogProperties(usePlatformDefaultWidth = false),
        modifier = Modifier
            .fillMaxWidth(0.85f)
            .background(
                color = OCColors.Surface2,
                shape = RoundedCornerShape(OCRadius.surface),
            ),
    )
}
