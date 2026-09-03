<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header dengan Back Button -->
      <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <router-link to="/admin/kegiatan" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm sm:text-base">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="hidden sm:inline">Kembali ke Kegiatan</span>
          <span class="sm:hidden">Kembali</span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingKegiatan" class="mb-6 p-4 flex items-center justify-center bg-white rounded-lg shadow-md">
        <div class="flex items-center gap-3">
          <div class="animate-spin">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-600">Memuat data kegiatan...</p>
        </div>
      </div>

      <!-- Info Kegiatan Header -->
      <div v-if="currentKegiatan" class="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{{ currentKegiatan.nama_kegiatan }}</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Tanggal Pelaksanaan</p>
            <p class="text-sm sm:text-base font-semibold text-gray-900">{{ formatDate(currentKegiatan.tanggal_mulai) }} - {{ formatDate(currentKegiatan.tanggal_selesai) }}</p>
          </div>
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Lokasi</p>
            <p class="text-sm sm:text-base font-semibold text-gray-900">{{ currentKegiatan.lokasi }}</p>
          </div>
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Metode Pelaksanaan</p>
            <p class="text-sm sm:text-base font-semibold text-gray-900">{{ getMetodeLabel(currentKegiatan.metode_pelaksanaan) }}</p>
          </div>
          <!-- <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Total Peserta</p>
            <p class="text-sm sm:text-base font-semibold text-gray-900">{{ currentKegiatan.total_peserta }} orang</p>
          </div> -->
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="!isLoadingKegiatan" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800 text-sm">Kegiatan tidak ditemukan</p>
      </div>

      <!-- Embed Halaman Peserta Management -->
      <PesertaManagement
        v-if="currentKegiatan"
        :kegiatan-id="currentKegiatan.id_kegiatan"
        :kegiatan-data="currentKegiatan"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PesertaManagement from './PesertaManagement.vue'
import database from '@/data/index.js'
import { fetchAPI } from '@/services/api'

export default {
  name: 'KegiatanPeserta',
  components: {
    PesertaManagement
  },
  setup() {
    const route = useRoute()
    const kegiatan = ref([])
    const currentKegiatan = ref(null)
    const isLoadingKegiatan = ref(true)

    const getMetodeLabel = (metode) => {
      const labels = {
        'daring': 'Online (Daring)',
        'luring': 'Offline (Luring)',
        'hybrid': 'Hybrid (Daring + Luring)'
      }
      return labels[metode] || metode
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const loadKegiatanFromAPI = async () => {
      isLoadingKegiatan.value = true
      try {
        const kegiatanId = route.params.id
        const detail = await fetchAPI(`kegiatan/${kegiatanId}`)

        if (detail && !Array.isArray(detail)) {
          kegiatan.value = [detail]
          currentKegiatan.value = detail
          return
        }

        kegiatan.value = Array.isArray(detail) ? detail : []
        findCurrentKegiatan()
      } catch (error) {
        console.error('[KegiatanPeserta] Failed to load kegiatan detail from API:', error)
        kegiatan.value = []
        findCurrentKegiatan()
      } finally {
        isLoadingKegiatan.value = false
      }
    }

    const findCurrentKegiatan = () => {
      const kegiatanId = route.params.id
      // Toleransi: id_kegiatan bisa string/number, case-insensitive
      const norm = v => (v === undefined || v === null) ? '' : String(v).toLowerCase().trim()
      const idNorm = norm(kegiatanId)
      let found = kegiatan.value.find(k => norm(k.id_kegiatan) === idNorm)
      if (!found) {
        found = kegiatan.value.find(k => String(k.id_kegiatan) === String(kegiatanId))
      }
      if (!found) {
        // Fallback ke database lokal jika tidak ditemukan di API
        found = database.kegiatan.find(k => norm(k.id_kegiatan) === idNorm)
        if (!found) {
          found = database.kegiatan.find(k => String(k.id_kegiatan) === String(kegiatanId))
        }
        if (found) {
        }
      } else {
      }
      currentKegiatan.value = found || null
    }

    onMounted(() => {
      loadKegiatanFromAPI()
    })

    return {
      currentKegiatan,
      getMetodeLabel,
      formatDate,
      isLoadingKegiatan
    }
  }
}
</script>

<style scoped>
</style>
