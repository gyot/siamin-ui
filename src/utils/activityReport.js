import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType
} from 'docx'
import { downloadBlob } from '@/utils/docxUtils'
import { getKegiatanLocationItems } from '@/utils/kegiatanLocation'

const BLUE = '1F4E78'
const LIGHT_BLUE = 'D9EAF7'
const YELLOW = 'FFF2CC'

const asArray = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.data?.data)) return value.data.data
  if (Array.isArray(value?.peserta)) return value.peserta
  return []
}

const valueOrDash = (value) => {
  if (value === null || value === undefined || String(value).trim() === '') return '-'
  return String(value).trim()
}

const titleCase = (value) => valueOrDash(value)
  .replace(/_/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return valueOrDash(value)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const getKegiatanId = (item = {}) => item.id_kegiatan ?? item.kegiatan_id ?? item.kegiatan?.id_kegiatan ?? item.kegiatan?.id

const getPesertaKegiatanId = (item = {}) => item.id_kegiatan
  ?? item.kegiatan_id
  ?? item.kegiatan?.id_kegiatan
  ?? item.kegiatan?.id

const getPesertaName = (item = {}) => item.nama_lengkap ?? item.nama ?? item.name ?? '-'
const getPesertaInstitution = (item = {}) => item.nama_instansi ?? item.instansi ?? item.unit_kerja ?? '-'
const getPesertaPosition = (item = {}) => item.jabatan ?? item.pekerjaan ?? '-'

const run = (value, options = {}) => new TextRun({
  text: String(value ?? ''),
  font: 'Times New Roman',
  size: options.size || 24,
  bold: options.bold,
  italics: options.italics,
  color: options.color
})

const paragraph = (value = '', options = {}) => new Paragraph({
  children: Array.isArray(value) ? value : [run(value, options)],
  alignment: options.alignment || AlignmentType.JUSTIFIED,
  heading: options.heading,
  spacing: options.spacing || { line: 360, after: 120 },
  pageBreakBefore: options.pageBreakBefore,
  keepNext: options.keepNext
})

const centered = (value, options = {}) => paragraph(value, {
  ...options,
  alignment: AlignmentType.CENTER
})

const heading = (value, level = 1, pageBreakBefore = false) => paragraph(value, {
  bold: true,
  size: level === 1 ? 28 : 24,
  alignment: level === 1 ? AlignmentType.CENTER : AlignmentType.LEFT,
  heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
  spacing: { before: 180, after: 180, line: 300 },
  pageBreakBefore,
  keepNext: true
})

const pageBreak = () => paragraph([new PageBreak()])

const cell = (value, options = {}) => new TableCell({
  children: [paragraph(valueOrDash(value), {
    bold: options.bold,
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: { after: 0, line: 280 },
    size: options.size || 20
  })],
  width: options.width ? { size: options.width, type: WidthType.DXA } : undefined,
  shading: options.fill ? { type: ShadingType.CLEAR, fill: options.fill, color: 'auto' } : undefined,
  verticalAlign: VerticalAlign.CENTER,
  margins: { top: 70, bottom: 70, left: 90, right: 90 }
})

const reportTable = (headers, rows, widths) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: '808080' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '808080' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '808080' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '808080' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' }
  },
  rows: [
    new TableRow({
      tableHeader: true,
      children: headers.map((header, index) => cell(header, {
        bold: true,
        fill: BLUE,
        width: widths?.[index],
        alignment: AlignmentType.CENTER
      }))
    }),
    ...rows.map((row) => new TableRow({
      children: row.map((value, index) => cell(value, { width: widths?.[index] }))
    }))
  ]
})

const note = (value, warning = false) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [new TableRow({ children: [cell(value, { fill: warning ? YELLOW : LIGHT_BLUE })] })]
})

const numberedRows = (rows) => rows.map((row, index) => [String(index + 1), ...row])

const normalizeParticipants = (response, kegiatanId) => asArray(response)
  .filter((item) => {
    const itemId = getPesertaKegiatanId(item)
    return itemId === null || itemId === undefined || itemId === '' || String(itemId) === String(kegiatanId)
  })

