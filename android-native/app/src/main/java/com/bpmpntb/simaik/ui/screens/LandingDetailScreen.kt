package com.bpmpntb.simaik.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.JadwalKelas
import com.bpmpntb.simaik.ui.theme.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

private val tglDetail = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale("id", "ID"))
private fun fmtTglDetail(s: String?): String = try { s?.take(10)?.let { LocalDate.parse(it).format(tglDetail) } ?: "-" } catch (e: Exception) { s ?: "-" }
private val Indigo = Color(0xFF3730A3)
private val Teal800 = Color(0xFF115E59)
private val Orange500 = Color(0xFFF97316)
private const val SURVEI_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd7b_3RXC58TlboIPTeVkmWGDDWysnjL-4WQIyG5kWaULlFFw/viewform"

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LandingDetailScreen(vm: MainViewModel, onBack: () -> Unit) {
    val k = vm.landingDetail
    val ctx = LocalContext.current
    var jadwal by remember { mutableStateOf<List<JadwalKelas>>(emptyList()) }
    LaunchedEffect(k?.id_kegiatan) { if (k != null) vm.loadJadwalPublik(k.id_kegiatan) { jadwal = it } }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {},
                navigationIcon = {
                    TextButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Kembali", tint = AccentBlue); Spacer(Modifier.width(4.dp))
                        Text("Kembali", color = AccentBlue, fontWeight = FontWeight.SemiBold)
                    }
                },
                actions = {
                    if (k != null) {
                        val slug = slugifyJudul(k.nama_kegiatan)
                        val url = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/$slug"
                        Button(
                            onClick = {
                                val send = Intent(Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(Intent.EXTRA_TEXT, "${k.nama_kegiatan}\n$url") }
                                ctx.startActivity(Intent.createChooser(send, "Share Halaman"))
                            },
                            shape = RoundedCornerShape(50), colors = ButtonDefaults.buttonColors(containerColor = Indigo),
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
                        ) { Icon(Icons.Default.Share, null, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(6.dp)); Text("Share", fontSize = 13.sp) }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { pad ->
        if (k == null) {
            Box(Modifier.fillMaxSize().padding(pad), contentAlignment = Alignment.Center) { Text("Data kegiatan tidak ditemukan.", color = TextSecondary) }
            return@Scaffold
        }
        val slug = slugifyJudul(k.nama_kegiatan)
        val urlDetail = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/$slug"
        val urlPeserta = "https://siamin.gdoank.my.id/daftar-peserta/${k.id_kegiatan}/$slug"
        var expanded by remember { mutableStateOf(false) }

        Column(Modifier.fillMaxSize().padding(pad).background(WebBg).verticalScroll(rememberScrollState())) {
            // ===== Banner ungu: badge + judul + deskripsi =====
            Column(Modifier.fillMaxWidth().background(Indigo).padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(Modifier.clip(RoundedCornerShape(50)).background(Color.White.copy(alpha = 0.15f)).padding(horizontal = 12.dp, vertical = 5.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(7.dp).clip(RoundedCornerShape(50)).background(Color(0xFF34D399)))
                    Spacer(Modifier.width(8.dp))
                    Text("Detail Kegiatan", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                }
                Text(k.nama_kegiatan ?: "-", color = Color.White, fontSize = 21.sp, fontWeight = FontWeight.Bold, lineHeight = 28.sp)
                Column {
                    Text(
                        k.deskripsi?.takeIf { it.isNotBlank() } ?: "-",
                        color = Color.White.copy(alpha = 0.85f), fontSize = 13.sp, lineHeight = 19.sp,
                        maxLines = if (expanded) Int.MAX_VALUE else 3, overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        if (expanded) "Tutup" else "Baca selengkapnya",
                        color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold,
                        textDecoration = TextDecoration.Underline,
                        modifier = Modifier.clickable { expanded = !expanded }.padding(top = 4.dp)
                    )
                }
            }

            // ===== Flyer =====
            k.flyer?.takeIf { it.isNotBlank() }?.let { flyer ->
                DtlUrlImage(
                    if (flyer.startsWith("http")) flyer else "https://siamin.gdoank.my.id/storage/$flyer",
                    Modifier.fillMaxWidth().padding(16.dp).clip(RoundedCornerShape(14.dp))
                )
            }

            // ===== LAMPIRAN & MATERI =====
            Column(Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("LAMPIRAN & MATERI", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                DtlLampiranCard(Icons.Default.CameraAlt, Color(0xFF14B8A6), "Dokumentasi", k.dokumentasi_url)
                DtlLampiranCard(Icons.Default.MenuBook, Color(0xFFF97316), "Materi", k.materi_url)
                DtlLampiranCard(Icons.Default.Description, Color(0xFF8B5CF6), "Panduan", k.panduan_url)
            }

            Spacer(Modifier.height(14.dp))

            // ===== Kartu info: TANGGAL / LOKASI / KABUPATEN-KOTA / METODE =====
            Column(Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                DtlInfoCard(Icons.Default.DateRange, Color(0xFF3B82F6), "TANGGAL", "${fmtTglDetail(k.tanggal_mulai)} – ${fmtTglDetail(k.tanggal_selesai)}")
                k.lokasi?.takeIf { it.isNotBlank() }?.let {
                    DtlInfoCard(Icons.Default.Place, Color(0xFF14B8A6), "LOKASI", it)
                }
                k.kabupaten_kota?.takeIf { it.isNotBlank() }?.let {
                    DtlInfoCard(Icons.Default.Map, Color(0xFF8B5CF6), "KABUPATEN/KOTA", it)
                }
                DtlInfoCard(Icons.Default.Bolt, Color(0xFFEC4899), "METODE", k.metode_pelaksanaan?.replaceFirstChar { c -> c.uppercase() } ?: "-")
            }

            Spacer(Modifier.height(14.dp))

            // ===== TPK =====
            if (!k.daftar_tpk.isNullOrEmpty()) {
                Column(Modifier.padding(horizontal = 16.dp)) {
                    Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(3.dp)) {
                        Column {
                            Row(Modifier.fillMaxWidth().background(Teal800).padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Place, null, tint = Color.White, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(8.dp))
                                Text("Tempat Pelaksanaan Kegiatan (TPK)", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }
                            Column(Modifier.padding(14.dp)) {
                                Row {
                                    Text("NO", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(36.dp))
                                    Text("LOKASI", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                                    Text("KABUPATEN/KOTA", color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(120.dp))
                                }
                                Spacer(Modifier.height(8.dp))
                                k.daftar_tpk.forEachIndexed { i, tpk ->
                                    Row(Modifier.padding(vertical = 4.dp)) {
                                        Text("${i + 1}", color = TextPrimary, fontSize = 13.sp, modifier = Modifier.width(36.dp))
                                        Text(tpk.lokasi ?: "-", color = TextPrimary, fontSize = 13.sp, modifier = Modifier.weight(1f))
                                        Text(tpk.kabupaten_kota ?: "-", color = TextPrimary, fontSize = 13.sp, modifier = Modifier.width(120.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(14.dp))

            // ===== Survei Kepuasan Masyarakat =====
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 16.dp).clip(RoundedCornerShape(16.dp))
                    .background(Brush.horizontalGradient(listOf(Color(0xFF10B981), Color(0xFF0D9488))))
                    .clickable { openUrl(ctx, SURVEI_URL) }.padding(20.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(Modifier.size(52.dp).clip(RoundedCornerShape(50)).background(Color.White.copy(alpha = 0.2f)), contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.CheckCircle, null, tint = Color.White, modifier = Modifier.size(28.dp))
                }
                Spacer(Modifier.width(14.dp))
                Column(Modifier.weight(1f)) {
                    Text("Survei Kepuasan Masyarakat", color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                    Text("Beri penilaian Anda tentang kegiatan ini", color = Color.White.copy(alpha = 0.85f), fontSize = 13.sp)
                }
                Icon(Icons.Default.ChevronRight, null, tint = Color.White.copy(alpha = 0.7f), modifier = Modifier.size(28.dp))
            }

            Spacer(Modifier.height(14.dp))

            // ===== Jadwal Kegiatan =====
            if (jadwal.isNotEmpty()) {
                Column(Modifier.padding(horizontal = 16.dp)) {
                    Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(3.dp)) {
                        Column {
                            Row(Modifier.fillMaxWidth().background(Orange500).padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Schedule, null, tint = Color.White, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(8.dp))
                                Text("Jadwal Kegiatan", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            }
                            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                jadwal.forEach { kelas ->
                                    if (kelas.nama != null && jadwal.size > 1) {
                                        Text(kelas.nama, color = Indigo, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    }
                                    kelas.hari.forEach { day ->
                                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(Icons.Default.CalendarMonth, null, tint = TextSecondary, modifier = Modifier.size(15.dp)); Spacer(Modifier.width(6.dp))
                                                Text("${day.hari} - ${fmtTglDetail(day.tanggal)}", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = TextPrimary)
                                            }
                                            Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Color(0xFFF8FAFC))) {
                                                Row(Modifier.background(Color(0xFFEEF2FF)).padding(vertical = 8.dp, horizontal = 10.dp)) {
                                                    Text("WAKTU", fontSize = 10.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(78.dp))
                                                    Text("KEGIATAN / MATERI", fontSize = 10.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                                                    Text("JP", fontSize = 10.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(28.dp))
                                                    Text("PJ", fontSize = 10.sp, color = TextSecondary, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(90.dp))
                                                }
                                                val items = day.items ?: emptyList()
                                                items.forEach { row ->
                                                    val istirahat = row.tipe == "istirahat"
                                                    val warna = if (istirahat) Orange500 else TextPrimary
                                                    Row(Modifier.fillMaxWidth().background(if (istirahat) Color(0xFFFEF3C7) else Color.White).padding(vertical = 8.dp, horizontal = 10.dp)) {
                                                        Text(row.waktu ?: "-", fontSize = 11.sp, color = warna, fontStyle = if (istirahat) FontStyle.Italic else null, modifier = Modifier.width(78.dp))
                                                        Text(row.kegiatan ?: "-", fontSize = 11.sp, color = warna, fontStyle = if (istirahat) FontStyle.Italic else null, modifier = Modifier.weight(1f))
                                                        Text(if (istirahat) "-" else (row.jp ?: "-"), fontSize = 11.sp, color = warna, modifier = Modifier.width(28.dp))
                                                        Text(if (istirahat) "-" else (row.pj ?: "-"), fontSize = 11.sp, color = warna, maxLines = 2, overflow = TextOverflow.Ellipsis, modifier = Modifier.width(90.dp))
                                                    }
                                                }
                                                val totalJp = items.filter { it.tipe != "istirahat" }.sumOf { (it.jp?.toIntOrNull() ?: 0) }
                                                Row(Modifier.background(Color(0xFFE2E8F0)).padding(vertical = 8.dp, horizontal = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                                                    Text("Total JP", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.weight(1f))
                                                    Text("$totalJp", fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = AccentBlue)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(14.dp))

            // ===== Link Pendaftaran =====
            Column(Modifier.padding(horizontal = 16.dp)) {
                Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(3.dp)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Link Pendaftaran", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        Text("Daftarkan diri Anda untuk mengikuti kegiatan ini", fontSize = 12.sp, color = TextSecondary)
                        Button(
                            onClick = { openUrl(ctx, urlPeserta) }, shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Orange500), modifier = Modifier.fillMaxWidth()
                        ) { Icon(Icons.Default.PersonAdd, null, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)); Text("Daftar Peserta", fontWeight = FontWeight.SemiBold) }
                    }
                }
            }

            Spacer(Modifier.height(14.dp))

            // ===== Halaman Terkait =====
            Column(Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("HALAMAN TERKAIT", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                DetailBuka(ctx, "Buka Halaman Detail (Web)", urlDetail)
                Text("Formulir Biodata", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                listOf("Peserta", "Panitia", "Narasumber", "Pendamping").forEach { role ->
                    DetailBuka(ctx, "Formulir Biodata $role", "https://siamin.gdoank.my.id/formulir/${k.id_kegiatan}/$role/$slug")
                }
                if (!k.daftar_tpk.isNullOrEmpty()) {
                    Text("Evaluasi", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    k.daftar_tpk.forEach { tpk ->
                        val namaTpk = tpk.kabupaten_kota?.let { "${tpk.lokasi} ($it)" } ?: (tpk.lokasi ?: "TPK")
                        DetailBuka(ctx, "Evaluasi: $namaTpk", "https://siamin.gdoank.my.id/evaluasi/${k.id_kegiatan}/${tpk.id_tpk}/$slug")
                    }
                }
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun DtlInfoCard(icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color, label: String, value: String) {
    Row(Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(Color.White)) {
        Box(Modifier.width(5.dp).fillMaxHeight().background(color))
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(38.dp).clip(RoundedCornerShape(10.dp)).background(color.copy(alpha = 0.12f)), contentAlignment = Alignment.Center) {
                Icon(icon, null, tint = color, modifier = Modifier.size(20.dp))
            }
            Spacer(Modifier.width(12.dp))
            Column {
                Text(label, color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                Text(value, color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun DtlLampiranCard(icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color, label: String, url: String?) {
    val ctx = LocalContext.current
    Row(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(Color.White)
            .clickable(enabled = !url.isNullOrBlank()) { url?.let { openUrl(ctx, it) } }.padding(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(Modifier.size(40.dp).clip(RoundedCornerShape(10.dp)).background(color.copy(alpha = 0.12f)), contentAlignment = Alignment.Center) {
            Icon(icon, null, tint = color, modifier = Modifier.size(21.dp))
        }
        Spacer(Modifier.width(12.dp))
        Column {
            Text(label, color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Text(if (url.isNullOrBlank()) "Tidak tersedia" else "Klik untuk membuka", color = TextSecondary, fontSize = 12.sp)
        }
    }
}

@Composable
private fun DetailBuka(ctx: android.content.Context, label: String, url: String) {
    OutlinedButton(
        onClick = { openUrl(ctx, url) },
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, AccentBlue.copy(alpha = 0.5f)),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = AccentBlue),
        modifier = Modifier.fillMaxWidth()
    ) {
        Icon(Icons.Default.OpenInNew, null, modifier = Modifier.size(15.dp)); Spacer(Modifier.width(8.dp))
        Text(label, fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

@Composable
private fun DtlUrlImage(url: String, modifier: Modifier) {
    var bmp by remember(url) { mutableStateOf<android.graphics.Bitmap?>(null) }
    LaunchedEffect(url) {
        kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.IO) {
            try {
                val conn = java.net.URL(url).openConnection() as java.net.HttpURLConnection
                conn.connectTimeout = 10000; conn.readTimeout = 15000
                bmp = android.graphics.BitmapFactory.decodeStream(conn.inputStream)
            } catch (_: Exception) { }
        }
    }
    bmp?.let {
        Image(bitmap = it.asImageBitmap(), contentDescription = "Flyer", contentScale = ContentScale.FillWidth, modifier = modifier)
    } ?: Box(modifier.height(180.dp).background(Color(0xFFE2E8F0)), contentAlignment = Alignment.Center) {
        Text("Memuat flyer...", color = TextSecondary, fontSize = 12.sp)
    }
}
