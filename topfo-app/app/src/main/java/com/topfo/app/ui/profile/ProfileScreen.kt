package com.topfo.app.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material3.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.topfo.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(viewModel: ProfileViewModel, onNavigateToChat: () -> Unit, onLogout: () -> Unit, modifier: Modifier = Modifier) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    if (state.showLogin) { var u by rememberSaveable { mutableStateOf("") }; var p by rememberSaveable { mutableStateOf("") }; GlassDialog(onDismiss = viewModel::hideLogin, title = "登录", onConfirm = { viewModel.login(u, p) }, isLoading = state.isLoading, text = { Column(verticalArrangement = Arrangement.spacedBy(Dimens.md)) { OutlinedTextField(value = u, onValueChange = { newVal -> u = newVal }, label = { Text("用户名") }, modifier = Modifier.fillMaxWidth(), singleLine = true); OutlinedTextField(value = p, onValueChange = { newVal -> p = newVal }, label = { Text("密码") }, modifier = Modifier.fillMaxWidth(), singleLine = true, visualTransformation = PasswordVisualTransformation()); if (state.loginError != null) Text(state.loginError!!, color = Red500, style = MaterialTheme.typography.bodySmall) } }) }
    if (state.showEdit) { ModalBottomSheet(onDismissRequest = viewModel::hideEdit) { EditContent(state.gpa, state.ieltsListening, state.ieltsReading, state.ieltsWriting, state.ieltsSpeaking, viewModel::updateGpa, viewModel::updateIelts, viewModel::hideEdit) } }
    if (state.showUpdateDialog && state.versionInfo != null) { GlassDialog(onDismiss = viewModel::dismissUpdateDialog, title = "发现新版本", onConfirm = viewModel::confirmUpdate, confirmLabel = "立即更新", text = { Column { Text("v${state.versionInfo!!.versionName} (当前 v${state.currentVersion})", fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.primary); if (state.versionInfo!!.changelog.isNotBlank()) { Spacer(Modifier.height(Dimens.sm)); Text(state.versionInfo!!.changelog, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } } }) }
    if (state.isDownloading) { AlertDialog(onDismissRequest = {}, title = { Text("正在下载更新", fontWeight = FontWeight.Bold) }, text = { Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { CircularProgressIndicator(Modifier.size(24.dp), strokeWidth = 2.dp, color = MaterialTheme.colorScheme.primary); Text("正在后台下载，完成后自动弹出安装界面") } }, confirmButton = {}, dismissButton = {}) }
    if (state.downloadError != null) { GlassDialog(onDismiss = viewModel::dismissVersionMessage, title = "更新失败", onConfirm = viewModel::dismissVersionMessage, confirmLabel = "知道了", dismissLabel = null, text = { Text(state.downloadError!!) }) }

    Scaffold(topBar = { GlassTopBar("我的") }, modifier = modifier) { padding ->
        Column(Modifier.fillMaxWidth().padding(padding).padding(horizontal = Dimens.screenPaddingHorizontal).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(Dimens.lg)) {
            if (!state.isLoggedIn) { GuestProfile(state.loginError, viewModel::showLogin) } else {
                UserHeader(state.username)
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { ScoreCard(Modifier.weight(1f),"GPA",String.format("%.1f",state.gpa),Indigo600); ScoreCard(Modifier.weight(1f),"雅思总分",String.format("%.1f",state.ieltsTotal),Emerald500) }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { ScoreCard(Modifier.weight(1f),"听力",String.format("%.1f",state.ieltsListening),Amber500); ScoreCard(Modifier.weight(1f),"阅读",String.format("%.1f",state.ieltsReading),Amber500) }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { ScoreCard(Modifier.weight(1f),"写作",String.format("%.1f",state.ieltsWriting),Amber500); ScoreCard(Modifier.weight(1f),"口语",String.format("%.1f",state.ieltsSpeaking),Amber500) }
                GlassButton(onClick = viewModel::showEdit, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary, label = "编辑数据", icon = Icons.Filled.Edit)
                if (state.username == "caiqijun") GlassButton(onClick = onNavigateToChat, modifier = Modifier.fillMaxWidth(), label = "AI 升学顾问 🤖")
                GlassButton(onClick = viewModel::checkVersion, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary, label = if (state.isCheckingVersion) "检查中..." else "版本  v${state.currentVersion}", icon = Icons.Filled.SystemUpdate, isLoading = state.isCheckingVersion)
                state.versionMessage?.let { msg -> val ok = msg.contains("最新"); GlassCard(Modifier.fillMaxWidth(), color = if (ok) Emerald50 else Red50, contentPadding = PaddingValues(Dimens.md)) { Text(msg, style = MaterialTheme.typography.bodySmall, color = if (ok) Emerald600 else Red500) } }
                GlassButton(onClick = { viewModel.logout(); onLogout() }, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Danger, label = "退出登录", icon = Icons.AutoMirrored.Filled.Logout)
            }
            Spacer(Modifier.height(Dimens.lg))
        }
    }
}

