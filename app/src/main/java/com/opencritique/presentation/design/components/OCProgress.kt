package com.opencritique.presentation.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCRadius
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.ocTypography

@Composable
fun OCProgress(
    progress: Float,
    modifier: Modifier = Modifier,
    label: String? = null,
    percentage: Boolean = true,
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.Start,
    ) {
        if (label != null || percentage) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = OCSpacing.sm),
            ) {
                if (label != null) {
                    Text(
                        text = label,
                        style = ocTypography.bodySmall,
                        color = OCColors.TextSecondary,
                    )
                }
                if (percentage) {
                    Text(
                        text = "${(progress * 100).toInt()}%",
                        style = ocTypography.bodySmall,
                        color = OCColors.TextSecondary,
                        modifier = Modifier.align(Alignment.CenterEnd),
                    )
                }
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .background(
                    color = OCColors.Surface2,
                    shape = RoundedCornerShape(OCRadius.compact),
                ),
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(coerceProgress(progress))
                    .height(8.dp)
                    .background(
                        color = OCColors.PurpleAccent,
                        shape = RoundedCornerShape(OCRadius.compact),
                    ),
            )
        }
    }
}

private fun coerceProgress(progress: Float): Float = progress.coerceIn(0f, 1f)
