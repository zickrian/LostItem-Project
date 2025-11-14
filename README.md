# 🎓 Lost&Found Mahasiswa – Sistem Pelaporan Barang Hilang/Temuan

Aplikasi web modern untuk mahasiswa Universitas Dian Nuswantoro untuk melaporkan dan menemukan barang hilang/ditemukan di kampus, dengan keamanan berbasis Supabase dan autentikasi Google OAuth.

---

## 📌 Ringkasan
- **Target pengguna**: Mahasiswa, staf kampus, dan pengelola keamanan kampus.
- **Tujuan**: Mempermudah pelaporan barang hilang/temuan, memonitor statistik, dan menjaga keamanan data dengan Supabase RLS.
- **Komponen utama**: Landing page, autentikasi Google, dashboard laporan, statistik visual, serta pengaturan akun.

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Keamanan
- Login dengan Google OAuth domain `@mhs.dinus.ac.id`.
- Session management dan proteksi route memakai Supabase Auth.
- Row Level Security (RLS) memastikan user hanya mengelola datanya sendiri.

### 📱 Dashboard Laporan
- Pencarian dan filter laporan berdasarkan judul, deskripsi, kategori, status, dan nama pelapor.
- Tab switcher untuk beralih antara laporan **hilang** dan **temuan**.
- Kartu laporan dengan foto, status, lokasi, dan tombol tindakan.
- Comment system real-time di setiap laporan.
- Toggle status dan filter khusus untuk laporan aktif vs selesai.

### 📝 Manajemen Laporan
- Layout split: daftar laporan di kiri, form input laporan baru di kanan.
- Field: judul, deskripsi, kategori, lokasi, tipe (hilang/temuan), upload foto.
- Upload foto ke Supabase Storage (maksimal 5MB, hanya `image/*`).
- Edit, hapus, dan ubah status laporan langsung dari dashboard.

### 📊 Statistik & Wawasan
- Summary cards: total laporan, laporan aktif, laporan selesai, laporan temuan.
- Visualisasi: pie chart kategori, bar chart tren bulanan, dan lokasi utama.
- Statistik diperbarui real-time via Supabase Realtime.

### ⚙️ Pengaturan Pengguna
- Edit profil (nama, avatar).
- Pengaturan notifikasi email & web.
- Informasi akun: tanggal bergabung dan login terakhir.
- Zona bahaya untuk menghapus akun permanen dengan konfirmasi dua langkah.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, TailwindCSS, `clsx`, `class-variance-authority`, `tailwind-merge`
- **Database**: Supabase PostgreSQL + RLS
- **Authentication**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage (bucket `reports-images`)
- **Charts & Animations**: Recharts, Framer Motion
- **Ikon & UI**: `lucide-react`, `@heroicons/react`, `react-icons`
- **Bahasa**: TypeScript

---

## 🧭 Arsitektur Singkat

1. **Client** (`src/app` + `src/components`)
  - Landing page (`/`), halaman login (`/login`), dashboard (`/dashboard`), statistik, setting.
  - Komponen UI modular: `Sidebar`, `SearchBar`, `ReportCard`, `CommentSection`, `PlatformStatsSection`, dll.

2. **Auth & Session**
  - `src/app/api/auth/[...nextauth]/route.ts`: konfigurasi NextAuth dengan Google Provider.
  - `src/lib/supabaseBrowser.ts`: client Supabase untuk operasi yang aman di browser.
  - Proteksi dan session management menggunakan Supabase Auth + NextAuth.

3. **Server & Supabase**
  - `src/lib/supabaseServer.ts`: client Supabase server-side (anon & admin/service role).
  - `src/lib/supabaseStorage.ts`: helper upload/delete file di bucket `reports-images`.
  - `src/lib/getFoundItems*.ts`, `getPlatformStats.ts`: pemanggilan Supabase REST/RPC untuk laporan dan statistik.

4. **Database & SQL**
  - Folder `supabase/migrations/` berisi:
    - `001_create_tables.sql`: tabel `users`, `reports`, dll.
    - `002_create_comments_table.sql`: tabel `comments`.
    - `003_add_coordinates.sql`: koordinat lokasi.
    - `004_*`–`008_*`: fungsi & RPC (`get_platform_stats`, `get_found_items`, `get_found_item_totals`, pembaruan kategori, dll).
  - Mengandalkan RLS dan policy Supabase untuk keamanan.

