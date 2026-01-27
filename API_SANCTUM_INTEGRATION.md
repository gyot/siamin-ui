# API Sanctum Integration Guide

## 📋 Ringkasan Integrasi
Frontend Vue.js ini sekarang terintegrasi dengan API Login yang menggunakan **Laravel Sanctum** untuk token-based authentication.

## 🔌 Endpoint API yang Digunakan

### 1. Login Admin
**POST** `/v1/auth/login-admin`

Request:
```json
{
  "email": "admin@kemkominfo.go.id",
  "password": "password123"
}
```

Response Success (200):
```json
{
  "token": "1|abc123token...",
  "user": {
    "id": 1,
    "name": "Admin Name",
    "email": "admin@kemkominfo.go.id",
    "instansi": "Kementerian Komunikasi dan Informatika"
  }
}
```

### 2. Login Peserta
**POST** `/v1/auth/login-peserta`

Request:
```json
{
  "username": "peserta123",
  "password": "password123"
}
```

Response Success (200):
```json
{
  "token": "2|xyz789token...",
  "user": {
    "id": 5,
    "name": "Peserta Name",
    "username": "peserta123",
    "email": "peserta@email.com",
    "nip": "12345678",
    "instansi": "Kemkominfo"
  }
}
```

### 3. Logout
**POST** `/v1/auth/logout`

Header Required:
```
Authorization: Bearer {token}
```

Response Success (200):
```json
{
  "message": "Logged out successfully"
}
```

### 4. Get Current User (Future Use)
**GET** `/v1/user`

Header Required:
```
Authorization: Bearer {token}
```

Response Success (200):
```json
{
  "id": 1,
  "name": "Admin Name",
  "email": "admin@kemkominfo.go.id",
  "role": "admin"
}
```

## 📁 File-file yang Diubah

### 1. `src/stores/auth.js`
**Perubahan:**
- Menggunakan direct API calls ke Sanctum endpoints
- Validasi token dalam response dan menyimpannya di localStorage
- Token otomatis dikirim dalam header `Authorization: Bearer {token}` pada setiap request
- Logout sekarang membuat API call untuk invalidate token di server

**Fitur:**
- ✅ Proper validation untuk kedua jenis login
- ✅ Password verification di server menggunakan Laravel's Hash
- ✅ Sanctum token authentication
- ✅ Status checking (hanya active accounts yang bisa login)
- ✅ Last login tracking di server
- ✅ Error handling dengan HTTP status codes yang sesuai
- ✅ Clean JSON responses

### 2. `src/services/api.js`
**Perubahan:**
- Menambahkan logic untuk menyertakan Authorization header dengan Bearer token
- Token diambil dari localStorage secara otomatis
- Header ditambahkan ke semua API requests

## 🔑 Token Management

### Penyimpanan Token
Token disimpan di 3 tempat:
```javascript
localStorage.setItem('auth_token', data.token)          // Token untuk requests
localStorage.setItem('user_data', JSON.stringify(...)) // User info
localStorage.setItem('user_type', 'admin')             // Tipe user
```

### Menggunakan Token
Token secara otomatis disertakan dalam header:
```javascript
'Authorization': `Bearer ${token}`
```

### Session Recovery
Saat aplikasi di-refresh, session otomatis dikembalikan dari localStorage:
```javascript
restoreAuth() // Dipanggil di App.vue onMounted
```

## 🔐 Security Features

1. **Bearer Token** - Token dikirim sebagai Bearer token di header Authorization
2. **HttpOnly Consideration** - Untuk production, pertimbangkan menggunakan HttpOnly cookies
3. **Token Validation** - Server validate token pada setiap protected endpoint
4. **Status Checking** - Server hanya login jika status akun active
5. **Last Login Tracking** - Server track last login time

## 📝 Contoh Flow Login Admin

```
1. User masuk email dan password di Login.vue
2. handleLogin() dipanggil
3. authStore.loginAdmin(email, password) dijalankan
4. API call ke POST /v1/auth/login-admin
5. Server return token + user data
6. Token & user data disimpan di localStorage
7. isLoading flag di-reset
8. Component cek isAuthenticated dan redirect ke /admin/dashboard
```

## 📝 Contoh Flow Login Peserta

```
1. User masuk username dan password di LoginPeserta.vue
2. handleLogin() dipanggil
3. authStore.loginPeserta(username, password) dijalankan
4. API call ke POST /v1/auth/login-peserta
5. Server return token + user data
6. Token & user data disimpan di localStorage
7. isLoading flag di-reset
8. Component cek isAuthenticated dan redirect ke /peserta/dashboard
```

## 🧪 Testing dengan Mock Data (Fallback)

Jika API tidak tersedia, sistem sebelumnya punya fallback ke mock data.
Sekarang sistem langsung menggunakan API tanpa fallback untuk consistency.

Jika ingin menambahkan fallback kembali:
```javascript
// Di auth.js loginAdmin()
try {
  const response = await fetch(...)
  // ... handle response
} catch (apiError) {
  // Fallback ke mock data
  response = await mockLoginAdmin(email, password)
  // ... handle mock response
}
```

## 🚀 Environment Configuration

Pastikan `.env` atau `vite.config.js` memiliki:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Atau bisa dikonfigurasi per environment:
```
VITE_API_BASE_URL_DEV=http://127.0.0.1:8000/api/v1
VITE_API_BASE_URL_PROD=https://api.production.com/api/v1
```

## 🐛 Error Handling

### Login Errors
```javascript
// Email/password salah
{
  "message": "Email atau password tidak valid"
}

// Username/password salah (Peserta)
{
  "message": "Username atau password tidak valid"
}

// Akun tidak aktif
{
  "message": "Akun Anda tidak aktif"
}
```

### API Errors
Semua error dari API ditampilkan di `authStore.error` dan di-display di form sebagai error message.

## 📱 Components yang Menggunakan Auth

1. **Login.vue** - Form login admin
2. **LoginPeserta.vue** - Form login peserta
3. **Logout** - Di Header.vue atau Sidebar.vue
4. **Protected Routes** - router.js menggunakan isAuthenticated

## 🔄 Workflow Logout

```
1. User klik logout button
2. logout() dipanggil di auth store
3. API call ke POST /v1/auth/logout dengan token
4. Token di-invalidate di server
5. localStorage dihapus
6. Component redirect ke landing page
```

## ✅ Checklist Implementasi

- ✅ Auth store menggunakan Sanctum API endpoints
- ✅ Token management dengan localStorage
- ✅ API service menambahkan Bearer token ke header
- ✅ Login admin dan peserta bekerja
- ✅ Logout membuat API call untuk invalidate token
- ✅ Session restoration dari localStorage
- ✅ Error handling dan display
- ✅ Loading states management
- ✅ Protected routes dengan isAuthenticated

## 📌 Next Steps (Optional Enhancements)

1. **Token Refresh** - Implementasi refresh token untuk expired tokens
2. **HttpOnly Cookies** - Pindah dari localStorage ke HttpOnly cookies
3. **Remember Me** - Implementasi persistent session dengan remember me feature
4. **Logout Propagation** - Logout di tab lain jika tab lain logout
5. **Rate Limiting** - Implementasi rate limiting di login endpoint
6. **MFA** - Implementasi multi-factor authentication
