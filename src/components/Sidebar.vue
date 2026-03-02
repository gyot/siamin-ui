<template>
  <aside :class="[
    'fixed lg:static left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out z-40',
    !isOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
  ]">
    <!-- Logo -->
    <div class="p-4 sm:p-6 border-b border-slate-200 flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="min-w-0">
          <h1 class="font-bold text-slate-800 truncate text-sm sm:text-base">SIMAIK</h1>
          <p class="text-xs text-slate-500 truncate">v1.2.0</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
      <RouterLink 
        to="/admin/dashboard" 
        class="sidebar-item"
        @click="handleClick"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span class="truncate text-sm">Dashboard</span>
      </RouterLink>
      <RouterLink 
        to="/admin/kegiatan" 
        class="sidebar-item"
        @click="handleClick"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="truncate text-sm">Kegiatan</span>
      </RouterLink>
      <RouterLink 
        to="/admin/peserta" 
        class="sidebar-item"
        @click="handleClick"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        <span class="truncate text-sm">Peserta</span>
      </RouterLink>
      <!-- <RouterLink 
        to="/admin/surat-tugas" 
        class="sidebar-item"
        @click="handleClick"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="truncate text-sm">Surat Tugas</span>
      </RouterLink> -->
      <!-- <RouterLink 
        to="/admin/sertifikat" 
        class="sidebar-item"
        @click="handleClick"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
        <span class="truncate text-sm">Sertifikat</span>
      </RouterLink> -->

      <!-- Admin Only Menu -->
      <!-- <div v-if="userRole === 'admin'" class="pt-2 mt-2 border-t border-slate-100">
        <p class="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</p>
        <RouterLink 
          to="/admin/pegawai" 
          class="sidebar-item"
          @click="handleClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 11h6M3 20h10v-2a3 3 0 00-10 0v2z"/>
          </svg>
          <span class="truncate text-sm">Pegawai & User</span>
        </RouterLink>
        <RouterLink 
          to="/admin/unit-kerja" 
          class="sidebar-item"
          @click="handleClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m5.581 0a2 2 0 100-4 2 2 0 000 4zM9 7h1v1H9V7zm4 0h1v1h-1V7zM9 11h1v1H9v-1zm4 0h1v1h-1v-1z"/>
          </svg>
          <span class="truncate text-sm">Unit Kerja</span>
        </RouterLink>
        <RouterLink 
          to="/admin/anggota" 
          class="sidebar-item"
          @click="handleClick"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
          <span class="truncate text-sm">Anggota Tim</span>
        </RouterLink>
      </div> -->
    </nav>

    <!-- Footer -->
    <div class="p-3 sm:p-4 border-t border-slate-200 flex-shrink-0">
      <button class="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition text-sm">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span class="truncate">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script>
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
    }
  },
  methods: {
    handleClick() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.sidebar-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.sidebar-item.router-link-active {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%);
  border-left: 3px solid #3b82f6;
  color: #1e3a8a;
  font-weight: 500;
  padding-left: calc(1rem - 3px);
}

@media (max-width: 1023px) {
  aside {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }
}
</style>

