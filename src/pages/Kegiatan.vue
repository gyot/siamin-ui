<template>
  <div class="p-6 bg-slate-50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Manajemen Kegiatan</h1>
            <p class="text-slate-500">Kelola semua kegiatan yang ada</p>
          </div>
          <button 
            @click="showAddModal = true" 
            class="btn-primary px-5 py-2.5 text-white rounded-lg font-medium shadow flex items-center gap-2 w-fit"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Tambah Kegiatan</span>
          </button>
        </div>

        <!-- optionally show current user info for debugging -->
        <div v-if="currentUser.id_pegawai" class="mb-2 text-xs text-slate-500">
          Logged in pegawai ID: <strong>{{ currentUser.id_pegawai }}</strong>
        </div>
        <!-- Filters -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-1">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Cari kegiatan..."
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
            </div>
            <div class="flex gap-2">
              <select 
                v-model="filterTahun"
                class="px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm bg-white"
              >
                <option v-for="tahun in getAvailableTahun" :key="tahun" :value="tahun">
                  {{ tahun }}
                </option>
              </select>
              <select 
                v-model="activeFilter"
                class="px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="berjalan">Berjalan</option>
                <option value="akan_datang">Akan Datang</option>
                <option value="selesai">Selesai</option>
              </select>
              <button class="px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 text-slate-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                <span class="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Informational Notice: Empty State -->
        <div v-if="kegiatan.length === 0 && !isLoadingKegiatan" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
          Tidak ada kegiatan untuk akun anda.
          Silakan buat kegiatan baru atau hubungi administrator jika Anda seharusnya punya akses.
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingKegiatan" class="mb-4 p-4 flex items-center justify-center">
          <Spinner message="Memuat data kegiatan..." />
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Kegiatan</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Lokasi</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Metode</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th class="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="k in filteredKegiatan" :key="k.id_kegiatan" class="table-row hover:bg-slate-50">
                  <td class="px-5 py-4">
                    <div class="font-medium text-slate-800">{{ k.nama_kegiatan }}</div>
                    <div class="text-xs text-slate-500">{{ k.id_kegiatan }}</div>
                  </td>
                  <td class="px-5 py-4 text-sm text-slate-600">
                    {{ formatDate(k.tanggal_mulai) }} s/d {{ formatDate(k.tanggal_selesai) }}
                  </td>
                  <td class="px-5 py-4 text-sm text-slate-600">{{ k.lokasi }}</td>
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
                      <button @click="openPesertaList(k.id_kegiatan)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-green-600" title="Peserta">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 8.308 4 4 0 010-8.308M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </button>
                      <button @click="handleSuratTugas(k.id_kegiatan)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-orange-600" title="Lihat/Buat Surat Tugas">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </button>
                      <button @click="viewDetail(k.id_kegiatan)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700" title="Lihat">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button @click="editKegiatan(k.id_kegiatan)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button @click="deleteKegiatan(k.id_kegiatan)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600" title="Hapus">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredKegiatan.length === 0 && kegiatan.length > 0">
                  <td colspan="6" class="px-5 py-8 text-center text-slate-500">
                    Tidak ada kegiatan yang sesuai dengan filter
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="kegiatan.length > 0" class="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-slate-500">Menampilkan {{ filteredKegiatan.length }} dari {{ kegiatan.length }} data</p>
            <div class="flex items-center gap-2">
              <button class="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50" disabled>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium">1</button>
              <button class="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50" disabled>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
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
        <h3 class="text-xl font-bold text-slate-800">{{ editingId ? 'Edit' : 'Tambah' }} Kegiatan</h3>
        <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <form @submit.prevent="saveKegiatan" class="p-6 space-y-6">
        
        <!-- Informasi Dasar -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Informasi Dasar</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nama Kegiatan *</label>
              <input type="text" v-model="formData.nama_kegiatan" placeholder="Nama kegiatan" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" required />
            </div>
            <div v-if="formData.nama_kegiatan" class="text-sm mt-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Pratinjau Link Formulir</label>
              <a :href="previewLink" target="_blank" class="text-blue-600 break-all">{{ previewLink }}</a>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Rincian Kegiatan</label>
              <textarea v-model="formData.rincian_kegiatan" placeholder="Deskripsi detail kegiatan" rows="3" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
              <textarea v-model="formData.deskripsi" placeholder="Deskripsi tambahan kegiatan" rows="3" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Jadwal & Lokasi -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Jadwal & Lokasi</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Mulai *</label>
              <input type="date" v-model="formData.tanggal_mulai" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Selesai *</label>
              <input type="date" v-model="formData.tanggal_selesai" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Lokasi *</label>
              <input type="text" v-model="formData.lokasi" placeholder="Lokasi kegiatan" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Flyer</label>
              <div 
                @drop.prevent="handleFlyerDrop"
                @dragover.prevent="isDraggingFlyer = true"
                @dragleave.prevent="isDraggingFlyer = false"
                @paste="handleFlyerPaste"
                class="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition"
                :class="isDraggingFlyer ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'"
              >
                <input 
                  type="file" 
                  ref="flyerInput"
                  @change="handleFlyerSelect"
                  accept="image/*"
                  class="hidden"
                />
                
                <!-- Preview Gambar -->
                <div v-if="formData.flyer" class="mb-4">
                  <img :src="getFlyerUrl(formData.flyer)" alt="Flyer Preview" class="max-h-48 mx-auto rounded-lg shadow-md" />
                  <button 
                    type="button"
                    @click="removeFlyerImage"
                    class="mt-3 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Hapus Gambar
                  </button>
                </div>

                <!-- Upload Area -->
                <div v-else @click="$refs.flyerInput.click()" class="py-2">
                  <svg class="w-10 h-10 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="text-slate-700 font-medium mb-1">Drag & drop gambar di sini</p>
                  <p class="text-xs text-slate-500 mb-2">atau</p>
                  <p class="text-sm text-blue-600 font-medium">Klik untuk browse</p>
                  <p class="text-xs text-slate-500 mt-2">Atau paste gambar (Ctrl+V)</p>
                </div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Format: JPG, PNG, GIF. Max 5MB</p>
            </div>
          </div>
        </div>

        <!-- Metode & Peserta -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Metode & Peserta</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Metode Pelaksanaan *</label>
              <select v-model="formData.metode_pelaksanaan" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white" required>
                <option value="">Pilih metode</option>
                <option value="daring">Daring</option>
                <option value="luring">Luring</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Metode Pembayaran *</label>
              <select v-model="formData.metode_pembayaran" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white" required>
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
              <input type="number" v-model="formData.total_peserta" placeholder="0" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" required min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Ringkasan Peserta</label>
              <input type="text" v-model="formData.peserta_ringkasan" placeholder="Contoh: Karyawan, CPNS, dll" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- URL Resources -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Resource URL</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Dokumentasi</label>
              <input type="text" v-model="formData.dokumentasi_url" placeholder="https://..." class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Materi</label>
              <input type="text" v-model="formData.materi_url" placeholder="https://..." class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Panduan</label>
              <input type="text" v-model="formData.panduan_url" placeholder="https://..." class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Laporan</label>
              <input type="text" v-model="formData.laporan_url" placeholder="https://..." class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">URL Surat Menyurat</label>
              <input type="text" v-model="formData.surat_menyurat_url" placeholder="https://..." class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Status</h4>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Status Kegiatan *</label>
            <select v-model="formData.status" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none bg-white" required>
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
          <button type="button" @click="showAddModal = false" class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Batal</button>
          <button type="submit" class="flex-1 btn-primary px-4 py-2.5 text-white rounded-lg font-medium">{{ editingId ? 'Update' : 'Simpan' }}</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Detail Kegiatan -->
  <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div v-if="selectedKegiatan" class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
        <h3 class="text-2xl font-bold text-slate-800">{{ selectedKegiatan.nama_kegiatan }}</h3>
        <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="p-6 space-y-6">
        
        <!-- Flyer Preview -->
        <div v-if="selectedKegiatan.flyer" class="border border-slate-200 rounded-lg overflow-hidden">
          <img :src="getFlyerUrl(selectedKegiatan.flyer)" alt="Flyer" class="w-full max-h-64 object-cover" />
        </div>

        <!-- Status Badge -->
        <div class="flex items-center gap-3">
          <span class="badge" :class="getStatusBadgeClass(selectedKegiatan.status)">
            {{ getStatusLabel(selectedKegiatan.status) }}
          </span>
          <span class="text-sm text-slate-500">ID: {{ selectedKegiatan.id_kegiatan }}</span>
        </div>

        <!-- Informasi Dasar -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Informasi Dasar</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase">Nama Kegiatan</p>
              <p class="text-slate-800 font-medium">{{ selectedKegiatan.nama_kegiatan }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase">Total Peserta</p>
              <p class="text-slate-800 font-medium">{{ selectedKegiatan.total_peserta }} orang</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Rincian Kegiatan</p>
              <p class="text-slate-700">{{ selectedKegiatan.rincian_kegiatan || '-' }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Deskripsi</p>
              <p class="text-slate-700">{{ selectedKegiatan.deskripsi || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Jadwal & Lokasi -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Jadwal & Lokasi</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase">Tanggal Mulai</p>
              <p class="text-slate-800 font-medium">{{ formatDate(selectedKegiatan.tanggal_mulai) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase">Tanggal Selesai</p>
              <p class="text-slate-800 font-medium">{{ formatDate(selectedKegiatan.tanggal_selesai) }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs font-medium text-slate-500 uppercase">Lokasi</p>
              <p class="text-slate-800 font-medium">{{ selectedKegiatan.lokasi }}</p>
            </div>
          </div>
        </div>

        <!-- Metode & Pembayaran -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Metode & Pembayaran</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase">Metode Pelaksanaan</p>
              <p class="text-slate-800 font-medium">{{ getMetodeLabel(selectedKegiatan.metode_pelaksanaan) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase">Metode Pembayaran</p>
              <p class="text-slate-800 font-medium">{{ getPaymentMethodLabel(selectedKegiatan.metode_pembayaran) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase">Ringkasan Peserta</p>
              <p class="text-slate-800 font-medium">{{ selectedKegiatan.peserta_ringkasan || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Formulir Links -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Link Formulir Pendaftaran</h4>
          <div class="space-y-2">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Peserta</p>
              <a :href="activityLinks.peserta" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ activityLinks.peserta }}
              </a>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Panitia</p>
              <a :href="activityLinks.panitia" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ activityLinks.panitia }}
              </a>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Narasumber</p>
              <a :href="activityLinks.narasumber" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ activityLinks.narasumber }}
              </a>
            </div>
          </div>
        </div>

        <!-- Peserta Count Section -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Data Peserta</h4>
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase mb-1">Total Peserta</p>
            <p class="text-lg font-semibold text-slate-800">{{ selectedKegiatan.total_peserta }} orang</p>
          </div>
        </div>

        <!-- Resources URL -->
        <div v-if="hasResourceUrls()" class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Resource</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="selectedKegiatan.dokumentasi_url">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Dokumentasi</p>
              <a :href="selectedKegiatan.dokumentasi_url" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ selectedKegiatan.dokumentasi_url }}
              </a>
            </div>
            <div v-if="selectedKegiatan.materi_url">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Materi</p>
              <a :href="selectedKegiatan.materi_url" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ selectedKegiatan.materi_url }}
              </a>
            </div>
            <div v-if="selectedKegiatan.panduan_url">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Panduan</p>
              <a :href="selectedKegiatan.panduan_url" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ selectedKegiatan.panduan_url }}
              </a>
            </div>
            <div v-if="selectedKegiatan.laporan_url">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Laporan</p>
              <a :href="selectedKegiatan.laporan_url" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ selectedKegiatan.laporan_url }}
              </a>
            </div>
            <div v-if="selectedKegiatan.surat_menyurat_url">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Surat Menyurat</p>
              <a :href="selectedKegiatan.surat_menyurat_url" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all">
                {{ selectedKegiatan.surat_menyurat_url }}
              </a>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button @click="showDetailModal = false" class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Tutup</button>
          <button @click="openEditFromDetail()" class="flex-1 btn-primary px-4 py-2.5 text-white rounded-lg font-medium">Edit</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Detail Surat Tugas -->
  <div v-if="showSuratTugasModal && selectedSuratTugas" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
        <h3 class="text-2xl font-bold text-slate-800">Detail Surat Tugas</h3>
        <button @click="showSuratTugasModal = false" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Informasi Dasar -->
        <div class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Informasi Surat Tugas</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Nomor Surat</p>
              <p class="text-lg font-semibold text-slate-800">{{ selectedSuratTugas.nomor_surat }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">ID Surat Tugas</p>
              <p class="text-lg font-semibold text-slate-800">{{ selectedSuratTugas.id_surat_tugas }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Tanggal Surat</p>
              <p class="text-lg font-semibold text-slate-800">{{ formatDate(selectedSuratTugas.tanggal_surat) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Status</p>
              <span :class="selectedSuratTugas.status === 'diterbitkan' ? 'badge bg-green-100 text-green-800' : 'badge bg-yellow-100 text-yellow-800'">
                {{ selectedSuratTugas.status }}
              </span>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">ID Kegiatan</p>
              <p class="text-slate-700">{{ selectedSuratTugas.id_kegiatan }}</p>
            </div>
          </div>
        </div>

        <!-- File & Links -->
        <div v-if="selectedSuratTugas.file_surat" class="border-b border-slate-100 pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">File Surat</h4>
          <div>
            <a :href="selectedSuratTugas.file_surat" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              Unduh File Surat Tugas
            </a>
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

        <!-- Anggota Surat Tugas -->
        <div class="pb-6">
          <h4 class="text-lg font-semibold text-slate-800 mb-4">Anggota Surat Tugas</h4>
          
          <!-- Daftar Anggota Existing -->
          <div class="mb-6">
            <div v-if="anggotaInSelected.length === 0" class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-600 text-sm mb-4">
              Belum ada anggota surat tugas
            </div>
            <div v-else class="overflow-x-auto mb-4">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="p-2 text-left">Nama Pegawai</th>
                    <th class="p-2 text-left">Peran</th>
                    <th class="p-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="a in anggotaInSelected" :key="a.id" class="border-b">
                    <td class="p-2">{{ getNamaPegawai(a.id_pegawai) }}</td>
                    <td class="p-2">{{ a.peran }}</td>
                    <td class="p-2 text-center">
                      <button @click="removeAnggota(a.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
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
                <select v-model.number="formAnggota.id_pegawai" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="">-- Pilih Pegawai --</option>
                  <option v-for="p in pegawaiOptions" :key="p.id_pegawai" :value="p.id_pegawai">
                    {{ p.nama }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Peran *</label>
                <select v-model="formAnggota.peran" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="penanggung_jawab">Penanggung Jawab</option>
                  <option value="ketua_panitia">Ketua Panitia</option>
                  <option value="anggota_panitia">Anggota Panitia</option>
                  <option value="sekretaris">Sekretaris</option>
                  <option value="bendahara">Bendahara</option>
                </select>
              </div>
              <div class="flex items-end">
                <button @click="addAnggota" type="button" class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4 border-t border-slate-200">
          <button @click="showSuratTugasModal = false" class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Tutup</button>
          <button @click="router.push({ name: 'surat-tugas', query: { edit: 'true', id: selectedSuratTugas.id_surat_tugas } })" class="flex-1 btn-primary px-4 py-2.5 text-white rounded-lg font-medium">Ubah Surat Tugas</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import database from '../data/index.js'
import { useAuthStore } from '@/stores/auth.js'
import { listKegiatan, getKegiatan, createKegiatan, updateKegiatan, removeKegiatan } from '@/services/kegiatan'
import { fetchAPI } from '@/services/api'
import { ActivityEvents } from '@/services/activityLogger'
import Spinner from '@/components/Spinner.vue'

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
      const base = (window.location.origin || import.meta.env.VITE_BASE_URL || '').replace(/\/$/, '')
      const slug = slugify(judul)
      return `${base}/formulir/${kode}/${peran}/${slug}`
    }

    const enrichWithLink = (k) => {
      const kode = k.id_kegiatan || k.kode || ''
      const judul = k.nama_kegiatan || ''
      const peran = k.peran || 'Peserta'
      k.link_formulir = buildFormLink(kode, peran, judul)
    }

    const currentUser = computed(() => auth.currentUser || {})

    // Get profile of logged in pegawai
    const pegawai = ref(database.pegawai || [])
    const users = ref(database.users || [])
    
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
          console.log('[Kegiatan] Found pegawai profile:', profile.nama)
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

    // Fetch kegiatan dari API (sudah difilter berdasarkan pegawai yang login)
    const kegiatan = ref([])
    const isLoadingKegiatan = ref(false)

    const loadKegiatan = async () => {
      isLoadingKegiatan.value = true
      console.debug('[Kegiatan] loadKegiatan start, user:', currentUser.value)
      try {
        const data = await listKegiatan()
        console.debug('[Kegiatan] raw API response', data)
        kegiatan.value = data || []
        kegiatan.value.forEach(enrichWithLink)
      } catch (err) {
        console.error('[Kegiatan] Failed to fetch kegiatan from API', err)
        kegiatan.value = []
      } finally {
        isLoadingKegiatan.value = false
      }
    }

    onMounted(async () => {
      // Load pegawai dan users data dari API
      try {
        console.log('[Kegiatan] Loading pegawai data from API...')
        const pegawaiData = await fetchAPI('pegawai')
        if (Array.isArray(pegawaiData)) {
          pegawai.value = pegawaiData
          console.log('[Kegiatan] ✅ Pegawai data loaded:', pegawaiData.length, 'records')
        }
      } catch (error) {
        console.warn('[Kegiatan] Failed to load pegawai from API:', error.message)
      }

      try {
        console.log('[Kegiatan] Loading users data from API...')
        const usersData = await fetchAPI('users')
        if (Array.isArray(usersData)) {
          users.value = usersData
          console.log('[Kegiatan] ✅ Users data loaded:', usersData.length, 'records')
        }
      } catch (error) {
        console.warn('[Kegiatan] Failed to load users from API:', error.message)
      }

      loadKegiatan()
      // Log page access
      ActivityEvents.ACCESS_PAGE('Manajemen Kegiatan')
    })

    const searchQuery = ref('')
    const activeFilter = ref('all')
    const filterTahun = ref(new Date().getFullYear().toString())
    const showAddModal = ref(false)
    const showDetailModal = ref(false)
    const selectedKegiatan = ref(null)
    const showSuratTugasModal = ref(false)
    const selectedSuratTugas = ref(null)
    const editingId = ref(null)
    const formError = ref('')
    const isDraggingFlyer = ref(false)
    const flyerInput = ref(null)
    const flyerFile = ref(null)
    const formAnggota = ref({ id_pegawai: '', peran: 'anggota_panitia' })
    const formAnggotaErrors = ref([])

    const formData = ref({
      nama_kegiatan: '',
      rincian_kegiatan: '',
      deskripsi: '',
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
      status: 'draft',
      id_pegawai: null
    })

    const previewLink = computed(() => {
      const kode = formData.value.id_kegiatan || editingId.value || ''
      const peran = formData.value.peran || 'Peserta'
      const judul = formData.value.nama_kegiatan || ''
      return buildFormLink(kode, peran, judul)
    })

    const activityLinks = computed(() => {
      if (!selectedKegiatan.value) return { peserta: '', panitia: '', narasumber: '' }
      const kode = selectedKegiatan.value.id_kegiatan || ''
      const judul = selectedKegiatan.value.nama_kegiatan || ''
      return {
        peserta: buildFormLink(kode, 'Peserta', judul),
        panitia: buildFormLink(kode, 'Panitia', judul),
        narasumber: buildFormLink(kode, 'Narasumber', judul)
      }
    })

    const anggotaInSelected = computed(() => {
      if (!selectedSuratTugas.value) return []
      return db.surat_tugas_pegawai.filter(sp => String(sp.id_surat_tugas) === String(selectedSuratTugas.value.id_surat_tugas))
    })

    const pegawaiOptions = computed(() => db.pegawai || [])

    const resetForm = () => {
      formData.value = {
        nama_kegiatan: '',
        rincian_kegiatan: '',
        deskripsi: '',
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
        status: 'draft',
        id_pegawai: null
      }
      flyerFile.value = null
      formError.value = ''
    }

    const filteredKegiatan = computed(() => {
      let filtered = [...kegiatan.value]
      
      if (searchQuery.value) {
        filtered = filtered.filter(k => 
          k.nama_kegiatan.toLowerCase().includes(searchQuery.value.toLowerCase())
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
      if (!path) return ''
      if (path.startsWith('http')) return path
      const base = import.meta.env.VITE_API_BASE_URL || 'https://api-siamin.bpmpntb.id/'
      return `${base.replace(/\/api\/?$/, '')}/storage/${path}`
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
        if (item) {
          selectedKegiatan.value = { ...item }
          showDetailModal.value = true
          // Log viewing detail
          ActivityEvents.VIEW_KEGIATAN_DETAIL(id, item.nama_kegiatan)
          return
        }
      } catch (err) {
        console.warn('Failed to load kegiatan from API', err)
      }
      const item = kegiatan.value.find(k => k.id_kegiatan === id)
      if (item) {
        selectedKegiatan.value = { ...item }
        showDetailModal.value = true
        // Log viewing detail
        ActivityEvents.VIEW_KEGIATAN_DETAIL(id, item.nama_kegiatan)
      }
    }

    const openEditFromDetail = () => {
      if (selectedKegiatan.value) {
        formData.value = normalizeKegiatanFormData(selectedKegiatan.value)
        flyerFile.value = null
        editingId.value = selectedKegiatan.value.id_kegiatan
        showDetailModal.value = false
        showAddModal.value = true
      }
    }

    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error('Ukuran file tidak boleh lebih dari 5MB'))
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

    const buildKegiatanPayloadObject = (data, { isUpdate = false } = {}) => {
      // Kirim hanya field yang memang diperlukan backend untuk create/update.
      // Hindari mengirim field turunan seperti link_formulir atau metadata lain.
      const payload = {
        nama_kegiatan: data.nama_kegiatan,
        rincian_kegiatan: data.rincian_kegiatan,
        deskripsi: data.deskripsi,
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
      tanggal_mulai: toDateInputValue(data.tanggal_mulai),
      tanggal_selesai: toDateInputValue(data.tanggal_selesai)
    })

    const editKegiatan = async (id) => {
      try {
        const item = await getKegiatan(id)
        if (item) {
          enrichWithLink(item)
          formData.value = normalizeKegiatanFormData(item)
          editingId.value = id
          showAddModal.value = true
        }
      } catch (err) {
        const item = kegiatan.value.find(k => String(k.id_kegiatan) === String(id))
        if (item) {
          formData.value = normalizeKegiatanFormData(item)
          editingId.value = id
          showAddModal.value = true
        }
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

      try {
        if (currentUser.value) {
          formData.value.id_pegawai = currentUser.value.id_pegawai || currentUser.value.id || null
        }

        const normalizedData = normalizeKegiatanFormData(formData.value)
        const payloadObject = buildKegiatanPayloadObject(normalizedData, { isUpdate: Boolean(editingId.value) })
        let payload
        if (flyerFile.value) {
          payload = new FormData()
          Object.keys(payloadObject).forEach(key => {
            const val = payloadObject[key]
            if (val !== null && val !== undefined) {
              payload.append(key, val)
            }
          })
          payload.append('flyer', flyerFile.value)
        } else {
          payload = { ...payloadObject }
        }

        if (editingId.value) {
          const updated = await updateKegiatan(editingId.value, payload)
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
        } else {
          const created = await createKegiatan(payload)
          enrichWithLink(created)
          kegiatan.value.push(created)
          // Log creation
          ActivityEvents.CREATE_KEGIATAN(formData.value.nama_kegiatan)
        }
        showAddModal.value = false
        editingId.value = null
        resetForm()
      } catch (err) {
        console.error('Failed to save kegiatan', err)
        formError.value = err.message || 'Gagal menyimpan kegiatan'
        // Log error
        ActivityEvents.ERROR_OCCURRED(err.message || 'Gagal menyimpan kegiatan', 'Kegiatan.vue - saveKegiatan')
      }
    }

    const openPesertaList = (id) => {
      router.push({ name: 'kegiatan-peserta', params: { id } })
    }

    const handleSuratTugas = (idKegiatan) => {
      // Cari surat tugas untuk kegiatan ini
      const existingSuratTugas = db.surat_tugas.find(st => String(st.id_kegiatan) === String(idKegiatan))
      
      if (existingSuratTugas) {
        // Ada surat tugas, tampilkan modal
        selectedSuratTugas.value = existingSuratTugas
        formAnggota.value = { id_pegawai: '', peran: 'anggota_panitia' }
        showSuratTugasModal.value = true
      } else {
        // Tidak ada, arahkan ke SuratTugasManagement
        router.push({ name: 'surat-tugas', query: { create: 'true', id_kegiatan: idKegiatan } })
      }
    }

    const addAnggota = () => {
      formAnggotaErrors.value = []
      
      // Validasi
      if (!formAnggota.value.id_pegawai) {
        formAnggotaErrors.value.push('Pegawai wajib dipilih')
      }
      if (!formAnggota.value.peran) {
        formAnggotaErrors.value.push('Peran wajib dipilih')
      }
      
      const pegawai = db.pegawai.find(p => p.id_pegawai === formAnggota.value.id_pegawai)
      if (formAnggota.value.id_pegawai && !pegawai) {
        formAnggotaErrors.value.push('Pegawai tidak ditemukan')
      }

      // Cek duplikat
      const duplicate = anggotaInSelected.value.some(a => a.id_pegawai === formAnggota.value.id_pegawai)
      if (duplicate) {
        formAnggotaErrors.value.push('Pegawai ini sudah ditambahkan ke surat tugas ini')
      }

      if (formAnggotaErrors.value.length > 0) return

      if (!db.surat_tugas_pegawai) db.surat_tugas_pegawai = []
      
      const newAnggota = {
        id: Math.max(...(db.surat_tugas_pegawai.map(a => a.id) || [0]), 0) + 1,
        id_surat_tugas: selectedSuratTugas.value.id_surat_tugas,
        id_pegawai: formAnggota.value.id_pegawai,
        peran: formAnggota.value.peran
      }
      
      db.surat_tugas_pegawai.push(newAnggota)
      formAnggota.value = { id_pegawai: '', peran: 'anggota_panitia' }
      formAnggotaErrors.value = []
    }

    const removeAnggota = (id) => {
      if (!confirm('Hapus anggota ini?')) return
      const idx = db.surat_tugas_pegawai.findIndex(a => a.id === id)
      if (idx !== -1) {
        db.surat_tugas_pegawai.splice(idx, 1)
      }
    }

    const getNamaPegawai = (idPegawai) => {
      const p = db.pegawai.find(peg => String(peg.id_pegawai) === String(idPegawai))
      return p ? p.nama : '-'
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
      showDetailModal,
      selectedKegiatan,
      editingId,
      currentUser,
      profilePegawai,
      formData,
      formError,
      isDraggingFlyer,
      flyerInput,
      filteredKegiatan,
      formatDate,
      getMetodeLabel,
      getStatusLabel,
      getStatusBadgeClass,
      getPaymentMethodLabel,
      hasResourceUrls,
      getFlyerUrl,
      viewDetail,
      openEditFromDetail,
      editKegiatan,
      deleteKegiatan,
      saveKegiatan,
      handleFlyerSelect,
      handleFlyerDrop,
      handleFlyerPaste,
      removeFlyerImage,
      openPesertaList,
      handleSuratTugas,
      showSuratTugasModal,
      selectedSuratTugas,
      anggotaInSelected,
      pegawaiOptions,
      formAnggota,
      formAnggotaErrors,
      addAnggota,
      removeAnggota,
      getNamaPegawai,
      previewLink,
      activityLinks,
      resetForm,
      validateForm
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
</style>
