<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-6">
        <router-link to="/" class="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium">
          <span>&larr;</span>
          <span>Kembali ke beranda</span>
        </router-link>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6 mb-5">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-blue-600 font-semibold">Daftar Peserta Kegiatan</p>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-800">
              {{ kegiatan?.nama_kegiatan || 'Kegiatan' }}
            </h1>
            <p class="text-sm text-slate-600 mt-1">
              Menampilkan peserta yang sudah mengisi formulir.
            </p>
          </div>
          <div class="text-sm text-slate-600">
            Total peserta: <span class="font-semibold text-slate-800">{{ filteredPeserta.length }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 mb-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">Cari peserta</label>
            <input
              v-model="keyword"
              type="text"
              placeholder="Cari nama, email, instansi, atau peran..."
              class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">Baris per halaman</label>
            <select
              v-model.number="rowsPerPage"
              class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <button
              @click="printAllBiodataNoSignature"
              :disabled="filteredPeserta.length === 0"
              class="w-full px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cetak Semua Biodata (Tanpa TTD)
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
        Memuat daftar peserta...
      </div>

      <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else class="space-y-4">
        <div v-if="filteredPeserta.length === 0" class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
          Belum ada peserta yang mengisi formulir untuk kegiatan ini.
        </div>

        <div v-else class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-100 text-slate-700">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">No</th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nama_lengkap')">
                    Nama {{ sortIndicator('nama_lengkap') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('email')">
                    Email {{ sortIndicator('email') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nip')">
                    NIP {{ sortIndicator('nip') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('nama_instansi')">
                    Instansi {{ sortIndicator('nama_instansi') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('kab_kota')">
                    Kabupaten/Kota {{ sortIndicator('kab_kota') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold cursor-pointer select-none" @click="setSort('peran')">
                    Peran {{ sortIndicator('peran') }}
                  </th>
                  <th class="px-4 py-3 text-left font-semibold">TPK</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pesertaItem, index) in paginatedPeserta"
                  :key="pesertaItem.id_peserta || `${pesertaItem.id_kegiatan}-${index}`"
                  class="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td class="px-4 py-3 text-slate-700">{{ startRow + index }}</td>
                  <td class="px-4 py-3 font-medium text-slate-800">{{ pesertaItem.nama_lengkap || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.email || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.nip || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.nama_instansi || '-' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ pesertaItem.kab_kota || '-' }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {{ pesertaItem.peran || 'Peserta' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-slate-700">
                    <span v-if="pesertaItem.tpk">{{ pesertaItem.tpk.lokasi }}{{ pesertaItem.tpk.kabupaten_kota ? ` (${pesertaItem.tpk.kabupaten_kota})` : '' }}</span>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p class="text-sm text-slate-600">
              Menampilkan {{ startRow }} - {{ endRow }} dari {{ sortedPeserta.length }} data
            </p>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50"
                :disabled="currentPage === 1"
                @click="prevPage"
              >
                Prev
              </button>
              <span class="text-sm text-slate-700">Halaman {{ currentPage }} / {{ totalPages }}</span>
              <button
                class="px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAPI } from '@/services/api'
import database from '@/data/index.js'

export default {
  name: 'DaftarPesertaPublik',
  setup() {
    const route = useRoute()
    const kode = route.params.kode

    const isLoading = ref(true)
    const errorMessage = ref('')
    const keyword = ref('')
    const peserta = ref([])
    const kegiatanList = ref([])
    const currentPage = ref(1)
    const rowsPerPage = ref(10)
    const sortBy = ref('nama_lengkap')
    const sortOrder = ref('asc')

    const normalize = (value) => String(value || '').toLowerCase().trim()

    const loadData = async () => {
      isLoading.value = true
      errorMessage.value = ''

      try {
        const [pesertaData, kegiatanData] = await Promise.all([
          fetchAPI('peserta'),
          fetchAPI('kegiatan/all')
        ])

        peserta.value = Array.isArray(pesertaData)
          ? pesertaData
          : (Array.isArray(pesertaData?.data) ? pesertaData.data : [])

        kegiatanList.value = Array.isArray(kegiatanData)
          ? kegiatanData
          : (Array.isArray(kegiatanData?.data) ? kegiatanData.data : [])
      } catch (error) {
        console.warn('[DaftarPesertaPublik] gagal ambil API, pakai data lokal', error)
        peserta.value = database.peserta || []
        kegiatanList.value = database.kegiatan || []

        if (!peserta.value.length) {
          errorMessage.value = 'Daftar peserta belum dapat dimuat saat ini.'
        }
      } finally {
        isLoading.value = false
      }
    }

    const kegiatan = computed(() => {
      return kegiatanList.value.find((item) => normalize(item.id_kegiatan) === normalize(kode)) || null
    })

    const pesertaByKegiatan = computed(() => {
      return peserta.value.filter((item) => normalize(item.id_kegiatan) === normalize(kode))
    })

    const filteredPeserta = computed(() => {
      const key = normalize(keyword.value)
      if (!key) return pesertaByKegiatan.value

      return pesertaByKegiatan.value.filter((item) => {
        const haystack = [
          item.nama_lengkap,
          item.email,
          item.nama_instansi,
          item.kab_kota,
          item.peran
        ].map(normalize).join(' ')
        return haystack.includes(key)
      })
    })

    const sortedPeserta = computed(() => {
      const data = [...filteredPeserta.value]
      return data.sort((a, b) => {
        const left = normalize(a[sortBy.value])
        const right = normalize(b[sortBy.value])
        if (left < right) return sortOrder.value === 'asc' ? -1 : 1
        if (left > right) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    })

    const totalPages = computed(() => {
      const total = Math.ceil(sortedPeserta.value.length / rowsPerPage.value)
      return total > 0 ? total : 1
    })

    const paginatedPeserta = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value
      return sortedPeserta.value.slice(start, start + rowsPerPage.value)
    })

    const startRow = computed(() => {
      if (sortedPeserta.value.length === 0) return 0
      return (currentPage.value - 1) * rowsPerPage.value + 1
    })

    const endRow = computed(() => {
      if (sortedPeserta.value.length === 0) return 0
      return Math.min(currentPage.value * rowsPerPage.value, sortedPeserta.value.length)
    })

    const setSort = (column) => {
      if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        return
      }
      sortBy.value = column
      sortOrder.value = 'asc'
    }

    const sortIndicator = (column) => {
      if (sortBy.value !== column) return ''
      return sortOrder.value === 'asc' ? '▲' : '▼'
    }

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value -= 1
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value += 1
    }

    watch([keyword, rowsPerPage], () => {
      currentPage.value = 1
    })

    watch(totalPages, (newTotal) => {
      if (currentPage.value > newTotal) currentPage.value = newTotal
    })

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      try {
        return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      } catch {
        return dateString
      }
    }

    const printAllBiodataNoSignature = () => {
      if (!filteredPeserta.value || filteredPeserta.value.length === 0) return

      const namaKegiatan = kegiatan.value?.nama_kegiatan || '-'
      const tanggalMulai = kegiatan.value?.tanggal_mulai || ''
      const tanggalSelesai = kegiatan.value?.tanggal_selesai || ''
      const waktu = tanggalMulai && tanggalSelesai
        ? `${formatDate(tanggalMulai)} - ${formatDate(tanggalSelesai)}`
        : '-'
      const lokasi = kegiatan.value?.lokasi || '-'
      const daftarAtk = kegiatan.value?.daftar_atk || []

      const buildAtkRows = () => {
        const items = daftarAtk.length > 0 ? daftarAtk : Array.from({ length: 5 }, () => ({}))
        return items.map((atk, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${atk.nama_barang || '-'}</td>
            <td>${atk.jumlah !== undefined && atk.jumlah !== null ? atk.jumlah : '-'}</td>
          </tr>
        `).join('')
      }

      const sections = filteredPeserta.value.map((p, idx) => {
        const pangkatGol = [p.pangkat, p.gol].filter(Boolean).join(' / ') || '-'
        const kabKota = p.kab_kota || p.kabupaten_kota || '-'
        const peran = p.peran || 'Peserta'

        return `
          <div class="biodata-card">
            <div class="text-center mb-4">
              <h2>Biodata</h2>
            </div>
            <div class="info-section mb-4">
              <div class="info-row"><div class="info-label">Kegiatan</div><div class="info-separator">:</div><div class="info-value">${namaKegiatan}</div></div>
              <div class="info-row"><div class="info-label">Waktu</div><div class="info-separator">:</div><div class="info-value">${waktu}</div></div>
              <div class="info-row"><div class="info-label">Tempat</div><div class="info-separator">:</div><div class="info-value">${lokasi}</div></div>
            </div>
            <div class="info-section">
              <div class="info-row"><div class="info-label">1. Nama</div><div class="info-separator">:</div><div class="info-value">${p.nama_lengkap || '-'}</div></div>
              <div class="info-row"><div class="info-label">2. NIP</div><div class="info-separator">:</div><div class="info-value">${p.nip || '-'}</div></div>
              <div class="info-row"><div class="info-label">3. Pangkat/Golongan</div><div class="info-separator">:</div><div class="info-value">${pangkatGol}</div></div>
              <div class="info-row"><div class="info-label">4. Nama Instansi</div><div class="info-separator">:</div><div class="info-value">${p.nama_instansi || '-'}</div></div>
              <div class="info-row"><div class="info-label">5. Jabatan Kedinasan</div><div class="info-separator">:</div><div class="info-value">${p.jabatan || '-'}</div></div>
              <div class="info-row"><div class="info-label">6. Kabupaten/Kota</div><div class="info-separator">:</div><div class="info-value">${kabKota}</div></div>
              <div class="info-row"><div class="info-label">7. No. HP/WhatsApp</div><div class="info-separator">:</div><div class="info-value">${p.no_hp || '-'}</div></div>
              <div class="info-row"><div class="info-label">8. E-Mail</div><div class="info-separator">:</div><div class="info-value">${p.email || '-'}</div></div>
              <div class="info-row"><div class="info-label">9. Peran Dalam Kegiatan</div><div class="info-separator">:</div><div class="info-value">${peran}</div></div>
            </div>
            <div class="tables-row">
              <div class="table-box">
                <div class="table-title">Ceklist Kelengkapan Administrasi</div>
                <table>
                  <thead><tr><th>No</th><th>Dokumen</th><th>&#10003;</th></tr></thead>
                  <tbody>
                    <tr><td>1</td><td>Penugasan</td><td></td></tr>
                    <tr><td>2</td><td>SPPD</td><td></td></tr>
                    <tr><td>3</td><td>Tiket Pergi</td><td></td></tr>
                    <tr><td>4</td><td>Tiket Pulang</td><td></td></tr>
                    <tr><td>5</td><td>Nota Bensin</td><td></td></tr>
                  </tbody>
                </table>
              </div>
              <div class="table-box">
                <div class="table-title">Kelengkapan Kegiatan</div>
                <table>
                  <thead><tr><th>No</th><th>Nama Barang</th><th>Jumlah</th></tr></thead>
                  <tbody>${buildAtkRows()}</tbody>
                </table>
              </div>
            </div>
          </div>
        `
      }).join('<div class="page-break"></div>')

      const printWindow = window.open('', '', 'width=1200,height=800')
      if (!printWindow) return

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Biodata</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1; padding: 15mm; color: #000; }
            .text-center { text-align: center; }
            h2 { font-size: 25pt; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; }
            .info-section { margin-bottom: 10px; }
            .info-row { display: flex; margin-bottom: 3px; }
            .info-label { width: 220px; font-weight: 600; }
            .info-separator { width: 20px; text-align: center; }
            .info-value { flex: 1; }
            .biodata-card { page-break-inside: avoid; }
            .tables-row { display: flex; gap: 10px; margin-bottom: 10px; page-break-inside: avoid; flex-wrap: wrap; }
            .table-box { flex: 1; min-width: 0; }
            .table-title { font-weight: 600; border: 1px solid #000; background-color: #f5f5f5; padding: 4px; margin-bottom: 4px; text-align: center; font-size: 14pt; }
            table { width: 100%; border-collapse: collapse; font-size: 11pt; page-break-inside: avoid; }
            th, td { border: 1px solid #000; padding: 3px 6px; text-align: left; font-size: 11pt; }
            th { background-color: #f0f0f0 !important; font-weight: bold; text-align: center; }
            .page-break { page-break-after: always; margin: 30px 0; }
            @media print {
              * { font-size: 14pt !important; }
              @page { margin: 15mm; size: A4; }
              body { padding: 15mm; }
              .page-break { display: block; }
            }
          </style>
        </head>
        <body>${sections}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }

    onMounted(loadData)

    return {
      isLoading,
      errorMessage,
      keyword,
      kegiatan,
      filteredPeserta,
      sortedPeserta,
      paginatedPeserta,
      currentPage,
      rowsPerPage,
      totalPages,
      startRow,
      endRow,
      setSort,
      sortIndicator,
      prevPage,
      nextPage,
      printAllBiodataNoSignature
    }
  }
}
</script>
