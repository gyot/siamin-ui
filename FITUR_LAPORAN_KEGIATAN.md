# Fitur Laporan Kegiatan

## Deskripsi

Fitur Laporan Kegiatan memungkinkan admin untuk membuat, mengedit, dan mengunduh laporan kegiatan dalam format DOCX. Data diambil dari API (kegiatan, peserta, evaluasi) dan narasi diinput manual admin.

## Akses

| Halaman | URL | Fungsi |
|---------|-----|--------|
| Buat Laporan | `/admin/kegiatan/:id/buat-laporan` | Form input narasi + preview + download DOCX |
| Laporan Kegiatan (dummy) | `/admin/laporan-kegiatan` | Preview laporan dari data dummy |

### Cara Membuat Laporan

1. Buka **Manajemen Kegiatan** (`/admin/kegiatan`)
2. Klik ikon detail kegiatan yang ingin dibuatkan laporan
3. Klik tombol **"Buat Laporan"**
4. Isi field narasi yang diperlukan (Latar Belakang, Tujuan, dll.)
5. Klik **"Simpan Draft"** untuk menyimpan progress
6. Klik **"Preview"** untuk melihat hasil laporan
7. Klik **"Download DOCX"** untuk mengunduh file

## File Terkait

| File | Fungsi |
|------|--------|
| `src/pages/BuatLaporan.vue` | Halaman utama: form input + preview + download |
| `src/pages/LaporanKegiatan.vue` | Halaman preview dari data dummy (prototyping) |
| `src/utils/generateLaporanDocx.js` | Generator DOCX (mendukung data API + draft) |
| `src/services/activityReportDraft.js` | Service penyimpanan draft di localStorage |
| `src/data/laporanDummy.json` | Data dummy untuk prototyping |
| `src/pages/Kegiatan.vue` | Tombol "Buat Laporan" + input Jadwal Harian |
| `src/router/index.js` | Route `/admin/kegiatan/:id/buat-laporan` |

## Data Sources

### Dari API (otomatis)
- Info kegiatan (nama, tanggal, metode, TPK)
- Daftar peserta (nama, NIP, instansi, jabatan, peran)
- Data evaluasi (program, fasilitator, layanan + statistik)
- Data penugasan pegawai

### Input Manual Admin (disimpan di localStorage)
- Angkatan
- Lembar Pengesahan (3 entri: Disusun/Diverifikasi/Divalidasi)
- Kata Pengantar
- Latar Belakang, Dasar Hukum, Tujuan, Sasaran, Pembiayaan
- Rekaman Proses per hari
- Kesimpulan, Saran

### Dari Form Kegiatan (jika diisi)
- Jadwal Harian (input di form tambah/edit kegiatan)
- Struktur Program (auto-generate dari jadwal)

## Struktur Data Draft (localStorage)

```javascript
// Key: siamik_activity_report_drafts_v1
// Format: { [id_kegiatan]: { version, id_kegiatan, updated_at, data: {...} } }

data: {
  angkatan: 'Angkatan I',
  pengesahan: [
    { peran: 'Disusun oleh', nama: '', nip: '', jabatan: '', tanggal: '' },
    { peran: 'Diverifikasi oleh', nama: '', nip: '', jabatan: '', tanggal: '' },
    { peran: 'Divalidasi oleh', nama: '', nip: '', jabatan: '', tanggal: '' }
  ],
  kata_pengantar: '',
  latar_belakang: '',
  dasar_hukum: [],
  tujuan_umum: '',
  sasaran_kegiatan: '',
  sumber_dana: '',
  rekaman_proses_per_hari: [{ hari: 'Hari Pertama', tanggal: '...', narasi: '' }],
  simpulan: '',
  rekomendasi: '',
  struktur_program: [],
  jadwal_harian: []
}
```

## Endpoint API yang Perlu Dibuat (Backend)

Untuk mengganti localStorage dengan database:

### 1. Simpan/Ambil Draft Laporan
```
POST /api/v1/kegiatan/{id}/laporan-draft
GET  /api/v1/kegiatan/{id}/laporan-draft
```
Body: object `data` dari draft di atas (33+ field narasi)

### 2. Simpan/Ambil Jadwal Harian
```
POST /api/v1/kegiatan/{id}/jadwal-harian
GET  /api/v1/kegiatan/{id}/jadwal-harian
```
Body:
```json
{
  "jadwal": [
    {
      "hari": "Hari Pertama",
      "tanggal": "2026-07-26",
      "items": [
        { "waktu": "08.00 - 10.00", "kegiatan": "Materi A", "kategori": "Pokok", "pj": "Fasilitator 1" }
      ]
    }
  ]
}
```

### 3. Tabel Database yang Dibutuhkan
```sql
-- Draft narasi laporan
CREATE TABLE laporan_drafts (
  id SERIAL PRIMARY KEY,
  id_kegiatan INT REFERENCES kegiatan(id_kegiatan),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jadwal harian kegiatan
CREATE TABLE jadwal_harian (
  id SERIAL PRIMARY KEY,
  id_kegiatan INT REFERENCES kegiatan(id_kegiatan),
  hari VARCHAR(50),
  tanggal DATE,
  items JSONB NOT NULL,
  urutan INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Teknologi

- Vue 3 (Composition API + Options API)
- Tailwind CSS untuk styling preview
- `docx` library untuk generasi file DOCX (client-side)
- localStorage untuk penyimpanan draft sementara
