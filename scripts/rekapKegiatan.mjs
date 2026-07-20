import axios from 'axios'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_BASE = 'https://api-siamin.bpmpntb.id/api/v1'
const UPLOAD_AUTH_URL = 'https://bpmpntb.id/assets_back/auth.php'
const UPLOAD_URL = 'https://bpmpntb.id/assets_back/push.php'
const UPLOAD_USER = '199502102025211047'
const UPLOAD_PASS = '123456'

const PEGAWAI_NIP = '199502102025211047'
const PEGAWAI_NAMA = 'Wahyu Ramdhani'
const PEGAWAI_PANGKAT = 'IX / Penata Operasional'

const TODAY = new Date()
const TANGGAL_HARI = TODAY.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

async function apiGet(endpoint, params = {}) {
  try {
    const resp = await axios.get(`${API_BASE}/${endpoint}`, {
      params: { page: 1, per_page: 500, ...params },
      timeout: 15000
    })
    const data = resp.data
    return Array.isArray(data) ? data : (data?.data || [])
  } catch (e) {
    console.warn(`  [API] ${endpoint} gagal:`, e.message)
    return []
  }
}

function isCurrentYear(dateStr) {
  if (!dateStr) return false
  try { return new Date(dateStr).getFullYear() === TODAY.getFullYear() }
  catch { return false }
}

function isCurrentMonth(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return d.getFullYear() === TODAY.getFullYear() && d.getMonth() === TODAY.getMonth()
}

function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  try { return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return String(dateStr) }
}

async function uploadWithSession(pdfBytes, filename) {
  try {
    const instance = axios.create({ withCredentials: true })

    const authResp = await instance.post(UPLOAD_AUTH_URL,
      new URLSearchParams({ username: UPLOAD_USER, password: UPLOAD_PASS }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        maxRedirects: 0,
        validateStatus: (s) => s < 400
      }
    )

    const setCookies = authResp.headers['set-cookie']
    if (!setCookies) {
      return { success: false, error: 'Tidak ada session cookie dari auth.php' }
    }

    const cookieStr = setCookies.map(c => c.split(';')[0]).join('; ')

    const formData = new FormData()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    formData.append('file', blob, filename)
    formData.append('upload', 'Upload')

    const uploadResp = await instance.post(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cookie': cookieStr
      },
      maxRedirects: 5,
      validateStatus: () => true,
      timeout: 30000
    })

    const respText = String(uploadResp.data || '')
    if (respText.includes('<form') && respText.includes('Login')) {
      return { success: false, error: 'Login gagal - masih menampilkan halaman login', status: uploadResp.status }
    }

    return { success: true, data: respText.substring(0, 500), status: uploadResp.status }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

