# 🧪 Quick Test Guide - Avatar Google

## ✅ Yang Harus Dilakukan Sekarang

### **1. Hard Refresh Browser**
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### **2. Test Avatar Google Muncul**

#### **Step 1: Cek Sidebar**
- [ ] Buka Dashboard
- [ ] Lihat Sidebar (kiri)
- [ ] **Foto Google harus muncul** ✅
- [ ] Nama harus sesuai

#### **Step 2: Cek Settings Page**
- [ ] Klik menu **"Setting"**
- [ ] Lihat bagian **"Profil Saya"**
- [ ] **Foto Google harus muncul** ✅
- [ ] Text: "Foto profil diambil dari akun Google Anda"
- [ ] **TIDAK ADA** input "Choose File" ✅

#### **Step 3: Test Update Name**
- [ ] Di Settings, ubah nama
- [ ] Klik **"Simpan Perubahan"**
- [ ] Alert: "Profil berhasil diperbarui!"
- [ ] Nama berubah di Sidebar
- [ ] **Foto tetap Google** ✅

#### **Step 4: Cek Mobile View**
- [ ] Buka DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Pilih mobile view
- [ ] **Foto Google muncul di header mobile** ✅

---

## 🐛 Kalau Foto Tidak Muncul

### **Check 1: Console Logs**
Buka Console (F12) → Tab Console

**Harus ADA**:
```
(No errors related to avatar)
```

**Harus TIDAK ADA**:
```
❌ Error fetching user data
❌ Cannot find avatar_url
❌ 404 on avatar URL
```

### **Check 2: Database**
Buka Supabase Dashboard → SQL Editor → Run:
```sql
SELECT id, name, email, avatar_url 
FROM users 
WHERE email = 'your-email@mhs.dinus.ac.id';
```

**Expected**:
- `avatar_url` = `https://lh3.googleusercontent.com/...` (Google photo URL)
- **BUKAN** `null`
- **BUKAN** `https://...supabase.co/storage/...`

### **Check 3: Network Tab**
Buka DevTools (F12) → Tab Network
- [ ] Ada request ke `googleusercontent.com`?
- [ ] Status code: **200 OK**
- [ ] Image loaded successfully

---

## ✅ Success Indicators

Semuanya berhasil jika:
1. ✅ Foto Google muncul di Sidebar
2. ✅ Foto Google muncul di Settings
3. ✅ Foto Google muncul di Mobile header
4. ✅ **TIDAK ADA** input "Choose File" di Settings
5. ✅ Text: "Foto profil diambil dari akun Google Anda"
6. ✅ Update nama berhasil (foto tetap Google)
7. ✅ No errors di Console

---

## 🎯 Next: Test Upload Foto Laporan

Setelah avatar Google working, test upload foto untuk laporan:

1. Pergi ke **Dashboard → Laporan**
2. Klik **"+ Buat Laporan Baru"**
3. Isi form
4. **Upload foto** (Choose File)
5. Klik **"Simpan"**
6. Foto laporan harus muncul ✅

---

**Status**: Ready to test! 🚀
