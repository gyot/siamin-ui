<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">{{ namaKegiatan }}</h1>
        <p class="text-slate-600">Formulir Pendaftaran {{ peran }}</p>
      </div>

      <!-- Info Box -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-slate-600">Kode Kegiatan</p>
            <p class="font-semibold text-slate-800">{{ kode }}</p>
          </div>
          <div>
            <p class="text-slate-600">Peran Peserta</p>
            <p class="font-semibold text-slate-800 capitalize">{{ peran }}</p>
          </div>
          <div>
            <p class="text-slate-600">Status Pendaftaran</p>
            <span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              Buka
            </span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Data Pribadi Section -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Pribadi</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap *</label>
                <input
                  v-model="formData.nama_lengkap"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NIP</label>
                <input
                  v-model="formData.nip"
                  type="text"
                  placeholder="Masukkan NIP (opsional)"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder="Masukkan email"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">No. HP</label>
                <input
                  v-model="formData.no_hp"
                  type="tel"
                  placeholder="Masukkan nomor HP"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                <select
                  v-model="formData.jenis_kelamin"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Tempat Lahir</label>
                <input
                  v-model="formData.tempat_lahir"
                  type="text"
                  placeholder="Masukkan tempat lahir"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Lahir</label>
                <input
                  v-model="formData.tanggal_lahir"
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NPWP/NIK</label>
                <input
                  v-model="formData.npwp_nik"
                  type="text"
                  placeholder="Masukkan NPWP atau NIK"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Pangkat</label>
                <input
                  v-model="formData.pangkat"
                  type="text"
                  placeholder="Masukkan pangkat"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Golongan</label>
                <input
                  v-model="formData.gol"
                  type="text"
                  placeholder="Masukkan golongan"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Jabatan</label>
                <input
                  v-model="formData.jabatan"
                  type="text"
                  placeholder="Masukkan jabatan"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Data Instansi Section -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Instansi</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Instansi *</label>
                <input
                  v-model="formData.nama_instansi"
                  type="text"
                  placeholder="Masukkan nama instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Kabupaten/Kota</label>
                <input
                  v-model="formData.kab_kota"
                  type="text"
                  placeholder="Masukkan kabupaten/kota"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Provinsi</label>
                <input
                  v-model="formData.provinsi"
                  type="text"
                  placeholder="Masukkan provinsi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Telepon Instansi</label>
                <input
                  v-model="formData.telp_instansi"
                  type="tel"
                  placeholder="Masukkan telepon instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Email Instansi</label>
                <input
                  v-model="formData.email_instansi"
                  type="email"
                  placeholder="Masukkan email instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Alamat Instansi</label>
                <textarea
                  v-model="formData.alamat_instansi"
                  rows="3"
                  placeholder="Masukkan alamat instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </div>

          <div v-if="metode_pembayaran!='tidak_dibayar' && metode_pembayaran!='tunai'">
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Pembayaran</h3>
            <div v-if="metode_pembayaran==='transfer_dan_pulsa' || metode_pembayaran==='transfer' || metode_pembayaran==='pulsa'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if=" metode_pembayaran==='transfer_dan_pulsa' || metode_pembayaran==='pulsa'">
                <label class="block text-sm font-medium text-slate-700 mb-2">Provider Pulsa</label>
                <select
                  v-model="formData.provider_pulsa"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Provider</option>
                  <option value="Telkomsel">Telkomsel</option>
                  <option value="Indosat">Indosat</option>
                  <option value="XL">XL Axiata</option>
                  <option value="Tri">Tri</option>
                  <option value="Smartfren">Smartfren</option>
                </select>
              </div>
              <div v-if=" metode_pembayaran==='transfer_dan_pulsa' || metode_pembayaran==='transfer'">
                <label class="block text-sm font-medium text-slate-700 mb-2">Nomor Rekening</label>
                <input
                  v-model="formData.nomor_rekening"
                  type="text"
                  placeholder="Masukkan nomor rekening"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div v-if=" metode_pembayaran==='transfer_dan_pulsa' || metode_pembayaran==='transfer'">
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Bank</label>
                <input
                  v-model="formData.nama_bank"
                  type="text"
                  placeholder="Masukkan nama bank"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Signature Section -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Tandatangan Digital</h3>
            <p class="text-sm text-slate-600 mb-4">Silakan tandatangani di area bawah ini dengan menggunakan mouse atau stylus.</p>
            
            <div class="border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4 bg-slate-50">
              <canvas
                ref="signatureCanvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseout="stopDrawing"
                @touchstart="startDrawing"
                @touchmove="draw"
                @touchend="stopDrawing"
                class="w-full border border-slate-300 rounded-lg cursor-crosshair bg-white"
                style="height: 200px; display: block;"
              ></canvas>
            </div>

            <div class="flex gap-3 mb-4">
              <button
                type="button"
                @click="clearSignature"
                class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Hapus Tandatangan
              </button>
              <button
                type="button"
                @click="downloadSignature"
                class="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
              >
                Unduh Tandatangan
              </button>
            </div>

            <div v-if="signatureData" class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-green-800 text-sm">✓ Tandatangan sudah disimpan</p>
            </div>
          </div>

          <!-- Form Errors -->
          <div v-if="formErrors.length > 0" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-800 font-semibold mb-2">Terdapat kesalahan:</p>
            <ul class="list-disc list-inside text-red-700">
              <li v-for="error in formErrors" :key="error">{{ error }}</li>
            </ul>
          </div>

          <!-- Form Success Message -->
          <div v-if="showSuccessMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-800 font-semibold">✓ Pendaftaran berhasil! Data Anda telah disimpan.</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Bersihkan
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Daftar Sekarang
            </button>
          </div>
        </form>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center text-sm text-slate-600">
        <p>Dengan mengklik "Daftar Sekarang", Anda setuju dengan syarat dan ketentuan yang berlaku.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import database from '@/data/index.js'
