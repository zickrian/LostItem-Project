# 🔧 Fix: Hapus Foto dari Storage Ketika Report Dihapus

## Masalah
Ketika report dihapus, fotonya masih tersimpan di Supabase Storage bucket "reports". Ini menyebabkan storage waste dan foto yang tidak terpakai tetap ada.

## Solusi yang Diimplementasikan

### 1. ✅ Perbaikan Fungsi `deleteImage()` di `supabaseStorage.ts`

**Masalah:** Parsing URL tidak cocok dengan format URL Supabase
**Solusi:** Menggunakan format path yang benar `/object/public/[bucket]/[filepath]`

```typescript
// SEBELUM (SALAH):
const pathParts = url.pathname.split(`${bucketName}/`);

// SESUDAH (BENAR):
const pathParts = url.pathname.split(`/object/public/${bucketName}/`);
```

**Format URL Supabase:**
```
https://[project-id].supabase.co/storage/v1/object/public/[bucket-name]/[file-path]
```

**Contoh:**
```
https://bcxpmqhxcqiyfnlmnhvv.supabase.co/storage/v1/object/public/reports/images/1728123456789_photo.jpg
                                                                    ^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                                    bucket          file path
```

### 2. ✅ Menambahkan Console Logs untuk Debugging

Sekarang kamu bisa melihat proses penghapusan di Browser Console:

```
delete_report_file: Starting deletion process for: https://...
delete_report_file: Using reports bucket
Attempting to delete image: https://...
From bucket: reports
Extracted file path: images/1728123456789_photo.jpg
Successfully deleted file: images/1728123456789_photo.jpg
delete_report_file: Successfully deleted file
```

### 3. ✅ Update Fungsi Delete di 2 Tempat

#### A. `src/app/dashboard/laporan/page.tsx` - fungsi `confirmDeleteReport()`
Sudah diupdate untuk menghapus foto sebelum menghapus record database.

#### B. `src/app/dashboard/page.tsx` - fungsi `handleDeleteReport()`
**PENTING:** Ini juga diupdate karena user bisa menghapus report dari dashboard!

### 4. ✅ Urutan Penghapusan yang Benar

```
1. Ambil data report (termasuk image_url)
2. Hapus foto dari Storage DULU ← PENTING!
3. Baru hapus record dari Database
4. Tampilkan success message
```

**Kenapa urutan ini penting?**
- Jika kita hapus database dulu, kita akan kehilangan `image_url`
- Tanpa `image_url`, kita tidak bisa hapus foto dari storage

## 🧪 Cara Testing

### 1. Cek Console Browser
Buka Developer Tools (F12) → Console tab

### 2. Hapus Sebuah Report dengan Foto

Kamu akan melihat log seperti ini:
```
Deleting report: abc-123-def
Report data: {id: "abc-123-def", title: "iPhone Hilang", image_url: "https://..."}
Image URL: https://bcxpmqhxcqiyfnlmnhvv.supabase.co/storage/v1/object/public/reports/images/123.jpg
Attempting to delete image from storage...
delete_report_file: Starting deletion process for: https://...
Attempting to delete image: https://...
Extracted file path: images/123.jpg
Successfully deleted file: images/123.jpg
Image deleted successfully from storage
Deleting report from database...
Report deleted successfully from database
```

### 3. Verifikasi di Supabase Dashboard

1. Buka Supabase Dashboard
2. Pergi ke Storage → reports bucket
3. Pastikan foto yang baru dihapus sudah tidak ada

### 4. Test Case

#### Test 1: Report DENGAN Foto
✅ Report dihapus dari database
✅ Foto dihapus dari storage
✅ Muncul toast: "Laporan dan foto berhasil dihapus!"

#### Test 2: Report TANPA Foto
✅ Report dihapus dari database
✅ Tidak ada error (skip delete foto)
✅ Muncul toast: "Laporan dan foto berhasil dihapus!"

#### Test 3: Foto Sudah Tidak Ada di Storage
✅ Report tetap dihapus dari database
✅ Log menunjukkan gagal hapus foto tapi lanjut proses
✅ Muncul toast: "Laporan dan foto berhasil dihapus!"

## 🐛 Troubleshooting

