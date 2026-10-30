package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** State pagination per-key (client-side): konsisten antar recomposition. */
object PagingStore {
    val pages = mutableStateMapOf<String, Int>()
    fun pageOf(key: String): Int = pages[key] ?: 1
    fun set(key: String, p: Int) { pages[key] = maxOf(1, p) }
}

/** Ambil slice data untuk halaman saat ini (per key). Clamp otomatis jika page > totalPages. */
fun <T> paged(key: String, list: List<T>, perPage: Int = 10): List<T> {
    val totalPages = maxOf(1, (list.size + perPage - 1) / perPage)
    val p = minOf(PagingStore.pageOf(key), totalPages)
    return list.drop((p - 1) * perPage).take(perPage)
}

/** Kontrol pagination: Prev / Halaman X / Next. Sembunyi jika hanya 1 halaman. */
@Composable
fun PagingBar(
    key: String,
    totalItems: Int,
    perPage: Int = 10,
    modifier: Modifier = Modifier,
    contentColor: Color = Color(0xFF1877F2)
) {
    val totalPages = maxOf(1, (totalItems + perPage - 1) / perPage)
    if (totalPages <= 1) return
    val p = minOf(PagingStore.pageOf(key), totalPages)
    Row(modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
        OutlinedButton(onClick = { PagingStore.set(key, p - 1) }, enabled = p > 1) { Text("Prev", fontSize = 12.sp, color = contentColor) }
        Spacer(Modifier.width(14.dp))
        Text("Halaman $p / $totalPages", fontSize = 13.sp, color = contentColor)
        Spacer(Modifier.width(14.dp))
        Button(onClick = { PagingStore.set(key, p + 1) }, enabled = p < totalPages, colors = ButtonDefaults.buttonColors(containerColor = contentColor)) { Text("Next", fontSize = 12.sp, color = Color.White) }
    }
}
