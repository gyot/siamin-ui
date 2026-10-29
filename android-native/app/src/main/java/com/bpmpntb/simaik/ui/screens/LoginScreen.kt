package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel

// Palet LoginUnified.vue
private val PageBg = Color(0xFFF0F2F5)
private val Blue = Color(0xFF1877F2)
private val TextDark = Color(0xFF050505)
private val TextGray = Color(0xFF65676B)
private val FieldBg = Color(0xFFF0F2F5)

@Composable
fun LoginScreen(vm: MainViewModel, onLoggedIn: () -> Unit) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val s = vm.state

    LaunchedEffect(s.loggedIn) { if (s.loggedIn) onLoggedIn() }

    Column(
        Modifier
            .fillMaxSize()
            .background(PageBg)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(24.dp))

        Box(
            Modifier.size(64.dp).clip(RoundedCornerShape(16.dp)).background(Blue),
            contentAlignment = Alignment.Center
        ) { Text("S", color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Bold) }

        Spacer(Modifier.height(16.dp))
        Text("SIMAIK", color = TextDark, fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(4.dp))
        Text("Sistem Manajemen Informasi Kegiatan", color = TextGray, fontSize = 13.sp)

        Spacer(Modifier.height(28.dp))

        Column(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(Color.White)
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Field(username, { username = it }, "Username atau Email", false)
            Field(password, { password = it }, "Password", true)

            s.error?.let {
                Text(it, color = Color(0xFFEF4444), fontSize = 13.sp, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
            }

            Box(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Blue)
                    .clickable(enabled = !s.loading) { vm.login(username, password) { } }
                    .padding(vertical = 14.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    if (s.loading) "Masuk..." else "Masuk",
                    color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold
                )
            }

            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
                Text("Belum punya akun? ", color = TextGray, fontSize = 13.sp)
                Text("Daftar", color = Blue, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
            }
        }

        Spacer(Modifier.height(24.dp))
        Text("BPMP Provinsi NTB", color = TextGray, fontSize = 12.sp)
        Spacer(Modifier.height(16.dp))
    }
}

@Composable
private fun Field(value: String, onValueChange: (String) -> Unit, placeholder: String, isPassword: Boolean) {
    Box(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(FieldBg)
            .padding(horizontal = 16.dp, vertical = 14.dp)
    ) {
        if (value.isEmpty()) {
            Text(placeholder, color = TextGray, fontSize = 15.sp)
        }
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            singleLine = true,
            textStyle = TextStyle(fontSize = 15.sp, color = TextDark),
            visualTransformation = if (isPassword) PasswordVisualTransformation() else VisualTransformation.None,
            modifier = Modifier.fillMaxWidth()
        )
    }
}
