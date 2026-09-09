<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-emerald-900/30 bg-slate-950 text-white transition-transform duration-300 md:static md:translate-x-0',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="border-b border-white/10 p-6">
      <RouterLink to="/peserta/dashboard" class="flex items-center gap-3" @click="$emit('close')">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-black">S</div>
        <div>
          <p class="font-bold tracking-wide">SIMAIK</p>
          <p class="text-xs text-emerald-300">Portal Peserta</p>
        </div>
      </RouterLink>
    </div>

    <nav class="flex-1 space-y-2 p-4">
      <RouterLink to="/peserta/dashboard" class="participant-nav" @click="$emit('close')">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-2 2v7a2 2 0 01-2 2H9a2 2 0 01-2-2v-7" />
        </svg>
        Dashboard
      </RouterLink>
      <RouterLink to="/peserta/kegiatan" class="participant-nav" @click="$emit('close')">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Kegiatan
      </RouterLink>
    </nav>

    <div class="border-t border-white/10 p-4">
      <button class="participant-nav w-full" type="button" @click="handleLogout">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  emit('close')
  await authStore.logout()
  router.replace('/login-peserta')
}
</script>

<style scoped>
.participant-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  transition: 0.2s ease;
}

.participant-nav:hover,
.participant-nav.router-link-active {
  background: rgba(16, 185, 129, 0.16);
  color: #6ee7b7;
}
</style>
