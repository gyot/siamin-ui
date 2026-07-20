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
  Header,
  Footer,
  PageNumber,
  convertInchesToTwip,
  LevelFormat
} from 'docx'
import fs from 'fs'

const C = {
  primary: '1E40AF',
  secondary: '1E3A5F',
  accent: '2563EB',
  hdrBg: '1E3A5F',
  hdrTxt: 'FFFFFF',
  alt: 'F0F4FF',
  border: 'AAAAAA',
  text: '222222',
  muted: '666666',
  red: 'CC0000'
}

const F = 'Calibri'
const FL = 'Calibri Light'

const bdr = { style: BorderStyle.SINGLE, size: 1, color: C.border }
const cb = { top: bdr, bottom: bdr, left: bdr, right: bdr }
const hdrShd = { type: ShadingType.SOLID, color: C.hdrBg, fill: C.hdrBg }
const altShd = { type: ShadingType.SOLID, color: C.alt, fill: C.alt }

function hc(t, w) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: hdrShd, borders: cb,
    children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: t, bold: true, color: C.hdrTxt, font: F, size: 20 })] })]
  })
}

function dc(t, w, o = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: cb, shading: o.shd,
    children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: t || '-', font: F, size: 20, color: C.text, ...o })] })]
  })
}

function h1(t) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 }, children: [new TextRun({ text: t, bold: true, font: FL, size: 30, color: C.primary })] })
}
function h2(t) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 160 }, children: [new TextRun({ text: t, bold: true, font: FL, size: 26, color: C.secondary })] })
}
function h3(t) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 220, after: 120 }, children: [new TextRun({ text: t, bold: true, font: F, size: 22, color: C.accent })] })
}
function p(t, o = {}) {
  return new Paragraph({ spacing: { before: 60, after: 60, line: 360 }, indent: o.indent ? { left: convertInchesToTwip(0.3) } : undefined, children: [new TextRun({ text: t, font: F, size: 20, color: C.text, ...o })] })
}
function bul(t, lv = 0) {
  return new Paragraph({ spacing: { before: 40, after: 40, line: 340 }, indent: { left: convertInchesToTwip(0.3 + lv * 0.35) }, children: [new TextRun({ text: '\u2022 ', font: F, size: 20, bold: true, color: C.accent }), new TextRun({ text: t, font: F, size: 20, color: C.text })] })
}
function step(n, t) {
  return new Paragraph({ spacing: { before: 60, after: 60, line: 340 }, indent: { left: convertInchesToTwip(0.3) }, children: [new TextRun({ text: `${n}. `, font: F, size: 20, bold: true, color: C.accent }), new TextRun({ text: t, font: F, size: 20, color: C.text })] })
}
function gap() { return new Paragraph({ spacing: { before: 80, after: 80 } }) }
function brk() { return new Paragraph({ children: [new PageBreak()] }) }

function cover() {
  return [
    gap(), gap(), gap(), gap(), gap(), gap(),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH', font: FL, size: 24, bold: true, color: C.primary })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'BADAN PENGEMBANGAN MUTU PENDIDIKAN (BPMP)', font: FL, size: 22, bold: true, color: C.secondary })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'NUSA TENGGARA BARAT', font: FL, size: 22, bold: true, color: C.secondary })] }),
    gap(), gap(),
    new Paragraph({ alignment: AlignmentType.CENTER, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.primary } }, children: [] }),
    gap(),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'STANDAR OPERASIONAL PROSEDUR (SOP)', font: FL, size: 36, bold: true, color: C.primary })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'PENGGUNAAN APLIKASI', font: FL, size: 30, bold: true, color: C.secondary })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'SISTEM MANAJEMEN INFORMASI KEGIATAN', font: FL, size: 30, bold: true, color: C.secondary })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: '(SIMAIK)', font: FL, size: 26, bold: true, color: C.accent })] }),
    gap(), gap(), gap(), gap(),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Versi 1.0', font: F, size: 20, color: C.muted })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Juni 2025', font: F, size: 20, color: C.muted })] }),
    gap(), gap(), gap(), gap(), gap(),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Dokumen Internal \u2014 Terbatas', font: F, size: 18, italics: true, color: C.muted })] }),
  ]
}

function toc() {
  return [
    h1('DAFTAR ISI'), gap(),
    p('Halaman Sampul  .............................................................  i'),
    p('Daftar Isi  ...................................................................  ii'),
    p('BAB I   Pendahuluan  .........................................................  1'),
    p('         1.1  Latar Belakang  ................................................  1'),
    p('         1.2  Maksud dan Tujuan  ...........................................  1'),
    p('         1.3  Ruang Lingkup  .................................................  2'),
    p('         1.4  Definisi dan Istilah  ...........................................  2'),
    p('BAB II   Akses dan Navigasi Sistem  .......................................  3'),
    p('         2.1  Mengakses Aplikasi  ...........................................  3'),
    p('         2.2  Login Admin  ....................................................  3'),
    p('         2.3  Login Peserta  ..................................................  3'),
    p('         2.4  Logout  ..........................................................  4'),
    p('         2.5  Navigasi Menu Admin  ..........................................  4'),
    p('         2.6  Mengubah Profil dan Kata Sandi  .............................  4'),
    p('BAB III  Prosedur Pengelolaan Data Master  ..............................  5'),
    p('         3.1  Unit Kerja  ......................................................  5'),
    p('         3.2  Sub Unit Kerja  ................................................  5'),
    p('         3.3  Pegawai  ........................................................  6'),
    p('         3.4  Akun User  .....................................................  6'),
    p('         3.5  Anggota Tim  ...................................................  7'),
    p('BAB IV   Prosedur Pengelolaan Kegiatan  ..................................  8'),
    p('         4.1  Menambah Kegiatan  ...........................................  8'),
    p('         4.2  Mengedit Kegiatan  ............................................  9'),
    p('         4.3  Menghapus Kegiatan  ..........................................  9'),
    p('         4.4  Filter dan Pencarian  ..........................................  9'),
    p('         4.5  Generate Link Publik  .......................................... 10'),
    p('BAB V    Prosedur Pengelolaan Peserta  .................................... 11'),
    p('         5.1  Mengisi Biodata (Peserta)  ................................... 11'),
    p('         5.2  Menambah Peserta (Admin)  .................................. 12'),
    p('         5.3  Edit dan Hapus Peserta  ...................................... 12'),
    p('         5.4  Export Data  .................................................... 13'),
    p('BAB VI   Prosedur Sertifikat  ................................................ 14'),
    p('         6.1  Generate Sertifikat Individual  ............................... 14'),
    p('         6.2  Generate Sertifikat Massal  .................................. 14'),
    p('         6.3  Unduh Sertifikat (Publik)  ................................... 15'),
    p('BAB VII  Prosedur Evaluasi  .................................................. 16'),
    p('         7.1  Mengisi Evaluasi (Peserta)  .................................. 16'),
    p('         7.2  Laporan Evaluasi  ............................................. 16'),
    p('BAB VIII Prosedur Penugasan  ................................................ 17'),
    p('BAB IX   Dashboard dan Laman Publik  ..................................... 18'),
    p('BAB X    Penanganan Masalah  ................................................ 19'),
    p('BAB XI   Penutup  ............................................................. 20'),
    p('Lampiran  ...................................................................... 21'),
  ]
}

