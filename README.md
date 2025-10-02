# LostItem-Project
# Lost Item Project README

**Platform Barang Hilang Mahasiswa**  
Helping students reclaim their lost items through a smart reporting and tracking system.
## Access Control
- Users MUST login to see any items - without login they cannot see the lost items list at all.

---
## Tech Stack
- **Frontend:** React + Tailwind CSS
- **Database:** Supabase
- **Backend:** Supabase API (serverless)

## 📋 Deskripsi Sistem
## Login Flow
- Users must log in before accessing any content.

Platform berbasis web untuk membantu mahasiswa dalam melaporkan dan menemukan barang hilang maupun barang temuan. Melalui sistem ini, mahasiswa dapat dengan mudah mengumumkan barang yang mereka temukan atau melaporkan barang yang hilang, serta berinteraksi dengan pengguna lain untuk memastikan barang kembali ke pemiliknya.
## User Access Table
- Without login, users cannot access anything.

---
## SQL Schema
- Supabase will be used instead of traditional MySQL.

## 🎯 Fitur Utama

### 1. **Beranda (Home Page)**
- Menampilkan daftar postingan barang hilang dan barang temuan dalam bentuk card
- Setiap card berisi:
  - Foto barang
  - Judul barang
  - Deskripsi singkat
  - Nama akun pengirim
- **Pengguna yang sudah login** dapat memberikan komentar pada postingan untuk mengklaim kepemilikan atau berdiskusi
- **Pengguna tanpa login** hanya bisa melihat daftar barang tanpa bisa berkomentar atau melaporkan barang

### 2. **Halaman Laporkan Barang (Report Page)**
- Berisi daftar/history laporan yang pernah dibuat oleh pengguna
- Tombol **"Laporkan Barang Hilang/Temuan"** di bagian atas untuk membuat laporan baru
- Form popup untuk mengisi data barang:
  - Foto barang
  - Judul
  - Deskripsi
  - Jenis/kategori barang
  - Lokasi kehilangan/penemuan
- Fitur **"Mark as Done"**:
  - Mengubah status laporan menjadi selesai
  - Laporan berubah tampilan menjadi abu-abu
  - Laporan dipindahkan ke bagian bawah dengan label "Mark as Done"

### 3. **Halaman Pengaturan (Settings Page)**
- Mengelola informasi akun pengguna
- Data yang dapat diubah:
  - Nama lengkap
  - Email
  - Foto profil
  - Kontak

### 4. **Halaman Laporan Statistik (Analytics)**
- Menampilkan statistik barang hilang dalam periode:
  - Mingguan
  - Bulanan
  - Tahunan
- Informasi yang ditampilkan:
  - Jumlah barang hilang dalam periode tertentu
  - Jenis barang yang sering hilang (grafik/diagram)
  - Lokasi paling sering barang hilang
  - Persentase laporan berdasarkan kategori (elektronik, pakaian, dll)
- Grafik interaktif untuk analisis visual

### 5. **Fitur Logout**
- Tombol untuk keluar dari akun dengan aman

---

## 👥 Akses Pengguna

| Status | Akses |
|--------|-------|
| **Tanpa Login** | Hanya dapat melihat daftar barang di Home Page |
| **Dengan Login** | Akses penuh: lapor barang, komentar, mark as done, pengaturan, dan laporan statistik |

---

## 🔐 Sistem Login & Autentikasi

### Alur Login (Opsional - Akan Diimplementasikan)
1. **Landing Page** ditampilkan saat pertama kali membuka web:
   - Penjelasan singkat fungsi platform
   - Tombol **"Sign In with Google"** atau login dengan NIM
2. Setelah login → diarahkan ke **Dashboard/Home Page**
3. Sistem menggunakan **session login** yang tersimpan
4. Pengguna tidak perlu login ulang selama belum logout

### Keamanan
- Password disimpan dalam format terenkripsi menggunakan **bcrypt**
- Setiap pengguna memiliki **user_id** unik
- Login menggunakan **NIM** dan **password**

---

## 🗄️ Struktur Database

### Tabel `users` (Pengguna/Mahasiswa)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `user_id` | INT, PRIMARY KEY, AUTO_INCREMENT | ID unik pengguna |
| `nim` | VARCHAR, UNIQUE | Nomor Induk Mahasiswa |
| `password` | VARCHAR | Password terenkripsi |
| `full_name` | VARCHAR | Nama lengkap |
| `email` | VARCHAR | Email pengguna |
| `profile_picture` | VARCHAR | URL/path foto profil |
| `created_at` | DATETIME | Waktu pendaftaran |
| `updated_at` | DATETIME | Waktu update terakhir |

