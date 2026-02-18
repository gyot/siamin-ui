// Data Sync Utility
import database, { loadDataFromAPI, loadAllDataFromAPI } from '@/data/index.js'

/**
 * Sync status checker
 */
export const getDataSyncStatus = () => {
  const status = {
    timestamp: new Date().toISOString(),
    tables: {}
  }

  const tables = Object.keys(database)
  
  for (const table of tables) {
    status.tables[table] = {
      count: Array.isArray(database[table]) ? database[table].length : 0,
      synced: Array.isArray(database[table]) && database[table].length > 0
    }
  }

  return status
}

/**
 * Print sync status to console
 */
export const printDataSyncStatus = () => {
  const status = getDataSyncStatus()
  
  console.group('📊 Data Sync Status')
  console.log(`Last update: ${status.timestamp}`)
  console.table(status.tables)
  console.groupEnd()
  
  return status
}

/**
 * Force sync all data from API
 */
export const forceSyncAllData = async () => {
  console.log('🔄 Starting force sync from API...')
  
  try {
    await loadAllDataFromAPI()
    const status = printDataSyncStatus()
    console.log('✅ Force sync completed successfully')
    return status
  } catch (error) {
    console.error('❌ Force sync failed:', error)
    throw error
  }
}

/**
 * Force sync specific table
 */
export const forceSyncTable = async (tableName) => {
  console.log(`🔄 Syncing table: ${tableName}`)
  
  try {
    const data = await loadDataFromAPI(tableName)
    console.log(`✅ Table '${tableName}' synced. Count: ${data.length}`)
    return data
  } catch (error) {
    console.error(`❌ Failed to sync table '${tableName}':`, error)
    throw error
  }
}

/**
 * Get count of data in each table
 */
export const getDataCounts = () => {
  const counts = {}
  
  for (const [table, data] of Object.entries(database)) {
    counts[table] = Array.isArray(data) ? data.length : 0
  }
  
  return counts
}

/**
 * Verify API connection
 */
export const verifyAPIConnection = async () => {
  console.log('🔗 Verifying API connection...')
  
  try {
    const response = await fetch('http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      console.log('✅ API is connected and responding')
      return true
    } else {
      console.warn(`⚠️ API responded with status ${response.status}`)
      return false
    }
  } catch (error) {
    console.error('❌ API connection failed:', error.message)
    return false
  }
}

/**
 * Full diagnostic check
 */
export const runDiagnostics = async () => {
  console.group('🔧 Running Data Sync Diagnostics')
  
  // 1. Check API connection
  console.log('\n1️⃣ Checking API Connection...')
  const apiConnected = await verifyAPIConnection()
  
  // 2. Check current data
  console.log('\n2️⃣ Current Data Status:')
  const status = printDataSyncStatus()
  
  // 3. Try force sync if API is connected
  if (apiConnected) {
    console.log('\n3️⃣ Attempting Force Sync...')
    try {
      await forceSyncAllData()
    } catch (error) {
      console.warn('Force sync failed, will use local fallback')
    }
  }
  
  console.groupEnd()
  
  return {
    apiConnected,
    status
  }
}

export default {
  getDataSyncStatus,
  printDataSyncStatus,
  forceSyncAllData,
  forceSyncTable,
  getDataCounts,
  verifyAPIConnection,
  runDiagnostics
}
