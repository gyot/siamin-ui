<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
      <p class="mt-1 text-slate-500">Selamat datang kembali, {{ peserta?.nama_lengkap || currentUser.name }}.</p>
      <p class="text-sm text-slate-600">Pantau riwayat kegiatan dan sertifikat Anda dalam satu tempat.</p>
    </div>

    <LoadingState
      :state="loadState"
      message="Memuat data peserta..."
      error-title="Gagal memuat data"
      :error-message="errorMessage"
      :on-retry="loadData"
    >
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
        <div v-if="recentActivities.length === 0" class="p-5 text-sm text-slate-500">
          Belum ada kegiatan yang terdaftar.
        </div>
        <div v-else class="divide-y divide-slate-100">
          <div v-for="item in recentActivities" :key="item.id_kegiatan" class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-semibold text-slate-800">{{ item.nama_kegiatan }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ formatDateRange(item.tanggal_mulai, item.tanggal_selesai) }} · {{ item.peran }}</p>
            </div>
            <span class="self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 sm:self-auto">{{ statusLabel(item.status) }}</span>
          </div>
        </div>
      </section>
    </LoadingState>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { fetchAPI } from '@/services/api'
import LoadingState from '@/components/LoadingState.vue'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser || {})

const peserta = ref(null)
const activities = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const loadState = computed(() => {
  if (isLoading.value) return 'loading'
  if (errorMessage.value) return 'error'
  return 'ready'
})

const initial = computed(() => String(peserta.value?.nama_lengkap || 'P').charAt(0).toUpperCase())
const recentActivities = computed(() => [...activities.value].sort((a, b) => new Date(b.tanggal_mulai) - new Date(a.tanggal_mulai)).slice(0, 3))
const stats = computed(() => ({
  total: activities.value.length,
  selesai: activities.value.filter(item => item.status === 'selesai').length,
  sertifikat: activities.value.filter(item => item.sertifikat?.status === 'terbit').length,
  jam: activities.value.reduce((total, item) => total + Number(item.durasi_jam || 0), 0)
}))

const extractRows = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const matchesParticipant = (row, user) => {
  const id = user?.participant_id ?? user?.id_peserta ?? null
  if (id !== null && id !== undefined && id !== '') {
    if (String(row?.id_peserta ?? '') === String(id)) return true
  }
  const email = String(user?.email || '').trim().toLowerCase()
  if (email && String(row?.email || '').trim().toLowerCase() === email) return true
  const nip = String(user?.nip || '').trim()
  if (nip && String(row?.nip || '').trim() === nip) return true
  return false
}

const buildActivities = (myRows, kegiatanRows, sertifikatRows) => {
  return myRows.map(row => {
    const kegiatan = kegiatanRows.find(k => String(k.id_kegiatan) === String(row.id_kegiatan)) || {}
    const sertifikat = sertifikatRows.find(s =>
      String(s.id_peserta ?? s.id ?? '') === String(row.id_peserta ?? '') &&
      String(s.id_kegiatan ?? '') === String(row.id_kegiatan ?? '')
    ) || null

    return {
      id_kegiatan: row.id_kegiatan ?? kegiatan.id_kegiatan,
      nama_kegiatan: kegiatan.nama_kegiatan || row.nama_kegiatan || '-',
      tanggal_mulai: kegiatan.tanggal_mulai || row.tanggal_mulai || null,
      tanggal_selesai: kegiatan.tanggal_selesai || row.tanggal_selesai || null,
      peran: row.peran || '-',
      status: kegiatan.status || row.status || '-',
      durasi_jam: Number(row.durasi_jam ?? kegiatan.durasi_jam ?? kegiatan.jp ?? 0),
      lokasi: kegiatan.lokasi || row.lokasi || '-',
      kabupaten_kota: kegiatan.kabupaten_kota ?? kegiatan.kab_kota ?? row.kab_kota ?? '',
      metode_pelaksanaan: kegiatan.metode_pelaksanaan || row.metode_pelaksanaan || '',
      sertifikat: sertifikat
        ? { nomor: sertifikat.nomor_sertifikat || sertifikat.nomor || null, status: sertifikat.status || 'draft' }
        : null
    }
  })
}

const loadData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const [pesertaData, kegiatanData, sertifikatData] = await Promise.all([
      fetchAPI('peserta'),
      fetchAPI('kegiatan'),
      fetchAPI('sertifikat')
    ])

    const pesertaRows = extractRows(pesertaData)
    const kegiatanRows = extractRows(kegiatanData)
    const sertifikatRows = extractRows(sertifikatData)
    const myRows = pesertaRows.filter(row => matchesParticipant(row, currentUser.value))
    const profileRow = myRows[0] || null

    peserta.value = profileRow
      ? {
          id_peserta: profileRow.id_peserta,
          nama_lengkap: profileRow.nama_lengkap || currentUser.value.name || '-',
          nip: profileRow.nip || currentUser.value.nip || '-',
          jabatan: profileRow.jabatan || currentUser.value.jabatan || '-',
          email: profileRow.email || currentUser.value.email || '-',
          nama_instansi: profileRow.nama_instansi || currentUser.value.instansi || '-',
          kab_kota: profileRow.kab_kota || currentUser.value.kabupaten_kota || '-'
        }
      : null

    activities.value = buildActivities(myRows, kegiatanRows, sertifikatRows)
  } catch (error) {
    console.error('[PesertaDashboard] Gagal memuat data peserta:', error)
    peserta.value = null
    activities.value = []
    errorMessage.value = error?.message || 'Gagal memuat data peserta.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

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
