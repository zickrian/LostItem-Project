# ✅ NextAuth Redirect Fix - Setup untuk Vercel

## Perubahan yang Sudah Dilakukan

File `src/app/api/auth/[...nextauth]/route.ts` sudah diupdate untuk:
- Menggunakan `NEXTAUTH_URL` environment variable
- Redirect ke domain Vercel, bukan localhost
- Mengatur `redirect_uri` Google OAuth dengan benar

## 🔧 Setup di Vercel (PENTING!)

### 1. Tambahkan Environment Variables di Vercel

Masuk ke **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Tambahkan variable berikut:

```
NEXTAUTH_URL=https://sitemudinus.vercel.app
NEXTAUTH_SECRET=<generate secret baru>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Setup Google OAuth Console

Masuk ke [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

**Authorized JavaScript origins:**
```
https://sitemudinus.vercel.app
```

**Authorized redirect URIs:**
```
https://sitemudinus.vercel.app/api/auth/callback/google
```

⚠️ **PENTING:** Pastikan TIDAK ada trailing slash (/) di akhir URL!

### 3. Deploy ke Vercel

Setelah environment variables diatur, deploy ulang:

```bash
git add .
git commit -m "Fix NextAuth redirect to Vercel domain"
git push
```

Atau deploy manual dari Vercel Dashboard → Deployments → Redeploy

## 🧪 Testing

Setelah deploy:

1. Buka https://sitemudinus.vercel.app
2. Klik tombol Login
3. Login dengan Google
4. Seharusnya redirect ke https://sitemudinus.vercel.app/auth/callback (bukan localhost)

## 📝 Catatan

- NextAuth secara otomatis menggunakan `NEXTAUTH_URL` untuk base URL
- Redirect URI Google harus PERSIS sama dengan yang di Google Console
- Jika masih redirect ke localhost, clear browser cache atau gunakan incognito mode

## ⚠️ Troubleshooting

**Masih redirect ke localhost:**
- Pastikan `NEXTAUTH_URL` sudah diset di Vercel
- Redeploy project setelah menambah environment variable
- Clear browser cookies untuk site tersebut

**Error "redirect_uri_mismatch":**
- Cek Google Console, pastikan redirect URI sudah benar
- Pastikan tidak ada typo di URL
- Tunggu 5-10 menit setelah mengubah setting di Google Console
