import { fetchAPI } from '@/services/api'

/**
 * Layanan API untuk manajemen hak akses menu per user (privilege).
 *
 * Kontrak API:
 * - GET  /api/v1/hak-akses/saya       (auth)        -> success + data { super_admin, menus[] }
 * - GET  /api/v1/hak-akses            (super admin) -> daftar user { id_user, nama, nip, peran, menus[], default }
 * - PUT  /api/v1/hak-akses/{id_user}  (super admin) -> body { menus: [], peran? }
 *
 * PENTING: fetchAPI membuka wrapper respons (payload.data ?? payload), jadi
 * pembacaan field di luar `data` (mis. `success`) WAJIB memakai `raw: true`.
 * Semua helper di file ini sudah memakai raw: true lalu membuka `data` sendiri.
 */

/**
 * Daftar kunci menu beserta label yang dipakai di sidebar & tabel.
 * Urutan ini juga menjadi urutan kolom checkbox di halaman Hak Akses.
 */
export const MENU_OPTIONS = [
  { key: 'dashboard', label: 'Dashboard', short: 'Dash' },
  { key: 'kegiatan', label: 'Kegiatan', short: 'Kegiatan' },
  { key: 'pengajuan-sertifikat', label: 'Pengajuan Sertifikat', short: 'Pengajuan' },
  { key: 'proses-sertifikat', label: 'Proses Sertifikat', short: 'Proses' },
  { key: 'pegawai-user', label: 'Pegawai & User', short: 'Pegawai' },
  { key: 'daftar-sekolah', label: 'Daftar Sekolah', short: 'Sekolah' },
  { key: 'daftar-peserta', label: 'Daftar Peserta', short: 'Peserta' },
  { key: 'penugasan', label: 'Penugasan', short: 'Tugas' },
  { key: 'paket-soal', label: 'Paket Soal', short: 'Soal' },
  { key: 'laporan-kegiatan', label: 'Laporan Kegiatan', short: 'Laporan' },
  { key: 'api-token', label: 'API Token', short: 'Token' },
  { key: 'hak-akses', label: 'Hak Akses', short: 'Hak Akses' }
]

export const MENU_KEYS = MENU_OPTIONS.map((item) => item.key)

/**
 * Menu default untuk user yang belum dikonfigurasikan hak aksesnya.
 */
export const DEFAULT_MENUS = ['dashboard', 'kegiatan', 'pegawai-user', 'penugasan', 'laporan-kegiatan']

/**
 * Normalisasi isi `menus` dari API menjadi array kunci menu.
 * Toleran terhadap bentuk: ['dashboard', ...] atau [{ key/menu/kode: 'dashboard' }, ...].
 *
 * @param {any} value
 * @returns {string[]}
 */
export const normalizeMenuKeys = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (typeof item === 'string') return item
      return item?.key ?? item?.menu ?? item?.kode ?? null
    })
    .filter((item) => typeof item === 'string' && item.trim() !== '')
}

/**
 * Hak akses milik user yang sedang login.
 * GET /api/v1/hak-akses/saya
 *
 * @returns {Promise<{super_admin: boolean, menus: string[]}>}
 */
export const getHakAksesSaya = async () => {
  const response = await fetchAPI('hak-akses/saya', { raw: true })
  const payload = response?.data ?? response ?? {}
  return {
    super_admin: !!payload?.super_admin,
    menus: normalizeMenuKeys(payload?.menus)
  }
}

/**
 * Daftar semua user + hak aksesnya (khusus super admin).
 * GET /api/v1/hak-akses
 *
 * @returns {Promise<Array>} daftar user { id_user, nama, nip, peran, menus, default }
 */
export const listHakAkses = async () => {
  const response = await fetchAPI('hak-akses', { raw: true })
  return Array.isArray(response?.data)
    ? response.data
    : (Array.isArray(response) ? response : [])
}

/**
 * Simpan hak akses satu user (khusus super admin).
 * PUT /api/v1/hak-akses/{id_user} — body: { menus: string[], peran?: string }
 *
 * @param {number|string} idUser
 * @param {{menus: string[], peran?: string}} payload
 * @returns {Promise<any>}
 */
export const updateHakAkses = (idUser, payload) =>
  fetchAPI(`hak-akses/${idUser}`, {
    method: 'PUT',
    body: {
      menus: Array.isArray(payload?.menus) ? payload.menus : [],
      ...(payload?.peran ? { peran: payload.peran } : {})
    }
  })
