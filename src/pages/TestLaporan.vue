<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <button @click="$router.push('/admin/kegiatan')" class="text-slate-400 hover:text-slate-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-slate-800">Laporan Hasil Test</h1>
        </div>
        <p class="text-slate-500 text-sm">{{ kegiatanData?.nama_kegiatan || 'Memuat...' }}</p>
      </div>
      <button @click="exportExcel" :disabled="filteredData.length === 0"
        :class="['px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2', filteredData.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700']">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
        Export Excel
      </button>
    </div>

    <!-- Ringkasan -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
      <h2 class="text-lg font-semibold text-slate-700 mb-4">Ringkasan Peserta</h2>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <select v-model="filterPeserta" @change="applyFilters" class="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm bg-white">
          <option value="">Semua Peserta</option>
          <option v-for="[id, nama] in pesertaOptions" :key="id" :value="id">{{ nama }}</option>
        </select>
        <select v-model="filterPaket" @change="applyFilters" class="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-sm bg-white">
          <option value="">Semua Paket Soal</option>
          <option v-for="[id, nama] in paketOptions" :key="id" :value="id">{{ nama }}</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-3 px-2 font-semibold text-slate-600">No</th>
              <th class="text-left py-3 px-2 font-semibold text-slate-600">Nama</th>
              <th class="text-left py-3 px-2 font-semibold text-slate-600">NIP</th>
              <th class="text-left py-3 px-2 font-semibold text-slate-600">Paket</th>
              <th class="text-center py-3 px-2 font-semibold text-slate-600">Benar</th>
              <th class="text-center py-3 px-2 font-semibold text-slate-600">Salah</th>
              <th class="text-center py-3 px-2 font-semibold text-slate-600">Skor</th>
              <th class="text-center py-3 px-2 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="py-8 text-center text-slate-400">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredData.length === 0">
              <td colspan="8" class="py-8 text-center text-slate-400">Belum ada data</td>
            </tr>
            <tr v-for="(d, i) in filteredData" :key="`${d.id_peserta}_${d.id_paket_soal}`" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="py-3 px-2 text-slate-500">{{ i + 1 }}</td>
              <td class="py-3 px-2 font-medium text-slate-800">{{ d.nama_peserta }}</td>
              <td class="py-3 px-2 text-slate-600">{{ d.nip || '-' }}</td>
              <td class="py-3 px-2 text-slate-600">{{ d.nama_paket }}</td>
              <td class="py-3 px-2 text-center text-green-700 font-semibold">{{ d.jawaban_benar }}</td>
              <td class="py-3 px-2 text-center text-red-700 font-semibold">{{ d.jawaban_salah }}</td>
              <td class="py-3 px-2 text-center">
                <span :class="['font-bold', d.skor >= 70 ? 'text-green-700' : 'text-red-700']">{{ d.skor }}</span>
              </td>
              <td class="py-3 px-2 text-center">
                <button @click="loadDetail(d.id_peserta, d.id_paket_soal)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Peserta -->
    <div v-if="detailData" ref="detailSection" class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-700">Detail Peserta</h2>
        <button @click="cetakPDF" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Cetak PDF
        </button>
      </div>

      <!-- Data Diri -->
      <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div><span class="text-slate-500">Nama:</span> <span class="font-medium text-slate-800">{{ detailData.peserta.nama_lengkap }}</span></div>
          <div><span class="text-slate-500">NIP:</span> <span class="font-medium text-slate-800">{{ detailData.peserta.nip || '-' }}</span></div>
          <div><span class="text-slate-500">Pangkat/Gol:</span> <span class="font-medium text-slate-800">{{ formatPangkat(detailData.peserta) }}</span></div>
          <div><span class="text-slate-500">Jabatan:</span> <span class="font-medium text-slate-800">{{ detailData.peserta.jabatan || '-' }}</span></div>
          <div><span class="text-slate-500">Instansi:</span> <span class="font-medium text-slate-800">{{ detailData.peserta.nama_instansi || '-' }}</span></div>
          <div><span class="text-slate-500">Kab/Kota:</span> <span class="font-medium text-slate-800">{{ formatKabKota(detailData.peserta) }}</span></div>
        </div>
      </div>

      <!-- Skor Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
          <div class="text-2xl font-bold text-blue-700">{{ detailData.ringkasan.total_soal }}</div>
          <div class="text-xs text-blue-600">Total Soal</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4 text-center border border-green-100">
          <div class="text-2xl font-bold text-green-700">{{ detailData.ringkasan.jawaban_benar }}</div>
          <div class="text-xs text-green-600">Benar</div>
        </div>
        <div class="bg-red-50 rounded-lg p-4 text-center border border-red-100">
          <div class="text-2xl font-bold text-red-700">{{ detailData.ringkasan.jawaban_salah }}</div>
          <div class="text-xs text-red-600">Salah</div>
        </div>
        <div class="bg-amber-50 rounded-lg p-4 text-center border border-amber-100">
          <div class="text-2xl font-bold text-amber-700">{{ detailData.ringkasan.skor }}</div>
          <div class="text-xs text-amber-600">Skor</div>
        </div>
      </div>

      <!-- Detail Jawaban -->
      <h3 class="font-semibold text-slate-700 mb-3">Detail Jawaban</h3>
      <div v-for="(d, index) in detailData.detail" :key="d.id_soal" :class="[
        'mb-4 p-4 rounded-lg border',
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
          <span v-if="huruf === d.jawaban_peserta && huruf !== d.jawaban_benar" class="text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded ml-1">Jawaban</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getKegiatan } from '@/services/kegiatan'
