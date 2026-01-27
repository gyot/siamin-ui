# SIAMIN Login - Testing Checklist

## Pre-Test Setup

### Backend Setup
- [ ] Navigate to `C:\Users\MyPC One Pro L\Downloads\siamin-back-end`
- [ ] Run: `php artisan migrate`
- [ ] Run: `php artisan db:seed --class=AuthTestSeeder`
- [ ] Start server: `php artisan serve --port=8000`
- [ ] Verify: Server shows "Started Laravel development server: http://127.0.0.1:8000"

### Frontend Status
- [ ] Verify Vue dev server running on http://localhost:5174
- [ ] Open browser and check landing page loads

---

## Test Case 1: Admin Login

### Setup
- [ ] Navigate to http://localhost:5174/login

### Test Steps
1. [ ] See "Login Administrator" form displayed
2. [ ] Email field visible and editable
3. [ ] Password field visible and editable
4. [ ] "Show/Hide password" button works
5. [ ] "Ingat saya" checkbox visible
6. [ ] "Lupa password?" link visible
7. [ ] Demo credentials shown: admin@kemkominfo.go.id

### Login Action
1. [ ] Clear email field
2. [ ] Enter: `admin@kemkominfo.go.id`
3. [ ] Enter password: `password123`
4. [ ] Click "Login" button
5. [ ] Button shows "Memproses..." while loading
6. [ ] No error message appears

### Expected Results
- [ ] Page redirects to `/admin/dashboard`
- [ ] User profile shows admin name
- [ ] Logout button visible in header
- [ ] localStorage contains `auth_token`
- [ ] localStorage contains user data

---

## Test Case 2: Admin Login - Invalid Credentials

### Setup
- [ ] Navigate to http://localhost:5174/login
- [ ] Clear any previous session

### Test Steps
1. [ ] Enter email: `admin@kemkominfo.go.id`
2. [ ] Enter password: `wrongpassword`
3. [ ] Click "Login" button

### Expected Results
- [ ] Error message displays: "Email atau password tidak valid"
- [ ] User stays on login page (no redirect)
- [ ] Login button becomes enabled again
- [ ] localStorage remains empty

---

## Test Case 3: Admin Login - Empty Fields

### Setup
- [ ] Navigate to http://localhost:5174/login

### Test Steps
1. [ ] Leave email field empty
2. [ ] Leave password field empty
3. [ ] Click "Login" button

### Expected Results
- [ ] Browser shows HTML5 validation message
- [ ] API call is NOT made
- [ ] Error message shows if form skips validation

---

## Test Case 4: Peserta Login

### Setup
- [ ] Navigate to http://localhost:5174/login-peserta

### Test Steps
1. [ ] See "Login Peserta" form displayed
2. [ ] Username field visible
3. [ ] Password field visible
4. [ ] Enter username: `testpeserta`
5. [ ] Enter password: `password123`
6. [ ] Click "Login" button

### Expected Results
- [ ] Page redirects to `/peserta/dashboard`
- [ ] Peserta profile displayed
- [ ] Token stored in localStorage
- [ ] "Masuk sebagai admin?" link at bottom

---

## Test Case 5: Peserta Login - Invalid Credentials

### Setup
- [ ] Navigate to http://localhost:5174/login-peserta

### Test Steps
1. [ ] Enter username: `testpeserta`
2. [ ] Enter password: `wrongpassword`
3. [ ] Click "Login" button

### Expected Results
- [ ] Error message displays: "Username atau password tidak valid"
- [ ] User stays on login page
- [ ] localStorage remains empty

---

## Test Case 6: Navigation Between Login Pages

### Setup
- [ ] Navigate to http://localhost:5174/login

### Test Steps
1. [ ] See "Masuk sebagai peserta?" link
2. [ ] Click link
3. [ ] Should redirect to `/login-peserta`
4. [ ] See "Masuk sebagai admin?" link
5. [ ] Click link
6. [ ] Should redirect to `/login`

### Expected Results
- [ ] Navigation works both directions
- [ ] Forms display correctly
- [ ] No console errors

---

## Test Case 7: Logout

### Setup
- [ ] Login as admin (see Test Case 1)
- [ ] Should be on `/admin/dashboard`

### Test Steps
1. [ ] Click on user profile in header (top right)
2. [ ] See profile dropdown menu
3. [ ] Click "Logout" button
4. [ ] Confirm logout action

### Expected Results
- [ ] Page redirects to home or login
- [ ] localStorage cleared (`auth_token` removed)
- [ ] Trying to access `/admin/dashboard` redirects to login

---

## Test Case 8: Session Persistence

### Setup
- [ ] Login as admin (see Test Case 1)
- [ ] Should be on `/admin/dashboard`

