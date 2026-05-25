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
  console.table(status.tables)
  console.groupEnd()

  return status
}

/**
 * Force sync all data from API
 */
export const forceSyncAllData = async () => {

  try {
    await loadAllDataFromAPI()
    const status = printDataSyncStatus()
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

  try {
    const data = await loadDataFromAPI(tableName)
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

  try {
    await apiClient.get('users')
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

  const apiConnected = await verifyAPIConnection()

  const status = printDataSyncStatus()

  if (apiConnected) {
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
