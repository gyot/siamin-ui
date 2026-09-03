import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'

export const getKelasByKegiatan = (idKegiatan) => {
  return fetchAPI(`kelas/${idKegiatan}`)
}

export const createKelas = (payload) => {
  return postAPI('kelas', payload)
}

export const showKelas = (idKelas) => {
  return fetchAPI(`kelas-detail/${idKelas}`)
}

export const updateKelas = (idKelas, payload) => {
  return updateAPI('kelas', idKelas, payload)
}

export const removeKelas = (idKelas) => {
  return deleteAPI('kelas', idKelas)
}

export const addAnggotaKelas = (idKelas, idPeserta) => {
  return postAPI(`kelas/${idKelas}/anggota`, { id_peserta: idPeserta })
}

export const removeAnggotaKelas = (idKelas, idPeserta) => {
  return deleteAPI(`kelas/${idKelas}/anggota`, idPeserta)
}

export default {
  getKelasByKegiatan,
  createKelas,
  showKelas,
  updateKelas,
  removeKelas,
  addAnggotaKelas,
  removeAnggotaKelas,
}
