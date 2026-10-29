package com.bpmpntb.simaik

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.bpmpntb.simaik.ui.screens.DashboardScreen
import com.bpmpntb.simaik.ui.screens.KegiatanDetailScreen
import com.bpmpntb.simaik.ui.screens.KegiatanListScreen
import com.bpmpntb.simaik.ui.screens.ProfileScreen

private data class Tab(val route: String, val label: String, val icon: ImageVector)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminShell(vm: MainViewModel, deepLinkId: Int, onLogout: () -> Unit) {
    val innerNav = rememberNavController()
    val tabs = listOf(
        Tab("dashboard", "Dashboard", Icons.Default.Dashboard),
        Tab("kegiatan", "Kegiatan", Icons.Default.Event),
        Tab("profil", "Profil", Icons.Default.Person),
    )

    LaunchedEffect(deepLinkId) {
        if (deepLinkId > 0) {
            innerNav.navigate("kegiatan/$deepLinkId")
        }
    }

    Scaffold(
        bottomBar = {
            NavigationBar {
                val backStack by innerNav.currentBackStackEntryAsState()
                val current = backStack?.destination?.route
                tabs.forEach { tab ->
                    NavigationBarItem(
                        selected = current == tab.route ||
                            (tab.route == "kegiatan" && current?.startsWith("kegiatan") == true),
                        onClick = {
                            innerNav.navigate(tab.route) {
                                popUpTo(innerNav.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(tab.icon, contentDescription = tab.label) },
                        label = { Text(tab.label) }
                    )
                }
            }
        }
    ) { pad ->
        NavHost(
            innerNav,
            startDestination = "dashboard",
            modifier = Modifier.padding(pad)
        ) {
            composable("dashboard") { DashboardScreen(vm) }
            composable("kegiatan") {
                KegiatanListScreen(vm, onOpen = { id -> innerNav.navigate("kegiatan/$id") })
            }
            composable("kegiatan/{id}") { back ->
                val id = back.arguments?.getString("id")?.toIntOrNull() ?: -1
                KegiatanDetailScreen(vm, id, onBack = { innerNav.popBackStack() })
            }
            composable("profil") { ProfileScreen(vm, onLogout = onLogout) }
        }
    }
}
