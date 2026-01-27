
<template>
  <div class="h-full w-full flex flex-col lg:flex-row bg-slate-50">
    <!-- Mobile Header with Toggle -->
    <div class="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <h1 class="font-bold text-slate-800">SIAMIN</h1>
      <button 
        @click="sidebarOpen = !sidebarOpen"
        class="p-2 hover:bg-slate-100 rounded-lg transition"
      >
        <svg v-if="!sidebarOpen" class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" :user-role="currentUser.role" @close="sidebarOpen = false"/>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <Header :title="pageTitle" :currentUser="currentUser"/>
      
      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <RouterView/>
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
    />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

export default {
  components: {
    Sidebar,
    Header
  },
  data() {
    return {
      pageTitle: 'Dashboard',
      currentUser: {
        name: 'Admin',
        email: 'admin@siamin.com',
        role: 'admin'
      },
      sidebarOpen: false
    }
  },
  watch: {
    '$route': function() {
      // Update title based on current route
      const titleMap = {
        'dashboard': 'Dashboard',
        'kegiatan': 'Manajemen Kegiatan',
        'kegiatan-peserta': 'Peserta Kegiatan',
        'peserta': 'Manajemen Peserta',
        'sertifikat': 'Manajemen Sertifikat',
        'pegawai': 'Manajemen Pegawai & User'
      }
      const routeName = this.$route.name
      this.pageTitle = titleMap[routeName] || 'Dashboard'
      // Close sidebar when route changes
      this.sidebarOpen = false
    }
  }
}
</script>

<style scoped>
</style>

