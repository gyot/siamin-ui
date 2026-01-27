# SIAMIN Admin Dashboard - Complete Setup Guide

## Problem Fixed
**Halaman login tidak dapat diklik (Login page not responding)**

### Root Cause
- Frontend `fetchAPI()` function only supported GET requests, but login requires POST
- Auth store methods had improper async/await handling
- Missing error propagation from API to UI

### Solution
- Enhanced API service to support flexible HTTP methods (POST, PUT, DELETE)
- Fixed auth store login methods to properly handle async responses
- Implemented proper error handling and display

---

## Complete Setup Instructions

### Step 1: Backend Setup (Laravel)

#### 1.1 Navigate to backend directory
```bash
cd C:\Users\MyPC One Pro L\Downloads\siamin-back-end
```

#### 1.2 Run database migrations
```bash
php artisan migrate
```

#### 1.3 Run auth test seeder to create test credentials
```bash
php artisan db:seed --class=AuthTestSeeder
```

**This creates:**
- Admin user: `admin@kemkominfo.go.id` / `password123`
- Peserta user: `testpeserta` / `password123`

#### 1.4 Start Laravel server
```bash
php artisan serve --port=8000
```

Expected output:
```
Starting Laravel development server: http://127.0.0.1:8000
```

### Step 2: Frontend Status

The Vue development server is already running on **http://localhost:5174**

#### Verify server is running
Open browser and check: http://localhost:5174

You should see the SIAMIN landing page with login options.

---

## Testing the Login Flow

### Admin Login Test

1. Navigate to: http://localhost:5174/login
2. Click "Login Administrator"
3. Enter credentials:
   - **Email:** admin@kemkominfo.go.id
   - **Password:** password123
4. Click **Login** button
5. Expected: Should redirect to `/admin/dashboard` with user profile displayed

### Peserta Login Test

1. Navigate to: http://localhost:5174/login-peserta
2. Enter credentials:
   - **Username:** testpeserta
   - **Password:** password123
3. Click **Login** button
4. Expected: Should redirect to `/peserta/dashboard`

---

## Architecture Overview

### Frontend Flow
```
Login Form (Vue Component)
         ↓
  Auth Store (Pinia)
         ↓
  API Service (Fetch API)
         ↓
  POST /api/v1/auth/login-admin or login-peserta
         ↓
  Response: {token, user}
         ↓
  Store token in localStorage
         ↓
  Redirect to Dashboard
```

### Backend Flow
```
AuthController
    ↓
User/AkunPeserta Model
    ↓
Password Hashing (Hash::check)
    ↓
Sanctum Token Generation
    ↓
Return Response with Token
```

---

## API Endpoints Reference

### Authentication Endpoints
All endpoints return JSON response:

```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "Bearer token_string_here",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

#### Admin Login
- **URL:** `POST /api/v1/auth/login-admin`
- **Parameters:** 
  - `email` (string, required)
  - `password` (string, required)
- **Returns:** Token + Admin user data

#### Peserta Login
- **URL:** `POST /api/v1/auth/login-peserta`
- **Parameters:**
  - `username` (string, required)
  - `password` (string, required)
- **Returns:** Token + Peserta user data

#### Logout
- **URL:** `POST /api/v1/auth/logout`
- **Headers:** `Authorization: Bearer {token}`
- **Returns:** Success message

---

## File Structure

### Frontend Files Created/Modified

```
src/
├── services/
│   └── api.js ✏️ MODIFIED
│       └── Enhanced fetchAPI() to support POST, PUT, DELETE
│
├── stores/
│   └── auth.js ✏️ MODIFIED
│       └── Fixed loginAdmin() and loginPeserta() methods
│
└── pages/
    ├── Login.vue ✏️ MODIFIED
    │   └── Improved form handling and error display
    │
    └── LoginPeserta.vue ✏️ MODIFIED
        └── Same improvements as Login.vue
```

### Backend Files Created/Modified

```
app/Http/Controllers/Api/
└── AuthController.php ✨ NEW
    ├── loginAdmin(Request $request)
    ├── loginPeserta(Request $request)
    └── logout(Request $request)

app/Models/
├── User.php ✏️ MODIFIED
│   └── Added HasApiTokens trait
│
└── AkunPeserta.php ✏️ MODIFIED
    └── Added HasApiTokens trait

routes/
└── api.php ✏️ MODIFIED
    └── Added auth endpoints:
        ├── POST /auth/login-admin
        ├── POST /auth/login-peserta
        └── POST /auth/logout (protected)