@Composable
private fun GuestProfile(error: String?, onLogin: () -> Unit) { Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) { Spacer(Modifier.height(Dimens.xxxl)); Box(Modifier.size(96.dp).clip(CircleShape).background(Slate200.copy(alpha = 0.3f)), contentAlignment = Alignment.Center) { Icon(Icons.Filled.Person, null, Modifier.size(48.dp), tint = Slate400) }; Spacer(Modifier.height(Dimens.lg)); Text("未登录", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold); Spacer(Modifier.height(4.dp)); Text("登录后可查看个人数据、使用AI升学顾问", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant); Spacer(Modifier.height(Dimens.lg)); GlassButton(onClick = onLogin, label = "登录") } }

@Composable
private fun UserHeader(username: String) { Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) { Spacer(Modifier.height(Dimens.lg)); Box(Modifier.size(80.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primary), contentAlignment = Alignment.Center) { Text(username.takeIf { it.isNotEmpty() }?.first()?.uppercase() ?: "?", style = MaterialTheme.typography.headlineMedium, color = White, fontWeight = FontWeight.Bold) }; Spacer(Modifier.height(Dimens.md)); Text(username, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) } }

@Composable
private fun ScoreCard(modifier: Modifier, label: String, score: String, accentColor: Color) { GlassCard(modifier = modifier, shape = Dimens.glassMd, contentPadding = PaddingValues(Dimens.lg)) { Box(Modifier.width(32.dp).height(3.dp).clip(RoundedCornerShape(2.dp)).background(accentColor)); Spacer(Modifier.height(Dimens.sm)); Text(label, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant); Text(score, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold) } }

@Composable
private fun EditContent(gpa: Double, l: Double, r: Double, w: Double, s: Double, upGpa: (Double)->Unit, upIelts: (Double,Double,Double,Double)->Unit, onDismiss: () -> Unit) { var g by rememberSaveable { mutableStateOf(gpa.toString()) }; var li by rememberSaveable { mutableStateOf(l.toString()) }; var re by rememberSaveable { mutableStateOf(r.toString()) }; var wr by rememberSaveable { mutableStateOf(w.toString()) }; var sp by rememberSaveable { mutableStateOf(s.toString()) }; Column(Modifier.fillMaxWidth().padding(Dimens.xl), verticalArrangement = Arrangement.spacedBy(Dimens.md)) { Text("编辑个人数据", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold); OutlinedTextField(value = g, onValueChange = { newVal -> g = newVal }, label = { Text("GPA") }, modifier = Modifier.fillMaxWidth(), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)); Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { OutlinedTextField(value = li, onValueChange = { newVal -> li = newVal }, label = { Text("听力") }, modifier = Modifier.weight(1f), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)); OutlinedTextField(value = re, onValueChange = { newVal -> re = newVal }, label = { Text("阅读") }, modifier = Modifier.weight(1f), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)) }; Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(Dimens.md)) { OutlinedTextField(value = wr, onValueChange = { newVal -> wr = newVal }, label = { Text("写作") }, modifier = Modifier.weight(1f), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)); OutlinedTextField(value = sp, onValueChange = { newVal -> sp = newVal }, label = { Text("口语") }, modifier = Modifier.weight(1f), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)) }; Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) { TextButton(onClick = onDismiss) { Text("取消") }; Spacer(Modifier.width(Dimens.sm)); Button(onClick = { upGpa(g.toDoubleOrNull()?:0.0); upIelts(li.toDoubleOrNull()?:0.0, re.toDoubleOrNull()?:0.0, wr.toDoubleOrNull()?:0.0, sp.toDoubleOrNull()?:0.0); onDismiss() }) { Text("保存") } } } }
