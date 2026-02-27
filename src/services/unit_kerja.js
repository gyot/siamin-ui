import { fetchAPI } from '@/services/api'

export const getUnitKerja = () => {
  return fetchAPI(`unit-kerja/`)
}

export default {
  getUnitKerja
}
