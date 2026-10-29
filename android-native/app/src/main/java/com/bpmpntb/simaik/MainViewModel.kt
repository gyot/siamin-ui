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
import com.bpmpntb.simaik.api.LoginRequest
import com.bpmpntb.simaik.api.PushRegisterRequest
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
)

class MainViewModel(app: Application) : AndroidViewModel(app) {
    private val session = Session(app)
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
