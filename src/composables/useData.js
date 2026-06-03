import { ref } from 'vue'
import { fetchAPI } from '@/services/api'

const CACHE_TTL = 5 * 60 * 1000
const cache = new Map()
const inflight = new Map()

const isCacheValid = (entry) => entry && (Date.now() - entry.timestamp) < CACHE_TTL

export const useData = (endpoint, fallbackData = []) => {
  const data = ref(fallbackData)
  const loading = ref(false)
  const error = ref(null)

  const cached = cache.get(endpoint)
  if (isCacheValid(cached)) {
    data.value = cached.data
    return { data, loading, error, refetch: fetchData, clearCache: () => cache.delete(endpoint) }
  }

  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      if (inflight.has(endpoint)) {
        const result = await inflight.get(endpoint)
        data.value = result
        return
      }

      const promise = fetchAPI(endpoint).then((result) => {
        cache.set(endpoint, { data: result, timestamp: Date.now() })
        inflight.delete(endpoint)
        return result
      }).catch((err) => {
        inflight.delete(endpoint)
        throw err
      })

      inflight.set(endpoint, promise)
      const result = await promise
      data.value = result
    } catch (err) {
      console.warn(`Failed to fetch from API (${endpoint}), using fallback data:`, err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  fetchData()

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clearCache: () => cache.delete(endpoint)
  }
}

export const clearAllCache = () => {
  cache.clear()
  inflight.clear()
}

export default useData
