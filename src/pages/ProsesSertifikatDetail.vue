<template>
  <div class="min-h-screen bg-[#F0F2F5]">
    <!-- Header -->
    <div class="max-w-[1200px] mx-auto px-4 pt-4 pb-2">
      <button
        class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-indigo-600 hover:text-indigo-800 transition mb-2"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Kembali ke Daftar Proses Sertifikat
      </button>
      <h1 class="text-[20px] font-bold text-[#050505]">Detail Proses Sertifikat</h1>
      <p class="text-[13px] text-[#65676B] mt-0.5">Penerbitan nomor resmi naskah dan pengelolaan status sertifikat per peserta.</p>
    </div>

    <!-- Bagian Atas: Data Kegiatan + Proses Naskah -->
    <div class="max-w-[1200px] mx-auto px-4 pb-2">
      <LoadingState
        :state="isLoadingBatch ? 'loading' : batchError ? 'error' : batch ? 'ready' : 'empty'"
        message="Memuat data naskah sertifikat..."
        error-title="Gagal memuat data"
        :error-message="batchError"
        empty-title="Batch tidak ditemukan"
        empty-message="Batch sertifikat yang dimaksud tidak ditemukan."
        :on-retry="loadBatch"
      >
        <div class="bg-white rounded-xl shadow-sm border border-[#E4E6E9] overflow-hidden">
          <div class="px-4 py-2.5 bg-[#F0F2F5] border-b border-[#E4E6E9]">
            <p class="text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Data Kegiatan</p>
          </div>

          <!-- Data Kegiatan -->
          <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            <div class="flex gap-2">
              <span class="w-36 flex-shrink-0 text-[#65676B]">Nama Kegiatan</span>
              <span class="font-semibold text-[#050505] break-words">{{ namaKegiatan }}</span>
            </div>
            <div class="flex gap-2">
              <span class="w-36 flex-shrink-0 text-[#65676B]">Tanggal</span>
              <span class="text-[#050505]">{{ tanggalKegiatan }}</span>
            </div>
            <div class="flex gap-2">
              <span class="w-36 flex-shrink-0 text-[#65676B]">Penandatangan</span>
              <span class="text-[#050505] break-words">{{ namaPenandatangan }}</span>
            </div>
            <div class="flex gap-2">
              <span class="w-36 flex-shrink-0 text-[#65676B]">Jumlah Peserta</span>
              <span class="text-[#050505]">{{ jumlahPeserta }} peserta</span>
            </div>
            <div class="flex gap-2">
              <span class="w-36 flex-shrink-0 text-[#65676B]">Template</span>
              <span
                class="px-2 py-0.5 rounded-full text-[12px] font-medium"
                :class="batch?.template_file ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ batch?.template_file ? 'Template tersedia' : 'Template belum diunggah' }}
              </span>
            </div>
            <div class="flex gap-2">
              <span class="w-36 flex-shrink-0 text-[#65676B]">Status Naskah</span>
              <span class="text-[12px] px-2 py-0.5 rounded-full font-medium" :class="prosesChip(batch?.status)">
                {{ prosesLabel(batch?.status) }}
              </span>
            </div>
          </div>

          <!-- Input Nomor Surat + Proses -->
          <div class="border-t border-[#E4E6E9] p-4">
            <div class="flex flex-col sm:flex-row sm:items-end gap-3">
              <div class="flex-1">
                <label class="block text-[13px] font-semibold text-[#050505] mb-1">
                  Nomor Surat <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="nomorSurat"
                  type="text"
                  maxlength="150"
                  placeholder="Masukkan nomor surat resmi"
                  :disabled="!isNaskahDisetujui || isSubmittingProses"
                  class="w-full px-3 py-2.5 bg-[#F0F2F5] rounded-lg border border-[#E4E6E9] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-[14px] disabled:opacity-70"
                />
                <p class="text-[12px] text-[#65676B] mt-1">
                  Nilai awal <strong class="text-[#050505]">draft</strong> wajib diganti dengan nomor surat resmi sebelum naskah diterbitkan.
                </p>
                <p v-if="nomorSuratError" class="text-[12px] text-red-600 mt-1">{{ nomorSuratError }}</p>
              </div>
              <button
                v-if="isNaskahDisetujui"
                class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-[14px] font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                :disabled="isSubmittingProses"
                @click="submitProses"
              >
                {{ isSubmittingProses ? 'Memproses...' : 'Proses' }}
              </button>
              <span
                v-else
                class="px-4 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 text-[13px] font-semibold whitespace-nowrap"
              >
                Naskah sudah diproses
              </span>
            </div>
          </div>
        </div>
      </LoadingState>
    </div>

    <!-- Bagian Bawah: Ringkasan + Tabel Peserta -->
    <div class="max-w-[1200px] mx-auto px-4 pb-8 pt-2">
      <!-- Kartu Ringkasan (klik untuk filter) -->
      <div class="mb-3">
        <p class="text-[12px] text-[#65676B] mb-1.5">Status sertifikat peserta — klik kartu untuk memfilter tabel.</p>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            v-for="card in ringkasanCards"
            :key="card.key"
            class="bg-white rounded-xl border border-[#E4E6E9] px-3 py-2.5 text-left transition hover:shadow-md"
            :class="filterStatusSertifikat === card.value ? 'ring-2 ring-indigo-500 border-indigo-300' : ''"
            @click="toggleFilterStatus(card.value)"
          >
            <p class="text-[11px] font-semibold uppercase tracking-wide" :class="card.labelClass">{{ card.label }}</p>
            <p class="text-[20px] font-bold text-[#050505] leading-tight">{{ card.count }}</p>
          </button>
        </div>
      </div>

      <!-- Toolbar: pencarian + aksi massal -->
      <div class="bg-white rounded-xl border border-[#E4E6E9] p-3 mb-3">
        <div class="flex flex-col md:flex-row md:items-center gap-2">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama, instansi, atau kelas..."
              class="w-full px-3 py-2 text-[13px] border border-[#E4E6E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#F0F2F5] focus:bg-white"
            />
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <select
              v-model.number="pageSize"
              class="px-3 py-2 text-[13px] border border-[#E4E6E9] rounded-lg bg-white"
            >
              <option :value="10">10 / halaman</option>
              <option :value="25">25 / halaman</option>
              <option :value="50">50 / halaman</option>
              <option :value="100">100 / halaman</option>
            </select>
            <div class="relative">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E4E6E9] rounded-lg text-[13px] text-gray-700 hover:bg-gray-50"
                @click="showColMenu = !showColMenu"
              >
                &#9881; Kelola Kolom
              </button>
              <div v-if="showColMenu" class="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 p-2 space-y-1">
                <label class="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" v-model="visibleCols.instansi" class="h-4 w-4 rounded border-gray-300" /> Instansi
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" v-model="visibleCols.status" class="h-4 w-4 rounded border-gray-300" /> Status
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" v-model="visibleCols.kelas" class="h-4 w-4 rounded border-gray-300" /> Kelas
                </label>
              </div>
            </div>
            <button
              class="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="selectedCount === 0 || isBulkRunning"
              @click="openBulkModal"
            >
              Ubah Status Tercentang{{ selectedCount ? ` (${selectedCount})` : '' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tabel Peserta -->
      <LoadingState
        :state="isLoadingPeserta ? 'loading' : pesertaError ? 'error' : filteredRows.length === 0 ? 'empty' : 'ready'"
        message="Memuat data peserta..."
        error-title="Gagal memuat data peserta"
        :error-message="pesertaError"
        empty-title="Tidak ada peserta"
        empty-message="Tidak ada peserta yang cocok dengan filter saat ini."
        :on-retry="loadPeserta"
      >
        <div class="bg-white rounded-xl border border-[#E4E6E9] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full table-fixed text-sm">
              <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th class="px-2 py-3 text-left text-xs sm:text-sm w-[36px]">
                    <input v-model="allSelected" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
                  </th>
                  <th class="px-2 py-3 text-left text-xs sm:text-sm w-[40px]">No</th>
                  <th class="px-2 py-3 text-left text-xs sm:text-sm cursor-pointer select-none hover:bg-blue-700/30 break-words" @click="setSort('nama_lengkap')">Nama{{ sortIndicator('nama_lengkap') }}</th>
                  <th v-if="visibleCols.instansi" class="px-2 py-3 text-left text-xs sm:text-sm cursor-pointer select-none hover:bg-blue-700/30 break-words" @click="setSort('nama_instansi')">Instansi{{ sortIndicator('nama_instansi') }}</th>
                  <th v-if="visibleCols.status" class="px-2 py-3 text-left text-xs sm:text-sm cursor-pointer select-none hover:bg-blue-700/30 break-words" @click="setSort('status')">Status{{ sortIndicator('status') }}</th>
                  <th v-if="visibleCols.kelas" class="px-2 py-3 text-left text-xs sm:text-sm cursor-pointer select-none hover:bg-blue-700/30 break-words" @click="setSort('nama_kelas')">Kelas{{ sortIndicator('nama_kelas') }}</th>
                  <th class="px-2 py-3 text-left text-xs sm:text-sm cursor-pointer select-none hover:bg-blue-700/30 break-words" @click="setSort('status_sertifikat')">Status Sertifikat{{ sortIndicator('status_sertifikat') }}</th>
                  <th class="px-2 py-3 text-center text-xs sm:text-sm break-words">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(p, index) in paginatedRows"
                  :key="p.id_peserta"
                  class="hover:bg-blue-50 transition-colors"
                >
                  <td class="px-2 py-3">
                    <input
                      v-model="checkedIds"
                      :value="p.id_peserta"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td class="px-2 py-3 text-xs sm:text-sm text-gray-900">{{ paginationStart + index }}</td>
                  <td class="px-2 py-3 text-xs sm:text-sm font-medium text-gray-900 break-words">{{ p.nama_lengkap || '-' }}</td>
                  <td v-if="visibleCols.instansi" class="px-2 py-3 text-xs sm:text-sm text-gray-600 break-words">{{ p.nama_instansi || '-' }}</td>
                  <td v-if="visibleCols.status" class="px-2 py-3 text-xs sm:text-sm">
                    <span
                      class="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      :class="String(p.status || '').toLowerCase() === 'nonaktif' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'"
                    >
                      {{ p.status || '-' }}
                    </span>
                  </td>
                  <td v-if="visibleCols.kelas" class="px-2 py-3 text-xs sm:text-sm text-gray-600 break-words">{{ p.nama_kelas || '-' }}</td>
                  <td class="px-2 py-3 text-xs sm:text-sm">
                    <span
                      v-if="rowBusyId !== p.id_peserta"
                      class="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      :class="sertifikatChip(p.status_sertifikat)"
                    >
                      {{ sertifikatLabel(p.status_sertifikat) }}
                    </span>
                    <span v-else class="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                      <svg class="w-3 h-3 inline-block animate-spin -mt-0.5 mr-0.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                      Memproses...
                    </span>
                  </td>
                  <td class="px-1 py-3 text-xs overflow-hidden">
                    <div class="flex gap-1 justify-center flex-wrap">
                      <button
                        class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-[11px] font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!canTerbitkan || rowBusyId !== null"
                        :title="canTerbitkan ? 'Terbitkan sertifikat peserta ini' : terbitkanUnavailableMessage"
                        @click="rowTerbitkan(p)"
                      >
                        Terbitkan
                      </button>
                      <button
                        class="px-2 py-1 bg-amber-400 text-white rounded hover:bg-amber-500 transition-colors text-[11px] font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="rowBusyId !== null"
                        title="Jadikan draft (tanpa berkas)"
                        @click="rowDraft(p)"
                      >
                        Draft
                      </button>
                      <button
                        class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-[11px] font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="rowBusyId !== null"
                        title="Cabut sertifikat peserta ini"
                        @click="openCabutModal(p)"
                      >
                        Cabut
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-emerald-50 font-semibold text-gray-800">
                  <td class="px-2 py-2 text-gray-500">&Sigma;</td>
                  <td class="px-2 py-2" colspan="2">TOTAL</td>
                  <td class="px-2 py-2" :colspan="middleColCount + 1">
                    {{ filteredRows.length }} peserta dari {{ pesertaRows.length }}
                  </td>
                  <td class="px-2 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Pagination -->
          <div class="border-t border-gray-100 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm text-gray-600">
              Menampilkan <span class="font-semibold text-gray-900">{{ paginationStart }}</span>-<span class="font-semibold text-gray-900">{{ paginationEnd }}</span>
              dari <span class="font-semibold text-gray-900">{{ filteredRows.length }}</span> peserta
            </p>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                Sebelumnya
              </button>
              <span class="text-sm text-gray-600">Halaman {{ currentPage }} / {{ totalPages }}</span>
              <button
                class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </LoadingState>
    </div>

    <!-- Modal Alasan Cabut -->
    <div v-if="showCabutModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div class="flex items-center justify-between p-6 pb-3">
          <h3 class="text-[17px] font-bold text-[#050505]">
            {{ cabutMode === 'bulk' ? `Cabut Sertifikat ${selectedCount} Peserta` : 'Cabut Sertifikat Peserta' }}
          </h3>
          <button class="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B]" :disabled="isSubmittingCabut" @click="closeCabutModal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 pb-4 space-y-3">
          <p v-if="cabutMode === 'row'" class="text-[13px] text-[#65676B]">
            Peserta: <strong class="text-[#050505]">{{ cabutTargetRow?.nama_lengkap || '-' }}</strong>
          </p>
          <div>
            <label class="block text-[13px] font-semibold text-[#050505] mb-1">Alasan Pencabutan <span class="text-red-500">*</span></label>
            <textarea
              v-model="alasanCabut"
              rows="3"
              maxlength="500"
              placeholder="Tuliskan alasan pencabutan sertifikat"
              class="w-full px-3 py-2.5 bg-[#F0F2F5] rounded-lg border border-[#E4E6E9] focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-[14px]"
            ></textarea>
            <p v-if="alasanCabutError" class="text-[12px] text-red-600 mt-1">{{ alasanCabutError }}</p>
          </div>
        </div>
        <div class="flex border-t border-[#E4E6E9]">
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-[#65676B] hover:bg-[#F0F2F5] rounded-bl-2xl transition disabled:opacity-50"
            :disabled="isSubmittingCabut"
            @click="closeCabutModal"
          >
            Batal
          </button>
          <div class="w-px bg-[#E4E6E9]"></div>
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-red-600 hover:bg-red-50 rounded-br-2xl transition disabled:opacity-50"
            :disabled="isSubmittingCabut"
            @click="submitCabut"
          >
            {{ isSubmittingCabut ? 'Memproses...' : 'Cabut Sertifikat' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Ubah Status Tercentang -->
    <div v-if="showBulkModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div class="flex items-center justify-between p-6 pb-3">
          <h3 class="text-[17px] font-bold text-[#050505]">Ubah Status Tercentang</h3>
          <button class="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B]" @click="showBulkModal = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 pb-2">
          <p class="text-[13px] text-[#65676B]">
            <strong class="text-[#050505]">{{ selectedCount }} peserta</strong> tercentang. Pilih status target:
          </p>
        </div>
        <div class="px-6 pb-6 pt-3 space-y-2">
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold text-[14px] hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canTerbitkan"
            :title="canTerbitkan ? 'Terbitkan satu per satu dengan jeda antar peserta' : terbitkanUnavailableMessage"
            @click="bulkTerbitkan"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Terbitkan
            <span class="ml-auto text-[11px] font-normal">satu per satu, dengan jeda</span>
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 font-semibold text-[14px] hover:bg-amber-100 transition"
            @click="bulkDraft"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Draft
            <span class="ml-auto text-[11px] font-normal">satu panggilan massal</span>
          </button>
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-[14px] hover:bg-red-100 transition"
            @click="bulkCabut"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
            Cabut
            <span class="ml-auto text-[11px] font-normal">dengan alasan pencabutan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Progres Terbitkan Massal -->
    <div v-if="showProgressPopup" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
        <div class="flex items-center justify-between p-6 pb-3">
          <h3 class="text-[17px] font-bold text-[#050505]">Penerbitan Sertifikat Massal</h3>
          <button
            v-if="!isBulkRunning"
            class="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B]"
            @click="showProgressPopup = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 pb-4 space-y-3">
          <!-- Progres -->
          <div>
            <div class="flex items-center justify-between text-[13px] mb-1">
              <span class="font-semibold text-[#050505]">
                {{ isBulkRunning ? `Memproses ${progressCurrent} dari ${progressTotal} peserta` : 'Penerbitan selesai' }}
              </span>
              <span class="text-[#65676B]">{{ progressPercent }}%</span>
            </div>
            <div class="w-full h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <p v-if="isBulkRunning && progressNowName" class="text-[12px] text-[#65676B] mt-1">
              Sedang memproses: <strong class="text-[#050505]\">{{ progressNowName }}</strong>
            </p>
            <p v-else-if="isBulkRunning && isBulkWaiting" class="text-[12px] text-[#65676B] mt-1">
              Menunggu jeda sebelum peserta berikutnya...
            </p>
          </div>

          <!-- Log hasil -->
          <div class="rounded-xl border border-[#E4E6E9] max-h-[220px] overflow-y-auto divide-y divide-[#F0F2F5]">
            <div
              v-for="(log, i) in progressLog"
              :key="i"
              class="px-3 py-2 flex items-center gap-2 text-[12px]"
            >
              <span class="text-[#65676B] w-5 text-right">{{ i + 1 }}.</span>
              <span class="flex-1 text-[#050505] break-words">{{ log.nama }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                :class="progressHasilChip(log.hasil)"
              >
                {{ log.hasil }}
              </span>
            </div>
            <div v-if="progressLog.length === 0" class="px-3 py-4 text-center text-[12px] text-[#65676B]">
              Belum ada peserta yang diproses.
            </div>
          </div>

          <!-- Ringkasan akhir -->
          <div v-if="!isBulkRunning" class="rounded-xl bg-[#F0F2F5] px-4 py-3 text-[13px]">
            <p class="font-semibold text-[#050505] mb-1">Ringkasan</p>
            <div class="flex flex-wrap gap-x-4 gap-y-1">
              <span class="text-emerald-700 font-semibold">{{ progressHasil.berhasil }} berhasil</span>
              <span class="text-red-600 font-semibold">{{ progressHasil.gagal }} gagal</span>
              <span class="text-[#65676B] font-semibold">{{ progressHasil.sudahTerbit }} sudah terbit</span>
              <span v-if="progressCancelled" class="text-amber-600 font-semibold">dihentikan sebagian</span>
            </div>
          </div>
        </div>
        <div class="flex border-t border-[#E4E6E9]">
          <button
            v-if="isBulkRunning"
            class="flex-1 py-3 text-[15px] font-semibold text-red-600 hover:bg-red-50 transition"
            @click="stopBulkTerbitkan"
          >
            Hentikan
          </button>
          <button
            v-else
            class="flex-1 py-3 text-[15px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-b-2xl transition"
            @click="showProgressPopup = false"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifikasi -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="toastMessage"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-2xl text-[14px] font-semibold text-white max-w-[90vw] break-words"
        :class="toastType === 'success' ? 'bg-green-600' : toastType === 'info' ? 'bg-blue-600' : 'bg-red-600'"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingState from '@/components/LoadingState.vue'
import {
  getDetailProsesSertifikat,
  listPesertaStatusSertifikat,
  ubahStatusSertifikatPeserta,
  terbitkanSertifikatPeserta,
  prosesSertifikatBatch
} from '@/services/pengajuanSertifikat'

const route = useRoute()
const router = useRouter()
const idBatch = route.params.id

// ===== State: batch (bagian atas) =====
const batch = ref(null)
const isLoadingBatch = ref(true)
const batchError = ref('')

const nomorSurat = ref('draft')
const nomorSuratError = ref('')
const isSubmittingProses = ref(false)

// ===== State: peserta (bagian bawah) =====
const pesertaRows = ref([])
const ringkasan = ref({ total: 0, terbit: 0, draft: 0, dicabut: 0, belum: 0 })
const isLoadingPeserta = ref(true)
const pesertaError = ref('')

const filterStatusSertifikat = ref('')
const searchQuery = ref('')
const sortBy = ref('nama_lengkap')
const sortOrder = ref('asc')
const pageSize = ref(10)
const currentPage = ref(1)
const showColMenu = ref(false)
const visibleCols = ref({ instansi: true, status: false, kelas: true })
const checkedIds = ref([])

// ===== State: aksi =====
const rowBusyId = ref(null)
const showCabutModal = ref(false)
const cabutMode = ref('row') // 'row' | 'bulk'
const cabutTargetRow = ref(null)
const alasanCabut = ref('')
const alasanCabutError = ref('')
const isSubmittingCabut = ref(false)

const showBulkModal = ref(false)

const showProgressPopup = ref(false)
const isBulkRunning = ref(false)
const isBulkWaiting = ref(false)
const progressCancelled = ref(false)
const progressTotal = ref(0)
const progressCurrent = ref(0)
const progressNowName = ref('')
const progressLog = ref([])
const progressHasil = ref({ berhasil: 0, gagal: 0, sudahTerbit: 0 })

// ===== Toast =====
const toastMessage = ref('')
const toastType = ref('success')
let toastTimer = null

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const errorMessageOf = (error) =>
  String(error?.response?.data?.message || error?.message || 'Terjadi kesalahan.')

// ===== Helpers data kegiatan =====
const namaKegiatan = computed(() => {
  const k = batch.value?.kegiatan
  return k?.nama_kegiatan || k?.nama || batch.value?.nama_kegiatan || 'Kegiatan tanpa nama'
})

const tanggalKegiatan = computed(() => {
  const mulai = batch.value?.kegiatan?.tanggal_mulai
  const selesai = batch.value?.kegiatan?.tanggal_selesai
  if (!mulai && !selesai) return '-'
  if (!selesai || String(selesai) === String(mulai)) return formatDate(mulai)
  return formatDate(mulai) + ' s.d. ' + formatDate(selesai)
})

const namaPenandatangan = computed(() => {
  const p = batch.value?.penandatangan
  if (!p) return '-'
  const nama = p.nama || p.nama_lengkap || '-'
  const jabatan = p.nama_jabatan || ''
  return jabatan ? nama + ' — ' + jabatan : nama
})

const jumlahPeserta = computed(() =>
  ringkasan.value?.total ?? batch.value?.jumlah_peserta ?? pesertaRows.value.length ?? 0
)

const isNaskahDisetujui = computed(() => String(batch.value?.status || '').toLowerCase() === 'disetujui')
const canTerbitkan = computed(() => String(batch.value?.status || '').toLowerCase() === 'terbit')
const terbitkanUnavailableMessage = 'Terbitkan hanya tersedia setelah naskah bernomor resmi (status Terbit).'

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const prosesLabel = (status) => {
  const map = { disetujui: 'Belum Diproses', terbit: 'Terbit' }
  return map[String(status || '').toLowerCase()] || String(status || '-')
}

const prosesChip = (status) => {
  const map = {
    disetujui: 'bg-indigo-100 text-indigo-700',
    terbit: 'bg-emerald-100 text-emerald-700'
  }
  return map[String(status || '').toLowerCase()] || 'bg-slate-100 text-slate-700'
}

const rawSertifikatStatus = (value) => String(value || 'belum').toLowerCase()
const sertifikatLabel = (value) => {
  const map = { terbit: 'Terbit', draft: 'Draft', dicabut: 'Dicabut', belum: 'Belum' }
  return map[rawSertifikatStatus(value)] || String(value || 'Belum')
}
const sertifikatChip = (value) => {
  const map = {
    terbit: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-amber-100 text-amber-700',
    dicabut: 'bg-red-100 text-red-700',
    belum: 'bg-slate-100 text-slate-600'
  }
  return map[rawSertifikatStatus(value)] || 'bg-slate-100 text-slate-600'
}

// ===== Ringkasan cards =====
const ringkasanCards = computed(() => {
  const r = ringkasan.value || {}
  return [
    { key: 'total', label: 'Total', value: '', count: r.total ?? pesertaRows.value.length, labelClass: 'text-[#65676B]' },
    { key: 'terbit', label: 'Terbit', value: 'terbit', count: r.terbit ?? 0, labelClass: 'text-emerald-600' },
    { key: 'draft', label: 'Draft', value: 'draft', count: r.draft ?? 0, labelClass: 'text-amber-600' },
    { key: 'dicabut', label: 'Dicabut', value: 'dicabut', count: r.dicabut ?? 0, labelClass: 'text-red-600' },
    { key: 'belum', label: 'Belum', value: 'belum', count: r.belum ?? 0, labelClass: 'text-slate-500' }
  ]
})

const toggleFilterStatus = (value) => {
  filterStatusSertifikat.value = filterStatusSertifikat.value === value ? '' : value
}

// ===== Filter, urut, halaman =====
const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return pesertaRows.value.filter((p) => {
    const statusMatch =
      !filterStatusSertifikat.value ||
      rawSertifikatStatus(p.status_sertifikat) === filterStatusSertifikat.value
    const searchMatch =
      !q ||
      String(p.nama_lengkap || '').toLowerCase().includes(q) ||
      String(p.nama_instansi || '').toLowerCase().includes(q) ||
      String(p.nama_kelas || '').toLowerCase().includes(q)
    return statusMatch && searchMatch
  })
})

const sortedRows = computed(() => {
  const data = [...filteredRows.value]
  const col = sortBy.value
  const order = sortOrder.value === 'asc' ? 1 : -1
  return data.sort((a, b) => {
    const valA = String(a[col] ?? '').toLowerCase()
    const valB = String(b[col] ?? '').toLowerCase()
    if (valA < valB) return -1 * order
    if (valA > valB) return 1 * order
    return 0
  })
})

const setSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

const sortIndicator = (column) => {
  if (sortBy.value !== column) return ''
  return sortOrder.value === 'asc' ? ' ▲' : ' ▼'
}

const totalPages = computed(() => Math.max(Math.ceil(sortedRows.value.length / pageSize.value), 1))
const paginationStart = computed(() => (sortedRows.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1))
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, sortedRows.value.length))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

const goToPage = (page) => {
  currentPage.value = Math.min(Math.max(Number(page) || 1, 1), totalPages.value)
}

watch([searchQuery, filterStatusSertifikat, pageSize], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) currentPage.value = nextTotalPages
})

const middleColCount = computed(
  () => (visibleCols.value.instansi ? 1 : 0) + (visibleCols.value.status ? 1 : 0) + (visibleCols.value.kelas ? 1 : 0)
)

// ===== Seleksi =====
const selectedFilteredIds = computed(() => {
  const visible = new Set(filteredRows.value.map((p) => String(p.id_peserta)))
  return checkedIds.value.filter((id) => visible.has(String(id)))
})
const selectedCount = computed(() => selectedFilteredIds.value.length)

const allSelected = computed({
  get() {
    return filteredRows.value.length > 0 && selectedCount.value === filteredRows.value.length
  },
  set(checked) {
    checkedIds.value = checked ? filteredRows.value.map((p) => p.id_peserta) : []
  }
})

// ===== Ambil data =====
const loadBatch = async () => {
  isLoadingBatch.value = true
  batchError.value = ''
  try {
    batch.value = await getDetailProsesSertifikat(idBatch)
    if (batch.value) {
      const sudahDiproses = String(batch.value.status || '').toLowerCase() === 'terbit'
      nomorSurat.value = sudahDiproses && batch.value.nomor_sertifikat
        ? String(batch.value.nomor_sertifikat)
        : 'draft'
    }
  } catch (error) {
    batchError.value = errorMessageOf(error)
  } finally {
    isLoadingBatch.value = false
  }
}

const loadPeserta = async () => {
  isLoadingPeserta.value = true
  pesertaError.value = ''
  try {
    const result = await listPesertaStatusSertifikat(idBatch)
    pesertaRows.value = Array.isArray(result.data) ? result.data : []
    ringkasan.value = result.ringkasan || { total: 0, terbit: 0, draft: 0, dicabut: 0, belum: 0 }
  } catch (error) {
    pesertaError.value = errorMessageOf(error)
  } finally {
    isLoadingPeserta.value = false
  }
}

const reloadAll = async () => {
  await Promise.all([loadBatch(), loadPeserta()])
}

// ===== Proses naskah (bagian atas) =====
const submitProses = async () => {
  if (isSubmittingProses.value || !batch.value) return
  const nomor = nomorSurat.value.trim()
  if (!nomor) {
    nomorSuratError.value = 'Nomor surat resmi wajib diisi.'
    return
  }
  if (nomor.toLowerCase() === 'draft') {
    nomorSuratError.value = "Nilai 'draft' wajib diganti dengan nomor surat resmi."
    return
  }
  nomorSuratError.value = ''
  isSubmittingProses.value = true
  try {
    await prosesSertifikatBatch(batch.value.id_batch, nomor)
    showToast('Naskah sertifikat diproses dan bernomor resmi.', 'success')
    await reloadAll()
  } catch (error) {
    showToast(errorMessageOf(error), 'error')
  } finally {
    isSubmittingProses.value = false
  }
}

// ===== Aksi per baris =====
const rowTerbitkan = async (p) => {
  if (!canTerbitkan.value || rowBusyId.value !== null) return
  rowBusyId.value = p.id_peserta
  try {
    await terbitkanSertifikatPeserta(idBatch, p.id_peserta)
    showToast(`Sertifikat ${p.nama_lengkap || 'peserta'} berhasil diterbitkan.`, 'success')
  } catch (error) {
    showToast(errorMessageOf(error), 'error')
  } finally {
    rowBusyId.value = null
    await loadPeserta()
  }
}

const rowDraft = async (p) => {
  if (rowBusyId.value !== null) return
  rowBusyId.value = p.id_peserta
  try {
    await ubahStatusSertifikatPeserta(idBatch, { id_pilih: [p.id_peserta], status: 'draft' })
    showToast(`Sertifikat ${p.nama_lengkap || 'peserta'} diubah menjadi draft.`, 'success')
  } catch (error) {
    showToast(errorMessageOf(error), 'error')
  } finally {
    rowBusyId.value = null
    await loadPeserta()
  }
}

// ===== Modal Cabut (per baris + massal) =====
const openCabutModal = (p) => {
  cabutMode.value = 'row'
  cabutTargetRow.value = p
  alasanCabut.value = ''
  alasanCabutError.value = ''
  showCabutModal.value = true
}

const openCabutModalBulk = () => {
  cabutMode.value = 'bulk'
  cabutTargetRow.value = null
  alasanCabut.value = ''
  alasanCabutError.value = ''
  showCabutModal.value = true
}

const closeCabutModal = () => {
  if (isSubmittingCabut.value) return
  showCabutModal.value = false
  cabutTargetRow.value = null
}

const submitCabut = async () => {
  if (isSubmittingCabut.value) return
  const alasan = alasanCabut.value.trim()
  if (!alasan) {
    alasanCabutError.value = 'Alasan pencabutan wajib diisi.'
    return
  }
  alasanCabutError.value = ''
  isSubmittingCabut.value = true
  try {
    const idPilih = cabutMode.value === 'bulk'
      ? [...selectedFilteredIds.value]
      : [cabutTargetRow.value.id_peserta]
    await ubahStatusSertifikatPeserta(idBatch, {
      id_pilih: idPilih,
      status: 'dicabut',
      alasan_cabut: alasan
    })
    showCabutModal.value = false
    cabutTargetRow.value = null
    showToast(
      cabutMode.value === 'bulk'
        ? `Sertifikat ${idPilih.length} peserta berhasil dicabut.`
        : `Sertifikat ${cabutTargetRow.value?.nama_lengkap || 'peserta'} berhasil dicabut.`,
      'success'
    )
    await loadPeserta()
  } catch (error) {
    showToast(errorMessageOf(error), 'error')
  } finally {
    isSubmittingCabut.value = false
  }
}

// ===== Aksi massal =====
const openBulkModal = () => {
  if (selectedCount.value === 0) return
  showBulkModal.value = true
}

const bulkDraft = async () => {
  showBulkModal.value = false
  const idPilih = [...selectedFilteredIds.value]
  if (idPilih.length === 0) return
  try {
    await ubahStatusSertifikatPeserta(idBatch, { id_pilih: idPilih, status: 'draft' })
    showToast(`Sertifikat ${idPilih.length} peserta diubah menjadi draft.`, 'success')
    await loadPeserta()
  } catch (error) {
    showToast(errorMessageOf(error), 'error')
  }
}

const bulkCabut = () => {
  showBulkModal.value = false
  openCabutModalBulk()
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const progressPercent = computed(() => {
  if (!progressTotal.value) return 100
  return Math.min(Math.round((progressCurrent.value / progressTotal.value) * 100), 100)
})

const progressHasilChip = (hasil) => {
  const map = {
    berhasil: 'bg-emerald-100 text-emerald-700',
    gagal: 'bg-red-100 text-red-700',
    'sudah terbit': 'bg-slate-100 text-slate-600',
    dilewati: 'bg-amber-100 text-amber-700'
  }
  return map[String(hasil || '').toLowerCase()] || 'bg-slate-100 text-slate-600'
}

const bulkTerbitkan = () => {
  if (!canTerbitkan.value || isBulkRunning.value) return
  showBulkModal.value = false
  runBulkTerbitkan()
}

const stopBulkTerbitkan = () => {
  progressCancelled.value = true
}

const runBulkTerbitkan = async () => {
  const targets = filteredRows.value.filter((p) =>
    selectedFilteredIds.value.some((id) => String(id) === String(p.id_peserta))
  )
  progressTotal.value = targets.length
  progressCurrent.value = 0
  progressNowName.value = ''
  progressLog.value = []
  progressHasil.value = { berhasil: 0, gagal: 0, sudahTerbit: 0 }
  progressCancelled.value = false
  isBulkRunning.value = true
  isBulkWaiting.value = false
  showProgressPopup.value = true

  for (let i = 0; i < targets.length; i++) {
    if (progressCancelled.value) {
      progressLog.value.push({ nama: targets[i].nama_lengkap || `Peserta #${targets[i].id_peserta}`, hasil: 'dilewati' })
      continue
    }
    const p = targets[i]
    progressCurrent.value = i + 1
    progressNowName.value = p.nama_lengkap || `Peserta #${p.id_peserta}`

    if (rawSertifikatStatus(p.status_sertifikat) === 'terbit') {
      progressHasil.value.sudahTerbit += 1
      progressLog.value.push({ nama: progressNowName.value, hasil: 'sudah terbit' })
      progressNowName.value = ''
      continue
    }

    try {
      await terbitkanSertifikatPeserta(idBatch, p.id_peserta)
      progressHasil.value.berhasil += 1
      progressLog.value.push({ nama: progressNowName.value, hasil: 'berhasil' })
    } catch (error) {
      progressHasil.value.gagal += 1
      progressLog.value.push({ nama: progressNowName.value, hasil: 'gagal' })
      console.error('[ProsesSertifikat] Gagal menerbitkan', p.id_peserta, error)
    }
    progressNowName.value = ''

    // Jeda 3-5 detik antar peserta (bukan setelah peserta terakhir).
    if (i < targets.length - 1 && !progressCancelled.value) {
      isBulkWaiting.value = true
      await sleep(3000 + Math.floor(Math.random() * 2001))
      isBulkWaiting.value = false
    }
  }

  isBulkRunning.value = false
  progressNowName.value = ''
  isBulkWaiting.value = false

  const h = progressHasil.value
  showToast(
    `Penerbitan selesai: ${h.berhasil} berhasil, ${h.gagal} gagal, ${h.sudahTerbit} sudah terbit.`,
    h.gagal > 0 ? 'info' : 'success'
  )
  await loadPeserta()
}

const goBack = () => {
  router.push({ name: 'proses-sertifikat' })
}

onMounted(reloadAll)
</script>