function bab1() {
  return [
    h1('BAB I  PENDAHULUAN'),
    h2('1.1  Latar Belakang'),
    p('Sistem Manajemen Informasi Kegiatan (SIMAIK) adalah aplikasi berbasis web yang dikembangkan oleh Badan Pengembangan Mutu Pendidikan (BPMP) Nusa Tenggara Barat untuk mendigitalisasi pengelolaan kegiatan pendidikan. Aplikasi ini mencakup manajemen kegiatan, peserta, sertifikat, penugasan pegawai, evaluasi, dan pelaporan.'),
    p('Standar Operasional Prosedur (SOP) ini disusun agar seluruh pengguna\u2014baik admin/operator maupun peserta\u2014dapat mengoperasikan aplikasi secara benar, konsisten, dan efisien.'),
    gap(),
    h2('1.2  Maksud dan Tujuan'),
    p('Maksud:'),
    bul('Menyediakan panduan langkah-demi-langkah yang jelas untuk setiap fitur SIMAIK.'),
    bul('Menstandarisasi cara kerja seluruh pengguna sistem.'),
    p('Tujuan:'),
    bul('Memudahkan pengguna baru memahami alur kerja aplikasi.'),
    bul('Meminimalisir kesalahan input dan pengelolaan data.'),
    bul('Menjadi dokumen acuan pelatihan dan audit.'),
    gap(),
    h2('1.3  Ruang Lingkup'),
    p('SOP ini mencakup seluruh modul SIMAIK:'),
    bul('Autentikasi dan Manajemen Pengguna'),
    bul('Data Master (Unit Kerja, Pegawai, Anggota Tim)'),
    bul('Manajemen Kegiatan'),
    bul('Manajemen Peserta dan Biodata'),
    bul('Manajemen Sertifikat'),
    bul('Evaluasi Kegiatan'),
    bul('Penugasan Pegawai'),
    bul('Dashboard, Statistik, dan Laman Publik'),
    gap(),
    h2('1.4  Definisi dan Istilah'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [hc('Istilah', 2800), hc('Definisi', 7200)] }),
        new TableRow({ children: [dc('SIMAIK', 2800, { bold: true }), dc('Sistem Manajemen Informasi Kegiatan \u2014 platform digital BPMP NTB', 7200)] }),
        new TableRow({ children: [dc('Kegiatan', 2800, { bold: true, shd: altShd }), dc('Program atau event pendidikan yang dikelola melalui sistem', 7200, { shd: altShd })] }),
        new TableRow({ children: [dc('Peserta', 2800, { bold: true }), dc('Individu yang terlibat dalam kegiatan (peserta, narasumber, panitia, pendamping)', 7200)] }),
        new TableRow({ children: [dc('Sertifikat', 2800, { bold: true, shd: altShd }), dc('Dokumen penghargaan digital yang diterbitkan setelah kegiatan selesai', 7200, { shd: altShd })] }),
        new TableRow({ children: [dc('Timker', 2800, { bold: true }), dc('Tim Kerja \u2014 unit kerja fungsional (PAUD, SD, SMP, SMA/SMK, Subbag Umum)', 7200)] }),
        new TableRow({ children: [dc('Biodata', 2800, { bold: true, shd: altShd }), dc('Data identitas lengkap peserta yang diisi melalui formulir digital', 7200, { shd: altShd })] }),
        new TableRow({ children: [dc('Evaluasi', 2800, { bold: true }), dc('Penilaian program dan pelaksanaan kegiatan oleh peserta (skala 1\u20135)', 7200)] }),
        new TableRow({ children: [dc('Surat Tugas', 2800, { bold: true, shd: altShd }), dc('Dokumen resmi penugasan pegawai yang dapat di-generate dari sistem', 7200, { shd: altShd })] }),
      ]
    }),
  ]
}

