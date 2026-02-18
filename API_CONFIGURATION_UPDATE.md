# 🔄 API Configuration Update

**Date:** 2025-01-26  
**Update:** Changed API endpoint to production server

---

## ✅ Configuration Updated

### API Base URL Changed
```
Before:  http://127.0.0.1:8000/api/v1
After:   https://backend-siamin.bpmpntb.id/api/v1
```

### Files Updated
- ✅ `src/services/api.js` - Line 2
- ✅ `src/stores/auth.js` - Line 6

---

## 🔧 How It Works

The API configuration uses a fallback pattern:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL+'/api/v1/' || 'https://backend-siamin.bpmpntb.id/'api/v1'
```

### Priority Order:
1. **Environment Variable** `VITE_API_BASE_URL` (if set)
   - Used for development/staging override
   - Configure in `.env` file

2. **Production Default** `https://backend-siamin.bpmpntb.id/api/v1`
   - Used when no environment variable set
   - Production backend

---

## 📝 Configuration Options

### Option 1: Use Default (Production)
No action needed. The application will use:
```
https://backend-siamin.bpmpntb.id/api/v1
```

### Option 2: Override with Environment Variable
Create or update `.env` file:
```
VITE_API_BASE_URL=https://backend-siamin.bpmpntb.id/api/v1
```

### Option 3: Development Override
For local development, create `.env.local`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 🚀 Production API Endpoints

### Base URL
```
https://backend-siamin.bpmpntb.id/api/v1
```

### Available Endpoints
- `POST /auth/login-admin` - Admin login
- `POST /auth/login-peserta` - Peserta login
- `POST /auth/logout` - Logout
- `GET /user` - Get current user
- `GET /kegiatan` - Get kegiatan list
- `GET /peserta` - Get peserta list
- `POST /sertifikat` - Create/update sertifikat
- And more...

---

## ✅ Verification

### Check API Configuration
```javascript
// In browser console:
import { api } from '@/services/api'
// or check the actual fetch calls in Network tab

// The API_BASE_URL should be:
// https://backend-siamin.bpmpntb.id/api/v1
```

### Test Login
```javascript
// Try login - should connect to production API
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@...', password: '...' })
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## ⚠️ Important Notes

### HTTPS Required
- ✅ API uses HTTPS (secure)
- ✅ Frontend should also use HTTPS in production
- ✅ Mixed content (HTTP ← HTTPS) may cause issues

### CORS Configuration
- API server must allow requests from your frontend domain
- Contact backend team if you get CORS errors

### Rate Limiting
- Some endpoints may have rate limits
- Check API documentation for limits

---

## 🔐 Security Notes

- Token is sent via HTTPS (encrypted in transit)
- Never expose token in logs or URLs
- Use HttpOnly cookies for better security (future enhancement)
- Implement token refresh for long-lived sessions

---

## 📋 Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/login-admin` | ❌ | Admin login |
| POST | `/auth/login-peserta` | ❌ | Peserta login |
| POST | `/auth/logout` | ✅ | Logout & invalidate |
| GET | `/user` | ✅ | Get current user |
| GET | `/kegiatan` | ✅ | List kegiatan |
| POST | `/kegiatan` | ✅ | Create kegiatan |
| GET | `/peserta` | ✅ | List peserta |
| POST | `/peserta` | ✅ | Create peserta |
| GET | `/sertifikat` | ✅ | List sertifikat |
| POST | `/sertifikat` | ✅ | Create sertifikat |

*(✅ = Requires Bearer Token)*

---

## 🧪 Testing with Production API

### 1. Test Login
```bash
curl -X POST https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@...","password":"..."}'
```

### 2. Test Protected Endpoint
```bash
TOKEN="your_token_here"
curl -X GET https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Browser Console
```javascript
// Check network requests go to production API
// Open DevTools → Network tab
// Login and observe requests to backend-siamin.bpmpntb.id
```

---

## 📞 Support

If you encounter issues:

1. **CORS Error**
   - Backend must allow your frontend domain
   - Contact backend team

2. **Connection Refused**
   - Check API server is running
   - Check URL is correct

3. **401 Unauthorized**
   - Verify credentials
   - Check token is being sent
   - Check token is not expired

4. **Invalid SSL Certificate** (if using self-signed)
   - Accept certificate warning
   - Or configure proper SSL certificate

---

## ✨ Status

- [x] API endpoint configured
- [x] Production backend URL set
- [x] Environment variable support
- [x] Documentation updated
- [x] Ready for testing

**Next Step:** Test login with production API 🚀

---

**Configuration Complete!**

Application is now pointing to production API: **https://backend-siamin.bpmpntb.id/api/v1**
