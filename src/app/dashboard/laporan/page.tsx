"use client";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "@/lib/supabaseStorage";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ReportGrid, { GridReport } from "@/components/ReportGrid";
import Image from "next/image";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type ReportType = "hilang" | "temuan";
type ReportStatus = "aktif" | "selesai";

interface UserReport {
  id: string;
  title: string;
  description?: string;
  category: string;
  location?: string;
  type: ReportType;
  status: ReportStatus;
  created_at: string;
  image_url?: string;
}

const CATEGORIES = [
  "Elektronik",
  "Dokumen",
  "Kunci",
  "Tas & Dompet",
  "Pakaian",
  "Aksesoris",
  "Buku & Alat Tulis",
  "Lainnya",
];

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

function LaporanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const toast = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [myReports, setMyReports] = useState<UserReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<UserReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("aktif");
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "hilang" as ReportType,
    location: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    reportId: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    async function init() {
      await checkUser();
      await fetchMyReports();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editId && myReports.length > 0) {
      loadReportForEdit(editId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, myReports]);

  useEffect(() => {
    filterReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myReports, statusFilter]);

  async function checkUser() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("email", sessionData.session.user.email)
        .single();

      setUser(userData);
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
    }
  }

  async function fetchMyReports() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", sessionData.session.user.email)
        .single();

      if (!userData) return;

      const { data, error } = await supabase
        .from("reports")
        .select("id, title, description, category, location, type, status, created_at, image_url")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMyReports(data || []);
    } catch (error) {
      toast.error("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  }

  function filterReports() {
    if (statusFilter === "all") {
      setFilteredReports(myReports);
    } else {
      setFilteredReports(myReports.filter((r) => r.status === statusFilter));
    }
  }

  function loadReportForEdit(reportId: string) {
    const report = myReports.find((r) => r.id === reportId);
    if (!report) return;

    setEditMode(true);
    setEditingId(reportId);
    
    // Load the full report data
    supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single()
      .then(({ data }) => {
        if (data) {
          setFormData({
            title: data.title,
            description: data.description || "",
            category: data.category || "",
            type: data.type,
            location: data.location || "",
          });
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || submitting) return;

    if (!formData.title.trim() || !formData.category) {
      toast.error("Judul dan kategori harus diisi!");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = imagePreview;

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, user.id);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const reportData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        location: formData.location.trim(),
        image_url: imageUrl || null,
        status: "aktif",
      };

      if (editMode) {
        // Update existing report
        const { error } = await supabase
          .from("reports")
          .update(reportData)
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Laporan berhasil diperbarui!");
      } else {
        // Create new report
        const { error } = await supabase.from("reports").insert(reportData);

        if (error) throw error;
        toast.success("Laporan berhasil dibuat!");
      }

      // Reset form
      resetForm();
      setShowModal(false);
      fetchMyReports();
      router.push("/dashboard/laporan");
    } catch (error) {
      toast.error("Gagal menyimpan laporan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      category: "",
      type: "hilang",
      location: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditMode(false);
    setEditingId("");
  }

  function handleDeleteReport(reportId: string) {
    if (!user) return;
    
    setConfirmDialog({
      isOpen: true,
      reportId,
      title: "Hapus Laporan",
      message: "Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.",
    });
  }

  async function confirmDeleteReport() {
    const { reportId } = confirmDialog;
    
    setConfirmDialog({ isOpen: false, reportId: "", title: "", message: "" });

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId)
        .eq("user_id", user!.id);

      if (error) throw error;

      toast.success("Laporan berhasil dihapus!");
      fetchMyReports();
      
      if (editingId === reportId) {
        resetForm();
      }
    } catch (error) {
      toast.error("Gagal menghapus laporan.");
    }
  }

  function cancelDeleteReport() {
    setConfirmDialog({ isOpen: false, reportId: "", title: "", message: "" });
  }

  async function handleToggleStatus(reportId: string, currentStatus: ReportStatus) {
    if (!user) return;
    const newStatus = currentStatus === "aktif" ? "selesai" : "aktif";
    
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: newStatus })
        .eq("id", reportId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success(`Status berhasil diubah menjadi ${newStatus}`);
      fetchMyReports();
    } catch (error) {
      toast.error("Gagal mengubah status laporan.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-700">Memuat...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Laporan Saya</h1>
          <button
            onClick={() => {
              resetForm();
              setEditMode(false);
              setShowModal(true);
            }}
            className="text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
            style={{ backgroundColor: 'rgba(17, 77, 145)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145)'}
          >
            + Buat Laporan
          </button>
        </div>

        {/* Full Width Reports Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Semua Laporan</h2>
              <span className="text-sm text-gray-500">{myReports.length} total</span>
            </div>

              {/* Status Filter */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setStatusFilter("aktif")}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: statusFilter === "aktif" ? 'rgba(17, 77, 145)' : 'rgb(243, 244, 246)',
                    color: statusFilter === "aktif" ? 'white' : 'rgb(55, 65, 81)'
                  }}
                  onMouseEnter={(e) => {
                    if (statusFilter !== "aktif") {
                      e.currentTarget.style.backgroundColor = 'rgb(229, 231, 235)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (statusFilter !== "aktif") {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                    }
                  }}
                >
                  Aktif ({myReports.filter((r) => r.status === "aktif").length})
                </button>
                <button
                  onClick={() => setStatusFilter("selesai")}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: statusFilter === "selesai" ? 'rgba(17, 77, 145)' : 'rgb(243, 244, 246)',
                    color: statusFilter === "selesai" ? 'white' : 'rgb(55, 65, 81)'
                  }}
                  onMouseEnter={(e) => {
                    if (statusFilter !== "selesai") {
                      e.currentTarget.style.backgroundColor = 'rgb(229, 231, 235)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (statusFilter !== "selesai") {
                      e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                    }
                  }}
                >
                  Selesai ({myReports.filter((r) => r.status === "selesai").length})
                </button>
              </div>

              {/* Reports Grid */}
              <ReportGrid
                reports={filteredReports.map((report) => ({
                  id: report.id,
                  title: report.title,
                  description: myReports.find(r => r.id === report.id)?.description,
                  category: report.category,
                  location: myReports.find(r => r.id === report.id)?.location,
                  type: report.type,
                  status: report.status,
                  image_url: report.image_url,
                  created_at: report.created_at,
                }))}
                showActions={true}
                onEdit={(reportId) => {
                  loadReportForEdit(reportId);
                  setShowModal(true);
                }}
                onComplete={handleToggleStatus}
                onDelete={handleDeleteReport}
              />
            </div>
          </div>

        {/* Modal Popup for Create/Edit Report */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editMode ? "Edit Laporan" : "Buat Laporan Baru"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    if (!editMode) resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Barang <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: iPhone 13 Pro Max warna biru"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Barang
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Jelaskan ciri-ciri barang secara detail..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      required
                    >
                      <option value="">Pilih kategori</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Contoh: Gedung D lantai 3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Laporan <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="hilang"
                          checked={formData.type === "hilang"}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as ReportType })}
                          className="mr-2"
                        />
                        <span className="text-gray-700">🔍 Hilang</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="temuan"
                          checked={formData.type === "temuan"}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as ReportType })}
                          className="mr-2"
                        />
                        <span className="text-gray-700">✅ Temuan</span>
                      </label>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                    {imagePreview && (
                      <div className="mt-3 relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Maksimal 5MB, format: JPG, PNG, WEBP</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 text-white px-6 py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                      style={{ backgroundColor: submitting ? undefined : 'rgba(17, 77, 145)' }}
                      onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.9)')}
                      onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145)')}
                    >
                      {submitting ? "Menyimpan..." : editMode ? "Update Laporan" : "Buat Laporan"}
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setShowModal(false);
                        }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Hapus"
          cancelText="Batal"
          onConfirm={confirmDeleteReport}
          onCancel={cancelDeleteReport}
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
}

export default function LaporanPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-700">Memuat...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <LaporanContent />
    </Suspense>
  );
}
