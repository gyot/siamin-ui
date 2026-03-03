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
              to="/verify-sertifikat" 
              class="hidden sm:flex items-center gap-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
              </svg>
              <span>Verifikasi Sertifikat</span>
            </RouterLink> -->
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
          <!-- Feature Cards -->
          <div class="grid grid-cols-2 gap-4 mb-10 lg:mb-0">
            <button v-for="card in timkerCards" :key="card.id"
              class="text-left bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition"
              :class="{ 'col-span-2': card.fullWidth, 'ring-2 ring-cyan-300/70': selectedTimker && selectedTimker.id === card.id }"
              @click="selectTimker(card); loadKegiatan(card.id)" type="button">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" :class="card.iconBg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">d
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
          <!-- welcome / daftar kegiatan -->
          <div class="text-center lg:text-left">
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
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300"><b class="text-yellow-400">I</b>nformasi
                  <b class="text-yellow-400">K</b>egiatan</span>)
              </h2>
              <p class="text-blue-100 text-lg mb-8 leading-relaxed">
                Platform terintegrasi untuk mengelola kegiatan, peserta, surat tugas, dan sertifikat digital secara
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
                    <button
                      class="px-3 py-1 rounded-lg text-xs border border-white/20 text-blue-100 hover:bg-white/10 transition"
                      @click="openKegiatanDetail(item)">
                      Detail
                    </button>
                  </div>
                  <!-- <p class="text-blue-100 text-sm mb-2">{{ item.rincian_kegiatan || item.deskripsi || '-' }}</p> -->
                  <div class="flex flex-wrap items-center gap-2 text-xs text-blue-200">
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ formatDate(item.tanggal_mulai) }} - {{
                      formatDate(item.tanggal_selesai) }}</span>
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ item.lokasi || '-' }}</span>
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
          <button class="text-blue-100 hover:text-white" @click="closeKegiatanDetail">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
          <div class="bg-white/5 rounded-lg p-3 border border-white/10">
            <p class="text-blue-200">Total Peserta</p>
            <p class="text-white">{{ selectedKegiatanDetail.total_peserta ?? '-' }}</p><br>
            <p class="text-blue-200">Link Biodata</p>
            <strong class="text-white">Peserta:</strong> <br> <a :href="`formulir/${selectedKegiatanDetail.id_kegiatan ?? '-'}/Peserta/${slugify(selectedKegiatanDetail.nama_kegiatan)}`" target="_blank"
              class="text-cyan-300 hover:text-cyan-200 break-all">{{ baseUrl}}/formulir/Peserta/{{ slugify(selectedKegiatanDetail.nama_kegiatan) }}</a><br>
            <strong class="text-white">Panitia:</strong> <br> <a :href="`${baseUrl}formulir/${selectedKegiatanDetail.id_kegiatan ?? '-'}/Panitia/${slugify(selectedKegiatanDetail.nama_kegiatan)}`" target="_blank"
              class="text-cyan-300 hover:text-cyan-200 break-all">{{ baseUrl}}/formulir/Panitia/{{ slugify(selectedKegiatanDetail.nama_kegiatan) }}</a><br>
            <strong class="text-white">Narasumber:</strong> <br> <a :href="`${baseUrl}formulir/${selectedKegiatanDetail.id_kegiatan ?? '-'}/Narasumber/${slugify(selectedKegiatanDetail.nama_kegiatan)}`" target="_blank"
              class="text-cyan-300 hover:text-cyan-200 break-all">{{ baseUrl}}/formulir/Narasumber/{{ slugify(selectedKegiatanDetail.nama_kegiatan) }}</a>
            <br><br>
            <strong class="text-white">Daftar Peserta:</strong> <br>
            <a :href="`${baseUrl}/daftar-peserta/${selectedKegiatanDetail.id_kegiatan ?? '-'}/${slugify(selectedKegiatanDetail.nama_kegiatan)}`" target="_blank"
              class="text-cyan-300 hover:text-cyan-200 break-all">
              {{ baseUrl }}/daftar-peserta/{{ selectedKegiatanDetail.id_kegiatan ?? '-' }}/{{ slugify(selectedKegiatanDetail.nama_kegiatan) }}
            </a>
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
              <strong class="text-white">Dokumentasi:</strong><a v-if="selectedKegiatanDetail.dokumentasi_url" :href="selectedKegiatanDetail.dokumentasi_url" target="_blank"
                class="block text-cyan-300 hover:text-cyan-200 break-all"> {{
                  selectedKegiatanDetail.dokumentasi_url }}</a>
              <strong class="text-white">Materi: </strong><a v-if="selectedKegiatanDetail.materi_url" :href="selectedKegiatanDetail.materi_url" target="_blank"
                class="block text-cyan-300 hover:text-cyan-200 break-all">{{ selectedKegiatanDetail.materi_url }}</a>
              <strong class="text-white">Panduan: </strong><a v-if="selectedKegiatanDetail.panduan_url" :href="selectedKegiatanDetail.panduan_url" target="_blank"
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
          <p class="text-blue-200 text-sm">© 2025 SIMAIK - Kementerian Pendidikan Dasar dan Menengah BPMP Nusa Tenggara Barat</p>
          <div class="flex items-center gap-6">
            <RouterLink to="/verify-sertifikat" class="text-blue-200 hover:text-white text-sm transition">Verifikasi
              Sertifikat</RouterLink>
            <a href="#" class="text-blue-200 hover:text-white text-sm transition">Bantuan</a>
            <a href="#" class="text-blue-200 hover:text-white text-sm transition">Kontak</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { getKegiatanTim } from '@/services/kegiatan'
