<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Manajemen Anggota Tim</h1>
          <p class="text-xs sm:text-sm text-gray-600">Kelola penugasan anggota pada unit kerja</p>
        </div>
        <button
          @click="showAddMemberModal = true"
          class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
        >
          + Tambah Anggota
        </button>
      </div>

      <!-- Filter dan Search -->
      <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Cari Nama Anggota</label>
            <input
              v-model="searchNama"
              type="text"
              placeholder="Ketik nama pegawai..."
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Unit Kerja</label>
            <select
              v-model="filterUnit"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Unit</option>
              <option v-for="unit in unitKerja" :key="unit.id" :value="unit.id">
                {{ unit.nama_unit }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Peran</label>
            <select
              v-model="filterPeran"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Peran</option>
              <option value="Ketua">Ketua</option>
              <option value="Anggota">Anggota</option>
              <option value="Koordinator">Koordinator</option>
              <option value="Wali Wilayah">Wali Wilayah</option>
              <option value="Co-Wali Wilayah">Co-Wali Wilayah</option>
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
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Anggota</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ filteredKeanggotaan.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Ketua</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ countByRole('Ketua') }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Koordinator</p>
          <p class="text-2xl sm:text-3xl font-bold text-orange-600">{{ countByRole('Koordinator') }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Anggota</p>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600">{{ countByRole('Anggota') }}</p>
        </div>
      </div>

      <!-- Tabel Anggota -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Nama Anggota</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Unit Kerja</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Peran</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Sub Unit</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Tahun</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in filteredKeanggotaan" :key="item.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ getNamaPegawai(item.id_pegawai) }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ getUnitName(item.unit_kerja_id) }}</td>
                <td class="px-4 py-3 text-sm">
                  <span :class="[
                    'inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                    item.peran === 'Ketua' ? 'bg-purple-100 text-purple-800' :
                    item.peran === 'Koordinator' ? 'bg-blue-100 text-blue-800' :
                    item.peran === 'Wali Wilayah' ? 'bg-red-100 text-red-800' :
                    item.peran === 'Co-Wali Wilayah' ? 'bg-pink-100 text-pink-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ item.peran }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ getSubUnitName(item.sub_unit_kerja_id) || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ item.tahun }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="editMember(item.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition mr-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="deleteMember(item.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredKeanggotaan.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                  <p>Tidak ada data anggota tim</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit Anggota -->
    <div v-if="showAddMemberModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">{{ editingMemberId ? 'Edit' : 'Tambah' }} Anggota Tim</h3>
          <button @click="showAddMemberModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveMember" class="p-6">
          <!-- Error messages -->
          <div v-if="formErrors.length" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ul class="list-disc list-inside text-sm text-red-800">
              <li v-for="(error, idx) in formErrors" :key="idx">{{ error }}</li>
            </ul>
          </div>

          <!-- Form fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Pegawai *</label>
              <select
                v-model.number="formMember.id_pegawai"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Pegawai</option>
                <option v-for="p in pegawai" :key="p.id_pegawai" :value="p.id_pegawai">
                  {{ p.nama }} ({{ p.nip }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit Kerja *</label>
              <select
                v-model.number="formMember.unit_kerja_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Unit Kerja</option>
                <option v-for="unit in unitKerja" :key="unit.id" :value="unit.id">
                  {{ unit.nama_unit }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Peran *</label>
              <select
                v-model="formMember.peran"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Peran</option>
                <option value="Ketua">Ketua</option>
                <option value="Anggota">Anggota</option>
                <option value="Koordinator">Koordinator</option>
                <option value="Wali Wilayah">Wali Wilayah</option>
                <option value="Co-Wali Wilayah">Co-Wali Wilayah</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sub Unit Kerja (Opsional)</label>
              <select
                v-model.number="formMember.sub_unit_kerja_id"
                :disabled="!formMember.unit_kerja_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
              >
                <option :value="null">Tidak ada sub unit</option>
                <option v-for="sub in availableSubUnits" :key="sub.id" :value="sub.id">
                  {{ sub.nama_sub_unit }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun *</label>
              <input
                v-model.number="formMember.tahun"
                type="number"
                placeholder="2026"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {{ editingMemberId ? 'Perbarui' : 'Simpan' }}
            </button>
            <button
              type="button"
              @click="showAddMemberModal = false"
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
  name: 'AnggotaManagement',
  setup() {
    const pegawai = ref(database.pegawai || [])
    const unitKerja = ref(database.unit_kerja || [])
    const subUnitKerja = ref(database.sub_unit_kerja || [])
    const keanggotaanTim = ref(database.keanggotaan_tim || [])

    const searchNama = ref('')
    const filterUnit = ref('')
    const filterPeran = ref('')
    const filterTahun = ref(new Date().getFullYear().toString())
    const showAddMemberModal = ref(false)
    const editingMemberId = ref(null)
    const formErrors = ref([])

    const formMember = ref({
      id: null,
      id_pegawai: null,
      unit_kerja_id: null,
      sub_unit_kerja_id: null,
      peran: '',
      tahun: new Date().getFullYear()
    })

    const filteredKeanggotaan = computed(() => {
      return keanggotaanTim.value.filter(item => {
        const nama = getNamaPegawai(item.id_pegawai).toLowerCase()
        const namaMatch = nama.includes(searchNama.value.toLowerCase())
        const unitMatch = !filterUnit.value || item.unit_kerja_id.toString() === filterUnit.value
        const peranMatch = !filterPeran.value || item.peran === filterPeran.value
        const tahunMatch = !filterTahun.value || item.tahun.toString() === filterTahun.value
        return namaMatch && unitMatch && peranMatch && tahunMatch
      })
    })

    const availableTahun = computed(() => {
      const tahuns = new Set()
      keanggotaanTim.value.forEach(item => {
        tahuns.add(item.tahun)
      })
      return Array.from(tahuns).sort().reverse()
    })

    const availableSubUnits = computed(() => {
      if (!formMember.value.unit_kerja_id) return []
      return subUnitKerja.value.filter(su => su.unit_kerja_id === formMember.value.unit_kerja_id)
    })

    const getNamaPegawai = (id) => {
      const p = pegawai.value.find(pg => pg.id_pegawai === id)
      return p ? p.nama : '-'
    }

    const getUnitName = (id) => {
      const unit = unitKerja.value.find(u => u.id === id)
      return unit ? unit.nama_unit : '-'
    }

    const getSubUnitName = (id) => {
      if (!id) return null
      const sub = subUnitKerja.value.find(s => s.id === id)
      return sub ? sub.nama_sub_unit : null
    }

    const countByRole = (role) => {
      return filteredKeanggotaan.value.filter(item => item.peran === role).length
    }

    const resetFormMember = () => {
      formMember.value = {
        id: null,
        id_pegawai: null,
        unit_kerja_id: null,
        sub_unit_kerja_id: null,
        peran: '',
        tahun: new Date().getFullYear()
      }
      editingMemberId.value = null
      formErrors.value = []
    }

    const validateForm = () => {
      formErrors.value = []
      if (!formMember.value.id_pegawai) formErrors.value.push('Pegawai wajib dipilih')
      if (!formMember.value.unit_kerja_id) formErrors.value.push('Unit kerja wajib dipilih')
      if (!formMember.value.peran) formErrors.value.push('Peran wajib dipilih')
      if (!formMember.value.tahun) formErrors.value.push('Tahun wajib diisi')

      // Cek duplicate: pegawai yang sama di unit yang sama untuk tahun yang sama
      const duplicate = keanggotaanTim.value.some(item =>
        item.id_pegawai === formMember.value.id_pegawai &&
        item.unit_kerja_id === formMember.value.unit_kerja_id &&
        item.tahun === formMember.value.tahun &&
        item.id !== editingMemberId.value
      )
      if (duplicate) formErrors.value.push('Pegawai ini sudah ditugaskan ke unit dan tahun yang sama')

      return formErrors.value.length === 0
    }

    const editMember = (id) => {
      const item = keanggotaanTim.value.find(k => k.id === id)
      if (item) {
        formMember.value = { ...item }
        editingMemberId.value = id
        showAddMemberModal.value = true
      }
    }

    const saveMember = () => {
      if (!validateForm()) return

      if (editingMemberId.value) {
        const index = keanggotaanTim.value.findIndex(k => k.id === editingMemberId.value)
        if (index !== -1) {
          keanggotaanTim.value[index] = {
            ...formMember.value,
            updated_at: new Date().toISOString()
          }
        }
      } else {
        const newId = Math.max(...keanggotaanTim.value.map(k => k.id), 0) + 1
        keanggotaanTim.value.push({
          ...formMember.value,
          id: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      showAddMemberModal.value = false
      resetFormMember()
    }

    const deleteMember = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus penugasan anggota ini?')) {
        keanggotaanTim.value = keanggotaanTim.value.filter(k => k.id !== id)
      }
    }

    return {
      pegawai,
      unitKerja,
      subUnitKerja,
      keanggotaanTim,
      searchNama,
      filterUnit,
      filterPeran,
      filterTahun,
      showAddMemberModal,
      editingMemberId,
      formMember,
      formErrors,
      filteredKeanggotaan,
      availableTahun,
      availableSubUnits,
      getNamaPegawai,
      getUnitName,
      getSubUnitName,
      countByRole,
      resetFormMember,
      validateForm,
      editMember,
      saveMember,
      deleteMember
    }
  }
}
</script>

<style scoped>
</style>
