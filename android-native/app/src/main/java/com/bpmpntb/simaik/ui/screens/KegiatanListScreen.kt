package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.ui.platform.LocalContext
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.api.KegiatanPayload
import com.bpmpntb.simaik.api.TpkItem
import com.bpmpntb.simaik.api.AtkItem
import com.bpmpntb.simaik.api.JadwalDay
import com.bpmpntb.simaik.api.JadwalItem
import com.bpmpntb.simaik.ui.theme.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

private val tglFmt = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale("id", "ID"))
private fun fmtTgl(s: String?): String = try { s?.take(10)?.let { LocalDate.parse(it).format(tglFmt) } ?: "-" } catch (e: Exception) { s ?: "-" }
private fun statusBadgeColor(st: String?) = when (st?.lowercase()) {
    "selesai" -> Color(0xFF057642)
    "berjalan" -> Color(0xFF1877F2)
    "dibatalkan" -> Color(0xFFDC2626)
    else -> Color(0xFFF59E0B)
}

// Status kegiatan DIHITUNG dari tanggal (sesuai web), bukan field status
private fun parseTgl(s: String?): LocalDate? = try { s?.take(10)?.let(LocalDate::parse) } catch (e: Exception) { null }
fun hitungStatus(tanggalMulai: String?, tanggalSelesai: String?, statusField: String?): String {
    val today = LocalDate.now()
    val mulai = parseTgl(tanggalMulai); val selesai = parseTgl(tanggalSelesai)
    return when {
        mulai == null && selesai == null -> (statusField ?: "draft").replaceFirstChar { it.uppercase() }
        mulai != null && today.isBefore(mulai) -> "Akan Datang"
        selesai != null && today.isAfter(selesai) -> "Selesai"
        else -> "Berjalan"
    }
}

// Slug untuk link publik (sesuai web: lowercase, spasi -> -, buang non-word)
fun slugifyJudul(s: String?): String =
    (s ?: "").lowercase().replace(Regex("[^a-z0-9\\s-]"), "").replace(Regex("\\s+"), "-").trim('-')

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KegiatanListScreen(vm: MainViewModel, onOpen: (Int) -> Unit) {
    val s = vm.state
    val session = remember { com.bpmpntb.simaik.data.Session(vm.getApplication<android.app.Application>()) }
    LaunchedEffect(Unit) { vm.loadKegiatanTimSaya() }

    var showForm by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<Kegiatan?>(null) }
    var deleting by remember { mutableStateOf<Kegiatan?>(null) }

    var filterTahun by remember { mutableStateOf("Semua Tahun") }
    var filterStatus by remember { mutableStateOf("Semua Status") }
    val tahunList = s.kegiatanList.mapNotNull { it.tanggal_mulai?.take(4) }.distinct().sortedDescending()
    val filtered = s.kegiatanList.filter {
        (filterTahun == "Semua Tahun" || (it.tanggal_mulai ?: "").startsWith(filterTahun)) &&
            (filterStatus == "Semua Status" || hitungStatus(it.tanggal_mulai, it.tanggal_selesai, it.status).equals(filterStatus, true))
    }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Column(Modifier.background(Color.White).fillMaxWidth().padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("Manajemen Kegiatan", fontSize = 21.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    Text("Kelola semua kegiatan yang ada", fontSize = 13.sp, color = TextSecondary)
                }
                Button(
                    onClick = { editing = null; showForm = true },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AccentBlue)
                ) {
                    Icon(Icons.Default.Add, null, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Tambah Kegiatan", fontSize = 14.sp)
                }
            }
            Spacer(Modifier.height(8.dp))
            Text("Logged in pegawai ID: ${session.idPegawai}", fontSize = 12.sp, color = TextSecondary)
        }
        HorizontalDivider(color = Border)

        // Filter Tahun + Status (dropdown seperti web)
        Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 10.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(Modifier.weight(1f)) {
                FilterDropdown("Semua Tahun", listOf("Semua Tahun") + tahunList, filterTahun) { filterTahun = it }
            }
            Box(Modifier.weight(1f)) {
                FilterDropdown("Semua Status", listOf("Semua Status", "Berjalan", "Akan Datang", "Selesai"), filterStatus) { filterStatus = it }
            }
        }

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading && s.kegiatanList.isEmpty() -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null && s.kegiatanList.isEmpty() -> Text(s.error ?: "", color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                filtered.isEmpty() -> Text("Belum ada kegiatan.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(filtered, key = { it.id_kegiatan }) { k ->
                        KegiatanManageCard(
                            k,
                            onOpen = { onOpen(k.id_kegiatan) },
                            onDelete = { deleting = k }
                        )
                    }
                }
            }
        }
    }

    if (showForm) {
        KegiatanFormDialog(
            editing = editing,
            onSave = { payload, jadwal ->
                vm.saveKegiatan(payload.copy(id_pegawai = session.idPegawai.takeIf { it > 0 }), editing?.id_kegiatan, jadwal) { ok ->
                    if (ok) { showForm = false; vm.loadKegiatanTimSaya() }
                }
            },
            onDismiss = { showForm = false }
        )
    }

    deleting?.let { k ->
        AlertDialog(
            onDismissRequest = { deleting = null },
            title = { Text("Hapus Kegiatan") },
            text = { Text("Yakin ingin menghapus \"${k.nama_kegiatan}\"?") },
            confirmButton = {
                TextButton(onClick = {
                    vm.deleteKegiatan(k.id_kegiatan) { ok -> deleting = null; if (ok) vm.loadKegiatanTimSaya() }
                }) { Text("Hapus", color = ErrorText) }
            },
            dismissButton = { TextButton(onClick = { deleting = null }) { Text("Batal") } }
        )
    }
}

