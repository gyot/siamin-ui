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
  return r.json()
})
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
  return r.json()
})
.then(d => {
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
  
  // Check the actual API endpoint being used
  const url = 'https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin'
})()
```

### Check Storage
```javascript
// Check localStorage for saved token
```

---

## 4️⃣ Manual Login Test

### Try Login with Full Error Handling
```javascript
// Complete login test with detailed error info
(async () => {
  try {
    
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
    
    
    // Check CORS headers
    
    const data = await response.json()
    
    if (response.ok) {
      
      // Save to localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      
    } else {
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
    return
  }
  
  
  try {
    const response = await fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    
    const data = await response.json()
    
    if (response.ok) {
    } else {
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
    url: resource,
    method: config?.method || 'GET',
    headers: config?.headers
  })
  
  return originalFetch.apply(this, args)
    .then(r => {
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

```

---

## 8️⃣ Check Backend Status

### Ping Backend
```javascript
// Simple health check
(async () => {
  
  try {
    const response = await fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
      method: 'HEAD'
    }).catch(() => null)
    
    if (response) {
    } else {
    }
  } catch (error) {
  }
})()
```

---

## 🎯 Quick Diagnosis Flow

Run these in order:

```javascript
// 1. Check connection
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan')
  .catch(e => console.error('❌ Connection failed:', e.message))

// 2. Check CORS
setTimeout(() => {
  fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
    method: 'OPTIONS'
  })
  .then(r => {
  })
  .catch(e => console.error('❌ CORS failed:', e.message))
}, 1000)

// 3. Try login
setTimeout(() => {
  fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@kemkominfo.go.id', password: 'password123' })
  })
  .then(r => {
    return r.json()
  })
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

```

---

**Use these commands to diagnose the issue!** 🔧