import Swal from 'sweetalert2'

export default {
  name: 'FormulirPeserta',
  setup() {
    const route = useRoute()
    const kode = route.params.kode
    const peran = route.params.peran
    const slugJudul = route.params.slugJudul

    const formErrors = ref([])
    const showSuccessMessage = ref(false)
    const signatureCanvas = ref(null)
    const signatureData = ref(null)
    let isDrawing = false

    // Find kegiatan by code/ID
    const kegiatan = computed(() => {
      return database.kegiatan.find(k => k.id_kegiatan === kode)
    })

    const namaKegiatan = computed(() => {
      return kegiatan.value?.nama_kegiatan || 'Formulir Pendaftaran'
    })

    const metode_pembayaran = computed(() => {
      return kegiatan.value?.metode_pembayaran || ''
    })

    const formData = ref({
      id_kegiatan: kode,
      nama_lengkap: '',
      nip: '',
      pangkat: '',
      gol: '',
      jabatan: '',
      no_hp: '',
      email: '',
      npwp_nik: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      nama_instansi: '',
      alamat_instansi: '',
      kab_kota: '',
      provinsi: '',
      telp_instansi: '',
      email_instansi: '',
      provider_pulsa: '',
      nomor_rekening: '',
      nama_bank: '',
      peran: peran || 'Peserta'
    })

    const resetForm = () => {
      formData.value = {
        id_kegiatan: kode,
        nama_lengkap: '',
        nip: '',
        pangkat: '',
        gol: '',
        jabatan: '',
        no_hp: '',
        email: '',
        npwp_nik: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        nama_instansi: '',
        alamat_instansi: '',
        kab_kota: '',
        provinsi: '',
        telp_instansi: '',
        email_instansi: '',
        provider_pulsa: '',
        nomor_rekening: '',
        nama_bank: '',
        peran: peran || 'Peserta',
        tandatangan: null
      }
      formErrors.value = []
      showSuccessMessage.value = false
    }

    const validateForm = () => {
      formErrors.value = []
      if (!formData.value.nama_lengkap) formErrors.value.push('Nama lengkap wajib diisi')
      if (!formData.value.email) formErrors.value.push('Email wajib diisi')
      if (!formData.value.nama_instansi) formErrors.value.push('Nama instansi wajib diisi')
      if (!signatureData.value) formErrors.value.push('Tandatangan wajib diisi')

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (formData.value.email && !emailRegex.test(formData.value.email)) {
        formErrors.value.push('Format email tidak valid')
      }

      return formErrors.value.length === 0
    }

    const submitForm = () => {
      if (!validateForm()) return

      // Find next ID for peserta
      const nextId = Math.max(...database.peserta.map(p => p.id_peserta || 0), 0) + 1

      // Add peserta to database with signature
      database.peserta.push({
        id_peserta: nextId,
        ...formData.value,
        tandatangan: signatureData.value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      showSuccessMessage.value = true
      formErrors.value = []

      Swal.fire({
        title: 'Sukses!',
        text: 'Pendaftaran Anda telah berhasil disimpan. Terima kasih telah mendaftar.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        resetForm()
        showSuccessMessage.value = false
      })
    }

    const startDrawing = (e) => {
      isDrawing = true
      const canvas = signatureCanvas.value
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      const x = (e.clientX - rect.left) * scaleX || (e.touches && (e.touches[0].clientX - rect.left) * scaleX)
      const y = (e.clientY - rect.top) * scaleY || (e.touches && (e.touches[0].clientY - rect.top) * scaleY)

      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    const draw = (e) => {
      if (!isDrawing) return
      
      const canvas = signatureCanvas.value
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      const x = (e.clientX - rect.left) * scaleX || (e.touches && (e.touches[0].clientX - rect.left) * scaleX)
      const y = (e.clientY - rect.top) * scaleY || (e.touches && (e.touches[0].clientY - rect.top) * scaleY)

      const ctx = canvas.getContext('2d')
      ctx.lineTo(x, y)
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#1e293b'
      ctx.stroke()

      // Save signature data
      signatureData.value = canvas.toDataURL('image/png')
    }

    const stopDrawing = () => {
      isDrawing = false
    }

    const clearSignature = () => {
      const canvas = signatureCanvas.value
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      signatureData.value = null
    }

    const downloadSignature = () => {
      if (!signatureData.value) {
        Swal.fire({
          title: 'Peringatan',
          text: 'Silakan tandatangani terlebih dahulu sebelum mengunduh',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
        return
      }

      const link = document.createElement('a')
      link.href = signatureData.value
      link.download = `tandatangan_${formData.value.nama_lengkap}_${new Date().getTime()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      Swal.fire({
        title: 'Sukses!',
        text: 'Tandatangan berhasil diunduh',
        icon: 'success',
        confirmButtonText: 'OK'
      })
    }

    // Initialize canvas when component mounts
    const initializeCanvas = () => {
      setTimeout(() => {
        const canvas = signatureCanvas.value
        if (!canvas) return
        
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
        
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }, 100)
    }

    // Call initialization on setup
    initializeCanvas()

    return {
      kode,
      peran,
      slugJudul,
      namaKegiatan,
      formData,
      formErrors,
      showSuccessMessage,
      metode_pembayaran,
      signatureCanvas,
      signatureData,
      resetForm,
      validateForm,
      submitForm,
      startDrawing,
      draw,
      stopDrawing,
      clearSignature,
      downloadSignature
    }
  }
}
</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
}
</style>
