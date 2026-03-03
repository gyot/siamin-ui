<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-6">
        <router-link to="/" class="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium">
          <span>&larr;</span>
          <span>Kembali ke beranda</span>
        </router-link>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 mb-5">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-blue-600 font-semibold">Daftar Peserta Kegiatan</p>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-800">
              {{ kegiatan?.nama_kegiatan || 'Kegiatan' }}
            </h1>
            <p class="text-sm text-slate-600 mt-1">
              Menampilkan peserta yang sudah mengisi formulir.
            </p>
          </div>
          <div class="text-sm text-slate-600">
            Total peserta: <span class="font-semibold text-slate-800">{{ filteredPeserta.length }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 mb-5">
        <label class="block text-sm font-medium text-slate-700 mb-2">Cari peserta</label>
        <input
          v-model="keyword"
          type="text"
          placeholder="Cari nama, email, instansi, atau peran..."
          class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div v-if="isLoading" class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
        Memuat daftar peserta...
      </div>

      <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else class="space-y-3">
        <div v-if="filteredPeserta.length === 0" class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
          Belum ada peserta yang mengisi formulir untuk kegiatan ini.
        </div>

        <div
          v-for="(pesertaItem, index) in filteredPeserta"
          :key="pesertaItem.id_peserta || `${pesertaItem.id_kegiatan}-${index}`"
          class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-base font-semibold text-slate-800">{{ pesertaItem.nama_lengkap || '-' }}</p>
              <p class="text-sm text-slate-600">{{ pesertaItem.email || '-' }}</p>
            </div>
            <span class="inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {{ pesertaItem.peran || 'Peserta' }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-sm">
            <div>
              <p class="text-slate-500">NIP</p>
              <p class="font-medium text-slate-800">{{ pesertaItem.nip || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-500">No. HP</p>
              <p class="font-medium text-slate-800">{{ pesertaItem.no_hp || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-500">Instansi</p>
              <p class="font-medium text-slate-800">{{ pesertaItem.nama_instansi || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-500">Kabupaten/Kota</p>
              <p class="font-medium text-slate-800">{{ pesertaItem.kab_kota || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAPI } from '@/services/api'
import database from '@/data/index.js'

export default {
  name: 'DaftarPesertaPublik',
  setup() {
    const route = useRoute()
    const kode = route.params.kode

    const isLoading = ref(true)
    const errorMessage = ref('')
    const keyword = ref('')
    const peserta = ref([])
    const kegiatanList = ref([])

    const normalize = (value) => String(value || '').toLowerCase().trim()

    const loadData = async () => {
      isLoading.value = true
      errorMessage.value = ''

      try {
        const [pesertaData, kegiatanData] = await Promise.all([
          fetchAPI('peserta'),
          fetchAPI('kegiatan/all')
        ])

        peserta.value = Array.isArray(pesertaData)
          ? pesertaData
          : (Array.isArray(pesertaData?.data) ? pesertaData.data : [])

        kegiatanList.value = Array.isArray(kegiatanData)
          ? kegiatanData
          : (Array.isArray(kegiatanData?.data) ? kegiatanData.data : [])
      } catch (error) {
        console.warn('[DaftarPesertaPublik] gagal ambil API, pakai data lokal', error)
        peserta.value = database.peserta || []
        kegiatanList.value = database.kegiatan || []

        if (!peserta.value.length) {
          errorMessage.value = 'Daftar peserta belum dapat dimuat saat ini.'
        }
      } finally {
        isLoading.value = false
      }
    }

    const kegiatan = computed(() => {
      return kegiatanList.value.find((item) => normalize(item.id_kegiatan) === normalize(kode)) || null
    })

    const pesertaByKegiatan = computed(() => {
      return peserta.value.filter((item) => normalize(item.id_kegiatan) === normalize(kode))
    })

    const filteredPeserta = computed(() => {
      const key = normalize(keyword.value)
      if (!key) return pesertaByKegiatan.value

      return pesertaByKegiatan.value.filter((item) => {
        const haystack = [
          item.nama_lengkap,
          item.email,
          item.nama_instansi,
          item.kab_kota,
          item.peran
        ].map(normalize).join(' ')
        return haystack.includes(key)
      })
    })

    onMounted(loadData)

    return {
      isLoading,
      errorMessage,
      keyword,
      kegiatan,
      filteredPeserta
    }
  }
}
</script>
