# DAFTAR PENGELOLAAN, PERAWATAN DAN PENGEMBANGAN APLIKASI SIMAIK

**Versi Dokumen:** 1.0  
**Tanggal:** 14 Juli 2026  
**Aplikasi:** SIMAIK (Sistem Manajemen Informasi Kegiatan) v1.2.0  
**Lingkungan:** Vue 3 + Vite + Tailwind CSS + Laravel Backend

---

## DAFTAR ISI

1. [Ringkasan Fitur](#1-ringkasan-fitur)
2. [Pengelolaan Aplikasi](#2-pengelolaan-aplikasi)
3. [Perawatan Aplikasi](#3-perawatan-aplikasi)
4. [Pengembangan Aplikasi](#4-pengembangan-aplikasi)
5. [Daftar Berkas dan Modul](#5-daftar-berkas-dan-modul)
6. [Risiko dan Mitigasi](#6-risiko-dan-mitigasi)

---

## 1. Ringkasan Fitur

### 1.1 Fitur Sebelumnya (Sudah Terimplementasi)

| No | Fitur | Status | Lokasi Kode |
|----|-------|--------|-------------|
| 1 | **QR Code** | ✅ Aktif | `Dashboard.vue`, `Kegiatan.vue`, `KegiatanDetailPublik.vue` |
| 2 | **Daftar ATK** | ✅ Aktif | `Kegiatan.vue` (form + detail + cetak) |
| 3 | **Evaluasi Kegiatan** | ✅ Aktif | `EvaluasiKegiatan.vue`, `LaporanEvaluasi.vue` |

### 1.2 Fitur Lengkap SIMAIK v1.2.0

| No | Modul | Deskripsi | Status |
|----|-------|-----------|--------|
| 1 | Landing Page | Halaman publik dengan daftar unit kerja dan kegiatan | ✅ Aktif |
| 2 | Dashboard Admin | Statistik, profil, kartu kegiatan dengan QR | ✅ Aktif |
| 3 | Manajemen Kegiatan | CRUD kegiatan dengan multi-TPK dan ATK | ✅ Aktif |
| 4 | Manajemen Peserta | Kelola peserta per kegiatan + biodata + DOCX | ✅ Aktif |
| 5 | Sertifikat | Penerbitan sertifikat individu dan batch | ✅ Aktif |
| 6 | Pegawai Management | CRUD data pegawai | ✅ Aktif |
| 7 | Unit Kerja Management | CRUD unit kerja | ✅ Aktif |
| 8 | Anggota Management | Kelola anggota tim kerja | ✅ Aktif |
| 9 | Penugasan | Penugasan pegawai ke kegiatan | ✅ Aktif |
| 10 | Evaluasi Kegiatan | Formulir evaluasi publik (anonim) | ✅ Aktif |
| 11 | Laporan Evaluasi | Grafik dan statistik evaluasi | ✅ Aktif |
| 12 | Formulir Peserta | Pendaftaran publik dengan tanda tangan digital | ✅ Aktif |
| 13 | Daftar Peserta Publik | Daftar peserta tanpa login | ✅ Aktif |
| 14 | Unduh Sertifikat Publik | Download sertifikat tanpa login | ✅ Aktif |
| 15 | Detail Kegiatan Publik | Info kegiatan publik dengan link formulir | ✅ Aktif |
| 16 | Data Sync Monitor | Pantau status sinkronisasi data | ✅ Aktif |
| 17 | Profile | Kelola profil pengguna | ✅ Aktif |
| 18 | Login Admin | Autentikasi administrator | ✅ Aktif |
| 19 | Login Peserta | Autentikasi peserta | ✅ Aktif |

---

## 2. Pengelolaan Aplikasi

### 2.1 Pengelolaan Harian

| No | Aktivitas | Deskripsi | Frekuensi | Tanggung Jawab |
|----|-----------|-----------|-----------|----------------|
| 1 | Monitoring Error Log | Pantau error di console browser dan backend log | Harian | Admin/Developer |
| 2 | Verifikasi Data Kegiatan | Pastikan data kegiatan terisi dengan benar | Harian | Operator |
| 3 | Cek Status Sertifikat | Pastikan sertifikat terbit tepat waktu | Harian | Operator |
| 4 | Review Evaluasi Masuk | Pantau evaluasi yang masuk dari peserta | Harian | Admin |

### 2.2 Pengelolaan Mingguan

| No | Aktivitas | Deskripsi | Frekuensi | Tanggung Jawab |
|----|-----------|-----------|-----------|----------------|
| 1 | Backup Database | Backup database secara berkala | Mingguan | Admin Sistem |
| 2 | Review Aktivitas User | Tinjau log aktivitas pengguna | Mingguan | Admin |
| 3 | Update Status Kegiatan | Ubah status kegiatan yang sudah selesai | Mingguan | Operator |
| 4 | Pembersihan Data Duplikat | Cek dan bersihkan data peserta duplikat | Mingguan | Admin |

### 2.3 Pengelolaan Bulanan

| No | Aktivitas | Deskripsi | Frekuensi | Tanggung Jawab |
|----|-----------|-----------|-----------|----------------|
| 1 | Generate Laporan Kegiatan | Buat rekap kegiatan bulanan | Bulanan | Admin |
| 2 | Review User Aktif | Tinjau pengguna aktif dan non-aktif | Bulanan | Admin |
| 3 | Audit Akses | Periksa akses pengguna dan peran | Bulanan | Admin Sistem |
| 4 | Evaluasi Performa | Ukur performa aplikasi (load time, error rate) | Bulanan | Developer |

---

## 3. Perawatan Aplikasi

### 3.1 Perawatan Preventif

| No | Komponen | Aktivitas Perawatan | Frekuensi | Kode Terkait |
|----|----------|---------------------|-----------|--------------|
| 1 | **QR Code Generator** | Pastikan library `qrcode` v1.5.4 berfungsi | Bulanan | `Dashboard.vue:861`, `Kegiatan.vue:1785` |
| 2 | **ATK Management** | Validasi form input ATK dan penyimpanan data | Bulanan | `Kegiatan.vue:1672-2378` |
| 3 | **Evaluasi Engine** | Uji form evaluasi dan pengiriman data | Bulanan | `EvaluasiKegiatan.vue:1-710` |
| 4 | **Chart.js** | Pastikan grafik evaluasi render dengan benar | Bulanan | `LaporanEvaluasi.vue:82-99` |
| 5 | **PDF Generator** | Uji generate sertifikat PDF | Bulanan | `Sertifikat.vue` |
| 6 | **DOCX Generator** | Uji export biodata DOCX | Bulanan | `KegiatanPeserta.vue`, `src/utils/docxUtils.js` |
| 7 | **XLSX Export** | Uji export Excel | Bulanan | `KegiatanPeserta.vue` |
| 8 | **Signature Canvas** | Uji tanda tangan digital di formulir | Bulanan | `FormulirPeserta.vue` |

### 3.2 Perawatan Korektif

| No | Masalah Umum | Solusi | File Terkait |
|----|--------------|--------|--------------|
| 1 | QR Code tidak muncul | Periksa import library `qrcode` dan URL valid | `Dashboard.vue:861`, `Kegiatan.vue:1785` |
| 2 | ATK tidak tersimpan | Validasi field `nama_barang` wajib diisi | `Kegiatan.vue:2354-2378` |
| 3 | Evaluasi gagal dikirim | Cek koneksi, pastikan semua rating terisi | `EvaluasiKegiatan.vue:64-458` |
| 4 | Chart tidak render | Periksa data statistik dan konfigurasi Chart.js | `LaporanEvaluasi.vue:82-99` |
| 5 | Sertifikat gagal generate | Periksa template DOCX dan data peserta | `Sertifikat.vue` |
| 6 | Formulir tidak bisa diakses | Pastikan tanggal kegiatan sedang berlangsung | `FormulirPeserta.vue:46-80` |
| 7 | Export DOCX error | Validasi data peserta lengkap | `src/utils/docxUtils.js` |
| 8 | Data sync gagal | Periksa koneksi backend dan status API | `DataSyncMonitor.vue`, `src/services/api.js` |

### 3.3 Perawatan Adaptif

| No | Kebutuhan | Aktivitas | Estimasi Waktu |
|----|-----------|-----------|----------------|
| 1 | Browser Update | Uji kompatibilitas di Chrome, Firefox, Edge terbaru | 2-4 jam |
| 2 | OS Update | Pastikan fungsi di Windows, macOS, Linux | 1-2 hari |
| 3 | Resolusi Layar | Uji responsivitas di mobile (360px) hingga desktop (1920px) | 4-8 jam |
| 4 | API Backend Update | Sinkronisasi dengan perubahan endpoint backend | 1-2 hari |

---

## 4. Pengembangan Aplikasi

### 4.1 Pengembangan Fitur Baru (Backlog)

| No | Fitur | Prioritas | Estimasi | Keterangan |
|----|-------|-----------|----------|------------|
| 1 | Dashboard Analytics Lanjutan | Tinggi | 2-3 minggu | Grafik trend kegiatan per bulan/tahun |
| 2 | Notifikasi Email | Tinggi | 1-2 minggu | Notifikasi otomatis untuk sertifikat terbit |
| 3 | Export PDF Laporan Evaluasi | Sedang | 3-5 hari | Export seluruh laporan evaluasi ke PDF |
| 4 | Multi-Bahasa (i18n) | Sedang | 2-4 minggu | Dukungan Indonesia dan English |
| 5 | Mode Gelap (Dark Mode) | Rendah | 3-5 hari | Toggle dark/light mode |
| 6 | Pencarian Global | Tinggi | 1 minggu | Pencarian lintas modul |
| 7 | Manajemen Role Lanjutan | Sedang | 1-2 minggu | Granular permissions per menu |
| 8 | Audit Trail | Sedang | 1 minggu | Log perubahan data detail |
| 9 | Import Peserta Massal | Tinggi | 1 minggu | Import dari Excel/CSV |
| 10 | Template Sertifikat Custom | Sedang | 1-2 minggu | Upload dan kelola template sendiri |

### 4.2 Pengembangan Teknis (Refactoring)

| No | Area | Aktivitas | Prioritas | Estimasi |
|----|------|-----------|-----------|----------|
| 1 | **Kode Duplikat** | Konsolidasi fungsi ATK (`normalizeAtkItem`, `loadAtkItems`) di `Dashboard.vue` dan `Kegiatan.vue` | Tinggi | 2-3 hari |
| 2 | **Router Guards** | Optimasi lazy loading dan meta resolution | Sedang | 1 hari |
| 3 | **State Management** | Migrasi dari local state ke Pinia store untuk kegiatan | Sedang | 3-5 hari |
| 4 | **API Layer** | Abstraksi endpoint mapping dan error handling | Sedang | 2-3 hari |
| 5 | **Component Split** | Pecah `Kegiatan.vue` (3535 baris) menjadi komponen lebih kecil | Tinggi | 1-2 minggu |
| 6 | **Type Safety** | Tambahkan JSDoc atau migrasi ke TypeScript | Rendah | 2-4 minggu |
| 7 | **Testing** | Unit test untuk service layer dan integration test | Tinggi | 2-3 minggu |
| 8 | **Performance** | Lazy load chart, virtual scrolling untuk tabel besar | Sedang | 1-2 minggu |

### 4.3 Pengembangan Infrastruktur

| No | Komponen | Aktivitas | Prioritas | Estimasi |
|----|----------|-----------|-----------|----------|
| 1 | CI/CD Pipeline | Setup GitHub Actions untuk auto deploy | Tinggi | 2-3 hari |
| 2 | Environment Config | Pisahkan config dev/staging/production | Tinggi | 1 hari |
| 3 | Error Monitoring | Integrasi Sentry atau similar | Sedang | 1-2 hari |
| 4 | Performance Monitoring | Setup Lighthouse CI | Rendah | 1 hari |
| 5 | CDN | Setup CDN untuk aset statis | Sedang | 1 hari |
| 6 | Docker | Containerisasi aplikasi | Rendah | 2-3 hari |

---

## 5. Daftar Berkas dan Modul

### 5.1 Struktur Halaman (Pages)

```
src/pages/
├── Landing.vue                    # Halaman publik utama
├── Login.vue                      # Login admin
├── LoginPeserta.vue               # Login peserta
├── Dashboard.vue                  # Dashboard admin (1438 baris)
├── Kegiatan.vue                   # Manajemen kegiatan (3535 baris) ⚠️
├── KegiatanDetailPublik.vue       # Detail kegiatan publik (529 baris)
├── KegiatanPeserta.vue            # Peserta per kegiatan
├── PesertaManagement.vue          # Manajemen peserta
├── Peserta.vue                    # Placeholder (dalam pengembangan)
├── Sertifikat.vue                 # Placeholder (dalam pengembangan)
├── PegawaiManagement.vue          # Manajemen pegawai
├── UnitKerjaManagement.vue        # Manajemen unit kerja
├── AnggotaManagement.vue          # Manajemen anggota tim
├── Penugasan.vue                  # Penugasan pegawai
├── Profile.vue                    # Profil pengguna
├── FormulirPeserta.vue            # Formulir pendaftaran publik (908 baris)
├── DaftarPesertaPublik.vue        # Daftar peserta publik
├── UnduhSertifikatPublik.vue      # Unduh sertifikat publik
├── EvaluasiKegiatan.vue           # Formulir evaluasi publik (710 baris)
├── LaporanEvaluasi.vue            # Laporan evaluasi dengan grafik (704 baris)
├── LihatTandatangan.vue           # Preview tanda tangan
└── DataSyncMonitor.vue            # Monitor sinkronisasi data
```

### 5.2 Services

```
src/services/
├── api.js                # API client dan helper functions (402 baris)
├── kegiatan.js           # Kegiatan API helpers (168 baris)
├── penugasan.js          # Penugasan API helpers
├── peserta.js            # Peserta API helpers
├── unit_kerja.js         # Unit kerja API helpers
├── mockApi.js            # Mock data untuk development
├── dataSyncUtils.js      # Utilitas sinkronisasi data
└── activityLogger.js     # Logger aktivitas pengguna
```

### 5.3 Utils

```
src/utils/
├── docxUtils.js          # Utilitas generate DOCX
├── generatePOS.js        # Generate POS (Penugasan)
├── kegiatanLocation.js   # Utilitas lokasi kegiatan
└── url.js                # URL helpers
```

### 5.4 Libraries (Dependencies)

| Library | Versi | Fungsi | Modul Terkait |
|---------|-------|--------|---------------|
| `vue` | ^3.4.0 | Framework UI | Seluruh aplikasi |
| `vue-router` | ^4.3.0 | Routing | `src/router/index.js` |
| `pinia` | ^2.1.7 | State Management | `src/stores/auth.js` |
| `axios` | ^1.13.6 | HTTP Client | `src/services/api.js` |
| `chart.js` | ^4.5.1 | Grafik | `LaporanEvaluasi.vue` |
| `vue-chartjs` | ^5.3.3 | Vue Chart Components | `LaporanEvaluasi.vue` |
| `qrcode` | ^1.5.4 | QR Code Generator | `Dashboard.vue`, `Kegiatan.vue` |
| `docx` | ^9.5.1 | DOCX Generator | `src/utils/docxUtils.js` |
| `pdf-lib` | ^1.17.1 | PDF Generator | `Sertifikat.vue` |
| `xlsx` | ^0.18.5 | Excel Export | `KegiatanPeserta.vue` |
| `sweetalert2` | ^11.26.17 | Modal/Alert | Seluruh aplikasi |
| `html2canvas` | ^1.4.1 | Screenshot | `LaporanEvaluasi.vue` |

---

## 6. Risiko dan Mitigasi

### 6.1 Risiko Teknis

| No | Risiko | Dampak | Probabilitas | Mitigasi |
|----|--------|--------|--------------|----------|
| 1 | `Kegiatan.vue` terlalu besar (3535 baris) | Sulit maintain, bug prone | Tinggi | Refactoring ke komponen kecil |
| 2 | Duplikasi kode ATK di Dashboard dan Kegiatan | Inkonsistensi, bug duplikat | Sedang | Buat shared composable `useAtk.js` |
| 3 | Tidak ada automated testing | Regresi bug tidak terdeteksi | Tinggi | Tulis unit test dan integration test |
| 4 | API fallback ke local JSON | Data tidak real-time | Sedang | Pastikan backend selalu tersedia |
| 5 | Library dependency outdated | Security vulnerability | Sedang | Regular dependency update |
| 6 | Tidak ada error boundary | Aplikasi crash tanpa pesan jelas | Sedang | Implementasi global error handler |

### 6.2 Risiko Operasional

| No | Risiko | Dampak | Probabilitas | Mitigasi |
|----|--------|--------|--------------|----------|
| 1 | Server backend down | Aplikasi tidak dapat digunakan | Rendah | Setup monitoring dan alerting |
| 2 | Data peserta corrupt | Kehilangan data penting | Rendah | Backup rutin + audit trail |
| 3 | User lupa password | User tidak dapat akses | Sedang | Fitur reset password |
| 4 | Load tinggi saat kegiatan besar | Aplikasi lambat | Sedang | CDN + caching strategy |
| 5 | Perubahan kebijakan data | Perlu migrasi data | Rendah | Versioned API |

---

## 7. Jadwal Pemeliharaan

### 7.1 Jadwal Rutin

| Frekuensi | Aktivitas | Durasi |
|-----------|-----------|--------|
| Harian | Monitoring error log, cek status kegiatan | 15-30 menit |
| Mingguan | Backup database, review aktivitas user | 1-2 jam |
| Bulanan | Audit akses, evaluasi performa, update dependency | 4-8 jam |
| Quarterly | Security review, feature planning, refactoring | 1-2 hari |
| Tahunan | Major version upgrade, infrastructure review | 1 minggu |

### 7.2 Jadwal Patch

| Tipe | Deskripsi | Waktu Response |
|------|-----------|----------------|
| Critical | Aplikasi tidak berfungsi sama sekali | < 1 jam |
| High | Fitur utama tidak berfungsi | < 4 jam |
| Medium | Fitur tidak berfungsi sebagian | < 1 hari |
| Low | Cosmetic issue | < 1 minggu |

---

*Dokumen ini dibuat berdasarkan analisis kode sumber SIMAIK v1.2.0*
