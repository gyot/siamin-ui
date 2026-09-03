# API Integration Documentation

## Overview
Aplikasi SIMAIK Vue UI telah diintegrasikan dengan API backend. Sistem menggunakan fallback ke data lokal (JSON) jika API tidak tersedia.

## Configuration

### API Base URL
File `.env` mengatur base URL:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Ubah nilai ini sesuai dengan URL API production Anda.

## Services

### API Service (`src/services/api.js`)
Service untuk melakukan HTTP requests ke API.

**Methods:**
- `fetchAPI(endpoint)` - GET request
- `postAPI(endpoint, payload)` - POST request
- `updateAPI(endpoint, id, payload)` - PUT request
- `deleteAPI(endpoint, id)` - DELETE request

**Usage:**
```javascript
import { fetchAPI, postAPI } from '@/services/api'

// Fetch data
const users = await fetchAPI('users')

// Post data
const newUser = await postAPI('users', { name: 'John', email: 'john@example.com' })

// Update data
const updated = await updateAPI('users', 1, { name: 'Jane' })

// Delete data
await deleteAPI('users', 1)
```

## Data Loading

### Database Module (`src/data/index.js`)
Module pusat untuk mengakses semua data aplikasi.

**Features:**
- Fallback ke data lokal JSON jika API gagal
- Caching otomatis
- Auto-sync dengan API saat app startup

**Usage:**
```javascript
import database from '@/data/index.js'

// Akses data
const users = database.users
const kegiatan = database.kegiatan
const peserta = database.peserta

// Reload data dari API
import { loadDataFromAPI } from '@/data/index.js'
const freshUsers = await loadDataFromAPI('users')
```

### Composable Hook (`src/composables/useData.js`)
Composable untuk fetch data dengan loading state.

**Usage:**
```javascript
import { useData } from '@/composables/useData.js'

export default {
  setup() {
    const { data, loading, error, refetch } = useData('users')
    
    return {
      users: data,
      isLoading: loading,
      errorMessage: error,
      reloadUsers: refetch
    }
  }
}
```

## API Endpoints

Berikut mapping endpoint API ke application:

| Table | Endpoint |
|-------|----------|
| users | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'users` |
| pegawai | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'pegawai` |
| kegiatan | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan` |
| peserta | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'peserta` |
| sertifikat | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'sertifikat` |
| akun_peserta | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'akun-peserta` |
| surat_tugas | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'surat-tugas` |
| surat_tugas_pegawai | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'surat-tugas-pegawai` |
| unit_kerja | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'unit-kerja` |
| sub_unit_kerja | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'sub-unit-kerja` |
| keanggotaan_tim | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'keanggotaan-tim` |
| log_aktivitas | `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'log-aktivitas` |

## Error Handling

API service otomatis menangani error dan fallback ke data lokal:

1. **Network Error** → Use local JSON data
2. **API Error (4xx, 5xx)** → Console warning + fallback data
3. **No internet** → Use cached/local data

## Fallback Data

Jika API tidak tersedia, aplikasi akan menggunakan data dari file JSON lokal:
- `src/data/tables/users.json`
- `src/data/tables/pegawai.json`
- `src/data/tables/kegiatan.json`
- dll...

Data ini dapat diupdate untuk testing tanpa API.

## Development vs Production

### Development (with local JSON)
```javascript
// .env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### Production (with remote API)
```javascript
// .env.production
VITE_API_BASE_URL=https://api.production.com/api/v1
```

## Data Sync

Untuk sync perubahan data ke API, gunakan:

```javascript
import { postAPI, updateAPI } from '@/services/api'

// Create new
const newPeserta = await postAPI('peserta', {
  nama_lengkap: 'John Doe',
  email: 'john@example.com',
  // ... other fields
})

// Update existing
const updated = await updateAPI('peserta', pesertaId, {
  nama_lengkap: 'Jane Doe'
})
```

## Troubleshooting

### API tidak terjangkau
- Check `.env` file untuk API_BASE_URL
- Pastikan backend API running di http://127.0.0.1:8000
- Check browser console untuk error messages

### Data tidak update
- Refresh page untuk reload cache
- Gunakan `loadDataFromAPI(tableName)` untuk force reload
- Check network tab di DevTools

### Fallback data tidak muncul
- Pastikan JSON files ada di `src/data/tables/`
- Check console untuk warning messages
- Verify JSON syntax valid

## Next Steps

1. **Authentication**: Implement JWT token handling di API service
2. **Pagination**: Handle paginated API responses
3. **Real-time**: Implement WebSocket untuk data real-time
4. **Offline Support**: Service Worker untuk offline capability
