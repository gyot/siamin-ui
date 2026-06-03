<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Manajemen Pegawai & User</h1>
          <p class="text-xs sm:text-sm text-gray-600">Kelola data pegawai dan akun user admin</p>
        </div>
        <!-- <div class="flex gap-2">
          <button
            @click="$refs.fileInput?.click()"
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            Import Excel
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls"
            @change="handleImportFile"
            style="display: none"
          />
          <button
            @click="showAddPegawaiModal = true"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            + Tambah Pegawai
          </button>
        </div> -->
      </div>

      <!-- Filter dan Search -->
      <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Cari Nama</label>
            <input
              v-model="searchNama"
              type="text"
              placeholder="Ketik nama pegawai..."
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
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter Golongan</label>
            <select
              v-model="filterGolongan"
              class="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Golongan</option>
              <option v-for="gol in uniqueGolongan" :key="gol" :value="gol">
                {{ gol }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Statistik -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Pegawai</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ filteredPegawai.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Pegawai Aktif</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ filteredPegawaiAktif.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">User Terdaftar</p>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600">{{ users.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p class="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">User Aktif</p>
          <p class="text-2xl sm:text-3xl font-bold text-orange-600">{{ userAktif.length }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 border-b border-gray-200">
        <button
          @click="activeTab = 'pegawai'"
          :class="[
            'px-4 sm:px-6 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors',
            activeTab === 'pegawai'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          ]"
        >
          Data Pegawai
        </button>
        <!-- <button
          @click="activeTab = 'user'"
          :class="[
            'px-4 sm:px-6 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors',
            activeTab === 'user'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          ]"
        >
          Data User Admin
        </button> -->
      </div>

      <!-- Tab: Data Pegawai -->
      <div v-if="activeTab === 'pegawai'" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">No</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Nama</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">NIP</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Jabatan</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Golongan</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Unit Kerja</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Status</th>
                <th class="px-4 py-3 text-center text-xs sm:text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="filteredPegawai.length === 0" class="hover:bg-gray-50">
                <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                  <p class="text-sm sm:text-base">Tidak ada data pegawai</p>
                </td>
              </tr>
              <tr v-for="(p, index) in filteredPegawai" :key="p.id_pegawai" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-gray-800 font-medium">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-gray-800 font-medium">{{ p.nama }}</td>
                <td class="px-4 py-3 text-gray-600">{{ p.nip }}</td>
                <td class="px-4 py-3 text-gray-600">{{ p.nama_jabatan }}</td>
                <td class="px-4 py-3 text-gray-600">{{ p.golongan }}</td>
                <td class="px-4 py-3 text-gray-600">{{ p.unit_kerja }}</td>
                <td class="px-4 py-3">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    p.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ p.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="viewDetailPegawai(p.id_pegawai)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition mr-2"
                    title="Lihat Detail"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <!-- <button
                    @click="editPegawai(p.id_pegawai)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition mr-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="deletePegawai(p.id_pegawai)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Data User Admin -->
      <div v-if="activeTab === 'user'" class="mb-6">
        <button
          @click="showAddUserModal = true"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
        >
          + Tambah User Admin
        </button>
      </div>
      <div v-if="activeTab === 'user'" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">No</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Email</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Role</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Pegawai</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Status</th>
                <th class="px-4 py-3 text-left text-xs sm:text-sm">Last Login</th>
                <th class="px-4 py-3 text-center text-xs sm:text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="users.length === 0" class="hover:bg-gray-50">
                <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                  <p class="text-sm sm:text-base">Tidak ada data user</p>
                </td>
              </tr>
              <tr v-for="(u, index) in users" :key="u.id_user" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-gray-800 font-medium">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-gray-800 font-medium">{{ u.email }}</td>
                <td class="px-4 py-3">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    u.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : u.role === 'operator'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ u.role }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ getNamaPegawai(u.id_pegawai) }}</td>
                <td class="px-4 py-3">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    u.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ u.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600 text-xs">
                  {{ formatDate(u.last_login) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="editUser(u.id_user)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition mr-2"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="deleteUser(u.id_user)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit Pegawai -->
    <div v-if="showAddPegawaiModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">{{ editingPegawaiId ? 'Edit' : 'Tambah' }} Pegawai</h3>
          <button @click="showAddPegawaiModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="savePegawai" class="p-6 space-y-4">
          <div v-if="formErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm font-medium text-red-800 mb-2">Ada kesalahan:</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="error in formErrors" :key="error" class="text-sm text-red-700">{{ error }}</li>
            </ul>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
              <input
                v-model="formPegawai.nama"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">NIP *</label>
              <input
                v-model="formPegawai.nip"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
              <input
                v-model="formPegawai.nama_jabatan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Golongan</label>
              <input
                v-model="formPegawai.golongan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit Kerja</label>
              <input
                v-model="formPegawai.unit_kerja"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pendidikan Terakhir</label>
              <input
                v-model="formPegawai.pendidikan_terakhir"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
              <input
                v-model="formPegawai.jurusan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
              <input
                v-model="formPegawai.tempat_lahir"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
              <input
                v-model="formPegawai.tanggal_lahir"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pangkat</label>
              <input
                v-model="formPegawai.pangkat"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">TMT CPNS</label>
              <input
                v-model="formPegawai.tmt_cpns"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">TMT Pangkat</label>
              <input
                v-model="formPegawai.tmt_pangkat"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Jabatan</label>
              <input
                v-model="formPegawai.nama_jabatan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">TMT Jabatan</label>
              <input
                v-model="formPegawai.tmt_jabatan"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tempat Pendidikan</label>
              <input
                v-model="formPegawai.tempat_pendidikan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Lulus</label>
              <input
                v-model="formPegawai.tahun_lulus"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Masa Kerja (Tahun)</label>
              <input
                v-model="formPegawai.masa_kerja_tahun"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Masa Kerja (Bulan)</label>
              <input
                v-model="formPegawai.masa_kerja_bulan"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Latihan Jabatan</label>
              <input
                v-model="formPegawai.latihan_jabatan"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Perkiraan Pensiun</label>
              <input
                v-model="formPegawai.perkiraan_pensiun"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Kepegawaian *</label>
              <select
                v-model="formPegawai.status_kepegawaian"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="formPegawai.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {{ editingPegawaiId ? 'Perbarui' : 'Simpan' }}
            </button>
            <button
              type="button"
              @click="showAddPegawaiModal = false"
              class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detail Pegawai -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">Detail Pegawai</h3>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Info Dasar -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p class="text-xs text-blue-600 font-semibold mb-1">NAMA</p>
              <p class="text-lg font-bold text-gray-800">{{ detailPegawai?.nama }}</p>
            </div>
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
              <p class="text-xs text-indigo-600 font-semibold mb-1">NIP</p>
              <p class="text-lg font-bold text-gray-800">{{ detailPegawai?.nip }}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <p class="text-xs text-purple-600 font-semibold mb-1">STATUS</p>
              <span :class="[
                'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                detailPegawai?.status === 'aktif'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              ]">
                {{ detailPegawai?.status }}
              </span>
            </div>
          </div>

          <!-- Info Kepegawaian -->
          <div class="border-t pt-4">
            <h4 class="text-md font-bold text-gray-800 mb-4">Informasi Kepegawaian</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">PANGKAT</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.pangkat }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">GOLONGAN</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.golongan }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">STATUS KEPEGAWAIAN</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.status_kepegawaian }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">JABATAN</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.nama_jabatan }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">UNIT KERJA</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.unit_kerja }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">TMT JABATAN</p>
                <p class="text-sm text-gray-800">{{ formatDate(detailPegawai?.tmt_jabatan) }}</p>
              </div>
            </div>
          </div>

          <!-- Info Pribadi -->
          <div class="border-t pt-4">
            <h4 class="text-md font-bold text-gray-800 mb-4">Informasi Pribadi</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">TEMPAT LAHIR</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.tempat_lahir }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">TANGGAL LAHIR</p>
                <p class="text-sm text-gray-800">{{ formatDate(detailPegawai?.tanggal_lahir) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">MASA KERJA</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.masa_kerja_tahun }} tahun {{ detailPegawai?.masa_kerja_bulan }} bulan</p>
              </div>
            </div>
          </div>

          <!-- Info Pendidikan -->
          <div class="border-t pt-4">
            <h4 class="text-md font-bold text-gray-800 mb-4">Informasi Pendidikan</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">PENDIDIKAN TERAKHIR</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.pendidikan_terakhir }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">JURUSAN</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.jurusan }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">TEMPAT PENDIDIKAN</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.tempat_pendidikan }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-semibold mb-1">TAHUN LULUS</p>
                <p class="text-sm text-gray-800">{{ detailPegawai?.tahun_lulus }}</p>
              </div>
            </div>
          </div>

          <!-- Keanggotaan Tim -->
          <div v-if="detailKeanggotaanTim.length > 0" class="border-t pt-4">
            <h4 class="text-md font-bold text-gray-800 mb-4">Keanggotaan Tim</h4>
            <div class="space-y-3">
              <div v-for="tim in detailKeanggotaanTim" :key="tim.id" class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p class="text-xs text-blue-600 font-semibold mb-1">UNIT KERJA</p>
                    <p class="text-sm font-medium text-gray-800">{{ getUnitKerjaName(tim.unit_kerja_id) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-blue-600 font-semibold mb-1">PERAN</p>
                    <p class="text-sm font-medium text-gray-800">{{ tim.peran }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-blue-600 font-semibold mb-1">SUB UNIT</p>
                    <p class="text-sm text-gray-800">{{ getSubUnitName(tim.sub_unit_kerja_id) || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-blue-600 font-semibold mb-1">TAHUN</p>
                    <p class="text-sm text-gray-800">{{ tim.tahun }}</p>
                  </div>
                </div>
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

    <!-- Modal Edit User -->
    <div v-if="showEditUserModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">Edit User</h3>
          <button @click="showEditUserModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div v-if="formUserErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm font-medium text-red-800 mb-2">Ada kesalahan:</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="error in formUserErrors" :key="error" class="text-sm text-red-700">{{ error }}</li>
            </ul>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                v-model="formUser.email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                v-model="formUser.role"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="verifikator">Verifikator</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                v-model="formUser.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pegawai</label>
              <input
                :value="getNamaPegawai(formUser.id_pegawai)"
                type="text"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-semibold text-gray-800 mb-4">Ubah Password</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password Baru (opsional)</label>
                <div class="relative">
                  <input
                    v-model="formUser.newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Minimum 6 karakter</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                <div class="relative">
                  <input
                    v-model="formUser.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Ulangi password baru"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
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
              @click="showEditUserModal = false"
              class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Tambah User Admin -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">Tambah User Admin</h3>
          <button @click="showAddUserModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveNewUser" class="p-6 space-y-4">
          <div v-if="formUserErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm font-medium text-red-800 mb-2">Ada kesalahan:</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="error in formUserErrors" :key="error" class="text-sm text-red-700">{{ error }}</li>
            </ul>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pegawai *</label>
              <select
                v-model.number="formNewUser.id_pegawai"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="null">Pilih Pegawai</option>
                <option v-for="p in pegawai" :key="p.id_pegawai" :value="p.id_pegawai">
                  {{ p.nama }} ({{ p.nip }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                v-model="formNewUser.email"
                type="email"
                placeholder="user@example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                v-model="formNewUser.role"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="verifikator">Verifikator</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                v-model="formNewUser.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div class="relative">
                <input
                  v-model="formNewUser.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Minimal 6 karakter"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password *</label>
              <div class="relative">
                <input
                  v-model="formNewUser.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Ulangi password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Simpan User
            </button>
            <button
              type="button"
              @click="showAddUserModal = false"
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
import database from '@/data/index.js'
import { ActivityEvents } from '@/services/activityLogger'
import { fetchAPI, postAPI, updateAPI } from '@/services/api'

export default {
  name: 'PegawaiManagement',
  setup() {
    const pegawai = ref(database.pegawai)
    const users = ref(database.users)

    const searchNama = ref('')
    const filterStatus = ref('')
    const filterGolongan = ref('')
    const activeTab = ref('pegawai')
    const showAddPegawaiModal = ref(false)
    const showAddUserModal = ref(false)
    const showEditUserModal = ref(false)
    const editingPegawaiId = ref(null)
    const editingUserId = ref(null)
    const formErrors = ref([])
    const formUserErrors = ref([])
    const showPassword = ref(false)

    const formPegawai = ref({
      id_pegawai: null,
      nip: '',
      nama: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      tmt_cpns: '',
      tmt_pangkat: '',
      pangkat: '',
      golongan: '',
      nama_jabatan: '',
      tmt_jabatan: '',
      unit_kerja: '',
      pendidikan_terakhir: '',
      jurusan: '',
      tempat_pendidikan: '',
      tahun_lulus: '',
      masa_kerja_tahun: '',
      masa_kerja_bulan: '',
      latihan_jabatan: '',
      perkiraan_pensiun: '',
      status_kepegawaian: 'PNS',
      status: 'aktif'
    })

    const formUser = ref({
      id_user: null,
      id_pegawai: null,
      email: '',
      role: 'operator',
      status: 'aktif',
      newPassword: '',
      confirmPassword: ''
    })

    const formNewUser = ref({
      id_pegawai: null,
      email: '',
      password: '',
      confirmPassword: '',
      role: 'operator',
      status: 'aktif'
    })

    const resetFormPegawai = () => {
      formPegawai.value = {
        id_pegawai: null,
        nip: '',
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        tmt_cpns: '',
        tmt_pangkat: '',
        pangkat: '',
        golongan: '',
        nama_jabatan: '',
        tmt_jabatan: '',
        unit_kerja: '',
        pendidikan_terakhir: '',
        jurusan: '',
        tempat_pendidikan: '',
        tahun_lulus: '',
        masa_kerja_tahun: '',
        masa_kerja_bulan: '',
        latihan_jabatan: '',
        perkiraan_pensiun: '',
        status_kepegawaian: 'PNS',
        status: 'aktif'
      }
      editingPegawaiId.value = null
      formErrors.value = []
    }

    const loadPegawaiFromAPI = async () => {
      try {
        const data = await fetchAPI('pegawai')
        if (Array.isArray(data)) {
          pegawai.value = data
        } else {
          console.warn('Unexpected response for pegawai API:', data)
        }
      } catch (error) {
        console.error('Gagal memuat data pegawai dari API:', error)
      }
    }

    const loadUsersFromAPI = async () => {
      try {
        const data = await fetchAPI('users')
        if (Array.isArray(data)) {
          users.value = data
        } else {
          console.warn('Unexpected response for users API:', data)
        }
      } catch (error) {
        console.error('Gagal memuat data user dari API:', error)
      }
    }

    const validateFormPegawai = () => {
      formErrors.value = []
      if (!formPegawai.value.nama) formErrors.value.push('Nama wajib diisi')
      if (!formPegawai.value.nip) {
        formErrors.value.push('NIP wajib diisi')
      } else {
        // Cek NIP sudah digunakan atau tidak (kecuali NIP pegawai saat ini)
        const nipExists = pegawai.value.some(p => 
          p.nip === formPegawai.value.nip && p.id_pegawai !== editingPegawaiId.value
        )
        if (nipExists) {
          formErrors.value.push('NIP sudah digunakan oleh pegawai lain')
        }
      }
      if (!formPegawai.value.status_kepegawaian) formErrors.value.push('Status kepegawaian wajib dipilih')
      return formErrors.value.length === 0
    }

    const filteredPegawai = computed(() => {
      return pegawai.value.filter(p => {
        const namaMatch = p.nama.toLowerCase().includes(searchNama.value.toLowerCase())
        const statusMatch = !filterStatus.value || p.status === filterStatus.value
        const golonganMatch = !filterGolongan.value || p.golongan === filterGolongan.value
        return namaMatch && statusMatch && golonganMatch
      })
    })

    const filteredPegawaiAktif = computed(() => {
      return filteredPegawai.value.filter(p => p.status === 'aktif')
    })

    const uniqueGolongan = computed(() => {
      const golongans = new Set()
      pegawai.value.forEach(p => {
        if (p.golongan) golongans.add(p.golongan)
      })
      return Array.from(golongans).sort()
    })

    const userAktif = computed(() => {
      return users.value.filter(u => u.status === 'aktif')
    })

    const getNamaPegawai = (idPegawai) => {
      const p = pegawai.value.find(pg => pg.id_pegawai === idPegawai)
      return p ? p.nama : '-'
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const editPegawai = (id) => {
      const p = pegawai.value.find(pg => pg.id_pegawai === id)
      if (p) {
        formPegawai.value = { ...p }
        editingPegawaiId.value = id
        showAddPegawaiModal.value = true
      }
    }

    const savePegawai = async () => {
      if (!validateFormPegawai()) return

      try {
        if (editingPegawaiId.value) {
          // Update existing pegawai
          const index = pegawai.value.findIndex(p => p.id_pegawai === editingPegawaiId.value)
          if (index !== -1) {
            const updateData = { ...formPegawai.value }
            delete updateData.id_pegawai // Remove ID before sending
            
            try {
              await updateAPI('pegawai', editingPegawaiId.value, updateData)
            } catch (apiError) {
              console.error('Error updating pegawai to API:', apiError)
              // Still update locally if API fails
            }
            
            pegawai.value[index] = { ...formPegawai.value }
          }
          // Log update
          ActivityEvents.UPDATE_PEGAWAI(formPegawai.value.nama)
        } else {
          // Create new pegawai
          const newPegawaiData = { ...formPegawai.value }
          delete newPegawaiData.id_pegawai // Remove ID before sending
          
          let savedData
          try {
            savedData = await postAPI('pegawai', newPegawaiData)
          } catch (apiError) {
            console.error('API save failed:', apiError)
            alert('Peringatan: Data pegawai disimpan lokal tapi gagal dikirim ke server. Error: ' + apiError.message)
            // Continue with local save
            savedData = null
          }
          
          const newId = Math.max(...pegawai.value.map(p => p.id_pegawai || 0), 0) + 1
          pegawai.value.push({
            ...formPegawai.value,
            id_pegawai: savedData?.id_pegawai || savedData?.id || newId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          // Log creation
          ActivityEvents.CREATE_PEGAWAI(formPegawai.value.nama, formPegawai.value.nip)
        }

        showAddPegawaiModal.value = false
        resetFormPegawai()
      } catch (error) {
        console.error('Error saving pegawai:', error)
        alert('Gagal menyimpan pegawai: ' + error.message)
      }
    }

    const deletePegawai = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus pegawai ini?')) {
        const pegawaiToDelete = pegawai.value.find(p => p.id_pegawai === id)
        pegawai.value = pegawai.value.filter(p => p.id_pegawai !== id)
        // Log deletion
        if (pegawaiToDelete) {
          ActivityEvents.DELETE_PEGAWAI(pegawaiToDelete.nama, pegawaiToDelete.nip)
        }
      }
    }

    const editUser = (id) => {
      const u = users.value.find(user => user.id_user === id)
      if (u) {
        formUser.value = {
          id_user: u.id_user,
          id_pegawai: u.id_pegawai,
          email: u.email,
          role: u.role,
          status: u.status,
          newPassword: '',
          confirmPassword: ''
        }
        editingUserId.value = id
        formUserErrors.value = []
        showEditUserModal.value = true
      }
    }

    const validateFormUser = () => {
      formUserErrors.value = []
      
      // Validasi email
      if (!formUser.value.email) {
        formUserErrors.value.push('Email wajib diisi')
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formUser.value.email)) {
          formUserErrors.value.push('Format email tidak valid')
        }
        
        // Cek email sudah digunakan atau tidak (kecuali email user saat ini)
        const emailExists = users.value.some(u => 
          u.email === formUser.value.email && u.id_user !== editingUserId.value
        )
        if (emailExists) {
          formUserErrors.value.push('Email sudah digunakan oleh user lain')
        }
      }
      
      // Validasi password jika diisi
      if (formUser.value.newPassword || formUser.value.confirmPassword) {
        if (formUser.value.newPassword.length < 6) {
          formUserErrors.value.push('Password minimal 6 karakter')
        }
        if (formUser.value.newPassword !== formUser.value.confirmPassword) {
          formUserErrors.value.push('Password tidak cocok')
        }
      }
      return formUserErrors.value.length === 0
    }

    const saveUser = () => {
      if (!validateFormUser()) return

      const index = users.value.findIndex(u => u.id_user === editingUserId.value)
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          email: formUser.value.email,
          role: formUser.value.role,
          status: formUser.value.status,
          updated_at: new Date().toISOString()
        }
        
        // Jika password diubah, update password (dalam praktik nyata, ini harus di-hash)
        if (formUser.value.newPassword) {
          users.value[index].password = '$2b$10$' + btoa(formUser.value.newPassword)
        }
      }

      showEditUserModal.value = false
      formUser.value = {
        id_user: null,
        id_pegawai: null,
        email: '',
        role: 'operator',
        status: 'aktif',
        newPassword: '',
        confirmPassword: ''
      }
      editingUserId.value = null
      formUserErrors.value = []
    }

    const deleteUser = (id) => {
      if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        users.value = users.value.filter(u => u.id_user !== id)
      }
    }

    const resetFormNewUser = () => {
      formNewUser.value = {
        id_pegawai: null,
        email: '',
        password: '',
        confirmPassword: '',
        role: 'operator',
        status: 'aktif'
      }
      formUserErrors.value = []
    }

    const validateFormNewUser = () => {
      formUserErrors.value = []
      
      // Validasi email
      if (!formNewUser.value.email) {
        formUserErrors.value.push('Email wajib diisi')
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formNewUser.value.email)) {
          formUserErrors.value.push('Format email tidak valid')
        }
        
        // Cek email sudah digunakan atau tidak
        const emailExists = users.value.some(u => u.email === formNewUser.value.email)
        if (emailExists) {
          formUserErrors.value.push('Email sudah digunakan oleh user lain')
        }
      }
      
      // Validasi password
      if (!formNewUser.value.password) {
        formUserErrors.value.push('Password wajib diisi')
      } else if (formNewUser.value.password.length < 6) {
        formUserErrors.value.push('Password minimal 6 karakter')
      }
      
      // Validasi konfirmasi password
      if (formNewUser.value.password !== formNewUser.value.confirmPassword) {
        formUserErrors.value.push('Password tidak cocok')
      }
      
      // Validasi pegawai
      if (!formNewUser.value.id_pegawai) {
        formUserErrors.value.push('Pegawai wajib dipilih')
      }
      
      return formUserErrors.value.length === 0
    }

    const saveNewUser = async () => {
      if (!validateFormNewUser()) return

      try {
        const userData = {
          id_pegawai: formNewUser.value.id_pegawai,
          email: formNewUser.value.email,
          password: formNewUser.value.password,
          role: formNewUser.value.role,
          status: formNewUser.value.status
        }

        let savedData
        try {
          savedData = await postAPI('users', userData)
        } catch (apiError) {
          console.error('API save failed:', apiError)
          alert('Peringatan: User disimpan lokal tapi gagal dikirim ke server. Error: ' + apiError.message)
          savedData = null
        }

        const newId = Math.max(...users.value.map(u => u.id_user || 0), 0) + 1
        users.value.push({
          id_user: savedData?.id_user || savedData?.id || newId,
          id_pegawai: formNewUser.value.id_pegawai,
          email: formNewUser.value.email,
          password: formNewUser.value.password,
          role: formNewUser.value.role,
          status: formNewUser.value.status,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

        showAddUserModal.value = false
        resetFormNewUser()
      } catch (error) {
        console.error('Error saving user:', error)
        alert('Gagal menyimpan user: ' + error.message)
      }
    }

    // State untuk detail pegawai
    const showDetailModal = ref(false)
    const detailPegawai = ref(null)
    const detailKeanggotaanTim = ref([])
    const unitKerja = ref(database.unit_kerja || [])
    const subUnitKerja = ref(database.sub_unit_kerja || [])
    const keanggotaanTim = ref(database.keanggotaan_tim || [])

    const viewDetailPegawai = (id) => {
      const p = pegawai.value.find(pg => pg.id_pegawai === id)
      if (p) {
        detailPegawai.value = { ...p }
        // Ambil data keanggotaan tim untuk pegawai ini
        detailKeanggotaanTim.value = keanggotaanTim.value.filter(kt => kt.id_pegawai === id)
        showDetailModal.value = true
      }
    }

    const getUnitKerjaName = (id) => {
      const unit = unitKerja.value.find(u => u.id === id)
      return unit ? unit.nama_unit : '-'
    }

    const getSubUnitName = (id) => {
      if (!id) return null
      const subUnit = subUnitKerja.value.find(su => su.id === id)
      return subUnit ? subUnit.nama_sub_unit : null
    }

    const fileInput = ref(null)

    const handleImportFile = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        const XLSX = (await import('xlsx')).default || await import('xlsx')
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(sheet)

        if (data.length === 0) {
          alert('File Excel kosong')
          return
        }

        // Expected headers
        const expectedHeaders = [
          'nip', 'nama', 'tempat_lahir', 'tanggal_lahir', 'tmt_cpns',
          'tmt_pangkat', 'pangkat', 'golongan', 'nama_jabatan', 'tmt_jabatan',
          'pendidikan_terakhir', 'jurusan', 'tempat_pendidikan', 'tahun_lulus',
          'latihan_jabatan', 'status_kepegawaian', 'status'
        ]

        // Validate headers
        const firstRow = data[0]
        const actualHeaders = Object.keys(firstRow)
        const missingHeaders = expectedHeaders.filter(h => !actualHeaders.includes(h))

        if (missingHeaders.length > 0) {
          alert(`Header yang hilang: ${missingHeaders.join(', ')}`)
          return
        }

        // Import data
        let importedCount = 0
        let skippedCount = 0
        let errorCount = 0
        const failedRows = []

        for (const row of data) {
          // Skip rows with empty nip atau nama
          if (!row.nip || !row.nama) {
            skippedCount++
            continue
          }

          // Check if NIP already exists locally
          if (pegawai.value.some(p => p.nip?.toString() === row.nip?.toString())) {
            console.warn(`NIP ${row.nip} sudah ada, skip`)
            skippedCount++
            continue
          }

          const pegawaiData = {
            nip: row.nip?.toString() || '',
            nama: row.nama?.toString() || '',
            tempat_lahir: row.tempat_lahir?.toString() || '',
            tanggal_lahir: row.tanggal_lahir?.toString() || '',
            tmt_cpns: row.tmt_cpns?.toString() || '',
            tmt_pangkat: row.tmt_pangkat?.toString() || '',
            pangkat: row.pangkat?.toString() || '',
            golongan: row.golongan?.toString() || '',
            nama_jabatan: row.nama_jabatan?.toString() || '',
            tmt_jabatan: row.tmt_jabatan?.toString() || '',
            unit_kerja: row.unit_kerja?.toString() || '',
            pendidikan_terakhir: row.pendidikan_terakhir?.toString() || '',
            jurusan: row.jurusan?.toString() || '',
            tempat_pendidikan: row.tempat_pendidikan?.toString() || '',
            tahun_lulus: row.tahun_lulus?.toString() || '',
            masa_kerja_tahun: row.masa_kerja_tahun?.toString() || '',
            masa_kerja_bulan: row.masa_kerja_bulan?.toString() || '',
            latihan_jabatan: row.latihan_jabatan?.toString() || '',
            perkiraan_pensiun: row.perkiraan_pensiun?.toString() || '',
            status_kepegawaian: row.status_kepegawaian?.toString() || 'PNS',
            status: row.status?.toString() || 'aktif'
          }

          try {
            // Kirim ke API backend
            const result = await postAPI('pegawai', pegawaiData)
            
            // Jika berhasil, tambahkan ke state lokal
            pegawai.value.push({
              ...pegawaiData,
              id_pegawai: result.id_pegawai || result.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            
            importedCount++
          } catch (apiError) {
            console.error(`Error mengirim data pegawai ${row.nip}:`, apiError.message)
            errorCount++
            failedRows.push(row.nip)
          }
        }

        let message = `${importedCount} data pegawai berhasil diimpor ke server`
        if (skippedCount > 0) {
          message += `. ${skippedCount} baris diabaikan (NIP kosong atau duplikat)`
        }
        if (errorCount > 0) {
          message += `. ${errorCount} baris gagal dikirim ke server: ${failedRows.join(', ')}`
        }
        alert(message)
        fileInput.value.value = '' // Reset file input
      } catch (error) {
        console.error('Error import file:', error)
        alert('Gagal mengimpor file: ' + error.message)
      }
    }

    // Log page access
    onMounted(async () => {
      ActivityEvents.ACCESS_PAGE('Manajemen Pegawai & User')
      await Promise.all([loadPegawaiFromAPI(), loadUsersFromAPI()])
    })

    return {
      pegawai,
      users,
      searchNama,
      filterStatus,
      filterGolongan,
      activeTab,
      showAddPegawaiModal,
      showAddUserModal,
      showEditUserModal,
      showDetailModal,
      editingPegawaiId,
      editingUserId,
      formPegawai,
      formUser,
      formNewUser,
      formErrors,
      formUserErrors,
      showPassword,
      detailPegawai,
      detailKeanggotaanTim,
      filteredPegawai,
      filteredPegawaiAktif,
      uniqueGolongan,
      userAktif,
      getNamaPegawai,
      formatDate,
      editPegawai,
      savePegawai,
      deletePegawai,
      editUser,
      saveUser,
      deleteUser,
      viewDetailPegawai,
      getUnitKerjaName,
      getSubUnitName,
      resetFormPegawai,
      resetFormNewUser,
      validateFormUser,
      validateFormNewUser,
      saveNewUser,
      fileInput,
      handleImportFile
    }
  }
}
</script>

<style scoped>
</style>
