package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
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
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun DashboardScreen(vm: MainViewModel, onOpen: (Int) -> Unit) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadDashboard(); vm.loadKegiatan() }
    var search by remember { mutableStateOf("") }
    var filter by remember { mutableStateOf("semua") }

    val kegiatan = s.kegiatanList.filter {
        (filter == "semua" || (it.status ?: "").equals(filter, true)) &&
            (search.isBlank() || (it.nama_kegiatan ?: "").contains(search, true))
    }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Row(
            Modifier.horizontalScroll(rememberScrollState()).padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            StatColored("Total Kegiatan", "${s.dashboard?.total_kegiatan ?: 0}", Color(0xFF1877F2))
            StatColored("Berjalan", "${s.dashboard?.kegiatan_berjalan ?: 0}", Color(0xFFF59E0B))
            StatColored("Total Peserta", "${s.dashboard?.total_peserta ?: 0}", Color(0xFF22C55E))
            StatColored("Sertifikat", "${s.dashboard?.total_sertifikat_terbit ?: 0}", Color(0xFFA855F7))
        }

        Row(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color(0xFFF0F2F5))
                .padding(horizontal = 14.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Search, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
            OutlinedTextField(
                value = search,
                onValueChange = { search = it },
                placeholder = { Text("Cari kegiatan...", color = TextSecondary, fontSize = 15.sp) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color.Transparent,
                    unfocusedBorderColor = Color.Transparent
                ),
                singleLine = true,
                modifier = Modifier.weight(1f)
            )
        }

        Row(Modifier.padding(horizontal = 12.dp, vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("semua" to "Semua", "draft" to "Draft", "berjalan" to "Berjalan", "selesai" to "Selesai").forEach { (v, label) ->
                FilterChip(selected = filter == v, onClick = { filter = v }, label = { Text(label, fontSize = 12.sp) })
            }
        }

        if (s.loading && s.kegiatanList.isEmpty()) {
            Box(Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
        } else if (kegiatan.isEmpty()) {
            Text("Tidak ada kegiatan.", color = TextSecondary, modifier = Modifier.padding(24.dp))
        } else {
            LazyColumn(
                contentPadding = PaddingValues(start = 12.dp, end = 12.dp, bottom = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(kegiatan, key = { it.id_kegiatan }) { k -> KegiatanCard(k) { onOpen(k.id_kegiatan) } }
            }
        }
    }
}

@Composable
private fun StatColored(label: String, value: String, bg: Color) {
    Column(
        Modifier
            .size(width = 150.dp, height = 92.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(bg)
            .padding(14.dp)
    ) {
        Text(value, color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(4.dp))
        Text(label, color = Color.White.copy(alpha = 0.9f), fontSize = 12.sp)
    }
}

@Composable
private fun KegiatanCard(k: Kegiatan, onClick: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(0.dp),
        border = BorderStroke(1.dp, Border),
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(k.nama_kegiatan ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                k.status?.let { Chip(it.replaceFirstChar { c -> c.uppercase() }) }
            }
            Text(
                listOfNotNull(k.tanggal_mulai, k.tanggal_selesai).joinToString(" s/d ").ifBlank { "-" },
                fontSize = 13.sp, color = TextSecondary
            )
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
