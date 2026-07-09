package com.topfo.app.ui.theme

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ── GlassCard ──
@Composable
fun GlassCard(modifier: Modifier = Modifier, onClick: (() -> Unit)? = null, elevation: Dp = Dimens.cardElevation, shape: Dp = Dimens.cardRadius, color: Color = MaterialTheme.colorScheme.surface, contentPadding: PaddingValues = PaddingValues(Dimens.lg), content: @Composable () -> Unit) {
    val bg = if (onClick != null) animateColorAsState(targetValue = color, animationSpec = spring(stiffness = Spring.StiffnessLow)) else remember { mutableStateOf(color) }
    Card(onClick = onClick ?: {}, enabled = onClick != null, modifier = modifier, shape = RoundedCornerShape(shape), colors = CardDefaults.cardColors(containerColor = bg.value), elevation = CardDefaults.cardElevation(elevation), border = BorderStroke(0.5.dp, MaterialTheme.colorScheme.outlineVariant)) { Box(modifier = Modifier.padding(contentPadding)) { content() } }
}

// ── GlassTopBar ──
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GlassTopBar(title: String, onBack: (() -> Unit)? = null, actions: @Composable RowScope.() -> Unit = {}) {
    TopAppBar(title = { Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold) }, navigationIcon = { if (onBack != null) IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "返回") } }, actions = actions, colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background, titleContentColor = MaterialTheme.colorScheme.onBackground))
}

// ── NavTab + GlassNavBar + GlassNavRail ──
data class NavTab(val route: String, val label: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector)

@Composable
fun GlassNavBar(tabs: List<NavTab>, currentRoute: String?, onTabClick: (String) -> Unit, isDark: Boolean = false, onToggleDark: () -> Unit = {}) {
    NavigationBar(containerColor = MaterialTheme.colorScheme.surface, tonalElevation = 0.dp) {
        tabs.forEach { val selected = currentRoute == it.route; NavigationBarItem(selected = selected, onClick = { onTabClick(it.route) }, icon = { Icon(if (selected) it.selectedIcon else it.unselectedIcon, it.label) }, label = { Text(it.label, fontSize = 12.sp, fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal) }, colors = NavigationBarItemDefaults.colors(selectedIconColor = MaterialTheme.colorScheme.primary, selectedTextColor = MaterialTheme.colorScheme.primary, indicatorColor = MaterialTheme.colorScheme.primaryContainer, unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant)) }
        NavigationBarItem(selected = false, onClick = onToggleDark, icon = { Icon(if (isDark) Icons.Filled.LightMode else Icons.Filled.DarkMode, "切换主题") }, label = { Text(if (isDark) "浅色" else "深色", fontSize = 11.sp) }, colors = NavigationBarItemDefaults.colors(unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant, indicatorColor = Color.Transparent))
    }
}

@Composable
fun GlassNavRail(tabs: List<NavTab>, currentRoute: String?, onTabClick: (String) -> Unit, isDark: Boolean = false, onToggleDark: () -> Unit = {}) {
    NavigationRail(Modifier.fillMaxHeight().windowInsetsPadding(WindowInsets.statusBars).padding(top = 16.dp), containerColor = MaterialTheme.colorScheme.surface) {
        Spacer(Modifier.weight(1f))
        tabs.forEach { val selected = currentRoute == it.route; NavigationRailItem(selected = selected, onClick = { onTabClick(it.route) }, icon = { Icon(if (selected) it.selectedIcon else it.unselectedIcon, it.label) }, label = { Text(it.label, fontSize = 12.sp) }, colors = NavigationRailItemDefaults.colors(selectedIconColor = MaterialTheme.colorScheme.primary, indicatorColor = MaterialTheme.colorScheme.primaryContainer, unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant)) }
        Spacer(Modifier.weight(1f))
        IconButton(onClick = onToggleDark) { Icon(if (isDark) Icons.Filled.LightMode else Icons.Filled.DarkMode, "切换主题", tint = MaterialTheme.colorScheme.onSurfaceVariant) }
        Spacer(Modifier.height(16.dp))
    }
}

