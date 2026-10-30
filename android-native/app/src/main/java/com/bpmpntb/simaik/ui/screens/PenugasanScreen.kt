package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.PenugasanItem
import com.bpmpntb.simaik.api.PenugasanPayload
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun PenugasanScreen(vm: MainViewModel, kegiatanId: Int? = null) {
    val s = vm.state
    LaunchedEffect(kegiatanId) {
        vm.loadPenugasan(); vm.loadPegawai()
        if (kegiatanId != null && kegiatanId > 0) vm.loadDetail(kegiatanId)
    }
    val myId = vm.currentPegawaiId
    val k = s.kegiatanDetail
    val isPer = kegiatanId != null && kegiatanId > 0
    val canManage = isPer && ((k?.id_pegawai == myId || k?.created_by == myId) ||
        s.penugasanList.any { it.id_kegiatan == kegiatanId && it.id_pegawai == myId && (it.peran ?: "").equals("panitia", true) })

    val rowsBase = s.penugasanList.filter { !isPer || it.id_kegiatan == kegiatanId }

    // Filter ala web (global): search + kab/kota + tanggal
    var search by remember { mutableStateOf("") }
    var kabKota by remember { mutableStateOf("") }
    var tglMulai by remember { mutableStateOf("") }
    var tglSelesai by remember { mutableStateOf("") }
    val rows = rowsBase.filter {
        (search.isBlank() || (it.nama_pegawai ?: "").contains(search, true) || (it.nama_kegiatan ?: "").contains(search, true)) &&
            (kabKota.isBlank() || (it.kab_kota ?: "").equals(kabKota, true)) &&
            (tglMulai.isBlank() || (it.tanggal_mulai ?: "") >= tglMulai) &&
            (tglSelesai.isBlank() || (it.tanggal_selesai ?: "") <= tglSelesai)
    }

    var showTambah by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<PenugasanItem?>(null) }
    var deleting by remember { mutableStateOf<PenugasanItem?>(null) }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Text(
            if (isPer) "Petugas Kegiatan" else "Data Penugasan Pegawai",
            fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 2.dp)
        )
        Text(
            if (isPer) (k?.nama_kegiatan ?: "Kegiatan") else "Lihat data penugasan pegawai.",
            fontSize = 12.sp, color = TextSecondary,
            modifier = Modifier.padding(start = 16.dp, bottom = 10.dp), maxLines = 2
        )
        HorizontalDivider(color = Border)

        if (isPer) {
            Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(
                    if (canManage) "Kelola petugas kegiatan ini" else "Hanya pembuat/panitia yang dapat mengelola",
                    fontSize = 12.sp, color = TextSecondary, modifier = Modifier.weight(1f)
                )
                if (canManage) {
                    Button(onClick = { showTambah = true }, shape = RoundedCornerShape(50)) {
                        Icon(Icons.Default.Add, null, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Tambah Petugas")
                    }
                }
            }
        } else {
            // Filter ala web (mode global)
            Column(Modifier.padding(horizontal = 12.dp, vertical = 8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = search, onValueChange = { search = it },
                    placeholder = { Text("Cari pegawai / kegiatan...", fontSize = 13.sp) },
                    singleLine = true, shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    KabKotaDropdown(kabKota) { kabKota = it }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(Modifier.weight(1f)) {
                        OutlinedTextField(value = tglMulai, onValueChange = { tglMulai = it }, label = { Text("Dari tgl (YYYY-MM-DD)", fontSize = 11.sp) }, singleLine = true, shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth())
                    }
                    Box(Modifier.weight(1f)) {
                        OutlinedTextField(value = tglSelesai, onValueChange = { tglSelesai = it }, label = { Text("Sampai tgl", fontSize = 11.sp) }, singleLine = true, shape = RoundedCornerShape(10.dp), modifier = Modifier.fillMaxWidth())
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = { /* filter langsung diterapkan */ }, shape = RoundedCornerShape(10.dp)) { Text("Terapkan", fontSize = 12.sp) }
                    OutlinedButton(onClick = { search = ""; kabKota = ""; tglMulai = ""; tglSelesai = "" }, shape = RoundedCornerShape(10.dp)) { Text("Reset", fontSize = 12.sp) }
                }
            }
        }

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading && rows.isEmpty() -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null && rows.isEmpty() -> Text(s.error ?: "", color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                rows.isEmpty() -> Text(if (isPer) "Belum ada petugas." else "Tidak ada penugasan.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(rows, key = { it.id ?: 0 }) { p ->
                        PetugasCard(p, showActions = canManage, onEdit = { editing = p }, onDelete = { deleting = p })
                    }
                }
            }
        }
    }

    if (showTambah || editing != null) {
        PetugasFormDialog(
            vm = vm, kegiatanId = kegiatanId ?: editing?.id_kegiatan ?: -1, editing = editing,
            onDismiss = { showTambah = false; editing = null }
        )
    }
    deleting?.let { p ->
        AlertDialog(
            onDismissRequest = { deleting = null },
            title = { Text("Hapus Petugas") },
            text = { Text("Hapus penugasan \"${p.nama_pegawai}\"?") },
            confirmButton = {
                TextButton(onClick = { vm.deletePenugasan(p.id ?: -1) { ok -> if (ok) deleting = null } }) {
                    Text("Hapus", color = ErrorText)
                }
            },
            dismissButton = { TextButton(onClick = { deleting = null }) { Text("Batal") } }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun KabKotaDropdown(value: String, onChange: (String) -> Unit) {
    val options = listOf("", "Kota Mataram", "Lombok Barat", "Lombok Tengah", "Lombok Timur", "Lombok Utara", "Sumbawa", "Sumbawa Barat", "Dompu", "Bima", "Kota Bima")
    var expanded by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }, modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value.ifBlank { "Semua Kab/Kota" }, onValueChange = {}, readOnly = true,
            label = { Text("Kabupaten/Kota", fontSize = 11.sp) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier.fillMaxWidth().menuAnchor()
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { opt ->
                DropdownMenuItem(text = { Text(opt.ifBlank { "Semua Kab/Kota" }, fontSize = 13.sp) }, onClick = { onChange(opt); expanded = false })
            }
        }
    }
}

