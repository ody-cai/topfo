package com.topfo.app.ui.rankings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.topfo.app.ui.theme.*

@Composable
fun RankingsScreen(viewModel: RankingsViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    Scaffold(topBar = { GlassTopBar("排名参考") }) { padding ->
        Column(Modifier.padding(padding)) {
            ScrollableTabRow(selectedTabIndex = state.selectedTab, modifier = Modifier.padding(horizontal = Dimens.sm), edgePadding = 8.dp, divider = {}) { viewModel.tabs.forEachIndexed { i, t -> Tab(selected = i == state.selectedTab, onClick = { viewModel.selectTab(i) }, text = { Text(t.label, fontSize = 12.sp, color = if (i == state.selectedTab) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant) }) } }
            if (state.isLoading) { Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() } } else { LazyColumn(contentPadding = PaddingValues(Dimens.lg), verticalArrangement = Arrangement.spacedBy(Dimens.sm)) { itemsIndexed(state.rankings) { _, item -> RankingRow(item.rank, item.universityName, item.country, item.score) } } }
        }
    }
}

@Composable
private fun RankingRow(rank: Int, name: String, country: String, score: Double) { val isCanada = country == "加拿大"; GlassCard(Modifier.fillMaxWidth(), elevation = 0.dp, contentPadding = PaddingValues(Dimens.md)) { Row(verticalAlignment = Alignment.CenterVertically) { Box(Modifier.size(40.dp).clip(RoundedCornerShape(Dimens.chipRadius)).background(when { rank <= 10 -> Amber100; rank <= 50 -> Slate100; else -> Slate50 }), contentAlignment = Alignment.Center) { Text("#$rank", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = when { rank <= 10 -> Amber600; rank <= 50 -> Slate600; else -> Slate400 }) }; Spacer(Modifier.width(Dimens.md)); Column(Modifier.weight(1f)) { Text(name, fontSize = 15.sp, fontWeight = FontWeight.Medium); Spacer(Modifier.height(4.dp)); Row(verticalAlignment = Alignment.CenterVertically) { Box(Modifier.weight(1f).height(6.dp).clip(RoundedCornerShape(3.dp)).background(Slate100)) { Box(Modifier.fillMaxHeight().fillMaxWidth(((score / 100.0).coerceIn(0.0, 1.0)).toFloat()).clip(RoundedCornerShape(3.dp)).background(MaterialTheme.colorScheme.primary)) }; Spacer(Modifier.width(Dimens.sm)); Text("${"%.1f".format(score)}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary) } }; Spacer(Modifier.width(Dimens.sm)); Text(when (country) { "加拿大" -> "\uD83C\uDDE8\uD83C\uDDE6"; "美国" -> "\uD83C\uDDFA\uD83C\uDDF8"; "英国" -> "\uD83C\uDDEC\uD83C\uDDE7"; else -> "" }, fontSize = 20.sp) } } }
