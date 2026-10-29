package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.SertifikatBatchItem
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun SertifikatScreen(vm: MainViewModel) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadSertifikat() }
    ListPage("Sertifikat", s.loading, s.error, s.sertifikatList.isEmpty()) {
        items(s.sertifikatList, key = { it.id_batch ?: 0 }) { b -> SertifikatRow(b) }
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
