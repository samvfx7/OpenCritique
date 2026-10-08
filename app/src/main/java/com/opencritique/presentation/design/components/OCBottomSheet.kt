package com.opencritique.presentation.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCRadius
import com.opencritique.presentation.design.theme.OCSpacing

@Composable
fun OCBottomSheet(
    sheetState: SheetState = rememberModalBottomSheetState(),
    onDismiss: () -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = OCColors.Surface1,
        shape = RoundedCornerShape(
            topStart = OCRadius.featured,
            topEnd = OCRadius.featured,
        ),
        scrimColor = OCColors.Background.copy(alpha = 0.6f),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = OCSpacing.screenHorizontalPadding)
                .padding(bottom = OCSpacing.xl),
        ) {
            content()
        }
    }
}
