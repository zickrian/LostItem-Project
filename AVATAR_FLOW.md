# 📸 Avatar Flow Documentation

## 🎯 Cara Kerja Avatar System

### **Flow 1: Login Pertama Kali**
```
User Login dengan Google OAuth
    ↓
auth/callback page
    ↓
Simpan data user ke database
    ├── name: dari Google
    ├── email: dari Google
    └── avatar_url: dari Google (user_metadata.avatar_url)
    ↓
Redirect ke /dashboard
    ↓
DashboardLayout fetch user dari database
    ↓
Tampilkan avatar Google di Sidebar
```

**Hasil**: Foto profil = Foto Google ✅

---

### **Flow 2: User Update Avatar di Settings**
```
User pergi ke /dashboard/setting
    ↓
Pilih foto baru (Choose File)
    ↓
Klik "Simpan Perubahan"
    ↓
Upload foto ke Supabase Storage bucket 'avatars'
    ├── Path: avatars/{userId}/{timestamp}.jpg
    └── Get public URL
    ↓
Update database users.avatar_url dengan URL baru
    ↓
Refresh page (router.refresh())
    ↓
DashboardLayout fetch user dari database
    ↓
Tampilkan avatar custom di Sidebar
```

**Hasil**: Foto profil = Foto custom yang di-upload ✅

---

### **Flow 3: User Login Lagi (Setelah Upload Custom Avatar)**
```
User Login dengan Google OAuth
    ↓
auth/callback page
    ↓
Cek apakah user sudah ada di database
    ├── User tidak ada → Save dengan avatar Google
    └── User sudah ada:
        ├── Avatar = URL Supabase Storage? → KEEP avatar custom ✅
        └── Avatar = URL Google? → Update dengan avatar Google terbaru
    ↓
Update last_login saja, avatar TIDAK di-overwrite
    ↓
Redirect ke /dashboard
    ↓
DashboardLayout fetch user dari database
    ↓
Tampilkan avatar custom (bukan Google)
```

**Hasil**: Foto profil tetap custom, TIDAK kembali ke Google ✅

---

## 🔍 Prioritas Avatar

Sistem menggunakan prioritas berikut:

### **1. Custom Avatar (Supabase Storage)** - Prioritas TERTINGGI
```
URL contains: "supabase.co/storage"
Example: https://xxx.supabase.co/storage/v1/object/public/avatars/user-123/1696435200000.jpg
```
- ✅ User sudah upload foto sendiri
- ✅ Tidak boleh di-overwrite saat login ulang
- ✅ Ditambahkan cache busting: `?t={timestamp}`

### **2. Google Avatar** - Prioritas KEDUA
```
URL contains: "googleusercontent.com" atau "lh3.googleusercontent.com"
Example: https://lh3.googleusercontent.com/a/ACg8ocK...
```
- ✅ Foto dari akun Google
- ✅ Digunakan saat login pertama kali
- ✅ Di-update saat login ulang (jika user ganti foto Google)
- ❌ Tidak ditambahkan cache busting (tidak perlu)

### **3. Default Avatar** - Fallback
```
Path: /default-avatar.svg
```
- ✅ Digunakan jika tidak ada avatar sama sekali
- ✅ Static file di folder `public/`

---

## 🛠️ Technical Implementation

