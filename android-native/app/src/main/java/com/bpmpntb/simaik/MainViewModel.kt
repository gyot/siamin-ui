package com.bpmpntb.simaik

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.bpmpntb.simaik.api.ApiClient
import com.bpmpntb.simaik.api.DashboardStats
import com.bpmpntb.simaik.api.Kegiatan
import com.bpmpntb.simaik.api.KegiatanPayload
import com.bpmpntb.simaik.api.LoginRequest
import com.bpmpntb.simaik.api.RegisterRequest
import com.bpmpntb.simaik.api.PegawaiItem
import com.bpmpntb.simaik.api.PenugasanItem
import com.bpmpntb.simaik.api.PenugasanPayload
import com.bpmpntb.simaik.api.PesertaItem
import com.bpmpntb.simaik.api.PesertaPayload
import com.bpmpntb.simaik.api.JadwalSaveRequest
import com.bpmpntb.simaik.api.JadwalDay
import com.bpmpntb.simaik.api.SertifikatStatusItem
import com.bpmpntb.simaik.api.KelasItem
import com.bpmpntb.simaik.api.KelasPayload
import com.bpmpntb.simaik.api.PushRegisterRequest
import com.bpmpntb.simaik.api.SertifikatBatchItem
import com.bpmpntb.simaik.data.Session
import kotlinx.coroutines.launch

data class UiState(
    val loading: Boolean = false,
    val error: String? = null,
    val info: String? = null,
    val loggedIn: Boolean = false,
    val loginAs: String? = null,
    val kegiatanList: List<Kegiatan> = emptyList(),
    val kegiatanDetail: Kegiatan? = null,
    val dashboard: DashboardStats? = null,
    val pegawaiList: List<PegawaiItem> = emptyList(),
    val penugasanList: List<PenugasanItem> = emptyList(),
    val sertifikatList: List<SertifikatBatchItem> = emptyList(),
    val pesertaList: List<PesertaItem> = emptyList(),
    val jadwalList: List<JadwalDay> = emptyList(),
    val sertifikatStatusList: List<SertifikatStatusItem> = emptyList(),
    val sertifikatGlobalList: List<SertifikatStatusItem> = emptyList(),
    val kelasList: List<KelasItem> = emptyList(),
)

class MainViewModel(app: Application) : AndroidViewModel(app) {
    private val session = Session(app)
    val isLoggedIn: Boolean get() = session.isLoggedIn
    val currentPegawaiId: Int
        get() = session.idPegawai
    var state by mutableStateOf(UiState(loggedIn = session.isLoggedIn))
        private set

    init {
        if (session.isLoggedIn) {
            ApiClient.setToken(session.token)
        }
    }

    fun clearInfo() { state = state.copy(info = null, error = null) }

