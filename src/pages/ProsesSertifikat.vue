<template>
  <div class="min-h-screen bg-[#F0F2F5]">
    <!-- Header -->
    <div class="max-w-[1200px] mx-auto px-4 pt-4 pb-2">
      <h1 class="text-[20px] font-bold text-[#050505]">Proses Sertifikat</h1>
      <p class="text-[13px] text-[#65676B] mt-0.5">Meja persuratan: penerbitan nomor resmi naskah sertifikat yang sudah disetujui.</p>
    </div>

    <!-- Daftar Kartu Batch -->
    <div class="max-w-[1200px] mx-auto px-4 pb-8 pt-2">
      <LoadingState
        :state="isLoading ? 'loading' : errorMessage ? 'error' : sortedBatches.length === 0 ? 'empty' : 'ready'"
        message="Memuat daftar proses sertifikat..."
        error-title="Gagal memuat data"
        :error-message="errorMessage"
        empty-title="Tidak ada naskah untuk diproses"
        empty-message="Belum ada batch sertifikat yang disetujui atau sudah terbit."
        :on-retry="fetchData"
      >
        <div class="space-y-4">
          <div
            v-for="batch in sortedBatches"
            :key="batch.id_batch"
            class="bg-white rounded-xl shadow-sm border border-[#E4E6E9] overflow-hidden"
          >
            <!-- Card Header -->
            <div class="flex items-start gap-3 p-4 pb-2">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                :class="batch.status === 'terbit' ? 'bg-emerald-500' : 'bg-indigo-500'"
              >
                {{ (namaKegiatan(batch) || '?').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[15px] font-semibold text-[#050505] leading-tight">{{ namaKegiatan(batch) }}</p>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span class="text-[13px] text-[#65676B]">Disetujui {{ formatDate(batch.tanggal_persetujuan) }}</span>
                  <span class="text-[#65676B]">·</span>
                  <span class="text-[12px] px-2 py-0.5 rounded-full font-medium" :class="prosesChip(batch.status)">
                    {{ prosesLabel(batch.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="px-4 pb-3">
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#65676B]">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10v10H7z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h4m10 0h4M3 17h4m10 0h4"/></svg>
                  {{ batch.nomor_sertifikat || '-' }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  TTD {{ formatDate(batch.tanggal_ttd) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M9 20H4v-2a3 3 0 015.856-1.487M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {{ batch.jumlah_peserta ?? 0 }} Peserta
                </span>
              </div>
            </div>

            <!-- Card Actions: hanya untuk status disetujui -->
            <div v-if="batch.status === 'disetujui'" class="border-t border-[#E4E6E9] px-2 py-1 flex">
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-indigo-50 transition text-[14px] font-semibold text-indigo-600 disabled:opacity-50"
                :disabled="actionLoadingId === batch.id_batch"
                @click="openProsesModal(batch)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                Proses
              </button>
            </div>
          </div>
        </div>
      </LoadingState>
    </div>

    <!-- Modal Detail Proses -->
    <div v-if="showProsesModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 pb-3">
          <h3 class="text-[17px] font-bold text-[#050505]">Proses Naskah Sertifikat</h3>
          <button class="w-8 h-8 rounded-full hover:bg-[#F0F2F5] flex items-center justify-center text-[#65676B]" @click="closeProsesModal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="px-6 pb-4 space-y-4">
          <!-- Data Kegiatan -->
          <div class="rounded-xl border border-[#E4E6E9] overflow-hidden">
            <div class="px-4 py-2.5 bg-[#F0F2F5]">
              <p class="text-[12px] font-semibold text-[#65676B] uppercase tracking-wide">Data Kegiatan</p>
            </div>
            <div class="px-4 py-3 space-y-2 text-[13px]">
              <div class="flex gap-2">
                <span class="w-36 flex-shrink-0 text-[#65676B]">Nama Kegiatan</span>
                <span class="font-semibold text-[#050505] break-words">{{ selectedBatch ? namaKegiatan(selectedBatch) : '' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="w-36 flex-shrink-0 text-[#65676B]">Tanggal</span>
                <span class="text-[#050505]">{{ selectedBatch ? tanggalKegiatan(selectedBatch) : '-' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="w-36 flex-shrink-0 text-[#65676B]">Penandatangan</span>
                <span class="text-[#050505] break-words">{{ selectedBatch ? namaPenandatangan(selectedBatch) : '-' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="w-36 flex-shrink-0 text-[#65676B]">Jumlah Peserta</span>
                <span class="text-[#050505]">{{ selectedBatch ? (selectedBatch.jumlah_peserta ?? 0) : 0 }} peserta</span>
              </div>
              <div class="flex gap-2">
                <span class="w-36 flex-shrink-0 text-[#65676B]">Template</span>
                <span
                  class="px-2 py-0.5 rounded-full text-[12px] font-medium"
                  :class="selectedBatch?.template_file ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ selectedBatch?.template_file ? 'Template tersedia' : 'Template belum diunggah' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Status Naskah -->
          <div class="rounded-xl border border-[#E4E6E9] px-4 py-3 flex items-center gap-2">
            <span class="text-[13px] text-[#65676B]">Status Naskah:</span>
            <span class="text-[12px] px-2 py-0.5 rounded-full font-medium" :class="prosesChip(selectedBatch?.status)">
              {{ prosesLabel(selectedBatch?.status) }}
            </span>
          </div>

          <!-- Input Nomor Surat -->
          <div>
            <label class="block text-[13px] font-semibold text-[#050505] mb-1">Nomor Surat <span class="text-red-500">*</span></label>
            <input
              v-model="nomorSurat"
              type="text"
              maxlength="150"
              placeholder="Masukkan nomor surat resmi"
              class="w-full px-3 py-2.5 bg-[#F0F2F5] rounded-lg border border-[#E4E6E9] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-[14px]"
            />
            <p class="text-[12px] text-[#65676B] mt-1">
              Nilai awal <strong class="text-[#050505]">draft</strong> wajib diganti dengan nomor surat resmi sebelum naskah diterbitkan.
            </p>
            <p v-if="nomorSuratError" class="text-[12px] text-red-600 mt-1">{{ nomorSuratError }}</p>
          </div>
        </div>

        <div class="flex border-t border-[#E4E6E9]">
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-[#65676B] hover:bg-[#F0F2F5] rounded-bl-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="closeProsesModal"
          >
            Batal
          </button>
          <div class="w-px bg-[#E4E6E9]"></div>
          <button
            class="flex-1 py-3 text-[15px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-br-2xl transition disabled:opacity-50"
            :disabled="isSubmitting"
            @click="submitProses"
          >
            {{ isSubmitting ? 'Memproses...' : 'Proses' }}
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
import { listProsesSertifikat, prosesSertifikatBatch } from '@/services/pengajuanSertifikat'

const isLoading = ref(true)
const errorMessage = ref('')
const batches = ref([])

// Modal state
const selectedBatch = ref(null)
const showProsesModal = ref(false)
const nomorSurat = ref('draft')
const nomorSuratError = ref('')
const isSubmitting = ref(false)
const actionLoadingId = ref(null)

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

// Urutan: tanggal_persetujuan terbaru dulu
const sortedBatches = computed(() => {
  const rows = Array.isArray(batches.value) ? [...batches.value] : []
  return rows.sort((a, b) => {
    const timeA = new Date(a?.tanggal_persetujuan || 0).getTime() || 0
    const timeB = new Date(b?.tanggal_persetujuan || 0).getTime() || 0
    return timeB - timeA
  })
})

const namaKegiatan = (batch) =>
  batch?.kegiatan?.nama_kegiatan || batch?.kegiatan?.nama || batch?.nama_kegiatan || 'Kegiatan tanpa nama'

const tanggalKegiatan = (batch) => {
  const mulai = batch?.kegiatan?.tanggal_mulai
  const selesai = batch?.kegiatan?.tanggal_selesai
  if (!mulai && !selesai) return '-'
  if (!selesai || String(selesai) === String(mulai)) return formatDate(mulai)
  return formatDate(mulai) + ' s.d. ' + formatDate(selesai)
}

const namaPenandatangan = (batch) => {
  const p = batch?.penandatangan
  if (!p) return '-'
  const nama = p.nama || p.nama_lengkap || '-'
  const jabatan = p.nama_jabatan || ''
  return jabatan ? nama + ' — ' + jabatan : nama
}

const prosesLabel = (status) => {
  const map = {
    disetujui: 'Belum Diproses',
    terbit: 'Terbit'
  }
  return map[String(status || '').toLowerCase()] || String(status || '-')
}

const prosesChip = (status) => {
  const map = {
    disetujui: 'bg-indigo-100 text-indigo-700',
    terbit: 'bg-emerald-100 text-emerald-700'
  }
  return map[String(status || '').toLowerCase()] || 'bg-slate-100 text-slate-700'
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

const fetchData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    batches.value = await listProsesSertifikat()
  } catch (error) {
    errorMessage.value = String(error?.message || 'Gagal memuat daftar proses sertifikat.')
  } finally {
    isLoading.value = false
  }
}

const openProsesModal = (batch) => {
  selectedBatch.value = batch
  nomorSurat.value = 'draft'
  nomorSuratError.value = ''
  showProsesModal.value = true
}

const closeProsesModal = () => {
  if (isSubmitting.value) return
  showProsesModal.value = false
  selectedBatch.value = null
}

const submitProses = async () => {
  if (!selectedBatch.value || isSubmitting.value) return
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
  isSubmitting.value = true
  actionLoadingId.value = selectedBatch.value.id_batch
  try {
    await prosesSertifikatBatch(selectedBatch.value.id_batch, nomor)
    showProsesModal.value = false
    selectedBatch.value = null
    showToast('Sertifikat batch diproses dan bernomor resmi.', 'success')
    await fetchData()
  } catch (error) {
    showToast(String(error?.message || 'Gagal memproses naskah sertifikat.'), 'error')
  } finally {
    isSubmitting.value = false
    actionLoadingId.value = null
  }
}

onMounted(fetchData)
</script>
