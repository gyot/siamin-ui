import { fetchAPI, postAPI, updateAPI, deleteAPI } from '@/services/api'

const asArray = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  return []
}

const resolveKegiatanId = (item = {}) => (
  item.id_kegiatan
  ?? item.kegiatan_id
  ?? item.kegiatan?.id_kegiatan
  ?? item.kegiatan?.id
  ?? item.penugasan?.id_kegiatan
  ?? item.penugasan?.kegiatan?.id_kegiatan
  ?? item.penugasan?.kegiatan?.id
  ?? item.id_penugasan
  ?? item.penugasan_id
  ?? item.id_surat_tugas
  ?? item.surat_tugas_id
  ?? null
)

const normalizeKegiatan = (item = {}) => ({
  ...item,
  id_kegiatan: item.id_kegiatan ?? item.id ?? null,
  unit_kerja_id: item.unit_kerja_id ?? item.unit_kerja?.unit_kerja_id ?? item.unit_kerja?.id ?? null,
  nama_kegiatan: item.nama_kegiatan ?? item.nama ?? ''
})

const normalizePegawai = (item = {}) => ({
  ...item,
  id_pegawai: item.id_pegawai ?? item.id ?? null,
  nama: item.nama ?? item.name ?? '',
  nip: item.nip ?? ''
})

const normalizePenugasanBase = (item = {}) => {
  const idKegiatan = resolveKegiatanId(item)
  const kegiatan = item.kegiatan
    ? normalizeKegiatan(item.kegiatan)
    : (item.penugasan?.kegiatan ? normalizeKegiatan(item.penugasan.kegiatan) : null)

  return {
    ...item,
    id_penugasan: idKegiatan,
    id_surat_tugas: idKegiatan,
    id_kegiatan: idKegiatan,
    kegiatan,
    created_at: item.created_at ?? null,
    updated_at: item.updated_at ?? null
  }
}

const pickTimestamp = (rows = [], field, mode = 'max') => {
  const candidates = rows
    .map((item) => item?.[field])
    .filter(Boolean)
    .map((value) => {
      const time = new Date(value).getTime()
      return Number.isNaN(time) ? null : { raw: value, time }
    })
    .filter(Boolean)

  if (candidates.length === 0) return null

  const selected = candidates.reduce((best, current) => {
    if (!best) return current
    if (mode === 'min') return current.time < best.time ? current : best
    return current.time > best.time ? current : best
  }, null)

  return selected?.raw ?? null
}

export const normalizePenugasanPegawai = (item = {}) => {
  const base = normalizePenugasanBase(item)

  return {
    ...item,
    id: item.id ?? item.id_penugasan_pegawai ?? null,
    id_kegiatan: base.id_kegiatan,
    id_penugasan: base.id_penugasan,
    id_surat_tugas: base.id_surat_tugas,
    id_pegawai: item.id_pegawai ?? item.pegawai_id ?? item.pegawai?.id_pegawai ?? item.pegawai?.id ?? null,
    peran: item.peran ?? '',
    pegawai: item.pegawai ? normalizePegawai(item.pegawai) : null,
    kegiatan: base.kegiatan,
    penugasan: {
      ...base,
      penugasan_pegawais: undefined
    }
  }
}

export const normalizePenugasan = (item = {}) => {
  const base = normalizePenugasanBase(item)

  return {
    ...item,
    ...base,
    penugasan_pegawais: asArray(item.penugasan_pegawais).map(normalizePenugasanPegawai)
  }
}

export const groupPenugasanByKegiatan = (items = []) => {
  const grouped = new Map()

  asArray(items)
    .map(normalizePenugasanPegawai)
    .forEach((item) => {
      if (item.id_kegiatan === null || item.id_kegiatan === undefined || item.id_kegiatan === '') return

      const key = String(item.id_kegiatan)
      const current = grouped.get(key) || {
        id_kegiatan: item.id_kegiatan,
        kegiatan: item.kegiatan || null,
        members: []
      }

      if (!current.kegiatan && item.kegiatan) {
        current.kegiatan = item.kegiatan
      }

      current.members.push(item)
      grouped.set(key, current)
    })

  return Array.from(grouped.values())
    .map((group) => normalizePenugasan({
      id_kegiatan: group.id_kegiatan,
      kegiatan: group.kegiatan,
      created_at: pickTimestamp(group.members, 'created_at', 'min'),
      updated_at: pickTimestamp(group.members, 'updated_at', 'max'),
      penugasan_pegawais: group.members
    }))
    .sort((left, right) => {
      const leftTime = new Date(right?.updated_at || right?.created_at || 0).getTime()
      const rightTime = new Date(left?.updated_at || left?.created_at || 0).getTime()
      return leftTime - rightTime
    })
}