5. **Tooling**
  - `scripts/verify-env.js`: script untuk memastikan env sudah lengkap.
  - `tests/homepage.spec.ts`: contoh end-to-end test (Playwright) untuk homepage.

---

## 🗂 Struktur Folder Inti

```text
lostfound/
├── src/
│   ├── app/            # Halaman Next.js (landing, login, dashboard, statistik, setting)
│   │   ├── api/        # API routes (auth, stats, dsb.)
│   │   ├── auth/       # Halaman callback auth
│   │   ├── dashboard/  # Halaman dashboard (laporan, statistik, setting)
│   │   ├── login/      # Halaman login
│   │   └── page.tsx    # Landing page utama
│   ├── components/     # Komponen UI (Sidebar, SearchBar, ReportCard, CommentSection, dsb.)
│   ├── context/        # Theme context
│   ├── contexts/       # Toast context
│   └── lib/            # Supabase client/server, storage helper, utils, fetcher laporan & stats
├── supabase/           # SQL migrations & fungsi custom
├── public/             # Asset statis dan ikon
├── scripts/            # Tooling tambahan: verify-env
└── tests/              # Playwright tests
```

---

## 🔧 Konfigurasi Supabase (Ringkas)
1. **Project**: buat project di [supabase.com](https://supabase.com).
2. **Database**: jalankan semua file di `supabase/migrations/`.
3. **Auth**: aktifkan Google Provider dan batasi domain jika perlu (`@mhs.dinus.ac.id`).
4. **Storage**: buat bucket `reports-images`, public, hanya `image/*`.
5. **Policies & RLS**: pastikan RLS aktif pada tabel sensitif dan policy hanya mengizinkan user mengakses datanya sendiri.

---

## 📦 Deployment

### Vercel (Direkomendasikan)

```bash
npm i -g vercel
vercel login
vercel --prod
```

- Tambahkan env vars di dashboard Vercel sesuai `.env.local`.
- Gunakan prefix `NEXT_PUBLIC_` untuk nilai yang boleh diakses di browser.
- Update redirect URL di Google Console & Supabase sesuai domain Vercel.

### Alternatif Self-hosted

Pastikan seluruh environment variables sudah diset, kemudian:

```bash
npm run build
npm run start
```

Gunakan process manager (PM2, systemd) atau container sesuai kebutuhan.

---

## 🔒 Keamanan & Validasi

- RLS wajib untuk semua tabel yang berisi data user (lihat migrations).
- Upload foto menggunakan Supabase Storage policy (`reports-images` public readonly).
- Google OAuth sebaiknya dibatasi domain `@mhs.dinus.ac.id`.
- `npm run verify-env` memastikan env lengkap tanpa mengekspos value sensitif.
- Jangan pernah expose `SUPABASE_SERVICE_ROLE_KEY` ke client atau ke variabel `NEXT_PUBLIC_*`.

---

## 🐞 Troubleshooting Umum

- **`Relation public.users does not exist`** → jalankan ulang semua SQL migration di Supabase SQL Editor.
- **Storage bucket error** → pastikan bucket `reports-images` sudah dibuat, public, dan policy benar.
- **Invalid email domain** → pastikan konfigurasi domain di Google OAuth & Supabase sudah sesuai (`@mhs.dinus.ac.id`).
- **Supabase env missing** → jalankan `npm run verify-env` untuk mengetahui env mana yang belum terisi.

---

## 📚 Dokumentasi Tambahan

- `scripts/verify-env.js`: helper cek env.
- `src/lib/supabaseClient.ts`: backward compatibility client-side (deprecated, dianjurkan pakai `supabaseBrowser.ts`).
- `src/lib/supabaseServer.ts`: Supabase client server-side + admin (service role).
- `src/lib/getFoundItems*.ts`, `getPlatformStats.ts`: helper fetch laporan dan statistik.

---

## 📄 Lisensi

MIT License – bebas dipakai untuk keperluan pendidikan dan komunitas.

**Dibuat dengan ❤️ untuk mahasiswa Universitas Dian Nuswantoro**
