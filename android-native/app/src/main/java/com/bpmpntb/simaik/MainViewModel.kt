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
import com.bpmpntb.simaik.api.PegawaiItem
import com.bpmpntb.simaik.api.PenugasanItem
import com.bpmpntb.simaik.api.PenugasanPayload
import com.bpmpntb.simaik.api.PesertaItem
import com.bpmpntb.simaik.api.PesertaPayload
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
)

class MainViewModel(app: Application) : AndroidViewModel(app) {
    private val session = Session(app)
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
                    session.nama = res.data.user?.nama ?: res.data.user?.name ?: identitas
                    session.idPegawai = res.data.user?.id_pegawai ?: res.data.user?.id_user ?: -1
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
                val res = ApiClient.service.kegiatan()
                state = state.copy(loading = false, kegiatanList = res.data ?: emptyList())
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

    fun saveKegiatan(payload: KegiatanPayload, editingId: Int?, onDone: (Boolean) -> Unit) {
        val filled = payload.copy(id_pegawai = payload.id_pegawai ?: session.idPegawai.takeIf { it > 0 })
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                if (editingId == null) ApiClient.service.storeKegiatan(filled)
                else ApiClient.service.updateKegiatan(editingId, filled)
                state = state.copy(loading = false, info = "Tersimpan.")
                loadKegiatan()
                onDone(true)
            } catch (e: Exception) {
                state = state.copy(loading = false, error = e.message ?: "Gagal menyimpan.")
                onDone(false)
            }
        }
    }

    fun deleteKegiatan(id: Int, onDone: (Boolean) -> Unit) {
        state = state.copy(loading = true, error = null)
        viewModelScope.launch {
            try {
                ApiClient.service.deleteKegiatan(id)
                state = state.copy(loading = false, info = "Terhapus.")
                loadKegiatan()
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
