package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.R
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.ui.theme.*
import com.bpmpntb.simaik.util.QrImage
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

private val tglLanding = DateTimeFormatter.ofPattern("d MMM yyyy", Locale("id", "ID"))
private fun fmtTglLanding(s: String?): String = try { s?.take(10)?.let { LocalDate.parse(it).format(tglLanding) } ?: "-" } catch (e: Exception) { s ?: "-" }

private data class Timker(val id: String, val name: String, val desc: String, val color: Color, val icon: ImageVector)

private val timkers = listOf(
    Timker("001", "Timker PAUD", "Pengembangan pendidikan anak usia dini.", Color(0xFFEC4899), Icons.Default.Face),
    Timker("002", "Timker Sekolah Dasar", "Pelaksanaan & inovasi pendidikan SD.", Color(0xFF10B981), Icons.Default.School),
    Timker("003", "Timker SMP", "Program pendidikan jenjang menengah pertama.", Color(0xFF0EA5E9), Icons.Default.School),
    Timker("004", "Timker SMA/SMK", "Pengembangan & pengawasan pendidikan menengah.", Color(0xFFF59E0B), Icons.Default.School),
    Timker("005", "Timker Subbag Umum", "Operasional & administrasi umum.", Color(0xFF8B5CF6), Icons.Default.Business),
    Timker("semua", "Semua Kegiatan", "Seluruh kegiatan dari semua tim kerja.", Color(0xFF06B6D4), Icons.Default.Apps),
)

@Composable
fun LandingScreen(vm: MainViewModel, onLogin: () -> Unit) {
    val s = vm.state
    var selected by remember { mutableStateOf<Timker?>(null) }
    var search by remember { mutableStateOf("") }
    var page by remember { mutableStateOf(1) }
    var detail by remember { mutableStateOf<Kegiatan?>(null) }
    var showCekSertifikat by remember { mutableStateOf(false) }
    LaunchedEffect(selected) { vm.loadKegiatan(); page = 1 }

    val perPage = 4
    val all = s.kegiatanList.filter { selected == null || selected!!.id == "semua" || (it.unit_kerja_id?.toString() ?: "") == selected!!.id }
    val q = search.trim()
    val filtered = if (q.isEmpty()) all else all.filter { (it.nama_kegiatan ?: "").contains(q, true) }
    val totalPages = maxOf(1, (filtered.size + perPage - 1) / perPage)
    val pageItems = filtered.drop((page - 1) * perPage).take(perPage)

    Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(LoginNavy1, LoginNavy2, LoginNavy3)))) {
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            item {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Spacer(Modifier.height(8.dp))
                    Image(painterResource(R.drawable.simaik_logo), "Logo SIMAIK", modifier = Modifier.size(72.dp).clip(RoundedCornerShape(18.dp)))
                    Spacer(Modifier.height(12.dp))
                    Text("SIMAIK", color = Color(0xFFFACC15), fontSize = 34.sp, fontWeight = FontWeight.Bold)
                    Text("(Si Manajemen Informasi Kegiatan)", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(10.dp))
                    Text("Platform terintegrasi untuk mengelola kegiatan, peserta, penugasan, dan sertifikat digital.", color = Color(0xFFBFDBFE), fontSize = 13.sp, lineHeight = 19.sp)
                    Spacer(Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Button(onClick = onLogin, shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6))) {
                            Icon(Icons.Default.Person, null, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(6.dp)); Text("Login")
                        }
                        OutlinedButton(onClick = { showCekSertifikat = true }, shape = RoundedCornerShape(12.dp), border = BorderStroke(1.dp, Color(0xFF34D399)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF34D399))) {
                            Icon(Icons.Default.Verified, null, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(6.dp)); Text("Cek Sertifikat")
                        }
                    }
                }
            }

            item {
                if (selected == null) {
                    Text("Pilih Tim Kerja", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(4.dp))
                    Text("Klik kartu untuk melihat kegiatan.", color = Color(0xFFBFDBFE), fontSize = 12.sp)
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text(selected!!.name, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                            Text("Menampilkan ${filtered.size} kegiatan", color = Color(0xFFBFDBFE), fontSize = 12.sp)
                        }
                        OutlinedButton(onClick = { selected = null; search = "" }, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, Color.White.copy(alpha = 0.3f)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)) {
                            Text("Kembali", fontSize = 12.sp)
                        }
                    }
                }
            }

            if (selected == null) {
                item {
                    LazyVerticalGrid(columns = GridCells.Fixed(2), verticalArrangement = Arrangement.spacedBy(12.dp), horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.heightIn(max = 700.dp)) {
                        items(timkers) { t -> TimkerCard(t) { selected = t } }
                    }
                }
            } else {
                item {
                    OutlinedTextField(
                        value = search, onValueChange = { search = it; page = 1 },
                        placeholder = { Text("Cari kegiatan...", color = Color(0xFF93C5FD), fontSize = 14.sp) },
                        leadingIcon = { Icon(Icons.Default.Search, null, tint = Color(0xFF93C5FD)) },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color(0xFF22D3EE), unfocusedBorderColor = Color.White.copy(alpha = 0.2f), focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()
                    )
                }
                items(pageItems) { k -> LandingKegiatanCard(k) { detail = k } }
                if (totalPages > 1) {
                    item {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
                            OutlinedButton(onClick = { if (page > 1) page-- }, enabled = page > 1, border = BorderStroke(1.dp, Color.White.copy(alpha = 0.3f)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)) { Text("Prev") }
                            Spacer(Modifier.width(12.dp))
                            Text("Halaman $page / $totalPages", color = Color.White, fontSize = 13.sp)
                            Spacer(Modifier.width(12.dp))
                            OutlinedButton(onClick = { if (page < totalPages) page++ }, enabled = page < totalPages, border = BorderStroke(1.dp, Color.White.copy(alpha = 0.3f)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)) { Text("Next") }
                        }
                    }
                }
            }

            item {
                Spacer(Modifier.height(8.dp))
                HorizontalDivider(color = Color.White.copy(alpha = 0.1f))
                Spacer(Modifier.height(12.dp))
                Text("© 2025 SIMAIK - Kementerian Pendidikan Dasar dan Menengah BPMP Nusa Tenggara Barat", color = Color(0xFF93C5FD), fontSize = 11.sp)
            }
        }
    }

    detail?.let { keg -> LandingDetailModal(keg) { detail = null } }
    if (showCekSertifikat) CekSertifikatModal(vm) { showCekSertifikat = false }
}

