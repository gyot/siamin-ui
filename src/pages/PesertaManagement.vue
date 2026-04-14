<template>
  <div class="min-h-screen bg-white p-3 sm:p-4 md:p-6">
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
            :disabled="isDownloadingBatchDocx || filteredPeserta.length === 0"
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isDownloadingBatchDocx ? 'Menyiapkan Batch DOCX...' : 'Download Batch DOCX' }}
          </button>
          <button
            @click="openAllBiodataModal"
            :disabled="filteredPeserta.length === 0"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Tampilkan Semua Biodata
          </button>
          <button
            @click="printAllBiodata"
            :disabled="filteredPeserta.length === 0"
            class="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cetak Semua Biodata
          </button>
          <!-- <button
            @click="showAddModal = true"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            + Tambah Peserta
          </button> -->
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
      <div class="bg-white rounded-lg p-3 sm:p-4 mb-6">
        <div :class="kegiatanId ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'">
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
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Kabupaten/Kota</label>
            <select
              v-model="filterKabKota"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kabupaten/Kota</option>
              <option v-for="kabupaten in uniqueKabKota" :key="kabupaten" :value="kabupaten">
                {{ kabupaten }}
              </option>
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
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Kabupaten/Kota</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Kegiatan</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Peran</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Sertifikat</th>
                <th class="px-4 py-3 text-center text-xs sm:text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="filteredPeserta.length === 0" class="hover:bg-gray-50">
                <td colspan="10" class="px-4 py-8 text-center text-gray-500">
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
                <td class="px-4 py-3 text-xs sm:text-sm text-gray-600">{{ p.kab_kota || '-' }}</td>
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
                      @click="openBiodataModal(p)"
                      class="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-xs font-semibold whitespace-nowrap"
                      title="Lihat Biodata"
                    >
                      Biodata
                    </button>
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
                      v-if="isKegiatanCreator(p.id_kegiatan)"
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
              @click="openBiodataModal(p)"
              class="flex-1 px-3 py-2 bg-purple-500 text-white rounded text-xs font-semibold hover:bg-purple-600 transition-colors"
            >
              Biodata
            </button>
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
              v-if="isKegiatanCreator(p.id_kegiatan)"
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
                <label class="block text-sm font-medium text-gray-700 mb-2">NPSN (jika instansi pendidikan)</label>
                <input
                  v-model="formPeserta.npsn"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="8"
                  @input="onNpsnInput"
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
                v-if="canModifySelectedPeserta"
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

    <!-- Modal Biodata Peserta -->
    <div v-if="showBiodataModal && selectedPesertaBiodata"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl print:hidden">
          <h3 class="text-2xl font-bold text-gray-800">Biodata</h3>
          <button @click="showBiodataModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 print:p-0">
          <!-- Print Button -->
          <div class="flex justify-end mb-4 print:hidden">
            <button @click="printBiodata"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Biodata
            </button>
          </div>

          <!-- Biodata Content -->
          <div id="biodata-content" class="p-4 bg-white border rounded-lg print:p-0 print:border-0">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">BIODATA</h2>
            </div>

            <div class="mb-6">
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">Kegiatan</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.nama_kegiatan || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">Waktu</div>
                <div class="text-center">:</div>
                <div>{{ formatDateRange(selectedPesertaBiodata.tanggal_mulai, selectedPesertaBiodata.tanggal_selesai) }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">Tempat</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.lokasi || '-' }}</div>
              </div>
            </div>

            <div class="mb-4">
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">1. Nama</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.nama_lengkap || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">2. NIP</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.nip || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">3. Pangkat/Golongan</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.pangkat || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">4. Nama Instansi</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.nama_instansi || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">5. Jabatan Kedinasan</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.jabatan || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">6. Kabupaten/Kota</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.kab_kota || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">7. No. HP/WhatsApp</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.no_hp || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">8. E-Mail</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.email || '-' }}</div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="font-semibold">9. Peran Dalam Kegiatan</div>
                <div class="text-center">:</div>
                <div>{{ selectedPesertaBiodata.peran || 'Peserta' }}</div>
              </div>
            </div>

            <!-- Tables Section -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <!-- Ceklist Kelengkapan Administrasi -->
              <div>
                <div class="text-center font-semibold mb-2 border border-gray-300 bg-gray-50 py-1">
                  Ceklist Kelengkapan Administrasi
                </div>
                <table class="w-full border border-gray-300 text-sm">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-2 py-1 text-left w-8">No</th>
                      <th class="border border-gray-300 px-2 py-1 text-left">Dokumen</th>
                      <th class="border border-gray-300 px-2 py-1 text-center w-10">✓</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(doc, idx) in administrasiDocs" :key="idx">
                      <td class="border border-gray-300 px-2 py-1">{{ idx + 1 }}</td>
                      <td class="border border-gray-300 px-2 py-1">{{ doc }}</td>
                      <td class="border border-gray-300 px-2 py-1 text-center"></td>
                    </tr>
                    <!-- <tr v-for="i in 5" :key="`empty-${i}`">
                      <td class="border border-gray-300 px-2 py-1">{{ administrasiDocs.length + i }}</td>
                      <td class="border border-gray-300 px-2 py-1"></td>
                      <td class="border border-gray-300 px-2 py-1 text-center"></td>
                    </tr> -->
                  </tbody>
                </table>
              </div>

              <!-- Kelengkapan Kegiatan -->
              <div>
                <div class="text-center font-semibold mb-2 border border-gray-300 bg-gray-50 py-1">
                  Kelengkapan Kegiatan
                </div>
                <table class="w-full border border-gray-300 text-sm">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-2 py-1 text-left w-8">No</th>
                    <th class="border border-gray-300 px-2 py-1 text-left">Nama Barang</th>
                    <!-- <th class="border border-gray-300 px-2 py-1 text-left">Spesifikasi</th> -->
                    <th class="border border-gray-300 px-2 py-1 text-center w-20">Jumlah</th>
                    <!-- <th class="border border-gray-300 px-2 py-1 text-left">Keterangan</th> -->
                  </tr>
                </thead>
                <tbody>
                  <template v-if="selectedPesertaBiodata.daftar_atk && selectedPesertaBiodata.daftar_atk.length">
                    <tr v-for="(atk, idx) in selectedPesertaBiodata.daftar_atk" :key="idx">
                      <td class="border border-gray-300 px-2 py-1">{{ idx + 1 }}</td>
                      <td class="border border-gray-300 px-2 py-1">{{ atk.nama_barang || '-' }}</td>
                      <!-- <td class="border border-gray-300 px-2 py-1">{{ atk.spesifikasi || '-' }}</td> -->
                      <td class="border border-gray-300 px-2 py-1 text-center">
                        {{ atk.jumlah !== null && atk.jumlah !== undefined ? atk.jumlah : '-' }}
                        <span v-if="atk.satuan" class="text-gray-600">{{ atk.satuan }}</span>
                      </td>
                      <!-- <td class="border border-gray-300 px-2 py-1">{{ atk.keterangan || '-' }}</td> -->
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="i in 5" :key="`empty-atk-${i}`">
                      <td class="border border-gray-300 px-2 py-1">{{ i }}</td>
                      <td class="border border-gray-300 px-2 py-1"></td>
                      <td class="border border-gray-300 px-2 py-1"></td>
                    </tr>
                  </template>
                </tbody>
              </table>
              </div>
            </div>

            <!-- Daftar ATK -->
            <!--  -->

            <!-- Signature Section -->
            <div class="mt-8 text-right items-end flex flex-col">
              <div class="mb-4">{{ selectedPesertaBiodata.kabupaten_kota || 'Mataram' }}, {{ formatDate(selectedPesertaBiodata.tanggal_mulai) }}</div>
              <!-- <div class="font-semibold mb-20">Yang Membuat</div> -->
              <div><img :src="base +'/storage/'+ selectedPesertaBiodata.tanda_tangan" width="200" srcset=""></div>
              <div class="font-semibold">{{ selectedPesertaBiodata.nama_lengkap || '-' }}</div>
              <div>NIP {{ selectedPesertaBiodata.nip || '-' }}</div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-gray-200 px-6 pb-6 print:hidden">
          <button @click="showBiodataModal = false"
            class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Tutup</button>
          <button @click="printBiodata"
            class="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700">Cetak</button>
        </div>
      </div>
    </div>

    <div v-if="showAllBiodataModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h3 class="text-2xl font-bold text-gray-800">Biodata Semua Peserta</h3>
          <button @click="closeAllBiodataModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          <div v-if="filteredPeserta.length === 0" class="text-center text-gray-500">
            Tidak ada peserta untuk ditampilkan.
          </div>

          <div v-for="(p, index) in filteredPeserta" :key="p.id_peserta || index" class="border border-gray-200 rounded-xl p-4 bg-white">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <p class="text-sm text-slate-500">Peserta {{ index + 1 }}</p>
                <h4 class="text-lg font-semibold text-slate-900">{{ p.nama_lengkap || '-' }}</h4>
              </div>
              <div class="text-sm text-slate-500">ID: {{ p.id_peserta || '-' }}</div>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="grid grid-cols-[140px_1px_auto] gap-2 items-center">
                <span class="font-semibold">Kegiatan</span><span>:</span><span>{{ getNamaKegiatan(p.id_kegiatan) }}</span>
                <span class="font-semibold">Waktu</span><span>:</span><span>{{ formatDateRange(getKegiatanById(p.id_kegiatan)?.tanggal_mulai, getKegiatanById(p.id_kegiatan)?.tanggal_selesai) }}</span>
                <span class="font-semibold">Tempat</span><span>:</span><span>{{ getKegiatanById(p.id_kegiatan)?.lokasi || '-' }}</span>
                <span class="font-semibold">Peran</span><span>:</span><span>{{ p.peran || 'Peserta' }}</span>
                <span class="font-semibold">Jenis Kelamin</span><span>:</span><span>{{ p.jenis_kelamin || '-' }}</span>
                <span class="font-semibold">Tanggal Lahir</span><span>:</span><span>{{ p.tanggal_lahir ? formatDate(p.tanggal_lahir) : '-' }}</span>
                <span class="font-semibold">NIP</span><span>:</span><span>{{ p.nip || '-' }}</span>
                <span class="font-semibold">Pangkat/Golongan</span><span>:</span><span>{{ [p.pangkat, p.gol].filter(Boolean).join(' / ') || '-' }}</span>
              </div>

              <div class="grid grid-cols-[140px_1px_auto] gap-2 items-center">
                <span class="font-semibold">Email</span><span>:</span><span>{{ p.email || '-' }}</span>
                <span class="font-semibold">No. HP</span><span>:</span><span>{{ p.no_hp || '-' }}</span>
                <span class="font-semibold">Instansi</span><span>:</span><span>{{ p.nama_instansi || '-' }}</span>
                <span class="font-semibold">NPSN</span><span>:</span><span>{{ p.npsn || '-' }}</span>
                <span class="font-semibold">Alamat</span><span>:</span><span>{{ p.alamat_instansi || '-' }}</span>
                <span class="font-semibold">Kabupaten/Kota</span><span>:</span><span>{{ p.kab_kota || p.kabupaten_kota || '-' }}</span>
                <span class="font-semibold">Provinsi</span><span>:</span><span>{{ p.provinsi || '-' }}</span>
                <span class="font-semibold">Telepon Instansi</span><span>:</span><span>{{ p.telp_instansi || '-' }}</span>
                <span class="font-semibold">Email Instansi</span><span>:</span><span>{{ p.email_instansi || '-' }}</span>
                <span class="font-semibold">NPWP/NIK</span><span>:</span><span>{{ p.npwp_nik || '-' }}</span>
                <span class="font-semibold">Provider Pulsa</span><span>:</span><span>{{ p.provider_pulsa || '-' }}</span>
                <span class="font-semibold">Nomor Rekening</span><span>:</span><span>{{ p.nomor_rekening || '-' }}</span>
                <span class="font-semibold">Nama Bank</span><span>:</span><span>{{ p.nama_bank || '-' }}</span>
                <span class="font-semibold">No. Surat Tugas</span><span>:</span><span>{{ p.no_surat_tugas || '-' }}</span>
                <span class="font-semibold">Tanggal Surat Tugas</span><span>:</span><span>{{ p.tanggal_surat_tugas ? formatDate(p.tanggal_surat_tugas) : '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-gray-200 px-6 pb-6">
          <button @click="closeAllBiodataModal"
            class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import database from '@/data/index.js'
import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'
import { ActivityEvents } from '@/services/activityLogger'

import * as XLSX from 'xlsx'
import { parseDocxPreservingFormat, replacePlaceholdersInXml, generateDocxFromXml, processDocxTemplate } from '@/utils/docxUtils.js'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import { getKegiatan } from '@/services/kegiatan'
import { buildPublicUrl, buildStorageUrl, getApiHostBase } from '@/utils/url'

export default {
  name: 'Peserta',
  props: {
    kegiatanId: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const base = getApiHostBase()
    const authStore = useAuthStore()
    const currentUser = computed(() => authStore.currentUser || {})
    const peserta = ref([])
    const kegiatan = ref([])
    const kegiatanDetailCache = ref(new Map())
    const pegawai = ref(database.pegawai)
    const sertifikat = ref([])
    const isLoadingPeserta = ref(false)

    const showAddModal = ref(false)
    const showDetailModal = ref(false)
    const showSertifikatModal = ref(false)
    const showBiodataModal = ref(false)
    const showAllBiodataModal = ref(false)
    const editingPeserta = ref(false)
    const selectedPeserta = ref(null)
    const selectedPesertaBiodata = ref(null)
    const formErrors = ref([])
    const isDownloadingBatchDocx = ref(false)
    const administrasiDocs = ref([
      'Surat Tugas',
      'SPPD',
      'Tiket Pergi (Pulau Sumbawa)',
      'Tiket Pulang (Pulau Sumbawa)',
      'Nota Bensin (Pulau Lombok)'
    ])

    const searchNama = ref('')
    const filterKegiatan = ref(props.kegiatanId || '')
    const filterStatus = ref('')
    const filterKabKota = ref('')

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
        const data = await fetchAPI('kegiatan/all')
        
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
      npsn: '',
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
        npsn: '',
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
      if (formPeserta.value.npsn && !/^\d+$/.test(formPeserta.value.npsn)) {
        formErrors.value.push('NPSN hanya boleh berisi angka')
      }
      return formErrors.value.length === 0
    }

    const onNpsnInput = () => {
      formPeserta.value.npsn = String(formPeserta.value.npsn || '').replace(/\D/g, '')
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
        const namaMatch = (p.nama_lengkap || '').toLowerCase().includes(searchNama.value.toLowerCase())
        const kegiatanMatch = !filterKegiatan.value || p.id_kegiatan == filterKegiatan.value
        const statusMatch = !filterStatus.value || (filterStatus.value === 'aktif' && p.id_peserta) || filterStatus.value === 'nonaktif'
        const kabKotaPeserta = String(p.kab_kota || p.kabupaten_kota || '').trim()
        const kabKotaMatch = !filterKabKota.value || kabKotaPeserta === filterKabKota.value
        return namaMatch && kegiatanMatch && statusMatch && kabKotaMatch
      })
    })

    const uniqueKabKota = computed(() => {
      const kabupatenSet = new Set()

      peserta.value.forEach((p) => {
        const kabupaten = String(p.kab_kota || p.kabupaten_kota || '').trim()
        if (kabupaten) {
          kabupatenSet.add(kabupaten)
        }
      })

      return Array.from(kabupatenSet).sort((a, b) => a.localeCompare(b, 'id'))
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

    const getPesertaBiodata = (p) => {
      const kegiatanData = getKegiatanById(p.id_kegiatan) || {}
      return {
        ...p,
        nama_kegiatan: getNamaKegiatan(p.id_kegiatan),
        tanggal_mulai: kegiatanData.tanggal_mulai || '',
        tanggal_selesai: kegiatanData.tanggal_selesai || '',
        lokasi: kegiatanData.lokasi || '-',
        pangkat_golongan: [p.pangkat, p.gol].filter(Boolean).join(' / ') || '',
        jabatan_kedinasan: p.jabatan || '',
        kabupaten_kota: p.kab_kota || p.kabupaten_kota || '',
        tanda_tangan: p.tanda_tangan || p.tanda_tangan_url || p.tandatangan || ''
      }
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

    const getKegiatanById = (idKegiatan) => {
      return kegiatan.value.find(k => String(k.id_kegiatan) === String(idKegiatan))
    }

    const currentUserId = computed(() => {
      return currentUser.value?.id_pegawai || currentUser.value?.id || currentUser.value?.id_user || null
    })

    const normalizeIdValue = (value) => {
      if (value === undefined || value === null || value === '') return []
      if (Array.isArray(value)) return value.filter(v => v !== undefined && v !== null && v !== '')
      if (typeof value === 'object') {
        return [value.id, value.id_pegawai, value.id_user, value.user_id].filter(v => v !== undefined && v !== null && v !== '')
      }
      return [value]
    }

    const isKegiatanCreator = (kegiatanId) => {
      const keg = getKegiatanById(kegiatanId)
      if (!keg || !currentUserId.value) return false
      const creatorIds = [
        ...normalizeIdValue(keg.created_by),
        ...normalizeIdValue(keg.created_by_id),
        ...normalizeIdValue(keg.id_user),
        ...normalizeIdValue(keg.user_id),
        ...normalizeIdValue(keg.id_pegawai)
      ]
      return creatorIds.some(id => String(id) === String(currentUserId.value))
    }

    const canModifySelectedPeserta = computed(() => {
      return selectedPeserta.value ? isKegiatanCreator(selectedPeserta.value.id_kegiatan) : false
    })

    const waitForWindowImages = (win) => {
      return new Promise((resolve) => {
        try {
          const images = win.document.images
          if (!images || images.length === 0) {
            resolve()
            return
          }

          let loadedCount = 0
          const total = images.length
          const finish = () => {
            loadedCount += 1
            if (loadedCount >= total) {
              resolve()
            }
          }

          Array.from(images).forEach((img) => {
            if (img.complete) {
              finish()
            } else {
              img.addEventListener('load', finish)
              img.addEventListener('error', finish)
            }
          })
        } catch (error) {
          resolve()
        }
      })
    }

    const printBiodata = () => {
      const printContent = document.getElementById('biodata-content')
      if (!printContent) return

      // Clone the content to manipulate before printing
      const clonedContent = printContent.cloneNode(true)
      
      // Remove print:hidden elements from clone
      const hiddenElements = clonedContent.querySelectorAll('.print\\:hidden, [class*="print:hidden"]')
      hiddenElements.forEach(el => el.remove())

      const printWindow = window.open('', '', 'width=1200,height=800')
      if (!printWindow) return

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Biodata</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 12pt;
              line-height: 1;
              padding: 15mm;
              color: #000;
            }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .mb-6 { margin-bottom: 1rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mt-8 { margin-top: 2rem; }
            .text-right { text-align: right; }
            
            h2 {
              font-size: 18pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 20px;
              text-transform: uppercase;
            }
            
            .info-section {
              margin-bottom: 20px;
            }
            
            .info-row {
              display: flex;
              margin-bottom: 6px;
            }
            
            .info-label {
              width: 200px;
              font-weight: 600;
            }
            
            .info-separator {
              width: 20px;
              text-align: center;
            }
            
            .info-value {
              flex: 1;
            }
            
            /* Tables Container - Side by Side */
            .tables-container {
              display: flex;
              gap: 20px;
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            
            .table-box {
              flex: 1;
              min-width: 0;
            }
            
            .table-title {
              text-align: center;
              font-weight: bold;
              border: 1px solid #000;
              background-color: #f5f5f5 !important;
              padding: 8px;
              margin-bottom: 0;
              font-size: 11pt;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 0;
              font-size: 10pt;
              page-break-inside: avoid;
            }
            
            th, td {
              border: 1px solid #000;
              padding: 6px 8px;
              text-align: left;
              font-size: 10pt;
            }
            
            th {
              background-color: #f0f0f0 !important;
              font-weight: bold;
              text-align: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .signature-section {
              margin-top: 40px;
              text-align: right;
              page-break-inside: avoid;
            }
            
            @media print {
              @page {
                margin: 15mm;
                size: A4;
              }
              body {
                padding: 15mm;
              }
            }
          </style>
        </head>
        <body>
          ${generateBiodataHTML(clonedContent)}
        </body>
        </html>
      `)
      printWindow.document.close()
      waitForWindowImages(printWindow).then(() => {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      })
    }

    const getAbsoluteImageUrl = (path) => {
      if (!path) return ''
      if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
      if (path.startsWith('/')) {
        return buildPublicUrl(path)
      }
      return buildStorageUrl(path.replace(/^storage\//, ''))
    }

    const fetchImageAsDataUrl = async (imageUrl) => {
      if (!imageUrl) return ''
      try {
        const response = await fetch(imageUrl)
        if (!response.ok) return ''
        const blob = await response.blob()
        return await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result || '')
          reader.onerror = () => resolve('')
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        return ''
      }
    }

    const buildAdministrasiTableHTML = () => {
      const rows = administrasiDocs.value.map((doc, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${doc}</td>
          <td></td>
        </tr>
      `).join('')

      return `
        <div class="table-box">
          <div class="table-title">Ceklist Kelengkapan Administrasi</div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Dokumen</th>
                <th>✓</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `
    }

    const buildKelengkapanTableHTML = (daftarAtk) => {
      const items = (daftarAtk && daftarAtk.length > 0) ? daftarAtk : Array.from({ length: 5 }, () => ({}))
      const rows = items.map((atk, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${atk.nama_barang || '-'}</td>
          <td>${atk.jumlah !== undefined && atk.jumlah !== null ? atk.jumlah : '-'}</td>
        </tr>
      `).join('')

      return `
        <div class="table-box">
          <div class="table-title">Kelengkapan Kegiatan</div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `
    }

    const buildSignatureSectionHTML = (p, kegiatanData, signatureDataUrl = '') => {
      const lokasi = p.kab_kota || p.kabupaten_kota || kegiatanData.lokasi || '-'
      const tanggal = formatDate(kegiatanData.tanggal_mulai)
      const rawImagePath = p.tanda_tangan || p.tanda_tangan_url || p.tandatangan
      const imageUrl = signatureDataUrl || getAbsoluteImageUrl(rawImagePath)

      return `
        <div class="signature-section">
          <div class="signature-meta">${lokasi}, ${tanggal}</div>`+
         ` ${imageUrl ? `<div class="signature-image"><img src="${imageUrl}" alt="Tanda Tangan"></div>` : ''}` +
          `<div class="signature-name">${p.nama_lengkap || '-'}</div>
          <div class="signature-nip">NIP ${p.nip || '-'}</div>
        </div>
      `
    }

    const buildBiodataSectionHTML = (p, index) => {
      const kegiatanData = getKegiatanById(p.id_kegiatan) || {}
      const namaKegiatan = getNamaKegiatan(p.id_kegiatan)
      const pangkatGolongan = [p.pangkat, p.gol].filter(Boolean).join(' / ') || '-'
      const kabupatenKota = p.kab_kota || p.kabupaten_kota || '-'
      const peran = p.peran || 'Peserta'
      const waktu = formatDateRange(kegiatanData.tanggal_mulai, kegiatanData.tanggal_selesai)
      const lokasi = kegiatanData.lokasi || '-'
      const daftarAtk = kegiatanData.daftar_atk || []

      return `
        <div class="biodata-card">
          <div class="text-center mb-4">
            <h2>Biodata</h2>
          </div>

          <div class="info-section mb-4">
            <div class="info-row">
              <div class="info-label">Kegiatan</div>
              <div class="info-separator">:</div>
              <div class="info-value">${namaKegiatan}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Waktu</div>
              <div class="info-separator">:</div>
              <div class="info-value">${waktu}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Tempat</div>
              <div class="info-separator">:</div>
              <div class="info-value">${lokasi}</div>
            </div>
          </div>

          <div class="info-section">
            <div class="info-row">
              <div class="info-label">1. Nama</div>
              <div class="info-separator">:</div>
              <div class="info-value">${p.nama_lengkap || '-'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">2. NIP</div>
              <div class="info-separator">:</div>
              <div class="info-value">${p.nip || '-'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">3. Pangkat/Golongan</div>
              <div class="info-separator">:</div>
              <div class="info-value">${pangkatGolongan}</div>
            </div>
            <div class="info-row">
              <div class="info-label">4. Nama Instansi</div>
              <div class="info-separator">:</div>
              <div class="info-value">${p.nama_instansi || '-'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">5. Jabatan Kedinasan</div>
              <div class="info-separator">:</div>
              <div class="info-value">${p.jabatan_kedinasan || p.jabatan || '-'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">6. Kabupaten/Kota</div>
              <div class="info-separator">:</div>
              <div class="info-value">${kabupatenKota}</div>
            </div>
            <div class="info-row">
              <div class="info-label">7. No. HP/WhatsApp</div>
              <div class="info-separator">:</div>
              <div class="info-value">${p.no_hp || '-'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">8. E-Mail</div>
              <div class="info-separator">:</div>
              <div class="info-value">${p.email || '-'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">9. Peran Dalam Kegiatan</div>
              <div class="info-separator">:</div>
              <div class="info-value">${peran}</div>
            </div>
          </div>

          <div class="tables-row">
            ${buildAdministrasiTableHTML()}
            ${buildKelengkapanTableHTML(daftarAtk)}
          </div>

          ${buildSignatureSectionHTML(p, kegiatanData)}
        </div>
      `
    }

    const printAllBiodata = async () => {
      if (!filteredPeserta.value || filteredPeserta.value.length === 0) return

      const printWindow = window.open('', '', 'width=1200,height=800')
      if (!printWindow) return

      const title = 'Biodata'
      const sections = []

      for (let index = 0; index < filteredPeserta.value.length; index += 1) {
        const p = filteredPeserta.value[index]
        sections.push(buildBiodataSectionHTML(p, index + 1))
      }

      const htmlContent = sections.join(`
        <div class="page-break"></div>
      `)

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 14pt;
              line-height: 1;
              padding: 15mm;
              color: #000;
            }
            .text-center { text-align: center; }
            h2 {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 16px;
              text-transform: uppercase;
            }
            .info-section {
              margin-bottom: 18px;
            }
            .info-row {
              display: flex;
              margin-bottom: 6px;
            }
            .info-label {
              width: 220px;
              font-weight: 600;
            }
            .info-separator {
              width: 20px;
              text-align: center;
            }
            .info-value {
              flex: 1;
            }
            .biodata-card {
              page-break-inside: avoid;
            }
            .tables-row {
              display: flex;
              gap: 20px;
              margin-bottom: 24px;
              page-break-inside: avoid;
              flex-wrap: wrap;
            }
            .table-box {
              flex: 1;
              min-width: 0;
            }
            .table-title {
              font-weight: 600;
              border: 1px solid #000;
              background-color: #f5f5f5;
              padding: 8px;
              margin-bottom: 8px;
              text-align: center;
              font-size: 14pt;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 0;
              font-size: 12pt;
              page-break-inside: avoid;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px 8px;
              text-align: left;
              font-size: 12pt;
            }
            th {
              background-color: #f0f0f0 !important;
              font-weight: bold;
              text-align: center;
            }
            .signature-section {
              margin-top: 20px;
              text-align: right;
              page-break-inside: avoid;
            }
            .signature-meta {
              margin-bottom: 10px;
              font-weight: 600;
            }
            .signature-section {
              margin-top: 20px;
              text-align: right;
              page-break-inside: avoid;
            }
            .signature-name {
              font-weight: 600;
            }
            .signature-nip {
              margin-top: 2px;
            }
            .page-break {
              page-break-after: always;
              margin: 30px 0;
            }
            @media print {
            *{
              font-size: 16pt !important;
            }
              @page {
                margin: 15mm;
                size: A4;
              }
              body {
                padding: 15mm;
              }
              .page-break {
                display: block;
              }
            }
          </style>
        </head>
        <body>
          <div class="text-center mb-6"></div>
          ${htmlContent}
        </body>
        </html>
      `)

      printWindow.document.close()
      waitForWindowImages(printWindow).then(() => {
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      })
    }

    const generateBiodataHTML = (content) => {
      // Extract data from the cloned content
      const h2 = content.querySelector('h2')?.textContent || 'BIODATA'
      
      // Get info rows
      const infoRows = content.querySelectorAll('.grid-cols-3')
      let infoHTML = ''
      
      infoRows.forEach((row) => {
        const cells = row.querySelectorAll('div')
        if (cells.length >= 3) {
          infoHTML += `
            <div class="info-row">
              <div class="info-label">${cells[0].textContent}</div>
              <div class="info-separator">:</div>
              <div class="info-value">${cells[2].textContent}</div>
            </div>
          `
        }
      })
      
      // Get tables
      const tables = content.querySelectorAll('table')
      let tablesHTML = ''
      
      // First two tables side by side (Administrasi & Kelengkapan Kegiatan)
      if (tables.length >= 2) {
        const table1Title = tables[0].closest('.grid, div')?.querySelector('.font-semibold')?.textContent || 'Ceklist Kelengkapan Administrasi'
        const table2Title = tables[1].closest('.grid, div')?.querySelector('.font-semibold')?.textContent || 'Kelengkapan Kegiatan'
        
        tablesHTML = `
          <div class="tables-container">
            <div class="table-box">
              <div class="table-title">${table1Title}</div>
              ${tableToHTML(tables[0])}
            </div>
            <div class="table-box">
              <div class="table-title">${table2Title}</div>
              ${tableToHTML(tables[1])}
            </div>
          </div>
        `
      }
      
      // Third table (ATK) - full width
      let atkHTML = ''
      if (tables.length >= 3) {
        const atkTitle = tables[2].closest('div')?.querySelector('.font-semibold')?.textContent || 'Daftar ATK'
        atkHTML = `
          <div class="mb-6">
            <div class="table-title" style="margin-bottom: 0;">${atkTitle}</div>
            ${tableToHTML(tables[2])}
          </div>
        `
      }
      
      // Get signature section
      const signatureSection = content.querySelector('.text-right.mt-8')
      let signatureHTML = ''
      if (signatureSection) {
        signatureHTML = signatureSection.innerHTML
      }
      
      // Split info rows into sections (first 3 = kegiatan info, rest = peserta info)
      const kegiatanInfo = infoHTML.split('</div>').slice(0, 3).join('</div>') + '</div>'
      const pesertaInfo = infoHTML.split('</div>').slice(3).join('</div>') + '</div>'
      
      return `
        <div class="text-center mb-6">
          <h2>${h2}</h2>
        </div>
        
        <div class="info-section">
          ${kegiatanInfo}
        </div>
        
        <div class="info-section">
          ${pesertaInfo}
        </div>
        
        ${tablesHTML}
        
        ${atkHTML}
        
        <div class="signature-section">
          ${signatureHTML}
        </div>
      `
    }

    const tableToHTML = (table) => {
      if (!table) return ''
      
      let html = '<table><thead><tr>'
      
      // Headers
      const headers = table.querySelectorAll('th')
      headers.forEach(th => {
        html += `<th style="background-color: #f0f0f0 !important;">${th.textContent}</th>`
      })
      
      html += '</tr></thead><tbody>'
      
      // Rows
      const rows = table.querySelectorAll('tbody tr')
      rows.forEach(row => {
        html += '<tr>'
        const cells = row.querySelectorAll('td')
        cells.forEach(td => {
          html += `<td>${td.textContent}</td>`
        })
        html += '</tr>'
      })
      
      html += '</tbody></table>'
      return html
    }

    const formatDateRange = (start, end) => {
      if (!start && !end) return '-'
      const format = (date) => {
        if (!date) return ''
        const d = new Date(date)
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      }
      if (start && end) {
        return `${format(start)} s.d. ${format(end)}`
      }
      return format(start) || format(end)
    }

    const openDetailModal = (p) => {
      selectedPeserta.value = p
      showDetailModal.value = true
    }

    const openBiodataModal = (p) => {
      const kegiatanData = getKegiatanById(p.id_kegiatan)
      selectedPesertaBiodata.value = {
        ...p,
        nama_kegiatan: getNamaKegiatan(p.id_kegiatan),
        tanggal_mulai: kegiatanData?.tanggal_mulai || '',
        tanggal_selesai: kegiatanData?.tanggal_selesai || '',
        lokasi: kegiatanData?.lokasi || '-',
        
        // Get ATK from kegiatan
        daftar_atk: kegiatanData?.daftar_atk || []
      }
      showBiodataModal.value = true
    }

    const openAllBiodataModal = () => {
      showAllBiodataModal.value = true
    }

    const closeAllBiodataModal = () => {
      showAllBiodataModal.value = false
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

    const savePeserta = async () => {
      if (!validateFormPeserta()) return
      const payload = { ...formPeserta.value }

      try {
        if (editingPeserta.value) {
          await updateAPI('peserta', formPeserta.value.id_peserta, payload)
          ActivityEvents.UPDATE_PESERTA(formPeserta.value.nama_lengkap)
        } else {
          await postAPI('peserta', payload)
          ActivityEvents.CREATE_PESERTA(formPeserta.value.nama_lengkap)
        }
        await loadPesertaFromAPI()
        closeAddModal()
      } catch (error) {
        console.error('[PesertaManagement] Gagal menyimpan peserta:', error)
        alert(error.message || 'Gagal menyimpan data peserta ke API')
      }
    }

    const deletePeserta = async (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
        const deletedPeserta = peserta.value.find(p => p.id_peserta === id)
        try {
          await deleteAPI('peserta', id)
          ActivityEvents.DELETE_PESERTA(deletedPeserta?.nama_lengkap || `ID ${id}`)
          await loadPesertaFromAPI()
        } catch (error) {
          console.error('[PesertaManagement] Gagal menghapus peserta:', error)
          alert(error.message || 'Gagal menghapus data peserta dari API')
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
      const buildSignatureUrl = (sig) => {
        if (!sig) return ''
        if (typeof sig !== 'string') return ''
        if (sig.startsWith('http')) return sig
        if (sig.startsWith('data:')) return sig
        return buildStorageUrl(sig)
      }

      // Prepare rows with desired fields including signature URL
      const rows = filteredPeserta.value.map(p => {
        const signature = p.tanda_tangan_url || p.tanda_tangan || p.tandatangan || ''
        return {
          // id_peserta: p.id_peserta,
          // id_kegiatan: p.id_kegiatan,
          nama_kegiatan: getNamaKegiatan(p.id_kegiatan),
          nama_lengkap: p.nama_lengkap,
          nip: p.nip || '',
          nik: p.npwp_nik || '',
          'pangkat/golongan': p.pangkat || '',
          jabatan: p.jabatan || '',
          email: p.email || '',
          no_hp: p.no_hp || '',
          nama_instansi: p.nama_instansi || '',
          npsn: p.npsn || '',
          alamat_instansi: p.alamat_instansi || '',          
          kab_kota: p.kab_kota || '',
          provinsi: p.provinsi || '',
          peran: p.peran || '',
          jenis_kelamin: p.jenis_kelamin || '',
          tanggal_lahir: p.tanggal_lahir ? new Date(p.tanggal_lahir).toLocaleDateString('id-ID') : '',
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

    const normalizeAtkJumlah = (value) => {
      if (value === '' || value === null || value === undefined) return ''
      const parsed = Number(value)
      return Number.isNaN(parsed) ? String(value) : String(parsed)
    }

    const normalizeKegiatanAtkItem = (item) => ({
      nama_barang: String(item?.nama_barang ?? item?.nama_atk ?? '').trim(),
      spesifikasi: String(item?.spesifikasi ?? '').trim(),
      jumlah: normalizeAtkJumlah(item?.jumlah),
      satuan: String(item?.satuan ?? '').trim(),
      keterangan: String(item?.keterangan ?? '').trim()
    })

    const extractKegiatanAtkItems = (kegiatanItem) => {
      if (!kegiatanItem) return []

      let rows = []
      if (Array.isArray(kegiatanItem?.daftarAtk)) {
        rows = kegiatanItem.daftarAtk
      } else if (Array.isArray(kegiatanItem?.daftar_atk)) {
        rows = kegiatanItem.daftar_atk
      } else if (Array.isArray(kegiatanItem?.daftarAtk?.data)) {
        rows = kegiatanItem.daftarAtk.data
      } else if (Array.isArray(kegiatanItem?.daftar_atk?.data)) {
        rows = kegiatanItem.daftar_atk.data
      } else if (Array.isArray(kegiatanItem?.data?.daftarAtk)) {
        rows = kegiatanItem.data.daftarAtk
      } else if (Array.isArray(kegiatanItem?.data?.daftar_atk)) {
        rows = kegiatanItem.data.daftar_atk
      } else if (typeof kegiatanItem?.daftarAtk === 'string') {
        try {
          const parsed = JSON.parse(kegiatanItem.daftarAtk)
          if (Array.isArray(parsed)) rows = parsed
        } catch {
          rows = []
        }
      } else if (typeof kegiatanItem?.daftar_atk === 'string') {
        try {
          const parsed = JSON.parse(kegiatanItem.daftar_atk)
          if (Array.isArray(parsed)) rows = parsed
        } catch {
          rows = []
        }
      }

      return rows
        .map(normalizeKegiatanAtkItem)
        .filter(item => item.nama_barang)
    }

    const getKegiatanForDocx = async (idKegiatan) => {
      const cacheKey = String(idKegiatan ?? '')
      if (!cacheKey) return {}

      if (kegiatanDetailCache.value.has(cacheKey)) {
        return kegiatanDetailCache.value.get(cacheKey) || {}
      }

      const listItem = kegiatan.value.find(k => String(k.id_kegiatan) === cacheKey) || {}

      try {
        const detail = await getKegiatan(idKegiatan)
        const merged = { ...listItem, ...(detail || {}) }
        kegiatanDetailCache.value.set(cacheKey, merged)
        return merged
      } catch (error) {
        kegiatanDetailCache.value.set(cacheKey, listItem)
        return listItem
      }
    }

    const getNodeText = (node) => {
      if (!node) return ''
      return Array.from(node.getElementsByTagName('w:t'))
        .map(item => item.textContent || '')
        .join('')
        .trim()
    }

    const setCellText = (cell, text) => {
      if (!cell) return

      const doc = cell.ownerDocument
      const textNodes = cell.getElementsByTagName('w:t')
      const safeText = String(text ?? '')

      if (textNodes.length > 0) {
        textNodes[0].textContent = safeText
        if (safeText.includes(' ')) {
          textNodes[0].setAttribute('xml:space', 'preserve')
        }
        for (let i = 1; i < textNodes.length; i += 1) {
          textNodes[i].textContent = ''
        }
        return
      }

      const namespaceUri = cell.namespaceURI || 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
      let paragraph = cell.getElementsByTagName('w:p')[0]
      if (!paragraph) {
        paragraph = doc.createElementNS(namespaceUri, 'w:p')
        cell.appendChild(paragraph)
      }

      const run = doc.createElementNS(namespaceUri, 'w:r')
      const textNode = doc.createElementNS(namespaceUri, 'w:t')
      if (safeText.includes(' ')) {
        textNode.setAttribute('xml:space', 'preserve')
      }
      textNode.textContent = safeText
      run.appendChild(textNode)
      paragraph.appendChild(run)
    }

    const fillKelengkapanKegiatanTable = (xmlContent, atkItems = []) => {
      if (!xmlContent) return xmlContent

      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlContent, 'application/xml')
      const tables = Array.from(xmlDoc.getElementsByTagName('w:tbl'))
      const targetTable = tables.find((table) => getNodeText(table).includes('Kelengkapan Kegiatan'))
      if (!targetTable) return xmlContent

      const rows = Array.from(targetTable.getElementsByTagName('w:tr'))
      const headerIndex = rows.findIndex((row) => getNodeText(row).includes('Kelengkapan Kegiatan'))
      if (headerIndex === -1) return xmlContent

      let dataRows = rows.slice(headerIndex + 1).filter((row) => row.getElementsByTagName('w:tc').length >= 3)
      if (dataRows.length === 0) return xmlContent

      const rowTemplate = dataRows[dataRows.length - 1].cloneNode(true)

      while (dataRows.length < atkItems.length) {
        const clonedRow = rowTemplate.cloneNode(true)
        targetTable.appendChild(clonedRow)
        dataRows.push(clonedRow)
      }

      dataRows.forEach((row, index) => {
        const cells = Array.from(row.getElementsByTagName('w:tc'))
        if (cells.length < 3) return

        const numberCell = cells[cells.length - 3]
        const itemCell = cells[cells.length - 2]
        const qtyCell = cells[cells.length - 1]
        const item = atkItems[index]

        if (!item) {
          setCellText(numberCell, '')
          setCellText(itemCell, '')
          setCellText(qtyCell, '')
          return
        }

        const itemLabelParts = [item.nama_barang]
        if (item.spesifikasi) itemLabelParts.push(item.spesifikasi)
        if (item.keterangan) itemLabelParts.push(item.keterangan)
        const qtyLabel = [item.jumlah, item.satuan].filter(Boolean).join(' ').trim()

        setCellText(numberCell, String(index + 1))
        setCellText(itemCell, itemLabelParts.filter(Boolean).join(' - '))
        setCellText(qtyCell, qtyLabel || '-')
      })

      return new XMLSerializer().serializeToString(xmlDoc)
    }

    // Fungsi download DOCX dari data peserta dengan template DOCX
    const downloadPesertaDocx = async (pesertaData) => {
      try {
        // 1. Ambil template DOCX lokal dari public/template_peserta.docx
        const response = await fetch(buildPublicUrl('template_peserta.docx'))
        if (!response.ok) {
          throw new Error(`Template lokal tidak ditemukan (${response.status})`)
        }
        const templateDocx = await response.blob()

        // 2. Siapkan data untuk replace
        // Fungsi pencarian kegiatan toleran tipe data
        const norm = v => (v === undefined || v === null) ? '' : String(v).toLowerCase().trim()
        const cariKegiatan = (id) => {
          let found = kegiatan.value.find(k => norm(k.id_kegiatan) === norm(id))
          if (!found) found = kegiatan.value.find(k => String(k.id_kegiatan) === String(id))
          return found
        }
        const kegiatanRingkas = cariKegiatan(pesertaData.id_kegiatan) || {}
        const kegiatanDetail = await getKegiatanForDocx(pesertaData.id_kegiatan)
        const keg = { ...kegiatanRingkas, ...kegiatanDetail }
        const daftarAtk = extractKegiatanAtkItems(keg)
        const data = {
          judul_kegiatan: keg.nama_kegiatan || getNamaKegiatan(pesertaData.id_kegiatan),
          tanggal_mulai: dateFormat(keg.tanggal_mulai),
          tanggal_selesai: dateFormat(keg.tanggal_selesai),
          waktu : dateFormat(keg.tanggal_mulai)+' s.d. '+ dateFormat(keg.tanggal_selesai),
          lokasi: keg.lokasi || '-',
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
          kegiatan: keg.nama_kegiatan || getNamaKegiatan(pesertaData.id_kegiatan),
          peran: pesertaData.peran || 'Peserta',
          tanda_tangan_url: pesertaData.tanda_tangan_url || pesertaData.tanda_tangan || pesertaData.tandatangan || '',
          // Tambahkan field lain sesuai kebutuhan
        }

        // 3. Generate DOCX baru dari template dan isi tabel kelengkapan kegiatan
        const docxFilename = `${pesertaData.peran} - ${pesertaData.nama_lengkap}.docx`
        const xmlContent = await parseDocxPreservingFormat(templateDocx)
        const xmlWithPlaceholders = replacePlaceholdersInXml(xmlContent, data)
        const finalXml = fillKelengkapanKegiatanTable(xmlWithPlaceholders, daftarAtk)
        await generateDocxFromXml(finalXml, templateDocx, docxFilename)
      } catch (error) {
        console.error('Gagal download DOCX peserta :', error)
        alert(error.message || 'Gagal download DOCX peserta. Cek template lokal atau data.')
      }
    }

    const downloadBatchDocxZip = async () => {
      if (filteredPeserta.value.length === 0) {
        alert('Tidak ada peserta untuk diunduh secara batch.')
        return
      }

      isDownloadingBatchDocx.value = true
      try {
        const zip = new JSZip()
        const templateResponse = await fetch(buildPublicUrl('template_peserta.docx'))
        if (!templateResponse.ok) {
          throw new Error(`Template lokal tidak ditemukan (${templateResponse.status})`)
        }
        const templateDocx = await templateResponse.blob()

        for (const p of filteredPeserta.value) {
          const norm = v => (v === undefined || v === null) ? '' : String(v).toLowerCase().trim()
          const cariKegiatan = (id) => {
            let found = kegiatan.value.find(k => norm(k.id_kegiatan) === norm(id))
            if (!found) found = kegiatan.value.find(k => String(k.id_kegiatan) === String(id))
            return found
          }

          const kegiatanRingkas = cariKegiatan(p.id_kegiatan) || {}
          const kegiatanDetail = await getKegiatanForDocx(p.id_kegiatan)
          const keg = { ...kegiatanRingkas, ...kegiatanDetail }
          const daftarAtk = extractKegiatanAtkItems(keg)
          const data = {
            judul_kegiatan: keg.nama_kegiatan || getNamaKegiatan(p.id_kegiatan),
            tanggal_mulai: dateFormat(keg.tanggal_mulai),
            tanggal_selesai: dateFormat(keg.tanggal_selesai),
            waktu: dateFormat(keg.tanggal_mulai) + ' s.d. ' + dateFormat(keg.tanggal_selesai),
            lokasi: keg.lokasi || '-',
            nama_lengkap: p.nama_lengkap,
            nip: p.nip,
            pangkat: p.pangkat,
            instansi: p.nama_instansi,
            jabatan: p.jabatan,
            kabupaten_kota: p.kab_kota,
            provinsi: p.provinsi,
            no_hp: p.no_hp,
            email: p.email,
            nama_instansi: p.nama_instansi,
            kegiatan: keg.nama_kegiatan || getNamaKegiatan(p.id_kegiatan),
            peran: p.peran || 'Peserta',
            tanda_tangan_url: p.tanda_tangan_url || p.tanda_tangan || p.tandatangan || ''
          }

          const xmlContent = await parseDocxPreservingFormat(templateDocx)
          const xmlWithPlaceholders = replacePlaceholdersInXml(xmlContent, data)
          const finalXml = fillKelengkapanKegiatanTable(xmlWithPlaceholders, daftarAtk)
          const docxBlob = await generateDocxFromXml(finalXml, templateDocx, null)
          zip.file(`peserta_${p.id_peserta || Math.random().toString(36).slice(2, 8)}.docx`, docxBlob)
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = window.URL.createObjectURL(zipBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `peserta_batch_${new Date().toISOString().slice(0,10)}.zip`
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      } catch (error) {
        console.error('Gagal download batch DOCX peserta:', error)
        alert(error.message || 'Gagal download batch DOCX peserta. Pastikan template biodata .docx sudah diupload pada kegiatan.')
      } finally {
        isDownloadingBatchDocx.value = false
      }
    }

    return {
      base,
      peserta,
      kegiatan,
      pegawai,
      sertifikat,
      isLoadingPeserta,
      showAddModal,
      showDetailModal,
      showSertifikatModal,
      showBiodataModal,
      showAllBiodataModal,
      editingPeserta,
      selectedPeserta,
      selectedPesertaBiodata,
      administrasiDocs,
      formErrors,
      searchNama,
      filterKegiatan,
      filterStatus,
      filterKabKota,
      formPeserta,
      formSertifikat,
      filteredPeserta,
      uniqueKabKota,
      pesertaAktif,
      pesertaBersertifikat,
      filteredPesertaAktif,
      filteredPesertaBersertifikat,
      sertifikatPeserta,
      getNamaKegiatan,
      getKegiatanById,
      getSertifikatStatus,
      getSertifikatBadgeClass,
      formatDate,
      formatDateRange,
      openDetailModal,
      openBiodataModal,
      printBiodata,
      openEditModal,
      closeAddModal,
      canModifySelectedPeserta,
      onNpsnInput,
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
      downloadBatchDocxZip,
      isDownloadingBatchDocx,
      openAllBiodataModal,
      closeAllBiodataModal,
      printAllBiodata,
      getPesertaBiodata,
      isKegiatanCreator
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

/* Print Styles */
@media print {
  @page {
    margin: 15mm;
    size: A4;
  }
  
  body * {
    visibility: hidden;
  }
  
  #biodata-content,
  #biodata-content * {
    visibility: visible;
  }
  
  #biodata-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0 !important;
    border: none !important;
  }
  
  .print\\:hidden {
    display: none !important;
  }
  
  .print\\:p-0 {
    padding: 0 !important;
  }
  
  .print\\:border-0 {
    border: none !important;
  }
  
  /* Force table colors for print */
  th {
    background-color: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .bg-gray-50,
  .bg-gray-100 {
    background-color: #f5f5f5 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
