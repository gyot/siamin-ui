<template>
  <aside :class="[
    'fixed md:static left-0 top-0 h-full w-[280px] flex flex-col overflow-hidden transition-transform duration-300 ease-in-out z-40 bg-white border-r border-[#E4E6E9]',
    !isOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
  ]">
    <!-- Logo -->
    <div class="p-4 border-b border-[#E4E6E9] flex-shrink-0">
      <RouterLink to="/admin/dashboard" class="flex items-center gap-3" @click="handleClick">
        <div class="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-lg">S</span>
        </div>
        <div class="min-w-0">
          <h1 class="font-bold text-[#050505] text-sm">SIMAIK</h1>
          <p class="text-[11px] text-[#65676B]">v1.2.0</p>
        </div>
      </RouterLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
      <RouterLink 
        to="/admin/dashboard" 
        class="sidebar-item"
        @click="handleClick"
      >
        <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Dashboard</span>
      </RouterLink>
      <RouterLink 
        to="/admin/kegiatan" 
        class="sidebar-item"
        @click="handleClick"
      >
        <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Kegiatan</span>
      </RouterLink>
      <RouterLink
        v-if="canAccessPengesahan"
        to="/admin/pengesahan"
        class="sidebar-item"
        @click="handleClick"
      >
        <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Pengesahan</span>
      </RouterLink>

      <p class="px-3 pt-3 pb-1 text-[12px] font-semibold text-[#65676B] uppercase tracking-wider">Admin</p>
      <RouterLink 
        to="/admin/pegawai" 
        class="sidebar-item"
        @click="handleClick"
      >
        <div class="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 11h6M3 20h10v-2a3 3 0 00-10 0v2z"/>
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Pegawai & User</span>
      </RouterLink>
      <RouterLink 
        to="/admin/penugasan" 
        class="sidebar-item"
        @click="handleClick"
      >
        <div class="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6M7 21h10" />
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Penugasan</span>
      </RouterLink>
      <RouterLink 
        to="/admin/paket-soal" 
        class="sidebar-item"
        @click="handleClick"
      >
        <div class="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Paket Soal</span>
      </RouterLink>
      <RouterLink 
        to="/admin/laporan-kegiatan" 
        class="sidebar-item"
        @click="handleClick"
      >
        <div class="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Laporan Kegiatan</span>
      </RouterLink>
    </nav>

    <!-- Portal Peserta (admin only) -->
    <template v-if="userRole === 'admin'">
      <div class="px-3 pt-2 pb-1">
        <p class="text-[12px] font-semibold text-[#65676B] uppercase tracking-wider">Portal Peserta</p>
      </div>
      <nav class="px-3 space-y-0.5">
        <RouterLink to="/peserta/dashboard" class="sidebar-item" @click="handleClick">
          <div class="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <span class="text-[15px] font-medium text-[#050505]">Dashboard Peserta</span>
        </RouterLink>
        <RouterLink to="/peserta/kegiatan" class="sidebar-item" @click="handleClick">
          <div class="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-[15px] font-medium text-[#050505]">Kegiatan Saya</span>
        </RouterLink>
      </nav>
    </template>

    <!-- Footer -->
    <div class="p-3 border-t border-[#E4E6E9] flex-shrink-0">
      <button @click="handleLogout" class="sidebar-item w-full">
        <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </div>
        <span class="text-[15px] font-medium text-[#050505]">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    userRole: {
      type: String,
      default: 'operator'
    },
    canAccessPengesahan: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('close')
    },
    async handleLogout() {
      const auth = useAuthStore()
      await auth.logout()
      const router = useRouter()
      router.push('/login')
    }
  }
}
</script>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background-color: #E4E6E9;
}

.sidebar-item.router-link-active {
  background-color: #E7F3FF;
}

.sidebar-item.router-link-active .w-9 {
  background-color: #1877F2;
}

.sidebar-item.router-link-active .w-9 svg {
  color: white;
}
</style>

