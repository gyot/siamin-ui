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
 * Detail satu batch untuk halaman detail proses sertifikat.
 * GET /api/v1/sertifikat-batch/{id}
 *
 * @param {number|string} idBatch
 * @returns {Promise<object>} data batch (kegiatan, penandatangan, template_file, status, ...)
 */
export const getDetailProsesSertifikat = async (idBatch) => {
  const response = await fetchAPI(`sertifikat-batch/${idBatch}`, { raw: true })

  return response?.data ?? response ?? null
}

/**
 * Daftar peserta + status sertifikat per peserta untuk satu batch.
 * GET /api/v1/sertifikat-batch/{id}/peserta-status
 *
 * PENTING: field `ringkasan` HILANG bila tanpa raw: true — WAJIB raw.
 *
 * @param {number|string} idBatch
 * @returns {Promise<{data: Array, ringkasan: object}>}
 */
export const listPesertaStatusSertifikat = async (idBatch) => {
  const response = await fetchAPI(`sertifikat-batch/${idBatch}/peserta-status`, { raw: true })

  const rows = Array.isArray(response?.data)
    ? response.data
    : (Array.isArray(response) ? response : [])

  return {
    data: rows,
    ringkasan: response?.ringkasan || {
      total: rows.length,
      terbit: 0,
      draft: 0,
      dicabut: 0,
      belum: 0
    }
  }
}

/**
 * Ubah status sertifikat peserta (massal / per baris).
 * PATCH /api/v1/sertifikat-batch/{id}/status-peserta
 * body: { id_pilih: [id_peserta], status: 'draft' | 'dicabut', alasan_cabut? }
 * `alasan_cabut` wajib untuk status 'dicabut'. Peserta berstatus 'belum'
 * dibuatkan baris baru oleh backend.
 *
 * @param {number|string} idBatch
 * @param {{id_pilih: Array<number|string>, status: string, alasan_cabut?: string}} payload
 * @returns {Promise<any>}
 */
export const ubahStatusSertifikatPeserta = (idBatch, payload) =>
  fetchAPI(`sertifikat-batch/${idBatch}/status-peserta`, {
    method: 'PATCH',
    body: payload
  })

/**
 * Terbitkan sertifikat satu peserta (membuat berkas PDF).
 * POST /api/v1/sertifikat-batch/{id}/terbitkan — body: { id_peserta }
 * Idempoten: peserta yang sudah terbit dilewati oleh backend.
 *
 * @param {number|string} idBatch
 * @param {number|string} idPeserta
 * @returns {Promise<any>}
 */
export const terbitkanSertifikatPeserta = (idBatch, idPeserta) =>
  fetchAPI(`sertifikat-batch/${idBatch}/terbitkan`, {
    method: 'POST',
    body: { id_peserta: idPeserta }
  })

/**
 * Unduh PDF contoh (draft) dari template batch lewat layanan generator Node —
 * mekanisme yang sama dengan unduh sertifikat peserta.
 * POST {VITE_SERTIFIKAT_API_URL}/generate-certificate/draft
 * body: { id_batch, id_kelas?, api_base_url: window.location.origin }
 * Generator mengambil data draft dari GET /api/v1/sertifikat-batch/{id}/draft-data
 * (template_file, struktur_program terfilter, penandatangan, data contoh CONTOH/DRAFT)
 * lalu merender docx -> PDF (docxtemplater + LibreOffice).
 * Untuk "Semua Kelas", kirim idKelas = null (dikosongkan).
 *
 * @param {number|string} idBatch
 * @param {number|string|null} idKelas
 * @returns {Promise<Blob>} berkas PDF
 */
export const unduhDraftPdf = async (idBatch, idKelas = null) => {
  const SERTIFIKAT_API_URL = import.meta.env.VITE_SERTIFIKAT_API_URL || 'http://localhost:4000'
  const body = {
    id_batch: Number(idBatch),
    api_base_url: window.location.origin
  }
  if (idKelas != null) body.id_kelas = Number(idKelas)

  const response = await fetch(`${SERTIFIKAT_API_URL}/generate-certificate/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    let msg = 'Gagal membuat PDF contoh'
    try {
      const err = await response.json()
      msg = err?.message || msg
    } catch (_) { /* respons bukan JSON */ }
    throw new Error(msg)
  }

  return response.blob()
}
