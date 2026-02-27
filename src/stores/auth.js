import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import unit_kerja from '../services/unit_kerja'

/**
 * API BASE URL
 * During development, use local proxy `/api` to bypass CORS.
 * In production, use the actual backend URL.
 */
const isDev = import.meta.env.DEV
const API_HOST = isDev ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://api-siamin.bpmpntb.id')
const API_BASE_URL = API_HOST.replace(/\/$/, '') + '/api/v1/'

export const useAuthStore = defineStore('auth', () => {
  /* =======================
   * STATE
   * ======================= */
  const currentUser = ref(null)
  const userType = ref(null) // 'admin' | 'peserta'
  const token = ref(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref(null)

  /* =======================
   * GETTERS
   * ======================= */
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const isAdmin = computed(() => userType.value === 'admin')
  const isPeserta = computed(() => userType.value === 'peserta')

  /* =======================
   * LOGIN ADMIN
   * ======================= */
  const loginAdmin = async (email, password) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('[Auth] Attempting admin login via API...')

      const url = isDev ? '/api/v1/auth/login-admin' : `${API_BASE_URL}auth/login-admin`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const res = await response.json()

      if (!response.ok) {
        throw new Error(res.message || 'Email atau password salah')
      }

      if (!res?.success || !res?.data?.token || !res?.data?.user) {
        throw new Error('Format response API tidak valid')
      }

      const { token: apiToken, user } = res.data

      token.value = apiToken
      currentUser.value = {
        id: user.id,
        id_pegawai: user.id_pegawai || user.id,
        unit_kerja_id:currentUser.value?.id_tim || user.id_tim || null,
        name: user.name ?? user.email ?? 'Admin',
        email: user.email,
        role: 'admin'
      }
      userType.value = 'admin'

      localStorage.setItem('auth_token', apiToken)
      localStorage.setItem('user_data', JSON.stringify(currentUser.value))
      localStorage.setItem('user_type', 'admin')

      console.log('[Auth] ✅ Admin login successful:', {
        id: currentUser.value.id,
        id_pegawai: currentUser.value.id_pegawai,
        name: currentUser.value.name,
        email: currentUser.value.email
      })
      return true
    } catch (err) {
      console.error('[Auth] ❌ Admin login failed:', err.message)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /* =======================
   * LOGIN PESERTA
   * ======================= */
  const loginPeserta = async (username, password) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('[Auth] Attempting peserta login via API...')

      const url = isDev ? '/api/v1/auth/login-peserta' : `${API_BASE_URL}auth/login-peserta`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const res = await response.json()

      if (!response.ok) {
        throw new Error(res.message || 'Username atau password salah')
      }

      if (!res?.token || !res?.user) {
        throw new Error('Format response API tidak valid')
      }

      token.value = res.token
      currentUser.value = {
        id: res.user.id,
        name: res.user.name,
        username: res.user.username,
        nip: res.user.nip,
        instansi: res.user.instansi ?? '-',
        email: res.user.email,
        role: 'peserta'
      }
      userType.value = 'peserta'

      localStorage.setItem('auth_token', res.token)
      localStorage.setItem('user_data', JSON.stringify(currentUser.value))
      localStorage.setItem('user_type', 'peserta')

      console.log('[Auth] ✅ Peserta login successful:', currentUser.value.name)
      return true
    } catch (err) {
      console.error('[Auth] ❌ Peserta login failed:', err.message)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /* =======================
   * LOGOUT
   * ======================= */
  const logout = async () => {
    try {
      if (token.value) {
        const url = isDev ? '/api/v1/auth/logout' : `${API_BASE_URL}auth/logout`
        await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.value}`
          }
        })
      }
    } catch (err) {
      console.warn('[Auth] Logout API failed:', err)
    } finally {
      token.value = null
      currentUser.value = null
      userType.value = null

      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_type')

      console.log('[Auth] ✅ User logged out')
    }
  }

  /* =======================
   * RESTORE SESSION
   * ======================= */
  const restoreAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    const savedType = localStorage.getItem('user_type')

    if (!savedToken || !savedUser || !savedType) return

    try {
      token.value = savedToken
      currentUser.value = JSON.parse(savedUser)
      userType.value = savedType

      console.log(
        '[Auth] ✅ Session restored for:',
        currentUser.value?.name ?? '(no name)'
      )
    } catch {
      console.warn('[Auth] ❌ Failed restoring session, clearing data')
      logout()
    }
  }

  return {
    // state
    currentUser,
    userType,
    token,
    isLoading,
    error,

    // getters
    isAuthenticated,
    isAdmin,
    isPeserta,

    // actions
    loginAdmin,
    loginPeserta,
    logout,
    restoreAuth
  }
})