function bab2() {
  return [
    brk(),
    h1('BAB II  AKSES DAN NAVIGASI SISTEM'),
    h2('2.1  Mengakses Aplikasi'),
    p('Buka browser (Google Chrome, Mozilla Firefox, atau Microsoft Edge) dan masukkan URL aplikasi SIMAIK di address bar. Halaman utama (landing page) akan menampilkan kartu unit kerja dan daftar kegiatan.'),
    gap(),
    h2('2.2  Login Admin / Operator'),
    step(1, 'Klik tombol "Login" atau akses langsung URL /laman-masuk.'),
    step(2, 'Masukkan alamat email pada kolom "Email".'),
    step(3, 'Masukkan kata sandi pada kolom "Password".'),
    step(4, 'Klik tombol "Masuk".'),
    step(5, 'Jika berhasil, Anda akan diarahkan ke halaman Dashboard admin.'),
    step(6, 'Jika gagal, periksa kembali email dan kata sandi. Pastikan Caps Lock tidak aktif.'),
    gap(),
    h2('2.3  Login Peserta'),
    step(1, 'Akses URL login peserta yang diberikan panitia (/login-peserta).'),
    step(2, 'Masukkan username dan kata sandi.'),
    step(3, 'Klik "Masuk" untuk masuk ke portal peserta.'),
    gap(),
    h2('2.4  Logout'),
    step(1, 'Klik ikon profil atau nama pengguna di pojok kanan atas.'),
    step(2, 'Pilih menu "Keluar" / "Logout".'),
    step(3, 'Sistem akan mengakhiri sesi dan mengarahkan ke halaman utama.'),
    gap(),
    h2('2.5  Navigasi Menu Admin'),
    p('Setelah login sebagai admin, sidebar di sisi kiri menyediakan menu utama:'),
    bul('Dashboard \u2014 ringkasan statistik dan grafik'),
    bul('Kegiatan \u2014 manajemen kegiatan'),
    bul('Pegawai & User \u2014 manajemen pegawai dan akun'),
    bul('Penugasan \u2014 data penugasan pegawai'),
    gap(),
    h2('2.6  Mengubah Profil dan Kata Sandi'),
    step(1, 'Akses menu "Profil" dari sidebar.'),
    step(2, 'Klik tombol "Edit" untuk memperbarui data profil (nama, email, dll).'),
    step(3, 'Klik "Simpan" setelah selesai.'),
    step(4, 'Untuk mengubah kata sandi, masukkan kata sandi lama dan kata sandi baru pada form yang tersedia, lalu klik "Ubah Kata Sandi".'),
  ]
}

function bab3() {
  return [
    brk(),
    h1('BAB III  PROSEDUR PENGELOLAAN DATA MASTER'),
    h2('3.1  Unit Kerja'),
    h3('3.1.1  Menambah Unit Kerja'),
    step(1, 'Klik menu "Unit Kerja" di sidebar admin.'),
    step(2, 'Pastikan berada di tab "Unit Kerja".'),
    step(3, 'Klik tombol "Tambah Unit Kerja".'),
    step(4, 'Isi formulir:'),
    bul('Kode Unit \u2014 kode unik identifikasi (contoh: 001, 002)', 1),
    bul('Nama Unit \u2014 nama lengkap unit kerja', 1),
    bul('Jenis \u2014 pilih "Utama" atau "Pendukung"', 1),
    bul('Tahun \u2014 tahun berlaku', 1),
    bul('Keterangan \u2014 deskripsi singkat (opsional)', 1),
    step(5, 'Klik "Simpan".'),
    gap(),
    h3('3.1.2  Mengedit / Menghapus Unit Kerja'),
    step(1, 'Cari unit kerja di daftar menggunakan kolom pencarian atau filter.'),
    step(2, 'Klik tombol "Edit" untuk mengubah data, lalu klik "Simpan".'),
    step(3, 'Klik tombol "Hapus" untuk menghapus, lalu konfirmasi pada dialog.'),
    gap(),
    h2('3.2  Sub Unit Kerja'),
    step(1, 'Di halaman Unit Kerja, klik tab "Sub Unit Kerja".'),
    step(2, 'Klik tombol "Tambah Sub Unit".'),
    step(3, 'Pilih Unit Kerja induk dari dropdown.'),
    step(4, 'Isi Nama Sub Unit dan Fungsi.'),
    step(5, 'Klik "Simpan".'),
    gap(),
    h2('3.3  Pegawai'),
    h3('3.3.1  Menambah Data Pegawai'),
    step(1, 'Klik menu "Pegawai & User" di sidebar.'),
    step(2, 'Klik tombol "Tambah Pegawai".'),
    step(3, 'Isi seluruh kolom yang diperlukan:'),
    bul('NIP (Nomor Induk Pegawai)', 1),
    bul('Nama Lengkap', 1),
    bul('Tempat, Tanggal Lahir', 1),
    bul('TMT CPNS, Pangkat, Golongan', 1),
    bul('Jabatan dan Unit Kerja', 1),
    bul('Pendidikan Terakhir dan Jurusan', 1),
    bul('Masa Kerja, Perkiraan Pensiun', 1),
    bul('Status Kepegawaian (PNS / PPPK)', 1),
    step(4, 'Klik "Simpan".'),
    gap(),
    h3('3.3.2  Edit dan Hapus Pegawai'),
    step(1, 'Gunakan filter (nama, status, golongan) atau scroll untuk menemukan pegawai.'),
    step(2, 'Klik "Edit" untuk memperbarui data, atau "Hapus" untuk menghapus (dengan konfirmasi).'),
    gap(),
    h2('3.4  Akun User (Admin/Operator)'),
    step(1, 'Setelah menambah data pegawai, sistem otomatis menampilkan form pembuatan akun user.'),
    step(2, 'Masukkan alamat email untuk login.'),
    step(3, 'Atur kata sandi awal.'),
    step(4, 'Pilih role: Admin, Operator, atau Verifikator.'),
    step(5, 'Klik "Simpan" untuk membuat akun.'),
    p('Catatan: Tanpa akun user, pegawai tidak bisa login ke sistem.', { italics: true, color: C.muted }),
    gap(),
    h2('3.5  Anggota Tim'),
    h3('3.5.1  Menambah Anggota'),
    step(1, 'Klik menu "Anggota Tim" di sidebar.'),
    step(2, 'Klik tombol "Tambah Anggota".'),
    step(3, 'Pilih Pegawai dari dropdown.'),
    step(4, 'Pilih Unit Kerja dan Sub Unit Kerja.'),
    step(5, 'Tentukan Peran: Ketua, Koordinator, Anggota, Wali Wilayah, atau Co-Wali Wilayah.'),
    step(6, 'Isi Tahun keanggotaan.'),
    step(7, 'Klik "Simpan".'),
    p('Catatan: Satu pegawai bisa tergabung di beberapa unit kerja dengan peran berbeda.', { italics: true, color: C.muted }),
  ]
}

