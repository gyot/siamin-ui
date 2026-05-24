<template>
  <div class="p-6 bg-slate-50">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Manajemen Kegiatan</h1>
        <p class="text-slate-500">Kelola semua kegiatan yang ada</p>
      </div>
      <button @click="(showAddModal = true, editingId = null, isViewing = false, resetForm())"
        class="btn-primary px-5 py-2.5 text-white rounded-lg font-medium shadow flex items-center gap-2 w-fit">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Tambah Kegiatan</span>
      </button>
    </div>

    <!-- optionally show current user info for debugging -->
    <div v-if="currentUser.id_pegawai" class="mb-2 text-xs text-slate-500">
      Logged in pegawai ID: <strong>{{ currentUser.id_pegawai }}</strong>
      {{ currentUser}}
    </div>
    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <input v-model="searchQuery" type="text" placeholder="Cari kegiatan..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        <div class="flex gap-2">
          <select v-model="filterTahun"
            class="px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm bg-white">
            <option value="">Semua Tahun</option>
            <option v-for="tahun in getAvailableTahun" :key="tahun" :value="tahun">
              {{ tahun }}
            </option>
          </select>
          <select v-model="activeFilter"
            class="px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm bg-white">
            <option value="all">Semua Status</option>
            <option value="berjalan">Berjalan</option>
            <option value="akan_datang">Akan Datang</option>
            <option value="selesai">Selesai</option>
          </select>
          <button
            class="px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Informational Notice: Empty State -->
    <div v-if="kegiatan.length === 0 && !isLoadingKegiatan"
      class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
      Tidak ada kegiatan untuk akun anda.
      Silakan buat kegiatan baru atau hubungi administrator jika Anda seharusnya punya akses.
    </div>

    <!-- Loading State -->


    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Kegiatan
              </th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Lokasi</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Unit Kerja
              </th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Metode</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr colspans="7" v-if="isLoadingKegiatan" class="table-row">
              <td colspan="7" class="px-5 py-4">
                <div class="flex items-center gap-3 justify-center">
                  <div class="animate-spin">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                      </path>
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600">Memuat data kegiatan...</p>
                </div>
              </td>
            </tr>
            <!-- <div v-if="isLoadingKegiatan" class="mb-4 p-4 flex items-center justify-center">
              <Spinner message="Memuat data kegiatan..." />
            </div> -->
            <tr v-for="k in filteredKegiatan" :key="k.id_kegiatan" class="table-row hover:bg-slate-50">
              <td class="px-5 py-4">
                <div class="font-medium text-slate-800">{{ k.nama_kegiatan }}</div>
                <div class="text-xs text-slate-500">{{ k.id_kegiatan }}</div>
              </td>
              <td class="px-5 py-4 text-sm text-slate-600">
                {{ formatDate(k.tanggal_mulai) }} s/d {{ formatDate(k.tanggal_selesai) }}
              </td>
              <td class="px-5 py-4 text-sm text-slate-600">{{ k.lokasi }}</td>
              <td class="px-5 py-4 text-sm text-slate-600">{{ getUnitKerjaLabel(k) }}</td>
              <td class="px-5 py-4">
                <span class="badge bg-slate-100 text-slate-700">{{ getMetodeLabel(k.metode_pelaksanaan) }}</span>
              </td>
              <td class="px-5 py-4">
                <span class="badge" :class="getStatusBadgeClass(k.status)">
                  {{ getStatusLabel(k.status) }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center justify-end gap-2">
                  <!-- <button @click="openPesertaList(k.id_kegiatan)"
                    class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-green-600" title="Peserta">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 4.354a4 4 0 110 8.308 4 4 0 010-8.308M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button @click="handleSuratTugas(k.id_kegiatan)"
                    class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-orange-600"
                    title="Lihat/Buat Penugasan">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button> -->

                  <button @click="sharePublicPesertaLink(k)"
                    class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-emerald-600"
                    title="Share Link Publik Peserta">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.684 13.342C9.886 12.511 11.342 12 12.914 12c1.572 0 3.028.511 4.23 1.342M9 6.75A2.25 2.25 0 1113.5 6.75 2.25 2.25 0 019 6.75zm6.75 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM3.75 15a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
                    </svg>
                  </button>
                  <button @click="viewDetail(k.id_kegiatan)"
                    class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700" title="Lihat">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <!-- <button @click="editKegiatan(k.id_kegiatan)"
                    class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600" title="Edit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="duplicateKegiatan(k)"
                    class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600" title="Duplikat">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7V5a2 2 0 012-2h8" />
                    </svg>
                  </button> -->
                  <button @click="deleteKegiatan(k.id_kegiatan)"
                    class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600" title="Hapus">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredKegiatan.length === 0 && kegiatan.length > 0">
              <td colspan="7" class="px-5 py-8 text-center text-slate-500">
                Tidak ada kegiatan yang sesuai dengan filter
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="kegiatan.length > 0"
        class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-slate-500">Menampilkan {{ filteredKegiatan.length }} dari {{ kegiatan.length }} data</p>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
            disabled>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium">1</button>
          <button
            class="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
            disabled>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Tambah/Edit -->
  <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
        <h3 class="text-xl font-bold text-slate-800">{{ isViewing ? 'Detail' : editingId ? 'Edit' : 'Tambah' }} Kegiatan</h3>
        <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form v-if="!isViewing" @submit.prevent="saveKegiatan" class="p-6 space-y-6">

        <!-- Informasi Dasar -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Informasi Dasar</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nama Kegiatan *</label>
              <input type="text" v-model="formData.nama_kegiatan" placeholder="Nama kegiatan"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                required />
            </div>
            <div v-if="formData.nama_kegiatan" class="text-sm mt-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Pratinjau Link Formulir</label>
              <a :href="previewLink" target="_blank" class="text-blue-600 break-all">{{ previewLink }}</a>
            </div>
            <!-- <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Rincian Kegiatan</label>
              <textarea v-model="formData.rincian_kegiatan" placeholder="Deskripsi detail kegiatan" rows="3" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div> -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
              <textarea v-model="formData.deskripsi" placeholder="Deskripsi tambahan kegiatan" rows="3"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Unit Kerja *</label>
              <select v-model="formData.unit_kerja_id"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white"
                :disabled="userUnitKerjaOptions.length === 0">
                <option value="" disabled>Pilih unit kerja</option>
                <option v-for="unit in userUnitKerjaOptions" :key="unit.unit_kerja_id" :value="unit.unit_kerja_id">
                  {{ unit.kode_unit ? `${unit.kode_unit} - ` : '' }}{{ unit.nama_unit || `Unit ${unit.unit_kerja_id}` }}
                </option>
              </select>
              <p v-if="userUnitKerjaOptions.length === 0" class="text-xs text-amber-600 mt-1">
                Unit kerja user belum tersedia. Silakan login ulang.
              </p>
            </div>
          </div>
        </div>

        <!-- Jadwal & Lokasi -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Jadwal & Lokasi</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Mulai *</label>
              <input type="date" v-model="formData.tanggal_mulai"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Selesai *</label>
              <input type="date" v-model="formData.tanggal_selesai"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Lokasi *</label>
              <input type="text" v-model="formData.lokasi" placeholder="Lokasi kegiatan"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Kabupaten/Kota</label>
              <select v-model="formData.kabupaten_kota"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white">
                <option value="">Pilih Kabupaten/Kota</option>
                <option v-for="item in kabupatenKotaOptions" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Flyer</label>
              <div @drop.prevent="handleFlyerDrop" @dragover.prevent="isDraggingFlyer = true"
                @dragleave.prevent="isDraggingFlyer = false" @paste="handleFlyerPaste"
                class="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition"
                :class="isDraggingFlyer ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'">
                <input type="file" ref="flyerInput" @change="handleFlyerSelect" accept="image/*" class="hidden" />

                <!-- Preview Gambar -->
                <div v-if="formData.flyer" class="mb-4">
                  <img :src="formData.flyer" alt="Flyer Preview" class="max-h-48 mx-auto rounded-lg shadow-md" />
                  <button type="button" @click="removeFlyerImage"
                    class="mt-3 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                    Hapus Gambar
                  </button>
                </div>

                <!-- Upload Area -->
                <div v-else @click="$refs.flyerInput.click()" class="py-2">
                  <svg class="w-10 h-10 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-slate-700 font-medium mb-1">Drag & drop gambar di sini</p>
                  <p class="text-xs text-slate-500 mb-2">atau</p>
                  <p class="text-sm text-blue-600 font-medium">Klik untuk browse</p>
                  <p class="text-xs text-slate-500 mt-2">Atau paste gambar (Ctrl+V)</p>
                </div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Format: JPG, PNG, GIF. Max 2MB</p>
            </div>
          </div>
        </div>

        <!-- Metode & Peserta -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Metode & Peserta</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Metode Pelaksanaan *</label>
              <select v-model="formData.metode_pelaksanaan"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white"
                required>
                <option value="">Pilih metode</option>
                <option value="daring">Daring</option>
                <option value="luring">Luring</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Metode Pembayaran *</label>
              <select v-model="formData.metode_pembayaran"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white"
                required>
                <option value="">Pilih metode pembayaran</option>
                <option value="transfer">Transfer</option>
                <option value="pulsa">Pulsa</option>
                <option value="transfer_dan_pulsa">Transfer dan Pulsa</option>
                <option value="tunai">Tunai</option>
                <option value="tidak_dibayar">Tidak Dibayar</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Total Peserta *</label>
              <input type="number" v-model="formData.total_peserta" placeholder="0"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                required min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Ringkasan Peserta</label>
              <input type="text" v-model="formData.peserta_ringkasan" placeholder="Contoh: Karyawan, CPNS, dll"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Daftar ATK -->
        <div class="border-b border-slate-100 pb-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-slate-800">Daftar ATK</h4>
          </div>

          <div v-if="atkItems.length > 0" class="mb-4 border border-slate-200 rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-600">
                <tr>
                  <th class="text-left px-4 py-2 w-12">No</th>
                  <th class="text-left px-4 py-2">Nama Barang</th>
                  <th class="text-left px-4 py-2">Spesifikasi</th>
                  <th class="text-left px-4 py-2 w-32">Jumlah</th>
                  <th class="text-left px-4 py-2">Keterangan</th>
                  <th class="text-right px-4 py-2 w-20">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(item, index) in atkItems" :key="`${item.id || 'new'}-${index}`">
                  <td class="px-4 py-2">{{ index + 1 }}</td>
                  <td class="px-4 py-2 text-slate-700">{{ item.nama_barang || '-' }}</td>
                  <td class="px-4 py-2 text-slate-700">{{ item.spesifikasi || '-' }}</td>
                  <td class="px-4 py-2 text-slate-700">
                    <span v-if="item.jumlah !== null && item.jumlah !== undefined">{{ item.jumlah }}</span>
                    <span v-else>-</span>
                    <span v-if="item.satuan" class="text-slate-500"> {{ item.satuan }}</span>
                  </td>
                  <td class="px-4 py-2 text-slate-700">{{ item.keterangan || '-' }}</td>
                  <td class="px-4 py-2 text-right">
                    <button type="button" @click="removeAtkItem(index)" class="text-xs text-red-600 hover:text-red-700">
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nama Barang *</label>
              <input v-model="atkForm.nama_barang" type="text" placeholder="Contoh: Kertas A4"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <!-- <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Spesifikasi</label>
              <input
                v-model="atkForm.spesifikasi"
                type="text"
                placeholder="Contoh: 80 gsm"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div> -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Jumlah</label>
              <input v-model="atkForm.jumlah" type="number" min="0" placeholder="0"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Satuan</label>
              <input v-model="atkForm.satuan" type="text" placeholder="Contoh: rim, box"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <!-- <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">Keterangan</label>
              <textarea
                v-model="atkForm.keterangan"
                rows="2"
                placeholder="Catatan tambahan"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div> -->
          </div>

          <div class="mt-3 flex items-center gap-3">
            <p v-if="atkError" class="text-xs text-red-600">{{ atkError }}</p>
            <button type="button" @click="addAtkItem"
              class="ml-auto px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Tambah ATK
            </button>
          </div>
        </div>

        <!-- URL Resources -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Resource URL</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Dokumentasi</label>
              <input type="text" v-model="formData.dokumentasi_url" placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Materi</label>
              <input type="text" v-model="formData.materi_url" placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Panduan</label>
              <input type="text" v-model="formData.panduan_url" placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Laporan</label>
              <input type="text" v-model="formData.laporan_url" placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Surat Menyurat</label>
              <input type="text" v-model="formData.surat_menyurat_url" placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <!-- <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">Template Biodata (DOC/DOCX)</label>
              <input
                type="file"
                ref="templateBiodataInput"
                @change="handleTemplateBiodataSelect"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white"
              />
              <p class="text-xs text-slate-500 mt-2">Maksimal 10MB</p>
              <div v-if="formData.template_biodata || templateBiodataFile" class="mt-2 flex flex-wrap items-center gap-3">
                <a
                  v-if="formData.template_biodata && !templateBiodataFile"
                  :href="getStorageFileUrl(formData.template_biodata)"
                  target="_blank"
                  download
                  class="text-emerald-700 hover:text-emerald-800 underline text-sm break-all"
                >
                  Download template saat ini
                </a>
                <span v-if="templateBiodataFile" class="text-sm text-slate-700">
                  File dipilih: {{ templateBiodataFile.name }}
                </span>
                <button
                  type="button"
                  @click="removeTemplateBiodata"
                  class="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Hapus Template
                </button>
              </div>
            </div> -->
          </div>
        </div>

        <!-- Status -->
        <div class="pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Status</h4>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Status Kegiatan *</label>
            <select v-model="formData.status"
              class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white"
              required>
              <option value="">Pilih status</option>
              <option value="draft">Draft</option>
              <option value="berjalan">Berjalan</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ formError }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button type="button" @click="showAddModal = false"
            class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Batal</button>
          <button type="submit" :disabled="isSubmitting"
            class="flex-1 btn-primary px-4 py-2.5 text-white rounded-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed">{{
              editingId ?
                'Update' : 'Simpan' }}</button>
        </div>
      </form>
      <div v-else class="p-6 space-y-6">
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Informasi Kegiatan</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <p class="text-xs text-slate-500">Nama Kegiatan</p>
              <p class="font-medium">{{ formData.nama_kegiatan || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Unit Kerja</p>
              <p class="font-medium">{{ getUnitKerjaLabel(formData) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Tanggal Mulai</p>
              <p class="font-medium">{{ formatDate(formData.tanggal_mulai) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Tanggal Selesai</p>
              <p class="font-medium">{{ formatDate(formData.tanggal_selesai) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Lokasi</p>
              <p class="font-medium">{{ formData.lokasi || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Kabupaten/Kota</p>
              <p class="font-medium">{{ formData.kabupaten_kota || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Metode Pelaksanaan</p>
              <p class="font-medium">{{ getMetodeLabel(formData.metode_pelaksanaan) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Metode Pembayaran</p>
              <p class="font-medium">{{ getPaymentMethodLabel(formData.metode_pembayaran) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Total Peserta</p>
              <p class="font-medium">{{ formData.total_peserta ?? '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">Ringkasan Peserta</p>
              <p class="font-medium">{{ formData.peserta_ringkasan || '-' }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-slate-500">Deskripsi</p>
              <p class="whitespace-pre-line">{{ formData.deskripsi || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Daftar ATK</h4>
          <div v-if="atkItems.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-600">
                <tr>
                  <th class="px-4 py-2 text-left">No</th>
                  <th class="px-4 py-2 text-left">Nama Barang</th>
                  <th class="px-4 py-2 text-left">Spesifikasi</th>
                  <th class="px-4 py-2 text-left">Jumlah</th>
                  <th class="px-4 py-2 text-left">Satuan</th>
                  <th class="px-4 py-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in atkItems" :key="idx" class="border-t">
                  <td class="px-4 py-2">{{ idx + 1 }}</td>
                  <td class="px-4 py-2">{{ item.nama_barang || '-' }}</td>
                  <td class="px-4 py-2">{{ item.spesifikasi || '-' }}</td>
                  <td class="px-4 py-2">{{ item.jumlah !== null && item.jumlah !== undefined ? item.jumlah : '-' }}</td>
                  <td class="px-4 py-2">{{ item.satuan || '-' }}</td>
                  <td class="px-4 py-2">{{ item.keterangan || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-sm text-slate-600">Tidak ada daftar ATK.</div>
        </div>

        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Resource URL</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <p class="text-xs text-slate-500">URL Dokumentasi</p>
              <p class="font-medium break-all">{{ formData.dokumentasi_url || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">URL Materi</p>
              <p class="font-medium break-all">{{ formData.materi_url || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">URL Panduan</p>
              <p class="font-medium break-all">{{ formData.panduan_url || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500">URL Laporan</p>
              <p class="font-medium break-all">{{ formData.laporan_url || '-' }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-slate-500">URL Surat Menyurat</p>
              <p class="font-medium break-all">{{ formData.surat_menyurat_url || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Status</h4>
          <div>
            <p class="text-xs text-slate-500">Status Kegiatan</p>
            <p class="font-medium">{{ getStatusLabel(formData.status) }}</p>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button type="button" @click="duplicateKegiatan(selectedKegiatan)"
            class="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Duplikat</button>
          <button type="button" @click="openEditFromDetail"
            class="flex-1 btn-primary px-4 py-2.5 text-white rounded-lg font-medium">Edit</button>
          <button type="button" @click="showAddModal = false"
            class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Tutup</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Detail Penugasan -->
  <div v-if="showSuratTugasModal && selectedSuratTugas"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
        <h3 class="text-2xl font-bold text-slate-800">Detail Penugasan</h3>
        <button @click="showSuratTugasModal = false" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">
          <!-- Informasi Dasar -->
          <div class="border-b border-slate-100 pb-6">
            <h4 class="text-lg font-semibold text-slate-800 mb-4">Informasi Penugasan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">ID Kegiatan</p>
                <p class="text-lg font-semibold text-slate-800">{{ selectedSuratTugas.id_kegiatan || selectedSuratTugas.id_penugasan || selectedSuratTugas.id_surat_tugas || '-' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">Kegiatan</p>
                <p class="text-lg font-semibold text-slate-800">{{ selectedSuratTugas.kegiatan?.nama_kegiatan || '-' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">Total Anggota</p>
                <p class="text-lg font-semibold text-slate-800">{{ anggotaInSelected.length }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">Unit Kerja</p>
                <p class="text-slate-700">{{ getUnitKerjaLabel(selectedSuratTugas.kegiatan || {}) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">Tanggal Kegiatan</p>
                <p class="text-slate-700">{{ formatDateRange(selectedSuratTugas.kegiatan?.tanggal_mulai, selectedSuratTugas.kegiatan?.tanggal_selesai) }}</p>
              </div>
            </div>
          </div>

        <!-- Timestamps -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Waktu</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Dibuat</p>
              <p class="text-sm text-slate-700">{{ formatDate(selectedSuratTugas.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Diubah</p>
              <p class="text-sm text-slate-700">{{ formatDate(selectedSuratTugas.updated_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Anggota Penugasan -->
        <div class="pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Anggota Penugasan</h4>

          <!-- Daftar Anggota Existing -->
          <div class="mb-6">
            <div v-if="anggotaInSelected.length === 0"
              class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-600 text-sm mb-4">
              Belum ada pegawai yang ditugaskan pada kegiatan ini
            </div>
            <div v-else class="overflow-x-auto mb-4">
              <table class="w-full text-sm">
                <thead>
                    <tr class="bg-slate-100">
                      <th class="p-2 text-left">No</th>
                      <th class="p-2 text-left">Nama, NIP, Pangkat, dan Gol</th>
                      <th class="p-2 text-left">Jabatan</th>
                      <th class="p-2 text-left">Jabatan dalam Kegiatan</th>
                      <th class="p-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(a, idx) in anggotaInSelected" :key="a.id || idx" class="border-b">
                      <td class="p-2 align-top">{{ idx + 1 }}</td>
                      <td class="p-2">
                        <div class="font-semibold">{{ (a.pegawai && a.pegawai.nama) || getNamaPegawai(a.id_pegawai) }}</div>
                        <div class="text-xs text-slate-600 mt-1">NIP. {{ (a.pegawai && (a.pegawai.nip || a.pegawai.nip_pegawai)) || '-' }}</div>
                        <div class="text-xs text-slate-600">{{ (a.pegawai && (a.pegawai.pangkat || a.pegawai.pangkat_golongan || a.pegawai.pangkat_gol)) ? ((a.pegawai.pangkat || a.pegawai.pangkat_golongan || a.pegawai.pangkat_gol) + ' ' + (a.pegawai.golongan || a.pegawai.gol || '')) : '-' }}</div>
                      </td>
                      <td class="p-2">{{ (a.pegawai && (a.pegawai.nama_jabatan || a.pegawai.jabatan || a.pegawai.nama_jabatan)) || '-' }}</td>
                      <td class="p-2">{{ getPeranLabel(a.peran) }}</td>
                      <td class="p-2 text-right">
                        <button @click="editAnggota(a)" type="button" class="mr-2 px-2 py-1 text-sm bg-yellow-100 rounded">Ubah</button>
                        <button @click="removeAnggota(a.id)" type="button" class="px-2 py-1 text-sm bg-red-100 text-red-700 rounded">Hapus</button>
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Form Tambah Anggota -->
          <div class="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <!-- Error messages -->
            <div v-if="formAnggotaErrors.length" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <ul class="list-disc list-inside text-sm text-red-800">
                <li v-for="(error, idx) in formAnggotaErrors" :key="idx">{{ error }}</li>
              </ul>
            </div>

            <h5 class="text-sm font-semibold text-slate-800 mb-3">Tambah Anggota</h5>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Pilih Pegawai *</label>
                <select v-model.number="formAnggota.id_pegawai"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="">-- Pilih Pegawai --</option>
                  <option v-for="p in pegawaiOptions" :key="p.id_pegawai" :value="p.id_pegawai">
                    {{ p.nama }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Peran *</label>
                <select v-model="formAnggota.peran"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="penanggung_jawab">Penanggung Jawab</option>
                  <option value="ketua_panitia">Ketua Panitia</option>
                  <option value="panitia">Panitia</option>
                  <option value="peserta">Peserta</option>
                  <option value="narasumber">Narasumber</option>
                </select>
              </div>
              <div class="flex items-end gap-2">
                <button @click="addAnggota" type="button"
                  class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  {{ editingAnggotaId ? 'Simpan Perubahan' : 'Tambah' }}
                </button>
                <button v-if="editingAnggotaId" @click="cancelEditAnggota" type="button"
                  class="px-3 py-2 border border-slate-300 rounded-lg text-sm">Batal</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button @click="copyAnggotaTable"
            class="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Salin Tabel</button>
          <button @click="showSuratTugasModal = false"
            class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Tutup</button>
          <!-- Penugasan sekarang dikelola via modal; tombol navigasi ke halaman penugasan dihapus -->
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Biodata Peserta -->
  <div v-if="showBiodataModal && selectedPeserta"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
      <div
        class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl print:hidden">
        <h3 class="text-2xl font-bold text-slate-800">Biodata Peserta</h3>
        <button @click="showBiodataModal = false" class="text-slate-400 hover:text-slate-600">
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
        <div id="biodata-content" class="p-4 bg-white print:p-0 print:border-0">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800">BIODATA</h2>
          </div>

          <div class="mb-6">
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">Kegiatan</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.nama_kegiatan || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">Waktu</div>
              <div class="text-center">:</div>
              <div>{{ formatDateRange(selectedPeserta.tanggal_mulai, selectedPeserta.tanggal_selesai) }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">Tempat</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.lokasi || '-' }}</div>
            </div>
          </div>

          <div class="mb-6">
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">1. Nama</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.nama || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">2. NIP</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.nip || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">3. Pangkat/Golongan</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.pangkat_golongan || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">4. Nama Instansi</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.nama_instansi || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">5. Jabatan Kedinasan</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.jabatan_kedinasan || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">6. Kabupaten/Kota</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.kabupaten_kota || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">7. No. HP/WhatsApp</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.no_hp || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">8. E-Mail</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.email || '-' }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="font-semibold">9. Peran Dalam Kegiatan</div>
              <div class="text-center">:</div>
              <div>{{ selectedPeserta.peran || 'Peserta' }}</div>
            </div>
          </div>

          <!-- Tables Section -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <!-- Ceklist Kelengkapan Administrasi -->
            <div>
              <div class="text-center font-semibold mb-2 border border-slate-300 bg-slate-50 py-1">
                Ceklist Kelengkapan Administrasi
              </div>
              <table class="w-full border border-slate-300 text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="border border-slate-300 px-2 py-1 text-left w-8">No</th>
                    <th class="border border-slate-300 px-2 py-1 text-left">Dokumen</th>
                    <th class="border border-slate-300 px-2 py-1 text-center w-10">✓</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(doc, idx) in administrasiDocs" :key="idx">
                    <td class="border border-slate-300 px-2 py-1">{{ idx + 1 }}</td>
                    <td class="border border-slate-300 px-2 py-1">{{ doc }}</td>
                    <td class="border border-slate-300 px-2 py-1 text-center"></td>
                  </tr>
                  <tr v-for="i in 5" :key="`empty-${i}`">
                    <td class="border border-slate-300 px-2 py-1">{{ administrasiDocs.length + i }}</td>
                    <td class="border border-slate-300 px-2 py-1"></td>
                    <td class="border border-slate-300 px-2 py-1 text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Kelengkapan Kegiatan -->
            <div>
              <div class="text-center font-semibold mb-2 border border-slate-300 bg-slate-50 py-1">
                Kelengkapan Kegiatan
              </div>
              <table class="w-full border border-slate-300 text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="border border-slate-300 px-2 py-1 text-left w-8">No</th>
                    <th class="border border-slate-300 px-2 py-1 text-left">Item</th>
                    <th class="border border-slate-300 px-2 py-1 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="selectedPeserta.kelengkapan_kegiatan && selectedPeserta.kelengkapan_kegiatan.length">
                    <td class="border border-slate-300 px-2 py-1" colspan="3">
                      {{ selectedPeserta.kelengkapan_kegiatan }}
                    </td>
                  </tr>
                  <tr v-else v-for="i in 5" :key="`empty-kelengkapan-${i}`">
                    <td class="border border-slate-300 px-2 py-1">{{ i }}</td>
                    <td class="border border-slate-300 px-2 py-1"></td>
                    <td class="border border-slate-300 px-2 py-1"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Daftar ATK -->
          <div class="mb-6">
            <div class="text-center font-semibold mb-2 border border-slate-300 bg-slate-50 py-1">
              Daftar ATK
            </div>
            <table class="w-full border border-slate-300 text-sm">
              <thead>
                <tr class="bg-slate-100">
                  <th class="border border-slate-300 px-2 py-1 text-left w-8">No</th>
                  <th class="border border-slate-300 px-2 py-1 text-left">Nama Barang</th>
                  <th class="border border-slate-300 px-2 py-1 text-left">Spesifikasi</th>
                  <th class="border border-slate-300 px-2 py-1 text-center w-20">Jumlah</th>
                  <th class="border border-slate-300 px-2 py-1 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="selectedPeserta.daftar_atk && selectedPeserta.daftar_atk.length">
                  <tr v-for="(atk, idx) in selectedPeserta.daftar_atk" :key="idx">
                    <td class="border border-slate-300 px-2 py-1">{{ idx + 1 }}</td>
                    <td class="border border-slate-300 px-2 py-1">{{ atk.nama_barang || '-' }}</td>
                    <td class="border border-slate-300 px-2 py-1">{{ atk.spesifikasi || '-' }}</td>
                    <td class="border border-slate-300 px-2 py-1 text-center">
                      {{ atk.jumlah !== null && atk.jumlah !== undefined ? atk.jumlah : '-' }}
                      <span v-if="atk.satuan" class="text-slate-600">{{ atk.satuan }}</span>
                    </td>
                    <td class="border border-slate-300 px-2 py-1">{{ atk.keterangan || '-' }}</td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="i in 5" :key="`empty-atk-${i}`">
                    <td class="border border-slate-300 px-2 py-1">{{ i }}</td>
                    <td class="border border-slate-300 px-2 py-1"></td>
                    <td class="border border-slate-300 px-2 py-1"></td>
                    <td class="border border-slate-300 px-2 py-1"></td>
                    <td class="border border-slate-300 px-2 py-1"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Signature Section -->
          <div class="mt-8 text-right">
            <div class="mb-4">{{ selectedPeserta.kabupaten_kota || 'Mataram' }}, {{
              formatDate(selectedPeserta.tanggal_mulai) }}
            </div>
            <div class="font-semibold mb-20">Yang Membuat</div>
            <div class="font-semibold">{{ selectedPeserta.nama || '-' }}</div>
            <div>NIP {{ selectedPeserta.nip || '-' }}</div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-4 border-t border-slate-200 px-6 pb-6 print:hidden">
        <button @click="showBiodataModal = false"
          class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Tutup</button>
        <button @click="printBiodata"
          class="flex-1 btn-primary px-4 py-2.5 text-white rounded-lg font-medium">Cetak</button>
      </div>
    </div>
  </div>

  <div v-if="isSubmitting" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div class="flex justify-center mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
      </div>
      <h3 class="text-lg font-semibold text-slate-800">Menyimpan kegiatan</h3>
      <p class="text-sm text-slate-500 mt-2">{{ submitLoadingMessage }}</p>
    </div>
  </div>

  <div v-if="submitStatus.visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[71] p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          :class="submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
          <svg v-if="submitStatus.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-slate-800">{{ submitStatus.title }}</h3>
          <p class="text-sm text-slate-600 mt-2 whitespace-pre-line">{{ submitStatus.message }}</p>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button type="button" @click="closeSubmitStatus"
          class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
          Tutup
        </button>
      </div>
    </div>
  </div>

</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import database from '../data/index.js'
import { useAuthStore } from '@/stores/auth.js'
import { listKegiatan, getKegiatan, getKegiatanTim, createKegiatan, updateKegiatan, removeKegiatan } from '@/services/kegiatan'
import { fetchAPI, postAPI } from '@/services/api'
import { ActivityEvents } from '@/services/activityLogger'
import Spinner from '@/components/Spinner.vue'
import { buildPublicUrl, buildStorageUrl } from '@/utils/url'
import {
  groupPenugasanByKegiatan,
  listPenugasanPegawai,
  createPenugasanPegawai,
  removePenugasanPegawai,
  editPenugasanPegawai
} from '@/services/penugasan'

export default {
  name: 'Kegiatan',
  components: { Spinner },
  setup() {
    const router = useRouter()
    const db = database
    const auth = useAuthStore()

    const slugify = (text) => {
      if (!text) return ''
      return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
    }

    const buildFormLink = (kode, peran = 'Peserta', judul = '') => {
      const slug = slugify(judul)
      return buildPublicUrl(`formulir/${kode}/${peran}/${slug}`)
    }

    const buildAbsoluteUrl = (rawUrl) => {
      if (!rawUrl) return ''
      const value = String(rawUrl).trim()
      if (!value) return ''
      return buildPublicUrl(value)
    }

    const getStorageFileUrl = (path) => {
      if (!path) return ''
      const value = String(path).trim()
      if (!value) return ''
      return buildStorageUrl(value)
    }

    const getValueByPath = (obj, path) => {
      if (!obj || !path) return ''
      return String(path)
        .split('.')
        .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
    }

    const firstNonEmptyValue = (obj, paths = []) => {
      for (const path of paths) {
        const value = getValueByPath(obj, path)
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          return value
        }
      }
      return ''
    }

    const getRoleLinksFromKegiatan = (item, role) => {
      const roleLower = String(role || '').toLowerCase()
      const formUrl = firstNonEmptyValue(item, [
        `link_form_${roleLower}`,
        `form_${roleLower}_url`,
        `url_form_${roleLower}`,
        `link_biodata_${roleLower}`,
        `url_biodata_${roleLower}`,
        `biodata_${roleLower}_url`,
        `formulir_${roleLower}`,
        `link_formulir_${roleLower}`,
        `links.${roleLower}.form`,
        `links.${roleLower}.url`,
        `link_biodata.${roleLower}`,
        `form_biodata.${roleLower}`
      ])

      const templateUrl = firstNonEmptyValue(item, [
        'template_biodata',
        'template_biodata_path',
        `template_biodata_${roleLower}_url`,
        `url_template_biodata_${roleLower}`,
        `contoh_template_biodata_${roleLower}_url`,
        `link_template_biodata_${roleLower}`,
        `template_${roleLower}_url`,
        `contoh_template_${roleLower}_url`,
        `template_biodata.${roleLower}`,
        `contoh_template_biodata.${roleLower}`,
        `templates.${roleLower}.biodata`,
        `templates.${roleLower}.url`,
        `template_biodata_url`,
        `contoh_template_biodata_url`
      ])

      return {
        formUrl: buildAbsoluteUrl(formUrl),
        templateUrl: getStorageFileUrl(templateUrl) || buildAbsoluteUrl(templateUrl)
      }
    }

    const buildPublicPesertaLink = (kode, judul = '') => {
      const slug = slugify(judul)
      return buildPublicUrl(`daftar-peserta/${kode}/${slug}`)
    }

    const buildPublicEvaluasiLink = (kode, judul = '') => {

      const slug = slugify(judul)
      return buildPublicUrl(`evaluasi/${kode}/${slug}`)
    }

    const buildPublicLaporanEvaluasiLink = (kode, judul = '') => {
      const slug = slugify(judul)
      return buildPublicUrl(`laporan-evaluasi/${kode}/${slug}`)
    }

    const copyText = async (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      }

      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        return success
      } catch (error) {
        return false
      }
    }

    const enrichWithLink = (k) => {
      const kode = k.id_kegiatan || k.kode || ''
      const judul = k.nama_kegiatan || ''
      const peran = k.peran || 'Peserta'
      const dbLinks = getRoleLinksFromKegiatan(k, peran)
      k.link_formulir = dbLinks.formUrl || buildFormLink(kode, peran, judul)
    }

    const currentUser = computed(() => auth.currentUser || {})
    const activityQrCodeMap = ref({})

    // Get profile of logged in pegawai
    const pegawai = ref(database.pegawai || [])
    const users = ref(database.users || [])
    const unitKerjaMaster = ref([])

    const profilePegawai = computed(() => {
      try {
        if (!currentUser.value || !currentUser.value.id) {
          console.warn('[Kegiatan] currentUser not available')
          return null
        }

        // Try matching dengan id_pegawai dulu
        let profile = pegawai.value.find(p =>
          String(p.id_pegawai) === String(currentUser.value.id_pegawai || currentUser.value.id)
        )

        // Jika tidak ketemu, coba matching dengan email
        if (!profile && currentUser.value.email) {
          const userRecord = users.value.find(u =>
            String(u.email) === String(currentUser.value.email)
          )
          if (userRecord) {
            profile = pegawai.value.find(p =>
              String(p.id_pegawai) === String(userRecord.id_pegawai)
            )
          }
        }

        if (profile) {
          // console.log('[Kegiatan] Found pegawai profile:', profile.nama)
          return profile
        } else {
          console.warn('[Kegiatan] No pegawai profile found')
          return null
        }
      } catch (error) {
        console.error('[Kegiatan] Error computing profilePegawai:', error)
        return null
      }
    })

    const userUnitKerjaOptions = computed(() => {
      const fromStore = Array.isArray(auth.unit_kerja) ? auth.unit_kerja : []
      if (fromStore.length > 0) {
        return fromStore
          .filter((item) => item?.unit_kerja_id !== null && item?.unit_kerja_id !== undefined && item?.unit_kerja_id !== '')
          .map((item) => ({
            unit_kerja_id: item.unit_kerja_id,
            kode_unit: item.kode_unit || '',
            nama_unit: item.nama_unit || ''
          }))
      }

      const ids = Array.isArray(currentUser.value?.unit_kerja_id) ? currentUser.value.unit_kerja_id : []
      return ids
        .filter((id) => id !== null && id !== undefined && id !== '')
        .map((id) => ({
          unit_kerja_id: id,
          kode_unit: unitKerjaMasterMap.value.get(String(id))?.kode_unit || '',
          nama_unit: unitKerjaMasterMap.value.get(String(id))?.nama_unit || `Unit ${id}`
        }))
    })

    const unitKerjaMasterMap = computed(() => {
      const map = new Map()
      const rows = Array.isArray(unitKerjaMaster.value) ? unitKerjaMaster.value : []
      rows.forEach((item) => {
        const id = item?.unit_kerja_id ?? item?.id
        if (id === null || id === undefined || id === '') return
        map.set(String(id), {
          unit_kerja_id: id,
          kode_unit: item?.kode_unit || '',
          nama_unit: item?.nama_unit || item?.nama || ''
        })
      })
      return map
    })

    const userUnitKerjaMap = computed(() => {
      const map = new Map()
      userUnitKerjaOptions.value.forEach((unit) => {
        if (unit?.unit_kerja_id === null || unit?.unit_kerja_id === undefined) return
        map.set(String(unit.unit_kerja_id), unit)
      })
      return map
    })

    const normalizeUnitKerjaId = (value) => {
      if (value === null || value === undefined) return ''
      const str = String(value).trim()
      if (!str) return ''
      if (/^\d+$/.test(str)) return String(Number(str))
      return str.toLowerCase()
    }

    const resolveKegiatanUnitKerjaId = (item) => {
      if (!item) return ''
      return item.unit_kerja_id ?? item.id_tim ?? item.unit_kerja?.unit_kerja_id ?? item.unit_kerja?.id ?? ''
    }

    const userAllowedUnitKerjaSet = computed(() => {
      const idsFromCurrentUser = Array.isArray(currentUser.value?.unit_kerja_id)
        ? currentUser.value.unit_kerja_id
        : [currentUser.value?.unit_kerja_id]
      const idsFromStore = Array.isArray(auth.unit_kerja)
        ? auth.unit_kerja.map((unit) => unit?.unit_kerja_id)
        : []
      const allIds = [...idsFromCurrentUser, ...idsFromStore]

      return new Set(
        allIds
          .map((id) => normalizeUnitKerjaId(id))
          .filter((id) => id !== '')
      )
    })

    const getUnitKerjaLabel = (item) => {
      if (!item) return '-'
      if (item.nama_unit) return item.nama_unit
      if (typeof item.unit_kerja === 'string' && item.unit_kerja.trim()) return item.unit_kerja
      if (item.unit_kerja && typeof item.unit_kerja === 'object') {
        const nestedName = item.unit_kerja.nama_unit || item.unit_kerja.nama || ''
        const nestedCode = item.unit_kerja.kode_unit || ''
        if (nestedName) {
          return nestedCode ? `${nestedCode} - ${nestedName}` : nestedName
        }
      }

      const resolvedUnitId = item.unit_kerja_id ?? item.id_tim ?? item.unit_kerja?.unit_kerja_id ?? item.unit_kerja?.id ?? null
      const key = resolvedUnitId !== undefined && resolvedUnitId !== null
        ? String(resolvedUnitId)
        : ''
      if (!key) return '-'

      const unitFromMaster = unitKerjaMasterMap.value.get(key)
      const unit = userUnitKerjaMap.value.get(key)
      if (!unitFromMaster && !unit) return `Unit ${key}`
      const resolved = unitFromMaster || unit
      if (!resolved) return `Unit ${key}`
      return resolved.kode_unit
        ? `${resolved.kode_unit} - ${resolved.nama_unit || `Unit ${key}`}`
        : (resolved.nama_unit || `Unit ${key}`)
    }

    // Fetch kegiatan dari API (sudah difilter berdasarkan pegawai yang login)
    const kegiatan = ref([])
    const isLoadingKegiatan = ref(false)

    const loadKegiatan = async () => {
      isLoadingKegiatan.value = true
      try {
        auth.restoreAuth()
        await auth.fetchMe().catch(() => {})

        const rawUnitKerjaIds = currentUser.value?.unit_kerja_id
        const unitKerjaIds = Array.isArray(rawUnitKerjaIds)
          ? rawUnitKerjaIds.filter(v => v !== null && v !== undefined && v !== '')
          : (rawUnitKerjaIds ? [rawUnitKerjaIds] : [])

        let merged = []
        let source = 'kegiatan'

        try {
          const allKegiatan = await listKegiatan()
          const rows = Array.isArray(allKegiatan)
            ? allKegiatan
            : (Array.isArray(allKegiatan?.data) ? allKegiatan.data : [])
          if (rows.length > 0) {
            merged = rows.map((item) => ({ ...(item || {}) }))
          }
        } catch {
          // fallback ke endpoint per unit kerja jika listKegiatan gagal
        }

        if (merged.length === 0 && unitKerjaIds.length > 0) {
          source = 'kegiatan-tim'
          const results = await Promise.all(
            unitKerjaIds.map(async (id) => {
              try {
                const res = await getKegiatanTim(id)
                const rows = Array.isArray(res) ? res : []
                return rows.map((item) => {
                  const normalized = { ...(item || {}) }
                  normalized.__source_unit_kerja_id = id
                  return normalized
                })
              } catch {
                return []
              }
            })
          )
          merged = results.flat()
        }

        // const deduped = Array.from(
        //   new Map(merged.map(item => [String(item.id_kegiatan), item])).values()
        // )

        const deduped = Array.from(
          new Map(
            merged.map(item => [
              source === 'kegiatan'
                ? String(item.id_kegiatan)
                : `${item.id_kegiatan}_${item.__source_unit_kerja_id || item.unit_kerja_id}`,
              item
            ])
          ).values()
        )

        kegiatan.value = source === 'kegiatan'
          ? deduped
          : deduped.filter((item) => {
              const unitId = normalizeUnitKerjaId(resolveKegiatanUnitKerjaId(item))
              return unitId !== '' && userAllowedUnitKerjaSet.value.has(unitId)
            })

        kegiatan.value.forEach(enrichWithLink)
      } catch (err) {
        // console.error('[Kegiatan] Failed to fetch kegiatan from API', err)
        kegiatan.value = []
      } finally {
        isLoadingKegiatan.value = false
      }
    }

    onMounted(async () => {
      try {
        isLoadingKegiatan.value = true

        const [pegawaiData, usersData, unitKerjaData] = await Promise.all([
          fetchAPI('pegawai'),
          fetchAPI('users'),
          fetchAPI('unit-kerja')
        ])

        if (Array.isArray(pegawaiData)) pegawai.value = pegawaiData
        if (Array.isArray(usersData)) users.value = usersData
        if (Array.isArray(unitKerjaData)) {
          unitKerjaMaster.value = unitKerjaData
        } else if (Array.isArray(unitKerjaData?.data)) {
          unitKerjaMaster.value = unitKerjaData.data
        }

        await loadKegiatan()
        if (!formData.value.unit_kerja_id) {
          formData.value.unit_kerja_id = userUnitKerjaOptions.value[0]?.unit_kerja_id ?? ''
        }

      } catch (e) {
        console.error(e)
      } finally {
        isLoadingKegiatan.value = false
      }

      ActivityEvents.ACCESS_PAGE('Manajemen Kegiatan')
    })

    // onMounted(async () => {
    //   // Load pegawai dan users data dari API
    //   try {
    //     console.log('[Kegiatan] Loading pegawai data from API...')
    //     const pegawaiData = await fetchAPI('pegawai')
    //     if (Array.isArray(pegawaiData)) {
    //       pegawai.value = pegawaiData
    //       console.log('[Kegiatan] ✅ Pegawai data loaded:', pegawaiData.length, 'records')
    //     }
    //   } catch (error) {
    //     console.warn('[Kegiatan] Failed to load pegawai from API:', error.message)
    //   }

    //   try {
    //     console.log('[Kegiatan] Loading users data from API...')
    //     const usersData = await fetchAPI('users')
    //     if (Array.isArray(usersData)) {
    //       users.value = usersData
    //       console.log('[Kegiatan] ✅ Users data loaded:', usersData.length, 'records')
    //     }
    //   } catch (error) {
    //     console.warn('[Kegiatan] Failed to load users from API:', error.message)
    //   }

    //   loadKegiatan()
    //   // Log page access
    //   ActivityEvents.ACCESS_PAGE('Manajemen Kegiatan')
    // })

    const searchQuery = ref('')
    const activeFilter = ref('all')
    const filterTahun = ref('')
    const showAddModal = ref(false)
    const isViewing = ref(false)
    const selectedKegiatan = ref(null)
    const showSuratTugasModal = ref(false)
    const selectedSuratTugas = ref(null)
    const suratTugasItems = ref([])
    const suratTugasPegawaiItems = ref([])
    const syncSelectedSuratTugasSnapshot = () => {
      if (!selectedSuratTugas.value) return

      const selectedId = selectedSuratTugas.value.id_kegiatan
        ?? selectedSuratTugas.value.id_penugasan
        ?? selectedSuratTugas.value.id_surat_tugas
        ?? null

      const updated = suratTugasItems.value.find(
        (item) => String(item.id_kegiatan ?? item.id_penugasan ?? item.id_surat_tugas ?? '') === String(selectedId ?? '')
      )

      if (updated) {
        selectedSuratTugas.value = updated
        return
      }

      selectedSuratTugas.value = {
        ...selectedSuratTugas.value,
        id_kegiatan: selectedId,
        id_penugasan: selectedId,
        id_surat_tugas: selectedId,
        penugasan_pegawais: []
      }
    }

    const loadSuratTugasSnapshot = async () => {
      try {
        const anggotaData = await listPenugasanPegawai()
        suratTugasItems.value = groupPenugasanByKegiatan(anggotaData)
        suratTugasPegawaiItems.value = anggotaData
      } catch (error) {
        console.error('Failed to load penugasan snapshot', error)
        suratTugasItems.value = Array.isArray(db.surat_tugas) ? db.surat_tugas : []
        suratTugasPegawaiItems.value = Array.isArray(db.surat_tugas_pegawai) ? db.surat_tugas_pegawai : []
      } finally {
        syncSelectedSuratTugasSnapshot()
      }
    }
    const showBiodataModal = ref(false)
    const selectedPeserta = ref(null)
    const administrasiDocs = ref([
      'Penugasan',
      'SPPD',
      'Tiket Pergi (Pulau Sumbawa)',
      'Tiket Pulang (Pulau Sumbawa)',
      'Nota Bensin (Pulau Lombok)'
    ])
    const editingId = ref(null)
    const formError = ref('')
    const isSubmitting = ref(false)
    const submitLoadingMessage = ref('Mohon tunggu, data kegiatan sedang diproses.')
    const submitStatus = ref({
      visible: false,
      type: 'success',
      title: '',
      message: ''
    })
    const isDraggingFlyer = ref(false)
    const flyerInput = ref(null)
    const flyerFile = ref(null)
    const templateBiodataInput = ref(null)
    const templateBiodataFile = ref(null)
    const isTemplateBiodataCleared = ref(false)
    const formAnggota = ref({ id_pegawai: '', peran: 'panitia' })
    const formAnggotaErrors = ref([])
    const editingAnggotaId = ref(null)
    const createEmptyAtkForm = () => ({
      nama_barang: '',
      spesifikasi: '',
      jumlah: '',
      satuan: '',
      keterangan: ''
    })

    const atkForm = ref(createEmptyAtkForm())
    const atkItems = ref([])
    const atkError = ref('')

    const formData = ref({
      nama_kegiatan: '',
      rincian_kegiatan: '',
      deskripsi: '',
      unit_kerja_id: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      lokasi: '',
      kabupaten_kota: '',
      flyer: '',
      metode_pelaksanaan: 'daring',
      metode_pembayaran: 'tidak_dibayar',
      total_peserta: 0,
      peserta_ringkasan: '',
      dokumentasi_url: '',
      materi_url: '',
      panduan_url: '',
      laporan_url: '',
      surat_menyurat_url: '',
      template_biodata: '',
      status: 'draft',
      id_pegawai: null
    })

    const kabupatenKotaOptions = ref([
      'Kabupaten Lombok Barat',
      'Kabupaten Lombok Tengah',
      'Kabupaten Lombok Timur',
      'Kabupaten Lombok Utara',
      'Kabupaten Sumbawa',
      'Kabupaten Sumbawa Barat',
      'Kabupaten Dompu',
      'Kabupaten Bima',
      'Kota Mataram',
      'Kota Bima',
      'Lainnya'
    ])

    const previewLink = computed(() => {
      const kode = formData.value.id_kegiatan || editingId.value || ''
      const peran = formData.value.peran || 'Peserta'
      const judul = formData.value.nama_kegiatan || ''
      return buildFormLink(kode, peran, judul)
    })

    const activityLinks = computed(() => {
      if (!selectedKegiatan.value) return []
      const kode = selectedKegiatan.value.id_kegiatan || ''
      const judul = selectedKegiatan.value.nama_kegiatan || ''
      const labels = {
        peserta: 'Formulir Peserta',
        panitia: 'Formulir Panitia',
        narasumber: 'Formulir Narasumber',
        pendamping: 'Formulir Pendamping'
      }
      const roles = ['Peserta', 'Panitia', 'Narasumber', 'Pendamping']
      const links = roles.map((role) => {
        const roleLinks = getRoleLinksFromKegiatan(selectedKegiatan.value, role)
        return {
          role,
          label: labels[role.toLowerCase()] || `Formulir ${role}`,
          url: roleLinks.formUrl || buildFormLink(kode, role, judul),
          templateUrl: roleLinks.templateUrl
        }
      })
      
      // Add Evaluasi and Laporan Evaluasi links
      
      links.push({
        role: 'evaluasi',
        label: 'Link Evaluasi',
        url: buildPublicEvaluasiLink(kode, judul),
        templateUrl: null
      })
      links.push({
        role: 'laporan-evaluasi',
        label: 'Laporan Evaluasi',
        url: buildPublicLaporanEvaluasiLink(kode, judul),
        templateUrl: null
      })
      
      
      return links
    })

    const generateActivityQrCodes = async () => {
      const urls = activityLinks.value
        .map((item) => item.url)
        .filter(Boolean)
      const nextMap = {}
      await Promise.all(urls.map(async (url) => {
        try {
          nextMap[url] = await QRCode.toDataURL(url, { width: 180, margin: 1 })
        } catch (error) {
          nextMap[url] = ''
        }
      }))
      activityQrCodeMap.value = nextMap
    }

    const getActivityQrCodeUrl = (url) => activityQrCodeMap.value[url] || ''

    watch(
      () => activityLinks.value.map((item) => item.url).join('|'),
      () => {
        generateActivityQrCodes()
      },
      { immediate: true }
    )

    const anggotaInSelected = computed(() => {
      if (!selectedSuratTugas.value) return []
      const selectedId = selectedSuratTugas.value.id_kegiatan
        ?? selectedSuratTugas.value.id_penugasan
        ?? selectedSuratTugas.value.id_surat_tugas
        ?? null

      return suratTugasPegawaiItems.value.filter(
        (sp) => String(sp.id_kegiatan ?? sp.id_penugasan ?? sp.id_surat_tugas ?? '') === String(selectedId ?? '')
      )
    })

    const pegawaiOptions = computed(() => {
      // Prefer runtime-loaded pegawai list, fall back to bundled data
      return (Array.isArray(pegawai.value) && pegawai.value.length > 0) ? pegawai.value : (db.pegawai || [])
    })

    const resetForm = () => {
      formData.value = {
        nama_kegiatan: '',
        rincian_kegiatan: '',
        deskripsi: '',
        unit_kerja_id: userUnitKerjaOptions.value[0]?.unit_kerja_id ?? '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        lokasi: '',
        flyer: '',
        metode_pelaksanaan: 'daring',
        metode_pembayaran: 'tidak_dibayar',
        total_peserta: 0,
        peserta_ringkasan: '',
        dokumentasi_url: '',
        materi_url: '',
        panduan_url: '',
        laporan_url: '',
        surat_menyurat_url: '',
        template_biodata: '',
        status: 'draft',
        id_pegawai: null
      }
      flyerFile.value = null
      templateBiodataFile.value = null
      isTemplateBiodataCleared.value = false
      if (templateBiodataInput.value) {
        templateBiodataInput.value.value = ''
      }
      atkForm.value = createEmptyAtkForm()
      atkItems.value = []
      atkError.value = ''
      formError.value = ''
    }

    const showSubmitStatus = ({ type = 'success', title = '', message = '' }) => {
      submitStatus.value = {
        visible: true,
        type,
        title,
        message
      }
    }

    const closeSubmitStatus = () => {
      submitStatus.value.visible = false
    }

    const filteredKegiatan = computed(() => {
      let filtered = Array.isArray(kegiatan.value) ? [...kegiatan.value] : []

      if (searchQuery.value) {
        filtered = filtered.filter(k =>
          String(k.nama_kegiatan || '').toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      if (activeFilter.value !== 'all') {
        filtered = filtered.filter(k => k.status === activeFilter.value)
      }

      if (filterTahun.value) {
        filtered = filtered.filter(k =>
          k.tanggal_mulai && new Date(k.tanggal_mulai).getFullYear().toString() === filterTahun.value
        )
      }

      return filtered
    })

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const getMetodeLabel = (metode) => {
      const labels = { 'daring': 'Daring', 'luring': 'Luring', 'hybrid': 'Hybrid' }
      return labels[metode] || metode
    }

    const getFlyerUrl = (path) => {
      return getStorageFileUrl(path)
    }

    const getStatusLabel = (status) => {
      const labels = { 'berjalan': 'Berjalan', 'akan_datang': 'Akan Datang', 'selesai': 'Selesai', 'draft': 'Draft', 'dibatalkan': 'Dibatalkan' }
      return labels[status] || status
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        'berjalan': 'bg-blue-100 text-blue-700',
        'akan_datang': 'bg-amber-100 text-amber-700',
        'selesai': 'bg-green-100 text-green-700',
        'draft': 'bg-slate-100 text-slate-700',
        'dibatalkan': 'bg-red-100 text-red-700'
      }
      return classes[status] || 'bg-slate-100 text-slate-700'
    }

    const getPaymentMethodLabel = (method) => {
      const labels = {
        'transfer': 'Transfer',
        'pulsa': 'Pulsa',
        'transfer_dan_pulsa': 'Transfer & Pulsa',
        'tunai': 'Tunai',
        'tidak_dibayar': 'Tidak Dibayar'
      }
      return labels[method] || method
    }

    const hasResourceUrls = () => {
      return selectedKegiatan.value && (
        selectedKegiatan.value.dokumentasi_url ||
        selectedKegiatan.value.materi_url ||
        selectedKegiatan.value.panduan_url ||
        selectedKegiatan.value.laporan_url ||
        selectedKegiatan.value.surat_menyurat_url
      )
    }

    const validateForm = () => {
      if (!formData.value.nama_kegiatan.trim()) {
        formError.value = 'Nama kegiatan harus diisi'
        return false
      }
      if (!formData.value.unit_kerja_id) {
        formError.value = 'Unit kerja harus dipilih'
        return false
      }
      if (!formData.value.tanggal_mulai) {
        formError.value = 'Tanggal mulai harus diisi'
        return false
      }
      if (!formData.value.tanggal_selesai) {
        formError.value = 'Tanggal selesai harus diisi'
        return false
      }
      if (new Date(formData.value.tanggal_mulai) > new Date(formData.value.tanggal_selesai)) {
        formError.value = 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai'
        return false
      }
      if (!formData.value.lokasi.trim()) {
        formError.value = 'Lokasi harus diisi'
        return false
      }
      if (!formData.value.metode_pelaksanaan) {
        formError.value = 'Metode pelaksanaan harus dipilih'
        return false
      }
      if (!formData.value.metode_pembayaran) {
        formError.value = 'Metode pembayaran harus dipilih'
        return false
      }
      if (formData.value.total_peserta < 0) {
        formError.value = 'Total peserta tidak boleh negatif'
        return false
      }
      if (!formData.value.status) {
        formError.value = 'Status harus dipilih'
        return false
      }
      formError.value = ''
      return true
    }

    const viewDetail = async (id) => {
      try {
        const item = await getKegiatan(id)
        const sourceItem = item || (kegiatan.value.find(k => String(k.id_kegiatan) === String(id)) || null)
        if (!sourceItem) return
        const listItem = kegiatan.value.find(k => String(k.id_kegiatan) === String(id))
        const unitFallback = listItem?.unit_kerja_id ?? listItem?.id_tim ?? listItem?.__source_unit_kerja_id ?? null
        selectedKegiatan.value = {
          ...sourceItem,
          unit_kerja_id: sourceItem.unit_kerja_id ?? unitFallback,
          id_tim: sourceItem.id_tim ?? unitFallback,
          __source_unit_kerja_id: sourceItem.__source_unit_kerja_id ?? unitFallback
        }
        // Prefill the add-modal form but in read-only mode
        formData.value = normalizeKegiatanFormData(selectedKegiatan.value)
        loadKegiatanAtkItems(selectedKegiatan.value)
        editingId.value = null
        isViewing.value = true
        showAddModal.value = true
        // Log viewing detail
        ActivityEvents.VIEW_KEGIATAN_DETAIL(id, selectedKegiatan.value?.nama_kegiatan)
      } catch (err) {
        console.warn('Failed to load kegiatan for view', err)
      }
    }

    const openEditFromDetail = async () => {
      if (selectedKegiatan.value) {
        formData.value = normalizeKegiatanFormData(selectedKegiatan.value)
        flyerFile.value = null
        templateBiodataFile.value = null
        isTemplateBiodataCleared.value = false
        editingId.value = selectedKegiatan.value.id_kegiatan
        isViewing.value = false
        showAddModal.value = true
        loadKegiatanAtkItems(selectedKegiatan.value)
      }
    }

    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        if (file.size > 2 * 1024 * 1024) {
          reject(new Error('Ukuran flyer tidak boleh lebih dari 2MB'))
          return
        }
        if (!file.type.startsWith('image/')) {
          reject(new Error('File harus berupa gambar'))
          return
        }
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })
    }

    const handleFlyerSelect = async (event) => {
      const file = event.target.files[0]
      if (file) {
        flyerFile.value = file
        try {
          const base64 = await convertFileToBase64(file)
          formData.value.flyer = base64
          formError.value = ''
        } catch (error) {
          formError.value = error.message
        }
      }
    }

    const handleFlyerDrop = async (event) => {
      isDraggingFlyer.value = false
      const files = event.dataTransfer.files
      const file = files[0]
      if (file) {
        flyerFile.value = file
        try {
          const base64 = await convertFileToBase64(file)
          formData.value.flyer = base64
          formError.value = ''
        } catch (error) {
          formError.value = error.message
        }
      }
    }

    const handleFlyerPaste = async (event) => {
      const items = event.clipboardData?.items
      if (items) {
        for (let item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile()
            flyerFile.value = file
            try {
              const base64 = await convertFileToBase64(file)
              formData.value.flyer = base64
              formError.value = ''
            } catch (error) {
              formError.value = error.message
            }
            break
          }
        }
      }
    }

    const removeFlyerImage = () => {
      formData.value.flyer = ''
      flyerFile.value = null
      if (flyerInput.value) {
        flyerInput.value.value = ''
      }
    }

    const handleTemplateBiodataSelect = (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      const fileName = String(file.name || '').toLowerCase()
      const isValidExt = fileName.endsWith('.doc') || fileName.endsWith('.docx')
      if (!isValidExt) {
        formError.value = 'Template biodata harus file DOC atau DOCX'
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        formError.value = 'Ukuran template biodata tidak boleh lebih dari 10MB'
        return
      }

      templateBiodataFile.value = file
      isTemplateBiodataCleared.value = false
      formError.value = ''
    }

    const removeTemplateBiodata = () => {
      templateBiodataFile.value = null
      formData.value.template_biodata = ''
      isTemplateBiodataCleared.value = true
      if (templateBiodataInput.value) {
        templateBiodataInput.value.value = ''
      }
    }

    const parseAtkJumlah = (value) => {
      if (value === '' || value === null || value === undefined) return null
      const parsed = Number(value)
      return Number.isNaN(parsed) ? null : parsed
    }

    const normalizeAtkItem = (item) => {
      return {
        nama_barang: String(item?.nama_barang ?? item?.nama_atk ?? '').trim(),
        spesifikasi: String(item?.spesifikasi ?? '').trim(),
        jumlah: parseAtkJumlah(item?.jumlah),
        satuan: String(item?.satuan ?? '').trim(),
        keterangan: String(item?.keterangan ?? '').trim()
      }
    }

    const loadKegiatanAtkItems = (item) => {
      atkError.value = ''
      if (!item) {
        atkItems.value = []
        return
      }

      let rows = []
      if (Array.isArray(item?.daftarAtk)) {
        rows = item.daftarAtk
      } else if (Array.isArray(item?.daftar_atk)) {
        rows = item.daftar_atk
      } else if (typeof item?.daftarAtk === 'string') {
        try {
          const parsed = JSON.parse(item.daftarAtk)
          if (Array.isArray(parsed)) rows = parsed
        } catch {
          rows = []
        }
      } else if (typeof item?.daftar_atk === 'string') {
        try {
          const parsed = JSON.parse(item.daftar_atk)
          if (Array.isArray(parsed)) rows = parsed
        } catch {
          rows = []
        }
      } else if (Array.isArray(item?.atk)) {
        rows = item.atk
      } else if (Array.isArray(item?.atk_items)) {
        rows = item.atk_items
      } else if (typeof item?.atk === 'string') {
        try {
          const parsed = JSON.parse(item.atk)
          if (Array.isArray(parsed)) rows = parsed
        } catch {
          rows = []
        }
      } else if (typeof item?.atk_items === 'string') {
        try {
          const parsed = JSON.parse(item.atk_items)
          if (Array.isArray(parsed)) rows = parsed
        } catch {
          rows = []
        }
      }

      atkItems.value = rows.map(normalizeAtkItem)
    }

    const showAllData = ref(false)
    const prettySelectedKegiatan = computed(() => {
      try {
        return JSON.stringify(selectedKegiatan.value || {}, null, 2)
      } catch (e) {
        return String(selectedKegiatan.value || '')
      }
    })

    const addAtkItem = () => {
      const namaBarang = String(atkForm.value.nama_barang || '').trim()
      const spesifikasi = String(atkForm.value.spesifikasi || '').trim()
      const jumlahRaw = atkForm.value.jumlah
      const jumlahParsed = parseAtkJumlah(jumlahRaw)
      const satuan = String(atkForm.value.satuan || '').trim()
      const keterangan = String(atkForm.value.keterangan || '').trim()

      if (!namaBarang) {
        atkError.value = 'Nama barang ATK wajib diisi'
        return
      }
      if (jumlahRaw !== '' && (jumlahParsed === null || jumlahParsed < 0)) {
        atkError.value = 'Jumlah harus berupa angka 0 atau lebih'
        return
      }

      atkItems.value.push({
        nama_barang: namaBarang,
        spesifikasi,
        jumlah: jumlahParsed,
        satuan,
        keterangan
      })
      atkForm.value = createEmptyAtkForm()
      atkError.value = ''
    }

    const removeAtkItem = (index) => {
      atkItems.value.splice(index, 1)
    }

    const buildAtkPayloadItems = () =>
      atkItems.value
        .map(normalizeAtkItem)
        .filter(item => item.nama_barang)
        .map(item => ({
          nama_barang: item.nama_barang,
          spesifikasi: item.spesifikasi || null,
          jumlah: item.jumlah ?? null,
          satuan: item.satuan || null,
          keterangan: item.keterangan || null
        }))

    const buildKegiatanPayloadObject = (data, { isUpdate = false } = {}) => {
      // Kirim hanya field yang memang diperlukan backend untuk create/update.
      // Hindari mengirim field turunan seperti link_formulir atau metadata lain.
      const payload = {
        nama_kegiatan: data.nama_kegiatan,
        rincian_kegiatan: data.rincian_kegiatan,
        deskripsi: data.deskripsi,
        unit_kerja_id: data.unit_kerja_id,
        id_tim: data.unit_kerja_id,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
        lokasi: data.lokasi,
        metode_pelaksanaan: data.metode_pelaksanaan,
        metode_pembayaran: data.metode_pembayaran,
        total_peserta: data.total_peserta,
        peserta_ringkasan: data.peserta_ringkasan,
        dokumentasi_url: data.dokumentasi_url,
        materi_url: data.materi_url,
        panduan_url: data.panduan_url,
        laporan_url: data.laporan_url,
        surat_menyurat_url: data.surat_menyurat_url,
        kabupaten_kota: data.kabupaten_kota,
        status: data.status
      }

      // Untuk create tetap kirim id_pegawai jika ada.
      if (!isUpdate && data.id_pegawai) {
        payload.id_pegawai = data.id_pegawai
      }

      // Buang nilai undefined/null/empty string agar tidak memicu validasi tak perlu.
      return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
      )
    }

    const toDateInputValue = (value) => {
      if (!value) return ''
      const str = String(value)
      const match = str.match(/^(\d{4}-\d{2}-\d{2})/)
      if (match) return match[1]

      const date = new Date(str)
      if (Number.isNaN(date.getTime())) return ''
      return date.toISOString().slice(0, 10)
    }

    const normalizeKegiatanFormData = (data) => ({
      ...data,
      unit_kerja_id: data.unit_kerja_id ?? data.id_tim ?? '',
      tanggal_mulai: toDateInputValue(data.tanggal_mulai),
      tanggal_selesai: toDateInputValue(data.tanggal_selesai)
    })

    const editKegiatan = async (id) => {
      try {
        const item = await getKegiatan(id)
        if (item) {
          enrichWithLink(item)
          formData.value = normalizeKegiatanFormData(item)
          templateBiodataFile.value = null
          isTemplateBiodataCleared.value = false
          editingId.value = id
          showAddModal.value = true
          loadKegiatanAtkItems(item)
        }
      } catch (err) {
        const item = kegiatan.value.find(k => String(k.id_kegiatan) === String(id))
        if (item) {
          formData.value = normalizeKegiatanFormData(item)
          templateBiodataFile.value = null
          isTemplateBiodataCleared.value = false
          editingId.value = id
          showAddModal.value = true
          loadKegiatanAtkItems(item)
        }
      }
    }

    const duplicateKegiatan = async (item) => {
      try {
        let source = item || {}
        const sourceId = source.id_kegiatan || source.id

        if (sourceId) {
          try {
            source = {
              ...source,
              ...(await getKegiatan(sourceId) || {})
            }
          } catch (err) {
            console.warn('Failed to load full kegiatan before duplicate, using current row data', err)
          }
        }

        // Prepare form with normalized values but ensure we are creating a new record
        formData.value = normalizeKegiatanFormData({ ...source })
        // Remove any identifying fields
        delete formData.value.id_kegiatan
        delete formData.value.id
        editingId.value = null
        isViewing.value = false
        formError.value = ''
        submitStatus.value.visible = false
        // Reset file inputs (user can re-upload if desired)
        flyerFile.value = null
        templateBiodataFile.value = null
        isTemplateBiodataCleared.value = false
        // Load ATK items from source
        loadKegiatanAtkItems(source)
        // Open add modal for creating (pre-filled)
        showAddModal.value = true
      } catch (err) {
        console.error('Failed to duplicate kegiatan', err)
        alert('Gagal menyiapkan duplikat kegiatan')
      }
    }

    const deleteKegiatan = async (id) => {
      if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return
      try {
        // Get kegiatan name before deleting
        const kegiatanToDelete = kegiatan.value.find(k => k.id_kegiatan === id)
        const kegiatanName = kegiatanToDelete?.nama_kegiatan || id

        await removeKegiatan(id)
        kegiatan.value = kegiatan.value.filter(k => k.id_kegiatan !== id)

        // Log deletion
        ActivityEvents.DELETE_KEGIATAN(id, kegiatanName)
      } catch (err) {
        console.error('Gagal menghapus kegiatan', err)
        kegiatan.value = kegiatan.value.filter(k => k.id_kegiatan !== id)

        // Log deletion error
        ActivityEvents.ERROR_OCCURRED('Gagal menghapus kegiatan', 'Kegiatan.vue - deleteKegiatan')
      }
    }

    const saveKegiatan = async () => {
      formData.value = normalizeKegiatanFormData(formData.value)
      if (!validateForm()) return

      isSubmitting.value = true
      submitLoadingMessage.value = editingId.value
        ? 'Perubahan kegiatan sedang disimpan ke server.'
        : 'Kegiatan baru sedang dibuat di server.'

      try {
        const authToken = localStorage.getItem('auth_token')
        if (!authToken) {
          formError.value = 'Sesi login tidak ditemukan. Silakan login ulang.'
          showSubmitStatus({
            type: 'error',
            title: 'Simpan gagal',
            message: formError.value
          })
          return
        }

        if (currentUser.value) {
          formData.value.id_pegawai = currentUser.value.id_pegawai || currentUser.value.id || null
        }

        const normalizedData = normalizeKegiatanFormData(formData.value)
        const payloadObject = buildKegiatanPayloadObject(normalizedData, { isUpdate: Boolean(editingId.value) })
        const daftarAtkPayload = buildAtkPayloadItems()
        let payload
        const hasFilePayload = Boolean(flyerFile.value || templateBiodataFile.value || isTemplateBiodataCleared.value)
        const useMultipart = hasFilePayload || daftarAtkPayload.length > 0
        if (useMultipart) {
          payload = new FormData()
          Object.keys(payloadObject).forEach(key => {
            const val = payloadObject[key]
            if (val !== null && val !== undefined) {
              payload.append(key, val)
            }
          })
          daftarAtkPayload.forEach((item, index) => {
            payload.append(`daftar_atk[${index}][nama_barang]`, item.nama_barang)
            if (item.spesifikasi) {
              payload.append(`daftar_atk[${index}][spesifikasi]`, item.spesifikasi)
            }
            if (item.jumlah !== null && item.jumlah !== undefined) {
              payload.append(`daftar_atk[${index}][jumlah]`, item.jumlah)
            }
            if (item.satuan) {
              payload.append(`daftar_atk[${index}][satuan]`, item.satuan)
            }
            if (item.keterangan) {
              payload.append(`daftar_atk[${index}][keterangan]`, item.keterangan)
            }
          })
          if (flyerFile.value) {
            payload.append('flyer', flyerFile.value)
          }
          if (templateBiodataFile.value) {
            payload.append('template_biodata', templateBiodataFile.value)
          } else if (isTemplateBiodataCleared.value) {
            payload.append('template_biodata', '')
          }
        } else {
          payload = { ...payloadObject }
          payload.daftar_atk = daftarAtkPayload
        }

        if (editingId.value) {
          const updated = useMultipart
            ? await postAPI(`kegiatan/${editingId.value}`, (() => {
              const fd = payload
              fd.append('_method', 'PUT')
              return fd
            })())
            : await updateKegiatan(editingId.value, payload)
          enrichWithLink(updated || {})
          const index = kegiatan.value.findIndex(k => String(k.id_kegiatan) === String(editingId.value))
          if (index !== -1) {
            kegiatan.value[index] = {
              ...kegiatan.value[index],
              ...(updated || {}),
              ...normalizedData
            }

          }
          await loadKegiatan()
          // Log update
          ActivityEvents.UPDATE_KEGIATAN(editingId.value, formData.value.nama_kegiatan)
          showSubmitStatus({
            type: 'success',
            title: 'Perubahan tersimpan',
            message: `Kegiatan "${formData.value.nama_kegiatan}" berhasil diperbarui.`
          })
        } else {
          const created = await createKegiatan(payload)
          enrichWithLink(created)
          kegiatan.value.push(created)
          // Log creation
          ActivityEvents.CREATE_KEGIATAN(formData.value.nama_kegiatan)
          showSubmitStatus({
            type: 'success',
            title: 'Kegiatan berhasil dibuat',
            message: `Kegiatan "${formData.value.nama_kegiatan}" berhasil disimpan.`
          })
        }

        showAddModal.value = false
        editingId.value = null
        resetForm()
      } catch (err) {
        console.error('Failed to save kegiatan', err)
        const errMessage = String(err?.message || '')
        if (errMessage.toLowerCase().includes('failed to upload')) {
          formError.value = 'Upload file gagal. Periksa ukuran/format file dan pastikan konfigurasi server PHP (upload_max_filesize & post_max_size) mencukupi.'
        } else if (errMessage.includes('403')) {
          formError.value = `${errMessage} Akses ditolak (403). Pastikan akun Anda berhak ${editingId.value ? 'mengubah' : 'membuat'} kegiatan, token masih valid, dan login sebagai admin.`
        } else {
          formError.value = errMessage || 'Gagal menyimpan kegiatan'
        }
        // Log error
        if (!errMessage.includes('403')) {
          ActivityEvents.ERROR_OCCURRED(formError.value || 'Gagal menyimpan kegiatan', 'Kegiatan.vue - saveKegiatan')
        }
        showSubmitStatus({
          type: 'error',
          title: 'Simpan gagal',
          message: formError.value || 'Terjadi kesalahan saat menyimpan kegiatan.'
        })
      } finally {
        isSubmitting.value = false
      }
    }

    const openPesertaList = (id) => {
      router.push({ name: 'kegiatan-peserta', params: { id } })
    }

    const openBiodataModal = (peserta) => {
      selectedPeserta.value = {
        ...peserta,
        nama_kegiatan: peserta.nama_kegiatan || selectedKegiatan.value?.nama_kegiatan || '-',
        tanggal_mulai: peserta.tanggal_mulai || selectedKegiatan.value?.tanggal_mulai || '',
        tanggal_selesai: peserta.tanggal_selesai || selectedKegiatan.value?.tanggal_selesai || '',
        lokasi: peserta.lokasi || selectedKegiatan.value?.lokasi || '-',
        // Get ATK from kegiatan
        daftar_atk: selectedKegiatan.value?.daftar_atk || []
      }
      showBiodataModal.value = true
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
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Biodata Peserta</title>
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
              line-height: 1.6;
              padding: 15mm;
              color: #000;
            }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .mb-6 { margin-bottom: 1.5rem; }
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
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
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

    const handleSuratTugas = async (idKegiatan) => {
      await loadSuratTugasSnapshot()
      // Cari surat tugas untuk kegiatan ini
      const existingSuratTugas = suratTugasItems.value.find(st => String(st.id_kegiatan) === String(idKegiatan))

      if (existingSuratTugas) {
        // Ada surat tugas, tampilkan modal
        selectedSuratTugas.value = existingSuratTugas
        // Jika data kegiatan belum terisi dari hasil grouping, coba ambil dari daftar kegiatan utama
        if (!selectedSuratTugas.value.kegiatan) {
          const kegiatanObj = (Array.isArray(kegiatan.value) ? kegiatan.value : []).find(k => String(k.id_kegiatan ?? k.id) === String(idKegiatan))
          if (kegiatanObj) selectedSuratTugas.value.kegiatan = kegiatanObj
        }
        // Sync snapshot to ensure anggota list is up-to-date
        syncSelectedSuratTugasSnapshot()
        formAnggota.value = { id_pegawai: '', peran: 'panitia' }
        showSuratTugasModal.value = true
      } else {
        // Tidak ada, buka modal kosong untuk membuat penugasan baru
        selectedSuratTugas.value = { id_kegiatan: idKegiatan, kegiatan: null, penugasan_pegawais: [] }
        const kegiatanObj = (Array.isArray(kegiatan.value) ? kegiatan.value : []).find(k => String(k.id_kegiatan ?? k.id) === String(idKegiatan))
        if (kegiatanObj) selectedSuratTugas.value.kegiatan = kegiatanObj
        syncSelectedSuratTugasSnapshot()
        formAnggota.value = { id_pegawai: '', peran: 'panitia' }
        showSuratTugasModal.value = true
      }
    }

    const sharePublicPesertaLink = async (kegiatanItem) => {
      const link = buildPublicPesertaLink(kegiatanItem?.id_kegiatan || '', kegiatanItem?.nama_kegiatan || '')
      const shareTitle = `Daftar Peserta - ${kegiatanItem?.nama_kegiatan || 'Kegiatan'}`

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: 'Link publik daftar peserta kegiatan',
            url: link
          })
          return
        } catch (error) {
          if (error?.name === 'AbortError') return
        }
      }

      const copied = await copyText(link)
      if (copied) {
        alert('Link publik peserta berhasil disalin ke clipboard.')
      } else {
        prompt('Salin link publik peserta berikut:', link)
      }
    }

    const parseDateValue = (value) => {
      const timestamp = new Date(value).getTime()
      return Number.isNaN(timestamp) ? null : timestamp
    }

    const dateRangesOverlap = (startA, endA, startB, endB) => {
      if (startA === null || endA === null || startB === null || endB === null) return false
      return startA <= endB && startB <= endA
    }

    const getKegiatanDateRange = (kegiatanItem = {}) => {
      return [
        parseDateValue(kegiatanItem.tanggal_mulai),
        parseDateValue(kegiatanItem.tanggal_selesai)
      ]
    }

    const findOverlappingKegiatanForPegawai = (pegawaiId, kegiatanId, excludeAssignmentId = null) => {
      const selectedKegiatan = selectedSuratTugas.value?.kegiatan
        || (Array.isArray(kegiatan.value) ? kegiatan.value.find((item) => String(item.id_kegiatan) === String(kegiatanId)) : null)

      if (!selectedKegiatan) return null

      const [selectedStart, selectedEnd] = getKegiatanDateRange(selectedKegiatan)
      if (selectedStart === null || selectedEnd === null) return null

      return suratTugasPegawaiItems.value.find((sp) => {
        if (!sp.id_pegawai || String(sp.id_pegawai) !== String(pegawaiId)) return false
        if (excludeAssignmentId && String(sp.id) === String(excludeAssignmentId)) return false

        const currentKegiatanId = sp.id_kegiatan ?? sp.id_penugasan ?? sp.id_surat_tugas
        if (String(currentKegiatanId) === String(kegiatanId)) return false

        const otherKegiatan = sp.kegiatan
          || (Array.isArray(kegiatan.value) ? kegiatan.value.find((item) => String(item.id_kegiatan) === String(currentKegiatanId)) : null)

        if (!otherKegiatan) return false

        const [otherStart, otherEnd] = getKegiatanDateRange(otherKegiatan)
        return dateRangesOverlap(selectedStart, selectedEnd, otherStart, otherEnd)
      })
    }

    const addAnggota = async () => {
      formAnggotaErrors.value = []

      // Validasi
      if (!formAnggota.value.id_pegawai) {
        formAnggotaErrors.value.push('Pegawai wajib dipilih')
      }
      if (!formAnggota.value.peran) {
        formAnggotaErrors.value.push('Peran wajib dipilih')
      }

      const pegawaiItem = (Array.isArray(pegawai.value) ? pegawai.value : []).find(p => p.id_pegawai === formAnggota.value.id_pegawai)
      if (formAnggota.value.id_pegawai && !pegawaiItem) {
        formAnggotaErrors.value.push('Pegawai tidak ditemukan')
      }

      // Cek duplikat
      const duplicate = anggotaInSelected.value.some((a) => String(a.id_pegawai) === String(formAnggota.value.id_pegawai) && String(a.id) !== String(editingAnggotaId.value))
      if (duplicate) {
        formAnggotaErrors.value.push('Pegawai ini sudah ditambahkan ke kegiatan ini')
      }

      const selectedId = selectedSuratTugas.value?.id_kegiatan
        ?? selectedSuratTugas.value?.id_penugasan
        ?? selectedSuratTugas.value?.id_surat_tugas

      const overlappingAssignment = formAnggota.value.id_pegawai && selectedId
        ? findOverlappingKegiatanForPegawai(formAnggota.value.id_pegawai, selectedId, editingAnggotaId.value)
        : null

      if (overlappingAssignment) {
        const otherKegiatan = overlappingAssignment.kegiatan || {}
        const tanggal = formatDateRange(otherKegiatan.tanggal_mulai, otherKegiatan.tanggal_selesai)
        formAnggotaErrors.value.push(
          `Pegawai ini sudah memiliki tugas pada kegiatan ${otherKegiatan.nama_kegiatan || '-'}, ${otherKegiatan.lokasi || '-'}, ${tanggal}`
        )
      }

      if (formAnggotaErrors.value.length > 0) return
      try {
        if (editingAnggotaId.value) {
          // Update anggota
          await editPenugasanPegawai(editingAnggotaId.value, {
            id_kegiatan: selectedSuratTugas.value.id_kegiatan ?? selectedSuratTugas.value.id_penugasan ?? selectedSuratTugas.value.id_surat_tugas,
            id_pegawai: formAnggota.value.id_pegawai,
            peran: formAnggota.value.peran
          })
        } else {
          await createPenugasanPegawai({
            id_kegiatan: selectedSuratTugas.value.id_kegiatan ?? selectedSuratTugas.value.id_penugasan ?? selectedSuratTugas.value.id_surat_tugas,
            id_pegawai: formAnggota.value.id_pegawai,
            peran: formAnggota.value.peran
          })
        }
        await loadSuratTugasSnapshot()
        formAnggota.value = { id_pegawai: '', peran: 'panitia' }
        formAnggotaErrors.value = []
        editingAnggotaId.value = null
      } catch (error) {
        console.error('Failed to add/edit anggota penugasan', error)
        formAnggotaErrors.value = [error?.message || 'Gagal menambah/ubah anggota penugasan']
      }
    }

    const removeAnggota = async (id) => {
      if (!confirm('Hapus anggota ini?')) return
      try {
        await removePenugasanPegawai(id)
        await loadSuratTugasSnapshot()
      } catch (error) {
        console.error('Failed to remove anggota penugasan', error)
        alert(error?.message || 'Gagal menghapus anggota penugasan')
      }
    }

    const editAnggota = (anggota) => {
      editingAnggotaId.value = anggota.id
      formAnggota.value = {
        id_pegawai: anggota.id_pegawai,
        peran: anggota.peran || 'panitia'
      }
      // ensure selectedSuratTugas is the current group
      syncSelectedSuratTugasSnapshot()
    }

    const cancelEditAnggota = () => {
      editingAnggotaId.value = null
      formAnggota.value = { id_pegawai: '', peran: 'panitia' }
      formAnggotaErrors.value = []
    }

    const escapeHtml = (unsafe) => {
      if (!unsafe && unsafe !== 0) return ''
      return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    const copyAnggotaTable = async () => {
      const rows = anggotaInSelected.value || []
      if (!rows.length) {
        alert('Tidak ada anggota untuk disalin')
        return
      }

      const thead = `<tr><th>No</th><th>Nama, NIP, Pangkat, dan Gol</th><th>Jabatan</th><th>Jabatan dalam Kegiatan</th></tr>`
      const trs = rows.map((a, idx) => {
        const name = (a.pegawai && a.pegawai.nama) || escapeHtml(getNamaPegawai(a.id_pegawai))
        const nip = (a.pegawai && (a.pegawai.nip || a.pegawai.nip_pegawai)) || ''
        const pangkat = (a.pegawai && (a.pegawai.pangkat || a.pegawai.pangkat_golongan || a.pegawai.pangkat_gol)) || ''
        const gol = (a.pegawai && (a.pegawai.golongan || a.pegawai.gol)) || ''
        const jabatan = (a.pegawai && (a.pegawai.nama_jabatan || a.pegawai.jabatan)) || ''
        const peran = getPeranLabel(a.peran)
        return `<tr><td>${idx + 1}</td><td>${name}<br/>NIP. ${escapeHtml(nip)}<br/>${escapeHtml(pangkat)} ${escapeHtml(gol)}</td><td>${escapeHtml(jabatan)}</td><td>${escapeHtml(peran)}</td></tr>`
      }).join('\n')

      const tableHtml = `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse"> <thead>${thead}</thead><tbody>${trs}</tbody></table>`

      // Copy by inserting temporary element and selecting
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.left = '-9999px'
      container.innerHTML = tableHtml
      document.body.appendChild(container)

      const range = document.createRange()
      range.selectNode(container)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)

      try {
        document.execCommand('copy')
        alert('Tabel anggota berhasil disalin. Paste ke Word/Excel.')
      } catch (err) {
        console.error('Copy failed', err)
        alert('Gagal menyalin tabel ke clipboard')
      } finally {
        sel.removeAllRanges()
        document.body.removeChild(container)
      }
    }

    const getNamaPegawai = (idPegawai) => {
      const p = (Array.isArray(pegawai.value) ? pegawai.value : []).find(peg => String(peg.id_pegawai) === String(idPegawai))
      return p ? p.nama : '-'
    }

    const getPeranLabel = (peran) => {
      const labels = {
        penanggung_jawab: 'Penanggung Jawab',
        ketua_panitia: 'Ketua Panitia',
        panitia: 'Panitia',
        peserta: 'Peserta',
        narasumber: 'Narasumber'
      }
      return labels[peran] || peran || '-'
    }

    return {
      kegiatan,
      isLoadingKegiatan,
      loadKegiatan,
      searchQuery,
      activeFilter,
      filterTahun,
      getAvailableTahun: computed(() => {
        const years = new Set()
        kegiatan.value.forEach(k => {
          if (k.tanggal_mulai) {
            const year = new Date(k.tanggal_mulai).getFullYear().toString()
            years.add(year)
          }
        })
        return Array.from(years).sort((a, b) => b - a)
      }),
      showAddModal,
      selectedKegiatan,
      editingId,
      currentUser,
      profilePegawai,
      formData,
      isViewing,
      userUnitKerjaOptions,
      formError,
      isSubmitting,
      submitLoadingMessage,
      submitStatus,
      isDraggingFlyer,
      flyerInput,
      filteredKegiatan,
      formatDate,
      getMetodeLabel,
      getUnitKerjaLabel,
      getStatusLabel,
      getStatusBadgeClass,
      getPaymentMethodLabel,
      hasResourceUrls,
      getFlyerUrl,
      getStorageFileUrl,
      viewDetail,
      openEditFromDetail,
      editKegiatan,
      deleteKegiatan,
      saveKegiatan,
      handleFlyerSelect,
      handleFlyerDrop,
      handleFlyerPaste,
      removeFlyerImage,
      templateBiodataInput,
      templateBiodataFile,
      handleTemplateBiodataSelect,
      removeTemplateBiodata,
      atkForm,
      atkItems,
      atkError,
      addAtkItem,
      removeAtkItem,
      openPesertaList,
      handleSuratTugas,
      openBiodataModal,
      printBiodata,
      formatDateRange,
      sharePublicPesertaLink,
      buildPublicEvaluasiLink,
      buildPublicLaporanEvaluasiLink,

      showSuratTugasModal,
      selectedSuratTugas,
      showBiodataModal,
      selectedPeserta,
      administrasiDocs,
      anggotaInSelected,
      pegawaiOptions,
      formAnggota,
      formAnggotaErrors,
      addAnggota,
      removeAnggota,
      editingAnggotaId,
      editAnggota,
      cancelEditAnggota,
      copyAnggotaTable,
      getNamaPegawai,
      getPeranLabel,
      previewLink,
      activityLinks,
      getActivityQrCodeUrl,
      resetForm,
      duplicateKegiatan,
      showAllData,
      prettySelectedKegiatan,
      validateForm,
      closeSubmitStatus,
      buildPublicPesertaLink,
      kabupatenKotaOptions
    }
  }
}
</script>

<style scoped>
.badge {
  display: inline-block;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.table-row {
  transition: all 0.2s ease;
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

  .bg-slate-50,
  .bg-slate-100 {
    background-color: #f5f5f5 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>

