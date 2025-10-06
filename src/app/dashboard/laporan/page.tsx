"use client";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage, delete_report_file } from "@/lib/supabaseStorage";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ReportGrid from "@/components/ReportGrid";
import Image from "next/image";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { 
  DocumentTextIcon, 
  PencilSquareIcon, 
  TagIcon, 
  MapPinIcon, 
  BookmarkIcon, 
  CameraIcon, 
  PlusIcon 
} from '@heroicons/react/24/outline';

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

const LOCATIONS = [
  "Gedung A",
  "Gedung C",
  "Gedung D",
  "Gedung E",
  "Gedung F",
  "Gedung G",
  "Gedung H",
  "Gedung I",
  "Gedung J",
  "Gedung K",
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
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const MAX_TITLE_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

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

    // Validate length
    if (formData.title.length > MAX_TITLE_LENGTH) {
      toast.error(`Judul terlalu panjang! Maksimal ${MAX_TITLE_LENGTH} karakter`);
      return;
    }

    if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(`Deskripsi terlalu panjang! Maksimal ${MAX_DESCRIPTION_LENGTH} karakter`);
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
    setTitleError("");
    setDescriptionError("");
  }

  function handleTitleChange(value: string) {
    setFormData({ ...formData, title: value });
    
    if (value.length > MAX_TITLE_LENGTH) {
      setTitleError(`Judul terlalu panjang! Maksimal ${MAX_TITLE_LENGTH} karakter (saat ini: ${value.length})`);
    } else {
      setTitleError("");
    }
  }

  function handleDescriptionChange(value: string) {
    setFormData({ ...formData, description: value });
    
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(`Deskripsi terlalu panjang! Maksimal ${MAX_DESCRIPTION_LENGTH} karakter (saat ini: ${value.length})`);
    } else {
      setDescriptionError("");
    }
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
      // Get the report to find the image URL
      const report = myReports.find(r => r.id === reportId);
      
      // Delete the image file from storage FIRST (before deleting from database)
      if (report?.image_url) {
        await delete_report_file(report.image_url);
      }

      // Delete the report from database (cascade will delete comments automatically)
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId)
        .eq("user_id", user!.id);

      if (error) throw error;

      toast.success("Laporan, foto, dan semua komentar berhasil dihapus!");
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Skeleton - Improved */}
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-200 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="h-10 w-64 bg-gray-300 rounded-lg animate-pulse mb-3"></div>
                <div className="h-5 w-96 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-12 w-48 bg-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-5 sm:p-7">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="flex gap-2 mb-6">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                  <div className="h-40 bg-gray-300 rounded-lg mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header with Create Button - Modern Gradient */}
        <div className="mb-6 sm:mb-8 rounded-2xl shadow-lg border border-blue-100 overflow-hidden" style={{ background: 'linear-gradient(135deg, #114D91 0%, #3B82F6 50%, #93C5FD 100%)' }}>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  Laporan Saya
                </h1>
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-white/95" />
                  <p className="text-sm sm:text-base text-white/95">
                    Kelola semua laporan barang hilang dan temuan Anda
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setEditMode(false);
                  setShowModal(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base whitespace-nowrap bg-white hover:bg-blue-50 border-2 border-white"
                style={{ color: '#114D91' }}
              >
                <PlusIcon className="w-5 h-5" />
                Buat Laporan Baru
              </button>
            </div>
          </div>
        </div>

        {/* Full Width Reports Section - Improved */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 sm:p-7 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Semua Laporan</h2>
                <p className="text-sm text-gray-600 font-medium">Total: <span className="font-bold text-blue-600">{myReports.length}</span> laporan</p>
              </div>
            </div>

            {/* Status Filter - Modern Pill Design */}
            <div className="flex gap-2 sm:gap-3 mb-6 bg-gray-100 p-1.5 rounded-xl overflow-x-auto">
              <button
                onClick={() => setStatusFilter("aktif")}
                className="flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap"
                style={{
                  backgroundColor: statusFilter === "aktif" ? 'rgba(17, 77, 145)' : 'transparent',
                  color: statusFilter === "aktif" ? 'white' : 'rgb(107, 114, 128)',
                  boxShadow: statusFilter === "aktif" ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (statusFilter !== "aktif") {
                    e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)';
                    e.currentTarget.style.color = 'rgba(17, 77, 145, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (statusFilter !== "aktif") {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgb(107, 114, 128)';
                  }
                }}
              >
                Aktif
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {myReports.filter((r) => r.status === "aktif").length}
                </span>
              </button>
              <button
                onClick={() => setStatusFilter("selesai")}
                className="flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap"
                style={{
                  backgroundColor: statusFilter === "selesai" ? 'rgba(17, 77, 145)' : 'transparent',
                  color: statusFilter === "selesai" ? 'white' : 'rgb(107, 114, 128)',
                  boxShadow: statusFilter === "selesai" ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (statusFilter !== "selesai") {
                    e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)';
                    e.currentTarget.style.color = 'rgba(17, 77, 145, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (statusFilter !== "selesai") {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgb(107, 114, 128)';
                  }
                }}
              >
                Selesai
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {myReports.filter((r) => r.status === "selesai").length}
                </span>
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
                showComments={false}
                currentUserId={user?.id}
                onEdit={(reportId) => {
                  loadReportForEdit(reportId);
                  setShowModal(true);
                }}
                onComplete={handleToggleStatus}
                onDelete={handleDeleteReport}
              />
            </div>
          </div>

        {/* Modal Popup for Create/Edit Report - Improved */}
        {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-md">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border-2 border-gray-200">
              <div className="sticky top-0 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg" style={{ backgroundColor: 'rgba(17, 77, 145)' }}>
                <div className="flex items-center gap-2">
                  {editMode ? (
                    <PencilSquareIcon className="w-7 h-7 text-white" />
                  ) : (
                    <PlusIcon className="w-7 h-7 text-white" />
                  )}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                      {editMode ? "Edit Laporan" : "Buat Laporan Baru"}
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium">
                      {editMode ? "Perbarui informasi laporan Anda" : "Isi formulir untuk membuat laporan baru"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    if (!editMode) resetForm();
                  }}
                  className="text-white hover:text-blue-100 transition-all bg-white/20 hover:bg-white/30 rounded-full p-2 transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Title */}
                  <div>
                    <label className="flex items-center justify-between text-sm font-bold text-gray-900 mb-2">
                      <span className="flex items-center gap-2">
                        <BookmarkIcon className="w-4 h-4" />
                        Judul Barang <span className="text-red-500">*</span>
                      </span>
                      <span className={`text-xs font-semibold ${formData.title.length > MAX_TITLE_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.title.length}/{MAX_TITLE_LENGTH}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Contoh: iPhone 13 Pro Max warna biru"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent text-gray-900 placeholder:text-gray-500 font-medium transition-all duration-200 shadow-sm hover:border-gray-400 ${
                        titleError ? 'border-red-400' : 'border-gray-300'
                      }`}
                      style={{ 
                        '--tw-ring-color': titleError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(17, 77, 145, 0.5)'
                      } as React.CSSProperties}
                      required
                    />
                    {titleError && (
                      <p className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {titleError}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="flex items-center justify-between text-sm font-bold text-gray-900 mb-2">
                      <span className="flex items-center gap-2">
                        <PencilSquareIcon className="w-4 h-4" />
                        Deskripsi Barang
                      </span>
                      <span className={`text-xs font-semibold ${formData.description.length > MAX_DESCRIPTION_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                      </span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Jelaskan ciri-ciri barang secara detail..."
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500 font-medium transition-all duration-200 shadow-sm hover:border-gray-400 ${
                        descriptionError ? 'border-red-400' : 'border-gray-300'
                      }`}
                      style={{ 
                        '--tw-ring-color': descriptionError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(17, 77, 145, 0.5)'
                      } as React.CSSProperties}
                    />
                    {descriptionError && (
                      <p className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {descriptionError}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <TagIcon className="w-4 h-4" />
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-gray-900 font-medium transition-all duration-200 shadow-sm hover:border-gray-400"
                      style={{ 
                        '--tw-ring-color': 'rgba(17, 77, 145, 0.5)'
                      } as React.CSSProperties}
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
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <MapPinIcon className="w-4 h-4" />
                      Lokasi
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-gray-900 font-medium transition-all duration-200 shadow-sm hover:border-gray-400"
                      style={{ 
                        '--tw-ring-color': 'rgba(17, 77, 145, 0.5)'
                      } as React.CSSProperties}
                    >
                      <option value="">Pilih lokasi</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <BookmarkIcon className="w-4 h-4" />
                      Tipe Laporan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          type="radio"
                          value="hilang"
                          checked={formData.type === "hilang"}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as ReportType })}
                          className="peer sr-only"
                        />
                        <div className="flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-gray-400">
                          <span className="text-2xl">🔍</span>
                          <span className="font-bold text-gray-700 peer-checked:text-blue-600">Hilang</span>
                        </div>
                      </label>
                      <label className="relative">
                        <input
                          type="radio"
                          value="temuan"
                          checked={formData.type === "temuan"}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as ReportType })}
                          className="peer sr-only"
                        />
                        <div className="flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-green-600 peer-checked:bg-green-50 hover:border-gray-400">
                          <span className="text-2xl">✅</span>
                          <span className="font-bold text-gray-700 peer-checked:text-green-600">Ditemukan</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      <CameraIcon className="w-4 h-4" />
                      Upload Foto
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-gray-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 shadow-sm hover:border-gray-400"
                      style={{ 
                        '--tw-ring-color': 'rgba(17, 77, 145, 0.5)'
                      } as React.CSSProperties}
                    />
                    {imagePreview && (
                      <div className="mt-4 relative w-full h-56 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-2 font-medium">Maksimal 5MB, format: JPG, PNG, WEBP</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                      style={{ backgroundColor: submitting ? undefined : 'rgba(17, 77, 145)' }}
                      onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.9)')}
                      onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145)')}
                    >
                      {submitting ? (
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
                          <span>{editMode ? "Update Laporan" : "Buat Laporan"}</span>
                        </>
                      )}
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setShowModal(false);
                        }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