function bab4() {
  return [
    brk(),
    h1('BAB IV  PROSEDUR PENGELOLAAN KEGIATAN'),
    h2('4.1  Menambah Kegiatan Baru'),
    step(1, 'Klik menu "Kegiatan" di sidebar admin.'),
    step(2, 'Klik tombol "Tambah Kegiatan".'),
    step(3, 'Isi formulir kegiatan:'),
    bul('Nama Kegiatan \u2014 judul resmi kegiatan', 1),
    bul('Rincian Kegiatan \u2014 penjelasan singkat', 1),
    bul('Deskripsi \u2014 uraian lengkap', 1),
    bul('Tanggal Mulai dan Tanggal Selesai', 1),
    bul('Lokasi Pelaksanaan', 1),
    bul('Kabupaten / Kota', 1),
    bul('Metode Pelaksanaan: Daring, Luring, atau Hybrid', 1),
    bul('Status: Akan Datang, Berjalan, Selesai, atau Draft', 1),
    bul('Metode Pembayaran (jika ada)', 1),
    bul('Flyer Kegiatan \u2014 upload gambar promosi', 1),
    bul('Resource URLs: link Dokumentasi, Materi, Panduan (opsional)', 1),
    step(4, 'Klik "Simpan" untuk menyimpan kegiatan.'),
    gap(),
    h2('4.2  Mengedit Kegiatan'),
    step(1, 'Di daftar kegiatan, klik tombol "Edit" pada baris kegiatan yang ingin diubah.'),
    step(2, 'Perbarui data yang diperlukan pada formulir.'),
    step(3, 'Klik "Simpan" untuk menyimpan perubahan.'),
    gap(),
    h2('4.3  Menghapus Kegiatan'),
    step(1, 'Klik tombol "Hapus" pada baris kegiatan.'),
    step(2, 'Konfirmasi penghapusan pada dialog yang muncul.'),
    p('Peringatan: Menghapus kegiatan akan menghapus seluruh data terkait (peserta, penugasan, sertifikat). Pastikan data sudah tidak diperlukan.', { bold: true, color: C.red }),
    gap(),
    h2('4.4  Filter dan Pencarian Kegiatan'),
    bul('Dropdown "Tahun" \u2014 filter berdasarkan tahun kegiatan.'),
    bul('Dropdown "Status" \u2014 filter berdasarkan status (Berjalan, Akan Datang, Selesai).'),
    bul('Kolom Pencarian \u2014 cari berdasarkan nama kegiatan.'),
    gap(),
    h2('4.5  Generate Link Publik'),
    step(1, 'Buka detail kegiatan dengan klik tombol "Detail" atau "Peserta".'),
    step(2, 'Di halaman detail, tersedia link publik yang dapat disalin:'),
    bul('Link Formulir Biodata (per peran: Peserta, Panitia, Narasumber, Pendamping)', 1),
    bul('Link Daftar Peserta', 1),
    bul('Link Evaluasi Kegiatan', 1),
    bul('Link Unduh Sertifikat', 1),
    step(3, 'Klik tombol "Salin" atau "Share" untuk membagikan link.'),
    step(4, 'QR Code akan otomatis di-generate untuk setiap link publik.'),
    p('Catatan: Link Biodata aktif selama tanggal kegiatan berlangsung. Link Evaluasi aktif di hari terakhir kegiatan.', { italics: true, color: C.muted }),
  ]
}

function bab5() {
  return [
    brk(),
    h1('BAB V  PROSEDUR PENGELOLAAN PESERTA'),
    h2('5.1  Mengisi Biodata (Oleh Peserta \u2014 Laman Publik)'),
    p('Prosedur ini dilakukan oleh peserta secara mandiri melalui link formulir yang dibagikan panitia.'),
    gap(),
    step(1, 'Buka link Formulir Biodata yang diterima dari panitia.'),
    step(2, 'Halaman formulir akan menampilkan kolom isian yang terbagi dalam beberapa bagian:'),
    gap(),
    h3('A. Data Pribadi'),
    bul('Nama Lengkap sesuai identitas resmi'),
    bul('NIP (jika pegawai)'),
    bul('Tempat dan Tanggal Lahir'),
    bul('Jenis Kelamin'),
    bul('NPWP atau NIK'),
    bul('Alamat Email dan Nomor HP'),
    gap(),
    h3('B. Data Instansi'),
    bul('Nama Instansi / Sekolah'),
    bul('Alamat Instansi'),
    bul('Kabupaten / Kota'),
    bul('Provinsi'),
    gap(),
    h3('C. Data Kepegawaian'),
    bul('Pangkat dan Golongan'),
    bul('Jabatan'),
    gap(),
    h3('D. Data Rekening'),
    bul('Nama Bank'),
    bul('Nomor Rekening'),
    bul('Atas Nama Rekening'),
    bul('Provider Pulsa (untuk penggantian biaya telekomunikasi)'),
    gap(),
    h3('E. Lainnya'),
    bul('Nomor Surat Tugas'),
    bul('Tanda Tangan Digital (upload gambar tanda tangan)'),
    gap(),
    step(3, 'Isi seluruh data dengan benar dan lengkap.'),
    step(4, 'Klik tombol "Kirim" atau "Simpan".'),
    step(5, 'Sistem akan menyimpan data dan menampilkan konfirmasi keberhasilan.'),
    gap(),
    h2('5.2  Menambah Peserta (Admin)'),
    step(1, 'Buka menu "Peserta" di sidebar, atau klik tombol "Peserta" dari halaman detail kegiatan.'),
    step(2, 'Klik tombol "Tambah Peserta".'),
    step(3, 'Pilih kegiatan dari dropdown.'),
    step(4, 'Isi data peserta (sama seperti formulir publik).'),
    step(5, 'Tentukan peran: Peserta, Narasumber, Panitia, atau Pendamping.'),
    step(6, 'Klik "Simpan".'),
    gap(),
    h2('5.3  Edit dan Hapus Peserta'),
    step(1, 'Di daftar peserta, gunakan kolom pencarian untuk menemukan peserta (berdasarkan nama, NIP, instansi, atau kabupaten/kota).'),
    step(2, 'Klik "Edit" untuk mengubah data, lalu klik "Simpan".'),
    step(3, 'Klik "Hapus" untuk menghapus data peserta, lalu konfirmasi.'),
    gap(),
    h2('5.4  Export Data Peserta'),
    step(1, 'Di halaman daftar peserta, klik tombol "Export Excel" untuk mengunduh dalam format XLSX.'),
    step(2, 'Klik tombol "Download DOCX" untuk mengunduh biodata satu peserta dalam format DOCX.'),
    step(3, 'Untuk download batch: pilih beberapa peserta, lalu klik "Download Batch" (diunduh sebagai file ZIP).'),
    step(4, 'Klik "Cetak Semua Biodata" untuk mencetak seluruh biodata peserta.'),
  ]
}

