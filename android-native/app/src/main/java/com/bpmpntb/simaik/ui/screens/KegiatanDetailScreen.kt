package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.content.Intent
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.painterResource
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.R
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.api.KegiatanPayload
import com.bpmpntb.simaik.api.PenugasanItem
import com.bpmpntb.simaik.api.PenugasanPayload
import com.bpmpntb.simaik.api.SertifikatBatchItem
import com.bpmpntb.simaik.api.JadwalItem
import androidx.compose.ui.text.font.FontStyle
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun KegiatanDetailScreen(
    vm: MainViewModel,
    id: Int,
    onBack: () -> Unit,
    onNavigate: (String) -> Unit = {}
) {
    val s = vm.state
    val context = LocalContext.current
    LaunchedEffect(id) {
        if (id > 0) { vm.loadDetail(id); vm.loadJadwal(id) }
    }
    var showEdit by remember { mutableStateOf(false) }
    var showDelete by remember { mutableStateOf(false) }
    var showDuplikat by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Box(
            Modifier.fillMaxWidth()
                .background(Brush.verticalGradient(listOf(LoginNavy1, LoginNavy2, LoginNavy3)))
                .padding(horizontal = 8.dp, vertical = 12.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, "Kembali", tint = Color.White)
                }
                Image(
                    painter = painterResource(R.drawable.simaik_logo),
                    contentDescription = "Logo SIMAIK",
                    modifier = Modifier.size(42.dp).shadow(8.dp, RoundedCornerShape(11.dp))
                )
                Spacer(Modifier.width(10.dp))
                Column {
                    Text("SIMAIK", color = Color(0xFFFACC15), fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Text("Detail Kegiatan", fontSize = 12.sp, color = Color.White.copy(alpha = 0.85f))
                }
            }
        }

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading && s.kegiatanDetail == null -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null -> Text(s.error ?: "", color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                s.kegiatanDetail != null -> {
                    val k = s.kegiatanDetail!!
                    Column(
                        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Tombol aksi (masing-masing berfungsi)
                        WebCard {
                            Text("Aksi", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Spacer(Modifier.height(12.dp))
                            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                ActionTile("Edit", Icons.Default.Edit, Color(0xFF1877F2), Modifier.weight(1f)) { showEdit = true }
                                ActionTile("Peserta", Icons.Default.Group, Color(0xFF22C55E), Modifier.weight(1f)) { onNavigate("peserta/${k.id_kegiatan}") }
                                ActionTile("Penugasan", Icons.Default.Assignment, Color(0xFFF59E0B), Modifier.weight(1f)) { onNavigate("penugasan/${k.id_kegiatan}") }
                            }
                            Spacer(Modifier.height(8.dp))
                            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                ActionTile("Sertifikat", Icons.Default.CardMembership, Color(0xFFA855F7), Modifier.weight(1f)) { onNavigate("sertifikat/${k.id_kegiatan}") }
                                ActionTile("Bagikan", Icons.Default.Share, Color(0xFF0EA5E9), Modifier.weight(1f)) {
                                    val url = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}"
                                    val send = Intent(Intent.ACTION_SEND).apply {
                                        type = "text/plain"
                                        putExtra(Intent.EXTRA_TEXT, "${k.nama_kegiatan ?: "Kegiatan"}\n$url")
                                    }
                                    context.startActivity(Intent.createChooser(send, "Bagikan Kegiatan"))
                                }
                                ActionTile("Duplikat", Icons.Default.ContentCopy, Color(0xFF14B8A6), Modifier.weight(1f)) { showDuplikat = true }
                                ActionTile("Hapus", Icons.Default.Delete, Color(0xFFEF4444), Modifier.weight(1f)) { showDelete = true }
                            }
                        }

                        // Informasi
                        WebCard {
                            Text("Informasi Kegiatan", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Spacer(Modifier.height(10.dp))
                            Text(k.nama_kegiatan ?: "-", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                            Spacer(Modifier.height(8.dp))
                            k.status?.let { Chip(it.replaceFirstChar { c -> c.uppercase() }); Spacer(Modifier.height(8.dp)) }
                            HorizontalDivider(color = Border)
                            Spacer(Modifier.height(10.dp))
                            InfoRow("Tanggal", listOfNotNull(k.tanggal_mulai, k.tanggal_selesai).joinToString(" s/d ").ifBlank { "-" })
                            Spacer(Modifier.height(8.dp))
                            InfoRow("Metode", k.metode_pelaksanaan ?: "-")
                        }

                        k.deskripsi?.let {
                            WebCard {
                                Text("Deskripsi", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Spacer(Modifier.height(8.dp))
                                Text(it, fontSize = 14.sp, lineHeight = 22.sp, color = TextPrimary)
                            }
                        }

                        k.rincian_kegiatan?.let {
                            WebCard {
                                Text("Rincian", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Spacer(Modifier.height(8.dp))
                                Text(it, fontSize = 14.sp, lineHeight = 22.sp, color = TextPrimary)
                            }
                        }

                        // JADWAL HARIAN (seperti web)
                        if (s.jadwalList.isNotEmpty()) {
                            WebCard {
                                Text("Jadwal Harian", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Spacer(Modifier.height(12.dp))
                                s.jadwalList.forEachIndexed { idx, day ->
                                    Text(
                                        "Hari ${jadwalOrdinal(idx)} - ${fmtTglShort(day.tanggal)}",
                                        fontSize = 13.sp, fontWeight = FontWeight.Bold, color = AccentBlue
                                    )
                                    Spacer(Modifier.height(6.dp))
                                    JadwalTableHeader()
                                    day.items?.forEach { item -> JadwalTableRow(item) }
                                    Spacer(Modifier.height(14.dp))
                                }
                            }
                        }

                        // TPK (Tempat Pelaksanaan Kegiatan)
                        if (!k.daftar_tpk.isNullOrEmpty()) {
                            Spacer(Modifier.height(10.dp))
                            WebCard {
                                Text("Tempat Pelaksanaan Kegiatan", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Spacer(Modifier.height(10.dp))
                                k.daftar_tpk.forEachIndexed { i, tpk ->
                                    Row(Modifier.padding(vertical = 3.dp), verticalAlignment = Alignment.CenterVertically) {
                                        Box(Modifier.size(24.dp).clip(RoundedCornerShape(6)).background(AccentBlue.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) {
                                            Text("${i + 1}", fontSize = 12.sp, color = AccentBlue, fontWeight = FontWeight.Bold)
                                        }
                                        Spacer(Modifier.width(8.dp))
                                        Text("${tpk.lokasi}${tpk.kabupaten_kota?.let { " ($it)" } ?: ""}", fontSize = 13.sp, color = TextPrimary)
                                    }
                                }
                            }
                        }

                        // Daftar ATK
                        if (!k.daftar_atk.isNullOrEmpty()) {
                            Spacer(Modifier.height(10.dp))
                            WebCard {
                                Text("Daftar ATK", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Spacer(Modifier.height(10.dp))
                                k.daftar_atk.forEach { atk ->
                                    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                                        Text(atk.nama_barang, fontSize = 13.sp, color = TextPrimary, modifier = Modifier.weight(1f))
                                        Text("${atk.jumlah ?: 0} ${atk.satuan ?: ""}", fontSize = 12.sp, color = TextSecondary)
                                    }
                                }
                            }
                        }

                        // Link Biodata + Evaluasi/Laporan/Test + Resource
                        val slug = slugifyJudul(k.nama_kegiatan)
                        val idTpk = k.daftar_tpk?.firstOrNull()?.id_tpk ?: 0
                        val base = "https://siamin.gdoank.my.id"

                        Spacer(Modifier.height(10.dp))
                        WebCard {
                            Text("Link Biodata", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Spacer(Modifier.height(8.dp))
                            listOf("Peserta", "Panitia", "Narasumber", "Pendamping").forEach { peran ->
                                LinkRow(peran, "$base/formulir/${k.id_kegiatan}/$peran/$idTpk/$slug")
                            }
                        }

                        Spacer(Modifier.height(10.dp))
                        WebCard {
                            Text("Link Evaluasi, Laporan & Test", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Spacer(Modifier.height(8.dp))
                            LinkRow("Evaluasi", "$base/evaluasi/${k.id_kegiatan}/$idTpk/$slug")
                            LinkRow("Laporan Evaluasi", "$base/laporan-evaluasi/${k.id_kegiatan}/$idTpk/$slug")
                            LinkRow("Test", "$base/test/${k.id_kegiatan}/$idTpk/$slug")
                        }

                        val resDocs = listOfNotNull(
                            k.dokumentasi_url?.let { "Dokumentasi" to it },
                            k.materi_url?.let { "Materi" to it },
                            k.panduan_url?.let { "Panduan" to it },
                            k.laporan_url?.let { "Laporan" to it },
                            k.surat_menyurat_url?.let { "Surat Menyurat" to it }
                        )
                        if (resDocs.isNotEmpty()) {
                            Spacer(Modifier.height(10.dp))
                            WebCard {
                                Text("Resource", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Spacer(Modifier.height(8.dp))
                                resDocs.forEach { (label, url) -> LinkRow(label, url) }
                            }
                        }
                    }
                }
                else -> Text("Data tidak ditemukan.", Modifier.align(Alignment.Center), color = TextSecondary)
            }
        }
    }

    if (showDuplikat) {
        KegiatanFormDialog(
            editing = null, prefill = s.kegiatanDetail,
            onSave = { payload, jadwal ->
                vm.saveKegiatan(payload, null, jadwal) { ok -> if (ok) { showDuplikat = false; onBack() } }
            },
            onDismiss = { showDuplikat = false }
        )
    }

    if (showEdit) {
        KegiatanFormDialog(
            editing = s.kegiatanDetail,
            onSave = { payload, jadwal ->
                vm.saveKegiatan(payload, s.kegiatanDetail?.id_kegiatan, jadwal) { ok -> if (ok) { showEdit = false; vm.loadDetail(id) } }
            },
            onDismiss = { showEdit = false }
        )
    }

    if (showDelete) {
        AlertDialog(
            onDismissRequest = { showDelete = false },
            title = { Text("Hapus Kegiatan") },
            text = { Text("Yakin ingin menghapus \"${s.kegiatanDetail?.nama_kegiatan}\"?") },
            confirmButton = {
                TextButton(onClick = {
                    vm.deleteKegiatan(id) { ok -> if (ok) { showDelete = false; onBack() } }
                }) { Text("Hapus", color = ErrorText) }
            },
            dismissButton = { TextButton(onClick = { showDelete = false }) { Text("Batal") } }
        )
    }
}

@Composable
private fun ActionTile(label: String, icon: ImageVector, color: Color, modifier: Modifier, onClick: () -> Unit) {
    Column(
        modifier
            .clip(RoundedCornerShape(12.dp))
            .background(color.copy(alpha = 0.08f))
            .clickable { onClick() }
            .padding(vertical = 14.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(icon, label, tint = color, modifier = Modifier.size(24.dp))
        Spacer(Modifier.height(6.dp))
        Text(label, fontSize = 11.sp, color = color, fontWeight = FontWeight.Medium, textAlign = TextAlign.Center)
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = TextSecondary, fontSize = 14.sp)
        Text(value, fontWeight = FontWeight.Medium, fontSize = 14.sp, color = TextPrimary)
    }
}

private fun jadwalOrdinal(i: Int): String =
    listOf("Pertama", "Kedua", "Ketiga", "Keempat", "Kelima", "Keenam", "Ketujuh", "Kedelapan", "Kesembilan", "Kesepuluh")
        .getOrElse(i) { "ke-${i + 1}" }

private val tglShortFmt = DateTimeFormatter.ofPattern("d MMM yyyy", Locale("id", "ID"))
private fun fmtTglShort(s: String?): String = try { s?.take(10)?.let { LocalDate.parse(it).format(tglShortFmt) } ?: "-" } catch (e: Exception) { s ?: "-" }

@Composable
private fun JadwalTableHeader() {
    Row(Modifier.fillMaxWidth().background(ChipBg).padding(vertical = 6.dp, horizontal = 8.dp)) {
        Text("Waktu", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary, modifier = Modifier.weight(1.1f))
        Text("Kegiatan / Materi", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary, modifier = Modifier.weight(2.3f))
        Text("JP", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary, modifier = Modifier.weight(0.6f))
        Text("PJ", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary, modifier = Modifier.weight(1.2f))
    }
}

@Composable
private fun JadwalTableRow(item: JadwalItem) {
    val isBreak = item.tipe == "istirahat" || item.kegiatan.equals("Istirahat", true) == true || (item.kegiatan?.contains("Registrasi", true) == true)
    val bg = if (isBreak) Color(0xFFFFF7E0) else Color.White
    val txtColor = if (isBreak) Color(0xFFB8860B) else TextPrimary
    val fs = if (isBreak) FontStyle.Italic else FontStyle.Normal
    Row(Modifier.fillMaxWidth().background(bg).padding(vertical = 8.dp, horizontal = 8.dp)) {
        Text(item.waktu ?: "-", fontSize = 11.sp, color = txtColor, fontStyle = fs, lineHeight = 15.sp, modifier = Modifier.weight(1.1f))
        Text(item.kegiatan ?: "-", fontSize = 11.sp, color = txtColor, fontStyle = fs, lineHeight = 15.sp, modifier = Modifier.weight(2.3f))
        Text(item.jp ?: "-", fontSize = 11.sp, color = txtColor, fontStyle = fs, modifier = Modifier.weight(0.6f))
        Text(item.pj ?: "-", fontSize = 11.sp, color = txtColor, fontStyle = fs, lineHeight = 15.sp, modifier = Modifier.weight(1.2f))
    }
}

@Composable
private fun LinkRow(label: String, url: String) {
    val ctx = LocalContext.current
    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Default.Link, null, tint = AccentBlue, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(8.dp))
        Text(label, fontSize = 13.sp, color = TextPrimary, modifier = Modifier.weight(1f))
        IconButton(onClick = { openUrl(ctx, url) }) { Icon(Icons.Default.Visibility, "Buka", tint = AccentBlue, modifier = Modifier.size(18.dp)) }
        IconButton(onClick = {
            val send = android.content.Intent(android.content.Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(android.content.Intent.EXTRA_TEXT, url) }
            ctx.startActivity(android.content.Intent.createChooser(send, "Bagikan $label"))
        }) { Icon(Icons.Default.Share, "Bagikan", tint = AccentBlue, modifier = Modifier.size(18.dp)) }
    }
}
