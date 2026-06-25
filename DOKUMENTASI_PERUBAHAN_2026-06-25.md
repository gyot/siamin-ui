# Dokumentasi Perubahan - 25 Juni 2026

## Ringkasan

Pada halaman Manajemen Kegiatan, data tempat pelaksanaan kegiatan (TPK) dikembangkan dari satu lokasi menjadi beberapa lokasi. Setiap lokasi dapat memiliki Kabupaten/Kota masing-masing.

Tampilan lokasi pada daftar kegiatan juga diperbarui agar seluruh TPK ditampilkan dengan format:

```text
Nama Lokasi 1 (Kabupaten1), Nama Lokasi 2 (Kabupaten2)
```

## Berkas Utama

- `src/pages/Kegiatan.vue`

## Perubahan Fitur

### 1. Dukungan Beberapa TPK

Form kegiatan sekarang menyediakan bagian **Tempat Pelaksanaan Kegiatan (TPK)**. Pengguna dapat:

- Mengisi nama lokasi.
- Memilih Kabupaten/Kota.
- Menambahkan lebih dari satu TPK.
- Melihat daftar TPK yang telah ditambahkan.
- Menghapus TPK dari daftar sebelum data disimpan.

### 2. Validasi Form

Kegiatan wajib memiliki minimal satu TPK. Jika belum ada TPK yang ditambahkan, form menampilkan pesan:

```text
Minimal satu tempat pelaksanaan kegiatan harus ditambahkan
```

Nama lokasi pada setiap TPK juga wajib diisi sebelum dapat ditambahkan.

### 3. Tampilan Detail Kegiatan

Bagian detail kegiatan menampilkan seluruh TPK dalam tabel yang berisi:

- Nomor urut.
- Lokasi.
- Kabupaten/Kota.

### 4. Tampilan Daftar Kegiatan

Kolom **Lokasi** pada daftar kegiatan sekarang menampilkan seluruh pasangan lokasi dan Kabupaten/Kota.

Contoh:

```text
Aula Kantor A (Kota Mataram), Hotel B (Kabupaten Lombok Barat)
```

Jika Kabupaten/Kota tidak tersedia, hanya nama lokasinya yang ditampilkan. Jika data lokasi kosong, aplikasi menampilkan tanda `-`.

## Pengolahan Data

Data TPK dibaca dari beberapa kemungkinan struktur respons API:

- `daftar_tpk`
- `daftarTpk`
- `data.daftar_tpk`
- `data.daftarTpk`

Respons berbentuk array, objek dengan properti `data`, dan string JSON didukung.

Data kegiatan lama yang masih menggunakan properti tunggal `lokasi` dan `kabupaten_kota` tetap dapat ditampilkan sebagai fallback.

## Format Payload API

Saat kegiatan disimpan, data TPK dikirim melalui properti:

```json
{
  "daftar_tpk": [
    {
      "lokasi": "Aula Kantor A",
      "kabupaten_kota": "Kota Mataram"
    },
    {
      "lokasi": "Hotel B",
      "kabupaten_kota": "Kabupaten Lombok Barat"
    }
  ]
}
```

Untuk pengiriman `multipart/form-data`, nama field yang digunakan adalah:

```text
daftar_tpk[0][lokasi]
daftar_tpk[0][kabupaten_kota]
daftar_tpk[1][lokasi]
daftar_tpk[1][kabupaten_kota]
```

## Fungsi yang Ditambahkan

- `normalizeTpkItem`: Menyeragamkan struktur setiap data TPK.
- `getKegiatanTpkRows`: Mengambil daftar TPK dari berbagai bentuk respons API.
- `loadKegiatanTpkItems`: Memuat TPK kegiatan ke dalam form.
- `getKegiatanLocationLabel`: Membentuk label lokasi untuk daftar kegiatan.
- `addTpkItem`: Menambahkan TPK ke form.
- `removeTpkItem`: Menghapus TPK dari form.
- `buildTpkPayloadItems`: Menyiapkan daftar TPK untuk payload API.

## Pengujian

Perubahan telah diverifikasi dengan perintah:

```bash
npm run build
```

Hasil pengujian:

- Build Vite berhasil.
- Tidak ditemukan error kompilasi.
- Terdapat peringatan ukuran chunk dan kombinasi dynamic/static import yang sudah ada, tetapi tidak menggagalkan build.