@Composable
private fun TimkerCard(t: Timker, onClick: () -> Unit) {
    Card(shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.10f)), border = BorderStroke(1.dp, Color.White.copy(alpha = 0.15f)), modifier = Modifier.fillMaxWidth().clickable { onClick() }) {
        Column(Modifier.padding(16.dp)) {
            Box(Modifier.size(44.dp).clip(RoundedCornerShape(12.dp)).background(t.color), contentAlignment = Alignment.Center) {
                Icon(t.icon, null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            Spacer(Modifier.height(12.dp))
            Text(t.name, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, maxLines = 2, overflow = TextOverflow.Ellipsis)
            Spacer(Modifier.height(4.dp))
            Text(t.desc, color = Color(0xFFBFDBFE), fontSize = 11.sp, lineHeight = 15.sp, maxLines = 3, overflow = TextOverflow.Ellipsis)
        }
    }
}

@Composable
private fun LandingKegiatanCard(k: Kegiatan, onDetail: () -> Unit) {
    val st = hitungStatus(k.tanggal_mulai, k.tanggal_selesai, k.status)
    Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.10f)), border = BorderStroke(1.dp, Color.White.copy(alpha = 0.15f)), modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(verticalAlignment = Alignment.Top) {
                Text(k.nama_kegiatan ?: "-", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f), maxLines = 2, overflow = TextOverflow.Ellipsis)
                OutlinedButton(onClick = onDetail, shape = RoundedCornerShape(8.dp), border = BorderStroke(1.dp, Color(0xFF22D3EE).copy(alpha = 0.5f)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFA5F3FC)), contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp)) {
                    Text("Detail", fontSize = 11.sp)
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Pill("${fmtTglLanding(k.tanggal_mulai)} - ${fmtTglLanding(k.tanggal_selesai)}")
                Pill(st)
            }
        }
    }
}

@Composable
private fun Pill(text: String) {
    Box(Modifier.clip(RoundedCornerShape(50)).background(Color.White.copy(alpha = 0.12f)).padding(horizontal = 8.dp, vertical = 3.dp)) {
        Text(text, color = Color(0xFFBFDBFE), fontSize = 10.sp)
    }
}

