# 🔄 Fix: Restart Dev Server

**Problem:** API masih menggunakan localhost lama  
**Cause:** Dev server belum di-restart setelah update kode  
**Solution:** Restart dev server

---

## ⚡ Quick Fix (1 minute)

### Step 1: Stop Dev Server
Di terminal yang menjalankan dev server (PowerShell):

```powershell
# Press Ctrl+C untuk stop
Ctrl + C
```

Tunggu sampai keluar dari process.

---

### Step 2: Restart Dev Server

```powershell
# Restart dengan npm run dev
npm run dev
```

Tunggu sampai console menunjukkan:
```
VITE v... ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Press h + enter to show help
```

---

### Step 3: Test Again

1. Buka browser `http://localhost:5173`
2. Navigate ke login page
3. Coba login lagi
4. Cek console (F12) - seharusnya tidak ada CORS error

---

## 🔍 Verify Changes

Setelah restart, pastikan API menggunakan endpoint yang benar.

Di browser console (F12):
```javascript
// Paste ini di console
fetch('https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'kegiatan')
  .then(r => {
  })
  .catch(e => console.error('❌ Error:', e.message))
```

---

## ✅ What Should Happen After Restart

**Before (Old):**
```
POST http://127.0.0.1:8000/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin
```

**After (New):**
```
POST https://backend-siamin.bpmpntb.id/import.meta.env.VITE_API_BASE_URL+'/api/v1/'auth/login-admin
```

---

## 📝 If Still Getting Error After Restart

**Check:**
1. Did you restart dev server? (Need to fully stop and restart)
2. Is backend online? (Check: `ping backend-siamin.bpmpntb.id`)
3. Is backend CORS enabled? (Most likely issue)
4. Are credentials correct?

**For CORS error:**
→ See `FIX_CORS_ISSUE.md` for backend configuration

---

## 💡 Pro Tips

### Clear Browser Cache (if needed)
```javascript
// In console
localStorage.clear()
location.reload()
```

### Force Clear Vite Cache
If still having issues after restart:
```powershell
# Delete node_modules cache
rm -r node_modules/.vite -Force

# Then restart dev server
npm run dev
```

---

**Try restarting dev server now!** 🚀

Should work after that. Let me know if you still get CORS error!
