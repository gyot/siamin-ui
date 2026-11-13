<template>
  <div class="relative">
    <!-- TOMBOL LONCENG -->
    <button
      @click.stop="terbuka = !terbuka"
      class="relative p-2 hover:bg-slate-100 rounded-full transition"
      aria-label="Notifikasi"
      title="Notifikasi"
    >
      <svg
        class="w-6 h-6 text-slate-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <!-- Angka merah jumlah belum dibaca -->
      <span
        v-if="jumlahBelumDibaca > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center"
      >
        {{ labelJumlah }}
      </span>
    </button>

    <!-- PANEL DROPDOWN -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="terbuka"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden"
      >
        <!-- HEADER -->
        <div class="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
          <p class="font-semibold text-slate-800">Notifikasi</p>
          <button
            @click="handleTandaiSemua"
            :disabled="jumlahBelumDibaca === 0"
            class="text-xs font-medium text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-default"
          >
            Tandai semua dibaca
          </button>
        </div>

        <!-- DAFTAR 20 NOTIFIKASI TERBARU -->
        <div class="max-h-96 overflow-y-auto">
          <p v-if="items.length === 0" class="px-4 py-6 text-center text-sm text-slate-500">
            Belum ada notifikasi.
          </p>

          <button
            v-for="notif in items"
            :key="notif.id"
            @click="handleBuka(notif)"
            class="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-slate-100 flex gap-3"
            :class="notif.dibaca_pada ? 'bg-white' : 'bg-blue-50'"
          >
            <!-- Penanda belum dibaca -->
            <span
              class="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
              :class="notif.dibaca_pada ? 'bg-transparent' : 'bg-blue-500'"
            ></span>
            <span class="min-w-0 flex-1">
              <span
                class="block text-sm text-slate-800 truncate"
                :class="notif.dibaca_pada ? 'font-medium' : 'font-semibold'"
              >
                {{ notif.judul }}
              </span>
              <span class="block text-xs text-slate-600 mt-0.5 break-words">
                {{ notif.pesan }}
              </span>
              <span class="block text-[11px] text-slate-400 mt-1">
                {{ formatWaktu(notif.created_at) }}
              </span>
            </span>
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- Overlay penutup dropdown -->
  <div v-if="terbuka" @click="terbuka = false" class="fixed inset-0 z-40"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePolling } from '@/composables/usePolling'
import { useNotifikasiStore } from '@/stores/notifikasi'

const router = useRouter()
const notifikasi = useNotifikasiStore()

const terbuka = ref(false)

const items = computed(() => notifikasi.items)
const jumlahBelumDibaca = computed(() => notifikasi.jumlahBelumDibaca)

const labelJumlah = computed(() =>
  jumlahBelumDibaca.value > 99 ? '99+' : String(jumlahBelumDibaca.value)
)

const formatWaktu = (iso) => {
  if (!iso) return ''
  const waktu = new Date(iso)
  if (Number.isNaN(waktu.getTime())) return ''
  const selisihDetik = Math.max(0, Math.floor((Date.now() - waktu.getTime()) / 1000))
  if (selisihDetik < 60) return 'baru saja'
  const menit = Math.floor(selisihDetik / 60)
  if (menit < 60) return menit + ' menit lalu'
  const jam = Math.floor(menit / 60)
  if (jam < 24) return jam + ' jam lalu'
  const hari = Math.floor(jam / 24)
  if (hari < 30) return hari + ' hari lalu'
  return waktu.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Klik notifikasi -> navigasi ke tautannya + tandai sudah dibaca.
const handleBuka = async (notif) => {
  terbuka.value = false
  if (!notif.dibaca_pada) {
    await notifikasi.tandaiDibaca(notif.id)
  }
  const tautan = notif.tautan || '/admin/dashboard'
  if (router.currentRoute.value.fullPath !== tautan) {
    router.push(tautan).catch(() => {})
  }
}

const handleTandaiSemua = () => notifikasi.tandaiSemua()

// Muat sekali saat mount, lalu polling real-time tiap 3 detik
// (composable usePolling: jeda saat tab tersembunyi, tanpa request tumpang tindih).
onMounted(() => notifikasi.muat({ paksa: true }))
usePolling(() => notifikasi.muat(), { intervalMs: 3000 })
</script>
