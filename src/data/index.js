// Use API FIRST, then fallback to local JSON if API fails
import { fetchAPI } from '@/services/api'

// API Base URL
const API_BASE_URL = '/api/v1'

// Create database object - starts empty and is populated by loadDataFromAPI/loadAllDataFromAPI
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
  surat_tugas: 'penugasan-pegawai',
  surat_tugas_pegawai: 'penugasan-pegawai',
  unit_kerja: 'unit-kerja',
  sub_unit_kerja: 'sub-unit-kerja',
  keanggotaan_tim: 'keanggotaan-tim'
}

const groupPenugasanByKegiatanRecords = (records = []) => {
  const grouped = new Map()

  ;(Array.isArray(records) ? records : []).forEach((item) => {
    const idKegiatan = item?.id_kegiatan ?? item?.kegiatan?.id_kegiatan ?? item?.kegiatan?.id ?? null
    if (idKegiatan === null || idKegiatan === undefined || idKegiatan === '') return

    const key = String(idKegiatan)
    const current = grouped.get(key) || {
      id_penugasan: idKegiatan,
      id_surat_tugas: idKegiatan,
      id_kegiatan: idKegiatan,
      kegiatan: item?.kegiatan || null,
      penugasan_pegawais: []
    }

    if (!current.kegiatan && item?.kegiatan) {
      current.kegiatan = item.kegiatan
    }

    current.penugasan_pegawais.push({
      ...item,
      id_penugasan: idKegiatan,
      id_surat_tugas: idKegiatan
    })

    grouped.set(key, current)
  })

  return Array.from(grouped.values())
}

/**
 * Load data dari API (tanpa fallback dummy, array kosong jika gagal)
 */
export const loadDataFromAPI = async (tableName) => {
  const endpoint = tableToEndpoint[tableName]
  if (!endpoint) {
    console.warn(`❌ Unknown table: ${tableName}`)
    return db[tableName] || []
  }

  try {
    const data = await fetchAPI(endpoint)
    if (Array.isArray(data)) {
      db[tableName] = tableName === 'surat_tugas'
        ? groupPenugasanByKegiatanRecords(data)
        : data
      return db[tableName]
    } else {
      throw new Error(`Invalid data format for ${tableName}`)
    }
  } catch (error) {
    console.warn(`[API] ⚠️  Failed to load ${tableName} from API:`, error.message)
    return db[tableName] || []
  }
}

/**
 * Load all data from API with JSON fallback (non-blocking - use available data)
 */
export const loadAllDataFromAPI = async () => {
  const tables = Object.keys(tableToEndpoint)
  
  const results = await Promise.allSettled(
    tables.map(table => loadDataFromAPI(table))
  )
  
  const successes = results.filter(r => r.status === 'fulfilled').length
  const failures = results.filter(r => r.status === 'rejected').length
  
  
  return db
}
/**
 * Sync database dengan API (push changes ke API)
 */
export const syncDatabaseWithAPI = async () => {
  try {
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
    dataLoadPromise = loadAllDataFromAPI()
      .then(() => {
        return db
      })
      .catch(err => {
        console.error('[Data] ❌ Unexpected error during data loading:', err)
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

