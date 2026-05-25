# 🧪 API Integration Testing Guide

## 📋 Quick Reference

**API Base URL:** `http://127.0.0.1:8000/api/v1`

**Token Storage:** `localStorage.getItem('auth_token')`

**User Data Storage:** `localStorage.getItem('user_data')`

## 🔍 Browser DevTools Testing

### 1. Monitor Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Login with credentials
4. Look for:
   - ✅ `POST /v1/auth/login-admin` or `POST /v1/auth/login-peserta`
   - ✅ Response contains `token` and `user`
   - ✅ Status Code: 200

### 2. Check localStorage
```javascript
// In Console, run:
localStorage.getItem('auth_token')
// Should return: "1|abc123token..."

localStorage.getItem('user_data')
// Should return: JSON string with user info

localStorage.getItem('user_type')
// Should return: "admin" or "peserta"
```

### 3. Check Bearer Token in Requests
```javascript
// In Console, run:
const token = localStorage.getItem('auth_token')
// Copy this and check Network tab > Request Headers
// Should see: Authorization: Bearer 1|abc123token...
```

### 4. Test Auth Store
```javascript
// In Console, run:
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
```

## 🚀 Test Scenarios

### Scenario 1: Admin Login Success ✅
```
1. Navigate to http://localhost:5173/login
2. Enter:
   - Email: admin@kemkominfo.go.id
   - Password: password123
3. Click "Login"
4. Expected:
   ✅ Loading spinner shows briefly
   ✅ Redirects to /admin/dashboard
   ✅ Header shows admin name
   ✅ Network tab shows 200 response from login endpoint
   ✅ localStorage has auth_token
```

### Scenario 2: Peserta Login Success ✅
```
1. Navigate to http://localhost:5173/login-peserta
2. Enter:
   - Username: peserta123
   - Password: password123
3. Click "Login"
4. Expected:
   ✅ Loading spinner shows briefly
   ✅ Redirects to /peserta/dashboard
   ✅ Portal shows peserta name
   ✅ Network tab shows 200 response from login endpoint
   ✅ localStorage has auth_token
```

### Scenario 3: Invalid Credentials ❌
```
1. Navigate to http://localhost:5173/login
2. Enter:
   - Email: admin@kemkominfo.go.id
   - Password: wrongpassword
3. Click "Login"
4. Expected:
   ✅ No redirect
   ✅ Error message shows: "Email atau password tidak valid"
   ✅ Network tab shows 401/422 response
   ✅ localStorage is empty (no token saved)
```

### Scenario 4: Session Persistence 🔄
```
1. Login successfully to admin
2. Verify logged in (header shows name)
3. Refresh page (F5)
4. Expected:
   ✅ Still logged in (no redirect to login)
   ✅ Dashboard loads immediately
   ✅ No need to login again
   ✅ Console shows: "[Auth] ✅ Session restored"
```

### Scenario 5: Logout 🚪
```
1. Login successfully
2. Click "Logout" button
3. Expected:
   ✅ API call to POST /v1/auth/logout (Network tab)
   ✅ Request includes Authorization header
   ✅ Redirects to landing page
   ✅ localStorage cleared (no auth_token)
   ✅ Dashboard not accessible anymore
```

### Scenario 6: Protected Routes 🔐
```
1. Logout completely
2. Try to access http://localhost:5173/admin/dashboard directly
3. Expected:
   ✅ Redirects to http://localhost:5173/login
   ✅ Cannot see dashboard content
   
4. Repeat for peserta:
   - Try to access /peserta/dashboard
   ✅ Redirects to /login-peserta
```

### Scenario 7: Protected API Endpoints 🔑
```
1. Login successfully
2. Open Console and run:
   fetch('http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
     }
   })
   .then(r => r.json())

3. Expected:
   ✅ Returns kegiatan data (no 401 error)
   ✅ Proof that Bearer token works
```

## 🐛 Troubleshooting Commands

### Check if token exists
```javascript
localStorage.getItem('auth_token') ? '✅ Token found' : '❌ No token'
```

### Check auth store state
```javascript
const auth = useAuthStore()
  token: auth.token,
  currentUser: auth.currentUser,
  userType: auth.userType,
  isAuthenticated: auth.isAuthenticated,
  isAdmin: auth.isAdmin,
  isPeserta: auth.isPeserta,
  isLoading: auth.isLoading,
  error: auth.error
})
```

