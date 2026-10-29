package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.SertifikatBatchItem
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun SertifikatScreen(vm: MainViewModel, kegiatanId: Int? = null) {
    val s = vm.state
    val isPer = kegiatanId != null && kegiatanId > 0
    LaunchedEffect(kegiatanId) {
        vm.loadSertifikat()
        if (isPer) { vm.loadDetail(kegiatanId!!); vm.loadPenugasan() }
    }

    if (!isPer) {
        ListPage("Sertifikat", s.loading, s.error, s.sertifikatList.isEmpty()) {
            items(s.sertifikatList, key = { it.id_batch ?: 0 }) { b -> SertifikatRow(b) }
        }
        return
    }

    // Per kegiatan: info sertifikat khusus kegiatan (akses creator/panitia)
    val myId = vm.currentPegawaiId
    val k = s.kegiatanDetail
    val canView = (k?.id_pegawai == myId || k?.created_by == myId) ||
        s.penugasanList.any { it.id_kegiatan == kegiatanId && it.id_pegawai == myId && (it.peran ?: "").equals("panitia", true) }
    val cert = s.sertifikatList.find { it.id_kegiatan == kegiatanId }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Text("Info Sertifikat", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 2.dp))
        Text(k?.nama_kegiatan ?: "Kegiatan", fontSize = 12.sp, color = TextSecondary,
            modifier = Modifier.padding(start = 16.dp, bottom = 10.dp), maxLines = 2)
        HorizontalDivider(color = Border)

        if (!canView) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Hanya pembuat kegiatan atau panitia yang dapat melihat info sertifikat.",
                    color = TextSecondary, modifier = Modifier.padding(24.dp))
            }
            return
        }

        Column(Modifier.padding(16.dp)) {
            WebCard {
                Text("Sertifikat Kegiatan", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                Spacer(Modifier.height(12.dp))
                if (cert != null) {
                    InfoRow("Nomor Sertifikat", cert.nomor_sertifikat ?: "-")
                    Spacer(Modifier.height(10.dp))
                    InfoRow("Tanggal TTD", cert.tanggal_ttd ?: "-")
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Info, null, tint = Color(0xFFF59E0B), modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(10.dp))
                        Column {
                            Text("Sertifikat belum dibuat.", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
                            Text("Sertifikat untuk kegiatan ini belum diterbitkan.", fontSize = 12.sp, color = TextSecondary)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SertifikatRow(b: SertifikatBatchItem) {
    WebCard {
        Text(b.nomor_sertifikat ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
        Spacer(Modifier.height(4.dp))
        Text("Kegiatan #${b.id_kegiatan ?: "-"}", fontSize = 13.sp, color = TextSecondary)
        Text("TTD: ${b.tanggal_ttd ?: "-"}", fontSize = 12.sp, color = TextSecondary)
    }
}
