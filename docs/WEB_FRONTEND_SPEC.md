# SPESIFIKASI PERILAKU — FRONTEND WEB SIMAIK (HALAMAN ADMIN)

> Dokumen ini dihasilkan dari studi kode sumber frontend Vue 3 di `siamin-ui/src`
> (router, stores, services, layouts, components, utils, dan semua halaman admin).
> Dokumen ini menjelaskan **perilaku aktual kode**, termasuk bagian yang masih
> lokal/sandbox, bukan perilaku yang diinginkan.

Sumber utama: `src/router/index.js`, `src/stores/auth.js`, `src/services/*`,
`src/layouts/AdminLayout.vue`, `src/components/{Sidebar,Header}.vue`,
`src/pages/{Dashboard,Kegiatan,KegiatanDetail,KegiatanPeserta,TestLaporan,BuatLaporan,PaketSoal,PesertaManagement,Sertifikat,PegawaiManagement,UnitKerjaManagement,AnggotaManagement,Penugasan,Pengesahan,LaporanKegiatan,Profile}.vue`.

---

## 1. ARSITEKTUR UMUM

- **Framework**: Vue 3 (Composition API & Options API campur), Vue Router (history mode), Pinia (`stores/auth.js`), Axios (`services/api.js`), Tailwind CSS, SweetAlert2 (Swal), `xlsx` (export Excel), `jszip` (bundle DOCX), `qrcode` (QR link), util DOCX kustom (`utils/docxUtils.js`, `utils/generateLaporanDocx.js`), Capacitor push notifications (hanya aktif di platform native).
- **Backend**: Laravel di host yang sama; base URL API = `VITE_API_BASE_URL` + `/api/v1/` (dev memakai proxy relatif `/api/v1/`).
- **Penyimpanan sesi**: `localStorage` via `utils/secureStorage.js` — kunci `auth_token`, `user_data`, `user_type`, `unit_kerja_id`, `unit_kerja`.
- **Fallback data lokal**: `src/data/database.json` (+ `data/index.js`) dipakai sebagai fallback saat API gagal (khususnya mode dev), mis. kegiatan, pegawai, users, surat tugas, unit kerja.

### 1.1 API client (`services/api.js`)
- `fetchAPI(endpoint, {method, params, body, headers, raw})`, `postAPI`, `updateAPI`, `deleteAPI`.
- `ENDPOINTS` memetakan nama alias → path (mis. `suratTugas: 'penugasan'`, `keanggotaanTim: 'keanggotaan-tim'`, `logAktivitas: 'log-aktivitas'`).
- Header otomatis: `Authorization: Bearer <auth_token>` (kecuali `includeAuth:false`), `Content-Type: application/json` (dikecualikan untuk FormData).
- `fetchAPI` normalisasi response: array langsung atau `data.data`; `options.raw` mengembalikan bentuk asli (termasuk meta pagination).
- **Error**: timeout 30 detik; pesan error gabung `message` + detail validasi (`errors`), snippet body non-HTML 180 char.
- **Fallback dev**: jika GET pertama gagal di mode dev, flag `apiReadUnavailable` diset dan GET berikutnya langsung memakai data lokal (`getLocalFallbackData`) untuk endpoint: `unit-kerja`, `kegiatan`, `kegiatan/all`, `kegiatan/tim/:id`, `pegawai`, `users`, `penugasan*`, `surat-tugas*`.
- `updateAPI`: mencoba `PUT {endpoint}/{id}`; jika gagal (selain 401), ulang dengan `POST` + `_method: 'PUT'` (kompatibel Laravel + FormData).

### 1.2 Auth store (`stores/auth.js`)
- State: `token`, `currentUser`, `userType` ('admin' | 'peserta'), `unit_kerja_id` (array), `unit_kerja` (array objek), `isLoading`, `error`, `hasRestoredSession`, `hasRevalidatedSession`.
- `loginAdmin(email,password)` → POST `auth/login-admin`; wajib `success` + `data.token` + `data.user`; simpan token/user/user_type='admin'; init push notifications.
- `loginUnified(username,password)` → POST `auth/login` (dipakai juga untuk `loginPeserta`); `login_as === 'peserta'` → role 'peserta', selain itu 'admin'.
- `fetchMe()` → GET `me`; mengembalikan `{user, pegawai, unit_kerja}`; jika unit kerja kosong, fallback GET `unit-kerja/user/{idPegawai}`. Error auth (401/403/419) membersihkan sesi lokal.
- `logout()` → POST `logout` (best-effort) lalu bersihkan localStorage.
- `restoreAuth()` memulihkan sesi dari localStorage (dipanggil tiap navigasi router).
- **Computed peran**:
  - `isAuthenticated`: token + currentUser ada.
  - `isAdmin`: `userType`/`role` ∈ {admin, '1'}.
  - `isPeserta`: `userType`/`role` ∈ {peserta, '2'}.
  - `isKepala`: `nama_jabatan`/`jabatan` (user atau `pegawai`) mengandung kata **"kepala"** (case-insensitive). Ini satu-satunya "role level tinggi" — dipakai untuk menu & halaman Pengesahan.

### 1.3 Router & guard (`router/index.js`)
Rute admin (di bawah `/admin`, komponen `AdminLayout`, `meta: {requiresAuth:true, requiresAdmin:true}`):

| Path | Nama rute | Halaman | Meta khusus |
|---|---|---|---|
| `/admin/dashboard` | dashboard | Dashboard.vue | – |
| `/admin/kegiatan` | kegiatan | Kegiatan.vue | – |
| `/admin/kegiatan/:id/peserta` | kegiatan-peserta | KegiatanPeserta.vue | – |
| `/admin/kegiatan/:id/test-laporan` | test-laporan | TestLaporan.vue | – |
| `/admin/kegiatan/:id/buat-laporan` | buat-laporan | BuatLaporan.vue | – |
| `/admin/kegiatan/:id/detail` | kegiatan-detail | KegiatanDetail.vue | – |
| `/admin/paket-soal` | paket-soal | PaketSoal.vue | – |
| `/admin/peserta` | peserta | PesertaManagement.vue | – |
| `/admin/sertifikat` | sertifikat | Sertifikat.vue | – |
| `/admin/pegawai` | pegawai | PegawaiManagement.vue | – |
| `/admin/unit-kerja` | unit-kerja | UnitKerjaManagement.vue | – |
| `/admin/anggota` | anggota | AnggotaManagement.vue | – |
| `/admin/penugasan` | penugasan | Penugasan.vue | – |
| `/admin/pengesahan` | pengesahan | Pengesahan.vue | `requiresKepala: true` |
| `/admin/laporan-kegiatan` | laporan-kegiatan | LaporanKegiatan.vue | – |
| `/admin/profile` | profile | Profile.vue | – |

Guard `beforeEach`:
1. `restoreAuth()` (await) jika sesi belum dipulihkan.
2. Revalidasi `fetchMe()` di background untuk rute `requiresAuth`; **di-await** untuk rute `requiresKepala` (agar status kepala akurat sebelum guard peran).
3. Aturan navigasi:
   - `requiresAuth` & belum login → redirect `/laman-masuk` (atau `/login-peserta` bila `requiresPeserta`).
   - `requiresAdmin` & bukan admin → redirect `/login-peserta`.
   - `requiresPeserta` & bukan peserta (dan bukan admin) → redirect `/admin/dashboard` (admin boleh masuk portal peserta).
   - `requiresKepala` & bukan kepala → redirect `/admin/dashboard`.
4. Judul dokumen & meta description di-set dari `meta.title/description`; untuk URL publik ber-parameter (`/formulir/...`, `/kegiatan/...`, `/test/...`, dst.) judul di-refine dari nama kegiatan (fetch background `kegiatan` / `kegiatan/all`).

