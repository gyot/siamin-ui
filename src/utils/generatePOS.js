import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  PageBreak,
  TableOfContents,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  LevelFormat
} from 'docx'

const COLORS = {
  primary: '1E40AF',
  secondary: '1E3A5F',
  accent: '2563EB',
  headerBg: '1E3A5F',
  headerText: 'FFFFFF',
  lightBg: 'F0F4FF',
  border: '999999',
  text: '333333',
  muted: '666666'
}

const FONT = {
  family: 'Calibri',
  heading: 'Calibri Light'
}

const borderStyle = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: COLORS.border
}

const cellBorders = {
  top: borderStyle,
  bottom: borderStyle,
  left: borderStyle,
  right: borderStyle
}

const headerCellShading = {
  type: ShadingType.SOLID,
  color: COLORS.headerBg,
  fill: COLORS.headerBg
}

const altRowShading = {
  type: ShadingType.SOLID,
  color: 'F5F7FA',
  fill: 'F5F7FA'
}

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: headerCellShading,
    borders: cellBorders,
    children: [
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({ text, bold: true, color: COLORS.headerText, font: FONT.family, size: 20 })
        ]
      })
    ]
  })
}

function dataCell(text, width, opts = {}) {
  const shading = opts.shading || undefined
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: cellBorders,
    shading,
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: text || '-', font: FONT.family, size: 20, color: COLORS.text, ...opts })
        ]
      })
    ]
  })
}

function sectionTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [
      new TextRun({ text, bold: true, font: FONT.heading, size: 28, color: COLORS.primary })
    ]
  })
}

function subTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [
      new TextRun({ text, bold: true, font: FONT.heading, size: 24, color: COLORS.secondary })
    ]
  })
}

function subSubTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 120 },
    children: [
      new TextRun({ text, bold: true, font: FONT.family, size: 22, color: COLORS.accent })
    ]
  })
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 360 },
    indent: opts.indent ? { left: convertInchesToTwip(0.3) } : undefined,
    children: [
      new TextRun({ text, font: FONT.family, size: 20, color: COLORS.text, ...opts })
    ]
  })
}

function bulletItem(text, level = 0) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 340 },
    indent: { left: convertInchesToTwip(0.3 + level * 0.3) },
    children: [
      new TextRun({ text: '• ', font: FONT.family, size: 20, bold: true, color: COLORS.accent }),
      new TextRun({ text, font: FONT.family, size: 20, color: COLORS.text })
    ]
  })
}

function numberedStep(number, text) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 340 },
    indent: { left: convertInchesToTwip(0.3) },
    children: [
      new TextRun({ text: `${number}. `, font: FONT.family, size: 20, bold: true, color: COLORS.accent }),
      new TextRun({ text, font: FONT.family, size: 20, color: COLORS.text })
    ]
  })
}

function emptyLine() {
  return new Paragraph({ spacing: { before: 80, after: 80 } })
}

function pageBreakPara() {
  return new Paragraph({ children: [new PageBreak()] })
}

function coverPage() {
  return [
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH', font: FONT.heading, size: 24, bold: true, color: COLORS.primary })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'BADAN PENGEMBANGAN MUTU PENDIDIKAN (BPMP)', font: FONT.heading, size: 22, bold: true, color: COLORS.secondary })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'NUSA TENGGARA BARAT', font: FONT.heading, size: 22, bold: true, color: COLORS.secondary })
      ]
    }),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.primary } },
      children: []
    }),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'PROSEDUR OPERASIONAL STANDAR', font: FONT.heading, size: 36, bold: true, color: COLORS.primary })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '(POS)', font: FONT.heading, size: 28, bold: true, color: COLORS.accent })
      ]
    }),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'SISTEM MANAJEMEN INFORMASI KEGIATAN', font: FONT.heading, size: 30, bold: true, color: COLORS.secondary })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '(SIMAIK)', font: FONT.heading, size: 26, bold: true, color: COLORS.accent })
      ]
    }),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'Versi 1.2.0', font: FONT.family, size: 20, color: COLORS.muted })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'Tahun 2025', font: FONT.family, size: 20, color: COLORS.muted })
      ]
    }),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Dokumen Internal - Terbatas', font: FONT.family, size: 18, italics: true, color: COLORS.muted })
      ]
    })
  ]
}

function daftarIsi() {
  return [
    sectionTitle('DAFTAR ISI'),
    emptyLine(),
    bodyText('Halaman Sampul .......................................................  i'),
    bodyText('Daftar Isi .................................................................  ii'),
    bodyText('BAB I  Pendahuluan ....................................................  1'),
    bodyText('     1.1 Latar Belakang ................................................  1'),
    bodyText('     1.2 Maksud dan Tujuan ..........................................  1'),
    bodyText('     1.3 Ruang Lingkup ................................................  2'),
    bodyText('     1.4 Acuan Normatif ...............................................  2'),
    bodyText('     1.5 Definisi dan Istilah ..........................................  2'),
    bodyText('BAB II  Organisasi dan Tanggung Jawab ..........................  3'),
    bodyText('     2.1 Struktur Organisasi Pengguna ..............................  3'),
    bodyText('     2.2 Tanggung Jawab Pengguna ..................................  3'),
    bodyText('BAB III  Prosedur Operasional ......................................  4'),
    bodyText('     3.1 Autentikasi dan Manajemen Pengguna ....................  4'),
    bodyText('     3.2 Manajemen Unit Kerja dan Tim .............................  5'),
    bodyText('     3.3 Manajemen Pegawai dan User ..............................  6'),
    bodyText('     3.4 Manajemen Kegiatan ..........................................  7'),
    bodyText('     3.5 Manajemen Peserta dan Biodata ...........................  9'),
    bodyText('     3.6 Manajemen Sertifikat .........................................  11'),
    bodyText('     3.7 Evaluasi Kegiatan .............................................  12'),
    bodyText('     3.8 Penugasan Pegawai ..........................................  13'),
    bodyText('     3.9 Dashboard dan Statistik .....................................  14'),
    bodyText('     3.10 Laman Publik .................................................  14'),
    bodyText('BAB IV  Penanganan Kesalahan ....................................  16'),
    bodyText('BAB V  Penutup ........................................................  17'),
    bodyText('Lampiran ..................................................................  18')
  ]
}

