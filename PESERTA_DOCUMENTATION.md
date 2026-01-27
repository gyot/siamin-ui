# Dokumentasi Data dan Halaman Peserta - SIAMIN

## Struktur Database

Database SIAMIN memiliki 9 tabel utama yang telah didokumentasikan dalam file `src/data/database.json`:

### 1. **Tabel Pegawai**
Data master untuk semua pegawai pemerintah yang ada dalam sistem.
- **Field Utama**: id_pegawai, nip, nama, pangkat, golongan, jabatan
- **Dummy Data**: 3 pegawai dengan detail lengkap

### 2. **Tabel Users**
Akun login untuk admin, operator, verifikator, dan kepala unit.
- **Field Utama**: id_user, id_pegawai, email, password, role, status
- **Role**: admin, operator, verifikator, kepala
- **Dummy Data**: 3 user dengan role berbeda

### 3. **Tabel Kegiatan**
Data kegiatan/acara yang diselenggarakan.
- **Field Utama**: id_kegiatan, nama_kegiatan, tanggal_mulai, tanggal_selesai, lokasi, total_peserta, metode_pelaksanaan, status
- **Status**: draft, berjalan, selesai, dibatalkan
- **Metode**: daring, luring, hybrid
- **Dummy Data**: 3 kegiatan dengan status berbeda

### 4. **Tabel Peserta**
Data peserta yang mengikuti kegiatan.
- **Field Utama**: id_peserta, id_kegiatan, nama_lengkap, nip, email, no_hp, nama_instansi
- **Subdivisi Data**:
  - Data Pribadi: nama, nip, pangkat, golongan, jabatan, biodata
  - Data Instansi: nama, alamat, kab/kota, provinsi, telepon
  - Data Pembayaran: provider_pulsa, nomor_rekening, nama_bank
  - Data Administrasi: no_surat_tugas, tanggal, peran
- **Dummy Data**: 4 peserta dari 2 kegiatan

### 5. **Tabel Sertifikat**
Data sertifikat yang diterbitkan untuk peserta.
- **Field Utama**: id_sertifikat, id_kegiatan, id_peserta, nomor_sertifikat, tanggal_ttd, template
- **Status**: draft, terbit, dicabut
- **Dummy Data**: 2 sertifikat (1 terbit, 1 draft)

### 6. **Tabel Akun Peserta**
Akun login khusus untuk peserta.
- **Field Utama**: id_akun_peserta, id_peserta, username, password, status
- **Dummy Data**: 4 akun peserta dengan username dan password

### 7. **Tabel Surat Tugas**
Data surat tugas untuk kegiatan.
- **Field Utama**: id_surat_tugas, id_kegiatan, nomor_surat, tanggal_surat, id_penandatangan
- **Status**: draft, diterbitkan, dibatalkan
- **Dummy Data**: 2 surat tugas

### 8. **Tabel Surat Tugas Pegawai**
Relasi pegawai dengan surat tugas (many-to-many).
- **Field Utama**: id_surat_tugas, id_pegawai, peran
- **Peran**: penanggung_jawab, ketua_panitia, panitia, peserta, narasumber
- **Dummy Data**: 3 relasi

### 9. **Tabel Log Aktivitas**
Pencatatan semua aktivitas dalam sistem.
- **Field Utama**: id, id_user, aktivitas, tabel, id_referensi, created_at

---

## Halaman Peserta Management

### Lokasi File
- **Komponen**: `src/pages/PesertaManagement.vue`
- **Route**: `/admin/peserta`
- **Data Source**: `src/data/database.json`

### Fitur Utama

#### 1. **Dashboard Statistik**
Menampilkan informasi ringkas:
- Total Peserta
- Peserta Aktif
- Peserta Sudah Bersertifikat
- Peserta Belum Bersertifikat

#### 2. **Filter dan Pencarian**
- **Cari Nama**: Filter peserta berdasarkan nama
- **Filter Kegiatan**: Tampilkan peserta dari kegiatan tertentu
- **Filter Status**: Filter berdasarkan status peserta (aktif/nonaktif)

#### 3. **Tabel Peserta**
Menampilkan daftar lengkap peserta dengan kolom:
| No | Nama | NIP | Email | Instansi | Kegiatan | Peran | Sertifikat | Aksi |
|----|------|-----|-------|----------|----------|-------|-----------|------|

#### 4. **Manajemen Peserta**

**Tombol Aksi di Tabel:**
- **Detail**: Membuka modal detail peserta (read-only)
- **Sertifikat**: Membuka form untuk membuat/edit sertifikat
- **Hapus**: Menghapus peserta dari sistem

**Modal Tambah Peserta:**
Formulir lengkap dengan 4 bagian:
1. **Data Pribadi** (9 field)
   - Nama lengkap*, email*, no_hp
   - NIP, pangkat, golongan, jabatan
   - Jenis kelamin, tempat lahir, tanggal lahir, NPWP/NIK

2. **Data Instansi** (6 field)
   - Nama instansi*, kegiatan*
   - Alamat instansi, kabupaten/kota, provinsi
   - Telepon instansi, email instansi

3. **Data Pembayaran** (3 field)
   - Provider pulsa (dropdown: Telkomsel, Indosat, XL, Tri, Smartfren)
   - Nomor rekening
   - Nama bank

4. **Data Administrasi** (3 field)
   - No. surat tugas
   - Tanggal surat tugas
   - Peran (Peserta, Narasumber, Fasilitator, Panitia)

**Validasi Form:**
- Nama lengkap wajib diisi
- Email wajib diisi (format email)
- Nama instansi wajib diisi
- Kegiatan wajib dipilih