function bab6() {
  return [
    brk(),
    h1('BAB VI  PROSEDUR SERTIFIKAT'),
    h2('6.1  Generate Sertifikat Individual'),
    step(1, 'Buka halaman peserta kegiatan (dari menu Peserta atau dari detail kegiatan).'),
    step(2, 'Cari peserta yang akan diterbitkan sertifikatnya.'),
    step(3, 'Klik tombol "Buat Sertifikat" pada baris peserta.'),
    step(4, 'Isi data sertifikat:'),
    bul('Nomor Sertifikat \u2014 nomor unik dokumen', 1),
    bul('Tanggal TTD \u2014 tanggal tanda tangan penandatangan', 1),
    bul('Penandatangan \u2014 pejabat yang menandatangani', 1),
    bul('Template \u2014 pilih template sertifikat yang tersedia', 1),
    step(5, 'Klik "Generate" untuk membuat sertifikat.'),
    step(6, 'Status sertifikat peserta akan berubah menjadi "Terbit".'),
    gap(),
    h2('6.2  Generate Sertifikat Massal (Batch)'),
    step(1, 'Di halaman peserta kegiatan, centang checkbox pada beberapa peserta yang akan diterbitkan sertifikatnya.'),
    step(2, 'Klik tombol "Generate Massal" di bagian atas tabel.'),
    step(3, 'Atur pengaturan batch:'),
    bul('Template sertifikat', 1),
    bul('Nomor sertifikat awal (akan auto-increment)', 1),
    bul('Penandatangan', 1),
    step(4, 'Klik "Generate Semua".'),
    step(5, 'Sistem akan memproses dan menerbitkan sertifikat untuk seluruh peserta terpilih.'),
    step(6, 'Tunggu hingga proses selesai. Status akan berubah menjadi "Terbit" untuk semua peserta yang berhasil.'),
    gap(),
    h2('6.3  Unduh Sertifikat (Peserta \u2014 Laman Publik)'),
    step(1, 'Peserta mengakses halaman unduh sertifikat melalui link yang dibagikan panitia.'),
    step(2, 'Gunakan kolom pencarian untuk menemukan nama peserta.'),
    step(3, 'Klik tombol "Unduh" pada baris peserta.'),
    step(4, 'File sertifikat dalam format PDF akan diunduh secara otomatis.'),
    p('Catatan: Hanya sertifikat dengan status "Terbit" yang dapat diunduh.', { italics: true, color: C.muted }),
  ]
}

function bab7() {
  return [
    brk(),
    h1('BAB VII  PROSEDUR EVALUASI'),
    h2('7.1  Mengisi Evaluasi (Peserta \u2014 Laman Publik)'),
    p('Formulir evaluasi hanya dapat diakses pada hari terakhir kegiatan (sesuai tanggal selesai).'),
    gap(),
    step(1, 'Peserta mengakses link evaluasi yang dibagikan panitia.'),
    step(2, 'Isi Bagian I \u2014 Evaluasi Program. Beri skor 1\u20135 untuk setiap aspek:'),
    bul('Kesesuaian program dengan kebutuhan', 1),
    bul('Kualitas materi yang disampaikan', 1),
    bul('Kesesuaian fasilitas yang tersedia', 1),
    bul('Kesesuaian waktu pelaksanaan', 1),
    bul('Kualitas narasumber / pemateri', 1),
    bul('Manfaat kegiatan bagi peserta', 1),
    step(3, 'Isi Bagian II \u2014 Evaluasi Pelaksanaan. Beri skor 1\u20135 untuk setiap aspek:'),
    bul('Kedisiplinan penyelenggara', 1),
    bul('Keramahan dan sikap panitia', 1),
    bul('Kualitas koordinasi selama kegiatan', 1),
    bul('Kualitas dokumentasi kegiatan', 1),
    step(4, 'Isi kolom "Saran dan Masukan" (opsional).'),
    step(5, 'Klik "Kirim Evaluasi".'),
    gap(),
    p('Skala penilaian:', { bold: true }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [hc('Skor', 1500), hc('Makna', 3500), hc('Penjelasan', 5000)] }),
        new TableRow({ children: [dc('1', 1500), dc('Sangat Tidak Puas', 3500, { bold: true }), dc('Tidak sesuai harapan sama sekali', 5000)] }),
        new TableRow({ children: [dc('2', 1500, { shd: altShd }), dc('Tidak Puas', 3500, { bold: true, shd: altShd }), dc('Kurang sesuai harapan', 5000, { shd: altShd })] }),
        new TableRow({ children: [dc('3', 1500), dc('Cukup', 3500, { bold: true }), dc('Sesuai harapan secara umum', 5000)] }),
        new TableRow({ children: [dc('4', 1500, { shd: altShd }), dc('Puas', 3500, { bold: true, shd: altShd }), dc('Melebihi harapan', 5000, { shd: altShd })] }),
        new TableRow({ children: [dc('5', 1500), dc('Sangat Puas', 3500, { bold: true }), dc('Sangat sesuai atau melebihi harapan', 5000)] }),
      ]
    }),
    gap(),
    h2('7.2  Melihat Laporan Evaluasi (Publik)'),
    step(1, 'Akses halaman laporan evaluasi melalui link yang tersedia.'),
    step(2, 'Laporan menampilkan:'),
    bul('Grafik batang (bar chart) distribusi jawaban per aspek', 1),
    bul('Rata-rata skor per aspek penilaian', 1),
    bul('Daftar komentar dan saran dari peserta', 1),
  ]
}