function bab1() {
  return [
    sectionTitle('BAB I  PENDAHULUAN'),
    subTitle('1.1 Latar Belakang'),
    bodyText(
      'Sistem Manajemen Informasi Kegiatan (SIMAIK) adalah platform terintegrasi yang dikembangkan oleh Badan Pengembangan Mutu Pendidikan (BPMP) Nusa Tenggara Barat untuk mengelola seluruh aspek kegiatan pendidikan secara digital. Sistem ini mencakup manajemen kegiatan, peserta, sertifikat, penugasan pegawai, evaluasi, dan pelaporan.'
    ),
    bodyText(
      'Prosedur Operasional Standar (POS) ini disusun sebagai panduan bagi seluruh pengguna SIMAIK agar dapat menggunakan sistem secara benar, konsisten, dan efisien. Dokumen ini menjadi acuan resmi dalam pengoperasian sistem sehari-hari.'
    ),
    emptyLine(),
    subTitle('1.2 Maksud dan Tujuan'),
    bodyText('Maksud dari penyusunan POS ini adalah:'),
    bulletItem('Menyediakan panduan operasional yang jelas dan terstruktur bagi seluruh pengguna SIMAIK.'),
    bulletItem('Menstandarisasi proses kerja dalam pengelolaan kegiatan melalui sistem.'),
    bulletItem('Menjamin konsistensi dan kualitas pengelolaan data kegiatan.'),
    emptyLine(),
    bodyText('Tujuan dari POS ini adalah:'),
    bulletItem('Memudahkan pengguna dalam memahami alur kerja sistem.'),
    bulletItem('Meminimalisir kesalahan penggunaan sistem.'),
    bulletItem('Menjadi dasar pelatihan bagi pengguna baru.'),
    bulletItem('Menjamin keamanan dan integritas data.'),
    emptyLine(),
    subTitle('1.3 Ruang Lingkup'),
    bodyText('POS ini mencakup seluruh modul yang terdapat dalam sistem SIMAIK, yaitu:'),
    bulletItem('Autentikasi dan Manajemen Pengguna'),
    bulletItem('Manajemen Unit Kerja dan Tim'),
    bulletItem('Manajemen Pegawai dan Akun User'),
    bulletItem('Manajemen Kegiatan'),
    bulletItem('Manajemen Peserta dan Biodata'),
    bulletItem('Manajemen Sertifikat'),
    bulletItem('Evaluasi Kegiatan'),
    bulletItem('Penugasan Pegawai'),
    bulletItem('Dashboard dan Statistik'),
    bulletItem('Laman Publik dan Landing Page'),
    emptyLine(),
    subTitle('1.4 Acuan Normatif'),
    bulletItem('Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi terkait pengelolaan kegiatan pendidikan.'),
    bulletItem('Keputusan Kepala BPMP Nusa Tenggara Barat tentang Sistem Informasi Manajemen.'),
    bulletItem('Kebijakan Tata Kelola Teknologi Informasi dan Komunikasi di Lingkungan Kementerian Pendidikan.'),
    emptyLine(),
    subTitle('1.5 Definisi dan Istilah'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell('Istilah', 3000), headerCell('Definisi', 7000)] }),
        new TableRow({ children: [dataCell('SIMAIK', 3000, { bold: true }), dataCell('Sistem Manajemen Informasi Kegiatan — platform digital pengelolaan kegiatan BPMP NTB', 7000)] }),
        new TableRow({ children: [dataCell('Kegiatan', 3000, { bold: true, shading: altRowShading }), dataCell('Program atau event pendidikan yang dikelola oleh BPMP', 7000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('Peserta', 3000, { bold: true }), dataCell('Individu yang terlibat dalam suatu kegiatan (peserta, narasumber, panitia, pendamping)', 7000)] }),
        new TableRow({ children: [dataCell('Sertifikat', 3000, { bold: true, shading: altRowShading }), dataCell('Dokumen penghargaan digital yang diterbitkan untuk peserta kegiatan', 7000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('Tim Kerja (Timker)', 3000, { bold: true }), dataCell('Unit kerja fungsional yang menangani bidang pendidikan tertentu', 7000)] }),
        new TableRow({ children: [dataCell('Biodata', 3000, { bold: true, shading: altRowShading }), dataCell('Data identitas lengkap peserta yang diisi melalui formulir digital', 7000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('Evaluasi', 3000, { bold: true }), dataCell('Penilaian program dan pelaksanaan kegiatan oleh peserta', 7000)] }),
        new TableRow({ children: [dataCell('Penugasan', 3000, { bold: true, shading: altRowShading }), dataCell('Penetapan pegawai untuk melaksanakan peran dalam suatu kegiatan', 7000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('Surat Tugas', 3000, { bold: true }), dataCell('Dokumen resmi penugasan pegawai yang dapat di-generate dari sistem', 7000)] }),
        new TableRow({ children: [dataCell('Unit Kerja', 3000, { bold: true, shading: altRowShading }), dataCell('Organisasi struktural tempat pegawai bertugas', 7000, { shading: altRowShading })] }),
      ]
    })
  ]
}

