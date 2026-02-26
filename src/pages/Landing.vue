<template>
  <div class="min-h-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
    <!-- Header -->
    <header class="relative z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="Logo SIAMIN" class="h-16 object-contain">
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
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full text-blue-200 text-sm mb-6">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Sistem Terintegrasi
            </div>
            <h2 class="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Sistem Informasi<br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Administrasi Kegiatan</span>
            </h2>
            <p class="text-blue-100 text-lg mb-8 leading-relaxed">
              Platform terintegrasi untuk mengelola kegiatan, peserta, surat tugas, dan sertifikat digital secara efisien dan transparan.
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
          </div>
          
          <!-- Feature Cards -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Timker Pendidikan Anak Usia Dini -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-pink-400 rounded-xl flex items-center justify-center mb-4">
                <!-- Icon anak usia dini: baby/child -->
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" stroke-width="2"/>
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Timker Pendidikan Anak Usia Dini</h3>
              <p class="text-blue-200 text-sm">Fokus pada pengembangan dan pengelolaan program pendidikan anak usia dini secara holistik dan inklusif.</p>
            </div>
            <!-- Timker Sekolah Dasar -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <!-- Icon sekolah dasar: book -->
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v13H4z"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Timker Sekolah Dasar</h3>
              <p class="text-blue-200 text-sm">Bertanggung jawab atas pelaksanaan dan inovasi pendidikan tingkat sekolah dasar.</p>
            </div>
            <!-- Timker Sekolah Menengah Pertama -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <!-- Icon SMP: graduation cap -->
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 14v7"/>
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 19c0-1.657 2.239-3 5-3s5 1.343 5 3"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Timker Sekolah Menengah Pertama</h3>
              <p class="text-blue-200 text-sm">Mengelola program dan kegiatan pendidikan untuk jenjang sekolah menengah pertama.</p>
            </div>
            <!-- Timker Sekolah Menengah -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                <!-- Icon SMA: school building -->
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="10" width="18" height="8" rx="2" stroke-width="2"/>
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v6m-6 0V4m12 6V4"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Timker Sekolah Menengah</h3>
              <p class="text-blue-200 text-sm">Bertugas dalam pengembangan dan pengawasan pendidikan tingkat menengah atas.</p>
            </div>
            <!-- Timker Subbag Umum -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition col-span-2">
              <div class="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center mb-4">
                <!-- Icon umum: cog/settings -->
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" stroke-width="2"/>
                  <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Timker Subbag Umum</h3>
              <p class="text-blue-200 text-sm">Mendukung operasional, administrasi, dan layanan umum untuk kelancaran seluruh program kerja.</p>
            </div>
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

    <!-- Footer -->
    <footer class="border-t border-white/10 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-blue-200 text-sm">© 2025 SIAMIN - Kementerian Pendidikan Dasar dan Menengah</p>
          <div class="flex items-center gap-6">
            <RouterLink to="/verify-sertifikat" class="text-blue-200 hover:text-white text-sm transition">Verifikasi Sertifikat</RouterLink>
            <a href="#" class="text-blue-200 hover:text-white text-sm transition">Bantuan</a>
            <a href="#" class="text-blue-200 hover:text-white text-sm transition">Kontak</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  setup() {
    return {}
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
  0%, 100% {
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
