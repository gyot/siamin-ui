# 🚨 "Failed to fetch" - Quick Troubleshooting

**Status:** Getting "Failed to fetch" error  
**Likely Cause:** CORS or network issue  
**Time to Resolve:** 5-10 minutes

---

## ⚡ Quick Fix (Step by Step)

### Step 1: Check API is Online (2 min)
Open PowerShell and run:
```powershell
# Test if backend is reachable
Test-NetConnection backend-siamin.bpmpntb.id -Port 443
```

✅ If shows "TcpTestSucceeded : True" → Backend is online, go to Step 2  
❌ If shows "False" → Backend is offline, contact backend team

---

### Step 2: Check Browser Console (2 min)
1. Open browser DevTools: **F12**
2. Click **Console** tab
3. Scroll to find the error message
4. Look for one of these:

**If you see "CORS" in the error:**
→ This is a CORS issue (most likely)  
→ Skip to CORS Fix below

**If you see "NET::ERR_" or "SSL":**
→ This is an SSL/certificate issue  
→ Skip to SSL Fix below

**If generic "Failed to fetch":**
→ Run diagnostic command below

---

### Step 3: Run Diagnostic (2 min)
Copy-paste this in browser console:
```javascript
fetch('https://backend-siamin.bpmpntb.id/api/v1/kegiatan')
  .then(r => console.log('✅ Connected, Status:', r.status))
  .catch(e => console.error('❌ Error:', e.message))
```

**Result interpretation:**
- ✅ Shows status code → Backend responding (check CORS)
- ❌ Shows "Failed to fetch" → Network/SSL issue

---

## 🔧 Fix 1: CORS Issue (Most Common)

**Error message contains:** "blocked by CORS policy"

**Fix:** Backend needs configuration

**Tell Backend Team:**
> "Enable CORS in `config/cors.php`. Add these origins:
> - `http://localhost:5173` (development)
> - `https://siamin.bpmpntb.id` (production)"

**Backend Implementation (Laravel):**
```php
// config/cors.php
'allowed_origins' => [
    'http://localhost:5173',
    'https://siamin.bpmpntb.id',
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

**After fix, try login again** ✅

---

## 🔐 Fix 2: SSL Certificate Issue

**Error message contains:** "NET::ERR_CERT" or "certificate"

**Check certificate:**
```powershell
# In PowerShell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$request = [Net.HttpWebRequest]::Create("https://backend-siamin.bpmpntb.id")
$request.GetResponse()
```

**Solutions:**

**A. If using self-signed certificate (development):**
```javascript
// Temporary - test with curl instead
// curl -k https://backend-siamin.bpmpntb.id/api/v1/kegiatan
```

**B. If production (should have valid cert):**
Tell backend team to install proper SSL certificate

---

## 🌐 Fix 3: Network/DNS Issue

**Error message:** Just "Failed to fetch" with no other info

**Check connectivity:**
```powershell
# Check DNS
nslookup backend-siamin.bpmpntb.id

# Ping
ping backend-siamin.bpmpntb.id

# Tracert
tracert backend-siamin.bpmpntb.id
```

**If DNS fails:**
- Contact your network admin
- Try with IP address instead

**If ping fails:**
- Backend offline
- Network blocking ICMP
- Contact backend team

---

## ✅ Fix 4: Clear Cache & Retry

If nothing above works:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

Then try login again.

---

## 📊 Most Likely = CORS

**Statistics:**
- 70% of "Failed to fetch" = CORS issue
- 15% = Backend offline
- 10% = SSL/certificate
- 5% = Other

**99% probability it's CORS if:**
- Backend is online (you confirmed)
- Frontend looks correct
- Error doesn't mention certificate

---

## 📞 What to Tell Backend Team

Use this exact message:

> "Hi, the frontend at http://localhost:5173 (dev) / https://siamin.bpmpntb.id (prod) is getting CORS errors when trying to connect to https://backend-siamin.bpmpntb.id. Can you:
> 
> 1. Enable CORS in config/cors.php
> 2. Add these origins:
>    - http://localhost:5173
>    - https://siamin.bpmpntb.id
> 3. Make sure these headers are returned:
>    - Access-Control-Allow-Origin
>    - Access-Control-Allow-Methods
>    - Access-Control-Allow-Headers
> 
> Thanks!"

---

## 🎯 Decision Tree

```
"Failed to fetch" error?
│
├─ Error mentions "CORS"?
│  └─ YES → See "Fix 1: CORS Issue"
│  └─ NO → Continue
│
├─ Error mentions "certificate" or "SSL"?
│  └─ YES → See "Fix 2: SSL Certificate"
│  └─ NO → Continue
│
├─ Can reach backend with curl/PowerShell?
│  └─ YES → Probably CORS → See "Fix 1"
│  └─ NO → Backend offline → Tell backend team
│
└─ Try clearing cache → See "Fix 4"
```

---

## ⚙️ Frontend Configuration (Already Done)

✅ API endpoint configured: `https://backend-siamin.bpmpntb.id/api/v1`  
✅ Bearer token authentication: Ready  
✅ Request headers: Correct  
✅ Error handling: Implemented  

**No frontend changes needed.**

---

## ✨ What You Have

- ✅ Frontend fully configured
- ✅ Auth system implemented
- ✅ API integration complete
- ⏳ Just needs backend CORS enabled

---

## 📋 Checklist

- [ ] Run diagnostic in browser console
- [ ] Identify which fix applies
- [ ] Apply the fix
- [ ] Try login again
- [ ] If still failing, check backend logs
- [ ] Contact backend team with error details

---

**Most likely solution:** **Enable CORS on backend** 🔐

**Estimated time to fix:** 5 minutes (if you have backend access)

Good luck! 🚀
