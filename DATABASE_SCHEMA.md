# 📊 Database Schema SIMAIK - Implementasi Lengkap

## Overview
Database SIMAIK telah diimplementasikan sebagai JSON dummy data yang mengikuti struktur SQL yang Anda berikan. Semua tabel dan relasi sudah tercakup dengan sample data yang realistis.

---

## 1️⃣ Tabel: PEGAWAI
**Status**: ✅ Diimplementasikan dengan 3 data sample

### Struktur
```json
{
  "id_pegawai": 1,
  "nip": "197803152005011001",
  "nama": "Dr. Bambang Sutrisno",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1978-03-15",
  "tmt_cpns": "2005-01-15",
  "tmt_pangkat": "2020-04-01",
  "pangkat": "Pembina Tingkat I",
  "golongan": "IV/b",
  "nama_jabatan": "Kepala Biro",
  "tmt_jabatan": "2022-01-01",
  "unit_kerja": "Biro Administrasi",
  "pendidikan_terakhir": "S3",
  "jurusan": "Administrasi Publik",
  "tempat_pendidikan": "Universitas Indonesia",
  "tahun_lulus": 2003,
  "masa_kerja_tahun": 19,
  "masa_kerja_bulan": 0,
  "latihan_jabatan": "Diklat Kepemimpinan Tingkat II",
  "perkiraan_pensiun": 2033,
  "status_kepegawaian": "PNS",
  "status": "aktif",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Data Sample
| ID | NIP | Nama | Pangkat | Golongan | Jabatan | Status |
|----|-----|------|---------|----------|---------|--------|
| 1 | 197803152005011001 | Dr. Bambang Sutrisno | Pembina Tingkat I | IV/b | Kepala Biro | aktif |
| 2 | 198501152010011002 | Siti Nurhaliza | Penata Tingkat I | III/d | Koordinator Program | aktif |
| 3 | 199203201015012003 | Ahmad Hidayat | Penata | III/c | Verifikator | aktif |

---

## 2️⃣ Tabel: USERS
**Status**: ✅ Diimplementasikan dengan 3 data sample

### Struktur
```json
{
  "id_user": 1,
  "id_pegawai": 1,
  "email": "admin@kemkominfo.go.id",
  "password": "$2b$10$hashedpassword1",
  "role": "admin",
  "last_login": "2026-01-21T09:30:00Z",
  "status": "aktif",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Data Sample
| ID | Email | Role | Status | Last Login |
|----|-------|------|--------|------------|
| 1 | admin@kemkominfo.go.id | admin | aktif | 2026-01-21 09:30:00 |
| 2 | operator@kemkominfo.go.id | operator | aktif | 2026-01-21 08:15:00 |
| 3 | verifikator@kemkominfo.go.id | verifikator | aktif | 2026-01-21 10:00:00 |

**Role Options**
- `admin`: Administrator sistem
- `operator`: Operator input data
- `verifikator`: Verifikator data
- `kepala`: Kepala unit

---

## 3️⃣ Tabel: KEGIATAN
**Status**: ✅ Diimplementasikan dengan 3 data sample

### Struktur
```json
{
  "id_kegiatan": 1,
  "nama_kegiatan": "Pelatihan Dasar CPNS Angkatan I",
  "rincian_kegiatan": "Pelatihan dasar untuk CPNS angkatan I tahun 2025 meliputi materi etika, integritas, dan layanan publik",
  "dokumentasi_url": "https://example.com/dokumentasi/kegiatan-1",
  "materi_url": "https://example.com/materi/kegiatan-1",
  "panduan_url": "https://example.com/panduan/kegiatan-1",
  "laporan_url": "https://example.com/laporan/kegiatan-1",
  "surat_menyurat_url": "https://example.com/surat/kegiatan-1",
  "tanggal_mulai": "2025-02-01",
  "tanggal_selesai": "2025-02-28",
  "lokasi": "Jakarta",
  "flyer": "base64-encoded-image",
  "peserta_ringkasan": "CPNS",
  "total_peserta": 45,
  "metode_pembayaran": "tidak_dibayar",
  "deskripsi": "Pelatihan komprehensif untuk CPNS baru",
  "metode_pelaksanaan": "hybrid",
  "status": "berjalan",
  "created_by": 1,
  "created_at": "2025-01-10T00:00:00Z",
  "updated_at": "2025-01-20T15:30:00Z"
}
```

### Data Sample
| ID | Nama | Tanggal | Lokasi | Total | Metode | Status |
|----|------|---------|--------|-------|--------|--------|
| 1 | Pelatihan Dasar CPNS Angkatan I | 2025-02-01 s/d 2025-02-28 | Jakarta | 45 | hybrid | berjalan |
| 2 | Bimtek Pengelolaan Arsip Digital | 2025-03-15 s/d 2025-03-17 | Bandung | 30 | luring | akan_datang |
| 3 | Workshop Transformasi Digital | 2025-01-10 s/d 2025-01-12 | Online | 120 | daring | selesai |

**Status Options**
- `draft`: Konsep/draft
- `berjalan`: Sedang berlangsung
- `selesai`: Sudah selesai
- `dibatalkan`: Dibatalkan

**Metode Pelaksanaan Options**
- `daring`: Online/distance learning
- `luring`: Offline/tatap muka
- `hybrid`: Campuran daring + luring

**Metode Pembayaran Options**
- `transfer`: Transfer bank
- `pulsa`: Pulsa
- `transfer_dan_pulsa`: Transfer + pulsa
- `tunai`: Cash
- `tidak_dibayar`: Gratis

---

## 4️⃣ Tabel: PESERTA
**Status**: ✅ Diimplementasikan dengan 4 data sample

### Struktur (Subdivisi Data)
```json
{
  "id_peserta": 1,
  "id_kegiatan": 1,
  
  // DATA PRIBADI
  "nama_lengkap": "Budi Santoso",
  "nip": "198501152010011001",
  "pangkat": "Penata Muda",
  "gol": "III/a",
  "jabatan": "Staff",
  "no_hp": "081234567890",
  "email": "budi.santoso@kemkominfo.go.id",
  "npwp_nik": "1985011500000001",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1985-01-15",
  "jenis_kelamin": "Laki-laki",
  
  // DATA INSTANSI
  "nama_instansi": "Kemkominfo",
  "alamat_instansi": "Jl. Medan Merdeka Barat No.9, Jakarta Pusat",
  "kab_kota": "Jakarta Pusat",
  "provinsi": "DKI Jakarta",
  "telp_instansi": "02134819000",
  "email_instansi": "info@kemkominfo.go.id",
  
  // DATA PEMBAYARAN (CONDITIONAL)
  "provider_pulsa": null,
  "nomor_rekening": "1234567890",
  "nama_bank": "Bank Mandiri",
  
  // ADMINISTRASI
  "no_surat_tugas": "ST-001/2025",
  "tanggal_surat_tugas": "2025-02-01",
  "peran": "Peserta",
  "tanda_tangan": "base64-encoded-signature",
  
  "created_at": "2025-01-20T00:00:00Z",
  "updated_at": "2025-01-21T10:30:00Z"
}
```

### Data Sample
| ID | Nama | NIP | Email | Instansi | Kegiatan | Peran |
|----|------|-----|-------|----------|----------|-------|
| 1 | Budi Santoso | 198501152010011001 | budi.santoso@kemkominfo.go.id | Kemkominfo | 1 | Peserta |
| 2 | Siti Nurhayati | 198601202011012002 | siti.nurhayati@kemkominfo.go.id | Kemkominfo | 1 | Peserta |
| 3 | Ahmad Ridho | 198701152012013003 | ahmad.ridho@kemkominfo.go.id | Kemkominfo | 1 | Peserta |
| 4 | Rina Wijaya | 198902101014021004 | rina.wijaya@kemkominfo.go.id | Kemkominfo Regional Jabar | 2 | Peserta |

**Peran Options**
- `Peserta`: Peserta reguler
- `Narasumber`: Pemberi materi
- `Fasilitator`: Fasilitator
- `Panitia`: Panitia penyelenggara

**Provider Pulsa Options**
- Telkomsel
- Indosat
- XL Axiata
- Tri
- Smartfren

---

## 5️⃣ Tabel: SERTIFIKAT
**Status**: ✅ Diimplementasikan dengan 2 data sample

### Struktur
```json
{
  "id_sertifikat": 1,
  "id_kegiatan": 1,
  "id_peserta": 1,
  "nomor_sertifikat": "CERT-2025-001",
  "tanggal_ttd": "2025-02-28",
  "id_penandatangan": 1,
  "template": "template_1",
  "status": "terbit",
  "peran": "Peserta",
  "created_at": "2025-02-28T00:00:00Z",
  "updated_at": "2025-02-28T14:00:00Z"
}
```

### Data Sample
| ID | Peserta | Kegiatan | Nomor | Tanggal TTD | Template | Status |
|----|---------|----------|-------|------------|----------|--------|
| 1 | Budi Santoso | Pelatihan CPNS | CERT-2025-001 | 2025-02-28 | template_1 | terbit |
| 2 | Siti Nurhayati | Pelatihan CPNS | CERT-2025-002 | 2025-02-28 | template_1 | draft |

**Status Options**
- `draft`: Belum diterbitkan
- `terbit`: Sudah diterbitkan
- `dicabut`: Dibatalkan/dicabut

**Template Options**
- `template_1`: Template Peserta
- `template_2`: Template Narasumber
- `template_3`: Template Fasilitator

---

## 6️⃣ Tabel: AKUN_PESERTA
**Status**: ✅ Diimplementasikan dengan 4 data sample

### Struktur
```json
{
  "id_akun_peserta": 1,
  "id_peserta": 1,
  "username": "budi.santoso",
  "password": "$2b$10$hashedpassword1",
  "last_login": "2026-01-21T08:00:00Z",
  "status": "aktif",
  "created_at": "2025-02-01T00:00:00Z",
  "updated_at": "2025-02-01T00:00:00Z"
}
```

### Data Sample
| ID | Peserta | Username | Status | Last Login |
|----|---------|----------|--------|------------|
| 1 | Budi Santoso | budi.santoso | aktif | 2026-01-21 08:00:00 |
| 2 | Siti Nurhayati | siti.nurhayati | aktif | 2026-01-20 15:30:00 |
| 3 | Ahmad Ridho | ahmad.ridho | aktif | 2026-01-21 10:15:00 |
| 4 | Rina Wijaya | rina.wijaya | aktif | 2026-01-19 12:00:00 |

**Password Default**: `password123` (hashed)

---

## 7️⃣ Tabel: SURAT_TUGAS
**Status**: ✅ Diimplementasikan dengan 2 data sample

### Struktur
```json
{
  "id_surat_tugas": 1,
  "id_kegiatan": 1,
  "nomor_surat": "ST-001/2025",
  "tanggal_surat": "2025-02-01",
  "id_penandatangan": 1,
  "status": "diterbitkan",
  "file_surat": "https://example.com/surat-tugas/ST-001-2025.pdf",
  "created_at": "2025-02-01T00:00:00Z",
  "updated_at": "2025-02-01T10:00:00Z"
}
```

### Data Sample
| ID | Kegiatan | Nomor | Tanggal | Penandatangan | Status |
|----|----------|-------|---------|--------------|--------|
| 1 | Pelatihan CPNS | ST-001/2025 | 2025-02-01 | Dr. Bambang | diterbitkan |
| 2 | Bimtek Arsip | ST-002/2025 | 2025-03-10 | Dr. Bambang | draft |

**Status Options**
- `draft`: Belum diterbitkan
- `diterbitkan`: Sudah diterbitkan
- `dibatalkan`: Dibatalkan

---

## 8️⃣ Tabel: SURAT_TUGAS_PEGAWAI
**Status**: ✅ Diimplementasikan dengan 3 data sample

### Struktur
```json
{
  "id": 1,
  "id_surat_tugas": 1,
  "id_pegawai": 1,
  "peran": "penanggung_jawab"
}
```

### Data Sample
| ID | Surat Tugas | Pegawai | Peran |
|----|------------|---------|-------|
| 1 | ST-001/2025 | Dr. Bambang Sutrisno | penanggung_jawab |
| 2 | ST-001/2025 | Siti Nurhaliza | ketua_panitia |
| 3 | ST-001/2025 | Ahmad Hidayat | panitia |

**Peran Options**
- `penanggung_jawab`: Penanggung jawab kegiatan
- `ketua_panitia`: Ketua panitia
- `panitia`: Anggota panitia
- `peserta`: Peserta dari panitia
- `narasumber`: Narasumber

---

## 9️⃣ Tabel: LOG_AKTIVITAS
**Status**: ℹ️ Struktur tersedia (belum ada sample data)

### Struktur
```json
{
  "id": 1,
  "id_user": 1,
  "aktivitas": "Membuat kegiatan baru",
  "tabel": "kegiatan",
  "id_referensi": 1,
  "created_at": "2025-02-01T00:00:00Z"
}
```

---

## 🔗 Relasi Database

### Diagram Relasi
```
PEGAWAI (1) ──┐
              ├─→ USERS
              │
USERS ────────┼─→ SERTIFIKAT (penandatangan)
              │
KEGIATAN ─────┼─→ PESERTA (1:M)
              │    └─→ SERTIFIKAT (1:M)
              │    └─→ AKUN_PESERTA (1:M)
              │
SURAT_TUGAS ──┼─→ KEGIATAN
              │    └─→ PEGAWAI (penandatangan)
              │
SURAT_TUGAS ──────→ SURAT_TUGAS_PEGAWAI (1:M)
                      └─→ PEGAWAI
```

### Foreign Keys
1. `users.id_pegawai` → `pegawai.id_pegawai`
2. `kegiatan.created_by` → `users.id_user`
3. `peserta.id_kegiatan` → `kegiatan.id_kegiatan`
4. `sertifikat.id_kegiatan` → `kegiatan.id_kegiatan`
5. `sertifikat.id_peserta` → `peserta.id_peserta`
6. `sertifikat.id_penandatangan` → `pegawai.id_pegawai`
7. `akun_peserta.id_peserta` → `peserta.id_peserta`
8. `surat_tugas.id_kegiatan` → `kegiatan.id_kegiatan`
9. `surat_tugas.id_penandatangan` → `pegawai.id_pegawai`
10. `surat_tugas_pegawai.id_surat_tugas` → `surat_tugas.id_surat_tugas`
11. `surat_tugas_pegawai.id_pegawai` → `pegawai.id_pegawai`
12. `log_aktivitas.id_user` → `users.id_user`

---

## 📋 Ringkasan Data

| Tabel | Jumlah Sample | Field | Status |
|-------|--------------|-------|--------|
| pegawai | 3 | 23 | ✅ Lengkap |
| users | 3 | 8 | ✅ Lengkap |
| kegiatan | 3 | 18 | ✅ Lengkap |
| peserta | 4 | 28 | ✅ Lengkap |
| sertifikat | 2 | 9 | ✅ Lengkap |
| akun_peserta | 4 | 7 | ✅ Lengkap |
| surat_tugas | 2 | 8 | ✅ Lengkap |
| surat_tugas_pegawai | 3 | 4 | ✅ Lengkap |
| log_aktivitas | 0 | 5 | ℹ️ Struktur saja |

---

## 📂 File Location
```
src/data/database.json
```

## 🔧 Cara Menggunakan

### Import di Vue Component
```javascript
import database from '@/data/database.json'

// Akses data
const peserta = database.peserta
const kegiatan = database.kegiatan
const pegawai = database.pegawai
const sertifikat = database.sertifikat
```

### Contoh Query
```javascript
// Dapatkan peserta dari kegiatan tertentu
const pesertaKegiatan1 = database.peserta.filter(p => p.id_kegiatan === 1)

// Dapatkan sertifikat peserta tertentu
const sertifikatBudi = database.sertifikat.find(s => s.id_peserta === 1)

// Dapatkan info penandatangan sertifikat
const penandatangan = database.pegawai.find(p => p.id_pegawai === sertifikatBudi.id_penandatangan)
```

---

## ⚠️ Migrasi ke Backend

Saat siap untuk production, lakukan migrasi:

1. **Setup Database**
   ```sql
   -- Jalankan SQL schema dari dokumentasi awal
   -- Sesuaikan dengan database yang digunakan (MySQL, PostgreSQL, dll)
   ```

2. **Setup API**
   ```
   - Create REST API endpoints untuk setiap tabel
   - CRUD operations: GET, POST, PUT, DELETE
   - Add authentication & authorization
   ```

3. **Update Vue Component**
   ```javascript
   // Ganti import JSON dengan API calls
   const response = await fetch('/api/peserta')
   const peserta = await response.json()
   ```

---

**Status**: ✅ SELESAI  
**Last Updated**: 2026-01-21  
**Database Format**: JSON (production ready untuk migrasi ke SQL)
