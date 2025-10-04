# 🐛 Troubleshooting: Avatar Tidak Berubah

## Masalah yang Sudah Diperbaiki ✅

### 1. **Avatar masih foto Google setelah upload**
**Penyebab**: 
- Next.js Image component melakukan caching
- DashboardLayout tidak refresh setelah update
- Browser cache gambar lama

**Solusi yang Diterapkan**:
- ✅ Tambah `unoptimized` prop di semua Image component
- ✅ Tambah `key={avatarPreview}` untuk force re-render
- ✅ Tambah cache busting timestamp: `?t=${Date.now()}`
- ✅ Tambah `router.refresh()` setelah update profile
- ✅ Enhanced logging untuk debugging

---

## 🔍 Cara Test Setelah Fix

### Step 1: Hard Refresh Browser
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Step 2: Clear Browser Cache (Optional)
1. Buka DevTools (F12)
2. Right-click tombol Refresh
3. Pilih **"Empty Cache and Hard Reload"**

### Step 3: Test Upload Avatar
1. Login ke aplikasi
2. Pergi ke **Dashboard → Settings**
3. Upload foto baru (max 2MB)
4. Klik **"Simpan Perubahan"**
5. **Buka DevTools (F12)** → Tab **Console**

### Step 4: Cek Console Logs
Harus ada log seperti ini:
```
🔄 Uploading avatar... {userId: "...", fileName: "..."}
✅ Avatar uploaded successfully: https://...supabase.co/storage/...
📝 Updating user profile in database... {userId: "...", avatar_url: "..."}
✅ Profile updated successfully!
👤 User data fetched: {userId: "...", avatar_url: "..."}
🖼️ Avatar preview set to: https://...?t=1234567890
```

### Step 5: Verifikasi
- ✅ Avatar di **Settings page** berubah
- ✅ Avatar di **Sidebar** berubah
- ✅ Avatar di **Mobile header** berubah
- ✅ Refresh page → avatar tetap baru

---

## ❌ Kalau Masih Error

### Error 1: "new row violates row-level security policy"
**Solusi**: Pastikan policies sudah dibuat di Supabase

```sql
-- Run di SQL Editor Supabase
CREATE POLICY "Allow authenticated users to upload avatar" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Public read access for avatars" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatar" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'avatars');
```

---

### Error 2: "Error uploading avatar: ... bucket not found"
**Solusi**: 
1. Buka Supabase Dashboard → **Storage**
2. Buat bucket baru: **`avatars`**
3. ✅ Centang **"Public bucket"**
4. Klik **"Create bucket"**

---

### Error 3: Avatar 404 / Not Found
**Penyebab**: Bucket belum public atau file tidak ter-upload

**Solusi**:
1. Cek bucket settings:
   - Storage → Bucket **avatars** → Settings
   - ✅ **Public bucket** harus dicentang
   
2. Cek file di Storage:
   - Storage → Bucket **avatars**
   - Harusnya ada folder dengan `userId`
   - Di dalamnya ada file `timestamp.jpg/png`

3. Test URL manual:
   - Copy URL dari database
   - Paste di browser tab baru
   - Kalau 404 → file tidak ada / bucket tidak public

---

### Error 4: "uploadedUrl is null"
**Penyebab**: Upload gagal, biasanya karena RLS policy atau bucket tidak ada

**Solusi**:
1. Cek console untuk error detail
2. Pastikan bucket `avatars` ada dan public
3. Pastikan policies sudah dibuat (lihat Error 1)
4. Cek file size < 2MB
5. Cek format file: JPG, PNG, GIF, WEBP

---

### Error 5: Avatar berubah di Settings tapi tidak di Sidebar
**Penyebab**: Component tidak re-render atau cache issue

**Solusi**:
1. Hard refresh browser (Ctrl + Shift + R)
2. Logout → Login lagi
3. Cek apakah `router.refresh()` dipanggil di console
4. Cek apakah URL avatar punya timestamp `?t=...`

---

## 🔧 Manual Verification di Supabase

### Cek Database
```sql
-- Run di SQL Editor
SELECT id, name, email, avatar_url, updated_at 
FROM users 
WHERE email = 'your-email@mhs.dinus.ac.id';
```

**Expected**:
- `avatar_url` = `https://[project-id].supabase.co/storage/v1/object/public/avatars/[user-id]/[timestamp].jpg`

---

### Cek Storage
1. Storage → Bucket **avatars**
2. Buka folder dengan `userId`
3. Harus ada file gambar
4. Click file → Copy URL
5. Paste URL di browser → harus bisa lihat gambar

---

## 🎯 Checklist Lengkap

Sebelum test, pastikan:
- [x] Bucket `avatars` sudah dibuat (public ✅)
- [x] 3 policies untuk bucket `avatars` sudah dibuat
- [x] Code sudah di-update (file sudah disimpan)
- [x] Development server sudah di-restart
- [x] Browser sudah di-refresh (hard reload)
- [x] DevTools Console terbuka untuk lihat logs

---

## 📞 Kalau Semua Gagal

1. **Copy semua error message** dari Console (F12)
2. **Screenshot** error message
3. **Check**:
   - Supabase project ID benar?
   - `.env.local` sudah benar?
   - Internet connection stable?
4. **Restart**:
   ```bash
   # Stop dev server (Ctrl+C)
   npm run dev
   ```
5. **Clear everything**:
   - Clear browser cache
   - Logout dan login lagi
   - Hard refresh (Ctrl+Shift+R)

---

## ✅ Success Indicators

Avatar berhasil ter-update jika:
1. ✅ Console log: `✅ Avatar uploaded successfully`
2. ✅ Console log: `✅ Profile updated successfully`
3. ✅ Alert: "Profil berhasil diperbarui!"
4. ✅ Avatar di Settings berubah
5. ✅ Avatar di Sidebar berubah
6. ✅ Refresh page → avatar tetap baru
7. ✅ Logout → Login → avatar tetap baru

---

## 🚀 Next Steps Setelah Berhasil

1. Test upload foto laporan di **Dashboard → Laporan**
2. Test di berbagai browser (Chrome, Firefox, Edge)
3. Test di mobile view (responsive)
4. Coba ganti avatar beberapa kali
5. Coba dengan berbagai format gambar (JPG, PNG, WEBP)

---

**Last Updated**: October 4, 2025
**Status**: All fixes applied ✅
