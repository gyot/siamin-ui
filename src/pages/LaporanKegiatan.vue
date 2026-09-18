<template>
  <div class="min-h-screen bg-slate-100 p-4 sm:p-6">
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Laporan Kegiatan</h1>
          <p class="text-sm text-slate-500">Preview dan download laporan kegiatan</p>
        </div>
        <button @click="downloadDocx" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Download DOCX
        </button>
      </div>

      <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 print:p-0 print:shadow-none print:ring-0">
        <div class="space-y-10 text-slate-800 leading-relaxed" style="font-family: 'Times New Roman', serif; font-size: 12pt;">

          <div class="text-center py-16">
            <h2 class="text-xl font-bold uppercase tracking-wide">Laporan</h2>
            <h3 class="mt-4 text-lg font-bold">{{ data.kegiatan.nama_kegiatan }}</h3>
            <p class="mt-2">{{ data.kegiatan.angkatan }}</p>
            <p class="mt-1">TPK {{ data.tpk.lokasi }} ({{ data.tpk.kabupaten_kota }})</p>
            <p class="mt-1">Tanggal, {{ formatDate(data.kegiatan.tanggal_mulai) }} s.d {{ formatDate(data.kegiatan.tanggal_selesai) }}</p>
            <div class="mt-8">
              <p class="font-bold uppercase">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</p>
              <p>BALAI PENJAMINAN MUTU PENDIDIKAN</p>
              <p>PROVINSI NUSA TENGGARA BARAT</p>
              <p class="mt-2 text-lg font-bold">{{ new Date(data.kegiatan.tanggal_mulai).getFullYear() }}</p>
            </div>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">Lembar Pengesahan</h2>
          </div>
          <table class="w-full border border-slate-400 text-sm">
            <thead>
              <tr class="bg-slate-100">
                <th class="border border-slate-300 px-3 py-2 text-left">Nama</th>
                <th class="border border-slate-300 px-3 py-2 text-left">Jabatan</th>
                <th class="border border-slate-300 px-3 py-2 text-left">Tanda Tangan</th>
                <th class="border border-slate-300 px-3 py-2 text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in data.pengesahan" :key="i">
                <td class="border border-slate-300 px-3 py-2">
                  <span class="text-xs text-slate-500">{{ p.peran }}:</span><br/>
                  <span class="font-medium">{{ p.nama }}</span><br/>
                  <span class="text-xs text-slate-500">NIP. {{ p.nip }}</span>
                </td>
                <td class="border border-slate-300 px-3 py-2">{{ p.jabatan }}</td>
                <td class="border border-slate-300 px-3 py-2 h-16"></td>
                <td class="border border-slate-300 px-3 py-2">{{ formatDate(p.tanggal) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">Kata Pengantar</h2>
          </div>
          <div class="text-justify whitespace-pre-line">{{ data.kata_pengantar }}</div>
          <div class="text-right mt-8">
            <p>Mataram, {{ formatDate(data.pengesahan[0].tanggal) }}</p>
            <p class="mt-12 font-medium">Panitia</p>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">Daftar Isi</h2>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span>Sampul Depan</span><span>i</span></div>
            <div class="flex justify-between"><span>Lembar Pengesahan</span><span>ii</span></div>
            <div class="flex justify-between"><span>Kata Pengantar</span><span>iii</span></div>
            <div class="flex justify-between"><span>Daftar Isi</span><span>iv</span></div>
            <div class="flex justify-between font-bold mt-3"><span>BAB I PENDAHULUAN</span><span></span></div>
            <div class="flex justify-between pl-6"><span>A. Latar Belakang</span><span></span></div>
            <div class="flex justify-between pl-6"><span>B. Dasar Hukum</span><span></span></div>
            <div class="flex justify-between pl-6"><span>C. Tujuan</span><span></span></div>
            <div class="flex justify-between pl-6"><span>D. Sasaran</span><span></span></div>
            <div class="flex justify-between pl-6"><span>E. Pembiayaan</span><span></span></div>
            <div class="flex justify-between font-bold mt-3"><span>BAB II PERSIAPAN KEGIATAN</span><span></span></div>
            <div class="flex justify-between pl-6"><span>A. Personalia</span><span></span></div>
            <div class="flex justify-between font-bold mt-3"><span>BAB III PELAKSANAAN KEGIATAN</span><span></span></div>
            <div class="flex justify-between pl-6"><span>A. Struktur Program</span><span></span></div>
            <div class="flex justify-between pl-6"><span>B. Jadwal Kegiatan</span><span></span></div>
            <div class="flex justify-between pl-6"><span>C. Rekaman Proses</span><span></span></div>
            <div class="flex justify-between font-bold mt-3"><span>BAB IV EVALUASI KEGIATAN</span><span></span></div>
            <div class="flex justify-between pl-6"><span>A. Evaluasi Program</span><span></span></div>
            <div class="flex justify-between pl-6"><span>B. Evaluasi Fasilitator</span><span></span></div>
            <div class="flex justify-between pl-6"><span>C. Evaluasi Layanan</span><span></span></div>
            <div class="flex justify-between font-bold mt-3"><span>BAB V PENUTUP</span><span></span></div>
            <div class="flex justify-between pl-6"><span>A. Kesimpulan</span><span></span></div>
            <div class="flex justify-between pl-6"><span>B. Saran</span><span></span></div>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">BAB I</h2>
            <h3 class="text-lg font-bold uppercase">PENDAHULUAN</h3>
          </div>

          <div>
            <h4 class="font-bold mb-2">A. Latar Belakang</h4>
            <div class="text-justify whitespace-pre-line">{{ data.latar_belakang }}</div>
          </div>

          <div>
            <h4 class="font-bold mb-2">B. Dasar Hukum</h4>
            <ol class="list-decimal pl-6 space-y-1">
              <li v-for="(d, i) in data.dasar_hukum" :key="i">{{ d }}</li>
            </ol>
          </div>

          <div>
            <h4 class="font-bold mb-2">C. Tujuan</h4>
            <div class="text-justify whitespace-pre-line">{{ data.tujuan }}</div>
          </div>

          <div>
            <h4 class="font-bold mb-2">D. Sasaran</h4>
            <div class="text-justify">{{ data.sasaran }}</div>
          </div>

          <div>
            <h4 class="font-bold mb-2">E. Pembiayaan</h4>
            <div class="text-justify">{{ data.pembiayaan }}</div>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">BAB II</h2>
            <h3 class="text-lg font-bold uppercase">PERSIAPAN KEGIATAN</h3>
          </div>

          <div>
            <h4 class="font-bold mb-3">A. Personalia</h4>
            <h5 class="font-bold mb-2 text-sm">1. Panitia dan Pendamping</h5>
            <table class="w-full border border-slate-400 text-xs mb-6">
              <thead><tr class="bg-slate-100">
                <th class="border border-slate-300 px-2 py-1.5 w-8">No</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Nama / NIP</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Jabatan dalam Kegiatan</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Instansi</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Jabatan Kedinasan</th>
              </tr></thead>
              <tbody>
                <tr v-for="(p, i) in panitiaPendamping" :key="i">
                  <td class="border border-slate-300 px-2 py-1.5 text-center">{{ i + 1 }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.nama }}<br/><span class="text-slate-500">NIP. {{ p.nip }}</span></td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.peran }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.instansi }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ p.jabatan }}</td>
                </tr>
              </tbody>
            </table>

            <h5 class="font-bold mb-2 text-sm">2. Fasilitator</h5>
            <table class="w-full border border-slate-400 text-xs">
              <thead><tr class="bg-slate-100">
                <th class="border border-slate-300 px-2 py-1.5 w-8">No</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Nama / NIP</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Instansi</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Jabatan</th>
              </tr></thead>
              <tbody>
                <tr v-for="(f, i) in fasilitator" :key="i">
                  <td class="border border-slate-300 px-2 py-1.5 text-center">{{ i + 1 }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ f.nama }}<br/><span class="text-slate-500">{{ f.nip }}</span></td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ f.instansi }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ f.jabatan }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">BAB III</h2>
            <h3 class="text-lg font-bold uppercase">PELAKSANAAN KEGIATAN</h3>
          </div>

          <div>
            <h4 class="font-bold mb-3">A. Struktur Program</h4>
            <table class="w-full border border-slate-400 text-xs">
              <thead><tr class="bg-slate-100">
                <th class="border border-slate-300 px-2 py-1.5 w-8">No</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Kategori</th>
                <th class="border border-slate-300 px-2 py-1.5 text-left">Materi</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center w-12">JP</th>
              </tr></thead>
              <tbody>
                <tr v-for="(s, i) in data.struktur_program" :key="i">
                  <td class="border border-slate-300 px-2 py-1.5 text-center">{{ i + 1 }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ s.kategori }}</td>
                  <td class="border border-slate-300 px-2 py-1.5">{{ s.materi }}</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center">{{ s.jp || '-' }}</td>
                </tr>
                <tr class="bg-slate-50 font-bold">
                  <td colspan="3" class="border border-slate-300 px-2 py-1.5 text-right">Total JP</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center">{{ data.struktur_program.reduce((a, s) => a + s.jp, 0) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 class="font-bold mb-3 mt-6">B. Jadwal Kegiatan</h4>
            <div v-for="day in data.jadwal_harian" :key="day.hari" class="mb-6">
              <h5 class="font-bold text-sm mb-2">{{ day.hari }} - {{ formatDate(day.tanggal) }}</h5>
              <table class="w-full border border-slate-400 text-xs">
                <thead><tr class="bg-slate-100">
                  <th class="border border-slate-300 px-2 py-1.5 text-left w-28">Waktu</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-left">Kegiatan / Materi</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-left w-32">Penanggung Jawab</th>
                </tr></thead>
                <tbody>
                  <tr v-for="(item, i) in day.items" :key="i">
                    <td class="border border-slate-300 px-2 py-1.5">{{ item.waktu }}</td>
                    <td class="border border-slate-300 px-2 py-1.5" :class="{ 'italic text-slate-400': item.kegiatan === 'Rehat' || item.kegiatan === 'Isoma' }">{{ item.kegiatan }}</td>
                    <td class="border border-slate-300 px-2 py-1.5">{{ item.pj }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 class="font-bold mb-3 mt-6">C. Rekaman Proses</h4>
            <div v-for="rec in data.rekaman_proses" :key="rec.hari" class="mb-4">
              <h5 class="font-bold text-sm mb-1">{{ rec.hari }} - {{ formatDate(rec.tanggal) }}</h5>
              <p class="text-justify">{{ rec.narasi }}</p>
            </div>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">BAB IV</h2>
            <h3 class="text-lg font-bold uppercase">EVALUASI KEGIATAN</h3>
            <p class="text-xs text-slate-500 mt-1">Jumlah responden: {{ data.evaluasi.total_responden }} orang</p>
          </div>

          <div>
            <h4 class="font-bold mb-3">A. Evaluasi Program</h4>
            <table class="w-full border border-slate-400 text-xs">
              <thead><tr class="bg-slate-100">
                <th class="border border-slate-300 px-2 py-1.5 text-left">Aspek</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Sangat Sesuai</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Sesuai</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Cukup</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Kurang</th>
              </tr></thead>
              <tbody>
                <tr v-for="(row, key) in programRows" :key="key">
                  <td class="border border-slate-300 px-2 py-1.5">{{ row.label }}</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctSS)">{{ row.pctSS }}%</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctS)">{{ row.pctS }}%</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctC)">{{ row.pctC }}%</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctK)">{{ row.pctK }}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 class="font-bold mb-3 mt-6">B. Evaluasi Fasilitator</h4>
            <div v-for="f in fasilitatorEval" :key="f.nama" class="mb-4">
              <h5 class="font-bold text-sm mb-2">{{ f.nama }}</h5>
              <table class="w-full border border-slate-400 text-xs">
                <thead><tr class="bg-slate-100">
                  <th class="border border-slate-300 px-2 py-1.5 text-left">Aspek</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Sangat Sesuai</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Sesuai</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Cukup</th>
                  <th class="border border-slate-300 px-2 py-1.5 text-center">Kurang</th>
                </tr></thead>
                <tbody>
                  <tr v-for="row in f.rows" :key="row.label">
                    <td class="border border-slate-300 px-2 py-1.5">{{ row.label }}</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctSS)">{{ row.pctSS }}%</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctS)">{{ row.pctS }}%</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctC)">{{ row.pctC }}%</td>
                    <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctK)">{{ row.pctK }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 class="font-bold mb-3 mt-6">C. Evaluasi Layanan</h4>
            <table class="w-full border border-slate-400 text-xs">
              <thead><tr class="bg-slate-100">
                <th class="border border-slate-300 px-2 py-1.5 text-left">Aspek</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Sangat Sesuai</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Sesuai</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Cukup</th>
                <th class="border border-slate-300 px-2 py-1.5 text-center">Kurang</th>
              </tr></thead>
              <tbody>
                <tr v-for="row in layananRows" :key="row.label">
                  <td class="border border-slate-300 px-2 py-1.5">{{ row.label }}</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctSS)">{{ row.pctSS }}%</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctS)">{{ row.pctS }}%</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctC)">{{ row.pctC }}%</td>
                  <td class="border border-slate-300 px-2 py-1.5 text-center" :class="barColor(row.pctK)">{{ row.pctK }}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">BAB V</h2>
            <h3 class="text-lg font-bold uppercase">PENUTUP</h3>
          </div>

          <div>
            <h4 class="font-bold mb-2">A. Kesimpulan</h4>
            <p class="text-justify">{{ data.simpulan }}</p>
          </div>

          <div>
            <h4 class="font-bold mb-2 mt-6">B. Saran</h4>
            <div class="text-justify whitespace-pre-line">{{ data.saran }}</div>
          </div>

          <div class="page-break"></div>
          <div class="text-center mb-6">
            <h2 class="text-lg font-bold uppercase tracking-wide">LAMPIRAN</h2>
          </div>
          <ul class="list-disc pl-6 space-y-1 text-sm">
            <li>TOR (Terms of Reference)</li>
            <li>SK dan Surat Tugas Panitia, Narasumber, dan Peserta</li>
            <li>Daftar Hadir Rapat Persiapan</li>
            <li>Notulensi Rapat Persiapan</li>
            <li>Daftar Hadir Panitia, Narasumber, dan Peserta</li>
            <li>Biodata Panitia, Narasumber, dan Peserta</li>
            <li>Panduan Kegiatan</li>
            <li>Slide Paparan Narasumber</li>
            <li>Foto-Foto Kegiatan</li>
            <li>Link Sertifikat</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import laporanData from '@/data/laporanDummy.json'

