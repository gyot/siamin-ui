package com.bpmpntb.simaik.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.ui.theme.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

private val tglDetail = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale("id", "ID"))
private fun fmtTglDetail(s: String?): String = try { s?.take(10)?.let { LocalDate.parse(it).format(tglDetail) } ?: "-" } catch (e: Exception) { s ?: "-" }
private fun statusColorDetail(st: String) = when (st) {
    "Selesai" -> Color(0xFF057642); "Berjalan" -> Color(0xFF1877F2); "Akan Datang" -> Color(0xFFF59E0B); else -> Color(0xFF64748B)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LandingDetailScreen(vm: MainViewModel, onBack: () -> Unit) {
    val k = vm.landingDetail
    val ctx = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Detail Kegiatan", fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Kembali") } },
                actions = {
                    if (k != null) {
                        val slug = slugifyJudul(k.nama_kegiatan)
                        val url = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/$slug"
                        IconButton(onClick = {
                            val send = Intent(Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(Intent.EXTRA_TEXT, "${k.nama_kegiatan}\n$url") }
                            ctx.startActivity(Intent.createChooser(send, "Share Halaman"))
                        }) { Icon(Icons.Default.Share, "Share") }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { pad ->
        if (k == null) {
            Box(Modifier.fillMaxSize().padding(pad), contentAlignment = Alignment.Center) {
                Text("Data kegiatan tidak ditemukan.", color = TextSecondary)
            }
            return@Scaffold
        }
        val st = hitungStatus(k.tanggal_mulai, k.tanggal_selesai, k.status)
        val slug = slugifyJudul(k.nama_kegiatan)
        val urlDetail = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/$slug"
        val urlPeserta = "https://siamin.gdoank.my.id/daftar-peserta/${k.id_kegiatan}/$slug"

        Column(
            Modifier.fillMaxSize().padding(pad).background(WebBg).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // ===== Header: nama + status + tanggal =====
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(k.nama_kegiatan ?: "-", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.weight(1f))
                        Spacer(Modifier.width(8.dp))
                        Box(Modifier.clip(RoundedCornerShape(50)).background(statusColorDetail(st).copy(alpha = 0.15f)).padding(horizontal = 10.dp, vertical = 4.dp)) {
                            Text(st, fontSize = 12.sp, color = statusColorDetail(st), fontWeight = FontWeight.Bold)
                        }
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.DateRange, null, tint = TextSecondary, modifier = Modifier.size(15.dp)); Spacer(Modifier.width(6.dp))
                        Text("${fmtTglDetail(k.tanggal_mulai)} – ${fmtTglDetail(k.tanggal_selesai)}", fontSize = 13.sp, color = TextSecondary)
                    }
                }
            }

            // ===== Info utama =====
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    DetailInfo(Icons.Default.Computer, "Metode Pelaksanaan", k.metode_pelaksanaan?.replaceFirstChar { it.uppercase() } ?: "-")
                    DetailInfo(Icons.Default.Business, "Unit Kerja", unitKerjaLabel(k.unit_kerja_id, k.unit_kerja))
                    DetailInfo(Icons.Default.Payments, "Metode Pembayaran", k.metode_pembayaran?.replaceFirstChar { it.uppercase() } ?: "-")
                    DetailInfo(Icons.Default.People, "Total Peserta", "${k.total_peserta ?: 0}")
                    k.peserta_ringkasan?.takeIf { it.isNotBlank() }?.let {
                        DetailInfo(Icons.Default.Info, "Ringkasan Peserta", it)
                    }
                }
            }

            // ===== TPK =====
            if (!k.daftar_tpk.isNullOrEmpty()) {
                Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Tempat Pelaksanaan Kegiatan (TPK)", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                        k.daftar_tpk.forEachIndexed { i, tpk ->
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(Modifier.size(24.dp).clip(RoundedCornerShape(50)).background(AccentBlue.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                                    Text("${i + 1}", fontSize = 12.sp, color = AccentBlue, fontWeight = FontWeight.Bold)
                                }
                                Spacer(Modifier.width(10.dp))
                                Column {
                                    Text(tpk.lokasi ?: "-", fontSize = 13.sp, color = TextPrimary, fontWeight = FontWeight.Medium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                                    tpk.kabupaten_kota?.let { Text(it, fontSize = 12.sp, color = TextSecondary) }
                                }
                            }
                        }
                    }
                }
            }

            // ===== Peserta =====
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Peserta", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    Text("Total ${k.total_peserta ?: 0} peserta terdaftar", fontSize = 13.sp, color = TextSecondary)
                    Button(onClick = { openUrl(ctx, urlPeserta) }, shape = RoundedCornerShape(10.dp), colors = ButtonDefaults.buttonColors(containerColor = AccentBlue)) {
                        Icon(Icons.Default.People, null, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(6.dp)); Text("Lihat Peserta")
                    }
                }
            }

            // ===== Deskripsi & Rincian =====
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Deskripsi", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    Text(k.deskripsi?.takeIf { it.isNotBlank() } ?: "-", fontSize = 13.sp, color = TextSecondary, lineHeight = 19.sp)
                    if (!k.rincian_kegiatan.isNullOrBlank()) {
                        HorizontalDivider(color = Border)
                        Text("Rincian Kegiatan", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                        Text(k.rincian_kegiatan, fontSize = 13.sp, color = TextSecondary, lineHeight = 19.sp)
                    }
                }
            }

            // ===== Resource URL =====
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Resource URL", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    val res = listOfNotNull(
                        k.dokumentasi_url?.takeIf { it.isNotBlank() }?.let { "Dokumentasi" to it },
                        k.materi_url?.takeIf { it.isNotBlank() }?.let { "Materi" to it },
                        k.panduan_url?.takeIf { it.isNotBlank() }?.let { "Panduan" to it },
                        k.laporan_url?.takeIf { it.isNotBlank() }?.let { "Laporan" to it },
                        k.surat_menyurat_url?.takeIf { it.isNotBlank() }?.let { "Surat Menyurat" to it },
                    )
                    if (res.isEmpty()) {
                        Text("Tidak ada resource URL.", fontSize = 13.sp, color = TextSecondary)
                    } else {
                        res.forEach { (label, url) ->
                            OutlinedButton(onClick = { openUrl(ctx, url) }, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, AccentBlue.copy(alpha = 0.5f)), colors = ButtonDefaults.outlinedButtonColors(contentColor = AccentBlue)) {
                                Icon(Icons.Default.OpenInNew, null, modifier = Modifier.size(14.dp)); Spacer(Modifier.width(6.dp)); Text("Buka $label", fontSize = 12.sp)
                            }
                        }
                    }
                }
            }

            // ===== Halaman Terkait (web) =====
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Halaman Terkait", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    DetailBuka(ctx, "Buka Halaman Detail (Web)", urlDetail)
                    Text("Formulir Biodata", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary)
                    listOf("Peserta", "Panitia", "Narasumber", "Pendamping").forEach { role ->
                        DetailBuka(ctx, "Formulir Biodata $role", "https://siamin.gdoank.my.id/formulir/${k.id_kegiatan}/$role/$slug")
                    }
                    if (!k.daftar_tpk.isNullOrEmpty()) {
                        Text("Evaluasi", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary)
                        k.daftar_tpk.forEach { tpk ->
                            val namaTpk = tpk.kabupaten_kota?.let { "${tpk.lokasi} ($it)" } ?: (tpk.lokasi ?: "TPK ${tpk.id_tpk}")
                            DetailBuka(ctx, "Evaluasi: $namaTpk", "https://siamin.gdoank.my.id/evaluasi/${k.id_kegiatan}/${tpk.id_tpk}/$slug")
                        }
                    }
                }
            }

            // ===== Link halaman + salin =====
            Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(4.dp), border = BorderStroke(1.dp, Border)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Link Halaman", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    Text(urlDetail, fontSize = 12.sp, color = AccentBlue, lineHeight = 17.sp)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = { openUrl(ctx, urlDetail) }, shape = RoundedCornerShape(10.dp)) { Text("Buka", fontSize = 12.sp) }
                        OutlinedButton(onClick = {
                            val send = Intent(Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(Intent.EXTRA_TEXT, "${k.nama_kegiatan}\n$urlDetail") }
                            ctx.startActivity(Intent.createChooser(send, "Share Halaman"))
                        }, shape = RoundedCornerShape(10.dp)) { Text("Share", fontSize = 12.sp) }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

@Composable
private fun DetailInfo(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String) {
    Row(verticalAlignment = Alignment.Top) {
        Icon(icon, null, tint = TextSecondary, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(10.dp))
        Column {
            Text(label, fontSize = 12.sp, color = TextSecondary)
            Text(value, fontSize = 14.sp, color = TextPrimary, fontWeight = FontWeight.Medium, lineHeight = 19.sp)
        }
    }
}

@Composable
private fun DetailBuka(ctx: android.content.Context, label: String, url: String) {
    OutlinedButton(
        onClick = { openUrl(ctx, url) },
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, AccentBlue.copy(alpha = 0.5f)),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = AccentBlue),
        modifier = Modifier.fillMaxWidth()
    ) {
        Icon(Icons.Default.OpenInNew, null, modifier = Modifier.size(15.dp)); Spacer(Modifier.width(8.dp))
        Text(label, fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}
