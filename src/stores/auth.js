import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * API BASE URL
 * During development, use local proxy `/api` to bypass CORS.
 * In production, use the actual backend URL.
 */
const isDev = import.meta.env.DEV
const API_HOST = isDev ? '' : (import.meta.env.VITE_API_BASE_URL || '')
const API_BASE_URL = API_HOST.replace(/\/$/, '') + '/api/v1/'

export const useAuthStore = defineStore('auth', () => {
  const parseJsonResponse = async (response) => {
    const text = await response.text().catch(() => '')
    if (!text) return { data: {}, rawText: '' }
    try {
      return { data: JSON.parse(text), rawText: text }
    } catch {
      return { data: {}, rawText: text }
    }
  }

  const parseJsonStorage = (key, fallback) => {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    try {
      return JSON.parse(raw)
    } catch {
      return fallback
    }
  }

  const normalizeUnitKerjaIds = (value) => {
    if (Array.isArray(value)) {
      return value.filter(v => v !== null && v !== undefined && v !== '')
    }
    if (value === null || value === undefined || value === '') return []
    return [value]
  }

  const pickNonEmptyIds = (...candidates) => {
    for (const candidate of candidates) {
      const normalized = normalizeUnitKerjaIds(candidate)
      if (normalized.length > 0) return normalized
    }
    return []
  }

  const mergeUnitKerjaIds = (existingIds = [], incomingIds = []) => {
    const merged = []
    const seen = new Set()
    ;[...normalizeUnitKerjaIds(existingIds), ...normalizeUnitKerjaIds(incomingIds)].forEach((id) => {
      const key = String(id)
      if (!seen.has(key)) {
        seen.add(key)
        merged.push(id)
      }
    })
    return merged
  }

  const mergeUnitKerjaList = (existingUnits = [], incomingUnits = []) => {
    const result = new Map()
    ;[...(Array.isArray(existingUnits) ? existingUnits : []), ...(Array.isArray(incomingUnits) ? incomingUnits : [])]
      .forEach((unit) => {
        if (!unit || (!unit.unit_kerja_id && !unit.kode_unit)) return
        const key = String(unit.unit_kerja_id ?? unit.kode_unit)
        const prev = result.get(key) || {}
        result.set(key, { ...prev, ...unit })
      })
    return Array.from(result.values())
  }

  const persistUnitKerja = () => {
    localStorage.setItem('unit_kerja_id', JSON.stringify(unit_kerja_id.value))
    localStorage.setItem('unit_kerja', JSON.stringify(unit_kerja.value))
  }

  const applyUnitKerjaData = (ids, units) => {
    unit_kerja_id.value = normalizeUnitKerjaIds(ids)
    unit_kerja.value = Array.isArray(units) ? units : []
    currentUser.value = {
      ...(currentUser.value || {}),
      unit_kerja_id: unit_kerja_id.value,
      unit_kerja: unit_kerja.value
    }
    persistUnitKerja()
  }

  /* =======================
   * STATE
   * ======================= */
  const currentUser = ref(null)
  const unit_kerja_id = ref(parseJsonStorage('unit_kerja_id', []))
  const unit_kerja = ref(parseJsonStorage('unit_kerja', []))
  const userType = ref(null) // 'admin' | 'peserta'
  const token = ref(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref(null)

  /* =======================
   * GETTERS
   * ======================= */
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const isAdmin = computed(() => {
    const type = String(userType.value || '').toLowerCase()
    const role = String(currentUser.value?.role || '').toLowerCase()
    return type === 'admin' || type === '1' || role === 'admin' || role === '1'
  })
  const isPeserta = computed(() => {
    const type = String(userType.value || '').toLowerCase()
    const role = String(currentUser.value?.role || '').toLowerCase()
    return type === 'peserta' || type === '2' || role === 'peserta' || role === '2'
  })

  const fetchMe = async () => {
    if (!token.value) return null

    const url = isDev ? '/api/v1/me' : `${API_BASE_URL}me`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token.value}`
      }
    })

    const res = await response.json().catch(() => ({}))
    if (!response.ok || !res?.success || !res?.data) {
      throw new Error(res?.message || 'Gagal mengambil profil user')
    }

    const data = res.data || {}
    const meUser = data.user || {}
    const mePegawai = data.pegawai || {}
    let meUnitKerja = Array.isArray(meUser.unit_kerja)
      ? meUser.unit_kerja
      : (Array.isArray(data.unit_kerja) ? data.unit_kerja : [])
    const meUnitKerjaIds = pickNonEmptyIds(
      meUser.unit_kerja_id,
      meUnitKerja.map((item) => item?.unit_kerja_id).filter(Boolean),
      meUser.id_tim,
      unit_kerja_id.value
    )

    // Fallback untuk kasus me() hanya mengembalikan sebagian unit kerja.
    // Sesuai route backend: GET /api/v1/unit-kerja/user/{id}
    if (meUnitKerja.length === 0) {
      const idPegawai = currentUser.value?.id_pegawai || mePegawai.id_pegawai || meUser.id_pegawai || currentUser.value?.id
      if (idPegawai) {
        try {
          const unitUrl = isDev ? `/api/v1/unit-kerja/user/${idPegawai}` : `${API_BASE_URL}unit-kerja/user/${idPegawai}`
          const unitRes = await fetch(unitUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token.value}`
            }
          })
          const unitJson = await unitRes.json().catch(() => ({}))
          const payload = unitJson?.data ?? unitJson
          const rows = Array.isArray(payload)
            ? payload
            : (Array.isArray(payload?.data) ? payload.data : [])
          meUnitKerja = rows.map((item) => ({
            unit_kerja_id: item.unit_kerja_id ?? item.id ?? item.id_unit ?? null,
            nama_unit: item.nama_unit ?? item.nama ?? '-',
            kode_unit: item.kode_unit ?? item.kode ?? ''
          })).filter((item) => item.unit_kerja_id !== null && item.unit_kerja_id !== undefined)
        } catch {
          // fallback silent
        }
      }
    }

    currentUser.value = {
      ...(currentUser.value || {}),
      id: currentUser.value?.id || meUser.id_user || meUser.id,
      id_pegawai: currentUser.value?.id_pegawai || mePegawai.id_pegawai || null,
      name: currentUser.value?.name || mePegawai.nama || meUser.email || 'User',
      email: currentUser.value?.email || meUser.email || null,
      role: meUser.role
    }

    const finalIds = mergeUnitKerjaIds(unit_kerja_id.value, meUnitKerjaIds)
    const finalUnits = mergeUnitKerjaList(unit_kerja.value, meUnitKerja)
    applyUnitKerjaData(finalIds, finalUnits)
    localStorage.setItem('user_data', JSON.stringify(currentUser.value))
    return data
  }

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

      const { data: res, rawText } = await parseJsonResponse(response)

      if (!response.ok) {
        const fallback = `Login gagal: ${response.status} ${response.statusText}`.trim()
        const message = res?.message || (rawText ? `${fallback} | ${rawText.slice(0, 180)}` : fallback)
        throw new Error(message || 'Email atau password salah')
      }

      if (!res?.success || !res?.data?.token || !res?.data?.user) {
        throw new Error('Format response API tidak valid')
      }

      const { token: apiToken, user } = res.data
      const resolvedUnitKerjaIds = pickNonEmptyIds(
        res?.data?.unit_kerja_id,
        user?.unit_kerja_id,
        user?.id_tim
      )
      const resolvedUnitKerja = Array.isArray(res?.data?.unit_kerja) ? res.data.unit_kerja : []

      token.value = apiToken
      currentUser.value = {
        id: user.id,
        id_pegawai: user.id_pegawai || user.id,
        unit_kerja_id: resolvedUnitKerjaIds,
        unit_kerja: resolvedUnitKerja,
        
        name: user.name ?? user.email ?? 'Admin',
        email: user.email,
        role: 'admin'
      }
      userType.value = 'admin'

      localStorage.setItem('auth_token', apiToken)
      localStorage.setItem('user_data', JSON.stringify(currentUser.value))
      localStorage.setItem('user_type', 'admin')
      applyUnitKerjaData(resolvedUnitKerjaIds, resolvedUnitKerja)
      await fetchMe().catch(() => {})

      // console.log('[Auth] ✅ Admin login successful:', {
      //   id: currentUser.value.id,
      //   id_pegawai: currentUser.value.id_pegawai,
      //   name: currentUser.value.name,
      //   email: currentUser.value.email
      // })
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
        body: JSON.stringify({ email: username, username, password })
      })

      const { data: res, rawText } = await parseJsonResponse(response)

      if (!response.ok) {
        const fallback = `Login gagal: ${response.status} ${response.statusText}`.trim()
        const message = res?.message || (rawText ? `${fallback} | ${rawText.slice(0, 180)}` : fallback)
        throw new Error(message || 'Username atau password salah')
      }

      const payload = res?.data || res

      if (!payload?.token || !payload?.user) {
        throw new Error('Format response API tidak valid')
      }

      token.value = payload.token
      const resolvedUnitKerjaIds = pickNonEmptyIds(
        payload?.unit_kerja_id,
        payload?.user?.unit_kerja_id,
        payload?.user?.id_tim
      )
      const resolvedUnitKerja = Array.isArray(payload?.unit_kerja) ? payload.unit_kerja : []
      currentUser.value = {
        id: payload.user.id,
        name: payload.user.name,
        username: payload.user.username,
        nip: payload.user.nip,
        instansi: payload.user.instansi ?? '-',
        email: payload.user.email,
        unit_kerja_id: resolvedUnitKerjaIds,
        unit_kerja: resolvedUnitKerja,
        role: 'peserta'
      }
      userType.value = 'peserta'

      localStorage.setItem('auth_token', payload.token)
      localStorage.setItem('user_data', JSON.stringify(currentUser.value))
      localStorage.setItem('user_type', 'peserta')
      applyUnitKerjaData(resolvedUnitKerjaIds, resolvedUnitKerja)
      await fetchMe().catch(() => {})

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
        const url = isDev ? '/api/v1/logout' : `${API_BASE_URL}logout`
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
      unit_kerja_id.value = []
      unit_kerja.value = []
      userType.value = null

      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_type')
      localStorage.removeItem('unit_kerja_id')
      localStorage.removeItem('unit_kerja')

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
    const savedUnitKerjaId = parseJsonStorage('unit_kerja_id', [])
    const savedUnitKerja = parseJsonStorage('unit_kerja', [])

    if (!savedToken || !savedUser || !savedType) return

    try {
      token.value = savedToken
      currentUser.value = JSON.parse(savedUser)
      userType.value = savedType
      applyUnitKerjaData(
        savedUnitKerjaId?.length ? savedUnitKerjaId : currentUser.value?.unit_kerja_id,
        Array.isArray(savedUnitKerja) && savedUnitKerja.length > 0
          ? savedUnitKerja
          : (Array.isArray(currentUser.value?.unit_kerja) ? currentUser.value.unit_kerja : [])
      )
      fetchMe().catch(() => {})

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
    unit_kerja_id,
    unit_kerja,
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
    restoreAuth,
    fetchMe
  }
})
