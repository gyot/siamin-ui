<template>
  <div class="min-h-screen bg-[#F0F2F5]">
    <!-- Header -->
    <div class="max-w-[1200px] mx-auto px-4 pt-4 pb-2">
      <h1 class="text-[20px] font-bold text-[#050505]">Pengajuan Sertifikat</h1>
      <p class="text-[13px] text-[#65676B] mt-0.5">Meja reviewer untuk alur pengajuan penerbitan sertifikat.</p>
    </div>

    <!-- Kartu Ringkasan Status (klik = filter daftar) -->
    <div class="max-w-[1200px] mx-auto px-4 pt-2 pb-2">
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div
          v-for="card in statusCards"
          :key="card.status"
          class="flex-shrink-0 w-44 h-24 rounded-xl overflow-hidden relative cursor-pointer hover:opacity-90 transition shadow-sm"
          :class="[card.bg, filterStatus === card.status ? 'ring-4 ring-[#1877F2] ring-offset-2 ring-offset-[#F0F2F5]' : '']"
          @click="toggleFilter(card.status)"
        >
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div class="absolute bottom-2 left-3 right-3">
            <p class="text-white text-xl font-bold leading-none">{{ card.value }}</p>
            <p class="text-white/80 text-[11px] mt-0.5">{{ card.label }}</p>
          </div>
          <div class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center" :class="card.iconBg">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.icon" />
            </svg>
          </div>
        </div>
      </div>
      <div v-if="filterStatus" class="flex items-center gap-2 pt-1">
        <span class="text-[12px] text-[#65676B]">
          Menampilkan status: <strong class="text-[#050505]">{{ formatStatus(filterStatus) }}</strong>
        </span>
        <button
          class="px-2.5 py-1 rounded-full bg-[#E4E6E9] text-[12px] font-semibold text-[#050505] hover:bg-[#D8DADF] transition"
          @click="filterStatus = ''"
        >
          Tampilkan Semua
        </button>
      </div>
    </div>

    <!-- Daftar Kartu Kegiatan -->
    <div class="max-w-[1200px] mx-auto px-4 pb-8">
      <LoadingState
        :state="isLoading ? 'loading' : errorMessage ? 'error' : filteredBatches.length === 0 ? 'empty' : 'ready'"
        message="Memuat pengajuan sertifikat..."
        error-title="Gagal memuat data"
        :error-message="errorMessage"
        empty-title="Tidak ada pengajuan"
        empty-message="Belum ada pengajuan sertifikat yang sesuai dengan filter yang dipilih."
        :on-retry="fetchData"
      >
        <div class="space-y-4">
          <div
            v-for="batch in filteredBatches"
            :key="batch.id_batch"
            class="bg-white rounded-xl shadow-sm border border-[#E4E6E9] overflow-hidden"
          >
            <!-- Card Header -->
            <div class="flex items-start gap-3 p-4 pb-2">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                :class="statusAvatarBg(batch.status)"
              >
                {{ (namaKegiatan(batch) || '?').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-semibold text-[#050505] leading-tight">{{ namaKegiatan(batch) }}</p>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span class="text-[13px] text-[#65676B]">Diajukan {{ formatDate(batch.tanggal_diajukan) }}</span>
                  <span class="text-[#65676B]">·</span>
                  <span class="text-[12px] px-2 py-0.5 rounded-full font-medium" :class="statusChip(batch.status)">
                    {{ formatStatus(batch.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="px-4 pb-3">
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#65676B]">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M9 20H4v-2a3 3 0 015.856-1.487M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {{ batch.jumlah_peserta ?? 0 }} Peserta
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ batch.jumlah_terbit ?? 0 }} Terbit
                </span>
                <span v-if="batch.nomor_sertifikat && batch.status === 'terbit'" class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10v10H7z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h4m10 0h4M3 17h4m10 0h4"/></svg>
                  {{ batch.nomor_sertifikat }}
                </span>
              </div>

              <!-- Pesan Revisi -->
              <div v-if="batch.status === 'revisi' && batch.pesan_revisi" class="mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                <p class="text-[12px] font-semibold text-amber-700 uppercase tracking-wide">Pesan Revisi</p>
                <p class="text-[13px] text-amber-900 mt-0.5 whitespace-pre-line break-words">{{ batch.pesan_revisi }}</p>
              </div>

              <!-- Alasan Penolakan -->
              <div v-if="batch.status === 'ditolak' && batch.alasan_penolakan" class="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                <p class="text-[12px] font-semibold text-red-700 uppercase tracking-wide">Alasan Penolakan</p>
                <p class="text-[13px] text-red-900 mt-0.5 whitespace-pre-line break-words">{{ batch.alasan_penolakan }}</p>
              </div>
            </div>

            <!-- Card Actions: Unduh Draft (semua kartu) + aksi review (status diajukan) -->
            <div class="border-t border-[#E4E6E9] px-2 py-1 flex">
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-blue-50 transition text-[14px] font-semibold text-blue-600 disabled:opacity-50"
                :disabled="draftLoadingId === batch.id_batch"
                @click="openUnduhDraft(batch)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {{ draftLoadingId === batch.id_batch ? 'Mengunduh...' : 'Unduh Draft' }}
              </button>
              <template v-if="batch.status === 'diajukan'">
              <div class="w-px bg-[#E4E6E9] my-1"></div>
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-green-50 transition text-[14px] font-semibold text-green-600 disabled:opacity-50"
                :disabled="actionLoadingId === batch.id_batch"
                @click="confirmSetujui(batch)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Setujui
              </button>
              <div class="w-px bg-[#E4E6E9] my-1"></div>
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-amber-50 transition text-[14px] font-semibold text-amber-600 disabled:opacity-50"
                :disabled="actionLoadingId === batch.id_batch"
                @click="openRevisiModal(batch)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Revisi
              </button>
              <div class="w-px bg-[#E4E6E9] my-1"></div>
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-50 transition text-[14px] font-semibold text-red-600 disabled:opacity-50"
                :disabled="actionLoadingId === batch.id_batch"
                @click="openTolakModal(batch)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Tolak
              </button>
              </template>
            </div>
          </div>
        </div>
      </LoadingState>
    </div>

    <!-- Modal Konfirmasi Setujui -->
    <div v-if="showConfirmSetujui" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-[17px] font-bold text-[#050505]">Setujui Pengajuan?</h3>
          <p class="text-[14px] text-[#65676B] mt-2">
            Pengajuan sertifikat untuk kegiatan
            <strong class="text-[#050505]">{{ selectedBatch ? namaKegiatan(selectedBatch) : '' }}</strong>
            akan disetujui dan dilanjutkan ke proses penerbitan.
          </p>
        </div>
        <div class="flex border-t border-[#E4E6E9]">
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-[#65676B] hover:bg-[#F0F2F5] rounded-bl-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="showConfirmSetujui = false"
          >
            Batal
          </button>
          <div class="w-px bg-[#E4E6E9]"></div>
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-green-600 hover:bg-green-50 rounded-br-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="submitSetujui"
          >
            {{ isSubmitting ? 'Memproses...' : 'Ya, Setujui' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Revisi -->
    <div v-if="showRevisiModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 pb-3">
          <h3 class="text-[17px] font-bold text-[#050505]">Minta Revisi</h3>
          <button class="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B]" @click="showRevisiModal = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 pb-4">
          <p class="text-[13px] text-[#65676B] mb-2">
            Kegiatan: <strong class="text-[#050505]">{{ selectedBatch ? namaKegiatan(selectedBatch) : '' }}</strong>
          </p>
          <label class="block text-[13px] font-semibold text-[#050505] mb-1">Pesan Revisi <span class="text-red-500">*</span></label>
          <textarea
            v-model="revisiPesan"
            rows="4"
            maxlength="2000"
            placeholder="Tuliskan bagian yang perlu direvisi..."
            class="w-full px-3 py-2.5 bg-[#F0F2F5] rounded-lg border border-[#E4E6E9] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-[14px] resize-none"
          ></textarea>
          <p v-if="revisiError" class="text-[12px] text-red-600 mt-1">{{ revisiError }}</p>
        </div>
        <div class="flex border-t border-[#E4E6E9]">
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-[#65676B] hover:bg-[#F0F2F5] rounded-bl-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="showRevisiModal = false"
          >
            Batal
          </button>
          <div class="w-px bg-[#E4E6E9]"></div>
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-amber-600 hover:bg-amber-50 rounded-br-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="submitRevisi"
          >
            {{ isSubmitting ? 'Mengirim...' : 'Kirim Revisi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tolak -->
    <div v-if="showTolakModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 pb-3">
          <h3 class="text-[17px] font-bold text-[#050505]">Tolak Pengajuan</h3>
          <button class="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B]" @click="showTolakModal = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 pb-4">
          <p class="text-[13px] text-[#65676B] mb-2">
            Kegiatan: <strong class="text-[#050505]">{{ selectedBatch ? namaKegiatan(selectedBatch) : '' }}</strong>
          </p>
          <label class="block text-[13px] font-semibold text-[#050505] mb-1">Alasan Penolakan <span class="text-red-500">*</span></label>
          <textarea
            v-model="tolakAlasan"
            rows="4"
            maxlength="2000"
            placeholder="Tuliskan alasan penolakan..."
            class="w-full px-3 py-2.5 bg-[#F0F2F5] rounded-lg border border-[#E4E6E9] focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-[14px] resize-none"
          ></textarea>
          <p v-if="tolakError" class="text-[12px] text-red-600 mt-1">{{ tolakError }}</p>
        </div>
        <div class="flex border-t border-[#E4E6E9]">
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-[#65676B] hover:bg-[#F0F2F5] rounded-bl-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="showTolakModal = false"
          >
            Batal
          </button>
          <div class="w-px bg-[#E4E6E9]"></div>
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-red-600 hover:bg-red-50 rounded-br-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="submitTolak"
          >
            {{ isSubmitting ? 'Mengirim...' : 'Ya, Tolak' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Unduh Draft: Pilih Kelas -->
    <div v-if="showKelasModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 pb-3">
          <h3 class="text-[17px] font-bold text-[#050505]">Unduh Draft</h3>
          <button class="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B]" @click="closeKelasModal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 pb-4">
          <p class="text-[13px] text-[#65676B] mb-2">
            Kegiatan: <strong class="text-[#050505]">{{ draftBatch ? namaKegiatan(draftBatch) : '' }}</strong>
          </p>
          <p class="text-[13px] text-[#65676B] mb-3">Pilih kelas untuk draft PDF contoh:</p>

          <div v-if="isLoadingKelas" class="py-6 text-center text-[13px] text-[#65676B]">
            Memuat daftar kelas...
          </div>
          <div v-else-if="kelasError" class="py-4 text-center">
            <p class="text-[13px] text-red-600">{{ kelasError }}</p>
            <button
              class="mt-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
              @click="loadKelas"
            >
              Coba Lagi
            </button>
          </div>
          <div v-else class="space-y-2 max-h-[50vh] overflow-y-auto">
            <button
              class="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#E4E6E9] hover:bg-blue-50 hover:border-blue-200 transition text-left disabled:opacity-50"
              :disabled="isDownloadingDraft"
              @click="downloadDraft(null)"
            >
              <span class="text-[14px] font-semibold text-[#050505]">Semua Kelas</span>
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
            <button
              v-for="kelas in kelasOptions"
              :key="kelas.id_kelas"
              class="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#E4E6E9] hover:bg-blue-50 hover:border-blue-200 transition text-left disabled:opacity-50"
              :disabled="isDownloadingDraft"
              @click="downloadDraft(kelas)"
            >
              <span class="text-[14px] font-semibold text-[#050505]">{{ kelas.nama_kelas || 'Kelas tanpa nama' }}</span>
              <span class="flex items-center gap-2">
                <span class="text-[12px] text-[#65676B]">{{ kelas.anggotas_count ?? 0 }} peserta</span>
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </span>
            </button>
          </div>
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
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-2xl text-[14px] font-semibold text-white"
        :class="toastType === 'success' ? 'bg-green-600' : toastType === 'info' ? 'bg-blue-600' : 'bg-red-600'"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LoadingState from '@/components/LoadingState.vue'
import { usePolling } from '@/composables/usePolling'
import {
  listPengajuanSertifikat,
  setujuiPengajuanSertifikat,
  revisiPengajuanSertifikat,
  tolakPengajuanSertifikat,
  listKelasKegiatan,
  unduhDraftPdf
} from '@/services/pengajuanSertifikat'

const isLoading = ref(true)
const errorMessage = ref('')
const batches = ref([])
const ringkasan = ref({
  diajukan: 0,
  revisi: 0,
  ditolak: 0,
  disetujui: 0,
  terbit: 0
})

// Filter: '' = semua, selain itu = status kartu ringkasan yang diklik
const filterStatus = ref('')

// Modal/action state
const selectedBatch = ref(null)
const showConfirmSetujui = ref(false)
const showRevisiModal = ref(false)
const showTolakModal = ref(false)
const revisiPesan = ref('')
const tolakAlasan = ref('')
const revisiError = ref('')
const tolakError = ref('')
const isSubmitting = ref(false)
const actionLoadingId = ref(null)

// Unduh Draft state
const draftBatch = ref(null)
const showKelasModal = ref(false)
const kelasOptions = ref([])
const isLoadingKelas = ref(false)
const kelasError = ref('')
const isDownloadingDraft = ref(false)
const draftLoadingId = ref(null)

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

const statusCards = computed(() => [
  {
    status: 'diajukan',
    label: 'Diajukan',
    value: ringkasan.value.diajukan ?? 0,
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconBg: 'bg-white/25',
    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
  },
  {
    status: 'revisi',
    label: 'Revisi',
    value: ringkasan.value.revisi ?? 0,
    bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    iconBg: 'bg-white/25',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  },
  {
    status: 'ditolak',
    label: 'Ditolak',
    value: ringkasan.value.ditolak ?? 0,
    bg: 'bg-gradient-to-br from-red-500 to-red-600',
    iconBg: 'bg-white/25',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    status: 'disetujui',
    label: 'Disetujui',
    value: ringkasan.value.disetujui ?? 0,
    bg: 'bg-gradient-to-br from-green-500 to-green-600',
    iconBg: 'bg-white/25',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
])

// Urutan: tanggal_diajukan terbaru dulu
const sortedBatches = computed(() => {
  const rows = Array.isArray(batches.value) ? [...batches.value] : []
  return rows.sort((a, b) => {
    const timeA = new Date(a?.tanggal_diajukan || 0).getTime() || 0
    const timeB = new Date(b?.tanggal_diajukan || 0).getTime() || 0
    return timeB - timeA
  })
})

const filteredBatches = computed(() => {
  if (!filterStatus.value) return sortedBatches.value
  return sortedBatches.value.filter((item) => item?.status === filterStatus.value)
})

const toggleFilter = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status
}

const namaKegiatan = (batch) =>
  batch?.kegiatan?.nama_kegiatan || batch?.kegiatan?.nama || batch?.nama_kegiatan || 'Kegiatan tanpa nama'

const formatStatus = (status) => {
  const map = {
    diajukan: 'Diajukan',
    revisi: 'Revisi',
    ditolak: 'Ditolak',
    disetujui: 'Disetujui',
    terbit: 'Terbit'
  }
  return map[String(status || '').toLowerCase()] || String(status || '-')
}

const statusChip = (status) => {
  const map = {
    diajukan: 'bg-blue-100 text-blue-700',
    revisi: 'bg-amber-100 text-amber-700',
    ditolak: 'bg-red-100 text-red-700',
    disetujui: 'bg-green-100 text-green-700',
    terbit: 'bg-emerald-100 text-emerald-700'
  }
  return map[String(status || '').toLowerCase()] || 'bg-slate-100 text-slate-700'
}

const statusAvatarBg = (status) => {
  const map = {
    diajukan: 'bg-blue-500',
    revisi: 'bg-amber-500',
    ditolak: 'bg-red-500',
    disetujui: 'bg-green-500',
    terbit: 'bg-emerald-500'
  }
  return map[String(status || '').toLowerCase()] || 'bg-slate-500'
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const fetchData = async (options = {}) => {
  // silent: refresh otomatis (polling) — tanpa spinner/error state agar
  // tampilan tidak berkedip dan data lama tetap tampil bila refresh gagal.
  const silent = options?.silent === true
  if (!silent) {
    isLoading.value = true
    errorMessage.value = ''
  }
  try {
    const result = await listPengajuanSertifikat()
    batches.value = result.data
    ringkasan.value = result.ringkasan
  } catch (error) {
    if (!silent) errorMessage.value = String(error?.message || 'Gagal memuat pengajuan sertifikat.')
  } finally {
    if (!silent) isLoading.value = false
  }
}

const confirmSetujui = (batch) => {
  selectedBatch.value = batch
  showConfirmSetujui.value = true
}

const openRevisiModal = (batch) => {
  selectedBatch.value = batch
  revisiPesan.value = ''
  revisiError.value = ''
  showRevisiModal.value = true
}

const openTolakModal = (batch) => {
  selectedBatch.value = batch
  tolakAlasan.value = ''
  tolakError.value = ''
  showTolakModal.value = true
}

// ===== Unduh Draft (PDF contoh per kelas / semua kelas) =====

const openUnduhDraft = async (batch) => {
  // Tanpa template_file: cukup tampilkan informasi, tanpa panggil API.
  if (!batch?.template_file) {
    showToast('Template belum diunggah', 'info')
    return
  }
  draftBatch.value = batch
  kelasOptions.value = []
  kelasError.value = ''
  showKelasModal.value = true
  await loadKelas()
}

const closeKelasModal = () => {
  if (isDownloadingDraft.value) return
  showKelasModal.value = false
  draftBatch.value = null
}

const loadKelas = async () => {
  if (!draftBatch.value) return
  const idKegiatan = draftBatch.value.id_kegiatan || draftBatch.value.kegiatan?.id_kegiatan
  if (!idKegiatan) {
    kelasOptions.value = []
    return
  }
  isLoadingKelas.value = true
  kelasError.value = ''
  try {
    kelasOptions.value = await listKelasKegiatan(idKegiatan)
  } catch (error) {
    kelasError.value = String(error?.message || 'Gagal memuat daftar kelas.')
  } finally {
    isLoadingKelas.value = false
  }
}

const sanitizeFilename = (value) =>
  String(value || '')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

const downloadDraft = async (kelas) => {
  if (!draftBatch.value || isDownloadingDraft.value) return
  isDownloadingDraft.value = true
  draftLoadingId.value = draftBatch.value.id_batch
  try {
    const blob = await unduhDraftPdf(draftBatch.value.id_batch, kelas ? kelas.id_kelas : null)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const namaKelas = kelas ? ` - ${sanitizeFilename(kelas.nama_kelas)}` : ''
    a.download = `Draft Sertifikat - ${sanitizeFilename(namaKegiatan(draftBatch.value))}${namaKelas}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showKelasModal.value = false
    draftBatch.value = null
    showToast('Draft PDF berhasil diunduh.', 'success')
  } catch (error) {
    showToast(String(error?.message || 'Gagal mengunduh draft PDF. Silakan coba lagi.'), 'error')
  } finally {
    isDownloadingDraft.value = false
    draftLoadingId.value = null
  }
}

const afterSuccess = async (message) => {
  showConfirmSetujui.value = false
  showRevisiModal.value = false
  showTolakModal.value = false
  selectedBatch.value = null
  showToast(message, 'success')
  await fetchData()
}

const submitSetujui = async () => {
  if (!selectedBatch.value || isSubmitting.value) return
  isSubmitting.value = true
  actionLoadingId.value = selectedBatch.value.id_batch
  try {
    await setujuiPengajuanSertifikat(selectedBatch.value.id_batch)
    await afterSuccess('Pengajuan sertifikat disetujui.')
  } catch (error) {
    showToast(String(error?.message || 'Gagal menyetujui pengajuan.'), 'error')
  } finally {
    isSubmitting.value = false
    actionLoadingId.value = null
  }
}

const submitRevisi = async () => {
  if (!selectedBatch.value || isSubmitting.value) return
  const pesan = revisiPesan.value.trim()
  if (!pesan) {
    revisiError.value = 'Pesan revisi wajib diisi.'
    return
  }
  revisiError.value = ''
  isSubmitting.value = true
  actionLoadingId.value = selectedBatch.value.id_batch
  try {
    await revisiPengajuanSertifikat(selectedBatch.value.id_batch, pesan)
    await afterSuccess('Pengajuan dikembalikan untuk revisi.')
  } catch (error) {
    showToast(String(error?.message || 'Gagal mengirim revisi.'), 'error')
  } finally {
    isSubmitting.value = false
    actionLoadingId.value = null
  }
}

const submitTolak = async () => {
  if (!selectedBatch.value || isSubmitting.value) return
  const alasan = tolakAlasan.value.trim()
  if (!alasan) {
    tolakError.value = 'Alasan penolakan wajib diisi.'
    return
  }
  tolakError.value = ''
  isSubmitting.value = true
  actionLoadingId.value = selectedBatch.value.id_batch
  try {
    await tolakPengajuanSertifikat(selectedBatch.value.id_batch, alasan)
    await afterSuccess('Pengajuan sertifikat ditolak.')
  } catch (error) {
    showToast(String(error?.message || 'Gagal menolak pengajuan.'), 'error')
  } finally {
    isSubmitting.value = false
    actionLoadingId.value = null
  }
}

onMounted(fetchData)

// Polling real-time: kartu status + daftar batch disegarkan tiap 3 detik
// dengan filter yang sedang aktif. Jeda saat modal/form/proses terbuka.
usePolling(() => fetchData({ silent: true }), {
  isPaused: () =>
    showConfirmSetujui.value ||
    showRevisiModal.value ||
    showTolakModal.value ||
    showKelasModal.value ||
    isSubmitting.value ||
    isDownloadingDraft.value
})
</script>
