<template>
  <div class="p-6 bg-slate-50 min-h-screen">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p class="text-slate-500">Selamat datang kembali, {{ currentUser?.name || 'Admin' }}</p>
          <p class="text-slate-600">Sistem Informasi Administrasi Manajemen Kegiatan (SIAMIN) membantu Anda mengelola kegiatan, peserta, surat tugas, dan sertifikat digital secara terintegrasi.</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div class="text-2xl font-bold text-slate-800 mb-1">{{ totalKegiatan }}</div>
            <div class="text-slate-500 text-sm">Total Kegiatan</div>
          </div>
          <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div class="text-2xl font-bold text-slate-800 mb-1">{{ totalPeserta }}</div>
            <div class="text-slate-500 text-sm">Total Peserta</div>
          </div>
          <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+15%</span>
            </div>
            <div class="text-2xl font-bold text-slate-800 mb-1">{{ totalSertifikat }}</div>
            <div class="text-slate-500 text-sm">Sertifikat Terbit</div>
          </div>
          <div class="card-stat bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="flex items-center justify-between mb-3">
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-800 mb-1">{{ kegiatanBerjalan }}</div>
            <div class="text-slate-500 text-sm">Kegiatan Berjalan</div>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Cari Kegiatan</label>
              <input
                v-model="searchKegiatan"
                type="text"
                placeholder="Ketik nama kegiatan..."
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Filter Tahun</label>
              <select
                v-model="filterTahun"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Tahun</option>
                <option v-for="tahun in availableTahun" :key="tahun" :value="tahun">
                  {{ tahun }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Filter Status</label>
              <select
                v-model="filterStatus"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                <option value="berjalan">Berjalan</option>
                <option value="akan_datang">Akan Datang</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Kegiatan List -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Daftar Kegiatan</h3>
          <div v-if="filteredKegiatan.length === 0" class="bg-white rounded-xl p-8 border border-slate-100 shadow-sm text-center">
            <p class="text-slate-500">Tidak ada kegiatan yang sesuai dengan filter</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="k in filteredKegiatan"
              :key="k.id_kegiatan"
              class="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div :class="getStatusColor(k.status)" class="h-1"></div>
              <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-slate-800 text-sm flex-1">{{ k.nama_kegiatan }}</h4>
                  <span :class="getStatusBadge(k.status)" class="text-xs whitespace-nowrap ml-2">
                    {{ formatStatus(k.status) }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mb-3">{{ k.peserta_ringkasan }}</p>
                
                <div class="space-y-2 text-xs text-slate-600 mb-4">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>{{ formatDateRange(k.tanggal_mulai, k.tanggal_selesai) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    <span>{{ k.lokasi }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <span>{{ k.total_peserta }} Peserta</span>
                  </div>
                </div>

                <button
                  @click="openDetailModal(k)"
                  class="w-full px-3 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <!-- Detail Modal -->
        <div v-if="showDetailModal && selectedKegiatan" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 class="text-xl font-bold">Detail Kegiatan</h2>
              <button @click="showDetailModal = false" class="text-2xl hover:text-blue-200">&times;</button>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-slate-600">Nama Kegiatan</p>
                  <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.nama_kegiatan }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">ID Kegiatan</p>
                  <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.id_kegiatan }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Status</p>
                  <span :class="getStatusBadge(selectedKegiatan.status)">
                    {{ formatStatus(selectedKegiatan.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Lokasi</p>
                  <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.lokasi }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Tanggal Mulai</p>
                  <p class="text-lg font-semibold text-slate-900">{{ formatDate(selectedKegiatan.tanggal_mulai) }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Tanggal Selesai</p>
                  <p class="text-lg font-semibold text-slate-900">{{ formatDate(selectedKegiatan.tanggal_selesai) }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Total Peserta</p>
                  <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.total_peserta }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Metode Pelaksanaan</p>
                  <p class="text-lg font-semibold text-slate-900 capitalize">{{ selectedKegiatan.metode_pelaksanaan }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Metode Pembayaran</p>
                  <p class="text-lg font-semibold text-slate-900 capitalize">{{ selectedKegiatan.metode_pembayaran }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Peserta Ringkasan</p>
                  <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.peserta_ringkasan }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-slate-600">Deskripsi</p>
                  <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.deskripsi }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-slate-600">Rincian Kegiatan</p>
                  <p class="text-lg font-semibold text-slate-900">{{ selectedKegiatan.rincian_kegiatan }}</p>
                </div>
              </div>
              <!-- form links -->
              <div class="mt-6">
                <p class="text-sm text-slate-600 font-medium">Link Formulir</p>
                <ul class="list-disc list-inside space-y-1">
                  <li><a :href="activityLinks.peserta" target="_blank" class="text-blue-600 hover:underline">Peserta</a></li>
                  <li><a :href="activityLinks.panitia" target="_blank" class="text-blue-600 hover:underline">Panitia</a></li>
                  <li><a :href="activityLinks.narasumber" target="_blank" class="text-blue-600 hover:underline">Narasumber</a></li>
                </ul>
              </div>
              <!-- peserta controls -->
              <div class="mt-6">
                <button
                  @click="viewPesertaList = !viewPesertaList"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  {{ viewPesertaList ? 'Tutup Data Peserta' : 'Lihat Data Peserta' }}
                </button>
              </div>
              <div v-if="viewPesertaList" class="mt-4">
                <div class="flex justify-end gap-2 mb-3">
                  <button
                    @click="exportPesertaKegiatan"
                    class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                  >
                    Export Excel
                  </button>
                </div>
                <div class="overflow-x-auto max-h-64">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="bg-slate-100">
                        <th class="p-2 text-left">Nama</th>
                        <th class="p-2 text-left">NIP</th>
                        <th class="p-2 text-left">Email</th>
                        <th class="p-2 text-left">Peran</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="p in pesertaInSelected" :key="p.id_peserta" class="border-b">
                        <td class="p-2">{{ p.nama_lengkap }}</td>
                        <td class="p-2">{{ p.nip }}</td>
                        <td class="p-2">{{ p.email }}</td>
                        <td class="p-2">{{ p.peran }}</td>
                      </tr>
                      <tr v-if="pesertaInSelected.length === 0">
                        <td colspan="4" class="p-2 text-center text-slate-500">Tidak ada peserta</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="flex gap-3 justify-end mt-6">
                <button
                  @click="showDetailModal = false"
                  class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { useAuthStore } from '@/stores/auth'
import database from '@/data/index.js'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const currentUser = ref(authStore.currentUser)
    
    // kegiatan list is sourced from API and already filtered by backend
    // to show only records created by the logged in pegawai (see backend
    // controller update). keep local copy for offline fallback only.
    const kegiatan = ref(database.kegiatan)
    const peserta = ref(database.peserta)
    const sertifikat = ref(database.sertifikat)

    const totalKegiatan = ref(kegiatan.value.length)
    const totalPeserta = ref(peserta.value.length)
    const totalSertifikat = ref(sertifikat.value.filter(s => s.status === 'terbit').length)
    const kegiatanBerjalan = computed(() => {
      return kegiatan.value.filter(k => k.status === 'berjalan').length
    })

    const searchKegiatan = ref('')
    const filterTahun = ref(new Date().getFullYear().toString())
    const filterStatus = ref('')
    const showDetailModal = ref(false)
    const selectedKegiatan = ref(null)

    const currentYear = new Date().getFullYear().toString()

    // Get available years from kegiatan data
    const availableTahun = computed(() => {
      const years = new Set()
      kegiatan.value.forEach(k => {
        if (k.tanggal_mulai) {
          const year = new Date(k.tanggal_mulai).getFullYear().toString()
          years.add(year)
        }
      })
      return Array.from(years).sort((a, b) => b - a)
    })

    const filteredKegiatan = computed(() => {
      return kegiatan.value.filter(k => {
        const searchMatch = k.nama_kegiatan.toLowerCase().includes(searchKegiatan.value.toLowerCase())
        const tahunMatch = !filterTahun.value || (k.tanggal_mulai && new Date(k.tanggal_mulai).getFullYear().toString() === filterTahun.value)
        const statusMatch = !filterStatus.value || k.status === filterStatus.value
        return searchMatch && tahunMatch && statusMatch
      })
    })

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatDateRange = (startDate, endDate) => {
      const start = new Date(startDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      const end = new Date(endDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      return `${start} - ${end}`
    }

    const formatStatus = (status) => {
      const statusMap = {
        'berjalan': 'Berjalan',
        'akan_datang': 'Akan Datang',
        'selesai': 'Selesai'
      }
      return statusMap[status] || status
    }

    const getStatusColor = (status) => {
      const colorMap = {
        'berjalan': 'bg-blue-500',
        'akan_datang': 'bg-amber-500',
        'selesai': 'bg-emerald-500'
      }
      return colorMap[status] || 'bg-slate-400'
    }

    const getStatusBadge = (status) => {
      const badgeMap = {
        'berjalan': 'inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold',
        'akan_datang': 'inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold',
        'selesai': 'inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold'
      }
      return badgeMap[status] || 'inline-block px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-semibold'
    }

    // slugify helper for building friendly URL segments
    const slugify = (text) => {
      if (!text) return ''
      return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
    }

    const buildFormLink = (kode, peran, judul) => {
      const base = (window.location.origin || import.meta.env.VITE_BASE_URL || '')
        .replace(/\/$/, '')
      return `${base}/formulir/${kode}/${peran}/${slugify(judul)}`
    }

    const activityLinks = computed(() => {
      if (!selectedKegiatan.value) return { peserta: '', panitia: '', narasumber: '' }
      const kode = selectedKegiatan.value.id_kegiatan || ''
      const judul = selectedKegiatan.value.nama_kegiatan || ''
      return {
        peserta: buildFormLink(kode, 'Peserta', judul),
        panitia: buildFormLink(kode, 'Panitia', judul),
        narasumber: buildFormLink(kode, 'Narasumber', judul)
      }
    })

    const pesertaInSelected = computed(() => {
      if (!selectedKegiatan.value) return []
      return peserta.value.filter(p => String(p.id_kegiatan) === String(selectedKegiatan.value.id_kegiatan))
    })

    const viewPesertaList = ref(false)

    const exportPesertaKegiatan = () => {
      const apiBase = import.meta.env.VITE_API_BASE_URL || ''
      const buildSignatureUrl = (sig) => {
        if (!sig) return ''
        if (typeof sig !== 'string') return ''
        if (sig.startsWith('http')) return sig
        if (sig.startsWith('data:')) return sig
        return apiBase + '/storage/' + sig
      }

      const rows = pesertaInSelected.value.map(p => {
        const signature = p.tanda_tangan_url || p.tanda_tangan || p.tandatangan || ''
        return {
          id_peserta: p.id_peserta,
          id_kegiatan: p.id_kegiatan,
          nama_lengkap: p.nama_lengkap,
          nip: p.nip || '',
          email: p.email || '',
          no_hp: p.no_hp || '',
          nama_instansi: p.nama_instansi || '',
          kab_kota: p.kab_kota || '',
          provinsi: p.provinsi || '',
          peran: p.peran || '',
          jenis_kelamin: p.jenis_kelamin || '',
          nomor_rekening: p.nomor_rekening || '',
          nama_bank: p.nama_bank || '',
          provider_pulsa: p.provider_pulsa || '',
          tanda_tangan_url: buildSignatureUrl(signature)
        }
      })

      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Peserta')
      const filename = `peserta_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`
      XLSX.writeFile(wb, filename)
    }

    const openDetailModal = (k) => {
      selectedKegiatan.value = k
      showDetailModal.value = true
    }

    return {
      currentUser,
      totalKegiatan,
      totalPeserta,
      totalSertifikat,
      kegiatanBerjalan,
      kegiatan,
      searchKegiatan,
      filterTahun,
      filterStatus,
      availableTahun,
      filteredKegiatan,
      formatDate,
      formatDateRange,
      formatStatus,
      getStatusColor,
      getStatusBadge,
      openDetailModal,
      showDetailModal,
      selectedKegiatan,
      activityLinks,
      pesertaInSelected,
      viewPesertaList,
      exportPesertaKegiatan
    }
  }
}
</script>

<style scoped>
.card-stat {
  transition: all 0.3s ease;
}

.card-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>