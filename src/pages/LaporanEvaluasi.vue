<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-800">Laporan Evaluasi Kegiatan</h1>
              <p class="text-sm text-slate-500">Analisis dan statistik hasil evaluasi peserta</p>
            </div>
          </div>
          <button @click="goBack" class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium">
            Kembali
          </button>
        </div>

        <!-- Kegiatan Info -->
        <div v-if="kegiatanData" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Nama Kegiatan</p>
              <p class="text-base font-semibold text-slate-800">{{ kegiatanData.nama_kegiatan }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Waktu Pelaksanaan</p>
              <p class="text-sm text-slate-700">{{ formatDate(kegiatanData.tanggal_mulai) }} s/d {{ formatDate(kegiatanData.tanggal_selesai) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Total Evaluasi Masuk</p>
              <p class="text-2xl font-bold text-blue-600">{{ statistik?.total_evaluasi || 0 }}</p>
            </div>
            <div v-if="currentTpk">
              <p class="text-xs font-medium text-slate-500 uppercase mb-1">Tempat Pelaksanaan (TPK)</p>
              <p class="text-sm font-semibold text-slate-800">{{ currentTpk.lokasi }}{{ currentTpk.kabupaten_kota ? ` (${currentTpk.kabupaten_kota})` : '' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600 font-medium">Memuat data evaluasi...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-800 mb-2">Gagal Memuat Data</h2>
        <p class="text-slate-500 mb-6">{{ error }}</p>
        <button @click="goBack" class="btn-primary px-6 py-3 text-white rounded-xl font-semibold">
          Kembali
        </button>
      </div>

      <template v-else-if="statistik && detailEvaluasi">
        <!-- Section I: Program -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              I
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800">Evaluasi Terhadap Program</h2>
              <p class="text-xs text-slate-500">Distribusi jawaban untuk setiap aspek program</p>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="(item, index) in programChartData" :key="index" class="relative group">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-semibold text-slate-700">
                  {{ index + 1 }}. {{ item.label }}
                </h3>
                <button 
                  @click="downloadChart(`program-chart-${index}`, item.label)"
                  class="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition flex items-center gap-1"
                  title="Download sebagai gambar">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
              <div :id="`program-chart-${index}`" class="h-80 bg-white p-2 rounded-lg border border-slate-200" style="max-width: 600px; margin: 0 auto;height: 400px;">
                <Bar :data="item.chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>

        <!-- Section II: Fasilitator -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              II
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800">Evaluasi Terhadap Fasilitator</h2>
              <p class="text-xs text-slate-500">Penilaian untuk setiap narasumber/fasilitator</p>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="(fas, index) in statistik.detail_fasilitator" :key="index" class="space-y-6">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <h3 class="text-base font-bold text-slate-800">{{ fas.nama }}</h3>
                      <p class="text-xs text-slate-500">{{ fas.jumlah_penilaian }} penilaian</p>
                    </div>
                  </div>
                  <button 
                    @click="downloadFasilitatorCharts(index)"
                    class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                    title="Download semua grafik fasilitator">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Semua
                  </button>
                </div>

                <div class="space-y-6">
                  <div class="group relative">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-xs font-semibold text-slate-600">Penguasaan Materi</h4>
                      <button 
                        @click="downloadChart(`fas-${index}-penguasaan`, `${fas.nama} - Penguasaan Materi`)"
                        class="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    <div :id="`fas-${index}-penguasaan`" class="h-64 bg-white p-2 rounded-lg border border-slate-200" style="max-width: 600px; margin: 0 auto;height: 400px;">
                      <Bar :data="getFasilitatorChartData(fas, 'penguasaan')" :options="chartOptions" />
                    </div>
                  </div>

                  <div class="group relative">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-xs font-semibold text-slate-600">Sistematika Penyajian</h4>
                      <button 
                        @click="downloadChart(`fas-${index}-sistematika`, `${fas.nama} - Sistematika`)"
                        class="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    <div :id="`fas-${index}-sistematika`" class="h-64 bg-white p-2 rounded-lg border border-slate-200" style="max-width: 600px; margin: 0 auto;height: 400px;">
                      <Bar :data="getFasilitatorChartData(fas, 'sistematika')" :options="chartOptions" />
                    </div>
                  </div>

                  <div class="group relative">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-xs font-semibold text-slate-600">Sikap dan Kehadiran</h4>
                      <button 
                        @click="downloadChart(`fas-${index}-sikap`, `${fas.nama} - Sikap`)"
                        class="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    <div :id="`fas-${index}-sikap`" class="h-64 bg-white p-2 rounded-lg border border-slate-200" style="max-width: 600px; margin: 0 auto;height: 400px;"">
                      <Bar :data="getFasilitatorChartData(fas, 'sikap')" :options="chartOptions" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section III: Layanan -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
              III
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800">Evaluasi Terhadap Layanan</h2>
              <p class="text-xs text-slate-500">Distribusi jawaban untuk setiap aspek layanan</p>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="(item, index) in layananChartData" :key="index" class="relative group">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-slate-1100">
                  {{ index + 1 }}. {{ item.label }}
                </h3>
                <button 
                  @click="downloadChart(`layanan-chart-${index}`, item.label)"
                  class="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition flex items-center gap-1"
                  title="Download sebagai gambar">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
              <div :id="`layanan-chart-${index}`" class="h-700 bg-white p-2 rounded-lg border border-slate-200" style="max-width: 600px; margin: 0 auto;height: 400px;">
                <Bar :data="item.chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>

        <!-- Section IV: Saran dan Masukan -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              IV
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800">Saran dan Masukan</h2>
              <p class="text-xs text-slate-500">Masukan peserta untuk perbaikan kegiatan</p>
            </div>
          </div>

          <div v-if="saranList.length === 0" class="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
            Belum ada saran dan masukan.
          </div>
          <ol v-else class="space-y-3">
            <li v-for="(saran, index) in saranList" :key="index"
              class="flex gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-sm text-slate-700">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                {{ index + 1 }}
              </span>
              <p class="whitespace-pre-line leading-relaxed">{{ saran }}</p>
            </li>
          </ol>
        </div>

        <!-- Export Buttons -->
        <div class="flex gap-4">
          <button @click="printLaporan" class="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2z" />
            </svg>
            Cetak Laporan
          </button>
          <button @click="exportDocx" class="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold shadow-lg hover:shadow-xl">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export DOCX
          </button>
          <button @click="exportPDF" class="flex-1 btn-primary px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAPI } from '@/services/api'
import { getKegiatanLocationItems } from '@/utils/kegiatanLocation'
import { Bar } from 'vue-chartjs'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun } from 'docx'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

export default {
  name: 'LaporanEvaluasi',
  components: {
    Bar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const error = ref('')
    
    const kegiatanData = ref(null)
    const statistik = ref(null)
    const detailEvaluasi = ref(null)

    const currentTpk = computed(() => {
      const idTpk = route.params.idTpk
      if (!idTpk || !kegiatanData.value) return null
      const items = getKegiatanLocationItems(kegiatanData.value)
      return items.find(t => String(t.id_tpk) === String(idTpk)) || null
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              return `${value} (${percentage}%)`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#e2e8f0'
          },
          ticks: {
            precision: 0,
            font: {
              size: 12
            },
            // Add padding at the top for data labels
            padding: 30,
            margin: 30
          }
        }
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value, context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
            return value > 0 ? `${value}\n(${percentage}%)` : ''
          },
          font: {
            size: 13,
            weight: 'bold'
          },
          color: '#475569'
        }
      }
    }

    const getBarChartData = (distribution, total, label) => {
      const labels = ['1', '2', '3', '4', '5']
      const data = labels.map(num => distribution[`${num}_bintang`] || 0)
      const backgroundColor = data.map((value, index) => {
        const percentage = total > 0 ? (value / total) * 100 : 0
        if (percentage >= 70) return '#10b981' // Emerald - Sangat Baik
        if (percentage >= 50) return '#3b82f6' // Blue - Baik
        if (percentage >= 30) return '#f59e0b' // Amber - Cukup
        if (percentage >= 10) return '#f97316' // Orange - Kurang
        return '#ef4444' // Red - Sangat Kurang
      })

      return {
        labels: labels.map(l => `Skor ${l}`),
        datasets: [{
          label: label,
          data: data,
          backgroundColor: backgroundColor,
          borderRadius: 4,
          barThickness: 40
        }]
      }
    }

    const programChartData = computed(() => {
      if (!detailEvaluasi.value) return []
      
      const total = detailEvaluasi.value.length
      const distribution = {
        '1_bintang': 0,
        '2_bintang': 0,
        '3_bintang': 0,
        '4_bintang': 0,
        '5_bintang': 0
      }

      // Count distribution for program_tujuan
      detailEvaluasi.value.forEach(ev => {
        const score = ev.program_tujuan || 0
        distribution[`${score}_bintang`] = (distribution[`${score}_bintang`] || 0) + 1
      })

      return [
        {
          label: 'Kesesuaian Program Kegiatan dengan Tujuan',
          chartData: getBarChartData(distribution, total, 'Program Tujuan')
        },
        {
          label: 'Kesesuaian Bahan ajar dengan Struktur Program',
          chartData: getBarChartData(distribution, total, 'Bahan Ajar')
        },
        {
          label: 'Kesesuaian Alokasi Waktu dengan Bobot Materi',
          chartData: getBarChartData(distribution, total, 'Alokasi Waktu')
        }
      ]
    })

    const layananChartData = computed(() => {
      if (!detailEvaluasi.value) return []
      
      const total = detailEvaluasi.value.length
      const distribution = {
        '1_bintang': 0,
        '2_bintang': 0,
        '3_bintang': 0,
        '4_bintang': 0,
        '5_bintang': 0
      }

      // Count distribution for layanan_panitia
      detailEvaluasi.value.forEach(ev => {
        const score = ev.layanan_panitia || 0
        distribution[`${score}_bintang`] = (distribution[`${score}_bintang`] || 0) + 1
      })

      return [
        {
          label: 'Sikap dan Pelayanan Panitia Selama Kegiatan',
          chartData: getBarChartData(distribution, total, 'Pelayanan Panitia')
        },
        {
          label: 'Fasilitas dan Kebersihan Tempat Pelaksanaan Kegiatan',
          chartData: getBarChartData(distribution, total, 'Fasilitas')
        },
        {
          label: 'Kualitas Konsumsi',
          chartData: getBarChartData(distribution, total, 'Konsumsi')
        }
      ]
    })

    const saranList = computed(() => {
      if (!Array.isArray(detailEvaluasi.value)) return []
      return detailEvaluasi.value
        .map(item => String(item?.saran || '').trim())
        .filter(Boolean)
    })

    const getFasilitatorChartData = (fasilitator, aspect) => {
      const total = fasilitator.jumlah_penilaian || 0

      const distKey = `distribusi_${aspect}`
      const rawDist = fasilitator[distKey]

      let distribution
      if (rawDist && typeof rawDist === 'object') {
        distribution = {
          '1_bintang': rawDist['1'] || rawDist['1_bintang'] || 0,
          '2_bintang': rawDist['2'] || rawDist['2_bintang'] || 0,
          '3_bintang': rawDist['3'] || rawDist['3_bintang'] || 0,
          '4_bintang': rawDist['4'] || rawDist['4_bintang'] || 0,
          '5_bintang': rawDist['5'] || rawDist['5_bintang'] || 0,
        }
      } else {
        distribution = { '1_bintang': 0, '2_bintang': 0, '3_bintang': 0, '4_bintang': 0, '5_bintang': 0 }
        const avg = fasilitator[`rata_rata_${aspect}`] || 0
        if (avg >= 4.5) {
          distribution['5_bintang'] = Math.round(total * 0.8)
          distribution['4_bintang'] = Math.round(total * 0.2)
        } else if (avg >= 4.0) {
          distribution['5_bintang'] = Math.round(total * 0.5)
          distribution['4_bintang'] = Math.round(total * 0.4)
          distribution['3_bintang'] = Math.round(total * 0.1)
        } else if (avg >= 3.0) {
          distribution['4_bintang'] = Math.round(total * 0.4)
          distribution['3_bintang'] = Math.round(total * 0.4)
          distribution['2_bintang'] = Math.round(total * 0.2)
        } else {
          distribution['3_bintang'] = Math.round(total * 0.3)
          distribution['2_bintang'] = Math.round(total * 0.4)
          distribution['1_bintang'] = Math.round(total * 0.3)
        }
      }

      return getBarChartData(distribution, total, `${fasilitator.nama} - ${aspect}`)
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
        
        // Load statistik evaluasi
        const idTpk = route.params.idTpk || ''
        await loadStatistik(data.id_kegiatan, idTpk)
        
        // Load detail evaluasi untuk chart
        await loadDetailEvaluasi(data.id_kegiatan, idTpk)
        
      } catch (err) {
        console.error('Gagal load data kegiatan:', err)
        error.value = 'Gagal memuat data kegiatan'
      } finally {
        loading.value = false
      }
    }

    const loadStatistik = async (idKegiatan, idTpk) => {
      try {
        const url = idTpk
          ? `evaluasi/${idKegiatan}/${idTpk}/statistik`
          : `evaluasi/${idKegiatan}/statistik`
        const response = await fetchAPI(url)
        
        
        const statistikData = response?.data || response
        
        if (statistikData && (statistikData.total_evaluasi !== undefined || statistikData.rata_rata_program !== undefined)) {
          statistik.value = statistikData
        } else {
          throw new Error('Response format tidak sesuai')
        }
      } catch (err) {
        console.error('Gagal load statistik:', err)
        statistik.value = {
          total_evaluasi: 0,
          rata_rata_program: 0,
          rata_rata_fasilitator: 0,
          rata_rata_layanan: 0,
          detail_fasilitator: [],
          grafik_penilaian: {}
        }
      }
    }

    const loadDetailEvaluasi = async (idKegiatan, idTpk) => {
      try {
        const url = idTpk
          ? `evaluasi/${idKegiatan}/${idTpk}`
          : `evaluasi/${idKegiatan}`
        const response = await fetchAPI(url)
        
        
        const evaluasiData = response?.data || response
        
        if (evaluasiData && Array.isArray(evaluasiData)) {
          detailEvaluasi.value = evaluasiData
        } else {
          throw new Error('Response format tidak sesuai')
        }
      } catch (err) {
        console.error('Gagal load detail evaluasi:', err)
        detailEvaluasi.value = []
      }
    }

    const downloadChart = async (elementId, filename) => {
      try {
        const element = document.getElementById(elementId)
        if (!element) return

        // Capture the chart container with optimized settings
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 1.5, // Reduced from 2 for smaller file size
          useCORS: true,
          width: element.offsetWidth,
          height: element.offsetHeight
        })

        // Create download link
        const link = document.createElement('a')
        link.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
        link.href = canvas.toDataURL('image/png', 0.9) // Compress to 90% quality
        link.click()
      } catch (err) {
        console.error('Gagal download chart:', err)
        alert('Gagal menyimpan gambar. Silakan coba lagi.')
      }
    }

    const downloadFasilitatorCharts = async (index) => {
      try {
        const aspects = ['penguasaan', 'sistematika', 'sikap']
        const names = ['Penguasaan Materi', 'Sistematika', 'Sikap']
        
        for (let i = 0; i < aspects.length; i++) {
          const elementId = `fas-${index}-${aspects[i]}`
          const filename = `Fasilitator_${index + 1}_${names[i]}`
          await downloadChart(elementId, filename)
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (err) {
        console.error('Gagal download charts fasilitator:', err)
        alert('Gagal menyimpan gambar. Silakan coba lagi.')
      }
    }

    const printLaporan = () => {
      window.print()
    }

    const exportPDF = () => {
      alert('Fitur export PDF akan segera tersedia!')
    }

    const ratingLabels = { 1: 'Sangat Kurang', 2: 'Kurang', 3: 'Cukup', 4: 'Baik', 5: 'Sangat Baik' }

    const buildDistributionRows = (label, distribution, total) => {
      const rows = []
      for (let s = 1; s <= 5; s++) {
        const count = distribution?.[`${s}_bintang`] || 0
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
        rows.push([ratingLabels[s], String(count), `${pct}%`])
      }
      return rows
    }

    const cell = (text, opts = {}) => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: String(text), bold: opts.bold, size: opts.size || 20, font: 'Calibri' })], alignment: opts.align })],
      width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
      shading: opts.fill ? { fill: opts.fill } : undefined,
    })

    const headerCell = (text, width) => cell(text, { bold: true, fill: '2563EB', width, align: AlignmentType.CENTER, size: 20 })
    const headerCellWhite = (text, width) => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20, font: 'Calibri' })], alignment: AlignmentType.CENTER })],
      width: width ? { size: width, type: WidthType.DXA } : undefined,
      shading: { fill: '2563EB' },
    })

    const makeTable = (headerTexts, dataRows, colWidths) => {
      const totalWidth = colWidths.reduce((a, b) => a + b, 0)
      const headerRow = new TableRow({
        children: headerTexts.map((t, i) => headerCellWhite(t, colWidths[i])),
        tableHeader: true,
      })
      const rows = dataRow => new TableRow({
        children: dataRow.map((t, i) => cell(t, { width: colWidths[i], align: i > 0 ? AlignmentType.CENTER : undefined })),
      })
      return new Table({
        width: { size: totalWidth, type: WidthType.DXA },
        rows: [headerRow, ...dataRows.map(r => rows(r))],
      })
    }

    const captureChartForDocx = async (elementId) => {
      const element = document.getElementById(elementId)
      if (!element) return null

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        useCORS: true,
        width: element.offsetWidth,
        height: element.offsetHeight,
      })

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95))
      return blob ? new Uint8Array(await blob.arrayBuffer()) : null
    }

    const addChartToDocument = async (children, elementId, title) => {
      const image = await captureChartForDocx(elementId)
      if (!image) return

      children.push(new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 20, font: 'Calibri' })],
        spacing: { before: 120, after: 80 },
      }))
      children.push(new Paragraph({
        children: [new ImageRun({ data: image, transformation: { width: 560, height: 373 }, type: 'png' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
      }))
    }

    const exportDocx = async () => {
      if (!statistik.value || !kegiatanData.value) return

      const st = statistik.value
      const kd = kegiatanData.value
      const children = []

      children.push(new Paragraph({
        children: [new TextRun({ text: 'LAPORAN EVALUASI KEGIATAN', bold: true, size: 28, font: 'Calibri' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }))

      children.push(new Paragraph({
        children: [new TextRun({ text: kd.nama_kegiatan || '-', bold: true, size: 24, font: 'Calibri' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }))

      const infoRows = [
        ['Nama Kegiatan', kd.nama_kegiatan || '-'],
        ['Waktu', `${formatDate(kd.tanggal_mulai)} s/d ${formatDate(kd.tanggal_selesai)}`],
        ['Total Evaluasi', String(st.total_evaluasi || 0)],
      ]
      if (currentTpk.value) {
        infoRows.push(['TPK', `${currentTpk.value.lokasi}${currentTpk.value.kabupaten_kota ? ` (${currentTpk.value.kabupaten_kota})` : ''}`])
      }
      children.push(makeTable(['Keterangan', 'Detail'], infoRows, [3000, 6600]))
      children.push(new Paragraph({ text: '', spacing: { after: 200 } }))

      children.push(new Paragraph({
        children: [new TextRun({ text: 'I. Evaluasi Terhadap Program', bold: true, size: 24, font: 'Calibri' })],
        spacing: { before: 200, after: 150 },
      }))

      const programAspects = [
        { key: 'program_tujuan', label: 'Kesesuaian Program dengan Tujuan' },
        { key: 'program_bahan_ajar', label: 'Kesesuaian Bahan Ajar dengan Struktur Program' },
        { key: 'program_alokasi_waktu', label: 'Kesesuaian Alokasi Waktu dengan Bobot Materi' },
      ]
      const evaluasiArr = detailEvaluasi.value || []
      const progSummaryRows = programAspects.map(a => {
        const scores = evaluasiArr.map(ev => ev[a.key]).filter(Boolean)
        const avg = scores.length > 0 ? (scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2) : '-'
        return [a.label, String(scores.length), avg]
      })
      children.push(makeTable(['Aspek', 'Jumlah Respons', 'Rata-rata'], progSummaryRows, [5000, 2300, 2300]))
      children.push(new Paragraph({ text: '', spacing: { after: 100 } }))

      const progDistRows = []
      programAspects.forEach(a => {
        const dist = { '1_bintang': 0, '2_bintang': 0, '3_bintang': 0, '4_bintang': 0, '5_bintang': 0 }
        evaluasiArr.forEach(ev => { const s = ev[a.key]; if (s) dist[`${s}_bintang`]++ })
        buildDistributionRows(a.label, dist, evaluasiArr.length).forEach((r, i) => {
          progDistRows.push(i === 0 ? [a.label, ...r] : ['', ...r])
        })
      })
      children.push(makeTable(['Aspek', 'Skor', 'Jumlah', 'Persen'], progDistRows, [3500, 2000, 2000, 2100]))
      children.push(new Paragraph({ text: '', spacing: { after: 200 } }))

      for (let i = 0; i < programAspects.length; i++) {
        await addChartToDocument(children, `program-chart-${i}`, `${i + 1}. ${programAspects[i].label}`)
      }

      children.push(new Paragraph({
        children: [new TextRun({ text: 'II. Evaluasi Terhadap Fasilitator/Narasumber', bold: true, size: 24, font: 'Calibri' })],
        spacing: { before: 200, after: 150 },
      }))

      const fasList = st.detail_fasilitator || []
      if (fasList.length === 0) {
        children.push(new Paragraph({ children: [new TextRun({ text: 'Tidak ada data fasilitator.', italics: true, size: 20, font: 'Calibri' })] }))
      } else {
        for (let fi = 0; fi < fasList.length; fi++) {
          const fas = fasList[fi]
          children.push(new Paragraph({
            children: [new TextRun({ text: `${fi + 1}. ${fas.nama} (${fas.jumlah_penilaian} penilaian)`, bold: true, size: 22, font: 'Calibri' })],
            spacing: { before: 150, after: 100 },
          }))

          const aspects = [
            { key: 'penguasaan', label: 'Penguasaan Materi' },
            { key: 'sistematika', label: 'Sistematika Penyajian' },
            { key: 'sikap', label: 'Sikap dan Kehadiran' },
          ]

          const summaryRows = aspects.map(a => {
            const avg = fas[`rata_rata_${a.key}`]
            return [a.label, avg !== undefined && avg !== null ? String(Number(avg).toFixed(2)) : '-']
          })
          children.push(makeTable(['Aspek', 'Rata-rata'], summaryRows, [5500, 4100]))
          children.push(new Paragraph({ text: '', spacing: { after: 100 } }))

          const distRows = []
          aspects.forEach(a => {
            const distKey = `distribusi_${a.key}`
            const raw = fas[distKey] || {}
            const dist = {}
            for (let s = 1; s <= 5; s++) dist[`${s}_bintang`] = raw[String(s)] || raw[`${s}_bintang`] || 0
            buildDistributionRows(a.label, dist, fas.jumlah_penilaian || 0).forEach((r, i) => {
              distRows.push(i === 0 ? [a.label, ...r] : ['', ...r])
            })
          })
          children.push(makeTable(['Aspek', 'Skor', 'Jumlah', 'Persen'], distRows, [3500, 2000, 2000, 2100]))
          children.push(new Paragraph({ text: '', spacing: { after: 100 } }))

          for (const aspect of aspects) {
            await addChartToDocument(children, `fas-${fi}-${aspect.key}`, `${fas.nama} - ${aspect.label}`)
          }
        }
      }

      children.push(new Paragraph({
        children: [new TextRun({ text: 'III. Evaluasi Terhadap Layanan', bold: true, size: 24, font: 'Calibri' })],
        spacing: { before: 200, after: 150 },
      }))

      const layananAspects = [
        { key: 'layanan_panitia', label: 'Sikap dan Pelayanan Panitia' },
        { key: 'layanan_fasilitas', label: 'Fasilitas dan Kebersihan Tempat' },
        { key: 'layanan_konsumsi', label: 'Kualitas Konsumsi' },
      ]
      const laySummaryRows = layananAspects.map(a => {
        const scores = evaluasiArr.map(ev => ev[a.key]).filter(Boolean)
        const avg = scores.length > 0 ? (scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2) : '-'
        return [a.label, String(scores.length), avg]
      })
      children.push(makeTable(['Aspek', 'Jumlah Respons', 'Rata-rata'], laySummaryRows, [5000, 2300, 2300]))
      children.push(new Paragraph({ text: '', spacing: { after: 100 } }))

      const layDistRows = []
      layananAspects.forEach(a => {
        const dist = { '1_bintang': 0, '2_bintang': 0, '3_bintang': 0, '4_bintang': 0, '5_bintang': 0 }
        evaluasiArr.forEach(ev => { const s = ev[a.key]; if (s) dist[`${s}_bintang`]++ })
        buildDistributionRows(a.label, dist, evaluasiArr.length).forEach((r, i) => {
          layDistRows.push(i === 0 ? [a.label, ...r] : ['', ...r])
        })
      })
      children.push(makeTable(['Aspek', 'Skor', 'Jumlah', 'Persen'], layDistRows, [3500, 2000, 2000, 2100]))
      children.push(new Paragraph({ text: '', spacing: { after: 200 } }))

      for (let i = 0; i < layananAspects.length; i++) {
        await addChartToDocument(children, `layanan-chart-${i}`, `${i + 1}. ${layananAspects[i].label}`)
      }

      const saranList = evaluasiArr.map(ev => ev.saran).filter(Boolean)
      if (saranList.length > 0) {
        children.push(new Paragraph({
          children: [new TextRun({ text: 'IV. Saran dan Masukan', bold: true, size: 24, font: 'Calibri' })],
          spacing: { before: 200, after: 150 },
        }))
        saranList.forEach((s, i) => {
          children.push(new Paragraph({
            children: [new TextRun({ text: `${i + 1}. ${s}`, size: 20, font: 'Calibri' })],
            spacing: { after: 80 },
          }))
        })
      }

      const doc = new Document({
        sections: [{ children }],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Laporan Evaluasi - ${kd.nama_kegiatan || 'Kegiatan'}.docx`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }

    const goBack = () => {
      router.back()
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
      error,
      kegiatanData,
      currentTpk,
      statistik,
      detailEvaluasi,
      programChartData,
      layananChartData,
      saranList,
      chartOptions,
      getFasilitatorChartData,
      downloadChart,
      downloadFasilitatorCharts,
      printLaporan,
      exportPDF,
      exportDocx,
      goBack,
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

@media print {
  body * {
    visibility: hidden;
  }
  
  .max-w-7xl,
  .max-w-7xl * {
    visibility: visible;
  }
  
  .max-w-7xl {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  
  button {
    display: none !important;
  }
  
  @page {
    margin: 15mm;
    size: A4;
  }
}
</style>
