package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.ui.theme.*
import com.bpmpntb.simaik.util.QrImage
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun DashboardScreen(vm: MainViewModel, onOpen: (Int) -> Unit, onPeserta: (Int) -> Unit) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadDashboard(); vm.loadKegiatan() }
    var search by remember { mutableStateOf("") }
    var filter by remember { mutableStateOf("semua") }

    val kegiatan = s.kegiatanList.filter {
        (filter == "semua" || displayStatusKey(it) == filter) &&
            (search.isBlank() || (it.nama_kegiatan ?: "").contains(search, true))
    }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Row(
            Modifier.horizontalScroll(rememberScrollState()).padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            StatColored("Kegiatan", "${s.dashboard?.total_kegiatan ?: 0}", Color(0xFF1877F2))
            StatColored("Peserta", "${s.dashboard?.total_peserta ?: 0}", Color(0xFF059669))
            StatColored("Sertifikat", "${s.dashboard?.total_sertifikat_terbit ?: 0}", Color(0xFFA855F7))
            StatColored("Berjalan", "${s.dashboard?.kegiatan_berjalan ?: 0}", Color(0xFFF59E0B))
        }

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(4.dp),
            border = BorderStroke(1.dp, Border),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp)
        ) {
            Column(Modifier.padding(12.dp)) {
                Row(
                    Modifier.fillMaxWidth().clip(RoundedCornerShape(24.dp)).background(ChipBg)
                        .padding(horizontal = 14.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Search, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
                    OutlinedTextField(
                        value = search, onValueChange = { search = it },
                        placeholder = { Text("Cari kegiatan...", color = TextSecondary, fontSize = 15.sp) },
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color.Transparent, unfocusedBorderColor = Color.Transparent),
                        singleLine = true, modifier = Modifier.weight(1f)
                    )
                }
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("semua" to "Semua", "berjalan" to "Berjalan", "akan_datang" to "Akan Datang", "selesai" to "Selesai").forEach { (v, label) ->
                        FilterChip(selected = filter == v, onClick = { filter = v }, label = { Text(label, fontSize = 11.sp) })
                    }
                }
            }
        }

        Spacer(Modifier.height(4.dp))

        if (s.loading && s.kegiatanList.isEmpty()) {
            Box(Modifier.fillMaxWidth().padding(48.dp), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
        } else if (kegiatan.isEmpty()) {
            Text("Tidak ada kegiatan.", color = TextSecondary, modifier = Modifier.padding(24.dp))
        } else {
            LazyColumn(
                contentPadding = PaddingValues(start = 12.dp, end = 12.dp, bottom = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(kegiatan, key = { it.id_kegiatan }) { k ->
                    KegiatanDashboardCard(
                        k,
                        onDetail = { onOpen(k.id_kegiatan) },
                        onPeserta = { onPeserta(k.id_kegiatan) }
                    )
                }
            }
        }
    }
}