function bab2() {
  return [
    pageBreakPara(),
    sectionTitle('BAB II  ORGANISASI DAN TANGGUNG JAWAB'),
    subTitle('2.1 Struktur Organisasi Pengguna'),
    bodyText('Sistem SIMAIK memiliki hierarki pengguna sebagai berikut:'),
    emptyLine(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell('Role', 2500), headerCell('Akses', 3500), headerCell('Keterangan', 4000)] }),
        new TableRow({ children: [dataCell('Admin', 2500, { bold: true }), dataCell('Penuh (semua modul admin)', 3500), dataCell('Mengelola seluruh sistem, data kegiatan, peserta, sertifikat, pegawai', 4000)] }),
        new TableRow({ children: [dataCell('Operator', 2500, { bold: true, shading: altRowShading }), dataCell('Sebagian modul admin', 3500, { shading: altRowShading }), dataCell('Mengelola kegiatan dan peserta sesuai unit kerja', 4000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('Verifikator', 2500, { bold: true }), dataCell('Verifikasi sertifikat', 3500), dataCell('Memverifikasi dan menerbitkan sertifikat', 4000)] }),
        new TableRow({ children: [dataCell('Peserta', 2500, { bold: true, shading: altRowShading }), dataCell('Laman publik', 3500, { shading: altRowShading }), dataCell('Mengisi biodata, mengunduh sertifikat, mengisi evaluasi', 4000, { shading: altRowShading })] }),
      ]
    }),
    emptyLine(),
    subTitle('2.2 Tanggung Jawab Pengguna'),
    subSubTitle('2.2.1 Admin'),
    bulletItem('Bertanggung jawab atas pengelolaan keseluruhan data dalam sistem.'),
    bulletItem('Membuat, mengubah, dan menghapus data kegiatan, peserta, pegawai, dan unit kerja.'),
    bulletItem('Menerbitkan dan mengelola sertifikat.'),
    bulletItem('Mengelola akun pengguna dan hak akses.'),
    bulletItem('Memantau aktivitas pengguna melalui audit trail.'),
    emptyLine(),
    subSubTitle('2.2.2 Operator'),
    bulletItem('Mengelola data kegiatan dan peserta sesuai unit kerja yang ditugaskan.'),
    bulletItem('Menginput dan memperbarui data peserta kegiatan.'),
    bulletItem('Membuat link publik formulir biodata dan evaluasi.'),
    emptyLine(),
    subSubTitle('2.2.3 Peserta'),
    bulletItem('Mengisi formulir biodata dengan data yang benar dan lengkap.'),
    bulletItem('Mengunduh sertifikat setelah diterbitkan.'),
    bulletItem('Mengisi evaluasi kegiatan pada waktu yang ditentukan.')
  ]
}

