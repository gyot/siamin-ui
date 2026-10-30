package com.bpmpntb.simaik

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.bpmpntb.simaik.ui.screens.KegiatanDetailScreen
import com.bpmpntb.simaik.ui.screens.KegiatanListScreen
import com.bpmpntb.simaik.ui.screens.LandingScreen
import com.bpmpntb.simaik.ui.screens.LoginScreen
import com.bpmpntb.simaik.ui.screens.DaftarScreen
import com.bpmpntb.simaik.ui.theme.SIMAIKTheme
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : ComponentActivity() {
    private val vm: MainViewModel by viewModels()
    private var deepLinkId = mutableStateOf(-1)

    private val notifPermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        deepLinkId.value = intent.getIntExtra("id_kegiatan", -1)

        setContent {
            SIMAIKTheme {
                AppRoot(vm, deepLinkId.value) { deepLinkId.value = -1 }
            }
        }

        requestNotifPermission()
        fetchFcmToken()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        deepLinkId.value = intent.getIntExtra("id_kegiatan", -1)
    }

    private fun requestNotifPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                notifPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }

    private fun fetchFcmToken() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                task.result?.let { vm.registerPush(it) }
            }
        }
    }
}

@androidx.compose.runtime.Composable
fun AppRoot(vm: MainViewModel, deepLinkId: Int, onDeepLinkConsumed: () -> Unit) {
    val nav = rememberNavController()
    val start = "landing"

    LaunchedEffect(deepLinkId) {
        if (deepLinkId > 0) {
            nav.navigate("admin") { popUpTo("landing") { inclusive = true } }
            onDeepLinkConsumed()
        }
    }

    NavHost(navController = nav, startDestination = start) {
        composable("landing") {
            LandingScreen(vm, onLogin = { nav.navigate(if (vm.isLoggedIn) "admin" else "login") }, onDaftar = { nav.navigate("register") })
        }
        composable("login") {
            LoginScreen(vm) {
                nav.navigate("admin") { popUpTo("login") { inclusive = true } }
            }
        }
        composable("register") {
            DaftarScreen(
                vm,
                onBack = { nav.popBackStack() },
                onRegistered = { nav.navigate("login") { popUpTo("register") { inclusive = true } } }
            )
        }
        composable("admin") {
            AdminShell(
                vm = vm,
                deepLinkId = deepLinkId,
                onLogout = { nav.navigate("landing") { popUpTo(0) { inclusive = true } } }
            )
        }
    }
}