### Tabel `items` (Barang yang Dilaporkan)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `item_id` | INT, PRIMARY KEY, AUTO_INCREMENT | ID unik barang |
| `user_id` | INT, FOREIGN KEY | ID pengguna pelapor |
| `title` | VARCHAR | Judul barang |
| `description` | TEXT | Deskripsi barang |
| `category` | VARCHAR | Kategori barang |
| `location` | VARCHAR | Lokasi kehilangan |
| `status` | ENUM('Active', 'Done') | Status barang |
| `image_url` | VARCHAR | URL/path gambar |
| `created_at` | DATETIME | Waktu laporan dibuat |
| `updated_at` | DATETIME | Waktu update terakhir |

### Tabel `comments` (Komentar pada Postingan)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `comment_id` | INT, PRIMARY KEY, AUTO_INCREMENT | ID unik komentar |
| `item_id` | INT, FOREIGN KEY | ID barang yang dikomentari |
| `user_id` | INT, FOREIGN KEY | ID pengguna pemberi komentar |
| `comment` | TEXT | Isi komentar |
| `created_at` | DATETIME | Waktu komentar dibuat |

### Tabel `reports` (Laporan Statistik)
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `report_id` | INT, PRIMARY KEY, AUTO_INCREMENT | ID unik laporan |
| `user_id` | INT, FOREIGN KEY | ID pengguna pembuat laporan |
| `period` | ENUM('Daily', 'Weekly', 'Monthly', 'Yearly') | Periode laporan |
| `total_lost_items` | INT | Total barang hilang |
| `most_lost_category` | VARCHAR | Kategori paling sering hilang |
| `most_common_location` | VARCHAR | Lokasi paling sering hilang |
| `created_at` | DATETIME | Waktu laporan dibuat |

---

## 💻 SQL Schema

```sql
-- Tabel Users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    profile_picture VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Items
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(50),
    location VARCHAR(100),
    status ENUM('Active', 'Done') DEFAULT 'Active',
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabel Comments
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT,
    user_id INT,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabel Reports
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    period ENUM('Daily', 'Weekly', 'Monthly', 'Yearly'),
    total_lost_items INT,
    most_lost_category VARCHAR(50),
    most_common_location VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

## 🔒 Implementasi Enkripsi Password (Bcrypt)

### Hashing Password Saat Registrasi
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash password sebelum menyimpan ke database
bcrypt.hash('password123', saltRounds, function(err, hashedPassword) {
  if (err) throw err;
  // Simpan hashedPassword ke database
  console.log('Password terenkripsi:', hashedPassword);
});
```

### Verifikasi Password Saat Login
```javascript
// Bandingkan password input dengan hash di database
bcrypt.compare('password123', hashedPassword, function(err, result) {
  if (err) throw err;
  
  if (result) {
    console.log('Login berhasil!');
    // Buat session untuk pengguna
  } else {
    console.log('Password salah!');
  }
});
```

---

## 🚀 Tech Stack (Rencana)

- **Frontend**: HTML, CSS, JavaScript (React/Vue.js)
- **Backend**: Node.js dengan Express.js
- **Database**: MySQL
- **Authentication**: bcrypt untuk enkripsi password
- **Session Management**: express-session atau JWT

---

## 📊 Alur Sistem

```
┌─────────────┐
│ Landing Page│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Login    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         Home Page               │
│  (Daftar Barang Hilang/Temuan)  │
└────┬──────────┬─────────┬───────┘
     │          │         │
     ▼          ▼         ▼
┌─────────┐ ┌──────┐ ┌──────────┐
│ Report  │ │ Stats│ │ Settings │
│  Page   │ │ Page │ │   Page   │
└─────────┘ └──────┘ └──────────┘
```

---

## 📝 Catatan Pengembangan

### Prioritas Fitur
1. ✅ Sistem autentikasi dan registrasi
2. ✅ CRUD laporan barang hilang/temuan
3. ✅ Sistem komentar
4. ✅ Mark as Done
5. ⏳ Statistik dan analytics (belum implementasi)
6. ⏳ Sign in with Google (opsional)

### Keamanan
- Wajib login untuk berinteraksi (komentar, lapor, mark as done)
- Tracking pengguna untuk mencegah spam dan penyalahgunaan
- Data terorganisir dengan jelas (setiap laporan tercatat pemiliknya)

---

## 👨‍💻 Tim Pengembang

**Proyek Mata Kuliah Metodologi Pemrograman**

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik.

---

**© 2025 LostItem-Project - Platform Barang Hilang Mahasiswa**
## Other Information
- All other content remains the same.
