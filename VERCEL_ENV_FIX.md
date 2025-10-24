# 🔧 Perbaikan Environment Variables Vercel

## Masalah
API routes di production mengembalikan data 0 karena environment variables tidak terbaca dengan benar.

## Root Cause
Di Vercel, **API routes berjalan di server-side** dan tidak bisa mengakses environment variables dengan prefix `NEXT_PUBLIC_`. Variables dengan prefix `NEXT_PUBLIC_` hanya tersedia untuk kode yang berjalan di browser (client-side).

## Solusi yang Diterapkan

### 1. Update API Routes
Mengubah semua API routes untuk fallback ke variabel tanpa prefix `NEXT_PUBLIC_`:

```typescript
// ❌ SEBELUM (hanya coba NEXT_PUBLIC_*)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ SESUDAH (fallback ke variabel server)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
```

### 2. Files yang Diperbaiki
- ✅ `src/app/api/stats/platform/route.ts`
- ✅ `src/app/api/stats/found-items/route.ts`

## Langkah Setup di Vercel

### Option 1: Menambah Environment Variables di Vercel (RECOMMENDED)
1. Buka dashboard Vercel project Anda
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan variabel berikut (tanpa prefix `NEXT_PUBLIC_`):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Pastikan variabel tersedia untuk semua environments**: Production, Preview, Development
5. **Redeploy** project Anda

### Option 2: Menggunakan Variabel yang Sudah Ada
Jika Anda sudah memiliki `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Vercel:

1. **Cek di Vercel Dashboard** → Settings → Environment Variables
2. Pastikan kedua variabel tersebut ada dan terisi dengan benar
3. Jika ada, code akan otomatis menggunakannya (fallback sudah diatur)
4. **Redeploy** project Anda

## Verifikasi

Setelah deploy, cek di browser console:
```javascript
// Cek response dari API
fetch('/api/stats/platform').then(r => r.json()).then(console.log)
fetch('/api/stats/found-items').then(r => r.json()).then(console.log)
```

Response yang benar:
```json
// Platform stats
{
  "hilang": 123,
  "ditemukan": 45,
  "diklaim": 67
}

// Found items stats
{
  "Elektronik": 10,
  "Dokumen": 5,
  "Kunci": 3,
  "Tas & Dompet": 8,
  "Buku & Alat Tulis": 2,
  "Aksesoris": 4
}
```

Response yang salah (masih ada error):
```json
{
  "hilang": 0,
  "ditemukan": 0,
  "diklaim": 0,
  "error": "Missing configuration"
}
```

## Debug di Vercel

Jika masih error, cek logs di Vercel:
1. Buka dashboard Vercel
2. Pilih deployment terbaru
3. Klik tab **Functions** atau **Logs**
4. Cari error message dari API routes
5. Lihat output dari `console.error` yang menunjukkan environment variables mana yang tersedia

## Best Practices

### Untuk Client-Side Code
```typescript
// ✅ Gunakan NEXT_PUBLIC_* untuk kode yang berjalan di browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### Untuk Server-Side Code (API Routes, Server Components)
```typescript
// ✅ Gunakan variabel tanpa prefix untuk server
const supabaseUrl = process.env.SUPABASE_URL;

// ✅ Atau fallback untuk kompatibilitas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
```

## Kesimpulan

Masalah ini terjadi karena:
1. ❌ API routes menggunakan `NEXT_PUBLIC_*` variables
2. ❌ Variabel tersebut tidak tersedia di server-side di Vercel
3. ✅ Solusi: Tambahkan fallback atau gunakan variabel tanpa prefix

**Deploy ulang setelah perubahan ini dan pastikan environment variables sudah diset di Vercel!** 🚀
