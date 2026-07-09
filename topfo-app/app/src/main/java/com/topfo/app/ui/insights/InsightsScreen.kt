package com.topfo.app.ui.insights

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.topfo.app.ui.navigation.Routes
import com.topfo.app.ui.theme.*

@Composable
fun InsightsScreen(viewModel: InsightsViewModel, navController: NavController, modifier: Modifier = Modifier) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    Scaffold(topBar = { GlassTopBar("关键发现") }, modifier = modifier) { padding ->
        if (!state.isLoggedIn) { LockGate(onLoginClick = { navController.navigate(Routes.LOGIN) }, modifier = Modifier.padding(padding)) } else {
            Column(Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(horizontal = Dimens.screenPaddingHorizontal).padding(bottom = Dimens.xxxl)) {
                Spacer(Modifier.height(Dimens.sm)); Text("\uD83D\uDCCA 你的申请策略", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold); Text("基于 GPA ${state.gpa} / 雅思 ${state.ieltsTotal} 的深度分析", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(top = 4.dp)); Spacer(Modifier.height(Dimens.xl))
                state.findings.forEach { FindingCard(it); Spacer(Modifier.height(Dimens.md)) }
                Spacer(Modifier.height(Dimens.xl)); StrategySection(); Spacer(Modifier.height(Dimens.xl)); TimelineSection()
            }
        }
    }
}

@Composable
private fun LockGate(onLoginClick: () -> Unit, modifier: Modifier) { Box(modifier = modifier.fillMaxSize().padding(Dimens.xxxl), contentAlignment = Alignment.Center) { GlassCard(shape = Dimens.glassXl, contentPadding = PaddingValues(Dimens.xxxl)) { Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) { Box(Modifier.size(80.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) { Text("\uD83D\uDD12", fontSize = 36.sp) }; Spacer(Modifier.height(Dimens.xl)); Text("此页面内容需要登录", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center); Spacer(Modifier.height(Dimens.md)); Text("登录后即可查看基于个人数据的\n关键发现与申请策略分析", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center, lineHeight = 22.sp); Spacer(Modifier.height(Dimens.xxl)); GlassButton(onClick = onLoginClick, modifier = Modifier.fillMaxWidth(), label = "登录") } } } }

@Composable
private fun FindingCard(item: InsightItem) { val nc = when (item.label) { "critical" -> Red500; "important" -> Amber500; "success" -> Emerald500; else -> MaterialTheme.colorScheme.primary }; GlassCard(Modifier.fillMaxWidth(), contentPadding = PaddingValues(Dimens.lg)) { Row { Box(Modifier.size(36.dp).clip(CircleShape).background(nc.copy(alpha = 0.12f)), contentAlignment = Alignment.Center) { Text("${item.num}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = nc) }; Spacer(Modifier.width(Dimens.md)); Column(Modifier.weight(1f)) { Text(item.title, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, lineHeight = 22.sp); Spacer(Modifier.height(6.dp)); Text(item.desc, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 20.sp) } } } }

@Composable
private fun StrategySection() { Text("🎯 三维策略", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold); Spacer(Modifier.height(Dimens.md)); StrategyCard("冲刺",Red500,"多大分校区（UTM/UTSC）\n皇后大学（Q-Bridge EAP）"); Spacer(Modifier.height(Dimens.sm)); StrategyCard("现实目标",Amber500,"麦马 MELD\n渥太华大学\nSFU（FIC桥梁）\nUBC Okanagan"); Spacer(Modifier.height(Dimens.sm)); StrategyCard("保底",Emerald500,"温莎大学（ELIP）\n曼尼托巴大学（ELSP）\n纽芬兰纪念大学（ESL）") }

@Composable
private fun StrategyCard(title: String, color: Color, content: String) { GlassCard(Modifier.fillMaxWidth(), contentPadding = PaddingValues(Dimens.lg)) { Row { Box(Modifier.width(4.dp).height(48.dp).clip(RoundedCornerShape(2.dp)).background(color)); Spacer(Modifier.width(Dimens.md)); Column { Text(title, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = color); Spacer(Modifier.height(4.dp)); Text(content, fontSize = 13.sp, lineHeight = 20.sp) } } } }

@Composable
private fun TimelineSection() { Text("📅 时间规划", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold); Spacer(Modifier.height(Dimens.md)); val tl = listOf(TL("7-8月","雅思冲刺","集中攻克听力和阅读，目标从5.0提升至6.5",Red500),TL("9月","准备文书","打磨个人陈述和推荐信",Amber500),TL("10-12月","递交申请","完成网申和材料提交",Indigo600),TL("2027年1-3月","等待录取","关注邮件和申请状态",Emerald500)); tl.forEachIndexed { i, t -> TimelineRow(t, i == tl.lastIndex) } }
private data class TL(val time: String, val title: String, val desc: String, val color: Color)

@Composable
private fun TimelineRow(item: TL, isLast: Boolean) { Row(Modifier.fillMaxWidth().padding(bottom = 4.dp)) { Column(Modifier.width(32.dp), horizontalAlignment = Alignment.CenterHorizontally) { Box(Modifier.size(12.dp).clip(CircleShape).background(item.color)); if (!isLast) Box(Modifier.width(2.dp).height(44.dp).background(Slate200)) }; Spacer(Modifier.width(Dimens.md)); Column(Modifier.weight(1f).padding(bottom = if (isLast) 0.dp else Dimens.lg)) { Text(item.time, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = item.color); Text(item.title, fontSize = 15.sp, fontWeight = FontWeight.SemiBold); Text(item.desc, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 18.sp) } } }
