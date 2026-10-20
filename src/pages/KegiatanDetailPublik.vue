<template>
  <div class="min-h-screen bg-[#f0f4ff]">
    <!-- Top Nav -->
    <div class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <router-link to="/" class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          <span>Kembali</span>
        </router-link>
        <button
          @click="shareDetailPage"
          class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          Share
        </button>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Loading -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-lg text-gray-600 font-medium">Memuat detail kegiatan...</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 rounded-xl p-8 shadow-md">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-lg text-red-700 font-semibold">{{ errorMessage }}</p>
        </div>
      </div>

      <div v-else-if="kegiatan" class="space-y-6">
        <!-- Hero Header -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div class="bg-indigo-600 p-8">
            <div class="flex flex-col lg:flex-row gap-8">
              <div class="flex-1">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
                  <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  Detail Kegiatan
                </div>
                <h1 class="text-3xl sm:text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
                  {{ kegiatan.nama_kegiatan || '-' }}
                </h1>
                <div class="mt-4">
                  <p class="text-base text-white/90 leading-relaxed max-w-2xl" :class="!isDescExpanded && 'line-clamp-3'">
                    {{ kegiatan.deskripsi || 'Tidak ada deskripsi kegiatan.' }}
                  </p>
                  <button
                    v-if="kegiatan.deskripsi && kegiatan.deskripsi.length > 150"
                    @click="isDescExpanded = !isDescExpanded"
                    class="mt-2 text-sm text-white/80 hover:text-white font-semibold underline underline-offset-2 transition-colors"
                  >
                    {{ isDescExpanded ? 'Sembunyikan' : 'Baca selengkapnya' }}
                  </button>
                </div>
              </div>

              <div class="lg:w-[340px] flex-shrink-0">
                <div class="rounded-2xl overflow-hidden shadow-2xl bg-white/10">
                  <img
                    v-if="flyerUrl"
                    :src="flyerUrl"
                    :alt="`Flyer ${kegiatan.nama_kegiatan}`"
                    class="w-full h-[300px] object-cover"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-[300px] flex items-center justify-center text-white/70 text-sm bg-white/10">
                    <div class="text-center">
                      <svg class="w-12 h-12 mx-auto mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      Flyer belum tersedia
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resource Links (BESAR) -->
          <div class="border-t border-gray-100 p-6">
            <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">Lampiran & Materi</p>
            <div v-if="resourceLinks.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <a v-for="item in resourceLinks" :key="item.key" :href="item.url" target="_blank"
                class="group flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-300 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" :class="getResourceIconBg(item.key)">
                  <svg v-if="item.key === 'dokumentasi_url'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <svg v-else-if="item.key === 'materi_url'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <div>
                  <p class="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{{ item.label }}</p>
                  <p class="text-sm text-gray-500 mt-1">Klik untuk membuka</p>
                </div>
                <svg class="w-5 h-5 text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
            <div v-else class="text-gray-400 text-sm">Tidak ada lampiran untuk kegiatan ini.</div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500 p-5 hover:shadow-xl transition-shadow duration-200">
            <div class="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Tanggal</p>
            <p class="text-sm font-bold text-gray-800">{{ formatDate(kegiatan.tanggal_mulai) }} - {{ formatDate(kegiatan.tanggal_selesai) }}</p>
          </div>
          <div v-if="tpkRows.length <= 1" class="bg-white rounded-2xl shadow-lg border-l-4 border-purple-500 p-5 hover:shadow-xl transition-shadow duration-200">
            <div class="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Kabupaten/Kota</p>
            <p class="text-sm font-bold text-gray-800">{{ getKabupatenKotaLabel(kegiatan) }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg border-l-4 border-pink-500 p-5 hover:shadow-xl transition-shadow duration-200">
            <div class="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Metode</p>
            <p class="text-sm font-bold text-gray-800">{{ getMetodeLabel(kegiatan.metode_pelaksanaan) }}</p>
          </div>
        </div>

        <!-- TPK -->
        <div v-if="tpkRows.length > 0" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-teal-500 px-6 py-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Tempat Pelaksanaan Kegiatan (TPK)
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kabupaten/Kota</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tpk, idx) in tpkRows" :key="idx" class="border-t border-gray-100 hover:bg-cyan-50 transition-colors">
                  <td class="px-6 py-3.5 text-gray-400 font-medium">{{ idx + 1 }}</td>
                  <td class="px-6 py-3.5 text-gray-800 font-semibold">{{ tpk.lokasi || '-' }}</td>
                  <td class="px-6 py-3.5 text-gray-600">{{ tpk.kabupaten_kota || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Jadwal -->
        <div v-if="jadwalPerKelas.length > 0" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-amber-500 px-6 py-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Jadwal Kegiatan
            </h2>
          </div>
          <div class="p-6">
            <div v-for="kelas in jadwalPerKelas" :key="kelas.nama_kelas" class="mb-6 last:mb-0">
              <h3 v-if="jadwalPerKelas.length > 1" class="text-base font-bold text-indigo-600 mb-3 flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                {{ kelas.nama_kelas }}
              </h3>
              <div v-for="day in kelas.jadwal" :key="day.hari" class="mb-5 last:mb-0">
                <h4 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {{ day.hari }} - {{ formatDate(day.tanggal) }}
                </h4>
                <div class="overflow-x-auto rounded-xl border border-gray-200">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-gray-50">
                        <th class="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Waktu</th>
                        <th class="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kegiatan / Materi</th>
                        <th class="px-4 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-12">JP</th>
                        <th class="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-28">PJ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, ii) in day.items" :key="ii" class="border-t border-gray-100 transition-colors" :class="item.tipe === 'istirahat' ? 'bg-amber-50' : 'hover:bg-indigo-50'">
                        <td class="px-4 py-2.5 text-gray-500">{{ item.jam_mulai }} - {{ item.jam_selesai }}</td>
                        <td class="px-4 py-2.5" :class="item.tipe === 'istirahat' ? 'text-amber-600 font-medium italic' : 'text-gray-800 font-medium'">{{ item.kegiatan || '-' }}</td>
                        <td class="px-4 py-2.5 text-center text-gray-500">{{ item.tipe === 'istirahat' ? '-' : item.jp }}</td>
                        <td class="px-4 py-2.5 text-gray-500">{{ item.pj || '-' }}</td>
                      </tr>
                      <tr class="border-t border-gray-200 bg-indigo-50">
                        <td colspan="2" class="px-4 py-2.5 text-right text-gray-700 font-bold">Total JP</td>
                        <td class="px-4 py-2.5 text-center text-indigo-700 font-extrabold">{{ day.items.reduce((s, i) => s + (i.tipe === 'istirahat' ? 0 : Number(i.jp) || 0), 0) }}</td>
                        <td class="px-4 py-2.5"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Link Publik -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-green-500 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              Link Publik
            </h2>
            <button
              @click="copyLink(detailPageUrl)"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/35 text-white text-xs font-semibold transition-all duration-200"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              Copy Link
            </button>
          </div>

          <div class="p-6">
            <div v-if="!isWithinKegiatanDateRange" class="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6">
              <p class="text-amber-700 text-sm flex items-center gap-2 font-medium">
                <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Link tetap ditampilkan. Pengisian biodata hanya tersedia pada tanggal kegiatan.
              </p>
            </div>

            <!-- Biodata Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <a
                v-for="item in visibleBiodataLinks"
                :key="item.label"
                :href="item.url"
                target="_blank"
                class="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div class="p-5" :class="getCardHeaderBg(item.label)">
                  <div class="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center mb-3">
                    <svg v-if="getBiodataIconType(item.label) === 'form'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <svg v-else-if="getBiodataIconType(item.label) === 'list'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <svg v-else-if="getBiodataIconType(item.label) === 'certificate'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <p class="text-lg font-bold text-white leading-snug">{{ item.label }}</p>
                </div>
                <div class="bg-white px-5 py-4 flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-600">{{ getBiodataActionLabel(item.label) }}</span>
                  <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110" :class="getCardArrowBg(item.label)">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Evaluasi -->
        <div v-if="isLastDayOfKegiatan" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-rose-500 px-6 py-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              Link Evaluasi
            </h2>
          </div>
          <div class="p-6">
            <div v-if="evaluasiLinks.length === 0" class="text-gray-400 text-sm font-medium">Tidak ada TPK untuk kegiatan ini.</div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <a
                v-for="item in evaluasiLinks"
                :key="item.id_tpk"
                :href="item.url"
                target="_blank"
                class="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div class="bg-emerald-500 p-5">
                  <div class="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center mb-3">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  </div>
                  <p class="text-lg font-bold text-white leading-snug">{{ item.nama_tpk }}</p>
                </div>
                <div class="bg-white px-5 py-4 flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-600">Isi Evaluasi</span>
                  <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAPI } from '@/services/api'
