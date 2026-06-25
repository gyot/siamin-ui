<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p class="text-slate-500">Selamat datang kembali, {{ profilePegawai?.nama || 'Admin' }}</p>
      <p class="text-slate-600">Sistem Manajemen Informasi Kegiatan (SIMAIK) membantu Anda mengelola
        kegiatan, peserta, penugasan, dan sertifikat digital secara terintegrasi.</p>
    </div>

    <!-- Profile Card -->
    <div v-if="profilePegawai" class="mb-6 bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1">
          <div class="flex flex-col items-center">
            <div
              class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800 text-center">{{ profilePegawai.nama }}</h3>
            <p class="text-sm text-slate-500 text-center">{{ profilePegawai.nama_jabatan || profilePegawai.jabatan ||
              '-' }}</p>
          </div>
        </div>
        <div class="md:col-span-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-600 uppercase">NIP</p>
              <p class="text-sm font-semibold text-slate-800">{{ profilePegawai.nip || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-600 uppercase">Email</p>
              <p class="text-sm font-semibold text-slate-800">{{ profilePegawai.email || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-600 uppercase">Unit Kerja</p>
              <p class="text-sm font-semibold text-slate-800">{{ profilePegawai.unit_kerja || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-600 uppercase">Golongan</p>
              <p class="text-sm font-semibold text-slate-800">{{ profilePegawai.golongan || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <!-- <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span> -->
        </div>
        <div class="text-2xl font-bold text-slate-800 mb-1">{{ totalKegiatan }}</div>
        <div class="text-slate-500 text-sm">Total Kegiatan</div>
      </div>
      <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <!-- <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+8%</span> -->
        </div>
        <div class="text-2xl font-bold text-slate-800 mb-1">{{ totalPeserta }}</div>
        <div class="text-slate-500 text-sm">Total Peserta</div>
      </div>
      <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <!-- <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+15%</span> -->
        </div>
        <div class="text-2xl font-bold text-slate-800 mb-1">{{ totalSertifikat }}</div>
        <div class="text-slate-500 text-sm">Sertifikat Terbit</div>
      </div>
      <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800 mb-1">{{ kegiatanBerjalan }}</div>
        <div class="text-slate-500 text-sm">Kegiatan Berjalan</div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Cari Kegiatan</label>
          <input v-model="searchKegiatan" type="text" placeholder="Ketik nama kegiatan..."
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Filter Tahun</label>
          <select v-model="filterTahun"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Semua Tahun</option>
            <option v-for="tahun in availableTahun" :key="tahun" :value="tahun">
              {{ tahun }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Filter Status</label>
          <select v-model="filterStatus"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Semua Status</option>
            <option value="berjalan">Berjalan</option>
            <option value="akan_datang">Akan Datang</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Filter Unit Kerja</label>
          <select v-model="filterUnitKerja"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Semua Unit Kerja</option>
            <option v-for="unit in availableUnitKerja" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Kegiatan List -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Daftar Kegiatan</h3>
      <div v-if="isLoadingKegiatan" class="bg-white rounded-xl p-8 border border-slate-100 shadow-sm text-center">
        <div class="flex items-center justify-center gap-2">
          <div class="w-5 h-5 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p class="text-slate-500">Memuat kegiatan...</p>
        </div>
      </div>
      <div v-else-if="filteredKegiatan.length === 0"
        class="bg-white rounded-xl p-8 border border-slate-100 shadow-sm text-center">
        <p class="text-slate-500">Tidak ada kegiatan yang sesuai dengan filter</p>
      </div>
      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="k in filteredKegiatan" :key="k.id_kegiatan"
            class="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden">
            <div :class="getStatusColor(getKegiatanStatus(k))" class="h-1"></div>
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-slate-800 text-sm flex-1">{{ k.nama_kegiatan }}</h4>
                <span :class="getStatusBadge(getKegiatanStatus(k))" class="text-xs whitespace-nowrap ml-2">
                  {{ formatStatus(getKegiatanStatus(k)) }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mb-3">{{ k.peserta_ringkasan }}</p>
              <div v-if="resolveUnitKerjaName(k)" class="mb-3">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  {{ resolveUnitKerjaName(k) }}
                </span>
              </div>

              <div v-if="getDocumentLinks(k).length" class="mb-3">
                <p class="text-xs font-medium text-slate-500 uppercase mb-2">Dokumen</p>
                <div class="space-y-1">
                  <a v-for="link in getDocumentLinks(k)" :key="link.label" :href="link.url" target="_blank"
                    class="block text-xs text-blue-600 hover:underline truncate">
                    {{ link.label }}
                  </a>
                </div>
              </div>

              <div class="space-y-2 text-xs text-slate-600 mb-4">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDateRange(k.tanggal_mulai, k.tanggal_selesai) }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span class="leading-relaxed">
                    <span class="font-medium text-slate-700">Lokasi:</span> {{ getKegiatanLocationLabel(k) }}
                  </span>
                </div>
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h1m-1 4h1m-1 4h1m5-4h1m-1 4h1" />
                  </svg>
                  <span class="leading-relaxed">
                    <span class="font-medium text-slate-700">Kab/Kota:</span> {{ getKegiatanKabupatenKotaLabel(k) }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{{ k.total_peserta }} Peserta</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button @click="openDetailModal(k)"
                  class="w-full px-3 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                  Lihat Detail
                </button>
                <button @click="openPesertaKegiatan(k)"
                  class="w-full px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                  Lihat Data Peserta
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div class="text-sm text-slate-600">
            Menampilkan <span class="font-semibold">{{ (currentPage - 1) * pageSize + 1 }}</span>-<span
              class="font-semibold">{{ Math.min(currentPage * pageSize, totalKegiatanCount) }}</span> dari <span
              class="font-semibold">{{ totalKegiatanCount }}</span> kegiatan
          </div>
          <div class="flex gap-2">
            <button @click="currentPage > 1 && (currentPage = currentPage - 1, fetchKegiatanData())"
              :disabled="currentPage <= 1 || isLoadingKegiatan"
              class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              ← Sebelumnya
            </button>
            <div class="flex items-center gap-1">
              <button v-for="page in totalPages" :key="page" @click="currentPage = page; fetchKegiatanData()"
                :disabled="isLoadingKegiatan" :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition',
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                ]">
                {{ page }}
              </button>
            </div>
            <button @click="currentPage < totalPages && (currentPage = currentPage + 1, fetchKegiatanData())"
              :disabled="currentPage >= totalPages || isLoadingKegiatan"
              class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Detail Modal -->
    <div v-if="showDetailModal && selectedKegiatan"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div
          class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 class="text-xl font-bold">Detail Kegiatan</h2>
          <button @click="showDetailModal = false" class="text-2xl hover:text-blue-200">&times;</button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-slate-600">Nama Kegiatan</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.nama_kegiatan }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">ID Kegiatan</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.id_kegiatan }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Status</p>
              <span :class="getStatusBadge(getKegiatanStatus(selectedKegiatan))">
                {{ formatStatus(getKegiatanStatus(selectedKegiatan)) }}
              </span>
            </div>
            <div>
              <p class="text-sm text-slate-600">Lokasi</p>
              <p class="text-lg font-semibold text-slate-900">{{ getKegiatanLocationLabel(selectedKegiatan) }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Kabupaten/Kota</p>
              <p class="text-lg font-semibold text-slate-900">{{ getKegiatanKabupatenKotaLabel(selectedKegiatan) }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Tanggal Mulai</p>
              <p class="text-lg font-semibold text-slate-900">{{ formatDate(selectedKegiatan.tanggal_mulai) }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Tanggal Selesai</p>
              <p class="text-lg font-semibold text-slate-900">{{ formatDate(selectedKegiatan.tanggal_selesai) }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Total Peserta</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.total_peserta }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Metode Pelaksanaan</p>
              <p class="text-lg font-semibold text-slate-900 capitalize">{{ selectedKegiatan.metode_pelaksanaan }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Metode Pembayaran</p>
              <p class="text-lg font-semibold text-slate-900 capitalize">{{ selectedKegiatan.metode_pembayaran }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Peserta Ringkasan</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.peserta_ringkasan }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-slate-600">Deskripsi</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.deskripsi }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-slate-600">Rincian Kegiatan</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.rincian_kegiatan }}</p>
            </div>
          </div>
          <!-- form links -->
          <div class="mt-6">
            <p class="text-sm text-slate-600 font-medium mb-3">Formulir</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="link in formLinks" :key="link.label" class="rounded-lg border border-slate-200 p-4 bg-white">
                <p class="text-xs font-medium text-slate-500 uppercase mb-2">{{ link.label }}</p>
                <a :href="link.url" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all block mb-3">
                  {{ link.url }}
                </a>
                <img v-if="qrCodes[link.key]" :src="qrCodes[link.key]" :alt="`QR ${link.label}`" class="w-24 h-24 rounded bg-white p-1 border border-slate-200" />
              </div>
            </div>
          </div>
          <div class="mt-6">
            <p class="text-sm text-slate-600 font-medium mb-3">Evaluasi</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="link in evaluationLinks" :key="link.label" class="rounded-lg border border-slate-200 p-4 bg-white">
                <p class="text-xs font-medium text-slate-500 uppercase mb-2">{{ link.label }}</p>
                <a :href="link.url" target="_blank" class="text-blue-600 hover:text-blue-700 underline text-sm break-all block mb-3">
                  {{ link.url }}
                </a>
                <img v-if="qrCodes[link.key]" :src="qrCodes[link.key]" :alt="`QR ${link.label}`" class="w-24 h-24 rounded bg-white p-1 border border-slate-200" />
              </div>
            </div>
          </div>
          <div v-if="selectedDocumentLinks.length" class="mt-6">
            <p class="text-sm text-slate-600 font-medium mb-3">Dokumen Kegiatan</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a v-for="link in selectedDocumentLinks" :key="link.label" :href="link.url" target="_blank"
                class="rounded-lg border border-slate-200 p-3 bg-slate-50 text-sm text-blue-600 hover:bg-slate-100 transition break-all">
                {{ link.label }}
              </a>
            </div>
          </div>
          <!-- peserta controls -->
          <div class="mt-6">
            <button @click="viewPesertaList = !viewPesertaList"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
              {{ viewPesertaList ? 'Tutup Data Peserta' : 'Lihat Data Peserta' }}
            </button>
          </div>
          <div v-if="viewPesertaList" class="mt-4">
            <div class="flex justify-end gap-2 mb-3">
              <button @click="exportPesertaKegiatan"
                class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition">
                Export Excel
              </button>
              <button @click="downloadBatchPesertaDocx"
                class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="pesertaInSelected.length === 0 || isDownloadingBatchDocx">
                {{ isDownloadingBatchDocx ? 'Menyiapkan DOCX...' : 'Download Batch DOCX' }}
              </button>
            </div>
            <div class="overflow-x-auto max-h-64">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-slate-100">
                    <th class="p-2 text-left">Nama</th>
                    <th class="p-2 text-left">NIP</th>
                    <th class="p-2 text-left">Email</th>
                    <th class="p-2 text-left">Peran</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in pesertaInSelected" :key="p.id_peserta" class="border-b">
                    <td class="p-2">{{ p.nama_lengkap }}</td>
                    <td class="p-2">{{ p.nip }}</td>
                    <td class="p-2">{{ p.email }}</td>
                    <td class="p-2">{{ p.peran }}</td>
                  </tr>
                  <tr v-if="pesertaInSelected.length === 0">
                    <td colspan="4" class="p-2 text-center text-slate-500">Tidak ada peserta</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button @click="showDetailModal = false"
              class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { fetchAPI } from '@/services/api'
import { ActivityEvents } from '@/services/activityLogger'
import { parseDocxPreservingFormat, replacePlaceholdersInXml, generateDocxFromXml } from '@/utils/docxUtils.js'
import { getKegiatan } from '@/services/kegiatan'
import database from '@/data/index.js'
import { buildPublicUrl as buildAppUrl, buildStorageUrl } from '@/utils/url'
import { getKegiatanKabupatenKotaLabel, getKegiatanLocationLabel } from '@/utils/kegiatanLocation'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()

    // kegiatan list is sourced from API with kegiatan/all endpoint to show
    // all kegiatan records to all pegawai (not filtered by creator).
    // keep local copy for offline fallback only.
    // kegiatan list is sourced from API with kegiatan/all endpoint to show
    // all kegiatan records to all pegawai (not filtered by creator).
    // keep local copy for offline fallback only.
    const kegiatan = ref(database.kegiatan)
    const peserta = ref(database.peserta)
    const sertifikat = ref(database.sertifikat)
    const pegawai = ref(database.pegawai)
    const users = ref(database.users)
    const unitKerja = ref(database.unit_kerja)
    const kegiatanDetailCache = ref(new Map())
    const isDownloadingBatchDocx = ref(false)

    //   count: pegawai.value.length,
    //   firstNames: pegawai.value.slice(0, 3).map(p => ({ id: p.id_pegawai, nama: p.nama }))
    // })
    //   count: users.value.length,
    //   records: users.value.slice(0, 3).map(u => ({ id_user: u.id_user, id_pegawai: u.id_pegawai, email: u.email }))
    // })

    // Use computed to get current user directly from authStore (reactive)
    const router = useRouter()
    const currentUser = computed(() => authStore.currentUser)

    const openPesertaKegiatan = (kegiatanItem) => {
      if (!kegiatanItem || !kegiatanItem.id_kegiatan) return
      router.push({ name: 'kegiatan-peserta', params: { id: kegiatanItem.id_kegiatan } })
    }

    // Get profile of logged in pegawai - prioritas dari database pegawai
    const profilePegawai = computed(() => {
      try {
        if (!currentUser.value) {
          console.warn('[Dashboard] currentUser not available')
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
          return profile
        } else {
          // console.warn('[Dashboard] ❌ No pegawai profile found')
          // console.warn('[Dashboard] currentUser:', currentUser.value)
          return null
        }
      } catch (error) {
        // console.error('[Dashboard] Error computing profilePegawai:', error)
        return null
      }
    })

    // Pagination state
    const currentPage = ref(1)
    const pageSize = ref(9) // 3x3 grid
    const totalKegiatanCount = ref(0)
    const isLoadingKegiatan = ref(false)

    const toDashboardNumber = (value) => {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : 0
    }

    const getLocalKegiatanBerjalanCount = () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return kegiatan.value.filter(k => {
        if (!k.tanggal_mulai || !k.tanggal_selesai) return false

        const startDate = new Date(k.tanggal_mulai)
        startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(k.tanggal_selesai)
        endDate.setHours(23, 59, 59, 999)

        // Kegiatan berjalan jika hari ini berada dalam rentang tanggal mulai dan selesai
        return today >= startDate && today <= endDate
      }).length
    }

    const getLocalDashboardStats = () => ({
      total_peserta: peserta.value.length,
      total_kegiatan: kegiatan.value.length,
      total_sertifikat: sertifikat.value.filter(s => s.status === 'terbit').length,
      total_kegiatan_berjalan: getLocalKegiatanBerjalanCount()
    })

    const dashboardStats = ref(getLocalDashboardStats())
    const totalKegiatan = computed(() => dashboardStats.value.total_kegiatan)
    const totalPeserta = computed(() => dashboardStats.value.total_peserta)
    const totalSertifikat = computed(() => dashboardStats.value.total_sertifikat)
    const kegiatanBerjalan = computed(() => dashboardStats.value.total_kegiatan_berjalan)

    const searchKegiatan = ref('')
    const filterTahun = ref(new Date().getFullYear().toString())
    const filterStatus = ref('')
    const filterUnitKerja = ref('')
    const showDetailModal = ref(false)
    const selectedKegiatan = ref(null)

    const currentYear = new Date().getFullYear().toString()

    // Get available years from kegiatan data
    const availableTahun = computed(() => {
      const years = new Set()
      kegiatan.value.forEach(k => {
        if (k.tanggal_mulai) {
          const year = new Date(k.tanggal_mulai).getFullYear().toString()
          years.add(year)
        }
      })
      return Array.from(years).sort((a, b) => b - a)
    })

    const getUnitKerjaFromItem = (item) => {
      if (!item || typeof item !== 'object') return ''
      const keys = ['unit_kerja', 'timkerja', 'tim_kerja', 'nama_tim', 'team', 'team_name', 'group', 'group_name']
      for (const key of keys) {
        if (item[key]) {
          return String(item[key]).trim()
        }
      }
      return ''
    }

    const normalizeUnitKerjaName = (unit) => {
      if (!unit || typeof unit !== 'object') return ''
      return String(unit.nama_unit || unit.nama_unit_kerja || unit.unit_kerja || unit.name || unit.nama || '').trim()
    }

    const resolveUnitKerjaName = (item) => {
      if (!item || typeof item !== 'object') return ''
      if (typeof item.unit_kerja === 'string' && item.unit_kerja.trim()) return item.unit_kerja.trim()
      if (item.unit_kerja && typeof item.unit_kerja === 'object') {
        const fromObject = normalizeUnitKerjaName(item.unit_kerja)
        if (fromObject) return fromObject
      }

      const unitId = item.unit_kerja_id ?? item.id_unit_kerja ?? item.unit_kerja?.id ?? item.unit_kerja?.unit_kerja_id
      if (unitId != null && unitKerja.value.length > 0) {
        const found = unitKerja.value.find(u =>
          String(u.id) === String(unitId) ||
          String(u.kode_unit) === String(unitId) ||
          String(u.nama_unit) === String(unitId) ||
          String(u.nama_unit_kerja) === String(unitId)
        )
        if (found) {
          return normalizeUnitKerjaName(found)
        }
      }

      return getUnitKerjaFromItem(item)
    }

    const availableUnitKerja = computed(() => {
      const values = new Set()
      unitKerja.value.forEach((unit) => {
        const label = normalizeUnitKerjaName(unit)
        if (label) values.add(label)
      })

      if (values.size === 0) {
        kegiatan.value.forEach(k => {
          const unit = getUnitKerjaFromItem(k)
          if (unit) values.add(unit)
        })
      }

      return Array.from(values).sort()
    })

    const normalizeApiRows = (response) => {
      if (Array.isArray(response)) return response
      if (Array.isArray(response?.data)) return response.data
      if (Array.isArray(response?.unit_kerja)) return response.unit_kerja
      if (Array.isArray(response?.items)) return response.items
      return []
    }

    const filteredKegiatan = computed(() => {
      return kegiatan.value.filter(k => {
        const searchMatch = k.nama_kegiatan.toLowerCase().includes(searchKegiatan.value.toLowerCase())
        const tahunMatch = !filterTahun.value || (k.tanggal_mulai && new Date(k.tanggal_mulai).getFullYear().toString() === filterTahun.value)
        const statusMatch = !filterStatus.value || getKegiatanStatus(k) === filterStatus.value
        const unitKerjaValue = resolveUnitKerjaName(k)
        const unitKerjaMatch = !filterUnitKerja.value || unitKerjaValue === filterUnitKerja.value
        return searchMatch && tahunMatch && statusMatch && unitKerjaMatch
      })
    })

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatDateRange = (startDate, endDate) => {
      const start = new Date(startDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      const end = new Date(endDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      return `${start} - ${end}`
    }

    const parseKegiatanDate = (value, endOfDay = false) => {
      if (!value) return null
      const parsed = new Date(value)
      if (Number.isNaN(parsed.getTime())) return null

      if (endOfDay) {
        parsed.setHours(23, 59, 59, 999)
      } else {
        parsed.setHours(0, 0, 0, 0)
      }

      return parsed
    }

    const getKegiatanStatus = (item) => {
      const startDate = parseKegiatanDate(item?.tanggal_mulai)
      const endDate = parseKegiatanDate(item?.tanggal_selesai, true)

      if (!startDate || !endDate) return item?.status || ''

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (today < startDate) return 'akan_datang'
      if (today > endDate) return 'selesai'
      return 'berjalan'
    }

    const formatStatus = (status) => {
      const statusMap = {
        'berjalan': 'Berjalan',
        'akan_datang': 'Akan Datang',
        'selesai': 'Selesai'
      }
      return statusMap[status] || status
    }

    const getStatusColor = (status) => {
      const colorMap = {
        'berjalan': 'bg-blue-500',
        'akan_datang': 'bg-amber-500',
        'selesai': 'bg-emerald-500'
      }
      return colorMap[status] || 'bg-slate-400'
    }

    const getStatusBadge = (status) => {
      const badgeMap = {
        'berjalan': 'inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold',
        'akan_datang': 'inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold',
        'selesai': 'inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold'
      }
      return badgeMap[status] || 'inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-semibold'
    }

    // slugify helper for building friendly URL segments
    const slugify = (text) => {
      if (!text) return ''
      return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
    }

    const buildFormLink = (kode, peran, judul) => {
      return buildAppUrl(`formulir/${kode}/${peran}/${slugify(judul)}`)
    }

    const buildPublicEvaluasiLink = (kode, judul = '') => {
      const slug = slugify(judul)
      return buildAppUrl(`evaluasi/${kode}/${slug}`)
    }

    const buildPublicLaporanEvaluasiLink = (kode, judul = '') => {
      const slug = slugify(judul)
      return buildAppUrl(`laporan-evaluasi/${kode}/${slug}`)
    }

    const buildAbsoluteUrl = (url) => {
      if (!url || typeof url !== 'string') return ''
      return buildAppUrl(url)
    }

    const getDocumentLinks = (item) => {
      if (!item || typeof item !== 'object') return []
      const candidates = [
        { key: 'dokumentasi_url', label: 'Dokumentasi' },
        { key: 'materi_url', label: 'Materi' },
        { key: 'panduan_url', label: 'Panduan' },
        { key: 'laporan_url', label: 'Laporan' },
        { key: 'surat_menyurat_url', label: 'Surat Menyurat' }
      ]
      return candidates
        .map(({ key, label }) => ({
          label,
          url: buildAbsoluteUrl(item[key])
        }))
        .filter(entry => entry.url)
    }

    const selectedDocumentLinks = computed(() => getDocumentLinks(selectedKegiatan.value))

    const activityLinks = computed(() => {
      if (!selectedKegiatan.value) return { peserta: '', panitia: '', narasumber: '', pendamping: '', evaluasi: '', laporanEvaluasi: '' }
      const kode = selectedKegiatan.value.id_kegiatan || ''
      const judul = selectedKegiatan.value.nama_kegiatan || ''
      return {
        peserta: buildFormLink(kode, 'Peserta', judul),
        panitia: buildFormLink(kode, 'Panitia', judul),
        narasumber: buildFormLink(kode, 'Narasumber', judul),
        pendamping: buildFormLink(kode, 'Pendamping', judul),
        evaluasi: buildPublicEvaluasiLink(kode, judul),
        laporanEvaluasi: buildPublicLaporanEvaluasiLink(kode, judul)
      }
    })

    const formLinks = computed(() => {
      const links = activityLinks.value
      return [
        { key: 'peserta', label: 'Formulir Peserta', url: links.peserta },
        { key: 'panitia', label: 'Formulir Panitia', url: links.panitia },
        { key: 'narasumber', label: 'Formulir Narasumber', url: links.narasumber },
        { key: 'pendamping', label: 'Formulir Pendamping', url: links.pendamping }
      ].filter(entry => entry.url)
    })

    const evaluationLinks = computed(() => {
      const links = activityLinks.value
      return [
        { key: 'evaluasi', label: 'Link Evaluasi', url: links.evaluasi },
        { key: 'laporanEvaluasi', label: 'Laporan Evaluasi', url: links.laporanEvaluasi }
      ].filter(entry => entry.url)
    })

    const qrCodes = ref({})

    const generateQrCodes = async () => {
      if (!selectedKegiatan.value) {
        qrCodes.value = {}
        return
      }
      const links = activityLinks.value
      const nextQrCodes = {}
      const QRCode = (await import('qrcode')).default || (await import('qrcode'))
      await Promise.all(
        Object.entries(links).map(async ([key, url]) => {
          try {
            if (url) {
              nextQrCodes[key] = await QRCode.toDataURL(url, { width: 180, margin: 1 })
            }
          } catch (error) {
            nextQrCodes[key] = ''
          }
        })
      )
      qrCodes.value = nextQrCodes
    }

    const pesertaInSelected = computed(() => {
      if (!selectedKegiatan.value) return []
      return peserta.value.filter(p => String(p.id_kegiatan) === String(selectedKegiatan.value.id_kegiatan))
    })

    const viewPesertaList = ref(false)

    const exportPesertaKegiatan = async () => {
      const XLSX = (await import('xlsx')).default || await import('xlsx')
      const buildSignatureUrl = (sig) => {
        if (!sig) return ''
        if (typeof sig !== 'string') return ''
        if (sig.startsWith('http')) return sig
        if (sig.startsWith('data:')) return sig
        return buildStorageUrl(sig)
      }
      const getNamaKegiatan = (id) => {
        const k = kegiatan.value.find(k => String(k.id_kegiatan) === String(id))
        return k ? k.nama_kegiatan : 'Unknown Kegiatan'
      }
      const rows = pesertaInSelected.value.map(p => {
        const signature = p.tanda_tangan_url || p.tanda_tangan || p.tandatangan || ''
        return {
          nama_kegiatan: getNamaKegiatan(p.id_kegiatan),
          nama_lengkap: p.nama_lengkap,
          nip: p.nip || '',
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
      const filename = `peserta_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`
      XLSX.writeFile(wb, filename)

      // Log export activity
      ActivityEvents.EXPORT_DATA(`Peserta - ${selectedKegiatan.value.nama_kegiatan}`, 'xlsx')
    }

    const dateFormatDocx = (date) => {
      const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      if (!date) return ' '
      const d = new Date(date)
      if (Number.isNaN(d.getTime())) return ' '
      return `${d.getDate().toString().padStart(2, '0')} ${bulan[d.getMonth()]} ${d.getFullYear()}`
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
      } catch {
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

    const buildPesertaDocxData = (pesertaData, kegiatanData) => ({
      judul_kegiatan: kegiatanData.nama_kegiatan || 'Kegiatan',
      tanggal_mulai: dateFormatDocx(kegiatanData.tanggal_mulai),
      tanggal_selesai: dateFormatDocx(kegiatanData.tanggal_selesai),
      waktu: `${dateFormatDocx(kegiatanData.tanggal_mulai)} s.d. ${dateFormatDocx(kegiatanData.tanggal_selesai)}`,
      lokasi: getKegiatanLocationLabel(kegiatanData),
      nama_lengkap: pesertaData.nama_lengkap || '',
      nip: pesertaData.nip || '',
      pangkat: pesertaData.pangkat || '',
      instansi: pesertaData.nama_instansi || '',
      jabatan: pesertaData.jabatan || '',
      kabupaten_kota: pesertaData.kab_kota || '',
      provinsi: pesertaData.provinsi || '',
      no_hp: pesertaData.no_hp || '',
      email: pesertaData.email || '',
      nama_instansi: pesertaData.nama_instansi || '',
      kegiatan: kegiatanData.nama_kegiatan || 'Kegiatan',
      peran: pesertaData.peran || 'Peserta',
      tanda_tangan_url: pesertaData.tanda_tangan_url || pesertaData.tanda_tangan || pesertaData.tandatangan || ''
    })

    const sanitizeFilename = (value) => String(value || 'file').replace(/[\\/:*?"<>|]+/g, '-').trim()

    const downloadBatchPesertaDocx = async () => {
      if (!selectedKegiatan.value || pesertaInSelected.value.length === 0) {
        alert('Tidak ada peserta untuk diunduh.')
        return
      }

      isDownloadingBatchDocx.value = true

      try {
        const templateResponse = await fetch(buildAppUrl('template_peserta.docx'))
        if (!templateResponse.ok) {
          throw new Error(`Template lokal tidak ditemukan (${templateResponse.status})`)
        }

        const templateDocx = await templateResponse.blob()
        const kegiatanDetail = await getKegiatanForDocx(selectedKegiatan.value.id_kegiatan)
        const kegiatanData = { ...(selectedKegiatan.value || {}), ...(kegiatanDetail || {}) }
        const daftarAtk = extractKegiatanAtkItems(kegiatanData)
        const JSZip = (await import('jszip')).default || (await import('jszip'))
        const zip = new JSZip()

        for (const p of pesertaInSelected.value) {
          const data = buildPesertaDocxData(p, kegiatanData)
          const xmlContent = await parseDocxPreservingFormat(templateDocx)
          const xmlWithPlaceholders = replacePlaceholdersInXml(xmlContent, data)
          const finalXml = fillKelengkapanKegiatanTable(xmlWithPlaceholders, daftarAtk)
          const docxBlob = await generateDocxFromXml(finalXml, templateDocx, null)
          const fileName = `${sanitizeFilename(p.peran || 'Peserta')} - ${sanitizeFilename(p.nama_lengkap || p.id_peserta)}.docx`
          zip.file(fileName, docxBlob)
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = window.URL.createObjectURL(zipBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${sanitizeFilename(selectedKegiatan.value.nama_kegiatan || 'peserta')}-docx-batch.zip`
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)

        ActivityEvents.EXPORT_DATA(`Peserta - ${selectedKegiatan.value.nama_kegiatan}`, 'docx-zip')
      } catch (error) {
        console.error('Gagal download batch DOCX peserta:', error)
        alert(error.message || 'Gagal download batch DOCX peserta.')
      } finally {
        isDownloadingBatchDocx.value = false
      }
    }

    const openDetailModal = (k) => {
      selectedKegiatan.value = k
      qrCodes.value = {}
      showDetailModal.value = true
      generateQrCodes()
      // Log kegiatan detail view
      ActivityEvents.VIEW_KEGIATAN_DETAIL(k.id_kegiatan, k.nama_kegiatan)
    }

    const fetchDashboardStats = async () => {
      try {
        const response = await fetchAPI('kegiatan/statistik', { raw: true })
        const rows = Array.isArray(response?.data)
          ? response.data
          : (Array.isArray(response) ? response : [])
        const statistik = rows[0] || {}

        dashboardStats.value = {
          total_peserta: toDashboardNumber(statistik.total_peserta),
          total_kegiatan: toDashboardNumber(statistik.total_kegiatan),
          total_sertifikat: toDashboardNumber(statistik.total_sertifikat),
          total_kegiatan_berjalan: toDashboardNumber(statistik.total_kegiatan_berjalan)
        }
      } catch (error) {
        console.error('[Dashboard] Error fetching statistik kegiatan:', error)
        dashboardStats.value = getLocalDashboardStats()
      }
    }

    // Fetch kegiatan dari API server dengan pagination
    const fetchKegiatanData = async () => {
      try {
        isLoadingKegiatan.value = true

        // Build query parameters untuk pagination dan filter
        const params = new URLSearchParams({
          page: currentPage.value,
          per_page: pageSize.value,
          limit: pageSize.value,
          search: searchKegiatan.value,
          tahun: filterTahun.value,
          unit_kerja: filterUnitKerja.value
        })

        // Filter out empty params
        Array.from(params.entries()).forEach(([key, value]) => {
          if (!value) params.delete(key)
        })

        const url = `kegiatan/all`

        const response = await fetchAPI(url, {
          params: Object.fromEntries(params.entries()),
          raw: true
        })

        // Backend bisa return format:
        // Laravel pagination resource: { data: [...], links: {...}, meta: { total, per_page, current_page } }
        // atau { data: [...], total: 100, per_page: 9, current_page: 1 }
        // atau direct array
        if (Array.isArray(response)) {
          kegiatan.value = response
          totalKegiatanCount.value = response.length
        } else if (response.data) {
          kegiatan.value = response.data
          totalKegiatanCount.value = response.meta?.total || response.total || response.data.length
        } else {
          kegiatan.value = []
          totalKegiatanCount.value = 0
        }

      } catch (error) {
        console.error('[Dashboard] Error fetching kegiatan:', error)
        // Fallback ke local data jika API gagal
        kegiatan.value = database.kegiatan
        totalKegiatanCount.value = kegiatan.value.length
      } finally {
        isLoadingKegiatan.value = false
      }
    }

    // Computed untuk total pages
    const totalPages = computed(() => {
      return Math.ceil(totalKegiatanCount.value / pageSize.value)
    })

    watch([searchKegiatan, filterTahun, filterStatus, filterUnitKerja], (() => {
      let debounceTimer = null
      return () => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(async () => {
          currentPage.value = 1
          await fetchKegiatanData()
        }, 300)
      }
    })())

    // Load kegiatan saat component mount atau saat filter/search berubah
    // onMounted(async () => {
    //   // Load pegawai dan users data dari API terlebih dahulu sebelum rendering greeting
    //   try {
    //     const pegawaiData = await fetchAPI('pegawai')
    //     if (Array.isArray(pegawaiData)) {
    //       pegawai.value = pegawaiData
    //     }
    //   } catch (error) {
    //     console.warn('[Dashboard] ⚠️ Failed to load pegawai from API:', error.message)
    //   }

    //   try {
    //     const usersData = await fetchAPI('users')
    //     if (Array.isArray(usersData)) {
    //       users.value = usersData
    //     }
    //   } catch (error) {
    //     console.warn('[Dashboard] ⚠️ Failed to load users from API:', error.message)
    //   }

    //   try {
    //     const pesertaData = await fetchAPI('peserta')
    //     if (Array.isArray(pesertaData)) {
    //       peserta.value = pesertaData
    //       totalPeserta.value = pesertaData.length
    //     } else if (pesertaData && pesertaData.data && Array.isArray(pesertaData.data)) {
    //       peserta.value = pesertaData.data
    //       totalPeserta.value = pesertaData.data.length
    //     }
    //   } catch (error) {
    //     console.warn('[Dashboard] ⚠️ Failed to load peserta from API:', error.message)
    //   }

    //   try {
    //     const sertifikatData = await fetchAPI('sertifikat')
    //     if (Array.isArray(sertifikatData)) {
    //       sertifikat.value = sertifikatData
    //       totalSertifikat.value = sertifikatData.filter(s => s.status === 'terbit').length
    //     } else if (sertifikatData && sertifikatData.data && Array.isArray(sertifikatData.data)) {
    //       sertifikat.value = sertifikatData.data
    //       totalSertifikat.value = sertifikatData.data.filter(s => s.status === 'terbit').length
    //     }
    //   } catch (error) {
    //     console.warn('[Dashboard] ⚠️ Failed to load sertifikat from API:', error.message)
    //   }

    //   // Trigger profilePegawai computed untuk mendapatkan profile yang tepat
    //   const profile = profilePegawai.value
    //   if (profile) {
    //   } else {
    //     console.warn('[Dashboard] ⚠️ Profile pegawai tidak ditemukan')
    //   }

    //   // Load kegiatan data
    //   fetchKegiatanData()

    //   // Log dashboard access
    //   ActivityEvents.VIEW_DASHBOARD()
    // })

    onMounted(async () => {
      try {
        isLoadingKegiatan.value = true

        const [
          ,
          pesertaData,
          sertifikatData,
          unitKerjaData
        ] = await Promise.all([
          fetchDashboardStats(),
          fetchAPI('peserta'),
          fetchAPI('sertifikat'),
          fetchAPI('unit-kerja'),
          fetchKegiatanData()
        ])

        peserta.value = normalizeApiRows(pesertaData)
        sertifikat.value = normalizeApiRows(sertifikatData)
        unitKerja.value = normalizeApiRows(unitKerjaData)

      } catch (error) {
        console.error(error)
      } finally {
        isLoadingKegiatan.value = false
      }
    })

    return {
      currentUser,
      profilePegawai,
      totalKegiatan,
      totalPeserta,
      totalSertifikat,
      kegiatanBerjalan,
      kegiatan,
      searchKegiatan,
      filterTahun,
      filterStatus,
      filterUnitKerja,
      availableTahun,
      availableUnitKerja,
      filteredKegiatan,
      getKegiatanStatus,
      formatDate,
      formatDateRange,
      formatStatus,
      getStatusColor,
      getStatusBadge,
      getUnitKerjaFromItem,
      resolveUnitKerjaName,
      getKegiatanLocationLabel,
      getKegiatanKabupatenKotaLabel,
      getDocumentLinks,
      selectedDocumentLinks,
      formLinks,
      evaluationLinks,
      openDetailModal,
      showDetailModal,
      selectedKegiatan,
      activityLinks,
      qrCodes,
      pesertaInSelected,
      viewPesertaList,
      exportPesertaKegiatan,
      downloadBatchPesertaDocx,
      isDownloadingBatchDocx,
      openPesertaKegiatan,
      currentPage,
      pageSize,
      totalKegiatanCount,
      totalPages,
      isLoadingKegiatan,
      fetchKegiatanData
    }
  }
}
</script>

<style scoped>
.card-stat {
  transition: all 0.3s ease;
}

.card-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>