Rute non-admin yang relevan: `/` (Landing), `/laman-masuk` (Login admin), `/login` (LoginUnified), `/login-peserta`, `/register`, `/formulir/:kode/:peran/:idTpk?/:slugJudul`, `/daftar-peserta/:kode/:slugJudul?`, `/unduh-sertifikat/:kode/:slugJudul?`, `/kegiatan/:kode/:slugJudul?`, `/evaluasi/:kode/...`, `/laporan-evaluasi/:kode/...`, `/test/:kode/...`, `/lihat-tandatangan/:id`, `/data-sync`, dan `/peserta/*` (PesertaLayout: `peserta-dashboard`, `peserta-kegiatan`).

### 1.4 Layout admin (`AdminLayout.vue`, `Sidebar.vue`, `Header.vue`)
- Layout 3 kolom ala Facebook (desktop): sidebar kiri 280px (sticky), konten tengah maks 880px, header dengan judul halaman + menu user. Mobile: header hamburger + sidebar overlay.
- `AdminLayout` meneruskan `:user-role="currentUser.role"` dan `:can-access-pengesahan="isKepala"` ke Sidebar.
- **Sidebar** (urutan menu): Dashboard, Kegiatan, **Pengesahan** (hanya tampil bila `canAccessPengesahan` = isKepala), grup "Admin": Pegawai & User, Penugasan, Paket Soal, Laporan Kegiatan, grup "Portal Peserta" (**hanya bila `userRole === 'admin'`**): Dashboard Peserta (`/peserta/dashboard`), Kegiatan Saya (`/peserta/kegiatan`), lalu tombol Logout (konfirmasi tidak ada; langsung `auth.logout()` + redirect `/`).
- **Header**: dropdown profil berisi identitas user + chip unit kerja (kode + nama, atau "ID n"), menu "Profil Saya" (`/admin/profile`), "Lihat Data User (Debug)" (Swal menampilkan JSON user), dan "Keluar" (Swal konfirmasi → logout → `/`).
- `AdminLayout` memetakan `route.name` → judul header (dashboard, kegiatan, kegiatan-peserta, peserta, sertifikat, pengesahan, pegawai = "Manajemen Pegawai & User"; selain itu "Dashboard").

### 1.5 Activity logger (`services/activityLogger.js`)
`logActivity(action, description, metadata)` → POST `log-aktivitas` (payload: `id_pegawai`, `aksi`, `deskripsi`, `metadata` JSON string, `ip_address:'unknown'`, `user_agent`, `timestamp`). Tidak pernah melempar error. `ActivityEvents` menyediakan helper: LOGIN/LOGOUT, ACCESS_PAGE, VIEW_DASHBOARD, VIEW_KEGIATAN_LIST/DETAIL, CREATE/UPDATE/DELETE_KEGIATAN, CREATE/UPDATE/DELETE_PESERTA, VIEW/CREATE_SERTIFIKAT, VIEW/CREATE/UPDATE/DELETE_PEGAWAI, EXPORT_DATA, VIEW/EDIT_PROFILE, CHANGE_PASSWORD, VIEW/CREATE_SURAT_TUGAS, IMPORT_DATA, ERROR_OCCURRED. Dipanggil antara lain dari Kegiatan, PesertaManagement, Sertifikat, PegawaiManagement, Dashboard (VIEW_KEGIATAN_DETAIL, EXPORT_DATA).

### 1.6 Util URL (`utils/url.js`)
- `buildPublicUrl(path)` → URL absolut aplikasi (base `VITE_SIMAIK_BASE` atau origin + `BASE_URL`).
- `buildStorageUrl(path)` → `{apiHostBase}/storage/{path}` untuk file upload (flyer, tanda tangan, template).
- Pola link publik yang dibangun frontend (lihat §3 dan §5):
  - `formulir/{kode}/{Peran}[/{idTp k}]/{slug}` (Peran: Peserta|Panitia|Narasumber|Pendamping)
  - `daftar-peserta/{kode}/{slug}`
  - `kegiatan/{kode}/{slug}` (detail publik)
  - `evaluasi/{kode}[/{idTpk}]/{slug}`, `laporan-evaluasi/...`, `test/...`
  - `unduh-sertifikat/{kode}/{slug}`
  - `slug` = slugify judul kegiatan (lowercase, spasi→`-`, buang non-word).

---

## 2. ATURAN AKSES (SIAPA BOLEH APA)

| Aksi / Area | Admin (role admin) | Admin + jabatan "Kepala" | Peserta |
|---|---|---|---|
| Seluruh halaman `/admin/*` | ✅ | ✅ | ❌ (dialihkan ke `/login-peserta`) |
| Menu & halaman Pengesahan | ❌ (menu disembunyikan; akses langsung dialihkan ke dashboard) | ✅ | ❌ |
| Portal Peserta (`/peserta/*`) | ✅ (menu khusus di sidebar admin) | ✅ | ✅ |
| Kelola peserta (edit/hapus) per kegiatan | Hanya bila **pembuat kegiatan** (id user/pegawai cocok dengan `created_by*`/`id_pegawai` kegiatan) **atau terdaftar dalam penugasan kegiatan** (`penugasan-pegawai`) | sama | – |
| Kelola/generate sertifikat (PesertaManagement & Sertifikat) | Hanya bila user **terdaftar dalam penugasan kegiatan** tsb (`canManageCertificateForPeserta`); jika tidak → Swal "Akses Ditolak": *"Hanya pengguna yang terdaftar dalam penugasan kegiatan ini yang dapat mengelola sertifikat."* | sama | – |
| Daftar kegiatan di halaman Kegiatan | Hanya kegiatan milik tim saya (`kegiatan/tim-saya`) | sama | – |
| Daftar kegiatan di Dashboard | Semua kegiatan (`kegiatan/all`) | sama | – |
| Unit Kerja & Anggota Tim | Semua admin (murni lokal, lihat §4) | sama | – |
| Pegawai & User (CRUD) | Semua admin | sama | – |

Catatan:
- Pemeriksaan "penugasan" di PesertaManagement membandingkan `id_user`/`id_pegawai` user login (termasuk lookup `database.users` via email) dengan field relasi penugasan (`id_pegawai`, `pegawai_id`, `penugasan.*`, `created_by*`).
- Pemeriksaan "pembuat kegiatan" (`isKegiatanCreator`) membandingkan `created_by`, `created_by_id`, `created_by_user(_id)`, `created_by_pegawai(_id)`, `id_user`, `user_id`, `id_pegawai` kegiatan dengan akun user login.
- Pada rute `/admin/kegiatan/:id/peserta`, `PesertaManagement` menerima prop `kegiatanId` sehingga filter kegiatan dikunci dan fitur kelas aktif.

---

## 3. HALAMAN: DASHBOARD (`/admin/dashboard`)

**Tujuan**: ringkasan statistik + daftar kartu kegiatan (grid) dengan link/QR publik dan aksi ekspor.

**Sumber data** (on-mount paralel):
- `kegiatan/statistik` (raw) → kartu statistik: total_kegiatan, total_peserta, total_sertifikat, total_kegiatan_berjalan (fallback lokal: hitung dari `database.*`, "berjalan" = hari ini dalam rentang tanggal).
- `peserta`, `sertifikat`, `unit-kerja` (untuk filter & keperluan modal).
- `kegiatan/all` dengan params `page, per_page=9, limit, search, tahun, unit_kerja` (server-side pagination, 9 kartu/halaman). Fallback ke `database.kegiatan` bila API gagal.

**Kartu statistik** (4): Kegiatan 📅, Peserta 👥, Sertifikat ✅ (hanya status terbit), Berjalan ⚡.

