# Panduan Setup Environment Variables di Vercel

## Langkah-langkah Deploy ke Vercel

### 1. Tambahkan Environment Variables di Vercel

Buka Vercel Dashboard → Pilih Project Anda → Settings → Environment Variables

Tambahkan variabel berikut:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://oxjfahzrzjdukwksmcem.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (key lengkap dari .env.local) | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `834069070113-ini5i74ek1rt2brqjlh5qbb0o9ko56hl.apps.googleusercontent.com` | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | `834069070113-ini5i74ek1rt2brqjlh5qbb0o9ko56hl.apps.googleusercontent.com` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `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` | Production, Preview, Development |

### 2. Konfigurasi Supabase Authentication

Di Supabase Dashboard:

1. Buka Authentication → URL Configuration
2. Tambahkan Vercel URL ke **Site URL** dan **Redirect URLs**:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/auth/callback`
   - `https://*.vercel.app/auth/callback` (untuk preview deployments)

### 3. Konfigurasi Google OAuth

Di Google Cloud Console:

1. Buka Credentials → OAuth 2.0 Client IDs
2. Tambahkan **Authorized redirect URIs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://oxjfahzrzjdukwksmcem.supabase.co/auth/v1/callback`

### 4. Re-deploy

Setelah menambahkan environment variables:
1. Kembali ke Vercel Dashboard → Deployments
2. Klik "Redeploy" pada deployment terakhir
3. Atau push commit baru ke repository

### 5. Verifikasi

Setelah deployment selesai:
- Buka aplikasi di browser
- Cek Console untuk memastikan tidak ada error Supabase
- Test login dengan Google

## Troubleshooting

### Error "supabaseUrl is required"
- ✅ **Fixed**: Pastikan semua environment variables sudah ditambahkan di Vercel
- ✅ **Fixed**: Pastikan environment variables diset untuk semua environment (Production, Preview, Development)
- ✅ **Fixed**: Re-deploy setelah menambahkan environment variables

### Build Error
```bash
# Jika masih error, coba:
1. Delete .next folder (lokal)
2. Vercel Dashboard → Settings → General → Delete Project Cache
3. Re-deploy
```

### Authentication Error
- Pastikan callback URL sudah ditambahkan di Supabase dan Google OAuth
- Pastikan domain Vercel sudah benar (tanpa trailing slash)
