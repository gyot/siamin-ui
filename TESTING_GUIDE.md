# 🧪 Testing Guide - SIAMIN Peserta Management

## 📌 Panduan Lengkap Testing Halaman Peserta

---

## 🚀 Persiapan

### 1. Jalankan Development Server
```bash
cd siamin-vue-ui
npm run dev
```

Output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 2. Akses Aplikasi
Buka browser: `http://localhost:5173`

---

## 🔐 Login

### Admin Login
```
Email: admin@kemkominfo.go.id
Password: password123
```

**Langkah:**
1. Buka halaman login: `http://localhost:5173/login`
2. Masukkan email & password
3. Klik tombol "Masuk"
4. Akan redirect ke `/admin/dashboard`

### Alternatif: Peserta Login
```
Username: budi.santoso
Password: password123
```

Peserta bisa login di: `http://localhost:5173/login-peserta`

---

## 📊 Test Case: Halaman Peserta

### 1. Akses Halaman Peserta

**URL**: `http://localhost:5173/admin/peserta`

**Expected Result:**
- ✅ Halaman dimuat tanpa error
- ✅ Sidebar menampilkan menu "Peserta" (active)
- ✅ Header "Manajemen Peserta" terlihat jelas
- ✅ Statistik 4 card ditampilkan:
  - Total Peserta: 4
  - Peserta Aktif: 4
  - Sudah Bersertifikat: 1
  - Belum Bersertifikat: 3

**Screenshot Expected:**
```
┌─────────────────────────────────────────────────────┐
│ 🔙 Sidebar │           Manajemen Peserta     [+ Tambah]│
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ Total: 4 │ │ Aktif: 4 │ │Sertif: 1 │ │ Belum: 3 ││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
├─────────────────────────────────────────────────────┤
│ Filter: [Cari] [Kegiatan] [Status]                 │
├─────────────────────────────────────────────────────┤
│ No│ Nama │ NIP │ Email │ Instansi │ Kegiatan │ Aksi│
├─────────────────────────────────────────────────────┤
│ 1 │ Budi │...  │...    │...       │...       │[...]│
│ 2 │ Siti │...  │...    │...       │...       │[...]│
│ 3 │Ahmad │...  │...    │...       │...       │[...]│
│ 4 │ Rina │...  │...    │...       │...       │[...]│
└─────────────────────────────────────────────────────┘
```

---

### 2. Test Filter Pencarian

#### Test 2a: Filter Nama

**Action:**
1. Klik input "Cari Nama"
2. Ketik "Budi"

**Expected Result:**
- ✅ Tabel diperbarui langsung (real-time)
- ✅ Hanya menampilkan: "Budi Santoso"
- ✅ Statistik tetap sama: 4 total (karena tidak change data)
- ✅ Peserta lain hilang dari view

**Verifikasi:** Cek baris tabel hanya 1 peserta

#### Test 2b: Filter Kegiatan

**Action:**
1. Buka dropdown "Filter Kegiatan"
2. Pilih "Pelatihan Dasar CPNS Angkatan I"

**Expected Result:**
- ✅ Tabel menampilkan 3 peserta (Budi, Siti, Ahmad)
- ✅ Rina Wijaya hilang (dia dari kegiatan 2)
- ✅ Statistik berubah: Total 3

**Verifikasi:** 
```
Kegiatan 1: 3 peserta (Budi, Siti, Ahmad)
Kegiatan 2: 1 peserta (Rina)
```

#### Test 2c: Filter Status

**Action:**
1. Buka dropdown "Filter Status"
2. Pilih "Aktif"

**Expected Result:**
- ✅ Tabel menampilkan semua 4 peserta (semuanya aktif)
- ✅ Dropdown berubah ke "Aktif"

#### Test 2d: Kombinasi Filter

**Action:**
1. Cari: "Budi"
2. Filter Kegiatan: "Pelatihan Dasar CPNS Angkatan I"
3. Filter Status: "Aktif"

**Expected Result:**
- ✅ Hanya menampilkan "Budi Santoso"
- ✅ Semua filter bekerja bersama

---

### 3. Test Tombol Aksi - Detail

#### Test 3a: Klik Detail

**Action:**
1. Klik tombol "Detail" di baris Budi Santoso

