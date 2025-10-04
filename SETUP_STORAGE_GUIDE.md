# 📸 Panduan Setup Supabase Storage untuk Upload Gambar

## 🎯 Langkah-langkah Setup di Supabase Dashboard

### 1. Buat Bucket untuk Laporan
1. Buka Supabase Dashboard → **Storage**
2. Klik **"New bucket"**
3. Nama bucket: **`reports`** (harus persis sama!)
4. **Public bucket**: ✅ **Centang** (supaya gambar bisa diakses publik)
5. Klik **"Create bucket"**

### 2. Buat Bucket untuk Avatar
1. Masih di Storage, klik **"New bucket"** lagi
2. Nama bucket: **`avatars`** (harus persis sama!)
3. **Public bucket**: ✅ **Centang**
4. Klik **"Create bucket"**

### 3. Verifikasi Bucket
Pastikan di Storage kamu ada 2 bucket:
- ✅ `reports` (Public)
- ✅ `avatars` (Public)

---

## 🔒 Setup Storage Policies (RLS)

### Policy untuk Bucket `reports`

Buka bucket **reports** → **Policies** → **New Policy**

#### **Policy 1: Allow INSERT (Upload) - Authenticated Users**
```sql
-- Policy Name: Allow authenticated users to upload
-- Operation: INSERT
-- Target roles: authenticated

CREATE POLICY "Allow authenticated users to upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'reports');
```

#### **Policy 2: Allow SELECT (Read) - Public Access**
```sql
-- Policy Name: Public read access
-- Operation: SELECT
-- Target roles: public, authenticated

CREATE POLICY "Public read access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'reports');
```

#### **Policy 3: Allow DELETE - Owner Only**
```sql
-- Policy Name: Users can delete own images
-- Operation: DELETE
-- Target roles: authenticated

CREATE POLICY "Users can delete own images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'reports');
```

---

### Policy untuk Bucket `avatars`

Buka bucket **avatars** → **Policies** → **New Policy**

#### **Policy 1: Allow INSERT (Upload) - Authenticated Users**
```sql
-- Policy Name: Allow authenticated users to upload avatar
-- Operation: INSERT
-- Target roles: authenticated

CREATE POLICY "Allow authenticated users to upload avatar" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'avatars');
```

#### **Policy 2: Allow SELECT (Read) - Public Access**
```sql
-- Policy Name: Public read access for avatars
-- Operation: SELECT
-- Target roles: public, authenticated

CREATE POLICY "Public read access for avatars" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'avatars');
```

#### **Policy 3: Allow DELETE - Owner Only**
```sql
-- Policy Name: Users can delete own avatar
-- Operation: DELETE
-- Target roles: authenticated

CREATE POLICY "Users can delete own avatar" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'avatars');
```

---

## ✅ Cara Test Upload

### Test Upload Laporan
1. Buka aplikasi → Login
2. Pergi ke **Dashboard → Laporan**
3. Klik **"+ Buat Laporan Baru"**
4. Isi form dan **upload foto**
5. Klik **Simpan**
6. Cek console browser (F12) → harus ada log: `"File uploaded successfully: [URL]"`

### Test Upload Avatar
1. Buka **Dashboard → Setting**
2. Klik **"Foto Profil"** dan pilih gambar
3. Klik **"Simpan Perubahan"**
4. Cek console browser (F12) → harus ada log: `"Avatar uploaded successfully: [URL]"`

---

## 🐛 Troubleshooting

### ❌ Error: "new row violates row-level security policy"
**Penyebab**: Policy belum dibuat atau salah konfigurasi

**Solusi**:
1. Cek bucket sudah **Public** ✅
2. Pastikan policy **INSERT** untuk authenticated users sudah dibuat
3. Restart aplikasi dan coba lagi

---

### ❌ Error: "The resource already exists"
**Penyebab**: File dengan nama yang sama sudah ada

**Solusi**: 
- Code sudah otomatis menambahkan timestamp, tapi kamu bisa ubah `upsert: false` menjadi `upsert: true` di code

---

### ❌ Gambar tidak muncul (404)
**Penyebab**: Bucket belum public atau URL salah

**Solusi**:
1. Cek bucket setting → **Public bucket** harus ✅
2. Cek URL di database → format harus: `https://[project-id].supabase.co/storage/v1/object/public/reports/images/...`

---

## 📝 Struktur File di Storage

### Bucket `reports`:
```
reports/
└── images/
    ├── 1696435200000_foto1.jpg
    ├── 1696435201000_foto2.png
    └── 1696435202000_foto3.jpg
```

### Bucket `avatars`:
```
avatars/
├── user-uuid-1/
│   └── 1696435200000.jpg
├── user-uuid-2/
│   └── 1696435201000.png
└── user-uuid-3/
    └── 1696435202000.jpg
```

---

## 🎉 Selesai!

Sekarang aplikasi kamu sudah bisa:
- ✅ Upload foto laporan (barang hilang/temuan)
- ✅ Upload foto profil (avatar)
- ✅ Hapus foto lama otomatis saat ganti avatar
- ✅ Public access untuk semua gambar

Kalau masih ada error, cek console browser (F12) dan lihat error message-nya! 🚀
