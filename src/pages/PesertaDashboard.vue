<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
      <p class="mt-1 text-slate-500">Selamat datang kembali, {{ peserta?.nama_lengkap || currentUser.name }}.</p>
      <p class="text-sm text-slate-600">Pantau riwayat kegiatan dan sertifikat Anda dalam satu tempat.</p>
    </div>

    <section class="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div class="grid gap-6 md:grid-cols-[180px_1fr]">
        <div class="flex flex-col items-center justify-center border-slate-100 md:border-r">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 text-3xl font-bold text-white">
            {{ initial }}
          </div>
          <h3 class="mt-3 text-center font-bold text-slate-800">{{ peserta?.nama_lengkap }}</h3>
          <p class="text-center text-sm text-slate-500">{{ peserta?.jabatan }}</p>
        </div>
        <div class="grid content-center gap-4 sm:grid-cols-2">
          <ProfileItem label="NIP" :value="peserta?.nip" />
          <ProfileItem label="Email" :value="peserta?.email" />
          <ProfileItem label="Instansi" :value="peserta?.nama_instansi" />
          <ProfileItem label="Kabupaten/Kota" :value="peserta?.kab_kota" />
        </div>
      </div>
    </section>

    <section class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total Kegiatan" :value="stats.total" color="blue" />
      <StatCard label="Kegiatan Selesai" :value="stats.selesai" color="emerald" />
      <StatCard label="Sertifikat Terbit" :value="stats.sertifikat" color="purple" />
      <StatCard label="Total Jam" :value="stats.jam" color="amber" />
    </section>

    <section class="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h3 class="font-bold text-slate-800">Kegiatan Terbaru</h3>
          <p class="text-sm text-slate-500">Kegiatan terakhir yang pernah Anda ikuti.</p>
        </div>
        <RouterLink to="/peserta/kegiatan" class="text-sm font-semibold text-emerald-700 hover:text-emerald-900">Lihat Semua</RouterLink>
      </div>
      <div class="divide-y divide-slate-100">
        <div v-for="item in recentActivities" :key="item.id_kegiatan" class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-semibold text-slate-800">{{ item.nama_kegiatan }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ formatDateRange(item.tanggal_mulai, item.tanggal_selesai) }} · {{ item.peran }}</p>
          </div>
          <span class="self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 sm:self-auto">{{ statusLabel(item.status) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getDummyParticipant } from '@/services/pesertaPortal'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser || {})
const peserta = computed(() => getDummyParticipant(currentUser.value.participant_id))
const activities = computed(() => peserta.value?.kegiatan || [])
const initial = computed(() => String(peserta.value?.nama_lengkap || 'P').charAt(0).toUpperCase())
const recentActivities = computed(() => [...activities.value].sort((a, b) => new Date(b.tanggal_mulai) - new Date(a.tanggal_mulai)).slice(0, 3))
const stats = computed(() => ({
  total: activities.value.length,
  selesai: activities.value.filter(item => item.status === 'selesai').length,
  sertifikat: activities.value.filter(item => item.sertifikat?.status === 'terbit').length,
  jam: activities.value.reduce((total, item) => total + Number(item.durasi_jam || 0), 0)
}))

const formatDate = value => new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
const formatDateRange = (start, end) => `${formatDate(start)} - ${formatDate(end)}`
const statusLabel = status => status === 'selesai' ? 'Selesai' : status

const ProfileItem = defineComponent({
  props: { label: String, value: String },
  setup: props => () => h('div', [
    h('p', { class: 'text-xs font-semibold uppercase tracking-wide text-slate-500' }, props.label),
    h('p', { class: 'mt-1 text-sm font-semibold text-slate-800' }, props.value || '-')
  ])
})

const StatCard = defineComponent({
  props: { label: String, value: [String, Number], color: String },
  setup: props => {
    const colors = {
      blue: 'bg-blue-500',
      emerald: 'bg-emerald-500',
      purple: 'bg-purple-500',
      amber: 'bg-amber-500'
    }
    return () => h('div', { class: 'rounded-2xl border border-slate-100 bg-white p-5 shadow-sm' }, [
      h('div', { class: `mb-3 h-2 w-12 rounded-full ${colors[props.color] || colors.blue}` }),
      h('p', { class: 'text-2xl font-bold text-slate-800' }, String(props.value ?? 0)),
      h('p', { class: 'mt-1 text-sm text-slate-500' }, props.label)
    ])
  }
})
</script>
