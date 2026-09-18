<template>
  <div class="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-[#1877F2] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">S</span>
        </div>
        <h1 class="text-2xl font-bold text-[#050505]">SIMAIK</h1>
        <p class="text-[13px] text-[#65676B] mt-1">Sistem Manajemen Informasi Kegiatan</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-[#E4E6E9] p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <input v-model="form.username" type="text" placeholder="Username atau Email"
              class="w-full px-4 py-3 bg-[#F0F2F5] rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-[15px] placeholder:text-[#65676B]"
              required />
          </div>
          <div>
            <input v-model="form.password" type="password" placeholder="Password"
              class="w-full px-4 py-3 bg-[#F0F2F5] rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-[15px] placeholder:text-[#65676B]"
              required />
          </div>
          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-[#1877F2] text-white rounded-xl font-semibold text-[15px] hover:bg-[#166FE5] transition disabled:opacity-60">
            {{ loading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-[13px] text-[#65676B]">
            Belum punya akun?
            <RouterLink to="/register" class="text-[#1877F2] font-semibold hover:underline">Daftar</RouterLink>
          </p>
        </div>
      </div>

      <p class="text-center text-[12px] text-[#65676B] mt-6">BPMP Provinsi NTB</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginUnified',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const form = ref({ username: '', password: '' })
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        const success = await authStore.loginUnified(form.value.username, form.value.password)
        if (success) {
          const loginAs = authStore.currentUser?.login_as
          if (loginAs === 'admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/peserta/dashboard')
          }
        } else {
          error.value = authStore.error || 'Username atau password salah'
        }
      } catch (e) {
        error.value = e.message || 'Terjadi kesalahan'
      } finally {
        loading.value = false
      }
    }

    return { form, loading, error, handleLogin }
  }
}
</script>
