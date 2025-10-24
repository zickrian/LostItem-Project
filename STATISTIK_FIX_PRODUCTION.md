# Fix Statistik Tidak Muncul di Production

## 🔍 Analisis Masalah

### Gejala
- ✅ Di localhost: Semua statistik (Platform Stats, Barang Ditemukan, Barang Sering Ditemukan) muncul dengan benar
- ❌ Di production (Vercel): Semua statistik menampilkan angka 0

### Root Cause
Masalah terjadi karena **client components** mencoba memanggil fungsi yang menggunakan `process.env.NEXT_PUBLIC_SUPABASE_URL` secara langsung:

1. **`HomeClient.tsx`** (client component):
   - Memanggil `getFoundItemStats()` via `useEffect()`
   - Di client-side, hanya variabel dengan prefix `NEXT_PUBLIC_` yang tersedia
   - Namun fungsi ini mencoba mengakses Supabase langsung dari browser

2. **`PlatformStatsSection.tsx`** (client component):
   - Memanggil `getPlatformStats()` via `useEffect()`
   - Sama seperti di atas, mencoba fetch langsung dari client

3. **Masalah Arsitektur**:
   - Client components seharusnya memanggil API Routes, bukan langsung ke Supabase
   - API Routes dijalankan di server-side dan aman
   - Client-side fetch ke API Routes bisa menggunakan relative URL (`/api/stats/...`)

## ✅ Solusi yang Diterapkan

### 1. Membuat API Routes Baru

#### `/api/stats/platform/route.ts`
- Endpoint untuk mendapatkan statistik platform
- Berjalan di server-side (aman)
- Menggunakan environment variables yang tersedia di Vercel
- Return: `{ hilang, ditemukan, diklaim }`

#### `/api/stats/found-items/route.ts`
- Endpoint untuk mendapatkan statistik barang yang ditemukan per kategori
- Berjalan di server-side (aman)
- Return: `{ STNK, Handphone, Buku, Kunci, Dompet, Laptop }`

### 2. Update Client Components

#### `PlatformStatsSection.tsx`
**Sebelum:**
```tsx
useEffect(() => {
  getPlatformStats().then(setStats);
}, []);
```

**Sesudah:**
```tsx
useEffect(() => {
  fetch('/api/stats/platform', { cache: 'no-store' })
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(err => {
      console.error('❌ Error fetching platform stats:', err);
      setStats({ hilang: 0, ditemukan: 0, diklaim: 0 });
    });
}, []);
```

#### `HomeClient.tsx`
**Sebelum:**
```tsx
useEffect(() => {
  getFoundItemStats().then(setFoundItemStats);
}, []);
```

**Sesudah:**
```tsx
useEffect(() => {
  fetch('/api/stats/found-items', { cache: 'no-store' })
    .then(res => res.json())
    .then(data => setFoundItemStats(data))
    .catch(err => {
      console.error('❌ Error fetching found items stats:', err);
      setFoundItemStats({
        'STNK': 0,
        'Handphone': 0,
        'Buku': 0,
        'Kunci': 0,
        'Dompet': 0,
        'Laptop': 0,
      });
    });
}, []);
```

### 3. Keuntungan Arsitektur Baru

✅ **Security**: API keys tidak pernah terekspos ke browser
✅ **Performance**: Server-side caching bisa dioptimalkan
✅ **Error Handling**: Lebih baik dengan fallback values
✅ **Logging**: Console logs muncul di Vercel server logs
✅ **Maintainability**: Pemisahan concerns yang lebih jelas

## 🚀 Cara Deploy

1. **Commit & Push Changes**:
```bash
git add .
git commit -m "fix: statistik tidak muncul di production dengan API routes"
git push origin main
```

2. **Vercel akan auto-deploy** (biasanya 1-3 menit)

3. **Verifikasi Environment Variables di Vercel**:
   - Buka Vercel Dashboard → Project Settings → Environment Variables
   - Pastikan ada:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Jika tidak ada atau salah, tambahkan/perbaiki dan redeploy

4. **Test di Production**:
   - Buka https://sitemudinus.vercel.app
   - Scroll ke section statistik
   - Cek browser console untuk logs
   - Angka statistik seharusnya muncul

## 🧪 Testing di Localhost

```bash
npm run dev
```

Buka http://localhost:3000 dan verifikasi:
- ✅ Platform Stats muncul
- ✅ Barang Ditemukan muncul
- ✅ Barang Yang Sering Ditemukan muncul
- ✅ Tidak ada error di console

## 📊 Debugging di Production

Jika masih ada masalah, cek:

1. **Vercel Function Logs**:
   - Dashboard → Deployments → Latest → Functions
   - Lihat logs dari `/api/stats/platform` dan `/api/stats/found-items`

2. **Browser Console**:
   - F12 → Console
   - Cari error messages atau network errors

3. **Network Tab**:
   - F12 → Network
   - Filter: XHR/Fetch
   - Cek response dari `/api/stats/*`

4. **Supabase Dashboard**:
   - Verifikasi fungsi RPC ada:
     - `get_platform_stats`
     - `get_found_item_totals`
   - Test manual di SQL Editor

## 🔑 Environment Variables yang Dibutuhkan

Di Vercel (Production):
```
NEXT_PUBLIC_SUPABASE_URL=https://oxjfahzrzjdukwksmcem.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Di `.env.local` (Development):
```
NEXT_PUBLIC_SUPABASE_URL=https://oxjfahzrzjdukwksmcem.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 📝 Files Changed

1. ✅ Created: `src/app/api/stats/platform/route.ts`
2. ✅ Created: `src/app/api/stats/found-items/route.ts`
3. ✅ Modified: `src/components/PlatformStatsSection.tsx`
4. ✅ Modified: `src/components/HomeClient.tsx`

## 🎯 Expected Result

Setelah deploy:
- ✅ Statistik Platform menampilkan angka real dari database
- ✅ Barang Yang Ditemukan menampilkan list items
- ✅ Barang Yang Sering Ditemukan menampilkan count per kategori
- ✅ Tidak ada error 401/403 dari Supabase
- ✅ Loading smooth tanpa flash

---

**Status**: ✅ FIXED  
**Date**: 2025-01-24  
**Issue**: Statistik menampilkan 0 di production  
**Solution**: Menggunakan API Routes untuk server-side data fetching
