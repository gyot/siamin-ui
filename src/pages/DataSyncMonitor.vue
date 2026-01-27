<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">🔄 Data Sync Monitor</h1>
        <p class="text-slate-300">Check and manage API data synchronization</p>
      </div>

      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <!-- API Connection -->
        <div :class="['p-6 rounded-lg border-2', syncStatus.apiConnected ? 'bg-green-900 border-green-500' : 'bg-red-900 border-red-500']">
          <div class="flex items-center mb-2">
            <span class="text-2xl mr-3">🔗</span>
            <h3 class="text-lg font-bold text-white">API Connection</h3>
          </div>
          <p :class="syncStatus.apiConnected ? 'text-green-200' : 'text-red-200'">
            {{ syncStatus.apiConnected ? '✅ Connected' : '❌ Disconnected' }}
          </p>
        </div>

        <!-- Last Sync -->
        <div class="p-6 rounded-lg bg-blue-900 border-2 border-blue-500">
          <div class="flex items-center mb-2">
            <span class="text-2xl mr-3">⏱️</span>
            <h3 class="text-lg font-bold text-white">Last Sync</h3>
          </div>
          <p class="text-blue-200 text-sm">
            {{ syncStatus.timestamp ? new Date(syncStatus.timestamp).toLocaleString('id-ID') : 'Never' }}
          </p>
        </div>
      </div>

      <!-- Data Tables Status -->
      <div class="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-6">📊 Data Tables Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div 
            v-for="(status, table) in syncStatus.tables" 
            :key="table"
            :class="['p-4 rounded border', status.count > 0 ? 'bg-emerald-900 border-emerald-500' : 'bg-yellow-900 border-yellow-500']"
          >
            <div class="font-semibold text-white capitalize">{{ formatTableName(table) }}</div>
            <div :class="status.count > 0 ? 'text-emerald-200' : 'text-yellow-200'">
              {{ status.count > 0 ? '✅' : '⚠️' }} {{ status.count }} records
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="syncStatus.lastError" class="bg-red-900 border-2 border-red-500 rounded-lg p-4 mb-8">
        <p class="text-red-200 font-semibold">❌ Error: {{ syncStatus.lastError }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 flex-wrap">
        <button
          @click="syncAllData"
          :disabled="syncStatus.syncing"
          :class="['px-6 py-3 rounded-lg font-semibold transition', syncStatus.syncing ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white']"
        >
          {{ syncStatus.syncing ? '⏳ Syncing...' : '🔄 Sync All Data' }}
        </button>

        <button
          @click="loadStatus"
          :disabled="syncStatus.syncing"
          :class="['px-6 py-3 rounded-lg font-semibold transition', syncStatus.syncing ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-700 text-white']"
        >
          🔍 Refresh Status
        </button>

        <button
          @click="openConsole"
          class="px-6 py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white transition"
        >
          💻 Open Console
        </button>
      </div>

      <!-- Console Output -->
      <div class="mt-8 bg-black rounded-lg p-6 font-mono text-sm text-green-400 max-h-96 overflow-y-auto border border-slate-700">
        <div v-if="consoleOutput.length === 0" class="text-slate-500">
          Check browser console (F12) for detailed logs...
        </div>
        <div v-else>
          <div v-for="(line, idx) in consoleOutput" :key="idx" class="mb-1">
            > {{ line }}
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="mt-8 bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h3 class="text-lg font-bold text-white mb-3">ℹ️ Info</h3>
        <ul class="text-slate-300 space-y-2 text-sm">
          <li>✅ Green tables = Data synced from API</li>
          <li>⚠️ Yellow tables = No data (check API)</li>
          <li>🔗 Connected = API is reachable</li>
          <li>API URL: <code class="bg-slate-800 px-2 py-1 rounded">http://127.0.0.1:8000/api/v1</code></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDateSyncMonitor } from '@/composables/useDateSyncMonitor'
import { ref } from 'vue'

const { syncStatus, loadStatus, syncAllData: syncData } = useDateSyncMonitor()
const consoleOutput = ref([])

const formatTableName = (name) => {
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const syncAllData = async () => {
  consoleOutput.value.push(`[${new Date().toLocaleTimeString()}] Starting sync...`)
  await syncData()
  consoleOutput.value.push(`[${new Date().toLocaleTimeString()}] Sync completed`)
}

const openConsole = () => {
  // Trigger browser dev tools
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault()
      window.open('about:blank')
    }
  })
  alert('Press F12 to open Developer Tools and check Console tab')
}
</script>
