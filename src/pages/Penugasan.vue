<template>
  <div class="p-6 bg-slate-50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Data Penugasan Pegawai</h1>
        <p class="text-sm text-slate-500">Lihat, filter, dan ekspor data penugasan pegawai.</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="exportExcel" class="btn-primary px-4 py-2 text-white rounded">Export Excel</button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <input v-model="filters.search" @input="debouncedLoad" type="text" placeholder="Cari nama pegawai atau kegiatan"
            class="w-full px-3 py-2 border rounded" />
        </div>
        <!-- <div>
          <select v-model="filters.kabupaten_kota" class="w-full px-3 py-2 border rounded bg-white">
            <option value="">Semua Kabupaten/Kota</option>
            <option v-for="k in kabOptions" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>
        <div>
          <input v-model="filters.tanggal_mulai" type="date" class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <input v-model="filters.tanggal_selesai" type="date" class="w-full px-3 py-2 border rounded" />
        </div> -->
      </div>
      <div class="flex items-center gap-2 mt-3">
        <select v-model.number="pagination.per_page" @change="loadData" class="px-3 py-2 border rounded bg-white">
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        <button @click="loadData" class="px-3 py-2 border rounded bg-slate-100">Terapkan</button>
        <button @click="resetFilters" class="px-3 py-2 border rounded bg-white">Reset</button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Pegawai</th>
            <th class="px-4 py-2 text-left">Kegiatan</th>
            <th class="px-4 py-2 text-left">Peran</th>
            <th class="px-4 py-2 text-left">Tanggal</th>
            <th class="px-4 py-2 text-left">Kab/Kota</th>
            <th class="px-4 py-2 text-left">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="7" class="p-4 text-center">Memuat...</td>
          </tr>
          <tr v-for="(row, idx) in rows" :key="row.id || idx" class="border-t">
            <td class="px-4 py-2">{{ (pagination.current_page - 1) * pagination.per_page + idx + 1 }}</td>
            <td class="px-4 py-2">{{ row.nama_pegawai || row.pegawai?.nama || '-' }}</td>
            <td class="px-4 py-2">{{ row.nama_kegiatan || row.kegiatan?.nama_kegiatan || '-' }}</td>
            <td class="px-4 py-2">{{ row.peran || '-' }}</td>
            <td class="px-4 py-2">{{ formatDate(row.tanggal_mulai) }} - {{ formatDate(row.tanggal_selesai) }}</td>
            <td class="px-4 py-2">{{ row.kabupaten_kota || row.kab_kota || '-' }}</td>
            <td class="px-4 py-2">{{ row.lokasi || row.kegiatan?.lokasi || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div class="p-4 flex items-center justify-between">
        <div>
          Menampilkan {{ pagination.from }} - {{ pagination.to }} dari {{ pagination.total }}
        </div>
        <div class="flex items-center gap-2">
          <button :disabled="pagination.current_page <= 1" @click="changePage(pagination.current_page - 1)" class="px-3 py-1 border rounded">Prev</button>
          <span>Halaman {{ pagination.current_page }} / {{ pagination.last_page }}</span>
          <button :disabled="pagination.current_page >= pagination.last_page" @click="changePage(pagination.current_page + 1)" class="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Spinner from '@/components/Spinner.vue'
import { fetchAPI } from '@/services/api'
import * as XLSX from 'xlsx'

function debounce(fn, wait = 300) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), wait)
  }
}

export default {
  name: 'Penugasan',
  components: { Spinner },
  setup() {
    const rows = ref([])
    const isLoading = ref(false)
    const kabOptions = ref([
      'Kabupaten Lombok Barat',
      'Kabupaten Lombok Tengah',
      'Kabupaten Lombok Timur',
      'Kabupaten Lombok Utara',
      'Kabupaten Sumbawa',
      'Kabupaten Sumbawa Barat',
      'Kabupaten Dompu',
      'Kabupaten Bima',
      'Kota Mataram',
      'Kota Bima'
    ])

    const filters = ref({
      search: '',
      kabupaten_kota: '',
      tanggal_mulai: '',
      tanggal_selesai: ''
    })

    const pagination = ref({
      total: 0,
      per_page: 15,
      current_page: 1,
      last_page: 1,
      from: 0,
      to: 0
    })

    const loadData = async () => {
      isLoading.value = true
      try {
        const params = {
          per_page: pagination.value.per_page,
          page: pagination.value.current_page,
          search: filters.value.search || undefined,
          kabupaten_kota: filters.value.kabupaten_kota || undefined,
          tanggal_mulai: filters.value.tanggal_mulai || undefined,
          tanggal_selesai: filters.value.tanggal_selesai || undefined
        }

        const res = await fetchAPI('penugasan-pegawai-detailed', { params, raw: true })
        // res expected to have data and pagination
        rows.value = Array.isArray(res.data) ? res.data : (res || [])
        pagination.value = {
          total: res.pagination?.total || 0,
          per_page: res.pagination?.per_page || pagination.value.per_page,
          current_page: res.pagination?.current_page || 1,
          last_page: res.pagination?.last_page || 1,
          from: res.pagination?.from || 0,
          to: res.pagination?.to || 0
        }
      } catch (err) {
        console.error('Failed to load penugasan:', err)
        rows.value = []
      } finally {
        isLoading.value = false
      }
    }

    const debouncedLoad = debounce(() => {
      pagination.value.current_page = 1
      loadData()
    }, 400)

    const changePage = (page) => {
      pagination.value.current_page = page
      loadData()
    }

    const resetFilters = () => {
      filters.value = { search: '', kabupaten_kota: '', tanggal_mulai: '', tanggal_selesai: '' }
      pagination.value.current_page = 1
      loadData()
    }

    const formatDate = (d) => {
      if (!d) return '-'
      try {
        const dt = new Date(d)
        return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      } catch {
        return d
      }
    }

    const exportExcel = () => {
      if (!rows.value || rows.value.length === 0) {
        alert('Tidak ada data untuk diekspor')
        return
      }

      const mapped = rows.value.map((r) => ({
        ID: r.id || r.id_penugasan || '',
        ID_Kegiatan: r.id_kegiatan || '',
        Nama_Kegiatan: r.nama_kegiatan || r.kegiatan?.nama_kegiatan || '',
        ID_Pegawai: r.id_pegawai || '',
        Nama_Pegawai: r.nama_pegawai || r.pegawai?.nama || '',
        Peran: r.peran || '',
        Tanggal_Mulai: r.tanggal_mulai || '',
        Tanggal_Selesai: r.tanggal_selesai || '',
        Kabupaten_Kota: r.kabupaten_kota || r.kab_kota || '',
        Lokasi: r.lokasi || r.kegiatan?.lokasi || ''
      }))

      const ws = XLSX.utils.json_to_sheet(mapped)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Penugasan')
      const filename = `penugasan_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`
      XLSX.writeFile(wb, filename)
    }

    onMounted(() => {
      loadData()
    })

    return {
      rows,
      isLoading,
      filters,
      kabOptions,
      pagination,
      loadData,
      debouncedLoad,
      changePage,
      resetFilters,
      formatDate,
      exportExcel
    }
  }
}
</script>

<style scoped>
.btn-primary { background: linear-gradient(90deg,#2563eb,#1e40af); }
</style>
