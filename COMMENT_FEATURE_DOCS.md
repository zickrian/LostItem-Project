# 💬 Fitur Komentar - Dokumentasi Implementasi

## 📋 Overview
Sistem komentar real-time yang memungkinkan user untuk berkomunikasi di setiap kartu laporan (barang hilang/temuan).

---

## 🗄️ Database Schema

### Tabel: `comments`

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Kolom-kolom:
- **id**: UUID primary key (auto-generated)
- **report_id**: Foreign key ke tabel reports (CASCADE on delete)
- **user_id**: Foreign key ke tabel users (CASCADE on delete)
- **content**: Isi komentar (TEXT, required)
- **created_at**: Timestamp otomatis saat komentar dibuat
- **updated_at**: Timestamp otomatis saat komentar diupdate

#### Indexes:
- `idx_comments_report_id` - Mempercepat query berdasarkan report_id
- `idx_comments_user_id` - Mempercepat query berdasarkan user_id
- `idx_comments_created_at` - Mempercepat sorting by date (DESC)

#### Row Level Security (RLS):
- ✅ Semua user bisa **melihat** semua komentar
- ✅ User yang login bisa **menambah** komentar
- ✅ User hanya bisa **edit/delete** komentar sendiri

---

## 🧩 Komponen

### 1. **CommentSection.tsx**

Komponen utama untuk menampilkan dan mengelola komentar.

#### Props:
```typescript
interface CommentSectionProps {
  reportId: string;      // ID laporan
  currentUserId: string; // ID user yang sedang login
}
```

#### Fitur:
- 📜 **Menampilkan list komentar** dengan real-time updates
- 💬 **Form untuk menambah komentar baru**
- 👤 **Avatar & nama user** di setiap komentar
- ⏰ **Timestamp relatif** (Baru saja, 5 menit yang lalu, dll)
- 🗑️ **Hapus komentar** (hanya komentar sendiri)
- 🔄 **Real-time subscription** via Supabase
- 📱 **Responsive design**

#### Real-time Updates:
```typescript
const channel = supabase
  .channel(`comments-${reportId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'comments',
    filter: `report_id=eq.${reportId}`,
  }, () => {
    fetchComments();
  })
  .subscribe();
```

---

### 2. **ReportCard.tsx**

Kartu laporan dengan fitur komentar (untuk view detail).

#### Update:
- ✅ Sudah memiliki tombol toggle komentar
- ✅ Menampilkan/menyembunyikan CommentSection
- ✅ State `showComments` untuk tracking visibility

#### Tampilan:
```
┌──────────────────────────────┐
│ [Avatar] Nama User           │
│ Judul Laporan         [Edit] │
│                              │
│ Deskripsi...                 │
│                              │
│ [Kategori] [Lokasi]          │
│ [Gambar]                     │
│                              │
│ 💬 Tampilkan Komentar        │  ← Toggle button
└──────────────────────────────┘
│ [Komentar Section]           │  ← Expandable
└──────────────────────────────┘
```

---

### 3. **ReportGrid.tsx**

Grid kartu-kartu laporan (untuk dashboard & halaman laporan).

#### Update Terbaru:
```typescript
// Props baru
interface ReportGridProps {
  currentUserId?: string;  // ← BARU!
  // ... props lainnya
}

// State tracking
const [openComments, setOpenComments] = useState<Set<string>>(new Set());

// Toggle function
const toggleComments = (reportId: string) => { ... };
```

#### Tampilan Grid Card:
```
┌─────────────────┐
│ [Gambar]  [Tag] │
│                 │
│ Judul           │
│ Deskripsi...    │
│ [Kategori] 📍   │
│ 4 Okt 2025      │
│                 │
│ 💬 Komentar     │  ← Toggle button
└─────────────────┘
│ [Comments]      │  ← Expandable
└─────────────────┘
```

---

## 🔗 Integrasi di Pages

### Dashboard (`/dashboard/page.tsx`)
```tsx
<ReportGrid
  reports={filteredReports}
  showActions={false}
  currentUserId={user?.id}  // ← PASS USER ID
/>
```

### Laporan (`/dashboard/laporan/page.tsx`)
```tsx
<ReportGrid
  reports={filteredReports}
  showActions={true}
  currentUserId={user?.id}  // ← PASS USER ID
  onEdit={...}
  onComplete={...}
  onDelete={...}