@Composable
private fun PetugasCard(p: PenugasanItem, showActions: Boolean, onEdit: () -> Unit, onDelete: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(40.dp).clip(RoundedCornerShape(50)).background(AccentBlue.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) {
                Text((p.nama_pegawai ?: "?").take(1).uppercase(), color = AccentBlue, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(p.nama_pegawai ?: "Pegawai #${p.id_pegawai ?: "-"}", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                p.nama_kegiatan?.let { Text(it, fontSize = 12.sp, color = TextSecondary, maxLines = 2, lineHeight = 15.sp) }
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    p.peran?.let { Chip(it.replaceFirstChar { c -> c.uppercase() }) }
                    Text(listOfNotNull(p.tanggal_mulai, p.tanggal_selesai).joinToString(" - ").ifBlank { "" }, fontSize = 11.sp, color = TextSecondary)
                }
                Text(listOfNotNull(p.kab_kota, p.lokasi).joinToString(" • ").ifBlank { "" }, fontSize = 11.sp, color = TextSecondary)
            }
            if (showActions) {
                IconButton(onClick = onEdit) { Icon(Icons.Default.Edit, "Edit", tint = AccentBlue) }
                IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "Hapus", tint = ErrorText) }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PetugasFormDialog(vm: MainViewModel, kegiatanId: Int, editing: PenugasanItem?, onDismiss: () -> Unit) {
    val s = vm.state
    val pegawaiList = s.pegawaiList
    var pegawaiId by remember { mutableStateOf(editing?.id_pegawai) }
    var peran by remember { mutableStateOf(editing?.peran ?: "panitia") }
    var pegawaiOpen by remember { mutableStateOf(false) }
    var peranOpen by remember { mutableStateOf(false) }
    var err by remember { mutableStateOf<String?>(null) }

    // Cek bentrok jadwal: pegawai sama tidak boleh di kegiatan lain dengan tanggal tumpang tindih
    fun cekBentrok(pid: Int?): String? {
        if (pid == null) return null
        val k = s.kegiatanDetail ?: return null
        if (k.id_kegiatan != kegiatanId) return null
        val kStart = k.tanggal_mulai?.take(10) ?: return null
        val kEnd = k.tanggal_selesai?.take(10) ?: kStart
        val bentrok = s.penugasanList.find { p ->
            p.id_pegawai == pid && p.id_kegiatan != kegiatanId &&
                p.tanggal_mulai != null && p.tanggal_selesai != null &&
                kStart <= (p.tanggal_selesai ?: "").take(10) && kEnd >= (p.tanggal_mulai ?: "").take(10)
        }
        return bentrok?.let {
            "Pegawai sudah ditugaskan pada kegiatan \"${it.nama_kegiatan}\" (${it.lokasi ?: "-"}) tanggal ${it.tanggal_mulai?.take(10)} - ${it.tanggal_selesai?.take(10)}. Tidak boleh bentrok jadwal."
        }
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (editing != null) "Edit Petugas" else "Tambah Petugas", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                ExposedDropdownMenuBox(expanded = pegawaiOpen, onExpandedChange = { pegawaiOpen = it }) {
                    OutlinedTextField(
                        value = pegawaiList.find { it.id_pegawai == pegawaiId }?.nama ?: "Pilih pegawai",
                        onValueChange = {}, readOnly = true,
                        label = { Text("Pegawai") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(pegawaiOpen) },
                        modifier = Modifier.fillMaxWidth().menuAnchor()
                    )
                    ExposedDropdownMenu(expanded = pegawaiOpen, onDismissRequest = { pegawaiOpen = false }) {
                        pegawaiList.forEach { p ->
                            DropdownMenuItem(
                                text = { Text("${p.nama} (${p.nip ?: "-"})") },
                                onClick = { pegawaiId = p.id_pegawai; pegawaiOpen = false }
                            )
                        }
                    }
                }
                ExposedDropdownMenuBox(expanded = peranOpen, onExpandedChange = { peranOpen = it }) {
                    OutlinedTextField(
                        value = peran, onValueChange = {}, readOnly = true,
                        label = { Text("Peran") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(peranOpen) },
                        modifier = Modifier.fillMaxWidth().menuAnchor()
                    )
                    ExposedDropdownMenu(expanded = peranOpen, onDismissRequest = { peranOpen = false }) {
                        listOf("panitia", "peserta", "narasumber", "pendamping", "petugas").forEach { v ->
                            DropdownMenuItem(text = { Text(v.replaceFirstChar { c -> c.uppercase() }) }, onClick = { peran = v; peranOpen = false })
                        }
                    }
                }
                s.error?.let { Text(it, color = ErrorText, fontSize = 12.sp) }
                err?.let { Text(it, color = ErrorText, fontSize = 12.sp, lineHeight = 16.sp) }
            }
        },
        confirmButton = {
            Button(
                enabled = pegawaiId != null && !s.loading,
                onClick = {
                    pegawaiId?.let { pid ->
                        val bentrok = cekBentrok(pid)
                        if (bentrok != null) { err = bentrok }
                        else {
                            err = null
                            val payload = PenugasanPayload(id_kegiatan = kegiatanId, id_pegawai = pid, peran = peran)
                            if (editing != null) vm.editPenugasan(editing.id ?: -1, payload) { ok -> if (ok) onDismiss() }
                            else vm.savePenugasan(payload) { ok -> if (ok) onDismiss() }
                        }
                    }
                }
            ) { Text(if (s.loading) "Menyimpan..." else "Simpan") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Batal") } }
    )
}
