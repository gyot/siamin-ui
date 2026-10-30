package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.ui.theme.*
import com.bpmpntb.simaik.data.Session

@Composable
fun PengesahanScreen(vm: MainViewModel, onLihatPeserta: (Int) -> Unit) {
    val s = vm.state
    val session = remember { Session(vm.getApplication<android.app.Application>()) }
    val isKepala = (session.jabatan ?: "").contains("kepala", true)
    LaunchedEffect(Unit) { vm.loadKegiatan(); vm.loadSertifikatSemua() }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Text("Pengesahan", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 2.dp))
        Text("Kegiatan dengan sertifikat menunggu pengesahan", fontSize = 12.sp, color = TextSecondary, modifier = Modifier.padding(start = 16.dp, bottom = 10.dp))
        HorizontalDivider(color = Border)

        if (!isKepala) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Halaman ini khusus untuk jabatan Kepala.", color = TextSecondary, modifier = Modifier.padding(24.dp))
            }
            return
        }

        // Kelompokkan sertifikat belum terbit per kegiatan
        val pending = s.sertifikatGlobalList.filter { !(it.status ?: "").equals("terbit", true) }
        val byKegiatan = pending.groupBy { it.id_kegiatan }
        val kegiatanMenunggu = byKegiatan.mapNotNull { (kid, items) ->
            val k = s.kegiatanList.find { it.id_kegiatan == kid } ?: return@mapNotNull null
            val draft = items.count { (it.status ?: "").equals("draft", true) }
            val dicabut = items.count { (it.status ?: "").equals("dicabut", true) }
            Triple(k, items.size, draft to dicabut)
        }.sortedByDescending { it.second }

        if (kegiatanMenunggu.isEmpty()) {
            Box(Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) {
                Text("Tidak ada pengesahan tertunda.", color = TextSecondary)
            }
        } else {
            LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(kegiatanMenunggu, key = { it.first.id_kegiatan }) { (k, total, rincian) ->
                    PengesahanCard(k, total, rincian.first, rincian.second) { onLihatPeserta(k.id_kegiatan) }
                }
            }
        }
    }
}

@Composable
private fun PengesahanCard(k: Kegiatan, total: Int, draft: Int, dicabut: Int, onLihatPeserta: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(k.nama_kegiatan ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary, modifier = Modifier.weight(1f))
                Box(Modifier.clip(RoundedCornerShape(50)).background(Color(0xFFF59E0B).copy(alpha = 0.15f)).padding(horizontal = 10.dp, vertical = 3.dp)) {
                    Text("$total belum terbit", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFF59E0B))
                }
            }
            Text(listOfNotNull(k.tanggal_mulai, k.tanggal_selesai).joinToString(" - "), fontSize = 12.sp, color = TextSecondary)
            Text(k.lokasi ?: "-", fontSize = 12.sp, color = TextSecondary)
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                if (draft > 0) RincianChip("$draft draft", Color(0xFFF59E0B))
                if (dicabut > 0) RincianChip("$dicabut dicabut", Color(0xFFDC2626))
            }
            Text("Lihat Peserta", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = AccentBlue, modifier = Modifier.clickable { onLihatPeserta() })
        }
    }
}

@Composable
private fun RincianChip(text: String, color: Color) {
    Box(Modifier.clip(RoundedCornerShape(50)).background(color.copy(alpha = 0.12f)).padding(horizontal = 8.dp, vertical = 2.dp)) {
        Text(text, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = color)
    }
}
