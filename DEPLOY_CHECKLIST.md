# ✅ Checklist: Deploy ke Vercel - LENGKAP

## Status: Build Lokal BERHASIL ✅

Build lokal sudah berhasil tanpa error `supabaseUrl is required`.

---

## 🚀 Langkah Deploy ke Vercel

### **STEP 1: Setup Environment Variables di Vercel** ⚠️ PENTING!

1. **Buka Vercel Dashboard**: https://vercel.com/dashboard
2. **Pilih Project Anda** (LostItem-Project)
3. **Masuk ke**: `Settings` → `Environment Variables`
4. **Tambahkan 5 variabel ini**:

#### Variabel yang HARUS ditambahkan:

```bash
# 1. Supabase URL
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://oxjfahzrzjdukwksmcem.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development

# 2. Supabase Anon Key
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94amZhaHpyempkdWt3a3NtY2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NTcxOTksImV4cCI6MjA3NTEzMzE5OX0.QTHknjfh-StSM0xNcj0_dx4cTzZbNDGKLwaqi1vqgdM
Environments: ✅ Production ✅ Preview ✅ Development

# 3. Google Client ID (Public)
Name: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: 834069070113-ini5i74ek1rt2brqjlh5qbb0o9ko56hl.apps.googleusercontent.com
Environments: ✅ Production ✅ Preview ✅ Development

# 4. Google Client ID (Server)
Name: GOOGLE_CLIENT_ID
Value: 834069070113-ini5i74ek1rt2brqjlh5qbb0o9ko56hl.apps.googleusercontent.com
Environments: ✅ Production ✅ Preview ✅ Development

# 5. Google Client Secret
Name: GOOGLE_CLIENT_SECRET
Value: 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
Environments: ✅ Production ✅ Preview ✅ Development
```

**Screenshot cara input:**
```
┌─────────────────────────────────────────────┐
│ Add New                                     │
├─────────────────────────────────────────────┤
│ Name: NEXT_PUBLIC_SUPABASE_URL              │
│ Value: https://oxjfahzrzjdukwksmcem...      │
│                                             │
│ Environment:                                │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│ [Save]                                      │
└─────────────────────────────────────────────┘
```

---

### **STEP 2: Konfigurasi Supabase (Redirect URLs)**

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. **Pilih Project**: `oxjfahzrzjdukwksmcem`
3. **Masuk ke**: `Authentication` → `URL Configuration`

#### Tambahkan URLs ini:

**Site URL:**
```
https://your-app-name.vercel.app
```
*(Ganti `your-app-name` dengan nama Vercel app Anda)*

**Redirect URLs:** (Pisahkan dengan koma atau baris baru)
```
http://localhost:3000/auth/callback
https://your-app-name.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

**Contoh:**
```
https://lostitem-project.vercel.app/auth/callback
https://lostitem-project-git-main-zickrian.vercel.app/auth/callback
https://*.vercel.app/auth/callback
```

---

### **STEP 3: Konfigurasi Google OAuth**

1. **Buka Google Cloud Console**: https://console.cloud.google.com
2. **Pilih Project Anda**
3. **Masuk ke**: `APIs & Services` → `Credentials`
4. **Klik Client ID OAuth 2.0 Anda**

#### Tambahkan Authorized Redirect URIs:

```
https://oxjfahzrzjdukwksmcem.supabase.co/auth/v1/callback
https://your-app-name.vercel.app/auth/callback
```

---

### **STEP 4: Re-deploy ke Vercel**

Ada 2 cara:

#### **Cara 1: Manual Redeploy** (Cepat)
1. Vercel Dashboard → `Deployments`
2. Klik titik 3 di deployment terakhir
3. Klik `Redeploy`
4. Centang ✅ `Use existing Build Cache`
5. Klik `Redeploy`

#### **Cara 2: Git Push** (Otomatis)
```bash
git add .
git commit -m "fix: Supabase environment variables configuration"
git push origin main
```

---

### **STEP 5: Verifikasi Deployment**

Setelah deployment selesai (tunggu ~2-3 menit):

1. ✅ **Cek Build Log**
   - Pastikan tidak ada error `supabaseUrl is required`
   - Build status harus SUCCESS

2. ✅ **Test di Browser**
   ```
   https://your-app-name.vercel.app
   ```

3. ✅ **Test Login**
   - Klik tombol "Login dengan Google"
   - Pastikan redirect bekerja
   - Pastikan bisa masuk dashboard

4. ✅ **Cek Console Browser** (F12)
   - Tidak ada error Supabase
   - Tidak ada error environment variables

---

## 🔧 Troubleshooting

### ❌ Masih Error "supabaseUrl is required"

**Solusi:**
```bash
# 1. Clear Build Cache di Vercel
Vercel Dashboard → Settings → General → "Clear Build Cache & Deploy"

# 2. Atau manual:
git commit --allow-empty -m "trigger rebuild"
git push origin main
```

### ❌ Login Redirect Error

**Cek:**
- ✅ Redirect URLs di Supabase sudah benar (lihat STEP 2)
- ✅ Domain di Google OAuth sudah benar (lihat STEP 3)
- ✅ Tidak ada trailing slash di URL

### ❌ Authentication Error

**Cek Console:**
```javascript
// Seharusnya muncul:
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY

// Jika muncul ✗, environment variables belum diset!
```

---

## 📋 Summary Perubahan Code

### File yang Diubah:

1. **`src/lib/supabaseClient.ts`**
   - ✅ Menambahkan fallback values
   - ✅ Menambahkan error logging
   - ✅ Mencegah build error saat env tidak ada

2. **`next.config.ts`**
   - ✅ Menambahkan explicit env configuration
   - ✅ Memastikan env variables tersedia di build time

3. **`.env.example`** (NEW)
   - ✅ Template untuk environment variables

4. **`VERCEL_SETUP.md`** (NEW)
   - ✅ Panduan setup Vercel

---

## ✨ Hasil Akhir

Setelah mengikuti semua langkah:
- ✅ Build berhasil tanpa error
- ✅ Deploy ke Vercel berhasil
- ✅ Login Google bekerja
- ✅ Redirect ke dashboard berhasil
- ✅ Tidak ada error environment variables

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada error:
1. Screenshot error message
2. Screenshot Vercel build log
3. Screenshot environment variables di Vercel
4. Screenshot console browser (F12)

Kirimkan ke saya untuk analisis lebih lanjut! 🚀
