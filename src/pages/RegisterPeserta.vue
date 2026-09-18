<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-[#1877F2] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">S</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">Daftar Akun Peserta</h1>
        <p class="text-sm text-slate-600 mt-1">Lengkapi data diri Anda untuk membuat akun</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Data Akun -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Akun</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Username *</label>
                <input v-model="form.username" type="text" placeholder="Buat username"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                <input v-model="form.password" type="password" placeholder="Minimal 6 karakter"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password *</label>
                <input v-model="form.password_confirmation" type="password" placeholder="Ulangi password"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
            </div>
          </div>

          <!-- Data Pribadi -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Pribadi</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap *</label>
                <input v-model="form.nama_lengkap" type="text" placeholder="Masukkan nama lengkap"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NIP</label>
                <input v-model="form.nip" type="text" placeholder="Masukkan NIP (opsional)"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input v-model="form.email" type="email" placeholder="Masukkan email"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">No. HP</label>
                <input v-model="form.no_hp" type="tel" placeholder="Masukkan nomor HP"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                <select v-model="form.jenis_kelamin"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Tempat Lahir</label>
                <input v-model="form.tempat_lahir" type="text" placeholder="Masukkan tempat lahir"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Lahir</label>
                <input v-model="form.tanggal_lahir" type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NPWP/NIK</label>
                <input v-model="form.npwp_nik" type="text" placeholder="Masukkan NPWP atau NIK"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Pangkat / Golongan</label>
                <select v-model="form.pangkat"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Pangkat</option>
                  <optgroup label="Non-ASN">
                    <option value="Non ASN">Non ASN</option>
                    <option value="Honorer">Honorer</option>
                    <option value="Swasta">Swasta</option>
                  </optgroup>
                  <optgroup label="Golongan III">
                    <option value="Penata Muda / IIIa">Penata Muda / IIIa</option>
                    <option value="Penata / IIIc">Penata / IIIc</option>
                    <option value="Penata Tingkat I / IIId">Penata Tingkat I / IIId</option>
                  </optgroup>
                  <optgroup label="Golongan IV">
                    <option value="Pembina / IVa">Pembina / IVa</option>
                    <option value="Pembina Tingkat I / IVb">Pembina Tingkat I / IVb</option>
                  </optgroup>
                  <optgroup label="PPPK">
                    <option value="PPPK / IX">PPPK / IX</option>
                    <option value="PPPK / X">PPPK / X</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Jabatan</label>
                <input v-model="form.jabatan" type="text" placeholder="Masukkan jabatan"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          <!-- Data Instansi -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Instansi</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Instansi</label>
                <input v-model="form.nama_instansi" type="text" placeholder="Masukkan nama instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NPSN (jika instansi pendidikan)</label>
                <input v-model="form.npsn" type="text" maxlength="8" placeholder="Masukkan NPSN"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Kabupaten / Kota</label>
                <select v-model="form.kab_kota"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Kabupaten/Kota</option>
                  <option v-for="k in kabKota" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Error & Success -->
          <p v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{{ error }}</p>
          <p v-if="success" class="text-emerald-600 text-sm text-center bg-emerald-50 p-3 rounded-lg">{{ success }}</p>

          <!-- Submit -->
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-[#1877F2] text-white rounded-xl font-semibold text-[15px] hover:bg-[#166FE5] transition disabled:opacity-60">
            {{ loading ? 'Mendaftar...' : 'Daftar' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-[13px] text-slate-600">
            Sudah punya akun?
            <RouterLink to="/login" class="text-[#1877F2] font-semibold hover:underline">Masuk</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerPeserta } from '@/services/api'

export default {
  name: 'RegisterPeserta',
  setup() {
    const router = useRouter()
    const form = ref({
      username: '',
      password: '',
      password_confirmation: '',
      nama_lengkap: '',
      nip: '',
      email: '',
      no_hp: '',
      jenis_kelamin: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      npwp_nik: '',
      pangkat: '',
      jabatan: '',
      nama_instansi: '',
      npsn: '',
      kab_kota: ''
    })
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const kabKota = [
      'Kabupaten Lombok Barat', 'Kabupaten Lombok Tengah', 'Kabupaten Lombok Timur',
      'Kabupaten Lombok Utara', 'Kabupaten Sumbawa', 'Kabupaten Sumbawa Barat',
      'Kabupaten Dompu', 'Kabupaten Bima', 'Kota Mataram', 'Kota Bima'
    ]

    const handleRegister = async () => {
      loading.value = true
      error.value = ''
      success.value = ''

      try {
        await registerPeserta(form.value)
        success.value = 'Registrasi berhasil! Mengarahkan ke halaman login...'
        setTimeout(() => router.push('/login'), 2000)
      } catch (e) {
        const errors = e?.response?.data?.errors
        if (errors) {
          error.value = Object.values(errors).flat().join(', ')
        } else {
          error.value = e?.response?.data?.message || e.message || 'Gagal registrasi'
        }
      } finally {
        loading.value = false
      }
    }

    return { form, loading, error, success, kabKota, handleRegister }
  }
}
</script>
