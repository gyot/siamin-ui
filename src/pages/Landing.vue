<template>
  <div class="min-h-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
    <!-- Header -->
    <header class="relative z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">SIAMIN</h1>
              <p class="text-blue-200 text-xs">Kementerian Pendidikan Dasar dan Menengah</p>
            </div>
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
            <RouterLink 
              to="/login" 
              class="btn-primary px-5 py-2.5 text-white rounded-lg font-medium shadow-lg"
            >
              Login
            </RouterLink>
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
              <RouterLink 
                to="/login" 
                class="btn-primary px-8 py-3.5 text-white rounded-xl font-semibold shadow-xl flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Login Admin
              </RouterLink>
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
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Manajemen Kegiatan</h3>
              <p class="text-blue-200 text-sm">Kelola semua kegiatan dalam satu platform terintegrasi</p>
            </div>
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Data Peserta</h3>
              <p class="text-blue-200 text-sm">Pengelolaan data peserta yang terstruktur dan aman</p>
            </div>
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Surat Tugas</h3>
              <p class="text-blue-200 text-sm">Administrasi surat tugas digital yang efisien</p>
            </div>
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Sertifikat Digital</h3>
              <p class="text-blue-200 text-sm">Penerbitan sertifikat dengan QR Code verifikasi</p>
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
