import { fetchAPI } from '@/services/api'

/**
 * Layanan API lonceng notifikasi.
 *
 * PENTING: fetchAPI membuka wrapper respons (payload.data ?? payload), sehingga
 * field `jumlah_belum_dibaca` HILANG kecuali memakai opsi `raw: true`.
 * Semua pemanggilan di file ini memakai raw: true.
 */

/**
 * 20 notifikasi terbaru milik user login + jumlah yang belum dibaca.
 * GET /api/v1/notifikasi
 *
 * @returns {Promise<{data: Array, jumlah_belum_dibaca: number}>}
 */
export const listNotifikasi = async () => {
  const response = await fetchAPI('notifikasi', { raw: true })

  return {
    data: Array.isArray(response?.data)
      ? response.data
      : (Array.isArray(response) ? response : []),
    jumlah_belum_dibaca: response?.jumlah_belum_dibaca ?? 0
  }
}

/**
 * Tandai satu notifikasi sudah dibaca.
 * POST /api/v1/notifikasi/{id}/baca
 *
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export const tandaiNotifikasiDibaca = (id) =>
  fetchAPI(`notifikasi/${id}/baca`, { method: 'POST', raw: true })

/**
 * Tandai semua notifikasi belum dibaca menjadi sudah dibaca.
 * POST /api/v1/notifikasi/baca-semua
 *
 * @returns {Promise<any>}
 */
export const tandaiSemuaNotifikasiDibaca = () =>
  fetchAPI('notifikasi/baca-semua', { method: 'POST', raw: true })
