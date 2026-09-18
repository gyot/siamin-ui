import { fetchAPI, postAPI } from '@/services/api'

export const getLaporanDraft = async (idKegiatan) => {
  try {
    const response = await fetchAPI(`laporan/${idKegiatan}/draft`)
    return response || null
  } catch {
    return null
  }
}

export const saveLaporanDraft = async (idKegiatan, data) => {
  const response = await postAPI(`laporan/${idKegiatan}/draft`, { data })
  return response?.data || null
}

export const getJadwal = async (idKegiatan) => {
  try {
    const response = await fetchAPI(`laporan/${idKegiatan}/jadwal`)
    return response || { jadwal_per_kelas: [], jadwal_harian: [], kelas: [] }
  } catch {
    return { jadwal_per_kelas: [], jadwal_harian: [], kelas: [] }
  }
}

export const saveJadwal = async (idKegiatan, jadwal) => {
  const response = await postAPI(`laporan/${idKegiatan}/jadwal`, { jadwal })
  return response?.data || null
}

export default {
  getLaporanDraft,
  saveLaporanDraft,
  getJadwal,
  saveJadwal,
}
