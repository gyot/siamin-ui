import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getHakAksesSaya, DEFAULT_MENUS } from '@/services/hakAkses'

/**
 * State hak akses menu user yang sedang login (dari GET /api/v1/hak-akses/saya).
 *
 * Prinsip:
 * - `loaded = true` berarti state sudah "menetap" (berhasil ATAU sudah jatuh ke
 *   fallback) — navigasi tidak boleh menunggu request berulang kali.
 * - Saat request GAGAL, state jatuh ke menu DEFAULT (dashboard, kegiatan,
 *   pegawai-user, penugasan, laporan-kegiatan) supaya sidebar tidak kosong,
 *   dan `fromFallback = true` supaya halaman/sidebar bisa memicu refresh.
 */
export const useHakAksesStore = defineStore('hakAkses', () => {
  const menus = ref([])
  const superAdmin = ref(false)
  const loaded = ref(false)
  const loading = ref(false)
  const fromFallback = ref(false)
  let loadPromise = null

  const reset = () => {
    menus.value = []
    superAdmin.value = false
    loaded.value = false
    loading.value = false
    fromFallback.value = false
    loadPromise = null
  }

  /**
   * Ambil hak akses user yang sedang login.
   * @param {{force?: boolean}} [opts] - force=true memaksa fetch ulang
   */
  const load = async ({ force = false } = {}) => {
    if (loadPromise) return loadPromise
    if (loaded.value && !force) return

    loadPromise = (async () => {
      loading.value = true
      try {
        const data = await getHakAksesSaya()
        menus.value = Array.isArray(data?.menus) ? data.menus : []
        superAdmin.value = !!data?.super_admin
        fromFallback.value = false
      } catch (err) {
        // Backend tidak tersedia / gagal: pakai menu default agar aplikasi
        // tetap bisa dipakai, dan tandai sebagai fallback.
        console.warn('[HakAkses] Gagal memuat hak akses, memakai menu default:', err)
        menus.value = [...DEFAULT_MENUS]
        superAdmin.value = false
        fromFallback.value = true
      } finally {
        loading.value = false
        loaded.value = true
        loadPromise = null
      }
    })()

    return loadPromise
  }

  /**
   * Apakah user boleh melihat/membuka menu dengan kunci tertentu?
   * Super admin boleh membuka semua menu.
   * @param {string} key - kunci menu (lihat MENU_OPTIONS di services/hakAkses)
   */
  const hasMenu = (key) => {
    if (!key) return true
    if (superAdmin.value) return true
    return menus.value.includes(key)
  }

  const isSuperAdmin = computed(() => superAdmin.value)

  return {
    menus,
    superAdmin,
    loaded,
    loading,
    fromFallback,
    isSuperAdmin,
    reset,
    load,
    hasMenu
  }
})
