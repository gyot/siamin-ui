# 🔧 Troubleshooting: "Failed to fetch" Error

**Issue:** Getting "Failed to fetch" error when trying to login  
**Status:** Diagnosing connection issue to API

---

## 🔍 Quick Diagnosis

### Step 1: Check Browser Console
1. Open **DevTools (F12)**
2. Go to **Console** tab
3. Look for error messages
4. Check what error is displayed

### Step 2: Check Network Tab
1. Open **Network** tab in DevTools
2. Try to login
3. Look for failed requests
4. Check response status code

### Step 3: Test API Connectivity

**Option A: Using Browser Console**
```javascript
// Test if API is reachable
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan')
  .then(r => {
    return r.json()
  })
  .catch(e => console.error('Error:', e.message))
```

**Option B: Using PowerShell**
```powershell
# Test API connectivity
Invoke-WebRequest -Uri "https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan" -Method GET -UseBasicParsing

# Or with curl
curl -v https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan
```

---

## 🆘 Common Solutions

### Issue 1: CORS Error (Most Common)
**Error in Console:**
```
Access to XMLHttpRequest at 'https://backend-siamin.bpmpntb.id/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
Backend API must allow requests from your frontend domain.

Contact backend team to add CORS headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**Temporary workaround (development only):**
Use a CORS proxy (NOT for production):
```javascript
// In api.js temporarily
const url = 'https://cors-anywhere.herokuapp.com/https://backend-siamin.bpmpntb.id/...'
```

---

### Issue 2: SSL/Certificate Error
**Error:**
```
NET::ERR_CERT_AUTHORITY_INVALID
or
Failed to fetch (with self-signed cert)
```

**Solutions:**

**A. For Production (Proper Certificate)**
- Backend must have valid SSL certificate
- Contact backend admin to install proper cert

**B. For Development (Self-Signed)**
- Test with curl first:
  ```bash
  curl -k https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin
  ```
- If curl works but browser doesn't: browser security blocking self-signed cert
- Add exception in browser or use proper certificate

---

### Issue 3: Network/DNS Error
**Error:**
```
Failed to fetch
(No specific error shown)
```

**Causes & Solutions:**

1. **Check if backend is online**
   ```powershell
   ping backend-siamin.bpmpntb.id
   ```

2. **Check DNS resolution**
   ```powershell
   nslookup backend-siamin.bpmpntb.id
   ```

3. **Check if port is accessible**
   ```powershell
   Test-NetConnection backend-siamin.bpmpntb.id -Port 443
   ```

4. **Check firewall/proxy**
   - Verify no firewall blocking HTTPS
   - Check proxy settings

---

### Issue 4: Wrong API Endpoint
**Verify endpoint is correct:**

```javascript
// In browser console
// Check what URL is being used
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

// Or check api.js directly
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {...})
```

---

## 📋 Complete Diagnostic Steps

### Step 1: Verify API is Running
```bash
# Test basic connectivity
curl -v https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin

# Should return something (even 404 or 405 is OK, shows API responds)
# If connection refused = API not running
# If timeout = network issue
```

### Step 2: Test Login Endpoint
```bash
curl -X POST https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Check response headers for CORS headers.

### Step 3: Check Credentials
```bash
# If API responds but says "unauthorized"
# Try different credentials
# Ask backend team for test credentials
```

### Step 4: Browser DevTools Deep Dive
1. Open DevTools → Network tab
2. Click login button
3. Find the failed request
4. Click on it and check:
   - **Headers tab** - see request headers being sent
   - **Response tab** - see what backend returned
   - **Console tab** - see what error JS is throwing

---

## 🐛 Specific Error Messages

### "Failed to fetch" (Generic)
**Likely causes:**
1. CORS blocked
2. Network unreachable
3. SSL certificate issue
4. Backend not responding

**Fix:**
Run diagnostic steps above

---

### "TypeError: Failed to fetch"
**Cause:** Network error or blocked by CORS

**Fix:**
- Check CORS headers from backend
- Verify API URL is correct
- Check if backend is online

---

### "401 Unauthorized"
**Cause:** Credentials wrong or API not returning token

**Fix:**
```javascript
// Check backend returns {token, user} format
// Verify credentials are correct
// Ask backend team to confirm endpoint
```

---

### "404 Not Found"
**Cause:** Endpoint doesn't exist

**Fix:**
- Verify endpoint path: `/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin`
- Check backend API routes
- Ask backend team for correct endpoint

---

## 🔧 Debug Checklist

### API Configuration
- [ ] API URL is correct: `https://backend-siamin.bpmpntb.id/api/v1`
- [ ] URL is HTTPS (not HTTP)
- [ ] No trailing/leading spaces in URL

### Network
- [ ] Internet connection working
- [ ] Can ping backend domain
- [ ] Port 443 is open
- [ ] No firewall blocking

### Backend
- [ ] API server is running
- [ ] Database connected
- [ ] CORS headers configured
- [ ] SSL certificate valid
- [ ] Test credentials available

### Frontend
- [ ] Dev server running
- [ ] No console errors before login attempt
- [ ] Token is being saved (check localStorage)
- [ ] Bearer token is being sent (check Network tab)

---

## 📞 Next Steps

### If API is Working:
1. Check browser console for specific error
2. Verify CORS headers in response
3. Check credentials are correct
4. Verify token is being returned

### If API is Not Accessible:
1. Contact backend team
2. Verify API URL
3. Ask for test credentials
4. Ask for CORS configuration

### If You're Unsure:
1. Test with curl from command line
2. Share the curl output
3. Check backend logs
4. Contact backend admin

---

## 💡 Test Credentials

Ask your backend team for test credentials:
```
Admin:
  Email: admin@kemkominfo.go.id
  Password: password123

Peserta:
  Username: peserta123
  Password: password123
```

---

## 🆘 Error Message Template

When reporting issue, include:
1. Exact error message
2. DevTools console screenshot
3. Network tab request/response
4. API URL being used
5. Browser type and version
6. When it started happening

---

**Status:** Ready to troubleshoot 🔧

Use the diagnostic steps above to identify the specific issue, then apply the appropriate solution.
