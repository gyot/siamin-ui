<template>
  <div class="min-h-screen bg-[#F0F2F5] p-3 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Hak Akses</h1>
        <p class="text-sm text-gray-600 mt-1">
          Atur menu yang boleh diakses setiap pengguna. Centang menu yang diizinkan lalu tekan Simpan pada barisnya.
        </p>
      </div>

      <!-- Info penanda default -->
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p class="text-xs sm:text-sm text-blue-900 leading-relaxed">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-semibold mr-1">Default</span>
          menandai user yang masih memakai menu bawaan
          <span class="font-semibold">(Dashboard, Kegiatan, Pegawai &amp; User, Penugasan, Laporan Kegiatan)</span>
          karena belum pernah diatur hak aksesnya. User bertanda
          <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-[11px] font-semibold mx-1">Super Admin</span>
          selalu memiliki akses ke semua menu.
        </p>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama atau NIP..."
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <div class="flex items-center gap-2">
          <div class="relative">
            <button
              type="button"
              class="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
              @click="kolomMenuTerbuka = !kolomMenuTerbuka"
            >
              ⚙ Kelola Kolom
            </button>
            <div
              v-if="kolomMenuTerbuka"
              class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2"
            >
              <p class="px-2 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Kolom Menu</p>
              <label
                v-for="menu in MENU_OPTIONS"
                :key="menu.key"
                class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 cursor-pointer"
              >
                <input type="checkbox" :value="menu.key" v-model="kolomTerlihat" class="rounded border-gray-300" />
                <span>{{ menu.label }}</span>
              </label>
            </div>
          </div>
          <button
            type="button"
            class="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
            @click="muatUlang"
          >
            ⟳ Muat Ulang
          </button>
        </div>
      </div>

      <!-- Tabel user -->
      <div class="bg-white rounded-2xl shadow-md overflow-hidden">
        <div v-if="isLoading" class="p-6 text-center text-gray-500 text-sm">Memuat data hak akses...</div>
        <div v-else-if="loadError" class="p-6 text-center text-sm">
          <p class="text-red-600 font-medium mb-2">Gagal memuat daftar hak akses.</p>
          <p class="text-gray-500 mb-3">{{ loadError }}</p>
          <button
            type="button"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            @click="muatUlang"
          >
            Coba Lagi
          </button>
        </div>
        <div v-else-if="rows.length === 0" class="p-6 text-center text-gray-500 text-sm">
          Tidak ada user yang cocok dengan pencarian.
        </div>
        <table v-else class="w-full table-fixed text-[11px]">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-2 py-3 text-left font-semibold text-gray-600 w-[13%] break-words">Nama</th>
              <th class="px-2 py-3 text-left font-semibold text-gray-600 w-[10%] break-words">NIP</th>
              <th class="px-2 py-3 text-left font-semibold text-gray-600 w-[9%] break-words">Peran</th>
              <th
                v-for="menu in menuTerlihat"
                :key="menu.key"
                class="px-1 py-3 text-center font-semibold text-gray-600 w-[3.6%] break-words"
                :title="menu.label"
              >
                {{ menu.short }}
              </th>
              <th class="px-2 py-3 text-center font-semibold text-gray-600 w-[8%] break-words">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in rows" :key="row.id_user" class="hover:bg-gray-50">
              <td class="px-2 py-2.5 font-medium text-gray-900 break-words">
                <div class="flex flex-col gap-1">
                  <span>{{ row.nama }}</span>
                  <span class="flex flex-wrap gap-1">
                    <span
                      v-if="row.isDefault"
                      class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-semibold"
                      title="Masih memakai menu default (belum dikonfigurasi)"
                    >
                      Default
                    </span>
                    <span
                      v-if="row.peranAwal === 'super_admin'"
                      class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-semibold"
                    >
                      Super Admin
                    </span>
                  </span>
                </div>
              </td>
              <td class="px-2 py-2.5 text-gray-600 break-words">{{ row.nip || '-' }}</td>
              <td class="px-2 py-2.5">
                <select
                  v-model="row.peran"
                  class="w-full px-1.5 py-1.5 border border-gray-300 rounded-lg text-[11px] focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option v-for="p in opsiPeran(row)" :key="p" :value="p">{{ labelPeran(p) }}</option>
                </select>
              </td>
              <td v-for="menu in menuTerlihat" :key="menu.key" class="px-1 py-2.5 text-center">
                <input
                  v-model="row.menus[menu.key]"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 align-middle"
                  :disabled="row.saving"
                  :title="menu.label"
                />
              </td>
              <td class="px-2 py-2.5 text-center">
                <button
                  type="button"
                  class="w-full px-2 py-1.5 rounded-lg text-[11px] font-semibold transition"
                  :class="row.saving
                    ? 'bg-gray-300 text-gray-600 cursor-wait'
                    : (row.saved
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700')"
                  :disabled="row.saving"
                  @click="simpanBaris(row)"
                >
                  {{ row.saving ? 'Menyimpan...' : (row.saved ? '✓ Tersimpan' : 'Simpan') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[11px] text-gray-500 mt-3">
        Perubahan hanya berlaku setelah tombol Simpan pada baris ditekan. Sidebar pengguna akan menyesuaikan setelah mereka masuk ulang atau memuat ulang halaman.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { MENU_OPTIONS, listHakAkses, updateHakAkses, normalizeMenuKeys } from '@/services/hakAkses'
import { useAuthStore } from '@/stores/auth'
import { useHakAksesStore } from '@/stores/hakAkses'

const authStore = useAuthStore()
const hakAksesStore = useHakAksesStore()

const allRows = ref([])
const isLoading = ref(false)
const loadError = ref(null)
const search = ref('')
const kolomMenuTerbuka = ref(false)
const kolomTerlihat = ref(MENU_OPTIONS.map((m) => m.key))

const menuTerlihat = computed(() =>
  MENU_OPTIONS.filter((m) => kolomTerlihat.value.includes(m.key))
)

// `rows` di template = hasil pencarian dari semua user
const rows = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return allRows.value
  return allRows.value.filter((row) =>
    String(row.nama).toLowerCase().includes(q) || String(row.nip).toLowerCase().includes(q)
  )
})

const labelPeran = (p) => {
  if (p === 'super_admin') return 'Super Admin'
  if (p === 'admin') return 'Admin'
  return p ? String(p).replace(/_/g, ' ') : '-'
}

const opsiPeran = (row) => {
  const base = ['admin', 'super_admin']
  // Pertahankan peran yang tidak dikenal (mis. operator) sebagai pilihan
  // supaya Simpan tidak diam-diam menimpanya.
  if (row.peranAwal && !base.includes(row.peranAwal)) return [row.peranAwal, ...base]
  return base
}

const buildRow = (user) => {
  const menuKeys = normalizeMenuKeys(user?.menus)
  return {
    id_user: user?.id_user ?? user?.id ?? null,
    nama: user?.nama || user?.name || '-',
    nip: user?.nip || '',
    peranAwal: user?.peran || user?.role || 'admin',
    peran: user?.peran || user?.role || 'admin',
    isDefault: user?.default === true,
    menus: Object.fromEntries(MENU_OPTIONS.map((m) => [m.key, menuKeys.includes(m.key)])),
    saving: false,
    saved: false
  }
}

const muatData = async () => {
  isLoading.value = true
  loadError.value = null
  try {
    const users = await listHakAkses()
    allRows.value = users.map(buildRow)
  } catch (err) {
    loadError.value = err?.message || 'Terjadi kesalahan saat mengambil data.'
    allRows.value = []
  } finally {
    isLoading.value = false
  }
}

const muatUlang = () => muatData()

const simpanBaris = async (row) => {
  if (row.saving) return
  row.saving = true
  row.saved = false
  try {
    const menus = MENU_OPTIONS.filter((m) => row.menus[m.key]).map((m) => m.key)
    const payload = { menus }
    if (row.peran && row.peran !== row.peranAwal) payload.peran = row.peran

    await updateHakAkses(row.id_user, payload)

    row.peranAwal = row.peran
    row.saved = true
    setTimeout(() => { row.saved = false }, 2500)

    // Jika yang diubah adalah diri sendiri, muat ulang hak akses agar
    // sidebar/guard langsung memakai konfigurasi terbaru.
    const myId = authStore.currentUser?.id ?? authStore.currentUser?.id_user ?? authStore.currentUser?.id_pegawai
    if (myId != null && String(myId) === String(row.id_user)) {
      await hakAksesStore.load({ force: true })
    }

    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: `Hak akses ${row.nama} tersimpan`,
      showConfirmButton: false,
      timer: 2500
    })
  } catch (err) {
    Swal.fire('Gagal', err?.message || 'Gagal menyimpan hak akses.', 'error')
  } finally {
    row.saving = false
  }
}

onMounted(() => {
  muatData()
})
</script>