function bab8() {
  return [
    brk(),
    h1('BAB VIII  PROSEDUR PENUGASAN'),
    h2('8.1  Melihat Data Penugasan'),
    step(1, 'Klik menu "Penugasan" di sidebar admin.'),
    step(2, 'Tabel menampilkan daftar penugasan dengan kolom: Nama Pegawai, Kegiatan, Peran, Tanggal, Kab/Kota, Lokasi.'),
    step(3, 'Gunakan kolom pencarian untuk mencari data spesifik.'),
    step(4, 'Gunakan filter untuk mempersempit hasil.'),
    gap(),
    h2('8.2  Export Data Penugasan'),
    step(1, 'Klik tombol "Export Excel" di halaman penugasan.'),
    step(2, 'File XLSX akan diunduh berisi data penugasan sesuai filter yang aktif.'),
    gap(),
    h2('8.3  Penugasan Pegawai ke Kegiatan'),
    p('Penugasan pegawai dilakukan melalui modul kegiatan. Saat menambah atau mengedit kegiatan, admin dapat menetapkan pegawai yang bertanggung jawab beserta perannya (Penanggung Jawab, Koordinator, Pelaksana, dll).'),
  ]
}

function bab9() {
  return [
    brk(),
    h1('BAB IX  DASHBOARD DAN LAMAN PUBLIK'),
    h2('9.1  Dashboard Admin'),
    p('Halaman Dashboard menampilkan ringkasan sistem bagi admin yang sedang login:'),
    bul('Profil pegawai yang sedang login'),
    bul('Statistik ringkasan: Total Kegiatan, Total Peserta, Sertifikat Terbit, Kegiatan Berjalan'),
    bul('Grafik kegiatan per bulan (bar chart interaktif)'),
    bul('Daftar kegiatan terbaru'),
    bul('Tombol aksi cepat (quick actions)'),
    gap(),
    h2('9.2  Landing Page (Publik)'),
    step(1, 'Pengunjung membuka halaman utama SIMAIK.'),
    step(2, 'Kartu unit kerja (Timker) ditampilkan: PAUD, SD, SMP, SMA/SMK, Subbag Umum.'),
    step(3, 'Klik salah satu kartu untuk melihat daftar kegiatan unit kerja tersebut.'),
    step(4, 'Klik tombol "Detail" pada kegiatan untuk melihat informasi lengkap.'),
    step(5, 'Klik tombol "Halaman" untuk membuka halaman detail kegiatan di tab baru.'),
    gap(),
    h2('9.3  Halaman Detail Kegiatan Publik'),
    p('Halaman ini menampilkan informasi lengkap tentang satu kegiatan:'),
    bul('Nama, deskripsi, tanggal, lokasi, metode pelaksanaan, dan status'),
    bul('Flyer kegiatan (gambar promosi)'),
    bul('Tautan ke: Formulir Biodata, Daftar Peserta, Evaluasi, Unduh Sertifikat'),
    bul('QR Code untuk akses cepat ke setiap tautan'),
    bul('Resource URLs: tautan ke Dokumentasi, Materi, dan Panduan'),
    bul('Tombol "Share" untuk membagikan halaman ke media sosial atau menyalin link'),
    gap(),
    h2('9.4  Verifikasi Sertifikat'),
    p('Pengunjung publik dapat memverifikasi keaslian sertifikat melalui halaman Unduh Sertifikat. Sistem menampilkan status sertifikat (terbit/draft) dan data peserta terkait.'),
  ]
}

function bab10() {
  return [
    brk(),
    h1('BAB X  PENANGANAN MASALAH'),
    h2('10.1  Masalah Umum dan Solusi'),
    gap(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [hc('No', 600), hc('Masalah', 3800), hc('Solusi', 5600)] }),
        new TableRow({ children: [dc('1', 600), dc('Gagal login \u2014 email atau kata sandi salah', 3800), dc('Periksa kembali email dan kata sandi. Pastikan Caps Lock tidak aktif. Hubungi admin untuk reset.', 5600)] }),
        new TableRow({ children: [dc('2', 600, { shd: altShd }), dc('Halaman tidak dapat diakses (404)', 3800, { shd: altShd }), dc('Periksa URL. Pastikan link tidak terpotong. Gunakan navigasi menu.', 5600, { shd: altShd })] }),
        new TableRow({ children: [dc('3', 600), dc('Upload file gambar gagal', 3800), dc('Periksa ukuran file (maks. ~2MB) dan format (JPG/PNG). Pastikan server mendukung upload.', 5600)] }),
        new TableRow({ children: [dc('4', 600, { shd: altShd }), dc('Data tidak muncul setelah disimpan', 3800, { shd: altShd }), dc('Tekan F5 untuk refresh. Periksa filter yang aktif. Pastikan koneksi internet stabil.', 5600, { shd: altShd })] }),
        new TableRow({ children: [dc('5', 600), dc('Sertifikat gagal di-generate', 3800), dc('Pastikan data peserta lengkap. Pastikan template tersedia. Coba generate ulang.', 5600)] }),
        new TableRow({ children: [dc('6', 600, { shd: altShd }), dc('QR Code tidak muncul', 3800, { shd: altShd }), dc('QR di-generate secara asinkron. Tunggu beberapa detik lalu refresh halaman.', 5600, { shd: altShd })] }),
        new TableRow({ children: [dc('7', 600), dc('Formulir evaluasi tidak bisa diakses', 3800), dc('Evaluasi hanya tersedia di hari terakhir kegiatan. Periksa tanggal selesai.', 5600)] }),
        new TableRow({ children: [dc('8', 600, { shd: altShd }), dc('Export Excel/DOCX gagal', 3800, { shd: altShd }), dc('Izinkan download di browser. Nonaktifkan pop-up blocker. Coba browser berbeda.', 5600, { shd: altShd })] }),
        new TableRow({ children: [dc('9', 600), dc('Sistem terasa lambat', 3800), dc('Bersihkan cache browser (Ctrl+Shift+Del). Pastikan koneksi stabil.', 5600)] }),
        new TableRow({ children: [dc('10', 600, { shd: altShd }), dc('Sesi berakhir tiba-tiba', 3800, { shd: altShd }), dc('Token sesi kedaluwarsa. Login ulang. Sistem menyimpan sesi otomatis di localStorage.', 5600, { shd: altShd })] }),
      ]
    }),
    gap(),
    h2('10.2  Pelaporan Masalah'),
    p('Jika menemukan masalah yang tidak tercantum di atas:'),
    step(1, 'Catat langkah-langkah yang Anda lakukan sebelum masalah terjadi.'),
    step(2, 'Ambil screenshot layar yang menunjukkan pesan error.'),
    step(3, 'Laporkan kepada administrator sistem.'),
    step(4, 'Sertakan informasi: browser yang digunakan, waktu kejadian, dan akun yang digunakan.'),
    gap(),
    h2('10.3  Pemulihan Data'),
    bul('Data disimpan secara real-time ke server backend.'),
    bul('Sistem memiliki fitur Data Sync Monitor untuk memantau status sinkronisasi.'),
    bul('Semua aktivitas pengguna tercatat dalam log (audit trail).'),
  ]
}

