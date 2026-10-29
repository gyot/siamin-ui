package com.bpmpntb.simaik

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.bpmpntb.simaik.ui.screens.*
import kotlinx.coroutines.launch

private data class Section(val route: String, val label: String, val icon: ImageVector)

private val sections = listOf(
    Section("dashboard", "Dashboard", Icons.Default.Dashboard),
    Section("kegiatan", "Kegiatan", Icons.Default.Event),
    Section("peserta", "Peserta", Icons.Default.Group),
    Section("pegawai", "Pegawai", Icons.Default.People),
    Section("penugasan", "Penugasan", Icons.Default.Assignment),
    Section("sertifikat", "Sertifikat", Icons.Default.CardMembership),
    Section("profil", "Profil", Icons.Default.Person),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminShell(vm: MainViewModel, deepLinkId: Int, onLogout: () -> Unit) {
    val innerNav = rememberNavController()
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val backStack by innerNav.currentBackStackEntryAsState()
    val currentRoute = backStack?.destination?.route
    val currentTitle = sections.find {
        it.route == currentRoute || (it.route == "kegiatan" && currentRoute?.startsWith("kegiatan") == true)
    }?.label ?: "SIMAIK"

    LaunchedEffect(deepLinkId) {
        if (deepLinkId > 0) innerNav.navigate("kegiatan/$deepLinkId")
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                Text(
                    "SIMAIK",
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(20.dp)
                )
                sections.forEach { sec ->
                    NavigationDrawerItem(
                        label = { Text(sec.label) },
                        icon = { Icon(sec.icon, contentDescription = sec.label) },
                        selected = currentRoute == sec.route ||
                            (sec.route == "kegiatan" && currentRoute?.startsWith("kegiatan") == true),
                        onClick = {
                            scope.launch { drawerState.close() }
                            innerNav.navigate(sec.route) {
                                popUpTo(innerNav.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text(currentTitle) },
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Default.Menu, contentDescription = "Menu")
                        }
                    }
                )
            }
        ) { pad ->
            NavHost(
                innerNav,
                startDestination = "dashboard",
                modifier = Modifier.padding(pad)
            ) {
                composable("dashboard") { DashboardScreen(vm, onOpen = { id -> innerNav.navigate("kegiatan/$id") }) }
                composable("kegiatan") { KegiatanListScreen(vm, onOpen = { id -> innerNav.navigate("kegiatan/$id") }) }
                composable("kegiatan/{id}") { back ->
                    val id = back.arguments?.getString("id")?.toIntOrNull() ?: -1
                    KegiatanDetailScreen(vm, id, onBack = { innerNav.popBackStack() }, onNavigate = { route -> innerNav.navigate(route) })
                }
                composable("pegawai") { PegawaiScreen(vm) }
                composable("peserta") { PesertaScreen(vm) }
                composable("penugasan") { PenugasanScreen(vm) }
                composable("sertifikat") { SertifikatScreen(vm) }
                composable("profil") { ProfileScreen(vm, onLogout = onLogout) }
            }
        }
    }
}