const countRoles = (participants) => participants.reduce((counts, item) => {
  const role = titleCase(item.peran || item.role || 'Peserta')
  counts[role] = (counts[role] || 0) + 1
  return counts
}, {})

const getPersonnelRows = (participants, role) => participants
  .filter((item) => String(item.peran || item.role || '').toLowerCase() === role.toLowerCase())
  .map((item) => [getPesertaName(item), getPesertaInstitution(item), getPesertaPosition(item)])

const getAssignmentRows = (assignments) => asArray(assignments).map((item) => [
  item.pegawai?.nama ?? item.nama ?? '-',
  item.pegawai?.nip ?? item.nip ?? '-',
  item.pegawai?.jabatan ?? item.jabatan ?? '-',
  titleCase(item.peran)
])

const getEvaluationSummary = (statistics = {}) => [
  ['Jumlah respons', statistics.total_evaluasi ?? 0],
  ['Rata-rata program', statistics.rata_rata_program ?? '-'],
  ['Rata-rata fasilitator', statistics.rata_rata_fasilitator ?? '-'],
  ['Rata-rata layanan', statistics.rata_rata_layanan ?? '-']
]

const PROGRAM_ASPECTS = [
  { key: 'program_tujuan', label: 'Kesesuaian Program dengan Tujuan' },
  { key: 'program_bahan_ajar', label: 'Kesesuaian Bahan Ajar dengan Struktur Program' },
  { key: 'program_alokasi_waktu', label: 'Kesesuaian Alokasi Waktu dengan Bobot Materi' }
]

const SERVICE_ASPECTS = [
  { key: 'layanan_panitia', label: 'Sikap dan Pelayanan Panitia' },
  { key: 'layanan_fasilitas', label: 'Fasilitas dan Kebersihan Tempat' },
  { key: 'layanan_konsumsi', label: 'Kualitas Konsumsi' }
]

const normalizeScore = (value) => {
  const score = Number(value)
  return Number.isFinite(score) && score >= 1 && score <= 5 ? score : null
}

const buildAspectSummary = (evaluationRows, aspects) => aspects.map((aspect) => {
  const scores = evaluationRows.map((item) => normalizeScore(item?.[aspect.key])).filter(Boolean)
  const average = scores.length > 0
    ? scores.reduce((total, score) => total + score, 0) / scores.length
    : null
  const distribution = [1, 2, 3, 4, 5].map((score) => scores.filter((value) => value === score).length)

  return {
    ...aspect,
    responses: scores.length,
    average,
    distribution
  }
})

const getAspectSummaryRows = (summary) => summary.map((item) => [
  item.label,
  item.responses,
  item.average === null ? '-' : item.average.toFixed(2),
  ...item.distribution
])

const getFacilitatorSummaryRows = (statistics = {}) => asArray(statistics.detail_fasilitator).flatMap((item) => [
  [item.nama, 'Penguasaan Materi', item.jumlah_penilaian, item.rata_rata_penguasaan],
  [item.nama, 'Sistematika Penyajian', item.jumlah_penilaian, item.rata_rata_sistematika],
  [item.nama, 'Sikap dan Kehadiran', item.jumlah_penilaian, item.rata_rata_sikap]
]).map((row) => [
  row[0],
  row[1],
  row[2] ?? 0,
  row[3] === null || row[3] === undefined ? '-' : Number(row[3]).toFixed(2)
])

const canvasToArrayBuffer = async (canvas) => {
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Gagal membuat gambar grafik')), 'image/png')
  })
  return blob.arrayBuffer()
}

