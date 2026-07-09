package com.topfo.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material.icons.outlined.Person
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Navigation route constants.
 * Web: index.html → admission/rankings/insights → files/file-qs-skills-2027
 * App:  Home → Admission/Rankings/Insights → Files/FileDetail
 *       Profile → Chat
 */
object Routes {
    // Bottom Nav tabs
    const val HOME = "home"
    const val RANKINGS = "rankings"
    const val FILES = "files"
    const val PROFILE = "profile"

    // Sub-screens (not in bottom nav)
    const val ADMISSION = "admission"
    const val INSIGHTS = "insights"
    const val FILE_DETAIL = "file_detail/{fileId}"
    const val CHAT = "chat"

    // Dialogs
    const val LOGIN = "login"

    fun fileDetail(fileId: String) = "file_detail/$fileId"
}

/**
 * Bottom navigation tab items — matches web's 4 nav cards + profile
 */
data class BottomNavItem(
    val route: String,
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
)

val bottomNavItems = listOf(
    BottomNavItem(
        route = Routes.HOME,
        label = "首页",
        selectedIcon = Icons.Filled.Home,
        unselectedIcon = Icons.Outlined.Home
    ),
    BottomNavItem(
        route = Routes.RANKINGS,
        label = "排名",
        selectedIcon = Icons.Filled.BarChart,
        unselectedIcon = Icons.Outlined.BarChart
    ),
    BottomNavItem(
        route = Routes.FILES,
        label = "文件",
        selectedIcon = Icons.Filled.Folder,
        unselectedIcon = Icons.Outlined.Folder
    ),
    BottomNavItem(
        route = Routes.PROFILE,
        label = "我的",
        selectedIcon = Icons.Filled.Person,
        unselectedIcon = Icons.Outlined.Person
    )
)
