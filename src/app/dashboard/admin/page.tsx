"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/DashboardLayout";
import ReportGrid, { GridReport } from "@/components/ReportGrid";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { delete_report_file } from "@/lib/supabaseStorage";
import { 
  ShieldCheckIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminReport extends GridReport {
  type: "hilang" | "temuan";
  status: "aktif" | "selesai";
  user?: {
    name: string;
    avatar_url?: string;
    email?: string;
  };
}

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const CATEGORIES = [
  "Elektronik",
  "Dokumen",
  "Kunci",
  "Tas & Dompet",
  "Aksesoris",
  "Buku & Alat Tulis",
  "Lainnya",
];

export default function AdminPage() {
  const router = useRouter();
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"laporan" | "pengguna">("laporan");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"aktif" | "selesai" | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "hilang" | "temuan">("all");
  const [editReport, setEditReport] = useState<AdminReport | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    type: "hilang" as "hilang" | "temuan",
    status: "aktif" as "aktif" | "selesai",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    reportId: "",
    title: "",
    message: "",
  });
  const [confirmUser, setConfirmUser] = useState<{ isOpen: boolean; userId: string; name: string }>(
    { isOpen: false, userId: "", name: "" }
  );
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const email = sessionData.session.user.email;
      const { data: userData } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("email", email)
        .maybeSingle();

      if (!userData || userData.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setCurrentUser(userData as User);
      await Promise.all([fetchReports(), fetchUsers()]);
      setLoading(false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((r) => r.type === typeFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.location?.toLowerCase().includes(query) ||
          r.user?.name?.toLowerCase().includes(query) ||
          r.user?.email?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [reports, search, statusFilter, typeFilter]);

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          id, title, description, category, location, type, status, created_at, image_url, latitude, longitude,
          user:user_id ( name, avatar_url, email )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((item) => {
        const userObj = Array.isArray(item.user) && item.user.length > 0 ? item.user[0] : item.user;
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          location: item.location,
          type: item.type,
          status: item.status,
          image_url: item.image_url,
          created_at: item.created_at,
          latitude: item.latitude ?? undefined,
          longitude: item.longitude ?? undefined,
          user: userObj || undefined,
        } as AdminReport;
      });

      setReports(mapped);
    } catch (error) {
      console.error("Failed to fetch reports", error);
      toast.error("Gagal memuat semua laporan");
    }
  }

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Gagal memuat data pengguna");
    }
  }

  function handleEdit(reportId: string) {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    setEditReport(report);
    setEditForm({
      title: report.title,
      description: report.description || "",
      category: report.category,
      location: report.location || "",
      type: report.type,
      status: report.status,
    });
  }

  async function handleSaveEdit() {
    if (!editReport || savingEdit) return;
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from("reports")
        .update({
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          category: editForm.category,
          location: editForm.location.trim(),
          type: editForm.type,
          status: editForm.status,
        })
        .eq("id", editReport.id);

      if (error) throw error;

      toast.success("Laporan berhasil diperbarui");
      setEditReport(null);
      await fetchReports();
    } catch {
      toast.error("Gagal menyimpan perubahan laporan");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleToggleStatus(reportId: string, currentStatus: "aktif" | "selesai") {
    const newStatus = currentStatus === "aktif" ? "selesai" : "aktif";
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: newStatus })
        .eq("id", reportId);

      if (error) throw error;

      toast.success(`Status diubah ke ${newStatus}`);
      await fetchReports();
    } catch {
      toast.error("Gagal mengubah status laporan");
    }
  }

  function handleDeleteReport(reportId: string) {
    setConfirmDialog({
      isOpen: true,
      reportId,
      title: "Hapus Laporan",
      message: "Hapus laporan ini beserta foto dan komentar?",
    });
  }

  async function confirmDeleteReport() {
    const { reportId } = confirmDialog;
    if (!reportId || deleting) return;
    setDeleting(true);
    setConfirmDialog({ isOpen: false, reportId: "", title: "", message: "" });
    try {
      const target = reports.find((r) => r.id === reportId);
      if (target?.image_url) {
        await delete_report_file(target.image_url);
      }

      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);

      if (error) throw error;
      toast.success("Laporan dihapus");
      await fetchReports();
    } catch {
      toast.error("Gagal menghapus laporan");
    } finally {
      setDeleting(false);
    }
  }

  function cancelDeleteReport() {
    setConfirmDialog({ isOpen: false, reportId: "", title: "", message: "" });
  }

  function handleDeleteUser(userId: string, name: string) {
    setConfirmUser({ isOpen: true, userId, name });
  }

  async function confirmDeleteUser() {
    if (!confirmUser.userId) return;
    setConfirmUser({ ...confirmUser, isOpen: false });

    try {
      const { data: userReports } = await supabase
        .from("reports")
        .select("id, image_url")
        .eq("user_id", confirmUser.userId);

      if (userReports && userReports.length > 0) {
        const deletions = userReports
          .filter((r) => r.image_url)
          .map((r) => delete_report_file(r.image_url as string));
        await Promise.allSettled(deletions);
      }

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", confirmUser.userId);

      if (error) throw error;

      toast.success("Pengguna dan semua datanya dihapus");
      await Promise.all([fetchUsers(), fetchReports()]);
    } catch {
      toast.error("Gagal menghapus pengguna");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen text-gray-700">Memuat admin...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 rounded-2xl shadow-lg border border-blue-100 overflow-hidden" style={{ background: "linear-gradient(135deg, #114D91 0%, #3B82F6 50%, #93C5FD 100%)" }}>
          <div className="p-6 sm:p-8 flex flex-col gap-3 sm:gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Admin</h1>
              <p className="text-sm sm:text-base text-white/90">Kelola semua laporan dan pengguna</p>
            </div>
            <div className="flex flex-wrap gap-3 text-white/90 text-sm font-semibold">
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Total laporan: {reports.length}</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Total pengguna: {users.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("laporan")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              backgroundColor: activeTab === "laporan" ? '#114D91' : 'white',
              color: activeTab === "laporan" ? '#FFFFFF' : '#6B7280',
              boxShadow: activeTab === "laporan" ? '0 2px 8px rgba(17, 77, 145, 0.15)' : 'none',
              border: activeTab === "laporan" ? 'none' : '1px solid #E5E7EB',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "laporan") {
                e.currentTarget.style.backgroundColor = '#EAF2FF';
                e.currentTarget.style.color = '#114D91';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "laporan") {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            <DocumentTextIcon className="w-5 h-5" />
            Laporan
          </button>
          <button
            onClick={() => setActiveTab("pengguna")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              backgroundColor: activeTab === "pengguna" ? '#114D91' : 'white',
              color: activeTab === "pengguna" ? '#FFFFFF' : '#6B7280',
              boxShadow: activeTab === "pengguna" ? '0 2px 8px rgba(17, 77, 145, 0.15)' : 'none',
              border: activeTab === "pengguna" ? 'none' : '1px solid #E5E7EB',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "pengguna") {
                e.currentTarget.style.backgroundColor = '#EAF2FF';
                e.currentTarget.style.color = '#114D91';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "pengguna") {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            <UsersIcon className="w-5 h-5" />
            Pengguna
          </button>
        </div>

        {/* Laporan Tab */}
        {activeTab === "laporan" && (
          <>
            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-2 flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul, kategori, lokasi, atau email"
                  className="w-full bg-transparent outline-none text-sm text-gray-900"
                />
              </div>

              <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-900"
                >
                  <option value="all">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-900"
                >
                  <option value="all">Semua tipe</option>
                  <option value="hilang">Hilang</option>
                  <option value="temuan">Temuan</option>
                </select>
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Semua Laporan</h2>
                <span className="text-sm text-gray-500">{filteredReports.length} laporan</span>
              </div>
              <ReportGrid
                reports={filteredReports}
                showActions
                showComments={false}
                showUserProfile
                onEdit={handleEdit}
                onComplete={handleToggleStatus}
                onDelete={handleDeleteReport}
              />
            </div>
          </>
        )}

        {/* Pengguna Tab */}
        {activeTab === "pengguna" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Pengguna</h2>
            </div>
            <span className="text-sm text-gray-500">{users.length} pengguna</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Nama</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Dibuat</th>
                  <th className="py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-semibold text-gray-900">{u.name}</td>
                    <td className="py-3 pr-4 text-gray-700">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="text-red-600 hover:text-red-700 font-semibold"
                        disabled={u.id === currentUser?.id}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editReport && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Laporan</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700">Judul</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Deskripsi</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Kategori</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Pilih kategori</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Lokasi</label>
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Tipe</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "hilang" | "temuan" })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="hilang">Hilang</option>
                    <option value="temuan">Temuan</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "aktif" | "selesai" })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setEditReport(null)}
                className="px-4 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-4 py-2 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {savingEdit ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDeleteReport}
        onCancel={cancelDeleteReport}
        confirmText="Hapus"
        type="danger"
      />

      <ConfirmDialog
        isOpen={confirmUser.isOpen}
        title="Hapus Pengguna?"
        message={`Hapus ${confirmUser.name} beserta semua laporannya?`}
        onConfirm={confirmDeleteUser}
        onCancel={() => setConfirmUser({ isOpen: false, userId: "", name: "" })}
        confirmText="Hapus"
        type="danger"
      />
    </DashboardLayout>
  );
}
