@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package com.bpmpntb.simaik.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bpmpntb.simaik.MainViewModel
import com.bpmpntb.simaik.api.RegisterRequest
import com.bpmpntb.simaik.ui.theme.*

@Composable
fun DaftarScreen(vm: MainViewModel, onBack: () -> Unit, onRegistered: () -> Unit) {
    var nama by remember { mutableStateOf("") }
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }
    var showPass by remember { mutableStateOf(false) }
    // opsional
    var nip by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var noHp by remember { mutableStateOf("") }
    var jk by remember { mutableStateOf("") }
    var tempatLahir by remember { mutableStateOf("") }
    var tglLahir by remember { mutableStateOf("") }
    var npwpNik by remember { mutableStateOf("") }
    var pangkat by remember { mutableStateOf("") }
    var jabatan by remember { mutableStateOf("") }
    var instansi by remember { mutableStateOf("") }
    var npsn by remember { mutableStateOf("") }
    var kabKota by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var msg by remember { mutableStateOf<String?>(null) }

    val passMismatch = password.isNotEmpty() && confirm.isNotEmpty() && password != confirm
    val canSubmit = nama.isNotBlank() && username.isNotBlank() && password.length >= 6 && password == confirm && !loading

    Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(LoginNavy1, LoginNavy2, LoginNavy3)))) {
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp)) {
            // Header
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, "Kembali", tint = Color.White) }
                Text("Daftar Akun Peserta", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Text("Buat akun untuk mengikuti kegiatan di SIMAIK.", color = Color(0xFFBFDBFE), fontSize = 13.sp)
            Spacer(Modifier.height(16.dp))

            SectionTitle("Data Akun *")
            OutlinedTextField_(nama, { nama = it }, "Nama Lengkap *")
            OutlinedTextField_(username, { username = it }, "Username *")
            OutlinedTextField_(password, { password = it }, "Password * (min 6)", PasswordVisualTransformation(), showPass)
            OutlinedTextField_(confirm, { confirm = it }, "Ulangi Password *", PasswordVisualTransformation(), showPass)
            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(checked = showPass, onCheckedChange = { showPass = it })
                Text("Tampilkan password", color = Color(0xFFBFDBFE), fontSize = 12.sp)
            }
            if (passMismatch) Text("Password tidak sama", color = Color(0xFFFCA5A5), fontSize = 12.sp)

            Spacer(Modifier.height(12.dp))
            SectionTitle("Data Diri (opsional)")
            OutlinedTextField_(nip, { nip = it }, "NIP")
            OutlinedTextField_(email, { email = it }, "Email")
            OutlinedTextField_(noHp, { noHp = it }, "No. HP")
            // Jenis kelamin dropdown
            var jkOpen by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(expanded = jkOpen, onExpandedChange = { jkOpen = it }) {
                OutlinedTextField(
                    value = jk, onValueChange = {}, readOnly = true, label = { Text("Jenis Kelamin") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(jkOpen) },
                    colors = darkFieldColors(), shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().menuAnchor()
                )
                ExposedDropdownMenu(expanded = jkOpen, onDismissRequest = { jkOpen = false }) {
                    listOf("Laki-laki", "Perempuan").forEach {
                        DropdownMenuItem(text = { Text(it) }, onClick = { jk = if (it == "Laki-laki") "laki-laki" else "perempuan"; jkOpen = false })
                    }
                }
            }
            OutlinedTextField_(tempatLahir, { tempatLahir = it }, "Tempat Lahir")
            OutlinedTextField_(tglLahir, { tglLahir = it }, "Tanggal Lahir (YYYY-MM-DD)")
            OutlinedTextField_(npwpNik, { npwpNik = it }, "NPWP / NIK")

            Spacer(Modifier.height(12.dp))
            SectionTitle("Kepegawaian (opsional)")
            OutlinedTextField_(pangkat, { pangkat = it }, "Pangkat")
            OutlinedTextField_(jabatan, { jabatan = it }, "Jabatan")
            OutlinedTextField_(instansi, { instansi = it }, "Nama Instansi")
            OutlinedTextField_(npsn, { npsn = it }, "NPSN")
            OutlinedTextField_(kabKota, { kabKota = it }, "Kabupaten / Kota")

            Spacer(Modifier.height(20.dp))
            msg?.let {
                Text(it, color = if (it.contains("berhasil")) Color(0xFF86EFAC) else Color(0xFFFCA5A5), fontSize = 13.sp)
                Spacer(Modifier.height(8.dp))
            }
            Button(
                onClick = {
                    loading = true; msg = null
                    vm.register(
                        RegisterRequest(
                            nama_lengkap = nama, username = username, password = password, password_confirmation = confirm,
                            nip = nip.ifBlank { null }, email = email.ifBlank { null }, no_hp = noHp.ifBlank { null },
                            jenis_kelamin = jk.ifBlank { null }, tempat_lahir = tempatLahir.ifBlank { null },
                            tanggal_lahir = tglLahir.ifBlank { null }, npwp_nik = npwpNik.ifBlank { null },
                            pangkat = pangkat.ifBlank { null }, jabatan = jabatan.ifBlank { null },
                            nama_instansi = instansi.ifBlank { null }, npsn = npsn.ifBlank { null }, kab_kota = kabKota.ifBlank { null }
                        )
                    ) { ok, m ->
                        loading = false; msg = m
                        if (ok) onRegistered()
                    }
                },
                enabled = canSubmit,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentBlue),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                if (loading) CircularProgressIndicator(Modifier.size(20.dp), color = Color.White)
                else { Icon(Icons.Default.PersonAdd, null, tint = Color.White); Spacer(Modifier.width(8.dp)); Text("Daftar", fontWeight = FontWeight.SemiBold) }
            }
            Spacer(Modifier.height(12.dp))
            TextButton(onClick = onRegistered, modifier = Modifier.fillMaxWidth()) {
                Text("Sudah punya akun? ", color = Color(0xFFBFDBFE))
                Text("Masuk di sini", color = AccentBlue, fontWeight = FontWeight.SemiBold)
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun SectionTitle(t: String) {
    Text(t, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
    Spacer(Modifier.height(8.dp))
}

@Composable
private fun OutlinedTextField_(
    value: String, onValueChange: (String) -> Unit, label: String,
    visual: VisualTransformation = VisualTransformation.None, showToggle: Boolean = false
) {
    var show by remember { mutableStateOf(false) }
    val vt = if (showToggle) { if (show) VisualTransformation.None else visual } else visual
    OutlinedTextField(
        value = value, onValueChange = onValueChange, label = { Text(label) }, singleLine = true,
        visualTransformation = vt,
        trailingIcon = if (showToggle) {
            { IconButton(onClick = { show = !show }) { Icon(if (show) Icons.Default.VisibilityOff else Icons.Default.Visibility, null, tint = Color(0xFF93C5FD)) } }
        } else null,
        colors = darkFieldColors(), shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    )
}

@Composable
private fun darkFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedTextColor = Color.White, unfocusedTextColor = Color.White,
    focusedBorderColor = AccentBlue, unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
    focusedLabelColor = AccentBlue, unfocusedLabelColor = Color(0xFF93C5FD),
    cursorColor = AccentBlue
)