function bab11() {
  return [
    brk(),
    h1('BAB XI  PENUTUP'),
    p('Standar Operasional Prosedur (SOP) ini disusun sebagai panduan lengkap penggunaan aplikasi SIMAIK di lingkungan Badan Pengembangan Mutu Pendidikan (BPMP) Nusa Tenggara Barat.'),
    gap(),
    p('Diharapkan seluruh pengguna\u2014admin, operator, dan peserta\u2014dapat mengikuti prosedur yang telah ditetapkan demi menjaga konsistensi, keamanan, dan kualitas pengelolaan data kegiatan pendidikan.'),
    gap(),
    p('Dokumen ini akan diperbarui secara berkala seiring pengembangan fitur-fitur baru dalam sistem SIMAIK. Masukan dan saran perbaikan sangat diharapkan untuk penyempurnaan dokumen ini.'),
    gap(), gap(), gap(),
    p('Mataram, Juni 2025'),
    gap(), gap(), gap(),
    p('Mengetahui,                                             Disusun oleh,'),
    gap(), gap(), gap(),
    p('_____________________________                _____________________________'),
    p('Kepala BPMP NTB                                          Tim Pengembang SIMAIK'),
    p('NIP. ........................................                                            NIP. ........................................'),
  ]
}

function lampiran() {
  return [
    brk(),
    h1('LAMPIRAN'),
    h2('Lampiran 1: Daftar Menu Sistem'),
    gap(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [hc('No', 600), hc('Menu', 2600), hc('Lokasi', 2200), hc('Akses', 1600), hc('Fungsi Utama', 3000)] }),
        new TableRow({ children: [dc('1', 600), dc('Dashboard', 2600, { bold: true }), dc('Sidebar Admin', 2200), dc('Admin', 1600), dc('Ringkasan statistik dan grafik', 3000)] }),
        new TableRow({ children: [dc('2', 600, { shd: altShd }), dc('Kegiatan', 2600, { bold: true, shd: altShd }), dc('Sidebar Admin', 2200, { shd: altShd }), dc('Admin', 1600, { shd: altShd }), dc('CRUD kegiatan, link publik', 3000, { shd: altShd })] }),
        new TableRow({ children: [dc('3', 600), dc('Peserta', 2600, { bold: true }), dc('Sidebar / Kegiatan', 2200), dc('Admin', 1600), dc('CRUD peserta, sertifikat, export', 3000)] }),
        new TableRow({ children: [dc('4', 600, { shd: altShd }), dc('Pegawai & User', 2600, { bold: true, shd: altShd }), dc('Sidebar Admin', 2200, { shd: altShd }), dc('Admin', 1600, { shd: altShd }), dc('CRUD pegawai dan akun user', 3000, { shd: altShd })] }),
        new TableRow({ children: [dc('5', 600), dc('Penugasan', 2600, { bold: true }), dc('Sidebar Admin', 2200), dc('Admin', 1600), dc('Data penugasan, export', 3000)] }),
        new TableRow({ children: [dc('6', 600, { shd: altShd }), dc('Unit Kerja', 2600, { bold: true, shd: altShd }), dc('Sidebar Admin', 2200, { shd: altShd }), dc('Admin', 1600, { shd: altShd }), dc('CRUD unit kerja dan sub unit', 3000, { shd: altShd })] }),
        new TableRow({ children: [dc('7', 600), dc('Anggota Tim', 2600, { bold: true }), dc('Sidebar Admin', 2200), dc('Admin', 1600), dc('CRUD keanggotaan tim', 3000)] }),
        new TableRow({ children: [dc('8', 600, { shd: altShd }), dc('Profil', 2600, { bold: true, shd: altShd }), dc('Sidebar Admin', 2200, { shd: altShd }), dc('Admin', 1600, { shd: altShd }), dc('Edit profil, ubah kata sandi', 3000, { shd: altShd })] }),
        new TableRow({ children: [dc('9', 600), dc('Landing Page', 2600, { bold: true }), dc('Halaman Publik', 2200), dc('Publik', 1600), dc('Navigasi kegiatan per unit', 3000)] }),
        new TableRow({ children: [dc('10', 600, { shd: altShd }), dc('Formulir Biodata', 2600, { bold: true, shd: altShd }), dc('Halaman Publik', 2200, { shd: altShd }), dc('Publik', 1600, { shd: altShd }), dc('Pengisian data peserta', 3000, { shd: altShd })] }),
        new TableRow({ children: [dc('11', 600), dc('Daftar Peserta', 2600, { bold: true }), dc('Halaman Publik', 2200), dc('Publik', 1600), dc('Lihat daftar peserta', 3000)] }),
        new TableRow({ children: [dc('12', 600, { shd: altShd }), dc('Unduh Sertifikat', 2600, { bold: true, shd: altShd }), dc('Halaman Publik', 2200, { shd: altShd }), dc('Publik', 1600, { shd: altShd }), dc('Download sertifikat PDF', 3000, { shd: altShd })] }),
        new TableRow({ children: [dc('13', 600), dc('Evaluasi', 2600, { bold: true }), dc('Halaman Publik', 2200), dc('Publik', 1600), dc('Isi evaluasi (skala 1\u20135)', 3000)] }),
        new TableRow({ children: [dc('14', 600, { shd: altShd }), dc('Laporan Evaluasi', 2600, { bold: true, shd: altShd }), dc('Halaman Publik', 2200, { shd: altShd }), dc('Publik', 1600, { shd: altShd }), dc('Grafik dan statistik evaluasi', 3000, { shd: altShd })] }),
      ]
    }),
    gap(),
    h2('Lampiran 2: Status Kegiatan'),
    gap(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [hc('Status', 3000), hc('Keterangan', 7000)] }),
        new TableRow({ children: [dc('Akan Datang', 3000, { bold: true }), dc('Kegiatan yang tanggal mulainya belum tiba (hari ini < tanggal mulai)', 7000)] }),
        new TableRow({ children: [dc('Berjalan', 3000, { bold: true, shd: altShd }), dc('Kegiatan sedang berlangsung (tanggal mulai \u2264 hari ini \u2264 tanggal selesai)', 7000, { shd: altShd })] }),
        new TableRow({ children: [dc('Selesai', 3000, { bold: true }), dc('Kegiatan telah berakhir (hari ini > tanggal selesai)', 7000)] }),
        new TableRow({ children: [dc('Draft', 3000, { bold: true, shd: altShd }), dc('Kegiatan dalam perencanaan, belum dipublikasikan', 7000, { shd: altShd })] }),
      ]
    }),
    gap(),
    h2('Lampiran 3: Peran dalam Sistem'),
    gap(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [hc('Peran', 3000), hc('Hak Akses', 7000)] }),
        new TableRow({ children: [dc('Admin', 3000, { bold: true }), dc('Akses penuh ke seluruh modul admin: CRUD semua data, generate sertifikat, manage user', 7000)] }),
        new TableRow({ children: [dc('Operator', 3000, { bold: true, shd: altShd }), dc('Akses sebagian modul: kelola kegiatan dan peserta sesuai unit kerja', 7000, { shd: altShd })] }),
        new TableRow({ children: [dc('Verifikator', 3000, { bold: true }), dc('Verifikasi dan penerbitan sertifikat', 7000)] }),
        new TableRow({ children: [dc('Peserta', 3000, { bold: true, shd: altShd }), dc('Isi biodata, unduh sertifikat, isi evaluasi (melalui laman publik)', 7000, { shd: altShd })] }),
      ]
    }),
    gap(),
    h2('Lampiran 4: Keterangan Tombol Aksi di Tabel'),
    gap(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [hc('Tombol', 3000), hc('Fungsi', 7000)] }),
        new TableRow({ children: [dc('Detail', 3000, { bold: true }), dc('Membuka halaman detail data (kegiatan, peserta, dll)', 7000)] }),
        new TableRow({ children: [dc('Edit', 3000, { bold: true, shd: altShd }), dc('Membuka formulir edit untuk memperbarui data', 7000, { shd: altShd })] }),
        new TableRow({ children: [dc('Hapus', 3000, { bold: true }), dc('Menghapus data (dengan dialog konfirmasi)', 7000)] }),
        new TableRow({ children: [dc('Export Excel', 3000, { bold: true, shd: altShd }), dc('Mengunduh data dalam format XLSX', 7000, { shd: altShd })] }),
        new TableRow({ children: [dc('Download DOCX', 3000, { bold: true }), dc('Mengunduh biodata dalam format DOCX', 7000)] }),
        new TableRow({ children: [dc('Buat Sertifikat', 3000, { bold: true, shd: altShd }), dc('Generate sertifikat individual untuk peserta', 7000, { shd: altShd })] }),
        new TableRow({ children: [dc('Generate Massal', 3000, { bold: true }), dc('Generate sertifikat untuk beberapa peserta sekaligus', 7000)] }),
        new TableRow({ children: [dc('Share', 3000, { bold: true, shd: altShd }), dc('Membagikan link halaman (Web Share API / copy to clipboard)', 7000, { shd: altShd })] }),
      ]
    }),
  ]
}

