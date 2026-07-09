package com.topfo.app.ui.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.topfo.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(viewModel: ChatViewModel, onBack: () -> Unit, modifier: Modifier = Modifier) {
    val state by viewModel.state.collectAsStateWithLifecycle(); val listState = rememberLazyListState()
    LaunchedEffect(Unit) { viewModel.loadHistory() }; LaunchedEffect(state.messages.size, state.isLoading) { if (state.messages.isNotEmpty() || state.isLoading) listState.animateScrollToItem(0) }
    Scaffold(topBar = { TopAppBar(title = { Text("AI 升学顾问") }, navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "返回") } }, actions = { TextButton(onClick = viewModel::clear) { Text("清除记录", color = Red500) } }, colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background, titleContentColor = MaterialTheme.colorScheme.onBackground)) }, bottomBar = { Surface(tonalElevation = 0.dp, shadowElevation = 0.dp, color = MaterialTheme.colorScheme.surface, border = androidx.compose.foundation.BorderStroke(0.5.dp, MaterialTheme.colorScheme.outlineVariant)) { Row(Modifier.fillMaxWidth().padding(Dimens.screenPaddingHorizontal, Dimens.md).navigationBarsPadding(), verticalAlignment = Alignment.CenterVertically) { OutlinedTextField(state.inputText, viewModel::setInput, Modifier.weight(1f), placeholder = { Text("输入消息...") }, maxLines = 3, shape = RoundedCornerShape(24.dp)); Spacer(Modifier.width(Dimens.sm)); IconButton(onClick = viewModel::send, enabled = state.inputText.isNotBlank() && !state.isLoading) { Icon(Icons.Filled.Send, "发送", tint = if (state.inputText.isNotBlank() && !state.isLoading) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant) } } } }, modifier = modifier) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            if (state.error != null) { Surface(Modifier.fillMaxWidth(), color = Red50) { Text(state.error ?: "", Modifier.padding(Dimens.md), color = Red500, style = MaterialTheme.typography.bodySmall) } }
            if (state.messages.isEmpty() && !state.isLoading) { Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Column(horizontalAlignment = Alignment.CenterHorizontally) { Text("\uD83E\uDD16", style = MaterialTheme.typography.displayLarge); Spacer(Modifier.height(Dimens.lg)); Text("你好！有什么可以帮你？", style = MaterialTheme.typography.titleMedium); Text("AI 升学顾问为你提供个性化建议", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } } } else { LazyColumn(modifier = Modifier.fillMaxSize(), state = listState, reverseLayout = true, verticalArrangement = Arrangement.spacedBy(Dimens.sm), contentPadding = PaddingValues(Dimens.lg)) { if (state.isLoading) { item { Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Start) { Box(Modifier.widthIn(max = 280.dp).clip(RoundedCornerShape(16.dp)).background(Slate100).padding(Dimens.md)) { Row(verticalAlignment = Alignment.CenterVertically) { Text("\uD83E\uDD16", style = MaterialTheme.typography.bodyMedium); Spacer(Modifier.width(Dimens.sm)); CircularProgressIndicator(Modifier.size(16.dp), strokeWidth = 2.dp, color = Slate400) } } } } }; items(state.messages.reversed()) { ChatBubble(it.role, it.content) } } }
        }
    }
}

@Composable
private fun ChatBubble(role: String, content: String) { val isUser = role == "user"; Row(Modifier.fillMaxWidth(), horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start) { Box(Modifier.widthIn(max = 280.dp).clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp, bottomStart = if (isUser) 16.dp else 4.dp, bottomEnd = if (isUser) 4.dp else 16.dp)).background(if (isUser) Indigo50 else Slate100).padding(Dimens.md)) { Column { if (!isUser) { Text("\uD83E\uDD16 AI", style = MaterialTheme.typography.labelSmall, color = Slate500); Spacer(Modifier.height(4.dp)) }; Text(content, style = MaterialTheme.typography.bodyMedium) } } } }
