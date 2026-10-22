<template>
  <div class="min-h-screen bg-[#F0F2F5] pb-20">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-[#E4E6E9] sticky top-0 z-30">
      <div class="flex items-center gap-3 px-4 py-3">
        <button @click="goBack" class="p-2 rounded-full hover:bg-[#F0F2F5] text-[#65676B]">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-[17px] font-bold text-[#050505] truncate">Detail Kegiatan</h1>
      </div>
    </div>

    <!-- Content -->
    <LoadingState
      :state="loading ? 'loading' : error ? 'error' : kegiatan ? 'ready' : 'empty'"
      message="Memuat detail kegiatan..."
      error-title="Gagal Memuat Data"
      :error-message="error"
      :on-retry="loadData"
    >
    <div class="max-w-2xl mx-auto p-4 space-y-4">

      <!-- Card: Informasi Kegiatan -->
      <div class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] overflow-hidden">
        <div class="p-4 pb-3">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {{ (kegiatan.nama_kegiatan || 'K').charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-[17px] font-bold text-[#050505] leading-tight">{{ kegiatan.nama_kegiatan }}</h2>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[13px] text-[#65676B]">{{ formatDateRange(kegiatan.tanggal_mulai, kegiatan.tanggal_selesai) }}</span>
                <span class="text-[#65676B]">&middot;</span>
                <span class="text-[12px] px-2 py-0.5 rounded-full font-medium" :class="statusBadge(kegiatan.status)">
                  {{ statusLabel(kegiatan.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 pb-4 space-y-3">
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 text-[#65676B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <div>
              <p class="text-[12px] text-[#65676B]">Lokasi</p>
              <p class="text-[14px] text-[#050505]">{{ tpkLabel }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 text-[#65676B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <p class="text-[12px] text-[#65676B]">Metode</p>
              <p class="text-[14px] text-[#050505]">{{ metodeLabel(kegiatan.metode_pelaksanaan) }}</p>
            </div>
          </div>
          <div v-if="kegiatan.total_peserta" class="flex items-start gap-3">
            <svg class="w-4 h-4 text-[#65676B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div>
              <p class="text-[12px] text-[#65676B]">Total Peserta</p>
              <p class="text-[14px] text-[#050505]">{{ kegiatan.total_peserta }} orang</p>
            </div>
          </div>
          <div v-if="kegiatan.deskripsi" class="flex items-start gap-3">
            <svg class="w-4 h-4 text-[#65676B] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p class="text-[12px] text-[#65676B]">Deskripsi</p>
              <p class="text-[14px] text-[#050505] whitespace-pre-line">{{ kegiatan.deskripsi }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card: TPK -->
      <div v-if="tpkItems.length > 0" class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] overflow-hidden">
        <div class="px-4 py-3 border-b border-[#E4E6E9]">
          <h3 class="text-[15px] font-semibold text-[#050505]">Tempat Pelaksanaan Kegiatan</h3>
        </div>
        <div class="p-4">
          <div v-for="(item, i) in tpkItems" :key="i" class="flex items-start gap-3 py-2" :class="{ 'border-t border-[#F0F2F5]': i > 0 }">
            <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{{ i + 1 }}</div>
            <div>
              <p class="text-[14px] text-[#050505] font-medium">{{ item.lokasi }}</p>
              <p class="text-[12px] text-[#65676B]">{{ item.kabupaten_kota || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Jadwal Harian -->
      <div v-if="jadwalList.length > 0" class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] overflow-hidden">
        <div class="px-4 py-3 border-b border-[#E4E6E9]">
          <h3 class="text-[15px] font-semibold text-[#050505]">Jadwal Harian</h3>
        </div>
        <div class="p-4 space-y-4">
          <div v-for="(day, di) in jadwalList" :key="di">
            <h4 class="text-[13px] font-bold text-[#1877F2] mb-2">{{ day.hari }} &middot; {{ formatDateShort(day.tanggal) }}</h4>
            <div class="space-y-1">
              <div v-for="(item, ii) in day.items" :key="ii"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px]"
                :class="item.tipe === 'istirahat' ? 'bg-amber-50 text-amber-700' : 'bg-[#F0F2F5]'">
                <span class="w-20 text-[#65676B] text-[12px] flex-shrink-0">{{ item.jam_mulai }}-{{ item.jam_selesai }}</span>
                <span class="flex-1" :class="item.tipe === 'istirahat' ? 'italic' : 'text-[#050505]'">{{ item.kegiatan || '-' }}</span>
                <span v-if="item.jp && item.tipe !== 'istirahat'" class="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{{ item.jp }} JP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Daftar ATK -->
      <div v-if="atkItems.length > 0" class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] overflow-hidden">
        <div class="px-4 py-3 border-b border-[#E4E6E9]">
          <h3 class="text-[15px] font-semibold text-[#050505]">Daftar ATK</h3>
        </div>
        <div class="divide-y divide-[#F0F2F5]">
          <div v-for="(item, i) in atkItems" :key="i" class="px-4 py-3 flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{{ i + 1 }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] text-[#050505] font-medium">{{ item.nama_barang }}</p>
              <p class="text-[12px] text-[#65676B]">{{ item.spesifikasi || '-' }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-[13px] text-[#050505] font-medium">{{ item.jumlah }} {{ item.satuan || '' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Link Biodata -->
      <div v-if="formLinksByRole.length > 0" class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] overflow-hidden">
        <div class="px-4 py-3 border-b border-[#E4E6E9]">
          <h3 class="text-[15px] font-semibold text-[#050505]">Link Biodata</h3>
        </div>
        <div class="p-4 space-y-3">
          <a v-for="link in formLinksByRole" :key="link.role" :href="link.url" target="_blank"
            class="flex items-center gap-3 p-3 rounded-xl bg-[#F0F2F5] hover:bg-[#E4E6E9] transition">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] text-[#050505] font-medium">{{ link.label }}</p>
              <p class="text-[12px] text-[#65676B] truncate">{{ link.url }}</p>
            </div>
            <svg class="w-5 h-5 text-[#65676B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Card: Link Evaluasi -->
      <div v-if="evaluasiLinks.length > 0" class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] overflow-hidden">
        <div class="px-4 py-3 border-b border-[#E4E6E9]">
          <h3 class="text-[15px] font-semibold text-[#050505]">Link Evaluasi, Laporan & Test</h3>
        </div>
        <div class="p-4 space-y-3">
          <a v-for="link in evaluasiLinks" :key="link.role" :href="link.url" target="_blank"
            class="flex items-center gap-3 p-3 rounded-xl bg-[#F0F2F5] hover:bg-[#E4E6E9] transition">
            <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] text-[#050505] font-medium">{{ link.label }}</p>
              <p class="text-[12px] text-[#65676B] truncate">{{ link.url }}</p>
            </div>
          </a>
        </div>
      </div>

      <!-- Card: Resource URL -->
      <div v-if="resourceUrls.length > 0" class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] overflow-hidden">
        <div class="px-4 py-3 border-b border-[#E4E6E9]">
          <h3 class="text-[15px] font-semibold text-[#050505]">Resource</h3>
        </div>
        <div class="p-4 space-y-2">
          <a v-for="res in resourceUrls" :key="res.label" :href="res.url" target="_blank"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0F2F5] transition">
            <svg class="w-4 h-4 text-[#1877F2] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span class="text-[13px] text-[#1877F2] font-medium">{{ res.label }}</span>
          </a>
        </div>
      </div>

    </div>
    </LoadingState>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAPI } from '@/services/api'
import { getKegiatanLocationItems, getKegiatanLocationLabel } from '@/utils/kegiatanLocation'
import LoadingState from '@/components/LoadingState.vue'

export default {
  name: 'KegiatanDetail',
  components: { LoadingState },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const kegiatanId = computed(() => route.params.id)

    const loading = ref(true)
    const error = ref('')
    const kegiatan = ref({})
    const tpkItems = ref([])
    const jadwalList = ref([])
    const atkItems = ref([])
    const paketSoalItems = ref([])

    const goBack = () => {
      if (window.history.length > 1) router.back()
      else router.push('/admin/dashboard')
    }

    const tpkLabel = computed(() => {
      if (tpkItems.value.length > 0) {
        return tpkItems.value.map(t => `${t.lokasi}${t.kabupaten_kota ? ` (${t.kabupaten_kota})` : ''}`).join(', ')
      }
      return getKegiatanLocationLabel(kegiatan.value) || '-'
    })

    const formLinksByRole = computed(() => {
      const slug = kegiatan.value?.slug || kegiatan.value?.id_kegiatan
      const kode = kegiatan.value?.kode_unik || kegiatan.value?.id_kegiatan
      if (!slug) return []
      const base = window.location.origin
      return [
        { role: 'Peserta', label: 'Formulir Peserta', url: `${base}/formulir/${kode}/Peserta/${tpkItems.value[0]?.id_tpk || 0}/${slug}` },
        { role: 'Panitia', label: 'Formulir Panitia', url: `${base}/formulir/${kode}/Panitia/${tpkItems.value[0]?.id_tpk || 0}/${slug}` },
        { role: 'Narasumber', label: 'Formulir Narasumber', url: `${base}/formulir/${kode}/Narasumber/${tpkItems.value[0]?.id_tpk || 0}/${slug}` },
        { role: 'Pendamping', label: 'Formulir Pendamping', url: `${base}/formulir/${kode}/Pendamping/${tpkItems.value[0]?.id_tpk || 0}/${slug}` }
      ]
    })

    const evaluasiLinks = computed(() => {
      const slug = kegiatan.value?.slug || kegiatan.value?.id_kegiatan
      const kode = kegiatan.value?.kode_unik || kegiatan.value?.id_kegiatan
      if (!slug) return []
      const base = window.location.origin
      const tpkId = tpkItems.value[0]?.id_tpk || 0
      return [
        { role: 'evaluasi', label: 'Evaluasi Kegiatan', url: `${base}/evaluasi/${kode}/${tpkId}/${slug}` },
        { role: 'laporan', label: 'Laporan Evaluasi', url: `${base}/laporan-evaluasi/${kode}/${tpkId}/${slug}` },
        { role: 'test', label: 'Test / Ujian', url: `${base}/test/${kode}/${tpkId}/${slug}` }
      ]
    })

    const resourceUrls = computed(() => {
      const k = kegiatan.value
      const urls = []
      if (k.dokumentasi_url) urls.push({ label: 'Dokumentasi', url: k.dokumentasi_url })
      if (k.materi_url) urls.push({ label: 'Materi', url: k.materi_url })
      if (k.panduan_url) urls.push({ label: 'Panduan', url: k.panduan_url })
      if (k.laporan_url) urls.push({ label: 'Laporan', url: k.laporan_url })
      if (k.surat_menyurat_url) urls.push({ label: 'Surat Menyurat', url: k.surat_menyurat_url })
      return urls
    })

    const formatDateRange = (start, end) => {
      if (!start) return '-'
      const fmt = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      return end ? `${fmt(start)} - ${fmt(end)}` : fmt(start)
    }

    const formatDateShort = (d) => {
      if (!d) return '-'
      return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const metodeLabel = (m) => ({ luring: 'Luring', daring: 'Daring', hybrid: 'Hybrid' }[m] || m || '-')

    const statusLabel = (s) => ({ draft: 'Draft', berjalan: 'Berjalan', selesai: 'Selesai', akan_datang: 'Akan Datang' }[s] || s || '-')

    const statusBadge = (s) => ({
      draft: 'bg-slate-100 text-slate-600',
      berjalan: 'bg-blue-100 text-blue-700',
      selesai: 'bg-emerald-100 text-emerald-700',
      akan_datang: 'bg-amber-100 text-amber-700'
    }[s] || 'bg-slate-100 text-slate-600')

    const loadData = async () => {
      loading.value = true
      error.value = ''
      try {
        const id = kegiatanId.value
        const [kegData, jadwalData] = await Promise.all([
          fetchAPI(`kegiatan/${id}`).catch(() => null),
          fetchAPI(`laporan/${id}/jadwal`).catch(() => null)
        ])

        const item = kegData?.data || kegData
        if (!item) {
          error.value = 'Kegiatan tidak ditemukan.'
          return
        }

        kegiatan.value = item
        tpkItems.value = getKegiatanLocationItems(item) || []

        if (jadwalData) {
          if (jadwalData.jadwal_per_kelas?.length > 0) {
            jadwalList.value = jadwalData.jadwal_per_kelas[0]?.jadwal || []
          } else if (jadwalData.jadwal_harian?.length > 0) {
            jadwalList.value = jadwalData.jadwal_harian
          }
        }

        // Load ATK
        try {
          const atkData = await fetchAPI(`kegiatan/${id}/atk`).catch(() => null)
          const rows = atkData?.data || atkData || []
          atkItems.value = Array.isArray(rows) ? rows : []
        } catch { /* optional */ }

      } catch (e) {
        error.value = e?.message || 'Gagal memuat data kegiatan.'
      } finally {
        loading.value = false
      }
    }

    onMounted(loadData)

    return {
      loading, error, kegiatan, tpkItems, jadwalList, atkItems, paketSoalItems,
      loadData,
      goBack, tpkLabel, formLinksByRole, evaluasiLinks, resourceUrls,
      formatDateRange, formatDateShort, metodeLabel, statusLabel, statusBadge
    }
  }
}
</script>
