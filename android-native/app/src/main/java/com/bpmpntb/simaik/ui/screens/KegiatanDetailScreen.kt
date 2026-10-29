package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
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
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.api.KegiatanPayload
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
    LaunchedEffect(id) { if (id > 0) vm.loadDetail(id) }
    var showEdit by remember { mutableStateOf(false) }
    var showDelete by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        Row(
            Modifier.fillMaxWidth().background(Color.White).padding(horizontal = 8.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, "Kembali", tint = TextPrimary)
            }
            Text("Detail Kegiatan", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        }
        HorizontalDivider(color = Border)

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
                    }
                }
                else -> Text("Data tidak ditemukan.", Modifier.align(Alignment.Center), color = TextSecondary)
            }
        }
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
