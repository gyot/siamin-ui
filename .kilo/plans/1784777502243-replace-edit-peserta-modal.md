# Plan: Replace Edit Peserta Modal with Formulir Biodata Layout

## Goal
Replace the current "Modal Tambah/Edit Peserta" (lines 466-756 in `PesertaManagement.vue`) with a modal that matches the visual layout and fields of `FormulirPeserta.vue`, while retaining admin-specific fields.

## Source of Truth
`src/pages/FormulirPeserta.vue` — the public biodata form. Key sections and styles:
- **Data Pribadi**: Nama Lengkap, NIP, Email, No. HP, Jenis Kelamin (`laki-laki`/`perempuan` lowercase), Tempat Lahir, Tanggal Lahir, NPWP/NIK, **Pangkat/Golongan (structured `<select>` with optgroups)**, Jabatan, TPK select
- **Data Instansi**: Nama Instansi, NPSN, **Kabupaten/Kota (`<select>` from predefined `kabKota` list)**
- **Data Pembayaran** (conditional on `metode_pembayaran`): Nomor Rekening, Nama Bank, Provider Seluler
- **Tandatangan Digital**: Canvas signature pad
- **Style**: `slate-*` Tailwind colors, `px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`

## Current Edit Modal Issues
`src/pages/PesertaManagement.vue:466-756`:
- Uses `gray-*` colors instead of `slate-*`
- Pangkat is plain `<input>`, not structured `<select>` with optgroups
- Golongan is separate `<input>` field
- Kabupaten/Kota is plain `<input>`, not `<select>` with predefined list
- Data Pembayaran always shown (not conditional)
- No signature canvas
- Missing TPK in Data Pribadi section (it's in Data Instansi)
- Has extra admin fields: Kegiatan select, Peran select, No. Penugasan, Tanggal Penugasan

## Decisions

1. **Match formulir layout exactly** for sections: Data Pribadi, Data Instansi, Data Pembayaran
2. **Keep admin-only fields** at the bottom as a new "Data Administrasi" section: Kegiatan select (readonly when editing), Peran, No. Penugasan, Tanggal Penugasan
3. **Pangkat**: Replace the two inputs (pangkat + gol) with the single structured `<select>` from FormulirPeserta (value contains combined "Pangkat / Golongan" string)
4. **Kabupaten/Kota**: Replace `<input>` with `<select>` using the same `kabKota` predefined list from FormulirPeserta
5. **Data Pembayaran**: Show conditionally based on `kegiatan.metode_pembayaran` (look up from `kegiatan` list using selected `id_kegiatan`)
6. **Tandatangan**: Include the signature canvas in the modal (admin can view/re-draw). Pre-populate if peserta already has `tanda_tangan`
7. **Data Administrasi section** (admin-only): Keep Peran, No. Penugasan, Tanggal Penugasan at the end
8. **Remove** separate Golongan `<input>` — merged into Pangkat select
9. **Remove** Provinsi, Telepon Instansi, Email Instansi, Alamat Instansi `<textarea>` — commented out in formulir, so omit from modal too

## File to Edit
`src/pages/PesertaManagement.vue`

## Tasks

### 1. Add `kabKota` ref in script
Add the predefined kabupaten/kota list (same as `FormulirPeserta.vue:495-507`) inside `setup()`:
```js
const kabKota = ref([
  'Kabupaten Lombok Barat', 'Kabupaten Lombok Tengah', 'Kabupaten Lombok Timur',
  'Kabupaten Lombok Utara', 'Kabupaten Sumbawa', 'Kabupaten Sumbawa Barat',
  'Kabupaten Dompu', 'Kabupaten Bima', 'Kota Mataram', 'Kota Bima', 'Lainnya'
])
```

### 2. Add computed `metodePembayaran` for conditional payment section
Look up `metode_pembayaran` from the currently selected kegiatan:
```js
const metodePembayaran = computed(() => {
  const idKegiatan = formPeserta.value.id_kegiatan
  if (!idKegiatan) return ''
  const keg = getKegiatanById(idKegiatan)
  return keg?.metode_pembayaran || ''
})
```

### 3. Add signature canvas refs and methods
Port the signature canvas logic from FormulirPeserta (refs: `signatureCanvas`, `signatureData`; methods: `startDrawing`, `draw`, `stopDrawing`, `clearSignature`). Initialize canvas in `openEditModal`. Add `base64ToFile` helper.

### 4. Update `formPeserta` default to include `tandatangan` field
Add `tandatangan: null` to `resetFormPeserta()`.

### 5. Replace modal template (lines 466-756)
Replace the entire `<!-- Modal Tambah/Edit Peserta -->` block with new markup matching FormulirPeserta sections:

**Outer modal wrapper**: Keep `fixed inset-0 bg-black bg-opacity-50` backdrop, `max-w-4xl max-h-[90vh] overflow-y-auto` container.

**Header**: Keep sticky gradient header with title.

**Body** — `p-6 sm:p-8` with `space-y-6`:
- **Section: Data Pribadi** — `grid grid-cols-1 sm:grid-cols-2 gap-4`:
  - Nama Lengkap*, NIP, Email*, No. HP, Jenis Kelamin (select with lowercase values), Tempat Lahir, Tanggal Lahir, NPWP/NIK, Pangkat/Golongan (structured select with optgroups), Jabatan, TPK (select, conditional on `tpkItemsForForm.length > 0`)
- **Section: Data Instansi** — `grid grid-cols-1 sm:grid-cols-2 gap-4`:
  - Nama Instansi*, NPSN, Kegiatan* (select, disabled when editing), TPK (only if no TPK in Data Pribadi), Kabupaten/Kota (select from `kabKota`)
- **Section: Data Pembayaran** (conditional `v-if`):
  - Nomor Rekening, Nama Bank, Provider Seluler (select)
- **Section: Tandatangan Digital**:
  - Signature canvas with "Hapus Tandatangan" button
- **Section: Data Administrasi** (admin-only):
  - No. Penugasan, Tanggal Penugasan, Peran (select)
- **Error messages**: Keep existing `formErrors` display
- **Buttons**: Batal + Simpan Perubahan

### 6. Update `savePeserta` to handle signature
If `signatureData` is set, convert to File and append to FormData before sending `updateAPI` (use `_method: PUT` with FormData pattern).

### 7. Update `openEditModal` to populate signature
When editing, load existing `tanda_tangan` image onto canvas if available.

### 8. Update `validateFormPeserta` 
Align with formulir validation: nama_lengkap, email, nama_instansi required. Remove kegiatan validation when editing (already set).

## Validation
1. Open `http://localhost:5174/admin/kegiatan/61/peserta`
2. Click "Edit" on a peserta row
3. Verify modal matches FormulirPeserta layout: same sections, same field types, same colors
4. Verify Pangkat is a structured select with optgroups
5. Verify Kabupaten/Kota is a dropdown
6. Verify Data Pembayaran conditionally shows/hides based on kegiatan metode
7. Verify signature canvas works (draw, clear)
8. Save and verify data persists correctly via API
