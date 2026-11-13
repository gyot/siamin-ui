import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  listNotifikasi,
  tandaiNotifikasiDibaca,
  tandaiSemuaNotifikasiDibaca
} from '@/services/notifikasi'

/**
 * State bersama lonceng notifikasi.
 *
 * Header desktop dan mobile header bisa memasang NotifikasiBell bersamaan,
 * sehingga `muat()` dipagari: hanya satu request yang berjalan, dan permintaan
 * beruntun < 2 detik dilewati (polling usePolling tetap 3 detik per instance).
 */
export const useNotifikasiStore = defineStore('notifikasi', () => {
  const items = ref([])
  const jumlahBelumDibaca = ref(0)
  const belumDimuat = ref(true)

  let sedangMemuat = false
  let terakhirMuat = 0

  const muat = async ({ paksa = false } = {}) => {
    const sekarang = Date.now()
    if (sedangMemuat) return
    if (!paksa && sekarang - terakhirMuat < 2000) return

    sedangMemuat = true
    try {
      const hasil = await listNotifikasi()
      items.value = hasil.data
      jumlahBelumDibaca.value = hasil.jumlah_belum_dibaca
      belumDimuat.value = false
      terakhirMuat = Date.now()
    } catch (error) {
      // Refresh diam-diam gagal: biarkan data lama tampil, jangan ganggu UI.
      console.warn('[Notifikasi] Gagal memuat notifikasi:', error)
    } finally {
      sedangMemuat = false
    }
  }

  const tandaiDibaca = async (id) => {
    try {
      const response = await tandaiNotifikasiDibaca(id)
      const idx = items.value.findIndex((n) => n.id === id)
      if (idx !== -1) {
        items.value[idx] = response?.data ?? {
          ...items.value[idx],
          dibaca_pada: new Date().toISOString()
        }
      }
      jumlahBelumDibaca.value = response?.jumlah_belum_dibaca
        ?? Math.max(0, jumlahBelumDibaca.value - 1)
    } catch (error) {
      console.warn('[Notifikasi] Gagal menandai notifikasi dibaca:', error)
    }
  }

  const tandaiSemua = async () => {
    try {
      await tandaiSemuaNotifikasiDibaca()
      items.value = items.value.map((n) => ({
        ...n,
        dibaca_pada: n.dibaca_pada ?? new Date().toISOString()
      }))
      jumlahBelumDibaca.value = 0
    } catch (error) {
      console.warn('[Notifikasi] Gagal menandai semua notifikasi dibaca:', error)
    }
  }

  return {
    items,
    jumlahBelumDibaca,
    belumDimuat,
    muat,
    tandaiDibaca,
    tandaiSemua
  }
})
