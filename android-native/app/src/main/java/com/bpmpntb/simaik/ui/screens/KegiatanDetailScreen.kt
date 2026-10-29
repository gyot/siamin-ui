package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.ui.theme.Navy

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KegiatanDetailScreen(vm: MainViewModel, id: Int, onBack: () -> Unit) {
    val s = vm.state
    LaunchedEffect(id) { if (id > 0) vm.loadDetail(id) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Detail Kegiatan", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Kembali", tint = MaterialTheme.colorScheme.onPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Navy,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { pad ->
        Box(Modifier.padding(pad).fillMaxSize()) {
            when {
                s.loading -> CircularProgressIndicator(Modifier.align(Alignment.Center))
                s.error != null -> Text(
                    s.error ?: "", color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.align(Alignment.Center).padding(24.dp)
                )
                s.kegiatanDetail != null -> {
                    val k = s.kegiatanDetail!!
                    Column(
                        Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Card(
                            shape = RoundedCornerShape(20.dp),
                            elevation = CardDefaults.cardElevation(4.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                Text(k.nama_kegiatan ?: "-", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                                k.status?.let {
                                    AssistChip(onClick = {}, label = { Text(it.replaceFirstChar { c -> c.uppercase() }) })
                                }
                                Divider()
                                InfoRow("Tanggal", listOfNotNull(k.tanggal_mulai, k.tanggal_selesai)
                                    .joinToString(" s/d ").ifBlank { "-" })
                                InfoRow("Metode", k.metode_pelaksanaan ?: "-")
                            }
                        }

                        k.deskripsi?.let {
                            Card(shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
                                Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Text("Deskripsi", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                                    Text(it, fontSize = 14.sp, lineHeight = 22.sp)
                                }
                            }
                        }

                        k.rincian_kegiatan?.let {
                            Card(shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
                                Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Text("Rincian", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                                    Text(it, fontSize = 14.sp, lineHeight = 22.sp)
                                }
                            }
                        }
                    }
                }
                else -> Text("Data tidak ditemukan.", Modifier.align(Alignment.Center))
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f), fontSize = 14.sp)
        Text(value, fontWeight = FontWeight.Medium, fontSize = 14.sp)
    }
}