### Manually test login endpoint
```javascript
fetch('http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@kemkominfo.go.id',
    password: 'password123'
  })
})
.then(r => r.json())
```

### Check Bearer token format
```javascript
const token = localStorage.getItem('auth_token')
const format = `Bearer ${token}`
// Copy this to Network > Request Headers > Authorization
```

### Clear all localStorage (reset auth)
```javascript
localStorage.removeItem('auth_token')
localStorage.removeItem('user_data')
localStorage.removeItem('user_type')
location.reload()
```

## 📊 Request/Response Examples

### Admin Login Request
```http
POST http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "email": "admin@kemkominfo.go.id",
  "password": "password123"
}
```

### Admin Login Response (Success)
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "1|abc123def456ghi789jkl",
  "user": {
    "id": 1,
    "name": "Admin Kemkominfo",
    "email": "admin@kemkominfo.go.id",
    "instansi": "Kementerian Komunikasi dan Informatika"
  }
}
```

### Protected Request (with Token)
```http
GET http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan HTTP/1.1
Authorization: Bearer 1|abc123def456ghi789jkl
Accept: application/json
```

### Logout Request
```http
POST http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/logout HTTP/1.1
Authorization: Bearer 1|abc123def456ghi789jkl
Content-Type: application/json
```

## ✅ Integration Verification Checklist

Run these tests in order:

### Basic Setup
- [ ] `localStorage.getItem('auth_token')` returns null (before login)
- [ ] Navigate to `/login` - page loads
- [ ] Navigate to `/login-peserta` - page loads

### Login Flow
- [ ] Admin login with correct credentials → redirects to dashboard
- [ ] Peserta login with correct credentials → redirects to dashboard
- [ ] Token saved in localStorage after login
- [ ] User data saved in localStorage after login

### API Integration
- [ ] Network tab shows requests to correct endpoints
- [ ] Response status is 200 for successful login
- [ ] Response includes token and user in JSON
- [ ] Subsequent API requests include Bearer token

### Session Management
- [ ] Refresh page after login → still logged in
- [ ] Open DevTools > Application > Cookies → session cookies exist (if using HttpOnly)
- [ ] localStorage data correct after refresh
- [ ] Console shows "[Auth] ✅ Session restored"

### Error Handling
- [ ] Wrong password shows error message
- [ ] Empty form shows validation error
- [ ] Server error shows error from API
- [ ] Error cleared when trying again

### Security
- [ ] Logout API call visible in Network tab
- [ ] Authorization header includes Bearer token
- [ ] Protected routes redirect to login if not authenticated
- [ ] Logout clears localStorage

### Edge Cases
- [ ] Close browser tab → reopen → session restored
- [ ] Login on one tab → check another tab (should see updates)
- [ ] Logout from one tab → other tabs redirect to login
- [ ] Rapid login attempts → API handles gracefully

## 📱 Testing with Real API

### Prerequisites
```
✅ API server running: http://127.0.0.1:8000
✅ Database migrated and seeded
✅ Sanctum configured in Laravel
✅ CORS enabled for http://localhost:5173
```

### Start Testing
```bash
# Terminal 1: Start Vue dev server
npm run dev

# Terminal 2: Check API is running
curl -X POST http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kemkominfo.go.id","password":"password123"}'
```

## 🎯 Test Results Template

```
Test Date: 2025-01-26
Tester: [Your Name]
Browser: Chrome/Firefox/Edge

[ ] Admin Login: PASS / FAIL
[ ] Peserta Login: PASS / FAIL
[ ] Error Handling: PASS / FAIL
[ ] Session Restoration: PASS / FAIL
[ ] Logout: PASS / FAIL
[ ] Protected Routes: PASS / FAIL
[ ] Bearer Token: PASS / FAIL

Issues Found:
- [Issue 1]
- [Issue 2]

Overall Status: ✅ PASS / ⚠️ NEEDS FIX
```

## 🆘 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 Not Found on login | Wrong endpoint | Check ENDPOINTS in api.js |
| 401 Unauthorized | No token or expired | Clear localStorage, re-login |
| CORS Error | Server CORS config | Check API server CORS settings |
| Token not saving | localStorage disabled | Enable localStorage in browser |
| Redirect not working | Router not configured | Check router/index.js |
| Session lost on refresh | restoreAuth() not called | Call in App.vue onMounted |

---

**Ready to Test!** Follow the scenarios above to verify the integration.
