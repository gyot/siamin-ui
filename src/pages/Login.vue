<template>
  <div class="min-h-full flex" style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0f172a 100%);">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
      <div>
        <RouterLink to="/" class="flex items-center gap-2 text-blue-200 hover:text-white transition mb-12">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Kembali</span>
        </RouterLink>
        <div class="flex items-center gap-4 mb-8">
          <!-- <RouterLink to="/" class="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="Logo SIAMIN" class="h-16 object-contain">
          </RouterLink> -->
        </div>
        <h2 class="text-4xl font-bold text-white leading-tight mb-4">
          Portal Administrator
        </h2>
        <p class="text-blue-200 text-lg">
          Kelola kegiatan, peserta, dan sertifikat dalam satu platform terintegrasi.
        </p>
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-3 text-blue-200">
          <div class="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span>Sistem terintegrasi dan aman</span>
        </div>
        <div class="flex items-center gap-3 text-blue-200">
          <div class="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span>Akses 24/7 dari mana saja</span>
        </div>
        <div class="flex items-center gap-3 text-blue-200">
          <div class="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span>Sertifikat digital terverifikasi</span>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <RouterLink to="/" class="lg:hidden flex items-center gap-2 text-blue-200 hover:text-white transition mb-8">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Kembali</span>
        </RouterLink>
        
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <RouterLink to="/" class="flex items-center gap-3">
              <img src="/src/assets/logo.png" alt="Logo SIAMIN" class="h-16 object-contain">
            </RouterLink>
            <p class="text-slate-500 mt-2">Masuk dengan akun admin Anda</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input 
                v-model="formData.email"
                type="text" 
                placeholder="Masukkan username Anda"
                class="input-field w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition"
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
                  class="input-field w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition"
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
            <!-- <div class="flex items-center justify-between">
              <label class="flex items-center gap-2">
                <input v-model="formData.remember" type="checkbox" class="w-4 h-4 rounded border-slate-300" />
                <span class="text-sm text-slate-600">Ingat saya</span>
              </label>
              <a href="#" class="text-sm text-blue-600 hover:text-blue-700">Lupa password?</a>
            </div> -->

            <!-- Login Button -->
            <button 
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full btn-primary px-4 py-3 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <!-- <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-xs font-medium text-blue-900 mb-2">Demo Credentials:</p>
              <p class="text-xs text-blue-700">Email: admin@kemkominfo.go.id</p>
              <p class="text-xs text-blue-700">Password: password123</p>
            </div> -->
          </form>

          <!-- Switch to Peserta Login -->
          <!-- <div class="mt-6 text-center">
            <p class="text-slate-600 text-sm">Masuk sebagai peserta?</p>
            <RouterLink to="/login-peserta" class="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Login Peserta
            </RouterLink>
          </div> -->
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
  email: '',
  password: '',
  remember: false
})
const showPassword = ref(false)

const handleLogin = async () => {
  // Validasi form
  if (!formData.value.email || !formData.value.password) {
    authStore.error = 'Email dan password harus diisi'
    return
  }

  try {
    // Call auth store login
    await authStore.loginAdmin(formData.value.email, formData.value.password)
    
    if (authStore.isAuthenticated) {
      // Reset form
      formData.value.email = ''
      formData.value.password = ''
      formData.value.remember = false
      
      // Redirect ke dashboard
      router.push('/admin/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    authStore.error = error.message || 'Terjadi kesalahan saat login'
  }
}
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
}

.input-field:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
</style>
