# Setup Android (Capacitor)

## Status: Sudah Terinstall

Capacitor sudah ter-setup di project ini. Folder `android/` sudah dibuat dan web assets sudah di-sync.

## Struktur

```
siamin-ui/
├── android/                  ← Project Android (generated Capacitor)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/  ← Web assets (dist/ di-copy ke sini)
│   │   │   ├── java/           ← Code native Android
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── build.gradle
│   └── variables.gradle
├── capacitor.config.json     ← Konfigurasi Capacitor
├── src/                      ← Kode Vue.js (sama untuk web & Android)
└── dist/                     ← Build output web
```

## Perintah Penting

### Build & Sync (jalankan setiap kali kode berubah)
```bash
npm run build && npx cap sync android
```

### Buka di Android Studio
```bash
npx cap open android
```

### Run dari CLI (butuh Android Studio & emulator/device)
```bash
npx cap run android
```

### Hanya sync (tanpa build ulang)
```bash
npx cap copy android
```

## Build APK

### Debug APK (untuk testing)
1. Buka Android Studio: `npx cap open android`
2. Menu **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. APK ada di: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK/AAB (untuk Play Store)
1. Menu **Build** → **Generate Signed Bundle / APK**
2. Pilih **Android App Bundle** untuk Play Store
3. Ikuti wizard untuk membuat/sign keystore

## Konfigurasi

### capacitor.config.json
```json
{
  "appId": "com.bpmpntb.simaik",
  "appName": "SIMAIK",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true,
    "backgroundColor": "#F0F2F5"
  }
}
```

### .env untuk Android
Saat build Android, `localhost` tidak bisa diakses. Pastikan `.env` menggunakan URL server publik:
```env
VITE_API_BASE_URL=https://api-siamin.bpmpntb.id
```

## Plugin yang Sudah Terinstall

| Plugin | Fungsi |
|--------|--------|
| `@capacitor/core` | Core Capacitor |
| `@capacitor/android` | Platform Android |

## Plugin Tambahan yang Direkomendasikan

```bash
# Download file ke device
npm install @capacitor/filesystem

# Kamera (scan QR code)
npm install @capacitor/camera

# Status bar kustomisasi
npm install @capacitor/status-bar

# Splash screen
npm install @capacitor/splash-screen

# Cek koneksi internet
npm install @capacitor/network

# Push notifications
npm install @capacitor/push-notifications
```

Setelah install plugin baru:
```bash
npx cap sync android
```

## Testing

### Emulator
1. Android Studio → Tools → Device Manager
2. Buat Virtual Device (AVD)
3. Run app ke emulator

### Device Fisik
1. Aktifkan **USB Debugging** di HP (Settings → Developer Options)
2. Colok USB ke komputer
3. Android Studio akan mendeteksi device
4. Run app ke device

### Live Reload (Development)
Untuk auto-reload saat coding:
```bash
# Edit capacitor.config.json tambahkan:
# "server": {
#   "url": "http://192.168.x.x:5174",
#   "cleartext": true
# }

npm run dev
npx cap sync android
npx cap run android
```

## Troubleshooting

### App blank/white screen
- Pastikan `npm run build` berhasil sebelum `npx cap sync`
- Cek console di Chrome DevTools (remote debugging)

### API tidak bisa diakses
- Pastikan `VITE_API_BASE_URL` di `.env` menggunakan URL publik
- Backend harus mengizinkan CORS dari origin app

### Build gagal
- Pastikan Android Studio terinstall
- Pastikan JDK 17+ terinstall
- Cek `android/variables.gradle` untuk versi SDK

## Perintah Ringkas

```bash
# Full workflow: build web → sync → buka Android Studio
npm run build && npx cap sync android && npx cap open android

# Quick sync (tanpa build ulang web)
npx cap copy android

# Run langsung ke device/emulator
npm run build && npx cap run android
```