config/
└── sanctum.php ✨ NEW
    └── API token configuration

database/seeders/
└── AuthTestSeeder.php ✨ NEW
    └── Creates test admin and peserta users
```

---

## Troubleshooting

### Issue: "Cannot POST /api/v1/auth/login-admin"

**Solution:** 
- Ensure Laravel server is running on port 8000
- Check if AuthController.php exists
- Verify routes/api.php has auth routes defined
- Run: `php artisan route:list | grep auth`

### Issue: "Email atau password tidak valid"

**Solution:**
- Check credentials:
  - Email: `admin@kemkominfo.go.id`
  - Password: `password123`
- Verify seeder was run: `php artisan db:seed --class=AuthTestSeeder`
- Check users table: `php artisan tinker` then `User::all()`

### Issue: "CORS error" or "Connection refused"

**Solution:**
- Verify Laravel server is running on port 8000
- Check .env file has correct APP_URL
- Verify frontend API_BASE_URL in api.js points to correct backend URL
- Current setting: `http://127.0.0.1:8000/api/v1`

### Issue: "Token not found in response"

**Solution:**
- Check AuthController response format matches expected structure
- Verify response includes `token` and `user` keys
- Check Sanctum configuration in config/sanctum.php

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id_user BIGINT PRIMARY KEY,
    id_pegawai BIGINT FOREIGN KEY,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'operator', 'verifikator', 'kepala'),
    last_login TIMESTAMP NULL,
    status ENUM('aktif', 'nonaktif'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Akun Peserta Table
```sql
CREATE TABLE akun_peserta (
    id_akun_peserta BIGINT PRIMARY KEY,
    id_peserta BIGINT FOREIGN KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    last_login TIMESTAMP NULL,
    status ENUM('aktif', 'nonaktif'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Security Notes

### Password Hashing
- All passwords are hashed using Laravel's Hash facade (Bcrypt)
- Use Hash::make() to create passwords
- Use Hash::check() to verify passwords

### API Token Security
- Uses Laravel Sanctum for API token management
- Tokens are generated per device/session
- Tokens stored securely in localStorage on frontend
- Include `Authorization: Bearer {token}` header for protected routes

### CORS Configuration
- If needed, update app/Http/Middleware/HandleCors.php
- Frontend port: 5174
- Backend port: 8000

---

## Development Tips

### Frontend Development
- Vue dev server auto-reloads on file changes
- Check browser console (F12) for error messages
- Use Vue DevTools extension for state debugging
- Pinia DevTools shows auth store state changes

### Backend Development
- Laravel logs to: `storage/logs/laravel.log`
- Use `php artisan tinker` for database testing
- Use `php artisan route:list` to verify endpoints
- Use `php artisan db:seed --class=AuthTestSeeder` to reset test data

### Testing API Directly
Use curl or Postman:
```bash
# Admin Login
curl -X POST http://localhost:8000/api/v1/auth/login-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kemkominfo.go.id","password":"password123"}'

# Peserta Login
curl -X POST http://localhost:8000/api/v1/auth/login-peserta \
  -H "Content-Type: application/json" \
  -d '{"username":"testpeserta","password":"password123"}'
```

---

## Next Steps

After successful login:

1. **Dashboard Implementation**
   - Implement admin dashboard at `/admin/dashboard`
   - Implement peserta dashboard at `/peserta/dashboard`

2. **Protected Routes**
   - Add route guards for authenticated-only pages
   - Implement navigation based on user role

3. **Data Features**
   - Implement CRUD operations for pegawai, kegiatan, peserta
   - Create forms for data entry and management
   - Implement search and filter functionality

4. **Additional Features**
   - Profile page for user information
   - Settings page for preferences
   - Notifications system
   - PDF certificate generation

---

## Support Commands

```bash
# Backend

# Run migrations
php artisan migrate

# Reset database
php artisan migrate:fresh

# Seed test data
php artisan db:seed --class=AuthTestSeeder

# Access database shell
php artisan tinker

# View all routes
php artisan route:list

# Start development server
php artisan serve --port=8000

# Frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Contact & Documentation

- **Frontend:** Vue 3, Vite, Pinia, Vue Router, Tailwind CSS
- **Backend:** Laravel 11, Laravel Sanctum, MySQL
- **API:** RESTful API with JSON responses
- **Authentication:** Token-based (Sanctum)

---

**Status:** ✅ Ready for Testing
**Last Updated:** January 25, 2026
**Version:** 1.0.0
