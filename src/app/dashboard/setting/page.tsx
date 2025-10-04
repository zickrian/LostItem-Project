"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadAvatar } from "@/lib/supabaseStorage";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Image from "next/image";

interface UserSettings {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  last_login: string;
}

interface NotificationSettings {
  email_notif: boolean;
  web_notif: boolean;
}

export default function SettingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notif: true,
    web_notif: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Danger zone state
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    async function init() {
      await fetchUserData();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUserData() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        router.push("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", sessionData.session.user.email)
        .single();

      if (userError) throw userError;

      console.log("👤 User data fetched:", { 
        userId: userData.id, 
        name: userData.name, 
        avatar_url: userData.avatar_url 
      });

      setUser(userData);
      setName(userData.name);
      
      // Add cache busting timestamp ONLY for Supabase Storage URLs (custom uploads)
      // Keep Google photos as-is (no cache busting needed)
      let avatarUrl = userData.avatar_url || "";
      
      if (avatarUrl && avatarUrl.includes('supabase.co/storage')) {
        // Custom uploaded avatar -> add cache busting
        avatarUrl = `${avatarUrl}?t=${Date.now()}`;
        console.log("🖼️ Using custom avatar with cache busting:", avatarUrl);
      } else if (avatarUrl) {
        // Google photo or other external URL -> use as-is
        console.log("🖼️ Using Google/external avatar:", avatarUrl);
      } else {
        console.log("🖼️ No avatar found, will use default");
      }
      
      setAvatarPreview(avatarUrl);

      // Fetch notification settings
      const { data: notifData } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userData.id)
        .single();

      if (notifData) {
        setNotifications({
          email_notif: notifData.email_notif,
          web_notif: notifData.web_notif,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user || saving) return;

    if (!name.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    setSaving(true);
    try {
      let newAvatarUrl = user.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        console.log("🔄 Uploading avatar...", { userId: user.id, fileName: avatarFile.name });
        const uploadedUrl = await uploadAvatar(avatarFile, user.id, user.avatar_url || undefined);
        
        if (uploadedUrl) {
          console.log("✅ Avatar uploaded successfully:", uploadedUrl);
          newAvatarUrl = uploadedUrl;
        } else {
          console.error("❌ Avatar upload failed - uploadedUrl is null");
          alert("Gagal upload avatar. Cek console untuk detail error.");
          setSaving(false);
          return;
        }
      }

      console.log("📝 Updating user profile in database...", {
        userId: user.id,
        name: name.trim(),
        avatar_url: newAvatarUrl
      });

      // Update user profile
      const { error } = await supabase
        .from("users")
        .update({
          name: name.trim(),
          avatar_url: newAvatarUrl,
        })
        .eq("id", user.id);

      if (error) {
        console.error("❌ Database update error:", error);
        throw error;
      }

      console.log("✅ Profile updated successfully!");
      alert("Profil berhasil diperbarui!");
      
      // Refresh data and clear preview
      await fetchUserData();
      setAvatarFile(null);
      
      // Force refresh to update avatar everywhere (Sidebar, etc.)
      router.refresh();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateNotifications() {
    if (!user || saving) return;

    setSaving(true);
    try {
      // Check if notifications record exists
      const { data: existingNotif } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingNotif) {
        // Update existing
        const { error } = await supabase
          .from("notifications")
          .update(notifications)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("notifications")
          .insert({
            user_id: user.id,
            ...notifications,
          });

        if (error) throw error;
      }

      alert("Pengaturan notifikasi berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating notifications:", error);
      alert("Gagal memperbarui pengaturan notifikasi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;

    if (deleteConfirmText !== "HAPUS AKUN") {
      alert('Ketik "HAPUS AKUN" untuk konfirmasi');
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!")) {
      return;
    }

    try {
      // Delete user from public.users (cascade will delete related data)
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) throw deleteError;

      // Sign out and delete from auth
      await supabase.auth.signOut();
      
      // Try to delete from auth.users (may require admin privileges)
      // This might fail depending on RLS policies, but user data is already deleted
      await supabase.auth.admin.deleteUser(user.auth_id);

      alert("Akun berhasil dihapus. Anda akan dialihkan ke halaman utama.");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Gagal menghapus akun. Silakan hubungi administrator.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-700">Memuat pengaturan...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-700">Gagal memuat data pengguna</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Pengaturan</h1>

        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  key={avatarPreview} // Force re-render when avatar changes
                  src={avatarPreview || "/default-avatar.svg"}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-blue-600 object-cover"
                  unoptimized // Disable Next.js image optimization to prevent caching issues
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Profil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">Maksimal 2MB, format: JPG, PNG</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={user.role}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed capitalize"
              />
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Bergabung sejak:</span>{" "}
                {new Date(user.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Login terakhir:</span>{" "}
                {new Date(user.last_login).toLocaleString("id-ID")}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifikasi</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Notifikasi Email</p>
                <p className="text-sm text-gray-500">Terima notifikasi melalui email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email_notif}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_notif: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Notifikasi Web</p>
                <p className="text-sm text-gray-500">Terima notifikasi di browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.web_notif}
                  onChange={(e) =>
                    setNotifications({ ...notifications, web_notif: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button
              onClick={handleUpdateNotifications}
              disabled={saving}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold mt-4"
            >
              {saving ? "Menyimpan..." : "Simpan Pengaturan Notifikasi"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">⚠️ Danger Zone</h2>
          <p className="text-red-700 mb-4">
            Menghapus akun akan menghapus semua data Anda termasuk laporan dan komentar. Tindakan ini
            tidak dapat dibatalkan.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Ketik <span className="font-bold">&quot;HAPUS AKUN&quot;</span> untuk konfirmasi
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="HAPUS AKUN"
                className="w-full px-4 py-2 border-2 text-gray-700 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "HAPUS AKUN"}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              Hapus Akun Permanen
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
