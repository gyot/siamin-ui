<template>
  <div class="w-full h-full">
    <RouterView />
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// data is now loaded on demand; components should call ensureDataLoaded()/loadDataFromAPI()
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  setup() {
    const auth = useAuthStore()
    const router = useRouter()
    let backButtonListener = null

    onMounted(() => {
      /* =========================
       * RESTORE AUTH (WAJIB)
       * ========================= */
      void auth.restoreAuth({ revalidate: false })

      /* Handle Android hardware back button */
      import('@capacitor/app').then(({ App }) => {
        backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            router.back()
          } else {
            if (router.currentRoute.value.path === '/') {
              App.exitApp()
            } else {
              router.push('/')
            }
          }
        })
      }).catch(() => {
        // Capacitor App plugin not available (web)
      })
    })

    onUnmounted(() => {
      if (backButtonListener && typeof backButtonListener.then === 'function') {
        backButtonListener.then((handle) => handle?.remove?.()).catch(() => {})
      } else if (backButtonListener && typeof backButtonListener.remove === 'function') {
        backButtonListener.remove()
      }
    })

    return {}
  }
}
</script>
