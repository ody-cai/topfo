package com.topfo.app.ui.files

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.topfo.app.ui.theme.*

@Composable
fun FilesScreen(viewModel: FilesViewModel, onFileClick: (FileItem) -> Unit, modifier: Modifier = Modifier) {
    val state by viewModel.state.collectAsState()
    LazyColumn(modifier = modifier.fillMaxSize(), contentPadding = PaddingValues(Dimens.screenPaddingHorizontal), verticalArrangement = Arrangement.spacedBy(Dimens.lg)) {
        item { Spacer(Modifier.height(Dimens.sm)); Text("\uD83D\uDCC1 文件中心", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold); Spacer(Modifier.height(4.dp)); Text("研究报告下载与解读", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant); Spacer(Modifier.height(Dimens.lg)) }
        items(state.files) { FileCard(it, onClick = { onFileClick(it) }) }
        item { Spacer(Modifier.height(Dimens.xxxl)); Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) { Text("\uD83D\uDCC2", fontSize = 32.sp); Spacer(Modifier.height(Dimens.sm)); Text("更多报告即将添加", fontSize = 14.sp, color = Slate400); Text("请关注后续更新", fontSize = 12.sp, color = Slate300) } }
    }
}

@Composable
private fun FileCard(file: FileItem, onClick: () -> Unit, modifier: Modifier = Modifier) { GlassCard(modifier = modifier.fillMaxWidth(), onClick = onClick, contentPadding = PaddingValues(Dimens.lg)) { Row(verticalAlignment = Alignment.CenterVertically) { Text("\uD83D\uDCC4", fontSize = 28.sp); Spacer(Modifier.width(Dimens.md)); Column(Modifier.weight(1f)) { Text(file.title, fontSize = 16.sp, fontWeight = FontWeight.SemiBold); Spacer(Modifier.height(4.dp)); Row { GlassChip(file.source); Spacer(Modifier.width(Dimens.sm)); GlassChip("${file.pages}页"); Spacer(Modifier.width(Dimens.sm)); GlassChip(file.size) } } }; Spacer(Modifier.height(Dimens.md)); Text(file.summary, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 18.sp, maxLines = 3); Spacer(Modifier.height(Dimens.md)); Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) { GlassButton(onClick = onClick, variant = ButtonVariant.Secondary, label = "\uD83D\uDCD6 查看解读"); Spacer(Modifier.width(Dimens.sm)); GlassButton(onClick = {}, label = "\uD83D\uDCE5 下载PDF") } } }
