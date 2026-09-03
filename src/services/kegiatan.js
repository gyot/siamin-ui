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
  const extractRows = (response) => {
    if (Array.isArray(response)) return response
    if (Array.isArray(response?.data)) return response.data
    return []
  }

  const extractPagination = (response) => {
    const meta = response?.meta || response || {}
    const currentPage = Number(meta.current_page || meta.currentPage || response?.current_page || 1)
    const lastPage = Number(meta.last_page || meta.lastPage || response?.last_page || 1)
    const total = Number(meta.total || response?.total || 0)
    const perPage = Number(meta.per_page || meta.perPage || response?.per_page || 0)

    return {
      currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
      lastPage: Number.isFinite(lastPage) && lastPage > 0 ? lastPage : 1,
      total: Number.isFinite(total) && total > 0 ? total : 0,
      perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : 0
    }
  }

  const dedupeRows = (rows) => {
    if (!Array.isArray(rows)) return []
    return Array.from(
      new Map(
        rows.map((item, index) => [
          String(item?.id_kegiatan ?? item?.id ?? index),
          item
        ])
      ).values()
    )
  }

  const fetchAllPages = async (endpoint) => {
    const firstPage = await fetchAPI(endpoint, {
      raw: true,
      params: {
        page: 1,
        per_page: 100,
        limit: 100
      }
    })

    const firstRows = extractRows(firstPage)
    const pagination = extractPagination(firstPage)
    const hasMoreRows = pagination.lastPage > pagination.currentPage
      || (pagination.total > firstRows.length && pagination.perPage > 0)

    if (!hasMoreRows) return firstRows

    const lastPage = pagination.lastPage || Math.ceil(pagination.total / pagination.perPage) || 1
    const remainingPages = Array.from({ length: Math.max(lastPage - 1, 0) }, (_, index) => index + 2)
    const remainingResponses = await Promise.all(
      remainingPages.map((page) =>
        fetchAPI(endpoint, {
          raw: true,
          params: {
            page,
            per_page: pagination.perPage || 100,
            limit: pagination.perPage || 100
          }
        }).catch(() => null)
      )
    )

    return [
      ...firstRows,
      ...remainingResponses.flatMap(extractRows)
    ]
  }

  try {
    const rows = await fetchAllPages('kegiatan/all')
    if (rows.length > 0) return dedupeRows(rows)
  } catch (e) {
    // ignore and fallback to authenticated kegiatan endpoint below
  }

  try {
    const rows = await fetchAllPages('kegiatan')
    if (rows.length > 0) return dedupeRows(rows)
    const data = await fetchAPI('kegiatan')
    return dedupeRows(Array.isArray(data) ? data : extractRows(data))
  } catch (e) {
    return []
  }
}

/**
 * @returns {Promise<Array>} kegiatan yang dapat diakses user login berdasarkan tim dan penugasan
 */
export const listKegiatanTimSaya = async () => {
  const response = await fetchAPI('kegiatan/tim-saya', { raw: true })
  const rows = Array.isArray(response)
    ? response
    : (Array.isArray(response?.data) ? response.data : [])

  return Array.from(
    new Map(
      rows.map((item, index) => [
        String(item?.id_kegiatan ?? item?.id ?? index),
        item
      ])
    ).values()
  )
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
  listKegiatanTimSaya,
  getKegiatan,
  createKegiatan,
  updateKegiatan,
  removeKegiatan,
}
