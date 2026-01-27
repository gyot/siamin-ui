<template>
  <div class="w-full h-full">
    <RouterView/>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { dataReady } from '@/data/index.js'

export default {
  name: 'App',
  setup() {
    // Don't block rendering - load data in background
    onMounted(() => {
      console.log('[App] Loading data in background (non-blocking)...')
      dataReady
        .then(() => {
          console.log('[App] ✅ Background data load complete')
        })
        .catch(err => {
          console.warn('[App] ⚠️ Background data load failed (non-critical):', err.message)
          // This is non-blocking, so we don't care if it fails
          // Login pages don't need this data
        })
    })

    return {}
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: #f1f5f9;
}

*::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
</style>

