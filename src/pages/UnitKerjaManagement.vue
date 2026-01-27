<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Manajemen Unit Kerja</h1>
          <p class="text-xs sm:text-sm text-gray-600">Kelola data unit dan sub unit kerja organisasi</p>
        </div>
        <button
          @click="showAddUnitModal = true"
          class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
        >
          + Tambah Unit Kerja
        </button>
      </div>

      <!-- Filter dan Search -->
      <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Cari Nama Unit</label>
            <input
              v-model="searchNama"
              type="text"
              placeholder="Ketik nama unit..."
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Jenis Unit</label>
            <select
              v-model="filterJenis"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Jenis</option>
              <option value="utama">Utama</option>
              <option value="pendukung">Pendukung</option>
            </select>
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Tahun</label>
            <select
              v-model="filterTahun"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Tahun</option>
              <option v-for="tahun in availableTahun" :key="tahun" :value="tahun">
                {{ tahun }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Statistik -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Unit</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ filteredUnitKerja.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Unit Utama</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ unitUtama.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Unit Pendukung</p>
          <p class="text-2xl sm:text-3xl font-bold text-orange-600">{{ unitPendukung.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Sub Unit</p>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600">{{ subUnitKerja.length }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 border-b border-gray-200">
        <button
          @click="activeTab = 'unit'"
          :class="[
            'px-4 sm:px-6 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors',
            activeTab === 'unit'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          ]"
        >
          Data Unit Kerja
        </button>
        <button
          @click="activeTab = 'subunit'"
          :class="[
            'px-4 sm:px-6 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors',
            activeTab === 'subunit'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          ]"
        >
          Data Sub Unit Kerja
        </button>
      </div>

      <!-- Tabel Unit Kerja -->
      <div v-if="activeTab === 'unit'" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Kode</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Nama Unit</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Jenis</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Tahun</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Keterangan</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="unit in filteredUnitKerja" :key="unit.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ unit.kode_unit }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ unit.nama_unit }}</td>
                <td class="px-4 py-3 text-sm">
                  <span :class="[
                    'inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                    unit.jenis_unit === 'utama'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  ]">
                    {{ unit.jenis_unit }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ unit.tahun }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{{ unit.keterangan || '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="viewDetailUnit(unit.id)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition mr-2"
                    title="Lihat Detail"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button
                    @click="editUnit(unit.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition mr-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="deleteUnit(unit.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredUnitKerja.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                  <p>Tidak ada data unit kerja</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel Sub Unit Kerja -->
      <div v-if="activeTab === 'subunit'" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Nama Sub Unit</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Unit Induk</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Fungsi</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="subunit in subUnitKerja" :key="subunit.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ subunit.nama_sub_unit }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ getUnitName(subunit.unit_kerja_id) }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{{ subunit.fungsi }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="editSubUnit(subunit.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition mr-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="deleteSubUnit(subunit.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="subUnitKerja.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  <p>Tidak ada data sub unit kerja</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit Unit Kerja -->
    <div v-if="showAddUnitModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">{{ editingUnitId ? 'Edit' : 'Tambah' }} Unit Kerja</h3>
          <button @click="showAddUnitModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveUnit" class="p-6">
          <!-- Error messages -->
          <div v-if="formErrors.length" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ul class="list-disc list-inside text-sm text-red-800">
              <li v-for="(error, idx) in formErrors" :key="idx">{{ error }}</li>
            </ul>
          </div>

          <!-- Form fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kode Unit *</label>
              <input
                v-model="formUnit.kode_unit"
                type="text"
                placeholder="Cth: BA, BPE"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Unit *</label>
              <input
                v-model="formUnit.nama_unit"
                type="text"
                placeholder="Nama lengkap unit"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Unit *</label>
              <select
                v-model="formUnit.jenis_unit"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Jenis</option>
                <option value="utama">Utama</option>
                <option value="pendukung">Pendukung</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun *</label>
              <input
                v-model.number="formUnit.tahun"
                type="number"
                placeholder="2026"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <textarea
                v-model="formUnit.keterangan"
                placeholder="Deskripsi unit kerja"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {{ editingUnitId ? 'Perbarui' : 'Simpan' }}
            </button>
            <button
              type="button"
              @click="showAddUnitModal = false"
              class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detail Unit Kerja -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">Detail Unit Kerja</h3>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p class="text-xs text-blue-600 font-semibold mb-1">KODE UNIT</p>
              <p class="text-lg font-bold text-gray-800">{{ detailUnit?.kode_unit }}</p>
            </div>
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
              <p class="text-xs text-indigo-600 font-semibold mb-1">NAMA UNIT</p>
              <p class="text-lg font-bold text-gray-800">{{ detailUnit?.nama_unit }}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <p class="text-xs text-purple-600 font-semibold mb-1">JENIS UNIT</p>
              <span :class="[
                'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                detailUnit?.jenis_unit === 'utama'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              ]">
                {{ detailUnit?.jenis_unit }}
              </span>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <p class="text-xs text-green-600 font-semibold mb-1">TAHUN</p>
              <p class="text-lg font-bold text-gray-800">{{ detailUnit?.tahun }}</p>
            </div>
          </div>

          <div class="border-t pt-4">
            <p class="text-xs text-gray-500 font-semibold mb-2">KETERANGAN</p>
            <p class="text-sm text-gray-800">{{ detailUnit?.keterangan || '-' }}</p>
          </div>

          <!-- Sub unit dari unit ini -->
          <div v-if="detailSubUnits.length > 0" class="border-t pt-4">
            <p class="text-sm font-bold text-gray-800 mb-3">Sub Unit Kerja ({{ detailSubUnits.length }})</p>
            <div class="space-y-2">
              <div v-for="subunit in detailSubUnits" :key="subunit.id" class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p class="text-sm font-medium text-gray-800">{{ subunit.nama_sub_unit }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ subunit.fungsi }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              @click="showDetailModal = false"
              class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit Sub Unit -->
    <div v-if="showEditSubUnitModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">Edit Sub Unit Kerja</h3>
          <button @click="showEditSubUnitModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveSubUnit" class="p-6">
          <!-- Error messages -->
          <div v-if="formErrors.length" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ul class="list-disc list-inside text-sm text-red-800">
              <li v-for="(error, idx) in formErrors" :key="idx">{{ error }}</li>
            </ul>
          </div>

          <!-- Form fields -->
          <div class="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit Induk *</label>
              <select
                v-model.number="formSubUnit.unit_kerja_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Unit Induk</option>
                <option v-for="unit in unitKerja" :key="unit.id" :value="unit.id">
                  {{ unit.nama_unit }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Sub Unit *</label>
              <input
                v-model="formSubUnit.nama_sub_unit"
                type="text"
                placeholder="Nama sub unit"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fungsi *</label>
              <textarea
                v-model="formSubUnit.fungsi"
                placeholder="Deskripsi fungsi sub unit"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              @click="showEditSubUnitModal = false"
              class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import database from '@/data/index.js'

export default {
  name: 'UnitKerjaManagement',
  setup() {
    const unitKerja = ref(database.unit_kerja || [])
    const subUnitKerja = ref(database.sub_unit_kerja || [])

    const searchNama = ref('')
    const filterJenis = ref('')
    const filterTahun = ref(new Date().getFullYear().toString())
    const activeTab = ref('unit')
    const showAddUnitModal = ref(false)
    const showDetailModal = ref(false)
    const showEditSubUnitModal = ref(false)
    const editingUnitId = ref(null)
    const editingSubUnitId = ref(null)
    const formErrors = ref([])

    const formUnit = ref({
      id: null,
      kode_unit: '',
      nama_unit: '',
      jenis_unit: '',
      tahun: new Date().getFullYear(),
      keterangan: ''
    })

    const formSubUnit = ref({
      id: null,
      unit_kerja_id: '',
      nama_sub_unit: '',
      fungsi: ''
    })

    const detailUnit = ref(null)
    const detailSubUnits = ref([])

    const filteredUnitKerja = computed(() => {
      return unitKerja.value.filter(u => {
        const namaMatch = u.nama_unit.toLowerCase().includes(searchNama.value.toLowerCase())
        const jenisMatch = !filterJenis.value || u.jenis_unit === filterJenis.value
        const tahunMatch = !filterTahun.value || u.tahun.toString() === filterTahun.value
        return namaMatch && jenisMatch && tahunMatch
      })
    })

    const unitUtama = computed(() => {
      return filteredUnitKerja.value.filter(u => u.jenis_unit === 'utama')
    })

    const unitPendukung = computed(() => {
      return filteredUnitKerja.value.filter(u => u.jenis_unit === 'pendukung')
    })

    const availableTahun = computed(() => {
      const tahuns = new Set()
      unitKerja.value.forEach(u => {
        tahuns.add(u.tahun)
      })
      return Array.from(tahuns).sort().reverse()
    })

    const getUnitName = (id) => {
      const unit = unitKerja.value.find(u => u.id === id)
      return unit ? unit.nama_unit : '-'
    }

    const resetFormUnit = () => {
      formUnit.value = {
        id: null,
        kode_unit: '',
        nama_unit: '',
        jenis_unit: '',
        tahun: new Date().getFullYear(),
        keterangan: ''
      }
      editingUnitId.value = null
      formErrors.value = []
    }

    const validateFormUnit = () => {
      formErrors.value = []
      if (!formUnit.value.kode_unit) formErrors.value.push('Kode unit wajib diisi')
      if (!formUnit.value.nama_unit) formErrors.value.push('Nama unit wajib diisi')
      if (!formUnit.value.jenis_unit) formErrors.value.push('Jenis unit wajib dipilih')
      if (!formUnit.value.tahun) formErrors.value.push('Tahun wajib diisi')

      // Cek kode_unit unik
      const kodeExists = unitKerja.value.some(u =>
        u.kode_unit === formUnit.value.kode_unit && u.id !== editingUnitId.value
      )
      if (kodeExists) formErrors.value.push('Kode unit sudah digunakan')

      return formErrors.value.length === 0
    }

    const editUnit = (id) => {
      const u = unitKerja.value.find(unit => unit.id === id)
      if (u) {
        formUnit.value = { ...u }
        editingUnitId.value = id
        showAddUnitModal.value = true
      }
    }

    const saveUnit = () => {
      if (!validateFormUnit()) return

      if (editingUnitId.value) {
        const index = unitKerja.value.findIndex(u => u.id === editingUnitId.value)
        if (index !== -1) {
          unitKerja.value[index] = {
            ...formUnit.value,
            updated_at: new Date().toISOString()
          }
        }
      } else {
        const newId = Math.max(...unitKerja.value.map(u => u.id), 0) + 1
        unitKerja.value.push({
          ...formUnit.value,
          id: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      showAddUnitModal.value = false
      resetFormUnit()
    }

    const deleteUnit = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus unit kerja ini?')) {
        unitKerja.value = unitKerja.value.filter(u => u.id !== id)
        // Hapus juga sub unit yang terkait
        subUnitKerja.value = subUnitKerja.value.filter(su => su.unit_kerja_id !== id)
      }
    }

    const viewDetailUnit = (id) => {
      const u = unitKerja.value.find(unit => unit.id === id)
      if (u) {
        detailUnit.value = { ...u }
        detailSubUnits.value = subUnitKerja.value.filter(su => su.unit_kerja_id === id)
        showDetailModal.value = true
      }
    }

    const editSubUnit = (id) => {
      const su = subUnitKerja.value.find(sub => sub.id === id)
      if (su) {
        formSubUnit.value = { ...su }
        editingSubUnitId.value = id
        showEditSubUnitModal.value = true
      }
    }

    const saveSubUnit = () => {
      formErrors.value = []
      if (!formSubUnit.value.unit_kerja_id) formErrors.value.push('Unit induk wajib dipilih')
      if (!formSubUnit.value.nama_sub_unit) formErrors.value.push('Nama sub unit wajib diisi')
      if (!formSubUnit.value.fungsi) formErrors.value.push('Fungsi wajib diisi')

      if (formErrors.value.length > 0) return

      const index = subUnitKerja.value.findIndex(su => su.id === editingSubUnitId.value)
      if (index !== -1) {
        subUnitKerja.value[index] = {
          ...formSubUnit.value,
          updated_at: new Date().toISOString()
        }
      }

      showEditSubUnitModal.value = false
      formSubUnit.value = {
        id: null,
        unit_kerja_id: '',
        nama_sub_unit: '',
        fungsi: ''
      }
      editingSubUnitId.value = null
      formErrors.value = []
    }

    const deleteSubUnit = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus sub unit kerja ini?')) {
        subUnitKerja.value = subUnitKerja.value.filter(su => su.id !== id)
      }
    }

    return {
      unitKerja,
      subUnitKerja,
      searchNama,
      filterJenis,
      filterTahun,
      activeTab,
      showAddUnitModal,
      showDetailModal,
      showEditSubUnitModal,
      editingUnitId,
      editingSubUnitId,
      formUnit,
      formSubUnit,
      formErrors,
      detailUnit,
      detailSubUnits,
      filteredUnitKerja,
      unitUtama,
      unitPendukung,
      availableTahun,
      getUnitName,
      resetFormUnit,
      validateFormUnit,
      editUnit,
      saveUnit,
      deleteUnit,
      viewDetailUnit,
      editSubUnit,
      saveSubUnit,
      deleteSubUnit
    }
  }
}
</script>

<style scoped>
</style>
