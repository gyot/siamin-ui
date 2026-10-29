# Rancangan Aplikasi Android SIMAIK — Versi Peserta

Status: DRAF — untuk dibahas lebih lanjut.
Terakhir diperbarui: 2026-10-29

## 1. Latar & Tujuan

SIMAIK saat ini berupa web app (Vue 3) yang sudah responsif. Versi Android
ditujukan agar peserta kegiatan BPMP NTB dapat mengakses layanan peserta
dengan nyaman dari ponsel: pendaftaran biodata, jadwal kegiatan, sertifikat,
evaluasi, dan tes/paket soal.

Sasaran utama versi peserta:

- Akses cepat tanpa harus mengetik URL (install dari Play Store / APK)
- Notifikasi push (jadwal kegiatan, sertifikat terbit, pengingat evaluasi/tes)
- Pengalaman ponsel yang lebih baik daripada web (sentuh, kamera, unduh file)
- Tetap satu codebase dengan web sejauh mungkin

## 2. Opsi Arsitektur

### Opsi A — Capacitor wrap SPA yang ada (REKOMENDASI)

Frontend sudah dikonfigurasi Capacitor Android. Cukup membatasi route yang
terbuka untuk konteks aplikasi peserta (`/peserta/*` + halaman publik), lalu
menambah plugin native yang dibutuhkan (push, camera, file download).

- Kelebihan: satu codebase, fitur web langsung terpakai, waktu rilis cepat,
  update fitur ikut web (hanya shell aplikasi yang perlu rilis ulang)
- Kekurangan: performa webview (cukup untuk aplikasi ini), tergantung
  koneksi untuk render awal

### Opsi B — Native Kotlin/Compose

- Kelebihan: performa maksimal, offline-first penuh, UX platform-native
- Kekurangan: codebase kedua, biaya pemeliharaan ganda, waktu lama

Keputusan: mulai dengan Opsi A; evaluasi native hanya jika kelak muncul
kebutuhan yang tidak bisa dipenuhi webview (mis. offline penuh untuk ujian).

## 3. Ruang Lingkup Versi Peserta (MVP)

### 3.1 Onboarding & Akun

- Login unified (username akun_peserta → Sanctum token), alur sama dengan web
- Registrasi akun peserta baru
- Lupa password (opsional fase 2 — butuh mekanisme reset di backend)
- Simpan sesi; opsi biometric/Face ID untuk buka aplikasi (fase 2)

### 3.2 Beranda

- Sapaan + status kegiatan yang sedang berjalan
- Kartu kegiatan yang diikuti (ambil dari relasi peserta → kegiatan)
- Pengingat: evaluasi belum diisi, tes belum dikerjakan, sertifikat baru terbit
- Banner kegiatan publik (seperti landing web, opsional)

### 3.3 Kegiatan Saya

- Daftar kegiatan (filter: berjalan / akan datang / selesai)
- Detail kegiatan: jadwal, lokasi/TPK, metode, flyer, materi/lampiran
- Formulir biodata (peserta/panitia/narasumber/pendamping) — reuse komponen web
- Daftar peserta per kegiatan (publik, sesuai kebijakan sensor kolom sensitif)

### 3.4 Sertifikat

- Daftar sertifikat milik sendiri (endpoint `sertifikat/peserta/{id}` sudah ada)
- Preview + unduh PDF
- Bagikan ke WhatsApp (share sheet native)

### 3.5 Evaluasi & Tes

- Evaluasi kegiatan: isi kuesioner evaluasi (endpoint evaluasi sudah ada)
- Tes/paket soal: kerjakan ujian di HP (timer, navigasi soal, submit)
- Hasil tes: skor + pembahasan (jika tersedia)

### 3.6 Notifikasi Push

- FCM via `@capacitor/push-notifications` → tabel `push_tokens` sudah ada
- Jenis notifikasi: jadwal kegiatan, sertifikat terbit, pengingat evaluasi,
  pengingat tes, pengumuman panitia
- WAJIB: rotate FCM server key lama yang bocor di git history siamin-ui
  sebelum produksi; migrasi ke FCM HTTP v1 (service account), key tidak
  lagi ditanam di client

### 3.7 Profil

- Data diri (biodata profil_peserta), ubah foto (kamera/galeri — plugin camera)
- Riwayat kegiatan
- Logout

## 4. Navigasi (Bottom Navigation)

1. **Beranda** — ringkasan + pengingat
2. **Kegiatan** — daftar kegiatan + detail
3. **Sertifikat** — sertifikat saya
4. **Notifikasi** — feed notifikasi
5. **Profil** — akun & pengaturan

## 5. Catatan Teknis

- API base sama: `https://siamin.gdoank.my.id/api/v1` (Sanctum bearer token)
- Pola performa wajib: semua list pakai pagination server-side (`per_page`),
  jangan fetch-all (pelajaran endpoint peserta 16MB)
- Kamera: `@capacitor/camera` untuk foto biodata; kompres sebelum upload
- Unduh file: `@capacitor/filesystem` / share sheet
- Splash & ikon: pakai aset `android-icon-pack/` yang sudah disiapkan
  (mipmap + adaptive icon foreground/background)
- Target SDK mengikuti kebijakan Play Store saat build (min SDK 24+)

## 6. Roadmap

- **Fase 0 — Shell**: setup Capacitor Android, ikon/splash, batasi route peserta,
  login + sesi token, rilis APK internal
- **Fase 1 — MVP**: beranda, kegiatan saya, detail kegiatan, biodata, sertifikat
- **Fase 2 — Interaksi**: evaluasi, tes/paket soal, notifikasi push
- **Fase 3 — Poles**: biometric, offline cache ringan, share sheet, analytics

## 7. Keputusan yang Perlu Diambil

1. Play Store resmi (butuh akun developer Google, organisasi) atau
   distribusi APK/internal testing dulu?
2. Fase 1 menyertakan tes/paket soal atau cukup kegiatan + sertifikat?
3. Apakah perlu mode offline untuk ujian (peserta di lokasi sinyal lemah)?
4. Mau memakai Play Protect / signature keystore siapa (milik BPMP)?
