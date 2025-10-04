import { supabase } from './supabaseClient';

// PENTING: Pastikan nama bucket ini sama dengan yang dibuat di Supabase Dashboard
// Bucket untuk laporan (temuan barang hilang/ditemukan)
export const REPORTS_BUCKET = 'reports';
// Bucket untuk avatar pengguna
export const AVATARS_BUCKET = 'avatars';

/**
 * Upload image untuk laporan ke Supabase Storage
 * @param file - File to upload
 * @param userId - User ID for organizing files
 * @returns Public URL of uploaded image or null on error
 */
export async function uploadImage(file: File, userId: string): Promise<string | null> {
  try {
    // Create unique filename dengan timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `images/${Date.now()}_${file.name}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(REPORTS_BUCKET) // pastikan nama bucket sama dengan di dashboard
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return null;
    }

    // Get public URL dari file yang baru di-upload
    const { data: urlData } = supabase.storage
      .from(REPORTS_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    return null;
  }
}

/**
 * Delete image from Supabase Storage
 * @param imageUrl - Full URL of the image to delete
 * @param bucketName - Name of the bucket (reports or avatars)
 * @returns true if successful, false otherwise
 */
export async function deleteImage(imageUrl: string, bucketName: string = REPORTS_BUCKET): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`${bucketName}/`);
    if (pathParts.length < 2) return false;
    
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Upload avatar image untuk profil pengguna ke Supabase Storage
 * @param file - File to upload
 * @param userId - User ID
 * @param currentAvatarUrl - Current avatar URL to delete (optional)
 * @returns Public URL of uploaded avatar or null on error
 */
export async function uploadAvatar(
  file: File,
  userId: string,
  currentAvatarUrl?: string
): Promise<string | null> {
  try {
    // Hapus avatar lama jika ada
    if (currentAvatarUrl) {
      await deleteImage(currentAvatarUrl, AVATARS_BUCKET);
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload new avatar
    const { data, error } = await supabase.storage
      .from(AVATARS_BUCKET) // pastikan nama bucket sama dengan di dashboard
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return null;
    }

    // Get public URL dari file yang baru di-upload
    const { data: urlData } = supabase.storage
      .from(AVATARS_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    return null;
  }
}
