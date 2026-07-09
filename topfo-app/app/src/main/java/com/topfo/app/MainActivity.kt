package com.topfo.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.material3.windowsizeclass.ExperimentalMaterial3WindowSizeClassApi
import androidx.compose.material3.windowsizeclass.WindowWidthSizeClass
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.topfo.app.ui.admission.AdmissionScreen
import com.topfo.app.ui.admission.AdmissionViewModel
import com.topfo.app.ui.chat.ChatScreen
import com.topfo.app.ui.chat.ChatViewModel
import com.topfo.app.ui.files.FileDetailScreen
import com.topfo.app.ui.files.FilesScreen
import com.topfo.app.ui.files.FilesViewModel
import com.topfo.app.ui.home.HomeScreen
import com.topfo.app.ui.home.HomeViewModel
import com.topfo.app.ui.insights.InsightsScreen
import com.topfo.app.ui.insights.InsightsViewModel
import com.topfo.app.ui.profile.ProfileScreen
import com.topfo.app.ui.profile.ProfileViewModel
import com.topfo.app.ui.rankings.RankingsScreen
import com.topfo.app.ui.rankings.RankingsViewModel
import com.topfo.app.ui.theme.*

class MainActivity : ComponentActivity() {
    @OptIn(ExperimentalMaterial3WindowSizeClassApi::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val prefs = TopfoApplication.instance.prefs; var isDark by remember { mutableStateOf(prefs.isDarkTheme()) }
            TopfoTheme(darkTheme = isDark) {
                val wsc = calculateWindowSizeClass(this); val expanded = wsc.widthSizeClass == WindowWidthSizeClass.Expanded || wsc.widthSizeClass == WindowWidthSizeClass.Medium
                MainScreen(isExpandedScreen = expanded, isDark = isDark, onToggleDark = { isDark = it; prefs.saveDarkTheme(it) })
            }
        }
    }
}

@Composable
fun MainScreen(isExpandedScreen: Boolean = false, isDark: Boolean = false, onToggleDark: (Boolean) -> Unit = {}) {
    val app = TopfoApplication.instance; val navController = rememberNavController()
    val homeVM: HomeViewModel = viewModel(); val admissionVM: AdmissionViewModel = viewModel(); val rankingsVM: RankingsViewModel = viewModel()
    val insightsVM: InsightsViewModel = viewModel(); val filesVM: FilesViewModel = viewModel()
    val profileVM: ProfileViewModel = viewModel(factory = object : androidx.lifecycle.ViewModelProvider.Factory { @Suppress("UNCHECKED_CAST") override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T = ProfileViewModel(app.authRepo, app.versionRepo) as T })
    val homeState by homeVM.state.collectAsState(); val profileState by profileVM.state.collectAsState()

    LaunchedEffect(profileState.isLoggedIn) { if (profileState.isLoggedIn) { homeVM.onLoginSuccess(app.authRepo.getToken(), profileState.username); admissionVM.setLoggedIn(profileState.gpa, profileState.ieltsTotal); insightsVM.setLoggedIn(profileState.gpa, profileState.ieltsTotal) } }
    LaunchedEffect(homeState.isLoggedIn) { if (!homeState.isLoggedIn) admissionVM.setLoggedIn(89.6, 5.0) }

    val navTabs = listOf(NavTab("home","首页",Icons.Filled.Home,Icons.Outlined.Home),NavTab("rankings","排名",Icons.Filled.Leaderboard,Icons.Outlined.Leaderboard),NavTab("files","文件",Icons.Filled.Folder,Icons.Outlined.Folder),NavTab("profile","我的",Icons.Filled.Person,Icons.Outlined.Person))
    val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route; val showNav = currentRoute in navTabs.map { it.route }
    fun go(r: String) { if (currentRoute != r) navController.navigate(r) { popUpTo("home") { saveState = true }; launchSingleTop = true; restoreState = true } }

    @Composable fun NavHost_(modifier: Modifier = Modifier) { NavHost(navController, "home", modifier) {
        composable("home") { HomeScreen(navController, homeVM) }
        composable("admission") { LaunchedEffect(homeState.isLoggedIn) { if (homeState.isLoggedIn) admissionVM.setLoggedIn(profileState.gpa, profileState.ieltsTotal) }; AdmissionScreen(admissionVM, { navController.popBackStack() }) }
        composable("rankings") { RankingsScreen(rankingsVM) }
        composable("insights") { InsightsScreen(insightsVM, navController) }
        composable("files") { FilesScreen(filesVM, { filesVM.selectFile(it); navController.navigate("file-detail") }) }
        composable("file-detail") { FileDetailScreen(filesVM, { navController.popBackStack() }) }
        composable("profile") { ProfileScreen(profileVM, { navController.navigate("chat") }, { homeVM.onLogout(); navController.navigate("home") { popUpTo("home") { inclusive = true } } }) }
        composable("chat") { val chatVM: ChatViewModel = viewModel(factory = object : androidx.lifecycle.ViewModelProvider.Factory { @Suppress("UNCHECKED_CAST") override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T = ChatViewModel(app.chatRepo, app.authRepo::getToken) as T }); LaunchedEffect(Unit) { chatVM.loadHistory() }; ChatScreen(chatVM, { navController.popBackStack() }) }
    } }

    if (isExpandedScreen) {
        Row(Modifier.fillMaxSize()) { if (showNav) Surface(Modifier.fillMaxHeight().width(80.dp), color = MaterialTheme.colorScheme.surface, tonalElevation = 0.dp) { GlassNavRail(navTabs, currentRoute, ::go, isDark) { onToggleDark(!isDark) } }; NavHost_(Modifier.fillMaxSize()) }
    } else {
        Scaffold(bottomBar = { if (showNav) GlassNavBar(navTabs, currentRoute, ::go, isDark) { onToggleDark(!isDark) } }) { NavHost_(Modifier.padding(it)) }
    }

    if (profileState.showLogin) {
        var u by remember { mutableStateOf("") }
        var p by remember { mutableStateOf("") }
        GlassDialog(
            onDismiss = profileVM::hideLogin,
            title = "登录",
            onConfirm = { profileVM.login(u, p) },
            isLoading = profileState.isLoading,
            text = {
                Column {
                    OutlinedTextField(
                        value = u,
                        onValueChange = { v -> u = v },
                        label = { Text("用户名") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = p,
                        onValueChange = { v -> p = v },
                        label = { Text("密码") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation()
                    )
                    if (profileState.loginError != null) {
                        Spacer(Modifier.height(8.dp))
                        Text(profileState.loginError!!, color = Red500, fontSize = MaterialTheme.typography.bodySmall.fontSize)
                    }
                }
            }
        )
    }
}
