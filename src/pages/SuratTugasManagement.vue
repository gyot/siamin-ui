<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Manajemen Surat Tugas</h1>
          <p class="text-xs sm:text-sm text-gray-600">Kelola surat tugas dan penugasan pegawai</p>
        </div>
        <button
          @click="showAddSuratModal = true"
          class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
        >
          + Buat Surat Tugas
        </button>
      </div>

      <!-- Filter dan Search -->
      <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Cari Nomor Surat</label>
            <input
              v-model="searchNomor"
              type="text"
              placeholder="Ketik nomor surat..."
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Status</label>
            <select
              v-model="filterStatus"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="diterbitkan">Diterbitkan</option>
            </select>
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Kegiatan</label>
            <select
              v-model="filterKegiatan"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kegiatan</option>
              <option v-for="k in kegiatan" :key="k.id_kegiatan" :value="k.id_kegiatan">
                {{ k.nama_kegiatan }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Statistik -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Surat</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ filteredSuratTugas.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Diterbitkan</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ suratDiterbitkan.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Draft</p>
          <p class="text-2xl sm:text-3xl font-bold text-orange-600">{{ suratDraft.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Penugasan</p>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600">{{ suratTugasPegawai.length }}</p>
        </div>
      </div>

      <!-- Tabel Surat Tugas -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Nomor Surat</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Kegiatan</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Tanggal Surat</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Penandatangan</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Anggota</th>
                <th class="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="surat in filteredSuratTugas" :key="surat.id_surat_tugas" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ surat.nomor_surat }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ getNamaKegiatan(surat.id_kegiatan) }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(surat.tanggal_surat) }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ getNamaPegawai(surat.id_penandatangan) }}</td>
                <td class="px-4 py-3 text-sm">
                  <span :class="[
                    'inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                    surat.status === 'diterbitkan'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  ]">
                    {{ surat.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-sm font-medium text-gray-800">{{ getCountAnggota(surat.id_surat_tugas) }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="viewDetail(surat.id_surat_tugas)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition mr-2"
                    title="Lihat Detail"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button
                    @click="editSurat(surat.id_surat_tugas)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition mr-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="deleteSurat(surat.id_surat_tugas)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredSuratTugas.length === 0">
                <td colspan="7" class="px-4 py-6 text-center text-gray-500">
                  <p>Tidak ada data surat tugas</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Buat/Edit Surat Tugas -->
    <div v-if="showAddSuratModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">{{ editingSuratId ? 'Edit' : 'Buat' }} Surat Tugas</h3>
          <button @click="showAddSuratModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveSurat" class="p-6">
          <!-- Error messages -->
          <div v-if="formErrors.length" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ul class="list-disc list-inside text-sm text-red-800">
              <li v-for="(error, idx) in formErrors" :key="idx">{{ error }}</li>
            </ul>
          </div>

          <!-- Form fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Surat *</label>
              <input
                v-model="formSurat.nomor_surat"
                type="text"
                placeholder="Cth: ST-001/2025"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kegiatan *</label>
              <select
                v-model.number="formSurat.id_kegiatan"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Kegiatan</option>
                <option v-for="k in kegiatan" :key="k.id_kegiatan" :value="k.id_kegiatan">
                  {{ k.nama_kegiatan }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Surat *</label>
              <input
                v-model="formSurat.tanggal_surat"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Penandatangan *</label>
              <select
                v-model.number="formSurat.id_penandatangan"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Pegawai</option>
                <option v-for="p in pegawai" :key="p.id_pegawai" :value="p.id_pegawai">
                  {{ p.nama }} ({{ p.nip }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                v-model="formSurat.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Status</option>
                <option value="draft">Draft</option>
                <option value="diterbitkan">Diterbitkan</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">File Surat (URL)</label>
              <input
                v-model="formSurat.file_surat"
                type="url"
                placeholder="https://..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {{ editingSuratId ? 'Perbarui' : 'Simpan' }}
            </button>
            <button
              type="button"
              @click="showAddSuratModal = false"
              class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detail Surat Tugas -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">Detail Surat Tugas</h3>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Info Dasar -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p class="text-xs text-blue-600 font-semibold mb-1">NOMOR SURAT</p>
              <p class="text-lg font-bold text-gray-800">{{ detailSurat?.nomor_surat }}</p>
            </div>
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
              <p class="text-xs text-indigo-600 font-semibold mb-1">STATUS</p>
              <span :class="[
                'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                detailSurat?.status === 'diterbitkan'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              ]">
                {{ detailSurat?.status }}
              </span>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <p class="text-xs text-purple-600 font-semibold mb-1">TANGGAL SURAT</p>
              <p class="text-lg font-bold text-gray-800">{{ formatDate(detailSurat?.tanggal_surat) }}</p>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <p class="text-xs text-green-600 font-semibold mb-1">KEGIATAN</p>
              <p class="text-lg font-bold text-gray-800">{{ getNamaKegiatan(detailSurat?.id_kegiatan) }}</p>
            </div>
          </div>

          <!-- Info Tambahan -->
          <div class="border-t pt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">PENANDATANGAN</p>
                <p class="text-sm text-gray-800">{{ getNamaPegawai(detailSurat?.id_penandatangan) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">FILE SURAT</p>
                <a v-if="detailSurat?.file_surat" :href="detailSurat.file_surat" target="_blank" class="text-sm text-blue-600 hover:underline">
                  Buka File
                </a>
                <p v-else class="text-sm text-gray-600">-</p>
              </div>
            </div>
          </div>

          <!-- Tabel Anggota -->
          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-4">
              <p class="text-sm font-bold text-gray-800">Anggota Penugasan ({{ detailAnggota.length }})</p>
              <button
                @click="showAddAnggotaModal = true"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
              >
                + Tambah Anggota
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 text-left">Nama Pegawai</th>
                    <th class="px-4 py-2 text-left">NIP</th>
                    <th class="px-4 py-2 text-left">Peran</th>
                    <th class="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr v-for="anggota in detailAnggota" :key="anggota.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2">{{ getNamaPegawai(anggota.id_pegawai) }}</td>
                    <td class="px-4 py-2">{{ getNipPegawai(anggota.id_pegawai) }}</td>
                    <td class="px-4 py-2">
                      <span :class="[
                        'inline-block px-2 py-1 rounded text-xs font-semibold',
                        anggota.peran === 'penanggung_jawab' ? 'bg-purple-100 text-purple-800' :
                        anggota.peran === 'ketua_panitia' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      ]">
                        {{ anggota.peran }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-center">
                      <button
                        @click="removeAnggota(anggota.id)"
                        class="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        title="Hapus"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="detailAnggota.length === 0">
                    <td colspan="4" class="px-4 py-3 text-center text-gray-500 text-sm">Belum ada anggota ditambahkan</td>
                  </tr>
                </tbody>
              </table>
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

    <!-- Modal Tambah Anggota ke Surat -->
    <div v-if="showAddAnggotaModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">Tambah Anggota Penugasan</h3>
          <button @click="showAddAnggotaModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="addAnggotaToSurat" class="p-6">
          <!-- Error messages -->
          <div v-if="formErrors.length" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ul class="list-disc list-inside text-sm text-red-800">
              <li v-for="(error, idx) in formErrors" :key="idx">{{ error }}</li>
            </ul>
          </div>

          <!-- Form fields -->
          <div class="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Pegawai *</label>
              <select
                v-model.number="formAnggota.id_pegawai"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Pegawai</option>
                <option v-for="p in pegawai" :key="p.id_pegawai" :value="p.id_pegawai">
                  {{ p.nama }} ({{ p.nip }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Peran Penugasan *</label>
              <select
                v-model="formAnggota.peran"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Peran</option>
                <option value="penanggung_jawab">Penanggung Jawab</option>
                <option value="ketua_panitia">Ketua Panitia</option>
                <option value="panitia">Panitia</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Tambah
            </button>
            <button
              type="button"
              @click="showAddAnggotaModal = false"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import database from '@/data/index.js'
import { fetchAPI } from '@/services/api'
import {
  listSuratTugas,
  listSuratTugasPegawai,
  createSuratTugas,
  editSuratTugas as updateSuratTugas,
  removeSuratTugas,
  createSuratTugasPegawai,
  removeSuratTugasPegawai
} from '@/services/suratTugas'

export default {
  name: 'SuratTugasManagement',
  setup() {
    const route = useRoute()
    const suratTugas = ref(database.surat_tugas || [])
    const suratTugasPegawai = ref(database.surat_tugas_pegawai || [])
    const pegawai = ref(database.pegawai || [])
    const kegiatan = ref(database.kegiatan || [])

    const searchNomor = ref('')
    const filterStatus = ref('')
    const filterKegiatan = ref('')
    const showAddSuratModal = ref(false)
    const showDetailModal = ref(false)
    const showAddAnggotaModal = ref(false)
    const editingSuratId = ref(null)
    const detailSuratId = ref(null)
    const formErrors = ref([])
    const isLoading = ref(false)

    const formSurat = ref({
      id_surat_tugas: null,
      id_kegiatan: null,
      nomor_surat: '',
      tanggal_surat: new Date().toISOString().split('T')[0],
      id_penandatangan: null,
      status: 'draft',
      file_surat: ''
    })

    const formAnggota = ref({
      id_pegawai: null,
      peran: ''
    })

    const detailSurat = ref(null)
    const detailAnggota = ref([])

    const parsePossibleNumber = (value) => {
      if (value === null || value === undefined || value === '') return value
      return isNaN(value) ? value : Number(value)
    }

    const applyRouteIntent = async () => {
      const kegiatanId = parsePossibleNumber(route.query.id_kegiatan)
      const suratId = parsePossibleNumber(route.query.id)

      if (route.query.edit === 'true' && suratId) {
        editSurat(suratId)
        return
      }

      if ((route.query.create === 'true' || kegiatanId) && kegiatanId) {
        const kegiatanFound = kegiatan.value.find(k => String(k.id_kegiatan) === String(kegiatanId))
        if (kegiatanFound) {
          resetFormSurat()
          formSurat.value.id_kegiatan = kegiatanId
          showAddSuratModal.value = true
        }
      }
    }

    const loadReferenceData = async () => {
      const [pegawaiData, kegiatanData] = await Promise.all([
        fetchAPI('pegawai'),
        fetchAPI('kegiatan')
      ])

      pegawai.value = Array.isArray(pegawaiData) ? pegawaiData : (database.pegawai || [])
      kegiatan.value = Array.isArray(kegiatanData) ? kegiatanData : (database.kegiatan || [])
    }

    const loadSuratTugasData = async () => {
      const [suratData, anggotaData] = await Promise.all([
        listSuratTugas(),
        listSuratTugasPegawai()
      ])

      suratTugas.value = suratData
      suratTugasPegawai.value = anggotaData
    }

    const loadAllData = async () => {
      isLoading.value = true
      try {
        await Promise.all([
          loadReferenceData(),
          loadSuratTugasData()
        ])
        await applyRouteIntent()
      } catch (error) {
        console.error('Gagal memuat data surat tugas:', error)
        alert(error?.message || 'Gagal memuat data surat tugas')
      } finally {
        isLoading.value = false
      }
    }

    const filteredSuratTugas = computed(() => {
      return suratTugas.value.filter(s => {
        const nomorMatch = String(s.nomor_surat || '').toLowerCase().includes(searchNomor.value.toLowerCase())
        const statusMatch = !filterStatus.value || s.status === filterStatus.value
        const kegiatanMatch = !filterKegiatan.value || String(s.id_kegiatan) === String(filterKegiatan.value)
        return nomorMatch && statusMatch && kegiatanMatch
      })
    })

    const suratDiterbitkan = computed(() => {
      return filteredSuratTugas.value.filter(s => s.status === 'diterbitkan')
    })

    const suratDraft = computed(() => {
      return filteredSuratTugas.value.filter(s => s.status === 'draft')
    })

    const getNamaKegiatan = (id) => {
      const k = kegiatan.value.find(kg => String(kg.id_kegiatan) === String(id))
      return k ? k.nama_kegiatan : '-'
    }

    const getNamaPegawai = (id) => {
      const p = pegawai.value.find(pg => String(pg.id_pegawai) === String(id))
      return p ? p.nama : '-'
    }

    const getNipPegawai = (id) => {
      const p = pegawai.value.find(pg => String(pg.id_pegawai) === String(id))
      return p ? p.nip : '-'
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const getCountAnggota = (idSurat) => {
      return suratTugasPegawai.value.filter(s => String(s.id_surat_tugas) === String(idSurat)).length
    }

    const resetFormSurat = () => {
      formSurat.value = {
        id_surat_tugas: null,
        id_kegiatan: null,
        nomor_surat: '',
        tanggal_surat: new Date().toISOString().split('T')[0],
        id_penandatangan: null,
        status: 'draft',
        file_surat: ''
      }
      editingSuratId.value = null
      formErrors.value = []
    }

    const validateFormSurat = () => {
      formErrors.value = []
      if (!formSurat.value.nomor_surat) formErrors.value.push('Nomor surat wajib diisi')
      if (!formSurat.value.id_kegiatan) formErrors.value.push('Kegiatan wajib dipilih')
      if (!formSurat.value.tanggal_surat) formErrors.value.push('Tanggal surat wajib diisi')
      if (!formSurat.value.id_penandatangan) formErrors.value.push('Penandatangan wajib dipilih')
      if (!formSurat.value.status) formErrors.value.push('Status wajib dipilih')

      // Cek nomor surat unik
      const nomorExists = suratTugas.value.some(s =>
        String(s.nomor_surat).trim() === String(formSurat.value.nomor_surat).trim() &&
        String(s.id_surat_tugas) !== String(editingSuratId.value)
      )
      if (nomorExists) formErrors.value.push('Nomor surat sudah digunakan')

      return formErrors.value.length === 0
    }

    const editSurat = (id) => {
      const s = suratTugas.value.find(st => String(st.id_surat_tugas) === String(id))
      if (s) {
        formSurat.value = { ...s }
        editingSuratId.value = id
        showAddSuratModal.value = true
      }
    }

    const saveSurat = async () => {
      if (!validateFormSurat()) return

      try {
        const payload = {
          ...formSurat.value,
          id_kegiatan: parsePossibleNumber(formSurat.value.id_kegiatan),
          id_penandatangan: parsePossibleNumber(formSurat.value.id_penandatangan)
        }

        if (editingSuratId.value) {
          await updateSuratTugas(editingSuratId.value, payload)
        } else {
          await createSuratTugas(payload)
        }

        await loadSuratTugasData()
        if (detailSuratId.value) {
          const currentDetail = suratTugas.value.find(st => String(st.id_surat_tugas) === String(detailSuratId.value))
          if (currentDetail) detailSurat.value = { ...currentDetail }
        }

        showAddSuratModal.value = false
        resetFormSurat()
      } catch (error) {
        console.error('Gagal menyimpan surat tugas:', error)
        alert(error?.message || 'Gagal menyimpan surat tugas')
      }
    }

    const deleteSurat = async (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus surat tugas ini? Anggota yang terkait juga akan dihapus.')) {
        try {
          await removeSuratTugas(id)
          await loadSuratTugasData()
          if (String(detailSuratId.value) === String(id)) {
            detailSurat.value = null
            detailAnggota.value = []
            detailSuratId.value = null
            showDetailModal.value = false
          }
        } catch (error) {
          console.error('Gagal menghapus surat tugas:', error)
          alert(error?.message || 'Gagal menghapus surat tugas')
        }
      }
    }

    const viewDetail = (id) => {
      const s = suratTugas.value.find(st => String(st.id_surat_tugas) === String(id))
      if (s) {
        detailSurat.value = { ...s }
        detailSuratId.value = id
        detailAnggota.value = suratTugasPegawai.value.filter(stp => String(stp.id_surat_tugas) === String(id))
        showDetailModal.value = true
      }
    }

    const addAnggotaToSurat = async () => {
      formErrors.value = []
      if (!formAnggota.value.id_pegawai) formErrors.value.push('Pegawai wajib dipilih')
      if (!formAnggota.value.peran) formErrors.value.push('Peran wajib dipilih')

      // Cek duplikat
      const duplicate = detailAnggota.value.some(a => String(a.id_pegawai) === String(formAnggota.value.id_pegawai))
      if (duplicate) formErrors.value.push('Pegawai ini sudah ditambahkan ke surat tugas ini')

      if (formErrors.value.length > 0) return

      try {
        await createSuratTugasPegawai({
          id_surat_tugas: detailSuratId.value,
          id_pegawai: parsePossibleNumber(formAnggota.value.id_pegawai),
          peran: formAnggota.value.peran
        })

        await loadSuratTugasData()
        detailAnggota.value = suratTugasPegawai.value.filter(
          stp => String(stp.id_surat_tugas) === String(detailSuratId.value)
        )

        formAnggota.value = {
          id_pegawai: null,
          peran: ''
        }
        showAddAnggotaModal.value = false
      } catch (error) {
        console.error('Gagal menambah anggota surat tugas:', error)
        formErrors.value = [error?.message || 'Gagal menambah anggota surat tugas']
      }
    }

    const removeAnggota = async (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
        try {
          await removeSuratTugasPegawai(id)
          await loadSuratTugasData()
          detailAnggota.value = suratTugasPegawai.value.filter(
            stp => String(stp.id_surat_tugas) === String(detailSuratId.value)
          )
        } catch (error) {
          console.error('Gagal menghapus anggota surat tugas:', error)
          alert(error?.message || 'Gagal menghapus anggota surat tugas')
        }
      }
    }

    onMounted(() => {
      loadAllData()
    })

    return {
      suratTugas,
      suratTugasPegawai,
      pegawai,
      kegiatan,
      searchNomor,
      filterStatus,
      filterKegiatan,
      showAddSuratModal,
      showDetailModal,
      showAddAnggotaModal,
      editingSuratId,
      detailSuratId,
      formSurat,
      formAnggota,
      formErrors,
      isLoading,
      detailSurat,
      detailAnggota,
      filteredSuratTugas,
      suratDiterbitkan,
      suratDraft,
      getNamaKegiatan,
      getNamaPegawai,
      getNipPegawai,
      formatDate,
      getCountAnggota,
      resetFormSurat,
      validateFormSurat,
      editSurat,
      saveSurat,
      deleteSurat,
      viewDetail,
      addAnggotaToSurat,
      removeAnggota
    }
  }
}
</script>

<style scoped>
</style>
