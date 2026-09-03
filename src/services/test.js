import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'

// ========================
// PUBLIC
// ========================

export const getPesertaByKegiatan = (idKegiatan, idTpk = null) => {
  const params = idTpk ? { id_tpk: idTpk } : {}
  return fetchAPI(`test/peserta/${idKegiatan}`, { params })
}

export const getPesertaDetail = (idPeserta) => {
  return fetchAPI(`test/peserta-detail/${idPeserta}`)
}

export const getPaketByKegiatan = (idKegiatan) => {
  return fetchAPI(`test/paket/${idKegiatan}`)
}

export const getSoalByPaket = (idPaketSoal) => {
  return fetchAPI(`test/soal/${idPaketSoal}`)
}

export const submitJawaban = (payload) => {
  return postAPI('test/submit', payload)
}

export const getHasil = (idPeserta, idPaketSoal) => {
  return fetchAPI(`test/hasil/${idPeserta}/${idPaketSoal}`)
}

export const getLaporanByKegiatan = (idKegiatan, params = {}) => {
  return fetchAPI(`test/laporan/${idKegiatan}`, { params })
}

export const getLaporanDetail = (idKegiatan, idPeserta, idPaketSoal) => {
  return fetchAPI(`test/laporan/${idKegiatan}/${idPeserta}/${idPaketSoal}`)
}

// ========================
// ADMIN: CRUD Paket Soal
// ========================

export const getAllPaket = (params = {}) => {
  return fetchAPI('test/paket-all', { params })
}

export const createPaket = (payload) => {
  return postAPI('test/paket', payload)
}

export const showPaket = (idPaketSoal) => {
  return fetchAPI(`test/paket-manage/${idPaketSoal}`)
}

export const updatePaket = (idPaketSoal, payload) => {
  return updateAPI('test/paket', idPaketSoal, payload)
}

export const removePaket = (idPaketSoal) => {
  return deleteAPI('test/paket', idPaketSoal)
}

// ========================
// ADMIN: CRUD Soal
// ========================

export const getSoalList = (idPaketSoal) => {
  return fetchAPI(`test/paket/${idPaketSoal}/soal`)
}

export const createSoal = (idPaketSoal, soalArray) => {
  return postAPI(`test/paket/${idPaketSoal}/soal`, { soal: soalArray })
}

export const updateSoal = (idSoal, payload) => {
  return updateAPI('test/soal', idSoal, payload)
}

export const removeSoal = (idSoal) => {
  return deleteAPI('test/soal', idSoal)
}

export const importSoal = (idPaketSoal, formData) => {
  return postAPI(`test/paket/${idPaketSoal}/import`, formData)
}

export const replaceSoal = (idPaketSoal, soalArray) => {
  return updateAPI('test/paket', `${idPaketSoal}/soal-replace`, { soal: soalArray })
}

export default {
  getPesertaByKegiatan,
  getPesertaDetail,
  getPaketByKegiatan,
  getSoalByPaket,
  submitJawaban,
  getHasil,
  getLaporanByKegiatan,
  getLaporanDetail,
  getAllPaket,
  createPaket,
  showPaket,
  updatePaket,
  removePaket,
  getSoalList,
  createSoal,
  updateSoal,
  removeSoal,
  importSoal,
  replaceSoal,
}
