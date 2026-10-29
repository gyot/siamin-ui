package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.PegawaiItem
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun PegawaiScreen(vm: MainViewModel) {
    val s = vm.state
    LaunchedEffect(Unit) { vm.loadPegawai() }
    ListPage("Pegawai", s.loading, s.error, s.pegawaiList.isEmpty()) {
        items(s.pegawaiList, key = { it.id_pegawai ?: 0 }) { p -> PegawaiRow(p) }
    }
}

@Composable
private fun PegawaiRow(p: PegawaiItem) {
    WebCard {
        Text(p.nama ?: "-", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
        Spacer(Modifier.height(4.dp))
        Text("NIP: ${p.nip ?: "-"}", fontSize = 13.sp, color = TextSecondary)
        Text(p.nama_jabatan ?: "-", fontSize = 13.sp, color = TextSecondary)
        if (p.pangkat != null || p.golongan != null) {
            Text(
                listOfNotNull(p.pangkat, p.golongan).joinToString(" / ").ifBlank { "-" },
                fontSize = 12.sp, color = TextSecondary
            )
        }
    }
}

@Composable
fun ListPage(
    title: String,
    loading: Boolean,
    error: String?,
    empty: Boolean,
    content: LazyListScope.() -> Unit
) {
    Column(Modifier.fillMaxSize().background(WebBg)) {
        Text(
            title,
            fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 12.dp)
        )
        HorizontalDivider(color = Border)
        Box(Modifier.fillMaxSize()) {
            when {
                loading -> CircularProgressIndicator(Modifier.align(Alignment.Center).padding(24.dp))
                error != null -> Text(error, color = ErrorText, modifier = Modifier.align(Alignment.Center).padding(24.dp))
                empty -> Text("Tidak ada data.", color = TextSecondary, modifier = Modifier.align(Alignment.Center))
                else -> LazyColumn(
                    contentPadding = PaddingValues(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    content = content
                )
            }
        }
    }
}
