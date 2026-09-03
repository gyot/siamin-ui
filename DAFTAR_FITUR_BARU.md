# DAFTAR FITUR BARU SIMAIK

**Tanggal:** 14 Juli 2026  
**Versi:** 1.0  
**Kondisi:** Fitur yang belum ada di SIMAIK v1.2.0

---

## DAFTAR ISI

1. [Fitur Absensi Digital](#1-fitur-absensi-digital)
2. [Fitur Surat Tugas Digital](#2-fitur-surat-tugas-digital)
3. [Fitur Notifikasi & Pengingat](#3-fitur-notifikasi--pengingat)
4. [Fitur Laporan Keuangan](#4-fitur-laporan-keuangan)
5. [Fitur Manajemen Dokumen](#5-fitur-manajemen-dokumen)
6. [Fitur Kalender Kegiatan](#6-fitur-kalender-kegiatan)
7. [Fitur Dashboard Analitik Lanjutan](#7-fitur-dashboard-analitik-lanjutan)
8. [Fitur Manajemen Pengguna](#8-fitur-manajemen-pengguna)
9. [Fitur Integrasi Sistem Lain](#9-fitur-integrasi-sistem-lain)
10. [Fitur Export & Import Lanjutan](#10-fitur-export--import-lanjutan)

---

## 1. Fitur Absensi Digital

### 1.1 Deskripsi
Sistem absensi digital untuk peserta kegiatan dengan metode QR Code, GPS, dan selfie.

### 1.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 1.1 | Absensi QR Code | Peserta scan QR Code di lokasi kegiatan untuk absen hadir | Tinggi |
| 1.2 | Absensi GPS | Validasi kehadiran berdasarkan lokasi GPS (radius tertentu) | Sedang |
| 1.3 | Absensi Selfie | Upload selfie sebagai bukti kehadiran | Rendah |
| 1.4 | Rekap Absensi | Tabel rekap kehadiran per peserta per kegiatan | Tinggi |
| 1.5 | Export Absensi | Export data absensi ke Excel | Sedang |
| 1.6 | Laporan Kehadiran | Grafik persentase kehadiran peserta | Sedang |

### 1.3 Alur Kerja
```
Admin buat kegiatan → Generate QR Code absensi → Peserta hadir →
Scan QR di lokasi → Sistem validasi GPS → Data absensi tersimpan →
Admin lihat rekap → Export laporan
```

### 1.4 Backend API yang Dibutuhkan
- `POST /api/v1/absensi` — Catat kehadiran
- `GET /api/v1/absensi/kegiatan/{id}` — Rekap absensi per kegiatan
- `GET /api/v1/absensi/peserta/{id}` — Riwayat absensi peserta
- `PUT /api/v1/absensi/{id}` — Update status kehadiran

---

## 2. Fitur Surat Tugas Digital

### 2.1 Deskripsi
Pembuatan dan pengelolaan surat tugas digital secara otomatis.

### 2.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 2.1 | Template Surat | Kelola template surat tugas (DOCX) | Tinggi |
| 2.2 | Auto Generate | Generate surat tugas otomatis dari data kegiatan | Tinggi |
| 2.3 | Tanda Tangan Digital | Tanda tangan digital pejabat berwenang | Sedang |
| 2.4 | Status Surat | Status: Draft, Dikirim, Diterima, Selesai | Sedang |
| 2.5 | Kirim Email | Kirim surat tugas via email otomatis | Sedang |
| 2.6 | Arsip Surat | Arsip dan pencarian surat tugas | Rendah |

### 2.3 Template Surat Tugas
```
SURAT TUGAS
Nomor: [AUTO_GENERATED]

Yang bertanda tangan di bawah ini:
Nama: [NAMA_PEJABAT]
Jabatan: [JABATAN]

Dengan ini menugaskan:
Nama: [NAMA_PEGAWAI]
NIP: [NIP]

Untuk melaksanakan kegiatan:
Nama Kegiatan: [NAMA_KEGIATAN]
Tanggal: [TANGGAL_MULAI] - [TANGGAL_SELESAI]
Lokasi: [LOKASI]

Dikeluarkan di: Mataram
Pada tanggal: [TANGGAL_SAUAT]
```

### 2.4 Backend API yang Dibutuhkan
- `POST /api/v1/surat-tugas` — Buat surat tugas
- `GET /api/v1/surat-tugas/{id}` — Detail surat
- `PUT /api/v1/surat-tugas/{id}/status` — Update status
- `POST /api/v1/surat-tugas/{id}/kirim` — Kirim surat

---

## 3. Fitur Notifikasi & Pengingat

### 3.1 Deskripsi
Sistem notifikasi otomatis untuk pengingat kegiatan, sertifikat, dan evaluasi.

### 3.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 3.1 | Email Notifikasi | Notifikasi via email untuk event penting | Tinggi |
| 3.2 | Push Notification | Notifikasi browser (Web Push API) | Sedang |
| 3.3 | WhatsApp Integration | Kirim pengingat via WhatsApp API | Sedang |
| 3.4 | Pengingat H-1 | Pengingat 1 hari sebelum kegiatan | Tinggi |
| 3.5 | Pengingat Evaluasi | Pengingat mengisi evaluasi | Sedang |
| 3.6 | Pengingat Sertifikat | Notifikasi sertifikat sudah terbit | Sedang |
| 3.7 | Dashboard Notifikasi | Halaman notifikasi masuk | Rendah |

### 3.3 Template Notifikasi
```json
{
  "kegiatan_h_minus_1": {
    "subject": "Pengingat: Kegiatan Besok",
    "body": "Kegiatan [NAMA_KEGIATAN] akan dilaksanakan besok di [LOKASI]"
  },
  "sertifikat_terbit": {
    "subject": "Sertifikat Sudah Terbit",
    "body": "Sertifikat kegiatan [NAMA_KEGIATAN] sudah bisa diunduh"
  },
  "evaluasi_pending": {
    "subject": "Pengingat Evaluasi",
    "body": "Silakan isi evaluasi kegiatan [NAMA_KEGIATAN]"
  }
}
```

### 3.4 Backend API yang Dibutuhkan
- `POST /api/v1/notifikasi/kirim` — Kirim notifikasi
- `GET /api/v1/notifikasi` — Daftar notifikasi
- `PUT /api/v1/notifikasi/{id}/baca` — Tandai sudah dibaca
- `POST /api/v1/notifikasi/template` — Kelola template

---

## 4. Fitur Laporan Keuangan

### 4.1 Deskripsi
Pelacakan dan pelaporan keuangan terkait kegiatan.

### 4.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 4.1 | Anggaran Kegiatan | Input anggaran per kegiatan | Tinggi |
| 4.2 | Realisasi Biaya | Catat realisasi pengeluaran | Tinggi |
| 4.3 | Rekap Keuangan | Tabel rekap anggaran vs realisasi | Sedang |
| 4.4 | Grafik Keuangan | Chart perbandingan anggaran | Sedang |
| 4.5 | Export Laporan | Export ke Excel/PDF | Sedang |
| 4.6 | Approval Anggaran | Persetujuan anggaran oleh atasan | Rendah |

### 4.3 Struktur Data
```json
{
  "id_kegiatan": "string",
  "anggaran": {
    "total": 50000000,
    "rincian": [
      {"kategori": "Transport", " nominal": 10000000},
      {"kategori": "Konsumsi", "nominal": 15000000},
      {"kategori": "ATK", "nominal": 5000000},
      {"kategori": "Lainnya", "nominal": 20000000}
    ]
  },
  "realisasi": {
    "total": 45000000,
    "rincian": [...]
  },
  "selisih": 5000000,
  "persentase": 90
}
```

### 4.4 Backend API yang Dibutuhkan
- `POST /api/v1/keuangan` — Input anggaran/realisasi
- `GET /api/v1/keuangan/kegiatan/{id}` — Data keuangan kegiatan
- `GET /api/v1/keuangan/rekap` — Rekap keuangan
- `GET /api/v1/keuangan/export` — Export laporan

---

## 5. Fitur Manajemen Dokumen

### 5.1 Deskripsi
Pengelolaan dokumen terkait kegiatan secara terpusat.

### 5.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 5.1 | Upload Dokumen | Upload berbagai jenis file (PDF, DOCX, XLSX, gambar) | Tinggi |
| 5.2 | Folder Kegiatan | Folder otomatis per kegiatan | Sedang |
| 5.3 | Version Control | Versioning dokumen | Rendah |
| 5.4 | Preview | Preview dokumen di browser | Sedang |
| 5.5 | Share Link | Generate link sharing dokumen | Sedang |
| 5.6 | Permission | Akses dokumen berdasarkan role | Rendah |

### 5.3 Jenis Dokumen
| Kategori | Tipe File | Keterangan |
|----------|-----------|------------|
| Administrasi | PDF, DOCX | Surat, proposal, laporan |
| Materi | PDF, PPTX | Materi pelatihan |
| Dokumentasi | JPG, PNG, MP4 | Foto dan video kegiatan |
| Keuangan | XLSX, PDF | Invoice, bukti bayar |
| Lainnya | Semua | Dokumen pendukung lainnya |

### 5.4 Backend API yang Dibutuhkan
- `POST /api/v1/dokumen` — Upload dokumen
- `GET /api/v1/dokumen/kegiatan/{id}` — Daftar dokumen kegiatan
- `GET /api/v1/dokumen/{id}` — Download dokumen
- `DELETE /api/v1/dokumen/{id}` — Hapus dokumen

---

## 6. Fitur Kalender Kegiatan

### 6.1 Deskripsi
Tampilan kalender interaktif untuk melihat jadwal kegiatan.

### 6.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 6.1 | View Bulanan | Kalender tampilan bulanan | Tinggi |
| 6.2 | View Mingguan | Kalender tampilan mingguan | Sedang |
| 6.3 | View Harian | Kalender tampilan harian | Sedang |
| 6.4 | Filter | Filter berdasarkan unit kerja, status | Sedang |
| 6.5 | Detail Event | Klik event untuk lihat detail | Sedang |
| 6.6 | Export Kalender | Export ke format .ics | Rendah |

### 6.3 Tampilan
```
┌─────────────────────────────────────────────────────┐
│ Juli 2026                                          │
├─────┬─────┬─────┬─────┬─────┬─────┬─────┤
│ Min │ Sen │ Sel │ Rab │ Kam │ Jum │ Sab │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │     │  1  │  2  │  3  │  4  │
│     │     │     │ 🟢  │     │ 🟡  │     │
│     │     │     │PKL  │     │Rapat│     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │
│ 🔵  │     │ 🟢  │     │     │ 🔴  │     │
│Work │     │Sosia│     │     │Seles│     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

### 6.4 Backend API yang Dibutuhkan
- `GET /api/v1/kalender` — Data kalender
- `GET /api/v1/kalender/bulan/{bulan}/{tahun}` — Filter bulan
- `GET /api/v1/kalender/ics` — Export format .ics

---

## 7. Fitur Dashboard Analitik Lanjutan

### 7.1 Deskripsi
Dashboard analitik dengan grafik dan insight mendalam.

### 7.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 7.1 | Trend Kegiatan | Grafik trend jumlah kegiatan per bulan/tahun | Tinggi |
| 7.2 | Distribusi Peserta | Pie chart distribusi peserta per unit kerja | Sedang |
| 7.3 | Evaluasi Score | Rata-rata skor evaluasi per kegiatan | Sedang |
| 7.4 | Top Kegiatan | Kegiatan dengan peserta terbanyak | Rendah |
| 7.5 | Prediksi | Prediksi jumlah kegiatan mendatang | Rendah |
| 7.6 | Comparative | Perbandingan kegiatan antar periode | Sedang |

### 7.3 Komponen Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│                    ANALITIK SIMAIK                         │
├─────────────┬─────────────┬─────────────┬─────────────┤
│ Total       │ Total       │ Rata-rata   │ Persentase  │
│ Kegiatan    │ Peserta     │ Evaluasi    │ Kehadiran   │
│ 150         │ 4,500       │ 4.2/5       │ 85%         │
├─────────────┴─────────────┴─────────────┴─────────────┤
│ [Grafik Trend Kegiatan 12 Bulan Terakhir]              │
│                                                        │
├──────────────────────┬──────────────────────┤
│ [Pie Chart Unit      │ [Bar Chart Top      │
│  Kerja]              │  10 Kegiatan]       │
├──────────────────────┴──────────────────────┤
│ [Tabel Perbandingan Periode]                │
└─────────────────────────────────────────────────────────────┘
```

### 7.4 Backend API yang Dibutuhkan
- `GET /api/v1/analytics/overview` — Overview statistik
- `GET /api/v1/analytics/trend` — Trend kegiatan
- `GET /api/v1/analytics/distribusi` — Distribusi peserta
- `GET /api/v1/analytics/evaluasi` — Statistik evaluasi

---

## 8. Fitur Manajemen Pengguna

### 8.1 Deskripsi
Pengelolaan pengguna dan hak akses sistem.

### 8.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 8.1 | User Management | CRUD pengguna | Tinggi |
| 8.2 | Role Management | Kelola role dan permission | Tinggi |
| 8.3 | Audit Log | Log aktivitas pengguna | Sedang |
| 8.4 | Session Management | Kelola session aktif | Sedang |
| 8.5 | Password Policy | Aturan password kuat | Sedang |
| 8.6 | Two-Factor Auth | 2FA untuk admin | Rendah |

### 8.3 Role dan Permission
| Role | Kegiatan | Peserta | Sertifikat | Keuangan | Pengguna |
|------|----------|---------|------------|----------|----------|
| Super Admin | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Admin | ✅ Full | ✅ Full | ✅ Full | ✅ View | ❌ |
| Operator | ✅ CRUD | ✅ CRUD | ✅ View | ❌ | ❌ |
| Verifikator | ✅ View | ✅ View | ✅ Verify | ❌ | ❌ |
| Viewer | ✅ View | ✅ View | ✅ View | ❌ | ❌ |

### 8.4 Backend API yang Dibutuhkan
- `POST /api/v1/users` — Buat pengguna
- `GET /api/v1/users` — Daftar pengguna
- `PUT /api/v1/users/{id}` — Update pengguna
- `DELETE /api/v1/users/{id}` — Hapus pengguna
- `GET /api/v1/audit-log` — Log aktivitas

---

## 9. Fitur Integrasi Sistem Lain

### 9.1 Deskripsi
Integrasi dengan sistem eksternal yang digunakan oleh BPMP NTB.

### 9.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 9.1 | Integrasi SAPK | Sinkronisasi data pegawai dari SAPK | Sedang |
| 9.2 | Integrasi Email | Kirim email via SMTP/Gmail API | Tinggi |
| 9.3 | Integrasi WhatsApp | Notifikasi via WhatsApp Business API | Sedang |
| 9.4 | Integrasi Google Calendar | Sinkronisasi jadwal ke Google Calendar | Rendah |
| 9.5 | Integrasi BPJS | Validasi data BPJS peserta | Rendah |
| 9.6 | Webhook | Webhook untuk event-triggered action | Rendah |

### 9.3 Arsitektur Integrasi
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   SIMAIK    │────▶│  Middleware │────▶│  SAPK       │
│   (Frontend)│     │  (API)      │     │  (Backend)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Email/WhatsApp│
                    │  Service     │
                    └─────────────┘
```

---

## 10. Fitur Export & Import Lanjutan

### 10.1 Deskripsi
Fitur export dan import data yang lebih lengkap.

### 10.2 Detail Fitur

| No | Sub-Fitur | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 10.1 | Export PDF Laporan | Export seluruh laporan kegiatan ke PDF | Sedang |
| 10.2 | Export Sertifikat Batch | Export semua sertifikat dalam 1 file ZIP | Tinggi |
| 10.3 | Import Peserta | Import data peserta dari Excel/CSV | Tinggi |
| 10.4 | Import Kegiatan | Import data kegiatan dari template | Sedang |
| 10.5 | Template Download | Download template import | Sedang |
| 10.6 | Validation Preview | Preview data sebelum import | Sedang |

### 10.3 Format Import
```csv
nama_lengkap,nip,email,no_hp,jenis_kelamin,instansi,kabupaten_kota,peran
"Ahmad Sudirman","198501012010011001","ahmad@email.com","08123456789","laki-laki","BPMP NTB","Kota Mataram","Peserta"
"Siti Rahmawati","198501012010011002","siti@email.com","08123456790","perempuan","BPMP NTB","Kota Mataram","Narasumber"
```

### 10.4 Backend API yang Dibutuhkan
- `POST /api/v1/import/peserta` — Import peserta dari Excel
- `POST /api/v1/import/kegiatan` — Import kegiatan dari template
- `GET /api/v1/export/template/{jenis}` — Download template
- `GET /api/v1/export/sertifikat/batch/{id}` — Export batch sertifikat

---

## RINGKASAN KEBUTUHAN

### Backend API Baru yang Dibutuhkan

| No | Modul | Jumlah Endpoint | Estimasi Backend |
|----|-------|-----------------|------------------|
| 1 | Absensi Digital | 4 endpoint | 3-5 hari |
| 2 | Surat Tugas Digital | 4 endpoint | 2-3 hari |
| 3 | Notifikasi | 4 endpoint | 3-5 hari |
| 4 | Laporan Keuangan | 4 endpoint | 5-7 hari |
| 5 | Manajemen Dokumen | 4 endpoint | 3-5 hari |
| 6 | Kalender | 3 endpoint | 2-3 hari |
| 7 | Dashboard Analitik | 4 endpoint | 5-7 hari |
| 8 | Manajemen Pengguna | 6 endpoint | 3-5 hari |
| 9 | Integrasi Sistem | 6 endpoint | 7-10 hari |
| 10 | Export/Import | 6 endpoint | 3-5 hari |

**Total Estimasi Backend:** 44-55 hari kerja

### Frontend (Vue 3) yang Dibutuhkan

| No | Modul | Halaman Baru | Komponen Baru | Estimasi Frontend |
|----|-------|--------------|---------------|-------------------|
| 1 | Absensi Digital | 2 halaman | 5 komponen | 5-7 hari |
| 2 | Surat Tugas Digital | 2 halaman | 4 komponen | 3-5 hari |
| 3 | Notifikasi | 1 halaman | 3 komponen | 3-5 hari |
| 4 | Laporan Keuangan | 2 halaman | 5 komponen | 5-7 hari |
| 5 | Manajemen Dokumen | 2 halaman | 4 komponen | 3-5 hari |
| 6 | Kalender | 1 halaman | 3 komponen | 3-5 hari |
| 7 | Dashboard Analitik | 1 halaman | 6 komponen | 5-7 hari |
| 8 | Manajemen Pengguna | 3 halaman | 5 komponen | 5-7 hari |
| 9 | Integrasi Sistem | 1 halaman | 2 komponen | 3-5 hari |
| 10 | Export/Import | 1 halaman | 3 komponen | 3-5 hari |

**Total Estimasi Frontend:** 38-58 hari kerja

---

## REKOMENDASI PRIORITAS

### Fase 1 (Mendatang)
1. **Fitur Absensi Digital** — Kebutuhan utama pelaporan kegiatan
2. **Fitur Notifikasi** — Meningkatkan engagement peserta
3. **Import Peserta Excel** — Efisiensi input data massal

### Fase 2 (3-6 Bulan)
4. **Fitur Surat Tugas Digital** — Otomasi administrasi
5. **Fitur Manajemen Dokumen** — Pusat dokumen kegiatan
6. **Fitur Kalender** — Visualisasi jadwal

### Fase 3 (6-12 Bulan)
7. **Fitur Laporan Keuangan** — Transparansi anggaran
8. **Fitur Dashboard Analitik** — Insight data
9. **Fitur Manajemen Pengguna** — Keamanan sistem

### Fase 4 (> 12 Bulan)
10. **Fitur Integrasi Sistem** — Ekosistem terintegrasi

---

*Dokumen ini dibuat berdasarkan analisis kebutuhan aplikasi SIMAIK v1.2.0*
