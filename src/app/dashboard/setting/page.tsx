"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

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

      console.log("👤 User data in Settings:", {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar_url: userData.avatar_url,
      });

      setUser(userData);
      setName(userData.name);

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

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!user || saving) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    setSaving(true);
    try {
      // Update user profile (name only, avatar tetap mengikuti Google)
      const { error: profileError } = await supabase
        .from("users")
        .update({
          name: trimmedName,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Pastikan pengaturan notifikasi ikut tersimpan
      const { data: existingNotif, error: notifFetchError } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (notifFetchError) throw notifFetchError;

      let notifError = null;

      if (existingNotif) {
        const { error } = await supabase
          .from("notifications")
          .update(notifications)
          .eq("user_id", user.id);
        notifError = error;
      } else {
        const { error } = await supabase
          .from("notifications")
          .insert({
            user_id: user.id,
            ...notifications,
          });
        notifError = error;
      }

      if (notifError) throw notifError;

      alert("Pengaturan berhasil diperbarui!");
      await fetchUserData();
      router.refresh();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan. Silakan coba lagi.");
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
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4" style={{ borderTopColor: 'rgba(17, 77, 145)', borderBottomColor: 'rgba(17, 77, 145)' }}></div>
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

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h2>

            <div className="space-y-6">
              {/* Avatar - Read Only (from Google) */}
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar_url || "/default-avatar.svg"}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full border-4 object-cover"
                    style={{ borderColor: 'rgba(17, 77, 145)' }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      console.error("❌ Failed to load avatar (settings):", user.avatar_url);
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/default-avatar.svg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Foto Profil</p>
                  <p className="text-xs text-gray-500">Foto profil diambil dari akun Google Anda</p>
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
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
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
                  <div 
                    className="w-11 h-6 rounded-full peer transition-all relative"
                    style={{
                      backgroundColor: notifications.email_notif ? 'rgba(17, 77, 145)' : 'rgb(229, 231, 235)'
                    }}
                  >
                    <div 
                      className="absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform"
                      style={{
                        transform: notifications.email_notif ? 'translateX(20px)' : 'translateX(0)'
                      }}
                    />
                  </div>
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
                  <div 
                    className="w-11 h-6 rounded-full peer transition-all relative"
                    style={{
                      backgroundColor: notifications.web_notif ? 'rgba(17, 77, 145)' : 'rgb(229, 231, 235)'
                    }}
                  >
                    <div 
                      className="absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform"
                      style={{
                        transform: notifications.web_notif ? 'translateX(20px)' : 'translateX(0)'
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full text-white px-6 py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            style={{ backgroundColor: saving ? undefined : 'rgba(17, 77, 145)' }}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.9)')}
            onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145)')}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        {/* Danger Zone */}
  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mt-6">
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
