<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3 sm:p-4 md:p-6">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl md:text-4xl">Manajemen Penugasan</h1>
          <p class="max-w-3xl text-sm text-slate-600">
            Kelola relasi kegiatan dan pegawai yang ditugaskan. Data dikelompokkan per kegiatan, lalu anggota dikelola
            langsung melalui daftar penugasan pegawai.
          </p>
        </div>
        <button
          @click="openCreateModal()"
          class="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
        >
          + Pilih Kegiatan
        </button>
      </div>

      <div v-if="isLoadingPage" class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-center gap-3 text-sm text-slate-600">
          <div class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
          <span>Memuat data penugasan...</span>
        </div>
      </div>

      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Total Penugasan</p>
          <p class="mt-2 text-3xl font-bold text-slate-800">{{ hydratedPenugasan.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Total Anggota</p>
          <p class="mt-2 text-3xl font-bold text-blue-600">{{ penugasanPegawai.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Dengan Anggota</p>
          <p class="mt-2 text-3xl font-bold text-emerald-600">{{ totalPenugasanDenganAnggota }}</p>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Tanpa Anggota</p>
          <p class="mt-2 text-3xl font-bold text-amber-600">{{ totalPenugasanTanpaAnggota }}</p>
        </div>
      </div>

      <div class="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Cari penugasan</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari ID kegiatan, kegiatan, pegawai, atau peran..."
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Filter kegiatan</label>
            <select
              v-model="filterKegiatan"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Semua kegiatan</option>
              <option v-for="item in kegiatan" :key="item.id_kegiatan" :value="String(item.id_kegiatan)">
                {{ item.nama_kegiatan }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Filter anggota</label>
            <select
              v-model="filterAnggota"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Semua kondisi</option>
              <option value="with-members">Sudah punya anggota</option>
              <option value="without-members">Belum punya anggota</option>
            </select>
          </div>
        </div>
      </div>

      <div class="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">ID Kegiatan</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Kegiatan</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Unit Kerja</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Tanggal</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-600">Ringkasan Peran</th>
                <th class="px-4 py-3 text-center font-semibold text-slate-600">Anggota</th>
                <th class="px-4 py-3 text-center font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in filteredPenugasan" :key="item.id_kegiatan || item.id_penugasan" class="hover:bg-slate-50">
                <td class="px-4 py-4 font-semibold text-slate-800">#{{ item.id_kegiatan || item.id_penugasan }}</td>
                <td class="px-4 py-4">
                  <p class="font-medium text-slate-800">{{ getNamaKegiatan(item) }}</p>
                  <p class="mt-1 text-xs text-slate-500">ID kegiatan: {{ item.id_kegiatan || '-' }}</p>
                </td>
                <td class="px-4 py-4 text-slate-600">{{ getNamaUnitKerja(item) }}</td>
                <td class="px-4 py-4 text-slate-600">{{ getTanggalKegiatan(item) }}</td>
                <td class="px-4 py-4">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="role in getRoleSummary(item)"
                      :key="`${item.id_kegiatan || item.id_penugasan}-${role}`"
                      :class="getPeranBadgeClass(role)"
                      class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                    >
                      {{ getPeranLabel(role) }}
                    </span>
                    <span v-if="getRoleSummary(item).length === 0" class="text-xs text-slate-500">Belum ada anggota</span>
                  </div>
                </td>
                <td class="px-4 py-4 text-center">
                  <span class="inline-flex min-w-10 justify-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {{ getAnggotaCount(item) }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="viewDetail(item.id_kegiatan)"
                      class="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Detail
                    </button>
                    <button
                      v-if="canManagePenugasan(item)"
                      @click="editPenugasanRecord(item.id_kegiatan)"
                      class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Kelola
                    </button>
                    <button
                      v-if="canManagePenugasan(item)"
                      @click="deletePenugasanRecord(item.id_kegiatan)"
                      class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!isLoadingPage && filteredPenugasan.length === 0">
                <td colspan="7" class="px-4 py-10 text-center text-slate-500">
                  Tidak ada data penugasan yang cocok dengan filter saat ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-3 lg:hidden">
        <div
          v-for="item in filteredPenugasan"
          :key="`mobile-${item.id_kegiatan || item.id_penugasan}`"
          class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Kegiatan #{{ item.id_kegiatan || item.id_penugasan }}</p>
              <h2 class="mt-1 text-base font-semibold text-slate-800">{{ getNamaKegiatan(item) }}</h2>
            </div>
            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {{ getAnggotaCount(item) }} anggota
            </span>
          </div>
          <div class="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Unit kerja</p>
              <p class="mt-1">{{ getNamaUnitKerja(item) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tanggal</p>
              <p class="mt-1">{{ getTanggalKegiatan(item) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Peran</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="role in getRoleSummary(item)"
                  :key="`mobile-${item.id_kegiatan || item.id_penugasan}-${role}`"
                  :class="getPeranBadgeClass(role)"
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                >
                  {{ getPeranLabel(role) }}
                </span>
                <span v-if="getRoleSummary(item).length === 0" class="text-xs text-slate-500">Belum ada anggota</span>
              </div>
            </div>
          </div>
          <div :class="canManagePenugasan(item) ? 'mt-4 grid grid-cols-3 gap-2' : 'mt-4 grid grid-cols-1 gap-2'">
            <button
              @click="viewDetail(item.id_kegiatan)"
              class="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Detail
            </button>
            <button
              v-if="canManagePenugasan(item)"
              @click="editPenugasanRecord(item.id_kegiatan)"
              class="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
            >
              Kelola
            </button>
            <button
              v-if="canManagePenugasan(item)"
              @click="deletePenugasanRecord(item.id_kegiatan)"
              class="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
        <div v-if="!isLoadingPage && filteredPenugasan.length === 0" class="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          Tidak ada data penugasan yang cocok dengan filter saat ini.
        </div>
      </div>
    </div>

    <div v-if="showPenugasanModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div class="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-6">
          <div>
            <h3 class="text-xl font-bold text-slate-800">{{ editingPenugasanId ? 'Kelola Kegiatan' : 'Pilih Kegiatan' }}</h3>
            <p class="mt-1 text-sm text-slate-500">Record penugasan akan terbentuk otomatis saat pegawai pertama ditambahkan ke kegiatan.</p>
          </div>
          <button @click="closePenugasanModal()" class="text-slate-400 transition hover:text-slate-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePenugasan" class="p-6">
          <div v-if="penugasanFormErrors.length" class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <ul class="space-y-1 text-sm text-red-700">
              <li v-for="(error, index) in penugasanFormErrors" :key="`penugasan-error-${index}`">{{ error }}</li>
            </ul>
          </div>

          <div class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Kegiatan *</label>
              <select
                v-model="formPenugasan.id_kegiatan"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Pilih kegiatan yang akan dikelola</option>
                <option v-for="item in manageableKegiatanOptions" :key="item.id_kegiatan" :value="String(item.id_kegiatan)">
                  {{ item.nama_kegiatan }}
                </option>
              </select>
              <p class="mt-2 text-xs text-slate-500">
                Setelah kegiatan dipilih, Anda bisa langsung menambahkan pegawai melalui endpoint `penugasan-pegawai`.
              </p>
              <p v-if="manageableKegiatanOptions.length === 0" class="mt-2 text-xs text-amber-600">
                Tidak ada kegiatan pada unit kerja Anda yang bisa dikelola dari halaman ini.
              </p>
            </div>

            <div v-if="selectedFormKegiatan" class="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">Preview kegiatan</p>
              <h4 class="mt-2 text-lg font-semibold text-slate-800">{{ selectedFormKegiatan.nama_kegiatan }}</h4>
              <div class="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Unit kerja</p>
                  <p class="mt-1">{{ getNamaUnitKerjaFromKegiatan(selectedFormKegiatan) }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tanggal</p>
                  <p class="mt-1">{{ formatDateRange(selectedFormKegiatan.tanggal_mulai, selectedFormKegiatan.tanggal_selesai) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              :disabled="isSavingPenugasan"
              class="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isSavingPenugasan ? 'Memproses...' : 'Buka Detail Kegiatan' }}
            </button>
            <button
              type="button"
              @click="closePenugasanModal()"
              class="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div class="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-6">
          <div>
            <h3 class="text-xl font-bold text-slate-800">Detail Penugasan</h3>
            <p class="mt-1 text-sm text-slate-500">Kelola pegawai yang ditugaskan pada kegiatan ini.</p>
          </div>
          <button @click="closeDetailModal()" class="text-slate-400 transition hover:text-slate-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="isLoadingDetail" class="p-6">
          <div class="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
            <span>Memuat detail penugasan...</span>
          </div>
        </div>

        <div v-else class="p-6">
          <div v-if="selectedPenugasan" class="space-y-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">ID Kegiatan</p>
                <p class="mt-2 text-2xl font-bold text-slate-800">#{{ selectedPenugasan.id_kegiatan || selectedPenugasan.id_penugasan }}</p>
              </div>
              <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Kegiatan</p>
                <p class="mt-2 text-base font-semibold text-slate-800">{{ getNamaKegiatan(selectedPenugasan) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Unit Kerja</p>
                <p class="mt-2 text-base font-semibold text-slate-800">{{ getNamaUnitKerja(selectedPenugasan) }}</p>
              </div>
              <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Anggota</p>
                <p class="mt-2 text-2xl font-bold text-blue-600">{{ selectedPenugasanMembers.length }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rentang kegiatan</p>
                <p class="mt-2 text-sm text-slate-700">{{ getTanggalKegiatan(selectedPenugasan) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Waktu sinkron</p>
                <p class="mt-2 text-sm text-slate-700">
                  Dibuat: {{ formatDate(selectedPenugasan.created_at) }} | Diubah: {{ formatDate(selectedPenugasan.updated_at) }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr,1fr]">
              <div class="rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div class="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h4 class="text-lg font-semibold text-slate-800">Anggota Penugasan</h4>
                    <p v-if="canManageSelectedPenugasan" class="mt-1 text-sm text-slate-500">Peran dapat diperbarui langsung melalui endpoint `penugasan-pegawai`.</p>
                    <p v-else class="mt-1 text-sm text-amber-600">Anggota dari kegiatan lintas unit hanya dapat dilihat. Perubahan anggota dikelola oleh unit kerja pemilik kegiatan.</p>
                  </div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="bg-slate-50">
                      <tr>
                        <th class="px-4 py-3 text-left font-semibold text-slate-600">Pegawai</th>
                        <th class="px-4 py-3 text-left font-semibold text-slate-600">NIP</th>
                        <th class="px-4 py-3 text-left font-semibold text-slate-600">Peran</th>
                        <th class="px-4 py-3 text-center font-semibold text-slate-600">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="anggota in selectedPenugasanMembers" :key="anggota.id" class="hover:bg-slate-50">
                        <td class="px-4 py-4">
                          <p class="font-medium text-slate-800">{{ getNamaPegawai(anggota.id_pegawai, anggota) }}</p>
                          <p class="mt-1 text-xs text-slate-500">ID pegawai: {{ anggota.id_pegawai || '-' }}</p>
                        </td>
                        <td class="px-4 py-4 text-slate-600">{{ getNipPegawai(anggota.id_pegawai, anggota) }}</td>
                        <td class="px-4 py-4">
                          <select
                            v-if="canManageSelectedPenugasan"
                            v-model="editablePeranById[anggota.id]"
                            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          >
                            <option v-for="role in roleOptions" :key="`role-${anggota.id}-${role.value}`" :value="role.value">
                              {{ role.label }}
                            </option>
                          </select>
                          <span v-else class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {{ getPeranLabel(anggota.peran) }}
                          </span>
                        </td>
                        <td class="px-4 py-4">
                          <div v-if="canManageSelectedPenugasan" class="flex flex-wrap items-center justify-center gap-2">
                            <button
                              @click="updateAnggotaPeran(anggota.id)"
                              :disabled="isUpdatingAnggotaId === anggota.id || editablePeranById[anggota.id] === anggota.peran"
                              class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {{ isUpdatingAnggotaId === anggota.id ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                            <button
                              @click="removeAnggota(anggota.id)"
                              class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              Hapus
                            </button>
                          </div>
                          <span v-else class="text-xs text-slate-400">Read only</span>
                        </td>
                      </tr>
                      <tr v-if="selectedPenugasanMembers.length === 0">
                        <td colspan="4" class="px-4 py-10 text-center text-slate-500">
                          Belum ada pegawai yang ditambahkan ke kegiatan ini.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-if="canManageSelectedPenugasan" class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h4 class="text-lg font-semibold text-slate-800">Tambah Anggota</h4>
                <p class="mt-1 text-sm text-slate-500">Tambahkan pegawai satu per satu ke kegiatan ini.</p>

                <div v-if="anggotaFormErrors.length" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <ul class="space-y-1 text-sm text-red-700">
                    <li v-for="(error, index) in anggotaFormErrors" :key="`anggota-error-${index}`">{{ error }}</li>
                  </ul>
                </div>

                <form @submit.prevent="addAnggota" class="mt-5 space-y-4">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700">Pegawai *</label>
                    <select
                      v-model="formAnggota.id_pegawai"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Pilih pegawai</option>
                      <option v-for="item in availablePegawaiOptions" :key="item.id_pegawai" :value="String(item.id_pegawai)">
                        {{ item.nama }}{{ item.nip ? ` (${item.nip})` : '' }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700">Peran *</label>
                    <select
                      v-model="formAnggota.peran"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option v-for="role in roleOptions" :key="`new-role-${role.value}`" :value="role.value">
                        {{ role.label }}
                      </option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    :disabled="isSavingAnggota"
                    class="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {{ isSavingAnggota ? 'Menambahkan...' : 'Tambah Anggota' }}
                  </button>
                </form>
              </div>
            </div>

            <div class="flex gap-3 border-t border-slate-100 pt-5">
              <button
                @click="closeDetailModal()"
                class="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Tutup
              </button>
              <button
                v-if="canManageSelectedPenugasan"
                @click="editPenugasanRecord(selectedPenugasan.id_kegiatan)"
                class="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Pilih Kegiatan Lain
              </button>
            </div>
          </div>

          <div v-else class="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Detail penugasan tidak tersedia.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import database from '@/data/index.js'
import { useAuthStore } from '@/stores/auth'
import { fetchAPI } from '@/services/api'
import { listKegiatan, getKegiatanTim } from '@/services/kegiatan'
import {
  groupPenugasanByKegiatan,
  listPenugasanPegawai,
  removePenugasan,
  createPenugasanPegawai,
  editPenugasanPegawai,
  removePenugasanPegawai
} from '@/services/penugasan'

const roleOptions = [
  { value: 'penanggung_jawab', label: 'Penanggung Jawab' },
  { value: 'ketua_panitia', label: 'Ketua Panitia' },
  { value: 'panitia', label: 'Panitia' },
  { value: 'peserta', label: 'Peserta' },
  { value: 'narasumber', label: 'Narasumber' }
]

const roleLabelMap = Object.fromEntries(roleOptions.map((item) => [item.value, item.label]))

export default {
  name: 'PenugasanManagement',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const kegiatan = ref(Array.isArray(database.kegiatan) ? database.kegiatan : [])
    const pegawai = ref(Array.isArray(database.pegawai) ? database.pegawai : [])
    const unitKerja = ref(Array.isArray(database.unit_kerja) ? database.unit_kerja : [])
    const penugasan = ref([])
    const penugasanPegawai = ref([])

    const searchQuery = ref('')
    const filterKegiatan = ref('')
    const filterAnggota = ref('')

    const isLoadingPage = ref(false)
    const isLoadingDetail = ref(false)
    const isSavingPenugasan = ref(false)
    const isSavingAnggota = ref(false)
    const isUpdatingAnggotaId = ref(null)

    const showPenugasanModal = ref(false)
    const showDetailModal = ref(false)
    const editingPenugasanId = ref(null)
    const selectedPenugasanId = ref(null)
    const selectedPenugasan = ref(null)

    const penugasanFormErrors = ref([])
    const anggotaFormErrors = ref([])
    const editablePeranById = ref({})

    const formPenugasan = ref({
      id_kegiatan: ''
    })

    const formAnggota = ref({
      id_pegawai: '',
      peran: 'panitia'
    })

    const normalizeArrayResponse = (value) => {
      if (Array.isArray(value)) return value
      if (Array.isArray(value?.data)) return value.data
      return []
    }

    const parsePossibleNumber = (value) => {
      if (value === null || value === undefined || value === '') return value
      return Number.isNaN(Number(value)) ? value : Number(value)
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      if (Number.isNaN(date.getTime())) return '-'
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

    const formatDateRange = (start, end) => {
      if (!start && !end) return '-'
      if (start && end) {
        return `${formatDate(start)} s.d. ${formatDate(end)}`
      }
      return formatDate(start || end)
    }

    const getPeranLabel = (value) => roleLabelMap[value] || value || '-'

    const getPeranBadgeClass = (value) => {
      if (value === 'penanggung_jawab') return 'bg-purple-100 text-purple-800'
      if (value === 'ketua_panitia') return 'bg-blue-100 text-blue-800'
      if (value === 'panitia') return 'bg-emerald-100 text-emerald-800'
      if (value === 'narasumber') return 'bg-amber-100 text-amber-800'
      if (value === 'peserta') return 'bg-slate-100 text-slate-700'
      return 'bg-slate-100 text-slate-700'
    }

    const kegiatanMap = computed(() => {
      const map = new Map()
      kegiatan.value.forEach((item) => {
        if (item?.id_kegiatan === null || item?.id_kegiatan === undefined) return
        map.set(String(item.id_kegiatan), item)
      })
      return map
    })

    const pegawaiMap = computed(() => {
      const map = new Map()
      pegawai.value.forEach((item) => {
        if (item?.id_pegawai === null || item?.id_pegawai === undefined) return
        map.set(String(item.id_pegawai), item)
      })
      return map
    })

    const unitKerjaMap = computed(() => {
      const map = new Map()
      unitKerja.value.forEach((item) => {
        const key = item?.unit_kerja_id ?? item?.id
        if (key === null || key === undefined) return
        map.set(String(key), item)
      })
      return map
    })

    const normalizeUnitKerjaId = (value) => {
      if (value === null || value === undefined) return ''
      const normalized = String(value).trim()
      if (!normalized) return ''
      if (/^\d+$/.test(normalized)) return String(Number(normalized))
      return normalized.toLowerCase()
    }

    const resolveKegiatanUnitKerjaId = (item) => (
      item?.unit_kerja_id
      ?? item?.unit_kerja?.unit_kerja_id
      ?? item?.unit_kerja?.id
      ?? item?.id_tim
      ?? null
    )

    const userAllowedUnitKerjaSet = computed(() => {
      const idsFromAuthStore = Array.isArray(authStore.unit_kerja_id) ? authStore.unit_kerja_id : [authStore.unit_kerja_id]
      const idsFromUnitList = Array.isArray(authStore.unit_kerja)
        ? authStore.unit_kerja.map((item) => item?.unit_kerja_id ?? item?.id)
        : []
      const idsFromCurrentUser = Array.isArray(authStore.currentUser?.unit_kerja_id)
        ? authStore.currentUser.unit_kerja_id
        : [authStore.currentUser?.unit_kerja_id]

      return new Set(
        [...idsFromAuthStore, ...idsFromUnitList, ...idsFromCurrentUser]
          .map((item) => normalizeUnitKerjaId(item))
          .filter(Boolean)
      )
    })

    const canManagePenugasan = (item) => {
      const kegiatanItem = item?.kegiatan || item
      const unitId = normalizeUnitKerjaId(resolveKegiatanUnitKerjaId(kegiatanItem))
      return unitId !== '' && userAllowedUnitKerjaSet.value.has(unitId)
    }

    const hydratedPenugasan = computed(() => {
      const merged = new Map()

      const hydrateItem = (item) => {
        const idKegiatan = item.id_kegiatan ?? item.id_penugasan ?? item.id_surat_tugas ?? item.id ?? null
        const anggotaFromList = penugasanPegawai.value
          .filter((anggota) => String(anggota.id_kegiatan ?? anggota.id_penugasan ?? anggota.id_surat_tugas ?? '') === String(idKegiatan ?? ''))
          .map((anggota) => ({
            ...anggota,
            pegawai: anggota.pegawai || pegawaiMap.value.get(String(anggota.id_pegawai ?? '')) || null
          }))

        const anggotaNested = Array.isArray(item.penugasan_pegawais)
          ? item.penugasan_pegawais.map((anggota) => ({
              ...anggota,
              pegawai: anggota.pegawai || pegawaiMap.value.get(String(anggota.id_pegawai ?? '')) || null
            }))
          : []

        return {
          ...item,
          id_kegiatan: idKegiatan,
          id_penugasan: item.id_penugasan ?? idKegiatan,
          id_surat_tugas: item.id_surat_tugas ?? idKegiatan,
          kegiatan: item.kegiatan || kegiatanMap.value.get(String(idKegiatan ?? '')) || null,
          penugasan_pegawais: anggotaNested.length > 0 ? anggotaNested : anggotaFromList
        }
      }

      penugasan.value.forEach((item) => {
        const hydratedItem = hydrateItem(item)
        if (hydratedItem.id_kegiatan === null || hydratedItem.id_kegiatan === undefined || hydratedItem.id_kegiatan === '') return
        merged.set(String(hydratedItem.id_kegiatan), hydratedItem)
      })

      kegiatan.value.forEach((item) => {
        if (item?.id_kegiatan === null || item?.id_kegiatan === undefined || item?.id_kegiatan === '') return

        const key = String(item.id_kegiatan)
        if (merged.has(key)) {
          const current = merged.get(key)
          merged.set(key, {
            ...current,
            kegiatan: current?.kegiatan || item
          })
          return
        }

        merged.set(key, hydrateItem(buildDraftPenugasan(item.id_kegiatan)))
      })

      return Array.from(merged.values()).sort((left, right) => {
        const leftTime = new Date(left?.updated_at || left?.created_at || left?.kegiatan?.tanggal_mulai || 0).getTime()
        const rightTime = new Date(right?.updated_at || right?.created_at || right?.kegiatan?.tanggal_mulai || 0).getTime()
        return rightTime - leftTime
      })
    })

    const filteredPenugasan = computed(() => {
      const keyword = searchQuery.value.trim().toLowerCase()

      return hydratedPenugasan.value.filter((item) => {
        const members = Array.isArray(item.penugasan_pegawais) ? item.penugasan_pegawais : []
        const searchableText = [
          item.id_penugasan,
          item.id_kegiatan,
          getNamaKegiatan(item),
          getNamaUnitKerja(item),
          ...members.map((anggota) => getNamaPegawai(anggota.id_pegawai, anggota)),
          ...members.map((anggota) => getPeranLabel(anggota.peran))
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const matchesSearch = !keyword || searchableText.includes(keyword)
        const matchesKegiatan = !filterKegiatan.value || String(item.id_kegiatan ?? '') === String(filterKegiatan.value)
        const anggotaCount = members.length
        const matchesAnggota =
          !filterAnggota.value ||
          (filterAnggota.value === 'with-members' && anggotaCount > 0) ||
          (filterAnggota.value === 'without-members' && anggotaCount === 0)

        return matchesSearch && matchesKegiatan && matchesAnggota
      })
    })

    const totalPenugasanDenganAnggota = computed(() => hydratedPenugasan.value.filter((item) => getAnggotaCount(item) > 0).length)
    const totalPenugasanTanpaAnggota = computed(() => hydratedPenugasan.value.filter((item) => getAnggotaCount(item) === 0).length)
    const manageableKegiatanOptions = computed(() => kegiatan.value.filter((item) => canManagePenugasan(item)))

    const selectedPenugasanMembers = computed(() => {
      if (!selectedPenugasan.value) return []
      return Array.isArray(selectedPenugasan.value.penugasan_pegawais) ? selectedPenugasan.value.penugasan_pegawais : []
    })

    const canManageSelectedPenugasan = computed(() => canManagePenugasan(selectedPenugasan.value))

    const availablePegawaiOptions = computed(() => {
      const assigned = new Set(selectedPenugasanMembers.value.map((item) => String(item.id_pegawai ?? '')))
      return pegawai.value.filter((item) => !assigned.has(String(item.id_pegawai ?? '')))
    })

    const selectedFormKegiatan = computed(() => {
      if (!formPenugasan.value.id_kegiatan) return null
      return kegiatanMap.value.get(String(formPenugasan.value.id_kegiatan)) || null
    })

    const getNamaKegiatan = (item) => {
      if (!item) return '-'
      return item.kegiatan?.nama_kegiatan || kegiatanMap.value.get(String(item.id_kegiatan ?? ''))?.nama_kegiatan || '-'
    }

    const getNamaUnitKerjaFromKegiatan = (kegiatanItem) => {
      const unitId = kegiatanItem?.unit_kerja_id ?? kegiatanItem?.unit_kerja?.unit_kerja_id ?? kegiatanItem?.unit_kerja?.id ?? null
      if (unitId === null || unitId === undefined || unitId === '') return '-'
      const unit = unitKerjaMap.value.get(String(unitId))
      return unit?.nama_unit || unit?.nama || kegiatanItem?.unit_kerja?.nama_unit || kegiatanItem?.unit_kerja?.nama || String(unitId)
    }

    const getNamaUnitKerja = (item) => getNamaUnitKerjaFromKegiatan(item?.kegiatan || kegiatanMap.value.get(String(item?.id_kegiatan ?? '')))

    const getTanggalKegiatan = (item) => {
      const kegiatanItem = item?.kegiatan || kegiatanMap.value.get(String(item?.id_kegiatan ?? ''))
      return formatDateRange(kegiatanItem?.tanggal_mulai, kegiatanItem?.tanggal_selesai)
    }

    const getAnggotaCount = (item) => (Array.isArray(item?.penugasan_pegawais) ? item.penugasan_pegawais.length : 0)

    const getRoleSummary = (item) => {
      const uniqueRoles = new Set()
      ;(Array.isArray(item?.penugasan_pegawais) ? item.penugasan_pegawais : []).forEach((anggota) => {
        if (anggota?.peran) uniqueRoles.add(anggota.peran)
      })
      return Array.from(uniqueRoles).slice(0, 4)
    }

    const getNamaPegawai = (idPegawai, anggota = null) => {
      return anggota?.pegawai?.nama || pegawaiMap.value.get(String(idPegawai ?? ''))?.nama || '-'
    }

    const getNipPegawai = (idPegawai, anggota = null) => {
      return anggota?.pegawai?.nip || pegawaiMap.value.get(String(idPegawai ?? ''))?.nip || '-'
    }

    const resetPenugasanForm = () => {
      formPenugasan.value = {
        id_kegiatan: ''
      }
      editingPenugasanId.value = null
      penugasanFormErrors.value = []
    }

    const resetAnggotaForm = () => {
      formAnggota.value = {
        id_pegawai: '',
        peran: 'panitia'
      }
      anggotaFormErrors.value = []
    }

    const closePenugasanModal = () => {
      showPenugasanModal.value = false
      resetPenugasanForm()
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedPenugasanId.value = null
      selectedPenugasan.value = null
      editablePeranById.value = {}
      resetAnggotaForm()
    }

    const buildDraftPenugasan = (idKegiatan) => ({
      id_penugasan: idKegiatan,
      id_surat_tugas: idKegiatan,
      id_kegiatan: idKegiatan,
      kegiatan: kegiatanMap.value.get(String(idKegiatan)) || null,
      penugasan_pegawais: [],
      created_at: null,
      updated_at: null
    })

    const fillEditablePeran = (penugasanItem) => {
      editablePeranById.value = Object.fromEntries(
        (Array.isArray(penugasanItem?.penugasan_pegawais) ? penugasanItem.penugasan_pegawais : []).map((item) => [item.id, item.peran])
      )
    }

    const applySelectedPenugasan = (item) => {
      selectedPenugasan.value = item ? { ...item } : null
      fillEditablePeran(item)
    }

    const syncSelectedPenugasanFromList = () => {
      if (!selectedPenugasanId.value) return
      const match = hydratedPenugasan.value.find((item) => String(item.id_kegiatan ?? item.id_penugasan ?? '') === String(selectedPenugasanId.value))
      if (match) {
        applySelectedPenugasan(match)
        return
      }

      applySelectedPenugasan(buildDraftPenugasan(selectedPenugasanId.value))
    }

    const validatePenugasanForm = () => {
      penugasanFormErrors.value = []

      if (!formPenugasan.value.id_kegiatan) {
        penugasanFormErrors.value.push('Kegiatan wajib dipilih.')
      }

      if (formPenugasan.value.id_kegiatan && !selectedFormKegiatan.value) {
        penugasanFormErrors.value.push('Kegiatan yang dipilih tidak ditemukan.')
      }

      if (selectedFormKegiatan.value && !canManagePenugasan(selectedFormKegiatan.value)) {
        penugasanFormErrors.value.push('Anda hanya dapat memilih kegiatan dari unit kerja Anda.')
      }

      return penugasanFormErrors.value.length === 0
    }

    const validateAnggotaForm = () => {
      anggotaFormErrors.value = []

      if (!formAnggota.value.id_pegawai) {
        anggotaFormErrors.value.push('Pegawai wajib dipilih.')
      }

      if (!formAnggota.value.peran) {
        anggotaFormErrors.value.push('Peran wajib dipilih.')
      }

      const duplicate = selectedPenugasanMembers.value.some(
        (item) => String(item.id_pegawai ?? '') === String(formAnggota.value.id_pegawai ?? '')
      )

      if (duplicate) {
        anggotaFormErrors.value.push('Pegawai ini sudah ditambahkan pada kegiatan ini.')
      }

      return anggotaFormErrors.value.length === 0
    }

    const loadPegawaiData = async () => {
      const data = await fetchAPI('pegawai')
      const rows = normalizeArrayResponse(data)
      pegawai.value = rows.length > 0 ? rows : (Array.isArray(database.pegawai) ? database.pegawai : [])
    }

    const loadUnitKerjaData = async () => {
      const data = await fetchAPI('unit-kerja')
      const rows = normalizeArrayResponse(data)
      unitKerja.value = rows.length > 0 ? rows : (Array.isArray(database.unit_kerja) ? database.unit_kerja : [])
    }

    const loadKegiatanData = async () => {
      authStore.restoreAuth()
      await authStore.fetchMe().catch(() => {})

      const unitIds = Array.isArray(authStore.unit_kerja_id)
        ? authStore.unit_kerja_id.filter((item) => item !== null && item !== undefined && item !== '')
        : []

      const responses = await Promise.allSettled([
        listKegiatan(),
        ...unitIds.map((id) => getKegiatanTim(id))
      ])

      const merged = new Map()

      responses.forEach((result) => {
        if (result.status !== 'fulfilled') return
        normalizeArrayResponse(result.value).forEach((item) => {
          if (item?.id_kegiatan === null || item?.id_kegiatan === undefined) return
          merged.set(String(item.id_kegiatan), item)
        })
      })

      if (merged.size === 0) {
        ;(Array.isArray(database.kegiatan) ? database.kegiatan : []).forEach((item) => {
          if (item?.id_kegiatan === null || item?.id_kegiatan === undefined) return
          merged.set(String(item.id_kegiatan), item)
        })
      }

      kegiatan.value = Array.from(merged.values()).sort((a, b) => {
        const left = new Date(b?.tanggal_mulai || 0).getTime()
        const right = new Date(a?.tanggal_mulai || 0).getTime()
        return left - right
      })
    }

    const loadPenugasanData = async () => {
      const anggotaRows = await listPenugasanPegawai()
      penugasan.value = groupPenugasanByKegiatan(anggotaRows)
      penugasanPegawai.value = anggotaRows
      syncSelectedPenugasanFromList()
    }

    const loadAllData = async () => {
      isLoadingPage.value = true
      try {
        await Promise.all([
          loadPegawaiData(),
          loadUnitKerjaData(),
          loadKegiatanData(),
          loadPenugasanData()
        ])
        await applyRouteIntent()
      } catch (error) {
        console.error('Gagal memuat data penugasan:', error)
        alert(error?.message || 'Gagal memuat data penugasan')
      } finally {
        isLoadingPage.value = false
      }
    }

    const clearHandledQuery = async () => {
      const nextQuery = { ...route.query }
      delete nextQuery.create
      delete nextQuery.edit
      delete nextQuery.id
      delete nextQuery.id_kegiatan
      await router.replace({ query: nextQuery })
    }

    const openCreateModal = (prefillKegiatanId = '') => {
      resetPenugasanForm()
      if (prefillKegiatanId) {
        const kegiatanItem = kegiatanMap.value.get(String(prefillKegiatanId))
        if (kegiatanItem && canManagePenugasan(kegiatanItem)) {
          formPenugasan.value.id_kegiatan = String(prefillKegiatanId)
        }
      }
      showPenugasanModal.value = true
    }

    const applyRouteIntent = async () => {
      const kegiatanId = route.query.id_kegiatan
      const penugasanId = route.query.id

      if (route.query.edit === 'true' && penugasanId) {
        editPenugasanRecord(penugasanId)
        await clearHandledQuery()
        return
      }

      if ((route.query.create === 'true' || kegiatanId) && kegiatanId) {
        openCreateModal(kegiatanId)
        await clearHandledQuery()
      }
    }

    const editPenugasanRecord = (id) => {
      const match = hydratedPenugasan.value.find((item) => String(item.id_kegiatan ?? item.id_penugasan ?? '') === String(id))
      if (!match || !canManagePenugasan(match)) return

      formPenugasan.value = {
        id_kegiatan: String(match.id_kegiatan ?? '')
      }
      editingPenugasanId.value = match.id_kegiatan
      penugasanFormErrors.value = []
      showPenugasanModal.value = true
    }

    const savePenugasan = async () => {
      if (!validatePenugasanForm()) return

      isSavingPenugasan.value = true
      try {
        const targetKegiatanId = parsePossibleNumber(formPenugasan.value.id_kegiatan)
        closePenugasanModal()
        await viewDetail(targetKegiatanId)
      } catch (error) {
        console.error('Gagal menyimpan penugasan:', error)
        penugasanFormErrors.value = [error?.message || 'Gagal menyimpan penugasan.']
      } finally {
        isSavingPenugasan.value = false
      }
    }

    const deletePenugasanRecord = async (id) => {
      const target = hydratedPenugasan.value.find((item) => String(item.id_kegiatan ?? item.id_penugasan ?? '') === String(id))
      if (target && !canManagePenugasan(target)) return

      const confirmed = confirm('Apakah Anda yakin ingin menghapus penugasan ini? Semua penugasan pegawai terkait juga akan ikut terhapus.')
      if (!confirmed) return

      try {
        await removePenugasan(id)
        await loadPenugasanData()

        if (String(selectedPenugasanId.value ?? '') === String(id ?? '')) {
          closeDetailModal()
        }
      } catch (error) {
        console.error('Gagal menghapus penugasan:', error)
        alert(error?.message || 'Gagal menghapus penugasan')
      }
    }

    const refreshSelectedPenugasan = async () => {
      if (!selectedPenugasanId.value) return

      isLoadingDetail.value = true
      try {
        await loadPenugasanData()
      } catch (error) {
        console.error('Gagal memuat detail penugasan:', error)
        syncSelectedPenugasanFromList()
      } finally {
        isLoadingDetail.value = false
      }
    }

    const viewDetail = async (id) => {
      selectedPenugasanId.value = parsePossibleNumber(id)
      showDetailModal.value = true
      resetAnggotaForm()
      syncSelectedPenugasanFromList()
    }

    const addAnggota = async () => {
      if (!selectedPenugasanId.value) return
      if (!canManageSelectedPenugasan.value) return
      if (!validateAnggotaForm()) return

      isSavingAnggota.value = true
      try {
        await createPenugasanPegawai({
          id_kegiatan: parsePossibleNumber(selectedPenugasanId.value),
          id_pegawai: parsePossibleNumber(formAnggota.value.id_pegawai),
          peran: formAnggota.value.peran
        })

        await loadPenugasanData()
        resetAnggotaForm()
      } catch (error) {
        console.error('Gagal menambah anggota penugasan:', error)
        anggotaFormErrors.value = [error?.message || 'Gagal menambah anggota penugasan.']
      } finally {
        isSavingAnggota.value = false
      }
    }

    const updateAnggotaPeran = async (id) => {
      if (!canManageSelectedPenugasan.value) return

      const target = selectedPenugasanMembers.value.find((item) => String(item.id ?? '') === String(id))
      const nextPeran = editablePeranById.value[id]
      if (!target || !nextPeran || nextPeran === target.peran) return

      isUpdatingAnggotaId.value = id
      try {
        await editPenugasanPegawai(id, {
          peran: nextPeran
        })

        await loadPenugasanData()
      } catch (error) {
        console.error('Gagal memperbarui peran penugasan pegawai:', error)
        alert(error?.message || 'Gagal memperbarui peran penugasan pegawai')
        editablePeranById.value[id] = target.peran
      } finally {
        isUpdatingAnggotaId.value = null
      }
    }

    const removeAnggota = async (id) => {
      if (!canManageSelectedPenugasan.value) return

      const confirmed = confirm('Apakah Anda yakin ingin menghapus pegawai ini dari penugasan?')
      if (!confirmed) return

      try {
        await removePenugasanPegawai(id)
        await loadPenugasanData()
      } catch (error) {
        console.error('Gagal menghapus anggota penugasan:', error)
        alert(error?.message || 'Gagal menghapus anggota penugasan')
      }
    }

    onMounted(() => {
      loadAllData()
    })

    watch(
      () => route.fullPath,
      async () => {
        if (route.name !== 'penugasan') return
        if (route.query.create === 'true' || route.query.edit === 'true' || route.query.id_kegiatan || route.query.id) {
          await applyRouteIntent()
        }
      }
    )

    return {
      roleOptions,
      kegiatan,
      manageableKegiatanOptions,
      penugasanPegawai,
      searchQuery,
      filterKegiatan,
      filterAnggota,
      isLoadingPage,
      isLoadingDetail,
      isSavingPenugasan,
      isSavingAnggota,
      isUpdatingAnggotaId,
      showPenugasanModal,
      showDetailModal,
      editingPenugasanId,
      selectedPenugasan,
      penugasanFormErrors,
      anggotaFormErrors,
      editablePeranById,
      formPenugasan,
      formAnggota,
      hydratedPenugasan,
      filteredPenugasan,
      totalPenugasanDenganAnggota,
      totalPenugasanTanpaAnggota,
      selectedPenugasanMembers,
      canManageSelectedPenugasan,
      availablePegawaiOptions,
      selectedFormKegiatan,
      formatDate,
      formatDateRange,
      getPeranLabel,
      getPeranBadgeClass,
      getNamaKegiatan,
      getNamaUnitKerja,
      getNamaUnitKerjaFromKegiatan,
      getTanggalKegiatan,
      getAnggotaCount,
      getRoleSummary,
      getNamaPegawai,
      getNipPegawai,
      canManagePenugasan,
      openCreateModal,
      closePenugasanModal,
      closeDetailModal,
      editPenugasanRecord,
      savePenugasan,
      deletePenugasanRecord,
      viewDetail,
      addAnggota,
      updateAnggotaPeran,
      removeAnggota
    }
  }
}
</script>
