<template>
  <div class="w-full h-full">
    <RouterView />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { dataReady } from '@/data/index.js'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  setup() {
    const auth = useAuthStore()

    onMounted(() => {
      /* =========================
       * RESTORE AUTH (WAJIB)
       * ========================= */
      auth.restoreAuth()

      /* =========================
       * BACKGROUND DATA LOAD
       * ========================= */
      console.log('[App] Loading data in background (non-blocking)...')
      dataReady
        .then(() => {
          console.log('[App] ✅ Background data load complete')
        })
        .catch(err => {
          console.warn(
            '[App] ⚠️ Background data load failed (non-critical):',
            err.message
          )
        })
    })

    return {}
  }
}
</script>