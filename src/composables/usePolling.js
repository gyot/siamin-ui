// Composable polling real-time (refresh data otomatis, default tiap 3 detik).
// Prinsip:
// - Memanggil ulang fungsi muat data yang sudah ada; state filter/pencarian/
//   sortir/halaman tidak disentuh sehingga posisi pengguna dipertahankan.
// - Jeda saat tab tidak terlihat (document.visibilityState) dan saat isPaused()
//   bernilai true (modal/form/proses massal terbuka); lanjut lagi saat kembali.
// - Tanpa request tumpang tindih: bila request sebelumnya belum selesai,
//   tick berikutnya dilewati.
import { onMounted, onBeforeUnmount } from 'vue'

export const usePolling = (loadFn, { intervalMs = 3000, isPaused } = {}) => {
  let timer = null
  let inFlight = false

  const tick = async () => {
    if (inFlight) return // request sebelumnya masih berjalan: lewati tick ini
    if (document.visibilityState !== 'visible') return // tab tersembunyi: jeda
    if (typeof isPaused === 'function' && isPaused()) return // modal/form/proses: jeda

    inFlight = true
    try {
      await loadFn()
    } catch (error) {
      // Refresh diam-diam gagal: biarkan data lama tampil, jangan ganggu UI.
      console.warn('[usePolling] Refresh otomatis gagal:', error)
    } finally {
      inFlight = false
    }
  }

  const onVisibilityChange = () => {
    // Saat tab kembali terlihat, langsung segarkan sekali (tick tetap
    // menghormati isPaused dan request yang sedang berjalan).
    if (document.visibilityState === 'visible') tick()
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)
    timer = setInterval(tick, intervalMs)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
    timer = null
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return { tick }
}

export default usePolling