### **1. Database Schema**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,  -- Bisa URL Google atau Supabase Storage
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW()
);
```

### **2. Supabase Storage**
```
Bucket: avatars
├── Public: ✅ Yes
├── File size limit: 2MB
└── Allowed formats: image/*

Structure:
avatars/
├── {user-id-1}/
│   └── {timestamp}.jpg
├── {user-id-2}/
│   └── {timestamp}.png
└── {user-id-3}/
    └── {timestamp}.jpg
```

### **3. RLS Policies**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload avatar" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'avatars');

-- Public read access
CREATE POLICY "Public read access for avatars" 
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'avatars');

-- Users can delete own avatar
CREATE POLICY "Users can delete own avatar" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'avatars');
```

---

## 🔄 Cache Busting Strategy

### **Custom Avatar (Supabase Storage)**
```typescript
// ✅ ADD cache busting
if (avatarUrl.includes('supabase.co/storage')) {
  avatarUrl = `${avatarUrl}?t=${Date.now()}`;
}
```
**Why?** Supabase Storage bisa di-cache oleh browser/CDN

### **Google Avatar**
```typescript
// ❌ NO cache busting needed
if (avatarUrl.includes('googleusercontent.com')) {
  // Use as-is
}
```
**Why?** Google sudah handle caching sendiri

---

## 🖼️ Image Component Props

### **Settings Page Avatar**
```tsx
<Image
  key={avatarPreview}        // Force re-render on change
  src={avatarPreview || "/default-avatar.svg"}
  alt="Avatar"
  width={96}
  height={96}
  className="rounded-full border-4 border-blue-600 object-cover"
  unoptimized                 // Disable Next.js optimization
/>
```

### **Sidebar Avatar**
```tsx
<Image
  key={user.avatar_url}       // Force re-render on change
  src={user.avatar_url || "/default-avatar.svg"}
  alt="Avatar"
  width={48}
  height={48}
  className="rounded-full border-2 border-blue-600 object-cover"
  unoptimized                 // Disable Next.js optimization
/>
```

**Why `unoptimized`?**
- Next.js Image optimization bisa cache gambar
- Kita mau gambar selalu up-to-date
- Especially penting untuk custom uploads

**Why `key` prop?**
- Force React re-render saat URL berubah
- Prevent stale image display

---

## 📝 Code Locations

### **1. Auth Callback** - `src/app/auth/callback/page.tsx`
- Handle login dengan Google
- Save user to database
- **TIDAK overwrite custom avatar**

### **2. Dashboard Layout** - `src/components/DashboardLayout.tsx`
- Fetch user data from database
- Pass user data ke Sidebar
- Handle cache busting

### **3. Settings Page** - `src/app/dashboard/setting/page.tsx`
- Upload custom avatar
- Update database
- Trigger refresh

### **4. Sidebar** - `src/components/Sidebar.tsx`
- Display avatar
- Used across all dashboard pages

### **5. Storage Helper** - `src/lib/supabaseStorage.ts`
- `uploadAvatar()` - Upload custom avatar
- `deleteImage()` - Delete old avatar
- Handle Supabase Storage operations

---

## ✅ Testing Checklist

### **Test 1: Login Pertama Kali**
- [ ] Login dengan Google
- [ ] Foto profil muncul (Google photo)
- [ ] Foto muncul di Sidebar
- [ ] Foto muncul di Settings page

### **Test 2: Upload Custom Avatar**
- [ ] Pergi ke Settings
- [ ] Choose File → pilih foto
- [ ] Preview foto muncul
- [ ] Klik "Simpan Perubahan"
- [ ] Alert "Profil berhasil diperbarui"
- [ ] Foto di Settings berubah
- [ ] Foto di Sidebar berubah

### **Test 3: Refresh Browser**
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Foto tetap custom (tidak kembali ke Google)

### **Test 4: Logout & Login Lagi**
- [ ] Logout
- [ ] Login lagi dengan Google
- [ ] Foto tetap custom (TIDAK kembali ke Google) ✅

### **Test 5: Ganti Avatar Lagi**
- [ ] Upload foto baru
- [ ] Foto lama terhapus dari Storage
- [ ] Foto baru muncul everywhere

---

## 🐛 Common Issues & Solutions

### **Issue 1: Foto tidak muncul sama sekali**
**Symptom**: Default avatar terus muncul

**Solutions**:
1. Cek database: `SELECT avatar_url FROM users WHERE email = 'xxx'`
2. Cek console logs: Harus ada log `"👤 User data fetched"`
3. Cek Network tab: Ada request ke URL avatar?
4. Cek URL valid: Paste URL di browser baru

---

### **Issue 2: Foto tetap Google setelah upload**
**Symptom**: Custom avatar tidak muncul

**Solutions**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Cek console logs: Ada `"✅ Avatar uploaded successfully"`?
3. Cek database: `avatar_url` sudah update?
4. Cek Storage: File ada di bucket `avatars`?
5. Clear browser cache

---

### **Issue 3: Foto custom hilang setelah login ulang**
**Symptom**: Kembali ke Google photo

**Solutions**:
1. Cek auth callback logs: Ada `"✅ User already has custom avatar"`?
2. Cek database BEFORE login: `avatar_url` contains `supabase.co/storage`?
3. Cek database AFTER login: `avatar_url` masih sama?
4. Review code di `auth/callback/page.tsx`

---

## 🚀 Next Steps

Setelah avatar working:
1. ✅ Test upload foto laporan (bucket: `reports`)
2. ✅ Setup RLS policies untuk bucket `reports`
3. ✅ Test di mobile view
4. ✅ Test dengan berbagai format gambar
5. ✅ Test file size limit (max 2MB)

---

**Last Updated**: October 4, 2025
**Status**: Flow implemented and documented ✅