**Filter & search** (debounce 300 ms, reset ke halaman 1):
- `searchKegiatan` (teks), `filterTahun` (default tahun berjalan, opsi dari `tanggal_mulai`), `filterStatus` (Berjalan/Akan Datang/Selesai — dihitung dari tanggal, bukan field status), `filterUnitKerja` (dari master unit kerja).
- Filter status dihitung lokal (`getKegiatanStatus`): `akan_datang` bila hari ini < tanggal_mulai, `selesai` bila > tanggal_selesai, selain itu `berjalan`.

**Kartu kegiatan**: judul, tanggal (format range), lokasi/TPK, unit kerja, badge status, `peserta_ringkasan`, QR code ke halaman detail publik (`kegiatan/{kode}/{slug}`), link dokumen (Dokumentasi/Materi/Panduan/Laporan/Surat Menyurat dari field `*_url`), tombol:
- **Detail** → `openDetailModal(k)` (lihat bawah) + log `VIEW_KEGIATAN_DETAIL`.
- **Peserta** → navigasi ke `kegiatan-peserta` (route `:id`).
- Pagination Prev/angka/Next.

**Modal Detail Kegiatan** (`showDetailModal`):
- QR "Link Detail Kegiatan Publik" (`kegiatan/{kode}/{slug}`).
- **Form Links** per peran (Peserta/Panitia/Narasumber/Pendamping). Bila kegiatan punya beberapa TPK, link dibuat per TPK (`formulir/{kode}/{Peran}/{idTpk}/{slug}`, label "Peran - Lokasi (Kab/Kota)"); tanpa TPK → link per peran biasa. Tiap link punya QR (library `qrcode`, `toDataURL`).
- **Evaluation Links**: Link Evaluasi & Laporan Evaluasi (per TPK bila ada).
- **Document Links** (jika `*_url` tersedia).
- Toggle **"Lihat Peserta"** → tabel peserta kegiatan terpilih (Nama, NIP, Email, Peran) dari data `peserta` lokal/API.
  - **Export Excel** (`exportPesertaKegiatan`): xlsx sheet "Peserta", kolom: nama_kegiatan, nama_lengkap, nip, pangkat/golongan, jabatan, email, no_hp, nama_instansi, npsn, alamat_instansi, kab_kota, provinsi, peran, jenis_kelamin, tanggal_lahir, nomor_rekening, nama_bank, provider_pulsa, tanda_tangan_url (URL absolut via `buildStorageUrl`). Nama file `peserta_export_<timestamp>.xlsx`. Log `EXPORT_DATA`.
  - **Download Batch DOCX** (`downloadBatchPesertaDocx`): unduh `template_peserta.docx` dari public app, per peserta: replace placeholder ({{judul_kegiatan}}, {{waktu}}, {{lokasi}}, {{nama_lengkap}}, {{nip}}, {{pangkat}}, {{instansi}}, {{jabatan}}, {{kabupaten_kota}}, {{provinsi}}, {{no_hp}}, {{email}}, {{peran}}, {{tanda_tangan_url}}, dst.) + isi tabel "Kelengkapan Kegiatan" dari daftar ATK kegiatan (fetch detail `kegiatan/{id}` dengan cache), lalu zip (JSZip) → `{nama_kegiatan}-docx-batch.zip`, nama file dalam zip `{Peran} - {Nama}.docx`. Log `EXPORT_DATA` format `docx-zip`.

---

## 4. HALAMAN: MANAJEMEN KEGIATAN (`/admin/kegiatan`)

**Tujuan**: CRUD kegiatan milik tim user + penugasan anggota + pembagian link publik.

**Sumber data**:
- On-mount paralel: `pegawai`, `users`, `unit-kerja`, `peran` (opsional, untuk opsi peran penugasan), lalu `kegiatan/tim-saya` (`listKegiatanTimSaya`) — **hanya kegiatan yang bisa diakses user login** (berdasarkan tim/penugasan), dedupe by id.
- Snapshot penugasan: `penugasan-pegawai` (dikelompokkan per kegiatan via `groupPenugasanByKegiatan`), fallback `database.surat_tugas*`.

**Header**: tombol **"+ Tambah Kegiatan"** (buka modal kosong) + info `id_pegawai` user.

**Filter** (client-side, reset halaman 1):
- `searchQuery` (nama kegiatan), `filterTahun` (dari `tanggal_mulai`), `activeFilter` (Semua/Berjalan/Akan Datang/Selesai — dihitung dari tanggal, sama seperti Dashboard).
- Pagination client-side 10/halaman (Prev, jendela 5 angka, Next; label "a-b dari n").

**Aksi per kartu/baris kegiatan**:
- **Lihat Detail** (`viewDetail`) → fetch `kegiatan/{id}`, buka modal mode baca (`isViewing=true`) yang memuat: info dasar, tabel TPK, jadwal harian (dari `laporan/{id}/jadwal`), daftar ATK, paket soal ujian, resource URL, status, **Link Biodata per peran/TPK** (dengan QR), **Link Evaluasi, Laporan & Test** (dengan QR), dan tombol aksi:
  - **Penugasan** (`openPenugasanModal`) → modal Detail Penugasan (lihat bawah).
  - **Peserta** → `kegiatan-peserta`.
  - **Laporan Test** → `test-laporan` (`/admin/kegiatan/:id/test-laporan`).
  - **Buat Laporan** → `buat-laporan`.
  - **Duplikat** (`duplicateKegiatan`) → salin field kegiatan (tanpa id) + ATK + TPK ke form tambah (mode create), file flyer/template di-reset.
  - **Edit** (`openEditFromDetail`) → mode edit form yang sama + load jadwal per kelas untuk diedit.
- **Share Link** (`shareKegiatanPublikLink(k)`) → link `kegiatan/{kode}/{slug}` (halaman detail publik). Jika browser mendukung `navigator.share` → native share sheet; jika dibatalkan (AbortError) diam; jika tidak didukung → copy ke clipboard (`navigator.clipboard` atau textarea+`execCommand('copy')`) dengan alert "Link publik kegiatan berhasil disalin ke clipboard."; jika copy gagal → `prompt('Salin link publik kegiatan berikut:', link)`.
- **Link Peserta** (`sharePublicPesertaLink(k)`) → link `daftar-peserta/{kode}/{slug}` (daftar pengisi biodata publik); mekanisme share/copy/prompt sama, judul share "Daftar Peserta - {nama}".
- **Hapus** (`deleteKegiatan`) → `confirm()` browser; `removeKegiatan(id)` (DELETE `kegiatan/{id}`); baris tetap dihapus dari daftar meski API gagal; log `DELETE_KEGIATAN` atau `ERROR_OCCURRED`.

