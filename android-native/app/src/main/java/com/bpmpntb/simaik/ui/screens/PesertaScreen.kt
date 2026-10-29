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
import androidx.compose.material.icons.filled.Search
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
import com.bpmpntb.simaik.api.PesertaItem
import com.bpmpntb.simaik.api.PesertaPayload
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun PesertaScreen(vm: MainViewModel, kegiatanId: Int? = null) {
    val s = vm.state
    LaunchedEffect(kegiatanId) { vm.loadPeserta(kegiatanId); vm.loadKegiatan() }
    var search by remember { mutableStateOf("") }
    var showForm by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<PesertaItem?>(null) }
    var deleting by remember { mutableStateOf<PesertaItem?>(null) }

    val peserta = s.pesertaList.filter {
        search.isBlank() || (it.nama_lengkap ?: "").contains(search, true)
    }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Row(Modifier.fillMaxWidth().background(Color.White).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(if (kegiatanId != null) "Peserta Kegiatan" else "Peserta", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.weight(1f))
        }
        HorizontalDivider(color = Border)

        Row(
            Modifier.fillMaxWidth().padding(12.dp).clip(RoundedCornerShape(24.dp)).background(ChipBg)
                .padding(horizontal = 14.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Search, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
            OutlinedTextField(
                value = search, onValueChange = { search = it },
                placeholder = { Text("Ketik nama peserta...", color = TextSecondary, fontSize = 15.sp) },
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Color.Transparent, unfocusedBorderColor = Color.Transparent),
                singleLine = true, modifier = Modifier.weight(1f)
            )
        }

        Box(Modifier.fillMaxSize()) {
            when {
                s.loading && s.pesertaList.isEmpty() -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null && s.pesertaList.isEmpty() -> Text(s.error ?: "", color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                peserta.isEmpty() -> Text("Tidak ada peserta.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(peserta, key = { it.id_peserta ?: 0 }) { p ->
                        PesertaCard(
                            p,
                            onEdit = { editing = p; showForm = true },
                            onDelete = { deleting = p }
                        )
                    }
                }
            }
        }
    }

    if (showForm) {
        PesertaFormDialog(
            editing = editing,
            kegiatanOptions = s.kegiatanList.map { (it.id_kegiatan to (it.nama_kegiatan ?: "-")) },
            onSave = { payload -> vm.savePeserta(payload, editing?.id_peserta) { ok -> if (ok) showForm = false } },
            onDismiss = { showForm = false }
        )
    }

    deleting?.let { p ->
        AlertDialog(
            onDismissRequest = { deleting = null },
            title = { Text("Hapus Peserta") },
            text = { Text("Yakin ingin menghapus \"${p.nama_lengkap}\"?") },
            confirmButton = { TextButton(onClick = { vm.deletePeserta(p.id_peserta ?: 0) { deleting = null } }) { Text("Hapus", color = ErrorText) } },
            dismissButton = { TextButton(onClick = { deleting = null }) { Text("Batal") } }
        )
    }
}

@Composable
private fun PesertaCard(p: PesertaItem, onEdit: () -> Unit, onDelete: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(p.nama_lengkap ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                Text("NIP: ${p.nip ?: "-"}  •  ${p.jabatan ?: "-"}", fontSize = 12.sp, color = TextSecondary)
                Text(p.kegiatan?.nama_kegiatan ?: "Kegiatan #${p.id_kegiatan ?: "-"}", fontSize = 12.sp, color = TextSecondary)
                p.peran?.let { Chip(it) }
            }
            IconButton(onClick = onEdit) { Icon(Icons.Default.Edit, "Edit", tint = AccentBlue) }
            IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, "Hapus", tint = ErrorText) }
        }
    }
}

@Composable
private fun PesertaFormDialog(
    editing: PesertaItem?,
    kegiatanOptions: List<Pair<Int, String>>,
    onSave: (PesertaPayload) -> Unit,
    onDismiss: () -> Unit
) {
    var idKegiatan by remember { mutableStateOf(editing?.id_kegiatan ?: kegiatanOptions.firstOrNull()?.first ?: 0) }
    var nama by remember { mutableStateOf(editing?.nama_lengkap ?: "") }
    var nip by remember { mutableStateOf(editing?.nip ?: "") }
    var jabatan by remember { mutableStateOf(editing?.jabatan ?: "") }
    var peran by remember { mutableStateOf(editing?.peran ?: "") }
    var noHp by remember { mutableStateOf(editing?.no_hp ?: "") }
    var email by remember { mutableStateOf(editing?.email ?: "") }
    var instansi by remember { mutableStateOf(editing?.nama_instansi ?: "") }
    var kabKota by remember { mutableStateOf(editing?.kab_kota ?: "") }

    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(16.dp), color = Color.White) {
            Column(Modifier.verticalScroll(rememberScrollState()).padding(20.dp)) {
                Text(if (editing == null) "Tambah Peserta" else "Edit Peserta", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                Spacer(Modifier.height(16.dp))

                DropdownField("Kegiatan *", kegiatanOptions.map { it.second }, kegiatanOptions.find { it.first == idKegiatan }?.second ?: "") { selected ->
                    idKegiatan = kegiatanOptions.find { it.second == selected }?.first ?: idKegiatan
                }
                FormField("Nama Lengkap *", nama) { nama = it }
                FormField("NIP", nip) { nip = it }
                FormField("Jabatan", jabatan) { jabatan = it }
                FormField("Peran", peran) { peran = it }
                FormField("No. HP", noHp) { noHp = it }
                FormField("Email", email) { email = it }
                FormField("Nama Instansi", instansi) { instansi = it }
                FormField("Kabupaten/Kota", kabKota) { kabKota = it }

                Spacer(Modifier.height(20.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton(onClick = onDismiss) { Text("Batal") }
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = {
                            onSave(
                                PesertaPayload(
                                    id_kegiatan = idKegiatan, nama_lengkap = nama,
                                    nip = nip.ifBlank { null }, jabatan = jabatan.ifBlank { null },
                                    peran = peran.ifBlank { null }, no_hp = noHp.ifBlank { null },
                                    email = email.ifBlank { null }, nama_instansi = instansi.ifBlank { null },
                                    kab_kota = kabKota.ifBlank { null }
                                )
                            )
                        },
                        enabled = nama.isNotBlank() && idKegiatan > 0,
                        shape = RoundedCornerShape(10.dp)
                    ) { Text("Simpan") }
                }
            }
        }
    }
}
