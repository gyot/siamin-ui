
<template>
  <div class="min-h-screen bg-[#F0F2F5]">
    <!-- Mobile Header -->
    <div class="md:hidden bg-white border-b border-[#E4E6E9] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <h1 class="font-bold text-[#050505]">SIMAIK</h1>
      <button @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-[#E4E6E9] rounded-lg transition">
        <svg v-if="!sidebarOpen" class="w-6 h-6 text-[#65676B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-6 h-6 text-[#65676B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Desktop: Facebook-style 3-column centered layout -->
    <div class="hidden md:flex justify-center min-h-screen">
      <!-- Left Sidebar (fixed width) -->
      <div class="w-[280px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Sidebar :is-open="true" :user-role="currentUser.role" :can-access-pengesahan="isKepala" @close="sidebarOpen = false"/>
      </div>

      <!-- Center Content -->
      <div class="flex-1 min-w-0 max-w-[880px]">
        <Header :title="pageTitle" />
        <main>
          <RouterView/>
        </main>
      </div>
    </div>

    <!-- Mobile: Sidebar overlay + content -->
    <div class="md:hidden">
      <Sidebar :is-open="sidebarOpen" :user-role="currentUser.role" :can-access-pengesahan="isKepala" @close="sidebarOpen = false"/>
      <div class="flex flex-col min-h-screen">
        <Header :title="pageTitle" />
        <main class="flex-1 overflow-auto">
          <RouterView/>
        </main>
      </div>
      <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/50 z-30"/>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  components: {
    Sidebar,
    Header
  },
  data() {
    return {
      pageTitle: 'Dashboard',
      currentUser: { name: 'Admin', email: 'admin@simaik.com', role: 'admin' },
      sidebarOpen: false
    }
  },
  created() {
    try {
      const auth = useAuthStore()
      if (auth && auth.currentUser) {
        this.currentUser = (auth.currentUser && auth.currentUser.value) ? auth.currentUser.value : auth.currentUser
      }
    } catch (e) {
      console.debug('Auth store not available in AdminLayout.created', e)
    }
  },
  computed: {
    authCurrentUser() {
      try {
        const auth = useAuthStore()
        return (auth && auth.currentUser && auth.currentUser.value) ? auth.currentUser.value : auth.currentUser
      } catch (e) {
        return this.currentUser
      }
    },
    isKepala() {
      try { return useAuthStore().isKepala } catch { return false }
    }
  },
  watch: {
    '$route': function() {
      const titleMap = {
        'dashboard': 'Dashboard',
        'kegiatan': 'Manajemen Kegiatan',
        'kegiatan-peserta': 'Peserta Kegiatan',
        'peserta': 'Manajemen Peserta',
        'sertifikat': 'Manajemen Sertifikat',
        'pengesahan': 'Pengesahan',
        'pegawai': 'Manajemen Pegawai & User'
      }
      this.pageTitle = titleMap[this.$route.name] || 'Dashboard'
      this.sidebarOpen = false
    }
  }
}
</script>

<style scoped>
</style>

