package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.ui.theme.Navy

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KegiatanListScreen(vm: MainViewModel, onOpen: (Int) -> Unit) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadKegiatan() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Kegiatan", fontWeight = FontWeight.Bold) },
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
                s.kegiatanList.isEmpty() -> Text(
                    "Belum ada kegiatan.", modifier = Modifier.align(Alignment.Center)
                )
                else -> LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(s.kegiatanList, key = { it.id_kegiatan }) { k ->
                        KegiatanCard(k) { onOpen(k.id_kegiatan) }
                    }
                }
            }
        }
    }
}

@Composable
private fun KegiatanCard(k: Kegiatan, onClick: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(2.dp),
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(k.nama_kegiatan ?: "-", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
            Text(
                listOfNotNull(k.tanggal_mulai, k.tanggal_selesai).joinToString(" s/d ").ifBlank { "-" },
                fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
            k.status?.let {
                AssistChip(
                    onClick = {},
                    label = { Text(it.replaceFirstChar { c -> c.uppercase() }, fontSize = 12.sp) }
                )
            }
        }
    }
}
