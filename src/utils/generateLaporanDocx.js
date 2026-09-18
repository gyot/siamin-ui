import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType
} from 'docx'
import { downloadBlob } from '@/utils/docxUtils'

const BLUE = '1F4E79'

const run = (text, opts = {}) => new TextRun({
  text: String(text ?? ''),
  font: 'Times New Roman',
  size: opts.size || 24,
  bold: opts.bold,
  italics: opts.italics
})

const para = (text, opts = {}) => new Paragraph({
  children: Array.isArray(text) ? text : [run(text, opts)],
  alignment: opts.alignment || AlignmentType.JUSTIFIED,
  spacing: opts.spacing || { line: 360, after: 120 },
  heading: opts.heading,
  pageBreakBefore: opts.pageBreakBefore,
  keepNext: opts.keepNext
})

const centered = (text, opts = {}) => para(text, { ...opts, alignment: AlignmentType.CENTER })

const heading1 = (text, pageBreak = false) => para(text, {
  bold: true,
  size: 28,
  alignment: AlignmentType.CENTER,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 180, after: 180, line: 300 },
  pageBreakBefore: pageBreak,
  keepNext: true
})

const heading2 = (text) => para(text, {
  bold: true,
  size: 24,
  alignment: AlignmentType.LEFT,
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 180, after: 120, line: 300 },
  keepNext: true
})

const pageBreak = () => para([new PageBreak()])

const cell = (text, opts = {}) => new TableCell({
  children: [para(String(text ?? '-'), { alignment: opts.alignment || AlignmentType.LEFT, size: opts.size || 20, bold: opts.bold, spacing: { after: 0, line: 280 } })],
  width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
  shading: opts.fill ? { type: 'clear', fill: opts.fill, color: 'auto' } : undefined,
  verticalAlign: VerticalAlign.CENTER,
  margins: { top: 70, bottom: 70, left: 90, right: 90 }
})

const borderedTable = (headers, rows, widths) => new Table({
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
      children: headers.map((h, i) => cell(h, { bold: true, fill: BLUE, width: widths?.[i], alignment: AlignmentType.CENTER, size: 20 }))
    }),
    ...rows.map(row => new TableRow({
      children: row.map((v, i) => cell(v, { width: widths?.[i] }))
    }))
  ]
})

const formatDate = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const pct = (dist, total) => {
  if (!total) return { ss: 0, s: 0, c: 0, k: 0 }
  return {
    ss: Math.round((dist.sangat_sesuai / total) * 100),
    s: Math.round((dist.sesuai / total) * 100),
    c: Math.round((dist.cukup / total) * 100),
    k: Math.round((dist.kurang / total) * 100)
  }
}

