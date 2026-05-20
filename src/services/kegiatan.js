import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'

/**
 * Kegiatan API helper functions
 * These wrap the generic fetch/post/update/delete utilities so you
 * don't have to type the endpoint string everywhere in your components.
 */

/**
 * @returns {Promise<Array>} all kegiatan records
 */
export const listKegiatan = async () => {
  // Request raw response first to detect pagination metadata
  try {
    const raw = await fetchAPI('kegiatan', { raw: true })

    // If API returned an array directly, use it
    if (Array.isArray(raw)) return raw

    // If API returned object with `data` array
    if (raw && Array.isArray(raw.data)) {
      // Detect common pagination wrappers (meta, current_page, per_page, total)
      const hasPagination = raw.meta || raw.current_page || raw.per_page || raw.total
      // If there is pagination metadata, try the `/kegiatan/all` endpoint to fetch full list
      if (!hasPagination) return raw.data
    }
  } catch (e) {
    // ignore and fallback to non-raw fetch below
  }

  // Fallback: try endpoints that return full list
  try {
    let data = await fetchAPI('kegiatan')
    if (!Array.isArray(data) || data.length === 0) {
      try {
        data = await fetchAPI('kegiatan/all')
        if (data && Array.isArray(data.data)) {
          data = data.data
        }
      } catch (e) {
        // ignore
      }
    }
    return data
  } catch (e) {
    return []
  }
}

/**
 * @param {number|string} id
 * @returns {Promise<Object>} kegiatan data
 */
export const getKegiatan = (id) => {
  return fetchAPI(`kegiatan/${id}`)
}

export const getKegiatanTim = (id) => {
  return fetchAPI(`kegiatan/tim/${id}`)
}

export const getAllKegiatanTimKegiatan = (id) => {
  return fetchAPI(`kegiatan/tim_kegiatan/${id}`)
}

/**
 * @param {Object} payload - new kegiatan attributes
 * @returns {Promise<Object>} created kegiatan
 */
export const createKegiatan = (payload) => {
  return postAPI('kegiatan', payload)
}

/**
 * @param {number|string} id
 * @param {Object} payload - fields to update
 * @returns {Promise<Object>} updated kegiatan
 */
export const updateKegiatan = (id, payload) => {
  return updateAPI('kegiatan', id, payload)
}

/**
 * @param {number|string} id
 * @returns {Promise} delete response
 */
export const removeKegiatan = (id) => {
  return deleteAPI('kegiatan', id)
}

export default {
  listKegiatan,
  getKegiatan,
  createKegiatan,
  updateKegiatan,
  removeKegiatan,
}
