package com.topfo.app.ui.home

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.topfo.app.ui.theme.*

@Composable
fun HomeScreen(navController: NavController, viewModel: HomeViewModel, modifier: Modifier = Modifier) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    GradientBackground(modifier = modifier.fillMaxSize()) {
        LazyColumn(contentPadding = PaddingValues(Dimens.screenPaddingHorizontal, Dimens.md, Dimens.screenPaddingHorizontal, Dimens.screenPaddingVertical), verticalArrangement = Arrangement.spacedBy(Dimens.lg)) {
            item { Column { Text("topfo", style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Bold, letterSpacing = (-1).sp), color = MaterialTheme.colorScheme.primary); Text("加拿大升学数据平台", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant) } }
            item { AnimatedVisibility(state.isLoggedIn, enter = fadeIn(), exit = fadeOut()) { if (state.isLoggedIn) DashboardCard(state) }; AnimatedVisibility(!state.isLoggedIn, enter = fadeIn(), exit = fadeOut()) { if (!state.isLoggedIn) LoginBanner { navController.navigate("profile") } } }
            item { SectionHeader("功能导航") }
            item { Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { ModuleCard(Modifier.weight(1f), "\uD83D\uDCCB", "录取对照表", "26所院校·9大专业方向") { navController.navigate("admission") }; ModuleCard(Modifier.weight(1f), "\uD83C\uDFC6", "排名参考", "QS/THE/US News") { navController.navigate("rankings") } } }
            item { Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { ModuleCard(Modifier.weight(1f), "\uD83D\uDCC1", "文件中心", "报告下载与解读") { navController.navigate("files") }; ModuleCard(Modifier.weight(1f), "\uD83D\uDCA1", "关键发现", "10大升学发现") { navController.navigate("insights") } } }
            item { AnimatedVisibility(state.isLoggedIn, enter = fadeIn(), exit = fadeOut()) { if (state.isLoggedIn) ThreePhasePlanCard() } }
        }
    }
}

@Composable
private fun DashboardCard(state: HomeUiState) { GlassCard(Modifier.fillMaxWidth()) { Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { Box(Modifier.size(44.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primary), contentAlignment = Alignment.Center) { Text(state.username.firstOrNull()?.uppercase() ?: "?", style = MaterialTheme.typography.titleMedium, color = White) }; Column { Text("你好，${state.username}", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold); Text("当前阶段: 1/3", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary) } }; Spacer(Modifier.height(Dimens.md)); HorizontalDivider(color = Slate200, thickness = Dimens.dividerThickness); Spacer(Modifier.height(Dimens.md)); Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { StatChip(Modifier.weight(1f), "GPA", "${state.gpa}", "目标 90+", (state.gpa / 100.0).toFloat(), Indigo600); StatChip(Modifier.weight(1f), "雅思", "${state.ieltsTotal}", "目标 6.5", (state.ieltsTotal / 6.5).toFloat().coerceIn(0f, 1f), Emerald500) } } }

@Composable
private fun StatChip(modifier: Modifier, label: String, value: String, target: String, progress: Float, accentColor: Color) { GlassCard(modifier = modifier, shape = Dimens.glassSm, color = MaterialTheme.colorScheme.surfaceVariant, contentPadding = PaddingValues(Dimens.md)) { Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) { Box(Modifier.size(8.dp).clip(CircleShape).background(accentColor)); Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant) }; Spacer(Modifier.height(Dimens.sm)); Text(value, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold); Spacer(Modifier.height(4.dp)); Text(target, style = MaterialTheme.typography.bodySmall, color = Slate400); Spacer(Modifier.height(Dimens.sm)); LinearProgressIndicator(progress = { progress }, modifier = Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)), color = accentColor, trackColor = Slate200) } }

@Composable
private fun LoginBanner(onLogin: () -> Unit) { GlassCard(Modifier.fillMaxWidth(), color = Indigo50) { Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) { Column(Modifier.weight(1f)) { Text("登录后可查看个人数据匹配", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Medium); Spacer(Modifier.height(4.dp)); Text("GPA / 雅思 / 阶段规划", style = MaterialTheme.typography.bodySmall, color = Slate500) }; Spacer(Modifier.width(Dimens.md)); GlassButton(onClick = onLogin, label = "登录") } } }

@Composable
private fun ModuleCard(modifier: Modifier, icon: String, title: String, subtitle: String, onClick: () -> Unit) { GlassCard(modifier = modifier.height(120.dp), onClick = onClick) { Column(Modifier.fillMaxSize(), verticalArrangement = Arrangement.Center) { Text(icon, style = MaterialTheme.typography.headlineSmall); Spacer(Modifier.height(Dimens.sm)); Text(title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold); Spacer(Modifier.height(2.dp)); Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1) } } }

@Composable
private fun ThreePhasePlanCard() { GlassCard(Modifier.fillMaxWidth()) { Text("三阶段规划", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold); Spacer(Modifier.height(Dimens.md)); PhaseItem(1,"GPA冲刺","89.6 → 90+","进行中",true); HorizontalDivider(color = Slate200, thickness = Dimens.dividerThickness, modifier = Modifier.padding(vertical = Dimens.md)); PhaseItem(2,"雅思突破","5.0 → 6.5","待开始",false); HorizontalDivider(color = Slate200, thickness = Dimens.dividerThickness, modifier = Modifier.padding(vertical = Dimens.md)); PhaseItem(3,"申请递交","2026年9-12月","待开始",false) } }

@Composable
private fun PhaseItem(stage: Int, title: String, detail: String, status: String, isActive: Boolean) { Row(verticalAlignment = Alignment.CenterVertically) { Box(Modifier.size(36.dp).clip(CircleShape).background(if (isActive) Indigo600 else Slate200), contentAlignment = Alignment.Center) { Text("$stage", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = if (isActive) White else Slate500) }; Spacer(Modifier.width(Dimens.md)); Column(Modifier.weight(1f)) { Text(title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Medium); Text(detail, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) }; Surface(shape = RoundedCornerShape(6.dp), color = if (isActive) Emerald50 else Slate100) { Text(status, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp), style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Medium, color = if (isActive) Emerald500 else Slate500) } } }
