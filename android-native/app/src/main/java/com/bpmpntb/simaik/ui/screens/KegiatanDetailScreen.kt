package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun KegiatanDetailScreen(vm: MainViewModel, id: Int, onBack: () -> Unit) {
    val s = vm.state
    LaunchedEffect(id) { if (id > 0) vm.loadDetail(id) }

    Column(Modifier.fillMaxSize().background(WebBg)) {
        // Header putih ala web (sticky)
        Row(
            Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 8.dp, vertical = 12.dp),
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
                s.loading -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                s.error != null -> Text(
                    s.error ?: "", color = ErrorText,
                    modifier = Modifier.align(Alignment.Center).padding(24.dp)
                )
                s.kegiatanDetail != null -> {
                    val k = s.kegiatanDetail!!
                    Column(
                        Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        WebCard {
                            Text("Informasi Kegiatan", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Spacer(Modifier.height(10.dp))
                            Text(k.nama_kegiatan ?: "-", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                            Spacer(Modifier.height(8.dp))
                            k.status?.let {
                                Chip(it.replaceFirstChar { c -> c.uppercase() })
                                Spacer(Modifier.height(8.dp))
                            }
                            HorizontalDivider(color = Border)
                            Spacer(Modifier.height(10.dp))
                            InfoRow("Tanggal", listOfNotNull(k.tanggal_mulai, k.tanggal_selesai)
                                .joinToString(" s/d ").ifBlank { "-" })
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
}

@Composable
private fun WebCard(content: @Composable ColumnScope.() -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(0.dp),
        border = BorderStroke(1.dp, Border),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(16.dp), content = content)
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = TextSecondary, fontSize = 14.sp)
        Text(value, fontWeight = FontWeight.Medium, fontSize = 14.sp, color = TextPrimary)
    }
}
