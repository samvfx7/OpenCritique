package com.opencritique.presentation.design.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun OCSectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    action: @Composable (() -> Unit)? = null,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = OCSpacing.screenHorizontalPadding),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = title,
                style = ocTypography.headlineSmall,
                color = OCColors.TextPrimary,
                modifier = Modifier.weight(1f),
            )
            if (action != null) {
                action()
            }
        }

        if (subtitle != null) {
            Text(
                text = subtitle,
                style = ocTypography.bodySmall,
                color = OCColors.TextSecondary,
                modifier = Modifier.padding(top = OCSpacing.sm),
            )
        }
    }
}