const createEvaluationChart = async (title, summary, color) => {
  if (typeof document === 'undefined' || summary.every((item) => item.average === null)) return null

  const canvas = document.createElement('canvas')
  const width = 1100
  const rowHeight = 105
  const top = 125
  const bottom = 75
  canvas.width = width
  canvas.height = top + (summary.length * rowHeight) + bottom
  const context = canvas.getContext('2d')
  if (!context) return null

  context.fillStyle = '#FFFFFF'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#1E293B'
  context.font = 'bold 30px Arial'
  context.fillText(title, 40, 50)
  context.font = '18px Arial'
  context.fillStyle = '#64748B'
  context.fillText('Skala penilaian 1 sampai 5', 40, 83)

  const labelWidth = 470
  const chartLeft = labelWidth
  const chartRight = width - 80
  const chartWidth = chartRight - chartLeft

  for (let score = 0; score <= 5; score++) {
    const x = chartLeft + (chartWidth * score / 5)
    context.strokeStyle = '#E2E8F0'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(x, top - 15)
    context.lineTo(x, canvas.height - bottom + 10)
    context.stroke()
    context.fillStyle = '#64748B'
    context.font = '16px Arial'
    context.textAlign = 'center'
    context.fillText(String(score), x, canvas.height - 25)
  }

  summary.forEach((item, index) => {
    const y = top + (index * rowHeight)
    context.textAlign = 'left'
    context.fillStyle = '#334155'
    context.font = '18px Arial'
    const label = item.label.length > 43 ? `${item.label.slice(0, 43)}...` : item.label
    context.fillText(label, 40, y + 31)
    context.font = '15px Arial'
    context.fillStyle = '#64748B'
    context.fillText(`${item.responses} respons`, 40, y + 57)

    if (item.average !== null) {
      const barWidth = chartWidth * item.average / 5
      context.fillStyle = color
      context.fillRect(chartLeft, y + 8, barWidth, 48)
      context.fillStyle = '#0F172A'
      context.font = 'bold 19px Arial'
      context.fillText(item.average.toFixed(2), Math.min(chartLeft + barWidth + 12, chartRight - 38), y + 40)
    }
  })

  return {
    data: await canvasToArrayBuffer(canvas),
    width: canvas.width,
    height: canvas.height
  }
}

const chartParagraph = (image) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 120, after: 240 },
  children: [new ImageRun({
    data: image.data,
    transformation: { width: 650, height: Math.round(650 * image.height / image.width) },
    type: 'png'
  })]
})