async function main() {
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: F, size: 20, color: C.text } },
        heading1: { run: { font: FL, size: 30, bold: true, color: C.primary } },
        heading2: { run: { font: FL, size: 26, bold: true, color: C.secondary } },
        heading3: { run: { font: F, size: 22, bold: true, color: C.accent } }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1) }
          }
        },
        children: [...cover()]
      },
      {
        properties: {
          page: {
            margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1) }
          }
        },
        headers: {
          default: new Header({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'SOP SIMAIK v1.0', font: F, size: 16, color: C.muted, italics: true })]
            })]
          })
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Halaman ', font: F, size: 16, color: C.muted }),
                new TextRun({ children: [PageNumber.CURRENT], font: F, size: 16, color: C.muted }),
                new TextRun({ text: ' dari ', font: F, size: 16, color: C.muted }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: F, size: 16, color: C.muted }),
              ]
            })]
          })
        },
        children: [
          ...toc(),
          brk(),
          ...bab1(),
          ...bab2(),
          ...bab3(),
          ...bab4(),
          ...bab5(),
          ...bab6(),
          ...bab7(),
          ...bab8(),
          ...bab9(),
          ...bab10(),
          ...bab11(),
          ...lampiran()
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  const outPath = 'SOP_SIMAIK_v1.0.docx'
  fs.writeFileSync(outPath, buffer)
  console.log(`File generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`)
}

main().catch(err => { console.error(err); process.exit(1) })
