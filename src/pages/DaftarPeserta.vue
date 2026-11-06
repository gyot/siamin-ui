<template>
  <div class="space-y-4">
    <!-- Header + Kontrol -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800">Daftar Peserta</h1>
        <p class="text-sm text-gray-500">Data peserta keseluruhan dari seluruh kegiatan (satu baris per keikutsertaan)</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model="search" type="text" placeholder="Cari nama / NIP / instansi / NPSN / kegiatan..."
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-72"
        />
        <div class="relative">
          <button @click="showCols = !showCols"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            ⚙ Kelola Kolom
          </button>
          <div v-if="showCols" class="absolute right-0 z-20 mt-1 w-64 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-3 space-y-2">
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
              <th class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('nama_lengkap')">
                Nama {{ sortIndicator('nama_lengkap') }}
              </th>
              <th v-if="visibleCols.nip" class="hidden md:table-cell px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('nip')">
                NIP {{ sortIndicator('nip') }}
              </th>
              <th class="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('nama_instansi')">
                Instansi {{ sortIndicator('nama_instansi') }}
              </th>
              <th class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('npsn')">
                NPSN {{ sortIndicator('npsn') }}
              </th>
              <th v-if="visibleCols.kab_kota" class="hidden lg:table-cell px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('kab_kota')">
                Kab/Kota {{ sortIndicator('kab_kota') }}
              </th>
              <th class="px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort('nama_kegiatan')">
                Kegiatan {{ sortIndicator('nama_kegiatan') }}
              </th>
              <th v-for="(vis, key) in extraCols" :key="key" v-show="vis"
                class="hidden xl:table-cell px-3 py-3 text-left text-xs font-semibold cursor-pointer select-none hover:bg-blue-700/40" @click="setSort(key)">
                {{ colLabels[key] }} {{ sortIndicator(key) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr><td :colspan="colCount" class="px-4 py-10 text-center text-gray-400">Memuat data...</td></tr>
            </template>
            <template v-else-if="rows.length === 0">
              <tr><td :colspan="colCount" class="px-4 py-10 text-center text-gray-400">Tidak ada data peserta</td></tr>
            </template>
            <template v-else>
              <tr v-for="(p, i) in rows" :key="p.id_peserta" class="border-t border-gray-100 hover:bg-blue-50/40">
                <td class="px-3 py-2.5 text-gray-800 font-medium">{{ p.nama_lengkap }}</td>
                <td v-if="visibleCols.nip" class="hidden md:table-cell px-3 py-2.5 text-gray-600 text-xs">{{ p.nip || '-' }}</td>
                <td class="hidden sm:table-cell px-3 py-2.5 text-gray-600">{{ p.nama_instansi || '-' }}</td>
                <td class="px-3 py-2.5 text-gray-700 font-mono text-xs">{{ p.npsn || '-' }}</td>
                <td v-if="visibleCols.kab_kota" class="hidden lg:table-cell px-3 py-2.5 text-gray-600">{{ p.kab_kota || '-' }}</td>
                <td class="px-3 py-2.5 text-gray-600">{{ p.nama_kegiatan || '-' }}</td>
                <td v-for="(vis, key) in extraCols" :key="key" v-show="vis" class="hidden xl:table-cell px-3 py-2.5 text-gray-600">
                  {{ formatCell(p[key]) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
        <p class="text-xs text-gray-500">
          Menampilkan {{ rows.length ? (meta.current_page - 1) * meta.per_page + 1 : 0 }}-{{ Math.min(meta.current_page * meta.per_page, meta.total) }} dari {{ meta.total }} peserta
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
const sortBy = ref('nama_lengkap')
const sortDir = ref('asc')
const showCols = ref(false)

const colLabels = {
  nip: 'NIP',
  kab_kota: 'Kabupaten/Kota',
  pangkat: 'Pangkat',
  gol: 'Golongan',
  jabatan: 'Jabatan',
  no_hp: 'No. HP',
  email: 'Email',
  npwp_nik: 'NPWP/NIK',
  tempat_lahir: 'Tempat Lahir',
  tanggal_lahir: 'Tanggal Lahir',
  jenis_kelamin: 'Jenis Kelamin',
  alamat_instansi: 'Alamat Instansi',
  provinsi: 'Provinsi',
  telp_instansi: 'Telp Instansi',
  email_instansi: 'Email Instansi',
  peran: 'Peran',
  no_surat_tugas: 'No. Surat Tugas',
  tanggal_surat_tugas: 'Tgl Surat Tugas'
}

const visibleCols = ref({
  nip: true,
  kab_kota: true,
  pangkat: false,
  gol: false,
  jabatan: false,
  no_hp: false,
  email: false,
  npwp_nik: false,
  tempat_lahir: false,
  tanggal_lahir: false,
  jenis_kelamin: false,
  alamat_instansi: false,
  provinsi: false,
  telp_instansi: false,
  email_instansi: false,
  peran: false,
  no_surat_tugas: false,
  tanggal_surat_tugas: false
})

// kolom tambahan (non-inti) yang dirender sebagai kolom lanjutan
const extraCols = computed(() => {
  const { nip, kab_kota, ...rest } = visibleCols.value
  return rest
})

const colCount = computed(() => 4 + Object.values(visibleCols.value).filter(Boolean).length)

const pageWindow = computed(() => {
  const cur = meta.value.current_page
  const last = meta.value.last_page
  const start = Math.max(1, Math.min(cur - 2, last - 4))
  const end = Math.min(last, start + 4)
  const out = []
  for (let p = start; p <= end; p++) out.push(p)
  return out
})

const formatCell = (v) => {
  if (v === null || v === undefined || v === '') return '-'
  return String(v)
}

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
    const response = await fetchAPI(`peserta-all?${params.toString()}`, { raw: true })
    rows.value = Array.isArray(response?.data) ? response.data : []
    if (response?.meta) meta.value = { ...meta.value, ...response.meta }
  } catch (e) {
    console.error('[DaftarPeserta] gagal memuat:', e)
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