@Composable
private fun KegiatanManageCard(k: Kegiatan, onOpen: () -> Unit, onDelete: () -> Unit) {
    val context = LocalContext.current
    val slug = slugifyJudul(k.nama_kegiatan)
    val shareUrl = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}/$slug"
    val pesertaUrl = "https://siamin.gdoank.my.id/daftar-peserta/${k.id_kegiatan}/$slug"
    val st = hitungStatus(k.tanggal_mulai, k.tanggal_selesai, k.status)
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.Top) {
                Box(Modifier.size(40.dp).clip(RoundedCornerShape(10.dp)).background(Color(0xFF22C55E)), contentAlignment = Alignment.Center) {
                    Text((k.nama_kegiatan ?: "?").take(1).uppercase(), color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(k.nama_kegiatan ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("${fmtTgl(k.tanggal_mulai)} - ${fmtTgl(k.tanggal_selesai)}", fontSize = 12.sp, color = TextSecondary)
                        Text("  ·  ", color = TextSecondary, fontSize = 12.sp)
                        Box(Modifier.clip(RoundedCornerShape(50)).background(statusBadgeColor(st).copy(alpha = 0.12f)).padding(horizontal = 8.dp, vertical = 2.dp)) {
                            Text(st, fontSize = 11.sp, color = statusBadgeColor(st), fontWeight = FontWeight.SemiBold)
                        }
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, null, tint = TextSecondary, modifier = Modifier.size(13.dp))
                        Spacer(Modifier.width(3.dp))
                        Text("${k.lokasi ?: "-"} (${k.kabupaten_kota ?: "-"})", fontSize = 12.sp, color = TextSecondary)
                    }
                    Text(k.unit_kerja ?: "-", fontSize = 12.sp, color = TextSecondary)
                    k.metode_pelaksanaan?.let {
                        Box(Modifier.clip(RoundedCornerShape(6.dp)).background(ChipBg).padding(horizontal = 8.dp, vertical = 3.dp)) {
                            Text(it.replaceFirstChar { c -> c.uppercase() }, fontSize = 11.sp, color = TextSecondary)
                        }
                    }
                    k.peserta_ringkasan?.let { Text(it, fontSize = 11.sp, color = TextSecondary) }
                }
                IconButton(onClick = onOpen) { Icon(Icons.Default.Visibility, "Detail", tint = TextSecondary) }
                IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "Hapus", tint = ErrorText) }
            }
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(onClick = { shareUrl.let { share(context, it, "Share Link") } }, shape = RoundedCornerShape(10.dp), modifier = Modifier.weight(1f)) {
                    Icon(Icons.Default.Share, null, modifier = Modifier.size(14.dp)); Spacer(Modifier.width(4.dp)); Text("Share Link", fontSize = 11.sp)
                }
                OutlinedButton(onClick = { share(context, pesertaUrl, "Link Peserta") }, shape = RoundedCornerShape(10.dp), modifier = Modifier.weight(1f)) {
                    Icon(Icons.Default.Share, null, modifier = Modifier.size(14.dp)); Spacer(Modifier.width(4.dp)); Text("Link Peserta", fontSize = 11.sp)
                }
                Button(onClick = onOpen, shape = RoundedCornerShape(10.dp), colors = ButtonDefaults.buttonColors(containerColor = AccentBlue), modifier = Modifier.weight(1f)) {
                    Icon(Icons.Default.Visibility, null, modifier = Modifier.size(14.dp)); Spacer(Modifier.width(4.dp)); Text("Detail", fontSize = 11.sp)
                }
            }
        }
    }
}

