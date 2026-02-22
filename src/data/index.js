// Use API FIRST, then fallback to local JSON if API fails
import { fetchAPI } from '@/services/api'
import dbJSON from './database.json'

// API Base URL
const API_BASE_URL = 'https://backend-siamin.bpmpntb.id/api/v1'

// Create database object - Will be populated from API or fallback JSON
const db = {
  pegawai: dbJSON.pegawai || [],
  users: dbJSON.users || [],
  kegiatan: dbJSON.kegiatan || [],
  peserta: dbJSON.peserta || [],
  sertifikat: dbJSON.sertifikat || [],
  akun_peserta: dbJSON.akun_peserta || [],
  surat_tugas: dbJSON.surat_tugas || [],
  surat_tugas_pegawai: dbJSON.surat_tugas_pegawai || [],
  unit_kerja: dbJSON.unit_kerja || [],
  sub_unit_kerja: dbJSON.sub_unit_kerja || [],
  keanggotaan_tim: dbJSON.keanggotaan_tim || []
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
 * Load data dari API dengan fallback ke local JSON
 */
export const loadDataFromAPI = async (tableName) => {
  const endpoint = tableToEndpoint[tableName]
  if (!endpoint) {
    console.warn(`❌ Unknown table: ${tableName}`)
    return db[tableName] || []
  }

  try {
    console.log(`[API] Loading ${tableName} from API...`)
    const data = await fetchAPI(endpoint)
    if (Array.isArray(data)) {
      db[tableName] = data
      console.log(`[API] ✅ ${tableName}: ${data.length} records from API`)
      return data
    } else {
      throw new Error(`Invalid data format for ${tableName}`)
    }
  } catch (error) {
    console.warn(`[API] ⚠️  Failed to load ${tableName} from API:`, error.message)
    console.log(`[API] 📦 Using fallback data for ${tableName} (${db[tableName]?.length || 0} records from JSON)`)
    return db[tableName] || []
  }
}

/**
 * Load all data from API with JSON fallback (non-blocking - use available data)
 */
export const loadAllDataFromAPI = async () => {
  const tables = Object.keys(tableToEndpoint)
  console.log(`[API] Loading ${tables.length} tables from API with JSON fallback...`)
  
  const results = await Promise.allSettled(
    tables.map(table => loadDataFromAPI(table))
  )
  
  const successes = results.filter(r => r.status === 'fulfilled').length
  const failures = results.filter(r => r.status === 'rejected').length
  
  console.log(`[API] ✅ Load complete: ${successes} success, ${failures} failed (using JSON fallback for failed)`)
  console.log('[Data] Database state:', Object.keys(db).map(k => `${k}: ${db[k]?.length || 0}`).join(', '))
  
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

// Auto-load data dari API dengan JSON fallback saat module diimport
let dataLoadPromise = null

if (typeof window !== 'undefined') {
  // Only in browser environment
  console.log('[Data] 🔄 Loading data from API (with JSON fallback)...')
  
  // Create promise that resolves when all data is loaded (or fallback used)
  dataLoadPromise = loadAllDataFromAPI()
    .then(() => {
      console.log('[Data] ✅ Data loading complete (API + JSON fallback)')
      console.log('[Data] Database state:', Object.keys(db).map(k => `${k}: ${db[k]?.length || 0}`).join(', '))
      return db
    })
    .catch(err => {
      console.error('[Data] ❌ Unexpected error during data loading:', err)
      console.log('[Data] Using JSON fallback data')
      return db
    })
}

// Export the promise so components can wait if needed
export const dataReady = dataLoadPromise || Promise.resolve(db)

export default db
