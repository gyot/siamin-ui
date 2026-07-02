<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
    <div class="max-w-4xl mx-auto">
        <div v-if="isLoadingKegiatan" class="mb-4 p-4 flex items-center justify-center">
          <Spinner message="Memuat data kegiatan..." />
        </div>
      <!-- Header -->
      <!-- <div class="mb-8 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">{{ namaKegiatan }}</h1>
        <p class="text-slate-600">Formulir Pendaftaran {{ peran }}</p>
      </div> -->

      <!-- Kegiatan Detail (baru) -->
      <div v-if="kegiatan" class="bg-blue-50 border border-blue-200 rounded-lg  p-4 sm:p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-slate-800">Formulir Biodata {{ peran }}</h2>
            <p class="text-sm text-slate-600">{{ kegiatan.nama_kegiatan }}</p>

            <div class="mt-3 text-sm text-slate-600">
              <p><strong>Tanggal:</strong> {{ formatDate(kegiatan.tanggal_mulai) }} - {{
                formatDate(kegiatan.tanggal_selesai) }}</p>
              <p><strong>Lokasi:</strong> {{ kegiatan.lokasi || '-' }}</p>
            </div>
          </div>

          <div class="w-full sm:w-48 flex-shrink-0">
            <img v-if="flyerUrl" :src="flyerUrl" loading="lazy" :alt="`Flyer ${kegiatan.nama_kegiatan}`"
              class="rounded-md object-cover w-full h-32" />
            <div v-else
              class="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-sm text-slate-500">Tidak
              ada flyer</div>
          </div>
        </div>

        <div class="mt-4 text-sm text-slate-700">
          <p class="mt-3 font-semibold">Deskripsi</p>
          <p class="text-slate-600 whitespace-pre-wrap">{{ kegiatan.deskripsi || '-' }}</p>
        </div>

      </div>



      <!-- Form -->
      <div v-if="!isLoadingKegiatan" class="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Data Pribadi Section -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Pribadi</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap *</label>
                <input v-model="formData.nama_lengkap" type="text" placeholder="Masukkan nama lengkap"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NIP</label>
                <input v-model="formData.nip" type="text" placeholder="Masukkan NIP (opsional)"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Email </label>
                <input v-model="formData.email" type="email" placeholder="Masukkan email"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">No. HP</label>
                <input v-model="formData.no_hp" type="tel" placeholder="Masukkan nomor HP"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
                <select v-model="formData.jenis_kelamin"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>
              <!-- <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Agama</label>
                <select
                  v-model="formData.agama"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Kristen Katolik">Kristen Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div> -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Tempat Lahir</label>
                <input v-model="formData.tempat_lahir" type="text" placeholder="Masukkan tempat lahir"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Tanggal Lahir</label>
                <input v-model="formData.tanggal_lahir" type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NPWP/NIK</label>
                <input v-model="formData.npwp_nik" type="text" placeholder="Masukkan NPWP atau NIK"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Pangkat / Golongan</label>
                <select v-model="formData.pangkat"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Pangkat</option>
                  <optgroup label="Non-ASN">
                    <option value="Non ASN">Non ASN</option>
                    <option value="Honorer">Honorer</option>
                    <option value="Swasta">Swasta</option>
                    <option value="Lainnya">Lainnya</option>
                  </optgroup>
                  <!-- PNS -->
                  <optgroup label="Golongan I">
                    <option value="Juru Muda / Ia">Juru Muda / Ia</option>
                    <option value="Juru Muda Tingkat I / Ib">Juru Muda Tingkat I / Ib</option>
                    <option value="Juru / Ic">Juru / Ic</option>
                    <option value="Juru Tingkat I / Id">Juru Tingkat I / Id</option>
                  </optgroup>

                  <optgroup label="Golongan II">
                    <option value="Pengatur Muda / IIa">Pengatur Muda / IIa</option>
                    <option value="Pengatur Muda Tingkat I / IIb">Pengatur Muda Tingkat I / IIb</option>
                    <option value="Pengatur / IIc">Pengatur / IIc</option>
                    <option value="Pengatur Tingkat I / IId">Pengatur Tingkat I / IId</option>
                  </optgroup>

                  <optgroup label="Golongan III">
                    <option value="Penata Muda / IIIa">Penata Muda / IIIa</option>
                    <option value="Penata Muda Tingkat I / IIIb">Penata Muda Tingkat I / IIIb</option>
                    <option value="Penata / IIIc">Penata / IIIc</option>
                    <option value="Penata Tingkat I / IIId">Penata Tingkat I / IIId</option>
                  </optgroup>

                  <optgroup label="Golongan IV">
                    <option value="Pembina / IVa">Pembina / IVa</option>
                    <option value="Pembina Tingkat I / IVb">Pembina Tingkat I / IVb</option>
                    <option value="Pembina Utama Muda / IVc">Pembina Utama Muda / IVc</option>
                    <option value="Pembina Utama Madya / IVd">Pembina Utama Madya / IVd</option>
                    <option value="Pembina Utama / IVe">Pembina Utama / IVe</option>
                  </optgroup>

                  <!-- PPPK -->
                  <optgroup label="Golongan PPPK">
                    <option value="PPPK / I">PPPK / I</option>
                    <option value="PPPK / II">PPPK / II</option>
                    <option value="PPPK / III">PPPK / III</option>
                    <option value="PPPK / IV">PPPK / IV</option>
                    <option value="PPPK / V">PPPK / V</option>
                    <option value="PPPK / VI">PPPK / VI</option>
                    <option value="PPPK / VII">PPPK / VII</option>
                    <option value="PPPK / VIII">PPPK / VIII</option>
                    <option value="PPPK / IX">PPPK / IX</option>
                    <option value="PPPK / X">PPPK / X</option>
                    <option value="PPPK / XI">PPPK / XI</option>
                    <option value="PPPK / XII">PPPK / XII</option>
                    <option value="PPPK / XIII">PPPK / XIII</option>
                    <option value="PPPK / XIV">PPPK / XIV</option>
                    <option value="PPPK / XV">PPPK / XV</option>
                    <option value="PPPK / XVI">PPPK / XVI</option>
                    <option value="PPPK / XVII">PPPK / XVII</option>
                  </optgroup>
                </select>


              </div>
              <!-- <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Golongan</label>
                <input v-model="formData.gol" type="text" placeholder="Masukkan golongan"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div> -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Jabatan</label>
                <input v-model="formData.jabatan" type="text" placeholder="Masukkan jabatan"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div v-if="tpkItems.length > 0">
                <label class="block text-sm font-medium text-slate-700 mb-2">Tempat Pelaksanaan (TPK)</label>
                <select v-model="formData.id_tpk"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih TPK</option>
                  <option v-for="tpk in tpkItems" :key="tpk.id_tpk" :value="tpk.id_tpk">
                    {{ tpk.kabupaten_kota ? `${tpk.lokasi} (${tpk.kabupaten_kota})` : tpk.lokasi }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Data Instansi Section -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Instansi</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Instansi *</label>
                <input v-model="formData.nama_instansi" type="text" placeholder="Masukkan nama instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">NPSN (jika instansi pendidikan)</label>
                <input
                  v-model="formData.npsn"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="8"
                  placeholder="Masukkan NPSN (angka saja)"
                  @input="onNpsnInput"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Kabupaten / Kota</label>
                <select v-model="formData.kab_kota"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Kabupaten/Kota</option>
                  <option v-for="k in kabKota" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
              <!-- <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Provinsi</label>
                <input v-model="formData.provinsi" type="text" placeholder="Masukkan provinsi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Telepon Instansi</label>
                <input v-model="formData.telp_instansi" type="tel" placeholder="Masukkan telepon instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Email Instansi</label>
                <input v-model="formData.email_instansi" type="email" placeholder="Masukkan email instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-2">Alamat Instansi</label>
                <textarea v-model="formData.alamat_instansi" rows="3" placeholder="Masukkan alamat instansi"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              </div> -->
            </div>
          </div>

          <div v-if="['transfer', 'pulsa', 'transfer_dan_pulsa'].includes(metode_pembayaran)">
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Data Pembayaran</h3>
            <div v-if="['transfer_dan_pulsa', 'transfer', 'pulsa'].includes(metode_pembayaran)"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div v-if="['transfer_dan_pulsa', 'transfer'].includes(metode_pembayaran)">
                <label class="block text-sm font-medium text-slate-700 mb-2">Nomor Rekening</label>
                <input v-model="formData.nomor_rekening" type="text" placeholder="Masukkan nomor rekening"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div v-if="['transfer_dan_pulsa', 'transfer'].includes(metode_pembayaran)">
                <label class="block text-sm font-medium text-slate-700 mb-2">Nama Bank</label>
                <input v-model="formData.nama_bank" type="text" placeholder="Masukkan nama bank"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div v-if="['transfer_dan_pulsa', 'pulsa'].includes(metode_pembayaran)">
                <label class="block text-sm font-medium text-slate-700 mb-2">Provider Seluler (untuk penggantian
                  pulsa)</label>
                <select v-model="formData.provider_pulsa"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Provider</option>
                  <option value="Telkomsel">Telkomsel</option>
                  <option value="Indosat">Indosat</option>
                  <option value="XL">XL Axiata</option>
                  <option value="Tri">Tri</option>
                  <option value="Smartfren">Smartfren</option>
                  <option value="Axis">Axis</option>
                  <option value="By.U">By.U</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Signature Section -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">Tandatangan Digital
            </h3>
            <p class="text-sm text-slate-600 mb-4">Silakan tandatangani di area bawah ini dengan menggunakan mouse atau
              stylus.</p>

            <div class="relative border-2 border-dashed border-slate-300 rounded-lg p-4 mb-4 bg-slate-50" style="aspect-ratio: 1 / 1; width: 100%; max-width: 400px;">
              <button type="button" @click="clearSignature"
                class="absolute right-3 top-3 px-2 py-1 bg-white border border-slate-300 text-slate-700 rounded-md text-[11px] font-medium shadow-sm hover:bg-slate-100 transition-colors">
                Hapus Tandatangan
              </button>
              <canvas ref="signatureCanvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
                @mouseout="stopDrawing" @touchstart="startDrawing" @touchmove="draw" @touchend="stopDrawing"
                class="w-full h-full border border-slate-300 rounded-lg cursor-crosshair bg-white block"
                style="touch-action: none; outline: none;"></canvas>
            </div>

            <!-- <div v-if="signatureData" class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-green-800 text-sm">✓ Tandatangan sudah disimpan</p>
            </div> -->
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
            <button type="button" @click="resetForm"
              class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              Bersihkan
            </button>
            <button type="submit"
              class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
              Daftar Sekarang
            </button>
          </div>
        </form>
      </div>

      <!-- Footer Info -->
      <div v-if="!isLoadingKegiatan" class="mt-8 text-center text-sm text-slate-600">
        <p>Dengan mengklik "Daftar Sekarang", Anda setuju dengan syarat dan ketentuan yang berlaku.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import database from '@/data/index.js'
import Swal from 'sweetalert2'
import { listKegiatan, getKegiatan } from '@/services/kegiatan'
import { postAPI } from '@/services/api'
import Spinner from '@/components/Spinner.vue'
import { buildPublicUrl, buildStorageUrl } from '@/utils/url'
import { getKegiatanLocationItems } from '@/utils/kegiatanLocation'

export default {
  name: 'FormulirPeserta',
  components: { Spinner },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const kode = route.params.kode
    // Debug kode route
    const peran = route.params.peran
    const slugJudul = route.params.slugJudul

    const formErrors = ref([])
    const showSuccessMessage = ref(false)
    const signatureCanvas = ref(null)
    const signatureData = ref(null)
    let isDrawing = false

    // API-backed kegiatan (fallback ke local database)
    const apiKegiatan = ref([])
    const fallbackKegiatan = ref(null)
    const isLoadingKegiatan = ref(false)

    const loadKegiatan = async () => {
      isLoadingKegiatan.value = true
      try {
        const data = await listKegiatan()
        apiKegiatan.value = Array.isArray(data) ? data : [data]

        if (!apiKegiatan.value.find((item) => String(item.id_kegiatan).toLowerCase().trim() === String(kode).toLowerCase().trim())) {
          try {
            const singleKegiatan = await getKegiatan(kode)
            if (singleKegiatan && !Array.isArray(singleKegiatan)) {
              fallbackKegiatan.value = singleKegiatan
            }
          } catch (innerErr) {
            // ignore fallback failure
          }
        }
      } catch (err) {
        console.warn('Gagal mengambil kegiatan dari API, gunakan lokal', err)
      } finally {
        isLoadingKegiatan.value = false
        // Form dirender setelah loading selesai, jadi canvas perlu diinisialisasi ulang.
        initializeCanvas()
      }
    }

    onMounted(() => {
      loadKegiatan()
      
      // initialize canvas dimensions after the DOM is rendered
      // this ensures the canvas has proper DPI-aware dimensions
      setTimeout(() => {
        const canvas = signatureCanvas.value
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        // set canvas internal resolution
        canvas.width = rect.width
        canvas.height = rect.height

        // set up canvas context defaults
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = '#1e293b'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }, 100)
    })

    // Find kegiatan by code/ID (prefer API result)
    const kegiatan = computed(() => {
      // Cari dengan toleransi: id_kegiatan bisa string/number, kode dari route juga
      const norm = v => (v === undefined || v === null) ? '' : String(v).toLowerCase().trim()
      const kodeNorm = norm(kode)

      // Cek di API list
      let fromApi = apiKegiatan.value.find(k => norm(k.id_kegiatan) === kodeNorm)
      if (!fromApi) {
        fromApi = apiKegiatan.value.find(k => String(k.id_kegiatan) === String(kode))
      }
      if (fromApi) {
        return fromApi
      }

      // Cek fallback single-item load
      if (fallbackKegiatan.value && norm(fallbackKegiatan.value.id_kegiatan) === kodeNorm) {
        return fallbackKegiatan.value
      }

      // Cek di database lokal
      let fromDb = database.kegiatan.find(k => norm(k.id_kegiatan) === kodeNorm)
      if (!fromDb) {
        fromDb = database.kegiatan.find(k => String(k.id_kegiatan) === String(kode))
      }
      if (fromDb) {
      }
      return fromDb
    })

    const namaKegiatan = computed(() => {
      return kegiatan.value?.nama_kegiatan || 'Formulir Pendaftaran'
    })

    const metode_pembayaran = computed(() => {
      return kegiatan.value?.metode_pembayaran || ''
    })

    const tpkItems = computed(() => {
      if (!kegiatan.value) return []
      return getKegiatanLocationItems(kegiatan.value)
    })

    const kabKota = ref([
      'Kabupaten Lombok Barat',
      'Kabupaten Lombok Tengah',
      'Kabupaten Lombok Timur',
      'Kabupaten Lombok Utara',
      'Kabupaten Sumbawa',
      'Kabupaten Sumbawa Barat',
      'Kabupaten Dompu',
      'Kabupaten Bima',
      'Kota Mataram',
      'Kota Bima',
      'Lainnya'
    ])

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      try {
        const d = new Date(dateString)
        return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      } catch (e) {
        return dateString
      }
    }

    const flyerUrl = computed(() => {
      const f = kegiatan.value?.flyer || kegiatan.value?.flyer_path || kegiatan.value?.path || null
      if (!f) return null
      return buildStorageUrl(f)
    })

    const setMetaTag = (attrName, attrValue, isProperty = false) => {
      if (!attrValue) return
      const selector = isProperty
        ? `meta[property="${attrName}"]`
        : `meta[name="${attrName}"]`
      let tag = document.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        if (isProperty) {
          tag.setAttribute('property', attrName)
        } else {
          tag.setAttribute('name', attrName)
        }
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', attrValue)
    }

    const updateShareMeta = () => {
      if (!kegiatan.value) return
      const kegiatanTitle = kegiatan.value.nama_kegiatan || ''
      const lokasiText = kegiatan.value.lokasi || '-'
      const pageTitle = `Formulir Biodata ${peran} ${kegiatanTitle} TPK ${lokasiText}`.trim()
      const tanggalText = `${formatDate(kegiatan.value.tanggal_mulai)} - ${formatDate(kegiatan.value.tanggal_selesai)}`
      const description = kegiatan.value.deskripsi
        ? `Tanggal kegiatan: ${tanggalText}. ${kegiatan.value.deskripsi}`
        : `Tanggal kegiatan: ${tanggalText}. Lokasi: ${lokasiText}.`

      document.title = pageTitle
      setMetaTag('description', description)
      setMetaTag('og:title', pageTitle, true)
      setMetaTag('og:description', description, true)
      setMetaTag('og:type', 'article', true)
      setMetaTag('og:image', flyerUrl.value || '', true)
      setMetaTag('twitter:card', flyerUrl.value ? 'summary_large_image' : 'summary')
      setMetaTag('twitter:title', pageTitle)
      setMetaTag('twitter:description', description)
      if (flyerUrl.value) {
        setMetaTag('twitter:image', flyerUrl.value)
      }
    }

    watchEffect(() => {
      if (kegiatan.value) {
        updateShareMeta()
      }
    })

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
      return buildPublicUrl(value)
    }

    const getStorageFileUrl = (path) => {
      if (!path) return ''
      const value = String(path).trim()
      if (!value) return ''
      return buildStorageUrl(value)
    }

    const biodataTemplateDownloadUrl = computed(() => {
      const item = kegiatan.value
      if (!item) return ''
      const roleLower = String(peran || 'Peserta').toLowerCase()
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
      return getStorageFileUrl(templateUrl) || buildAbsoluteUrl(templateUrl)
    })

    const formData = ref({
      id_kegiatan: kode,
      id_tpk: '',
      nama_lengkap: '',
      nip: '',
      pangkat: '',
      agama: '',
      gol: '',
      jabatan: '',
      no_hp: '',
      email: '',
      npwp_nik: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      nama_instansi: '',
      npsn: '',
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
        id_tpk: '',
        nama_lengkap: '',
        nip: '',
        pangkat: '',
        agama: '',
        gol: '',
        jabatan: '',
        no_hp: '',
        email: '',
        npwp_nik: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        nama_instansi: '',
        npsn: '',
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
      if (formData.value.npsn && !/^\d+$/.test(formData.value.npsn)) {
        formErrors.value.push('NPSN hanya boleh berisi angka')
      }

      return formErrors.value.length === 0
    }

    const onNpsnInput = () => {
      formData.value.npsn = String(formData.value.npsn || '').replace(/\D/g, '')
    }

    const base64ToFile = (dataUrl, filename = 'tanda_tangan.png') => {
      const arr = dataUrl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }

    const submitForm = async () => {
      if (!validateForm()) return

      const fd = new FormData()
      // Append all formData fields
      Object.entries(formData.value).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          fd.append(key, val)
        }
      })

      // Append tanda_tangan as file if present (signatureData is data URL)
      if (signatureData.value) {
        try {
          const file = base64ToFile(signatureData.value, `tanda_tangan_${Date.now()}.png`)
          fd.append('tanda_tangan', file)
        } catch (e) {
          console.warn('Gagal konversi tanda_tangan ke file', e)
        }
      }

      try {
        const saved = await postAPI('peserta', fd)

        // Optionally push to local mock DB for offline view
        const nextId = Math.max(...database.peserta.map(p => p.id_peserta || 0), 0) + 1
        database.peserta.push({
          id_peserta: saved.id_peserta || nextId,
          ...formData.value,
          tandatangan: signatureData.value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

        showSuccessMessage.value = true
        formErrors.value = []

        await Swal.fire({
          title: 'Sukses!',
          text: 'Pendaftaran Anda telah berhasil disimpan. Terima kasih telah mendaftar.',
          icon: 'success',
          confirmButtonText: 'OK'
        })

        resetForm()
        showSuccessMessage.value = false
        const redirectPath = slugJudul
          ? `/daftar-peserta/${kode}/${slugJudul}`
          : `/daftar-peserta/${kode}`
        await router.push(redirectPath)
      } catch (err) {
        console.error('Gagal menyimpan peserta:', err)
        Swal.fire({
          title: 'Gagal',
          text: err.message || 'Terjadi kesalahan saat menyimpan pendaftaran',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }

    const startDrawing = (e) => {
      e.preventDefault() // prevent scrolling and other default behaviors
      isDrawing = true
      const canvas = signatureCanvas.value
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      // determine source of coordinates (mouse or touch)
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0]?.clientX
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0]?.clientY

      if (clientX === undefined || clientY === undefined) return

      const x = (clientX - rect.left) * scaleX
      const y = (clientY - rect.top) * scaleY

      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    const draw = (e) => {
      if (!isDrawing) return
      e.preventDefault() // prevent scrolling and other default behaviors

      const canvas = signatureCanvas.value
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      // determine source of coordinates (mouse or touch)
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0]?.clientX
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0]?.clientY

      if (clientX === undefined || clientY === undefined) return

      const x = (clientX - rect.left) * scaleX
      const y = (clientY - rect.top) * scaleY

      const ctx = canvas.getContext('2d')
      ctx.lineTo(x, y)
      ctx.stroke()

      // save signature data after drawing
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
      kegiatan,
      flyerUrl,
      biodataTemplateDownloadUrl,
      kabKota,
      formData,
      formatDate,
      formErrors,
      showSuccessMessage,
      metode_pembayaran,
      tpkItems,
      signatureCanvas,
      signatureData,
      isLoadingKegiatan,
      resetForm,
      validateForm,
      onNpsnInput,
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
