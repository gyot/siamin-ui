<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-6">
        <router-link :to="backLink" class="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium">
          <span>&larr;</span>
          <span>Kembali ke detail kegiatan</span>
        </router-link>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 mb-5">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-blue-600 font-semibold">Unduh Sertifikat</p>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-800">
              {{ kegiatan?.nama_kegiatan || 'Kegiatan' }}
            </h1>
            <p class="text-sm text-slate-600 mt-1">
              Pilih peserta untuk mengunduh sertifikat dalam format PDF.
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
              placeholder="Cari nama, NIP, instansi, atau peran..."
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
          Belum ada peserta terdaftar untuk kegiatan ini.
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
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nip')">
                    NIP {{ sortIndicator('nip') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nama_instansi')">
                    Instansi {{ sortIndicator('nama_instansi') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('peran')">
                    Peran {{ sortIndicator('peran') }}
                  </th>
                  <th class="px-4 py-3 text-center font-semibold">Sertifikat</th>
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
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.nip || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.nama_instansi || '-' }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {{ pesertaItem.peran || 'Peserta' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      v-if="pesertaItem._sertifikat"
                      @click="downloadSertifikat(pesertaItem)"
                      :disabled="downloadingId === pesertaItem.id_peserta"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg v-if="downloadingId === pesertaItem.id_peserta" class="animate-spin w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {{ downloadingId === pesertaItem.id_peserta ? 'Mengunduh...' : 'Unduh PDF' }}
                    </button>
                    <span v-else class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                      Belum Terbit
                    </span>
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
import { buildPublicUrl as buildAppUrl } from '@/utils/url'
import database from '@/data/index.js'

const SERTIFIKAT_API_URL = import.meta.env.VITE_SERTIFIKAT_API_URL || 'http://localhost:4000'

export default {
  name: 'UnduhSertifikatPublik',
  setup() {
    const route = useRoute()
    const kode = route.params.kode

    const isLoading = ref(true)
    const errorMessage = ref('')
    const keyword = ref('')
    const peserta = ref([])
    const sertifikatList = ref([])
    const kegiatanList = ref([])
    const currentPage = ref(1)
    const rowsPerPage = ref(10)
    const sortBy = ref('nama_lengkap')
    const sortOrder = ref('asc')
    const downloadingId = ref(null)

    const normalize = (value) => String(value || '').toLowerCase().trim()

    const backLink = computed(() => {
      const slug = kegiatan.value?.nama_kegiatan
        ? String(kegiatan.value.nama_kegiatan).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
        : ''
      return `/kegiatan/${kode}/${slug}`
    })

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

        // Fetch sertifikat per kegiatan (same endpoint as PesertaManagement)
        if (kode) {
          try {
            const sertifikatData = await fetchAPI(`kegiatan/${kode}/peserta-sertifikat`)
            sertifikatList.value = Array.isArray(sertifikatData)
              ? sertifikatData
              : (Array.isArray(sertifikatData?.data) ? sertifikatData.data
                : (Array.isArray(sertifikatData?.peserta_sertifikat) ? sertifikatData.peserta_sertifikat : []))
          } catch {
            // Fallback: try generic sertifikat endpoint
            try {
              const sertifikatData = await fetchAPI('sertifikat')
              sertifikatList.value = Array.isArray(sertifikatData)
                ? sertifikatData
                : (Array.isArray(sertifikatData?.data) ? sertifikatData.data : [])
            } catch {
              sertifikatList.value = []
            }
          }
        }
      } catch (error) {
        console.warn('[UnduhSertifikatPublik] gagal ambil API, pakai data lokal', error)
        peserta.value = database.peserta || []
        kegiatanList.value = database.kegiatan || []
        sertifikatList.value = []

        if (!peserta.value.length) {
          errorMessage.value = 'Data peserta belum dapat dimuat saat ini.'
        }
      } finally {
        isLoading.value = false
      }
    }

    const kegiatan = computed(() => {
      return kegiatanList.value.find((item) => normalize(item.id_kegiatan) === normalize(kode)) || null
    })

    const sertifikatByPeserta = computed(() => {
      const map = {}
      for (const s of sertifikatList.value) {
        const idPeserta = String(s.id_peserta ?? s.peserta?.id_peserta ?? s.peserta_id ?? '')
        if (idPeserta && idPeserta !== 'undefined') {
          map[idPeserta] = s
        }
      }
      return map
    })

    const pesertaByKegiatan = computed(() => {
      return peserta.value
        .filter((item) => normalize(item.id_kegiatan) === normalize(kode))
        .map((item) => {
          const idPeserta = String(item.id_peserta ?? '')
          const sertifikat = sertifikatByPeserta.value[idPeserta] || null
          const statusSertifikat = sertifikat?.status_sertifikat || sertifikat?.status || ''
          const isTerbit = ['terbit', 'published', 'active', 'diterbitkan'].includes(normalize(statusSertifikat))
          const hasId = !!(sertifikat?.id_sertifikat || sertifikat?.id)
          return {
            ...item,
            _sertifikat: (isTerbit || hasId) ? sertifikat : null
          }
        })
    })

    const filteredPeserta = computed(() => {
      const key = normalize(keyword.value)
      if (!key) return pesertaByKegiatan.value

      return pesertaByKegiatan.value.filter((item) => {
        const haystack = [
          item.nama_lengkap,
          item.nip,
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

    const downloadSertifikat = async (pesertaItem) => {
      const sertifikat = pesertaItem._sertifikat
      console.log(sertifikat);
      
      if (!sertifikat) {
        alert('Sertifikat belum tersedia untuk peserta ini.')
        return
      }

      const idSertifikat = sertifikat.id_peserta || sertifikat.id || 0
      console.log(idSertifikat);
      
      if (!idSertifikat) {
        alert('ID sertifikat tidak ditemukan.')
        return
      }

      downloadingId.value = pesertaItem.id_peserta

      try {
        const response = await fetch(`${SERTIFIKAT_API_URL}/generate-certificate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_sertifikat: Number(idSertifikat) })
        })

        if (!response.ok) {
          let errorMsg = 'Gagal mengunduh sertifikat.'
          try {
            const errorData = await response.json()
            errorMsg = errorData.message || errorMsg
          } catch {
            // response bukan JSON
          }
          throw new Error(errorMsg)
        }

        const blob = await response.blob()
        const namaFile = `Sertifikat - ${pesertaItem.nama_lengkap || 'Peserta'}.pdf`
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = namaFile
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('[UnduhSertifikatPublik] Gagal download sertifikat:', error)
        alert(error.message || 'Gagal mengunduh sertifikat. Silakan coba lagi.')
      } finally {
        downloadingId.value = null
      }
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
      backLink,
      filteredPeserta,
      sortedPeserta,
      paginatedPeserta,
      currentPage,
      rowsPerPage,
      totalPages,
      startRow,
      endRow,
      downloadingId,
      setSort,
      sortIndicator,
      prevPage,
      nextPage,
      downloadSertifikat
    }
  }
}
</script>
