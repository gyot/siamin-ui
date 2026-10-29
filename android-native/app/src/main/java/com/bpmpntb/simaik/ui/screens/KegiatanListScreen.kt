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
            onSave = { payload ->
                vm.saveKegiatan(payload.copy(id_pegawai = session.idPegawai.takeIf { it > 0 }), editing?.id_kegiatan) { ok ->
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
        elevation = CardDefaults.cardElevation(0.dp),
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
fun KegiatanFormDialog(editing: Kegiatan?, onSave: (KegiatanPayload) -> Unit, onDismiss: () -> Unit) {
    var nama by remember { mutableStateOf(editing?.nama_kegiatan ?: "") }
    var deskripsi by remember { mutableStateOf(editing?.deskripsi ?: "") }
    var tglMulai by remember { mutableStateOf(editing?.tanggal_mulai ?: "") }
    var tglSelesai by remember { mutableStateOf(editing?.tanggal_selesai ?: "") }
    var status by remember { mutableStateOf(editing?.status ?: "draft") }
    var metode by remember { mutableStateOf(editing?.metode_pelaksanaan ?: "luring") }

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

                DropdownField("Status", listOf("draft", "berjalan", "selesai"), status) { status = it }
                DropdownField("Metode", listOf("daring", "luring", "hybrid"), metode) { metode = it }

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
                                    metode_pelaksanaan = metode
                                )
                            )
                        },
                        enabled = nama.isNotBlank() && tglMulai.isNotBlank() && tglSelesai.isNotBlank(),
                        shape = RoundedCornerShape(10.dp)
                    ) { Text("Simpan") }
                }
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
