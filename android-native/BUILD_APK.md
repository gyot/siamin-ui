# Panduan Build APK — SIMAIK Android (Native)

Dokumen ini berisi cara build APK aplikasi Android SIMAIK (`android-native/`) kapan saja tanpa bantuan tambahan.

## Prasyarat

- **JDK 17** (sudah terpasang di server ini)
- **Android SDK** di `/opt/android-sdk` (atau set `ANDROID_HOME` ke lokasi SDK lain)
- **Keystore release** (jangan di-commit ke git!):
  - `simaik-release.jks` (di folder `android-native/`)
  - `keystore.properties` (di folder `android-native/`, berisi `storeFile`, `storePassword`, `keyAlias`, `keyPassword`)
  - Kedua file sudah masuk `.gitignore` — jaga tetap rahasia
- **`google-services.json`** (Firebase FCM) di `app/` — untuk push notification

## Build APK Release (yang dipakai untuk distribusi)

```bash
cd /home/bpmp/website/siamin-ui/android-native
export ANDROID_HOME=/opt/android-sdk
./gradlew assembleRelease --no-daemon
```

Hasil: `app/build/outputs/apk/release/app-release.apk` (sudah ter-sign release, siap install).

Salin ke lokasi lain kalau perlu:
```bash
cp app/build/outputs/apk/release/app-release.apk /root/SIMAIK-native-vX.Y.Z.apk
```

## Sebelum Build: Naikkan Versi

Edit `app/build.gradle.kts` (bagian `defaultConfig`):
- `versionCode` → tambah 1 (mis. 46 → 47) — WAJIB naik untuk setiap APK baru
- `versionName` → sesuaikan (mis. "1.43.0")

## Build Debug (untuk uji coba cepat, tidak perlu keystore)

```bash
./gradlew assembleDebug --no-daemon
# hasil: app/build/outputs/apk/debug/app-debug.apk
```

## Install ke HP / Emulator

```bash
# via adb (HP tersambung USB / emulator berjalan):
adb install -r app/build/outputs/apk/release/app-release.apk
```
Atau kirim file APK-nya (Telegram/chat) lalu buka di HP.

## Konfigurasi Penting (jangan diubah sembarangan)

| Item | Nilai |
|---|---|
| applicationId | `com.bpmpntb.simaik` |
| minSdk | 24 (Android 7 — didukung core library desugaring `desugar_jdk_libs`, JANGAN dihapus karena `java.time` dipakai di banyak layar) |
| targetSdk | 35 |
| API backend | `https://siamin.gdoank.my.id/api/v1/` (lihat `api/ApiClient.kt`) |
| Push notification | FCM (`google-services.json`), deep-link ke detail kegiatan |

## Struktur Kode Singkat

- `app/src/main/java/com/bpmpntb/simaik/`
  - `MainActivity.kt` — navigasi (routes: landing, login, register, landing_detail, admin, dll)
  - `MainViewModel.kt` — state + pemanggilan API
  - `api/` — `ApiService.kt` (endpoint), `Models.kt` (data class), `ApiClient.kt` (Retrofit + token)
  - `ui/screens/` — tiap layar (LandingScreen, KegiatanListScreen, PesertaScreen, dll)
  - `ui/theme/` — warna & tema (brand: navy `#032445`/`#1e3a8a`, emas `#facc15`, biru `#1877F2`)
- Build config: `app/build.gradle.kts`

## Konvensi

- Commit dengan identitas: `Wahyu Ramdhani <wahyuramdhani@bpmpntb.id>`
- Secret (password, keystore, token) JANGAN PERNAH masuk chat / git
- Gaya UI meniru komponen web asli (`src/pages/*.vue` di repo `siamin-ui` sebagai referensi)

## Catatan Pengembangan Web (siamin-ui)

Untuk web (Vue3 + Vite) yang di-deploy di `siamin.gdoank.my.id`:
```bash
cd /home/bpmp/website/siamin-ui
npm run build     # hasil di dist/ — langsung live (nginx menyajikan dist)
```
- `index.html` sudah diset `Cache-Control: no-cache` (di nginx) — perubahan langsung terbaca
- Backend Laravel: `/home/bpmp/website/siamin1.0` (branch dev) — perubahan PHP langsung live tanpa build