private fun share(context: android.content.Context, url: String, title: String) {
    val send = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(android.content.Intent.EXTRA_TEXT, url)
    }
    context.startActivity(android.content.Intent.createChooser(send, title))
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FilterDropdown(label: String, options: List<String>, value: String, onChange: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
        OutlinedTextField(
            value = value, onValueChange = {}, readOnly = true,
            label = { Text(label, fontSize = 11.sp) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth().menuAnchor()
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { opt ->
                DropdownMenuItem(text = { Text(opt, fontSize = 13.sp) }, onClick = { onChange(opt); expanded = false })
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KegiatanFormDialog(editing: Kegiatan?, onSave: (KegiatanPayload, List<JadwalDay>) -> Unit, onDismiss: () -> Unit) {
    var nama by remember { mutableStateOf(editing?.nama_kegiatan ?: "") }
    var deskripsi by remember { mutableStateOf(editing?.deskripsi ?: "") }
    var tglMulai by remember { mutableStateOf(editing?.tanggal_mulai ?: "") }
    var tglSelesai by remember { mutableStateOf(editing?.tanggal_selesai ?: "") }
    var status by remember { mutableStateOf(editing?.status ?: "draft") }
    var metode by remember { mutableStateOf(editing?.metode_pelaksanaan ?: "luring") }
    var rincian by remember { mutableStateOf(editing?.rincian_kegiatan ?: "") }
    var totalPeserta by remember { mutableStateOf(editing?.total_peserta?.toString() ?: "") }
    var metodeBayar by remember { mutableStateOf(editing?.metode_pembayaran ?: "tidak_dibayar") }
    var unitKerjaId by remember { mutableStateOf(editing?.unit_kerja_id?.toString() ?: "") }
    var dokUrl by remember { mutableStateOf("") }
    var materiUrl by remember { mutableStateOf("") }
    var panduanUrl by remember { mutableStateOf("") }
    var laporanUrl by remember { mutableStateOf("") }
    var suratUrl by remember { mutableStateOf("") }

    // Daftar TPK (wajib min 1)
    val tpkList = remember {
        val initial = editing?.daftar_tpk ?: listOf(TpkItem(lokasi = editing?.lokasi ?: "", kabupaten_kota = editing?.kabupaten_kota))
        mutableStateListOf<TpkItem>().apply {
            if (initial.isEmpty() || initial.all { it.lokasi.isBlank() }) add(TpkItem()) else addAll(initial)
        }
    }

    // Daftar ATK
    val atkList = remember {
        mutableStateListOf<AtkItem>().apply { editing?.daftar_atk?.let { addAll(it) } }
    }

    // Jadwal harian (hari -> items)
    val jadwalList = remember { mutableStateListOf<JadwalDay>() }

    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(16.dp), color = Color.White) {
            Column(Modifier.verticalScroll(rememberScrollState()).padding(20.dp)) {
                Text(
                    if (editing == null) "Tambah Kegiatan" else "Edit Kegiatan",
                    fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary
                )
                Spacer(Modifier.height(16.dp))

                FormField("Nama Kegiatan *", nama) { nama = it }
                FormField("Deskripsi", deskripsi) { deskripsi = it }
                FormField("Tanggal Mulai (YYYY-MM-DD) *", tglMulai) { tglMulai = it }
                FormField("Tanggal Selesai (YYYY-MM-DD) *", tglSelesai) { tglSelesai = it }
                DropdownField("Metode Pelaksanaan", listOf("daring", "luring", "hybrid"), metode) { metode = it }
                DropdownField("Status", listOf("draft", "berjalan", "selesai", "dibatalkan"), status) { status = it }
                DropdownField("Metode Pembayaran", listOf("transfer", "pulsa", "transfer_dan_pulsa", "tunai", "tidak_dibayar"), metodeBayar) { metodeBayar = it }
                FormField("Total Peserta", totalPeserta) { totalPeserta = it }
                FormField("Rincian Kegiatan", rincian) { rincian = it }
                FormField("Unit Kerja ID (opsional)", unitKerjaId) { unitKerjaId = it }

                // Daftar TPK (wajib)
                Spacer(Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Daftar TPK *", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary, modifier = Modifier.weight(1f))
                    TextButton(onClick = { tpkList.add(TpkItem()) }) {
                        Icon(Icons.Default.Add, null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Tambah TPK", fontSize = 12.sp)
                    }
                }
                tpkList.forEachIndexed { i, tpk ->
                    TpkRowEditor(
                        tpk = tpk,
                        canRemove = tpkList.size > 1,
                        onChange = { tpkList[i] = it },
                        onRemove = { tpkList.removeAt(i) }
                    )
                }

                // Daftar ATK
                Spacer(Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Daftar ATK", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary, modifier = Modifier.weight(1f))
                    TextButton(onClick = { atkList.add(AtkItem()) }) {
                        Icon(Icons.Default.Add, null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Tambah ATK", fontSize = 12.sp)
                    }
                }
                atkList.forEachIndexed { i, atk ->
                    AtkRowEditor(atk = atk, onChange = { atkList[i] = it }, onRemove = { atkList.removeAt(i) })
                }

                // Jadwal Harian
                Spacer(Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Jadwal Harian", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary, modifier = Modifier.weight(1f))
                    TextButton(onClick = { jadwalList.add(JadwalDay(hari = "", tanggal = "", items = emptyList())) }) {
                        Icon(Icons.Default.Add, null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Tambah Hari", fontSize = 12.sp)
                    }
                }
                jadwalList.forEachIndexed { i, day ->
                    JadwalDayEditor(day = day, onChange = { jadwalList[i] = it }, onRemove = { jadwalList.removeAt(i) })
                }

                // Link dokumen (opsional)
                Spacer(Modifier.height(8.dp))
                Text("Link Dokumen (opsional)", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                FormField("URL Dokumentasi", dokUrl) { dokUrl = it }
                FormField("URL Materi", materiUrl) { materiUrl = it }
                FormField("URL Panduan", panduanUrl) { panduanUrl = it }
                FormField("URL Laporan", laporanUrl) { laporanUrl = it }
                FormField("URL Surat Menyurat", suratUrl) { suratUrl = it }

                Spacer(Modifier.height(20.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton(onClick = onDismiss) { Text("Batal") }
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = {
                            onSave(
                                KegiatanPayload(
                                    nama_kegiatan = nama,
                                    deskripsi = deskripsi.ifBlank { null },
                                    tanggal_mulai = tglMulai,
                                    tanggal_selesai = tglSelesai,
                                    status = status,
                                    metode_pelaksanaan = metode,
                                    rincian_kegiatan = rincian.ifBlank { null },
                                    unit_kerja_id = unitKerjaId.toIntOrNull(),
                                    total_peserta = totalPeserta.toIntOrNull(),
                                    metode_pembayaran = metodeBayar,
                                    daftar_tpk = tpkList.filter { it.lokasi.isNotBlank() },
                                    daftar_atk = atkList.filter { it.nama_barang.isNotBlank() },
                                    dokumentasi_url = dokUrl.ifBlank { null },
                                    materi_url = materiUrl.ifBlank { null },
                                    panduan_url = panduanUrl.ifBlank { null },
                                    laporan_url = laporanUrl.ifBlank { null },
                                    surat_menyurat_url = suratUrl.ifBlank { null }
                                ),
                                jadwalList.filter { it.hari.isNotBlank() || it.tanggal.isNotBlank() }
                            )
                        },
                        enabled = nama.isNotBlank() && tglMulai.isNotBlank() && tglSelesai.isNotBlank() && tpkList.any { it.lokasi.isNotBlank() },
                        shape = RoundedCornerShape(10.dp)
                    ) { Text("Simpan") }
                }
            }
        }
    }
}

@Composable
private fun TpkRowEditor(tpk: TpkItem, canRemove: Boolean, onChange: (TpkItem) -> Unit, onRemove: () -> Unit) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = ChipBg),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    ) {
        Row(Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                FormField("Lokasi *", tpk.lokasi) { onChange(tpk.copy(lokasi = it)) }
                FormField("Kabupaten/Kota", tpk.kabupaten_kota ?: "") { onChange(tpk.copy(kabupaten_kota = it.ifBlank { null })) }
            }
            if (canRemove) {
                IconButton(onClick = onRemove) { Icon(Icons.Default.Delete, "Hapus TPK", tint = ErrorText) }
            }
        }
    }
}

@Composable
private fun AtkRowEditor(atk: AtkItem, onChange: (AtkItem) -> Unit, onRemove: () -> Unit) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = ChipBg),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    ) {
        Row(Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                FormField("Nama Barang *", atk.nama_barang) { onChange(atk.copy(nama_barang = it)) }
                FormField("Spesifikasi", atk.spesifikasi ?: "") { onChange(atk.copy(spesifikasi = it.ifBlank { null })) }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(Modifier.weight(1f)) { FormField("Jumlah", atk.jumlah?.toString() ?: "") { onChange(atk.copy(jumlah = it.toIntOrNull())) } }
                    Box(Modifier.weight(1f)) { FormField("Satuan", atk.satuan ?: "") { onChange(atk.copy(satuan = it.ifBlank { null })) } }
                }
                FormField("Keterangan", atk.keterangan ?: "") { onChange(atk.copy(keterangan = it.ifBlank { null })) }
            }
            IconButton(onClick = onRemove) { Icon(Icons.Default.Delete, "Hapus ATK", tint = ErrorText) }
        }
    }
}