function bab3() {
  return [
    pageBreakPara(),
    sectionTitle('BAB III  PROSEDUR OPERASIONAL'),
    bodyText('Bab ini menjelaskan langkah-langkah operasional untuk setiap modul dalam sistem SIMAIK.'),
    emptyLine(),

    subTitle('3.1 Autentikasi dan Manajemen Pengguna'),
    subSubTitle('3.1.1 Login Admin/Operator'),
    numberedStep(1, 'Buka browser dan akses URL sistem SIMAIK.'),
    numberedStep(2, 'Klik tombol "Login" atau akses halaman /laman-masuk.'),
    numberedStep(3, 'Masukkan alamat email yang terdaftar pada kolom "Email".'),
    numberedStep(4, 'Masukkan kata sandi pada kolom "Password".'),
    numberedStep(5, 'Klik tombol "Masuk".'),
    numberedStep(6, 'Sistem akan memverifikasi kredensial. Jika berhasil, pengguna akan diarahkan ke halaman Dashboard admin.'),
    numberedStep(7, 'Jika gagal, periksa kembali email dan kata sandi. Gunakan fitur "Lupa Password" jika diperlukan.'),
    emptyLine(),

    subSubTitle('3.1.2 Login Peserta'),
    numberedStep(1, 'Akses halaman login peserta melalui /login-peserta atau tautan yang diberikan panitia.'),
    numberedStep(2, 'Masukkan username dan kata sandi yang telah diberikan.'),
    numberedStep(3, 'Klik tombol "Masuk".'),
    numberedStep(4, 'Peserta akan diarahkan ke portal peserta.'),
    emptyLine(),

    subSubTitle('3.1.3 Logout'),
    numberedStep(1, 'Klik menu profil di pojok kanan atas.'),
    numberedStep(2, 'Pilih "Keluar" atau "Logout".'),
    numberedStep(3, 'Sistem akan mengakhiri sesi dan mengarahkan ke halaman utama.'),
    emptyLine(),

    subSubTitle('3.1.4 Mengubah Profil dan Kata Sandi'),
    numberedStep(1, 'Akses menu "Profil" di sidebar admin.'),
    numberedStep(2, 'Klik "Edit" untuk memperbarui informasi profil.'),
    numberedStep(3, 'Ubah data yang diperlukan (nama, email, dll).'),
    numberedStep(4, 'Klik "Simpan" untuk menyimpan perubahan.'),
    numberedStep(5, 'Untuk mengubah kata sandi, masukkan kata sandi lama dan kata sandi baru pada form yang tersedia.'),
    numberedStep(6, 'Klik "Ubah Kata Sandi".'),
    emptyLine(),

    subTitle('3.2 Manajemen Unit Kerja dan Tim'),
    subSubTitle('3.2.1 Menambah Unit Kerja'),
    numberedStep(1, 'Akses menu "Unit Kerja" di sidebar admin.'),
    numberedStep(2, 'Klik tab "Unit Kerja".'),
    numberedStep(3, 'Klik tombol "Tambah Unit Kerja".'),
    numberedStep(4, 'Isi formulir: Kode Unit, Nama Unit, Jenis (Utama/Pendukung), Tahun, Keterangan.'),
    numberedStep(5, 'Klik "Simpan" untuk menyimpan data.'),
    emptyLine(),

    subSubTitle('3.2.2 Menambah Sub Unit Kerja'),
    numberedStep(1, 'Di halaman Unit Kerja, klik tab "Sub Unit Kerja".'),
    numberedStep(2, 'Klik tombol "Tambah Sub Unit".'),
    numberedStep(3, 'Pilih Unit Kerja induk, isi Nama Sub Unit dan Fungsi.'),
    numberedStep(4, 'Klik "Simpan".'),
    emptyLine(),

    subSubTitle('3.2.3 Mengelola Anggota Tim'),
    numberedStep(1, 'Akses menu "Anggota Tim" di sidebar admin.'),
    numberedStep(2, 'Klik tombol "Tambah Anggota".'),
    numberedStep(3, 'Pilih Pegawai dari daftar, pilih Unit Kerja dan Sub Unit.'),
    numberedStep(4, 'Tentukan Peran (Ketua, Koordinator, Anggota, Wali Wilayah, atau Co-Wali Wilayah).'),
    numberedStep(5, 'Isi Tahun keanggotaan.'),
    numberedStep(6, 'Klik "Simpan".'),
    bodyText('Catatan: Setiap pegawai dapat memiliki lebih dari satu keanggotaan tim di unit kerja yang berbeda.', { italics: true, color: COLORS.muted }),
    emptyLine(),

    subTitle('3.3 Manajemen Pegawai dan User'),
    subSubTitle('3.3.1 Menambah Data Pegawai'),
    numberedStep(1, 'Akses menu "Pegawai & User" di sidebar admin.'),
    numberedStep(2, 'Klik tombol "Tambah Pegawai".'),
    numberedStep(3, 'Isi formulir data pegawai:'),
    bulletItem('NIP (Nomor Induk Pegawai)', 1),
    bulletItem('Nama Lengkap', 1),
    bulletItem('Tempat dan Tanggal Lahir', 1),
    bulletItem('TMT CPNS', 1),
    bulletItem('Pangkat dan Golongan', 1),
    bulletItem('Jabatan', 1),
    bulletItem('Unit Kerja', 1),
    bulletItem('Pendidikan Terakhir dan Jurusan', 1),
    bulletItem('Masa Kerja', 1),
    bulletItem('Latihan Jabatan', 1),
    bulletItem('Perkiraan Pensiun', 1),
    bulletItem('Status Kepegawaian (PNS/PPPK)', 1),
    numberedStep(4, 'Klik "Simpan" untuk menyimpan data pegawai.'),
    emptyLine(),

    subSubTitle('3.3.2 Membuat Akun User Admin'),
    numberedStep(1, 'Setelah menambah data pegawai, sistem akan otomatis membuka form pembuatan akun user.'),
    numberedStep(2, 'Masukkan alamat email untuk akun user.'),
    numberedStep(3, 'Atur kata sandi awal.'),
    numberedStep(4, 'Pilih role (Admin, Operator, atau Verifikator).'),
    numberedStep(5, 'Klik "Simpan" untuk membuat akun.'),
    bodyText('Catatan: Akun user diperlukan agar pegawai dapat login ke sistem.', { italics: true, color: COLORS.muted }),
    emptyLine(),

    subTitle('3.4 Manajemen Kegiatan'),
    subSubTitle('3.4.1 Menambah Kegiatan Baru'),
    numberedStep(1, 'Akses menu "Kegiatan" di sidebar admin.'),
    numberedStep(2, 'Klik tombol "Tambah Kegiatan".'),
    numberedStep(3, 'Isi formulir kegiatan:'),
    bulletItem('Nama Kegiatan — judul resmi kegiatan', 1),
    bulletItem('Rincian Kegiatan — penjelasan singkat', 1),
    bulletItem('Deskripsi — uraian lengkap kegiatan', 1),
    bulletItem('Tanggal Mulai dan Tanggal Selesai', 1),
    bulletItem('Lokasi Pelaksanaan', 1),
    bulletItem('Kabupaten/Kota', 1),
    bulletItem('Metode Pelaksanaan (Daring/Luring/Hybrid)', 1),
    bulletItem('Status (Berjalan/Akan Datang/Selesai/Draft)', 1),
    bulletItem('Metode Pembayaran (jika ada)', 1),
    bulletItem('Flyer Kegiatan (upload gambar)', 1),
    bulletItem('Resource URLs (Dokumentasi, Materi, Panduan)', 1),
    numberedStep(4, 'Klik "Simpan" untuk menyimpan kegiatan.'),
    emptyLine(),

    subSubTitle('3.4.2 Mengedit Kegiatan'),
    numberedStep(1, 'Di daftar kegiatan, klik tombol "Edit" pada baris kegiatan yang ingin diubah.'),
    numberedStep(2, 'Perbarui data yang diperlukan.'),
    numberedStep(3, 'Klik "Simpan" untuk menyimpan perubahan.'),
    emptyLine(),

    subSubTitle('3.4.3 Menghapus Kegiatan'),
    numberedStep(1, 'Di daftar kegiatan, klik tombol "Hapus" pada baris kegiatan.'),
    numberedStep(2, 'Konfirmasi penghapusan pada dialog konfirmasi.'),
    bodyText('Peringatan: Penghapusan kegiatan akan menghapus seluruh data terkait (peserta, penugasan, sertifikat). Pastikan data sudah tidak diperlukan.', { italics: true, color: 'CC0000' }),
    emptyLine(),

    subSubTitle('3.4.4 Mengelola Detail Kegiatan'),
    numberedStep(1, 'Klik tombol "Detail" atau "Peserta" pada kegiatan untuk melihat detail lengkap.'),
    numberedStep(2, 'Di halaman detail, Anda dapat:'),
    bulletItem('Melihat dan mengelola daftar peserta kegiatan', 1),
    bulletItem('Menyalin link publik (formulir biodata, daftar peserta, evaluasi, unduh sertifikat)', 1),
    bulletItem('Menghasilkan QR Code untuk setiap link publik', 1),
    bulletItem('Melihat status dan statistik kegiatan', 1),
    emptyLine(),

    subSubTitle('3.4.5 Filter dan Pencarian Kegiatan'),
    numberedStep(1, 'Gunakan dropdown "Tahun" untuk memfilter berdasarkan tahun kegiatan.'),
    numberedStep(2, 'Gunakan dropdown "Status" untuk memfilter berdasarkan status (Berjalan, Akan Datang, Selesai).'),
    numberedStep(3, 'Gunakan kolom pencarian untuk mencari berdasarkan nama kegiatan.'),
    emptyLine(),

    subTitle('3.5 Manajemen Peserta dan Biodata'),
    subSubTitle('3.5.1 Mengisi Biodata (Oleh Peserta — Laman Publik)'),
    numberedStep(1, 'Peserta mengakses link formulir biodata yang dibagikan panitia.'),
    numberedStep(2, 'Formulir menampilkan input untuk:'),
    bulletItem('Data Pribadi: Nama Lengkap, NIP, Tempat/Tanggal Lahir, Jenis Kelamin, NPWP/NIK, Email, No. HP', 1),
    bulletItem('Data Instansi: Nama Instansi, Alamat, Kabupaten/Kota, Provinsi', 1),
    bulletItem('Data Kepegawaian: Pangkat, Golongan, Jabatan', 1),
    bulletItem('Data Rekening: Nama Bank, Nomor Rekening, Atas Nama', 1),
    bulletItem('Provider Pulsa (untuk penggantian)', 1),
    bulletItem('No. Surat Tugas', 1),
    bulletItem('Tanda Tangan Digital (gambar)', 1),
    numberedStep(3, 'Isi seluruh data dengan benar dan lengkap.'),
    numberedStep(4, 'Klik "Kirim" atau "Simpan" untuk mengirimkan biodata.'),
    numberedStep(5, 'Sistem akan menyimpan data dan menampilkan konfirmasi.'),
    emptyLine(),

    subSubTitle('3.5.2 Menambah Peserta (Admin)'),
    numberedStep(1, 'Akses menu "Peserta" di sidebar admin, atau buka halaman peserta dari detail kegiatan.'),
    numberedStep(2, 'Klik tombol "Tambah Peserta".'),
    numberedStep(3, 'Pilih kegiatan terkait dari dropdown.'),
    numberedStep(4, 'Isi data peserta (sama seperti formulir publik).'),
    numberedStep(5, 'Tentukan peran peserta (Peserta, Narasumber, Panitia, Pendamping).'),
    numberedStep(6, 'Klik "Simpan".'),
    emptyLine(),

    subSubTitle('3.5.3 Mengedit Data Peserta'),
    numberedStep(1, 'Di daftar peserta, klik tombol "Edit" pada baris peserta.'),
    numberedStep(2, 'Perbarui data yang diperlukan.'),
    numberedStep(3, 'Klik "Simpan".'),
    emptyLine(),

    subSubTitle('3.5.4 Menghapus Peserta'),
    numberedStep(1, 'Di daftar peserta, klik tombol "Hapus".'),
    numberedStep(2, 'Konfirmasi penghapusan.'),
    emptyLine(),

    subSubTitle('3.5.5 Export dan Download Data Peserta'),
    numberedStep(1, 'Di halaman daftar peserta, gunakan tombol "Export Excel" untuk mengunduh data dalam format XLSX.'),
    numberedStep(2, 'Gunakan tombol "Download DOCX" untuk mengunduh biodata peserta dalam format DOCX.'),
    numberedStep(3, 'Untuk download batch, pilih beberapa peserta lalu klik "Download Batch" (format ZIP).'),
    emptyLine(),

    subSubTitle('3.5.6 Pencarian dan Filter Peserta'),
    numberedStep(1, 'Gunakan kolom pencarian untuk mencari berdasarkan nama, NIP, instansi, atau kabupaten/kota.'),
    numberedStep(2, 'Gunakan sorting (ascending/descending) pada kolom tabel.'),
    numberedStep(3, 'Gunakan navigasi pagination untuk berpindah halaman.'),
    emptyLine(),

    subTitle('3.6 Manajemen Sertifikat'),
    subSubTitle('3.6.1 Menerbitkan Sertifikat Individual'),
    numberedStep(1, 'Di halaman peserta kegiatan, klik tombol "Buat Sertifikat" pada baris peserta.'),
    numberedStep(2, 'Isi data sertifikat: Nomor Sertifikat, Tanggal TTD, Penandatangan.'),
    numberedStep(3, 'Pilih template sertifikat yang tersedia.'),
    numberedStep(4, 'Klik "Generate" untuk membuat sertifikat.'),
    numberedStep(5, 'Status sertifikat akan berubah menjadi "Terbit".'),
    emptyLine(),

    subSubTitle('3.6.2 Menerbitkan Sertifikat Massal (Batch)'),
    numberedStep(1, 'Di halaman peserta kegiatan, pilih beberapa peserta yang akan diterbitkan sertifikatnya.'),
    numberedStep(2, 'Klik tombol "Generate Massal".'),
    numberedStep(3, 'Atur template, nomor sertifikat awal, dan penandatangan.'),
    numberedStep(4, 'Klik "Generate Semua".'),
    numberedStep(5, 'Sistem akan memproses dan menerbitkan sertifikat untuk semua peserta terpilih.'),
    emptyLine(),

    subSubTitle('3.6.3 Mengunduh Sertifikat (Peserta — Laman Publik)'),
    numberedStep(1, 'Peserta mengakses halaman unduh sertifikat melalui link yang dibagikan.'),
    numberedStep(2, 'Cari nama peserta menggunakan kolom pencarian.'),
    numberedStep(3, 'Klik tombol "Unduh" pada baris peserta.'),
    numberedStep(4, 'Sertifikat akan diunduh dalam format PDF.'),
    emptyLine(),

    subTitle('3.7 Evaluasi Kegiatan'),
    subSubTitle('3.7.1 Mengisi Evaluasi (Peserta — Laman Publik)'),
    bodyText('Evaluasi kegiatan hanya dapat diisi pada hari terakhir kegiatan (sesuai tanggal selesai).'),
    emptyLine(),
    numberedStep(1, 'Peserta mengakses link evaluasi yang dibagikan panitia.'),
    numberedStep(2, 'Bagian I — Evaluasi Program, berisi aspek:'),
    bulletItem('Kesesuaian program dengan kebutuhan', 1),
    bulletItem('Kualitas materi', 1),
    bulletItem('Kesesuaian fasilitas', 1),
    bulletItem('Kesesuaian waktu pelaksanaan', 1),
    bulletItem('Kualitas narasumber', 1),
    bulletItem('Manfaat kegiatan', 1),
    numberedStep(3, 'Bagian II — Evaluasi Pelaksanaan, berisi aspek:'),
    bulletItem('Kedisiplinan penyelenggara', 1),
    bulletItem('Keramahan panitia', 1),
    bulletItem('Kualitas koordinasi', 1),
    bulletItem('Kualitas dokumentasi', 1),
    numberedStep(4, 'Beri penilaian skala 1-5 untuk setiap aspek (1 = Sangat Tidak Puas, 5 = Sangat Puas).'),
    numberedStep(5, 'Isi kolom saran dan masukan (opsional).'),
    numberedStep(6, 'Klik "Kirim Evaluasi".'),
    emptyLine(),

    subSubTitle('3.7.2 Melihat Laporan Evaluasi (Publik)'),
    numberedStep(1, 'Akses halaman laporan evaluasi melalui link yang tersedia.'),
    numberedStep(2, 'Laporan menampilkan:'),
    bulletItem('Grafik distribusi jawaban per aspek (Chart.js)', 1),
    bulletItem('Rata-rata skor per aspek', 1),
    bulletItem('Daftar komentar dan saran peserta', 1),
    emptyLine(),

    subTitle('3.8 Penugasan Pegawai'),
    subSubTitle('3.8.1 Melihat Data Penugasan'),
    numberedStep(1, 'Akses menu "Penugasan" di sidebar admin.'),
    numberedStep(2, 'Tabel menampilkan daftar penugasan dengan kolom: Nama Pegawai, Kegiatan, Peran, Tanggal, Kab/Kota, Lokasi.'),
    numberedStep(3, 'Gunakan kolom pencarian dan filter untuk menemukan data spesifik.'),
    emptyLine(),

    subSubTitle('3.8.2 Export Data Penugasan'),
    numberedStep(1, 'Klik tombol "Export Excel" di halaman penugasan.'),
    numberedStep(2, 'File XLSX akan diunduh berisi seluruh data penugasan yang terfilter.'),
    emptyLine(),

    subTitle('3.9 Dashboard dan Statistik'),
    numberedStep(1, 'Setelah login, admin akan langsung diarahkan ke halaman Dashboard.'),
    numberedStep(2, 'Dashboard menampilkan:'),
    bulletItem('Profil pegawai yang sedang login', 1),
    bulletItem('Statistik ringkasan: Total Kegiatan, Total Peserta, Sertifikat Terbit, Kegiatan Berjalan', 1),
    bulletItem('Grafik kegiatan per bulan (Chart.js bar chart)', 1),
    bulletItem('Daftar kegiatan terbaru', 1),
    bulletItem('Quick actions untuk navigasi cepat', 1),
    emptyLine(),

    subTitle('3.10 Laman Publik'),
    subSubTitle('3.10.1 Landing Page'),
    bodyText('Halaman utama (publik) menampilkan:'),
    bulletItem('Kartu unit kerja (Timker) — PAUD, SD, SMP, SMA/SMK, Subbag Umum'),
    bulletItem('Klik kartu unit kerja untuk melihat daftar kegiatan terkait'),
    bulletItem('Detail kegiatan dengan informasi lengkap'),
    bulletItem('Tombol "Share" untuk membagikan link halaman kegiatan'),
    emptyLine(),

    subSubTitle('3.10.2 Halaman Detail Kegiatan Publik'),
    bodyText('Halaman ini menampilkan informasi lengkap kegiatan:'),
    bulletItem('Nama, deskripsi, tanggal, lokasi, metode pelaksanaan'),
    bulletItem('Status kegiatan (Akan Datang, Berjalan, Selesai)'),
    bulletItem('Flyer kegiatan'),
    bulletItem('Link ke: Formulir Biodata, Daftar Peserta, Evaluasi, Unduh Sertifikat'),
    bulletItem('QR Code untuk akses cepat'),
    bulletItem('Resource URLs (Dokumentasi, Materi, Panduan)'),
    emptyLine(),

    subSubTitle('3.10.3 Verifikasi Sertifikat'),
    bodyText('Pengunjung dapat memverifikasi keaslian sertifikat melalui halaman unduh sertifikat publik. Sistem akan menampilkan status sertifikat (terbit/draft) beserta data peserta terkait.')
  ]
}

