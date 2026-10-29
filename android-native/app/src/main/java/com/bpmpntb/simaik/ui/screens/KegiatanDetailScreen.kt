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
        if (id > 0) vm.loadDetail(id)
        vm.loadPenugasan(); vm.loadSertifikat(); vm.loadPegawai()
    }
    // akses kelola: pembuat kegiatan ATAU panitia kegiatan
    val myId = vm.currentPegawaiId
    val kd = s.kegiatanDetail
    val canManage = (kd?.id_pegawai == myId || kd?.created_by == myId) ||
        s.penugasanList.any { it.id_kegiatan == id && it.id_pegawai == myId && (it.peran ?: "").equals("panitia", true) }
    var showTambahPetugas by remember { mutableStateOf(false) }
    var showEdit by remember { mutableStateOf(false) }
    var showDelete by remember { mutableStateOf(false) }

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
                    painter = painterResource(R.drawable.logo),
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
                                ActionTile("Peserta", Icons.Default.Group, Color(0xFF22C55E), Modifier.weight(1f)) { onNavigate("peserta") }
                                ActionTile("Penugasan", Icons.Default.Assignment, Color(0xFFF59E0B), Modifier.weight(1f)) { onNavigate("penugasan") }
                            }
                            Spacer(Modifier.height(8.dp))
                            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                ActionTile("Sertifikat", Icons.Default.CardMembership, Color(0xFFA855F7), Modifier.weight(1f)) { onNavigate("sertifikat") }
                                ActionTile("Bagikan", Icons.Default.Share, Color(0xFF0EA5E9), Modifier.weight(1f)) {
                                    val url = "https://siamin.gdoank.my.id/kegiatan/${k.id_kegiatan}"
                                    val send = Intent(Intent.ACTION_SEND).apply {
                                        type = "text/plain"
                                        putExtra(Intent.EXTRA_TEXT, "${k.nama_kegiatan ?: "Kegiatan"}\n$url")
                                    }
                                    context.startActivity(Intent.createChooser(send, "Bagikan Kegiatan"))
                                }
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

                        // PETUGAS: list + tambah (akses creator/panitia)
                        WebCard {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Petugas Kegiatan", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.weight(1f))
                                if (canManage) {
                                    FilledTonalButton(onClick = { showTambahPetugas = true }, shape = RoundedCornerShape(50)) {
                                        Icon(Icons.Default.Add, null, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("Tambah", fontSize = 12.sp)
                                    }
                                }
                            }
                            Spacer(Modifier.height(10.dp))
                            val petugas = s.penugasanList.filter { it.id_kegiatan == (k.id_kegiatan ?: id) }
                            if (petugas.isEmpty()) {
                                Text("Belum ada petugas.", fontSize = 13.sp, color = TextSecondary)
                            } else {
                                petugas.forEach { p -> PetugasRow(p) }
                            }
                            if (!canManage) {
                                Spacer(Modifier.height(8.dp))
                                Text("Hanya pembuat kegiatan atau panitia yang dapat menambah petugas.", fontSize = 11.sp, color = TextSecondary)
                            }
                        }

                        // INFO SERTIFIKAT khusus kegiatan (akses creator/panitia)
                        if (canManage) {
                            val cert = s.sertifikatList.find { it.id_kegiatan == (k.id_kegiatan ?: id) }
                            WebCard {
                                Text("Info Sertifikat", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Spacer(Modifier.height(10.dp))
                                if (cert != null) {
                                    InfoRow("Nomor Sertifikat", cert.nomor_sertifikat ?: "-")
                                    Spacer(Modifier.height(8.dp))
                                    InfoRow("Tanggal TTD", cert.tanggal_ttd ?: "-")
                                } else {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.Info, null, tint = Color(0xFFF59E0B), modifier = Modifier.size(18.dp))
                                        Spacer(Modifier.width(8.dp))
                                        Text("Sertifikat belum dibuat.", fontSize = 13.sp, color = TextSecondary)
                                    }
                                }
                            }
                        }
                    }
                }
                else -> Text("Data tidak ditemukan.", Modifier.align(Alignment.Center), color = TextSecondary)
            }
        }
    }

    if (showTambahPetugas) {
        TambahPetugasDialog(vm = vm, kegiatanId = id, onDismiss = { showTambahPetugas = false })
    }

    if (showEdit) {
        KegiatanFormDialog(
            editing = s.kegiatanDetail,
            onSave = { payload ->
                vm.saveKegiatan(payload, s.kegiatanDetail?.id_kegiatan) { ok -> if (ok) showEdit = false }
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
private fun InfoRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = TextSecondary, fontSize = 14.sp)
        Text(value, fontWeight = FontWeight.Medium, fontSize = 14.sp, color = TextPrimary)
    }
}

@Composable
private fun PetugasRow(p: PenugasanItem) {
    Row(Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(36.dp).clip(RoundedCornerShape(50)).background(AccentBlue.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) {
            Text((p.nama_pegawai ?: "?").take(1).uppercase(), color = AccentBlue, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.width(10.dp))
        Column(Modifier.weight(1f)) {
            Text(p.nama_pegawai ?: "-", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
            Text(p.nama_kegiatan ?: "", fontSize = 11.sp, color = TextSecondary, maxLines = 1)
        }
        p.peran?.let { Chip(it.replaceFirstChar { c -> c.uppercase() }) }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TambahPetugasDialog(vm: MainViewModel, kegiatanId: Int, onDismiss: () -> Unit) {
    val s = vm.state
    var pegawaiId by remember { mutableStateOf<Int?>(null) }
    var peran by remember { mutableStateOf("panitia") }
    var pegawaiOpen by remember { mutableStateOf(false) }
    val pegawaiList = s.pegawaiList

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Tambah Petugas", fontWeight = FontWeight.Bold) },
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
                var peranOpen by remember { mutableStateOf(false) }
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
            }
        },
        confirmButton = {
            Button(
                enabled = pegawaiId != null && !s.loading,
                onClick = {
                    pegawaiId?.let { pid ->
                        vm.savePenugasan(PenugasanPayload(id_kegiatan = kegiatanId, id_pegawai = pid, peran = peran)) { ok -> if (ok) onDismiss() }
                    }
                }
            ) { Text(if (s.loading) "Menyimpan..." else "Simpan") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Batal") } }
    )
}
