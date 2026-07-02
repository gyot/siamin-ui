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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">Cari peserta</label>
            <input
              v-model="keyword"
              type="text"
              placeholder="Cari nama, email, instansi, atau peran..."
              class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Baris per halaman</label>
            <select
              v-model.number="rowsPerPage"
              class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
        Memuat daftar peserta...
      </div>

      <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else class="space-y-4">
        <div v-if="filteredPeserta.length === 0" class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
          Belum ada peserta yang mengisi formulir untuk kegiatan ini.
        </div>

        <div v-else class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100 text-slate-700">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">No</th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nama_lengkap')">
                    Nama {{ sortIndicator('nama_lengkap') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('email')">
                    Email {{ sortIndicator('email') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nip')">
                    NIP {{ sortIndicator('nip') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nama_instansi')">
                    Instansi {{ sortIndicator('nama_instansi') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('kab_kota')">
                    Kabupaten/Kota {{ sortIndicator('kab_kota') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('peran')">
                    Peran {{ sortIndicator('peran') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">TPK</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pesertaItem, index) in paginatedPeserta"
                  :key="pesertaItem.id_peserta || `${pesertaItem.id_kegiatan}-${index}`"
                  class="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td class="px-4 py-3 text-slate-700">{{ startRow + index }}</td>
                  <td class="px-4 py-3 font-medium text-slate-800">{{ pesertaItem.nama_lengkap || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.email || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.nip || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.nama_instansi || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.kab_kota || '-' }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {{ pesertaItem.peran || 'Peserta' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-slate-700">
                    <span v-if="pesertaItem.tpk">{{ pesertaItem.tpk.lokasi }}{{ pesertaItem.tpk.kabupaten_kota ? ` (${pesertaItem.tpk.kabupaten_kota})` : '' }}</span>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p class="text-sm text-slate-600">
              Menampilkan {{ startRow }} - {{ endRow }} dari {{ sortedPeserta.length }} data
            </p>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50"
                :disabled="currentPage === 1"
                @click="prevPage"
              >
                Prev
              </button>
              <span class="text-sm text-slate-700">Halaman {{ currentPage }} / {{ totalPages }}</span>
              <button
                class="px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
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
    const currentPage = ref(1)
    const rowsPerPage = ref(10)
    const sortBy = ref('nama_lengkap')
    const sortOrder = ref('asc')

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

    const sortedPeserta = computed(() => {
      const data = [...filteredPeserta.value]
      return data.sort((a, b) => {
        const left = normalize(a[sortBy.value])
        const right = normalize(b[sortBy.value])
        if (left < right) return sortOrder.value === 'asc' ? -1 : 1
        if (left > right) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    })

    const totalPages = computed(() => {
      const total = Math.ceil(sortedPeserta.value.length / rowsPerPage.value)
      return total > 0 ? total : 1
    })

    const paginatedPeserta = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value
      return sortedPeserta.value.slice(start, start + rowsPerPage.value)
    })

    const startRow = computed(() => {
      if (sortedPeserta.value.length === 0) return 0
      return (currentPage.value - 1) * rowsPerPage.value + 1
    })

    const endRow = computed(() => {
      if (sortedPeserta.value.length === 0) return 0
      return Math.min(currentPage.value * rowsPerPage.value, sortedPeserta.value.length)
    })

    const setSort = (column) => {
      if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        return
      }
      sortBy.value = column
      sortOrder.value = 'asc'
    }

    const sortIndicator = (column) => {
      if (sortBy.value !== column) return ''
      return sortOrder.value === 'asc' ? '▲' : '▼'
    }

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value -= 1
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value += 1
    }

    watch([keyword, rowsPerPage], () => {
      currentPage.value = 1
    })

    watch(totalPages, (newTotal) => {
      if (currentPage.value > newTotal) currentPage.value = newTotal
    })

    onMounted(loadData)

    return {
      isLoading,
      errorMessage,
      keyword,
      kegiatan,
      filteredPeserta,
      sortedPeserta,
      paginatedPeserta,
      currentPage,
      rowsPerPage,
      totalPages,
      startRow,
      endRow,
      setSort,
      sortIndicator,
      prevPage,
      nextPage
    }
  }
}
</script>
