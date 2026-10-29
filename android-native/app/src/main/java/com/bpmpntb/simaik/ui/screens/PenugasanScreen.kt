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
import com.bpmpntb.simaik.api.PenugasanItem
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun PenugasanScreen(vm: MainViewModel) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadPenugasan() }
    ListPage("Penugasan", s.loading, s.error, s.penugasanList.isEmpty()) {
        items(s.penugasanList, key = { it.id ?: 0 }) { p -> PenugasanRow(p) }
    }
}

@Composable
private fun PenugasanRow(p: PenugasanItem) {
    WebCard {
        Text(p.nama_pegawai ?: "Pegawai #${p.id_pegawai ?: "-"}", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
        Spacer(Modifier.height(4.dp))
        Text(p.nama_kegiatan ?: "Kegiatan #${p.id_kegiatan ?: "-"}", fontSize = 13.sp, color = TextSecondary)
        p.peran?.let {
            Spacer(Modifier.height(6.dp))
            Chip(it.replaceFirstChar { c -> c.uppercase() })
        }
    }
}
