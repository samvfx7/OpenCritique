package com.opencritique.presentation.design.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.opencritique.presentation.design.theme.OCColors
import com.opencritique.presentation.design.theme.OCSpacing
import com.opencritique.presentation.design.theme.ocTypography

data class OCBottomNavItem(
    val label: String,
    val icon: ImageVector,
    val selected: Boolean = false,
    val onClick: () -> Unit = {},
)

@Composable
fun OCBottomNavigation(
    items: List<OCBottomNavItem>,
    modifier: Modifier = Modifier,
) {
    NavigationBar(
        modifier = modifier
            .fillMaxWidth()
            .height(80.dp),
        containerColor = OCColors.Surface1,
        contentColor = OCColors.TextPrimary,
        tonalElevation = 0.dp,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = OCSpacing.base, vertical = OCSpacing.sm),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            items.forEach { item ->
                NavigationBarItem(
                    selected = item.selected,
                    onClick = item.onClick,
                    icon = {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.label,
                            tint = if (item.selected) {
                                OCColors.PurpleAccent
                            } else {
                                OCColors.TextSecondary
                            },
                        )
                    },
                    label = {
                        Text(
                            text = item.label,
                            style = ocTypography.labelSmall,
                            color = if (item.selected) {
                                OCColors.PurpleAccent
                            } else {
                                OCColors.TextSecondary
                            },
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = OCColors.PurpleAccent,
                        selectedTextColor = OCColors.PurpleAccent,
                        unselectedIconColor = OCColors.TextSecondary,
                        unselectedTextColor = OCColors.TextSecondary,
                        indicatorColor = OCColors.Surface2,
                    ),
                    alwaysShowLabel = true,
                )
            }
        }
    }
}
