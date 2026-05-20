<template>
  <div class="w-full h-full">
    <RouterView />
  </div>
</template>

<script>
import { onMounted } from 'vue'
// data is now loaded on demand; components should call ensureDataLoaded()/loadDataFromAPI()
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  setup() {
    const auth = useAuthStore()

    onMounted(() => {
      /* =========================
       * RESTORE AUTH (WAJIB)
       * ========================= */
      void auth.restoreAuth({ revalidate: false })

      /* Previously the app would eagerly load every table when mounted.  
         That's been removed to keep startup fast.  data.ts now exposes
         `ensureDataLoaded()` if you really need to prime the cache; most
         pages just call `loadDataFromAPI('kegiatan')` or similar when they
         render. */
    })

    return {}
  }
}
</script>
