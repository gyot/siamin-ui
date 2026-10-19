# Rencana: Fitur Buat Laporan Kegiatan

## Ringkasan

Mengubah halaman `LaporanKegiatan.vue` dari statis (dummy JSON) menjadi dinamis yang:
- Dipicu dari tombol "Buat Laporan" di halaman Manajemen Kegiatan
- Mengambil data kegiatan, peserta, evaluasi dari API
- Menyediakan form input untuk narasi manual (Latar Belakang, Tujuan, dll.)
- Menyimpan draft di localStorage (dengan dokumentasi migrasi ke API)
- Menambahkan input Jadwal Harian di form tambah/edit kegiatan

## Keputusan Desain

| Aspek | Keputusan |
|-------|-----------|
| Akses | Tombol "Buat Laporan" di setiap baris kegiatan (`Kegiatan.vue`) |
| Route | `/admin/kegiatan/:id/buat-laporan` (baru) |
| Penyimpanan narasi | localStorage via `activityReportDraft.js` (existing) |
| Data API | Kegiatan, Peserta, Evaluasi, Penugasan dari endpoint existing |
| Jadwal Harian | Input baru di form Kegiatan, disimpan per kegiatan (per kelas jika ada kelas) |
| Struktur Program | Auto-generate dari jadwal harian (group by kategori materi) |
| DOCX | Gabungkan `generateLaporanDocx.js` dengan data API + draft |

## Task List

### Task 1: Tambah input Jadwal Harian di form Kegiatan
**File**: `src/pages/Kegiatan.vue`

- Tambah section "Jadwal Harian" di form tambah/edit kegiatan (setelah section TPK)
- UI: Per hari (tanggal otomatis dari range tanggal_mulai - tanggal_selesai), tabel waktu/materi/penanggung_jawab
- Tambah tombol "+" untuk menambah hari, "+" untuk menambah item per hari
- Jika kelas tersedia untuk kegiatan ini, tambahkan tab per kelas
- State baru: `jadwalHarian` (array of {hari, tanggal, items: [{waktu, materi, kategori, pj}]})
- Load existing jadwal dari kegiatan saat edit
- Kirim ke payload FormData/JSON saat save

### Task 2: Extend `activityReportDraft.js` dengan field baru
**File**: `src/services/activityReportDraft.js`

- Tambah field baru di `createEmptyActivityReportDraft()`:
  - `struktur_program`: array (auto-generated dari jadwal)
  - `jadwal_harian`: array (bisa di-override manual)
  - `angkatan`: string
  - `pengesahan`: array of {peran, nama, nip, jabatan, tanggal} (3 entri)
- Pastikan backward compatibility dengan draft yang sudah ada

### Task 3: Buat halaman Buat Laporan dinamis
**File**: `src/pages/BuatLaporan.vue` (baru, ganti `LaporanKegiatan.vue`)

- Route: `/admin/kegiatan/:id/buat-laporan`
- Load data dari API:
  - `getKegiatan(id)` → info kegiatan
  - `listKegiatan()` untuk peserta per kegiatan
  - `fetchAPI('evaluasi/{id}/statistik')` → evaluasi
  - `fetchAPI('evaluasi/{id}')` → detail evaluasi
  - `listPenugasanPegawai()` → penugasan
- Load draft dari `getActivityReportDraft(id)` → narasi manual
- **Form mode**: Admin bisa edit semua narasi field (textarea per section)
  - Kata Pengantar, Latar Belakang, Dasar Hukum, Tujuan, Sasaran, Pembiayaan
  - Rekaman Proses per hari, Kesimpulan, Saran
  - Pengesahan (3 entri: Disusun/Diverifikasi/Divalidasi)
  - Angkatan
- **Preview mode**: Tampilkan laporan lengkap seperti sekarang
- Tombol: "Simpan Draft", "Preview", "Download DOCX"
- Auto-save draft setiap 30 detik

### Task 4: Update `generateLaporanDocx.js` untuk menerima data campuran
**File**: `src/utils/generateLaporanDocx.js`

- Ubah signature: `generateLaporanDocx({ kegiatan, peserta, evaluasi, penugasan, draft, jadwal })`
- Data otomatis dari API: kegiatan info, peserta, evaluasi
- Data manual dari draft: narasi, pengesahan, struktur_program
- Tetap gunakan struktur yang sama (Sampul, Pengesahan, BAB I-V)

### Task 5: Tambah tombol "Buat Laporan" di Kegiatan.vue
**File**: `src/pages/Kegiatan.vue`

- Tambah tombol di kolom aksi tabel kegiatan (desktop + mobile)
- Link ke `/admin/kegiatan/{id}/buat-laporan`
- Ikon dokumen

### Task 6: Update route dan sidebar
**File**: `src/router/index.js`

- Tambah route `/admin/kegiatan/:id/buat-laporan` → `BuatLaporan.vue`
- Route lama `/admin/laporan-kegiatan` tetap ada (redirect ke halaman pilih kegiatan)

### Task 7: Dokumentasi migrasi API
**File**: `FITUR_LAPORAN_KEGIATAN.md` (update)

- Dokumentasikan endpoint API yang perlu dibuat:
  - `POST /api/v1/kegiatan/{id}/jadwal-harian` → simpan jadwal
  - `GET /api/v1/kegiatan/{id}/jadwal-harian` → ambil jadwal
  - `POST /api/v1/kegiatan/{id}/laporan-draft` → simpan draft narasi
  - `GET /api/v1/kegiatan/{id}/laporan-draft` → ambil draft narasi
- Struktur data request/response untuk setiap endpoint
- Mapping field localStorage → database

## Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Jadwal harian kompleks di form kegiatan | UI sederhana: tabel per hari, bisa expand/collapse |
| localStorage hilang saat clear browser | Dokumentasi .md agar admin tahu cara backup |
| Kegiatan tanpa evaluasi | Tampilkan placeholder "Data evaluasi belum tersedia" |
| Kegiatan tanpa kelas | Jadwal tanpa pemisahan kelas, langsung ke kegiatan utama |

## Validasi

1. Buka `/admin/kegiatan` → tombol "Buat Laporan" muncul di setiap baris
2. Klik tombol → halaman form terbuka dengan data kegiatan terisi otomatis
3. Isi narasi → simpan draft → refresh halaman → data tetap ada
4. Klik Preview → laporan tampil lengkap
5. Klik Download DOCX → file terunduh dengan semua section
6. Di form Kegiatan, tambah jadwal harian → data tersimpan → muncul di laporan
