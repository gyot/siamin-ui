const STORAGE_KEY = 'siamik_activity_report_drafts_v1'

export const createEmptyActivityReportDraft = () => ({
  kata_pengantar: '',
  latar_belakang: '',
  dasar_hukum: '',
  tujuan_umum: '',
  tujuan_khusus: '',
  hasil_diharapkan: '',
  sumber_dana: '',
  kode_anggaran: '',
  ringkasan_pembiayaan: '',
  rapat_persiapan: '',
  notulensi_persiapan: '',
  kesiapan_dokumen: '',
  sasaran_kegiatan: '',
  agenda_kegiatan: '',
  rekaman_pelaksanaan: '',
  hasil_ujian: '',
  evaluasi_persiapan: '',
  evaluasi_pelaksanaan: '',
  kendala_pelaksanaan: '',
  solusi_perbaikan: '',
  simpulan: '',
  rekomendasi: '',
  rencana_tindak_lanjut: '',
  tempat_pengesahan: 'Mataram',
  tanggal_pengesahan: '',
  jabatan_pengesah: '',
  nama_pengesah: '',
  nip_pengesah: '',
  nama_penyusun: '',
  nip_penyusun: ''
})

const readDraftMap = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export const getActivityReportDraft = (idKegiatan) => {
  const saved = readDraftMap()[String(idKegiatan)]
  return {
    ...createEmptyActivityReportDraft(),
    ...(saved?.data || {})
  }
}

export const saveActivityReportDraft = (idKegiatan, data) => {
  const drafts = readDraftMap()
  const record = {
    version: 1,
    id_kegiatan: idKegiatan,
    updated_at: new Date().toISOString(),
    data: {
      ...createEmptyActivityReportDraft(),
      ...(data || {})
    }
  }
  drafts[String(idKegiatan)] = record
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
  return record
}

export default {
  createEmptyActivityReportDraft,
  getActivityReportDraft,
  saveActivityReportDraft
}
