"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import SettingSkeleton from "@/components/SettingSkeleton";
import { useToast } from "@/contexts/ToastContext";
import { delete_report_file } from "@/lib/supabaseStorage";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  BellIcon, 
  GlobeAltIcon, 
  ExclamationTriangleIcon, 
  KeyIcon, 
  SparklesIcon,
  PhotoIcon,
  LockClosedIcon,
  UserIcon,
  TrashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

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
  const toast = useToast();
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!user || saving) return;

    setSaving(true);
    
    try {
      // Save notification settings only (name is now locked)
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

      toast.success("Pengaturan berhasil diperbarui!");
      // Refresh untuk memastikan data sinkron dengan database
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteAccountClick() {
    if (!user) return;

    if (deleteConfirmText !== "HAPUS AKUN") {
      toast.error('Ketik "HAPUS AKUN" untuk konfirmasi');
      return;
    }

    // Show confirmation dialog
    setShowDeleteDialog(true);
  }

  async function handleDeleteAccount() {
    if (!user) return;

    // Close dialog
    setShowDeleteDialog(false);

    try {
      // 1. Get all user's reports to delete associated images
      const { data: userReports, error: reportsError } = await supabase
        .from("reports")
        .select("id, image_url")
        .eq("user_id", user.id);

      if (reportsError) {
        toast.error("Gagal mengambil data laporan. Silakan coba lagi.");
        return;
      }

      // 2. Delete all images from storage
      if (userReports && userReports.length > 0) {
        const imageDeletePromises = userReports
          .filter(report => report.image_url)
          .map(report => {
            if (report.image_url) {
              return delete_report_file(report.image_url);
            }
            return Promise.resolve(true);
          });

        const deleteResults = await Promise.allSettled(imageDeletePromises);
        
        const failedDeletes = deleteResults.filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value));
        
        if (failedDeletes.length > 0) {
          toast.error(`${failedDeletes.length} foto gagal dihapus dari storage, namun tetap melanjutkan penghapusan akun...`);
        }
      }

      // 3. Delete user from database (cascade will delete reports and comments automatically due to ON DELETE CASCADE)
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) {
        toast.error("Gagal menghapus data pengguna. Silakan coba lagi.");
        return;
      }

      // 4. Sign out
      await supabase.auth.signOut();
      
      toast.success("Akun dan semua data berhasil dihapus. Anda akan dialihkan ke halaman utama.");
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak terduga";
      toast.error(`Gagal menghapus akun: ${errorMessage}`);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <SettingSkeleton />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Modern Gradient */}
        <div className="mb-6 sm:mb-8 rounded-2xl shadow-lg border border-blue-100 overflow-hidden" style={{ background: 'linear-gradient(135deg, #114D91 0%, #3B82F6 50%, #93C5FD 100%)' }}>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Cog6ToothIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Pengaturan
              </h1>
            </div>
            <p className="text-sm sm:text-base text-white/95">
              Kelola profil dan preferensi akun Anda
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5 sm:space-y-6">
          {/* Profile Settings - Improved */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-5 sm:p-7 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-7">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">Profil Saya</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Informasi pribadi Anda</p>
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {/* Avatar - Read Only (from Google) - Improved */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200">
                <div className="relative w-28 h-28 flex-shrink-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar_url || "/default-avatar.svg"}
                    alt="Avatar"
                    className="h-28 w-28 rounded-2xl border-4 object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                    style={{ borderColor: 'rgba(17, 77, 145)' }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/default-avatar.svg";
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <PhotoIcon className="w-5 h-5 text-gray-700" />
                    <p className="text-base font-bold text-gray-900">Foto Profil</p>
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Foto profil diambil dari akun <span className="font-bold text-blue-600">Google</span> Anda dan diperbarui otomatis
                  </p>
                </div>
              </div>

              {/* Name - Locked (Read-only) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                  <UserIcon className="w-4 h-4" />
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1">
                    <LockClosedIcon className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-bold text-gray-500">Locked</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium flex items-center gap-1">
                  <InformationCircleIcon className="w-4 h-4" />
                  Nama tidak dapat diubah
                </p>
              </div>

              {/* Email (Read-only) - Improved */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1">
                    <LockClosedIcon className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-bold text-gray-500">Locked</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium flex items-center gap-1">
                  <InformationCircleIcon className="w-4 h-4" />
                  Email tidak dapat diubah
                </p>
              </div>

              {/* Role (Read-only) - Improved */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                  <UserCircleIcon className="w-4 h-4" />
                  Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed capitalize font-medium"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-100 px-2 py-1 rounded-md">
                    <span className="text-xs font-bold text-blue-700">System</span>
                  </div>
                </div>
              </div>

              {/* Account Info - Improved */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  Informasi Akun
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-medium flex items-start gap-2">
                    <span className="font-bold text-blue-600 min-w-fit">Bergabung sejak:</span>
                    <span className="font-bold text-gray-900">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 font-medium flex items-start gap-2">
                    <span className="font-bold text-blue-600 min-w-fit">Login terakhir:</span>
                    <span className="font-bold text-gray-900">
                      {new Date(user.last_login).toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings - Improved */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-5 sm:p-7 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-7">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <BellIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">Notifikasi</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Atur preferensi notifikasi Anda</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Notifikasi Email</p>
                    <p className="text-sm text-gray-600 font-medium">Terima notifikasi melalui email</p>
                  </div>
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
                    className="w-14 h-7 rounded-full peer transition-all relative shadow-inner"
                    style={{
                      backgroundColor: notifications.email_notif ? 'rgba(17, 77, 145)' : 'rgb(209, 213, 219)'
                    }}
                  >
                    <div 
                      className="absolute top-[3px] left-[3px] bg-white rounded-full h-5 w-5 transition-all duration-300 shadow-md flex items-center justify-center"
                      style={{
                        transform: notifications.email_notif ? 'translateX(28px)' : 'translateX(0)'
                      }}
                    >
                      {notifications.email_notif && <CheckIcon className="w-3 h-3 text-blue-600" />}
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <GlobeAltIcon className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Notifikasi Web</p>
                    <p className="text-sm text-gray-600 font-medium">Terima notifikasi di browser</p>
                  </div>
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
                    className="w-14 h-7 rounded-full peer transition-all relative shadow-inner"
                    style={{
                      backgroundColor: notifications.web_notif ? 'rgba(17, 77, 145)' : 'rgb(209, 213, 219)'
                    }}
                  >
                    <div 
                      className="absolute top-[3px] left-[3px] bg-white rounded-full h-5 w-5 transition-all duration-300 shadow-md flex items-center justify-center"
                      style={{
                        transform: notifications.web_notif ? 'translateX(28px)' : 'translateX(0)'
                      }}
                    >
                      {notifications.web_notif && <CheckIcon className="w-3 h-3 text-blue-600" />}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button - Improved */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 text-white px-6 py-4 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none text-sm sm:text-base"
            style={{ backgroundColor: saving ? undefined : 'rgba(17, 77, 145)' }}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.9)')}
            onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145)')}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </form>

        {/* Danger Zone - Improved */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-4 border-red-300 rounded-2xl p-5 sm:p-7 mt-5 sm:mt-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <ExclamationTriangleIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-red-900">Danger Zone</h2>
              <p className="text-xs sm:text-sm text-red-700 font-bold">Area berbahaya - hati-hati!</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-4 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-red-800 font-bold leading-relaxed">
                Menghapus akun akan <span className="underline decoration-wavy decoration-red-500">menghapus SEMUA data Anda</span> termasuk laporan dan komentar. 
                <span className="block mt-2 text-red-900 font-black">Tindakan ini TIDAK DAPAT dibatalkan!</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-black text-red-900 mb-2 flex items-center gap-2">
                <KeyIcon className="w-4 h-4" />
                Ketik <span className="px-2 py-1 bg-red-200 rounded-md font-mono">&quot;HAPUS AKUN&quot;</span> untuk konfirmasi
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="HAPUS AKUN"
                className="w-full px-4 py-3 border-3 text-gray-900 border-red-400 rounded-xl focus:ring-4 focus:ring-red-300 focus:border-red-500 font-bold placeholder:font-normal placeholder:text-gray-400 transition-all duration-200"
              />
              <p className="text-xs text-red-700 mt-2 font-medium flex items-center gap-1">
                <InformationCircleIcon className="w-4 h-4" />
                Harus persis sesuai (HURUF BESAR)
              </p>
            </div>

            <button
              onClick={handleDeleteAccountClick}
              disabled={deleteConfirmText !== "HAPUS AKUN"}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-black shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {deleteConfirmText !== "HAPUS AKUN" ? (
                <>
                  <LockClosedIcon className="w-5 h-5" />
                  <span>Ketik Konfirmasi Dulu</span>
                </>
              ) : (
                <>
                  <TrashIcon className="w-5 h-5" />
                  <span>Hapus Akun Permanen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Hapus Akun Permanen?"
        message="Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan dan akan menghapus SEMUA laporan, komentar, dan foto yang pernah Anda upload!"
        confirmText="Ya, Hapus Akun"
        cancelText="Batal"
        type="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </DashboardLayout>
  );
}
