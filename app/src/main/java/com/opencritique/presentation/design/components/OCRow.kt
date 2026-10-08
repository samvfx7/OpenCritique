package com.opencritique.presentation.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCRadius
import com.opencritique.presentation.design.theme.OCSpacing

@Composable
fun OCRow(
    modifier: Modifier = Modifier,
    backgroundColor: Color = OCColors.Surface2,
    radius: androidx.compose.ui.unit.Dp = OCRadius.standard,
    verticalAlignment: Alignment.Vertical = Alignment.CenterVertically,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(
                color = backgroundColor,
                shape = RoundedCornerShape(radius),
            )
            .padding(OCSpacing.base),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = verticalAlignment,
            horizontalArrangement = Arrangement.spacedBy(OCSpacing.base),
        ) {
            content()
        }
    }
}
