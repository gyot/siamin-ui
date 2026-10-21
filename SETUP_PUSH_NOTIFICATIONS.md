# Push Notifications — SIMAIK Android (Firebase FCM HTTP v1)

## Status: Kode Siap

Menggunakan **FCM HTTP v1 API** dengan **Service Account** (tanpa perlu enable legacy API).

## Cara Kerja

```
Admin tambah penugasan → Backend kirim FCM HTTP v1 → Android terima notifikasi
"Anda ditambahkan dalam penugasan pada kegiatan {nama} sebagai {peran}"
```

## File yang Sudah Dibuat

### Backend (`siamin1.0`)

| File | Fungsi |
|------|--------|
| `firebase-service-account.json` | Service account key (dari Firebase) |
| `app/Http/Controllers/Api/PushNotificationController.php` | Register token + kirim FCM HTTP v1 |
| `app/Models/PushToken.php` | Model push token |
| `database/migrations/2026_10_21_000001_create_push_tokens_table.php` | Tabel push_tokens |
| `config/services.php` | Config `fcm.service_account` |
| `routes/api.php` | Route `POST /push/register` + `POST /push/remove` |
| `app/Http/Controllers/Api/PenugasanPegawaiController.php` | Auto-kirim notifikasi saat penugasan dibuat |

### Frontend (`siamin-ui`)

| File | Fungsi |
|------|--------|
| `src/services/pushNotifications.js` | Init push, register token |
| `src/stores/auth.js` | Auto-register token setelah login |

## Konfigurasi

### Backend `.env`
```env
# Tidak perlu FCM_SERVER_KEY (pakai service account)
# File service account otomatis ditemukan di root project
# Jika ingin custom path:
# FIREBASE_SERVICE_ACCOUNT=/path/ke/firebase-service-account.json
```

### Android
- `google-services.json` harus ada di `android/app/`
- Download dari Firebase Console → Project Settings → Your Apps → Android

## Langkah Firebase (Manual)

### 1. Buat Firebase Project
1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. **Add Project** → nama: `simaik`

### 2. Tambah Android App
1. Klik ikon **Android**
2. **Package name**: `com.bpmpntb.simaik`
3. **Register app** → download `google-services.json`
4. Salin ke `siamin-ui/android/app/google-services.json`

### 3. Buat Service Account
1. Firebase Console → **Project Settings** → **Service Accounts**
2. Klik **Generate new private key**
3. Download file JSON
4. Salin ke `siamin1.0/firebase-service-account.json`

### 4. Build & Deploy
```bash
# Backend
php artisan config:cache

# Frontend
npm run build && npx cap sync android
# Buka Android Studio → Build APK
```

## API Endpoint

| Method | URL | Auth | Fungsi |
|--------|-----|------|--------|
| POST | `/api/v1/push/register` | Sanctum | Daftarkan device token |
| POST | `/api/v1/push/remove` | Sanctum | Hapus device token |

## Cara Kerja Teknis

### FCM HTTP v1 API Flow
1. Backend baca `firebase-service-account.json`
2. Buat JWT signed dengan private key dari service account
3. Tukar JWT dengan Google OAuth2 access token
4. Kirim POST ke `https://fcm.googleapis.com/v1/projects/{project}/messages:send`
5. Android terima notifikasi via FCM

### Kelebihan HTTP v1 API
- ✅ Tidak perlu enable legacy Cloud Messaging API
- ✅ Lebih aman (Service Account, bukan Server Key)
- ✅ Recommended oleh Google
- ✅ Tidak butuh dependency tambahan (pure PHP + cURL)

## Troubleshooting

### Notifikasi tidak muncul
1. Cek `google-services.json` ada di `android/app/`
2. Cek `firebase-service-account.json` ada di root `siamin1.0/`
3. Cek log Laravel: `storage/logs/laravel.log` → cari `[PushNotification]`
4. Pastikan permission notifikasi aktif di Android Settings

### Error "Service account file tidak ditemukan"
- Pastikan file `firebase-service-account.json` ada di root project backend
- Atau set `FIREBASE_SERVICE_ACCOUNT` di `.env`

### Error 401 Unauthorized
- Service account key mungkin expired atau salah
- Generate ulang dari Firebase Console

### Error 404 Not Found
- `project_id` di service account tidak cocok dengan Firebase project
- Pastikan download service account dari project yang benar

## Catatan

- Token disimpan di tabel `push_tokens`
- Menggunakan FCM **HTTP v1 API** (modern, bukan legacy)
- Auth pakai **Service Account** (bukan Server Key)
- Support Android via `@capacitor/push-notifications`
- `firebase-service-account.json` sudah di-`.gitignore` (tidak ter-commit)