@Composable
private fun LandingDetailModal(k: Kegiatan, onClose: () -> Unit) {
    val ctx = LocalContext.current
    AlertDialog(
        onDismissRequest = onClose, containerColor = Color(0xFF0B1B33),
        title = { Text("Detail Kegiatan", color = Color.White, fontWeight = FontWeight.Bold) },
        text = {
            Column(Modifier.fillMaxWidth().heightIn(max = 480.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(k.nama_kegiatan ?: "-", color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                InfoGelap("Tanggal", "${fmtTglLanding(k.tanggal_mulai)} - ${fmtTglLanding(k.tanggal_selesai)}")
                InfoGelap("Metode", k.metode_pelaksanaan?.replaceFirstChar { it.uppercase() } ?: "-")
                if (!k.daftar_tpk.isNullOrEmpty()) {
                    Text("Tempat Pelaksanaan Kegiatan (TPK)", color = Color(0xFF22D3EE), fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    k.daftar_tpk.forEachIndexed { i, tpk -> Text("${i + 1}. ${tpk.lokasi}${tpk.kabupaten_kota?.let { " ($it)" } ?: ""}", color = Color.White, fontSize = 12.sp) }
                }
                InfoGelap("Total Peserta", "${k.total_peserta ?: 0}")
                val slug = slugifyJudul(k.nama_kegiatan)
                val urlDetail = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/$slug"
                // Tombol buka halaman (tanpa QR, sesuai permintaan)
                Text("Halaman Terkait", color = Color(0xFF22D3EE), fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                val ctxBtn = LocalContext.current
                @Composable fun TombolBuka(label: String, url: String) {
                    OutlinedButton(
                        onClick = { runCatching { ctxBtn.startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url))) } },
                        shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, Color(0xFF22D3EE).copy(alpha = 0.6f)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFA5F3FC)), modifier = Modifier.fillMaxWidth()
                    ) { Icon(Icons.Default.OpenInNew, null, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(8.dp)); Text(label, fontSize = 13.sp) }
                }
                TombolBuka("Buka Detail Kegiatan", urlDetail)
                TombolBuka("Buka Formulir Biodata", "https://siamin.gdoank.my.id/formulir/${k.id_kegiatan}/Peserta/$slug")
                (k.daftar_tpk?.firstOrNull()?.id_tpk)?.let { tpkId ->
                    TombolBuka("Buka Evaluasi", "https://siamin.gdoank.my.id/evaluasi/${k.id_kegiatan}/$tpkId/$slug")
                }
                Text("Deskripsi", color = Color(0xFF22D3EE), fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                Text(k.deskripsi ?: "-", color = Color(0xFFBFDBFE), fontSize = 12.sp, lineHeight = 17.sp)
            }
        },
        confirmButton = {
            TextButton(onClick = {
                val slug = slugifyJudul(k.nama_kegiatan)
                val url = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/$slug"
                val send = android.content.Intent(android.content.Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(android.content.Intent.EXTRA_TEXT, "${k.nama_kegiatan}\n$url") }
                ctx.startActivity(android.content.Intent.createChooser(send, "Share Halaman"))
            }) { Text("Share Halaman", color = Color(0xFF22D3EE)) }
        },
        dismissButton = { TextButton(onClick = onClose) { Text("Tutup", color = Color(0xFF93C5FD)) } }
    )
}

@Composable
private fun InfoGelap(label: String, value: String) {
    Column {
        Text(label, color = Color(0xFF93C5FD), fontSize = 11.sp)
        Text(value, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Medium)
    }
}

