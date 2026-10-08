package com.opencritique.presentation.design.theme

import androidx.compose.foundation.isSystemInDarkMode
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val darkColorScheme = darkColorScheme(
    background = OCColors.Background,
    surface = OCColors.Surface1,
    surfaceVariant = OCColors.Surface2,
    surfaceTint = OCColors.PurpleAccent,
    primary = OCColors.PurpleAccent,
    secondary = OCColors.PurpleSecondary,
    tertiary = OCColors.PurpleSecondary,
    error = OCColors.Error,
    onBackground = OCColors.TextPrimary,
    onSurface = OCColors.TextPrimary,
    onSurfaceVariant = OCColors.TextSecondary,
    onPrimary = OCColors.TextPrimary,
    onSecondary = OCColors.TextPrimary,
    onTertiary = OCColors.TextPrimary,
    onError = Color.White,
    errorContainer = Color(0xFF3D2D2B),
    outlineVariant = OCColors.BorderSubtle,
    outline = OCColors.BorderDefault,
)

@Composable
fun OpenCritiqueTheme(
    darkTheme: Boolean = isSystemInDarkMode(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) darkColorScheme else darkColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = ocTypography,
        content = content,
    )
}
