# ✅ Integration Checklist - API Login Sanctum

## Frontend Modifications

### Auth Store (`src/stores/auth.js`)
- [x] Updated `loginAdmin()` to use Sanctum API directly
  - [x] POST to `/v1/auth/login-admin`
  - [x] Validates response contains token and user
  - [x] Saves token to localStorage
  - [x] Sets userType = 'admin'
  - [x] Resets isLoading flag

- [x] Updated `loginPeserta()` to use Sanctum API directly
  - [x] POST to `/v1/auth/login-peserta`
  - [x] Validates response contains token and user
  - [x] Saves token to localStorage
  - [x] Sets userType = 'peserta'
  - [x] Resets isLoading flag

- [x] Updated `logout()` to call API endpoint
  - [x] POST to `/v1/auth/logout` with Bearer token
  - [x] Clears localStorage on success or error
  - [x] Handles API errors gracefully

- [x] Existing `restoreAuth()` still works
  - [x] Restores session from localStorage on app load

### API Service (`src/services/api.js`)
- [x] Updated `fetchAPI()` to include Authorization header
  - [x] Gets token from localStorage
  - [x] Adds `Authorization: Bearer {token}` to headers
  - [x] Header only added if token exists

### Login Components
- [x] **Login.vue** - No changes needed (uses auth store)
- [x] **LoginPeserta.vue** - No changes needed (uses auth store)
  - [x] Both components handle auth store response correctly
  - [x] Both redirect on success
  - [x] Both display errors correctly

## API Expectations

### Response Format Requirements

**Login Success (200 OK):**
```json
{
  "token": "string",
  "user": {
    "id": integer,
    "name": "string",
    "email": "string|null",
    "username": "string|null",
    "nip": "string|null",
    "instansi": "string|null"
  }
}
```

**Login Failure (4xx/5xx):**
```json
{
  "message": "Error message"
}
```

**Logout Success (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

## Testing Checklist

### Manual Testing (Before Deployment)

#### Admin Login Flow
- [ ] Navigate to `/login`
- [ ] Enter valid admin email and password
- [ ] Click "Login" button
- [ ] Verify API call is made to `/v1/auth/login-admin`
- [ ] Verify response has token and user
- [ ] Verify token is saved to localStorage
- [ ] Verify redirect to `/admin/dashboard`
- [ ] Verify user info displays in header/sidebar
- [ ] Verify API requests now include Bearer token

#### Peserta Login Flow
- [ ] Navigate to `/login-peserta`
- [ ] Enter valid peserta username and password
- [ ] Click "Login" button
- [ ] Verify API call is made to `/v1/auth/login-peserta`
- [ ] Verify response has token and user
- [ ] Verify token is saved to localStorage
- [ ] Verify redirect to `/peserta/dashboard`
- [ ] Verify user info displays in portal
- [ ] Verify API requests now include Bearer token

#### Logout Flow
- [ ] Click logout button
- [ ] Verify API call is made to `/v1/auth/logout` with Bearer token
- [ ] Verify token is removed from localStorage
- [ ] Verify redirect to landing page
- [ ] Verify user cannot access protected routes

#### Error Handling
- [ ] Test with invalid email/password (Admin)
  - [ ] Error message displays: "Email atau password tidak valid"
  - [ ] Form stays visible
  - [ ] Token not saved
  
- [ ] Test with invalid username/password (Peserta)
  - [ ] Error message displays: "Username atau password tidak valid"
  - [ ] Form stays visible
  - [ ] Token not saved

- [ ] Test with inactive account
  - [ ] Error message displays from server
  - [ ] Token not saved

#### Session Recovery
- [ ] Login successfully
- [ ] Refresh page with F5
- [ ] Verify user is still logged in
- [ ] Verify dashboard loads without re-login

#### Protected Routes
- [ ] Logout
- [ ] Try to access `/admin/dashboard` directly
- [ ] Verify redirect to `/login`
- [ ] Try to access `/peserta/dashboard` directly
- [ ] Verify redirect to `/login-peserta`

### Browser Console Checks
While testing, check browser console for:
- [ ] No CORS errors
- [ ] No 401 Unauthorized errors on protected endpoints
- [ ] `[Auth] ✅ Admin login successful` or `[Auth] ✅ Peserta login successful` logs
- [ ] `[Auth] ✅ User logged out` on logout

## Potential Issues & Solutions

### Issue: 401 Unauthorized errors after login
**Solution:** 
- Check if token is being saved to localStorage
- Check if Bearer token format is correct: `Bearer {token}`
- Verify server is returning token in response

### Issue: CORS errors
**Solution:**
- Ensure API server has correct CORS headers
- Verify VITE_API_BASE_URL is correct
- Check server's CORS configuration

### Issue: Token not persisting after refresh
**Solution:**
- Check if localStorage is enabled
- Verify restoreAuth() is called in App.vue onMounted
- Check browser DevTools > Application > Local Storage

### Issue: Logout not working
**Solution:**
- Check if logout endpoint exists: `/v1/auth/logout`
- Verify Bearer token is being sent
- Check server logs for errors

## Performance Considerations

- ✅ Tokens stored in localStorage (fast access)
- ✅ No unnecessary API calls
- ✅ Session restored from localStorage (no extra API call on refresh)
- ✅ Loading states prevent double-submit

## Security Considerations

### Current Implementation
- ✅ Tokens stored and transmitted
- ⚠️ Using localStorage (consider HttpOnly cookies for production)
- ✅ Bearer token format standard
- ✅ Server validates token on each request

### Recommendations for Production
1. Implement token refresh mechanism
2. Use HttpOnly cookies instead of localStorage
3. Add HTTPS enforcement
4. Implement rate limiting on login endpoint
5. Add login attempt monitoring
6. Consider implementing MFA

## Rollback Plan (If Needed)

If issues occur, can revert to mock fallback:

1. In `auth.js`, wrap API call in try-catch
2. Add fallback to mockLoginAdmin/mockLoginPeserta
3. This won't break existing functionality

## Files Modified Summary

| File | Changes | Impact |
|------|---------|--------|
| `src/stores/auth.js` | Updated login/logout to use API | High - Core auth logic |
| `src/services/api.js` | Added Bearer token header | High - All API requests |
| No component changes needed | Login/Peserta components unchanged | Low - Backward compatible |

## Sign-off

- [ ] All manual tests passed
- [ ] No console errors
- [ ] API integration working
- [ ] Token management working
- [ ] Protected routes working
- [ ] Error handling working
- [ ] Ready for deployment

---

**Status:** ✅ Ready for Testing
**Last Updated:** 2025-01-26
**Integration Type:** Laravel Sanctum Bearer Token
