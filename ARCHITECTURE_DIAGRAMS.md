# 🏗️ Architecture & Integration Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Vue 3 Frontend (Vite)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Pages (Vue Components)                 │  │
│  │  ┌─────────────┐          ┌─────────────────┐            │  │
│  │  │ Login.vue   │          │ LoginPeserta.vue│            │  │
│  │  └──────┬──────┘          └────────┬────────┘            │  │
│  │         │ handleLogin()           │ handleLogin()        │  │
│  │         └─────────────┬───────────┘                       │  │
│  │                       │                                    │  │
│  │                       ▼                                    │  │
│  │         ┌─────────────────────────┐                       │  │
│  │         │   Pinia Auth Store      │                       │  │
│  │         │  (stores/auth.js)       │                       │  │
│  │         ├─────────────────────────┤                       │  │
│  │         │ - currentUser           │                       │  │
│  │         │ - token                 │                       │  │
│  │         │ - userType              │                       │  │
│  │         │ - isAuthenticated       │                       │  │
│  │         ├─────────────────────────┤                       │  │
│  │         │ - loginAdmin()          │                       │  │
│  │         │ - loginPeserta()        │                       │  │
│  │         │ - logout()              │                       │  │
│  │         │ - restoreAuth()         │                       │  │
│  │         └────────────┬────────────┘                       │  │
│  │                      │                                    │  │
│  └──────────────────────┼────────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────▼────────────────────────────────────┐  │
│  │           API Service Layer                               │  │
│  │           (services/api.js)                               │  │
│  │                                                            │  │
│  │   ┌────────────────────────────────────────────┐          │  │
│  │   │ fetchAPI() - Auto Bearer Token Injection   │          │  │
│  │   │                                            │          │  │
│  │   │ 1. Get token from localStorage            │          │  │
│  │   │ 2. Add Authorization: Bearer {token}      │          │  │
│  │   │ 3. Make request to API                    │          │  │
│  │   │ 4. Handle response/error                  │          │  │
│  │   └────────────────────────────────────────────┘          │  │
│  │                                                            │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                             │
└───────────────────┼─────────────────────────────────────────────┘
                    │
    ┌───────────────▼──────────────────┐
    │   HTTP Client (Fetch API)         │
    │   Authorization: Bearer {token}   │
    │   Content-Type: application/json  │
    └───────────────┬──────────────────┘
                    │
    ┌───────────────▼──────────────────────────────────────┐
    │              Laravel API Server                       │
    │           (API Base: /api/v1)                         │
    ├────────────────────────────────────────────────────────┤
    │                                                         │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │         Auth Controller (Sanctum)                 │  │
    │  │  ┌──────────────────────────────────────────┐   │  │
    │  │  │ POST /auth/login-admin                   │   │  │
    │  │  │ - Validate email & password              │   │  │
    │  │  │ - Verify with Laravel Hash               │   │  │
    │  │  │ - Check account status                   │   │  │
    │  │  │ - Generate Sanctum token                 │   │  │
    │  │  │ - Return {token, user}                   │   │  │
    │  │  └──────────────────────────────────────────┘   │  │
    │  │  ┌──────────────────────────────────────────┐   │  │
    │  │  │ POST /auth/login-peserta                 │   │  │
    │  │  │ - Validate username & password           │   │  │
    │  │  │ - Verify with Laravel Hash               │   │  │
    │  │  │ - Check account status                   │   │  │
    │  │  │ - Generate Sanctum token                 │   │  │
    │  │  │ - Return {token, user}                   │   │  │
    │  │  └──────────────────────────────────────────┘   │  │
    │  │  ┌──────────────────────────────────────────┐   │  │
    │  │  │ POST /auth/logout                        │   │  │
    │  │  │ - Validate Bearer token                  │   │  │
    │  │  │ - Invalidate token                       │   │  │
    │  │  │ - Return success message                 │   │  │
    │  │  └──────────────────────────────────────────┘   │  │
    │  └──────────────────────────────────────────────────┘  │
    │                                                         │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │    Protected Routes (Sanctum Middleware)         │  │
    │  │  ┌──────────────────────────────────────────┐   │  │
    │  │  │ GET /kegiatan (requires Bearer token)    │   │  │
    │  │  │ GET /peserta (requires Bearer token)     │   │  │
    │  │  │ POST /sertifikat (requires Bearer token) │   │  │
    │  │  │ ... etc                                  │   │  │
    │  │  └──────────────────────────────────────────┘   │  │
    │  └──────────────────────────────────────────────────┘  │
    │                                                         │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │          Database                                │  │
    │  │  ┌─────────────┐  ┌──────────────────┐          │  │
    │  │  │ users       │  │ akun_peserta     │          │  │
    │  │  │             │  │                  │          │  │
    │  │  │ - id        │  │ - id             │          │  │
    │  │  │ - name      │  │ - name           │          │  │
    │  │  │ - email     │  │ - username       │          │  │
    │  │  │ - password  │  │ - password       │          │  │
    │  │  │ - status    │  │ - email          │          │  │
    │  │  │ - last_login│  │ - status         │          │  │
    │  │  │             │  │ - last_login     │          │  │
    │  │  └─────────────┘  └──────────────────┘          │  │
    │  └──────────────────────────────────────────────────┘  │
    │                                                         │
    └─────────────────────────────────────────────────────────┘
