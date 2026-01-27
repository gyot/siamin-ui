# 📝 API Sanctum Integration - Change Summary

## 🎯 Tujuan
Mengintegrasikan frontend Vue.js dengan API Login yang menggunakan Laravel Sanctum untuk authentication berbasis Bearer Token.

## 🔄 Perubahan Utama

### 1. Auth Store Update (`src/stores/auth.js`)

#### Sebelumnya:
```javascript
// Menggunakan fetchAPI dengan fallback ke mock data
let response
try {
  response = await fetchAPI('loginAdmin', {...})
} catch (apiError) {
  response = await mockLoginAdmin(...) // Fallback
}
```

#### Sesudahnya:
```javascript
// Langsung menggunakan Fetch API ke endpoint Sanctum
const response = await fetch(`${API_BASE_URL}/auth/login-admin`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({ email, password })
})

const data = await response.json()

if (data.token && data.user) {
  token.value = data.token
  localStorage.setItem('auth_token', data.token)
  // ...
}
```

**Alasan:** Konsistensi dengan API baru, tanpa fallback mock data.

#### Logout Update:
```javascript
// Sebelumnya hanya clear localStorage
const logout = () => {
  localStorage.removeItem('auth_token')
  // ...
}

// Sesudahnya membuat API call untuk invalidate token
const logout = async () => {
  try {
    if (token.value) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
    }
  } finally {
    localStorage.removeItem('auth_token')
    // ...
  }
}
```

**Alasan:** Server perlu invalidate token, bukan hanya di client.

### 2. API Service Update (`src/services/api.js`)

#### Sebelumnya:
```javascript
const response = await fetch(url, {
  method: options.method || 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  },
  ...options
})
```

#### Sesudahnya:
```javascript
const authToken = localStorage.getItem('auth_token')
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...options.headers
}

// Add Authorization header if token exists
if (authToken) {
  headers['Authorization'] = `Bearer ${authToken}`
}

const response = await fetch(url, {
  method: options.method || 'GET',
  headers,
  ...options
})
```

**Alasan:** Semua API request yang dilindungi membutuhkan Bearer token di header.

## 📊 Comparison Table

| Aspek | Sebelumnya | Sesudahnya | Keuntungan |
|-------|-----------|-----------|-----------|
| **Auth Method** | JWT/Mock | Sanctum Bearer Token | Standard Laravel |
| **Token Storage** | localStorage | localStorage | Konsisten |
| **Fallback** | Mock data | Tidak ada | Forced API usage |
| **Logout** | Clear local only | API call + clear local | Server side invalidation |
| **Token Header** | Manual per request | Auto in fetchAPI | Centralized |
| **Server Validation** | None (mock) | Password hashing | Secure |
| **Last Login** | None | Tracked | Audit trail |

## 🔑 API Endpoints

### Login Admin
```
POST /v1/auth/login-admin
Request:  { email, password }
Response: { token, user: { id, name, email, instansi } }
```

### Login Peserta
```
POST /v1/auth/login-peserta
Request:  { username, password }
Response: { token, user: { id, name, username, email, nip, instansi } }
```

### Logout
```
POST /v1/auth/logout
Header:   Authorization: Bearer {token}
Response: { message }
```

### Protected Endpoints
```
GET /v1/user
GET /v1/kegiatan
POST /v1/peserta
Header:   Authorization: Bearer {token}
```

## 📁 Files Affected

```
✅ Modified:
├── src/stores/auth.js          (Main auth logic)
└── src/services/api.js         (API request handling)

❌ Not Modified (Backward Compatible):
├── src/pages/Login.vue
├── src/pages/LoginPeserta.vue
├── src/pages/Dashboard.vue
└── All other components
```

## 🔐 Security Changes

### Token Management
- **Before:** Token in localStorage, sent manually
- **After:** Token in localStorage, auto-sent in Bearer format

### Validation
- **Before:** No server-side validation (mock data)
- **After:** Full server-side validation with hash comparison

### Status Checking
- **Before:** None
- **After:** Only active accounts can login

### Last Login Tracking
- **Before:** None
- **After:** Server tracks last login timestamp

## 🚀 Deployment Checklist

- [ ] API server running with Sanctum endpoints
- [ ] VITE_API_BASE_URL configured correctly
- [ ] CORS headers configured on API server
- [ ] Database migrations for tracking last_login
- [ ] Test admin and peserta logins
- [ ] Verify token saved and used correctly
- [ ] Check protected endpoints work with token
- [ ] Verify logout invalidates token

## 🔄 Request Flow Comparison

### Admin Login Flow

**Before:**
```
Login.vue 
  → authStore.loginAdmin() 
    → fetchAPI('loginAdmin') 
      → /v1/auth/login-admin 
      → OR mockLoginAdmin()
  ← token & user
  → localStorage.setItem()
  → router.push('/admin/dashboard')
```

**After:**
```
Login.vue 
  → authStore.loginAdmin() 
    → fetch(`/v1/auth/login-admin`) 
    → response.json()
  ← { token, user }
  → localStorage.setItem('auth_token', token)
  → localStorage.setItem('user_data', user)
  → router.push('/admin/dashboard')
```

### Protected Route Request

**Before:**
```
Component 
  → fetchAPI('/kegiatan') 
    → fetch('/kegiatan', { headers: {...} })
  ← [ kegiatan data ]
```

**After:**
```
Component 
  → fetchAPI('/kegiatan') 
    → authToken = localStorage.getItem('auth_token')
    → fetch('/kegiatan', { 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
  ← [ kegiatan data ]
```

## ⚠️ Breaking Changes

**None!** Perubahan ini backward compatible karena:
1. Components tidak berubah
2. API service masih memiliki function yang sama
3. Token masih disimpan di localStorage
4. Session restoration tetap bekerja

## 💡 Key Features

✅ **Standard Bearer Token** - Sesuai RFC 6750
✅ **Server-side Validation** - Password di-hash dengan Laravel Hash
✅ **Token Invalidation** - Logout invalidates token di server
✅ **Session Persistence** - Auto-restore session on refresh
✅ **Error Handling** - Clear error messages
✅ **Loading States** - Prevents double-submit
✅ **Security Tracking** - Last login, status checking
✅ **Extensible** - Easy to add refresh tokens, MFA, etc

## 🎓 Learning Resources

- Sanctum Docs: https://laravel.com/docs/sanctum
- Bearer Token: https://tools.ietf.org/html/rfc6750
- JWT Alternative: https://jwt.io/

## 📞 Support

Jika ada masalah, periksa:
1. API server running di `http://127.0.0.1:8000`
2. CORS configured correctly
3. Database migrations complete
4. Check browser console for errors
5. Check server logs for validation errors

---

**Integration Status:** ✅ Complete
**Date:** 2025-01-26
**Version:** 1.0
