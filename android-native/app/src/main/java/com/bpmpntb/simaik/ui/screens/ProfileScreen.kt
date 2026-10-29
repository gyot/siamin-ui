package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun ProfileScreen(vm: MainViewModel, onLogout: () -> Unit) {
    val s = vm.state
    val session = remember { com.bpmpntb.simaik.data.Session(vm.getApplication<android.app.Application>()) }

    val nama = session.nama ?: "Pengguna"
    val role = session.role ?: if (s.loginAs == "admin") "Administrator" else "Peserta"

    Column(Modifier.fillMaxSize().background(WebBg).verticalScroll(rememberScrollState())) {
        // Header hero (gradient + avatar)
        Box(
            Modifier.fillMaxWidth()
                .background(Brush.verticalGradient(listOf(LoginNavy1, LoginNavy2, LoginNavy3)))
                .padding(20.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier.size(72.dp).clip(RoundedCornerShape(36.dp)).background(Color.White.copy(alpha = 0.18f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(nama.take(1).uppercase(), color = Color.White, fontSize = 30.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.width(16.dp))
                Column {
                    Text(nama, color = Color.White, fontSize = 19.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(2.dp))
                    Box(
                        Modifier.clip(RoundedCornerShape(50)).background(Color(0xFFFACC15))
                            .padding(horizontal = 10.dp, vertical = 3.dp)
                    ) {
                        Text(role.replaceFirstChar { it.uppercase() }, color = LoginNavy1, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                    session.jabatan?.let {
                        Spacer(Modifier.height(4.dp))
                        Text(it, color = Color.White.copy(alpha = 0.85f), fontSize = 12.sp)
                    }
                }
            }
        }

        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            // Data diri
            WebCard {
                Text("Data Diri", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                Spacer(Modifier.height(12.dp))
                ProfileRow("Nama Lengkap", nama)
                ProfileRow("NIP", session.nip ?: "-")
                ProfileRow("Email", session.email ?: "-")
                ProfileRow("Username", session.username ?: "-")
            }

            // Info kepegawaian
            WebCard {
                Text("Informasi Kepegawaian", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                Spacer(Modifier.height(12.dp))
                ProfileRow("Jabatan", session.jabatan ?: "-")
                ProfileRow("Golongan", session.golongan ?: "-")
                ProfileRow("Unit Kerja", session.unitKerja ?: "-")
                ProfileRow("Role", role)
            }

            // Tombol keluar
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(4.dp),
                border = BorderStroke(1.dp, Border),
                modifier = Modifier.fillMaxWidth().clickable { vm.logout(); onLogout() }
            ) {
                Row(
                    Modifier.fillMaxWidth().padding(16.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Keluar", color = ErrorText, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun ProfileRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
        Text(label, color = TextSecondary, fontSize = 13.sp, modifier = Modifier.width(120.dp))
        Text(value, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
    }
    HorizontalDivider(color = Border, thickness = 0.5.dp)
}
