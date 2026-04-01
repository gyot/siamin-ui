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
              <div class="mt-4" v-if="resourceLinks.length > 0">
                <!-- <p class="text-blue-200 text-sm mb-2">Resource URL</p> -->
                <ul class="space-y-1 text-sm">
                  <li v-for="item in resourceLinks" :key="item.key">
                    <span class="text-white">{{ item.label }}: </span>
                    <a :href="item.url" target="_blank" class="text-cyan-200 hover:text-cyan-100 break-all">{{ item.url }}</a>
                  </li>
                </ul>
              </div>

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

          <p v-if="!isWithinKegiatanDateRange" class="text-amber-200 text-sm mb-4">
            Link tetap ditampilkan. Pengisian biodata hanya tersedia pada tanggal kegiatan.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <article v-for="item in visibleBiodataLinks" :key="item.label" class="rounded-xl border border-white/10 bg-slate-900/35 p-4">
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

        <!-- Link Evaluasi dan Laporan Evaluasi -->
        <section v-if="isLastDayOfKegiatan" class="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Link Evaluasi</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <article class="rounded-xl border border-white/10 bg-slate-900/35 p-4">
              <p class="text-xs uppercase tracking-wide text-cyan-200">Link Evaluasi</p>
              <a :href="evaluasiUrl" target="_blank" class="mt-2 block text-sm text-blue-100 hover:text-cyan-100 break-all">{{ evaluasiUrl }}</a>
              <div class="mt-3 flex items-center gap-3">
                <img
                  v-if="qrCodeMap.evaluasiUrl"
                  :src="qrCodeMap.evaluasiUrl"
                  alt="QR Evaluasi"
                  class="w-20 h-20 rounded bg-white p-1"
                />
                <button
                  @click="copyLink(evaluasiUrl)"
                  class="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-xs text-blue-100"
                >
                  Copy Link
                </button>
              </div>
            </article>

            <!-- <article class="rounded-xl border border-white/10 bg-slate-900/35 p-4">
              <p class="text-xs uppercase tracking-wide text-cyan-200">Laporan Evaluasi</p>
              <a :href="laporanEvaluasiUrl" target="_blank" class="mt-2 block text-sm text-blue-100 hover:text-cyan-100 break-all">{{ laporanEvaluasiUrl }}</a>
              <div class="mt-3 flex items-center gap-3">
                <img
                  v-if="qrCodeMap.laporanEvaluasiUrl"
                  :src="qrCodeMap.laporanEvaluasiUrl"
                  alt="QR Laporan Evaluasi"
                  class="w-20 h-20 rounded bg-white p-1"
                />
                <button
                  @click="copyLink(laporanEvaluasiUrl)"
                  class="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-xs text-blue-100"
                >
                  Copy Link
                </button>
              </div>
            </article> -->
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

      const apiBase = String(import.meta.env.VITE_API_BASE_URL || '')
      const hostBase = apiBase.replace(/\/api\/v\d+\/?$/, '').replace(/\/api\/?$/, '').replace(/\/$/, '')
      return `${hostBase}/storage/${String(flyer).replace(/^\//, '')}`
    })

    const detailPageUrl = computed(() => {
      const judul = kegiatan.value?.nama_kegiatan || route.params.slugJudul || ''
      return buildPublicUrl(`/kegiatan/${kode}/${slugify(judul)}`)
    })

    const toDateOnly = (value) => {
      if (!value) return null
      const str = String(value).slice(0, 10)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null
      return str
    }

    const getTodayDateOnly = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const getValueByPath = (obj, path) => {
      if (!obj || !path) return ''
      return String(path)
        .split('.')
        .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
    }

    const firstNonEmptyValue = (obj, paths = []) => {
      for (const path of paths) {
        const value = getValueByPath(obj, path)
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          return value
        }
      }
      return ''
    }

    const buildAbsoluteUrl = (rawUrl) => {
      if (!rawUrl) return ''
      const value = String(rawUrl).trim()
      if (!value) return ''
      if (/^(https?:\/\/|data:|mailto:|tel:)/i.test(value)) return value
      return buildPublicUrl(value)
    }

    const getStorageFileUrl = (path) => {
      if (!path) return ''
      const value = String(path).trim()
      if (!value) return ''
      if (/^(https?:\/\/|data:|mailto:|tel:)/i.test(value)) return value
      const apiBase = String(import.meta.env.VITE_API_BASE_URL || '')
      const hostBase = apiBase.replace(/\/api\/v\d+\/?$/, '').replace(/\/api\/?$/, '').replace(/\/$/, '')
      return `${hostBase}/storage/${value.replace(/^\/+/, '')}`
    }

    const getRoleLinksFromKegiatan = (item, role) => {
      const roleLower = String(role || '').toLowerCase()
      const formUrl = firstNonEmptyValue(item, [
        `link_form_${roleLower}`,
        `form_${roleLower}_url`,
        `url_form_${roleLower}`,
        `link_biodata_${roleLower}`,
        `url_biodata_${roleLower}`,
        `biodata_${roleLower}_url`,
        `formulir_${roleLower}`,
        `link_formulir_${roleLower}`,
        `links.${roleLower}.form`,
        `links.${roleLower}.url`,
        `link_biodata.${roleLower}`,
        `form_biodata.${roleLower}`
      ])

      const templateUrl = firstNonEmptyValue(item, [
        'template_biodata',
        'template_biodata_path',
        `template_biodata_${roleLower}_url`,
        `url_template_biodata_${roleLower}`,
        `contoh_template_biodata_${roleLower}_url`,
        `link_template_biodata_${roleLower}`,
        `template_${roleLower}_url`,
        `contoh_template_${roleLower}_url`,
        `template_biodata.${roleLower}`,
        `contoh_template_biodata.${roleLower}`,
        `templates.${roleLower}.biodata`,
        `templates.${roleLower}.url`,
        `template_biodata_url`,
        `contoh_template_biodata_url`
      ])

      return {
        formUrl: buildAbsoluteUrl(formUrl),
        templateUrl: getStorageFileUrl(templateUrl) || buildAbsoluteUrl(templateUrl)
      }
    }

    const biodataLinks = computed(() => {
      const judul = kegiatan.value?.nama_kegiatan || route.params.slugJudul || ''
      const slug = slugify(judul)
      const item = kegiatan.value || {}
      const roles = ['Peserta', 'Panitia', 'Narasumber']
      const roleLinks = roles.map((role) => {
        const dbLinks = getRoleLinksFromKegiatan(item, role)
        return {
          label: `Form ${role}`,
          url: dbLinks.formUrl || buildPublicUrl(`/formulir/${kode}/${role}/${slug}`),
          templateUrl: dbLinks.templateUrl
        }
      })

      return [
        ...roleLinks,
        { label: 'Daftar Peserta', url: buildPublicUrl(`/daftar-peserta/${kode}/${slug}`), templateUrl: '' }
      ]
    })

    const visibleBiodataLinks = computed(() => {
      return isWithinKegiatanDateRange.value
        ? biodataLinks.value
        : biodataLinks.value.filter(item => !item.label.toLowerCase().startsWith('form'))
    })

    const resourceLinks = computed(() => {
      const item = kegiatan.value || {}
      const candidates = [
        { key: 'dokumentasi_url', label: 'Dokumentasi', url: item.dokumentasi_url },
        { key: 'materi_url', label: 'Materi', url: item.materi_url },
        { key: 'panduan_url', label: 'Panduan', url: item.panduan_url }
      ]
      return candidates
        .map((entry) => ({ ...entry, url: buildAbsoluteUrl(entry.url) }))
        .filter((entry) => Boolean(entry.url))
    })

    const isWithinKegiatanDateRange = computed(() => {
      const start = toDateOnly(kegiatan.value?.tanggal_mulai)
      const end = toDateOnly(kegiatan.value?.tanggal_selesai)
      if (!start || !end) return false
      const today = getTodayDateOnly()
      return today >= start && today <= end
    })

    const isLastDayOfKegiatan = computed(() => {
      const end = toDateOnly(kegiatan.value?.tanggal_selesai)
      if (!end) return false
      const today = getTodayDateOnly()
      return today === end
    })

    const evaluasiUrl = computed(() => {
      if (!kegiatan.value) return ''
      const slug = slugify(kegiatan.value.nama_kegiatan)
      return buildPublicUrl(`/evaluasi/${kode}/${slug}`)
    })

    const laporanEvaluasiUrl = computed(() => {
      if (!kegiatan.value) return ''
      const slug = slugify(kegiatan.value.nama_kegiatan)
      return buildPublicUrl(`/laporan-evaluasi/${kode}/${slug}`)
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
      const biodataTargets = biodataLinks.value.map((item) => item.url)
      const targets = [detailPageUrl.value, ...biodataTargets].filter(Boolean)
      const nextMap = {}
      await Promise.all(targets.map(async (url) => {
        try {
          nextMap[url] = await QRCode.toDataURL(url, { width: 220, margin: 1 })
        } catch (error) {
          nextMap[url] = ''
        }
      }))

      // Generate QR codes for evaluation links if it's the last day
      if (isLastDayOfKegiatan.value) {
        try {
          if (evaluasiUrl.value) {
            nextMap.evaluasiUrl = await QRCode.toDataURL(evaluasiUrl.value, { width: 220, margin: 1 })
          }
          if (laporanEvaluasiUrl.value) {
            nextMap.laporanEvaluasiUrl = await QRCode.toDataURL(laporanEvaluasiUrl.value, { width: 220, margin: 1 })
          }
        } catch (error) {
          console.error('[KegiatanDetailPublik] Gagal generate QR Evaluasi:', error)
        }
      }

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

    watch([detailPageUrl, biodataLinks, isLastDayOfKegiatan], () => {
      generateQrCodes()
    }, { immediate: true })

    return {
      kegiatan,
      isLoading,
      errorMessage,
      flyerUrl,
      detailPageUrl,
      biodataLinks,
      visibleBiodataLinks,
      resourceLinks,
      isWithinKegiatanDateRange,
      isLastDayOfKegiatan,
      evaluasiUrl,
      laporanEvaluasiUrl,
      qrCodeMap,
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