@Composable
private fun JadwalDayEditor(day: JadwalDay, onChange: (JadwalDay) -> Unit, onRemove: () -> Unit) {
    var hari by remember { mutableStateOf(day.hari) }
    var tanggal by remember { mutableStateOf(day.tanggal) }
    val items = remember { mutableStateListOf<JadwalItem>().apply { day.items?.let { addAll(it) } } }
    fun sync() = onChange(JadwalDay(hari = hari, tanggal = tanggal, items = items.toList()))

    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = ChipBg),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    ) {
        Column(Modifier.padding(10.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.weight(1f)) {
                    DropdownField("Hari", listOf("Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"), hari) { hari = it; sync() }
                }
                IconButton(onClick = onRemove) { Icon(Icons.Default.Delete, "Hapus Hari", tint = ErrorText) }
            }
            FormField("Tanggal (YYYY-MM-DD)", tanggal) { tanggal = it; sync() }
            items.forEachIndexed { i, item ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        FormField("Waktu (mis. 08:00 - 10:00)", item.waktu ?: "") { items[i] = item.copy(waktu = it); sync() }
                        FormField("Kegiatan", item.kegiatan ?: "") { items[i] = item.copy(kegiatan = it); sync() }
                        FormField("Penanggung Jawab", item.pj ?: "") { items[i] = item.copy(pj = it); sync() }
                    }
                    IconButton(onClick = { items.removeAt(i); sync() }) { Icon(Icons.Default.Delete, "Hapus Item", tint = ErrorText) }
                }
            }
            TextButton(onClick = { items.add(JadwalItem()); sync() }) {
                Icon(Icons.Default.Add, null, modifier = Modifier.size(14.dp))
                Spacer(Modifier.width(4.dp))
                Text("Tambah Item", fontSize = 11.sp)
            }
        }
    }
}

@Composable
fun FormField(label: String, value: String, onChange: (String) -> Unit) {
    Column(Modifier.padding(vertical = 6.dp)) {
        Text(label, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextSecondary)
        Spacer(Modifier.height(6.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onChange,
            singleLine = true,
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DropdownField(label: String, options: List<String>, value: String, onChange: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Column(Modifier.padding(vertical = 6.dp)) {
        Text(label, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextSecondary)
        Spacer(Modifier.height(6.dp))
        ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
            OutlinedTextField(
                value = value,
                onValueChange = {},
                readOnly = true,
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth().menuAnchor()
            )
            ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                options.forEach { opt ->
                    DropdownMenuItem(text = { Text(opt) }, onClick = { onChange(opt); expanded = false })
                }
            }
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