async function generatePDF(rekap) {
  const doc = await PDFDocument.create()
  const page = doc.addPage([595.28, 841.89])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  let y = 780
  const margin = 50
  const pageWidth = 595.28 - 2 * margin
  const centerX = margin + pageWidth / 2

  const drawText = (text, x, yPos, opts = {}) => {
    const f = opts.bold ? fontBold : font
    const sz = opts.size || 10
    const col = opts.color || rgb(0, 0, 0)
    try { page.drawText(String(text || ''), { x, y: yPos, font: f, size: sz, color: col }) } catch {}
    return yPos - (opts.lh || (sz + 3))
  }

  const drawLine = (yPos) => {
    page.drawLine({ start: { x: margin, y: yPos }, end: { x: 595.28 - margin, y: yPos }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) })
    return yPos - 8
  }

  const checkBreak = (cy, need = 50) => (cy < margin + need) ? 780 : cy

  const centerText = (text, yPos, opts = {}) => {
    const f = opts.bold ? fontBold : font
    const sz = opts.size || 10
    const w = f.widthOfTextAtSize(String(text), sz)
    return drawText(text, centerX - w / 2, yPos, opts)
  }

  y = centerText('PEMERINTAH PROVINSI NUSA TENGGARA BARAT', y, { bold: true, size: 11 })
  y = centerText('BADAN PENILAIAN DAN PEMBINAAN MUTU PENDIDIKAN', y, { bold: true, size: 10 })
  y = centerText('PROVINSI NUSA TENGGARA BARAT', y, { bold: true, size: 10 })
  y = drawLine(y - 3)

  y -= 10
  y = centerText('LAPORAN REKAP KEGIATAN HARIAN PEGAWAI', y, { bold: true, size: 13, color: rgb(0.1, 0.25, 0.68) })
  y = centerText(`Per Tanggal ${TANGGAL_HARI}`, y, { size: 10 })
  y -= 15

  const boxTop = y + 5
  page.drawRectangle({
    x: margin, y: boxTop - 105, width: pageWidth, height: 105,
    borderColor: rgb(0.1, 0.25, 0.68), borderWidth: 1, color: rgb(0.95, 0.97, 1)
  })

  y -= 10
  y = drawText('DATA PEGAWAI', margin + 10, y, { bold: true, size: 11, color: rgb(0.1, 0.25, 0.68) })
  y -= 3
  const ix = margin + 15, vx = margin + 155
  for (const [label, val] of [
    ['Nama', rekap.pegawai.nama],
    ['NIP', rekap.pegawai.nip],
    ['Pangkat / Golongan', rekap.pegawai.pangkat],
    ['Jabatan', rekap.pegawai.jabatan],
    ['Unit Kerja', rekap.pegawai.unit_kerja]
  ]) {
    y = drawText(label, ix, y, { bold: true, size: 10 })
    y = drawText(': ' + val, vx, y + 13, { size: 10 })
    y -= 1
  }

  y -= 12
  y = drawLine(y)

  y -= 3
  y = drawText('DAFTAR KEGIATAN', margin + 10, y, { bold: true, size: 11, color: rgb(0.1, 0.25, 0.68) })
  y -= 8

  const cols = [
    { x: margin + 5, w: 25, label: 'No' },
    { x: margin + 30, w: 220, label: 'Nama Kegiatan' },
    { x: margin + 250, w: 160, label: 'Rincian' },
    { x: margin + 410, w: 85, label: 'Tanggal' },
    { x: margin + 495, w: 50, label: 'Status' }
  ]

  page.drawRectangle({ x: margin, y: y - 2, width: pageWidth, height: 16, color: rgb(0.1, 0.25, 0.68) })
  for (const c of cols) drawText(c.label, c.x, y + 1, { bold: true, size: 8, color: rgb(1, 1, 1) })
  y -= 18

  const truncate = (s, max) => {
    s = String(s || '-')
    return s.length > max ? s.substring(0, max - 3) + '...' : s
  }

  if (rekap.activities.length === 0) {
    y = drawText('Tidak ada data kegiatan ditemukan.', centerX - font.widthOfTextAtSize('Tidak ada data kegiatan ditemukan.', 10) / 2, y, { size: 10, color: rgb(0.5, 0.5, 0.5) })
  } else {
    rekap.activities.forEach((keg, i) => {
      y = checkBreak(y, 35)
      if (i % 2 === 0) {
        page.drawRectangle({ x: margin, y: y - 4, width: pageWidth, height: 20, color: rgb(0.95, 0.97, 1) })
      }
      drawText(String(i + 1), cols[0].x, y + 6, { size: 8 })
      drawText(truncate(keg.nama, 32), cols[1].x, y + 6, { size: 8 })
      drawText(truncate(keg.rincian || keg.lokasi || '-', 24), cols[2].x, y + 6, { size: 8 })
      drawText(formatTanggal(keg.tanggal_mulai), cols[3].x, y + 6, { size: 8 })
      drawText(truncate(keg.status, 10), cols[4].x, y + 6, { size: 8 })
      y -= 16
    })
  }

  y -= 8
  y = drawLine(y)
  y -= 3
  y = drawText(`Total Kegiatan: ${rekap.activities.length} kegiatan`, margin + 10, y, { bold: true, size: 10 })

  const rincianY = y - 15
  y = drawText('RINCIAN KEGIATAN:', margin + 10, rincianY, { bold: true, size: 10, color: rgb(0.1, 0.25, 0.68) })
  y -= 5

  rekap.activities.forEach((keg, i) => {
    y = checkBreak(y, 60)
    y = drawText(`${i + 1}. ${keg.nama}`, margin + 15, y, { bold: true, size: 9 })
    y -= 1
    if (keg.rincian) {
      const rLines = keg.rincian.match(/.{1,80}/g) || [keg.rincian]
      for (const line of rLines) {
        y = drawText(`   ${line}`, margin + 20, y, { size: 9, color: rgb(0.3, 0.3, 0.3) })
      }
    }
    y = drawText(`   Tanggal: ${formatTanggal(keg.tanggal_mulai)} - ${formatTanggal(keg.tanggal_selesai)} | Lokasi: ${keg.lokasi} | Status: ${keg.status} | Metode: ${keg.metode || '-'}`, margin + 20, y, { size: 8 })
    y -= 5
  })

  y -= 10
  y = drawLine(y)

  const signY = y - 15
  const leftX = margin + 20
  const rightX = centerX + 40

  drawText(`Mataram, ${TANGGAL_HARI}`, rightX, signY, { size: 10 })
  drawText('Mengetahui,', rightX, signY - 15, { size: 10 })
  drawText(`Mataram, ${TANGGAL_HARI}`, leftX, signY, { size: 10 })
  drawText('Mengetahui,', leftX, signY - 15, { size: 10 })

  drawText('___________________', rightX, signY - 60, { size: 10 })
  drawText(rekap.pegawai.nama, rightX, signY - 72, { bold: true, size: 10 })
  drawText(`NIP. ${rekap.pegawai.nip}`, rightX, signY - 84, { size: 9 })

  drawText('___________________', leftX, signY - 60, { size: 10 })
  drawText('Kepala BPMP NTB', leftX, signY - 72, { bold: true, size: 10 })
  drawText('Dr. Bambang Sutrisno', leftX, signY - 84, { size: 9 })
  drawText('NIP. 197803152005011001', leftX, signY - 96, { size: 9 })

  return await doc.save()
}

