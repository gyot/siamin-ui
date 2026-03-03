import { fetchAPI } from '@/services/api'

export const getKegiatanPeserta = (id) => {
  return fetchAPI(`kegiatan/tim/${id}`)
}

export default {
  getKegiatanPeserta
}
