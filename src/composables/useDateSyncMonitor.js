// Composable untuk monitoring data sync
import { ref, reactive, onMounted } from 'vue'
import { 
  getDataSyncStatus, 
  verifyAPIConnection, 
  forceSyncAllData, 
  forceSyncTable 
} from '@/services/dataSyncUtils'

export const useDateSyncMonitor = () => {
  const syncStatus = reactive({
    timestamp: null,
    tables: {},
    apiConnected: false,
    syncing: false,
    lastError: null
  })

  const loadStatus = async () => {
    try {
      const status = getDataSyncStatus()
      syncStatus.timestamp = status.timestamp
      syncStatus.tables = status.tables
      syncStatus.apiConnected = await verifyAPIConnection()
      syncStatus.lastError = null
    } catch (error) {
      syncStatus.lastError = error.message
    }
  }

  const syncAllData = async () => {
    syncStatus.syncing = true
    try {
      await forceSyncAllData()
      await loadStatus()
      syncStatus.lastError = null
    } catch (error) {
      syncStatus.lastError = error.message
    } finally {
      syncStatus.syncing = false
    }
  }

  const syncTable = async (tableName) => {
    syncStatus.syncing = true
    try {
      await forceSyncTable(tableName)
      await loadStatus()
      syncStatus.lastError = null
    } catch (error) {
      syncStatus.lastError = error.message
    } finally {
      syncStatus.syncing = false
    }
  }

  onMounted(async () => {
    await loadStatus()
  })

  return {
    syncStatus,
    loadStatus,
    syncAllData,
    syncTable
  }
}

export default useDateSyncMonitor
