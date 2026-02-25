// Use API FIRST, then fallback to local JSON if API fails
import { fetchAPI } from '@/services/api'
import dbJSON from './database.json'

// API Base URL
const API_BASE_URL = 'https://api-siamin.bpmpntb.id/api/v1'

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

// ==================================================================================
// lazy-loading helper
// the module no longer fetches all tables immediately during import. instead
// consumer code must call `ensureDataLoaded()` when it actually needs the data.
// this keeps the initial bundle light and avoids unnecessary API traffic.
// ==================================================================================

let dataLoadPromise = null

/**
 * Trigger a full data sync (API + JSON fallback) if it hasn't been started yet.
 * callers can `await ensureDataLoaded()` before accessing `database`.
 * subsequent calls return the same promise so the load happens only once.
 */
export const ensureDataLoaded = () => {
  if (!dataLoadPromise) {
    console.log('[Data] 🔄 ensureDataLoaded() initiating loadAllDataFromAPI()')
    dataLoadPromise = loadAllDataFromAPI()
      .then(() => {
        console.log('[Data] ✅ Data loading complete (API + JSON fallback)')
        console.log(
          '[Data] Database state:',
          Object.keys(db)
            .map(k => `${k}: ${db[k]?.length || 0}`)
            .join(', ')
        )
        return db
      })
      .catch(err => {
        console.error('[Data] ❌ Unexpected error during data loading:', err)
        console.log('[Data] Using JSON fallback data')
        return db
      })
  }
  return dataLoadPromise
}

// keep a legacy export in case some older code still uses it
// now `dataReady` is a function; callers must invoke it if they want the
// promise. nothing happens on import anymore.
export const dataReady = () => ensureDataLoaded()

export default db
