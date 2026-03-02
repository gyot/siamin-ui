import dbJSON from '@/data/database.json'

// API Service Configuration
// During development, use local proxy `/api` to avoid CORS.
// In production, use the actual backend URL.
const isDev = import.meta.env.DEV
const API_HOST = isDev ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://api-siamin.bpmpntb.id')
const API_BASE_URL = API_HOST.replace(/\/$/, '') + '/api/v1/'
let apiReadUnavailable = false

// API Endpoints mapping
const ENDPOINTS = {
  // Auth
  loginAdmin: 'auth/login-admin',
  loginPeserta: 'auth/login-peserta',
  // Data
  users: 'users',
  pegawai: 'pegawai',
  kegiatan: 'kegiatan',
  peserta: 'peserta',
  sertifikat: 'sertifikat',
  akunPeserta: 'akun-peserta',
  keanggotaanTim: 'keanggotaan-tim',
  logAktivitas: 'log-aktivitas',
  suratTugas: 'surat-tugas',
  suratTugasPegawai: 'surat-tugas-pegawai',
  unitKerja: 'unit-kerja',
  subUnitKerja: 'sub-unit-kerja'
}

const buildApiErrorMessage = (errorData, fallback) => {
  if (!errorData || typeof errorData !== 'object') return fallback
  if (errorData.message) {
    // Sertakan ringkasan error validasi jika tersedia.
    if (errorData.errors && typeof errorData.errors === 'object') {
      const details = Object.values(errorData.errors).flat().filter(Boolean)
      if (details.length > 0) {
        return `${errorData.message}: ${details.join('; ')}`
      }
    }
    return errorData.message
  }
  return fallback
}

const normalizeEndpoint = (endpoint = '') =>
  String(endpoint)
    .replace(/^https?:\/\/[^/]+\/api\/v1\//, '')
    .replace(/^\/?api\/v1\//, '')
    .replace(/^\/+|\/+$/g, '')

const getLocalFallbackData = (endpoint) => {
  const normalized = normalizeEndpoint(endpoint)
  if (!normalized) return null

  if (normalized === 'unit-kerja') return dbJSON.unit_kerja || []
  if (normalized === 'kegiatan' || normalized === 'kegiatan/all') return dbJSON.kegiatan || []
  if (normalized.startsWith('kegiatan/tim/')) return dbJSON.kegiatan || []
  if (normalized === 'pegawai') return dbJSON.pegawai || []
  if (normalized === 'users') return dbJSON.users || []

  return null
}

/**
 * Fetch data from API with flexible method support
 * @param {string} endpoint - API endpoint key or full URL
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>}
 */
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const method = (options.method || 'GET').toUpperCase()
    if (isDev && method === 'GET' && apiReadUnavailable) {
      const cachedFallback = getLocalFallbackData(endpoint)
      if (cachedFallback !== null) return cachedFallback
    }

    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${API_BASE_URL}${ENDPOINTS[endpoint] || endpoint}`
    
    // Get auth token from localStorage
    const authToken = localStorage.getItem('auth_token')
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
    
    // Add Authorization header if token exists
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      ...options
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(buildApiErrorMessage(errorData, `API Error: ${response.status} ${response.statusText}`))
    }

    const data = await response.json()
    
    // Handle both direct array responses and paginated responses
    return Array.isArray(data) ? data : (data.data || data)
  } catch (error) {
    const method = (options.method || 'GET').toUpperCase()
    if (isDev && method === 'GET') {
      apiReadUnavailable = true
      const fallback = getLocalFallbackData(endpoint)
      if (fallback !== null) {
        console.warn(`[API] Fallback local data used for ${endpoint}`)
        return fallback
      }
    }

    console.error(`Error fetching from ${endpoint}:`, error)
    throw error
  }
}

/**
 * Post data to API
 * @param {string} endpoint - API endpoint key
 * @param {object} payload - Data to post
 * @returns {Promise<any>}
 */
export const postAPI = async (endpoint, payload) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS[endpoint] || endpoint}`

    // include auth header like fetchAPI does, KECUALI untuk endpoint peserta
    const authToken = localStorage.getItem('auth_token')
    const headers = {
      'Accept': 'application/json'
    }
    // if payload is not FormData, we'll send JSON
    if (!(payload instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    // Hanya tambahkan Authorization jika endpoint bukan peserta
    if (authToken && endpoint !== 'peserta') {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: payload instanceof FormData ? payload : JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(buildApiErrorMessage(errorData, `API Error: ${response.status} ${response.statusText}`))
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error)
    throw error
  }
}

/**
 * Update data in API
 * @param {string} endpoint - API endpoint key
 * @param {number|string} id - Resource ID
 * @param {object} payload - Data to update
 * @returns {Promise<any>}
 */
export const updateAPI = async (endpoint, id, payload) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS[endpoint] || endpoint}/${id}`

    const authToken = localStorage.getItem('auth_token')
    const headers = {
      'Accept': 'application/json'
    }
    if (!(payload instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const putResponse = await fetch(url, {
      method: 'PUT',
      headers,
      body: payload instanceof FormData ? payload : JSON.stringify(payload)
    })

    if (putResponse.ok) {
      const data = await putResponse.json()
      return data.data || data
    }

    // Fallback for backends that only accept POST + method override.
    const fallbackHeaders = {
      'Accept': 'application/json'
    }
    if (authToken) {
      fallbackHeaders['Authorization'] = `Bearer ${authToken}`
    }

    let fallbackBody
    if (payload instanceof FormData) {
      const fd = new FormData()
      for (const [key, value] of payload.entries()) {
        fd.append(key, value)
      }
      fd.append('_method', 'PUT')
      fallbackBody = fd
    } else {
      fallbackHeaders['Content-Type'] = 'application/json'
      fallbackBody = JSON.stringify({ ...(payload || {}), _method: 'PUT' })
    }

    const postOverrideResponse = await fetch(url, {
      method: 'POST',
      headers: fallbackHeaders,
      body: fallbackBody
    })

    if (!postOverrideResponse.ok) {
      const errorData = await postOverrideResponse.json().catch(() => ({}))
      throw new Error(
        buildApiErrorMessage(errorData,
        `API Error: PUT ${putResponse.status} ${putResponse.statusText}; POST override ${postOverrideResponse.status} ${postOverrideResponse.statusText}`
        )
      )
    }

    const data = await postOverrideResponse.json()
    return data.data || data
  } catch (error) {
    console.error(`Error updating ${endpoint}/${id}:`, error)
    throw error
  }
}

/**
 * Delete data from API
 * @param {string} endpoint - API endpoint key
 * @param {number|string} id - Resource ID
 * @returns {Promise<any>}
 */
export const deleteAPI = async (endpoint, id) => {
  try {
    const url = `${API_BASE_URL}${ENDPOINTS[endpoint] || endpoint}/${id}`

    const authToken = localStorage.getItem('auth_token')
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error deleting ${endpoint}/${id}:`, error)
    throw error
  }
}

export default {
  fetchAPI,
  postAPI,
  updateAPI,
  deleteAPI,
  ENDPOINTS,
  API_BASE_URL
}
