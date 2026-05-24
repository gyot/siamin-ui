<template>
  <div class="min-h-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
    <!-- Header -->
    <header class="relative z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="Logo SIMAIK" class="h-16 object-contain">
          </RouterLink>
          <div class="flex items-center gap-3">
            <!-- <RouterLink 
              to="/login" 
              class="btn-primary px-5 py-2.5 text-white rounded-lg font-medium shadow-lg"
            >
              Login
            </RouterLink> -->
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- welcome / daftar kegiatan -->
          <div ref="kegiatanSectionRef" class="text-center lg:text-left">
            <template v-if="!selectedTimker">
              <div
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full text-blue-200 text-sm mb-6">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Sistem Terintegrasi
              </div>
              <h2 class="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                <b class="text-yellow-400">SIMAIK</b>
              </h2>
              <h2 class="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                (<b class="text-yellow-400">Si</b>stem <b class="text-yellow-400">Ma</b>najemen<br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300"><b
                    class="text-yellow-400">I</b>nformasi
                  <b class="text-yellow-400">K</b>egiatan</span>)
              </h2>
              <p class="text-blue-100 text-lg mb-8 leading-relaxed">
                Platform terintegrasi untuk mengelola kegiatan, peserta, penugasan, dan sertifikat digital secara
                efisien dan transparan.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <!-- <RouterLink 
                  to="/login" 
                  class="btn-primary px-8 py-3.5 text-white rounded-xl font-semibold shadow-xl flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Login Admin
                </RouterLink> -->
                <!-- <RouterLink 
                  to="/login-peserta" 
                  class="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold backdrop-blur border border-white/20 transition flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  Login Peserta
                </RouterLink> -->
              </div>
            </template>

            <template v-else>
              <div class="flex items-center justify-between gap-3 mb-6">
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 rounded-full text-cyan-200 text-sm">
                  Daftar Kegiatan
                </div>
                <button
                  class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm border border-white/20 transition"
                  @click="resetTimkerSelection">
                  Kembali
                </button>
              </div>
              <h2 class="text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
                {{ selectedTimker.name }}
              </h2>
              <p class="text-blue-100 text-sm mb-6">
                Menampilkan {{ filteredKegiatan.length }} kegiatan
              </p>

              <div v-if="isLoadingKegiatan" class="text-blue-100 text-sm py-10 text-center lg:text-left">
                Memuat daftar kegiatan...
              </div>

              <div v-else-if="paginatedKegiatan.length === 0"
                class="text-blue-100 text-sm py-10 text-center lg:text-left">
                Belum ada kegiatan untuk timker ini.
              </div>

              <div v-else class="space-y-4">
                <article v-for="item in paginatedKegiatan" :key="item.id_kegiatan"
                  class="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div class="flex items-start justify-between gap-3 mb-1">
                    <h3 class="text-white font-semibold">{{ item.nama_kegiatan }}</h3>
                    <div class="flex items-center gap-2">
                      <a
                        :href="buildKegiatanDetailUrl(item)"
                        target="_blank"
                        class="px-3 py-1 rounded-lg text-xs border border-cyan-300/40 text-cyan-100 hover:bg-cyan-400/15 transition"
                      >
                        Halaman
                      </a>
                      <button
                        class="px-3 py-1 rounded-lg text-xs border border-white/20 text-blue-100 hover:bg-white/10 transition"
                        @click="openKegiatanDetail(item)">
                        Detail
                      </button>
                    </div>
                  </div>
                  <!-- <p class="text-blue-100 text-sm mb-2">{{ item.rincian_kegiatan || item.deskripsi || '-' }}</p> -->
                  <div class="flex flex-wrap items-center gap-2 text-xs text-blue-200">
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ formatDate(item.tanggal_mulai) }} - {{
                      formatDate(item.tanggal_selesai) }}</span>
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ item.lokasi || '-' }}</span>
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ getKabupatenKotaLabel(item) }}</span>
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ getStatusLabel(item.status) }}</span>

                  </div>
                </article>
              </div>

              <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center lg:justify-start gap-2">
                <button
                  class="px-3 py-1.5 rounded-lg border border-white/20 text-blue-100 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="prevPage" :disabled="currentPage === 1">
                  Prev
                </button>
                <span class="text-blue-100 text-sm">Halaman {{ currentPage }} / {{ totalPages }}</span>
                <button
                  class="px-3 py-1.5 rounded-lg border border-white/20 text-blue-100 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="nextPage" :disabled="currentPage === totalPages">
                  Next
                </button>
              </div>
            </template>
          </div>
          <!-- Feature Cards -->
          <div ref="timkerCardsSectionRef" class="grid grid-cols-2 gap-4 mb-10 lg:mb-0">
            <button v-for="card in timkerCards" :key="card.id"
              class="text-left bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition"
              :class="{ 'col-span-2': card.fullWidth, 'ring-2 ring-cyan-300/70': selectedTimker && selectedTimker.id === card.id }"
              @click="handleSelectTimker(card)" type="button">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg" :class="card.iconBg">
                <svg class="w-7 h-7" :class="card.iconColor || 'text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-for="(path, index) in card.iconPaths" :key="`${card.id}-${index}`" v-bind="path" />
                  <circle v-for="(circle, index) in card.iconCircles || []" :key="`${card.id}-c-${index}`"
                    v-bind="circle" />
                  <rect v-for="(rect, index) in card.iconRects || []" :key="`${card.id}-r-${index}`" v-bind="rect" />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">{{ card.name }}</h3>
              <p class="text-blue-200 text-sm">{{ card.description }}</p>
            </button>
          </div>
          


        </div>
      </div>

      <!-- Stats Section -->
      <!-- <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-white mb-1">150+</div>
              <div class="text-blue-200 text-sm">Kegiatan Terselenggara</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-white mb-1">5,000+</div>
              <div class="text-blue-200 text-sm">Peserta Terdaftar</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-white mb-1">4,500+</div>
              <div class="text-blue-200 text-sm">Sertifikat Terbit</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-white mb-1">50+</div>
              <div class="text-blue-200 text-sm">Instansi Terhubung</div>
            </div>
          </div>
        </div>
      </div> -->
    </main>

    <div v-if="showKegiatanDetailModal" class="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center"
      @click.self="closeKegiatanDetail">
      <div class="w-full max-w-3xl bg-slate-900 border border-white/20 rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-semibold text-lg">Detail Kegiatan</h3>
          <div class="flex items-center gap-3">
            <button
              @click="shareKegiatanDetailFromModal"
              class="px-3 py-1.5 rounded-lg border border-cyan-300/40 text-cyan-100 hover:bg-cyan-400/15 text-xs sm:text-sm"
            >
              Share Halaman
            </button>
            <button class="text-blue-100 hover:text-white" @click="closeKegiatanDetail">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="selectedKegiatanDetail" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <h4 class="text-white text-xl font-semibold">{{ selectedKegiatanDetail.nama_kegiatan || '-' }}</h4>
            <!-- <p class="text-blue-200 text-sm mt-1">{{ selectedKegiatanDetail.id_kegiatan || '-' }}</p> -->
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Tanggal</p>
              <p class="text-white">{{ formatDate(selectedKegiatanDetail.tanggal_mulai) }} - {{
                formatDate(selectedKegiatanDetail.tanggal_selesai) }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Lokasi</p>
              <p class="text-white">{{ selectedKegiatanDetail.lokasi || '-' }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Kabupaten/Kota</p>
              <p class="text-white">{{ getKabupatenKotaLabel(selectedKegiatanDetail) }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Metode Pelaksanaan</p>
              <p class="text-white">{{ getMetodeLabel(selectedKegiatanDetail.metode_pelaksanaan) }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Status</p>
              <p class="text-white">{{ getStatusLabel(selectedKegiatanDetail.status) }}</p>
            </div>
            <!-- <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Ringkasan Peserta</p>
              <p class="text-white">{{ selectedKegiatanDetail.peserta_ringkasan || '-' }}</p>
            </div> -->
          </div>
          <div class="bg-white/5 rounded-lg p-4 border border-white/10">

  <!-- Total Peserta -->
  <div class="mb-6">
    <p class="text-blue-200 text-sm">Total Peserta</p>
    <p class="text-white text-lg font-semibold">
      {{ selectedKegiatanDetail.total_peserta ?? '-' }}
    </p>
  </div>

  <!-- Link Halaman -->
  <div class="mb-6">
    <p class="text-blue-200 text-sm mb-1">Link Halaman Detail Kegiatan</p>
    <a
      :href="buildKegiatanDetailUrl(selectedKegiatanDetail)"
      target="_blank"
      class="text-cyan-300 hover:text-cyan-200 break-all"
    >
      {{ buildKegiatanDetailUrl(selectedKegiatanDetail) }}
    </a>
  </div>

  <!-- Link Biodata -->
  <p class="text-blue-200 text-sm mb-3">Link Biodata</p>
  <p v-if="!isWithinSelectedKegiatanDateRange" class="text-amber-200 text-xs mb-3">
    Link biodata hanya tersedia pada tanggal kegiatan.
  </p>

  <div v-if="isWithinSelectedKegiatanDateRange" class="space-y-5">

    <div
      v-for="item in biodataLinks"
      :key="item.label"
      class="bg-white/5 border border-white/10 rounded-lg p-4
             grid grid-cols-1 sm:grid-cols-[auto_1fr]
             gap-6 text-sm items-center transition hover:bg-white/10"
    >

      <!-- Kolom QR -->
      <div class="flex flex-col items-center sm:items-start">
        <div class="bg-white p-2 rounded-lg w-fit shadow">
          <img
            v-if="getQrCodeUrl(item.url)"
            :src="getQrCodeUrl(item.url)"
            :alt="`QR ${item.label}`"
            class="w-28 h-28 sm:w-36 sm:h-36 object-contain"
            loading="lazy"
          />

          <div
            v-else
            class="w-28 h-28 sm:w-36 sm:h-36
                   flex items-center justify-center
                   text-xs text-slate-600 text-center"
          >
            Membuat QR...
          </div>
        </div>
      </div>

      <!-- Kolom URL -->
      <div class="flex flex-col h-full">
         <strong class="text-white mb-3">
          {{ item.label }}:
        </strong>
        <a
          :href="item.url"
          target="_blank"
          class="text-cyan-300 hover:text-cyan-200
                 break-all transition duration-200"
        >
          {{ item.url }}
        </a>
      </div>

    </div>

  </div>
</div>

<!-- Link Evaluasi dan Laporan Evaluasi -->
<div class="mt-6">
  <p class="text-blue-200 text-sm mb-3">Link Evaluasi</p>
  <p v-if="!isLastDayOfKegiatan" class="text-amber-200 text-xs mb-3">
    Link evaluasi hanya tersedia pada hari terakhir kegiatan.
  </p>
  
  <div v-if="isLastDayOfKegiatan" class="space-y-5">
    
    <div
      class="bg-white/5 border border-white/10 rounded-lg p-4
             grid grid-cols-1 sm:grid-cols-[auto_1fr]
             gap-6 text-sm items-center transition hover:bg-white/10"
    >
      <!-- Kolom QR -->
      <div class="flex flex-col items-center sm:items-start">
        <div class="bg-white p-2 rounded-lg w-fit shadow">
          <img
            v-if="qrCodeMap.evaluasiUrl"
            :src="qrCodeMap.evaluasiUrl"
            alt="QR Evaluasi"
            class="w-28 h-28 sm:w-36 sm:h-36 object-contain"
            loading="lazy"
          />
          <div
            v-else
            class="w-28 h-28 sm:w-36 sm:h-36
                   flex items-center justify-center
                   text-xs text-slate-600 text-center"
          >
            Membuat QR...
          </div>
        </div>
      </div>

      <!-- Kolom URL -->
      <div class="flex flex-col h-full">
        <strong class="text-white mb-3">Link Evaluasi:</strong>
        <a
          :href="evaluasiUrl"
          target="_blank"
          class="text-cyan-300 hover:text-cyan-200
                 break-all transition duration-200"
        >
          {{ evaluasiUrl }}
        </a>
      </div>
    </div>

    <!-- <div
      class="bg-white/5 border border-white/10 rounded-lg p-4
             grid grid-cols-1 sm:grid-cols-[auto_1fr]
             gap-6 text-sm items-center transition hover:bg-white/10"
    >
      
      <div class="flex flex-col items-center sm:items-start">
        <div class="bg-white p-2 rounded-lg w-fit shadow">
          <img
            v-if="qrCodeMap.laporanEvaluasiUrl"
            :src="qrCodeMap.laporanEvaluasiUrl"
            alt="QR Laporan Evaluasi"
            class="w-28 h-28 sm:w-36 sm:h-36 object-contain"
            loading="lazy"
          />
          <div
            v-else
            class="w-28 h-28 sm:w-36 sm:h-36
                   flex items-center justify-center
                   text-xs text-slate-600 text-center"
          >
            Membuat QR...
          </div>
        </div>
      </div>

      <div class="flex flex-col h-full">
        <strong class="text-white mb-3">Laporan Evaluasi:</strong>
        <a
          :href="laporanEvaluasiUrl"
          target="_blank"
          class="text-cyan-300 hover:text-cyan-200
                 break-all transition duration-200"
        >
          {{ laporanEvaluasiUrl }}
        </a>
      </div>
    </div> -->

  </div>
</div>

          <!-- <div class="bg-white/5 rounded-lg p-3 border border-white/10">
            <p class="text-blue-200 text-sm mb-1">Rincian</p>
            <p class="text-white text-sm whitespace-pre-line">{{ selectedKegiatanDetail.rincian_kegiatan || '-' }}</p>
          </div> -->

          <div class="bg-white/5 rounded-lg p-3 border border-white/10">
            <p class="text-blue-200 text-sm mb-1">Deskripsi</p>
            <p class="text-white text-sm whitespace-pre-line">{{ selectedKegiatanDetail.deskripsi || '-' }}</p>
          </div>

          <div class="bg-white/5 rounded-lg p-3 border border-white/10">
            <p class="text-blue-200 text-sm mb-2">Resource URL</p>
            <div class="space-y-1 text-sm">
              <strong class="text-white">Dokumentasi:</strong><a v-if="selectedKegiatanDetail.dokumentasi_url"
                :href="selectedKegiatanDetail.dokumentasi_url" target="_blank"
                class="block text-cyan-300 hover:text-cyan-200 break-all"> {{
                  selectedKegiatanDetail.dokumentasi_url }}</a>
              <strong class="text-white">Materi: </strong><a v-if="selectedKegiatanDetail.materi_url"
                :href="selectedKegiatanDetail.materi_url" target="_blank"
                class="block text-cyan-300 hover:text-cyan-200 break-all">{{ selectedKegiatanDetail.materi_url }}</a>
              <strong class="text-white">Panduan: </strong><a v-if="selectedKegiatanDetail.panduan_url"
                :href="selectedKegiatanDetail.panduan_url" target="_blank"
                class="block text-cyan-300 hover:text-cyan-200 break-all">{{
                  selectedKegiatanDetail.panduan_url }}</a>
              <!-- <strong class="text-white">Laporan: </strong><a v-if="selectedKegiatanDetail.laporan_url" :href="selectedKegiatanDetail.laporan_url" target="_blank"
                class="block text-cyan-300 hover:text-cyan-200 break-all">{{ selectedKegiatanDetail.laporan_url }}</a>
              <strong class="text-white">Surat Menyurat: </strong><a v-if="selectedKegiatanDetail.surat_menyurat_url" :href="selectedKegiatanDetail.surat_menyurat_url"
                target="_blank" class="block text-cyan-300 hover:text-cyan-200 break-all"> {{
                  selectedKegiatanDetail.surat_menyurat_url }}</a> -->
              <p v-if="!hasAnyResourceUrl(selectedKegiatanDetail)" class="text-blue-100">Tidak ada resource URL.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-blue-200 text-sm">© 2025 SIMAIK - Kementerian Pendidikan Dasar dan Menengah BPMP Nusa Tenggara
            Barat</p>
          <div class="flex items-center gap-6">
            <button
              type="button"
              class="text-blue-200 hover:text-white text-sm transition"
              @click="scrollToKegiatanSection"
            >
              Verifikasi Sertifikat
            </button>
            <a href="#" class="text-blue-200 hover:text-white text-sm transition">Bantuan</a>
            <a href="#" class="text-blue-200 hover:text-white text-sm transition">Kontak</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { getKegiatanTim, getAllKegiatanTimKegiatan } from '@/services/kegiatan'
import { getUnitKerja } from '@/services/unit_kerja'
import { buildPublicUrl, buildStorageUrl } from '@/utils/url'

export default {
  name: 'Landing',
  setup() {
    const kegiatan = ref([])
    const isLoadingKegiatan = ref(false)
    const selectedTimker = ref(null)
    const activeUnitCode = ref('')
    const kegiatanSectionRef = ref(null)
    const timkerCardsSectionRef = ref(null)
    const showKegiatanDetailModal = ref(false)
    const selectedKegiatanDetail = ref(null)
    const qrCodeMap = ref({})
    const currentPage = ref(1)
    const itemsPerPage = 4
    function slugify(text) {
      if (!text) return ''
      return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
    }
    function defaultIcon() {
      return [
        { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' }
      ]
    }

    const ICON_VARIANTS = [
      {
        iconCircles: [{ cx: '12', cy: '8', r: '3.5', 'stroke-width': '2' }],
        iconPaths: [{ 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 20c0-2.5 3-4 7-4s7 1.5 7 4' }],
        iconRects: []
      },
      {
        iconCircles: [],
        iconPaths: [
          { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 19.5A2.5 2.5 0 016.5 17H20' },
          { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 4h16v13H4z' }
        ],
        iconRects: []
      },
      {
        iconCircles: [],
        iconPaths: [
          { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 14l9-5-9-5-9 5 9 5z' },
          { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 14v7' },
          { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M7 19c0-1.657 2.239-3 5-3s5 1.343 5 3' }
        ],
        iconRects: []
      },
      {
        iconCircles: [],
        iconPaths: [{ 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4v6m-6 0V4m12 6V4' }],
        iconRects: [{ x: '3', y: '10', width: '18', height: '8', rx: '2', 'stroke-width': '2' }]
      },
      {
        iconCircles: [{ cx: '12', cy: '12', r: '3', 'stroke-width': '2' }],
        iconPaths: [{ 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' }],
        iconRects: []
      }
    ]

    const getIconConfig = (namaUnit, kodeUnit = '') => {
      const lower = String(namaUnit || '').toLowerCase()
      const code = String(kodeUnit || '').trim()
      if (lower.includes('paud')) {
        return ICON_VARIANTS[0]
      }
      if (lower.includes('sd')) {
        return ICON_VARIANTS[1]
      }
      if (lower.includes('smp')) {
        return ICON_VARIANTS[2]
      }
      if (lower.includes('sma') || lower.includes('smk')) {
        return ICON_VARIANTS[3]
      }
      if (lower.includes('subbag') || lower.includes('umum')) {
        return ICON_VARIANTS[4]
      }
      const lastDigit = Number(String(code).replace(/\D/g, '').slice(-1))
      if (!Number.isNaN(lastDigit)) return ICON_VARIANTS[lastDigit % ICON_VARIANTS.length]
      return { iconCircles: [], iconPaths: defaultIcon(), iconRects: [] }
    }

    const buildDefaultTimkerCards = () => ([
      { id: 'paud', name: 'Timker Pendidikan Anak Usia Dini', description: 'Fokus pada pengembangan dan pengelolaan program pendidikan anak usia dini secara holistik dan inklusif.', iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500', iconColor: 'text-yellow-100', fullWidth: false, keywords: ['anak usia dini', 'paud'], ...getIconConfig('paud', '001') },
      { id: 'sd', name: 'Timker Sekolah Dasar', description: 'Bertanggung jawab atas pelaksanaan dan inovasi pendidikan tingkat sekolah dasar.', iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600', iconColor: 'text-lime-100', fullWidth: false, keywords: ['sekolah dasar', 'sd'], ...getIconConfig('sd', '002') },
      { id: 'smp', name: 'Timker Sekolah Menengah Pertama', description: 'Mengelola program dan kegiatan pendidikan untuk jenjang sekolah menengah pertama.', iconBg: 'bg-gradient-to-br from-sky-400 to-blue-600', iconColor: 'text-cyan-100', fullWidth: false, keywords: ['sekolah menengah pertama', 'smp'], ...getIconConfig('smp', '003') },
      { id: 'sma', name: 'Timker Sekolah Menengah', description: 'Bertugas dalam pengembangan dan pengawasan pendidikan tingkat menengah atas.', iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500', iconColor: 'text-yellow-50', fullWidth: false, keywords: ['sekolah menengah', 'sma', 'smk'], ...getIconConfig('sma', '004') },
      { id: 'subbag', name: 'Timker Subbag Umum', description: 'Mendukung operasional, administrasi, dan layanan umum untuk kelancaran seluruh program kerja.', iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600', iconColor: 'text-pink-100', fullWidth: true, keywords: ['subbag umum', 'umum', 'administrasi'], ...getIconConfig('subbag umum', '005') }
    ])
    const timkerCards = ref(buildDefaultTimkerCards())
    const normalizeUnitCode = (value) => {
      const raw = String(value ?? '').trim()
      if (!raw) return ''
      if (/^\d+$/.test(raw)) return raw.padStart(3, '0')
      return raw.toLowerCase()
    }

    const loadUnitKerja = async () => {
      try {
        const response = await getUnitKerja()
        const rows = Array.isArray(response) ? response : (Array.isArray(response?.data) ? response.data : [])

        if (rows.length === 0) {
          timkerCards.value = buildDefaultTimkerCards()
          return
        }

        timkerCards.value = rows.map((item) => {
          const name = item.nama_unit || item.nama || 'Timker'
          const lowerName = String(name).toLowerCase()
          const kodeUnit = normalizeUnitCode(item.kode_unit || item.unit_kerja_id || item.id || '')
          const cardId = kodeUnit || item.id || item.id_unit || ''
          const iconConfig = getIconConfig(name, kodeUnit)
          return {
            id: cardId,
            name,
            description: item.keterangan !== '-'
              ? item.keterangan
              : `Unit kerja ${name}${item.tahun ? ` tahun ${item.tahun}` : ''}`,
            kode_unit: kodeUnit,
            iconBg: getIconBg(name, kodeUnit),
            iconColor: getIconColor(name, kodeUnit),
            fullWidth: lowerName.includes('subbag') || lowerName.includes('umum'),
            keywords: generateKeywords(name),
            iconPaths: iconConfig.iconPaths,
            iconCircles: iconConfig.iconCircles,
            iconRects: iconConfig.iconRects
          }
        })

        console.log('Formatted Unit Kerja:', timkerCards.value)

      } catch (error) {
        console.error('Gagal memuat data unit kerja:', error)
        timkerCards.value = buildDefaultTimkerCards()
      }
    }
    const getPaletteByCode = (kodeUnit = '') => {
      const code = String(kodeUnit || '').trim()
      const presets = [
        { bg: 'bg-gradient-to-br from-pink-400 to-rose-500', color: 'text-yellow-100' },
        { bg: 'bg-gradient-to-br from-emerald-400 to-green-600', color: 'text-lime-100' },
        { bg: 'bg-gradient-to-br from-sky-400 to-blue-600', color: 'text-cyan-100' },
        { bg: 'bg-gradient-to-br from-amber-400 to-orange-500', color: 'text-yellow-50' },
        { bg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600', color: 'text-pink-100' }
      ]
      const lastDigit = Number(code.replace(/\D/g, '').slice(-1))
      if (Number.isNaN(lastDigit)) return null
      return presets[lastDigit % presets.length]
    }

    const getIconBg = (namaUnit, kodeUnit = '') => {
      const byCode = getPaletteByCode(kodeUnit)
      if (byCode) return byCode.bg
      const lower = namaUnit.toLowerCase()
      if (lower.includes('paud')) return 'bg-gradient-to-br from-pink-400 to-rose-500'
      if (lower.includes('sd')) return 'bg-gradient-to-br from-emerald-400 to-green-600'
      if (lower.includes('smp')) return 'bg-gradient-to-br from-sky-400 to-blue-600'
      if (lower.includes('sma') || lower.includes('smk')) return 'bg-gradient-to-br from-amber-400 to-orange-500'
      return 'bg-gradient-to-br from-violet-500 to-fuchsia-600'
    }

    const getIconColor = (namaUnit, kodeUnit = '') => {
      const byCode = getPaletteByCode(kodeUnit)
      if (byCode) return byCode.color
      const lower = namaUnit.toLowerCase()
      if (lower.includes('paud')) return 'text-yellow-100'
      if (lower.includes('sd')) return 'text-lime-100'
      if (lower.includes('smp')) return 'text-cyan-100'
      if (lower.includes('sma') || lower.includes('smk')) return 'text-yellow-50'
      return 'text-pink-100'
    }

    const generateKeywords = (namaUnit) => {
      const keywords = []
      const lower = namaUnit.toLowerCase()
      if (lower.includes('paud')) keywords.push('anak usia dini', 'paud')
      if (lower.includes('sd')) keywords.push('sekolah dasar', 'sd')
      if (lower.includes('smp')) keywords.push('sekolah menengah pertama', 'smp')
      if (lower.includes('sma') || lower.includes('smk')) keywords.push('sekolah menengah', 'sma', 'smk')
      if (lower.includes('subbag umum') || lower.includes('umum') || lower.includes('administrasi')) {
        keywords.push('subbag umum', 'umum', 'administrasi')
      }
      return keywords
    }


    // const timkerCards = [
    //   {
    //     id: 'paud',
    //     name: 'Timker Pendidikan Anak Usia Dini',
    //     description: 'Fokus pada pengembangan dan pengelolaan program pendidikan anak usia dini secara holistik dan inklusif.',
    //     iconBg: 'bg-pink-400',
    //     fullWidth: false,
    //     keywords: ['anak usia dini', 'paud'],
    //     iconCircles: [{ cx: '12', cy: '8', r: '4', 'stroke-width': '2' }],
    //     iconPaths: [{ 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4' }]
    //   },
    //   {
    //     id: 'sd',
    //     name: 'Timker Sekolah Dasar',
    //     description: 'Bertanggung jawab atas pelaksanaan dan inovasi pendidikan tingkat sekolah dasar.',
    //     iconBg: 'bg-green-500',
    //     fullWidth: false,
    //     keywords: ['sekolah dasar', 'sd'],
    //     iconPaths: [
    //       { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 19.5A2.5 2.5 0 016.5 17H20' },
    //       { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 4h16v13H4z' }
    //     ]
    //   },
    //   {
    //     id: 'smp',
    //     name: 'Timker Sekolah Menengah Pertama',
    //     description: 'Mengelola program dan kegiatan pendidikan untuk jenjang sekolah menengah pertama.',
    //     iconBg: 'bg-blue-500',
    //     fullWidth: false,
    //     keywords: ['sekolah menengah pertama', 'smp'],
    //     iconPaths: [
    //       { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 14l9-5-9-5-9 5 9 5z' },
    //       { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 14v7' },
    //       { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M7 19c0-1.657 2.239-3 5-3s5 1.343 5 3' }
    //     ]
    //   },
    //   {
    //     id: 'sma',
    //     name: 'Timker Sekolah Menengah',
    //     description: 'Bertugas dalam pengembangan dan pengawasan pendidikan tingkat menengah atas.',
    //     iconBg: 'bg-yellow-500',
    //     fullWidth: false,
    //     keywords: ['sekolah menengah', 'sma', 'smk'],
    //     iconRects: [{ x: '3', y: '10', width: '18', height: '8', rx: '2', 'stroke-width': '2' }],
    //     iconPaths: [{ 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4v6m-6 0V4m12 6V4' }]
    //   },
    //   {
    //     id: 'subbag',
    //     name: 'Timker Subbag Umum',
    //     description: 'Mendukung operasional, administrasi, dan layanan umum untuk kelancaran seluruh program kerja.',
    //     iconBg: 'bg-gray-500',
    //     fullWidth: true,
    //     keywords: ['subbag umum', 'umum', 'administrasi'],
    //     iconCircles: [{ cx: '12', cy: '12', r: '3', 'stroke-width': '2' }],
    //     iconPaths: [{ 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' }]
    //   }
    // ]

    const normalizeCode = (value) => normalizeUnitCode(value)
    const resolveKegiatanUnitCode = (item) => {
      return item?.unit_kerja_id
        ?? item?.unit_kerja?.unit_kerja_id
        
    }

    const filteredKegiatan = computed(() => {
      if (!selectedTimker.value) return []
      
      const selectedUnitCode = normalizeCode(activeUnitCode.value)
      
      return kegiatan.value.filter((item) => {
        const itemUnitCode = normalizeCode(resolveKegiatanUnitCode(item))
        console.log(item);
        return selectedUnitCode && itemUnitCode && itemUnitCode === selectedUnitCode
      })
    })

    const totalPages = computed(() => Math.max(1, Math.ceil(filteredKegiatan.value.length / itemsPerPage)))

    const paginatedKegiatan = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return filteredKegiatan.value.slice(start, start + itemsPerPage)
    })

    const buildKegiatanDetailUrl = (item) => {
      const idKegiatan = item?.id_kegiatan ?? '-'
      const slug = slugify(item?.nama_kegiatan || '')
      return buildPublicUrl(`/kegiatan/${idKegiatan}/${slug}`)
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
      return buildStorageUrl(value)
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
      const item = selectedKegiatanDetail.value
      if (!item) return []

      const idKegiatan = item.id_kegiatan ?? '-'
      const slug = slugify(item.nama_kegiatan)
      const roles = ['Peserta', 'Panitia', 'Narasumber', 'Pendamping']

      return roles.map((role) => {
        const dbLinks = getRoleLinksFromKegiatan(item, role)
        return {
          label: role,
          url: dbLinks.formUrl || buildPublicUrl(`/formulir/${idKegiatan}/${role}/${slug}`),
          templateUrl: dbLinks.templateUrl
        }
      })
    })

    const toDateOnly = (value) => {
      if (!value) return ''
      const str = String(value).slice(0, 10)
      return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : ''
    }

    const getTodayDateOnly = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const isWithinSelectedKegiatanDateRange = computed(() => {
      const item = selectedKegiatanDetail.value
      if (!item) return false
      const start = toDateOnly(item.tanggal_mulai)
      const end = toDateOnly(item.tanggal_selesai)
      if (!start || !end) return false
      const today = getTodayDateOnly()
      return today >= start && today <= end
    })

    const isLastDayOfKegiatan = computed(() => {
      const item = selectedKegiatanDetail.value
      if (!item) return false
      const end = toDateOnly(item.tanggal_selesai)
      if (!end) return false
      const today = getTodayDateOnly()
      return today === end
    })

    const evaluasiUrl = computed(() => {
      const item = selectedKegiatanDetail.value
      if (!item) return ''
      const kode = item.id_kegiatan || ''
      const judul = item.nama_kegiatan || ''
      const slug = slugify(judul)
      return buildPublicUrl(`/evaluasi/${kode}/${slug}`)
    })

    const laporanEvaluasiUrl = computed(() => {
      const item = selectedKegiatanDetail.value
      if (!item) return ''
      const kode = item.id_kegiatan || ''
      const judul = item.nama_kegiatan || ''
      const slug = slugify(judul)
      return buildPublicUrl(`/laporan-evaluasi/${kode}/${slug}`)
    })

    const generateQrCodes = async () => {
      const entries = isWithinSelectedKegiatanDateRange.value ? (biodataLinks.value || []) : []
      const nextMap = {}

      await Promise.all(entries.map(async (item) => {
        try {
          nextMap[item.url] = await QRCode.toDataURL(item.url, {
            width: 220,
            margin: 1
          })
        } catch (error) {
          console.error('[Landing] Gagal generate QR:', error)
          nextMap[item.url] = ''
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
          console.error('[Landing] Gagal generate QR Evaluasi:', error)
        }
      }

      qrCodeMap.value = nextMap
    }

    const getQrCodeUrl = (url) => {
      return qrCodeMap.value[url] || ''
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const getStatusLabel = (status) => {
      const labels = {
        berjalan: 'Berjalan',
        akan_datang: 'Akan Datang',
        selesai: 'Selesai',
        draft: 'Draft',
        dibatalkan: 'Dibatalkan'
      }
      return labels[status] || status || '-'
    }

    const getMetodeLabel = (metode) => {
      const labels = {
        daring: 'Daring',
        luring: 'Luring',
        hybrid: 'Hybrid'
      }
      return labels[metode] || metode || '-'
    }

    const getKabupatenKotaLabel = (item) => {
      return item?.kabupaten_kota
        || item?.kab_kota
        || item?.kabupaten
        || item?.kota
        || item?.lokasi_kabupaten_kota
        || item?.kegiatan?.kabupaten_kota
        || item?.kegiatan?.kab_kota
        || '-'
    }

    const hasAnyResourceUrl = (item) => Boolean(
      item?.dokumentasi_url ||
      item?.materi_url ||
      item?.panduan_url
    )

    // const loadKegiatan = async () => {
    //   // isLoadingKegiatan.value = true
    //   try {
    //     const data = await listKegiatan()
    //     kegiatan.value = Array.isArray(data) ? data : []
    //   } catch (error) {
    //     console.error('Gagal memuat data kegiatan di landing page:', error)
    //     kegiatan.value = []
    //   } finally {
    //     isLoadingKegiatan.value = false
    //   }
    // }

    const loadKegiatan = async (selected) => {
      console.log(selected.id);
      
      isLoadingKegiatan.value = true
      try {
        const selectedUnitCode = normalizeCode(selected.id)
        activeUnitCode.value = selectedUnitCode
        const queryId = selectedUnitCode
        const data = await getAllKegiatanTimKegiatan(queryId)
        const rows = Array.isArray(data) ? data : []

        kegiatan.value = rows.filter((item) => {
          const itemUnitCode = normalizeCode(resolveKegiatanUnitCode(item))
          return selectedUnitCode && itemUnitCode && itemUnitCode === selectedUnitCode
        })
      } catch (error) {
        console.error('Gagal memuat data kegiatan di landing page:', error)
        kegiatan.value = []
      } finally {
        isLoadingKegiatan.value = false
      }
    }

    const handleSelectTimker = (card) => {
      selectTimker(card)
      loadKegiatan(card)
    }

    const selectTimker = (card) => {
      selectedTimker.value = card
      currentPage.value = 1
      nextTick(() => {
        kegiatanSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    const resetTimkerSelection = () => {
      selectedTimker.value = null
      activeUnitCode.value = ''
      currentPage.value = 1
      nextTick(() => {
        timkerCardsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    const scrollToKegiatanSection = () => {
      nextTick(() => {
        timkerCardsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    const openKegiatanDetail = (item) => {
      selectedKegiatanDetail.value = item
      showKegiatanDetailModal.value = true
    }

    const shareKegiatanDetailFromModal = async () => {
      const item = selectedKegiatanDetail.value
      if (!item) return

      const url = buildKegiatanDetailUrl(item)
      const title = item.nama_kegiatan || 'Detail Kegiatan'

      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text: 'Detail kegiatan publik',
            url
          })
          return
        } catch (error) {
          if (error?.name === 'AbortError') return
        }
      }

      try {
        await navigator.clipboard.writeText(url)
        alert('Link halaman kegiatan berhasil disalin.')
      } catch (error) {
        window.prompt('Salin link halaman kegiatan berikut:', url)
      }
    }

    const closeKegiatanDetail = () => {
      showKegiatanDetailModal.value = false
      selectedKegiatanDetail.value = null
      qrCodeMap.value = {}
    }

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value -= 1
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value += 1
    }

    onMounted(() => {
      // loadKegiatan()
      loadUnitKerja()
    })

    watch([biodataLinks, isLastDayOfKegiatan], () => {
      generateQrCodes()
    }, { immediate: true })

    return {
      timkerCards,
      kegiatan,
      isLoadingKegiatan,
      selectedTimker,
      kegiatanSectionRef,
      timkerCardsSectionRef,
      showKegiatanDetailModal,
      selectedKegiatanDetail,
      biodataLinks,
      isWithinSelectedKegiatanDateRange,
      isLastDayOfKegiatan,
      evaluasiUrl,
      laporanEvaluasiUrl,
      qrCodeMap,
      filteredKegiatan,
      paginatedKegiatan,
      currentPage,
      totalPages,
      formatDate,
      slugify,
      buildKegiatanDetailUrl,
      getQrCodeUrl,
      getStatusLabel,
      getMetodeLabel,
      getKabupatenKotaLabel,
      hasAnyResourceUrl,
      loadKegiatan,
      handleSelectTimker,
      selectTimker,
      resetTimkerSelection,
      scrollToKegiatanSection,
      openKegiatanDetail,
      shareKegiatanDetailFromModal,
      closeKegiatanDetail,
      prevPage,
      nextPage
    }
  }
}
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
