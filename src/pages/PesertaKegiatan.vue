<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Kegiatan Saya</h2>
      <p class="mt-1 text-sm text-slate-500">Daftar kegiatan yang pernah Anda ikuti.</p>
    </div>

    <div class="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="relative max-w-lg">
        <svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="search" placeholder="Cari nama kegiatan..." class="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
      </div>
    </div>

    <div v-if="filteredActivities.length === 0" class="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
      Kegiatan tidak ditemukan.
    </div>

    <div v-else class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <article v-for="item in filteredActivities" :key="item.id_kegiatan" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-emerald-700">{{ item.peran }}</p>
              <h3 class="mt-1 font-bold leading-snug text-slate-800">{{ item.nama_kegiatan }}</h3>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{{ item.durasi_jam }} JP</span>
          </div>
          <div class="mt-4 space-y-2 text-sm text-slate-600">
            <p>{{ formatDateRange(item.tanggal_mulai, item.tanggal_selesai) }}</p>
            <p>{{ item.lokasi }}<span v-if="item.kabupaten_kota">, {{ item.kabupaten_kota }}</span></p>
            <p>{{ methodLabel(item.metode_pelaksanaan) }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between gap-3 p-5">
          <div>
            <p class="text-xs text-slate-500">Sertifikat</p>
            <p class="text-sm font-semibold" :class="item.sertifikat?.status === 'terbit' ? 'text-emerald-700' : 'text-amber-700'">
              {{ certificateLabel(item.sertifikat?.status) }}
            </p>
          </div>
          <span v-if="item.sertifikat?.nomor" class="max-w-[55%] truncate rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">{{ item.sertifikat.nomor }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getDummyParticipant } from '@/services/pesertaPortal'

const authStore = useAuthStore()
const search = ref('')
const peserta = computed(() => getDummyParticipant(authStore.currentUser?.participant_id))
const activities = computed(() => peserta.value?.kegiatan || [])
const filteredActivities = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return activities.value
  return activities.value.filter(item => item.nama_kegiatan.toLowerCase().includes(keyword))
})

const formatDate = value => new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
const formatDateRange = (start, end) => `${formatDate(start)} - ${formatDate(end)}`
const methodLabel = method => ({ daring: 'Daring', luring: 'Luring', hybrid: 'Hybrid' }[method] || method || '-')
const certificateLabel = status => status === 'terbit' ? 'Sudah terbit' : status === 'draft' ? 'Dalam proses' : 'Belum tersedia'
</script>
