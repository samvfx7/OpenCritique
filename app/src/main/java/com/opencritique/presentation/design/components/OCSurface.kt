package com.opencritique.presentation.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCElevation
import com.opencritique.presentation.design.theme.OCRadius

@Composable
fun OCSurface(
    modifier: Modifier = Modifier,
    backgroundColor: Color = OCColors.Surface1,
    radius: Dp = OCRadius.standard,
    elevation: Dp = OCElevation.none,
    border: Pair<Dp, Color>? = null,
    content: @Composable () -> Unit,
) {
    Surface(
        modifier = modifier
            .then(
                if (border != null) {
                    Modifier.border(border.first, border.second, radius = radius)
                } else {
                    Modifier
                }
            ),
        color = backgroundColor,
        shape = androidx.compose.foundation.shape.RoundedCornerShape(radius),
        shadowElevation = elevation,
    ) {
        content()
    }
}
