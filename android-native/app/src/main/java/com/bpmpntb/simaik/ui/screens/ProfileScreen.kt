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

    Column(Modifier.fillMaxSize().background(WebBg).verticalScroll(rememberScrollState())) {
        Text(
            "Profil",
            fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 12.dp)
        )
        HorizontalDivider(color = Border)

        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            WebCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        Modifier.size(56.dp).clip(RoundedCornerShape(28.dp)).background(AccentBlue),
                        contentAlignment = Alignment.Center
                    ) { Icon(Icons.Default.Person, null, tint = Color.White, modifier = Modifier.size(30.dp)) }
                    Spacer(Modifier.width(14.dp))
                    Column {
                        Text(session.nama ?: "Pengguna", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        Text(
                            if (s.loginAs == "admin") "Administrator" else "Peserta",
                            fontSize = 13.sp, color = TextSecondary
                        )
                    }
                }
            }

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Border),
                modifier = Modifier.fillMaxWidth().clickable {
                    vm.logout(); onLogout()
                }
            ) {
                Text(
                    "Keluar",
                    color = ErrorText, fontSize = 15.sp, fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.fillMaxWidth().padding(16.dp)
                )
            }
        }
    }
}