export async function generateLaporanDocx(data) {
  const draft = data.draft || data
  const kegiatan = data.kegiatan || {}
  const peserta = data.peserta || []
  const evaluasi = data.evaluasi || { total_responden: 0, program: {}, fasilitator: [], layanan: {} }
  const tpk = data.tpk || {}
  const pengesahan = draft.pengesahan || data.pengesahan || []
  const kata_pengantar = draft.kata_pengantar || data.kata_pengantar || ''
  const latar_belakang = draft.latar_belakang || data.latar_belakang || ''
  const dasar_hukum = draft.dasar_hukum || data.dasar_hukum || []
  const tujuan = draft.tujuan_umum || data.tujuan || ''
  const sasaran = draft.sasaran_kegiatan || data.sasaran || ''
  const pembiayaan = draft.sumber_dana || data.pembiayaan || ''
  const simpulan = draft.simpulan || data.simpulan || ''
  const saran = draft.rekomendasi || data.saran || ''
  const rekaman = draft.rekaman_proses_per_hari || data.rekaman_proses || []
  const struktur_program = draft.struktur_program || data.struktur_program || []
  const jadwal_harian = draft.jadwal_harian || data.jadwal_harian || []
  const jadwal_per_kelas = draft.jadwal_per_kelas || data.jadwal_per_kelas || []
  const angkatan = draft.angkatan || kegiatan.angkatan || ''

  const panitiaPendamping = peserta.filter(p => p.peran === 'Panitia' || p.peran === 'Pendamping')
  const fasilitatorList = peserta.filter(p => p.peran === 'Fasilitator')
  const n = evaluasi.total_responden || 1

  const programRows = [
    ['Kesesuaian Program dengan Tujuan', ...Object.values(pct(evaluasi.program?.kesesuaian_program_tujuan || {}, n)).map(v => `${v}%`)],
    ['Kesesuaian Bahan Ajar', ...Object.values(pct(evaluasi.program?.kesesuaian_bahan_ajar || {}, n)).map(v => `${v}%`)],
    ['Kesesuaian Alokasi Waktu', ...Object.values(pct(evaluasi.program?.kesesuaian_alokasi_waktu || {}, n)).map(v => `${v}%`)]
  ]

  const evalHeaders = ['Aspek', 'Sangat Sesuai', 'Sesuai', 'Cukup', 'Kurang']

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        centered('LAPORAN', { bold: true, size: 32 }),
        centered(kegiatan.nama_kegiatan || '', { bold: true, size: 28 }),
        centered(angkatan, { size: 24 }),
        centered(`TPK ${tpk.lokasi || ''}${tpk.kabupaten_kota ? ` (${tpk.kabupaten_kota})` : ''}`, { size: 24 }),
        centered(`Tanggal, ${formatDate(kegiatan.tanggal_mulai)} s.d ${formatDate(kegiatan.tanggal_selesai)}`, { size: 24 }),
        centered('', { size: 24 }),
        centered('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', { bold: true, size: 24 }),
        centered('BALAI PENJAMINAN MUTU PENDIDIKAN', { size: 24 }),
        centered('PROVINSI NUSA TENGGARA BARAT', { size: 24 }),
        centered(String(new Date(kegiatan.tanggal_mulai || Date.now()).getFullYear()), { bold: true, size: 28 }),

        pageBreak(),
        heading1('LEMBAR PENGESAHAN'),
        borderedTable(
          ['Nama', 'Jabatan', 'Tanda Tangan', 'Tanggal'],
          pengesahan.map(p => [`${p.peran}:\n${p.nama || '-'}\nNIP. ${p.nip || '-'}`, p.jabatan || '-', '', formatDate(p.tanggal)]),
          [3500, 2500, 2500, 2000]
        ),

        pageBreak(),
        heading1('KATA PENGANTAR'),
        ...(kata_pengantar || '(Belum diisi)').split('\n\n').filter(Boolean).map(p => para(p)),
        para(''),
        centered(`Mataram, ${formatDate(pengesahan[0]?.tanggal)}`, { alignment: AlignmentType.RIGHT }),
        centered('Panitia', { alignment: AlignmentType.RIGHT }),

        pageBreak(),
        heading1('DAFTAR ISI'),
        para('BAB I    PENDAHULUAN', { bold: true }),
        para('    A. Latar Belakang'), para('    B. Dasar Hukum'), para('    C. Tujuan'), para('    D. Sasaran'), para('    E. Pembiayaan'),
        para('BAB II   PERSIAPAN KEGIATAN', { bold: true }),
        para('    A. Personalia'),
        para('BAB III  PELAKSANAAN KEGIATAN', { bold: true }),
        para('    A. Struktur Program'), para('    B. Jadwal Kegiatan'), para('    C. Rekaman Proses'),
        para('BAB IV   EVALUASI KEGIATAN', { bold: true }),
        para('    A. Evaluasi Program'), para('    B. Evaluasi Fasilitator'), para('    C. Evaluasi Layanan'),
        para('BAB V    PENUTUP', { bold: true }),
        para('    A. Kesimpulan'), para('    B. Saran'),

        pageBreak(),
        heading1('BAB I', true),
        heading1('PENDAHULUAN'),
        heading2('A. Latar Belakang'),
        ...(latar_belakang || '(Belum diisi)').split('\n\n').filter(Boolean).map(p => para(p)),
        heading2('B. Dasar Hukum'),
        ...(dasar_hukum.length > 0 ? dasar_hukum.map((d, i) => para(`${i + 1}. ${d}`)) : [para('(Belum diisi)')]),
        heading2('C. Tujuan'),
        ...(tujuan || '(Belum diisi)').split('\n').filter(Boolean).map(p => para(p)),
        heading2('D. Sasaran'),
        para(sasaran || '(Belum diisi)'),
        heading2('E. Pembiayaan'),
        para(pembiayaan || '(Belum diisi)'),

        pageBreak(),
        heading1('BAB II', true),
        heading1('PERSIAPAN KEGIATAN'),
        heading2('A. Personalia'),
        para('1. Panitia dan Pendamping', { bold: true }),
        borderedTable(
          ['No', 'Nama / NIP', 'Jabatan Kegiatan', 'Instansi', 'Jabatan Kedinasan'],
          panitiaPendamping.map((p, i) => [String(i + 1), `${p.nama_lengkap || p.nama || '-'}\nNIP. ${p.nip || '-'}`, p.peran || '-', p.nama_instansi || p.instansi || '-', p.jabatan || '-']),
          [600, 3000, 2000, 2200, 2200]
        ),
        para(''),
        para('2. Fasilitator', { bold: true }),
        borderedTable(
          ['No', 'Nama / NIP', 'Instansi', 'Jabatan'],
          fasilitatorList.map((f, i) => [String(i + 1), `${f.nama_lengkap || f.nama || '-'}\n${f.nip || '-'}`, f.nama_instansi || f.instansi || '-', f.jabatan || '-']),
          [600, 3000, 3200, 3200]
        ),

        pageBreak(),
        heading1('BAB III', true),
        heading1('PELAKSANAAN KEGIATAN'),
        ...(struktur_program.length > 0 ? [
          heading2('A. Struktur Program'),
          borderedTable(
            ['No', 'Kategori', 'Materi', 'JP'],
            [...struktur_program.map((s, i) => [String(i + 1), s.kategori, s.materi, s.jp ? String(s.jp) : '-']), ['', '', 'Total JP', String(struktur_program.reduce((a, s) => a + (s.jp || 0), 0))]],
            [600, 1500, 5900, 1000]
          )
        ] : []),
        ...(jadwal_per_kelas.length > 0 ? [
          heading2('B. Jadwal Kegiatan'),
          ...jadwal_per_kelas.flatMap(kelas => [
            ...(jadwal_per_kelas.length > 1 ? [para(kelas.nama_kelas, { bold: true, size: 22 })] : []),
            ...(kelas.jadwal || []).flatMap(day => [
              para(`${day.hari} - ${formatDate(day.tanggal)}`, { bold: true }),
              borderedTable(['Waktu', 'Kegiatan / Materi', 'JP', 'Penanggung Jawab'], (day.items || []).filter(i => i.tipe !== 'istirahat').map(item => [item.waktu || `${item.jam_mulai || ''} - ${item.jam_selesai || ''}`, item.kegiatan || '-', item.jp ? String(item.jp) : '-', item.pj || '-']), [2000, 4500, 1000, 2500]),
              para('')
            ])
          ])
        ] : (jadwal_harian.length > 0 ? [
          heading2('B. Jadwal Kegiatan'),
          ...jadwal_harian.flatMap(day => [
            para(`${day.hari} - ${formatDate(day.tanggal)}`, { bold: true }),
            borderedTable(['Waktu', 'Kegiatan / Materi', 'JP', 'Penanggung Jawab'], day.items.filter(i => i.tipe !== 'istirahat').map(item => [item.waktu || `${item.jam_mulai || ''} - ${item.jam_selesai || ''}`, item.kegiatan || '-', item.jp ? String(item.jp) : '-', item.pj || '-']), [2000, 4500, 1000, 2500]),
            para('')
          ])
        ] : [])),
        heading2('C. Rekaman Proses'),
        ...(rekaman.length > 0 ? rekaman.flatMap(rec => [
          para(`${rec.hari} - ${formatDate(rec.tanggal)}`, { bold: true }),
          para(rec.narasi || '(Belum diisi)')
        ]) : [para('(Belum diisi)')]),

        pageBreak(),
        heading1('BAB IV', true),
        heading1('EVALUASI KEGIATAN'),
        para(`Jumlah responden: ${n} orang`, { size: 20 }),
        heading2('A. Evaluasi Program'),
        borderedTable(evalHeaders, programRows, [3000, 1500, 1500, 1500, 1500]),
        heading2('B. Evaluasi Fasilitator'),
        ...(evaluasi.fasilitator?.length > 0 ? evaluasi.fasilitator.flatMap(f => [
          para(f.nama, { bold: true }),
          borderedTable(evalHeaders, [
            ['Penguasaan Materi', ...Object.values(pct(f.penguasaan_materi || {}, n)).map(v => `${v}%`)],
            ['Sistematika Penyajian', ...Object.values(pct(f.sistematika_penyajian || {}, n)).map(v => `${v}%`)],
            ['Sikap dan Kehadiran', ...Object.values(pct(f.sikap_kehadiran || {}, n)).map(v => `${v}%`)]
          ], [3000, 1500, 1500, 1500, 1500]),
          para('')
        ]) : [para('(Data evaluasi fasilitator belum tersedia)')]),
        heading2('C. Evaluasi Layanan'),
        borderedTable(evalHeaders, [
          ['Sikap Pelayanan Panitia', ...Object.values(pct(evaluasi.layanan?.sikap_pelayanan_panitia || {}, n)).map(v => `${v}%`)],
          ['Fasilitas dan Kebersihan', ...Object.values(pct(evaluasi.layanan?.fasilitas_kebersihan || {}, n)).map(v => `${v}%`)],
          ['Kualitas Konsumsi', ...Object.values(pct(evaluasi.layanan?.kualitas_konsumsi || {}, n)).map(v => `${v}%`)]
        ], [3000, 1500, 1500, 1500, 1500]),

        pageBreak(),
        heading1('BAB V', true),
        heading1('PENUTUP'),
        heading2('A. Kesimpulan'),
        para(simpulan || '(Belum diisi)'),
        heading2('B. Saran'),
        ...(saran || '(Belum diisi)').split('\n').filter(Boolean).map(s => para(s)),

        pageBreak(),
        heading1('LAMPIRAN'),
        ...['TOR', 'SK dan Surat Tugas', 'Daftar Hadir', 'Biodata', 'Panduan Kegiatan', 'Foto Kegiatan', 'Link Sertifikat'].map(l => para(`- ${l}`))
      ]
    }]
  })

  const blob = await Packer.toBlob(doc)
  const filename = `Laporan_${(kegiatan.nama_kegiatan || 'kegiatan').replace(/\s+/g, '_').slice(0, 60)}.docx`
  downloadBlob(blob, filename)
}

export default generateLaporanDocx
