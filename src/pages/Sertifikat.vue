<template>
  <div class="p-6 bg-slate-50">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Manajemen Sertifikat</h1>
      <p class="text-slate-500">Kelola penerbitan sertifikat</p>
    </div>
    <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
      <p class="text-slate-600">Fitur manajemen sertifikat sedang dalam pengembangan</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ActivityEvents } from '@/services/activityLogger'

export default {
  name: 'Sertifikat',
  setup() {
    const currentUser = ref({ name: 'Admin' })
    
    // Log page access
    onMounted(() => {
      ActivityEvents.ACCESS_PAGE('Manajemen Sertifikat')
    })
    
    return { currentUser }
  }
}
</script>