import { getUnitKerja } from '@/services/unit_kerja'

export default {
  name: 'Landing',
  setup() {
    const kegiatan = ref([])
    const isLoadingKegiatan = ref(false)
    const selectedTimker = ref(null)
    const showKegiatanDetailModal = ref(false)
    const selectedKegiatanDetail = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 4
    const baseUrl =  window.location.origin
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

    const buildDefaultTimkerCards = () => ([
      { id: 'paud', name: 'Timker Pendidikan Anak Usia Dini', description: 'Fokus pada pengembangan dan pengelolaan program pendidikan anak usia dini secara holistik dan inklusif.', iconBg: 'bg-pink-400', fullWidth: false, keywords: ['anak usia dini', 'paud'], iconPaths: defaultIcon() },
      { id: 'sd', name: 'Timker Sekolah Dasar', description: 'Bertanggung jawab atas pelaksanaan dan inovasi pendidikan tingkat sekolah dasar.', iconBg: 'bg-green-500', fullWidth: false, keywords: ['sekolah dasar', 'sd'], iconPaths: defaultIcon() },
      { id: 'smp', name: 'Timker Sekolah Menengah Pertama', description: 'Mengelola program dan kegiatan pendidikan untuk jenjang sekolah menengah pertama.', iconBg: 'bg-blue-500', fullWidth: false, keywords: ['sekolah menengah pertama', 'smp'], iconPaths: defaultIcon() },
      { id: 'sma', name: 'Timker Sekolah Menengah', description: 'Bertugas dalam pengembangan dan pengawasan pendidikan tingkat menengah atas.', iconBg: 'bg-yellow-500', fullWidth: false, keywords: ['sekolah menengah', 'sma', 'smk'], iconPaths: defaultIcon() },
      { id: 'subbag', name: 'Timker Subbag Umum', description: 'Mendukung operasional, administrasi, dan layanan umum untuk kelancaran seluruh program kerja.', iconBg: 'bg-gray-500', fullWidth: true, keywords: ['subbag umum', 'umum', 'administrasi'], iconPaths: defaultIcon() }
    ])
    const timkerCards = ref(buildDefaultTimkerCards())
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
          return {
            id: item.kode_unit || item.id,
            name,
            description: item.keterangan !== '-'
              ? item.keterangan
              : `Unit kerja ${name}${item.tahun ? ` tahun ${item.tahun}` : ''}`,
            iconBg: getIconBg(name),
            fullWidth: lowerName.includes('subbag') || lowerName.includes('umum'),
            keywords: generateKeywords(name),
            iconPaths: defaultIcon()
          }
        })

        console.log('Formatted Unit Kerja:', timkerCards)

      } catch (error) {
        console.error('Gagal memuat data unit kerja:', error)
        timkerCards.value = buildDefaultTimkerCards()
      }
    }
    const getIconBg = (namaUnit) => {
      const lower = namaUnit.toLowerCase()
      if (lower.includes('paud')) return 'bg-pink-400'
      if (lower.includes('sd')) return 'bg-green-500'
      if (lower.includes('smp')) return 'bg-blue-500'
      if (lower.includes('sma') || lower.includes('smk')) return 'bg-yellow-500'
      return 'bg-gray-500'
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

    const normalizeText = (val) => String(val || '').toLowerCase()

    const filteredKegiatan = computed(() => {
      if (!selectedTimker.value) return []
      const keywords = selectedTimker.value.keywords || []
      const filtered = kegiatan.value.filter((item) => {
        const candidateFields = [
          item.timker,
          item.nama_timker,
          item.tim_kerja,
          item.nama_tim_kerja,
          item.unit_kerja,
          item.bidang,
          item.rincian_kegiatan,
          item.deskripsi,
          item.nama_kegiatan
        ]
        const combined = candidateFields.map(normalizeText).join(' ')
        return keywords.some((keyword) => combined.includes(normalizeText(keyword)))
      })

      if (filtered.length > 0) return filtered

      const hasAnyTimkerField = kegiatan.value.some((item) => (
        item.timker || item.nama_timker || item.tim_kerja || item.nama_tim_kerja || item.unit_kerja || item.bidang
      ))

      return hasAnyTimkerField ? filtered : kegiatan.value
    })

    const totalPages = computed(() => Math.max(1, Math.ceil(filteredKegiatan.value.length / itemsPerPage)))

    const paginatedKegiatan = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return filteredKegiatan.value.slice(start, start + itemsPerPage)
    })

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

    const hasAnyResourceUrl = (item) => Boolean(
      item?.dokumentasi_url ||
      item?.materi_url ||
      item?.panduan_url ||
      item?.laporan_url ||
      item?.surat_menyurat_url
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

    const loadKegiatan = async (id) => {
      isLoadingKegiatan.value = true
      try {
        const data = await getKegiatanTim(id)
        kegiatan.value = Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Gagal memuat data kegiatan di landing page:', error)
        kegiatan.value = []
      } finally {
        isLoadingKegiatan.value = false
      }
    }

    const selectTimker = (card) => {
      selectedTimker.value = card
      currentPage.value = 1
    }

    const resetTimkerSelection = () => {
      selectedTimker.value = null
      currentPage.value = 1
    }

    const openKegiatanDetail = (item) => {
      selectedKegiatanDetail.value = item
      showKegiatanDetailModal.value = true
    }

    const closeKegiatanDetail = () => {
      showKegiatanDetailModal.value = false
      selectedKegiatanDetail.value = null
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

    return {
      timkerCards,
      kegiatan,
      isLoadingKegiatan,
      selectedTimker,
      showKegiatanDetailModal,
      selectedKegiatanDetail,
      filteredKegiatan,
      paginatedKegiatan,
      currentPage,
      totalPages,
      formatDate,
      slugify,
      getStatusLabel,
      getMetodeLabel,
      hasAnyResourceUrl,
      loadKegiatan,
      selectTimker,
      resetTimkerSelection,
      openKegiatanDetail,
      closeKegiatanDetail,
      prevPage,
      nextPage,
      baseUrl
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
