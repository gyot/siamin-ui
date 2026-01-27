// Composable for data loading with API fallback
import { ref, computed } from 'vue'
import { fetchAPI } from '@/services/api'

const cache = new Map()

/**
 * Composable to fetch data with fallback to local JSON
 * @param {string} endpoint - API endpoint key
 * @param {any} fallbackData - Fallback data if API fails
 * @returns {object} { data, loading, error }
 */
export const useData = (endpoint, fallbackData = []) => {
  const data = ref(fallbackData)
  const loading = ref(false)
  const error = ref(null)

  // Check cache first
  if (cache.has(endpoint)) {
    data.value = cache.get(endpoint)
    return { data, loading, error }
  }

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      // Try to fetch from API
      const result = await fetchAPI(endpoint)
      data.value = result
      cache.set(endpoint, result)
    } catch (err) {
      console.warn(`Failed to fetch from API (${endpoint}), using fallback data:`, err)
      error.value = err.message
      // Use fallback data - already initialized to fallbackData
    } finally {
      loading.value = false
    }
  }

  // Fetch on initialization
  fetchData()

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clearCache: () => cache.delete(endpoint)
  }
}

/**
 * Clear all cached data
 */
export const clearAllCache = () => {
  cache.clear()
}

export default useData
