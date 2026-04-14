/**
 * Activity Logger Service
 * Mencatat setiap aktivitas pengguna ke backend API
 */
import { postAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

/**
 * Log aktivitas ke backend
 * @param {string} action - Jenis aksi (login, logout, access_page, create, update, delete, export, dll)
 * @param {string} description - Deskripsi detail aktivitas
 * @param {object} metadata - Data tambahan (optional)
 */
export const logActivity = async (action, description, metadata = {}) => {
  try {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser
    const authToken = authStore.token || localStorage.getItem('auth_token')
    
    if (!currentUser) {
      console.warn('[ActivityLogger] No authenticated user')
      return
    }
    if (!authToken) {
      return
    }

    const payload = {
      id_pegawai: currentUser.id_pegawai || currentUser.id,
      aksi: action,
      deskripsi: description,
      metadata: JSON.stringify(metadata),
      ip_address: 'unknown',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }

    console.log('[ActivityLogger] Logging activity:', { action, description })
    
    const response = await postAPI('log-aktivitas', payload)
    console.log('[ActivityLogger] Activity logged successfully:', response)
    
    return response
  } catch (error) {
    const msg = String(error?.message || '')
    if (msg.includes('401') || msg.includes('403')) {
      return
    }
    console.error('[ActivityLogger] Error logging activity:', error)
    // Jangan throw error, hanya log ke console
    // Aktivitas seharusnya tetap berjalan meski logging gagal
  }
}

/**
 * Log common activities
 */
export const ActivityEvents = {
  // Authentication
  LOGIN: async (method = 'admin') => {
    return logActivity('LOGIN', `Berhasil login ke sistem SIMAIK sebagai ${method}`, { method })
  },
  
  LOGOUT: async () => {
    return logActivity('LOGOUT', 'Keluar dari sistem SIMAIK')
  },

  // Page Access
  ACCESS_PAGE: async (pageName) => {
    return logActivity('ACCESS_PAGE', `Membuka halaman ${pageName}`, { page: pageName })
  },

  // Dashboard
  VIEW_DASHBOARD: async () => {
    return logActivity('DASHBOARD_VIEW', 'Membuka dashboard', { page: 'dashboard' })
  },

  // Kegiatan
  VIEW_KEGIATAN_LIST: async () => {
    return logActivity('KEGIATAN_VIEW_LIST', 'Melihat daftar kegiatan')
  },

  VIEW_KEGIATAN_DETAIL: async (kegiatanId, kegiatanName) => {
    return logActivity('KEGIATAN_VIEW_DETAIL', `Melihat detail kegiatan: ${kegiatanName}`, { 
      id_kegiatan: kegiatanId,
      nama: kegiatanName
    })
  },

  CREATE_KEGIATAN: async (kegiatanName) => {
    return logActivity('KEGIATAN_CREATE', `Membuat kegiatan baru: ${kegiatanName}`, { 
      nama: kegiatanName 
    })
  },

  UPDATE_KEGIATAN: async (kegiatanId, kegiatanName) => {
    return logActivity('KEGIATAN_UPDATE', `Mengubah kegiatan: ${kegiatanName}`, { 
      id_kegiatan: kegiatanId,
      nama: kegiatanName
    })
  },

  DELETE_KEGIATAN: async (kegiatanId, kegiatanName) => {
    return logActivity('KEGIATAN_DELETE', `Menghapus kegiatan: ${kegiatanName}`, { 
      id_kegiatan: kegiatanId,
      nama: kegiatanName
    })
  },

  // Peserta
  VIEW_PESERTA_LIST: async () => {
    return logActivity('PESERTA_VIEW_LIST', 'Melihat daftar peserta')
  },

  CREATE_PESERTA: async (pesertaName, kegiatanName) => {
    return logActivity('PESERTA_CREATE', `Menambah peserta: ${pesertaName} ke kegiatan ${kegiatanName}`, { 
      nama: pesertaName,
      kegiatan: kegiatanName 
    })
  },

  UPDATE_PESERTA: async (pesertaName) => {
    return logActivity('PESERTA_UPDATE', `Mengubah data peserta: ${pesertaName}`, { 
      nama: pesertaName 
    })
  },

  DELETE_PESERTA: async (pesertaName) => {
    return logActivity('PESERTA_DELETE', `Menghapus peserta: ${pesertaName}`, { 
      nama: pesertaName 
    })
  },

  // Sertifikat
  VIEW_SERTIFIKAT: async () => {
    return logActivity('SERTIFIKAT_VIEW', 'Membuka halaman sertifikat')
  },

  CREATE_SERTIFIKAT: async (pesertaName, kegiatanName) => {
    return logActivity('SERTIFIKAT_CREATE', `Membuat sertifikat untuk ${pesertaName}`, { 
      peserta: pesertaName,
      kegiatan: kegiatanName
    })
  },

  // Pegawai
  VIEW_PEGAWAI: async () => {
    return logActivity('PEGAWAI_VIEW', 'Membuka halaman manajemen pegawai')
  },

  CREATE_PEGAWAI: async (pegawaiName, nip) => {
    return logActivity('PEGAWAI_CREATE', `Menambah pegawai baru: ${pegawaiName} (${nip})`, { 
      nama: pegawaiName,
      nip: nip 
    })
  },

  UPDATE_PEGAWAI: async (pegawaiName) => {
    return logActivity('PEGAWAI_UPDATE', `Mengubah data pegawai: ${pegawaiName}`, { 
      nama: pegawaiName 
    })
  },

  DELETE_PEGAWAI: async (pegawaiName, nip) => {
    return logActivity('PEGAWAI_DELETE', `Menghapus pegawai: ${pegawaiName} (${nip})`, { 
      nama: pegawaiName,
      nip: nip
    })
  },

  // Export
  EXPORT_DATA: async (dataType, format = 'xlsx') => {
    return logActivity('EXPORT_DATA', `Mengekspor data ${dataType} ke format ${format}`, { 
      tipe: dataType,
      format: format
    })
  },

  // Profile
  VIEW_PROFILE: async () => {
    return logActivity('PROFILE_VIEW', 'Membuka halaman profil')
  },

  EDIT_PROFILE: async (fields) => {
    return logActivity('PROFILE_EDIT', `Mengubah informasi profil: ${fields.join(', ')}`, { 
      fields: fields 
    })
  },

  CHANGE_PASSWORD: async () => {
    return logActivity('CHANGE_PASSWORD', 'Mengubah password')
  },

  // Surat Tugas
  VIEW_SURAT_TUGAS: async () => {
    return logActivity('SURAT_TUGAS_VIEW', 'Membuka halaman surat tugas')
  },

  CREATE_SURAT_TUGAS: async (nomorSurat) => {
    return logActivity('SURAT_TUGAS_CREATE', `Membuat surat tugas: ${nomorSurat}`, { 
      nomor_surat: nomorSurat
    })
  },

  // Import
  IMPORT_DATA: async (dataType, count) => {
    return logActivity('IMPORT_DATA', `Mengimpor ${count} data ${dataType}`, { 
      tipe: dataType,
      jumlah: count
    })
  },

  // Error handling
  ERROR_OCCURRED: async (errorMessage, errorPath) => {
    return logActivity('ERROR', `Terjadi error: ${errorMessage}`, { 
      pesan: errorMessage,
      lokasi: errorPath
    })
  }
}

export default ActivityEvents