function bab4() {
  return [
    pageBreakPara(),
    sectionTitle('BAB IV  PENANGANAN KESALAHAN'),
    subTitle('4.1 Masalah Umum dan Solusi'),
    emptyLine(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell('No', 800), headerCell('Masalah', 3500), headerCell('Solusi', 5700)] }),
        new TableRow({ children: [dataCell('1', 800), dataCell('Gagal login — email atau kata sandi salah', 3500), dataCell('Periksa kembali email dan kata sandi. Pastikan Caps Lock tidak aktif. Hubungi admin untuk reset kata sandi.', 5700)] }),
        new TableRow({ children: [dataCell('2', 800, { shading: altRowShading }), dataCell('Halaman tidak dapat diakses (error 404)', 3500, { shading: altRowShading }), dataCell('Periksa URL yang diakses. Pastikan link tidak terpotong. Gunakan navigasi menu.', 5700, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('3', 800), dataCell('Upload file gagal', 3500), dataCell('Periksa ukuran dan format file. Pastikan konfigurasi server PHP (upload_max_filesize & post_max_size) mencukupi.', 5700)] }),
        new TableRow({ children: [dataCell('4', 800, { shading: altRowShading }), dataCell('Data tidak muncul setelah disimpan', 3500, { shading: altRowShading }), dataCell('Refresh halaman (F5). Periksa koneksi internet. Periksa filter yang aktif.', 5700, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('5', 800), dataCell('Sertifikat gagal di-generate', 3500), dataCell('Pastikan data peserta lengkap (nama, peran). Pastikan template sertifikat tersedia. Coba generate ulang.', 5700)] }),
        new TableRow({ children: [dataCell('6', 800, { shading: altRowShading }), dataCell('QR Code tidak muncul', 3500, { shading: altRowShading }), dataCell('Pastikan link publik valid. Tunggu beberapa saat karena QR di-generate secara asinkron. Refresh halaman.', 5700, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('7', 800), dataCell('Evaluasi tidak dapat diisi', 3500), dataCell('Evaluasi hanya tersedia pada hari terakhir kegiatan. Periksa tanggal selesai kegiatan.', 5700)] }),
        new TableRow({ children: [dataCell('8', 800, { shading: altRowShading }), dataCell('Export Excel/DOCX gagal', 3500, { shading: altRowShading }), dataCell('Pastikan browser mengizinkan download. Periksa pop-up blocker. Coba gunakan browser berbeda.', 5700, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('9', 800), dataCell('Sistem terasa lambat', 3500), dataCell('Bersihkan cache browser. Pastikan koneksi internet stabil. Kurangi jumlah data yang ditampilkan per halaman.', 5700)] }),
        new TableRow({ children: [dataCell('10', 800, { shading: altRowShading }), dataCell('Sesi berakhir tiba-tiba', 3500, { shading: altRowShading }), dataCell('Token sesi telah kedaluwarsa. Login ulang. Sistem menyimpan sesi di localStorage.', 5700, { shading: altRowShading })] }),
      ]
    }),
    emptyLine(),
    subTitle('4.2 Pelaporan Masalah'),
    bodyText('Jika menemukan masalah yang tidak tercantum di atas:'),
    numberedStep(1, 'Catat langkah-langkah yang dilakukan sebelum masalah terjadi.'),
    numberedStep(2, 'Ambil screenshot layar yang menunjukkan pesan error.'),
    numberedStep(3, 'Laporkan kepada administrator sistem melalui saluran komunikasi yang tersedia.'),
    numberedStep(4, 'Sertakan informasi: browser yang digunakan, waktu kejadian, dan akun yang digunakan.'),
    emptyLine(),
    subTitle('4.3 Pemulihan Data'),
    bodyText('Sistem SIMAIK memiliki mekanisme:'),
    bulletItem('Data disimpan secara real-time ke server API backend.'),
    bulletItem('Fallback ke data lokal (JSON) jika API tidak tersedia (mode pengembangan).'),
    bulletItem('Fitur Data Sync Monitor untuk memantau status sinkronisasi data.'),
    bulletItem('Audit trail (log aktivitas) untuk melacak perubahan data.')
  ]
}

