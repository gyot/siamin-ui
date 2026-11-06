<template>
  <div class="space-y-4">
    <!-- Header + Kontrol -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800">Daftar Sekolah</h1>
        <p class="text-sm text-gray-500">Data sekolah dari seluruh kegiatan (unik berdasarkan NPSN)</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model="search" type="text" placeholder="Cari nama sekolah / NPSN / kabupaten..."
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
        />
        <div class="relative">
          <button @click="showCols = !showCols"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            ⚙ Kelola Kolom
          </button>
          <div v-if="showCols" class="absolute right-0 z-20 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 space-y-2">
            <label v-for="(vis, key) in visibleCols" :key="key" class="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" v-model="visibleCols[key]" class="h-4 w-4 rounded border-gray-300" /> {{ colLabels[key] }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('npsn')">
                NPSN {{ sortIndicator('npsn') }}
              </th>
              <th class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('nama_sekolah')">
                Nama Sekolah {{ sortIndicator('nama_sekolah') }}
              </th>
              <th v-if="visibleCols.kab_kota" class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('kab_kota')">
                Kabupaten/Kota {{ sortIndicator('kab_kota') }}
              </th>
              <th v-if="visibleCols.provinsi" class="hidden lg:table-cell px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('provinsi')">
                Provinsi {{ sortIndicator('provinsi') }}
              </th>
              <th v-if="visibleCols.jumlah_peserta" class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('jumlah_peserta')">
                Peserta {{ sortIndicator('jumlah_peserta') }}
              </th>
              <th v-if="visibleCols.jumlah_kegiatan" class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('jumlah_kegiatan')">
                Kegiatan {{ sortIndicator('jumlah_kegiatan') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr><td :colspan="colCount" class="px-4 py-10 text-center text-gray-400">Memuat data...</td></tr>
            </template>
            <template v-else-if="rows.length === 0">
              <tr><td :colspan="colCount" class="px-4 py-10 text-center text-gray-400">Tidak ada data sekolah</td></tr>
            </template>
            <template v-else>
              <tr v-for="(s, i) in rows" :key="s.npsn || s.nama_sekolah" class="border-t border-gray-100 hover:bg-blue-50/40">
                <td class="px-3 py-2.5 text-gray-700 font-mono text-xs">{{ s.npsn || '-' }}</td>
                <td class="px-3 py-2.5 text-gray-800 font-medium">{{ s.nama_sekolah }}</td>
                <td v-if="visibleCols.kab_kota" class="px-3 py-2.5 text-gray-600">{{ s.kab_kota || '-' }}</td>
                <td v-if="visibleCols.provinsi" class="hidden lg:table-cell px-3 py-2.5 text-gray-600">{{ s.provinsi || '-' }}</td>
                <td v-if="visibleCols.jumlah_peserta" class="px-3 py-2.5 text-gray-700">{{ s.jumlah_peserta }}</td>
                <td v-if="visibleCols.jumlah_kegiatan" class="px-3 py-2.5 text-gray-700">{{ s.jumlah_kegiatan }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
        <p class="text-xs text-gray-500">
          Menampilkan {{ rows.length ? (meta.current_page - 1) * meta.per_page + 1 : 0 }}-{{ Math.min(meta.current_page * meta.per_page, meta.total) }} dari {{ meta.total }} sekolah
        </p>
        <div class="flex items-center gap-1">
          <button @click="goPage(meta.current_page - 1)" :disabled="meta.current_page <= 1 || loading"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50">Sebelumnya</button>
          <button v-for="p in pageWindow" :key="p" @click="goPage(p)"
            :class="p === meta.current_page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-300">{{ p }}</button>
          <button @click="goPage(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page || loading"
            class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50">Berikutnya</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { fetchAPI } from '@/services/api'

const rows = ref([])
const loading = ref(false)
const meta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const search = ref('')
const sortBy = ref('nama_sekolah')
const sortDir = ref('asc')
const showCols = ref(false)

const colLabels = {
  kab_kota: 'Kabupaten/Kota',
  provinsi: 'Provinsi',
  jumlah_peserta: 'Jumlah Peserta',
  jumlah_kegiatan: 'Jumlah Kegiatan'
}
const visibleCols = ref({ kab_kota: true, provinsi: false, jumlah_peserta: true, jumlah_kegiatan: false })

const colCount = computed(() => 2 + Object.values(visibleCols.value).filter(Boolean).length)

const pageWindow = computed(() => {
  const cur = meta.value.current_page
  const last = meta.value.last_page
  const start = Math.max(1, Math.min(cur - 2, last - 4))
  const end = Math.min(last, start + 4)
  const out = []
  for (let p = start; p <= end; p++) out.push(p)
  return out
})

const fetchData = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(meta.value.current_page),
      per_page: String(meta.value.per_page),
      sort_by: sortBy.value,
      sort_dir: sortDir.value
    })
    if (search.value.trim()) params.set('q', search.value.trim())
    const response = await fetchAPI(`sekolah?${params.toString()}`, { raw: true })
    rows.value = Array.isArray(response?.data) ? response.data : []
    if (response?.meta) meta.value = { ...meta.value, ...response.meta }
  } catch (e) {
    console.error('[DaftarSekolah] gagal memuat:', e)
    rows.value = []
  } finally {
    loading.value = false
  }
}

const goPage = (p) => {
  if (p < 1 || p > meta.value.last_page || p === meta.value.current_page || loading.value) return
  meta.value.current_page = p
  fetchData()
}

const setSort = (col) => {
  if (sortBy.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = col
    sortDir.value = 'asc'
  }
  meta.value.current_page = 1
  fetchData()
}

const sortIndicator = (col) => (sortBy.value === col ? (sortDir.value === 'asc' ? '▲' : '▼') : '')

let searchTimer = null
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    meta.value.current_page = 1
    fetchData()
  }, 400)
})

onMounted(fetchData)
</script>
