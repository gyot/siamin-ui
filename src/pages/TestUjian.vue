<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <!-- Loading -->
      <div v-if="loadingKegiatan" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600 font-medium">Memuat data kegiatan...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-800 mb-2">Kegiatan Tidak Ditemukan</h2>
        <p class="text-slate-500 mb-6">{{ error }}</p>
        <button @click="goHome" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Kembali ke Beranda
        </button>
      </div>

      <template v-else-if="kegiatanData">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-800">Ujian Online</h1>
              <p class="text-sm text-slate-500">Kerjakan soal ujian untuk kegiatan ini</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p class="text-xs font-medium text-slate-500 uppercase mb-1">Nama Kegiatan</p>
            <p class="text-base font-semibold text-slate-800">{{ kegiatanData.nama_kegiatan }}</p>
            <p v-if="currentTpk" class="text-sm text-slate-600 mt-1">
              TPK: {{ currentTpk.lokasi }}{{ currentTpk.kabupaten_kota ? ` (${currentTpk.kabupaten_kota})` : '' }}
            </p>
          </div>
        </div>

        <!-- Alert -->
        <div v-if="alert.show" :class="[
          'mb-4 p-4 rounded-xl text-sm font-medium',
          alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
        ]">
          {{ alert.message }}
        </div>

        <!-- STEP 1: Pilih Peserta -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <h2 class="text-lg font-bold text-slate-800">Pilih Peserta</h2>
          </div>

          <select
            v-model="selectedPesertaId"
            @change="onPesertaChange"
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm bg-white"
          >
            <option value="">-- Pilih nama peserta --</option>
            <option v-for="p in pesertaList" :key="p.id_peserta" :value="p.id_peserta">
              {{ p.nama_lengkap }}{{ p.nip ? ` (${p.nip})` : '' }}
            </option>
          </select>

          <!-- Data Diri -->
          <div v-if="selectedPeserta" class="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 class="font-semibold text-slate-700 mb-3 text-sm">Data Diri Peserta</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span class="text-slate-500">Nama:</span> <span class="font-medium text-slate-800">{{ selectedPeserta.nama_lengkap || '-' }}</span></div>
              <div><span class="text-slate-500">NIP:</span> <span class="font-medium text-slate-800">{{ selectedPeserta.nip || '-' }}</span></div>
              <div><span class="text-slate-500">Pangkat/Gol:</span> <span class="font-medium text-slate-800">{{ formatPangkat(selectedPeserta) }}</span></div>
              <div><span class="text-slate-500">Jabatan:</span> <span class="font-medium text-slate-800">{{ selectedPeserta.jabatan || '-' }}</span></div>
              <div><span class="text-slate-500">Instansi:</span> <span class="font-medium text-slate-800">{{ selectedPeserta.nama_instansi || '-' }}</span></div>
              <div><span class="text-slate-500">Kab/Kota:</span> <span class="font-medium text-slate-800">{{ formatKabKota(selectedPeserta) }}</span></div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Pilih Paket Soal -->
        <div v-if="selectedPeserta" class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <h2 class="text-lg font-bold text-slate-800">Pilih Paket Soal</h2>
          </div>

          <select
            v-model="selectedPaketId"
            @change="onPaketChange"
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-sm bg-white"
          >
            <option value="">-- Pilih paket soal --</option>
            <option v-for="p in paketList" :key="p.id_paket_soal" :value="p.id_paket_soal">
              {{ p.nama_paket }} ({{ p.soals_count }} soal)
            </option>
          </select>
        </div>

        <!-- STEP 3: Kerjakan Soal -->
        <div v-if="selectedPaketId && soalList.length > 0 && !hasilData" class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100 soal-area"
          @copy.prevent @cut.prevent @paste.prevent @contextmenu.prevent>
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <h2 class="text-lg font-bold text-slate-800">Kerjakan Soal</h2>
          </div>

          <div v-for="(soal, index) in soalList" :key="soal.id_soal" class="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p class="font-semibold text-slate-800 mb-3">{{ index + 1 }}. {{ soal.pertanyaan }}</p>
            <div class="space-y-2">
              <label
                v-for="huruf in (pilihanOrder[soal.id_soal] || ['a', 'b', 'c', 'd'])"
                :key="huruf"
                :class="[
                  'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition',
                  jawaban[soal.id_soal] === huruf
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                ]"
              >
                <input
                  type="radio"
                  :name="`soal_${soal.id_soal}`"
                  :value="huruf"
                  v-model="jawaban[soal.id_soal]"
                  class="mt-0.5 accent-blue-600"
                />
                <span class="text-sm text-slate-700">{{ soal[`pilihan_${huruf}`] }}</span>
              </label>
            </div>
          </div>

          <button
            @click="submitAnswers"
            :disabled="submitting"
            :class="[
              'mt-4 w-full text-white font-semibold py-3 rounded-xl transition',
              submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            ]"
          >
            {{ submitting ? 'Mengirim...' : 'Kirim Jawaban' }}
          </button>
        </div>

        <!-- STEP 4: Hasil -->
         
        <div v-if="hasilData" class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-lg font-bold text-slate-800">Selesai! Terimakasih telah menjawab.</h2>
          </div>

          <!-- <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
              <div class="text-2xl font-bold text-blue-700">{{ hasilData.ringkasan.total_soal }}</div>
              <div class="text-xs text-blue-600">Total Soal</div>
            </div>
            <div class="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <div class="text-2xl font-bold text-green-700">{{ hasilData.ringkasan.jawaban_benar }}</div>
              <div class="text-xs text-green-600">Benar</div>
            </div>
            <div class="bg-red-50 rounded-xl p-4 text-center border border-red-100">
              <div class="text-2xl font-bold text-red-700">{{ hasilData.ringkasan.jawaban_salah }}</div>
              <div class="text-xs text-red-600">Salah</div>
            </div>
            <div class="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
              <div class="text-2xl font-bold text-amber-700">{{ hasilData.ringkasan.skor }}</div>
              <div class="text-xs text-amber-600">Skor</div>
            </div>
          </div>

          <h3 class="font-semibold text-slate-700 mb-3">Detail Jawaban</h3>
          <div v-for="(d, index) in hasilData.detail" :key="d.id_soal" :class="[
            'mb-4 p-4 rounded-xl border',
            d.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          ]">
            <div class="flex items-start justify-between mb-2">
              <p class="font-semibold text-slate-800 text-sm">{{ index + 1 }}. {{ d.pertanyaan }}</p>
              <span :class="[
                'text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2',
                d.is_correct ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              ]">
                {{ d.is_correct ? 'Benar' : 'Salah' }}
              </span>
            </div>
            <div v-for="huruf in ['a', 'b', 'c', 'd']" :key="huruf" :class="[
              'ml-4 text-sm py-0.5',
              huruf === d.jawaban_benar ? 'text-green-700 font-semibold' : '',
              huruf === d.jawaban_peserta && huruf !== d.jawaban_benar ? 'text-red-700 font-semibold line-through' : '',
              huruf !== d.jawaban_benar && huruf !== d.jawaban_peserta ? 'text-slate-500' : ''
            ]">
              {{ d[`pilihan_${huruf}`] }}
              <span v-if="huruf === d.jawaban_benar" class="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded ml-1">Kunci</span>
              <span v-if="huruf === d.jawaban_peserta && huruf !== d.jawaban_benar" class="text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded ml-1">Jawaban Anda</span>
            </div>
          </div> -->
        </div> 
      </template>
    </div>
  </div>
