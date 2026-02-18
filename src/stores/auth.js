import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAPI } from '@/services/api'
import { mockLoginAdmin, mockLoginPeserta } from '@/services/mockApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL+'/api/v1/' || 'https://backend-siamin.bpmpntb.id/'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const userType = ref(null) // 'admin' or 'peserta'
  const token = ref(localStorage.getItem('auth_token') || null)
  const isLoading = ref(false)
  const error = ref(null)
  
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const isAdmin = computed(() => userType.value === 'admin')
  const isPeserta = computed(() => userType.value === 'peserta')

  // Login untuk admin menggunakan API Sanctum
  const loginAdmin = async (email, password) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('[Auth] Attempting admin login via API...')
      
      const response = await fetch(`${API_BASE_URL}auth/login-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Email atau password tidak valid')
      }

      // Validasi response dari Sanctum
      if (data.success && data.data?.token) {
        const { token: apiToken, user } = data.data

        token.value = apiToken
        currentUser.value = user
        userType.value = 'admin'

        localStorage.setItem('auth_token', apiToken)
        localStorage.setItem('user_data', JSON.stringify(user))
        localStorage.setItem('user_type', 'admin')

        return true
      }

      
      throw new Error('Respon API tidak valid')
    } catch (apiError) {
      console.error('[Auth] ❌ Admin login failed:', apiError.message)
      error.value = apiError.message || 'Email atau password tidak valid'
      isLoading.value = false
      throw apiError
    }
  }

  // Login untuk peserta menggunakan API Sanctum
  const loginPeserta = async (username, password) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('[Auth] Attempting peserta login via API...')
      
      const response = await fetch(`${API_BASE_URL}/auth/login-peserta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Username atau password tidak valid')
      }

      // Validasi response dari Sanctum
      if (data.token && data.user) {
        token.value = data.token
        currentUser.value = {
          id: data.user.id,
          name: data.user.name,
          username: data.user.username,
          nip: data.user.nip,
          instansi: data.user.instansi || 'Kemkominfo',
          email: data.user.email,
          role: 'peserta'
        }
        userType.value = 'peserta'
        
        // Simpan ke localStorage
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(currentUser.value))
        localStorage.setItem('user_type', 'peserta')
        
        console.log('[Auth] ✅ Peserta login successful:', currentUser.value.name)
        isLoading.value = false
        return true
      }
      
      throw new Error('Respon API tidak valid')
    } catch (apiError) {
      console.error('[Auth] ❌ Peserta login failed:', apiError.message)
      error.value = apiError.message || 'Username atau password tidak valid'
      isLoading.value = false
      throw apiError
    }
  }

  // Logout dengan API call
  const logout = async () => {
    try {
      // Call logout endpoint jika ada token
      if (token.value) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.value}`
          }
        })
      }
    } catch (error) {
      console.warn('[Auth] Logout API call failed:', error)
    } finally {
      // Clear local state regardless of API response
      token.value = null
      currentUser.value = null
      userType.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_type')
      console.log('[Auth] ✅ User logged out')
    }
  }

  // Restore auth dari localStorage saat app load
  const restoreAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    const savedType = localStorage.getItem('user_type')

    if (savedToken && savedUser && savedType) {
      token.value = savedToken
      currentUser.value = JSON.parse(savedUser)
      userType.value = savedType
      console.log('[Auth] ✅ Session restored for:', currentUser.value.name)
    }
  }

  return {
    currentUser,
    userType,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isPeserta,
    loginAdmin,
    loginPeserta,
    logout,
    restoreAuth
  }
})