/>
```

---

## 🎨 UI/UX Features

### Format Waktu Relatif:
- **< 1 menit**: "Baru saja"
- **< 1 jam**: "5 menit yang lalu"
- **< 1 hari**: "3 jam yang lalu"
- **> 1 hari**: "4 Okt 2025"

### Avatar Fallback:
```tsx
onError={(event) => {
  event.currentTarget.src = "/default-avatar.svg";
}}
```

### Styling:
- 🎨 Avatar rounded-full dengan border
- 💭 Bubble chat style untuk komentar
- 📊 Max height 96 (max-h-96) dengan scroll
- 🌈 Gray background (#F9FAFB)
- 🔵 Blue accent color untuk button & focus

---

## 🚀 Cara Menggunakan

### 1. Jalankan Migration
```bash
# Jalankan migration di Supabase Dashboard
# atau via CLI:
supabase migration up
```

### 2. Lihat Komentar
- Klik tombol **"💬 Tampilkan Komentar"** atau **"💬 Komentar"**
- Section komentar akan expand di bawah card

### 3. Tambah Komentar
- Ketik komentar di input box
- Klik **"Kirim"**
- Komentar langsung muncul (real-time)

### 4. Hapus Komentar
- Hanya muncul tombol "Hapus" untuk komentar sendiri
- Klik "Hapus" → Konfirmasi → Dihapus

---

## 🔐 Security

### RLS Policies:
```sql
-- Semua user bisa lihat
"Comments are viewable by everyone"

-- Hanya user login bisa insert
"Authenticated users can insert comments"

-- Hanya owner bisa update/delete
"Users can update their own comments"
"Users can delete their own comments"
```

### Validasi:
- ✅ Cek user authentication
- ✅ Cek ownership sebelum delete
- ✅ Trim whitespace dari input
- ✅ Prevent empty comments

---

## 📱 Responsive Design

### Mobile:
- Avatar size: 8 (32px)
- Font size: text-sm
- Compact spacing

### Desktop:
- Smooth hover effects
- Better spacing
- Max width container

---

## 🐛 Error Handling

### Fetch Comments:
```typescript
try {
  // fetch comments
} catch (error) {
  toast.error("Gagal memuat komentar");
}
```

### Submit Comment:
```typescript
try {
  // submit comment
  toast.success("Komentar berhasil ditambahkan");
} catch (error) {
  toast.error("Gagal mengirim komentar. Silakan coba lagi.");
}
```

### Delete Comment:
```typescript
try {
  // delete comment
  toast.success("Komentar berhasil dihapus");
} catch (error) {
  toast.error("Gagal menghapus komentar.");
}
```

---

## 📊 Performance

### Optimizations:
- ✅ **Real-time subscription** hanya untuk report yang dibuka
- ✅ **Lazy loading** - komentar dimuat saat section dibuka
- ✅ **Index database** untuk query cepat
- ✅ **Debouncing** untuk prevent spam
- ✅ **Optimistic updates** (langsung tampil sebelum confirm dari server)

---

## 🎯 Next Steps (Optional Improvements)

1. **Edit komentar** - Tambah fitur edit komentar
2. **Like/React** - Tambah emoji reaction
3. **Reply komentar** - Nested comments
4. **Mention user** - Tag user dengan @username
5. **Rich text** - Support markdown/formatting
6. **Image upload** - Attach gambar di komentar
7. **Load more** - Pagination untuk banyak komentar
8. **Notification** - Notif saat ada komentar baru

---

## 📝 File Changes Summary

### New Files:
- ✅ `supabase/migrations/002_create_comments_table.sql`

### Modified Files:
- ✅ `src/components/CommentSection.tsx` (sudah ada, verified)
- ✅ `src/components/ReportCard.tsx` (sudah ada fitur, verified)
- ✅ `src/components/ReportGrid.tsx` (ditambah fitur komentar)
- ✅ `src/app/dashboard/page.tsx` (pass currentUserId)
- ✅ `src/app/dashboard/laporan/page.tsx` (pass currentUserId)

---

## ✅ Testing Checklist

- [ ] Migration berhasil dijalankan
- [ ] Tabel comments terbuat di Supabase
- [ ] RLS policies aktif
- [ ] User bisa melihat semua komentar
- [ ] User bisa menambah komentar
- [ ] User bisa hapus komentar sendiri
- [ ] User TIDAK bisa hapus komentar orang lain
- [ ] Real-time updates berfungsi
- [ ] Avatar fallback berfungsi
- [ ] Format waktu relatif benar
- [ ] Responsive di mobile
- [ ] Toast notification muncul

---

**🎉 Selamat! Fitur komentar sudah siap digunakan!**
