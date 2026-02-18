# 🧪 Browser Console Diagnostic Commands

Copy-paste commands ini ke browser console (F12) untuk diagnosa masalah.

---

## 1️⃣ Test API Connectivity

### Test Basic Connection
```javascript
// Simple test - should show response
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan', {
  method: 'GET'
})
.then(r => {
  console.log('✅ Connection OK')
  console.log('Status:', r.status)
  console.log('Headers:', Object.fromEntries(r.headers))
  return r.json()
})
.then(d => console.log('Response:', d))
.catch(e => console.error('❌ Error:', e.message))
```

### Test Login Endpoint
```javascript
// Test login endpoint
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
.then(r => {
  console.log('Status:', r.status)
  console.log('Response Headers:')
  r.headers.forEach((v, k) => console.log(`  ${k}: ${v}`))
  return r.json()
})
.then(d => {
  console.log('Response Body:', d)
  if (d.token) console.log('✅ Token received:', d.token.substring(0, 20) + '...')
  if (d.message) console.log('⚠️ Message:', d.message)
})
.catch(e => console.error('❌ Error:', e.message))
```

---

## 2️⃣ Check CORS Headers

### Check CORS Configuration
```javascript
// Test CORS with preflight
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
  method: 'OPTIONS',
  headers: {
    'Origin': window.location.origin
  }
})
.then(r => {
  console.log('CORS Test:')
  console.log('Status:', r.status)
  console.log('Access-Control-Allow-Origin:', r.headers.get('Access-Control-Allow-Origin'))
  console.log('Access-Control-Allow-Methods:', r.headers.get('Access-Control-Allow-Methods'))
  console.log('Access-Control-Allow-Headers:', r.headers.get('Access-Control-Allow-Headers'))
})
.catch(e => console.error('CORS Error:', e))
```

---

## 3️⃣ Check Current API Configuration

### View API Base URL
```javascript
// Check what API URL is configured
(async () => {
  const { useAuthStore } = await import('@/stores/auth')
  const auth = useAuthStore()
  console.log('Auth Store created')
  
  // Check the actual API endpoint being used
  const url = 'https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin'
  console.log('Login endpoint:', url)
})()
```

### Check Storage
```javascript
// Check localStorage for saved token
console.log('=== LocalStorage ===')
console.log('auth_token:', localStorage.getItem('auth_token'))
console.log('user_data:', localStorage.getItem('user_data'))
console.log('user_type:', localStorage.getItem('user_type'))
```

---

## 4️⃣ Manual Login Test

### Try Login with Full Error Handling
```javascript
// Complete login test with detailed error info
(async () => {
  try {
    console.log('📝 Attempting login...')
    
    const response = await fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
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
    
    console.log('📊 Response Status:', response.status, response.statusText)
    
    // Check CORS headers
    console.log('🔐 CORS Headers:')
    console.log('  Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'))
    console.log('  Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'))
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Login successful!')
      console.log('  Token:', data.token?.substring(0, 30) + '...' || 'N/A')
      console.log('  User:', data.user?.name || 'N/A')
      
      // Save to localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      console.log('💾 Saved to localStorage')
      
    } else {
      console.log('❌ Login failed')
      console.log('  Error:', data.message || 'Unknown error')
      console.log('  Details:', data)
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message)
    console.error('  Type:', error.name)
    console.error('  Full:', error)
  }
})()
```

---

## 5️⃣ Test Protected Endpoint

### Test with Bearer Token
```javascript
// Test protected endpoint with token
(async () => {
  const token = localStorage.getItem('auth_token')
  
  if (!token) {
    console.error('❌ No token found in localStorage')
    console.log('Login first before testing protected endpoints')
    return
  }
  
  console.log('🔑 Using token:', token.substring(0, 30) + '...')
  
  try {
    const response = await fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    console.log('📊 Status:', response.status)
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Protected endpoint works!')
      console.log('  Data count:', Array.isArray(data) ? data.length : 'unknown')
      console.log('  Sample:', data[0] || 'No data')
    } else {
      console.log('❌ Protected endpoint failed')
      console.log('  Error:', data.message || response.statusText)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
})()
```

