# 🎓 Lost&Found Mahasiswa - Sistem Pelaporan Barang Hilang/Temuan

Aplikasi web modern untuk mahasiswa Universitas Dian Nuswantoro untuk melaporkan dan menemukan barang hilang/ditemukan di kampus.

## ✨ Fitur Utama

### 🔐 Autentikasi
- Login dengan Google OAuth (@mhs.dinus.ac.id)
- Session management dengan Supabase Auth
- Row Level Security (RLS) untuk keamanan data

### 📱 Dashboard
- **Search & Filter**: Cari barang berdasarkan judul, deskripsi, kategori, atau nama pelapor
- **Tab Switcher**: Filter barang hilang atau ditemukan
- **Grid Cards**: Tampilan card modern dengan foto, status, dan informasi lengkap
- **Real-time Updates**: Data diperbarui otomatis menggunakan Supabase Realtime
- **Comment System**: Komentar seperti Instagram di setiap laporan

### 📝 Buat Laporan
- **Split Layout**: 
  - Kiri: List laporan milik user (filter Aktif/Selesai)
  - Kanan: Form input laporan baru
- **Form Fields**:
  - Judul barang
  - Deskripsi detail
  - Kategori dropdown (Elektronik, Dokumen, Kunci, dll)
  - Lokasi (opsional)
  - Tipe: Hilang atau Temuan
  - Upload foto (Supabase Storage, max 5MB)
- **Edit & Delete**: Kelola laporan sendiri
- **Toggle Status**: Ubah status Aktif ↔ Selesai

### 📊 Statistik
- **Summary Cards**: Total laporan, hilang, temuan, aktif, selesai
- **Pie Chart**: Kategori paling sering hilang
- **Bar Chart**: Tren laporan 6 bulan terakhir
- **Location Chart**: Top 5 lokasi kehilangan
- **Success Rate**: Persentase laporan yang diselesaikan

### ⚙️ Setting
- **Profile Editor**: Update nama dan foto profil
- **Notification Settings**: Toggle email & web notifications
- **Account Info**: Tanggal bergabung dan login terakhir
- **Danger Zone**: Hapus akun permanen dengan konfirmasi

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage
- **Charts**: Recharts
- **Language**: TypeScript

## 📦 Database Schema

### Tabel `users`
```sql
- id (uuid, PK)
- auth_id (uuid, FK ke auth.users)
- name (text)
- email (text, unique)
- avatar_url (text)
- role (varchar: student)
- created_at (timestamp)
- last_login (timestamp)
```

### Tabel `reports`
```sql
- id (uuid, PK)
- user_id (uuid, FK ke users)
- title (text)
- description (text)
- category (varchar)
- type (varchar: hilang/temuan)
- image_url (text)
- status (varchar: aktif/selesai)
- location (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabel `comments`
```sql
- id (uuid, PK)
- report_id (uuid, FK ke reports)
- user_id (uuid, FK ke users)
- content (text)
- created_at (timestamp)
```

### Tabel `notifications`
```sql
- id (uuid, PK)
- user_id (uuid, FK ke users, unique)
- email_notif (boolean)
- web_notif (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🚀 Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd lostfound
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase

#### a. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Buat project baru
3. Catat `Project URL` dan `anon public key`

#### b. Jalankan Migration SQL
1. Buka SQL Editor di Supabase Dashboard
2. Copy-paste isi file `supabase/migrations/001_create_tables.sql`
3. Execute SQL

#### c. Setup Storage Bucket
1. Buka Storage di Supabase Dashboard
2. Buat bucket baru dengan nama: `reports-images`
3. Set sebagai **Public**
4. Allowed file types: `image/*`

#### d. Setup Google OAuth
1. Buka Authentication > Providers di Supabase Dashboard
2. Enable Google Provider
3. Ikuti instruksi untuk setup Google OAuth Console
4. Tambahkan authorized redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 4. Environment Variables

Buat file `.env.local` di root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Folder

```
lostfound/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── login/page.tsx            # Login page
│   │   ├── auth/callback/page.tsx    # OAuth callback
│   │   └── dashboard/
│   │       ├── page.tsx              # Main dashboard (search + grid)
│   │       ├── laporan/page.tsx      # Create/Edit report page
│   │       ├── statistik/page.tsx    # Statistics page
│   │       └── setting/page.tsx      # Settings page
│   ├── components/
│   │   ├── Sidebar.tsx               # Sidebar navigation
│   │   ├── SearchBar.tsx             # Search component
│   │   ├── ReportCard.tsx            # Report card with comments
│   │   ├── CommentSection.tsx        # Comment system
│   │   └── DashboardLayout.tsx       # Layout wrapper
│   └── lib/
│       ├── supabaseClient.ts         # Supabase client config
│       └── supabaseStorage.ts        # Storage helper functions
├── supabase/
│   └── migrations/
│       └── 001_create_tables.sql     # Database schema
├── public/                           # Static assets
└── package.json
```

## 🎨 Design Guidelines

### Color Palette
- **Primary**: Blue (#3B82F6) - Branding kampus
- **Success**: Green (#10B981) - Barang ditemukan
- **Danger**: Red (#EF4444) - Barang hilang
- **Warning**: Yellow (#F59E0B) - Alerts
- **Gray**: Neutral shades untuk text & backgrounds

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Inter/System font, 14-16px
- **Labels**: Medium weight, 12-14px

### Components
- **Rounded corners**: 8-12px
- **Shadows**: Subtle elevation
- **Transitions**: 200ms ease
- **Responsive**: Mobile-first approach

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Email domain validation (@mhs.dinus.ac.id)
- ✅ Protected routes (redirect to login)
- ✅ User can only edit/delete own content
- ✅ File upload validation (type & size)
- ✅ SQL injection prevention (Supabase client)
- ✅ XSS protection (React escape)

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables di Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Update OAuth Redirect
Jangan lupa tambahkan production URL di:
1. Supabase Dashboard > Authentication > Providers > Google
2. Google Cloud Console > OAuth Credentials

## 📝 Catatan Penting

### Supabase Storage Setup
Pastikan bucket `reports-images` sudah dibuat dan **public** sebelum upload foto!

### Email Domain Validation
Hanya email dengan domain `@mhs.dinus.ac.id` yang bisa login.

### RLS Policies
Semua tabel menggunakan Row Level Security. Users hanya bisa:
- Melihat semua laporan & komentar (read)
- Membuat laporan & komentar (create)
- Edit/delete konten sendiri saja (update/delete)

### Real-time Updates
Dashboard dan komentar menggunakan Supabase Realtime untuk update otomatis.

## 🐛 Troubleshooting

### Error: "relation public.users does not exist"
→ Jalankan migration SQL di Supabase SQL Editor

### Error: "Storage bucket not found"
→ Buat bucket `reports-images` di Supabase Storage

### Error: "Invalid email domain"
→ Pastikan login dengan email @mhs.dinus.ac.id

### Avatar/Foto tidak muncul
→ Pastikan Storage bucket sudah public

### OAuth redirect error
→ Periksa authorized redirect URLs di Google Console & Supabase

## 📞 Support

Untuk pertanyaan atau bantuan, silakan buka issue di GitHub repository.

## 📄 License

MIT License - bebas digunakan untuk keperluan pendidikan.

---

**Dibuat dengan ❤️ untuk Mahasiswa Universitas Dian Nuswantoro**
