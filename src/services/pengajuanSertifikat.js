import { fetchAPI } from '@/services/api'

/**
 * Layanan API untuk alur pengajuan penerbitan sertifikat (meja reviewer).
 *
 * PENTING: fetchAPI membuka wrapper respons (payload.data ?? payload), sehingga
 * field `ringkasan` HILANG kecuali memakai opsi `raw: true`. Karena itu
 * listPengajuanSertifikat WAJIB memakai raw: true.
 */

/**
 * Daftar pengajuan batch sertifikat + ringkasan jumlah per status.
 * GET /api/v1/sertifikat-batch/pengajuan (opsional ?status=)
 *
 * @param {string} [status] - filter status: diajukan | revisi | ditolak | disetujui | terbit
 * @returns {Promise<{data: Array, ringkasan: object}>}
 */
export const listPengajuanSertifikat = async (status = '') => {
  const response = await fetchAPI('sertifikat-batch/pengajuan', {
    raw: true,
    params: status ? { status } : {}
  })

  const rows = Array.isArray(response?.data)
    ? response.data
    : (Array.isArray(response) ? response : [])

  return {
    data: rows,
    ringkasan: response?.ringkasan || {
      diajukan: 0,
      revisi: 0,
      ditolak: 0,
      disetujui: 0,
      terbit: 0
    }
  }
}

/**
 * Setujui pengajuan batch sertifikat.
 * POST /api/v1/sertifikat-batch/{id}/setujui
 *
 * @param {number|string} idBatch
 * @returns {Promise<any>}
 */
export const setujuiPengajuanSertifikat = (idBatch) =>
  fetchAPI(`sertifikat-batch/${idBatch}/setujui`, { method: 'POST' })

/**
 * Kembalikan pengajuan untuk revisi.
 * POST /api/v1/sertifikat-batch/{id}/revisi — body: { pesan_revisi }
 *
 * @param {number|string} idBatch
 * @param {string} pesanRevisi
 * @returns {Promise<any>}
 */
export const revisiPengajuanSertifikat = (idBatch, pesanRevisi) =>
  fetchAPI(`sertifikat-batch/${idBatch}/revisi`, {
    method: 'POST',
    body: { pesan_revisi: pesanRevisi }
  })

/**
 * Tolak pengajuan batch sertifikat.
 * POST /api/v1/sertifikat-batch/{id}/tolak — body: { alasan_penolakan }
 *
 * @param {number|string} idBatch
 * @param {string} alasanPenolakan
 * @returns {Promise<any>}
 */
export const tolakPengajuanSertifikat = (idBatch, alasanPenolakan) =>
  fetchAPI(`sertifikat-batch/${idBatch}/tolak`, {
    method: 'POST',
    body: { alasan_penolakan: alasanPenolakan }
  })
