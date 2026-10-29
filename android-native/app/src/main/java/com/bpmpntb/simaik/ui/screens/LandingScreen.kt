package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.R

// Palet landing (dari Landing.vue)
private val Bg1 = Color(0xFF1E3A8A) // blue-900
private val Bg2 = Color(0xFF1E40AF) // blue-800
private val Bg3 = Color(0xFF0F172A) // slate-900
private val Gold = Color(0xFFFACC15) // yellow-400
private val Blue100 = Color(0xFFDBEAFE)
private val Blue200 = Color(0xFFBFDBFE)
private val Blue300 = Color(0xFF93C5FD)
private val Cyan300 = Color(0xFF67E8F9)
private val BlueBtn = Color(0xFF3B82F6) // blue-500
private val Emerald200 = Color(0xFFA7F3D0)
private val Emerald400 = Color(0xFF34D399)
private val Green400 = Color(0xFF4ADE80)
private val White10 = Color(0x1AFFFFFF)
private val White20 = Color(0x33FFFFFF)

private data class TimkerCard(
    val name: String,
    val desc: String,
    val icon: ImageVector,
    val c1: Color,
    val c2: Color,
    val fullWidth: Boolean
)

@Composable
fun LandingScreen(onLogin: () -> Unit) {
    val cards = listOf(
        TimkerCard("Subbag Umum", "Unit kerja Subbag Umum tahun 2026", Icons.Default.Settings, Color(0xFF22C55E), Color(0xFF16A34A), true),
        TimkerCard("Tim Kerja\nPendidikan\nAnak Usia Dini", "Unit kerja Tim Kerja Pendidikan Anak Usia Dini tahun 2026", Icons.Default.Share, Color(0xFF3B82F6), Color(0xFF2563EB), false),
        TimkerCard("Tim Kerja\nSekolah Dasar", "Unit kerja Tim Kerja Sekolah Dasar tahun 2026", Icons.Default.School, Color(0xFFF59E0B), Color(0xFFF97316), false),
        TimkerCard("Tim Kerja\nSekolah\nMenengah Pertama", "Unit kerja Tim Kerja Sekolah Menengah Pertama tahun 2026", Icons.Default.Settings, Color(0xFFA855F7), Color(0xFF9333EA), false),
        TimkerCard("Tim Kerja\nSekolah\nMenengah", "Unit kerja Tim Kerja Sekolah Menengah tahun 2026", Icons.Default.Person, Color(0xFFEC4899), Color(0xFFDB2777), false),
        TimkerCard("Semua", "Menampilkan seluruh kegiatan dari semua tim kerja.", Icons.Default.List, Color(0xFF22D3EE), Color(0xFF14B8A6), true),
    )

    Column(
        Modifier
            .fillMaxSize()
            .background(Brush.linearGradient(listOf(Bg1, Bg2, Bg3)))
            .verticalScroll(rememberScrollState())
    ) {
        // Header: logo
        Image(
            painter = painterResource(R.drawable.logo),
            contentDescription = "Logo",
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 8.dp).height(56.dp)
        )

        // Hero
        Column(Modifier.padding(horizontal = 20.dp, vertical = 24.dp)) {
            // Badge
            Row(
                Modifier
                    .clip(RoundedCornerShape(50))
                    .background(White10)
                    .border(1.dp, White20, RoundedCornerShape(50))
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(Modifier.size(8.dp).clip(CircleShape).background(Green400))
                Spacer(Modifier.width(8.dp))
                Text("Sistem Terintegrasi", color = Blue200, fontSize = 13.sp)
            }

            Spacer(Modifier.height(20.dp))
            Text("SIMAIK", color = Gold, fontSize = 44.sp, fontWeight = FontWeight.Bold)

            Spacer(Modifier.height(8.dp))
            Text(
                buildAnnotatedString {
                    withStyle(SpanStyle(color = Color.White)) { append("(") }
                    withStyle(SpanStyle(color = Gold)) { append("Si") }
                    withStyle(SpanStyle(color = Color.White)) { append("stem ") }
                    withStyle(SpanStyle(color = Gold)) { append("Ma") }
                    withStyle(SpanStyle(color = Color.White)) { append("najemen") }
                    append("\n")
                    withStyle(SpanStyle(color = Gold)) { append("I") }
                    withStyle(SpanStyle(brush = Brush.horizontalGradient(listOf(Blue300, Cyan300)))) { append("nformasi ") }
                    withStyle(SpanStyle(color = Gold)) { append("K") }
                    withStyle(SpanStyle(brush = Brush.horizontalGradient(listOf(Blue300, Cyan300)))) { append("egiatan") }
                    withStyle(SpanStyle(color = Color.White)) { append(")") }
                },
                fontSize = 34.sp, fontWeight = FontWeight.Bold, lineHeight = 40.sp
            )

            Spacer(Modifier.height(16.dp))
            Text(
                "Platform terintegrasi untuk mengelola kegiatan, peserta, penugasan, dan sertifikat digital secara efisien dan transparan.",
                color = Blue100, fontSize = 16.sp, lineHeight = 24.sp
            )

            Spacer(Modifier.height(24.dp))
            // Tombol Login
            Row(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BlueBtn)
                    .clickable { onLogin() }
                    .padding(vertical = 14.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Person, null, tint = Color.White, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("Login", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            }

            Spacer(Modifier.height(12.dp))
            // Tombol Cek Sertifikat
            Row(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0x3310B981))
                    .border(1.dp, Color(0x4D34D399), RoundedCornerShape(12.dp))
                    .padding(vertical = 14.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Verified, null, tint = Emerald200, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("Cek Sertifikat", color = Emerald200, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            }
        }

        // Kartu tim (grid 2 kolom)
        Column(Modifier.padding(horizontal = 16.dp)) {
            CardFull(cards[0])
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.padding(top = 12.dp)) {
                CardHalf(cards[1]); CardHalf(cards[2])
            }
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.padding(top = 12.dp)) {
                CardHalf(cards[3]); CardHalf(cards[4])
            }
            Box(Modifier.padding(top = 12.dp)) { CardFull(cards[5]) }
        }

        Spacer(Modifier.height(32.dp))

        // Footer
        Column {
            HorizontalDivider(color = White10)
            Column(Modifier.padding(20.dp)) {
                Text(
                    "© 2025 SIMAIK - Kementerian Pendidikan Dasar dan Menengah BPMP Nusa Tenggara Barat",
                    color = Blue200, fontSize = 12.sp, lineHeight = 18.sp
                )
                Spacer(Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                    Text("Verifikasi Sertifikat", color = Blue200, fontSize = 12.sp)
                    Text("Unduh POS", color = Blue200, fontSize = 12.sp)
                    Text("Bantuan", color = Blue200, fontSize = 12.sp)
                    Text("Kontak", color = Blue200, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
private fun CardFull(c: TimkerCard) {
    CardTile(c, Modifier.fillMaxWidth())
}

@Composable
private fun RowScope.CardHalf(c: TimkerCard) {
    CardTile(c, Modifier.weight(1f))
}

@Composable
private fun CardTile(c: TimkerCard, modifier: Modifier) {
    Column(
        modifier
            .clip(RoundedCornerShape(16.dp))
            .background(White10)
            .border(1.dp, White20, RoundedCornerShape(16.dp))
            .padding(20.dp)
    ) {
        Box(
            Modifier
                .size(48.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Brush.linearGradient(listOf(c.c1, c.c2))),
            contentAlignment = Alignment.Center
        ) {
            Icon(c.icon, null, tint = Color.White, modifier = Modifier.size(26.dp))
        }
        Spacer(Modifier.height(14.dp))
        Text(c.name, color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, lineHeight = 20.sp)
        Spacer(Modifier.height(6.dp))
        Text(c.desc, color = Blue200, fontSize = 13.sp, lineHeight = 18.sp)
    }
}
