import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'

const asArray = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  return []
}

export const normalizeSuratTugas = (item = {}) => {
  const normalized = {
    ...item,
    id_surat_tugas: item.id_surat_tugas ?? item.id ?? item.surat_tugas_id ?? null,
    id_kegiatan: item.id_kegiatan ?? item.kegiatan_id ?? item.kegiatan?.id_kegiatan ?? item.kegiatan?.id ?? null,
    nomor_surat: item.nomor_surat ?? item.no_surat ?? item.nomor ?? '',
    tanggal_surat: item.tanggal_surat ?? item.tanggal ?? item.tanggal_terbit ?? '',
    id_penandatangan: item.id_penandatangan ?? item.penandatangan_id ?? item.penandatangan?.id_pegawai ?? item.penandatangan?.id ?? null,
    status: String(item.status ?? 'draft').toLowerCase(),
    file_surat: item.file_surat ?? item.file ?? item.url_file ?? '',
    created_at: item.created_at ?? null,
    updated_at: item.updated_at ?? null
  }

  return normalized
}

export const normalizeSuratTugasPegawai = (item = {}) => {
  const normalized = {
    ...item,
    id: item.id ?? item.id_surat_tugas_pegawai ?? null,
    id_surat_tugas: item.id_surat_tugas ?? item.surat_tugas_id ?? item.surat_tugas?.id_surat_tugas ?? item.surat_tugas?.id ?? null,
    id_pegawai: item.id_pegawai ?? item.pegawai_id ?? item.pegawai?.id_pegawai ?? item.pegawai?.id ?? null,
    peran: item.peran ?? item.role ?? 'anggota_panitia'
  }

  return normalized
}

export const listSuratTugas = async () => {
  const result = await fetchAPI('surat-tugas')
  return asArray(result).map(normalizeSuratTugas)
}

export const listSuratTugasPegawai = async () => {
  const result = await fetchAPI('surat-tugas-pegawai')
  return asArray(result).map(normalizeSuratTugasPegawai)
}

export const createSuratTugas = async (payload) => {
  const result = await postAPI('surat-tugas', {
    ...payload,
    kegiatan_id: payload.id_kegiatan,
    penandatangan_id: payload.id_penandatangan
  })
  return normalizeSuratTugas(result)
}

export const editSuratTugas = async (id, payload) => {
  const result = await updateAPI('surat-tugas', id, {
    ...payload,
    kegiatan_id: payload.id_kegiatan,
    penandatangan_id: payload.id_penandatangan
  })
  return normalizeSuratTugas(result)
}

export const removeSuratTugas = async (id) => {
  return deleteAPI('surat-tugas', id)
}

export const createSuratTugasPegawai = async (payload) => {
  const result = await postAPI('surat-tugas-pegawai', {
    ...payload,
    surat_tugas_id: payload.id_surat_tugas,
    pegawai_id: payload.id_pegawai
  })
  return normalizeSuratTugasPegawai(result)
}

export const removeSuratTugasPegawai = async (id) => {
  return deleteAPI('surat-tugas-pegawai', id)
}

export default {
  normalizeSuratTugas,
  normalizeSuratTugasPegawai,
  listSuratTugas,
  listSuratTugasPegawai,
  createSuratTugas,
  editSuratTugas,
  removeSuratTugas,
  createSuratTugasPegawai,
  removeSuratTugasPegawai
}
