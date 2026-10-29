package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun DashboardScreen(vm: MainViewModel) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadDashboard() }

    Column(Modifier.fillMaxSize().background(WebBg).verticalScroll(rememberScrollState())) {
        Text(
            "Dashboard",
            fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 12.dp)
        )
        HorizontalDivider(color = Border)

        if (s.loading && s.dashboard == null) {
            Box(Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            val d = s.dashboard
            Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatCard("Total Kegiatan", d?.total_kegiatan ?: 0, Color(0xFF1877F2), Modifier.weight(1f))
                    StatCard("Berjalan", d?.kegiatan_berjalan ?: 0, Color(0xFFF59E0B), Modifier.weight(1f))
                }
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatCard("Total Peserta", d?.total_peserta ?: 0, Color(0xFF22C55E), Modifier.weight(1f))
                    StatCard("Sertifikat Terbit", d?.total_sertifikat_terbit ?: 0, Color(0xFFA855F7), Modifier.weight(1f))
                }

                // Unit kerja
                d?.available_unit_kerja?.let { list ->
                    if (list.isNotEmpty()) {
                        WebCard {
                            Text("Unit Kerja", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Spacer(Modifier.height(10.dp))
                            list.forEach { u ->
                                Text("• $u", fontSize = 14.sp, color = TextSecondary, modifier = Modifier.padding(vertical = 3.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatCard(label: String, value: Int, accent: Color, modifier: Modifier) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(0.dp),
        border = BorderStroke(1.dp, Border),
        modifier = modifier
    ) {
        Column(Modifier.padding(18.dp)) {
            Text(value.toString(), fontSize = 30.sp, fontWeight = FontWeight.Bold, color = accent)
            Spacer(Modifier.height(4.dp))
            Text(label, fontSize = 13.sp, color = TextSecondary)
        }
    }
}

@Composable
fun WebCard(content: @Composable ColumnScope.() -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(0.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(16.dp), content = content)
    }
}