import { getLaporanByKegiatan, getLaporanDetail } from '@/services/test'
import * as XLSX from 'xlsx'

export default {
  name: 'TestLaporan',
  data() {
    return {
      loading: true,
      kegiatanData: null,
      allData: [],
      filteredData: [],
      filterPeserta: '',
      filterPaket: '',
      detailData: null,
    }
  },
  computed: {
    idKegiatan() { return this.$route.params.id },
    pesertaOptions() {
      const map = new Map()
      this.allData.forEach(d => map.set(d.id_peserta, d.nama_peserta))
      return [...map.entries()]
    },
    paketOptions() {
      const map = new Map()
      this.allData.forEach(d => map.set(d.id_paket_soal, d.nama_paket))
      return [...map.entries()]
    },
  },
  async mounted() {
    await this.loadKegiatan()
    await this.loadRingkasan()
  },
  methods: {
    async loadKegiatan() {
      try {
        this.kegiatanData = await getKegiatan(this.idKegiatan)
      } catch { /* silent */ }
    },
    async loadRingkasan() {
      this.loading = true
      try {
        const data = await getLaporanByKegiatan(this.idKegiatan)
        this.allData = Array.isArray(data) ? data : (data?.data || [])
        this.applyFilters()
      } catch {
        this.allData = []
        this.filteredData = []
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      let result = [...this.allData]
      if (this.filterPeserta) result = result.filter(d => String(d.id_peserta) === String(this.filterPeserta))
      if (this.filterPaket) result = result.filter(d => String(d.id_paket_soal) === String(this.filterPaket))
      this.filteredData = result
    },
    async loadDetail(idPeserta, idPaketSoal) {
      try {
        this.detailData = await getLaporanDetail(this.idKegiatan, idPeserta, idPaketSoal)
        this.$nextTick(() => {
          this.$refs.detailSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      } catch {
        this.detailData = null
      }
    },
    cetakPDF() {
      if (!this.detailData) return
      const d = this.detailData
      const p = d.peserta
      const r = d.ringkasan

      const rows = d.detail.map((item, i) => {
        const pilihan = ['a', 'b', 'c', 'd'].map(h => {
          let cls = ''
          if (h === item.jawaban_benar) cls = 'color:#15803d;font-weight:700'
          if (h === item.jawaban_peserta && h !== item.jawaban_benar) cls = 'color:#dc2626;text-decoration:line-through'
          let label = ''
          if (h === item.jawaban_benar) label = ' <span style="background:#bbf7d0;color:#15803d;padding:1px 6px;border-radius:4px;font-size:11px">Kunci</span>'
          if (h === item.jawaban_peserta && h !== item.jawaban_benar) label += ' <span style="background:#fecaca;color:#dc2626;padding:1px 6px;border-radius:4px;font-size:11px">Jawaban</span>'
          return `<p style="${cls};margin:2px 0 2px 16px;font-size:13px">${item['pilihan_' + h]}${label}</p>`
        }).join('')

        return '<div style="margin-bottom:12px;padding:10px;border-radius:8px;border:1px solid ' + (item.is_correct ? '#bbf7d0' : '#fecaca') + ';background:' + (item.is_correct ? '#f0fdf4' : '#fef2f2') + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">' +
          '<strong style="font-size:13px">' + (i + 1) + '. ' + item.pertanyaan + '</strong>' +
          '<span style="font-size:11px;padding:2px 8px;border-radius:12px;font-weight:600;background:' + (item.is_correct ? '#bbf7d0' : '#fecaca') + ';color:' + (item.is_correct ? '#15803d' : '#dc2626') + '">' + (item.is_correct ? 'Benar' : 'Salah') + '</span>' +
          '</div>' + pilihan + '</div>'
      }).join('')

      const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hasil Ujian - ' + p.nama_lengkap + '</title>' +
        '<style>@media print { @page { margin: 15mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style>' +
        '</head><body style="font-family:Arial,sans-serif;color:#1e293b;max-width:800px;margin:0 auto">' +
        '<h2 style="margin:0 0 4px">Hasil Ujian</h2>' +
        '<p style="color:#64748b;margin:0 0 16px;font-size:14px">' + (this.kegiatanData?.nama_kegiatan || '') + '</p>' +
        '<table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:16px">' +
        '<tr><td style="padding:4px 0;color:#64748b;width:120px">Nama</td><td style="font-weight:600">' + p.nama_lengkap + '</td></tr>' +
        '<tr><td style="padding:4px 0;color:#64748b">NIP</td><td>' + (p.nip || '-') + '</td></tr>' +
        '<tr><td style="padding:4px 0;color:#64748b">Jabatan</td><td>' + (p.jabatan || '-') + '</td></tr>' +
        '<tr><td style="padding:4px 0;color:#64748b">Instansi</td><td>' + (p.nama_instansi || '-') + '</td></tr>' +
        '</table>' +
        '<div style="display:flex;gap:12px;margin-bottom:20px">' +
        '<div style="flex:1;text-align:center;padding:12px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe"><div style="font-size:24px;font-weight:700;color:#1d4ed8">' + r.total_soal + '</div><div style="font-size:11px;color:#3b82f6">Total</div></div>' +
        '<div style="flex:1;text-align:center;padding:12px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0"><div style="font-size:24px;font-weight:700;color:#15803d">' + r.jawaban_benar + '</div><div style="font-size:11px;color:#22c55e">Benar</div></div>' +
        '<div style="flex:1;text-align:center;padding:12px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca"><div style="font-size:24px;font-weight:700;color:#dc2626">' + r.jawaban_salah + '</div><div style="font-size:11px;color:#ef4444">Salah</div></div>' +
        '<div style="flex:1;text-align:center;padding:12px;border-radius:8px;background:#fffbeb;border:1px solid #fde68a"><div style="font-size:24px;font-weight:700;color:#d97706">' + r.skor + '</div><div style="font-size:11px;color:#f59e0b">Skor</div></div>' +
        '</div>' +
        '<h3 style="font-size:15px;margin:0 0 10px">Detail Jawaban</h3>' +
        rows +
        '<' + 'script>window.onload=function(){window.print()}<' + '/script>' +
        '</body></html>'

      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
    },
    exportExcel() {
      if (this.filteredData.length === 0) return

      const rows = this.filteredData.map((d, i) => ({
        'No': i + 1,
        'Nama Peserta': d.nama_peserta,
        'NIP': d.nip || '',
        'Jabatan': d.jabatan || '',
        'Instansi': d.nama_instansi || '',
        'Paket Soal': d.nama_paket,
        'Total Soal': d.total_soal,
        'Jawaban Benar': d.jawaban_benar,
        'Jawaban Salah': d.jawaban_salah,
        'Skor': d.skor,
      }))

      const ws = XLSX.utils.json_to_sheet(rows)
      ws['!cols'] = [
        { wch: 5 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 25 },
        { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 8 },
      ]

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Hasil Test')

      const nama = (this.kegiatanData?.nama_kegiatan || 'kegiatan').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
      XLSX.writeFile(wb, `hasil_test_${nama}.xlsx`)
    },
    formatPangkat(p) {
      if (p?.pangkat && p?.gol) return `${p.pangkat} / ${p.gol}`
      return p?.pangkat || p?.gol || '-'
    },
    formatKabKota(p) {
      if (p?.kab_kota && p?.provinsi) return `${p.kab_kota}, ${p.provinsi}`
      return p?.kab_kota || p?.provinsi || '-'
    },
  },
}
</script>
