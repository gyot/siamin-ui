import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  let fetchMePromise = null
  const buildErrorMessage = (error, fallback) => {
    const payload = error?.response?.data
    if (payload?.message) return payload.message
    if (typeof payload === 'string' && payload.trim()) return `${fallback} | ${payload.slice(0, 180)}`
    if (error?.response?.status) {
      return `${fallback}: ${error.response.status} ${error.response.statusText}`.trim()
    }
    return error?.message || fallback
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

  const isAuthError = (error) => {
    const status = Number(error?.response?.status || 0)
    if ([401, 403, 419].includes(status)) return true

    const message = String(error?.message || '').toLowerCase()
    return (
      message.includes('401')
      || message.includes('403')
      || message.includes('419')
      || message.includes('unauthenticated')
      || message.includes('unauthorized')
    )
  }

  const clearPersistedAuth = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_type')
    localStorage.removeItem('unit_kerja_id')
    localStorage.removeItem('unit_kerja')
  }

  const clearSessionState = () => {
    token.value = null
    currentUser.value = null
    unit_kerja_id.value = []
    unit_kerja.value = []
    userType.value = null
    hasRestoredSession.value = false
    hasRevalidatedSession.value = false
    fetchMePromise = null
  }

  const clearLocalSession = (reason = '') => {
    clearSessionState()
    clearPersistedAuth()
    error.value = reason || null
  }

  const currentUser = ref(null)
  const unit_kerja_id = ref(parseJsonStorage('unit_kerja_id', []))
  const unit_kerja = ref(parseJsonStorage('unit_kerja', []))
  const userType = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref(null)
  const hasRestoredSession = ref(false)
  const hasRevalidatedSession = ref(false)

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
    if (fetchMePromise) return fetchMePromise

    fetchMePromise = (async () => {
      try {
        const response = await apiClient.get('me', {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })

        const res = response.data || {}
        if (!res?.success || !res?.data) {
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

        if (meUnitKerja.length === 0) {
          const idPegawai = currentUser.value?.id_pegawai || mePegawai.id_pegawai || meUser.id_pegawai || currentUser.value?.id
          if (idPegawai) {
            try {
              const unitRes = await apiClient.get(`unit-kerja/user/${idPegawai}`, {
                headers: {
                  Authorization: `Bearer ${token.value}`
                }
              })
              const unitJson = unitRes.data || {}
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
        hasRevalidatedSession.value = true
        return data
      } catch (err) {
        if (isAuthError(err)) {
          console.warn('[Auth] Session is no longer valid, clearing local auth state')
          clearLocalSession()
        }
        throw err
      }
    })()

    try {
      return await fetchMePromise
    } finally {
      fetchMePromise = null
    }
  }

  const loginAdmin = async (email, password) => {
    isLoading.value = true
    error.value = null

    try {

      const response = await apiClient.post(
        'auth/login-admin',
        { email, password },
        { includeAuth: false }
      )
      const res = response.data || {}

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
      hasRestoredSession.value = true
      hasRevalidatedSession.value = false
      fetchMePromise = null
      applyUnitKerjaData(resolvedUnitKerjaIds, resolvedUnitKerja)
      await fetchMe().catch((err) => {
        if (!isAuthenticated.value) throw err
      })

      return true
    } catch (err) {
      const message = buildErrorMessage(err, 'Email atau password salah')
      console.error('[Auth] Login admin gagal:', message)
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  const loginPeserta = async (username, password) => {
    isLoading.value = true
    error.value = null

    try {

      const response = await apiClient.post(
        'auth/login-peserta',
        { email: username, username, password },
        { includeAuth: false }
      )
      const res = response.data || {}
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
      hasRestoredSession.value = true
      hasRevalidatedSession.value = false
      fetchMePromise = null
      applyUnitKerjaData(resolvedUnitKerjaIds, resolvedUnitKerja)
      await fetchMe().catch((err) => {
        if (!isAuthenticated.value) throw err
      })

      return true
    } catch (err) {
      const message = buildErrorMessage(err, 'Username atau password salah')
      console.error('[Auth] Login peserta gagal:', message)
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await apiClient.post('logout', null, {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      }
    } catch (err) {
      if (!isAuthError(err)) {
        console.warn('[Auth] Logout API failed:', err)
      }
    } finally {
      clearLocalSession()
    }
  }

  const restoreAuth = async ({ revalidate = false } = {}) => {
    if (hasRestoredSession.value) {
      if (revalidate && token.value && !hasRevalidatedSession.value) {
        try {
          await fetchMe()
        } catch (err) {
          if (!isAuthError(err)) {
            console.warn('[Auth] Session revalidation failed:', err)
          }
        }
      }
      return currentUser.value
    }

    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    const savedType = localStorage.getItem('user_type')
    const savedUnitKerjaId = parseJsonStorage('unit_kerja_id', [])
    const savedUnitKerja = parseJsonStorage('unit_kerja', [])

    if (!savedToken || !savedUser || !savedType) return null

    try {
      token.value = savedToken
      currentUser.value = JSON.parse(savedUser)
      userType.value = savedType
      hasRestoredSession.value = true
      applyUnitKerjaData(
        savedUnitKerjaId?.length ? savedUnitKerjaId : currentUser.value?.unit_kerja_id,
        Array.isArray(savedUnitKerja) && savedUnitKerja.length > 0
          ? savedUnitKerja
          : (Array.isArray(currentUser.value?.unit_kerja) ? currentUser.value.unit_kerja : [])
      )
      if (revalidate && !hasRevalidatedSession.value) {
        try {
          await fetchMe()
        } catch (err) {
          if (!isAuthError(err)) {
            console.warn('[Auth] Session revalidation failed:', err)
          }
        }
      }

      return currentUser.value
    } catch {
      console.warn('[Auth] Failed restoring session, clearing data')
      clearLocalSession()
      return null
    }
  }

  return {
    currentUser,
    unit_kerja_id,
    unit_kerja,
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
    restoreAuth,
    fetchMe
  }
})