import { getJadwal } from '@/services/laporan'
import database from '@/data/index.js'
import { buildPublicUrl as buildAppUrl, buildStorageUrl } from '@/utils/url'
import { getKegiatanKabupatenKotaLabel, getKegiatanLocationItems, getKegiatanLocationLabel } from '@/utils/kegiatanLocation'

export default {
  name: 'KegiatanDetailPublik',
  setup() {
    const route = useRoute()
    const kode = route.params.kode

    const kegiatan = ref(null)
    const isLoading = ref(true)
    const errorMessage = ref('')
    const qrCodeMap = ref({})
    const isDescExpanded = ref(false)

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
      return buildAppUrl(path)
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

    const getKabupatenKotaLabel = (item) => getKegiatanKabupatenKotaLabel(item)

    const flyerUrl = computed(() => {
      const flyer = kegiatan.value?.flyer || kegiatan.value?.flyer_path || kegiatan.value?.path
      if (!flyer) return ''
      if (/^https?:\/\//.test(flyer) || String(flyer).startsWith('data:')) return flyer

      return buildStorageUrl(flyer)
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
      const judul = kegiatan.value?.nama_kegiatan || route.params.slugJudul || ''
      const slug = slugify(judul)
      const item = kegiatan.value || {}
      const roles = ['Peserta', 'Panitia', 'Narasumber', 'Pendamping']
      const tpkItems = getKegiatanLocationItems(kegiatan.value)
      const roleLinks = []

      if (tpkItems.length > 0) {
        for (const tpk of tpkItems) {
          const namaTpk = tpk.kabupaten_kota ? `${tpk.lokasi} (${tpk.kabupaten_kota})` : tpk.lokasi
          for (const role of roles) {
            const dbLinks = getRoleLinksFromKegiatan(item, role)
            roleLinks.push({
              label: `Biodata ${role} - ${namaTpk}`,
              url: dbLinks.formUrl || buildPublicUrl(`/formulir/${kode}/${role}/${tpk.id_tpk}/${slug}`),
              templateUrl: dbLinks.templateUrl
            })
          }
        }
      } else {
        for (const role of roles) {
          const dbLinks = getRoleLinksFromKegiatan(item, role)
          roleLinks.push({
            label: `Biodata ${role}`,
            url: dbLinks.formUrl || buildPublicUrl(`/formulir/${kode}/${role}/${slug}`),
            templateUrl: dbLinks.templateUrl
          })
        }
      }

      return [
        ...roleLinks,
        { label: 'Daftar Peserta', url: buildPublicUrl(`/daftar-peserta/${kode}/${slug}`), templateUrl: '' },
        { label: 'Unduh Sertifikat', url: buildPublicUrl(`/unduh-sertifikat/${kode}/${slug}`), templateUrl: '' }
      ]
    })

    const visibleBiodataLinks = computed(() => {
      if (isWithinKegiatanDateRange.value) return biodataLinks.value
      const roles = ['peserta', 'panitia', 'narasumber', 'pendamping']
      return biodataLinks.value.filter(item => {
        const lower = item.label.toLowerCase()
        return !roles.some(r => lower.startsWith(`biodata ${r}`))
      })
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

    const tpkRows = computed(() => getKegiatanLocationItems(kegiatan.value))

    const jadwalData = ref({ jadwal_per_kelas: [], jadwal_harian: [] })

    const jadwalPerKelas = computed(() => {
      if (jadwalData.value.jadwal_per_kelas?.length > 0) return jadwalData.value.jadwal_per_kelas
      if (jadwalData.value.jadwal_harian?.length > 0) return [{ nama_kelas: 'Semua Peserta', jadwal: jadwalData.value.jadwal_harian }]
      return []
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

    const evaluasiLinks = computed(() => {
      if (!kegiatan.value) return []
      const kode = kegiatan.value.id_kegiatan || ''
      const slug = slugify(kegiatan.value.nama_kegiatan || '')
      const items = getKegiatanLocationItems(kegiatan.value)
      if (items.length === 0) return []
      return items.map(tpk => ({
        id_tpk: tpk.id_tpk,
        nama_tpk: tpk.kabupaten_kota ? `${tpk.lokasi} (${tpk.kabupaten_kota})` : tpk.lokasi,
        url: buildPublicUrl(`/evaluasi/${kode}/${tpk.id_tpk}/${slug}`)
      }))
    })

    const loadKegiatan = async () => {
      isLoading.value = true
      errorMessage.value = ''
      kegiatan.value = null
      console.log(kode);
      
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
        } else {
          try {
            jadwalData.value = await getJadwal(kegiatan.value.id_kegiatan)
          } catch { /* jadwal optional */ }
        }
        isLoading.value = false
      }
    }

    const generateQrCodes = async () => {
      const QRCode = (await import('qrcode')).default || (await import('qrcode'))
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
          for (const item of evaluasiLinks.value) {
            if (item.url) {
              nextMap[item.url] = await QRCode.toDataURL(item.url, { width: 220, margin: 1 })
            }
          }
        } catch (error) {
          console.error('[KegiatanDetailPublik] Gagal generate QR Evaluasi:', error)
        }
      }

      qrCodeMap.value = nextMap
    }

    const getBiodataIconType = (label) => {
      const lower = String(label || '').toLowerCase()
      if (lower.includes('daftar')) return 'list'
      if (lower.includes('sertifikat')) return 'certificate'
      return 'form'
    }

    const getCardHeaderBg = (label) => {
      const type = getBiodataIconType(label)
      const lower = String(label || '').toLowerCase()
      if (type === 'certificate') return 'bg-amber-500'
      if (type === 'list') return 'bg-emerald-500'
      if (lower.includes('peserta')) return 'bg-blue-600'
      if (lower.includes('panitia')) return 'bg-purple-600'
      if (lower.includes('narasumber')) return 'bg-teal-500'
      if (lower.includes('pendamping')) return 'bg-pink-500'
      return 'bg-blue-600'
    }

    const getCardArrowBg = (label) => {
      const type = getBiodataIconType(label)
      const lower = String(label || '').toLowerCase()
      if (type === 'certificate') return 'bg-amber-500'
      if (type === 'list') return 'bg-emerald-500'
      if (lower.includes('peserta')) return 'bg-blue-500'
      if (lower.includes('panitia')) return 'bg-purple-500'
      if (lower.includes('narasumber')) return 'bg-teal-500'
      if (lower.includes('pendamping')) return 'bg-pink-500'
      return 'bg-blue-500'
    }

    const getResourceIconBg = (key) => {
      if (key === 'dokumentasi_url') return 'bg-cyan-500'
      if (key === 'materi_url') return 'bg-amber-500'
      return 'bg-purple-600'
    }

    const getBiodataActionLabel = (label) => {
      const type = getBiodataIconType(label)
      if (type === 'list') return 'Lihat Daftar Peserta'
      if (type === 'certificate') return 'Unduh Sertifikat'
      return 'Isi Formulir Biodata'
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
      isDescExpanded,
      flyerUrl,
      detailPageUrl,
      biodataLinks,
      visibleBiodataLinks,
      resourceLinks,
      tpkRows,
      jadwalData,
      jadwalPerKelas,
      isWithinKegiatanDateRange,
      isLastDayOfKegiatan,
      evaluasiLinks,
      qrCodeMap,
      formatDate,
      getStatusLabel,
      getMetodeLabel,
      getKabupatenKotaLabel,
      getKegiatanLocationLabel,
      getQrCodeUrl,
      getBiodataIconType,
      getCardHeaderBg,
      getCardArrowBg,
      getResourceIconBg,
      getBiodataActionLabel,
      copyLink,
      shareDetailPage
    }
  }
}
</script>
