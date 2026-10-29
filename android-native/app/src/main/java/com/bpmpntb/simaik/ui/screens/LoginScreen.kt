package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun LoginScreen(vm: MainViewModel, onLoggedIn: () -> Unit) {
    var identitas by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val s = vm.state

    LaunchedEffect(s.loggedIn) { if (s.loggedIn) onLoggedIn() }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Navy, NavyDeep)))
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text("SIMAIK", fontSize = 34.sp, fontWeight = FontWeight.Bold, color = Navy)
                Text(
                    "Sistem Informasi Administrasi Manajemen Kegiatan",
                    fontSize = 13.sp, color = OnSurface.copy(alpha = 0.7f)
                )
                Spacer(Modifier.height(8.dp))

                OutlinedTextField(
                    value = identitas,
                    onValueChange = { identitas = it },
                    label = { Text("Email / Username") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth()
                )

                s.error?.let {
                    Text(it, color = MaterialTheme.colorScheme.error, fontSize = 13.sp)
                }

                Button(
                    onClick = { vm.login(identitas, password) { } },
                    enabled = !s.loading,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    if (s.loading) {
                        CircularProgressIndicator(Modifier.size(22.dp), color = MaterialTheme.colorScheme.onPrimary)
                    } else {
                        Text("Masuk", fontSize = 16.sp)
                    }
                }
            }
        }
    }
}