function bab5() {
  return [
    pageBreakPara(),
    sectionTitle('BAB V  PENUTUP'),
    bodyText(
      'Prosedur Operasional Standar (POS) ini disusun sebagai panduan komprehensif dalam penggunaan Sistem Manajemen Informasi Kegiatan (SIMAIK) di lingkungan Badan Pengembangan Mutu Pendidikan (BPMP) Nusa Tenggara Barat.'
    ),
    emptyLine(),
    bodyText(
      'Diharapkan seluruh pengguna sistem dapat mengikuti prosedur yang telah ditetapkan demi menjaga konsistensi, keamanan, dan kualitas pengelolaan data kegiatan pendidikan.'
    ),
    emptyLine(),
    bodyText(
      'POS ini akan diperbarui secara berkala seiring dengan pengembangan fitur-fitur baru dalam sistem SIMAIK. Masukan dan saran perbaikan sangat diharapkan untuk penyempurnaan dokumen ini.'
    ),
    emptyLine(),
    emptyLine(),
    bodyText('Mataram, 2025'),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    bodyText('Mengetahui,                                         Disusun oleh,'),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    bodyText('_________________________                    _________________________'),
    bodyText('Kepala BPMP NTB                                      Tim Pengembang SIMAIK'),
    bodyText('NIP. .......................................                                           NIP. .......................................'),
  ]
}