async function main() {
  console.log('=== REKAP KEGIATAN HARIAN PEGAWAI ===')
  console.log(`Tanggal: ${TANGGAL_HARI}`)
  console.log(`Pegawai: ${PEGAWAI_NAMA} - NIP: ${PEGAWAI_NIP}`)

  console.log('\n[1/4] Mengambil data kegiatan dari API...')
  const kegiatanList = await apiGet('kegiatan/all')
  console.log(`  Ditemukan ${kegiatanList.length} kegiatan`)

  const activities = kegiatanList.map(k => ({
    nama: k.nama_kegiatan || k.nama || '-',
    rincian: k.rincian_kegiatan || k.deskripsi || '',
    tanggal_mulai: k.tanggal_mulai || k.created_at || null,
    tanggal_selesai: k.tanggal_selesai || null,
    lokasi: k.lokasi || '-',
    status: k.status || '-',
    metode: k.metode_pelaksanaan || '-'
  }))

  const rekap = {
    pegawai: {
      nama: PEGAWAI_NAMA,
      nip: PEGAWAI_NIP,
      pangkat: PEGAWAI_PANGKAT,
      jabatan: 'Penata Operasional',
      unit_kerja: 'BPMP NTB'
    },
    activities
  }

  console.log('\n[2/4] Membuat PDF...')
  const pdfBytes = await generatePDF(rekap)
  const filename = `Rekap_Kegiatan_${PEGAWAI_NIP}_${TODAY.toISOString().split('T')[0]}.pdf`
  const outputPath = path.join(__dirname, '..', filename)
  fs.writeFileSync(outputPath, pdfBytes)
  console.log(`  PDF tersimpan: ${filename} (${pdfBytes.length} bytes)`)

  console.log('\n[3/4] Upload ke bpmpntb.id...')
  const result = await uploadWithSession(pdfBytes, filename)
  if (result.success) {
    console.log('  Upload BERHASIL!')
    console.log('  Status:', result.status)
    console.log('  Response:', result.data)
  } else {
    console.log('  Upload GAGAL:', result.error)
    if (result.status) console.log('  Status:', result.status)
  }

  console.log('\n[4/4] Selesai!')
}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})