export const listPenugasanPegawai = async (filters = {}) => {
  const result = await fetchAPI('penugasan-pegawai', { params: filters })
  return asArray(result).map(normalizePenugasanPegawai)
}

export const getPenugasanPegawai = async (id) => {
  const result = await fetchAPI(`penugasan-pegawai/${id}`)
  return normalizePenugasanPegawai(result)
}

export const listPenugasan = async (filters = {}) => {
  const rows = await listPenugasanPegawai(filters)
  return groupPenugasanByKegiatan(rows)
}

export const getPenugasan = async (id) => {
  const rows = await listPenugasanPegawai({ id_kegiatan: id })
  const grouped = groupPenugasanByKegiatan(rows)
  return grouped.find((item) => String(item.id_kegiatan ?? '') === String(id ?? ''))
    || normalizePenugasan({ id_kegiatan: id, penugasan_pegawais: [] })
}

export const createPenugasan = async (payload = {}) => {
  const idKegiatan = payload.id_kegiatan ?? payload.kegiatan_id
  return normalizePenugasan({
    id_kegiatan: idKegiatan,
    kegiatan: payload.kegiatan ? normalizeKegiatan(payload.kegiatan) : null,
    penugasan_pegawais: []
  })
}

export const editPenugasan = async (id, payload = {}) => {
  const idKegiatan = payload.id_kegiatan ?? payload.kegiatan_id ?? id
  return normalizePenugasan({
    id_kegiatan: idKegiatan,
    kegiatan: payload.kegiatan ? normalizeKegiatan(payload.kegiatan) : null,
    penugasan_pegawais: []
  })
}

export const removePenugasan = async (id) => {
  const rows = await listPenugasanPegawai({ id_kegiatan: id })
  await Promise.all(
    rows
      .map((item) => item?.id)
      .filter((itemId) => itemId !== null && itemId !== undefined && itemId !== '')
      .map((itemId) => removePenugasanPegawai(itemId))
  )

  return {
    success: true,
    message: 'Deleted',
    deleted_count: rows.length
  }
}

export const createPenugasanPegawai = async (payload = {}) => {
  const requestBody = {
    id_kegiatan: payload.id_kegiatan ?? payload.kegiatan_id ?? payload.id_penugasan ?? payload.penugasan_id ?? payload.id_surat_tugas ?? payload.surat_tugas_id,
    id_pegawai: payload.id_pegawai ?? payload.pegawai_id
  }

  if (payload.peran) {
    requestBody.peran = payload.peran
  }

  const result = await postAPI('penugasan-pegawai', requestBody)
  return normalizePenugasanPegawai(result)
}

export const editPenugasanPegawai = async (id, payload = {}) => {
  const requestBody = {}

  if (payload.id_kegiatan ?? payload.kegiatan_id ?? payload.id_penugasan ?? payload.penugasan_id ?? payload.id_surat_tugas ?? payload.surat_tugas_id) {
    requestBody.id_kegiatan = payload.id_kegiatan ?? payload.kegiatan_id ?? payload.id_penugasan ?? payload.penugasan_id ?? payload.id_surat_tugas ?? payload.surat_tugas_id
  }

  if (payload.id_pegawai ?? payload.pegawai_id) {
    requestBody.id_pegawai = payload.id_pegawai ?? payload.pegawai_id
  }

  if (payload.peran !== undefined) {
    requestBody.peran = payload.peran
  }

  const result = await updateAPI('penugasan-pegawai', id, requestBody)
  return normalizePenugasanPegawai(result)
}

export const removePenugasanPegawai = async (id) => {
  return deleteAPI('penugasan-pegawai', id)
}

export default {
  normalizePenugasan,
  normalizePenugasanPegawai,
  groupPenugasanByKegiatan,
  listPenugasan,
  getPenugasan,
  listPenugasanPegawai,
  getPenugasanPegawai,
  createPenugasan,
  editPenugasan,
  removePenugasan,
  createPenugasanPegawai,
  editPenugasanPegawai,
  removePenugasanPegawai
}

export const getKetuaPanitia = async (idKegiatan) => {
  try {
    const data = await fetchAPI(`penugasan/ketua-panitia/${idKegiatan}`)
    return data || null
  } catch {
    return null
  }
}