function lampiran() {
  return [
    pageBreakPara(),
    sectionTitle('LAMPIRAN'),
    subTitle('Lampiran 1: Daftar Menu Sistem'),
    emptyLine(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell('No', 600), headerCell('Menu', 3000), headerCell('Lokasi', 2500), headerCell('Fungsi Utama', 3900)] }),
        new TableRow({ children: [dataCell('1', 600), dataCell('Dashboard', 3000, { bold: true }), dataCell('Sidebar Admin', 2500), dataCell('Ringkasan statistik dan grafik kegiatan', 3900)] }),
        new TableRow({ children: [dataCell('2', 600, { shading: altRowShading }), dataCell('Kegiatan', 3000, { bold: true, shading: altRowShading }), dataCell('Sidebar Admin', 2500, { shading: altRowShading }), dataCell('CRUD kegiatan, generate link publik', 3900, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('3', 600), dataCell('Peserta', 3000, { bold: true }), dataCell('Sidebar Admin', 2500), dataCell('CRUD peserta, generate sertifikat, export data', 3900)] }),
        new TableRow({ children: [dataCell('4', 600, { shading: altRowShading }), dataCell('Pegawai & User', 3000, { bold: true, shading: altRowShading }), dataCell('Sidebar Admin', 2500, { shading: altRowShading }), dataCell('CRUD pegawai dan akun user admin', 3900, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('5', 600), dataCell('Penugasan', 3000, { bold: true }), dataCell('Sidebar Admin', 2500), dataCell('View data penugasan pegawai, export', 3900)] }),
        new TableRow({ children: [dataCell('6', 600, { shading: altRowShading }), dataCell('Unit Kerja', 3000, { bold: true, shading: altRowShading }), dataCell('Sidebar Admin', 2500, { shading: altRowShading }), dataCell('CRUD unit kerja dan sub unit kerja', 3900, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('7', 600), dataCell('Anggota Tim', 3000, { bold: true }), dataCell('Sidebar Admin', 2500), dataCell('CRUD keanggotaan tim per unit kerja', 3900)] }),
        new TableRow({ children: [dataCell('8', 600, { shading: altRowShading }), dataCell('Profil', 3000, { bold: true, shading: altRowShading }), dataCell('Sidebar Admin', 2500, { shading: altRowShading }), dataCell('Lihat/edit profil, ubah kata sandi', 3900, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('9', 600), dataCell('Landing Page', 3000, { bold: true }), dataCell('Halaman Publik', 2500), dataCell('Navigasi kegiatan per unit kerja', 3900)] }),
        new TableRow({ children: [dataCell('10', 600, { shading: altRowShading }), dataCell('Formulir Biodata', 3000, { bold: true, shading: altRowShading }), dataCell('Halaman Publik', 2500, { shading: altRowShading }), dataCell('Pengisian data peserta', 3900, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('11', 600), dataCell('Daftar Peserta', 3000, { bold: true }), dataCell('Halaman Publik', 2500), dataCell('Lihat daftar peserta kegiatan', 3900)] }),
        new TableRow({ children: [dataCell('12', 600, { shading: altRowShading }), dataCell('Unduh Sertifikat', 3000, { bold: true, shading: altRowShading }), dataCell('Halaman Publik', 2500, { shading: altRowShading }), dataCell('Download sertifikat PDF', 3900, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('13', 600), dataCell('Evaluasi', 3000, { bold: true }), dataCell('Halaman Publik', 2500), dataCell('Isi evaluasi kegiatan (skala 1-5)', 3900)] }),
        new TableRow({ children: [dataCell('14', 600, { shading: altRowShading }), dataCell('Laporan Evaluasi', 3000, { bold: true, shading: altRowShading }), dataCell('Halaman Publik', 2500, { shading: altRowShading }), dataCell('Grafik dan statistik evaluasi', 3900, { shading: altRowShading })] }),
      ]
    }),
    emptyLine(),
    subTitle('Lampiran 2: Status Kegiatan'),
    emptyLine(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell('Status', 3000), headerCell('Keterangan', 7000)] }),
        new TableRow({ children: [dataCell('Akan Datang', 3000, { bold: true }), dataCell('Kegiatan yang tanggal mulainya belum tiba', 7000)] }),
        new TableRow({ children: [dataCell('Berjalan', 3000, { bold: true, shading: altRowShading }), dataCell('Kegiatan yang sedang berlangsung (hari ini berada di antara tanggal mulai dan selesai)', 7000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('Selesai', 3000, { bold: true }), dataCell('Kegiatan yang telah melewati tanggal selesai', 7000)] }),
        new TableRow({ children: [dataCell('Draft', 3000, { bold: true, shading: altRowShading }), dataCell('Kegiatan dalam tahap perencanaan, belum dipublikasikan', 7000, { shading: altRowShading })] }),
      ]
    }),
    emptyLine(),
    subTitle('Lampiran 3: Metode Pelaksanaan'),
    emptyLine(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell('Metode', 3000), headerCell('Keterangan', 7000)] }),
        new TableRow({ children: [dataCell('Daring', 3000, { bold: true }), dataCell('Pelaksanaan secara online/dalam jaringan', 7000)] }),
        new TableRow({ children: [dataCell('Luring', 3000, { bold: true, shading: altRowShading }), dataCell('Pelaksanaan secara offline/luar jaringan (tatap muka)', 7000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('Hybrid', 3000, { bold: true }), dataCell('Pelaksanaan gabungan daring dan luring', 7000)] }),
      ]
    }),
    emptyLine(),
    subTitle('Lampiran 4: Skala Penilaian Evaluasi'),
    emptyLine(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [headerCell('Skor', 1500), headerCell('Label', 2500), headerCell('Keterangan', 6000)] }),
        new TableRow({ children: [dataCell('1', 1500), dataCell('Sangat Tidak Puas', 2500, { bold: true }), dataCell('Tidak sesuai harapan sama sekali', 6000)] }),
        new TableRow({ children: [dataCell('2', 1500, { shading: altRowShading }), dataCell('Tidak Puas', 2500, { bold: true, shading: altRowShading }), dataCell('Kurang sesuai harapan', 6000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('3', 1500), dataCell('Cukup', 2500, { bold: true }), dataCell('Sesuai harapan secara umum', 6000)] }),
        new TableRow({ children: [dataCell('4', 1500, { shading: altRowShading }), dataCell('Puas', 2500, { bold: true, shading: altRowShading }), dataCell('Melebihi harapan', 6000, { shading: altRowShading })] }),
        new TableRow({ children: [dataCell('5', 1500), dataCell('Sangat Puas', 2500, { bold: true }), dataCell('Sangat sesuai/melebihi harapan', 6000)] }),
      ]
    })
  ]
}

