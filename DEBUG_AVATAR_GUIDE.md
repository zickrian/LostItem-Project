# 🔍 Debug Guide - Avatar Tidak Muncul

## 🎯 Langkah-langkah Debug

### **Step 1: Hard Refresh Browser**
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

---

### **Step 2: Logout & Login Lagi**

1. **Logout** dari aplikasi
2. **Clear browser cache** (opsional tapi direkomendasikan)
3. **Login lagi** dengan Google
4. **Buka Console** (F12) → Tab **Console**

---

### **Step 3: Cek Console Logs**

Setelah login, harus ada logs seperti ini:

#### **✅ Di Auth Callback**
```
User logged in: your-email@mhs.dinus.ac.id

🔍 User metadata: {
  avatar_url: "https://lh3.googleusercontent.com/...",
  picture: "https://lh3.googleusercontent.com/...",
  photo: "https://lh3.googleusercontent.com/...",
  full_name: "Your Name"
}

📸 Google Avatar URL: https://lh3.googleusercontent.com/...

✅ User saved successfully: [{
  id: "...",
  name: "Your Name",
  email: "your-email@mhs.dinus.ac.id",
  avatar_url: "https://lh3.googleusercontent.com/..."
}]

➡️ Redirecting to dashboard...
```

#### **✅ Di DashboardLayout**
```
✅ User found in DB: {
  id: "...",
  name: "Your Name",
  email: "your-email@mhs.dinus.ac.id",
  avatar_url: "https://lh3.googleusercontent.com/..."
}
```

#### **✅ Di Settings Page**
```
👤 User data in Settings: {
  id: "...",
  name: "Your Name",
  email: "your-email@mhs.dinus.ac.id",
  avatar_url: "https://lh3.googleusercontent.com/..."
}
```

---

### **Step 4: Cek Error Messages**

#### **❌ Kalau Ada Error Seperti Ini:**

**Error 1: "User metadata is empty"**
```
🔍 User metadata: {
  avatar_url: undefined,
  picture: undefined,
  photo: undefined,
  full_name: "Your Name"
}
📸 Google Avatar URL: undefined
```

**Solusi**:
- Google tidak memberikan avatar URL
- Cek **Google Account** settings
- Pastikan ada foto profile di akun Google
- Try login dengan browser lain

---

**Error 2: "Failed to load avatar"**
```
❌ Failed to load avatar (sidebar): https://lh3.googleusercontent.com/...
```

**Solusi**:
- URL avatar valid tapi gagal load
- Coba buka URL di tab baru
- Kalau 403/404 → Google blocking
- Check browser console untuk CORS error

---

**Error 3: "Avatar URL is null in database"**
```
✅ User found in DB: {
  avatar_url: null
}
```

**Solusi**:
- Avatar tidak tersimpan ke database
- Perlu delete row & login ulang
- Atau manual update database (lihat Step 5)

---

### **Step 5: Manual Check Database**

1. Buka **Supabase Dashboard**
2. Pergi ke **Table Editor** → **users**
3. Cari row dengan email kamu
4. Cek kolom **avatar_url**

#### **Expected Value:**
```
https://lh3.googleusercontent.com/a/ACg8ocK...
```

#### **❌ Kalau NULL atau Empty:**
Run SQL ini di **SQL Editor**:

```sql
-- Cek user metadata dari auth.users
SELECT 
  email,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  raw_user_meta_data->>'picture' as picture,
  raw_user_meta_data->>'photo' as photo
FROM auth.users
WHERE email = 'your-email@mhs.dinus.ac.id';
```

**Kalau ada avatar URL di auth.users**, manual update:
```sql
UPDATE public.users
SET avatar_url = (
  SELECT COALESCE(
    raw_user_meta_data->>'avatar_url',
    raw_user_meta_data->>'picture',
    raw_user_meta_data->>'photo'
  )
  FROM auth.users
  WHERE auth.users.email = public.users.email
)
WHERE email = 'your-email@mhs.dinus.ac.id';
```

---

### **Step 6: Test Avatar Display**

Setelah perbaikan, cek:

1. **Sidebar** (kiri) → Foto muncul? ✅
2. **Settings** → Foto muncul? ✅
3. **Mobile Header** → Foto muncul? ✅
4. **Network Tab** (F12) → Ada request ke `googleusercontent.com`? ✅

---

## 🐛 Common Issues & Solutions

### **Issue 1: Avatar selalu default**
**Symptom**: Selalu muncul `default-avatar.svg`

**Debug Steps**:
1. Cek Console → Ada error `Failed to load avatar`?
2. Cek Database → `avatar_url` NULL?
3. Cek auth metadata → Ada `avatar_url`?

**Solution**:
- Logout & login lagi
- Manual update database (Step 5)
- Pastikan foto profile ada di Google Account

---

### **Issue 2: Avatar 403 Forbidden**
**Symptom**: Console error: `403 Forbidden` on avatar URL

**Cause**: Google blocking external access

**Solution**:
1. Cek Google Account → Privacy settings
2. Make sure profile photo is **public**
3. Try different Google account

---

### **Issue 3: Avatar_url tidak ada di user_metadata**
**Symptom**: 
```
📸 Google Avatar URL: undefined
```

**Cause**: Google OAuth tidak return avatar

**Solution**:
1. Cek OAuth scope di Supabase Dashboard
2. Should include: `openid`, `email`, `profile`
3. Re-authorize OAuth app

**Check Scopes**:
Supabase Dashboard → Authentication → Providers → Google → Scopes:
```
openid email profile
```

---

### **Issue 4: Image component error**
**Symptom**: Next.js error about image domain

**Solution**:
Add to `next.config.ts`:
```typescript
images: {
  domains: ['lh3.googleusercontent.com'],
  unoptimized: true,
}
```

Or use `unoptimized` prop (already added ✅)

---

## 📋 Complete Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Logout & login lagi
- [ ] Console logs muncul semua (auth callback, DashboardLayout, Settings)
- [ ] No error messages di Console
- [ ] Database `avatar_url` terisi dengan URL Google
- [ ] Avatar muncul di Sidebar
- [ ] Avatar muncul di Settings
- [ ] Avatar muncul di Mobile header
- [ ] Network tab shows successful image load
- [ ] No 403/404 errors

---

## 🔧 Emergency Fix

Kalau semua gagal, run SQL ini untuk set default avatar:

```sql
-- Set default avatar untuk semua user yang NULL
UPDATE public.users
SET avatar_url = '/default-avatar.svg'
WHERE avatar_url IS NULL OR avatar_url = '';
```

Tapi ini temporary, harusnya Google avatar yang muncul!

---

## 📞 Report Issue

Kalau masih tidak work, copy paste ini:

1. **Console logs** (semua yang ada di Console setelah login)
2. **Database screenshot** (row user kamu di table users)
3. **Network tab** (screenshot failed requests)
4. **Browser & OS** (Chrome 118 on Windows, dll)

---

**Last Updated**: October 4, 2025
**Status**: Debug mode enabled ✅
