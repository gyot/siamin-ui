import { fetchAPI, apiClient } from '@/services/api'

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

/**
 * Daftar batch untuk meja persuratan (status disetujui + terbit).
 * GET /api/v1/sertifikat-batch/proses
 *
 * @returns {Promise<Array>} daftar batch (urut tanggal_persetujuan terbaru)
 */
export const listProsesSertifikat = async () => {
  const response = await fetchAPI('sertifikat-batch/proses', { raw: true })

  return Array.isArray(response?.data)
    ? response.data
    : (Array.isArray(response) ? response : [])
}

/**
 * Terbitkan nomor resmi batch oleh persuratan.
 * POST /api/v1/sertifikat-batch/{id}/proses — body: { nomor_sertifikat }
 *
 * @param {number|string} idBatch
 * @param {string} nomorSertifikat
 * @returns {Promise<any>}
 */
export const prosesSertifikatBatch = (idBatch, nomorSertifikat) =>
  fetchAPI(`sertifikat-batch/${idBatch}/proses`, {
    method: 'POST',
    body: { nomor_sertifikat: nomorSertifikat }
  })

/**
 * Daftar kelas milik satu kegiatan.
 * GET /api/v1/kelas/{id_kegiatan}
 *
 * @param {number|string} idKegiatan
 * @returns {Promise<Array>} daftar kelas
 */
export const listKelasKegiatan = async (idKegiatan) => {
  const response = await fetchAPI(`kelas/${idKegiatan}`, { raw: true })

  return Array.isArray(response?.data)
    ? response.data
    : (Array.isArray(response) ? response : [])
}

/**
 * Unduh PDF contoh (draft) dari template batch — respons berupa berkas PDF.
 * POST /api/v1/sertifikat-batch/{id}/draft-pdf — body: { id_kelas }
 * Untuk "Semua Kelas", kirim idKelas = null (dikosongkan).
 *
 * @param {number|string} idBatch
 * @param {number|string|null} idKelas
 * @returns {Promise<Blob>} berkas PDF
 */
export const unduhDraftPdf = async (idBatch, idKelas = null) => {
  const response = await apiClient.post(
    `sertifikat-batch/${idBatch}/draft-pdf`,
    { id_kelas: idKelas },
    { responseType: 'blob' }
  )

  return new Blob([response.data], { type: 'application/pdf' })
}