**Modal Tambah/Edit/Detail Kegiatan** (`showAddModal`) — judul "Tambah/Edit/Detail Kegiatan":
- *Informasi Dasar*: `nama_kegiatan*` (dengan **Pratinjau Link Formulir** langsung di bawah input: `formulir/{kode|editingId}/{Peran|'Peserta'}/{slug}`), `rincian_kegiatan`, `deskripsi`, `unit_kerja_id*` (select dari `userUnitKerjaOptions` = unit kerja milik user dari auth store; jika kosong muncul peringatan).
- *Jadwal & Lokasi*: `tanggal_mulai*`, `tanggal_selesai*`; editor **TPK (Tempat Pelaksanaan Kegiatan)** multi-baris: tabel (No, Lokasi, Kabupaten/Kota, Aksi edit/hapus) + sub-form (Lokasi* + select Kabupaten/Kota dari daftar tetap 10 kab/kota NTB + "Lainnya"); tombol Tambah/Simpan-ubah/Batal; **minimal 1 TPK wajib** saat simpan.
- *Paket Soal*: daftar paket terpilih (tabel No, Nama Paket, Jumlah Soal, Hapus) + combobox pencarian `test/paket-all` (dropdown, debounce via `searchPaketSoal`; item yang sudah ditambahkan tidak muncul lagi). Dikirim sebagai `daftar_paket_soal[]` (id).
- *Jadwal Harian*: tombol **"Generate Jadwal dari Tanggal"** (`generateJadwalFromDates`) membuat 1 hari per tanggal (label "Hari Pertama/Kedua/...") dengan 5 slot default (3 materi 2 JP + Rehat + Isoma). Per hari: edit `hari`, `tanggal`, tombol "Hapus Hari"; per item: `tipe` (materi/istirahat), `jam_mulai`, `jam_selesai` (JP otomatis = durasi jam, dibulatkan 0.1; istirahat JP=0), `kegiatan` (materi/keterangan), `kategori` (Umum/Pokok/Penunjang), `pj`. Tombol "+ Materi" / "+ Istirahat"; hapus item (×). **Aturan waktu**: `jam_mulai` tidak boleh < `jam_selesai` item sebelumnya (dipaksa), perubahan waktu memicu cascade ke item berikutnya (`cascadeTimes`, durasi default 120 mnt materi / 15 mnt istirahat). Total JP per hari ditampilkan. Jika kegiatan punya kelas (`kelas/{idKegiatan}`), jadwal dikelola **per kelas** (tab tombol kelas, disimpan di `jadwalDataStore` per `id_kelas`).
- *Flyer*: input file/drag-drop/paste gambar → base64 (maks 2MB, harus gambar); tombol hapus.
- *Metode & Peserta*: `metode_pelaksanaan*` (daring/luring/hybrid), `metode_pembayaran*` (transfer/pulsa/transfer_dan_pulsa/tunai/tidak_dibayar), `total_peserta*` (angka ≥ 0), `peserta_ringkasan` (teks bebas, mis. "Karyawan, CPNS").
- *Daftar ATK*: tabel item (Nama Barang, Spesifikasi, Jumlah+Satuan, Keterangan, Hapus) + sub-form (Nama Barang* wajib; Jumlah angka ≥ 0).
- *Resource URL*: `dokumentasi_url`, `materi_url`, `panduan_url`, `laporan_url`, `surat_menyurat_url`.
- *Template Biodata (DOC/DOCX)*: upload file (.doc/.docx, maks 10MB); link "Download template saat ini" (dari `storage/...`); tombol hapus (menandai `template_biodata=''` dikirim kosong saat simpan).
- *Status*: `status*` (draft/berjalan/selesai/dibatalkan).

**Validasi form** (`validateForm`, pesan di `formError`): nama wajib, unit kerja wajib, tanggal mulai/selesai wajib, tanggal mulai ≤ selesai, minimal 1 TPK, metode pelaksanaan & pembayaran wajib, total peserta tidak negatif, status wajib.

**Simpan** (`saveKegiatan`):
- Cek token di localStorage; `id_pegawai` = user login (hanya untuk create).
- Payload bersih (tanpa field null/kosong): nama, rincian, deskripsi, `unit_kerja_id` + `id_tim` (nilai sama), tanggal, metode, total_peserta, peserta_ringkasan, 5 resource URL, status (+`id_pegawai` saat create).
- Jika ada file (flyer/template) atau daftar ATK → kirim **FormData** (termasuk `daftar_atk[i][...]`, `daftar_tpk[i][...]`, `daftar_paket_soal[i]`, `flyer`, `template_biodata`); update via `POST kegiatan/{id}` + `_method:'PUT'`. Tanpa file → JSON (`updateKegiatan` / `createKegiatan`).
- Setelah tersimpan, **jadwal harian** disimpan via `saveJadwal(idKegiatan, [{hari, tanggal, items, id_kelas, urutan}])` (best-effort, error dicatat ke console).
- Sukses → modal status "Kegiatan berhasil dibuat"/"Perubahan tersimpan" (Swal-style custom overlay) + log `CREATE_KEGIATAN`/`UPDATE_KEGIATAN` + `loadKegiatan()` ulang. Gagal → pesan kontekstual: "failed to upload" → saran cek `upload_max_filesize` PHP; 403 → saran cek hak akses/token; selain itu `ERROR_OCCURRED`.
- Overlay "Menyimpan kegiatan" selama proses (`isSubmitting`).

