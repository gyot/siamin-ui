# 📚 Code Snippets Reference

Quick code snippets for common tasks with the new Sanctum API integration.

## Auth Store Methods

### Login Admin
```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// In component
async function handleAdminLogin() {
  try {
    const success = await authStore.loginAdmin(
      'admin@kemkominfo.go.id',
      'password123'
    )
    
    if (success) {
      router.push('/admin/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}
```

### Login Peserta
```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// In component
async function handlePesertaLogin() {
  try {
    const success = await authStore.loginPeserta(
      'peserta123',
      'password123'
    )
    
    if (success) {
      router.push('/peserta/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}
```

### Logout
```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// In component
async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
```

### Check Authentication
```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// In component
if (authStore.isAuthenticated) {
  console.log('User logged in as:', authStore.currentUser.name)
}

if (authStore.isAdmin) {
  console.log('This is an admin user')
}

if (authStore.isPeserta) {
  console.log('This is a peserta user')
}
```

### Get Current User
```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// In component
const currentUser = authStore.currentUser
console.log('User:', currentUser.name)
console.log('Email:', currentUser.email)
console.log('ID:', currentUser.id)
```

## API Service Methods

### GET Protected Endpoint
```javascript
import { fetchAPI } from '@/services/api'

// Automatic Bearer token injection
const kegiatan = await fetchAPI('kegiatan')
// Equivalent to:
// GET /v1/kegiatan
// Authorization: Bearer {token}
```

### POST Protected Endpoint
```javascript
import { fetchAPI } from '@/services/api'

// With Bearer token
const response = await fetchAPI('kegiatan', {
  method: 'POST',
  body: JSON.stringify({
    nama: 'New Kegiatan',
    tanggal: '2025-01-26'
  })
})
```

### Update Data
```javascript
import { updateAPI } from '@/services/api'

// With Bearer token
const response = await updateAPI('kegiatan', 1, {
  nama: 'Updated Kegiatan'
})
```

### Delete Data
```javascript
import { deleteAPI } from '@/services/api'

// With Bearer token
await deleteAPI('kegiatan', 1)
```

## Vue Component Examples

### Login Form
```vue
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    
    <button :disabled="authStore.isLoading" type="submit">
      {{ authStore.isLoading ? 'Processing...' : 'Login' }}
    </button>
    
    <div v-if="authStore.error" class="error">
      {{ authStore.error }}
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await authStore.loginAdmin(email.value, password.value)
    if (authStore.isAuthenticated) {
      router.push('/admin/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>
```

### Dashboard with Protected Data
```vue
<template>
  <div v-if="authStore.isAuthenticated">
    <h1>Welcome {{ authStore.currentUser.name }}</h1>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="kegiatan.length">
      <ul>
        <li v-for="k in kegiatan" :key="k.id">
          {{ k.nama }}
        </li>
      </ul>
    </div>
    
    <button @click="handleLogout">Logout</button>
  </div>
  
  <div v-else>
    <p>Not authenticated. Please <router-link to="/login">login</router-link></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { fetchAPI } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const kegiatan = ref([])
const loading = ref(false)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  loading.value = true
  try {
    kegiatan.value = await fetchAPI('kegiatan')
  } catch (error) {
    console.error('Error loading kegiatan:', error)
  } finally {
    loading.value = false
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>
```

### Header Component with User Info
```vue
<template>
  <header v-if="authStore.isAuthenticated" class="header">
    <div class="logo">SIAMIN</div>
    
    <div class="user-info">
      <span class="user-name">{{ authStore.currentUser.name }}</span>
      <button @click="handleLogout" class="logout-btn">
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #1e3a8a;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
</style>
```

### Protected Route Guard
```javascript
// router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    component: () => import('@/pages/Login.vue')
  },
  {
    path: '/admin/dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/peserta/dashboard',
    component: () => import('@/pages/PesertaDashboard.vue'),
    meta: { requiresAuth: true, role: 'peserta' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login')
    } else if (to.meta.role && authStore.userType !== to.meta.role) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
```

## Manual API Testing (Browser Console)

### Test Admin Login
```javascript
fetch('http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin', {
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
.then(d => {
  console.log('Response:', d)
  localStorage.setItem('auth_token', d.token)
})
```

### Test Protected Endpoint
```javascript
const token = localStorage.getItem('auth_token')
fetch('http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(d => console.log('Data:', d))
```

### Test Logout
```javascript
const token = localStorage.getItem('auth_token')
fetch('http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => {
  console.log('Logout:', d)
  localStorage.removeItem('auth_token')
})
```

## Environment Variables

### .env or vite.config.js
```javascript
// Development
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

// Production (example)
// VITE_API_BASE_URL=https://api.production.com/api/v1
```

## LocalStorage Helper Functions

### Store Token
```javascript
const storeToken = (token, userData, userType) => {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('user_data', JSON.stringify(userData))
  localStorage.setItem('user_type', userType)
}
```

### Get Token
```javascript
const getToken = () => {
  return localStorage.getItem('auth_token')
}
```

### Get User Data
```javascript
const getUserData = () => {
  const data = localStorage.getItem('user_data')
  return data ? JSON.parse(data) : null
}
```

### Clear Auth
```javascript
const clearAuth = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  localStorage.removeItem('user_type')
}
```

## Common Patterns

### Check Authentication in Setup
```javascript
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    
    // Restore session on app load
    authStore.restoreAuth()
    
    return {
      authStore
    }
  }
}
```

### Computed Properties
```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isAdmin = computed(() => authStore.isAdmin)
const isPeserta = computed(() => authStore.isPeserta)
const userName = computed(() => authStore.currentUser?.name || 'Guest')
const userEmail = computed(() => authStore.currentUser?.email)
```

### Conditional Rendering
```vue
<template>
  <!-- Show if authenticated -->
  <div v-if="authStore.isAuthenticated">
    <p>Welcome {{ authStore.currentUser.name }}</p>
  </div>
  
  <!-- Show if admin -->
  <div v-if="authStore.isAdmin">
    <a href="/admin/dashboard">Admin Panel</a>
  </div>
  
  <!-- Show if peserta -->
  <div v-if="authStore.isPeserta">
    <a href="/peserta/dashboard">My Portal</a>
  </div>
  
  <!-- Show if not authenticated -->
  <div v-if="!authStore.isAuthenticated">
    <router-link to="/login">Login</router-link>
  </div>
</template>
```

## Error Handling Patterns

### Try-Catch Pattern
```javascript
async function loadData() {
  try {
    const data = await fetchAPI('kegiatan')
    kegiatan.value = data
  } catch (error) {
    console.error('Error loading kegiatan:', error)
    error.value = 'Failed to load data'
  }
}
```

### API Error Handling
```javascript
const response = await fetch(url)
const data = await response.json()

if (!response.ok) {
  throw new Error(
    data.message || 
    `API Error: ${response.status} ${response.statusText}`
  )
}

return data
```

### Auth Error Handling
```javascript
try {
  await authStore.loginAdmin(email, password)
} catch (error) {
  if (error.message.includes('401')) {
    errorMsg.value = 'Invalid credentials'
  } else if (error.message.includes('403')) {
    errorMsg.value = 'Account not active'
  } else {
    errorMsg.value = error.message
  }
}
```

---

**Use these snippets as templates for your implementation.**
