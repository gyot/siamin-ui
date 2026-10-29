package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
fun KegiatanListScreen(vm: MainViewModel, onOpen: (Int) -> Unit) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadKegiatan() }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        // Header putih ala web
        Column(Modifier.fillMaxWidth().background(Color.White)) {
            Text(
                "Kegiatan",
                fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
                modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 12.dp)
            )
            HorizontalDivider(color = Border)
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(ChipBg)
                    .padding(horizontal = 14.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Search, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Cari kegiatan...", color = TextSecondary, fontSize = 15.sp)
            }
        }

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null -> Text(
                    s.error ?: "", color = ErrorText,
                    modifier = Modifier.align(Alignment.Center).padding(24.dp)
                )
                s.kegiatanList.isEmpty() -> Text(
                    "Belum ada kegiatan.", color = TextSecondary,
                    modifier = Modifier.align(Alignment.Center)
                )
                else -> LazyColumn(
                    contentPadding = PaddingValues(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(s.kegiatanList, key = { it.id_kegiatan }) { k ->
                        KegiatanCard(k) { onOpen(k.id_kegiatan) }
                    }
                }
            }
        }
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
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(k.nama_kegiatan ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                k.status?.let { Chip(it.replaceFirstChar { c -> c.uppercase() }) }
                k.metode_pelaksanaan?.let { Chip(it) }
            }
            Text(
                listOfNotNull(k.tanggal_mulai, k.tanggal_selesai).joinToString(" s/d ").ifBlank { "-" },
                fontSize = 13.sp, color = TextSecondary
            )
        }
    }
}

@Composable
fun Chip(text: String) {
    Box(
        Modifier
            .clip(RoundedCornerShape(50))
            .background(ChipBg)
            .padding(horizontal = 10.dp, vertical = 3.dp)
    ) {
        Text(text, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
    }
}
