// Use API ONLY - No local JSON fallback
import { fetchAPI } from '@/services/api'

// API Base URL
const API_BASE_URL = 'https://backend-siamin.bpmpntb.id/api/v1'

// Create database object - Will be populated from API ONLY
const db = {
  pegawai: [],
  users: [],
  kegiatan: [],
  peserta: [],
  sertifikat: [],
  akun_peserta: [],
  surat_tugas: [],
  surat_tugas_pegawai: [],
  unit_kerja: [],
  sub_unit_kerja: [],
  keanggotaan_tim: []
}

// Map untuk menghubungkan nama table dengan endpoint API
const tableToEndpoint = {
  pegawai: 'pegawai',
  users: 'users',
  kegiatan: 'kegiatan',
  peserta: 'peserta',
  sertifikat: 'sertifikat',
  akun_peserta: 'akun-peserta',
  surat_tugas: 'surat-tugas',
  surat_tugas_pegawai: 'surat-tugas-pegawai',
  unit_kerja: 'unit-kerja',
  sub_unit_kerja: 'sub-unit-kerja',
  keanggotaan_tim: 'keanggotaan-tim'
}

/**
 * Load data dari API ONLY (tanpa fallback)
 */
export const loadDataFromAPI = async (tableName) => {
  const endpoint = tableToEndpoint[tableName]
  if (!endpoint) {
    console.warn(`❌ Unknown table: ${tableName}`)
    return []
  }

  try {
    console.log(`[API] Loading ${tableName}...`)
    const data = await fetchAPI(endpoint)
    if (Array.isArray(data)) {
      db[tableName] = data
      console.log(`[API] ✅ ${tableName}: ${data.length} records`)
      return data
    } else {
      throw new Error(`Invalid data format for ${tableName}`)
    }
  } catch (error) {
    console.error(`[API] ❌ Failed to load ${tableName}:`, error.message)
    throw error // Re-throw error, no fallback to JSON
  }
}

/**
 * Load all data from API ONLY (BLOCKING - wait for all to complete)
 */
export const loadAllDataFromAPI = async () => {
  const tables = Object.keys(tableToEndpoint)
  console.log(`[API] Loading ${tables.length} tables from API...`)
  
  const results = await Promise.allSettled(
    tables.map(table => loadDataFromAPI(table))
  )
  
  const successes = results.filter(r => r.status === 'fulfilled').length
  const failures = results.filter(r => r.status === 'rejected').length
  
  if (failures > 0) {
    console.error(`[API] ⚠️  Load complete: ${successes} success, ${failures} failed`)
    throw new Error(`Failed to load ${failures} tables from API`)
  }
  
  console.log(`[API] ✅ All ${successes} tables loaded successfully`)
  
  return db
}
/**
 * Sync database dengan API (push changes ke API)
 */
export const syncDatabaseWithAPI = async () => {
  try {
    console.log('Syncing database with API...')
  } catch (error) {
    console.error('Failed to sync database with API:', error)
  }
}

// Auto-load data dari API saat module diimport (API ONLY, NO FALLBACK)
let dataLoadPromise = null

if (typeof window !== 'undefined') {
  // Only in browser environment
  console.log('[Data] 🔄 Loading data from API (100% API, no local fallback)...')
  
  // Create promise that resolves when all data is loaded
  dataLoadPromise = loadAllDataFromAPI()
    .then(() => {
      console.log('[Data] ✅ All data loaded from API successfully')
      console.log('[Data] Database state:', Object.keys(db).map(k => `${k}: ${db[k].length}`).join(', '))
      return db
    })
    .catch(err => {
      console.error('[Data] ❌ Failed to load data from API - this will cause runtime errors:', err)
      throw err // Don't catch - let the app know data loading failed
    })
}

// Export the promise so components can wait if needed
export const dataReady = dataLoadPromise || Promise.resolve(db)

export default db