### Test Steps
1. [ ] Refresh page (F5)
2. [ ] Still on `/admin/dashboard`
3. [ ] User profile still visible

### Expected Results
- [ ] Session persists after refresh
- [ ] Token loaded from localStorage
- [ ] User data still available

---

## Test Case 9: Protected Route Access

### Setup
- [ ] Logout or clear localStorage

### Test Steps
1. [ ] Manually navigate to: http://localhost:5174/admin/dashboard
2. [ ] Should redirect to `/login`
3. [ ] Login successfully
4. [ ] Navigate to protected route
5. [ ] Should display page

### Expected Results
- [ ] Unauthenticated users cannot access protected routes
- [ ] Automatic redirect to login works
- [ ] Post-login redirect to requested route (optional)

---

## Test Case 10: API Response Inspection

### Setup
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Navigate to login page

### Test Steps
1. [ ] Login as admin
2. [ ] Look for POST request to `/api/v1/auth/login-admin`
3. [ ] Click on request to view details
4. [ ] Check Response tab

### Expected Results
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "Bearer eyJ0eXAi...",
  "user": {
    "id": 1,
    "name": "Admin Test User",
    "email": "admin@kemkominfo.go.id",
    "role": "admin"
  }
}
```

---

## Test Case 11: Error Message Display

### Setup
- [ ] Backend server STOPPED (to simulate network error)

### Test Steps
1. [ ] Navigate to http://localhost:5174/login
2. [ ] Enter credentials: admin@kemkominfo.go.id / password123
3. [ ] Click "Login" button

### Expected Results
- [ ] Error message displays (e.g., "Failed to fetch")
- [ ] User friendly error message shown
- [ ] Login button becomes enabled again
- [ ] No server crash messages

---

## Test Case 12: Browser Console

### Setup
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Clear console

### Test Steps
1. [ ] Perform login test case 1
2. [ ] Check console for messages

### Expected Results
- [ ] Console shows: `[Auth] Attempting admin login via API...`
- [ ] Console shows: `[Auth] ✅ Admin login successful: Admin Test User`
- [ ] No error messages or warnings
- [ ] No red X marks in DevTools

---

## Test Case 13: LocalStorage Inspection

### Setup
- [ ] Open DevTools (F12)
- [ ] Go to Application tab
- [ ] Expand "Local Storage"
- [ ] Select current origin

### Test Steps
1. [ ] Before login: Verify no auth_token
2. [ ] Perform login (Test Case 1)
3. [ ] After login: Verify auth_token exists
4. [ ] Click on auth_token to view value
5. [ ] Logout (Test Case 7)
6. [ ] Verify auth_token removed

### Expected Results
- [ ] Token stored as string starting with "Bearer"
- [ ] User data stored as JSON string
- [ ] User type stored as "admin" or "peserta"
- [ ] All cleared on logout

---

## Test Case 14: Password Show/Hide Toggle

### Setup
- [ ] Navigate to http://localhost:5174/login

### Test Steps
1. [ ] Enter password: `password123`
2. [ ] Click "eye" icon to show password
3. [ ] Verify text is visible
4. [ ] Click "eye icon" again to hide
5. [ ] Verify text is hidden (dots/asterisks)

### Expected Results
- [ ] Toggle works correctly
- [ ] Password value remains the same
- [ ] Icon changes based on state

---

## Test Case 15: Mobile Responsiveness

### Setup
- [ ] Open DevTools (F12)
- [ ] Click device toolbar (mobile view)
- [ ] Set to iPhone 12 or similar

### Test Steps
1. [ ] Navigate to http://localhost:5174/login
2. [ ] Verify form is responsive
3. [ ] Try entering credentials
4. [ ] Attempt login

### Expected Results
- [ ] Form fits on mobile screen
- [ ] All elements readable and clickable
- [ ] Login works same as desktop
- [ ] No layout broken

---

## Summary

### Passed Tests: _____ / 15
### Failed Tests: _____ / 15

### Known Issues
- [ ] (List any issues found)

### Notes
- [ ] (Any additional observations)

### Tested By: _________________
### Test Date: _________________
### Status: [ ] Ready for Deployment  [ ] Needs Fixes

---

## Critical Path Tests (Minimum)

If time is limited, test these minimum cases:

1. ✓ Admin Login with valid credentials (Test Case 1)
2. ✓ Admin Login with invalid credentials (Test Case 2)
3. ✓ Peserta Login with valid credentials (Test Case 4)
4. ✓ Peserta Login with invalid credentials (Test Case 5)
5. ✓ Logout functionality (Test Case 7)
6. ✓ Protected route access (Test Case 9)

If all above pass → Login system is functional ✅