</template>

<script>
import { getKegiatan } from '@/services/kegiatan'
import { getPesertaByKegiatan, getPesertaDetail, getPaketByKegiatan, getSoalByPaket, submitJawaban, getHasil } from '@/services/test'

export default {
  name: 'TestUjian',
  data() {
    return {
      loadingKegiatan: true,
      error: null,
      kegiatanData: null,
      currentTpk: null,
      pesertaList: [],
      paketList: [],
      soalList: [],
      selectedPesertaId: '',
      selectedPeserta: null,
      selectedPaketId: '',
      jawaban: {},
      pilihanOrder: {},
      submitting: false,
      hasilData: null,
      alert: { show: false, type: 'error', message: '' },
    }
  },
  computed: {
    kode() { return this.$route.params.kode },
    idTpk() { return this.$route.params.idTpk || null },
  },
  async mounted() {
    await this.loadKegiatan()
    await this.loadPeserta()
  },
  methods: {
    async loadKegiatan() {
      this.loadingKegiatan = true
      try {
        const data = await getKegiatan(this.kode)
        this.kegiatanData = data
        if (this.idTpk && Array.isArray(data.daftar_tpk)) {
          this.currentTpk = data.daftar_tpk.find(t => String(t.id_tpk) === String(this.idTpk)) || null
        }
      } catch (e) {
        this.error = 'Kegiatan tidak ditemukan atau tidak dapat diakses.'
      } finally {
        this.loadingKegiatan = false
      }
    },
    async loadPeserta() {
      try {
        const data = await getPesertaByKegiatan(this.kode, this.idTpk)
        this.pesertaList = Array.isArray(data) ? data : (data?.data || [])
      } catch {
        this.showAlert('Gagal memuat data peserta', 'error')
      }
    },
    async onPesertaChange() {
      this.selectedPeserta = null
      this.selectedPaketId = ''
      this.soalList = []
      this.hasilData = null
      this.jawaban = {}

      if (!this.selectedPesertaId) return

      try {
        const data = await getPesertaDetail(this.selectedPesertaId)
        this.selectedPeserta = data
        await this.loadPaket()
      } catch {
        this.showAlert('Gagal memuat data peserta', 'error')
      }
    },
    async loadPaket() {
      try {
        const data = await getPaketByKegiatan(this.kode)
        this.paketList = Array.isArray(data) ? data : (data?.data || [])
      } catch {
        this.showAlert('Gagal memuat paket soal', 'error')
      }
    },
    async onPaketChange() {
      this.soalList = []
      this.hasilData = null
      this.jawaban = {}
      this.pilihanOrder = {}

      if (!this.selectedPaketId) return

      try {
        const data = await getSoalByPaket(this.selectedPaketId)
        const soals = data?.soals || []
        this.soalList = this.shuffleArray(soals)
        this.soalList.forEach(s => {
          this.jawaban[s.id_soal] = null
          this.pilihanOrder[s.id_soal] = this.shuffleArray(['a', 'b', 'c', 'd'])
        })
      } catch {
        this.showAlert('Gagal memuat soal', 'error')
      }
    },
    shuffleArray(arr) {
      const shuffled = [...arr]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    },
    async submitAnswers() {
      const unanswered = this.soalList.find(s => !this.jawaban[s.id_soal])
      if (unanswered) {
        const idx = this.soalList.indexOf(unanswered) + 1
        this.showAlert(`Soal nomor ${idx} belum dijawab`, 'error')
        return
      }

      this.submitting = true
      try {
        const payload = {
          id_peserta: Number(this.selectedPesertaId),
          id_paket_soal: Number(this.selectedPaketId),
          jawaban: this.soalList.map(s => ({
            id_soal: s.id_soal,
            jawaban: this.jawaban[s.id_soal],
          })),
        }

        await submitJawaban(payload)
        this.showAlert('Jawaban berhasil dikirim!', 'success')

        const hasil = await getHasil(this.selectedPesertaId, this.selectedPaketId)
        this.hasilData = hasil
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Gagal mengirim jawaban'
        this.showAlert(msg, 'error')
      } finally {
        this.submitting = false
      }
    },
    showAlert(message, type = 'error') {
      this.alert = { show: true, type, message }
      setTimeout(() => { this.alert.show = false }, 5000)
    },
    formatPangkat(p) {
      if (p?.pangkat && p?.gol) return `${p.pangkat} / ${p.gol}`
      return p?.pangkat || p?.gol || '-'
    },
    formatKabKota(p) {
      if (p?.kab_kota && p?.provinsi) return `${p.kab_kota}, ${p.provinsi}`
      return p?.kab_kota || p?.provinsi || '-'
    },
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.soal-area {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
</style>