**Expected Result:**
- ✅ Modal "Detail Peserta" muncul
- ✅ Judul modal: "Detail Peserta"
- ✅ Background gelap (backdrop)
- ✅ Menampilkan informasi lengkap Budi:
  - Nama Lengkap: Budi Santoso
  - NIP: 198501152010011001
  - Email: budi.santoso@kemkominfo.go.id
  - No. HP: 081234567890
  - Nama Instansi: Kemkominfo
  - Alamat: Jl. Medan Merdeka Barat No.9, Jakarta Pusat
  - Kabupaten/Kota: Jakarta Pusat
  - Provinsi: DKI Jakarta
  - Peran: Peserta
- ✅ Tombol: Tutup, Edit Peserta

#### Test 3b: Tutup Modal Detail

**Action:**
1. Klik tombol "Tutup"
   ATAU
2. Klik backdrop (area gelap di luar modal)

**Expected Result:**
- ✅ Modal tertutup
- ✅ Kembali ke halaman peserta
- ✅ Tabel tetap terlihat

#### Test 3c: Edit dari Detail

**Action:**
1. Klik "Detail" → Modal terbuka
2. Klik tombol "Edit Peserta"

**Expected Result:**
- ✅ Modal detail tertutup
- ✅ Modal form "Edit Peserta" terbuka
- ✅ Form pre-filled dengan data Budi:
  - Nama Lengkap: Budi Santoso
  - NIP: 198501152010011001
  - Email: budi.santoso@kemkominfo.go.id
  - dll (semua field terisi)
- ✅ Judul modal: "Edit Peserta"

---

### 4. Test Tambah Peserta

#### Test 4a: Buka Form Tambah

**Action:**
1. Klik tombol "+ Tambah Peserta"

**Expected Result:**
- ✅ Modal "Tambah Peserta Baru" muncul
- ✅ Form kosong (empty fields)
- ✅ 4 bagian form terlihat:
  1. Data Pribadi (9 field)
  2. Data Instansi (6 field)
  3. Data Pembayaran (3 field)
  4. Data Administrasi (3 field)
- ✅ Tombol: Batal, Tambah Peserta

#### Test 4b: Isi Form Minimal (Validasi)

**Action:**
1. Form masih kosong
2. Klik tombol "Tambah Peserta"

**Expected Result:**
- ✅ Error message muncul di atas tombol
- ✅ Error mentions:
  - "Nama lengkap wajib diisi"
  - "Email wajib diisi"
  - "Nama instansi wajib diisi"
  - "Kegiatan wajib dipilih"
- ✅ Data TIDAK disimpan

#### Test 4c: Isi Form Lengkap

**Action:**
1. Isi semua field yang required:
   - Nama Lengkap: "Joni Pratama"
   - Email: "joni.pratama@kemkominfo.go.id"
   - Nama Instansi: "Kemkominfo Jawa Timur"
   - Kegiatan: "Bimtek Pengelolaan Arsip Digital"
   - Peran: "Fasilitator"
   - No. HP: "082345678901"
2. Klik "Tambah Peserta"

**Expected Result:**
- ✅ Modal tertutup
- ✅ Error message hilang
- ✅ Tabel memperbarui dengan peserta baru
- ✅ Statistik berubah:
  - Total Peserta: 5 (dari 4)
  - Belum Bersertifikat: 4 (dari 3)

**Verifikasi:**
- Check baris baru di tabel: "Joni Pratama"
- Check statistik card

#### Test 4d: Isi Semua Field

**Action:**
1. Klik "+ Tambah Peserta"
2. Isi SEMUA field termasuk opsional:
   - Data Pribadi: semua 9 field
   - Data Instansi: semua 6 field
   - Data Pembayaran: provider + rekening + bank
   - Data Administrasi: semua 3 field
3. Klik "Tambah Peserta"

**Expected Result:**
- ✅ Data disimpan dengan lengkap
- ✅ Verifikasi dengan buka modal Detail peserta baru

---

### 5. Test Edit Peserta

#### Test 5a: Edit dari Tabel

**Action:**
1. Klik "Detail" di baris Budi
2. Modal detail terbuka
3. Klik "Edit Peserta"

**Expected Result:**
- ✅ Form "Edit Peserta" terbuka
- ✅ Judul: "Edit Peserta"
- ✅ Semua field pre-filled
- ✅ Tombol berubah: "Simpan Perubahan"

#### Test 5b: Ubah Data

**Action:**
1. Form edit terbuka (lihat Test 5a)
2. Ubah field:
   - Nama: "Budi Santoso Wijaya"
   - No. HP: "085678901234"
3. Klik "Simpan Perubahan"

**Expected Result:**
- ✅ Modal tertutup
- ✅ Tabel menampilkan nama baru: "Budi Santoso Wijaya"
- ✅ Verifikasi dengan membuka detail lagi