const sanitizeFilename = (value) => String(value || 'kegiatan')
  .normalize('NFKD')
  .replace(/[^a-zA-Z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '_')
  .slice(0, 80)

export const generateActivityReport = async ({
  kegiatan,
  unitKerjaLabel = '-',
  pesertaResponse = [],
  assignmentResponse = [],
  evaluationStatistics = null,
  evaluationDetails = [],
  reportData = {}
}) => {
  const kegiatanId = getKegiatanId(kegiatan)
  const participants = normalizeParticipants(pesertaResponse, kegiatanId)
  const roleCounts = countRoles(participants)
  const committeeRows = getPersonnelRows(participants, 'Panitia')
  const speakerRows = getPersonnelRows(participants, 'Narasumber')
  const assignmentRows = getAssignmentRows(assignmentResponse)
  const locations = getKegiatanLocationItems(kegiatan)
  const atkRows = asArray(kegiatan.daftar_atk).map((item) => [
    item.nama_barang,
    item.spesifikasi,
    item.jumlah,
    item.satuan,
    item.keterangan
  ])
  const packageRows = asArray(kegiatan.paket_soal).map((item) => [
    item.nama_paket,
    item.deskripsi,
    item.is_active === false ? 'Nonaktif' : 'Aktif'
  ])
  const evaluationRows = asArray(evaluationDetails)
  const suggestions = evaluationRows
    .map((item) => String(item?.saran || '').trim())
    .filter(Boolean)
  const programSummary = buildAspectSummary(evaluationRows, PROGRAM_ASPECTS)
  const serviceSummary = buildAspectSummary(evaluationRows, SERVICE_ASPECTS)
  const facilitatorSummaryRows = getFacilitatorSummaryRows(evaluationStatistics || {})
  const [programChart, serviceChart] = await Promise.all([
    createEvaluationChart('Evaluasi terhadap Program', programSummary, '#059669'),
    createEvaluationChart('Evaluasi terhadap Layanan', serviceSummary, '#D97706')
  ])
  const totalRegistered = participants.length
  const target = Number(kegiatan.total_peserta || 0)
  const participantCount = roleCounts.Peserta || 0
  const coverage = target > 0 ? `${(participantCount / target * 100).toFixed(1)}%` : '-'
  const locationLabel = locations.map((item) => item.kabupaten_kota
    ? `${item.lokasi}, ${item.kabupaten_kota}`
    : item.lokasi).join('; ') || '-'
  const year = kegiatan.tanggal_mulai ? new Date(kegiatan.tanggal_mulai).getFullYear() : new Date().getFullYear()
  const children = []

  children.push(
    centered('L A P O R A N', { bold: true, size: 36, spacing: { after: 300 } }),
    centered(valueOrDash(kegiatan.nama_kegiatan), { bold: true, size: 32, color: BLUE, spacing: { after: 300 } }),
    centered(unitKerjaLabel, { bold: true, size: 26, spacing: { after: 180 } }),
    centered(`${formatDate(kegiatan.tanggal_mulai)} s.d. ${formatDate(kegiatan.tanggal_selesai)}`, { bold: true }),
    centered(locationLabel, { bold: true, spacing: { after: 500 } }),
    centered('KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH', { bold: true }),
    centered('BALAI PENJAMINAN MUTU PENDIDIKAN', { bold: true }),
    centered('PROVINSI NUSA TENGGARA BARAT', { bold: true }),
    centered(String(year), { bold: true, size: 28 }),
    pageBreak()
  )

  children.push(
    heading('KATA PENGANTAR'),
    paragraph(`Puji syukur kepada Tuhan Yang Maha Esa atas terselenggaranya kegiatan ${valueOrDash(kegiatan.nama_kegiatan)}. Laporan ini dihasilkan dari data yang tersedia pada SIMAIK sebagai dokumentasi pelaksanaan kegiatan.`),
    paragraph(`Kegiatan tercatat dilaksanakan secara ${valueOrDash(kegiatan.metode_pelaksanaan).toLowerCase()} pada ${formatDate(kegiatan.tanggal_mulai)} sampai dengan ${formatDate(kegiatan.tanggal_selesai)} di ${locationLabel}.`),
    ...(reportData.kata_pengantar ? [paragraph(reportData.kata_pengantar)] : []),
    pageBreak(),
    heading('DAFTAR ISI'),
    paragraph('BAB I PENDAHULUAN'),
    paragraph('BAB II PERSIAPAN KEGIATAN'),
    paragraph('BAB III PELAKSANAAN KEGIATAN'),
    paragraph('BAB IV EVALUASI KEGIATAN'),
    paragraph('BAB V PENUTUP'),
    paragraph('LAMPIRAN')
  )

  children.push(
    heading('BAB I', 1, true),
    centered('PENDAHULUAN', { bold: true, size: 28 }),
    heading('A. Latar Belakang', 2),
    paragraph(reportData.latar_belakang || kegiatan.rincian_kegiatan || kegiatan.deskripsi || `Kegiatan ${valueOrDash(kegiatan.nama_kegiatan)} diselenggarakan sebagai bagian dari pelaksanaan program ${unitKerjaLabel}.`),
    heading('B. Dasar Hukum', 2),
    ...(reportData.dasar_hukum ? [paragraph(reportData.dasar_hukum)] : [note('Dasar hukum belum diisi.', true)]),
    heading('C. Tujuan', 2),
    ...(reportData.tujuan_umum ? [paragraph([run('Tujuan umum: ', { bold: true }), run(reportData.tujuan_umum)])] : []),
    ...(reportData.tujuan_khusus ? [paragraph([run('Tujuan khusus: ', { bold: true }), run(reportData.tujuan_khusus)])] : []),
    ...(!reportData.tujuan_umum && !reportData.tujuan_khusus ? [note('Tujuan kegiatan belum diisi.', true)] : []),
    heading('D. Hasil yang Diharapkan', 2),
    ...(reportData.hasil_diharapkan ? [paragraph(reportData.hasil_diharapkan)] : [note('Hasil yang diharapkan belum diisi.', true)]),
    heading('E. Pembiayaan', 2),
    paragraph(`Metode pembayaran yang tercatat adalah ${titleCase(kegiatan.metode_pembayaran)}. Sumber dana: ${valueOrDash(reportData.sumber_dana)}. Kode anggaran: ${valueOrDash(reportData.kode_anggaran)}.`),
    ...(reportData.ringkasan_pembiayaan ? [paragraph(reportData.ringkasan_pembiayaan)] : [])
  )

  children.push(
    heading('BAB II', 1, true),
    centered('PERSIAPAN KEGIATAN', { bold: true, size: 28 }),
    heading('A. Rapat Persiapan', 2),
    ...(reportData.rapat_persiapan ? [paragraph(reportData.rapat_persiapan)] : [note('Data rapat persiapan belum diisi.', true)]),
    ...(reportData.notulensi_persiapan ? [paragraph(reportData.notulensi_persiapan)] : []),
    heading('B. Pembagian Tugas', 2),
    ...(assignmentRows.length > 0
      ? [reportTable(['No.', 'Nama', 'NIP', 'Jabatan', 'Peran'], numberedRows(assignmentRows), [500, 2500, 1800, 2800, 2000])]
      : [note('Data penugasan belum tersedia untuk kegiatan ini.', true)]),
    heading('C. Panitia Terdaftar', 2),
    ...(committeeRows.length > 0
      ? [reportTable(['No.', 'Nama', 'Instansi', 'Jabatan'], numberedRows(committeeRows), [500, 3000, 2200, 3900])]
      : [note('Belum ada data peserta dengan peran Panitia.')]),
    heading('D. Perlengkapan/ATK', 2),
    ...(atkRows.length > 0
      ? [reportTable(['No.', 'Nama Barang', 'Spesifikasi', 'Jumlah', 'Satuan', 'Keterangan'], numberedRows(atkRows), [500, 2200, 2200, 1000, 1200, 2500])]
      : [note('Belum ada data ATK untuk kegiatan ini.')]),
    heading('E. Kesiapan Dokumen', 2),
    ...(reportData.kesiapan_dokumen ? [paragraph(reportData.kesiapan_dokumen)] : [note('Kesiapan dokumen belum diisi.', true)])
  )

  const identityRows = [
    ['ID kegiatan', kegiatanId],
    ['Nama kegiatan', kegiatan.nama_kegiatan],
    ['Tanggal', `${formatDate(kegiatan.tanggal_mulai)} s.d. ${formatDate(kegiatan.tanggal_selesai)}`],
    ['Metode', titleCase(kegiatan.metode_pelaksanaan)],
    ['Lokasi', locationLabel],
    ['Unit kerja', unitKerjaLabel],
    ['Target peserta', target ? `${target} orang` : '-'],
    ['Total terdaftar', `${totalRegistered} orang`],
    ['Status', titleCase(kegiatan.status)]
  ]
  const roleRows = Object.entries(roleCounts).map(([role, count]) => [role, String(count)])

  children.push(
    heading('BAB III', 1, true),
    centered('PELAKSANAAN KEGIATAN', { bold: true, size: 28 }),
    heading('A. Identitas Pelaksanaan', 2),
    reportTable(['Keterangan', 'Isi'], identityRows, [2800, 6800]),
    heading('B. Tempat Pelaksanaan Kegiatan', 2),
    ...(locations.length > 0
      ? [reportTable(['No.', 'Lokasi', 'Kabupaten/Kota'], numberedRows(locations.map((item) => [item.lokasi, item.kabupaten_kota])), [600, 4800, 4200])]
      : [note('Belum ada lokasi kegiatan yang tercatat.')]),
    heading('C. Rekap Peserta dan Personalia', 2),
    ...(roleRows.length > 0
      ? [reportTable(['Peran', 'Jumlah'], roleRows, [6000, 3600])]
      : [note('Belum ada data peserta untuk kegiatan ini.')]),
    ...(reportData.sasaran_kegiatan ? [paragraph([run('Sasaran kegiatan: ', { bold: true }), run(reportData.sasaran_kegiatan)])] : []),
    paragraph(`Peserta berperan sebagai peserta tercatat ${participantCount} orang dari target ${target || 0} orang, dengan cakupan pendaftaran ${coverage}. Angka ini merupakan data pendaftaran, bukan konfirmasi kehadiran aktual.`),
    heading('D. Narasumber', 2),
    ...(speakerRows.length > 0
      ? [reportTable(['No.', 'Nama', 'Instansi', 'Jabatan'], numberedRows(speakerRows), [500, 3000, 2200, 3900])]
      : [note('Belum ada data peserta dengan peran Narasumber.')]),
    heading('E. Paket Soal/Asesmen', 2),
    ...(packageRows.length > 0
      ? [reportTable(['No.', 'Paket', 'Deskripsi', 'Status'], numberedRows(packageRows), [500, 3000, 4100, 2000])]
      : [note('Tidak ada paket soal yang terkait dengan kegiatan ini.')]),
    heading('F. Struktur Program dan Dokumentasi', 2),
    ...(reportData.agenda_kegiatan ? [paragraph(reportData.agenda_kegiatan)] : [note('Agenda rinci belum diisi.', true)]),
    ...(reportData.rekaman_pelaksanaan ? [paragraph(reportData.rekaman_pelaksanaan)] : []),
    ...(reportData.hasil_ujian ? [paragraph([run('Hasil ujian/asesmen: ', { bold: true }), run(reportData.hasil_ujian)])] : []),
    paragraph(`Dokumentasi: ${valueOrDash(kegiatan.dokumentasi_url)}`),
    paragraph(`Materi: ${valueOrDash(kegiatan.materi_url)}`),
    paragraph(`Panduan: ${valueOrDash(kegiatan.panduan_url)}`)
  )

  children.push(
    heading('BAB IV', 1, true),
    centered('EVALUASI KEGIATAN', { bold: true, size: 28 }),
    heading('A. Ringkasan Evaluasi', 2),
    ...(reportData.evaluasi_persiapan ? [paragraph([run('Evaluasi persiapan: ', { bold: true }), run(reportData.evaluasi_persiapan)])] : []),
    ...(reportData.evaluasi_pelaksanaan ? [paragraph([run('Evaluasi pelaksanaan: ', { bold: true }), run(reportData.evaluasi_pelaksanaan)])] : []),
    ...(evaluationStatistics
      ? [reportTable(['Indikator', 'Nilai'], getEvaluationSummary(evaluationStatistics), [6000, 3600])]
      : [note('Data evaluasi belum tersedia atau tidak dapat dimuat.', true)]),
    heading('B. Evaluasi terhadap Program', 2),
    ...(programSummary.some((item) => item.responses > 0)
      ? [reportTable(
        ['Aspek', 'Respons', 'Rata-rata', 'Skor 1', 'Skor 2', 'Skor 3', 'Skor 4', 'Skor 5'],
        getAspectSummaryRows(programSummary),
        [3600, 900, 1100, 800, 800, 800, 800, 800]
      )]
      : [note('Belum ada detail penilaian program.')]),
    ...(programChart ? [chartParagraph(programChart)] : []),
    heading('C. Evaluasi terhadap Fasilitator/Narasumber', 2),
    ...(facilitatorSummaryRows.length > 0
      ? [reportTable(
        ['Fasilitator/Narasumber', 'Aspek', 'Jumlah Penilaian', 'Rata-rata'],
        facilitatorSummaryRows,
        [3200, 3000, 1700, 1700]
      )]
      : [note('Belum ada ringkasan penilaian fasilitator/narasumber.')]),
    heading('D. Evaluasi terhadap Layanan', 2),
    ...(serviceSummary.some((item) => item.responses > 0)
      ? [reportTable(
        ['Aspek', 'Respons', 'Rata-rata', 'Skor 1', 'Skor 2', 'Skor 3', 'Skor 4', 'Skor 5'],
        getAspectSummaryRows(serviceSummary),
        [3600, 900, 1100, 800, 800, 800, 800, 800]
      )]
      : [note('Belum ada detail penilaian layanan.')]),
    ...(serviceChart ? [chartParagraph(serviceChart)] : []),
    heading('E. Saran dan Masukan Peserta', 2),
    ...(suggestions.length > 0
      ? [reportTable(
        ['No.', 'Saran dan Masukan'],
        numberedRows(suggestions.map((suggestion) => [suggestion])),
        [700, 8900]
      )]
      : [note('Belum ada saran peserta yang dapat ditampilkan.')]),
    heading('F. Kendala dan Solusi', 2),
    ...(reportData.kendala_pelaksanaan ? [paragraph([run('Kendala: ', { bold: true }), run(reportData.kendala_pelaksanaan)])] : [note('Kendala pelaksanaan belum diisi.', true)]),
    ...(reportData.solusi_perbaikan ? [paragraph([run('Solusi dan perbaikan: ', { bold: true }), run(reportData.solusi_perbaikan)])] : [])
  )

  children.push(
    heading('BAB V', 1, true),
    centered('PENUTUP', { bold: true, size: 28 }),
    heading('A. Simpulan', 2),
    paragraph(reportData.simpulan || `Kegiatan ${valueOrDash(kegiatan.nama_kegiatan)} tercatat dilaksanakan secara ${valueOrDash(kegiatan.metode_pelaksanaan).toLowerCase()} pada ${formatDate(kegiatan.tanggal_mulai)} sampai dengan ${formatDate(kegiatan.tanggal_selesai)}. SIMAIK mencatat ${totalRegistered} orang dalam seluruh peran.`),
    heading('B. Rekomendasi', 2),
    paragraph(reportData.rekomendasi || 'Penyusun perlu memeriksa kelengkapan laporan sebelum ditetapkan sebagai dokumen final.'),
    heading('C. Rencana Tindak Lanjut', 2),
    ...(reportData.rencana_tindak_lanjut ? [paragraph(reportData.rencana_tindak_lanjut)] : [note('Rencana tindak lanjut belum diisi.', true)]),
    heading('D. Pengesahan', 2),
    paragraph(`${valueOrDash(reportData.tempat_pengesahan)}, ${formatDate(reportData.tanggal_pengesahan)}`, { alignment: AlignmentType.RIGHT }),
    reportTable(['Mengetahui', 'Penyusun'], [
      [valueOrDash(reportData.jabatan_pengesah), 'Ketua Panitia/Penyusun'],
      [`\n\n\n${valueOrDash(reportData.nama_pengesah)}\nNIP ${valueOrDash(reportData.nip_pengesah)}`, `\n\n\n${valueOrDash(reportData.nama_penyusun)}\nNIP ${valueOrDash(reportData.nip_penyusun)}`]
    ], [4800, 4800])
  )

  children.push(
    heading('LAMPIRAN', 1, true),
    heading('Lampiran 1. Tautan Dokumen Pendukung', 2),
    reportTable(['Dokumen', 'Tautan'], [
      ['Dokumentasi', kegiatan.dokumentasi_url],
      ['Materi', kegiatan.materi_url],
      ['Panduan', kegiatan.panduan_url],
      ['Laporan', kegiatan.laporan_url],
      ['Surat-menyurat', kegiatan.surat_menyurat_url]
    ], [2600, 7000]),
    heading('Lampiran 2. Daftar Peserta', 2),
    ...(participants.length > 0
      ? [reportTable(['No.', 'Nama', 'Peran', 'Instansi', 'Jabatan'], numberedRows(participants.map((item) => [
        getPesertaName(item),
        titleCase(item.peran || item.role || 'Peserta'),
        getPesertaInstitution(item),
        getPesertaPosition(item)
      ])), [500, 2500, 1500, 2400, 2700])]
      : [note('Belum ada data peserta untuk dilampirkan.')])
  )

  const document = new Document({
    creator: 'SIMAIK',
    title: `Laporan Kegiatan ${kegiatanId}`,
    subject: valueOrDash(kegiatan.nama_kegiatan),
    description: 'Laporan kegiatan yang dihasilkan otomatis dari data SIMAIK.',
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 24 },
          paragraph: { spacing: { line: 360, after: 120 } }
        }
      },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: 'Times New Roman', size: 28, bold: true, color: BLUE },
          paragraph: { spacing: { before: 240, after: 180 }, alignment: AlignmentType.CENTER, outlineLevel: 0 }
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: 'Times New Roman', size: 24, bold: true, color: BLUE },
          paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
        }
      ]
    },
    sections: [{
      properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1417 } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              run(`Laporan Kegiatan ID ${kegiatanId} | `, { size: 18, color: '666666' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '666666', font: 'Times New Roman' })
            ]
          })]
        })
      },
      children
    }]
  })

  const blob = await Packer.toBlob(document)
  const filename = `laporan_kegiatan_${kegiatanId}_${sanitizeFilename(kegiatan.nama_kegiatan)}.docx`
  downloadBlob(blob, filename)
  return { blob, filename }
}

export default generateActivityReport
