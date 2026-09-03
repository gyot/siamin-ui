<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Manajemen Sertifikat</h1>
      <p class="text-slate-500">Kelola status penerbitan sertifikat peserta</p>
    </div>

    <div v-if="showApiError" class="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-900 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="font-semibold">Peringatan koneksi</p>
          <p class="text-sm mt-1">{{ apiErrorMessage }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="reloadData" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">Muat ulang</button>
          <button @click="showApiError = false" class="px-4 py-2 bg-white border border-yellow-300 text-yellow-900 rounded-lg hover:bg-yellow-100 text-sm">Tutup</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="mb-6 p-4 flex items-center justify-center bg-white rounded-lg shadow-md">
      <div class="flex items-center gap-3">
        <div class="animate-spin">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </div>
        <p class="text-sm text-gray-600">Memuat data sertifikat...</p>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-600 mb-1">Total</p>
        <p class="text-3xl font-bold text-blue-600">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-600 mb-1">Draft</p>
        <p class="text-3xl font-bold text-yellow-600">{{ stats.draft }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-600 mb-1">Terbit</p>
        <p class="text-3xl font-bold text-green-600">{{ stats.terbit }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <p class="text-sm text-gray-600 mb-1">Dicabut</p>
        <p class="text-3xl font-bold text-red-600">{{ stats.dicabut }}</p>
      </div>
    </div>

    <div class="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cari Peserta</label>
          <input v-model="searchQuery" type="text" placeholder="Nama atau NIP..."
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
          <select v-model="filterKegiatan"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Semua Kegiatan</option>
            <option v-for="k in kegiatanList" :key="k.id_kegiatan" :value="k.id_kegiatan">{{ k.nama_kegiatan }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status Sertifikat</label>
          <select v-model="filterStatus"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="terbit">Terbit</option>
            <option value="dicabut">Dicabut</option>
            <option value="belum_ada">Belum Ada</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Per Halaman</label>
          <select v-model.number="pageSize"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="selectedIds.length > 0" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3">
      <span class="text-sm font-medium text-indigo-800">{{ selectedIds.length }} peserta dipilih</span>
      <button @click="bulkChangeStatus('terbit')" class="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">Terbitkan Terpilih</button>
      <button @click="bulkChangeStatus('draft')" class="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-semibold hover:bg-yellow-700">Set Draft</button>
      <button @click="bulkChangeStatus('dicabut')" class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">Cabut Terpilih</button>
      <button @click="selectedIds = []" class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300">Batal Pilih</button>
    </div>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden hidden md:block">
      <div class="overflow-x-auto">
        <table class="min-w-[900px] w-full text-sm">
          <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
            <tr>
              <th class="px-4 py-3 text-left">
                <input type="checkbox" :checked="allChecked" @change="toggleAll" class="h-4 w-4 rounded border-gray-300" />
              </th>
              <th class="px-4 py-3 text-left text-xs">No</th>
              <th class="px-4 py-3 text-left text-xs cursor-pointer select-none hover:bg-blue-700/30" @click="setSort('nama_lengkap')">Nama{{ sortInd('nama_lengkap') }}</th>
              <th class="px-4 py-3 text-left text-xs cursor-pointer select-none hover:bg-blue-700/30" @click="setSort('nip')">NIP{{ sortInd('nip') }}</th>
              <th class="px-4 py-3 text-left text-xs">Kegiatan</th>
              <th class="px-4 py-3 text-left text-xs">No. Sertifikat</th>
              <th class="px-4 py-3 text-left text-xs cursor-pointer select-none hover:bg-blue-700/30" @click="setSort('status')">Status{{ sortInd('status') }}</th>
              <th class="px-4 py-3 text-center text-xs">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="paginatedList.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-500">Tidak ada data sertifikat</td>
            </tr>
            <tr v-for="(row, index) in paginatedList" :key="row.id_peserta" class="hover:bg-blue-50 transition-colors">
              <td class="px-4 py-3">
                <input type="checkbox" v-model="selectedIds" :value="row.id_peserta" class="h-4 w-4 rounded border-gray-300" />
              </td>
              <td class="px-4 py-3 text-xs text-gray-900">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="px-4 py-3 text-xs font-medium text-gray-900">{{ row.nama_lengkap }}</td>
              <td class="px-4 py-3 text-xs text-gray-600">{{ row.nip || '-' }}</td>
              <td class="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">{{ row.nama_kegiatan }}</td>
              <td class="px-4 py-3 text-xs text-gray-600">{{ row.nomor_sertifikat || '-' }}</td>
              <td class="px-4 py-3">
                <span :class="badgeClass(row.status)" class="text-xs">{{ statusLabel(row.status) }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-1 justify-center flex-wrap">
                  <button v-if="row.status !== 'terbit'" @click="changeStatus(row, 'terbit')"
                    class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold whitespace-nowrap">
                    Terbitkan
                  </button>
                  <button v-if="row.status !== 'draft'" @click="changeStatus(row, 'draft')"
                    class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs font-semibold whitespace-nowrap">
                    Draft
                  </button>
                  <button v-if="row.status !== 'dicabut'" @click="changeStatus(row, 'dicabut')"
                    class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold whitespace-nowrap">
                    Cabut
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="md:hidden space-y-3">
      <div v-if="paginatedList.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Tidak ada data sertifikat
      </div>
      <div v-for="(row, index) in paginatedList" :key="row.id_peserta"
        class="bg-white rounded-lg shadow-md p-4 space-y-2 border-l-4"
        :class="borderColor(row.status)">
        <div class="flex justify-between items-start gap-2">
          <div class="flex items-start gap-2">
            <input type="checkbox" v-model="selectedIds" :value="row.id_peserta" class="mt-0.5 h-4 w-4 rounded border-gray-300" />
            <div>
              <p class="text-sm font-medium text-gray-900">{{ (currentPage - 1) * pageSize + index + 1 }}. {{ row.nama_lengkap }}</p>
              <p class="text-xs text-gray-500">{{ row.nip || '-' }}</p>
            </div>
          </div>
          <span :class="badgeClass(row.status)" class="text-xs whitespace-nowrap">{{ statusLabel(row.status) }}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs pb-2 border-b border-gray-200">
          <div>
            <p class="text-gray-500">Kegiatan</p>
            <p class="font-semibold text-gray-900 truncate">{{ row.nama_kegiatan }}</p>
          </div>
          <div>
            <p class="text-gray-500">No. Sertifikat</p>
            <p class="font-semibold text-gray-900">{{ row.nomor_sertifikat || '-' }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 pt-2">
          <button v-if="row.status !== 'terbit'" @click="changeStatus(row, 'terbit')"
            class="flex-1 px-3 py-2 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600">Terbitkan</button>
          <button v-if="row.status !== 'draft'" @click="changeStatus(row, 'draft')"
            class="flex-1 px-3 py-2 bg-yellow-500 text-white rounded text-xs font-semibold hover:bg-yellow-600">Draft</button>
          <button v-if="row.status !== 'dicabut'" @click="changeStatus(row, 'dicabut')"
            class="flex-1 px-3 py-2 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600">Cabut</button>
        </div>
      </div>
    </div>

    <div class="mt-4 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg shadow-sm">
      <p class="text-sm text-gray-600">
        Menampilkan <span class="font-semibold text-gray-900">{{ pageStart }}</span>-<span class="font-semibold text-gray-900">{{ pageEnd }}</span>
        dari <span class="font-semibold text-gray-900">{{ filteredList.length }}</span> data
      </p>
      <div class="flex items-center gap-2">
        <button @click="currentPage--" :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
        <span class="text-sm text-gray-600">Halaman {{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Berikutnya</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { fetchAPI, updateAPI } from '@/services/api'
import { ActivityEvents } from '@/services/activityLogger'
import Swal from 'sweetalert2'

export default {
  name: 'Sertifikat',
  setup() {
    const isLoading = ref(false)
    const showApiError = ref(false)
    const apiErrorMessage = ref('')
    const pesertaList = ref([])
    const sertifikatList = ref([])
    const kegiatanList = ref([])

    const searchQuery = ref('')
    const filterKegiatan = ref('')
    const filterStatus = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const sortBy = ref('nama_lengkap')
    const sortOrder = ref('asc')
    const selectedIds = ref([])

    const statusLabels = { draft: 'Draft', terbit: 'Terbit', dicabut: 'Dicabut', belum_ada: 'Belum Ada' }

    const statusLabel = (s) => statusLabels[s] || statusLabels.belum_ada

    const badgeClass = (s) => {
      const base = 'inline-block px-3 py-1 rounded-full text-xs font-semibold'
      const map = {
        draft: `${base} bg-yellow-100 text-yellow-800`,
        terbit: `${base} bg-green-100 text-green-800`,
        dicabut: `${base} bg-red-100 text-red-800`,
        belum_ada: `${base} bg-gray-100 text-gray-700`
      }
      return map[s] || map.belum_ada
    }

    const borderColor = (s) => {
      const map = { draft: 'border-yellow-500', terbit: 'border-green-500', dicabut: 'border-red-500', belum_ada: 'border-gray-400' }
      return map[s] || map.belum_ada
    }

    const getSertifikatRecord = (idPeserta) => {
      return sertifikatList.value.find(s =>
        String(s.id_peserta ?? s.peserta?.id_peserta ?? '') === String(idPeserta)
      )
    }

    const getRawStatus = (idPeserta) => {
      const record = getSertifikatRecord(idPeserta)
      const status = record?.status_sertifikat || record?.status
      return ['draft', 'terbit', 'dicabut'].includes(status) ? status : 'belum_ada'
    }

    const mergedList = computed(() => {
      return pesertaList.value.map(p => {
        const record = getSertifikatRecord(p.id_peserta)
        const keg = kegiatanList.value.find(k => String(k.id_kegiatan ?? k.id ?? '') === String(p.id_kegiatan))
        return {
          id_peserta: p.id_peserta,
          nama_lengkap: p.nama_lengkap || '',
          nip: p.nip || '',
          id_kegiatan: p.id_kegiatan,
          nama_kegiatan: keg?.nama_kegiatan || p.nama_kegiatan || '-',
          nomor_sertifikat: record?.nomor_sertifikat || '',
          id_sertifikat: record?.id_sertifikat || record?.id || null,
          status: getRawStatus(p.id_peserta)
        }
      })
    })

    const filteredList = computed(() => {
      let list = mergedList.value

      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(r => r.nama_lengkap.toLowerCase().includes(q) || (r.nip || '').toLowerCase().includes(q))
      }
      if (filterKegiatan.value) {
        list = list.filter(r => String(r.id_kegiatan) === String(filterKegiatan.value))
      }
      if (filterStatus.value) {
        list = list.filter(r => r.status === filterStatus.value)
      }

      const dir = sortOrder.value === 'asc' ? 1 : -1
      const key = sortBy.value
      list = [...list].sort((a, b) => {
        const va = String(a[key] || '').toLowerCase()
        const vb = String(b[key] || '').toLowerCase()
        return va < vb ? -dir : va > vb ? dir : 0
      })

      return list
    })

    const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / pageSize.value)))
    const pageStart = computed(() => filteredList.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
    const pageEnd = computed(() => Math.min(currentPage.value * pageSize.value, filteredList.value.length))

    const paginatedList = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return filteredList.value.slice(start, start + pageSize.value)
    })

    const allChecked = computed(() => {
      if (paginatedList.value.length === 0) return false
      return paginatedList.value.every(r => selectedIds.value.includes(r.id_peserta))
    })

    const toggleAll = () => {
      if (allChecked.value) {
        const pageIds = paginatedList.value.map(r => r.id_peserta)
        selectedIds.value = selectedIds.value.filter(id => !pageIds.includes(id))
      } else {
        const pageIds = paginatedList.value.map(r => r.id_peserta)
        const newIds = pageIds.filter(id => !selectedIds.value.includes(id))
        selectedIds.value = [...selectedIds.value, ...newIds]
      }
    }

    const stats = computed(() => {
      const s = { total: filteredList.value.length, draft: 0, terbit: 0, dicabut: 0 }
      filteredList.value.forEach(r => {
        if (s[r.status] !== undefined) s[r.status]++
      })
      return s
    })

    const setSort = (key) => {
      if (sortBy.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortBy.value = key
        sortOrder.value = 'asc'
      }
    }

    const sortInd = (key) => {
      if (sortBy.value !== key) return ''
      return sortOrder.value === 'asc' ? ' ▲' : ' ▼'
    }

    watch([searchQuery, filterKegiatan, filterStatus, pageSize], () => {
      currentPage.value = 1
    })

    const setApiError = (msg) => {
      apiErrorMessage.value = msg || 'Terjadi kesalahan.'
      showApiError.value = true
    }

    const loadKegiatan = async () => {
      try {
        const data = await fetchAPI('kegiatan/all')
        kegiatanList.value = Array.isArray(data) ? data : (data?.data || [])
      } catch {
        kegiatanList.value = []
      }
    }

    const loadPeserta = async () => {
      try {
        const data = await fetchAPI('peserta')
        pesertaList.value = Array.isArray(data) ? data : (data?.data || data?.peserta || [])
      } catch (e) {
        setApiError(e.message || 'Gagal memuat data peserta.')
        pesertaList.value = []
      }
    }

    const loadSertifikat = async () => {
      try {
        const data = await fetchAPI('sertifikat')
        sertifikatList.value = Array.isArray(data) ? data : (data?.data || [])
      } catch {
        sertifikatList.value = []
      }
    }

    const loadData = async () => {
      isLoading.value = true
      showApiError.value = false
      try {
        await Promise.all([loadKegiatan(), loadPeserta(), loadSertifikat()])
      } catch (e) {
        setApiError(e.message)
      } finally {
        isLoading.value = false
      }
    }

    const reloadData = () => {
      loadData()
    }

    const changeStatus = async (row, newStatus) => {
      const confirmText = {
        terbit: `Terbitkan sertifikat untuk <strong>${row.nama_lengkap}</strong>?<br><small>Status akan berubah dari "${statusLabel(row.status)}" menjadi "Terbit".</small>`,
        draft: `Kembalikan sertifikat <strong>${row.nama_lengkap}</strong> ke Draft?<br><small>Status akan berubah dari "${statusLabel(row.status)}" menjadi "Draft".</small>`,
        dicabut: `Cabut sertifikat <strong>${row.nama_lengkap}</strong>?<br><small>Status akan berubah dari "${statusLabel(row.status)}" menjadi "Dicabut". Tindakan ini dapat dikembalikan.</small>`
      }

      const result = await Swal.fire({
        title: 'Ubah Status Sertifikat',
        html: confirmText[newStatus] || `Ubah status ke "${statusLabel(newStatus)}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Ubah',
        cancelButtonText: 'Batal',
        confirmButtonColor: newStatus === 'dicabut' ? '#dc2626' : newStatus === 'terbit' ? '#16a34a' : '#ca8a04'
      })

      if (!result.isConfirmed) return

      try {
        if (row.id_sertifikat) {
          await updateAPI('sertifikat', row.id_sertifikat, { status: newStatus })
        } else {
          await fetchAPI('sertifikat/update-status', {
            method: 'PATCH',
            body: { id_peserta: row.id_peserta, id_kegiatan: row.id_kegiatan, status: newStatus }
          })
        }

        ActivityEvents.ACCESS_PAGE(`Ubah status sertifikat ${row.nama_lengkap} → ${newStatus}`)
        await loadSertifikat()
        await Swal.fire('Berhasil', `Status sertifikat ${row.nama_lengkap} berhasil diubah ke "${statusLabel(newStatus)}".`, 'success')
      } catch (e) {
        await Swal.fire('Gagal', e.message || 'Gagal mengubah status sertifikat.', 'error')
      }
    }

    const bulkChangeStatus = async (newStatus) => {
      const count = selectedIds.value.length
      if (count === 0) return

      const result = await Swal.fire({
        title: 'Ubah Status Massal',
        html: `Ubah status <strong>${count} sertifikat</strong> ke <strong>"${statusLabel(newStatus)}"</strong>?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Ubah Semua',
        cancelButtonText: 'Batal',
        confirmButtonColor: newStatus === 'dicabut' ? '#dc2626' : newStatus === 'terbit' ? '#16a34a' : '#ca8a04'
      })

      if (!result.isConfirmed) return

      let successCount = 0
      let failCount = 0
      const errors = []

      const progressColor = newStatus === 'dicabut' ? '#dc2626' : newStatus === 'terbit' ? '#16a34a' : '#ca8a04'
      const ids = [...selectedIds.value]

      const swalPromise = Swal.fire({
        title: 'Mengubah Status...',
        html: `
          <div id="bulk-progress-info" style="margin-bottom:12px;font-size:14px;color:#64748b;">Menyiapkan...</div>
          <div style="background:#e2e8f0;border-radius:9999px;height:24px;overflow:hidden;margin:0 16px;">
            <div id="bulk-progress-bar" style="background:${progressColor};height:100%;width:0%;transition:width 0.3s ease;border-radius:9999px;"></div>
          </div>
          <div id="bulk-progress-count" style="margin-top:8px;font-size:20px;font-weight:700;color:#1e293b;">0 / ${count}</div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
      })

      await new Promise(r => setTimeout(r, 300))

      for (let i = 0; i < ids.length; i++) {
        const idPeserta = ids[i]
        const row = mergedList.value.find(r => String(r.id_peserta) === String(idPeserta))
        const current = i + 1
        const pct = Math.round((current / count) * 100)

        const infoEl = document.getElementById('bulk-progress-info')
        const barEl = document.getElementById('bulk-progress-bar')
        const countEl = document.getElementById('bulk-progress-count')
        if (infoEl) infoEl.textContent = row ? row.nama_lengkap : `ID ${idPeserta}`
        if (barEl) barEl.style.width = `${pct}%`
        if (countEl) countEl.textContent = `${current} / ${count}`

        if (!row) {
          failCount++
          errors.push(`ID peserta ${idPeserta} tidak ditemukan`)
          continue
        }

        try {
          if (row.id_sertifikat) {
            await updateAPI('sertifikat', row.id_sertifikat, { status: newStatus })
          } else {
            await fetchAPI('sertifikat/update-status', {
              method: 'PATCH',
              body: { id_peserta: row.id_peserta, id_kegiatan: row.id_kegiatan, status: newStatus }
            })
          }
          successCount++
        } catch (e) {
          failCount++
          errors.push(`${row.nama_lengkap}: ${e.message || 'gagal'}`)
        }

        if (i < ids.length - 1) {
          await new Promise(r => setTimeout(r, 5000))
        }
      }

      selectedIds.value = []
      await loadSertifikat()

      Swal.close()

      if (failCount === 0) {
        await Swal.fire('Berhasil', `${successCount} sertifikat berhasil diubah ke "${statusLabel(newStatus)}".`, 'success')
      } else {
        const detail = errors.length > 0 ? `<div class="text-left text-sm mt-2"><ul class="list-disc pl-4">${errors.slice(0, 5).map(e => `<li>${e}</li>`).join('')}</ul>${errors.length > 5 ? `<p class="mt-1 text-gray-500">...dan ${errors.length - 5} error lainnya</p>` : ''}</div>` : ''
        await Swal.fire({
          title: 'Selesai',
          html: `${successCount} berhasil, ${failCount} gagal.${detail}`,
          icon: failCount > 0 ? 'warning' : 'success'
        })
      }
    }

    onMounted(() => {
      ActivityEvents.ACCESS_PAGE('Manajemen Sertifikat')
      loadData()
    })

    return {
      isLoading, showApiError, apiErrorMessage,
      kegiatanList, searchQuery, filterKegiatan, filterStatus,
      currentPage, pageSize, selectedIds,
      stats, filteredList, paginatedList, totalPages, pageStart, pageEnd,
      allChecked, toggleAll,
      statusLabel, badgeClass, borderColor,
      setSort, sortInd,
      changeStatus, bulkChangeStatus, reloadData
    }
  }
}
</script>