export default {
  name: 'LaporanKegiatan',
  data() {
    return { data: laporanData }
  },
  computed: {
    panitiaPendamping() {
      return this.data.peserta.filter(p => p.peran === 'Panitia' || p.peran === 'Pendamping')
    },
    fasilitator() {
      return this.data.peserta.filter(p => p.peran === 'Fasilitator')
    },
    programRows() {
      const n = this.data.evaluasi.total_responden
      const p = this.data.evaluasi.program
      return [
        { label: 'Kesesuaian Program dengan Tujuan', ...this.calcPct(p.kesesuaian_program_tujuan, n) },
        { label: 'Kesesuaian Bahan Ajar dengan Struktur Program', ...this.calcPct(p.kesesuaian_bahan_ajar, n) },
        { label: 'Kesesuaian Alokasi Waktu dengan Bobot Materi', ...this.calcPct(p.kesesuaian_alokasi_waktu, n) }
      ]
    },
    fasilitatorEval() {
      const n = this.data.evaluasi.total_responden
      return this.data.evaluasi.fasilitator.map(f => ({
        nama: f.nama,
        rows: [
          { label: 'Penguasaan Materi', ...this.calcPct(f.penguasaan_materi, n) },
          { label: 'Sistematika Penyajian', ...this.calcPct(f.sistematika_penyajian, n) },
          { label: 'Sikap dan Kehadiran', ...this.calcPct(f.sikap_kehadiran, n) }
        ]
      }))
    },
    layananRows() {
      const n = this.data.evaluasi.total_responden
      const l = this.data.evaluasi.layanan
      return [
        { label: 'Sikap dan Pelayanan Panitia', ...this.calcPct(l.sikap_pelayanan_panitia, n) },
        { label: 'Fasilitas dan Kebersihan', ...this.calcPct(l.fasilitas_kebersihan, n) },
        { label: 'Kualitas Konsumsi', ...this.calcPct(l.kualitas_konsumsi, n) }
      ]
    }
  },
  methods: {
    formatDate(value) {
      if (!value) return '-'
      return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    calcPct(dist, total) {
      if (!total) return { pctSS: 0, pctS: 0, pctC: 0, pctK: 0 }
      return {
        pctSS: Math.round((dist.sangat_sesuai / total) * 100),
        pctS: Math.round((dist.sesuai / total) * 100),
        pctC: Math.round((dist.cukup / total) * 100),
        pctK: Math.round((dist.kurang / total) * 100)
      }
    },
    barColor(pct) {
      if (pct >= 70) return 'text-emerald-700 font-bold'
      if (pct >= 40) return 'text-blue-700 font-medium'
      if (pct > 0) return 'text-amber-700'
      return 'text-slate-400'
    },
    async downloadDocx() {
      try {
        const { generateLaporanDocx } = await import('@/utils/generateLaporanDocx')
        await generateLaporanDocx(this.data)
      } catch (e) {
        console.error('Gagal download DOCX:', e)
        alert('Gagal membuat file DOCX: ' + e.message)
      }
    }
  }
}
</script>

<style scoped>
.page-break { page-break-after: always; margin: 2rem 0; border-top: 1px dashed #cbd5e1; }
@media print { .page-break { border: none; margin: 0; } }
</style>
