import axios from 'axios'
import dbJSON from '@/data/database.json'

// API Service Configuration
// During development, use local proxy `/api` to avoid CORS.
// In production, use the actual backend URL.
const isDev = import.meta.env.DEV
const API_HOST = isDev ? '' : (import.meta.env.VITE_API_BASE_URL || '')
const API_BASE_URL = API_HOST.replace(/\/$/, '') + '/api/v1/'
let apiReadUnavailable = false

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json'
  }
})

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

const buildHttpError = (status, statusText, endpoint, errorData, rawText = '') => {
  const fallbackBase = `API Error: ${status} ${statusText}`
  const fallbackWithEndpoint = `${fallbackBase} (${endpoint})`
  const parsedMessage = buildApiErrorMessage(errorData, fallbackWithEndpoint)
  const raw = String(rawText || '').trim()
  const looksLikeHtml = /<!doctype html|<html[\s>]/i.test(raw)
  const snippet = raw && !looksLikeHtml ? ` | ${raw.slice(0, 180)}` : ''
  return new Error(`${parsedMessage}${snippet}`)
}

const normalizeEndpoint = (endpoint = '') =>
  String(endpoint)
    .replace(/^https?:\/\/[^/]+\/api\/v1\//, '')
    .replace(/^\/?api\/v1\//, '')
    .replace(/^api\/v1\//, '')
    .replace(/^\/+|\/+$/g, '')

const getLocalFallbackData = (endpoint) => {
  const normalized = normalizeEndpoint(endpoint)
  if (!normalized) return null

  if (normalized === 'unit-kerja') return dbJSON.unit_kerja || []
  if (normalized === 'kegiatan' || normalized === 'kegiatan/all') return dbJSON.kegiatan || []
  if (normalized.startsWith('kegiatan/tim/')) {
    const targetUnitId = normalized.split('/').pop()
    const rows = dbJSON.kegiatan || []
    const hasUnitRelation = rows.some((item) =>
      item?.unit_kerja_id !== undefined ||
      item?.id_tim !== undefined ||
      item?.unit_kerja?.unit_kerja_id !== undefined ||
      item?.unit_kerja?.id !== undefined
    )
    if (!hasUnitRelation) return rows

    const target = String(targetUnitId ?? '').trim()
    return rows.filter((item) => {
      const itemUnitId = item?.unit_kerja_id
        ?? item?.id_tim
        ?? item?.unit_kerja?.unit_kerja_id
        ?? item?.unit_kerja?.id
      return String(itemUnitId ?? '').trim() === target
    })
  }
  if (normalized === 'pegawai') return dbJSON.pegawai || []
  if (normalized === 'users') return dbJSON.users || []

  return null
}

const resolveUrl = (endpoint) =>
  endpoint.startsWith('http')
    ? endpoint
    : normalizeEndpoint(ENDPOINTS[endpoint] || endpoint)

const buildHeaders = (headers = {}, includeAuth = true, payload) => {
  const authToken = localStorage.getItem('auth_token')
  const nextHeaders = {
    Accept: 'application/json',
    ...headers
  }

  if (!(payload instanceof FormData) && !nextHeaders['Content-Type']) {
    nextHeaders['Content-Type'] = 'application/json'
  }

  if (includeAuth && authToken) {
    nextHeaders.Authorization = `Bearer ${authToken}`
  }

  return nextHeaders
}

const normalizeResponseData = (data) => (
  Array.isArray(data) ? data : (data?.data || data)
)

const request = async (endpoint, config = {}) => {
  const url = resolveUrl(endpoint)

  try {
    const response = await apiClient.request({
      url,
      method: config.method || 'GET',
      data: config.data,
      headers: config.headers,
      params: config.params
    })

    return response.data
  } catch (error) {
    const status = error?.response?.status || 0
    const statusText = error?.response?.statusText || error?.message || 'Request failed'
    const rawData = error?.response?.data
    const rawText = typeof rawData === 'string' ? rawData : JSON.stringify(rawData || '')
    throw buildHttpError(status, statusText, endpoint, rawData, rawText)
  }
}

apiClient.interceptors.request.use((config) => {
  const endpoint = typeof config.url === 'string' ? config.url : ''
  const includeAuth = config.includeAuth !== false
  config.headers = buildHeaders(config.headers || {}, includeAuth, config.data)
  return config
})

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
    const data = await request(endpoint, {
      method,
      headers: options.headers,
      params: options.params,
      data: options.body
    })
    return normalizeResponseData(data)
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
    const data = await request(endpoint, {
      method: 'POST',
      headers: buildHeaders({}, endpoint !== 'peserta', payload),
      data: payload
    })
    return data?.data || data
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
    const resourceEndpoint = `${endpoint}/${id}`

    try {
      const data = await request(resourceEndpoint, {
        method: 'PUT',
        headers: buildHeaders({}, true, payload),
        data: payload
      })
      return data?.data || data
    } catch (error) {
      if (String(error?.message || '').includes('401')) {
        throw error
      }

      let fallbackPayload
      if (payload instanceof FormData) {
        const fd = new FormData()
        for (const [key, value] of payload.entries()) {
          fd.append(key, value)
        }
        fd.append('_method', 'PUT')
        fallbackPayload = fd
      } else {
        fallbackPayload = { ...(payload || {}), _method: 'PUT' }
      }

      const data = await request(resourceEndpoint, {
        method: 'POST',
        headers: buildHeaders({}, true, fallbackPayload),
        data: fallbackPayload
      })
      return data?.data || data
    }
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
    return await request(`${endpoint}/${id}`, {
      method: 'DELETE',
      headers: buildHeaders()
    })
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
  apiClient,
  ENDPOINTS,
  API_BASE_URL
}
