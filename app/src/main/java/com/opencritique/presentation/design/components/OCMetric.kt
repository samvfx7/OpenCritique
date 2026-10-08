package com.opencritique.presentation.design.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.OCTypographyCustom
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun OCMetric(
    value: String,
    label: String,
    modifier: Modifier = Modifier,
    icon: @Composable (() -> Unit)? = null,
) {
    Column(
        modifier = modifier
            .padding(OCSpacing.base),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(OCSpacing.sm),
    ) {
        if (icon != null) {
            icon()
        }

        Text(
            text = value,
            style = OCTypographyCustom.numericMedium,
            color = OCColors.TextPrimary,
        )

        Text(
            text = label,
            style = ocTypography.bodySmall,
            color = OCColors.TextSecondary,
        )
    }
}
