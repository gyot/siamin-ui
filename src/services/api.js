// API Service Configuration
// During development, use local proxy `/api` to avoid CORS.
// In production, use the actual backend URL.
const isDev = import.meta.env.DEV
const API_HOST = isDev ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://api-siamin.bpmpntb.id')
const API_BASE_URL = API_HOST.replace(/\/$/, '') + '/api/v1/'

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

/**
 * Fetch data from API with flexible method support
 * @param {string} endpoint - API endpoint key or full URL
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>}
 */
export const fetchAPI = async (endpoint, options = {}) => {
  try {
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
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Handle both direct array responses and paginated responses
    return Array.isArray(data) ? data : (data.data || data)
  } catch (error) {
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
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
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

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: payload instanceof FormData ? payload : JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
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
