<template>
  <div class="flex h-full min-h-screen bg-slate-50">
    <PesertaSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <div class="flex min-w-0 items-center gap-3">
          <button type="button" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" @click="sidebarOpen = true">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="truncate text-lg font-bold text-slate-800">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <p class="text-sm font-semibold text-slate-800">{{ currentUser.name }}</p>
            <p class="text-xs text-slate-500">Peserta</p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
            {{ initial }}
          </div>
        </div>
      </header>

      <main class="min-w-0 flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>

    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-slate-950/60 md:hidden" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PesertaSidebar from '@/components/PesertaSidebar.vue'

const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const currentUser = computed(() => authStore.currentUser || {})
const pageTitle = computed(() => route.meta.title || 'Portal Peserta')
const initial = computed(() => String(currentUser.value.name || 'P').trim().charAt(0).toUpperCase())
</script>