// ── GlassButton ──
enum class ButtonVariant { Primary, Secondary, Danger }

@Composable
fun GlassButton(onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true, variant: ButtonVariant = ButtonVariant.Primary, label: String, icon: ImageVector? = null, isLoading: Boolean = false) {
    when (variant) {
        ButtonVariant.Primary -> Button(onClick = onClick, modifier = modifier.height(Dimens.btnHeight), enabled = enabled && !isLoading, shape = RoundedCornerShape(Dimens.btnRadius), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary, disabledContainerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.4f)), contentPadding = PaddingValues(horizontal = 24.dp)) { if (isLoading) { CircularProgressIndicator(Modifier.size(18.dp), strokeWidth = 2.dp, color = White); Spacer(Modifier.width(8.dp)) }; if (icon != null && !isLoading) { Icon(icon, null, Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)) }; Text(label, fontWeight = FontWeight.SemiBold) }
        ButtonVariant.Secondary -> OutlinedButton(onClick = onClick, modifier = modifier.height(Dimens.btnHeight), enabled = enabled && !isLoading, shape = RoundedCornerShape(Dimens.btnRadius), border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) { if (isLoading) { CircularProgressIndicator(Modifier.size(18.dp), strokeWidth = 2.dp); Spacer(Modifier.width(8.dp)) }; if (icon != null && !isLoading) { Icon(icon, null, Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)) }; Text(label, fontWeight = FontWeight.Medium) }
        ButtonVariant.Danger -> OutlinedButton(onClick = onClick, modifier = modifier.height(Dimens.btnHeight), enabled = enabled, colors = ButtonDefaults.outlinedButtonColors(contentColor = Red500), border = BorderStroke(1.dp, Red500.copy(alpha = 0.3f))) { if (icon != null) { Icon(icon, null, Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)) }; Text(label, fontWeight = FontWeight.Medium) }
    }
}

// ── GlassChip ──
@Composable
fun GlassChip(label: String, modifier: Modifier = Modifier, selected: Boolean = false, onClick: (() -> Unit)? = null) {
    Surface(onClick = onClick ?: {}, enabled = onClick != null, modifier = modifier, shape = RoundedCornerShape(Dimens.chipRadius), color = if (selected) MaterialTheme.colorScheme.primary.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surfaceVariant, border = if (selected) BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)) else null) { Text(label, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), fontSize = 12.sp, fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal, color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant) }
}

// ── SectionHeader ──
@Composable
fun SectionHeader(title: String, modifier: Modifier = Modifier) { Text(title, modifier = modifier.padding(top = 8.dp, bottom = 4.dp), style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant, letterSpacing = 0.3.sp) }

// ── GlassDialog ──
@Composable
fun GlassDialog(onDismiss: (() -> Unit)? = null, title: String, text: @Composable () -> Unit, confirmLabel: String = "确定", onConfirm: () -> Unit = {}, dismissLabel: String? = "取消", isLoading: Boolean = false) {
    AlertDialog(onDismissRequest = { onDismiss?.invoke() }, shape = RoundedCornerShape(Dimens.glassLg), containerColor = MaterialTheme.colorScheme.surface, tonalElevation = 0.dp, title = { Text(title, fontWeight = FontWeight.Bold) }, text = text, confirmButton = { Button(onClick = onConfirm, enabled = !isLoading, colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)) { if (isLoading) CircularProgressIndicator(Modifier.size(16.dp), strokeWidth = 2.dp, color = White) else Text(confirmLabel) } }, dismissButton = { if (dismissLabel != null) TextButton(onClick = { onDismiss?.invoke() }, enabled = !isLoading) { Text(dismissLabel) } })
}

// ── GradientBackground ──
@Composable
fun GradientBackground(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val topColor = Indigo50.copy(alpha = 0.4f)
    Box(modifier = modifier.background(androidx.compose.ui.graphics.Brush.verticalGradient(listOf(topColor, MaterialTheme.colorScheme.background, MaterialTheme.colorScheme.background)))) { content() }
}