export async function generatePOSDocx() {
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT }
          ]
        }
      ]
    },
    styles: {
      default: {
        document: {
          run: { font: FONT.family, size: 20, color: COLORS.text }
        },
        heading1: {
          run: { font: FONT.heading, size: 28, bold: true, color: COLORS.primary }
        },
        heading2: {
          run: { font: FONT.heading, size: 24, bold: true, color: COLORS.secondary }
        },
        heading3: {
          run: { font: FONT.family, size: 22, bold: true, color: COLORS.accent }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1)
            }
          }
        },
        children: [...coverPage()]
      },
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1)
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'POS SIMAIK v1.2.0', font: FONT.family, size: 16, color: COLORS.muted, italics: true })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Halaman ', font: FONT.family, size: 16, color: COLORS.muted }),
                  new TextRun({ children: [PageNumber.CURRENT], font: FONT.family, size: 16, color: COLORS.muted }),
                  new TextRun({ text: ' dari ', font: FONT.family, size: 16, color: COLORS.muted }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT.family, size: 16, color: COLORS.muted })
                ]
              })
            ]
          })
        },
        children: [
          ...daftarIsi(),
          pageBreakPara(),
          ...bab1(),
          ...bab2(),
          ...bab3(),
          ...bab4(),
          ...bab5(),
          ...lampiran()
        ]
      }
    ]
  })

  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, 'POS_SIMAIK_v1.2.0.docx')
  return blob
}

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