### Masalah: Foto masih ada setelah hapus report

**Cek ini:**

1. **Buka Console Browser** (F12) dan cari error message
   
2. **Cek Format URL** - Pastikan URL foto sesuai format:
   ```
   https://[project].supabase.co/storage/v1/object/public/reports/images/[filename]
   ```

3. **Cek Bucket Name** - Pastikan bucket name adalah "reports" (lowercase)

4. **Cek Permissions** di Supabase:
   - Dashboard → Storage → reports → Configuration
   - Pastikan ada policy untuk DELETE

5. **Cek URL di Database:**
   ```sql
   SELECT id, title, image_url FROM reports WHERE image_url IS NOT NULL;
   ```
   Copy salah satu URL dan paste di browser - pastikan bisa dibuka

### Error: "Invalid URL format"

**Penyebab:** Format URL tidak sesuai atau bucket name salah

**Solusi:**
1. Cek console log untuk melihat URL yang diparsing
2. Pastikan URL mengandung `/object/public/reports/`
3. Jika format berbeda, update parsing di `deleteImage()` function

### Error: "Policy violation" atau "Unauthorized"

**Penyebab:** Tidak ada permission untuk delete

**Solusi:**
1. Buka Supabase Dashboard
2. Pergi ke Storage → reports → Policies
3. Tambahkan policy untuk DELETE:
   ```sql
   -- Allow authenticated users to delete their own files
   CREATE POLICY "Users can delete own files"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Foto Tidak Terhapus Tapi Tidak Ada Error

**Kemungkinan:**
1. Function return `false` tapi tidak throw error
2. Cek console log untuk detail

**Debug:**
```typescript
// Di browser console, test manual:
const imageUrl = "https://your-supabase-url/storage/v1/object/public/reports/images/test.jpg";
const result = await delete_report_file(imageUrl);
console.log("Delete result:", result);
```

## 📝 Catatan Penting

### Storage Policies

Pastikan Supabase Storage memiliki policy yang benar:

```sql
-- Policy untuk DELETE di bucket reports
CREATE POLICY "Authenticated users can delete reports files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'reports');
```

### Cleanup Foto Lama (Optional)

Jika ada banyak foto lama yang tidak terhapus, kamu bisa:

1. **Manual dari Dashboard:**
   - Buka Storage → reports
   - Select files yang tidak dipakai
   - Delete

2. **Dengan Script (Advanced):**
   ```typescript
   // Get all image URLs from database
   const { data: reports } = await supabase
     .from('reports')
     .select('image_url');
   
   const usedUrls = reports.map(r => r.image_url).filter(Boolean);
   
   // Get all files in storage
   const { data: files } = await supabase.storage
     .from('reports')
     .list('images');
   
   // Find unused files
   const unusedFiles = files.filter(file => {
     const fileUrl = `https://[project].supabase.co/storage/v1/object/public/reports/images/${file.name}`;
     return !usedUrls.includes(fileUrl);
   });
   
   // Delete unused files
   for (const file of unusedFiles) {
     await supabase.storage
       .from('reports')
       .remove([`images/${file.name}`]);
   }
   ```

## ✅ Checklist Final

Setelah implementasi, pastikan:

- [x] Function `deleteImage()` menggunakan format path yang benar
- [x] Function `delete_report_file()` dipanggil di semua tempat delete report
- [x] Console logs menampilkan proses dengan jelas
- [x] Import `delete_report_file` di kedua file (laporan & dashboard)
- [x] Urutan penghapusan: Storage → Database
- [x] Toast message menunjukkan "Laporan dan foto berhasil dihapus!"
- [x] Tidak ada foto orphan setelah delete report

## 🚀 Cara Deploy

Setelah semua fix:

```bash
# Test lokal dulu
npm run dev

# Jika sudah OK, commit dan push
git add .
git commit -m "fix: Hapus foto dari storage ketika report dihapus"
git push

# Deploy (jika menggunakan Vercel/Netlify akan auto deploy)
```

## 📚 Referensi

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Delete Files](https://supabase.com/docs/reference/javascript/storage-from-remove)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

---

**Status: ✅ FIXED**
**Last Updated:** 5 Oktober 2025