```

## Request/Response Flow - Admin Login

```
Frontend                          Backend
┌─────────────┐                  ┌──────────────┐
│ Login Form  │                  │ Auth Server  │
└──────┬──────┘                  └──────────────┘
       │
       │ email: admin@kemkominfo.go.id
       │ password: password123
       │
       ▼
   ┌──────────────────────────────────────────────────────┐
   │ POST /v1/auth/login-admin                            │
   │ Content-Type: application/json                       │
   │                                                       │
   │ {                                                     │
   │   "email": "admin@kemkominfo.go.id",                 │
   │   "password": "password123"                          │
   │ }                                                     │
   └──────────────────┬───────────────────────────────────┘
                      │ (HTTPS recommended)
                      ▼
              ┌──────────────────────────────────┐
              │ 1. Find user by email            │
              │ 2. Verify password with Hash     │
              │ 3. Check status = 'active'       │
              │ 4. Update last_login timestamp   │
              │ 5. Generate Sanctum token        │
              └──────────────────┬───────────────┘
                                 │
   ┌─────────────────────────────▼──────────────────────┐
   │ HTTP 200 OK                                         │
   │ Content-Type: application/json                      │
   │                                                      │
   │ {                                                    │
   │   "token": "1|abc123def456ghi789jkl...",           │
   │   "user": {                                         │
   │     "id": 1,                                        │
   │     "name": "Admin Kemkominfo",                    │
   │     "email": "admin@kemkominfo.go.id",             │
   │     "instansi": "Kementerian Komunikasi dan..."   │
   │   }                                                 │
   │ }                                                    │
   └─────────────────────┬──────────────────────────────┘
                         │
       ┌─────────────────▼──────────────────┐
       │ Store in localStorage:             │
       │ - auth_token = token               │
       │ - user_data = JSON(user)           │
       │ - user_type = "admin"              │
       └─────────────────┬──────────────────┘
                         │
       ┌─────────────────▼──────────────────┐
       │ Update Auth Store:                 │
       │ - currentUser = user               │
       │ - token = token                    │
       │ - userType = "admin"               │
       │ - isAuthenticated = true           │
       └─────────────────┬──────────────────┘
                         │
       ┌─────────────────▼──────────────────┐
       │ Vue Router:                        │
       │ - Redirect to /admin/dashboard     │
       └────────────────────────────────────┘
```

## Request/Response Flow - Protected Endpoint

```
Frontend                          Backend
┌──────────────────┐             ┌──────────────┐
│ Dashboard        │             │ API Server   │
│ (needs kegiatan) │             │ (protected)  │
└────────┬─────────┘             └──────────────┘
         │
         │ fetchAPI('/kegiatan')
         │
         ▼
    ┌────────────────────────────────────────┐
    │ 1. Get token from localStorage         │
    │    token = "1|abc123def456ghi789jkl"  │
    │                                        │
    │ 2. Build headers:                      │
    │    Authorization: Bearer {token}      │
    │                                        │
    │ 3. Make request                        │
    └────────────┬───────────────────────────┘
                 │
    ┌────────────▼──────────────────────────┐
    │ GET /v1/kegiatan                       │
    │ Authorization: Bearer {token}          │
    │ Accept: application/json               │
    └────────────┬──────────────────────────┘
                 │ (HTTPS recommended)
                 ▼
         ┌──────────────────────┐
         │ 1. Extract token from │
         │    Authorization header
         │ 2. Validate token with │
         │    Sanctum             │
         │ 3. If valid:           │
         │    - Get user from token
         │    - Query kegiatan    │
         │ 4. If invalid:         │
         │    - Return 401        │
         └──────────────┬─────────┘
                        │
    ┌───────────────────▼──────────────┐
    │ HTTP 200 OK                       │
    │                                   │
    │ [                                 │
    │   {                               │
    │     "id": 1,                      │
    │     "nama": "Kegiatan 1",        │
    │     "tanggal": "2025-01-26"      │
    │   },                              │
    │   ...                             │
    │ ]                                 │
    └───────────────────┬───────────────┘
                        │
    ┌───────────────────▼───────────────┐
    │ Component receives data           │
    │ Renders on page                   │
    └──────────────────────────────────┘
