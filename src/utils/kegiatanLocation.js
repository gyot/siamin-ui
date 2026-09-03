const normalizeText = (value) => {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

const parseRowsCandidate = (candidate) => {
  if (!candidate) return []
  if (Array.isArray(candidate)) return candidate
  if (Array.isArray(candidate?.data)) return candidate.data

  if (typeof candidate === 'string') {
    const value = candidate.trim()
    if (!value) return []

    try {
      return parseRowsCandidate(JSON.parse(value))
    } catch {
      return []
    }
  }

  return []
}

const getFallbackKabupatenKota = (item) => normalizeText(
  item?.kabupaten_kota
    ?? item?.kab_kota
    ?? item?.kabupaten
    ?? item?.kota
    ?? item?.lokasi_kabupaten_kota
    ?? item?.kegiatan?.kabupaten_kota
    ?? item?.kegiatan?.kab_kota
)

export const normalizeTpkItem = (item = {}) => ({
  id_tpk: item?.id_tpk ?? item?.id ?? null,
  lokasi: normalizeText(
    item?.lokasi
      ?? item?.nama_lokasi
      ?? item?.tempat
      ?? item?.nama_tempat
      ?? item?.tpk
      ?? item?.location
  ),
  kabupaten_kota: normalizeText(
    item?.kabupaten_kota
      ?? item?.kab_kota
      ?? item?.kabupaten
      ?? item?.kota
      ?? item?.lokasi_kabupaten_kota
  )
})

export const getKegiatanTpkRows = (item) => {
  const candidates = [
    item?.daftar_tpk,
    item?.daftarTpk,
    item?.data?.daftar_tpk,
    item?.data?.daftarTpk
  ]

  for (const candidate of candidates) {
    const rows = parseRowsCandidate(candidate)
    if (rows.length > 0) return rows
  }

  const fallbackLocation = normalizeText(
    item?.lokasi
      ?? item?.lokasi_kegiatan
      ?? item?.tempat
      ?? item?.kegiatan?.lokasi
  )

  if (fallbackLocation) {
    return [{
      lokasi: fallbackLocation,
      kabupaten_kota: getFallbackKabupatenKota(item)
    }]
  }

  return []
}

export const getKegiatanLocationItems = (item) =>
  getKegiatanTpkRows(item)
    .map(normalizeTpkItem)
    .filter((row) => row.lokasi)

export const getKegiatanLocationLabel = (item) => {
  const locations = getKegiatanLocationItems(item)
    .map((row) => row.kabupaten_kota
      ? `${row.lokasi} (${row.kabupaten_kota})`
      : row.lokasi)

  return locations.join(', ') || '-'
}

export const getKegiatanKabupatenKotaLabel = (item) => {
  const kabupatenKota = getKegiatanLocationItems(item)
    .map((row) => row.kabupaten_kota)
    .filter(Boolean)

  const uniqueKabupatenKota = Array.from(new Set(kabupatenKota))
  return uniqueKabupatenKota.join(', ') || getFallbackKabupatenKota(item) || '-'
}