@Composable
private fun KegiatanDashboardCard(k: Kegiatan, onDetail: () -> Unit, onPeserta: () -> Unit) {
    val (statusLabel, statusColor) = displayStatus(k)
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(verticalAlignment = Alignment.Top) {
                    Box(
                        Modifier.size(44.dp).clip(CircleShape).background(Color(0xFFF59E0B)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            (k.nama_kegiatan ?: "K").take(1).uppercase(),
                            color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(Modifier.width(10.dp))
                    Column(Modifier.weight(1f)) {
                        Text(k.nama_kegiatan ?: "-", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary, lineHeight = 20.sp)
                        Spacer(Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(formatRange(k.tanggal_mulai, k.tanggal_selesai), fontSize = 12.sp, color = TextSecondary)
                            Spacer(Modifier.width(8.dp))
                            StatusBadge(statusLabel, statusColor)
                        }
                    }
                    QrImage(
                        "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/${slugifyJudul(k.nama_kegiatan)}",
                        Modifier.size(58.dp)
                    )
                }

                k.unit_kerja?.let {
                    Box(Modifier.clip(RoundedCornerShape(6.dp)).background(Color(0xFFE7F0FF)).padding(horizontal = 8.dp, vertical = 3.dp)) {
                        Text(it, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = Color(0xFF1877F2))
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, null, tint = TextSecondary, modifier = Modifier.size(15.dp))
                    Spacer(Modifier.width(5.dp))
                    val loc = listOfNotNull(k.lokasi, k.kabupaten_kota?.let { "($it)" }).joinToString(" ")
                    Text(loc.ifBlank { "-" }, fontSize = 13.sp, color = TextSecondary)
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.People, null, tint = TextSecondary, modifier = Modifier.size(15.dp))
                    Spacer(Modifier.width(5.dp))
                    Text("${k.total_peserta ?: 0} Peserta", fontSize = 13.sp, color = TextSecondary)
                }

                k.peserta_ringkasan?.let {
                    Text("Sasaran: $it", fontSize = 12.sp, color = TextSecondary, lineHeight = 16.sp)
                }

                // Link dokumen (sesuai web)
                val docs = listOfNotNull(
                    k.dokumentasi_url?.let { "Dokumentasi" to it },
                    k.materi_url?.let { "Materi" to it },
                    k.panduan_url?.let { "Panduan" to it },
                    k.laporan_url?.let { "Laporan" to it },
                    k.surat_menyurat_url?.let { "Surat Menyurat" to it }
                )
                if (docs.isNotEmpty()) {
                    val ctx = LocalContext.current
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        docs.forEach { (label, url) ->
                            Box(
                                Modifier.clip(RoundedCornerShape(6.dp)).background(ChipBg).clickable { openUrl(ctx, url) }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) { Text(label, fontSize = 11.sp, color = AccentBlue, fontWeight = FontWeight.Medium) }
                        }
                    }
                }
            }

            HorizontalDivider(color = Border)

            Row(Modifier.fillMaxWidth().height(44.dp)) {
                Box(Modifier.weight(1f).fillMaxHeight().clickable { onDetail() }, contentAlignment = Alignment.Center) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Visibility, null, tint = AccentBlue, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Detail", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = AccentBlue)
                    }
                }
                VerticalDivider(color = Border)
                Box(Modifier.weight(1f).fillMaxHeight().clickable { onPeserta() }, contentAlignment = Alignment.Center) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.People, null, tint = AccentBlue, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Peserta", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = AccentBlue)
                    }
                }
            }
        }
    }
}

@Composable
private fun StatusBadge(label: String, color: Color) {
    Box(Modifier.clip(RoundedCornerShape(50)).background(color.copy(alpha = 0.15f)).padding(horizontal = 8.dp, vertical = 2.dp)) {
        Text(label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = color)
    }
}

@Composable
private fun StatColored(label: String, value: String, bg: Color) {
    Column(
        Modifier.size(width = 150.dp, height = 92.dp).clip(RoundedCornerShape(14.dp)).background(bg).padding(14.dp)
    ) {
        Text(value, color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(4.dp))
        Text(label, color = Color.White.copy(alpha = 0.9f), fontSize = 12.sp)
    }
}

@Composable
fun WebCard(content: @Composable ColumnScope.() -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(16.dp), content = content)
    }
}

private fun displayStatusKey(k: Kegiatan): String {
    val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    val start = k.tanggal_mulai?.take(10)
    val end = k.tanggal_selesai?.take(10)
    return when {
        start != null && end != null && today < start -> "akan_datang"
        start != null && end != null && today > end -> "selesai"
        start != null && end != null -> "berjalan"
        else -> (k.status ?: "semua")
    }
}

private fun displayStatus(k: Kegiatan): Pair<String, Color> {
    return when (displayStatusKey(k)) {
        "akan_datang" -> "Akan Datang" to Color(0xFFF59E0B)
        "selesai" -> "Selesai" to Color(0xFF059669)
        "berjalan" -> "Berjalan" to Color(0xFF1877F2)
        else -> (k.status?.replaceFirstChar { it.uppercase() } ?: "-") to TextSecondary
    }
}

private fun formatRange(a: String?, b: String?): String {
    val f = SimpleDateFormat("d MMM yyyy", Locale("id"))
    fun fmt(s: String?): String = try {
        f.format(SimpleDateFormat("yyyy-MM-dd").parse(s?.take(10) ?: "") ?: Date())
    } catch (e: Exception) { s ?: "-" }
    return "${fmt(a)} - ${fmt(b)}"
}

fun openUrl(context: android.content.Context, url: String) {
    try {
        context.startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url)))
    } catch (e: Exception) { /* no-op */ }
}