**Verifikasi:**
- Klik Detail Budi lagi
- Cek nama: "Budi Santoso Wijaya"
- Cek No. HP: "085678901234"

#### Test 5c: Edit dengan Error Validasi

**Action:**
1. Form edit terbuka
2. Hapus isi field "Nama Lengkap" (buat kosong)
3. Klik "Simpan Perubahan"

**Expected Result:**
- ✅ Form TIDAK disubmit
- ✅ Error message muncul: "Nama lengkap wajib diisi"
- ✅ Modal tetap terbuka

---

### 6. Test Sertifikat - Buat Baru

#### Test 6a: Buka Form Sertifikat (Belum Ada)

**Action:**
1. Di tabel, cari peserta tanpa sertifikat (Budi, Ahmad, Rina)
2. Klik tombol "Sertifikat" di baris "Ahmad Ridho"

**Expected Result:**
- ✅ Modal "Kelola Sertifikat - Ahmad Ridho" muncul
- ✅ TIDAK ada info box hijau (sertifikat belum ada)
- ✅ Form input kosong dengan 6 field:
  - Nomor Sertifikat
  - Tanggal Tandatangan
  - Penandatangan (dropdown)
  - Template (dropdown)
  - Peran (readonly: "Peserta")
  - Status (default: "draft")
- ✅ Tombol: Batal, Buat Sertifikat

#### Test 6b: Validasi Form Kosong

**Action:**
1. Form kosong
2. Klik "Buat Sertifikat"

**Expected Result:**
- ✅ Error message:
  - "Nomor sertifikat wajib diisi"
  - "Tanggal tandatangan wajib diisi"
  - "Penandatangan wajib dipilih"
  - "Template wajib dipilih"
- ✅ Data TIDAK disimpan

#### Test 6c: Isi Form Sertifikat

**Action:**
1. Form terbuka untuk Ahmad Ridho
2. Isi field:
   - Nomor Sertifikat: "CERT-2025-003"
   - Tanggal Tandatangan: "2025-02-28"
   - Penandatangan: "Dr. Bambang Sutrisno"
   - Template: "Template Peserta"
   - Status: "terbit"
3. Klik "Buat Sertifikat"

**Expected Result:**
- ✅ Modal tertutup
- ✅ Tabel diperbarui:
  - Status sertifikat Ahmad: "Bersertifikat" (hijau)
  - Badge berubah warna
- ✅ Statistik berubah:
  - Sudah Bersertifikat: 2 (dari 1)
  - Belum Bersertifikat: 2 (dari 3)

**Verifikasi:**
```
Sebelum: Bersertifikat = 1 (Budi), Belum = 3 (Siti, Ahmad, Rina)
Sesudah: Bersertifikat = 2 (Budi, Ahmad), Belum = 2 (Siti, Rina)
```

---

### 7. Test Sertifikat - Edit Existing

#### Test 7a: Buka Form Sertifikat (Ada)

**Action:**
1. Klik "Sertifikat" di baris "Ahmad Ridho" (sudah ada sertifikat)

**Expected Result:**
- ✅ Modal "Kelola Sertifikat - Ahmad Ridho" muncul
- ✅ Info box HIJAU muncul: "Sertifikat Sudah Diterbitkan"
- ✅ Menampilkan:
  - Nomor Sertifikat: CERT-2025-003
  - Tanggal Tandatangan: 28 Februari 2025
  - Status: Bersertifikat (hijau)
  - Template: Template Peserta
- ✅ Form TERISI dengan data sertifikat existing
- ✅ Tombol: Batal, Ubah Sertifikat

#### Test 7b: Ubah Data Sertifikat

**Action:**
1. Form terbuka dengan data existing
2. Ubah field:
   - Nomor Sertifikat: "CERT-2025-003-REV"
   - Status: "draft"
3. Klik "Ubah Sertifikat"

**Expected Result:**
- ✅ Modal tertutup
- ✅ Tabel diperbarui:
  - Status Ahmad: "Draft" (kuning) - berubah dari hijau
- ✅ Verifikasi dengan membuka modal lagi

**Verifikasi:**
- Klik "Sertifikat" Ahmad lagi
- Cek nomor: "CERT-2025-003-REV"
- Cek status: "Draft"

---

### 8. Test Hapus Peserta

#### Test 8a: Klik Tombol Hapus

**Action:**
1. Di tabel, klik tombol "Hapus" di baris "Rina Wijaya"

