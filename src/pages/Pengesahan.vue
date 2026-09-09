<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Pengesahan</h1>
          <p class="mt-1 text-sm text-slate-500">Kegiatan yang masih memiliki sertifikat belum terbit.</p>
        </div>
        <button
          type="button"
          :disabled="isLoading"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          @click="loadData"
        >
          <svg class="h-4 w-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Muat Ulang
        </button>
      </div>

      <div v-if="isLoading" class="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div class="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
        <p class="mt-4 text-sm text-slate-500">Memuat data pengesahan...</p>
      </div>

      <div v-else-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
        <p class="font-semibold">Data tidak dapat dimuat</p>
        <p class="mt-1 text-sm">{{ errorMessage }}</p>
      </div>

      <div v-else-if="kegiatanMenunggu.length === 0" class="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="mt-4 font-semibold text-slate-800">Tidak ada pengesahan tertunda</h2>
        <p class="mt-1 text-sm text-slate-500">Semua sertifikat kegiatan yang tersedia sudah berstatus terbit.</p>
      </div>

      <div v-else>
        <div class="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-sm text-amber-900">
            <span class="font-bold">{{ kegiatanMenunggu.length }} kegiatan</span>
            memiliki <span class="font-bold">{{ totalMenunggu }} sertifikat</span> yang belum berstatus terbit.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article
            v-for="item in kegiatanMenunggu"
            :key="item.id_kegiatan"
            class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="border-b border-slate-100 p-5">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">Kegiatan</p>
                  <h2 class="mt-1 text-base font-bold leading-snug text-slate-800">{{ item.nama_kegiatan }}</h2>
                </div>
                <span class="flex-shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  {{ item.total_belum_terbit }} tertunda
                </span>
              </div>

              <div class="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p class="flex items-center gap-2">
                  <svg class="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDateRange(item.tanggal_mulai, item.tanggal_selesai) }}
                </p>
                <p class="flex items-center gap-2">
                  <svg class="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ item.lokasi || '-' }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 p-5">
              <span v-if="item.draft" class="rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800">Draft: {{ item.draft }}</span>
              <span v-if="item.dicabut" class="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800">Dicabut: {{ item.dicabut }}</span>
              <span v-if="item.lainnya" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">Lainnya: {{ item.lainnya }}</span>
              <RouterLink
                :to="`/admin/kegiatan/${item.id_kegiatan}/peserta`"
                class="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Lihat Peserta
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </RouterLink>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { fetchAPI } from '@/services/api'
import { listKegiatan } from '@/services/kegiatan'

export default {
  name: 'Pengesahan',
  setup() {
    const isLoading = ref(false)
    const errorMessage = ref('')
    const kegiatan = ref([])
    const sertifikat = ref([])

    const extractRows = (response) => {
      if (Array.isArray(response)) return response
      if (Array.isArray(response?.data)) return response.data
      return []
    }

    const getKegiatanId = (item) => item?.id_kegiatan
      ?? item?.kegiatan?.id_kegiatan
      ?? item?.batch?.id_kegiatan
      ?? item?.batch?.kegiatan?.id_kegiatan
      ?? item?.peserta?.id_kegiatan
      ?? null

    const kegiatanMenunggu = computed(() => {
      const kegiatanMap = new Map(
        kegiatan.value.map(item => [String(item.id_kegiatan ?? item.id), item])
      )
      const grouped = new Map()

      sertifikat.value.forEach((item) => {
        const status = String(item?.status_sertifikat ?? item?.status ?? '').toLowerCase().trim()
        const idKegiatan = getKegiatanId(item)
        if (!idKegiatan || status === 'terbit') return

        const key = String(idKegiatan)
        const embeddedKegiatan = item?.kegiatan || item?.batch?.kegiatan || {}
        const dataKegiatan = kegiatanMap.get(key) || embeddedKegiatan
        const current = grouped.get(key) || {
          id_kegiatan: idKegiatan,
          nama_kegiatan: dataKegiatan.nama_kegiatan || `Kegiatan #${idKegiatan}`,
          tanggal_mulai: dataKegiatan.tanggal_mulai || null,
          tanggal_selesai: dataKegiatan.tanggal_selesai || null,
          lokasi: dataKegiatan.lokasi || item?.lokasi?.lokasi || '',
          total_belum_terbit: 0,
          draft: 0,
          dicabut: 0,
          lainnya: 0
        }

        current.total_belum_terbit += 1
        if (status === 'draft') current.draft += 1
        else if (status === 'dicabut') current.dicabut += 1
        else current.lainnya += 1
        grouped.set(key, current)
      })

      return Array.from(grouped.values()).sort((a, b) => b.total_belum_terbit - a.total_belum_terbit)
    })

    const totalMenunggu = computed(() => kegiatanMenunggu.value.reduce((total, item) => total + item.total_belum_terbit, 0))

    const formatDate = (value) => {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return '-'
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const formatDateRange = (start, end) => {
      if (!start && !end) return '-'
      if (!end || start === end) return formatDate(start)
      return `${formatDate(start)} - ${formatDate(end)}`
    }

    const loadData = async () => {
      isLoading.value = true
      errorMessage.value = ''
      try {
        const [kegiatanData, sertifikatData] = await Promise.all([
          listKegiatan(),
          fetchAPI('sertifikat')
        ])
        kegiatan.value = extractRows(kegiatanData)
        sertifikat.value = extractRows(sertifikatData)
      } catch (error) {
        kegiatan.value = []
        sertifikat.value = []
        errorMessage.value = error?.message || 'Gagal mengambil data kegiatan dan sertifikat.'
      } finally {
        isLoading.value = false
      }
    }

    onMounted(loadData)

    return {
      isLoading,
      errorMessage,
      kegiatanMenunggu,
      totalMenunggu,
      formatDateRange,
      loadData
    }
  }
}
</script>
