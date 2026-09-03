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
                <button
                  @click="showCekSertifikatModal = true"
                  class="px-8 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-xl font-semibold backdrop-blur border border-emerald-400/30 transition flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  Cek Sertifikat
                </button>
              </div>
            </template>

            <template v-else>
              <div class="flex items-center justify-between gap-3 mb-6">
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 rounded-full text-cyan-200 text-sm">
                  {{ selectedTimker.isSemua ? 'Semua Kegiatan' : 'Daftar Kegiatan' }}
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
              <p class="text-blue-100 text-sm mb-4">
                Menampilkan {{ filteredKegiatan.length }} kegiatan
              </p>

              <div v-if="selectedTimker.isSemua" class="mb-4">
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari kegiatan..."
                    class="w-full pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 backdrop-blur transition"
                    @input="currentPage = 1"
                  />
                </div>
              </div>

              <div v-if="isLoadingKegiatan" class="text-blue-100 text-sm py-10 text-center lg:text-left">
                Memuat daftar kegiatan...
              </div>

              <div v-else-if="paginatedKegiatan.length === 0"
                class="text-blue-100 text-sm py-10 text-center lg:text-left">
                {{ searchQuery && selectedTimker.isSemua ? 'Tidak ada kegiatan yang cocok dengan pencarian.' : 'Belum ada kegiatan.' }}
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
                        Detail
                      </a>
                      <!-- <button
                        class="px-3 py-1 rounded-lg text-xs border border-white/20 text-blue-100 hover:bg-white/10 transition"
                        @click="openKegiatanDetail(item)">
                        Detail
                      </button> -->
                    </div>
                  </div>
                  <!-- <p class="text-blue-100 text-sm mb-2">{{ item.rincian_kegiatan || item.deskripsi || '-' }}</p> -->
                  <div class="flex flex-wrap items-center gap-2 text-xs text-blue-200">
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ formatDate(item.tanggal_mulai) }} - {{
                      formatDate(item.tanggal_selesai) }}</span>
                    <!--<span class="px-2 py-1 rounded-full bg-white/10">{{ getKegiatanLocationLabel(item) }}</span>-->
                    <!--<span class="px-2 py-1 rounded-full bg-white/10">{{ getKabupatenKotaLabel(item) }}</span>-->
                    <span class="px-2 py-1 rounded-full bg-white/10">{{ formatStatus(getStatusLabel(item)) }}</span>

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
            <!-- <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Lokasi</p>
              <p class="text-white font-medium">{{ getKegiatanLocationLabel(selectedKegiatanDetail) }}</p>
            </div> -->
            <!-- <div v-if="tpkRows.length <= 1" class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Kabupaten/Kota</p>
              <p class="text-white">{{ getKabupatenKotaLabel(selectedKegiatanDetail) }}</p>
            </div> -->
            <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Metode Pelaksanaan</p>
              <p class="text-white">{{ getMetodeLabel(selectedKegiatanDetail.metode_pelaksanaan) }}</p>
            </div>
            <!-- <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Status</p>
              <p class="text-white">{{ getStatusLabel(selectedKegiatanDetail.status) }}</p>
            </div> -->
            <!-- <div class="bg-white/5 rounded-lg p-3 border border-white/10">
              <p class="text-blue-200">Ringkasan Peserta</p>
              <p class="text-white">{{ selectedKegiatanDetail.peserta_ringkasan || '-' }}</p>
            </div> -->
          </div>

          <div v-if="tpkRows.length > 0" class="col-span-full rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 class="text-white font-semibold mb-3">Tempat Pelaksanaan Kegiatan (TPK)</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="text-blue-200">
                  <tr>
                    <th class="px-4 py-2 text-left font-medium">No</th>
                    <th class="px-4 py-2 text-left font-medium">Lokasi</th>
                    <th class="px-4 py-2 text-left font-medium">Kabupaten/Kota</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tpk, idx) in tpkRows" :key="idx" class="border-t border-white/10">
                    <td class="px-4 py-2 text-blue-100">{{ idx + 1 }}</td>
                    <td class="px-4 py-2 text-white font-medium">{{ tpk.lokasi || '-' }}</td>
                    <td class="px-4 py-2 text-blue-100">{{ tpk.kabupaten_kota || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-white/5 rounded-lg p-4 border border-white/10">

  <!-- Total Peserta -->
  <div class="mb-6">
    <p class="text-blue-200 text-sm">Total Peserta</p>
    <p class="text-white text-lg font-semibold">
      {{ selectedKegiatanDetail.total_peserta ?? '-' }}
    </p>
  </div>

  <div class="mb-4">
    <a
      :href="buildDaftarPesertaUrl(selectedKegiatanDetail)"
      target="_blank"
      class="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400"
    >
      Lihat Peserta
    </a>
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
  
  <div v-if="isLastDayOfKegiatan" class="space-y-4">
    <p v-if="evaluasiLinks.length === 0" class="text-slate-400 text-xs">Tidak ada TPK untuk kegiatan ini.</p>

    <div v-for="item in evaluasiLinks" :key="item.id_tpk"
      class="bg-white/5 border border-white/10 rounded-lg p-4
             grid grid-cols-1 sm:grid-cols-[auto_1fr]
             gap-6 text-sm items-center transition hover:bg-white/10"
    >
      <!-- Kolom QR -->
      <div class="flex flex-col items-center sm:items-start">
        <div class="bg-white p-2 rounded-lg w-fit shadow">
          <img
            v-if="qrCodeMap[item.url]"
            :src="qrCodeMap[item.url]"
            :alt="`QR ${item.nama_tpk}`"
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
        <strong class="text-white mb-1">{{ item.nama_tpk }}</strong>
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

    <!-- Cek Sertifikat Modal -->
    <div v-if="showCekSertifikatModal" class="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center" @click.self="closeCekSertifikatModal">
      <div class="w-full max-w-lg bg-slate-900 border border-white/20 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-white font-semibold text-lg flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            Cek Keaslian Sertifikat
          </h3>
          <button class="text-blue-100 hover:text-white" @click="closeCekSertifikatModal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-5 overflow-y-auto">
          <div>
            <label class="block text-blue-200 text-sm mb-2">Upload file sertifikat (PDF)</label>
            <label
              class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-emerald-400/50 hover:bg-white/5 transition"
              :class="{ 'border-emerald-400/50 bg-emerald-50/5': certFileName }"
            >
              <input
                type="file"
                accept="application/pdf"
                class="hidden"
                @change="handleCertFileChange"
              />
              <svg v-if="!certFileName" class="w-10 h-10 text-blue-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <svg v-else class="w-10 h-10 text-emerald-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span v-if="!certFileName" class="text-blue-200 text-sm">Klik untuk memilih file PDF</span>
              <span v-else class="text-emerald-300 text-sm font-medium truncate max-w-[90%]">{{ certFileName }}</span>
            </label>
          </div>

          <button
            @click="cekKeaslianSertifikat"
            :disabled="!certFile || isScanningCert"
            class="w-full py-3 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2"
            :class="certFile && !isScanningCert ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-700 cursor-not-allowed opacity-60'"
          >
            <svg v-if="isScanningCert" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {{ isScanningCert ? 'Memindai...' : 'Cek Keaslian' }}
          </button>

          <div v-if="certScanError" class="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
            <p class="text-red-300 text-sm flex items-start gap-2">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ certScanError }}
            </p>
          </div>

          <div v-if="certVerificationData" class="space-y-4">
            <div class="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4 flex items-center gap-3">
              <svg class="w-8 h-8 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <div>
                <p class="text-emerald-300 font-bold text-base">Sertifikat Terverifikasi</p>
                <p class="text-emerald-200/80 text-xs">Dokumen ini tercatat dalam sistem dan dinyatakan asli.</p>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div class="px-4 py-3 bg-emerald-500/10 border-b border-white/10 flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <h4 class="text-emerald-300 font-semibold text-sm">Data Peserta</h4>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Nama</span>
                  <span class="text-white text-sm font-medium">{{ certVerificationData.peserta.nama }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">NIP</span>
                  <span class="text-white text-sm">{{ certVerificationData.peserta.nip }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Pangkat</span>
                  <span class="text-white text-sm">{{ certVerificationData.peserta.pangkat }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Jabatan</span>
                  <span class="text-white text-sm">{{ certVerificationData.peserta.jabatan }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Instansi</span>
                  <span class="text-white text-sm">{{ certVerificationData.peserta.instansi }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Peran</span>
                  <span class="text-white text-sm">{{ certVerificationData.peserta.peran }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Kab/Kota</span>
                  <span class="text-white text-sm">{{ certVerificationData.peserta.kab_kota }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div class="px-4 py-3 bg-cyan-500/10 border-b border-white/10 flex items-center gap-2">
                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <h4 class="text-cyan-300 font-semibold text-sm">Mengikuti Kegiatan</h4>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Nama Kegiatan</span>
                  <span class="text-white text-sm font-medium">{{ certVerificationData.kegiatan.nama_kegiatan }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Tanggal</span>
                  <span class="text-white text-sm">
                    {{ formatDate(certVerificationData.kegiatan.tanggal_mulai) }}
                    s.d.
                    {{ formatDate(certVerificationData.kegiatan.tanggal_selesai) }}
                  </span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Metode</span>
                  <span class="text-white text-sm">{{ getMetodeLabel(certVerificationData.kegiatan.metode_pelaksanaan) }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Lokasi</span>
                  <span class="text-white text-sm">{{ certVerificationData.kegiatan.lokasi }}<template v-if="certVerificationData.kegiatan.kabupaten_kota !== '-'">, {{ certVerificationData.kegiatan.kabupaten_kota }}</template></span>
                </div>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div class="px-4 py-3 bg-amber-500/10 border-b border-white/10 flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <h4 class="text-amber-300 font-semibold text-sm">Disahkan oleh</h4>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Nama</span>
                  <span class="text-white text-sm font-medium">{{ certVerificationData.penandatangan.nama }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Jabatan</span>
                  <span class="text-white text-sm">{{ certVerificationData.penandatangan.jabatan }}</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-blue-300 text-xs w-28 flex-shrink-0 pt-0.5">Pada tanggal</span>
                  <span class="text-white text-sm">{{ formatDate(certVerificationData.penandatangan.tanggal_ttd) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="certQrResult !== null && !certVerificationData && !certScanError" class="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 space-y-2">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-blue-300 font-semibold text-sm">QR Code Terdeteksi</span>
            </div>
            <p class="text-blue-200 text-xs">Kode QR: <span class="font-mono text-white">{{ certQrResult }}</span></p>
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
            <button
              type="button"
              class="text-blue-200 hover:text-white text-sm transition"
              @click="downloadPOS"
            >
              Unduh POS
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
import { getKegiatanTim, getAllKegiatanTimKegiatan, listKegiatan } from '@/services/kegiatan'
import { getUnitKerja } from '@/services/unit_kerja'
import { fetchAPI } from '@/services/api'
import database from '@/data/index.js'
import { buildPublicUrl, buildStorageUrl } from '@/utils/url'
import { getKegiatanKabupatenKotaLabel, getKegiatanLocationItems, getKegiatanLocationLabel } from '@/utils/kegiatanLocation'
import { generatePOSDocx } from '@/utils/generatePOS'
import jsQR from 'jsqr'

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

    const searchQuery = ref('')

    const showCekSertifikatModal = ref(false)
    const certFile = ref(null)
    const certFileName = ref('')
    const isScanningCert = ref(false)
    const certScanError = ref('')
    const certQrResult = ref(null)
    const certVerificationData = ref(null)

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

    const SEMUA_CARD = {
      id: 'semua',
      name: 'Semua',
      description: 'Menampilkan seluruh kegiatan dari semua tim kerja.',
      iconBg: 'bg-gradient-to-br from-cyan-400 to-teal-500',
      iconColor: 'text-white',
      fullWidth: true,
      keywords: ['semua', 'all'],
      isSemua: true,
      iconCircles: [],
      iconRects: [],
      iconPaths: [
        { 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 6h16M4 12h16M4 18h16' }
      ]
    }

    const buildDefaultTimkerCards = () => ([
      { id: 'paud', name: 'Timker Pendidikan Anak Usia Dini', description: 'Fokus pada pengembangan dan pengelolaan program pendidikan anak usia dini secara holistik dan inklusif.', iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500', iconColor: 'text-yellow-100', fullWidth: false, keywords: ['anak usia dini', 'paud'], ...getIconConfig('paud', '001') },
      { id: 'sd', name: 'Timker Sekolah Dasar', description: 'Bertanggung jawab atas pelaksanaan dan inovasi pendidikan tingkat sekolah dasar.', iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600', iconColor: 'text-lime-100', fullWidth: false, keywords: ['sekolah dasar', 'sd'], ...getIconConfig('sd', '002') },
      { id: 'smp', name: 'Timker Sekolah Menengah Pertama', description: 'Mengelola program dan kegiatan pendidikan untuk jenjang sekolah menengah pertama.', iconBg: 'bg-gradient-to-br from-sky-400 to-blue-600', iconColor: 'text-cyan-100', fullWidth: false, keywords: ['sekolah menengah pertama', 'smp'], ...getIconConfig('smp', '003') },
      { id: 'sma', name: 'Timker Sekolah Menengah', description: 'Bertugas dalam pengembangan dan pengawasan pendidikan tingkat menengah atas.', iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500', iconColor: 'text-yellow-50', fullWidth: false, keywords: ['sekolah menengah', 'sma', 'smk'], ...getIconConfig('sma', '004') },
      { id: 'subbag', name: 'Timker Subbag Umum', description: 'Mendukung operasional, administrasi, dan layanan umum untuk kelancaran seluruh program kerja.', iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600', iconColor: 'text-pink-100', fullWidth: true, keywords: ['subbag umum', 'umum', 'administrasi'], ...getIconConfig('subbag umum', '005') },
      SEMUA_CARD,
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

        timkerCards.value = [
          
          ...rows.map((item) => {
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
          }),
          SEMUA_CARD,
        ]


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
      
      if (activeUnitCode.value === 'semua') {
        const q = searchQuery.value.toLowerCase().trim()
        if (!q) return kegiatan.value
        return kegiatan.value.filter((item) => {
          const nama = String(item.nama_kegiatan || '').toLowerCase()
          const deskripsi = String(item.deskripsi || '').toLowerCase()
          return nama.includes(q) || deskripsi.includes(q)
        })
      }

      const selectedUnitCode = normalizeCode(activeUnitCode.value)
      
      return kegiatan.value.filter((item) => {
        const itemUnitCode = normalizeCode(resolveKegiatanUnitCode(item))
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

    const buildDaftarPesertaUrl = (item) => {
      const idKegiatan = item?.id_kegiatan ?? '-'
      const slug = slugify(item?.nama_kegiatan || '')
      return buildPublicUrl(`/daftar-peserta/${idKegiatan}/${slug}`)
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

    const evaluasiLinks = computed(() => {
      const item = selectedKegiatanDetail.value
      if (!item) return []
      const kode = item.id_kegiatan || ''
      const slug = slugify(item.nama_kegiatan || '')
      const tpkItems = getKegiatanLocationItems(item)
      if (tpkItems.length === 0) return []
      return tpkItems.map(tpk => ({
        id_tpk: tpk.id_tpk,
        nama_tpk: tpk.kabupaten_kota ? `${tpk.lokasi} (${tpk.kabupaten_kota})` : tpk.lokasi,
        url: buildPublicUrl(`/evaluasi/${kode}/${tpk.id_tpk}/${slug}`)
      }))
    })

    const generateQrCodes = async () => {
      const QRCode = (await import('qrcode')).default || (await import('qrcode'))
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
          for (const item of evaluasiLinks.value) {
            if (item.url) {
              nextMap[item.url] = await QRCode.toDataURL(item.url, { width: 220, margin: 1 })
            }
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

    const getStatusLabel = (item) => {
      // console.log(item.tanggal_mulai, item.tanggal_selesai, item.status);
      
      // const labels = {
      //   berjalan: 'Berjalan',
      //   akan_datang: 'Akan Datang',
      //   selesai: 'Selesai',
      //   draft: 'Draft',
      //   dibatalkan: 'Dibatalkan'
      // }
      // return labels[status] || status || '-'
      const startDate =item.tanggal_mulai
      const endDate = item.tanggal_selesai

      if (!startDate || !endDate) return item?.status || ''

      const today = new Date().toISOString().split('T')[0];

      // console.log('today:', today, 'startDate:', startDate, 'endDate:', endDate);

      if (today < startDate) return 'akan_datang'
      if (today > endDate) return 'selesai'
      return 'berjalan'
    }

    const formatStatus = (status) => {
      const statusMap = {
        'berjalan': 'Berjalan',
        'akan_datang': 'Akan Datang',
        'selesai': 'Selesai'
      }
      return statusMap[status] || status
    }

    const getStatusColor = (status) => {
      const colorMap = {
        'berjalan': 'bg-blue-500',
        'akan_datang': 'bg-amber-500',
        'selesai': 'bg-emerald-500'
      }
      return colorMap[status] || 'bg-slate-400'
    }

    const getStatusBadge = (status) => {
      const badgeMap = {
        'berjalan': 'inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold',
        'akan_datang': 'inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold',
        'selesai': 'inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold'
      }
      return badgeMap[status] || 'inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-semibold'
    }

    const getMetodeLabel = (metode) => {
      const labels = {
        daring: 'Daring',
        luring: 'Luring',
        hybrid: 'Hybrid'
      }
      return labels[metode] || metode || '-'
    }

    const getKabupatenKotaLabel = (item) => getKegiatanKabupatenKotaLabel(item)

    const tpkRows = computed(() => getKegiatanLocationItems(selectedKegiatanDetail.value))

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
      
      isLoadingKegiatan.value = true
      searchQuery.value = ''
      try {
        if (selected.id === 'semua') {
          activeUnitCode.value = 'semua'
          const data = await listKegiatan()
          kegiatan.value = Array.isArray(data) ? data : []
        } else {
          const selectedUnitCode = normalizeCode(selected.id)
          activeUnitCode.value = selectedUnitCode
          const queryId = selectedUnitCode
          const data = await getAllKegiatanTimKegiatan(queryId)
          const rows = Array.isArray(data) ? data : []

          kegiatan.value = rows.filter((item) => {
            const itemUnitCode = normalizeCode(resolveKegiatanUnitCode(item))
            return selectedUnitCode && itemUnitCode && itemUnitCode === selectedUnitCode
          })
        }
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

    const downloadPOS = async () => {
      try {
        await generatePOSDocx()
      } catch (error) {
        console.error('Gagal mengunduh POS:', error)
      }
    }

    const openKegiatanDetail = async (item) => {
      selectedKegiatanDetail.value = item
      showKegiatanDetailModal.value = true

      try {
        const id = item?.id_kegiatan ?? item?.id
        if (id) {
          const detail = await fetchAPI(`kegiatan/${id}`)
          if (detail && !Array.isArray(detail)) {
            selectedKegiatanDetail.value = detail
          }
        }
      } catch {
        // tetap gunakan data list jika fetch detail gagal
      }
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

    const handleCertFileChange = (event) => {
      const file = event.target.files[0]
      if (file && file.type === 'application/pdf') {
        certFile.value = file
        certFileName.value = file.name
        certScanError.value = ''
        certQrResult.value = null
      } else {
        certFile.value = null
        certFileName.value = ''
        certScanError.value = 'File harus berformat PDF.'
      }
    }

    const isValidUrl = (str) => {
      try {
        const url = new URL(str)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
    }

    const cekKeaslianSertifikat = async () => {
      if (!certFile.value) return

      isScanningCert.value = true
      certScanError.value = ''
      certQrResult.value = null
      certVerificationData.value = null

      try {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()

        const arrayBuffer = await certFile.value.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        let qrFound = false

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: 2.0 })

          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')

          await page.render({ canvasContext: ctx, viewport }).promise

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)

          if (code && code.data) {
            certQrResult.value = code.data
            qrFound = true
            break
          }
        }

        if (!qrFound) {
          certScanError.value = 'QR Code tidak ditemukan dalam file sertifikat ini.'
          return
        }

        const kodeQr = encodeURIComponent(certQrResult.value)
        const rawResponse = await fetchAPI(`sertifikat/cek/${kodeQr}`)

        const items = Array.isArray(rawResponse) ? rawResponse : (rawResponse?.data || [])
        const item = items[0] || null

        if (!item) {
          certScanError.value = 'Sertifikat tidak ditemukan dalam sistem.'
          return
        }

        const p = item.peserta || {}
        const k = item.kegiatan || {}
        const ttd = item.penandatangan || {}
        const batch = item.batch || {}
        const lok = item.lokasi || {}

        certVerificationData.value = {
          peserta: {
            nama: p.nama_lengkap || '-',
            nip: p.nip || '-',
            pangkat: p.pangkat || '-',
            jabatan: p.jabatan || '-',
            instansi: p.nama_instansi || '-',
            peran: p.peran || '-',
            kab_kota: p.kab_kota || '-'
          },
          kegiatan: {
            nama_kegiatan: k.nama_kegiatan || '-',
            tanggal_mulai: k.tanggal_mulai || '-',
            tanggal_selesai: k.tanggal_selesai || '-',
            metode_pelaksanaan: k.metode_pelaksanaan || '-',
            lokasi: lok.lokasi || '-',
            kabupaten_kota: lok.kabupaten_kota || '-'
          },
          penandatangan: {
            nama: ttd.nama || '-',
            jabatan: ttd.nama_jabatan || ttd.jabatan_pdm || '-',
            tanggal_ttd: batch.tanggal_ttd || '-'
          }
        }
      } catch (error) {
        console.error('Gagal memindai sertifikat:', error)
        const msg = String(error?.message || '')
        if (msg.includes('404') || msg.includes('tidak ditemukan')) {
          certScanError.value = 'Sertifikat tidak ditemukan dalam sistem.'
        } else if (msg.includes('Tidak dapat terhubung')) {
          certScanError.value = 'Tidak dapat terhubung ke server. Pastikan backend berjalan.'
        } else {
          certScanError.value = 'Gagal memverifikasi sertifikat. ' + msg
        }
      } finally {
        isScanningCert.value = false
      }
    }

    const closeCekSertifikatModal = () => {
      showCekSertifikatModal.value = false
      certFile.value = null
      certFileName.value = ''
      certScanError.value = ''
      certQrResult.value = null
      certVerificationData.value = null
      isScanningCert.value = false
    }

    const formatCertLabel = (key) => {
      if (!key) return ''
      const labels = {
        nama: 'Nama',
        nama_peserta: 'Nama Peserta',
        nip: 'NIP',
        nip_nik: 'NIP/NIK',
        nik: 'NIK',
        email: 'Email',
        no_telepon: 'No. Telepon',
        telepon: 'Telepon',
        instansi: 'Instansi',
        unit_kerja: 'Unit Kerja',
        jabatan: 'Jabatan',
        pangkat_golongan: 'Pangkat/Golongan',
        nama_kegiatan: 'Nama Kegiatan',
        tanggal_mulai: 'Tanggal Mulai',
        tanggal_selesai: 'Tanggal Selesai',
        tanggal_ttd: 'Tanggal TTD',
        nama_penandatangan: 'Nama Penandatangan',
        jabatan_penandatangan: 'Jabatan Penandatangan',
        peran: 'Peran',
        status: 'Status',
        id_kegiatan: 'ID Kegiatan',
        id_peserta: 'ID Peserta',
        kode_qr: 'Kode QR',
        nomor_sertifikat: 'No. Sertifikat',
        tanggal_terbit: 'Tanggal Terbit',
        metode_pelaksanaan: 'Metode Pelaksanaan',
        deskripsi: 'Deskripsi',
        lokasi: 'Lokasi'
      }
      if (labels[key]) return labels[key]
      return String(key).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    }

    
    onMounted(() => {
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
      evaluasiLinks,
      qrCodeMap,
      filteredKegiatan,
      paginatedKegiatan,
      currentPage,
      totalPages,
      searchQuery,
      formatDate,
      slugify,
      buildKegiatanDetailUrl,
      buildDaftarPesertaUrl,
      getQrCodeUrl,
      getStatusLabel,
      formatStatus,
      getStatusColor,
      getMetodeLabel,
      getKabupatenKotaLabel,
      getKegiatanLocationLabel,
      tpkRows,
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
      nextPage,
      downloadPOS,
      showCekSertifikatModal,
      certFile,
      certFileName,
      isScanningCert,
      certScanError,
      certQrResult,
      certVerificationData,
      handleCertFileChange,
      cekKeaslianSertifikat,
      closeCekSertifikatModal,
      formatCertLabel,
      isValidUrl
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
