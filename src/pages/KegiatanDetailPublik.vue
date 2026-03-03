<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,#1e3a8a_0%,#0f172a_55%,#020617_100%)] text-slate-100">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <router-link to="/" class="inline-flex items-center gap-2 text-cyan-200 hover:text-cyan-100 text-sm">
          <span>&larr;</span>
          <span>Kembali ke Beranda</span>
        </router-link>
        <button
          @click="shareDetailPage"
          class="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-300/40 text-cyan-100 hover:bg-cyan-400/25 text-sm"
        >
          Share Halaman
        </button>
      </div>

      <div v-if="isLoading" class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-blue-100">
        Memuat detail kegiatan...
      </div>

      <div v-else-if="errorMessage" class="rounded-2xl border border-red-300/30 bg-red-500/10 p-5 text-red-100">
        {{ errorMessage }}
      </div>

      <div v-else-if="kegiatan" class="space-y-6">
        <section class="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/85 to-blue-950/80 p-5 sm:p-7 shadow-2xl">
          <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-cyan-200/90 mb-3">Detail Kegiatan</p>
              <h1 class="text-2xl sm:text-3xl font-bold leading-tight text-white">{{ kegiatan.nama_kegiatan || '-' }}</h1>
              <p class="text-sm text-blue-100 mt-3">{{ kegiatan.deskripsi || 'Tidak ada deskripsi kegiatan.' }}</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm">
                <div class="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p class="text-blue-200">Tanggal</p>
                  <p class="text-white font-medium">{{ formatDate(kegiatan.tanggal_mulai) }} - {{ formatDate(kegiatan.tanggal_selesai) }}</p>
                </div>
                <div class="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p class="text-blue-200">Lokasi</p>
                  <p class="text-white font-medium">{{ kegiatan.lokasi || '-' }}</p>
                </div>
                <div class="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p class="text-blue-200">Metode</p>
                  <p class="text-white font-medium">{{ getMetodeLabel(kegiatan.metode_pelaksanaan) }}</p>
                </div>
                <div class="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p class="text-blue-200">Status</p>
                  <p class="text-white font-medium">{{ getStatusLabel(kegiatan.status) }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <img
                v-if="flyerUrl"
                :src="flyerUrl"
                :alt="`Flyer ${kegiatan.nama_kegiatan}`"
                class="w-full h-[320px] object-cover rounded-xl"
                loading="lazy"
              />
              <div v-else class="w-full h-[320px] rounded-xl border border-white/10 flex items-center justify-center text-blue-200 text-sm">
                Flyer belum tersedia
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 class="text-lg font-semibold text-white">Link Publik</h2>
            <button
              @click="copyLink(detailPageUrl)"
              class="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-sm text-blue-100"
            >
              Copy Link Halaman
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 mb-6">
            <div class="bg-white p-2 rounded-lg w-fit">
              <img
                v-if="getQrCodeUrl(detailPageUrl)"
                :src="getQrCodeUrl(detailPageUrl)"
                alt="QR Detail Kegiatan"
                class="w-28 h-28 sm:w-36 sm:h-36"
              />
            </div>
            <div>
              <p class="text-blue-200 text-sm mb-1">Link Detail Kegiatan</p>
              <a :href="detailPageUrl" target="_blank" class="text-cyan-200 hover:text-cyan-100 break-all">{{ detailPageUrl }}</a>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <article v-for="item in biodataLinks" :key="item.label" class="rounded-xl border border-white/10 bg-slate-900/35 p-4">
              <p class="text-xs uppercase tracking-wide text-cyan-200">{{ item.label }}</p>
              <a :href="item.url" target="_blank" class="mt-2 block text-sm text-blue-100 hover:text-cyan-100 break-all">{{ item.url }}</a>
              <div class="mt-3 flex items-center gap-3">
                <img
                  v-if="getQrCodeUrl(item.url)"
                  :src="getQrCodeUrl(item.url)"
                  :alt="`QR ${item.label}`"
                  class="w-20 h-20 rounded bg-white p-1"
                />
                <button
                  @click="copyLink(item.url)"
                  class="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-xs text-blue-100"
                >
                  Copy Link
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import { fetchAPI } from '@/services/api'
import database from '@/data/index.js'

export default {
  name: 'KegiatanDetailPublik',
  setup() {
    const route = useRoute()
    const kode = route.params.kode

    const kegiatan = ref(null)
    const isLoading = ref(true)
    const errorMessage = ref('')
    const qrCodeMap = ref({})

    const normalize = (value) => String(value || '').toLowerCase().trim()

    const slugify = (text) => {
      if (!text) return ''
      return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
    }

    const buildPublicUrl = (path = '') => {
      const base = (window.location.origin || import.meta.env.VITE_BASE_URL || '').replace(/\/$/, '')
      return `${base}/${String(path).replace(/^\/+/, '')}`
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const getStatusLabel = (status) => {
      const labels = { berjalan: 'Berjalan', akan_datang: 'Akan Datang', selesai: 'Selesai', draft: 'Draft', dibatalkan: 'Dibatalkan' }
      return labels[status] || status || '-'
    }

    const getMetodeLabel = (metode) => {
      const labels = { daring: 'Daring', luring: 'Luring', hybrid: 'Hybrid' }
      return labels[metode] || metode || '-'
    }

    const flyerUrl = computed(() => {
      const flyer = kegiatan.value?.flyer || kegiatan.value?.flyer_path || kegiatan.value?.path
      if (!flyer) return ''
      if (/^https?:\/\//.test(flyer) || String(flyer).startsWith('data:')) return flyer

      const apiBase = String(import.meta.env.VITE_API_BASE_URL || 'https://api-siamin.bpmpntb.id')
      const hostBase = apiBase.replace(/\/api\/v\d+\/?$/, '').replace(/\/api\/?$/, '').replace(/\/$/, '')
      return `${hostBase}/storage/${String(flyer).replace(/^\//, '')}`
    })

    const detailPageUrl = computed(() => {
      const judul = kegiatan.value?.nama_kegiatan || route.params.slugJudul || ''
      return buildPublicUrl(`/kegiatan/${kode}/${slugify(judul)}`)
    })

    const biodataLinks = computed(() => {
      const judul = kegiatan.value?.nama_kegiatan || route.params.slugJudul || ''
      const slug = slugify(judul)
      return [
        { label: 'Form Peserta', url: buildPublicUrl(`/formulir/${kode}/Peserta/${slug}`) },
        { label: 'Form Panitia', url: buildPublicUrl(`/formulir/${kode}/Panitia/${slug}`) },
        { label: 'Form Narasumber', url: buildPublicUrl(`/formulir/${kode}/Narasumber/${slug}`) },
        { label: 'Daftar Peserta', url: buildPublicUrl(`/daftar-peserta/${kode}/${slug}`) }
      ]
    })

    const loadKegiatan = async () => {
      isLoading.value = true
      errorMessage.value = ''
      kegiatan.value = null

      try {
        try {
          const detail = await fetchAPI(`kegiatan/${kode}`)
          if (detail && !Array.isArray(detail)) {
            kegiatan.value = detail
          }
        } catch (error) {
          // ignore and continue to fallback list
        }

        if (!kegiatan.value) {
          try {
            let list = await fetchAPI('kegiatan')
            if (!Array.isArray(list) || list.length === 0) {
              list = await fetchAPI('kegiatan/all')
            }
            const rows = Array.isArray(list) ? list : (Array.isArray(list?.data) ? list.data : [])
            kegiatan.value = rows.find((item) => normalize(item.id_kegiatan) === normalize(kode)) || null
          } catch (error) {
            kegiatan.value = (database.kegiatan || []).find((item) => normalize(item.id_kegiatan) === normalize(kode)) || null
          }
        }
      } finally {
        if (!kegiatan.value) {
          errorMessage.value = 'Kegiatan tidak ditemukan.'
        }
        isLoading.value = false
      }
    }

    const generateQrCodes = async () => {
      const targets = [detailPageUrl.value, ...biodataLinks.value.map((item) => item.url)].filter(Boolean)
      const nextMap = {}
      await Promise.all(targets.map(async (url) => {
        try {
          nextMap[url] = await QRCode.toDataURL(url, { width: 220, margin: 1 })
        } catch (error) {
          nextMap[url] = ''
        }
      }))
      qrCodeMap.value = nextMap
    }

    const getQrCodeUrl = (url) => qrCodeMap.value[url] || ''

    const copyLink = async (url) => {
      try {
        await navigator.clipboard.writeText(url)
        alert('Link berhasil disalin.')
      } catch (error) {
        window.prompt('Salin link berikut:', url)
      }
    }

    const shareDetailPage = async () => {
      const url = detailPageUrl.value
      if (navigator.share) {
        try {
          await navigator.share({
            title: kegiatan.value?.nama_kegiatan || 'Detail Kegiatan',
            text: 'Detail kegiatan publik',
            url
          })
          return
        } catch (error) {
          if (error?.name === 'AbortError') return
        }
      }
      await copyLink(url)
    }

    onMounted(loadKegiatan)

    watch([detailPageUrl, biodataLinks], () => {
      generateQrCodes()
    }, { immediate: true })

    return {
      kegiatan,
      isLoading,
      errorMessage,
      flyerUrl,
      detailPageUrl,
      biodataLinks,
      formatDate,
      getStatusLabel,
      getMetodeLabel,
      getQrCodeUrl,
      copyLink,
      shareDetailPage
    }
  }
}
</script>
