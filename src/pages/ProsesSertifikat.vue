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

            <!-- Card Actions: buka halaman detail (proses naskah + kelola peserta) -->
            <div class="border-t border-[#E4E6E9] px-2 py-1 flex">
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-indigo-50 transition text-[14px] font-semibold text-indigo-600"
                @click="goToDetail(batch)"
              >
                <template v-if="batch.status === 'disetujui'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  Proses
                </template>
                <template v-else>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M9 20H4v-2a3 3 0 015.856-1.487M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Kelola Peserta
                </template>
              </button>
            </div>
          </div>
        </div>
      </LoadingState>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingState from '@/components/LoadingState.vue'
import { usePolling } from '@/composables/usePolling'
import { listProsesSertifikat } from '@/services/pengajuanSertifikat'

const router = useRouter()

const isLoading = ref(true)
const errorMessage = ref('')
const batches = ref([])

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

const fetchData = async (options = {}) => {
  // silent: refresh otomatis (polling) — tanpa spinner/error state agar
  // tampilan tidak berkedip dan data lama tetap tampil bila refresh gagal.
  const silent = options?.silent === true
  if (!silent) {
    isLoading.value = true
    errorMessage.value = ''
  }
  try {
    batches.value = await listProsesSertifikat()
  } catch (error) {
    if (!silent) errorMessage.value = String(error?.message || 'Gagal memuat daftar proses sertifikat.')
  } finally {
    if (!silent) isLoading.value = false
  }
}

// Tombol kartu membuka HALAMAN DETAIL (bukan modal):
// proses naskah + tabel peserta ada di /admin/proses-sertifikat/ID
const goToDetail = (batch) => {
  router.push({ name: 'proses-sertifikat-detail', params: { id: batch.id_batch } })
}

onMounted(fetchData)

// Polling real-time: kartu batch disegarkan tiap 3 detik (halaman ini tanpa
// modal/form, jadi tidak perlu isPaused — cukup guard tab & anti-tumpang tindih).
usePolling(() => fetchData({ silent: true }))
</script>