@Composable
private fun CekSertifikatModal(vm: MainViewModel, onClose: () -> Unit) {
    val ctx = LocalContext.current
    var kode by remember { mutableStateOf("") }
    var result by remember { mutableStateOf<String?>(null) }
    var busy by remember { mutableStateOf(false) }
    fun verify(k: String) { busy = true; result = "Memverifikasi..."; vm.cekSertifikat(k) { result = it; busy = false } }

    val pdfPicker = androidx.activity.compose.rememberLauncherForActivityResult(androidx.activity.result.contract.ActivityResultContracts.OpenDocument()) { uri ->
        uri?.let { decodeQrFromPdf(ctx, it) { found -> if (found != null) verify(found) else { result = "QR tidak ditemukan dalam file PDF."; busy = false } } }
    }
    val scanLauncher = androidx.activity.compose.rememberLauncherForActivityResult(com.journeyapps.barcodescanner.ScanContract()) { r ->
        if (r.contents != null) verify(r.contents) else result = "Scan dibatalkan."
    }

    AlertDialog(
        onDismissRequest = onClose, containerColor = Color(0xFF0B1B33),
        title = { Text("Cek Keaslian Sertifikat", color = Color.White, fontWeight = FontWeight.Bold) },
        text = {
            Column(Modifier.heightIn(max = 440.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Verifikasi keaslian sertifikat dengan scan QR (PDF / kamera) atau input kode manual.", color = Color(0xFFBFDBFE), fontSize = 12.sp)
                // Scan dari PDF
                OutlinedButton(onClick = { busy = true; result = "Pilih file PDF sertifikat..."; pdfPicker.launch(arrayOf("application/pdf")) }, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, Color(0xFF60A5FA)), colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF93C5FD)), modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Default.PictureAsPdf, null, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)); Text("Scan dari PDF")
                }
                // Scan dengan Kamera
                Button(onClick = { busy = true; scanLauncher.launch(com.journeyapps.barcodescanner.ScanOptions().setDesiredBarcodeFormats(com.journeyapps.barcodescanner.ScanOptions.QR_CODE).setPrompt("Arahkan kamera ke QR sertifikat")) }, shape = RoundedCornerShape(10.dp), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)), modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Default.CameraAlt, null, modifier = Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)); Text("Scan dengan Kamera")
                }
                HorizontalDivider(color = Color.White.copy(alpha = 0.1f))
                Text("atau input kode manual", color = Color(0xFF94A3B8), fontSize = 11.sp)
                OutlinedTextField(
                    value = kode, onValueChange = { kode = it }, label = { Text("Kode Sertifikat") }, singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = Color.White, focusedBorderColor = Color(0xFF34D399), unfocusedBorderColor = Color.White.copy(alpha = 0.2f)),
                    shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth()
                )
                Button(onClick = { verify(kode) }, enabled = kode.isNotBlank() && !busy, shape = RoundedCornerShape(10.dp), colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669)), modifier = Modifier.fillMaxWidth()) {
                    Text("Cek Keaslian")
                }
                result?.let {
                    Text(it, color = if (it.contains("TERVERIFIKASI")) Color(0xFF34D399) else Color(0xFFA5F3FC), fontSize = 12.sp, lineHeight = 18.sp)
                }
            }
        },
        confirmButton = {},
        dismissButton = { TextButton(onClick = onClose) { Text("Tutup", color = Color(0xFF93C5FD)) } }
    )
}

/** Render halaman PDF → decode QR (ZXing) → kembalikan kode QR atau null. */
private fun decodeQrFromPdf(context: android.content.Context, uri: android.net.Uri, onResult: (String?) -> Unit) {
    Thread {
        var kode: String? = null
        try {
            val file = java.io.File.createTempFile("cert", ".pdf", context.cacheDir)
            context.contentResolver.openInputStream(uri)?.use { input -> file.outputStream().use { input.copyTo(it) } }
            val pfd = android.os.ParcelFileDescriptor.open(file, android.os.ParcelFileDescriptor.MODE_READ_ONLY)
            val renderer = android.graphics.pdf.PdfRenderer(pfd)
            for (i in 0 until renderer.pageCount) {
                val page = renderer.openPage(i)
                val bmp = android.graphics.Bitmap.createBitmap((page.width * 2), (page.height * 2), android.graphics.Bitmap.Config.ARGB_8888)
                page.render(bmp, null, null, android.graphics.pdf.PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                page.close()
                val pixels = IntArray(bmp.width * bmp.height); bmp.getPixels(pixels, 0, bmp.width, 0, 0, bmp.width, bmp.height)
                val source = com.google.zxing.RGBLuminanceSource(bmp.width, bmp.height, pixels)
                val binary = com.google.zxing.BinaryBitmap(com.google.zxing.common.HybridBinarizer(source))
                try { kode = com.google.zxing.MultiFormatReader().decode(binary).text } catch (_: Exception) {}
                if (kode != null) break
            }
            renderer.close(); pfd.close(); file.delete()
        } catch (_: Exception) { kode = null }
        android.os.Handler(android.os.Looper.getMainLooper()).post { onResult(kode) }
    }.start()
}
