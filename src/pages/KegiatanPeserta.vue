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
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Total Peserta</p>
            <p class="text-sm sm:text-base font-semibold text-gray-900">{{ currentKegiatan.total_peserta }} orang</p>
          </div>
        </div>
      </div>

      <!-- Embed Halaman Peserta Management -->
      <PesertaManagement v-if="currentKegiatan" :kegiatan-id="currentKegiatan.id_kegiatan" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PesertaManagement from './PesertaManagement.vue'
import database from '@/data/index.js'

export default {
  name: 'KegiatanPeserta',
  components: {
    PesertaManagement
  },
  setup() {
    const route = useRoute()
    const kegiatan = ref(database.kegiatan)
    const currentKegiatan = ref(null)

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

    onMounted(() => {
      const kegiatanId = route.params.id
      currentKegiatan.value = kegiatan.value.find(k => k.id_kegiatan == kegiatanId)
    })

    return {
      currentKegiatan,
      getMetodeLabel,
      formatDate
    }
  }
}
</script>

<style scoped>
</style>
