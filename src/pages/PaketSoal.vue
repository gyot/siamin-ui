<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Manajemen Paket Soal</h1>
        <p class="text-slate-500 text-sm">Kelola paket soal dan soal ujian</p>
      </div>
      <button @click="openCreateModal" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        Tambah Paket Soal
      </button>
    </div>

    <!-- Alert -->
    <div v-if="alert.show" :class="['mb-4 p-4 rounded-lg text-sm font-medium', alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200']">
      {{ alert.message }}
    </div>

    <!-- List Mode -->
    <div v-if="!selectedPaket" class="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div class="p-4 border-b border-slate-100">
        <input v-model="searchQuery" @input="debouncedSearch" type="text" placeholder="Cari paket soal..." class="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-3 px-4 font-semibold text-slate-600">Nama Paket</th>
              <th class="text-center py-3 px-4 font-semibold text-slate-600">Jumlah Soal</th>
              <th class="text-center py-3 px-4 font-semibold text-slate-600">Digunakan</th>
              <th class="text-center py-3 px-4 font-semibold text-slate-600">Status</th>
              <th class="text-center py-3 px-4 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="py-8 text-center text-slate-400">Memuat data...</td>
            </tr>
            <tr v-else-if="paketList.length === 0">
              <td colspan="5" class="py-8 text-center text-slate-400">Belum ada paket soal</td>
            </tr>
            <tr v-for="p in paketList" :key="p.id_paket_soal" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="py-3 px-4">
                <button @click="openSoalEditor(p)" class="font-medium text-blue-600 hover:text-blue-800 hover:underline">{{ p.nama_paket }}</button>
              </td>
              <td class="py-3 px-4 text-center">{{ p.soals_count }}</td>
              <td class="py-3 px-4 text-center text-xs text-slate-500">{{ (p.kegiatans?.length ?? 0) }} kegiatan</td>
              <td class="py-3 px-4 text-center">
                <span :class="['text-xs px-2 py-1 rounded-full font-medium', p.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                  {{ p.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(p)" class="text-amber-600 hover:text-amber-800 text-xs font-medium px-2 py-1 rounded hover:bg-amber-50">Edit</button>
                  <button @click="confirmDelete(p)" class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Soal Editor Mode -->
    <div v-if="selectedPaket" class="space-y-6">
      <div class="flex items-center gap-3 mb-2">
        <button @click="closeSoalEditor" class="text-slate-400 hover:text-slate-600 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 class="text-xl font-bold text-slate-800">{{ selectedPaket.nama_paket }}</h2>
          <p class="text-slate-500 text-sm">{{ selectedPaket.deskripsi || 'Kelola soal dalam paket ini' }}</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
        <button @click="openAddSoalModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Tambah Soal Manual
        </button>
        <label class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          Import Excel
          <input type="file" accept=".xlsx,.xls,.csv" @change="handleImport" class="hidden" />
        </label>
        <a :href="templateDownloadUrl" download class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Template Excel
        </a>
      </div>

      <!-- Soal List -->
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div class="p-4 border-b border-slate-100">
          <h3 class="font-semibold text-slate-700">Daftar Soal ({{ soalList.length }})</h3>
        </div>
        <div v-if="loadingSoal" class="p-8 text-center text-slate-400">Memuat soal...</div>
        <div v-else-if="soalList.length === 0" class="p-8 text-center text-slate-400">Belum ada soal. Tambahkan manual atau import dari Excel.</div>
        <div v-else class="divide-y divide-slate-100">
          <div v-for="(soal, index) in soalList" :key="soal.id_soal" class="p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-medium text-slate-400">#{{ index + 1 }}</span>
                  <span v-if="editingSoal?.id_soal !== soal.id_soal" class="font-medium text-slate-800">{{ soal.pertanyaan }}</span>
                </div>

                <!-- View Mode -->
                <div v-if="editingSoal?.id_soal !== soal.id_soal" class="ml-6 space-y-1">
                  <p v-for="huruf in ['a', 'b', 'c', 'd']" :key="huruf" :class="['text-sm', soal.jawaban_benar === huruf ? 'text-green-700 font-semibold' : 'text-slate-500']">
                    {{ soal[`pilihan_${huruf}`] }}
                    <span v-if="soal.jawaban_benar === huruf" class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1">✓ Benar</span>
                  </p>
                </div>

                <!-- Edit Mode -->
                <div v-else class="ml-6 space-y-3 mt-2">
                  <div>
                    <label class="text-xs text-slate-500 mb-1 block">Pertanyaan</label>
                    <textarea v-model="editingSoal.pertanyaan" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"></textarea>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div v-for="huruf in ['a', 'b', 'c', 'd']" :key="huruf" class="flex items-center gap-2">
                      <input type="radio" :name="`edit_jawaban_${soal.id_soal}`" :value="huruf" v-model="editingSoal.jawaban_benar" class="accent-green-600" />
                      <input v-model="editingSoal[`pilihan_${huruf}`]" type="text" :placeholder="`Pilihan ${huruf.toUpperCase()}`" class="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button @click="saveEditSoal" class="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Simpan</button>
                    <button @click="cancelEdit" class="px-4 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Batal</button>
                  </div>
                </div>
              </div>

              <div v-if="editingSoal?.id_soal !== soal.id_soal" class="flex items-center gap-1">
                <button @click="startEdit(soal)" class="text-amber-600 hover:text-amber-800 text-xs font-medium px-2 py-1 rounded hover:bg-amber-50">Edit</button>
                <button @click="confirmDeleteSoal(soal)" class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Create/Edit Paket Soal -->
    <div v-if="showPaketModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div class="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 class="text-xl font-bold text-slate-800">{{ editingPaket ? 'Edit Paket Soal' : 'Tambah Paket Soal' }}</h3>
          <button @click="showPaketModal = false" class="text-slate-400 hover:text-slate-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-700 mb-1 block">Nama Paket *</label>
            <input v-model="paketForm.nama_paket" type="text" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" placeholder="Contoh: Paket A - Ujian Akhir" />
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700 mb-1 block">Deskripsi</label>
            <textarea v-model="paketForm.deskripsi" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" placeholder="Deskripsi paket soal (opsional)"></textarea>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="paketForm.is_active" class="accent-blue-600" />
              <span class="text-sm text-slate-700">Aktif</span>
            </label>
          </div>
        </div>
        <div class="flex justify-end gap-3 p-6 border-t border-slate-100">
          <button @click="showPaketModal = false" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Batal</button>
          <button @click="savePaket" :disabled="!paketForm.nama_paket" :class="['px-6 py-2 rounded-lg text-sm font-medium text-white', paketForm.nama_paket ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed']">Simpan</button>
        </div>
      </div>
    </div>

    <!-- Modal: Add Soal Manual -->
    <div v-if="showSoalModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
          <h3 class="text-xl font-bold text-slate-800">Tambah Soal</h3>
          <button @click="showSoalModal = false" class="text-slate-400 hover:text-slate-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="p-6 space-y-6">
          <div v-for="(soal, idx) in newSoalList" :key="idx" class="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-slate-600">Soal {{ idx + 1 }}</span>
              <button v-if="newSoalList.length > 1" @click="newSoalList.splice(idx, 1)" class="text-red-500 hover:text-red-700 text-xs">Hapus</button>
            </div>
            <div class="space-y-3">
              <textarea v-model="soal.pertanyaan" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" placeholder="Pertanyaan *"></textarea>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="huruf in ['a', 'b', 'c', 'd']" :key="huruf" class="flex items-center gap-2">
                  <input type="radio" :name="`new_jawaban_${idx}`" :value="huruf" v-model="soal.jawaban_benar" class="accent-green-600" />
                  <input v-model="soal[`pilihan_${huruf}`]" type="text" :placeholder="`Pilihan ${huruf.toUpperCase()} *`" class="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>
          <button @click="addNewSoalRow" class="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-sm hover:border-blue-400 hover:text-blue-600 transition">
            + Tambah Soal Lagi
          </button>
        </div>
        <div class="flex justify-end gap-3 p-6 border-t border-slate-100 sticky bottom-0 bg-white">
          <button @click="showSoalModal = false" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Batal</button>
          <button @click="saveNewSoal" :disabled="savingSoal" :class="['px-6 py-2 rounded-lg text-sm font-medium text-white', savingSoal ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700']">
            {{ savingSoal ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllPaket, createPaket, updatePaket, removePaket, getSoalList, createSoal, updateSoal, removeSoal, importSoal } from '@/services/test'
import Swal from 'sweetalert2'

export default {
  name: 'PaketSoal',
  data() {
    return {
      loading: false,
      loadingSoal: false,
      savingSoal: false,
      paketList: [],
      soalList: [],
      selectedPaket: null,
      searchQuery: '',
      searchTimeout: null,
      alert: { show: false, type: 'error', message: '' },
      showPaketModal: false,
      editingPaket: null,
      paketForm: { nama_paket: '', deskripsi: '', is_active: true },
      showSoalModal: false,
      newSoalList: [this.emptySoal()],
      editingSoal: null,
    }
  },
  mounted() {
    this.loadPaket()
  },
  computed: {
    templateDownloadUrl() {
      const base = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || '')
      return `${base}/api/v1/test/template`
    },
  },
  methods: {
    emptySoal() {
      return { pertanyaan: '', pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '', jawaban_benar: 'a' }
    },
    async loadPaket() {
      this.loading = true
      try {
        const params = this.searchQuery ? { search: this.searchQuery } : {}
        const data = await getAllPaket(params)
        this.paketList = Array.isArray(data) ? data : (data?.data || [])
      } catch {
        this.paketList = []
      } finally {
        this.loading = false
      }
    },
    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => this.loadPaket(), 300)
    },
    openCreateModal() {
      this.editingPaket = null
      this.paketForm = { nama_paket: '', deskripsi: '', is_active: true }
      this.showPaketModal = true
    },
    openEditModal(paket) {
      this.editingPaket = paket
      this.paketForm = { nama_paket: paket.nama_paket, deskripsi: paket.deskripsi || '', is_active: paket.is_active }
      this.showPaketModal = true
    },
    async savePaket() {
      if (!this.paketForm.nama_paket) return
      try {
        if (this.editingPaket) {
          await updatePaket(this.editingPaket.id_paket_soal, this.paketForm)
          this.showAlert('Paket soal berhasil diupdate', 'success')
        } else {
          await createPaket(this.paketForm)
          this.showAlert('Paket soal berhasil dibuat', 'success')
        }
        this.showPaketModal = false
        await this.loadPaket()
      } catch (e) {
        this.showAlert(e?.response?.data?.message || e?.message || 'Gagal menyimpan', 'error')
      }
    },
    async confirmDelete(paket) {
      const result = await Swal.fire({
        title: 'Hapus Paket Soal?',
        text: `Yakin ingin menghapus "${paket.nama_paket}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
      })
      if (result.isConfirmed) {
        try {
          await removePaket(paket.id_paket_soal)
          this.showAlert('Paket soal berhasil dihapus', 'success')
          await this.loadPaket()
        } catch (e) {
          this.showAlert(e?.response?.data?.message || e?.message || 'Gagal menghapus', 'error')
        }
      }
    },
    async openSoalEditor(paket) {
      this.selectedPaket = paket
      await this.loadSoal(paket.id_paket_soal)
    },
    closeSoalEditor() {
      this.selectedPaket = null
      this.soalList = []
      this.editingSoal = null
      this.loadPaket()
    },
    async loadSoal(idPaketSoal) {
      this.loadingSoal = true
      try {
        const data = await getSoalList(idPaketSoal)
        this.soalList = Array.isArray(data) ? data : (data?.data || [])
      } catch {
        this.soalList = []
      } finally {
        this.loadingSoal = false
      }
    },
    openAddSoalModal() {
      this.newSoalList = [this.emptySoal()]
      this.showSoalModal = true
    },
    addNewSoalRow() {
      this.newSoalList.push(this.emptySoal())
    },
    async saveNewSoal() {
      const invalid = this.newSoalList.find(s => !s.pertanyaan || !s.pilihan_a || !s.pilihan_b || !s.pilihan_c || !s.pilihan_d)
      if (invalid) {
        this.showAlert('Semua field wajib diisi', 'error')
        return
      }
      this.savingSoal = true
      try {
        const data = await createSoal(this.selectedPaket.id_paket_soal, this.newSoalList)
        this.soalList = Array.isArray(data) ? data : (data?.data || [])
        this.showSoalModal = false
        this.showAlert(`${this.newSoalList.length} soal berhasil ditambahkan`, 'success')
      } catch (e) {
        this.showAlert(e?.response?.data?.message || e?.message || 'Gagal menyimpan soal', 'error')
      } finally {
        this.savingSoal = false
      }
    },
    startEdit(soal) {
      this.editingSoal = { ...soal }
    },
    cancelEdit() {
      this.editingSoal = null
    },
    async saveEditSoal() {
      try {
        await updateSoal(this.editingSoal.id_soal, {
          pertanyaan: this.editingSoal.pertanyaan,
          pilihan_a: this.editingSoal.pilihan_a,
          pilihan_b: this.editingSoal.pilihan_b,
          pilihan_c: this.editingSoal.pilihan_c,
          pilihan_d: this.editingSoal.pilihan_d,
          jawaban_benar: this.editingSoal.jawaban_benar,
        })
        const idx = this.soalList.findIndex(s => s.id_soal === this.editingSoal.id_soal)
        if (idx !== -1) this.soalList[idx] = { ...this.editingSoal }
        this.editingSoal = null
        this.showAlert('Soal berhasil diupdate', 'success')
      } catch (e) {
        this.showAlert(e?.response?.data?.message || e?.message || 'Gagal mengupdate soal', 'error')
      }
    },
    async confirmDeleteSoal(soal) {
      const result = await Swal.fire({
        title: 'Hapus Soal?',
        text: 'Yakin ingin menghapus soal ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
      })
      if (result.isConfirmed) {
        try {
          await removeSoal(soal.id_soal)
          this.soalList = this.soalList.filter(s => s.id_soal !== soal.id_soal)
          this.showAlert('Soal berhasil dihapus', 'success')
        } catch (e) {
          this.showAlert(e?.response?.data?.message || e?.message || 'Gagal menghapus soal', 'error')
        }
      }
    },
    async handleImport(event) {
      const file = event.target.files[0]
      if (!file) return
      event.target.value = ''

      const formData = new FormData()
      formData.append('file', file)

      try {
        const data = await importSoal(this.selectedPaket.id_paket_soal, formData)
        this.soalList = Array.isArray(data) ? data : (data?.data || [])
        const msg = data?.message || 'Import berhasil'
        this.showAlert(msg, 'success')
      } catch (e) {
        this.showAlert(e?.response?.data?.message || e?.message || 'Gagal import', 'error')
      }
    },
    showAlert(message, type = 'error') {
      this.alert = { show: true, type, message }
      setTimeout(() => { this.alert.show = false }, 5000)
    },
  },
}
</script>
