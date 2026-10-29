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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KegiatanListScreen(vm: MainViewModel, onOpen: (Int) -> Unit) {
    val s = vm.state
    val session = remember { com.bpmpntb.simaik.data.Session(vm.getApplication<android.app.Application>()) }
    LaunchedEffect(Unit) { vm.loadKegiatan() }

    var showForm by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<Kegiatan?>(null) }
    var deleting by remember { mutableStateOf<Kegiatan?>(null) }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Row(
            Modifier.fillMaxWidth().background(Color.White).padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Kegiatan", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.weight(1f))
            Button(
                onClick = { editing = null; showForm = true },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentBlue)
            ) {
                Icon(Icons.Default.Add, null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text("Tambah", fontSize = 14.sp)
            }
        }
        HorizontalDivider(color = Border)

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading && s.kegiatanList.isEmpty() -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null && s.kegiatanList.isEmpty() -> Text(s.error ?: "", color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                s.kegiatanList.isEmpty() -> Text("Belum ada kegiatan.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(s.kegiatanList, key = { it.id_kegiatan }) { k ->
                        KegiatanManageCard(
                            k,
                            onClick = { onOpen(k.id_kegiatan) },
                            onEdit = { editing = k; showForm = true },
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
                    if (ok) showForm = false
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
                    vm.deleteKegiatan(k.id_kegiatan) { deleting = null }
                }) { Text("Hapus", color = ErrorText) }
            },
            dismissButton = { TextButton(onClick = { deleting = null }) { Text("Batal") } }
        )
    }
}

@Composable
private fun KegiatanManageCard(k: Kegiatan, onClick: () -> Unit, onEdit: () -> Unit, onDelete: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
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
            IconButton(onClick = onEdit) { Icon(Icons.Default.Edit, "Edit", tint = AccentBlue) }
            IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "Hapus", tint = ErrorText) }
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
