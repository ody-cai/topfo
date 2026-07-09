package com.topfo.app.ui.admission

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.topfo.app.data.model.ProgramEntity
import com.topfo.app.data.model.SchoolEntity
import com.topfo.app.ui.theme.*

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AdmissionScreen(viewModel: AdmissionViewModel, onBack: () -> Unit) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    Scaffold(topBar = { GlassTopBar("录取对照表", onBack) }) { padding ->
        Column(Modifier.padding(padding)) {
            AnimatedVisibility(!state.isLoggedIn) { GlassCard(Modifier.fillMaxWidth(), shape = Dimens.glassSm, color = Indigo50, contentPadding = PaddingValues(Dimens.md)) { Row(verticalAlignment = Alignment.CenterVertically) { Text("\uD83D\uDD12", fontSize = 16.sp); Spacer(Modifier.width(Dimens.sm)); Text("登录后可查看GPA匹配标签", fontSize = 13.sp, color = Indigo600) } } }
            ScrollableTabRow(selectedTabIndex = viewModel.tiers.indexOfFirst { it.first == state.selectedTier }.coerceAtLeast(0), modifier = Modifier.padding(horizontal = Dimens.sm), edgePadding = 8.dp, divider = {}) { viewModel.tiers.forEach { (k, l) -> Tab(selected = k == state.selectedTier, onClick = { viewModel.selectTier(k) }, text = { Text(l, fontSize = 13.sp, color = if (k == state.selectedTier) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant) }) } }
            LazyColumn(contentPadding = PaddingValues(Dimens.lg), verticalArrangement = Arrangement.spacedBy(Dimens.md)) {
                item { FlowRow(horizontalArrangement = Arrangement.spacedBy(Dimens.sm)) { viewModel.programOptions.forEach { (k, l) -> FilterChip(selected = k == state.selectedProgram, onClick = { viewModel.selectProgram(k) }, label = { Text(l, fontSize = 12.sp) }) } } }
                if (state.isLoading) item { Box(Modifier.fillMaxWidth().padding(Dimens.xxxl), contentAlignment = Alignment.Center) { CircularProgressIndicator() } }
                items(state.schools) { SchoolCard(it, state.programs[it.id] ?: emptyList(), state.isLoggedIn, state.userGpa) }
            }
        }
    }
}

@Composable
private fun SchoolCard(school: SchoolEntity, programs: List<ProgramEntity>, showMatch: Boolean, userGpa: Double) {
    var expanded by remember { mutableStateOf(false) }
    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        onClick = { expanded = !expanded },
        contentPadding = PaddingValues(Dimens.lg)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(school.name, fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
                Spacer(Modifier.height(2.dp))
                Text("${school.city} · ${school.province}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Icon(if (expanded) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown, "expand", tint = Slate400)
        }
        Spacer(Modifier.height(Dimens.sm))
        Row {
            GlassChip("\uD83D\uDCC5 ${school.deadline}")
            Spacer(Modifier.width(Dimens.sm))
            GlassChip("\uD83D\uDCB0 ${school.tuitionRMB}/年")
        }
        AnimatedVisibility(expanded) {
            Column {
                Spacer(Modifier.height(Dimens.md))
                HorizontalDivider(color = Slate200, thickness = Dimens.dividerThickness)
                Spacer(Modifier.height(Dimens.sm))
                programs.forEach {
                    ProgramRow(it, showMatch, userGpa)
                    Spacer(Modifier.height(6.dp))
                }
            }
        }
    }
}

@Composable
private fun ProgramRow(prog: ProgramEntity, showMatch: Boolean, userGpa: Double) {
    var showNote by remember { mutableStateOf(false) }
    val mc = when (prog.label) { "ok" -> Emerald500; "close" -> Amber500; "hard" -> Red500; else -> Slate400 }
    val mt = when (prog.label) { "ok" -> "✓够"; "close" -> "≈近"; "hard" -> "✗难"; else -> "—" }
    Surface(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(Dimens.glassSm), color = MaterialTheme.colorScheme.surfaceVariant) {
        Column(Modifier.padding(Dimens.md)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(prog.programName, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                if (showMatch) { Spacer(Modifier.width(Dimens.sm)); Surface(shape = RoundedCornerShape(4.dp), color = mc.copy(alpha = 0.12f)) { Text(mt, Modifier.padding(horizontal = 6.dp, vertical = 2.dp), fontSize = 11.sp, color = mc, fontWeight = FontWeight.Bold) } }
            }
            Spacer(Modifier.height(4.dp))
            Row { Text("GPA: ${prog.gpa}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant); Spacer(Modifier.width(Dimens.sm)); Text("IELTS: ${prog.ielts}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant) }
            if (prog.dual != "no") {
                Spacer(Modifier.height(2.dp))
                Row { GlassChip("\uD83D\uDD11 ${prog.dualType}: ${prog.dualThreshold}"); if (prog.coop == "yes") { Spacer(Modifier.width(4.dp)); GlassChip("\uD83D\uDCBC Co-op") } }
            }
            if (prog.note.isNotEmpty()) Text(prog.note, fontSize = 11.sp, color = Slate400)
            AnimatedVisibility(showNote && prog.noteDetail.isNotEmpty()) { Text(prog.noteDetail, fontSize = 12.sp, color = Slate600, modifier = Modifier.padding(top = 4.dp)) }
        }
    }
}
