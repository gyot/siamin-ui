# ⚡ Quick Start - SIMAIK Login Fix

## The Problem
❌ Halaman login tidak dapat diklik (tidak responsif)

## The Solution
✅ Diperbaiki dengan:
- Enhanced API service untuk support POST requests
- Fixed auth store dengan proper async handling  
- Complete AuthController di backend dengan Sanctum

---

## 90-Second Setup

```bash
# Terminal - Backend
cd C:\Users\MyPC One Pro L\Downloads\siamin-back-end
php artisan migrate
php artisan db:seed --class=AuthTestSeeder
php artisan serve --port=8000

# Frontend sudah running: http://localhost:5174
```

---

## Test Credentials

**Admin Login:**
- Email: `admin@kemkominfo.go.id`
- Password: `password123`
- URL: http://localhost:5174/login

**Peserta Login:**
- Username: `testpeserta`
- Password: `password123`
- URL: http://localhost:5174/login-peserta

---

## Instant Test

1. Open: http://localhost:5174/login
2. Email: admin@kemkominfo.go.id
3. Password: password123
4. Click Login
5. Should redirect to /admin/dashboard ✅

---

## API Endpoints

```
POST /import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin         → {token, user}
POST /import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-peserta       → {token, user}
POST /import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/logout (protected)  → {success}
```

---

## Files Modified

| File | Change | Type |
|------|--------|------|
| src/services/api.js | POST support | ✏️ |
| src/stores/auth.js | Async fix | ✏️ |
| src/pages/Login.vue | Form improvements | ✏️ |
| AuthController.php | New auth logic | ✨ |
| routes/api.php | Auth endpoints | ✏️ |
| AuthTestSeeder.php | Test data | ✨ |

---

## Expected Response

```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "Bearer eyJ0eXAi...",
  "user": {
    "id": 1,
    "name": "Admin Test User",
    "email": "admin@kemkominfo.go.id"
  }
}
```

---

## Quick Fix for Common Issues

| Problem | Solution |
|---------|----------|
| Cannot reach API | `php artisan serve --port=8000` on backend |
| Invalid credentials | Run seeder: `php artisan db:seed --class=AuthTestSeeder` |
| No token | Check browser console (F12) for errors |
| Page not found | Frontend already on http://localhost:5174 |

---

## Documentation

📖 Full guides available:
- **SETUP_GUIDE.md** - Complete setup with troubleshooting
- **TESTING_CHECKLIST.md** - 15-point QA checklist
- **README_LOGIN_FIX.md** - Executive summary

---

## Status
✅ READY FOR TESTING - All components integrated, no errors
