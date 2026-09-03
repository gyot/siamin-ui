# 🔐 CORS Issue - Quick Fix Guide

**Problem:** "Failed to fetch" error likely due to CORS  
**Solution:** Backend needs to allow frontend domain

---

## 🎯 Most Likely Issue: CORS

If you see this error in console:
```
Access to XMLHttpRequest at 'https://backend-siamin.bpmpntb.id/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**This is a BACKEND issue, not frontend.**

---

## ✅ What Backend Team Needs to Do

Backend API at `https://backend-siamin.bpmpntb.id` must add CORS headers.

### For Laravel (Your Backend Framework)

**Option 1: Using CORS Middleware**

In `config/cors.php`:
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:5173',      // Development
        'http://localhost:3000',      // Alternative dev
        'https://siamin.bpmpntb.id',  // Production frontend
        'https://frontend.example.com' // Any frontend domain
    ],
    
    'allowed_origins_patterns' => ['*'],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

**Option 2: Using Middleware in Routes**

```php
// In routes/api.php or routes/web.php
Route::middleware('cors')->group(function () {
    Route::post('/auth/login-admin', [AuthController::class, 'loginAdmin']);
    Route::post('/auth/login-peserta', [AuthController::class, 'loginPeserta']);
    // ... other routes
});
```

**Option 3: Manual Headers**

```php
// In controller or middleware
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

---

## 📋 Required CORS Headers

Backend must return these headers in response:

```
Access-Control-Allow-Origin: http://localhost:5173 (or *)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 🧪 Test CORS Configuration

### Backend Team Can Test With:

```bash
# Test CORS headers
curl -X OPTIONS https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should return 200 with Access-Control headers
```

---

## 🔄 Frontend Configuration (Already Done)

Frontend is already configured to use:
- ✅ API endpoint: `https://backend-siamin.bpmpntb.id/api/v1`
- ✅ Bearer token authentication
- ✅ Correct request headers

No frontend changes needed - just need backend to enable CORS.

---

## 📞 Action Items

### For Backend Team:
1. Enable CORS in Laravel `config/cors.php`
2. Add frontend origin(s) to allowed_origins
3. Ensure CORS middleware is active
4. Test with curl command above
5. Test with frontend browser

### For Frontend (You):
1. ✅ Already configured
2. Try login after backend enables CORS
3. Check browser Network tab
4. Verify request goes through

---

## 🐛 Testing After Backend Fix

### Test 1: Check CORS Headers
```javascript
// In browser console
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
  method: 'OPTIONS'
})
.then(r => {
})
```

### Test 2: Try Login
```javascript
// Should work now if CORS is enabled
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@kemkominfo.go.id',
    password: 'password123'
  })
})
.then(r => r.json())
.catch(e => console.error('❌ Still error:', e.message))
```

---

## ⚠️ Development vs Production

### Development (localhost:5173)
Backend should allow:
```
Access-Control-Allow-Origin: http://localhost:5173
```

### Production (siamin.bpmpntb.id)
Backend should allow:
```
Access-Control-Allow-Origin: https://siamin.bpmpntb.id
```

Both can be added:
```
Access-Control-Allow-Origin: http://localhost:5173, https://siamin.bpmpntb.id
```

Or use wildcard (less secure):
```
Access-Control-Allow-Origin: *
```

---

## 🔗 Reference Links

- **Laravel CORS Config:** https://laravel.com/docs/11.x/cors
- **CORS Explained:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Troubleshooting CORS:** https://developer.chrome.com/docs/extensions/mv3/cors/

---

## 📝 Summary

| Component | Status | Action |
|-----------|--------|--------|
| Frontend Code | ✅ Ready | Nothing to do |
| API Endpoint | ✅ Configured | Nothing to do |
| CORS Headers | ❌ Missing | **Backend team must enable** |

---

## 💬 Message for Backend Team

> "Hey, we're getting CORS errors when frontend tries to connect to the API. Can you enable CORS in the backend? The frontend origin is `http://localhost:5173` for development and `https://siamin.bpmpntb.id` for production. Please add these to the allowed origins in `config/cors.php`."

---

**Next Step:** Contact backend team to enable CORS 📞

After they enable it, login should work! ✅