**Modal Detail Penugasan** (`showSuratTugasModal`) — pengelolaan anggota tim/penugasan per kegiatan (menggantikan navigasi ke halaman Penugasan):
- Info penugasan (kegiatan, waktu), tabel anggota (No; Nama+NIP+Pangkat/Gol; Jabatan; **Jabatan dalam Kegiatan** (peran); Aksi **Ubah**/**Hapus**).
- Form tambah/ubah anggota: `Pilih Pegawai*` (select dari master pegawai), `Peran*` (select; default `penanggung_jawab`, `ketua_panitia`, `panitia`, `peserta`, `narasumber` + peran unik dari API `peran` dan data penugasan, diurutkan alfabetis-humanized).
- **Validasi** (`addAnggota`): pegawai & peran wajib; pegawai harus ada; **tidak boleh duplikat** dalam kegiatan yang sama; **tidak boleh bentrok jadwal** — pegawai yang sama tidak boleh ditugaskan pada kegiatan lain yang rentang tanggalnya tumpang tindih (`findOverlappingKegiatanForPegawai`; pesan menyebut kegiatan, lokasi, dan tanggal kegiatan lain).
- Simpan via `createPenugasanPegawai`/`editPenugasanPegawai` (POST/PUT `penugasan-pegawai` dengan `id_kegiatan`, `id_pegawai`, `peran`), hapus via `removePenugasanPegawai` (confirm browser). Setelah aksi, snapshot dimuat ulang.
- **Salin Tabel** (`copyAnggotaTable`): menyalin tabel HTML anggota (No, Nama/NIP/Pangkat/Gol, Jabatan, Jabatan dalam Kegiatan) ke clipboard (metode seleksi + `execCommand('copy')`) untuk ditempel ke Word/Excel — alert sukses/gagal.

**Modal Biodata Peserta** (dari konteks kegiatan): menampilkan biodata + checklist dokumen administrasi (Penugasan, SPPD, Tiket Pergi/Pulang Pulau Sumbawa, Nota Bensin Pulau Lombok) + kelengkapan kegiatan + daftar ATK; tombol **Print** (`printBiodata`) membuka window print A4 (Times New Roman 12pt, tabel Administrasi & Kelengkapan berdampingan, ATK full-width, blok tanda tangan).

---

## 5. HALAMAN: DETAIL KEGIATAN (`/admin/kegiatan/:id/detail`)

Halaman read-only ringkas (`KegiatanDetail.vue`):
- Fetch paralel `kegiatan/{id}` dan `laporan/{id}/jadwal`; ATK opsional `kegiatan/{id}/atk`.
- Tampilan: judul kegiatan, total peserta, deskripsi, kartu **Tempat Pelaksanaan Kegiatan** (TPK), **Jadwal Harian** (per hari + JP badge), **Daftar ATK**, **Link Biodata** (4 peran: `/formulir/{kode}/{Peran}/{idTpkPertama|0}/{slug}`), **Link Evaluasi, Laporan & Test** (`/evaluasi/`, `/laporan-evaluasi/`, `/test/` dengan idTpk pertama atau 0), **Resource** (dokumentasi/materi/panduan/laporan/surat_menyurat).
- Tombol kembali (history back, fallback ke dashboard).
- Label status: draft/berjalan/selesai/akan_datang; metode: luring/daring/hybrid.

## 6. HALAMAN: PESERTA KEGIATAN (`/admin/kegiatan/:id/peserta`)

- Wrapper: fetch `kegiatan/{id}` (fallback ke `database.kegiatan`) untuk menampilkan judul kegiatan, lalu **me-render komponen `PesertaManagement`** (lihat §9) dengan prop `kegiatanId` = `:id` → semua fitur manajemen peserta + kelas aktif untuk kegiatan tersebut (filter kegiatan terkunci).

## 7. HALAMAN: LAPORAN HASIL TEST (`/admin/kegiatan/:id/test-laporan`)

- Data: `getKegiatan(id)`, `test/laporan/{idKegiatan}` (ringkasan per peserta×paket), `test/laporan/{idKegiatan}/{idPeserta}/{idPaketSoal}` (detail jawaban).
- **Filter**: `filterPeserta` (Semua/daftar peserta unik dari data), `filterPaket` (Semua/daftar paket unik) → `applyFilters` client-side.
- **Tabel Ringkasan Peserta**: No, Nama, NIP, Paket, Benar, Salah, Skor, Aksi **"Detail"** → panel detail (auto-scroll) berisi ringkasan (Total/Benar/Salah/Skor) + **Detail Jawaban** (pilihan a–d; pilihan kunci diberi badge "Kunci", jawaban peserta salah diberi badge "Jawaban").
- **Cetak PDF** (`cetakPDF`): window baru berisi HTML "Hasil Ujian" (identitas peserta, 4 kartu statistik, detail jawaban berwarna) + auto `window.print()`.
- **Export Excel** (`exportExcel`, disabled bila data kosong): sheet "Hasil Test" kolom No, Nama Peserta, NIP, Jabatan, Instansi, Paket Soal, Total Soal, Jawaban Benar, Jawaban Salah, Skor; file `hasil_test_{namaKegiatan}.xlsx` (karakter non-alfanumerik → `_`).

## 8. HALAMAN: BUAT LAPORAN (`/admin/kegiatan/:id/buat-laporan`)

Editor laporan kegiatan dengan 2 mode toggle: **Form** ↔ **Preview** (dokumen bergaya cetak).
- Data awal: `kegiatan/{id}`, `kegiatan/tim/{id}` (peserta), `evaluasi/{id}/statistik` + `evaluasi/{id}` (opsional), draft dari `laporan/{id}/draft` (API, fallback localStorage `siamik_activity_report_drafts_v1` per kegiatan), jadwal `laporan/{id}/jadwal`.
- **Form** (narasi): Angkatan; **Lembar Pengesahan** 3 baris (peran "Disusun/Diverifikasi/Divalidasi oleh": Nama, NIP, Jabatan, Tanggal); Kata Pengantar; BAB I (Latar Belakang, **Dasar Hukum** per baris-enter, Tujuan, Sasaran, Pembiayaan/sumber dana); tombol **"Generate Rekaman Proses"** (membuat `rekaman_proses_per_hari` dari jadwal harian atau rentang tanggal kegiatan, per hari `narasi`); BAB V (Kesimpulan, Saran).
- **Tombol**:
  - **Simpan Draft** (`saveDraft`) → `saveActivityReportDraftToAPI` (POST `laporan/{id}/draft` + simpan lokal) + `alert('Draft berhasil disimpan!')`.
  - **Download DOCX** (`downloadDocx`) → `utils/generateLaporanDocx.js` dengan data kegiatan, peserta, evaluasi (distribusi % aspek program/fasilitator/layanan), draft, dan lokasi TPK. Error → `alert('Gagal membuat DOCX: ...')`.
- **Preview** menampilkan struktur laporan lengkap: Lembar Pengesahan (tabel tanda tangan), Kata Pengantar, BAB I–V, **BAB II** Personalia (dari peserta: peran Panitia/Pendamping dan Fasilitator), **BAB III** Struktur Program (dikelompokkan dari jadwal per kategori Umum/Pokok/Penunjang + total JP), Jadwal Kegiatan per kelas (Waktu, Kegiatan/Materi, JP, PJ), Rekaman Proses, **BAB IV** Evaluasi (tabel % Sangat Sesuai/Sesuai/Cukup/Kurang per aspek; warna: ≥70 hijau, ≥40 biru, >0 amber).
- Program rows dihitung dari `evalDetails` (skor 1–5 → distribusi persentase).

## 9. HALAMAN: MANAJEMEN PESERTA (`/admin/peserta` dan embedded `/admin/kegiatan/:id/peserta`)

Komponen `PesertaManagement.vue` (props opsional `kegiatanId`, `kegiatanData`) — halaman admin terlengkap.

**Pemuatan data** (cache in-memory 10 menit per modul; `reloadApiData` memaksa refresh):
- `peserta?per_page=500&page=N` di-loop sampai `meta.last_page` (maks 40 halaman) → `peserta`.
- `kegiatan/all` (+ detail `kegiatan/{id}` bila `kegiatanId` prop tidak ada di list) → `kegiatan`.
- `kegiatan/{idKegiatanAktif}/peserta-sertifikat` → `sertifikat` (status per peserta).
- `pegawai` (untuk pilihan penandatangan), `penugasan-pegawai` (untuk cek hak akses).
- Error → banner kuning "…Silakan klik muat ulang" dengan tombol **Muat ulang** / **Tutup**.

**Statistik**: total peserta, peserta aktif, bersertifikat, dan ringkasan `sertifikatStats` (total/terbit/draft/dicabut/belum_ada) — dihitung dari data terfilter.

**Filter & search** (reset halaman 1; perubahan `filterKegiatan` juga me-reset seleksi & reload sertifikat):
- `searchNama` (nama), `filterTahun`, `filterKegiatan` (hanya tampil bila tanpa `kegiatanId` prop), `filterStatus` (aktif/nonaktif), `filterKabKota` (unik dari data), `filterTpk` (unik, label "Lokasi (Kab/Kota)"), `filterPeran` (unik), `pageSize` (10/25/50/100).
- Jika `kegiatanId` prop ada: filter kegiatan dikunci; kartu **Kelas** tampil di atas tabel.

**Tabel peserta** (min-width 1200px):
- Kolom sortable (klik header, indikator ▲/▼): Nama, NIP, Instansi, Kabupaten/Kota, TPK, Peran, Sertifikat; kolom tetap: checkbox, No, Aksi. Sort `sertifikat` memakai status mentah; `tpk` memakai `tpk.lokasi`.
- Checkbox per baris + **select-all** (`allSelected`, hanya untuk baris yang sedang terfilter).
- Kolom Sertifikat: badge status (belum_ada abu, draft kuning, terbit hijau, dicabut merah) + **dropdown status per baris** (`toggleStatusDropdown`): Terbitkan / Draft / Cabut (opsi yang sama dengan status sekarang disembunyikan).
- Kolom kelas: nama-nama kelas peserta (`pesertaKelasMap`).
- Pagination Prev/Next + "a–b dari n peserta".

**Aksi per baris**:
- **Biodata** (`openBiodataModal` + `printBiodata`): modal biodata (Kegiatan, Waktu, Tempat, data diri 10 field, checklist Administrasi, Kelengkapan Kegiatan dari ATK, blok tanda tangan + NIP) → **Print** membuka window cetak A4 (Times New Roman) dengan tabel berdampingan; menunggu semua gambar (tanda tangan) termuat sebelum `print()`.
- **Detail** (`openDetailModal`): modal detail + tombol **Edit** (hanya bila `canEditPeserta`) dan **Download DOCX** (`downloadPesertaDocx` per peserta; template `template_peserta.docx`, placeholder diganti, tabel kelengkapan ATK diisi; nama file `{Peran} - {Nama}.docx`).
- **Sertifikat** (`openSertifikatModal(p)`; tooltip "Hanya pengguna yang terdaftar dalam penugasan kegiatan ini yang dapat mengelola sertifikat." bila tidak berhak):
  1. Cek `kegiatan/{idKegiatan}/sertifikat-batch`. Jika jumlah batch ≠ 1 → buka **Modal Batch Sertifikat** (buat batch baru).
  2. Jika batch tunggal tersedia → Swal "Buat sertifikat?" (nama peserta + nomor sertifikat) → `POST sertifikat/generate` `{id_batch, id_peserta}` → reload sertifikat + log `CREATE_SERTIFIKAT`.
- **Masuk Kelas** (`openMasukKelasModal`, hanya bila `kegiatanId` prop): pilih kelas → `POST kelas/{idKelas}/anggota` `{id_peserta}`.
- **Download DOCX** (per peserta) — sama seperti di modal detail.
- **Edit** (`openEditModal`, hanya bila `canEditPeserta`) / **Hapus** (`deletePeserta`, `confirm()` browser, hanya bila `canDeletePeserta`) — jika tidak berhak: `alert('Anda tidak memiliki akses untuk mengedit/menghapus peserta pada kegiatan ini.')`. Hapus → `DELETE peserta/{id}` + log `DELETE_PESERTA`.

**Toolbar atas** (beberapa tombol dikomentari di kode: Tambah Peserta, Download Batch DOCX, Biodata Semua — tetap terdokumentasi):
- **Generate Sertifikat Massal** (`handleGenerateMassal`, hanya untuk peserta terpilih yang semuanya boleh dikelola — jika tidak → Swal Akses Ditolak): alur sama dengan sertifikat per peserta; jika batch belum ada → modal batch; jika ada → `POST sertifikat/generate-massal` `{id_batch, peserta_ids}`.
- **Dropdown Bulk Status** (muncul bila ada seleksi): **Terbitkan / Set Draft / Cabut** (`bulkChangeStatus`) → Swal konfirmasi jumlah → proses **berurutan per peserta dengan jeda 5 detik antar item** (overlay progres "Mengubah Status Sertifikat" + "Menunggu 5 detik sebelum data berikutnya..."), update per item: `PUT sertifikat/{id}` `{status}` bila record punya id, jika tidak `PATCH sertifikat/update-status` `{id_peserta, id_kegiatan, status}`; hasil akhir Swal "n berhasil, m gagal" + daftar error (maks 5 ditampilkan).
- **Edit Batch Sertifikat** (`openBatchSertifikatModalForEdit`; disabled bila tidak berhak): modal **Batch Sertifikat**:
  - Field: `Nomor Sertifikat*` (placeholder "421/BPMP/2026"), `Tanggal Tandatangan*`, `Penandatangan*` (select dari master pegawai), `Template File` (upload; link unduh contoh `storage/template_sertifikat/contoh.docx`), `Status` (default draft).
  - Simpan (`saveSertifikat`): validasi (nomor, tanggal, penandatangan wajib) → `POST sertifikat-batch` (FormData bila ada file template; sertakan `id_batch` bila mengedit batch yang ada; `id_kegiatan` dari kegiatan aktif) → lalu otomatis jalankan generate single/massal sesuai mode pending.
- **Export Excel** (`exportPeserta`): sheet "Peserta", kolom: nama_kegiatan, nama_lengkap, nik (npwp_nik), nip, pangkat/golongan, jabatan, email, no_hp, nama_instansi, npsn, alamat_instansi, kab_kota, provinsi, peran, jenis_kelamin, tanggal_lahir, nomor_rekening, nama_bank, provider_pulsa, tanda_tangan_url. Nama file `{Lokasi} - {Nama Kegiatan}_{timestamp}.xlsx` (fallback `peserta_export_...`). Log `EXPORT_DATA`.
- **Download Daftar Hadir** (`downloadDaftarHadir`): template `template_daftar_hadir.docx`; placeholder {kegiatan, peran (filter aktif atau "Semua Peran"), tpk (filter atau "Semua TPK"), kab_kota, ketua_panitia + NIP (dari `penugasan/ketua-panitia/{idKegiatan}`)}; tabel kehadiran dibangun dari peserta terfilter (diganti ke `<w:tbl>` pertama). File `Daftar Hadir - {kegiatan}.docx`.
- **Buat Kelas** (`openKelasModal`; hanya bila `kegiatanId` prop): `nama_kelas*` + `deskripsi` → `POST kelas` `{..., id_kegiatan}`.
- **Print Biodata Semua** (`printAllBiodata`): semua peserta terfilter, satu halaman per peserta (page-break), dengan tanda tangan; **Print Biodata Tanpa TTD** (`printAllBiodataNoSignature`): sama tapi blok tanda tangan diganti ruang kosong 80px.
- *(dikomentari)* Download Batch DOCX ZIP (`downloadBatchDocxZip`): DOCX per peserta terfilter → zip `peserta_batch_{tanggal}.zip`.

**Form Tambah/Edit Peserta** (`showAddModal`):
- *Data Pribadi*: `nama_lengkap*`, `nip`, `email*` (validasi regex), `no_hp`, `jenis_kelamin` (laki-laki/perempuan), `tempat_lahir`, `tanggal_lahir` (date), `npwp_nik`, `pangkat` (select panjang: Non ASN/Honorer/Swasta/Lainnya + golongan PNS Ia–IVe + PPPK I–XVII; nilai "Pangkat / Gol" otomatis memisahkan `gol`), `jabatan`, `id_tpk` (select TPK kegiatan, muncul bila kegiatan punya TPK; reset saat ganti kegiatan).
- *Data Instansi*: `nama_instansi*`, `npsn` (hanya angka, maks 8, auto-strip non-digit), `id_kegiatan*` (select; **disabled saat edit**), `kab_kota` (select 10 kab/kota + "Lainnya").
- *Data Pembayaran* (muncul hanya bila `metode_pembayaran` kegiatan ∈ transfer/pulsa/transfer_dan_pulsa): `nomor_rekening` + `nama_bank` (transfer), `provider_pulsa` (Telkomsel/Indosat/XL/Tri/Smartfren/Axis/By.U).
- *Tandatangan Digital*: canvas gambar (mouse/touch), tombol hapus; preview tanda tangan tersimpan (URL storage) saat edit.
- *Data Administrasi*: `no_surat_tugas`, `tanggal_surat_tugas`, `peran` (Peserta/Narasumber/Fasilitator/Panitia).
- **Validasi**: nama, email, nama instansi, kegiatan wajib; format email; NPSN angka; email instansi valid (jika diisi).
- **Simpan** (`savePeserta`): edit → `PUT peserta/{id}` (atau `POST peserta/{id}` + `_method:'PUT'` FormData bila ada tanda tangan baru, file `tanda_tangan` dari base64 canvas); create → `POST peserta` (JSON atau FormData). Field kosong/null dibuang (`cleanPayload`, kecuali `tandatangan`). Log `CREATE_PESERTA`/`UPDATE_PESERTA`, reload data.

**Fitur Kelas** (hanya konteks per kegiatan):
- Kartu daftar kelas (klik → **Detail Kelas**: tabel anggota (Nama, NIP, Instansi, preview TTD via `buildStorageUrl`, Aksi **Hapus** anggota → `DELETE kelas/{idKelas}/anggota/{idPeserta}`) + tombol **Download Daftar Hadir** per kelas (`downloadDaftarHadirKelas`, format sama seperti daftar hadir umum + label kelas) dan Tutup.
- Nama kelas peserta ditampilkan di baris tabel peserta.

---

## 10. HALAMAN: SERTIFIKAT (`/admin/sertifikat`)

Manajemen status sertifikat lintas kegiatan (gabungan `peserta` + `sertifikat` + `kegiatan/all`).
- **Filter**: `searchQuery` (nama/NIP), `filterKegiatan` (semua kegiatan), `filterStatus` (draft/terbit/dicabut/belum_ada), `pageSize` (10/25/50/100); perubahan filter reset halaman 1.
- **Tabel** (min-width 900px): checkbox (select-all per halaman), No, Nama (sort), NIP (sort), Kegiatan, No. Sertifikat, Status (sort, badge), Aksi. Sorting klik header (▲/▼).
- **Baris gabungan** (`mergedList`): satu baris per peserta; status dari record sertifikat yang cocok (`status_sertifikat`/`status`), selain draft/terbit/dicabut → "belum_ada".
- **Aksi per baris**: tombol **Terbitkan / Draft / Cabut** (opsi sesuai status sekarang disembunyikan) → Swal konfirmasi (warna tombol hijau/kuning/merah sesuai aksi; teks "Tindakan ini dapat dikembalikan" untuk Cabut) → `PUT sertifikat/{id_sertifikat}` `{status}` bila record punya id, jika tidak `PATCH sertifikat/update-status` `{id_peserta, id_kegiatan, status}` → reload + log `ACCESS_PAGE("Ubah status sertifikat …")` + Swal hasil.
- **Bulk** (saat ada seleksi): **Terbitkan Terpilih / Set Draft / Cabut Terpilih / Batal Pilih** → Swal konfirmasi → proses berurutan dengan **jeda 5 detik** per item + overlay progres; ringkasan berhasil/gagal + detail error (maks 5).
- **Statistik** tersedia: total/draft/terbit/dicabut (dari `filteredList`).
- Banner error API (kuning) dengan **Muat ulang** / **Tutup**.
- Log akses halaman `ACCESS_PAGE('Manajemen Sertifikat')` saat mount.

## 11. HALAMAN: PEGAWAI & USER (`/admin/pegawai`)

Manajemen pegawai (tab utama) + user admin (tab kedua, **aktual tombol tab "User" dikomentari** — tabel user tetap dirender bila `activeTab==='user'`, dan modal Edit/Tambah User tetap tersedia dari skrip).
- **Data**: `pegawai` + `users` dari API (fallback `database.*`); log `ACCESS_PAGE('Manajemen Pegawai & User')`.
- **Filter**: `searchNama` (nama), `filterStatus` (aktif/nonaktif), `filterGolongan` (unik, terurut). Statistik: jumlah pegawai terfilter + yang aktif.
- **Tabel pegawai**: No, Nama (dengan `pdm_detail`), NIP, Jabatan, Golongan, Unit Kerja, Status, Aksi: **Lihat Detail** (`viewDetailPegawai` → modal Informasi Kepegawaian/Pribadi/Pendidikan + **Keanggotaan Tim** dari `database.keanggotaan_tim`), **Hapus** (`deletePegawai`: `confirm()`; hanya menghapus lokal + log `DELETE_PEGAWAI`). *(Tombol Edit per baris dikomentari; `editPegawai` tetap ada di skrip.)*
- **Import Excel** (`handleImportFile`, input file tersembunyi): parse sheet pertama via `xlsx`; **header wajib**: `nip, nama, tempat_lahir, tanggal_lahir, tmt_cpns, tmt_pangkat, pangkat, golongan, nama_jabatan, tmt_jabatan, pendidikan_terakhir, jurusan, tempat_pendidikan, tahun_lulus, latihan_jabatan, status_kepegawaian, status` (kekurangan header → alert daftar). Per baris: skip bila nip/nama kosong atau NIP duplikat lokal; kirim `POST pegawai` per baris (bisa gagal per baris → hitung error). Ringkasan: "n data pegawai berhasil diimpor ke server. m baris diabaikan… k baris gagal…".
- **Modal Tambah/Edit Pegawai**: field lengkap (Nama*, NIP* [wajib & unik], Jabatan, Golongan, Unit Kerja, Pendidikan Terakhir, Jurusan, Tempat/Tanggal Lahir, Pangkat, TMT CPNS/Pangkat/Jabatan, Tempat Pendidikan, Tahun Lulus, Masa Kerja (Tahun/Bulan), Latihan Jabatan, Perkiraan Pensiun, `status_kepegawaian*` (PNS/PPPK), `status` (aktif/nonaktif)). Simpan: create → `POST pegawai` (gagal API → alert "disimpan lokal tapi gagal dikirim ke server", tetap lanjut lokal); update → `PUT pegawai/{id}` (gagal → update lokal). Log `CREATE_PEGAWAI`/`UPDATE_PEGAWAI`.
- **Tabel User** (tab user): No, Email, Role, Tim, Pegawai, Status, Last Login. Aksi Edit/Hapus.
- **Modal Edit User**: `email*` (regex + unik), `role*` (admin/operator/verifikator), `status*` (aktif/nonaktif), pegawai (readonly), **Ubah Password** (opsional: minimal 6 karakter + konfirmasi cocok; disimpan lokal sebagai `'$2b$10$' + btoa(password)` — simulasi). Simpan **lokal saja** (`users.value[index]` diupdate, tanpa API).
- **Modal Tambah User Admin**: pegawai* (select), email* (unik), role*, status*, password* (min 6), konfirmasi* → `POST users` (gagal API → alert, tetap tersimpan lokal). Log tidak ada.

## 12. HALAMAN: UNIT KERJA (`/admin/unit-kerja`) — **MURNI LOKAL**

Semua operasi baca/tulis memakai `database.unit_kerja` / `database.sub_unit_kerja` in-memory; **tidak ada panggilan API — perubahan hilang saat reload**.
- **Filter**: `searchNama` (nama unit), `filterJenis` (utama/pendukung), `filterTahun` (default tahun berjalan; opsi dari data). Statistik jumlah unit terfilter.
- **Tab**: "Unit Kerja" / "Sub Unit".
- **Tabel Unit**: Kode, Nama Unit, Jenis, Tahun, Keterangan, Aksi: **Lihat Detail** (modal: info unit + daftar sub unit terkait), **Edit**, **Hapus** (`confirm()`; ikut menghapus sub unit terkait).
- **Modal Tambah/Edit Unit**: `kode_unit*` (unik), `nama_unit*`, `jenis_unit*` (utama/pendukung), `tahun*`, `keterangan`. Validasi: field wajib + kode unik.
- **Tabel Sub Unit**: Nama Sub Unit, Unit Induk, Fungsi, Aksi Edit/Hapus (`confirm()`).
- **Modal Edit Sub Unit**: `unit_kerja_id*`, `nama_sub_unit*`, `fungsi*`. (Tidak ada tombol tambah sub unit pada template yang diamati — hanya edit/hapus.)

## 13. HALAMAN: ANGGOTA TIM (`/admin/anggota`) — **MURNI LOKAL**

CRUD keanggotaan tim di atas `database.keanggotaan_tim` (+ referensi `database.pegawai`, `unit_kerja`, `sub_unit_kerja`); **tanpa API, perubahan hilang saat reload**.
- **Filter**: `searchNama` (nama pegawai), `filterUnit` (semua unit), `filterPeran` (Ketua/Anggota/Koordinator/Wali Wilayah/Co-Wali Wilayah), `filterTahun` (default tahun berjalan). Statistik jumlah anggota terfilter.
- **Tabel**: Nama Anggota, Unit Kerja, Peran, Sub Unit, Tahun, Aksi **Edit**/**Hapus** (`confirm()`).
- **Modal Tambah/Edit Anggota**: `Pilih Pegawai*`, `Unit Kerja*`, `Peran*` (5 pilihan di atas), `Sub Unit Kerja` (opsional; opsi terfilter per unit induk), `Tahun*`. **Validasi**: field wajib + **duplikat dicegah** (pegawai + unit + tahun yang sama).
- Helper `countByRole(role)` tersedia untuk statistik per peran.

## 14. HALAMAN: PENUGASAN (`/admin/penugasan`)

Tabel rekap penugasan pegawai (read-only + ekspor).
- **Sumber**: `GET penugasan-pegawai-detailed` dengan params `per_page, page, search, kabupaten_kota, tanggal_mulai, tanggal_selesai` + objek `pagination` dari response (`raw: true`).
- **Filter**: `search` (nama pegawai / kegiatan, debounce 400 ms, reset ke halaman 1), `kabupaten_kota` (select tetap 10 kab/kota NTB), `tanggal_mulai` & `tanggal_selesai` (date). Tombol **Terapkan** (reload) dan **Reset** (kosongkan filter + reload). `per_page` 10/15/25/50.
- **Tabel**: #, Pegawai, Kegiatan, Peran, Tanggal, Kab/Kota, Lokasi. Pagination Prev/Next server-side.
- **Export Excel** (`exportExcel`): kolom ID, ID_Kegiatan, Nama_Kegiatan, ID_Pegawai, Nama_Pegawai, Peran, Tanggal_Mulai, Tanggal_Selesai, Kabupaten_Kota, Lokasi (dari baris yang sedang tampil); sheet "Penugasan"; file `penugasan_{timestamp}.xlsx`. Jika kosong → `alert('Tidak ada data untuk diekspor')`.

## 15. HALAMAN: PENGESAHAN (`/admin/pengesahan`) — **KHUSUS KEPALA**

Ditampilkan di sidebar dan hanya bisa diakses user dengan jabatan mengandung "kepala" (`meta.requiresKepala`; non-kepala dialihkan ke dashboard; `fetchMe` di-await sebelum guard).
- **Sumber**: paralel `listKegiatan()` + `GET sertifikat`.
- **Logika** (`kegiatanMenunggu`): kelompokkan sertifikat per kegiatan yang statusnya **bukan 'terbit'** (status dinormalisasi dari `status_sertifikat`/`status`); hitung `total_belum_terbit` serta rincian badge: `draft` (kuning), `dicabut` (merah), `lainnya` (abu). Diurutkan dari yang paling banyak menunggu. Ringkasan `totalMenunggu`.
- **Kartu per kegiatan**: nama kegiatan, rentang tanggal, lokasi, badge rincian, dan link **"Lihat Peserta"** → `/admin/kegiatan/{id_kegiatan}/peserta` (tempat admin/kepala menerbitkan sertifikat).
- Tombol **Muat ulang** (`loadData`); empty state "Tidak ada pengesahan tertunda".

## 16. HALAMAN: LAPORAN KEGIATAN (`/admin/laporan-kegiatan`)

Preview dokumen laporan (struktur sama dengan preview Buat Laporan: Lembar Pengesahan, Kata Pengantar, Daftar Isi, BAB I–V, Lampiran "Link Sertifikat") + **Download DOCX** (`generateLaporanDocx`).
- **Status aktual**: `loadLaporan()` saat ini **selalu** mengeset `data = null` dan `state = 'empty'` (tidak ada fetch) — halaman tampil "Belum ada data laporan" (empty state) dan tombol Download DOCX disabled. Kemampuan render penuh (Personalia, Struktur Program, Evaluasi Program/Fasilitator/Layanan dengan persentase) sudah ada di template/computed (`programRows`, `fasilitatorEval`, `layananRows`, `calcPct`, `barColor`) menunggu sumber data.

## 17. HALAMAN: PROFIL (`/admin/profile`)

- **Data**: `GET me` (profil pegawai + user; update `authStore.currentUser`), riwayat aktivitas `GET log-aktivitas` (fallback 3 item dummy saat gagal), statistik hardcoded (totalKegiatan 12, totalSertifikat 5, loginCount 48).
- **Aksi**:
  - **Edit Profil** (toggle): field Nama Lengkap*, Email*, Instansi → **Simpan** (`saveProfile`) hanya memperbarui `authStore.currentUser` + localStorage `user_data` (**tidak dikirim ke API**); validasi nama & email wajib; Swal sukses.
  - **Ubah Password** (modal): Password Lama*, Password Baru*, Konfirmasi* → validasi semua wajib, konfirmasi cocok, minimal 6 karakter → **hanya Swal sukses** (tidak ada panggilan API).
  - Riwayat Aktivitas (list) + pagination statis (Previous/1/2/3/Next — tombol tanpa logika halaman aktual).
  - Tombol kembali (`$router.back()`).
  - Card "Download Laporan" (tombol disabled + tombol lain tanpa handler yang teramati).

---

## 18. RINGKASAN TOMBOL EKSPOR / BAGI LINK / CETAK

| Lokasi | Tombol | Mekanisme | Output |
|---|---|---|---|
| Dashboard › modal detail | Export Excel | xlsx `peserta_export_{ts}.xlsx` | Data peserta kegiatan + URL tanda tangan |
| Dashboard › modal detail | Download Batch DOCX | template_peserta.docx + JSZip | `{kegiatan}-docx-batch.zip` |
| Kegiatan › kartu | **Share Link** | `navigator.share` → copy clipboard → `prompt` | URL `kegiatan/{kode}/{slug}` |
| Kegiatan › kartu | **Link Peserta** | idem | URL `daftar-peserta/{kode}/{slug}` |
| Kegiatan › modal detail | Salin Tabel (anggota) | HTML table → clipboard (`execCommand`) | Siap paste ke Word/Excel |
| Kegiatan › modal biodata | Print | window print A4 | Biodata peserta |
| Test Laporan | Export Excel / Cetak PDF | xlsx / window.print | Hasil test / Hasil ujian per peserta |
| Buat Laporan | Download DOCX | generateLaporanDocx | Laporan kegiatan .docx |
| Peserta Management | Export Excel | xlsx `{lokasi} - {kegiatan}_{ts}.xlsx` | Data peserta terfilter |
| Peserta Management | Download Daftar Hadir (Kelas) | template_daftar_hadir.docx | `Daftar Hadir - …docx` |
| Peserta Management | Print Biodata (Semua / Tanpa TTD) | window.print per halaman | Biodata massal |
| Peserta Management | Download DOCX per peserta | template_peserta.docx | `{Peran} - {Nama}.docx` |
| Penugasan | Export Excel | xlsx `penugasan_{ts}.xlsx` | Data penugasan terfilter |
| Paket Soal | Download Template | link `{API}/api/v1/test/template` | Template import soal (.xlsx/.xls/.csv) |

## 19. CATATAN PERILAKU / KETERBATASAN PENTING (untuk QA)

1. **Share Link / Link Peserta** memakai Web Share API bila tersedia (mobile), fallback clipboard, fallback `prompt()`; tidak ada modal salin khusus.
2. **Bulk status sertifikat** (Sertifikat & PesertaManagement) sengaja **berjeda 5 detik per baris** — 50 peserta ≈ 4+ menit; ada overlay progres.
3. **UnitKerjaManagement & AnggotaManagement tidak memanggil API** — CRUD hanya state lokal (hilang saat refresh).
4. **Profile**: simpan profil & ubah password tidak memanggil API (hanya state lokal + Swal); statistik hardcoded.
5. **LaporanKegiatan** (`/admin/laporan-kegiatan`) saat ini selalu tampil empty (loader stub).
6. Hak kelola peserta & sertifikat dibatasi per kegiatan (pembuat/penugasan) — tombol terkait disembunyikan atau diberi tooltip "Hanya pengguna yang terdaftar dalam penugasan kegiatan ini…".
7. Tab "User" di PegawaiManagement dikomentari di template (tabel user & modal user masih ada di kode).
8. Mode dev memakai fallback `database.json` otomatis saat API tidak terjangkau (hanya GET).
9. `updateAPI` punya fallback POST+`_method:'PUT'` — penting untuk upload file (FormData).
10. Perhitungan status kegiatan (berjalan/akan_datang/selesai) di Dashboard & Kegiatan selalu dihitung dari tanggal, bukan field `status` (field `status` hanya dipakai bila tanggal kosong); pilihan status form (draft/dibatalkan) tersedia terpisah.
11. Tanda tangan peserta disimpan sebagai file PNG (dari canvas base64 atau upload) di storage backend; URL dibangun via `buildStorageUrl`.
12. Semua ekspor Excel dilakukan **client-side** (library `xslx`), semua DOCX digenerate client-side dari template di `public/` (`template_peserta.docx`, `template_daftar_hadir.docx`) atau template per kegiatan (`storage/template_biodata`), kecuali sertifikat yang digenerate backend (`sertifikat/generate[-massal]`).
