package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Visibility
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
import com.bpmpntb.simaik.api.PegawaiItem
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun PegawaiScreen(vm: MainViewModel) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadPegawai() }
    var search by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("semua") }
    var golongan by remember { mutableStateOf("semua") }
    var detail by remember { mutableStateOf<PegawaiItem?>(null) }

    val golonganList = s.pegawaiList.mapNotNull { it.golongan }.distinct().sorted()
    val rows = s.pegawaiList.filter {
        (status == "semua" || (it.status ?: "").equals(status, true)) &&
            (golongan == "semua" || (it.golongan ?: "") == golongan) &&
            (search.isBlank() || (it.nama ?: "").contains(search, true))
    }
    val aktif = s.pegawaiList.count { (it.status ?: "").equals("aktif", true) }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Text(
            "Manajemen Pegawai & User",
            fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 4.dp)
        )
        Text(
            "Kelola data pegawai dan akun user admin.",
            fontSize = 12.sp, color = TextSecondary,
            modifier = Modifier.padding(start = 16.dp, bottom = 12.dp)
        )
        HorizontalDivider(color = Border)

        // Statistik
        Row(Modifier.padding(12.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            MiniStat("Total Pegawai", "${s.pegawaiList.size}", Color(0xFF1877F2), Modifier.weight(1f))
            MiniStat("Pegawai Aktif", "$aktif", Color(0xFF059669), Modifier.weight(1f))
        }

        // Search + filter
        Column(Modifier.padding(horizontal = 12.dp)) {
            Row(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(24.dp)).background(ChipBg)
                    .padding(horizontal = 14.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Search, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
                OutlinedTextField(
                    value = search, onValueChange = { search = it },
                    placeholder = { Text("Cari nama...", color = TextSecondary, fontSize = 14.sp) },
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color.Transparent, unfocusedBorderColor = Color.Transparent),
                    singleLine = true, modifier = Modifier.weight(1f)
                )
            }
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("semua" to "Semua", "aktif" to "Aktif", "nonaktif" to "Nonaktif").forEach { (v, label) ->
                    FilterChip(selected = status == v, onClick = { status = v }, label = { Text(label, fontSize = 11.sp) })
                }
            }
            Spacer(Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("semua", "III/a", "III/b", "III/c", "III/d", "IV/a", "IV/b", "IV/c").forEach { g ->
                    FilterChip(selected = golongan == g, onClick = { golongan = g }, label = { Text(g, fontSize = 11.sp) })
                }
            }
        }

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading && s.pegawaiList.isEmpty() -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null && s.pegawaiList.isEmpty() -> Text(s.error ?: "", color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                rows.isEmpty() -> Text("Tidak ada pegawai.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(rows, key = { it.id_pegawai ?: 0 }) { p -> PegawaiCard(p, onDetail = { detail = p }) }
                }
            }
        }
    }

    detail?.let { p -> PegawaiDetailModal(p) { detail = null } }
}

@Composable
private fun MiniStat(label: String, value: String, color: Color, modifier: Modifier) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = modifier
    ) {
        Column(Modifier.padding(14.dp)) {
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = color)
            Spacer(Modifier.height(2.dp))
            Text(label, fontSize = 12.sp, color = TextSecondary)
        }
    }
}

@Composable
private fun PegawaiDetailModal(p: PegawaiItem, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Detail Pegawai", fontWeight = FontWeight.Bold) },
        text = {
            Column(Modifier.verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                SectionHeader("Informasi Kepegawaian")
                DetailRow("Nama", p.nama ?: "-")
                DetailRow("NIP", p.nip ?: "-")
                DetailRow("Jabatan", p.nama_jabatan ?: "-")
                DetailRow("Pangkat", p.pangkat ?: "-")
                DetailRow("Golongan", p.golongan ?: "-")
                DetailRow("Status Kepegawaian", p.status_kepegawaian ?: "-")
                DetailRow("Unit Kerja", p.unit_kerja ?: "-")
                DetailRow("PDM", p.pdm_detail ?: "-")
                HorizontalDivider(color = Border)
                SectionHeader("Informasi Pribadi")
                DetailRow("Tempat Lahir", p.tempat_lahir ?: "-")
                DetailRow("Tanggal Lahir", p.tanggal_lahir ?: "-")
                HorizontalDivider(color = Border)
                SectionHeader("Informasi Pendidikan")
                DetailRow("Pendidikan Terakhir", p.pendidikan_terakhir ?: "-")
                DetailRow("Jurusan", p.jurusan ?: "-")
                DetailRow("Tempat Pendidikan", p.tempat_pendidikan ?: "-")
                DetailRow("Tahun Lulus", p.tahun_lulus ?: "-")
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Tutup") } }
    )
}

@Composable
private fun SectionHeader(title: String) {
    Text(title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = AccentBlue)
}

@Composable
private fun DetailRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth()) {
        Text(label, fontSize = 12.sp, color = TextSecondary, modifier = Modifier.width(120.dp))
        Text(value, fontSize = 12.sp, color = TextPrimary, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
    }
}

@Composable
private fun PegawaiCard(p: PegawaiItem, onDetail: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(p.nama ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary, modifier = Modifier.weight(1f))
                    p.status?.let {
                        Box(Modifier.clip(RoundedCornerShape(50)).background((if (it.equals("aktif", true)) Color(0xFF059669) else Color(0xFF94A3B8)).copy(alpha = 0.15f)).padding(horizontal = 8.dp, vertical = 2.dp)) {
                            Text(it.replaceFirstChar { c -> c.uppercase() }, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = if (it.equals("aktif", true)) Color(0xFF059669) else TextSecondary)
                        }
                    }
                }
                Text("NIP: ${p.nip ?: "-"}", fontSize = 12.sp, color = TextSecondary)
                Text(p.nama_jabatan ?: "-", fontSize = 13.sp, color = TextSecondary)
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    p.golongan?.let { Chip("Gol $it") }
                    p.unit_kerja?.let { Chip(it) }
                }
            }
            IconButton(onClick = onDetail) { Icon(Icons.Default.Visibility, "Lihat Detail", tint = AccentBlue) }
        }
    }
}

@Composable
fun ListPage(
    title: String,
    loading: Boolean,
    error: String?,
    empty: Boolean,
    content: LazyListScope.() -> Unit
) {
    Column(Modifier.fillMaxSize().background(WebBg)) {
        Text(
            title,
            fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 12.dp)
        )
        HorizontalDivider(color = Border)
        Box(Modifier.fillMaxSize()) {
            when {
                loading -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                error != null -> Text(error, color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                empty -> Text("Tidak ada data.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(
                    contentPadding = PaddingValues(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    content = content
                )
            }
        }
    }
}
