// Data Sync Utility
import database, { loadDataFromAPI, loadAllDataFromAPI } from '@/data/index.js'
import { apiClient } from '@/services/api'

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

  console.group('Data Sync Status')
  console.log(`Last update: ${status.timestamp}`)
  console.table(status.tables)
  console.groupEnd()

  return status
}

/**
 * Force sync all data from API
 */
export const forceSyncAllData = async () => {
  console.log('Starting force sync from API...')

  try {
    await loadAllDataFromAPI()
    const status = printDataSyncStatus()
    console.log('Force sync completed successfully')
    return status
  } catch (error) {
    console.error('Force sync failed:', error)
    throw error
  }
}

/**
 * Force sync specific table
 */
export const forceSyncTable = async (tableName) => {
  console.log(`Syncing table: ${tableName}`)

  try {
    const data = await loadDataFromAPI(tableName)
    console.log(`Table '${tableName}' synced. Count: ${data.length}`)
    return data
  } catch (error) {
    console.error(`Failed to sync table '${tableName}':`, error)
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
  console.log('Verifying API connection...')

  try {
    await apiClient.get('users')
    console.log('API is connected and responding')
    return true
  } catch (error) {
    const status = error?.response?.status
    if (status) {
      console.warn(`API responded with status ${status}`)
      return false
    }
    console.error('API connection failed:', error.message)
    return false
  }
}

/**
 * Full diagnostic check
 */
export const runDiagnostics = async () => {
  console.group('Running Data Sync Diagnostics')

  console.log('\n1. Checking API Connection...')
  const apiConnected = await verifyAPIConnection()

  console.log('\n2. Current Data Status:')
  const status = printDataSyncStatus()

  if (apiConnected) {
    console.log('\n3. Attempting Force Sync...')
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
