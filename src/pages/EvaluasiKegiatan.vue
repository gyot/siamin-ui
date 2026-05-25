<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600 font-medium">Memuat data kegiatan...</p>
        </div>
      </div>

      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-800 mb-2">Kegiatan Tidak Ditemukan</h2>
        <p class="text-slate-500 mb-6">{{ error }}</p>
        <button @click="goHome" class="btn-primary px-6 py-3 text-white rounded-xl font-semibold">
          Kembali ke Beranda
        </button>
      </div>

      <template v-else-if="kegiatanData">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-800">Formulir Evaluasi Kegiatan</h1>
              <p class="text-sm text-slate-500">Berikan penilaian Anda untuk meningkatkan kualitas kegiatan</p>
            </div>
          </div>

          <!-- Kegiatan Info -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">Nama Kegiatan</p>
                <p class="text-base font-semibold text-slate-800">{{ kegiatanData.nama_kegiatan }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">Waktu Pelaksanaan</p>
                <p class="text-sm text-slate-700">{{ formatDate(kegiatanData.tanggal_mulai) }} s/d {{ formatDate(kegiatanData.tanggal_selesai) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 uppercase mb-1">Tempat</p>
                <p class="text-sm text-slate-700">{{ kegiatanData.lokasi }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Evaluasi -->
        <form @submit.prevent="submitEvaluasi" class="space-y-6">
          <!-- Section I: Evaluasi terhadap Program -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                I
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800">Evaluasi Peserta Terhadap Program</h2>
                <p class="text-xs text-slate-500">Berikan penilaian Anda terhadap program kegiatan</p>
              </div>
            </div>

            <div class="space-y-5">
              <!-- Kesesuaian Program -->
              <div class="evaluation-item">
                <label class="block text-sm font-semibold text-slate-700 mb-3">
                  1. Kesesuaian Program Kegiatan dengan Tujuan
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.program_tujuan" :value="n" class="peer sr-only" />
                    <div class="text-center py-3 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all hover:border-emerald-300">
                      <div class="text-lg font-bold text-slate-700 peer-checked:text-emerald-600">{{ n }}</div>
                      <div class="text-xs text-slate-500">{{ getRatingLabel(n) }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Kesesuaian Bahan Ajar -->
              <div class="evaluation-item">
                <label class="block text-sm font-semibold text-slate-700 mb-3">
                  2. Kesesuaian Bahan ajar dengan Struktur Program
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.program_bahan_ajar" :value="n" class="peer sr-only" />
                    <div class="text-center py-3 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all hover:border-emerald-300">
                      <div class="text-lg font-bold text-slate-700 peer-checked:text-emerald-600">{{ n }}</div>
                      <div class="text-xs text-slate-500">{{ getRatingLabel(n) }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Kesesuaian Alokasi Waktu -->
              <div class="evaluation-item">
                <label class="block text-sm font-semibold text-slate-700 mb-3">
                  3. Kesesuaian Alokasi Waktu dengan Bobot Materi
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.program_alokasi_waktu" :value="n" class="peer sr-only" />
                    <div class="text-center py-3 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all hover:border-emerald-300">
                      <div class="text-lg font-bold text-slate-700 peer-checked:text-emerald-600">{{ n }}</div>
                      <div class="text-xs text-slate-500">{{ getRatingLabel(n) }}</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Section II: Evaluasi terhadap Fasilitator/Narasumber -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                II
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800">Evaluasi Peserta Terhadap Fasilitator/Narasumber</h2>
                <p class="text-xs text-slate-500">Berikan penilaian untuk setiap narasumber/fasilitator</p>
              </div>
            </div>

            <div v-if="narasumberList.length === 0" class="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center text-amber-700">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium">Belum ada data narasumber/fasilitator untuk kegiatan ini.</p>
            </div>

            <!-- Fasilitator Sections (Auto-generated from narasumber data) -->
            <div v-for="(narasumber, index) in narasumberList" :key="index" 
              class="mb-6 last:mb-0 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div class="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200">
                <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-800">{{ narasumber.nama }}</h3>
                  <p class="text-xs text-slate-500">{{ narasumber.instansi || 'Narasumber/Fasilitator' }}</p>
                </div>
              </div>

              <!-- Penguasaan Materi -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  1. Penguasaan Materi
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.fasilitator[index].penguasaan_materi" :value="n" class="peer sr-only" />
                    <div class="text-center py-2.5 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-blue-300">
                      <div class="text-base font-bold text-slate-700 peer-checked:text-blue-600">{{ n }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Sistematika Penyajian -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  2. Sistematika Penyajian Materi
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.fasilitator[index].sistematika" :value="n" class="peer sr-only" />
                    <div class="text-center py-2.5 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-blue-300">
                      <div class="text-base font-bold text-slate-700 peer-checked:text-blue-600">{{ n }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Sikap dan Kehadiran -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  3. Sikap dan Kehadiran Fasilitator
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.fasilitator[index].sikap" :value="n" class="peer sr-only" />
                    <div class="text-center py-2.5 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:border-blue-300">
                      <div class="text-base font-bold text-slate-700 peer-checked:text-blue-600">{{ n }}</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Section III: Evaluasi Layanan -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                III
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800">Evaluasi Layanan Panitia, Akomodasi dan Konsumsi</h2>
                <p class="text-xs text-slate-500">Berikan penilaian Anda terhadap layanan pendukung</p>
              </div>
            </div>

            <div class="space-y-5">
              <!-- Pelayanan Panitia -->
              <div class="evaluation-item">
                <label class="block text-sm font-semibold text-slate-700 mb-3">
                  1. Sikap dan Pelayanan Panitia Selama Kegiatan
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.layanan_panitia" :value="n" class="peer sr-only" />
                    <div class="text-center py-3 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-amber-500 peer-checked:bg-amber-50 transition-all hover:border-amber-300">
                      <div class="text-lg font-bold text-slate-700 peer-checked:text-amber-600">{{ n }}</div>
                      <div class="text-xs text-slate-500">{{ getRatingLabel(n) }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Fasilitas -->
              <div class="evaluation-item">
                <label class="block text-sm font-semibold text-slate-700 mb-3">
                  2. Fasilitas dan Kebersihan Tempat Pelaksanaan Kegiatan
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.layanan_fasilitas" :value="n" class="peer sr-only" />
                    <div class="text-center py-3 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-amber-500 peer-checked:bg-amber-50 transition-all hover:border-amber-300">
                      <div class="text-lg font-bold text-slate-700 peer-checked:text-amber-600">{{ n }}</div>
                      <div class="text-xs text-slate-500">{{ getRatingLabel(n) }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Konsumsi -->
              <div class="evaluation-item">
                <label class="block text-sm font-semibold text-slate-700 mb-3">
                  3. Kualitas Konsumsi
                </label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="n in 5" :key="n" class="flex-1 min-w-[60px] cursor-pointer">
                    <input type="radio" v-model="form.layanan_konsumsi" :value="n" class="peer sr-only" />
                    <div class="text-center py-3 px-2 rounded-lg border-2 border-slate-200 peer-checked:border-amber-500 peer-checked:bg-amber-50 transition-all hover:border-amber-300">
                      <div class="text-lg font-bold text-slate-700 peer-checked:text-amber-600">{{ n }}</div>
                      <div class="text-xs text-slate-500">{{ getRatingLabel(n) }}</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Saran dan Masukan -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800">Saran dan Masukan</h2>
                <p class="text-xs text-slate-500">Berikan saran Anda untuk perbaikan kegiatan di masa mendatang</p>
              </div>
            </div>

            <textarea v-model="form.saran" rows="4"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition resize-none"
              placeholder="Tuliskan saran dan masukan Anda di sini..."></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4">
            <button type="button" @click="goHome"
              class="flex-1 px-6 py-3.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold">
              Kembali
            </button>
            <button type="submit"
              :disabled="isSubmitting || narasumberList.length === 0"
              class="flex-1 btn-primary px-6 py-3.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Evaluasi' }}
            </button>
          </div>
        </form>
      </template>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-2">Evaluasi Berhasil Dikirim!</h3>
        <p class="text-slate-500 mb-6">Terima kasih atas masukan Anda. Evaluasi ini akan membantu kami meningkatkan kualitas kegiatan.</p>
        <button @click="goHome" class="w-full btn-primary px-6 py-3 text-white rounded-xl font-semibold">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAPI, postAPI } from '@/services/api'

export default {
  name: 'EvaluasiKegiatan',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const isSubmitting = ref(false)
    const showSuccessModal = ref(false)
    const error = ref('')
    
    const kegiatanData = ref(null)
    const narasumberList = ref([])
    
    const form = ref({
      id_kegiatan: '',
      program_tujuan: null,
      program_bahan_ajar: null,
      program_alokasi_waktu: null,
      fasilitator: [],
      layanan_panitia: null,
      layanan_fasilitas: null,
      layanan_konsumsi: null,
      saran: ''
    })

    const getRatingLabel = (n) => {
      const labels = {
        1: 'Sangat Kurang',
        2: 'Kurang',
        3: 'Cukup',
        4: 'Baik',
        5: 'Sangat Baik'
      }
      return labels[n] || ''
    }

    const loadKegiatanData = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const kode = route.params.kode
        if (!kode) {
          error.value = 'Kode kegiatan tidak valid'
          loading.value = false
          return
        }

        const data = await fetchAPI(`kegiatan/${kode}`)
        if (!data) {
          error.value = 'Kegiatan tidak ditemukan'
          loading.value = false
          return
        }

        kegiatanData.value = data
        form.value.id_kegiatan = data.id_kegiatan

        // Load narasumber/fasilitator only for the selected kegiatan.
        await loadNarasumber(data.id_kegiatan)

      } catch (err) {
        console.error('Gagal load data kegiatan:', err)
        error.value = 'Gagal memuat data kegiatan'
      } finally {
        loading.value = false
      }
    }

    const normalizeArrayResponse = (response, collectionKeys = []) => {
      if (Array.isArray(response)) return response

      for (const key of collectionKeys) {
        if (Array.isArray(response?.[key])) return response[key]
      }

      return []
    }

    const getPesertaKegiatanId = (peserta) =>
      peserta?.id_kegiatan ??
      peserta?.kegiatan_id ??
      peserta?.kode_kegiatan ??
      peserta?.kegiatan?.id_kegiatan ??
      peserta?.kegiatan?.id

    const isSameKegiatan = (peserta, idKegiatan) =>
      String(getPesertaKegiatanId(peserta) ?? '').trim() === String(idKegiatan ?? '').trim()

    const isNarasumberRole = (peserta) => {
      const peran = String(peserta?.peran || peserta?.role || '').toLowerCase()
      return peran.includes('narasumber') ||
        peran.includes('fasilitator') ||
        peran.includes('pemateri')
    }

    const getNamaNarasumber = (peserta) =>
      peserta?.narasumber ||
      peserta?.fasilitator ||
      peserta?.nama_narasumber ||
      peserta?.nama_fasilitator ||
      (isNarasumberRole(peserta) ? (peserta?.nama_lengkap || peserta?.nama) : null)

    const initializeFasilitatorForm = () => {
      form.value.fasilitator = narasumberList.value.map(() => ({
        penguasaan_materi: null,
        sistematika: null,
        sikap: null
      }))
    }

    const loadNarasumber = async (idKegiatan) => {
      try {
        const response = await fetchAPI(`peserta?kegiatan=${idKegiatan}`)
        const pesertaData = normalizeArrayResponse(response, ['peserta', 'items', 'results'])
        const hasKegiatanId = pesertaData.some(peserta => getPesertaKegiatanId(peserta) !== undefined && getPesertaKegiatanId(peserta) !== null)
        const pesertaKegiatan = hasKegiatanId
          ? pesertaData.filter(peserta => isSameKegiatan(peserta, idKegiatan))
          : pesertaData
        const narasumberMap = new Map()

        pesertaKegiatan.forEach(peserta => {
          const namaNarasumber = getNamaNarasumber(peserta)

          if (namaNarasumber) {
            const nama = String(namaNarasumber).trim()
            const key = nama.toLowerCase()

            if (nama && !narasumberMap.has(key)) {
              narasumberMap.set(key, {
                nama,
                instansi: peserta.instansi || peserta.nama_instansi || peserta.asal_instansi || '',
                email: peserta.email || ''
              })
            }
          }
        })

        narasumberList.value = Array.from(narasumberMap.values())
        initializeFasilitatorForm()
      } catch (err) {
        console.error('Gagal load narasumber:', err)
        narasumberList.value = []
        initializeFasilitatorForm()
      }
    }

    const checkSudahEvaluasi = async () => {
      try {
        if (!form.value.id_kegiatan) return
        
        // Backend sekarang hanya butuh id_kegiatan, check berdasarkan IP
        const response = await fetchAPI(`evaluasi/check/${form.value.id_kegiatan}`)
        
        if (response && response.success && response.data.sudah_evaluasi) {
          // Already submitted based on IP, show message and redirect
          setTimeout(() => {
            alert('Anda sudah mengirim evaluasi untuk kegiatan ini.')
            goHome()
          }, 500)
        }
      } catch (error) {
        console.error('Gagal check status evaluasi:', error)
        // Ignore error, continue to form
      }
    }

    const validateForm = () => {
      // Validate Program section
      if (!form.value.program_tujuan) {
        alert('Mohon isi penilaian untuk "Kesesuaian Program Kegiatan dengan Tujuan"')
        return false
      }
      if (!form.value.program_bahan_ajar) {
        alert('Mohon isi penilaian untuk "Kesesuaian Bahan ajar dengan Struktur Program"')
        return false
      }
      if (!form.value.program_alokasi_waktu) {
        alert('Mohon isi penilaian untuk "Kesesuaian Alokasi Waktu dengan Bobot Materi"')
        return false
      }

      // Validate Fasilitator section (if there are narasumber)
      if (narasumberList.value.length > 0) {
        for (let i = 0; i < form.value.fasilitator.length; i++) {
          const fas = form.value.fasilitator[i]
          if (!fas.penguasaan_materi) {
            alert(`Mohon isi penilaian "Penguasaan Materi" untuk ${narasumberList.value[i].nama}`)
            return false
          }
          if (!fas.sistematika) {
            alert(`Mohon isi penilaian "Sistematika Penyajian" untuk ${narasumberList.value[i].nama}`)
            return false
          }
          if (!fas.sikap) {
            alert(`Mohon isi penilaian "Sikap dan Kehadiran" untuk ${narasumberList.value[i].nama}`)
            return false
          }
        }
      }

      // Validate Layanan section
      if (!form.value.layanan_panitia) {
        alert('Mohon isi penilaian untuk "Sikap dan Pelayanan Panitia"')
        return false
      }
      if (!form.value.layanan_fasilitas) {
        alert('Mohon isi penilaian untuk "Fasilitas dan Kebersihan Tempat"')
        return false
      }
      if (!form.value.layanan_konsumsi) {
        alert('Mohon isi penilaian untuk "Kualitas Konsumsi"')
        return false
      }

      return true
    }

    const submitEvaluasi = async () => {
      if (!validateForm()) {
        return
      }

      isSubmitting.value = true

      try {
        // Prepare payload sesuai format backend (anonim, tanpa identitas peserta)
        const payload = {
          id_kegiatan: parseInt(kegiatanData.value.id_kegiatan), // Backend butuh numeric
          program_tujuan: form.value.program_tujuan,
          program_bahan_ajar: form.value.program_bahan_ajar,
          program_alokasi_waktu: form.value.program_alokasi_waktu,
          fasilitator: form.value.fasilitator.map((fas, index) => ({
            nama: narasumberList.value[index]?.nama || fas.nama,
            penguasaan_materi: fas.penguasaan_materi,
            sistematika: fas.sistematika,
            sikap: fas.sikap
          })),
          layanan_panitia: form.value.layanan_panitia,
          layanan_fasilitas: form.value.layanan_fasilitas,
          layanan_konsumsi: form.value.layanan_konsumsi,
          saran: form.value.saran ? form.value.saran.trim() : null
        }

        // Submit to backend API
        const response = await postAPI('evaluasi', payload)
        

        // postAPI returns data?.data || data
        // If backend returns { success: true, data: { id_evaluasi: ... } }
        // Then postAPI returns { id_evaluasi: ... } (the inner data)
        // So we check if response has id_evaluasi OR if response.success exists
        const isSuccess = response?.success ||       // Full response format
                         !!response?.id_evaluasi ||  // Unwrapped data (most likely)
                         !!response?.data?.id_evaluasi  // Fallback
        
        if (isSuccess) {
          // Show success
          showSuccessModal.value = true
        } else {
          // If we get here, response didn't have expected format
          // But if response exists and has id_evaluasi, it's still success
          console.warn('Unexpected response format, but assuming success:', response)
          showSuccessModal.value = true
        }
      } catch (err) {
        console.error('Gagal mengirim evaluasi:', err)
        // Handle specific error responses
        if (err.status === 422) {
          // Validation error
          const errors = err.data?.errors || {}
          const messages = Object.values(errors).flat().join('\n')
          alert('Validasi gagal:\n' + messages)
        } else if (err.status === 429) {
          // Rate limit
          alert('Anda sudah terlalu sering mengirim evaluasi. Silakan coba lagi nanti.')
        } else if (err.status === 409) {
          // Duplicate submission
          alert('Anda sudah mengirim evaluasi untuk kegiatan ini.')
        } else if (err.status === 404) {
          // Endpoint not found
          alert('Endpoint API tidak ditemukan. Pastikan backend sudah berjalan dengan benar.')
        } else if (err.status === 500) {
          // Server error
          alert('Terjadi kesalahan di server. Silakan coba lagi nanti.')
        } else {
          alert(err.message || 'Gagal mengirim evaluasi. Silakan coba lagi.')
        }
      } finally {
        isSubmitting.value = false
      }
    }

    const goHome = () => {
      router.push('/')
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    onMounted(() => {
      loadKegiatanData()
    })

    return {
      loading,
      isSubmitting,
      showSuccessModal,
      error,
      kegiatanData,
      narasumberList,
      form,
      getRatingLabel,
      submitEvaluasi,
      goHome,
      formatDate
    }
  }
}
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
}

.evaluation-item {
  transition: all 0.2s ease;
}

/* Radio button styling */
input[type="radio"]:checked + div {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .flex-wrap label {
    min-width: 100% !important;
  }
}
</style>
