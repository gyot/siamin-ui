# SOP PENGGUNAAN APLIKASI SIMAIK

## Sistem Manajemen Informasi Kegiatan
**Balai Penjaminan Mutu Pendidikan (BPMP) Nusa Tenggara Barat**

Versi: 1.2.0
Terakhir Diperbarui: 30 Juni 2026

---

## DAFTAR ISI

1. [Umum](#1-umum)
2. [Akses dan Login](#2-akses-dan-login)
3. [SOP Admin — Dashboard](#3-sop-admin--dashboard)
4. [SOP Admin — Manajemen Kegiatan](#4-sop-admin--manajemen-kegiatan)
5. [SOP Admin — Manajemen Peserta](#5-sop-admin--manajemen-peserta)
6. [SOP Admin — Sertifikat](#6-sop-admin--sertifikat)
7. [SOP Publik — Mengisi Formulir Biodata](#7-sop-publik--mengisi-formulir-biodata)
8. [SOP Publik — Melihat Daftar Peserta](#8-sop-publik--melihat-daftar-peserta)
9. [SOP Publik — Mengunduh Sertifikat](#9-sop-publik--mengunduh-sertifikat)
10. [SOP Publik — Mengisi Evaluasi Kegiatan](#10-sop-publik--mengisi-evaluasi-kegiatan)
11. [SOP Publik — Melihat Laporan Evaluasi](#11-sop-publik--melihat-laporan-evaluasi)
12. [Alur Kerja End-to-End](#12-alur-kerja-end-to-end)
13. [Panduan Penyelesaian Masalah](#13-panduan-penyelesaian-masalah)

---

## 1. Umum

### 1.1 Tentang SIMAIK

SIMAIK (Sistem Manajemen Informasi Kegiatan) adalah platform berbasis web yang digunakan oleh BPMP NTB untuk mengelola:

- **Kegiatan** — pembuatan, pengelolaan, dan pemantauan kegiatan
- **Peserta** — pendaftaran dan pengelolaan data peserta, panitia, narasumber, dan pendamping
- **Sertifikat** — penerbitan dan distribusi sertifikat digital
- **Evaluasi** — pengumpulan dan analisis evaluasi kegiatan

### 1.2 Pengguna Sistem

| Role | Akses | Keterangan |
|------|-------|------------|
| **Admin** | Dashboard admin lengkap | Mengelola kegiatan, peserta, sertifikat |
| **Operator** | Dashboard admin (terbatas) | Mengelola kegiatan dan peserta |
| **Verifikator** | Dashboard admin (terbatas) | Memverifikasi data |
| **Peserta** | Portal peserta | Mengisi biodata, mengunduh sertifikat |
| **Publik** | Halaman publik (tanpa login) | Mengisi formulir, melihat daftar, mengunduh sertifikat, mengisi evaluasi |

### 1.3 Prasyarat Teknis

- Browser modern: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari (versi terbaru)
- Koneksi internet stabil
- Resolusi layar minimal 1024×768 (desktop) atau 360×640 (mobile)

---

## 2. Akses dan Login

### 2.1 Mengakses Halaman Utama

1. Buka browser dan ketik alamat aplikasi SIMAIK
2. Halaman landing akan menampilkan daftar unit kerja (Timker): PAUD, SD, SMP, SMA/SMK, Subbag Umum
3. Klik salah satu kartu Timker untuk melihat daftar kegiatan unit kerja tersebut

### 2.2 Login Admin

1. Klik tombol **Login** atau akses URL `/laman-masuk`
2. Masukkan **Username** (email/username terdaftar)
3. Masukkan **Password**
4. Klik tombol **Login**
5. Jika berhasil, sistem akan mengarahkan ke halaman **Dashboard** (`/admin/dashboard`)
6. Jika gagal, periksa kembali username dan password

> **Catatan:** Hubungi administrator sistem jika lupa password atau akun terkunci.

### 2.3 Logout

1. Klik ikon profil/username di pojok kanan atas
2. Pilih menu **Keluar**
3. Konfirmasi logout pada dialog yang muncul
4. Sistem akan mengarahkan ke halaman landing

---

## 3. SOP Admin — Dashboard

### 3.1 Tujuan

Halaman Dashboard menampilkan ringkasan data statistik dan daftar kegiatan untuk pemantauan cepat.

### 3.2 Langkah Kerja

1. Setelah login, halaman Dashboard secara otomatis menampilkan:
   - **Kartu Profil** — nama, NIP, email, unit kerja, golongan
   - **4 Kartu Statistik** — Total Kegiatan, Total Peserta, Sertifikat Terbit, Kegiatan Berjalan
   - **Daftar Kegiatan** dalam format kartu (grid 3 kolom)

2. **Filter Kegiatan:**
   - Ketik kata kunci pada kolom **Pencarian** untuk mencari kegiatan berdasarkan nama
   - Pilih **Tahun** dari dropdown untuk filter berdasarkan tahun
   - Pilih **Status** (Berjalan / Akan Datang / Selesai) untuk filter berdasarkan status
   - Pilih **Unit Kerja** untuk filter berdasarkan unit kerja tertentu

3. **Melihat Detail Kegiatan:**
   - Klik tombol **Lihat Detail** pada kartu kegiatan
   - Modal akan menampilkan informasi lengkap kegiatan
   - Tersedia link formulir untuk 4 peran: Peserta, Panitia, Narasumber, Pendamping
   - Tersedia QR Code untuk setiap link formulir
   - Tersedia link evaluasi dan daftar peserta

4. **Navigasi ke Peserta Kegiatan:**
   - Klik **Lihat Data Peserta** pada modal detail
   - Sistem akan mengarahkan ke halaman manajemen peserta kegiatan tersebut

5. **Export Data:**
   - Klik tombol **Export Excel** untuk mengunduh data peserta dalam format XLSX
   - Klik tombol **Download Batch DOCX** untuk mengunduh biodata peserta dalam format DOCX (ZIP)

---

## 4. SOP Admin — Manajemen Kegiatan

### 4.1 Tujuan

Membuat, mengubah, menghapus, dan mengelola data kegiatan.

### 4.2 Akses

Menu **Kegiatan** di sidebar (`/admin/kegiatan`)

### 4.3 Membuat Kegiatan Baru

1. Klik tombol **Tambah Kegiatan**
2. Isi formulir yang terdiri dari beberapa bagian:

   **Informasi Dasar:**
   - **Nama Kegiatan** *(wajib)* — nama lengkap kegiatan
   - **Deskripsi** — penjelasan detail kegiatan
   - **Unit Kerja** *(wajib)* — pilih unit kerja penyelenggara

   **Jadwal & Lokasi:**
   - **Tanggal Mulai** *(wajib)* — tanggal pelaksanaan dimulai
   - **Tanggal Selesai** *(wajib)* — tanggal pelaksanaan berakhir
   - **Tempat Pelaksanaan Kegiatan (TPK)** — tambahkan lokasi dan kabupaten/kota (bisa lebih dari satu)
   - **Upload Flyer** — unggah gambar flyer kegiatan (drag & drop atau paste dari clipboard)

   **Metode & Peserta:**
   - **Metode Pelaksanaan** *(wajib)* — pilih: Daring / Luring / Hybrid
   - **Metode Pembayaran** *(wajib)* — pilih: Transfer / Pulsa / Tunai / Tidak Dibayar
   - **Total Peserta** *(wajib)* — jumlah peserta yang direncanakan
   - **Ringkasan Peserta** — deskripsi komposisi peserta

   **Daftar ATK:**
   - Tambahkan daftar alat tulis kantor yang dibutuhkan (Nama Barang, Jumlah, Satuan)

   **Resource URL:**
   - Isi URL untuk: Dokumentasi, Materi, Panduan, Laporan, Surat Menyurat

   **Status:**
   - Pilih status: Draft / Berjalan / Selesai / Dibatalkan

3. Klik tombol **Simpan**

### 4.4 Mengedit Kegiatan

1. Cari kegiatan pada tabel menggunakan filter atau pencarian
2. Klik tombol **Detail** pada baris kegiatan
3. Pada modal detail, klik tombol **Edit**
4. Ubah data yang diperlukan
5. Klik tombol **Simpan**

### 4.5 Menghapus Kegiatan

1. Cari kegiatan pada tabel
2. Klik tombol **Detail** → klik tombol **Hapus**
3. Konfirmasi penghapusan pada dialog yang muncul
4. Kegiatan dan data terkait akan dihapus

### 4.6 Menduplikat Kegiatan

1. Klik tombol **Detail** pada kegiatan yang ingin diduplikat
2. Klik tombol **Duplikat**
3. Sistem akan membuat salinan kegiatan dengan data yang sama
4. Edit data duplikat sesuai kebutuhan

### 4.7 Membagikan Link Formulir

1. Buka detail kegiatan
2. Salin link formulir yang tersedia (Peserta, Panitia, Narasumber, Pendamping)
3. Bagikan link kepada calon peserta melalui media komunikasi yang diinginkan
4. QR Code tersedia untuk kemudahan akses via smartphone

---

## 5. SOP Admin — Manajemen Peserta

### 5.1 Tujuan

Mengelola data peserta untuk setiap kegiatan, termasuk penerbitan sertifikat dan export data.

### 5.2 Akses

- Dari **Dashboard**: klik **Lihat Data Peserta** pada kartu kegiatan
- Dari **Kegiatan**: klik **Detail** → **Lihat Peserta**

### 5.3 Melihat Daftar Peserta

1. Halaman menampilkan:
   - **5 Kartu Statistik** — Total Peserta, Sudah Terbit, Draft, Dicabut, Belum Ada
   - **Tabel Peserta** dengan kolom: No, Nama, NIP, Instansi, Kab/Kota, Peran, Status Sertifikat, Aksi
2. **Filter Data:**
   - Ketik nama pada kolom **Pencarian**
   - Pilih **Kegiatan** dari dropdown
   - Pilih **Status** sertifikat
   - Pilih **Kabupaten/Kota**
   - Atur **Jumlah data per halaman**

### 5.4 Menambah Peserta Baru

1. Klik tombol **Tambah Peserta**
2. Isi formulir yang terdiri dari 4 bagian:

   **Data Pribadi:**
   - Nama Lengkap, NIP, Email, No. HP, Jenis Kelamin
   - Tempat/Tanggal Lahir, NPWP/NIK, Pangkat, Golongan, Jabatan

   **Data Instansi:**
   - Nama Instansi, NPSN, Kegiatan (otomatis terisi)
   - Alamat Instansi, Kab/Kota, Provinsi, Telepon/Email Instansi

   **Data Pembayaran:**
   - Provider Pulsa, Nomor Rekening, Nama Bank

   **Data Administrasi:**
   - No Penugasan, Tanggal Penugasan
   - **Peran** — pilih: Peserta / Narasumber / Fasilitator / Panitia

3. Klik tombol **Simpan**

### 5.5 Mengedit Peserta

1. Cari peserta pada tabel
2. Klik ikon **Edit** pada baris peserta
3. Ubah data yang diperlukan
4. Klik tombol **Simpan**

### 5.6 Melihat Detail Peserta

1. Klik ikon **Detail** pada baris peserta
2. Modal akan menampilkan seluruh data peserta secara lengkap

### 5.7 Melihat Biodata Peserta

1. Klik ikon **Biodata** pada baris peserta
2. Modal akan menampilkan format biodata cetak
3. Klik tombol **Cetak** untuk mencetak biodata

### 5.8 Menghapus Peserta

1. Klik ikon **Hapus** pada baris peserta
2. Konfirmasi penghapusan pada dialog yang muncul

### 5.9 Export Data Peserta

1. **Export Excel:**
   - Klik tombol **Export Excel** di bagian header
   - File XLSX akan diunduh otomatis

2. **Download DOCX Individual:**
   - Klik ikon **DOCX** pada baris peserta
   - File DOCX biodata akan diunduh

3. **Download Batch DOCX:**
   - Klik tombol **Download Batch DOCX**
   - File ZIP berisi DOCX per peserta akan diunduh

4. **Cetak Semua Biodata:**
   - Klik tombol **Cetak Semua Biodata**
   - Seluruh biodata peserta akan ditampilkan untuk pencetakan

---

## 6. SOP Admin — Sertifikat

### 6.1 Tujuan

Menerbitkan dan mengelola sertifikat digital untuk peserta kegiatan.

### 6.2 Menerbitkan Sertifikat untuk Peserta Terpilih

1. Buka halaman manajemen peserta kegiatan
2. **Centang checkbox** pada peserta yang akan diterbitkan sertifikatnya
3. Klik tombol **Buat Sertifikat Terpilih**
4. Isi formulir sertifikat:
   - **Nomor Sertifikat** — nomor urut sertifikat
   - **Tanggal TTD** — tanggal penandatanganan
   - **Penandatangan** — pilih dari daftar pegawai
   - **Template File** — unggah template DOCX sertifikat
   - **Status** — pilih status penerbitan
5. Klik tombol **Proses**

### 6.3 Menerbitkan Sertifikat Batch

1. Klik tombol **Sertifikat Batch**
2. Konfigurasi parameter batch (nomor, tanggal, penandatangan, template)
3. Klik tombol **Proses** untuk menerbitkan sertifikat untuk semua peserta sekaligus

### 6.4 Mengunduh Sertifikat

1. Pada tabel peserta, periksa kolom **Status Sertifikat**
2. Peserta dengan status "Terbit" memiliki tombol **Unduh PDF**
3. Klik tombol tersebut untuk mengunduh sertifikat dalam format PDF

---

## 7. SOP Publik — Mengisi Formulir Biodata

### 7.1 Tujuan

Mendaftarkan diri sebagai peserta, panitia, narasumber, atau pendamping pada suatu kegiatan.

### 7.2 Akses

- Melalui link yang dibagikan oleh admin
- Melalui QR Code yang tersedia di halaman detail kegiatan
- Format URL: `/formulir/{kode_kegiatan}/{peran}/{slug}`

### 7.3 Langkah Kerja

1. Buka link formulir yang diberikan
2. Halaman akan menampilkan informasi kegiatan (nama, tanggal, lokasi, flyer)
3. Isi formulir biodata:

   **Data Pribadi:**
   - **Nama Lengkap** *(wajib)*
   - NIP
   - **Email** *(wajib)*
   - No. HP
   - Jenis Kelamin
   - Tempat/Tanggal Lahir
   - NPWP/NIK
   - Pangkat/Golongan
   - Jabatan

   **Data Instansi:**
   - **Nama Instansi** *(wajib)*
   - NPSN (maksimal 8 digit)
   - Kabupaten/Kota

   **Data Pembayaran** (jika diperlukan):
   - Nomor Rekening
   - Nama Bank
   - Provider Seluler (untuk metode pulsa)

   **Tanda Tangan Digital:**
   - Gambar tanda tangan di area kanvas yang tersedia
   - Gunakan mouse, touchpad, atau stylus
   - Klik **Hapus Tandatangan** jika ingin mengulang

4. Klik tombol **Kirim**
5. Jika berhasil, sistem menampilkan pesan sukses dan mengarahkan ke halaman daftar peserta

> **Catatan:**
> - Formulir hanya dapat diakses saat tanggal kegiatan sedang berlangsung
> - Pastikan koneksi internet stabil saat mengisi formulir
> - Tanda tangan digital bersifat wajib

---

## 8. SOP Publik — Melihat Daftar Peserta

### 8.1 Tujuan

Melihat daftar peserta yang sudah terdaftar pada suatu kegiatan.

### 8.2 Akses

- Melalui link dari admin atau halaman detail kegiatan
- Format URL: `/daftar-peserta/{kode_kegiatan}/{slug}`

### 8.3 Langkah Kerja

1. Buka link daftar peserta
2. Halaman menampilkan tabel dengan kolom: Nama, Email, NIP, Instansi, Kab/Kota, Peran
3. **Mencari Peserta:** ketik kata kunci pada kolom pencarian (nama, email, instansi, atau peran)
4. **Mengurutkan Data:** klik header kolom untuk mengurutkan ascending/descending
5. **Mengatur Jumlah Data:** pilih jumlah baris per halaman (10/25/50/100)
6. Gunakan tombol **Prev/Next** untuk navigasi halaman

---

## 9. SOP Publik — Mengunduh Sertifikat

### 9.1 Tujuan

Mengunduh sertifikat digital dalam format PDF.

### 9.2 Akses

- Melalui link dari admin atau halaman detail kegiatan
- Format URL: `/unduh-sertifikat/{kode_kegiatan}/{slug}`

### 9.3 Langkah Kerja

1. Buka link unduh sertifikat
2. Halaman menampilkan tabel peserta dengan status sertifikat
3. **Mencari Peserta:** ketik nama pada kolom pencarian
4. Cari nama Anda pada daftar
5. Jika status **"Unduh PDF"** (hijau):
   - Klik tombol **Unduh PDF**
   - Tunggu proses generate sertifikat
   - File PDF akan otomatis terunduh dengan nama `Sertifikat - {nama}.pdf`
6. Jika status **"Belum Terbit"** (abu-abu):
   - Sertifikat belum diterbitkan oleh admin
   - Hubungi panitia kegiatan untuk informasi lebih lanjut

> **Catatan:** Proses generate sertifikat membutuhkan beberapa detik. Jangan tutup halaman selama proses berlangsung.

---

## 10. SOP Publik — Mengisi Evaluasi Kegiatan

### 10.1 Tujuan

Memberikan penilaian anonim terhadap kegiatan yang sudah dilaksanakan.

### 10.2 Akses

- Melalui link evaluasi dari admin atau halaman detail kegiatan
- Format URL: `/evaluasi/{kode_kegiatan}/{slug}`
- **Hanya tersedia pada hari terakhir kegiatan**

### 10.3 Langkah Kerja

1. Buka link evaluasi pada hari terakhir kegiatan
2. Halaman menampilkan informasi kegiatan dan formulir evaluasi
3. Isi evaluasi yang terdiri dari 4 bagian:

   **Evaluasi Program (Skala 1-5):**
   1. Kesesuaian Program Kegiatan dengan Tujuan
   2. Kesesuaian Bahan Ajar dengan Struktur Program
   3. Kesesuaian Alokasi Waktu dengan Bobot Materi

   **Evaluasi Fasilitator/Narasumber (per narasumber, Skala 1-5):**
   1. Penguasaan Materi
   2. Sistematika Penyajian Materi
   3. Sikap dan Kehadiran Fasilitator

   **Evaluasi Layanan (Skala 1-5):**
   1. Sikap dan Pelayanan Panitia Selama Kegiatan
   2. Fasilitas dan Kebersihan Tempat Pelaksanaan
   3. Kualitas Konsumsi

   **Saran dan Masukan:**
   - Tulis saran dan masukan (opsional)

4. Klik tombol **Kirim Evaluasi**
5. Jika berhasil, sistem menampilkan pesan terima kasih

> **Penting:**
> - Evaluasi bersifat **anonim** — identitas peserta tidak dicatat
> - Setiap alamat IP hanya dapat mengisi evaluasi **satu kali** per kegiatan
> - Semua penilaian wajib diisi sebelum mengirim

---

## 11. SOP Publik — Melihat Laporan Evaluasi

### 11.1 Tujuan

Melihat statistik dan grafik hasil evaluasi kegiatan.

### 11.2 Akses

- Melalui link laporan evaluasi dari admin
- Format URL: `/laporan-evaluasi/{kode_kegiatan}/{slug}`

### 11.3 Langkah Kerja

1. Buka link laporan evaluasi
2. Halaman menampilkan:
   - Info kegiatan (nama, tanggal, total evaluasi masuk)
   - **Grafik Program** — 3 bar chart distribusi skor
   - **Grafik Fasilitator** — grafik per narasumber/fasilitator
   - **Grafik Layanan** — 3 bar chart distribusi skor
3. **Download Grafik:**
   - Klik tombol download pada grafik individu untuk mengunduh sebagai PNG
   - Klik tombol **Download Semua Grafik Fasilitator** untuk mengunduh sekaligus
4. **Cetak Laporan:**
   - Klik tombol **Cetak Laporan** untuk mencetak via browser

> **Keterangan Warna Grafik:**
> - Hijau: ≥70% responden
> - Biru: ≥50% responden
> - Kuning: ≥30% responden
> - Oranye: ≥10% responden
> - Merah: <10% responden

---

## 12. Alur Kerja End-to-End

Berikut adalah alur kerja lengkap penggunaan SIMAIK dari awal hingga akhir:

### Tahap 1: Persiapan
```
Admin membuat akun pegawai → Admin membuat akun user → Admin mengatur unit kerja
```

### Tahap 2: Pembuatan Kegiatan
```
Admin membuat kegiatan baru → Mengisi detail kegiatan (jadwal, lokasi, metode) → Mengatur status "Berjalan"
```

### Tahap 3: Pendaftaran Peserta
```
Admin membagikan link/QR formulir → Peserta mengisi formulir biodata → Peserta menandatangani secara digital → Data masuk ke sistem
```

### Tahap 4: Pengelolaan Peserta
```
Admin menambah peserta manual (opsional) → Admin mengelola data peserta
```

### Tahap 5: Pelaksanaan & Evaluasi
```
Kegiatan dilaksanakan → Peserta mengisi evaluasi (hari terakhir) → Admin memantau evaluasi masuk
```

### Tahap 6: Penyelesaian
```
Admin mengubah status kegiatan "Selesai" → Admin menerbitkan sertifikat → Peserta mengunduh sertifikat → Admin melihat laporan evaluasi
```

---

## 13. Panduan Penyelesaian Masalah

### Masalah: Tidak bisa login
- Pastikan username dan password benar
- Periksa koneksi internet
- Hubungi administrator untuk reset password

### Masalah: Halaman tidak memuat / error koneksi
- Periksa koneksi internet
- Coba refresh halaman (F5)
- Bersihkan cache browser
- Coba gunakan browser lain

### Masalah: Formulir biodata tidak bisa diakses
- Pastikan Anda mengakses link yang benar
- Formulir hanya aktif saat tanggal kegiatan sedang berlangsung
- Hubungi admin kegiatan untuk mendapatkan link yang valid

### Masalah: Sertifikat gagal diunduh
- Tunggu beberapa saat dan coba kembali
- Pastikan sertifikat sudah diterbitkan (status "Unduh PDF")
- Hubungi admin jika masalah berlanjut

### Masalah: Evaluasi tidak bisa dikirim
- Pastikan semua penilaian sudah diisi
- Evaluasi hanya bisa diisi satu kali per IP address
- Evaluasi hanya tersedia pada hari terakhir kegiatan
- Periksa koneksi internet

### Masalah: Data tidak muncul di dashboard
- Coba refresh halaman
- Periksa filter yang sedang aktif
- Gunakan tombol **Reset** untuk menghapus filter
- Hubungi administrator jika data tetap tidak muncul

---

## Lampiran

### A. URL Penting

| Halaman | URL | Keterangan |
|---------|-----|------------|
| Landing | `/` | Halaman utama publik |
| Login Admin | `/laman-masuk` | Login administrator |
| Dashboard | `/admin/dashboard` | Dashboard admin |
| Kegiatan | `/admin/kegiatan` | Manajemen kegiatan |
| Formulir Biodata | `/formulir/{kode}/{peran}/{slug}` | Pendaftaran publik |
| Daftar Peserta | `/daftar-peserta/{kode}/{slug}` | Daftar peserta publik |
| Unduh Sertifikat | `/unduh-sertifikat/{kode}/{slug}` | Unduh sertifikat publik |
| Evaluasi | `/evaluasi/{kode}/{slug}` | Formulir evaluasi |
| Laporan Evaluasi | `/laporan-evaluasi/{kode}/{slug}` | Laporan evaluasi |

### B. Peran Peserta

| Peran | Keterangan |
|-------|------------|
| Peserta | Peserta umum kegiatan |
| Narasumber | Pembicara/pemateri |
| Fasilitator | Pendamping kegiatan |
| Panitia | Penyelenggara kegiatan |

### C. Status Kegiatan

| Status | Keterangan |
|--------|------------|
| Draft | Kegiatan masih dalam perencanaan |
| Berjalan | Kegiatan sedang dilaksanakan |
| Selesai | Kegiatan telah selesai |
| Dibatalkan | Kegiatan dibatalkan |

### D. Status Sertifikat

| Status | Keterangan |
|--------|------------|
| Terbit/Published | Sertifikat sudah diterbitkan dan bisa diunduh |
| Draft | Sertifikat dalam proses |
| Dicabut | Sertifikat telah dibatalkan |
| Belum Ada | Sertifikat belum dibuat |

---

*Dokumen ini dibuat berdasarkan analisis kode sumber aplikasi SIMAIK v1.2.0*
