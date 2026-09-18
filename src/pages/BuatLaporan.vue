<template>
  <div class="min-h-screen bg-slate-100 p-4 sm:p-6">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Buat Laporan</h1>
          <p class="text-sm text-slate-500">{{ kegiatan?.nama_kegiatan || 'Memuat...' }}</p>
        </div>
        <div class="flex gap-3">
          <button @click="mode = mode === 'form' ? 'preview' : 'form'"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {{ mode === 'form' ? 'Preview' : 'Edit' }}
          </button>
          <button @click="saveDraft" class="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            Simpan Draft
          </button>
          <button @click="downloadDocx" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download DOCX
          </button>
        </div>
      </div>

      <div v-if="loading" class="rounded-2xl bg-white p-16 text-center shadow-sm">
        <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
        <p class="mt-4 text-slate-500">Memuat data kegiatan...</p>
      </div>

      <div v-else-if="error" class="rounded-2xl bg-red-50 p-8 text-center">
        <p class="text-red-700 font-semibold">{{ error }}</p>
      </div>

      <div v-else-if="mode === 'form'" class="space-y-6">
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-800 mb-4">Informasi Otomatis dari Sistem</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span class="text-slate-500">Kegiatan:</span> <span class="font-medium">{{ kegiatan.nama_kegiatan }}</span></div>
            <div><span class="text-slate-500">Tanggal:</span> <span class="font-medium">{{ formatDate(kegiatan.tanggal_mulai) }} s.d {{ formatDate(kegiatan.tanggal_selesai) }}</span></div>
            <div><span class="text-slate-500">Metode:</span> <span class="font-medium capitalize">{{ kegiatan.metode_pelaksanaan }}</span></div>
            <div><span class="text-slate-500">Jumlah Peserta:</span> <span class="font-medium">{{ pesertaList.length }} orang</span></div>
            <div><span class="text-slate-500">TPK:</span> <span class="font-medium">{{ tpkLabel }}</span></div>
            <div><span class="text-slate-500">Evaluasi:</span> <span class="font-medium">{{ evalStats?.total_evaluasi || 0 }} responden</span></div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-800 mb-4">Data Narasi Laporan</h3>
          <p class="text-xs text-slate-500 mb-6">Field berikut perlu diisi manual karena tidak tersedia dari database. Data disimpan otomatis di browser.</p>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Angkatan</label>
              <input v-model="draft.angkatan" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none" placeholder="Contoh: Angkatan I" />
            </div>

            <div class="border-t border-slate-100 pt-6">
              <h4 class="text-base font-bold text-slate-800 mb-3">Lembar Pengesahan</h4>
              <div v-for="(p, i) in draft.pengesahan" :key="i" class="mb-4 p-4 bg-slate-50 rounded-lg">
                <p class="text-xs font-semibold text-slate-500 mb-2">{{ p.peran }}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input v-model="p.nama" class="px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Nama" />
                  <input v-model="p.nip" class="px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="NIP" />
                  <input v-model="p.jabatan" class="px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Jabatan" />
                  <input v-model="p.tanggal" type="date" class="px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" />
                </div>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-6">
              <h4 class="text-base font-bold text-slate-800 mb-3">Kata Pengantar</h4>
              <textarea v-model="draft.kata_pengantar" rows="5" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Tulis kata pengantar..."></textarea>
            </div>

            <div class="border-t border-slate-100 pt-6">
              <h4 class="text-base font-bold text-slate-800 mb-3">BAB I - Pendahuluan</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">A. Latar Belakang</label>
                  <textarea v-model="draft.latar_belakang" rows="5" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Tulis latar belakang..."></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">B. Dasar Hukum (pisahkan dengan enter)</label>
                  <textarea v-model="dasarHukumText" rows="4" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="1. UU No. 20 Tahun 2003&#10;2. PP No. 57 Tahun 2021"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">C. Tujuan</label>
                  <textarea v-model="draft.tujuan_umum" rows="4" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Tulis tujuan kegiatan..."></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">D. Sasaran</label>
                  <textarea v-model="draft.sasaran_kegiatan" rows="3" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Tulis sasaran kegiatan..."></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">E. Pembiayaan</label>
                  <textarea v-model="draft.sumber_dana" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Sumber pembiayaan..."></textarea>
                </div>
              </div>
            </div>

            <div class="border-t border-slate-100 pt-6">
              <h4 class="text-base font-bold text-slate-800 mb-3">BAB III - Rekaman Proses</h4>
              <div v-for="(rec, i) in draft.rekaman_proses_per_hari" :key="i" class="mb-4 p-4 bg-slate-50 rounded-lg">
                <p class="text-xs font-semibold text-slate-500 mb-2">{{ rec.hari }} - {{ formatDate(rec.tanggal) }}</p>
                <textarea v-model="rec.narasi" rows="3" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Narasi pelaksanaan hari ini..."></textarea>
              </div>
              <button v-if="draft.rekaman_proses_per_hari.length === 0" @click="generateRekamanDays" type="button"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                + Generate hari dari tanggal kegiatan
              </button>
            </div>

            <div class="border-t border-slate-100 pt-6">
              <h4 class="text-base font-bold text-slate-800 mb-3">BAB V - Penutup</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">A. Kesimpulan</label>
                  <textarea v-model="draft.simpulan" rows="4" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Tulis kesimpulan..."></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">B. Saran</label>
                  <textarea v-model="draft.rekomendasi" rows="4" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm" placeholder="Tulis saran..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div class="space-y-8 text-slate-800 leading-relaxed" style="font-family: 'Times New Roman', serif; font-size: 12pt;">
          <div class="text-center py-12">
            <h2 class="text-xl font-bold uppercase tracking-wide">Laporan</h2>
            <h3 class="mt-4 text-lg font-bold">{{ kegiatan.nama_kegiatan }}</h3>
            <p class="mt-2">{{ draft.angkatan }}</p>
            <p class="mt-1">TPK {{ tpkLabel }}</p>
            <p class="mt-1">Tanggal, {{ formatDate(kegiatan.tanggal_mulai) }} s.d {{ formatDate(kegiatan.tanggal_selesai) }}</p>
            <div class="mt-6">
              <p class="font-bold uppercase">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</p>
              <p>BALAI PENJAMINAN MUTU PENDIDIKAN</p>
              <p>PROVINSI NUSA TENGGARA BARAT</p>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-bold uppercase text-center mb-4">Lembar Pengesahan</h3>
            <table class="w-full border border-slate-400 text-sm">
              <thead><tr class="bg-slate-100">
                <th class="border border-slate-300 px-3 py-2 text-left">Nama</th>
                <th class="border border-slate-300 px-3 py-2 text-left">Jabatan</th>
                <th class="border border-slate-300 px-3 py-2 text-left">Tanda Tangan</th>
                <th class="border border-slate-300 px-3 py-2 text-left">Tanggal</th>
              </tr></thead>
              <tbody>
                <tr v-for="(p, i) in draft.pengesahan" :key="i">
                  <td class="border border-slate-300 px-3 py-2"><span class="text-xs text-slate-500">{{ p.peran }}:</span><br/><span class="font-medium">{{ p.nama || '-' }}</span><br/><span class="text-xs text-slate-500">NIP. {{ p.nip || '-' }}</span></td>
                  <td class="border border-slate-300 px-3 py-2">{{ p.jabatan || '-' }}</td>
                  <td class="border border-slate-300 px-3 py-2 h-16"></td>
                  <td class="border border-slate-300 px-3 py-2">{{ formatDate(p.tanggal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-bold uppercase text-center mb-4">Kata Pengantar</h3>
            <div class="text-justify whitespace-pre-line">{{ draft.kata_pengantar || '(Belum diisi)' }}</div>
          </div>

          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-bold uppercase text-center mb-4">BAB I PENDAHULUAN</h3>
            <h4 class="font-bold mb-2">A. Latar Belakang</h4>
            <div class="text-justify whitespace-pre-line mb-4">{{ draft.latar_belakang || '(Belum diisi)' }}</div>
            <h4 class="font-bold mb-2">B. Dasar Hukum</h4>
            <ol class="list-decimal pl-6 space-y-1 mb-4">
              <li v-for="(d, i) in parsedDasarHukum" :key="i">{{ d }}</li>
              <li v-if="parsedDasarHukum.length === 0" class="text-slate-400">(Belum diisi)</li>
            </ol>
            <h4 class="font-bold mb-2">C. Tujuan</h4>
            <div class="text-justify whitespace-pre-line mb-4">{{ draft.tujuan_umum || '(Belum diisi)' }}</div>
            <h4 class="font-bold mb-2">D. Sasaran</h4>
            <div class="text-justify mb-4">{{ draft.sasaran_kegiatan || '(Belum diisi)' }}</div>
            <h4 class="font-bold mb-2">E. Pembiayaan</h4>
            <div class="text-justify">{{ draft.sumber_dana || '(Belum diisi)' }}</div>
          </div>

          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-bold uppercase text-center mb-4">BAB II PERSIAPAN KEGIATAN</h3>
            <h4 class="font-bold mb-3">Personalia</h4>
            <table class="w-full border border-slate-400 text-xs">
              <thead><tr class="bg-slate-100">
                <th class="border border-slate-300 px-2 py-1.5 w-8">No</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Nama / NIP</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Peran</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Instansi</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Jabatan</th>
              </tr></thead>
              <tbody>
                <tr v-for="(p, i) in pesertaList" :key="i">
                  <td class="border border-slate-300 px-2 py-1.5 text-center">{{ i + 1 }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.nama_lengkap }}<br/><span class="text-slate-500">NIP. {{ p.nip || '-' }}</span></td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.peran || 'Peserta' }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.nama_instansi || '-' }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.jabatan || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-bold uppercase text-center mb-4">BAB III PELAKSANAAN KEGIATAN</h3>
            <div v-if="strukturProgram.length > 0" class="mb-6">
              <h4 class="font-bold mb-3">A. Struktur Program</h4>
              <table class="w-full border border-slate-400 text-xs">
                <thead><tr class="bg-slate-100">
                  <th class="border border-slate-300 px-2 py-1.5 w-8">No</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-left">Kategori</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-left">Materi</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center w-12">JP</th>
                </tr></thead>
                <tbody>
                  <tr v-for="(s, i) in strukturProgram" :key="i">
                    <td class="border border-slate-300 px-2 py-1.5 text-center">{{ i + 1 }}</td>
                    <td class="border border-slate-300 px-2 py-1.5">{{ s.kategori }}</td>
                    <td class="border border-slate-300 px-2 py-1.5">{{ s.materi }}</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center">{{ s.jp }}</td>
                  </tr>
                  <tr class="bg-slate-50 font-bold">
                    <td colspan="3" class="border border-slate-300 px-2 py-1.5 text-right">Total JP</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center">{{ strukturProgram.reduce((a, s) => a + s.jp, 0) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="jadwalPerKelas.length > 0" class="mb-6">
              <h4 class="font-bold mb-3">B. Jadwal Kegiatan</h4>
              <div v-for="kelas in jadwalPerKelas" :key="kelas.nama_kelas" class="mb-6">
                <h5 v-if="jadwalPerKelas.length > 1" class="font-bold text-sm mb-2 text-violet-700">{{ kelas.nama_kelas }}</h5>
                <div v-for="day in kelas.jadwal" :key="day.hari" class="mb-4">
                  <h5 class="font-bold text-sm mb-2">{{ day.hari }} - {{ formatDate(day.tanggal) }}</h5>
                  <table class="w-full border border-slate-400 text-xs">
                    <thead><tr class="bg-slate-100">
                      <th class="border border-slate-300 px-2 py-1.5 text-left w-28">Waktu</th>
                      <th class="border border-slate-300 px-2 py-1.5 text-left">Kegiatan / Materi</th>
                      <th class="border border-slate-300 px-2 py-1.5 text-center w-12">JP</th>
                      <th class="border border-slate-300 px-2 py-1.5 text-left w-28">PJ</th>
                    </tr></thead>
                    <tbody>
                      <tr v-for="(item, ii) in day.items" :key="ii" :class="item.tipe === 'istirahat' ? 'bg-amber-50' : ''">
                        <td class="border border-slate-300 px-2 py-1.5">{{ item.jam_mulai }} - {{ item.jam_selesai }}</td>
                        <td class="border border-slate-300 px-2 py-1.5" :class="item.tipe === 'istirahat' ? 'italic text-slate-500' : ''">{{ item.kegiatan || '-' }}</td>
                        <td class="border border-slate-300 px-2 py-1.5 text-center">{{ item.tipe === 'istirahat' ? '-' : item.jp }}</td>
                        <td class="border border-slate-300 px-2 py-1.5">{{ item.pj || '-' }}</td>
                      </tr>
                      <tr class="bg-slate-50 font-bold">
                        <td colspan="2" class="border border-slate-300 px-2 py-1.5 text-right">Total JP</td>
                        <td class="border border-slate-300 px-2 py-1.5 text-center">{{ day.items.reduce((s, i) => s + (i.tipe === 'istirahat' ? 0 : Number(i.jp) || 0), 0) }}</td>
                        <td class="border border-slate-300 px-2 py-1.5"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div v-if="draft.rekaman_proses_per_hari.length > 0">
              <h4 class="font-bold mb-3">C. Rekaman Proses</h4>
              <div v-for="rec in draft.rekaman_proses_per_hari" :key="rec.hari" class="mb-4">
                <h5 class="font-bold text-sm mb-1">{{ rec.hari }} - {{ formatDate(rec.tanggal) }}</h5>
                <p class="text-justify">{{ rec.narasi || '(Belum diisi)' }}</p>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-bold uppercase text-center mb-4">BAB IV EVALUASI KEGIATAN</h3>
            <p class="text-xs text-slate-500 mb-3">Jumlah responden: {{ evalStats?.total_evaluasi || 0 }} orang</p>
            <div v-if="evalDetails.length > 0">
              <h4 class="font-bold mb-2">Evaluasi Program</h4>
              <table class="w-full border border-slate-400 text-xs mb-4">
                <thead><tr class="bg-slate-100">
                  <th class="border border-slate-300 px-2 py-1.5 text-left">Aspek</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Sangat Sesuai</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Sesuai</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Cukup</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Kurang</th>
                </tr></thead>
                <tbody>
                  <tr v-for="row in programRows" :key="row.label">
                    <td class="border border-slate-300 px-2 py-1.5">{{ row.label }}</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="pctColor(row.ss)">{{ row.ss }}%</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="pctColor(row.s)">{{ row.s }}%</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="pctColor(row.c)">{{ row.c }}%</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="pctColor(row.k)">{{ row.k }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-sm text-slate-400 italic">Data evaluasi belum tersedia.</div>
          </div>

          <div class="border-t border-slate-200 pt-6">
            <h3 class="text-lg font-bold uppercase text-center mb-4">BAB V PENUTUP</h3>
            <h4 class="font-bold mb-2">A. Kesimpulan</h4>
            <p class="text-justify mb-4">{{ draft.simpulan || '(Belum diisi)' }}</p>
            <h4 class="font-bold mb-2">B. Saran</h4>
            <div class="text-justify whitespace-pre-line">{{ draft.rekomendasi || '(Belum diisi)' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAPI } from '@/services/api'
import { listKegiatan } from '@/services/kegiatan'
import { getActivityReportDraft, getActivityReportDraftFromAPI, saveActivityReportDraftToAPI, getJadwalFromAPI } from '@/services/activityReportDraft'

export default {
  name: 'BuatLaporan',
  setup() {
    const route = useRoute()
    const kegiatanId = computed(() => route.params.id)

    const mode = ref('form')
    const loading = ref(true)
    const error = ref('')
    const kegiatan = ref(null)
    const pesertaList = ref([])
    const evalStats = ref(null)
    const evalDetails = ref([])
    const draft = ref(getActivityReportDraft(kegiatanId.value))
    const dasarHukumText = ref(Array.isArray(draft.value.dasar_hukum) ? draft.value.dasar_hukum.join('\n') : '')

    const tpkLabel = computed(() => {
      const tpk = kegiatan.value?.daftar_tpk || kegiatan.value?.tpk || []
      if (Array.isArray(tpk) && tpk.length > 0) {
        return tpk.map(t => `${t.lokasi}${t.kabupaten_kota ? ` (${t.kabupaten_kota})` : ''}`).join(', ')
      }
      return kegiatan.value?.lokasi || '-'
    })

    const parsedDasarHukum = computed(() => {
      return dasarHukumText.value.split('\n').map(s => s.trim()).filter(Boolean)
    })

    const strukturProgram = computed(() => {
      const allJadwal = jadwalPerKelas.value.flatMap(k => k.jadwal || [])
      if (allJadwal.length === 0) return []
      const grouped = new Map()
      for (const day of allJadwal) {
        for (const item of (day.items || [])) {
          if (item.tipe === 'istirahat' || !item.kegiatan) continue
          const key = `${item.kategori || 'Pokok'}|${item.kegiatan}`
          const existing = grouped.get(key) || { kategori: item.kategori || 'Pokok', materi: item.kegiatan, jp: 0 }
          existing.jp += Number(item.jp) || 0
          grouped.set(key, existing)
        }
      }
      const kategoriOrder = { 'Umum': 0, 'Pokok': 1, 'Penunjang': 2 }
      return Array.from(grouped.values()).sort((a, b) => (kategoriOrder[a.kategori] ?? 9) - (kategoriOrder[b.kategori] ?? 9))
    })

    const jadwalPerKelas = computed(() => {
      const d = draft.value
      if (d.jadwal_per_kelas?.length > 0) {
        return d.jadwal_per_kelas
      }
      if (d.jadwal_harian?.length > 0) {
        return [{ nama_kelas: 'Semua Peserta', jadwal: d.jadwal_harian }]
      }
      return []
    })

    const extractRows = (response) => {
      if (Array.isArray(response)) return response
      if (Array.isArray(response?.data)) return response.data
      return []
    }

    const programRows = computed(() => {
      const n = evalDetails.value.length || 1
      const keys = ['program_tujuan', 'program_bahan_ajar', 'program_alokasi_waktu']
      const labels = ['Kesesuaian Program dengan Tujuan', 'Kesesuaian Bahan Ajar', 'Kesesuaian Alokasi Waktu']
      return keys.map((key, i) => {
        const scores = evalDetails.value.map(e => Number(e?.[key])).filter(s => s >= 1 && s <= 5)
        const dist = [1,2,3,4,5].map(s => scores.filter(v => v === s).length)
        const total = scores.length || 1
        return { label: labels[i], ss: Math.round(dist[4]/total*100), s: Math.round(dist[3]/total*100), c: Math.round(dist[2]/total*100), k: Math.round((dist[0]+dist[1])/total*100) }
      })
    })

    const formatDate = (value) => {
      if (!value) return '-'
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return value
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    const pctColor = (pct) => {
      if (pct >= 70) return 'text-emerald-700 font-bold'
      if (pct >= 40) return 'text-blue-700 font-medium'
      if (pct > 0) return 'text-amber-700'
      return 'text-slate-400'
    }

    const generateRekamanDays = () => {
      const jadwal = draft.value.jadwal_harian || []
      if (jadwal.length > 0) {
        draft.value.rekaman_proses_per_hari = jadwal.map(day => ({
          hari: day.hari,
          tanggal: day.tanggal,
          narasi: ''
        }))
      } else if (kegiatan.value) {
        const start = new Date(kegiatan.value.tanggal_mulai)
        const end = new Date(kegiatan.value.tanggal_selesai)
        const days = []
        let current = new Date(start)
        let i = 0
        const labels = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima', 'Keenam', 'Ketujuh']
        while (current <= end) {
          days.push({ hari: `Hari ${labels[i] || (i + 1)}`, tanggal: current.toISOString().split('T')[0], narasi: '' })
          current.setDate(current.getDate() + 1)
          i++
        }
        draft.value.rekaman_proses_per_hari = days
      }
    }

    const saveDraft = async () => {
      draft.value.dasar_hukum = parsedDasarHukum.value
      await saveActivityReportDraftToAPI(kegiatanId.value, draft.value)
      alert('Draft berhasil disimpan!')
    }

    const downloadDocx = async () => {
      try {
        draft.value.dasar_hukum = parsedDasarHukum.value
        draft.value.struktur_program = strukturProgram.value
        const { generateLaporanDocx } = await import('@/utils/generateLaporanDocx')
        await generateLaporanDocx({
          kegiatan: kegiatan.value,
          peserta: pesertaList.value,
          evaluasi: {
            total_responden: evalStats.value?.total_evaluasi || evalDetails.value.length,
            program: {
              kesesuaian_program_tujuan: buildDist('program_tujuan'),
              kesesuaian_bahan_ajar: buildDist('program_bahan_ajar'),
              kesesuaian_alokasi_waktu: buildDist('program_alokasi_waktu')
            },
            fasilitator: buildFasilitatorEval(),
            layanan: {
              sikap_pelayanan_panitia: buildDist('layanan_panitia'),
              fasilitas_kebersihan: buildDist('layanan_fasilitas'),
              kualitas_konsumsi: buildDist('layanan_konsumsi')
            }
          },
          draft: draft.value,
          tpk: { lokasi: tpkLabel.value, kabupaten_kota: '' }
        })
      } catch (e) {
        console.error('Gagal download DOCX:', e)
        alert('Gagal membuat DOCX: ' + e.message)
      }
    }

    const buildDist = (key) => {
      const scores = evalDetails.value.map(e => Number(e?.[key])).filter(s => s >= 1 && s <= 5)
      return { sangat_sesuai: scores.filter(s => s === 5).length, sesuai: scores.filter(s => s === 4).length, cukup: scores.filter(s => s === 3).length, kurang: scores.filter(s => s <= 2).length }
    }

    const buildFasilitatorEval = () => {
      if (evalStats.value?.detail_fasilitator) {
        return evalStats.value.detail_fasilitator.map(f => ({
          nama: f.nama,
          penguasaan_materi: { sangat_sesuai: 0, sesuai: 0, cukup: 0, kurang: 0 },
          sistematika_penyajian: { sangat_sesuai: 0, sesuai: 0, cukup: 0, kurang: 0 },
          sikap_kehadiran: { sangat_sesuai: 0, sesuai: 0, cukup: 0, kurang: 0 }
        }))
      }
      return []
    }

    onMounted(async () => {
      try {
        const id = kegiatanId.value
        const [kegData, pesertaData] = await Promise.all([
          fetchAPI(`kegiatan/${id}`).catch(() => null),
          fetchAPI(`kegiatan/tim/${id}`).catch(() => ({ data: [] }))
        ])
        kegiatan.value = kegData?.data || kegData || {}
        pesertaList.value = extractRows(pesertaData).filter(p => String(p.id_kegiatan ?? '') === String(id))

        try {
          const [stats, details] = await Promise.all([
            fetchAPI(`evaluasi/${id}/statistik`).catch(() => null),
            fetchAPI(`evaluasi/${id}`).catch(() => [])
          ])
          evalStats.value = stats?.data || stats || null
          evalDetails.value = extractRows(details)
        } catch { /* evaluasi optional */ }

        const savedDraft = await getActivityReportDraftFromAPI(id)
        if (savedDraft.rekaman_proses_per_hari?.length > 0 || savedDraft.kata_pengantar || savedDraft.latar_belakang) {
          draft.value = savedDraft
          dasarHukumText.value = Array.isArray(savedDraft.dasar_hukum) ? savedDraft.dasar_hukum.join('\n') : ''
        }

        const jadwalData = await getJadwalFromAPI(id)
        if (jadwalData.jadwal_per_kelas?.length > 0) {
          draft.value.jadwal_per_kelas = jadwalData.jadwal_per_kelas
        } else if (jadwalData.jadwal_harian?.length > 0) {
          draft.value.jadwal_harian = jadwalData.jadwal_harian
        }
      } catch (e) {
        error.value = 'Gagal memuat data kegiatan: ' + e.message
      } finally {
        loading.value = false
      }
    })

    return {
      mode, loading, error,       kegiatan, pesertaList, evalStats, evalDetails,
      draft, dasarHukumText, tpkLabel, parsedDasarHukum, programRows, strukturProgram, jadwalPerKelas,
      formatDate, pctColor, generateRekamanDays, saveDraft, downloadDocx
    }
  }
}
</script>