```

## Token Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│                  Token Lifecycle                         │
└──────────────────────────────────────────────────────────┘

1. LOGIN
   ├─ User submits credentials
   ├─ Server validates & creates token
   ├─ Returns token to client
   └─ Client stores in localStorage

2. STORAGE
   ├─ localStorage.auth_token = token
   ├─ localStorage.user_data = user info
   └─ localStorage.user_type = 'admin'|'peserta'

3. USAGE
   ├─ API calls include: Authorization: Bearer {token}
   ├─ Server validates token on each request
   └─ Server returns data if token valid

4. PERSISTENCE
   ├─ Page refresh - restore from localStorage
   ├─ Tab close/open - restore from localStorage
   └─ Browser close/open - restore from localStorage

5. EXPIRATION (if configured)
   ├─ Token expires (e.g., 24 hours)
   ├─ Next API call returns 401
   ├─ Client detects and prompts re-login
   └─ New token obtained on re-login

6. LOGOUT
   ├─ Client sends: POST /auth/logout with Bearer {token}
   ├─ Server invalidates token
   ├─ Client removes from localStorage
   └─ Subsequent requests use no token

7. SECURITY STATES
   ├─ Valid & Active
   │  └─ API requests work normally
   ├─ Expired
   │  └─ API returns 401 Unauthorized
   ├─ Revoked
   │  └─ API returns 401 Unauthorized
   └─ Invalid
      └─ API returns 401 Unauthorized
```

## Error Handling Flow

```
┌────────────────┐
│ Login Attempt  │
└───────┬────────┘
        │
        ▼
   ┌─────────────────────────┐
   │ Validate Input          │
   └────┬────────────────────┘
        │
        ├─ Email/Username empty?
        │  └─ Show "Field required"
        │
        ├─ Password empty?
        │  └─ Show "Field required"
        │
        └─ Continue
           │
           ▼
   ┌──────────────────────────┐
   │ API Request              │
   └────┬─────────────────────┘
        │
        ├─ Network error?
        │  └─ Show "Connection failed"
        │
        ├─ Response 400/422?
        │  └─ Show response.message
        │
        ├─ Response 401?
        │  └─ Show "Invalid credentials"
        │
        ├─ Response 403?
        │  └─ Show "Account not active"
        │
        ├─ Response 5xx?
        │  └─ Show "Server error"
        │
        └─ Response 200? ✅
           ├─ Save token
           ├─ Save user
           ├─ Update auth state
           └─ Redirect to dashboard
```

## Protected Route Guard Flow

```
┌────────────────────┐
│ User navigates to  │
│ /admin/dashboard   │
└────────┬───────────┘
         │
         ▼
    ┌──────────────────┐
    │ Router Guard     │
    │ Check if user is │
    │ authenticated    │
    └────┬─────────────┘
         │
         ├─ authStore.isAuthenticated?
         │
         ├─ YES ✅
         │  ├─ Check userType
         │  ├─ Admin? → Allow
         │  ├─ Peserta? → Redirect to /login-peserta
         │  └─ None? → Redirect to /login
         │
         └─ NO ❌
            ├─ Check localStorage
            ├─ Has token + user? → Restore & allow
            └─ No token? → Redirect to /login
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     App.vue                             │
│  (Initialize auth on mount)                             │
│  onMounted: authStore.restoreAuth()                     │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    ┌─────────────┐  ┌──────────────┐
    │ Login.vue   │  │ Dashboard    │
    │             │  │              │
    │ Admin login │  │ Uses fetchAPI│
    │ form        │  │ with token   │
    └──────┬──────┘  └──────────────┘
           │
           │ authStore.loginAdmin()
           │
           ▼
    ┌────────────────────┐
    │ Pinia Auth Store   │
    │                    │
    │ State:             │
    │ - token            │
    │ - currentUser      │
    │ - isAuthenticated  │
    │                    │
    │ Actions:           │
    │ - loginAdmin()     │
    │ - loginPeserta()   │
    │ - logout()         │
    │ - restoreAuth()    │
    └──────┬─────────────┘
           │
           │ Provides state to all components
           │
           ▼
    ┌────────────────────────┐
    │ Header.vue             │
    │ Shows current user     │
    │ Logout button          │
    └────────────────────────┘
```

## Token Storage & Access

```
┌──────────────────────────────────────────────────┐
│           Browser Storage                         │
├──────────────────────────────────────────────────┤
│                                                  │
│ localStorage                                     │
│ ├─ auth_token = "1|abc123..."                   │
│ ├─ user_data = '{"id":1,"name":"Admin"}'       │
│ └─ user_type = "admin"                          │
│                                                  │
│ Pinia Auth Store (in memory)                    │
│ ├─ token = "1|abc123..."                        │
│ ├─ currentUser = {id:1, name:"Admin"}          │
│ └─ userType = "admin"                           │
│                                                  │
│ API Request Headers                             │
│ ├─ Authorization: "Bearer 1|abc123..."         │
│ ├─ Content-Type: "application/json"            │
│ └─ Accept: "application/json"                  │
│                                                  │
└──────────────────────────────────────────────────┘

Access Pattern:
┌─────────────────────┐
│ Component needs     │
│ authentication      │
└──────────┬──────────┘
           │
           ▼
    ┌─────────────────┐
    │ authStore.      │
    │ isAuthenticated │◄─ Reading from memory
    └─────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ Make API call        │
    │ fetchAPI('/path')    │
    └──────────┬───────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Get token from       │
        │ localStorage         │◄─ Reading from localStorage
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Add to header        │
        │ Authorization:       │
        │ Bearer {token}       │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Send request to API  │
        └──────────────────────┘
```

---

**These diagrams illustrate the complete flow of authentication and API integration.**
