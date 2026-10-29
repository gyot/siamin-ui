package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
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
import com.bpmpntb.simaik.api.PenugasanItem
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun PenugasanScreen(vm: MainViewModel) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadPenugasan() }
    var search by remember { mutableStateOf("") }
    var peran by remember { mutableStateOf("semua") }

    val rows = s.penugasanList.filter {
        (peran == "semua" || (it.peran ?: "").equals(peran, true)) &&
            (search.isBlank() || (it.nama_pegawai ?: "").contains(search, true) || (it.nama_kegiatan ?: "").contains(search, true))
    }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Text(
            "Data Penugasan Pegawai",
            fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 4.dp)
        )
        Text(
            "Lihat dan filter data penugasan pegawai.",
            fontSize = 12.sp, color = TextSecondary,
            modifier = Modifier.padding(start = 16.dp, bottom = 12.dp)
        )
        HorizontalDivider(color = Border)

        // Search + filter peran
        Column(Modifier.padding(12.dp)) {
            Row(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(24.dp)).background(ChipBg)
                    .padding(horizontal = 14.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Search, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
                OutlinedTextField(
                    value = search, onValueChange = { search = it },
                    placeholder = { Text("Cari pegawai / kegiatan...", color = TextSecondary, fontSize = 14.sp) },
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color.Transparent, unfocusedBorderColor = Color.Transparent),
                    singleLine = true, modifier = Modifier.weight(1f)
                )
            }
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("semua" to "Semua", "panitia" to "Panitia", "peserta" to "Peserta", "narasumber" to "Narasumber", "pendamping" to "Pendamping").forEach { (v, label) ->
                    FilterChip(selected = peran == v, onClick = { peran = v }, label = { Text(label, fontSize = 11.sp) })
                }
            }
        }

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading && s.penugasanList.isEmpty() -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null && s.penugasanList.isEmpty() -> Text(s.error ?: "", color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                rows.isEmpty() -> Text("Tidak ada penugasan.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(rows, key = { it.id ?: 0 }) { p -> PenugasanCard(p) }
                }
            }
        }
    }
}

@Composable
private fun PenugasanCard(p: PenugasanItem) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(0.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(p.nama_pegawai ?: "Pegawai #${p.id_pegawai ?: "-"}", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary, modifier = Modifier.weight(1f))
                p.peran?.let { Chip(it.replaceFirstChar { c -> c.uppercase() }) }
            }
            Text(p.nama_kegiatan ?: "Kegiatan #${p.id_kegiatan ?: "-"}", fontSize = 13.sp, color = TextSecondary)
            Text(
                listOfNotNull(p.tanggal_mulai, p.tanggal_selesai).joinToString(" - ").ifBlank { "-" },
                fontSize = 12.sp, color = TextSecondary
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.LocationOn, null, tint = TextSecondary, modifier = Modifier.size(14.dp))
                Spacer(Modifier.width(4.dp))
                Text(
                    listOfNotNull(p.lokasi, p.kab_kota?.let { "($it)" }).joinToString(" ").ifBlank { "-" },
                    fontSize = 12.sp, color = TextSecondary
                )
            }
        }
    }
}
