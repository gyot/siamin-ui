<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-3xl font-bold text-slate-800">Lihat Tandatangan</h1>
          <button @click="goBack" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
            ← Kembali
          </button>
        </div>
        <p class="text-slate-600">ID Peserta: <span class="font-semibold">{{ pesertaId }}</span></p>
      </div>

      <!-- Content -->
      <div v-if="peserta" class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Informasi Peserta</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-slate-600">Nama Lengkap</p>
                <p class="text-lg font-medium text-slate-900">{{ peserta.nama_lengkap }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-600">Email</p>
                <p class="text-lg font-medium text-slate-900">{{ peserta.email }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-600">No. HP</p>
                <p class="text-lg font-medium text-slate-900">{{ peserta.no_hp || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-600">Instansi</p>
                <p class="text-lg font-medium text-slate-900">{{ peserta.nama_instansi }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-600">Tanggal Daftar</p>
                <p class="text-lg font-medium text-slate-900">{{ formatDate(peserta.created_at) }}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Tandatangan Digital</h3>
            <div v-if="peserta.tandatangan" class="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50">
              <img :src="peserta.tandatangan" alt="Tandatangan Peserta" class="w-full h-auto max-h-64 object-contain" />
              <div class="mt-4 flex gap-2">
                <button @click="downloadSignature" class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition">
                  📥 Unduh
                </button>
                <button @click="viewFullsize" class="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white font-medium rounded-lg transition">
                  🔍 Lihat Penuh
                </button>
              </div>
            </div>
            <div v-else class="border-2 border-dashed border-red-300 rounded-lg p-8 bg-red-50 text-center">
              <p class="text-red-600 font-medium">❌ Tandatangan tidak tersedia</p>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-6 mt-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Data Tambahan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-slate-600">NIP</p>
              <p class="font-medium text-slate-900">{{ peserta.nip || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-600">Jenis Kelamin</p>
              <p class="font-medium text-slate-900">{{ peserta.jenis_kelamin || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-600">Tempat Lahir</p>
              <p class="font-medium text-slate-900">{{ peserta.tempat_lahir || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-600">Tanggal Lahir</p>
              <p class="font-medium text-slate-900">{{ peserta.tanggal_lahir || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-600">Jabatan</p>
              <p class="font-medium text-slate-900">{{ peserta.jabatan || '-' }}</p>
            </div>
            <div>
              <p class="text-slate-600">Peran</p>
              <p class="font-medium text-slate-900">{{ peserta.peran || '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-xl text-slate-600 mb-4">📋 Peserta tidak ditemukan</p>
        <button @click="goBack" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition">
          Kembali
        </button>
      </div>

      <!-- Fullscreen Modal -->
      <div v-if="showFullsize" @click="showFullsize = false" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div @click.stop class="bg-white rounded-lg shadow-2xl max-w-2xl max-h-96 overflow-auto p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-slate-800">Tandatangan - Ukuran Penuh</h3>
            <button @click="showFullsize = false" class="text-2xl text-slate-500 hover:text-slate-700">
              ✕
            </button>
          </div>
          <img v-if="peserta && peserta.tandatangan" :src="peserta.tandatangan" alt="Tandatangan Penuh" class="w-full h-auto object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import database from '@/data/index.js'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const pesertaId = ref(route.params.id)
const peserta = ref(null)
const showFullsize = ref(false)

onMounted(() => {
  const foundPeserta = database.peserta.find(p => p.id_peserta === parseInt(pesertaId.value))
  if (foundPeserta) {
    peserta.value = foundPeserta
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const downloadSignature = () => {
  if (!peserta.value || !peserta.value.tandatangan) return

  const link = document.createElement('a')
  link.href = peserta.value.tandatangan
  link.download = `tandatangan_${peserta.value.nama_lengkap}_${new Date().getTime()}.png`
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

const viewFullsize = () => {
  showFullsize.value = true
}

const goBack = () => {
  router.back()
}
</script>