---

## 6️⃣ Network Analysis

### Monitor All Requests
```javascript
// Enable detailed logging
window.logApiRequests = true

// Intercept fetch
const originalFetch = window.fetch
window.fetch = function(...args) {
  const [resource, config] = args
  console.log('🌐 Fetch:', {
    url: resource,
    method: config?.method || 'GET',
    headers: config?.headers
  })
  
  return originalFetch.apply(this, args)
    .then(r => {
      console.log('📦 Response:', {
        url: resource,
        status: r.status,
        headers: Object.fromEntries(r.headers)
      })
      return r
    })
    .catch(e => {
      console.error('❌ Failed:', resource, e.message)
      throw e
    })
}

console.log('✅ Fetch logging enabled. Now try to login.')
```

---

## 7️⃣ Clear Cache & Retry

### Reset Everything
```javascript
// Clear all auth data
localStorage.clear()
sessionStorage.clear()

// Clear cached data
if (window.caches) {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name))
  })
}

console.log('✅ Cache cleared. Refresh page and try again.')
```

---

## 8️⃣ Check Backend Status

### Ping Backend
```javascript
// Simple health check
(async () => {
  console.log('🏥 Checking backend health...')
  
  try {
    const response = await fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
      method: 'HEAD'
    }).catch(() => null)
    
    if (response) {
      console.log('✅ Backend is online (Status: ' + response.status + ')')
    } else {
      console.log('⚠️ Backend might be offline or blocking HEAD requests')
    }
  } catch (error) {
    console.log('❌ Backend unreachable:', error.message)
  }
})()
```

---

## 🎯 Quick Diagnosis Flow

Run these in order:

```javascript
// 1. Check connection
console.log('Step 1: Testing basic connection...')
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan')
  .then(r => console.log('✅ Connected, Status:', r.status))
  .catch(e => console.error('❌ Connection failed:', e.message))

// 2. Check CORS
setTimeout(() => {
  console.log('Step 2: Testing CORS...')
  fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
    method: 'OPTIONS'
  })
  .then(r => {
    console.log('✅ CORS OK')
    console.log('  Allow-Origin:', r.headers.get('Access-Control-Allow-Origin'))
  })
  .catch(e => console.error('❌ CORS failed:', e.message))
}, 1000)

// 3. Try login
setTimeout(() => {
  console.log('Step 3: Testing login...')
  fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@kemkominfo.go.id', password: 'password123' })
  })
  .then(r => {
    console.log('Response Status:', r.status)
    return r.json()
  })
  .then(d => console.log('✅ Login response:', d))
  .catch(e => console.error('❌ Login failed:', e.message))
}, 2000)
```

---

## 📋 What to Look For

**Success Indicators:**
- ✅ Status 200-299
- ✅ Token in response
- ✅ CORS headers present
- ✅ No "blocked by CORS" error

**Error Indicators:**
- ❌ Status 401, 403, 404, 500+
- ❌ "Failed to fetch"
- ❌ No CORS headers
- ❌ Network error

---

## 📤 Reporting Issues

When reporting "Failed to fetch", include:

```javascript
// Collect diagnostic info
const diagnostics = {
  timestamp: new Date().toISOString(),
  apiUrl: 'https://backend-siamin.bpmpntb.id/api/v1',
  browserUrl: window.location.origin,
  userAgent: navigator.userAgent,
  localStorage: {
    token: !!localStorage.getItem('auth_token'),
    userData: !!localStorage.getItem('user_data')
  }
}

console.log('Diagnostics:', diagnostics)
console.log('Copy this info when reporting the issue')
```

---

**Use these commands to diagnose the issue!** 🔧