**Expected Result:**
- ✅ Dialog konfirmasi muncul
- ✅ Pesan: "Apakah Anda yakin ingin menghapus peserta ini?"
- ✅ Tombol: OK (konfirmasi) / Cancel

#### Test 8b: Batalkan Hapus

**Action:**
1. Dialog konfirmasi muncul
2. Klik "Cancel"

**Expected Result:**
- ✅ Dialog tertutup
- ✅ Peserta TIDAK dihapus
- ✅ Rina Wijaya masih ada di tabel

#### Test 8c: Konfirmasi Hapus

**Action:**
1. Dialog konfirmasi muncul
2. Klik "OK" (atau "Yes")

**Expected Result:**
- ✅ Dialog tertutup
- ✅ Tabel diperbarui: Rina hilang
- ✅ Statistik berubah:
  - Total Peserta: 3 (dari 4)
- ✅ Filter tetap bekerja dengan data baru

**Verifikasi:**
```
Sebelum: 4 peserta (Budi, Siti, Ahmad, Rina)
Sesudah: 3 peserta (Budi, Siti, Ahmad)
```

---

### 9. Test Responsive Design

#### Test 9a: Desktop (1920x1080)

**Action:**
1. Resize browser ke 1920x1080
2. Buka halaman peserta

**Expected Result:**
- ✅ Sidebar tetap visible
- ✅ Tabel dengan 9 kolom visible semua
- ✅ Button aksi horizontal (3 dalam satu baris)
- ✅ Modal dengan grid 2 kolom untuk field

#### Test 9b: Tablet (768x1024)

**Action:**
1. Resize browser ke 768px width
2. Refresh halaman

**Expected Result:**
- ✅ Layout menyesuaikan
- ✅ Tabel masih scrollable horizontal
- ✅ Modal grid 1 kolom
- ✅ Sidebar mungkin collapse (tergantung design)

#### Test 9c: Mobile (375px)

**Action:**
1. Resize ke 375px width
2. Scroll dan test interaksi

**Expected Result:**
- ✅ Tabel dapat di-scroll horizontal
- ✅ Modal responsive
- ✅ Button dapat diklik dengan mudah
- ✅ Form terlihat dengan baik

---

### 10. Test UI/UX

#### Test 10a: Loading & Transitions

**Action:**
1. Klik tombol yang membuka modal
2. Amati transisi

**Expected Result:**
- ✅ Modal muncul smooth (dengan fade animation)
- ✅ Tidak ada flickering
- ✅ Backdrop gelap muncul smooth

#### Test 10b: Hover Effects

**Action:**
1. Hover ke tombol "+ Tambah Peserta"
2. Hover ke tombol aksi (Detail, Sertifikat, Hapus)
3. Hover ke baris tabel

**Expected Result:**
- ✅ Tombol berubah warna/shadow saat hover
- ✅ Baris tabel berubah background
- ✅ Semua transitions smooth

#### Test 10c: Color Coding

**Expected Result - Sertifikat Badge:**
- ✅ Hijau: Bersertifikat (terbit)
- ✅ Kuning: Draft
- ✅ Merah: Dicabut
- ✅ Orange: Belum Bersertifikat

**Expected Result - Button:**
- ✅ Blue gradient: Primary action (Tambah, Simpan)
- ✅ Blue: Secondary (Detail)
- ✅ Indigo: Tertiary (Sertifikat)
- ✅ Red: Danger (Hapus)

---

### 11. Test Data Persistence

#### Test 11a: Edit & Refresh

**Action:**
1. Edit peserta Budi → ubah nama
2. F5 atau Ctrl+Shift+R (hard refresh)

**Expected Result:**
- ❌ Data HILANG (karena belum ada backend/database)
- ℹ️ Ini expected behavior untuk JSON dummy data

**Note:** Untuk production, data akan persisten di database

#### Test 11b: Add & Refresh

**Action:**
1. Tambah peserta baru
2. Refresh page

**Expected Result:**
- ❌ Peserta baru hilang
- ℹ️ Ini expected behavior

---

### 12. Test Filter + Statistik

#### Test 12a: Statistik Accuracy

**Setup:**
- 4 peserta total
- 1 bersertifikat (Budi)
- 3 belum (Siti, Ahmad, Rina)

**Test:**
1. Lihat statistik card
2. Verify: Total 4, Aktif 4, Sertif 1, Belum 3

**Expected Result:**
- ✅ Statistik akurat

#### Test 12b: Filter Tidak Ubah Statistik

