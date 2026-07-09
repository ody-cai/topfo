package com.topfo.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightGlassScheme = lightColorScheme(
    primary = Indigo600, onPrimary = White, primaryContainer = Indigo100, onPrimaryContainer = Indigo900,
    secondary = Indigo600, onSecondary = White, secondaryContainer = Indigo50, onSecondaryContainer = Indigo900,
    tertiary = Emerald500, onTertiary = White, tertiaryContainer = Emerald50, onTertiaryContainer = Color(0xFF064E3B),
    error = Red500, onError = White, errorContainer = Red50, onErrorContainer = Color(0xFF7F1D1D),
    background = Color(0xFFF3F4F8), onBackground = Slate800,
    surface = Color(0xFFFCFCFD), onSurface = Slate800,
    surfaceVariant = Color(0xFFF0F1F5), onSurfaceVariant = Slate500,
    outline = Color(0xFFE6E8EC), outlineVariant = Color(0xFFEDEFF3),
    inverseSurface = Slate800, inverseOnSurface = Slate50, inversePrimary = Indigo300
)
private val DarkGlassScheme = darkColorScheme(
    primary = Indigo300, onPrimary = Indigo900, primaryContainer = Indigo700, onPrimaryContainer = Indigo50,
    secondary = Indigo300, onSecondary = Indigo900, secondaryContainer = Color(0xFF3730A3), onSecondaryContainer = Indigo50,
    tertiary = Emerald500, onTertiary = Color(0xFF022C22), tertiaryContainer = Color(0xFF064E3B), onTertiaryContainer = Emerald50,
    error = Color(0xFFFCA5A5), onError = Color(0xFF7F1D1D), errorContainer = Color(0xFF7F1D1D), onErrorContainer = Red50,
    background = Slate950, onBackground = Slate50,
    surface = Color(0xFF1A1D27), onSurface = Slate50,
    surfaceVariant = Color(0xFF252833), onSurfaceVariant = Slate400,
    outline = Color(0xFF2D313A), outlineVariant = Color(0xFF22252F),
    inverseSurface = Slate50, inverseOnSurface = Slate800, inversePrimary = Indigo600
)

@Composable
fun TopfoTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val colorScheme = if (darkTheme) DarkGlassScheme else LightGlassScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = !darkTheme
                isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }
    MaterialTheme(colorScheme = colorScheme, typography = TopfoTypography, content = content)
}
