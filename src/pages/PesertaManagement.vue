<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Manajemen Peserta</h1>
          <p class="text-xs sm:text-sm text-gray-600">Kelola data peserta dari semua kegiatan</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="exportPeserta"
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            Export Excel
          </button>
          <button
            @click="downloadBatchDocxZip"
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Download Batch DOCX
          </button>
          <button
            @click="showAddModal = true"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            + Tambah Peserta
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingPeserta" class="mb-6 p-4 flex items-center justify-center bg-white rounded-lg shadow-md">
        <div class="flex items-center gap-3">
          <div class="animate-spin">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-600">Memuat data peserta...</p>
        </div>
      </div>

      <!-- Filter dan Search -->
      <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
        <div :class="kegiatanId ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Cari Nama</label>
            <input
              v-model="searchNama"
              type="text"
              placeholder="Ketik nama peserta..."
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <!-- <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Tahun</label>
            <select
              v-model="filterTahun"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="tahun in availableTahun" :key="tahun" :value="tahun">
                {{ tahun }}
              </option>
            </select>
          </div> -->
          <div v-if="!kegiatanId">
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
          <div v-if="!kegiatanId">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Status</label>
            <select
              v-model="filterStatus"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Statistik -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Peserta</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ filteredPeserta.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Peserta Aktif</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ filteredPesertaAktif.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Sudah Bersertifikat</p>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600">{{ filteredPesertaBersertifikat }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Belum Bersertifikat</p>
          <p class="text-2xl sm:text-3xl font-bold text-orange-600">{{ filteredPeserta.length - filteredPesertaBersertifikat }}</p>
        </div>
      </div>

      <!-- Tabel Peserta - Desktop View -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">No</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Nama</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">NIP</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Email</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Instansi</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Kegiatan</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Peran</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Sertifikat</th>
                <th class="px-4 py-3 text-center text-xs sm:text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="filteredPeserta.length === 0" class="hover:bg-gray-50">
                <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                  <p class="text-sm sm:text-base">Tidak ada data peserta</p>
                </td>
              </tr>
              <tr
                v-for="(p, index) in filteredPeserta"
                :key="p.id_peserta"
                class="hover:bg-blue-50 transition-colors"
              >
                <td class="px-4 py-3 text-xs sm:text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-xs sm:text-sm font-medium text-gray-900">{{ p.nama_lengkap }}</td>
                <td class="px-4 py-3 text-xs sm:text-sm text-gray-600">{{ p.nip || '-' }}</td>
                <td class="px-4 py-3 text-xs sm:text-sm text-gray-600 truncate">{{ p.email }}</td>
                <td class="px-4 py-3 text-xs sm:text-sm text-gray-600 max-w-xs truncate">{{ p.nama_instansi }}</td>
                <td class="px-4 py-3 text-xs sm:text-sm text-gray-600">
                  {{ getNamaKegiatan(p.id_kegiatan) }}
                </td>
                <td class="px-4 py-3 text-xs sm:text-sm">
                  <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {{ p.peran || 'Peserta' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs sm:text-sm">
                  <span :class="getSertifikatBadgeClass(p.id_peserta)" class="text-xs">
                    {{ getSertifikatStatus(p.id_peserta) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs sm:text-sm">
                  <div class="flex gap-1 justify-center flex-wrap">
                    <button
                      @click="openDetailModal(p)"
                      class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs font-semibold whitespace-nowrap"
                    >
                      Detail
                    </button>
                    <button
                      @click="openSertifikatModal(p)"
                      class="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-xs font-semibold whitespace-nowrap"
                    >
                      Sert
                    </button>
                    <button
                      @click="downloadPesertaDocx(p)"
                      class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs font-semibold whitespace-nowrap"
                    >
                      DOCX
                    </button>
                    <button
                      @click="deletePeserta(p.id_peserta)"
                      class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs font-semibold whitespace-nowrap"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card View - Mobile -->
      <div class="md:hidden space-y-3">
        <div v-if="filteredPeserta.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          <p class="text-sm">Tidak ada data peserta</p>
        </div>
        <div
          v-for="(p, index) in filteredPeserta"
          :key="p.id_peserta"
          class="bg-white rounded-lg shadow-md p-4 space-y-2 border-l-4 border-blue-500"
        >
          <div class="flex justify-between items-start gap-2 mb-3">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 mb-1">{{ index + 1 }}. {{ p.nama_lengkap }}</p>
              <p class="text-xs text-gray-500">{{ p.email }}</p>
            </div>
            <span :class="getSertifikatBadgeClass(p.id_peserta)" class="text-xs whitespace-nowrap">
              {{ getSertifikatStatus(p.id_peserta) }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs mb-3 pb-3 border-b border-gray-200">
            <div>
              <p class="text-gray-600">NIP</p>
              <p class="font-semibold text-gray-900">{{ p.nip || '-' }}</p>
            </div>
            <div>
              <p class="text-gray-600">Instansi</p>
              <p class="font-semibold text-gray-900 truncate">{{ p.nama_instansi }}</p>
            </div>
            <div>
              <p class="text-gray-600">Kegiatan</p>
              <p class="font-semibold text-gray-900 truncate">{{ getNamaKegiatan(p.id_kegiatan) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Peran</p>
              <p class="font-semibold text-gray-900">{{ p.peran || 'Peserta' }}</p>
            </div>
          </div>
          <div class="flex gap-2 justify-between pt-2">
            <button
              @click="openDetailModal(p)"
              class="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600 transition-colors"
            >
              Detail
            </button>
            <button
              @click="openSertifikatModal(p)"
              class="flex-1 px-3 py-2 bg-indigo-500 text-white rounded text-xs font-semibold hover:bg-indigo-600 transition-colors"
            >
              Sertifikat
            </button>
            <button
              @click="deletePeserta(p.id_peserta)"
              class="flex-1 px-3 py-2 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>


      <!-- Modal Tambah/Edit Peserta -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0">
            <h2 class="text-lg sm:text-xl font-bold">
              {{ editingPeserta ? 'Edit Peserta' : 'Tambah Peserta Baru' }}
            </h2>
            <button @click="closeAddModal" class="text-2xl hover:text-blue-200">&times;</button>
          </div>

          <div class="p-4 sm:p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
              <!-- Data Pribadi -->
              <div class="md:col-span-2">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">Data Pribadi</h3>
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  v-model="formPeserta.nama_lengkap"
                  type="text"
                  class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">NIP</label>
                <input
                  v-model="formPeserta.nip"
                  type="text"
                  class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  v-model="formPeserta.email"
                  type="email"
                  class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">No. HP</label>
                <input
                  v-model="formPeserta.no_hp"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                <select
                  v-model="formPeserta.jenis_kelamin"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
                <input
                  v-model="formPeserta.tempat_lahir"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                <input
                  v-model="formPeserta.tanggal_lahir"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">NPWP/NIK</label>
                <input
                  v-model="formPeserta.npwp_nik"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pangkat</label>
                <input
                  v-model="formPeserta.pangkat"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Golongan</label>
                <input
                  v-model="formPeserta.gol"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                <input
                  v-model="formPeserta.jabatan"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Data Instansi -->
              <div class="md:col-span-2">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">Data Instansi</h3>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Instansi *</label>
                <input
                  v-model="formPeserta.nama_instansi"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Kegiatan *</label>
                <select
                  v-model="formPeserta.id_kegiatan"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Kegiatan</option>
                  <option v-for="k in kegiatan" :key="k.id_kegiatan" :value="k.id_kegiatan">
                    {{ k.nama_kegiatan }}
                  </option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Alamat Instansi</label>
                <textarea
                  v-model="formPeserta.alamat_instansi"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Kabupaten/Kota</label>
                <input
                  v-model="formPeserta.kab_kota"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Provinsi</label>
                <input
                  v-model="formPeserta.provinsi"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Telepon Instansi</label>
                <input
                  v-model="formPeserta.telp_instansi"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Instansi</label>
                <input
                  v-model="formPeserta.email_instansi"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Data Pembayaran -->
              <div class="md:col-span-2">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">Data Pembayaran</h3>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Provider Pulsa</label>
                <select
                  v-model="formPeserta.provider_pulsa"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Provider</option>
                  <option value="Telkomsel">Telkomsel</option>
                  <option value="Indosat">Indosat</option>
                  <option value="XL">XL Axiata</option>
                  <option value="Tri">Tri</option>
                  <option value="Smartfren">Smartfren</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Rekening</label>
                <input
                  v-model="formPeserta.nomor_rekening"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Bank</label>
                <input
                  v-model="formPeserta.nama_bank"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Data Administrasi -->
              <div class="md:col-span-2">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">Data Administrasi</h3>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">No. Surat Tugas</label>
                <input
                  v-model="formPeserta.no_surat_tugas"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Surat Tugas</label>
                <input
                  v-model="formPeserta.tanggal_surat_tugas"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Peran</label>
                <select
                  v-model="formPeserta.peran"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Peran</option>
                  <option value="Peserta">Peserta</option>
                  <option value="Narasumber">Narasumber</option>
                  <option value="Fasilitator">Fasilitator</option>
                  <option value="Panitia">Panitia</option>
                </select>
              </div>
            </div>

            <div v-if="formErrors.length > 0" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-800 font-semibold mb-2">Terdapat kesalahan:</p>
              <ul class="list-disc list-inside text-red-700">
                <li v-for="error in formErrors" :key="error">{{ error }}</li>
              </ul>
            </div>

            <div class="flex gap-3 justify-end">
              <button
                @click="closeAddModal"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                @click="savePeserta"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {{ editingPeserta ? 'Simpan Perubahan' : 'Tambah Peserta' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Detail Peserta -->
      <div v-if="showDetailModal && selectedPeserta" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
            <h2 class="text-xl font-bold">Detail Peserta</h2>
            <button @click="showDetailModal = false" class="text-2xl hover:text-blue-200">&times;</button>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-600">Nama Lengkap</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.nama_lengkap }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">NIP</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.nip || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">No. HP</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.no_hp }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Nama Instansi</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.nama_instansi }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Peran</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.peran || 'Peserta' }}</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-sm text-gray-600">Alamat Instansi</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.alamat_instansi }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Kabupaten/Kota</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.kab_kota }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Provinsi</p>
                <p class="text-lg font-semibold text-gray-900">{{ selectedPeserta.provinsi }}</p>
              </div>
            </div>

            <div class="flex gap-3 justify-end mt-6">
              <button
                @click="showDetailModal = false"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                @click="openEditModal"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Edit Peserta
              </button>
              <button
                @click="downloadPesertaDocx(selectedPeserta)"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download DOCX
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Sertifikat -->
      <div v-if="showSertifikatModal && selectedPeserta" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
            <h2 class="text-xl font-bold">Kelola Sertifikat - {{ selectedPeserta.nama_lengkap }}</h2>
            <button @click="showSertifikatModal = false" class="text-2xl hover:text-blue-200">&times;</button>
          </div>

          <div class="p-6">
            <!-- Tampilkan sertifikat yang sudah ada jika ada -->
            <div v-if="sertifikatPeserta" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 class="font-semibold text-green-800 mb-3">Sertifikat Sudah Diterbitkan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p class="text-gray-600">Nomor Sertifikat</p>
                  <p class="font-semibold text-gray-900">{{ sertifikatPeserta.nomor_sertifikat }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Tanggal Tandatangan</p>
                  <p class="font-semibold text-gray-900">{{ formatDate(sertifikatPeserta.tanggal_ttd) }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Status</p>
                  <span :class="getSertifikatBadgeClass(selectedPeserta.id_peserta)">
                    {{ getSertifikatStatus(selectedPeserta.id_peserta) }}
                  </span>
                </div>
                <div>
                  <p class="text-gray-600">Template</p>
                  <p class="font-semibold text-gray-900">{{ sertifikatPeserta.template }}</p>
                </div>
              </div>
            </div>

            <!-- Form Sertifikat -->
            <form @submit.prevent="saveSertifikat" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Sertifikat *</label>
                  <input
                    v-model="formSertifikat.nomor_sertifikat"
                    type="text"
                    placeholder="CERT-2025-001"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Tandatangan *</label>
                  <input
                    v-model="formSertifikat.tanggal_ttd"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Penandatangan *</label>
                  <select
                    v-model="formSertifikat.id_penandatangan"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Penandatangan</option>
                    <option v-for="p in pegawai" :key="p.id_pegawai" :value="p.id_pegawai">
                      {{ p.nama }} ({{ p.pangkat }})
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Template *</label>
                  <select
                    v-model="formSertifikat.template"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Template</option>
                    <option value="template_1">Template Peserta</option>
                    <option value="template_2">Template Narasumber</option>
                    <option value="template_3">Template Fasilitator</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Peran</label>
                  <input
                    v-model="formSertifikat.peran"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    v-model="formSertifikat.status"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="terbit">Diterbitkan</option>
                    <option value="dicabut">Dicabut</option>
                  </select>
                </div>
              </div>

              <div v-if="formErrors.length > 0" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-800 font-semibold mb-2">Terdapat kesalahan:</p>
                <ul class="list-disc list-inside text-red-700">
                  <li v-for="error in formErrors" :key="error">{{ error }}</li>
                </ul>
              </div>

              <div class="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  @click="showSertifikatModal = false"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {{ sertifikatPeserta ? 'Ubah Sertifikat' : 'Buat Sertifikat' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import database from '@/data/index.js'
import { fetchAPI } from '@/services/api'
import { ActivityEvents } from '@/services/activityLogger'

import * as XLSX from 'xlsx'
import { processDocxTemplate } from '@/utils/docxUtils.js'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'

export default {
  name: 'Peserta',
  props: {
    kegiatanId: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {

    const peserta = ref([])
    const kegiatan = ref([])
    const pegawai = ref(database.pegawai)
    const sertifikat = ref([])
    const isLoadingPeserta = ref(false)

    const showAddModal = ref(false)
    const showDetailModal = ref(false)
    const showSertifikatModal = ref(false)
    const editingPeserta = ref(false)
    const selectedPeserta = ref(null)
    const formErrors = ref([])

    const searchNama = ref('')
    const filterKegiatan = ref(props.kegiatanId || '')
    const filterStatus = ref('')

    // Helper function to load peserta from API
    const loadPesertaFromAPI = async () => {
      isLoadingPeserta.value = true
      try {
        // Always fetch from /peserta endpoint
        // Filter by kegiatan will be done in frontend
        const endpoint = 'peserta'
        const data = await fetchAPI(endpoint)
        
        // Handle different response formats
        if (Array.isArray(data)) {
          peserta.value = data
        } else if (data && Array.isArray(data.data)) {
          peserta.value = data.data
        } else if (data && data.peserta && Array.isArray(data.peserta)) {
          peserta.value = data.peserta
        } else {
          peserta.value = []
          console.warn('[PesertaManagement] Unexpected response format:', data)
        }
        
      } catch (error) {
        console.error('[PesertaManagement] Failed to load peserta from API:', error.message)
        console.error('[PesertaManagement] Full error:', error)
        peserta.value = []
      } finally {
        isLoadingPeserta.value = false
      }
    }

    // Helper function to load kegiatan from API
    const loadKegiatanFromAPI = async () => {
      try {
        const data = await fetchAPI('kegiatan')
        
        if (Array.isArray(data)) {
          kegiatan.value = data
        } else if (data && Array.isArray(data.data)) {
          kegiatan.value = data.data
        } else if (data && data.kegiatan && Array.isArray(data.kegiatan)) {
          kegiatan.value = data.kegiatan
        } else {
          kegiatan.value = []
          console.warn('[PesertaManagement] Unexpected kegiatan response format:', data)
        }
        
      } catch (error) {
        console.error('[PesertaManagement] Failed to load kegiatan from API:', error.message)
        kegiatan.value = []
      }
    }

    // Helper function to load sertifikat from API
    const loadSertifikatFromAPI = async () => {
      try {
        const data = await fetchAPI('sertifikat')
        
        if (Array.isArray(data)) {
          sertifikat.value = data
        } else if (data && Array.isArray(data.data)) {
          sertifikat.value = data.data
        } else if (data && data.sertifikat && Array.isArray(data.sertifikat)) {
          sertifikat.value = data.sertifikat
        } else {
          sertifikat.value = []
          console.warn('[PesertaManagement] Unexpected sertifikat response format:', data)
        }
        
      } catch (error) {
        console.error('[PesertaManagement] Failed to load sertifikat from API:', error.message)
        sertifikat.value = []
      }
    }

    // Auto-set filter kegiatan if kegiatanId prop is provided
    watch(() => props.kegiatanId, (newVal) => {
      if (newVal) {
        filterKegiatan.value = newVal
        // Reload peserta when kegiatan changes
        loadPesertaFromAPI()
      }
    }, { immediate: true })

    // Log page access
    onMounted(() => {
      ActivityEvents.ACCESS_PAGE('Manajemen Peserta')
      // Load data from API
      loadKegiatanFromAPI()
      loadPesertaFromAPI()
      loadSertifikatFromAPI()
    })

    const formPeserta = ref({
      id_peserta: null,
      id_kegiatan: '',
      nama_lengkap: '',
      nip: '',
      pangkat: '',
      gol: '',
      jabatan: '',
      no_hp: '',
      email: '',
      npwp_nik: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      nama_instansi: '',
      alamat_instansi: '',
      kab_kota: '',
      provinsi: '',
      telp_instansi: '',
      email_instansi: '',
      provider_pulsa: null,
      nomor_rekening: '',
      nama_bank: '',
      no_surat_tugas: '',
      tanggal_surat_tugas: '',
      peran: ''
    })

    const formSertifikat = ref({
      nomor_sertifikat: '',
      tanggal_ttd: '',
      id_penandatangan: '',
      template: '',
      peran: '',
      status: 'draft'
    })

    const resetFormPeserta = () => {
      formPeserta.value = {
        id_peserta: null,
        id_kegiatan: '',
        nama_lengkap: '',
        nip: '',
        pangkat: '',
        gol: '',
        jabatan: '',
        no_hp: '',
        email: '',
        npwp_nik: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        nama_instansi: '',
        alamat_instansi: '',
        kab_kota: '',
        provinsi: '',
        telp_instansi: '',
        email_instansi: '',
        provider_pulsa: null,
        nomor_rekening: '',
        nama_bank: '',
        no_surat_tugas: '',
        tanggal_surat_tugas: '',
        peran: ''
      }
      editingPeserta.value = false
      formErrors.value = []
    }

    const resetFormSertifikat = () => {
      formSertifikat.value = {
        nomor_sertifikat: '',
        tanggal_ttd: '',
        id_penandatangan: '',
        template: '',
        peran: '',
        status: 'draft'
      }
      formErrors.value = []
    }

    const validateFormPeserta = () => {
      formErrors.value = []
      if (!formPeserta.value.nama_lengkap) formErrors.value.push('Nama lengkap wajib diisi')
      if (!formPeserta.value.email) formErrors.value.push('Email wajib diisi')
      if (!formPeserta.value.nama_instansi) formErrors.value.push('Nama instansi wajib diisi')
      if (!formPeserta.value.id_kegiatan) formErrors.value.push('Kegiatan wajib dipilih')
      return formErrors.value.length === 0
    }

    const validateFormSertifikat = () => {
      formErrors.value = []
      if (!formSertifikat.value.nomor_sertifikat) formErrors.value.push('Nomor sertifikat wajib diisi')
      if (!formSertifikat.value.tanggal_ttd) formErrors.value.push('Tanggal tandatangan wajib diisi')
      if (!formSertifikat.value.id_penandatangan) formErrors.value.push('Penandatangan wajib dipilih')
      if (!formSertifikat.value.template) formErrors.value.push('Template wajib dipilih')
      return formErrors.value.length === 0
    }

    const filteredPeserta = computed(() => {
      return peserta.value.filter(p => {
        const namaMatch = p.nama_lengkap.toLowerCase().includes(searchNama.value.toLowerCase())
        const kegiatanMatch = !filterKegiatan.value || p.id_kegiatan == filterKegiatan.value
        const statusMatch = !filterStatus.value || (filterStatus.value === 'aktif' && p.id_peserta) || filterStatus.value === 'nonaktif'
        return namaMatch && kegiatanMatch && statusMatch
      })
    })

    const pesertaAktif = computed(() => {
      return peserta.value.filter(p => p.id_peserta)
    })

    const pesertaBersertifikat = computed(() => {
      return sertifikat.value.filter(s => s.status === 'terbit').length
    })

    // Computed properties untuk statistik yang hanya menampilkan data filtered
    const filteredPesertaAktif = computed(() => {
      return filteredPeserta.value.filter(p => p.id_peserta)
    })

    const filteredPesertaBersertifikat = computed(() => {
      return filteredPeserta.value.filter(p => {
        const cert = sertifikat.value.find(s => s.id_peserta === p.id_peserta && s.status === 'terbit')
        return !!cert
      }).length
    })

    const sertifikatPeserta = computed(() => {
      if (!selectedPeserta.value) return null
      return sertifikat.value.find(s => s.id_peserta === selectedPeserta.value.id_peserta)
    })

    const getNamaKegiatan = (id) => {
      const k = kegiatan.value.find(kg => kg.id_kegiatan === id)
      return k ? k.nama_kegiatan : '-'
    }

    const getSertifikatStatus = (idPeserta) => {
      const cert = sertifikat.value.find(s => s.id_peserta === idPeserta)
      if (!cert) return 'Belum Bersertifikat'
      if (cert.status === 'terbit') return 'Bersertifikat'
      if (cert.status === 'draft') return 'Draft'
      if (cert.status === 'dicabut') return 'Dicabut'
      return 'Belum Bersertifikat'
    }

    const getSertifikatBadgeClass = (idPeserta) => {
      const cert = sertifikat.value.find(s => s.id_peserta === idPeserta)
      if (!cert) return 'inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold'
      if (cert.status === 'terbit') return 'inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold'
      if (cert.status === 'draft') return 'inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold'
      if (cert.status === 'dicabut') return 'inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold'
      return 'inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold'
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const openDetailModal = (p) => {
      selectedPeserta.value = p
      showDetailModal.value = true
    }

    const openEditModal = () => {
      if (selectedPeserta.value) {
        formPeserta.value = { ...selectedPeserta.value }
        editingPeserta.value = true
        showDetailModal.value = false
        showAddModal.value = true
      }
    }

    const closeAddModal = () => {
      showAddModal.value = false
      resetFormPeserta()
    }

    const savePeserta = () => {
      if (!validateFormPeserta()) return

      if (editingPeserta.value) {
        const index = peserta.value.findIndex(p => p.id_peserta === formPeserta.value.id_peserta)
        if (index !== -1) {
          peserta.value[index] = { ...formPeserta.value, updated_at: new Date().toISOString() }
        }
        // Log update
        ActivityEvents.UPDATE_PESERTA(formPeserta.value.nama_lengkap)
      } else {
        const newId = Math.max(...peserta.value.map(p => p.id_peserta), 0) + 1
        peserta.value.push({
          ...formPeserta.value,
          id_peserta: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        // Log creation
        ActivityEvents.CREATE_PESERTA(formPeserta.value.nama_lengkap)
      }

      closeAddModal()
    }

    const deletePeserta = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
        const index = peserta.value.findIndex(p => p.id_peserta === id)
        if (index !== -1) {
          const deletedPeserta = peserta.value[index]
          peserta.value.splice(index, 1)
          // Log deletion
          ActivityEvents.DELETE_PESERTA(deletedPeserta.nama_lengkap)
        }
      }
    }

    const openSertifikatModal = (p) => {
      selectedPeserta.value = p
      resetFormSertifikat()
      formSertifikat.value.peran = p.peran || 'Peserta'

      const cert = sertifikat.value.find(s => s.id_peserta === p.id_peserta)
      if (cert) {
        formSertifikat.value = { ...cert }
      }

      showSertifikatModal.value = true
    }

    const saveSertifikat = () => {
      if (!validateFormSertifikat()) return

      const existingCert = sertifikat.value.find(s => s.id_peserta === selectedPeserta.value.id_peserta)

      if (existingCert) {
        Object.assign(existingCert, {
          ...formSertifikat.value,
          updated_at: new Date().toISOString()
        })
      } else {
        sertifikat.value.push({
          id_sertifikat: Math.max(...sertifikat.value.map(s => s.id_sertifikat), 0) + 1,
          id_kegiatan: selectedPeserta.value.id_kegiatan,
          id_peserta: selectedPeserta.value.id_peserta,
          ...formSertifikat.value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        // Log sertifikat creation
        ActivityEvents.CREATE_SERTIFIKAT(selectedPeserta.value.nama_lengkap)
      }

      showSertifikatModal.value = false
    }

    const exportPeserta = () => {
      const apiBase = import.meta.env.VITE_API_BASE_URL || ''
      const buildSignatureUrl = (sig) => {
        if (!sig) return ''
        if (typeof sig !== 'string') return ''
        if (sig.startsWith('http')) return sig
        if (sig.startsWith('data:')) return sig
        return apiBase + '/storage/' + sig
      }

      // Prepare rows with desired fields including signature URL
      const rows = filteredPeserta.value.map(p => {
        const signature = p.tanda_tangan_url || p.tanda_tangan || p.tandatangan || ''
        return {
          id_peserta: p.id_peserta,
          id_kegiatan: p.id_kegiatan,
          nama_kegiatan: getNamaKegiatan(p.id_kegiatan),
          nama_lengkap: p.nama_lengkap,
          nip: p.nip || '',
          email: p.email || '',
          no_hp: p.no_hp || '',
          nama_instansi: p.nama_instansi || '',
          kab_kota: p.kab_kota || '',
          provinsi: p.provinsi || '',
          peran: p.peran || '',
          jenis_kelamin: p.jenis_kelamin || '',
          nomor_rekening: p.nomor_rekening || '',
          nama_bank: p.nama_bank || '',
          provider_pulsa: p.provider_pulsa || '',
          tanda_tangan_url: buildSignatureUrl(signature)
        }
      })

      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Peserta')
      const filename = `peserta_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`
      XLSX.writeFile(wb, filename)
      
      // Log export activity
      ActivityEvents.EXPORT_DATA(`Peserta (${filteredPeserta.value.length} records)`, 'xlsx')
    }
    
    const dateFormat = (date) => {
      let bulanFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      let bulanShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      const bulan = bulanFull // Ganti ke bulanFull jika ingin format bulan lengkap
      if (!date) return ' '
      const d = new Date(date)
      return `${d.getDate().toString().padStart(2,'0')} ${bulan[d.getMonth()]} ${d.getFullYear()}`
    }
    // Fungsi download DOCX dari data peserta dengan template DOCX
    const downloadPesertaDocx = async (pesertaData) => {
      try {
        // 1. Ambil template DOCX (misal dari public/template_peserta.docx)
        const response = await fetch('/template_peserta.docx')
        const templateDocx = await response.blob()

        // 2. Siapkan data untuk replace
        const data = {
          judul_kegiatan: getNamaKegiatan(pesertaData.id_kegiatan),
          tanggal_mulai: dateFormat(kegiatan.value.find(k => k.id_kegiatan === pesertaData.id_kegiatan)?.tanggal_mulai),
          tanggal_selesai: dateFormat(kegiatan.value.find(k => k.id_kegiatan ===pesertaData.id_kegiatan)?.tanggal_selesai),
          waktu : dateFormat(kegiatan.value.find(k => k.id_kegiatan === pesertaData.id_kegiatan)?.tanggal_mulai)+' s.d. '+ dateFormat(kegiatan.value.find(k => k.id_kegiatan === pesertaData.id_kegiatan)?.tanggal_selesai),
          lokasi: kegiatan.value.find(k => k.id_kegiatan === pesertaData.id_kegiatan)?.lokasi || '-',
          nama_lengkap: pesertaData.nama_lengkap,
          nip: pesertaData.nip,
          pangkat: pesertaData.pangkat,
          instansi: pesertaData.nama_instansi,
          jabatan: pesertaData.jabatan,
          kabupaten_kota: pesertaData.kab_kota,
          provinsi: pesertaData.provinsi,
          no_hp: pesertaData.no_hp,
          email: pesertaData.email,
          nama_instansi: pesertaData.nama_instansi,
          kegiatan: getNamaKegiatan(pesertaData.id_kegiatan),
          peran: pesertaData.peran || 'Peserta',
          tanda_tangan_url: pesertaData.tanda_tangan_url || pesertaData.tanda_tangan || pesertaData.tandatangan || '',

          // Tambahkan field lain sesuai kebutuhan
        }

        // 3. Generate DOCX baru dari template
        const docxFilename = `${pesertaData.peran} - ${pesertaData.nama_lengkap}.docx`
        await processDocxTemplate(templateDocx, data, docxFilename)
      } catch (error) {
        console.error('Gagal download DOCX peserta :', error)
        alert('Gagal download DOCX peserta. Cek template atau data.')
      }
    }

    const downloadBatchDocxZip = async () => {
      const zip = new JSZip()
      const templateResponse = await fetch('/template_peserta.docx')
      const templateDocx = await templateResponse.blob()
      for (const p of filteredPeserta.value) {
        const data = {
          nama_lengkap: p.nama_lengkap,
          nip: p.nip,
          email: p.email,
          nama_instansi: p.nama_instansi,
          kegiatan: getNamaKegiatan(p.id_kegiatan),
          peran: p.peran || 'Peserta',
        }
        // Proses template untuk peserta ini
        // processDocxTemplate harus bisa return blob jika filename=null
        const docxBlob = await processDocxTemplate(templateDocx, data, null)
        zip.file(`peserta_${p.id_peserta}.docx`, docxBlob)
      }
      // Generate ZIP dan download
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `peserta_batch_${new Date().toISOString().slice(0,10)}.zip`
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    }

    return {
      peserta,
      kegiatan,
      pegawai,
      sertifikat,
      isLoadingPeserta,
      showAddModal,
      showDetailModal,
      showSertifikatModal,
      editingPeserta,
      selectedPeserta,
      formErrors,
      searchNama,
      filterKegiatan,
      filterStatus,
      formPeserta,
      formSertifikat,
      filteredPeserta,
      pesertaAktif,
      pesertaBersertifikat,
      filteredPesertaAktif,
      filteredPesertaBersertifikat,
      sertifikatPeserta,
      getNamaKegiatan,
      getSertifikatStatus,
      getSertifikatBadgeClass,
      formatDate,
      openDetailModal,
      openEditModal,
      closeAddModal,
      savePeserta,
      deletePeserta,
      openSertifikatModal,
      saveSertifikat,
      resetFormPeserta,
      resetFormSertifikat,
      exportPeserta,
      loadPesertaFromAPI,
      loadKegiatanFromAPI,
      loadSertifikatFromAPI,
      // downloadPesertaPdf,
      downloadPesertaDocx,
      downloadBatchDocxZip
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