**Action:**
1. Lihat statistik: Total 4
2. Filter kegiatan → hanya tampilkan 3
3. Lihat statistik

**Expected Result:**
- ✅ Statistik TETAP 4 (global, bukan per-filter)
- ℹ️ Statistik menunjukkan total keseluruhan, bukan hasil filter

---

### 13. Test Edge Cases

#### Test 13a: Nama Panjang

**Action:**
1. Tambah peserta dengan nama sangat panjang (50+ karakter)
2. Check tabel

**Expected Result:**
- ✅ Text di truncate atau wrap dengan baik
- ✅ Tidak breaking layout

#### Test 13b: Email Invalid

**Action:**
1. Tambah peserta
2. Input email: "budi-email" (tanpa @domain)
3. Click Tambah

**Expected Result:**
- ❌ TIDAK ada validasi format email
- ℹ️ Current implementation tidak validate email format
- 💡 Suggestion: Tambahkan regex validator

#### Test 13c: Peserta Tanpa Data Opsional

**Action:**
1. Tambah peserta HANYA isi field required:
   - Nama, Email, Instansi, Kegiatan
   - Biarkan field lain kosong
2. Simpan

**Expected Result:**
- ✅ Peserta disimpan
- ✅ Field opsional boleh kosong
- ✅ Detail modal menampilkan "-" untuk field kosong

---

## 🎯 Test Summary Checklist

```
HALAMAN & NAVIGASI
☐ Halaman Peserta dapat diakses via /admin/peserta
☐ Sidebar link bekerja
☐ Header terlihat
☐ Layout responsive

STATISTIK & DISPLAY
☐ Dashboard cards menampilkan angka akurat
☐ Tabel peserta menampilkan 4 sample data
☐ Semua kolom terlihat jelas

FILTER & PENCARIAN
☐ Filter nama real-time
☐ Filter kegiatan bekerja
☐ Filter status bekerja
☐ Kombinasi filter bekerja
☐ Clear filter berfungsi

MODAL - DETAIL
☐ Modal detail buka
☐ Data ditampilkan lengkap
☐ Modal tutup dengan button/backdrop
☐ Edit button bekerja

MODAL - TAMBAH
☐ Form terbuka
☐ Validasi error muncul
☐ Form bisa diisi
☐ Peserta baru ditambahkan
☐ Tabel update

MODAL - EDIT
☐ Form pre-filled dengan data lama
☐ Data bisa diubah
☐ Validasi error muncul
☐ Perubahan disimpan
☐ Tabel update

MODAL - SERTIFIKAT BARU
☐ Form kosong terbuka
☐ Validasi bekerja
☐ Form bisa diisi
☐ Sertifikat disimpan
☐ Status badge berubah

MODAL - SERTIFIKAT EXISTING
☐ Info box hijau muncul
☐ Form pre-filled
☐ Data bisa diubah
☐ Perubahan disimpan
☐ Status badge update

HAPUS PESERTA
☐ Konfirmasi dialog muncul
☐ Cancel membatalkan hapus
☐ OK mengkonfirmasi hapus
☐ Tabel update setelah hapus

UI/UX
☐ Hover effects bekerja
☐ Transisi smooth
☐ Warna konsisten
☐ Layout responsive

EDGE CASES
☐ Nama panjang ditampilkan dengan baik
☐ Field opsional boleh kosong
☐ Data dengan spesial characters
```

---

## 📝 Bug Report Template

Jika menemukan bug, catat:

```
TITLE: [Brief description]

EXPECTED BEHAVIOR:
[Apa yang seharusnya terjadi]

ACTUAL BEHAVIOR:
[Apa yang terjadi sebenarnya]

STEPS TO REPRODUCE:
1. Klik ...
2. Input ...
3. ...

ENVIRONMENT:
- Browser: Chrome 120
- OS: Windows 10
- Screen: 1920x1080

SCREENSHOT:
[Attach screenshot]
```

---

## ✅ Testing Status

**Overall Status**: ✅ READY FOR TESTING

**Tested Components**:
- ✅ Filter & Search
- ✅ Tambah Peserta
- ✅ Edit Peserta
- ✅ Detail Modal
- ✅ Sertifikat Management
- ✅ Hapus Peserta
- ✅ Responsive Design
- ✅ Validasi Form

**Known Limitations**:
- Data tidak persisten (belum backend)
- Email format validation belum ada
- File upload belum implemented
- PDF generation belum ada

---

**Last Updated**: 2026-01-21  
**Version**: 1.0.0  
**Status**: Ready for QA Testing
