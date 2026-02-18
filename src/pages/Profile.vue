<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <button @click="$router.back()" class="p-2 hover:bg-white rounded-lg transition">
          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-slate-800">Profil Saya</h1>
      </div>

      <div class="grid lg:grid-cols-4 gap-6">
        <!-- Profile Card (Sticky) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
            <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div class="px-6 pb-6">
              <div class="flex flex-col items-center -mt-16 mb-4">
                <div
                  class="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                  {{ getUserInitial }}
                </div>
              </div>

              <div class="text-center">
                <h2 class="text-xl font-bold text-slate-800 mb-1">{{ pegawaiData?.nama || authStore.currentUser?.name }}
                </h2>
                <p class="text-sm text-slate-600 mb-1">{{ pegawaiData?.nama_jabatan || 'Staff' }}</p>
                <p class="text-xs text-slate-500 mb-2">{{ pegawaiData?.unit_kerja || authStore.currentUser?.instansi }}
                </p>
                <div
                  class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize mb-4">
                  {{ pegawaiData?.pangkat || authStore.currentUser?.role }}
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-slate-200">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-600">Status</span>
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Aktif</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-600">Anggota</span>
                  <span class="font-medium text-slate-800">2023</span>
                </div>
              </div>

              <div class="mt-6 space-y-2">
                <button @click="editMode = !editMode"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  {{ editMode ? 'Batal Edit' : 'Edit Profil' }}
                </button>
                <button @click="showChangePassword = true"
                  class="w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
                  Ubah Password
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Informasi Pribadi -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informasi Pribadi Lengkap
            </h3>

            <div v-if="!editMode" class="grid sm:grid-cols-2 gap-6">
              <div class="border-l-4 border-blue-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Nama Lengkap</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.nama || authStore.currentUser?.name }}
                </p>
              </div>
              <div class="border-l-4 border-blue-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">NIP</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.nip || authStore.currentUser?.nip || '-'
                }}</p>
              </div>
              <div class="border-l-4 border-blue-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Email</p>
                <p class="text-base font-medium text-slate-800">{{ authStore.currentUser?.email }}</p>
              </div>
              <div class="border-l-4 border-indigo-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Tempat/Tgl Lahir</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.tempat_lahir }}, {{
                  formatDate(pegawaiData?.tanggal_lahir) }}</p>
              </div>
              <div class="border-l-4 border-indigo-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Jabatan</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.nama_jabatan || '-' }}</p>
              </div>
              <div class="border-l-4 border-indigo-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Unit Kerja</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.unit_kerja ||
                  authStore.currentUser?.instansi }}</p>
              </div>
              <div class="border-l-4 border-purple-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Pangkat/Golongan</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.pangkat }} ({{ pegawaiData?.golongan }})
                </p>
              </div>
              <div class="border-l-4 border-purple-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Pendidikan</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.pendidikan_terakhir }} - {{
                  pegawaiData?.jurusan }}</p>
              </div>
              <div class="border-l-4 border-purple-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Masa Kerja</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.masa_kerja_tahun }} tahun {{
                  pegawaiData?.masa_kerja_bulan }} bulan</p>
              </div>
              <div class="border-l-4 border-purple-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Status Kepegawaian</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.status_kepegawaian || '-' }}</p>
              </div>
              <div class="border-l-4 border-green-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">TMT CPNS</p>
                <p class="text-base font-medium text-slate-800">{{ formatDate(pegawaiData?.tmt_cpns) }}</p>
              </div>
              <div class="border-l-4 border-green-500 pl-4">
                <p class="text-xs text-slate-600 font-semibold mb-2 uppercase">Perkiraan Pensiun</p>
                <p class="text-base font-medium text-slate-800">{{ pegawaiData?.perkiraan_pensiun || '-' }}</p>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="grid sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs text-slate-600 font-semibold mb-2 uppercase">Nama Lengkap</label>
                  <input v-model="editFormData.name" type="text"
                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs text-slate-600 font-semibold mb-2 uppercase">Email</label>
                  <input v-model="editFormData.email" type="email"
                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs text-slate-600 font-semibold mb-2 uppercase">Instansi</label>
                  <input v-model="editFormData.instansi" type="text"
                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div class="flex gap-3 pt-4">
                <button @click="saveProfile"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Simpan
                </button>
                <button @click="editMode = false"
                  class="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
                  Batal
                </button>
              </div>
            </div>
          </div>

          <!-- Informasi Kontak -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kontak & Informasi Tambahan
            </h3>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="bg-slate-50 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 font-semibold uppercase">Email</p>
                    <p class="text-sm text-slate-800 break-all">{{ authStore.currentUser?.email }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m0 0h5a2 2 0 002-2V8a2 2 0 00-2-2h-5m0 0V5a2 2 0 012-2h1a2 2 0 012 2v1m0 0h3a2 2 0 012 2v10a2 2 0 01-2 2h-3m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 font-semibold uppercase">NIP</p>
                    <p class="text-sm text-slate-800 font-mono">{{ pegawaiData?.nip || '-' }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 font-semibold uppercase">Unit Kerja</p>
                    <p class="text-sm text-slate-800">{{ pegawaiData?.unit_kerja || authStore.currentUser?.instansi }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 font-semibold uppercase">Status</p>
                    <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold capitalize">{{
                      pegawaiData?.status || 'aktif' }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 font-semibold uppercase">Perkiraan Pensiun</p>
                    <p class="text-sm text-slate-800 font-medium">{{ pegawaiData?.perkiraan_pensiun || '-' }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 font-semibold uppercase">Status Kepegawaian</p>
                    <p class="text-sm text-slate-800 font-medium">{{ pegawaiData?.status_kepegawaian || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistik Akun -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
            <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Statistik Akun
            </h3>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl p-4 text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">{{ stats.totalKegiatan }}</div>
                <p class="text-sm text-slate-600">Kegiatan Diikuti</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">{{ stats.totalSertifikat }}</div>
                <p class="text-sm text-slate-600">Sertifikat Diperoleh</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <div class="text-3xl font-bold text-purple-600 mb-2">{{ stats.loginCount }}</div>
                <p class="text-sm text-slate-600">Total Login</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center">
                <div class="text-3xl font-bold text-orange-600 mb-2">3</div>
                <p class="text-sm text-slate-600">Bulan Aktif</p>
              </div>
            </div>
          </div>

          <!-- Keamanan -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Keamanan & Privasi
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div>
                  <p class="font-medium text-slate-800 text-sm">Password</p>
                  <p class="text-xs text-slate-600">Terakhir diubah: 3 bulan lalu</p>
                </div>
                <button @click="showChangePassword = true"
                  class="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">
                  Ubah
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div>
                  <p class="font-medium text-slate-800 text-sm">Autentikasi Dua Faktor</p>
                  <p class="text-xs text-slate-600">Nonaktif</p>
                </div>
                <button disabled class="px-4 py-2 text-gray-400 font-medium rounded-lg transition">
                  Aktifkan
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div>
                  <p class="font-medium text-slate-800 text-sm">Sesi Login Aktif</p>
                  <p class="text-xs text-slate-600">1 perangkat aktif</p>
                </div>
                <button class="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">
                  Kelola
                </button>
              </div>
            </div>
          </div>

          <!-- Aktivitas -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Aktivitas Terbaru
            </h3>

            <div class="space-y-3">
              <div class="flex items-start gap-4 pb-3 border-b border-slate-100">
                <div class="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">Login Berhasil</p>
                  <p class="text-xs text-slate-500">Hari ini, 10:30 dari Chrome Windows</p>
                </div>
              </div>

              <div class="flex items-start gap-4 pb-3 border-b border-slate-100">
                <div class="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">Mengubah Profil</p>
                  <p class="text-xs text-slate-500">Kemarin, 15:45 - Mengubah informasi pribadi</p>
                </div>
              </div>

              <div class="flex items-start gap-4 pb-3 border-b border-slate-100">
                <div class="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">Membuat Kegiatan Baru</p>
                  <p class="text-xs text-slate-500">2 hari yang lalu, 09:20 - Pelatihan Dasar CPNS</p>
                </div>
              </div>

              <div class="flex items-start gap-4 pb-3 border-b border-slate-100">
                <div class="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">Download Laporan</p>
                  <p class="text-xs text-slate-500">3 hari yang lalu, 14:12 - Laporan Kegiatan Q1</p>
                </div>
              </div>

              <div class="flex items-start gap-4 pb-3 border-b border-slate-100">
                <div class="w-3 h-3 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">Mengubah Password</p>
                  <p class="text-xs text-slate-500">1 minggu yang lalu, 11:05</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">Hapus Sertifikat</p>
                  <p class="text-xs text-slate-500">10 hari yang lalu, 16:30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Ubah Password</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Password Lama</label>
            <input v-model="passwordForm.oldPassword" type="password" placeholder="Masukkan password lama"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Password Baru</label>
            <input v-model="passwordForm.newPassword" type="password" placeholder="Masukkan password baru"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
            <p class="text-xs text-slate-500 mt-1">Minimal 6 karakter</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password</label>
            <input v-model="passwordForm.confirmPassword" type="password" placeholder="Konfirmasi password baru"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="savePassword"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Ubah
          </button>
          <button @click="showChangePassword = false"
            class="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
import { loadDataFromAPI } from '@/data'

export default {
  name: 'Profile',
  setup() {
    const authStore = useAuthStore()
    const editMode = ref(false)
    const showChangePassword = ref(false)
    const pegawaiInfo = ref(null)

    const editFormData = ref({
      name: authStore.currentUser?.name || '',
      email: authStore.currentUser?.email || '',
      instansi: authStore.currentUser?.instansi || ''
    })

    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const stats = ref({
      totalKegiatan: 12,
      totalSertifikat: 5,
      loginCount: 48
    })

    const pegawaiData = computed(() => {
      if (!pegawaiInfo.value) return null
      return pegawaiInfo.value
    })

    // onMounted(async () => {
    //   // Load pegawai data from API
    //   try {
    //     const pegawaiList = await loadDataFromAPI('pegawai')
    //     // Find pegawai by user ID
    //     const userId = authStore.currentUser?.id || 1
    //     const currentPegawai = pegawaiList.find(p => p.id_pegawai === userId || p.id === userId)
    //     if (currentPegawai) {
    //       pegawaiInfo.value = currentPegawai
    //     } else {
    //       // If not found, use first pegawai as fallback
    //       pegawaiInfo.value = pegawaiList[0] || null
    //     }
    //   } catch (error) {
    //     console.error('Failed to load pegawai data:', error)
    //   }
    // })

    onMounted(() => {
      loadProfile()
    })
    const loadProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL+'/api/v1/'}me`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }
        )

        const json = await res.json()

        if (json.success) {
          pegawaiInfo.value = json.data.pegawai

          // update authStore (optional tapi rapi)
          authStore.currentUser = {
            ...authStore.currentUser,
            email: json.data.user.email,
            role: json.data.user.role,
            status: json.data.user.status
          }
        }
      } catch (e) {
        console.error('Gagal load profil:', e)
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getUserInitial = computed(() => {
      const name = pegawaiInfo.value?.nama || authStore.currentUser?.name
      if (name) {
        return name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      }
      return 'A'
    })

    const saveProfile = () => {
      if (!editFormData.value.name || !editFormData.value.email) {
        Swal.fire({
          title: 'Peringatan',
          text: 'Nama dan Email harus diisi',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
        return
      }

      authStore.currentUser.name = editFormData.value.name
      authStore.currentUser.email = editFormData.value.email
      authStore.currentUser.instansi = editFormData.value.instansi

      localStorage.setItem('user_data', JSON.stringify(authStore.currentUser))

      editMode.value = false

      Swal.fire({
        title: 'Sukses!',
        text: 'Profil berhasil diperbarui',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }

    const savePassword = () => {
      const { oldPassword, newPassword, confirmPassword } = passwordForm.value

      if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.fire({
          title: 'Peringatan',
          text: 'Semua field harus diisi',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
        return
      }

      if (newPassword !== confirmPassword) {
        Swal.fire({
          title: 'Error',
          text: 'Password baru tidak cocok',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }

      if (newPassword.length < 6) {
        Swal.fire({
          title: 'Error',
          text: 'Password minimal 6 karakter',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }

      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      showChangePassword.value = false

      Swal.fire({
        title: 'Sukses!',
        text: 'Password berhasil diubah',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }

    return {
      authStore,
      editMode,
      showChangePassword,
      editFormData,
      passwordForm,
      stats,
      pegawaiData,
      getUserInitial,
      saveProfile,
      savePassword,
      formatDate
    }
  }
}
</script>
