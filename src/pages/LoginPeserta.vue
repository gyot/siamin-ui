<template>
  <div class="min-h-full flex" style="background: linear-gradient(135deg, #065f46 0%, #059669 50%, #0f172a 100%);">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
      <div>
        <RouterLink to="/" class="flex items-center gap-2 text-emerald-200 hover:text-white transition mb-12">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Kembali</span>
        </RouterLink>
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">SIMAIK</h1>
            <p class="text-emerald-200 text-sm">Kementerian Pendidikan Dasar dan Menengah</p>
          </div>
        </div>
        <h2 class="text-4xl font-bold text-white leading-tight mb-4">
          Portal Peserta
        </h2>
        <p class="text-emerald-200 text-lg">
          Akses informasi kegiatan dan unduh sertifikat Anda dari satu portal.
        </p>
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-3 text-emerald-200">
          <div class="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span>Akses mudah ke data kegiatan</span>
        </div>
        <div class="flex items-center gap-3 text-emerald-200">
          <div class="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span>Unduh sertifikat kapan saja</span>
        </div>
        <div class="flex items-center gap-3 text-emerald-200">
          <div class="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span>Portal aman dan terpercaya</span>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <RouterLink to="/" class="lg:hidden flex items-center gap-2 text-emerald-200 hover:text-white transition mb-8">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Kembali</span>
        </RouterLink>
        
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800">Login Peserta</h3>
            <p class="text-slate-500 mt-2">Masuk dengan username dan password Anda</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Username Input -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input 
                v-model="formData.username"
                type="text" 
                placeholder="Username Anda"
                class="input-field w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none transition"
                required
              />
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="••••••••"
                  class="input-field w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.35 13.863A8.967 8.967 0 019 12c-4.478 0-8.268 2.943-9.543 7"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2">
                <input v-model="formData.remember" type="checkbox" class="w-4 h-4 rounded border-slate-300" />
                <span class="text-sm text-slate-600">Ingat saya</span>
              </label>
              <a href="#" class="text-sm text-emerald-600 hover:text-emerald-700">Lupa password?</a>
            </div>

            <!-- Login Button -->
            <button 
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full btn-peserta px-4 py-3 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="!authStore.isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span v-if="!authStore.isLoading">Login</span>
              <span v-else>Memproses...</span>
            </button>

            <!-- Error Message -->
            <div v-if="authStore.error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ authStore.error }}</p>
            </div>

            <!-- Demo Credentials -->
            <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p class="text-xs font-medium text-emerald-900 mb-2">Demo Credentials:</p>
              <p class="text-xs text-emerald-700">Username: peserta123</p>
              <p class="text-xs text-emerald-700">Password: password123</p>
            </div>
          </form>

          <!-- Switch to Admin Login -->
          <div class="mt-6 text-center">
            <p class="text-slate-600 text-sm">Masuk sebagai admin?</p>
            <RouterLink to="/laman-masuk" class="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              Login Admin
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  password: '',
  remember: false
})
const showPassword = ref(false)

const handleLogin = async () => {
  // Validasi form
  if (!formData.value.username || !formData.value.password) {
    return
  }

  // Call auth store login (akan cek API dulu, jika gagal cek fallback data)
  const success = await authStore.loginPeserta(formData.value.username, formData.value.password)
  
  if (success) {
    // Reset form
    formData.value.username = ''
    formData.value.password = ''
    formData.value.remember = false
    
    // Redirect ke dashboard peserta
    router.push('/peserta/dashboard')
  }
}
</script>

<style scoped>
.btn-peserta {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transition: all 0.2s ease;
}

.btn-peserta:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  transform: translateY(-1px);
}

.input-field:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}
</style>
