import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'

/**
 * Kegiatan API helper functions
 * These wrap the generic fetch/post/update/delete utilities so you
 * don't have to type the endpoint string everywhere in your components.
 */

/**
 * @returns {Promise<Array>} all kegiatan records
 */
export const listKegiatan = () => {
  return fetchAPI('kegiatan')
}

/**
 * @param {number|string} id
 * @returns {Promise<Object>} kegiatan data
 */
export const getKegiatan = (id) => {
  return fetchAPI(`kegiatan/${id}`)
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