    fun login(identitas: String, password: String, onDone: (Boolean) -> Unit) {
        if (identitas.isBlank() || password.isBlank()) {
            state = state.copy(error = "Isi identitas dan password.")
            onDone(false); return
        }
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.login(LoginRequest(identitas, password))
                val token = res.data?.token
                if (res.success == true && token != null) {
                    session.token = token
                    session.nama = res.data.user?.nama ?: res.data.user?.pegawai?.nama ?: res.data.user?.name ?: identitas
                    session.idPegawai = res.data.user?.id_pegawai ?: res.data.user?.id_user ?: -1
                    session.email = res.data.user?.email
                    session.username = res.data.user?.user
                    session.role = res.data.user?.role ?: res.data.login_as
                    session.nip = res.data.user?.pegawai?.nip
                    session.jabatan = res.data.user?.pegawai?.nama_jabatan
                    session.golongan = res.data.user?.pegawai?.golongan
                    session.unitKerja = res.data.user?.pegawai?.unit_kerja
                    ApiClient.setToken(token)
                    state = state.copy(loading = false, loggedIn = true, loginAs = res.data.login_as)
                    onDone(true)
                } else {
                    state = state.copy(loading = false, error = res.message ?: "Login gagal.")
                    onDone(false)
                }
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Koneksi gagal.")
                onDone(false)
            }
        }
    }

    fun loadKegiatan() {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val all = mutableListOf<Kegiatan>()
                var page = 1
                var lastPage = 1
                do {
                    val res = ApiClient.service.kegiatanAll(page = page, per_page = 100)
                    all.addAll(res.data ?: emptyList())
                    lastPage = res.last_page ?: 1
                    page++
                } while (page <= lastPage && page <= 100)
                state = state.copy(loading = false, kegiatanList = all.distinctBy { it.id_kegiatan })
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat kegiatan.")
            }
        }
    }

    fun loadDetail(id: Int) {
        state = state.copy(loading = true, error = null, kegiatanDetail = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.kegiatanDetail(id)
                state = state.copy(loading = false, kegiatanDetail = res.data)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat detail.")
            }
        }
    }

    fun loadDashboard() {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.dashboardStats()
                state = state.copy(loading = false, dashboard = res)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat dashboard.")
            }
        }
    }

    fun loadPegawai() {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.pegawai()
                state = state.copy(loading = false, pegawaiList = res.data ?: emptyList())
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat pegawai.")
            }
        }
    }

    fun loadPenugasan() {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.penugasan()
                state = state.copy(loading = false, penugasanList = res.data ?: emptyList())
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat penugasan.")
            }
        }
    }

    fun loadSertifikat() {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.sertifikat()
                state = state.copy(loading = false, sertifikatList = res.data ?: emptyList())
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat sertifikat.")
            }
        }
    }

    /** Verifikasi keaslian sertifikat via kode QR -> format hasil tampil. */
    fun cekSertifikat(kode: String, onDone: (String) -> Unit) {
        viewModelScope.launch {
            try {
                val body = ApiClient.service.cekSertifikat(kode)
                val root = kotlinx.serialization.json.Json.parseToJsonElement(body.string())
                val arr = root as? kotlinx.serialization.json.JsonArray
                val item = arr?.firstOrNull() as? kotlinx.serialization.json.JsonObject
                if (item == null) { onDone("Sertifikat tidak ditemukan dalam sistem."); return@launch }
                fun g(o: kotlinx.serialization.json.JsonObject?, f: String): String =
                    o?.get(f)?.let { (it as? kotlinx.serialization.json.JsonPrimitive)?.content }?.takeIf { it.isNotBlank() } ?: "-"
                val p = item["peserta"] as? kotlinx.serialization.json.JsonObject
                val k = item["kegiatan"] as? kotlinx.serialization.json.JsonObject
                val ttd = item["penandatangan"] as? kotlinx.serialization.json.JsonObject
                val batch = item["batch"] as? kotlinx.serialization.json.JsonObject
                val lok = item["lokasi"] as? kotlinx.serialization.json.JsonObject
                val sb = StringBuilder()
                sb.appendLine("SERTIFIKAT TERVERIFIKASI")
                sb.appendLine("(Dokumen ini tercatat dalam sistem & dinyatakan asli.)")
                sb.appendLine()
                sb.appendLine("— Data Peserta —")
                sb.appendLine("Nama: ${g(p, "nama_lengkap")}")
                sb.appendLine("NIP: ${g(p, "nip")}")
                sb.appendLine("Pangkat: ${g(p, "pangkat")}")
                sb.appendLine("Jabatan: ${g(p, "jabatan")}")
                sb.appendLine("Instansi: ${g(p, "nama_instansi")}")
                sb.appendLine("Peran: ${g(p, "peran")}")
                sb.appendLine()
                sb.appendLine("— Mengikuti Kegiatan —")
                sb.appendLine("Nama: ${g(k, "nama_kegiatan")}")
                sb.appendLine("Tanggal: ${g(k, "tanggal_mulai")} s.d. ${g(k, "tanggal_selesai")}")
                sb.appendLine("Metode: ${g(k, "metode_pelaksanaan")}")
                sb.appendLine("Lokasi: ${g(lok, "lokasi")}")
                sb.appendLine()
                sb.appendLine("— Disahkan oleh —")
                sb.appendLine("Nama: ${g(ttd, "nama")}")
                sb.appendLine("Jabatan: ${g(ttd, "nama_jabatan")}")
                sb.appendLine("Tgl TTD: ${g(batch, "tanggal_ttd")}")
                onDone(sb.toString())
            } catch (e: Exception) { onDone("Gagal verifikasi: ${e.message}") }
        }
    }

    /** Registrasi akun peserta baru (POST /register). */
    fun register(req: RegisterRequest, onDone: (Boolean, String) -> Unit) {
        viewModelScope.launch {
            try {
                val res = ApiClient.service.register(req)
                onDone(res.success == true, res.message ?: if (res.success == true) "Registrasi berhasil. Silakan login." else "Gagal registrasi.")
            } catch (e: Exception) {
                val msg = e.message ?: ""
                onDone(false, if (msg.contains("422")) "Data tidak valid. Periksa kembali isian Anda." else "Gagal registrasi: $msg")
            }
        }
    }

    fun saveKegiatan(payload: KegiatanPayload, editingId: Int?, jadwalList: List<JadwalDay> = emptyList(), onDone: (Boolean) -> Unit) {
        val filled = payload.copy(id_pegawai = payload.id_pegawai ?: session.idPegawai.takeIf { it > 0 })
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = if (editingId == null) ApiClient.service.storeKegiatan(filled) else ApiClient.service.updateKegiatan(editingId, filled)
                val kid = res.data?.id_kegiatan ?: editingId
                if (jadwalList.isNotEmpty() && kid != null && kid > 0) {
                    ApiClient.service.saveJadwal(kid, JadwalSaveRequest(jadwalList))
                }
                state = state.copy(loading = false, info = "Tersimpan.")
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal menyimpan.")
                onDone(false)
            }
        }
    }

    fun loadKegiatanTimSaya() {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.kegiatanTimSaya()
                state = state.copy(loading = false, kegiatanList = res.data ?: emptyList())
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat kegiatan.")
            }
        }
    }

    fun loadJadwal(id: Int) {
        viewModelScope.launch {
            try {
                val res = ApiClient.service.getJadwal(id)
                state = state.copy(jadwalList = res.data?.jadwal_harian ?: emptyList())
            } catch (e: Exception) { state = state.copy(jadwalList = emptyList()) }
        }
    }

    fun loadSertifikatStatus(kegiatanId: Int) {
        viewModelScope.launch {
            try {
                val res = ApiClient.service.pesertaSertifikat(kegiatanId)
                state = state.copy(sertifikatStatusList = res.data ?: emptyList())
            } catch (e: Exception) { state = state.copy(sertifikatStatusList = emptyList()) }
        }
    }

    fun loadSertifikatSemua() {
        viewModelScope.launch {
            try {
                val res = ApiClient.service.sertifikatRecords()
                state = state.copy(sertifikatGlobalList = res.data ?: emptyList())
            } catch (e: Exception) { state = state.copy(sertifikatGlobalList = emptyList()) }
        }
    }

    fun loadKelas(kegiatanId: Int) {
        viewModelScope.launch {
            try {
                val res = ApiClient.service.kelas(kegiatanId)
                state = state.copy(kelasList = res.data ?: emptyList())
            } catch (e: Exception) { state = state.copy(kelasList = emptyList()) }
        }
    }

    fun storeKelas(payload: KelasPayload, onDone: (Boolean) -> Unit) {
        viewModelScope.launch {
            try {
                ApiClient.service.storeKelas(payload); loadKelas(payload.id_kegiatan); onDone(true)
            } catch (e: Exception) { onDone(false) }
        }
    }

    fun addKelasAnggota(idKelas: Int, idPeserta: Int, idKegiatan: Int, onDone: (Boolean) -> Unit) {
        viewModelScope.launch {
            try {
                ApiClient.service.addKelasAnggota(idKelas, idPeserta); loadKelas(idKegiatan); onDone(true)
            } catch (e: Exception) { onDone(false) }
        }
    }

    fun updateSertifikatStatus(idPeserta: Int, idKegiatan: Int, status: String, onDone: (Boolean) -> Unit) {
        viewModelScope.launch {
            try {
                ApiClient.service.updateSertifikatStatus(idPeserta, idKegiatan, status)
                loadSertifikatStatus(idKegiatan)
                onDone(true)
            } catch (e: Exception) { onDone(false) }
        }
    }

    fun deleteKegiatan(id: Int, onDone: (Boolean) -> Unit) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                ApiClient.service.deleteKegiatan(id)
                state = state.copy(loading = false, info = "Terhapus.")
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal menghapus.")
                onDone(false)
            }
        }
    }

    fun loadPeserta(kegiatanId: Int? = null) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                val res = ApiClient.service.peserta(kegiatanId = kegiatanId)
                state = state.copy(loading = false, pesertaList = res.data ?: emptyList())
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memuat peserta.")
            }
        }
    }

    fun savePeserta(payload: PesertaPayload, editingId: Int?, onDone: (Boolean) -> Unit) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                if (editingId == null) ApiClient.service.storePeserta(payload)
                else ApiClient.service.updatePeserta(editingId, payload)
                state = state.copy(loading = false, info = "Tersimpan.")
                loadPeserta()
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal menyimpan.")
                onDone(false)
            }
        }
    }

    fun deletePeserta(id: Int, onDone: (Boolean) -> Unit) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                ApiClient.service.deletePeserta(id)
                state = state.copy(loading = false, info = "Terhapus.")
                loadPeserta()
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal menghapus.")
                onDone(false)
            }
        }
    }

    fun savePenugasan(payload: PenugasanPayload, onDone: (Boolean) -> Unit) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                ApiClient.service.storePenugasan(payload)
                state = state.copy(loading = false, info = "Petugas ditambahkan.")
                loadPenugasan()
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal menambah petugas.")
                onDone(false)
            }
        }
    }

    fun editPenugasan(id: Int, payload: PenugasanPayload, onDone: (Boolean) -> Unit) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                ApiClient.service.updatePenugasan(id, payload)
                state = state.copy(loading = false, info = "Petugas diperbarui.")
                loadPenugasan()
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal memperbarui petugas.")
                onDone(false)
            }
        }
    }

    fun deletePenugasan(id: Int, onDone: (Boolean) -> Unit) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                ApiClient.service.deletePenugasan(id)
                state = state.copy(loading = false, info = "Petugas dihapus.")
                loadPenugasan()
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal menghapus petugas.")
                onDone(false)
            }
        }
    }

    fun registerPush(fcmToken: String?) {
        if (fcmToken.isNullOrBlank() || session.idPegawai < 0) return
        viewModelScope.launch {
            try {
                ApiClient.service.registerPush(
                    PushRegisterRequest(id_pegawai = session.idPegawai, token = fcmToken)
                )
            } catch (_: Exception) { /* non-fatal */ }
        }
    }

    fun logout() {
        session.clear()
        ApiClient.setToken(null)
        state = UiState()
    }
}
