<template>
  <div class="min-h-screen bg-[#F0F2F5] p-3 sm:p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">API Token</h1>
        <p class="text-sm text-gray-600 mt-1">Kelola token untuk integrasi aplikasi lain dengan SIMAIK.</p>
      </div>

      <!-- Form buat token -->
      <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Buat Token Baru</h2>
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="tokenName"
            type="text"
            placeholder="Nama token (mis. aplikasi-kepegawaian)"
            class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            @keyup.enter="generateToken"
          />
          <button
            @click="generateToken"
            :disabled="!tokenName.trim() || isGenerating"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isGenerating ? 'Membuat...' : 'Generate Token' }}
          </button>
        </div>

        <!-- Hasil token (sekali tampil) -->
        <div v-if="newToken" class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p class="text-sm font-semibold text-emerald-800 mb-2">
            ✅ Token berhasil dibuat — <span class="font-bold">salin dan simpan sekarang</span>, nilai ini tidak akan ditampilkan lagi!
          </p>
          <div class="flex flex-col sm:flex-row gap-2">
            <code class="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs break-all select-all">{{ newToken }}</code>
            <button
              @click="salinToken"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium whitespace-nowrap"
            >
              {{ sudahDisalin ? '✓ Tersalin' : 'Salin' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Daftar token -->
      <div class="bg-white rounded-2xl shadow-md overflow-hidden">
        <div class="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800">Token Terdaftar</h2>
        </div>
        <div v-if="isLoading" class="p-6 text-center text-gray-500 text-sm">Memuat data token...</div>
        <div v-else-if="tokens.length === 0" class="p-6 text-center text-gray-500 text-sm">
          Belum ada token yang dibuat.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full table-fixed text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[35%]">Nama</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[25%]">Dibuat</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-[25%]">Terakhir Dipakai</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-[15%]">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="t in tokens" :key="t.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900 break-words">{{ t.name }}</td>
                <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ formatTanggal(t.created_at) }}</td>
                <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ t.last_used_at ? formatTanggal(t.last_used_at) : 'Belum pernah' }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="cabutToken(t)"
                    class="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs font-semibold"
                  >
                    Cabut
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Panduan singkat -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
        <h3 class="text-sm font-semibold text-blue-800 mb-2">Cara memakai token</h3>
        <p class="text-xs sm:text-sm text-blue-900 leading-relaxed">
          Sertakan token sebagai header pada setiap request API dari aplikasi lain:
        </p>
        <code class="block mt-2 px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs break-all">
          Authorization: Bearer ***
        </code>
        <p class="text-xs sm:text-sm text-blue-900 mt-2">
          Contoh endpoint: <code class="px-1.5 py-0.5 bg-white rounded">/api/v1/integrasi/peserta</code> (daftar peserta + kegiatan)
          dan <code class="px-1.5 py-0.5 bg-white rounded">/api/v1/integrasi/peserta/{id}</code> (detail + kegiatan yang diikuti).
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchAPI, postAPI, deleteAPI } from '@/services/api'
import Swal from 'sweetalert2'

const tokens = ref([])
const isLoading = ref(false)
const isGenerating = ref(false)
const tokenName = ref('')
const newToken = ref('')
const sudahDisalin = ref(false)

const formatTanggal = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const loadTokens = async () => {
  isLoading.value = true
  try {
    const res = await fetchAPI('api-tokens')
    tokens.value = Array.isArray(res) ? res : (res?.data || [])
  } catch {
    tokens.value = []
  } finally {
    isLoading.value = false
  }
}

const generateToken = async () => {
  if (!tokenName.value.trim() || isGenerating.value) return
  isGenerating.value = true
  newToken.value = ''
  sudahDisalin.value = false
  try {
    const res = await postAPI('api-tokens', { name: tokenName.value.trim() })
    newToken.value = res?.token || res?.data?.token || ''
    tokenName.value = ''
    await loadTokens()
  } catch (error) {
    await Swal.fire('Gagal', error.message || 'Gagal membuat token.', 'error')
  } finally {
    isGenerating.value = false
  }
}

const salinToken = async () => {
  try {
    await navigator.clipboard.writeText(newToken.value)
    sudahDisalin.value = true
    setTimeout(() => { sudahDisalin.value = false }, 2500)
  } catch {
    await Swal.fire('Salin manual', 'Silakan blok dan salin token secara manual.', 'info')
  }
}

const cabutToken = async (t) => {
  const result = await Swal.fire({
    title: 'Cabut token?',
    html: `Token <strong>${t.name}</strong> akan dinonaktifkan dan aplikasi yang memakainya tidak akan bisa mengakses API lagi.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Cabut',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626'
  })
  if (!result.isConfirmed) return
  try {
    await deleteAPI('api-tokens', t.id)
    await Swal.fire('Berhasil', 'Token berhasil dicabut.', 'success')
    await loadTokens()
  } catch (error) {
    await Swal.fire('Gagal', error.message || 'Gagal mencabut token.', 'error')
  }
}

onMounted(loadTokens)
</script>
