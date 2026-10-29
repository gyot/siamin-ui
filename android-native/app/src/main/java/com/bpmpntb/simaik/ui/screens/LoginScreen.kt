package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.R
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
            .background(
                Brush.linearGradient(
                    listOf(LoginNavy1, LoginNavy2, LoginNavy3)
                )
            )
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 32.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                Modifier.padding(28.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Image(
                    painter = painterResource(R.drawable.logo),
                    contentDescription = "Logo SIMAIK",
                    modifier = Modifier.height(58.dp)
                )
                Text("Masuk dengan akun admin Anda", color = TextSecondary, fontSize = 14.sp)

                Spacer(Modifier.height(2.dp))

                WebTextField(identitas, { identitas = it }, "Username", "Masukkan username Anda")
                WebTextField(password, { password = it }, "Password", "••••••••", isPassword = true)

                s.error?.let {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(ErrorBg)
                            .border(1.dp, ErrorBorder, RoundedCornerShape(8.dp))
                            .padding(14.dp)
                    ) { Text(it, color = ErrorText, fontSize = 13.sp) }
                }

                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Brush.linearGradient(listOf(BtnBlue1, BtnBlue2)))
                        .clickable(enabled = !s.loading) { vm.login(identitas, password) { } },
                    contentAlignment = Alignment.Center
                ) {
                    if (s.loading) {
                        CircularProgressIndicator(Modifier.size(22.dp), color = Color.White)
                    } else {
                        Text("Login", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }
    }
}

@Composable
private fun WebTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String,
    isPassword: Boolean = false
) {
    var show by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth()) {
        Text(label, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF334155))
        Spacer(Modifier.height(6.dp))
        Box(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                .background(Color.White)
                .padding(horizontal = 14.dp, vertical = 12.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.weight(1f)) {
                    if (value.isEmpty()) {
                        Text(placeholder, color = Color(0xFF94A3B8), fontSize = 15.sp)
                    }
                    BasicTextField(
                        value = value,
                        onValueChange = onValueChange,
                        singleLine = true,
                        textStyle = TextStyle(fontSize = 15.sp, color = TextPrimary),
                        visualTransformation = if (isPassword && !show) PasswordVisualTransformation() else VisualTransformation.None,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                if (isPassword) {
                    IconButton(onClick = { show = !show }, Modifier.size(22.dp)) {
                        Icon(
                            if (show) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = null,
                            tint = Color(0xFF64748B)
                        )
                    }
                }
            }
        }
    }
}