**Edit Peserta:**
- Klik tombol "Detail" → "Edit Peserta"
- Semua field dapat diubah
- Timestamp updated_at otomatis diperbarui

#### 5. **Modal Detail Peserta**
Menampilkan informasi peserta (read-only):
- Nama Lengkap, NIP, Email, No. HP
- Nama Instansi, Alamat, Kabupaten/Kota, Provinsi
- Peran, Pangkat, Golongan, Jabatan
- Tombol: Tutup, Edit Peserta

#### 6. **Modal Sertifikat**

**Informasi Sertifikat yang Sudah Ada (jika ada):**
- Nomor Sertifikat
- Tanggal Tandatangan
- Status (Draft/Diterbitkan/Dicabut)
- Template yang digunakan

**Form Input (6 field):**
1. **Nomor Sertifikat*** - Format: CERT-2025-001
2. **Tanggal Tandatangan*** - Date picker
3. **Penandatangan*** - Dropdown dari data pegawai
4. **Template*** - Dropdown:
   - template_1: Template Peserta
   - template_2: Template Narasumber
   - template_3: Template Fasilitator
5. **Peran** - Auto-filled dari data peserta (readonly)
6. **Status** - Dropdown: Draft/Diterbitkan/Dicabut

**Validasi Form:**
- Nomor sertifikat wajib diisi
- Tanggal tandatangan wajib diisi
- Penandatangan wajib dipilih
- Template wajib dipilih

**Tombol Kondisional:**
- Jika belum ada sertifikat: "Buat Sertifikat"
- Jika sudah ada sertifikat: "Ubah Sertifikat"

---

## State Management

### Ref States
```javascript
- peserta: Array dari semua peserta
- kegiatan: Array dari semua kegiatan
- pegawai: Array dari semua pegawai (untuk penandatangan)
- sertifikat: Array dari semua sertifikat

- showAddModal: Boolean (show/hide form tambah peserta)
- showDetailModal: Boolean (show/hide detail modal)
- showSertifikatModal: Boolean (show/hide sertifikat modal)
- editingPeserta: Boolean (mode edit atau tambah)
- selectedPeserta: Object (peserta yang dipilih saat ini)
- formErrors: Array (error messages dari validasi)

- searchNama: String (keyword pencarian)
- filterKegiatan: String/Number (filter by kegiatan id)
- filterStatus: String (filter by status: aktif/nonaktif)

- formPeserta: Object (data form tambah/edit peserta)
- formSertifikat: Object (data form sertifikat)
```

### Computed Properties
```javascript
- filteredPeserta: Hasil filter peserta berdasarkan search & filter
- pesertaAktif: Peserta dengan status aktif
- pesertaBersertifikat: Jumlah peserta yang sudah bersertifikat
- sertifikatPeserta: Sertifikat dari peserta yang dipilih (jika ada)
```

---

## Helper Functions

### Utility Functions
- **getNamaKegiatan(id)**: Ambil nama kegiatan dari ID
- **getSertifikatStatus(idPeserta)**: Dapatkan status sertifikat peserta
- **getSertifikatBadgeClass(idPeserta)**: Dapatkan CSS class untuk badge status sertifikat
- **formatDate(date)**: Format tanggal ke locale Indonesia
- **validateFormPeserta()**: Validasi form peserta
- **validateFormSertifikat()**: Validasi form sertifikat

### CRUD Functions
- **savePeserta()**: Simpan peserta baru atau update existing
- **deletePeserta(id)**: Hapus peserta dengan konfirmasi
- **saveSertifikat()**: Simpan atau update sertifikat
- **openDetailModal(p)**: Buka modal detail peserta
- **openEditModal()**: Transisi dari detail ke edit mode
- **openSertifikatModal(p)**: Buka modal sertifikat

---

## Integrasi dengan Halaman Lain

### Link ke Halaman Kegiatan
Dari halaman Kegiatan.vue, peserta yang terdaftar di kegiatan dapat dikelola:
- Klik tombol "Peserta" di detail kegiatan
- Lihat halaman peserta standalone dengan filter kegiatan

### Link ke Halaman Sertifikat
- Kelola sertifikat peserta langsung dari halaman peserta
- Atau dari halaman kegiatan → detail peserta → form sertifikat

---

## Catatan Penggunaan

### Data Dummy
Database JSON ini berisi:
- **3 pegawai** dengan detail lengkap (untuk penandatangan sertifikat)
- **3 kegiatan** dengan status berbeda (draft, berjalan, selesai)
- **4 peserta** dari 2 kegiatan berbeda
- **2 sertifikat** dengan status berbeda (terbit, draft)
- **4 akun peserta** untuk login

### Next Steps (Future Development)
1. **API Integration**: Ganti local JSON dengan API endpoint
2. **Authentication**: Implement JWT tokens
3. **File Upload**: Upload real files ke server (flyer, sertifikat PDF)
4. **PDF Generation**: Generate sertifikat dalam format PDF
5. **Email Notification**: Kirim notifikasi ke peserta
6. **Report Generation**: Generate laporan peserta dan sertifikat
7. **Bulk Operations**: Import/export peserta dalam CSV/Excel

---

## Kredensial Testing

### Admin Login
- Email: `admin@kemkominfo.go.id`
- Password: `password123`

### Peserta Login
- Username: `budi.santoso` (atau peserta lainnya)
- Password: `password123`

---

**Versi**: 1.0  
**Last Updated**: 2026-01-21  
**Status**: Ready for Production
