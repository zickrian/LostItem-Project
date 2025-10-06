"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import ReportGrid from "@/components/ReportGrid";
import ReportGridSkeleton from "@/components/ReportGridSkeleton";
import { MagnifyingGlassIcon, CheckCircleIcon, TagIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/contexts/ToastContext";
import { delete_report_file } from "@/lib/supabaseStorage";

type TabType = "hilang" | "temuan";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  type: "hilang" | "temuan";
  image_url?: string;
  status: "aktif" | "selesai";
  created_at: string;
  user: {
    name: string;
    avatar_url?: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("hilang");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    async function init() {
      await checkUser();
      await fetchReports();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // Subscribe to real-time changes
    const channel = supabase
      .channel("reports-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reports",
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, activeTab, searchQuery, selectedCategory, startDate, endDate]);

  async function checkUser() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        router.push("/login");
        return;
      }

      const currentUser = sessionData.session.user;
      
      if (!currentUser.email?.endsWith("@mhs.dinus.ac.id")) {
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", currentUser.email)
        .single();

      if (userError) {
        setUser({
          id: currentUser.id,
          name: currentUser.user_metadata.full_name || currentUser.email?.split("@")[0],
          email: currentUser.email,
          avatar_url: currentUser.user_metadata.avatar_url,
          role: "student",
        });
      } else {
        setUser(userData);
      }
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
      router.push("/login");
    }
  }

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          user:user_id (
            name,
            avatar_url
          )
        `)
        .eq("status", "aktif")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      toast.error("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  }

  function filterReports() {
    let filtered = reports.filter((report) => report.type === activeTab);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(query) ||
          report.description?.toLowerCase().includes(query) ||
          report.category?.toLowerCase().includes(query) ||
          report.location?.toLowerCase().includes(query) ||
          report.user.name.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((report) => report.category === selectedCategory);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.created_at);
        const filterStartDate = new Date(startDate);
        return reportDate >= filterStartDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.created_at);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999); // Include the entire end date
        return reportDate <= filterEndDate;
      });
    }

    setFilteredReports(filtered);
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
  }

  async function handleDeleteReport(reportId: string) {
    if (!user || !confirm("Hapus laporan ini?")) return;

    try {
      // Get the report to find the image URL
      const report = reports.find(r => r.id === reportId);
      
      // Delete the image file from storage FIRST (before deleting from database)
      if (report?.image_url) {
        await delete_report_file(report.image_url);
      }

      // Delete the report from database
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Laporan dan foto berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus laporan.");
    }
  }

  function handleEditReport(reportId: string) {
    router.push(`/dashboard/laporan?edit=${reportId}`);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="mb-4 sm:mb-6">
            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Tab Skeleton */}
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-200">
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Reports Grid Skeleton */}
          <ReportGridSkeleton count={6} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header dengan gradient background */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-200 shadow-md">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-3">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
            Kehilangan atau menemukan barang di kampus? 
Laporkan sekarang dengan klik tombol &quot;Buat Laporan&quot; dan bantu teman-temanmu menemukan barang mereka kembali.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Total: {reports.length} laporan</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
              <MagnifyingGlassIcon className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-gray-700">Hilang: {reports.filter(r => r.type === "hilang").length}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Temuan: {reports.filter(r => r.type === "temuan").length}</span>
            </div>
          </div>
        </div>

        {/* Search Bar with Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              {/* Category Filter */}
              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-medium transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer bg-white"
                  style={{ 
                    '--tw-ring-color': 'rgba(17, 77, 145, 0.5)'
                  } as React.CSSProperties}
                  title="Filter berdasarkan kategori"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Dokumen">Dokumen</option>
                  <option value="Kunci">Kunci</option>
                  <option value="Tas & Dompet">Tas & Dompet</option>
                  <option value="Pakaian">Pakaian</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Buku & Alat Tulis">Buku & Alat Tulis</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <TagIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Date Range Filter */}
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-medium transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer bg-white"
                    style={{ 
                      '--tw-ring-color': 'rgba(17, 77, 145, 0.5)'
                    } as React.CSSProperties}
                    title="Dari tanggal"
                  />
                  <CalendarIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-medium transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer bg-white"
                    style={{ 
                      '--tw-ring-color': 'rgba(17, 77, 145, 0.5)'
                    } as React.CSSProperties}
                    title="Sampai tanggal"
                  />
                  <CalendarIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== "all" || startDate || endDate) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                  <TagIcon className="w-4 h-4" />
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {startDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                  <CalendarIcon className="w-4 h-4" />
                  Dari: {new Date(startDate).toLocaleDateString("id-ID")}
                  <button
                    onClick={() => setStartDate("")}
                    className="ml-1 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                  <CalendarIcon className="w-4 h-4" />
                  Sampai: {new Date(endDate).toLocaleDateString("id-ID")}
                  <button
                    onClick={() => setEndDate("")}
                    className="ml-1 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher dengan design modern */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 bg-gray-100 p-1.5 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab("hilang")}
            className="flex-1 min-w-fit flex items-center justify-center gap-2 py-3 px-4 font-bold transition-all duration-300 rounded-lg whitespace-nowrap text-sm sm:text-base"
            style={{
              backgroundColor: activeTab === "hilang" ? 'rgba(17, 77, 145)' : 'transparent',
              color: activeTab === "hilang" ? 'white' : 'rgb(107, 114, 128)',
              boxShadow: activeTab === "hilang" ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "hilang") {
                e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)';
                e.currentTarget.style.color = 'rgba(17, 77, 145, 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "hilang") {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgb(107, 114, 128)';
              }
            }}
          >
            <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>Barang Hilang</span>
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
              {reports.filter(r => r.type === "hilang").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("temuan")}
            className="flex-1 min-w-fit flex items-center justify-center gap-2 py-3 px-4 font-bold transition-all duration-300 rounded-lg whitespace-nowrap text-sm sm:text-base"
            style={{
              backgroundColor: activeTab === "temuan" ? 'rgba(17, 77, 145)' : 'transparent',
              color: activeTab === "temuan" ? 'white' : 'rgb(107, 114, 128)',
              boxShadow: activeTab === "temuan" ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "temuan") {
                e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)';
                e.currentTarget.style.color = 'rgba(17, 77, 145, 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "temuan") {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgb(107, 114, 128)';
              }
            }}
          >
            <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>Barang Temuan</span>
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
              {reports.filter(r => r.type === "temuan").length}
            </span>
          </button>
        </div>

        {/* Reports Grid atau Empty State */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 sm:py-20 px-4">
            <div className="max-w-md mx-auto">
              {/* Empty State dengan design menarik */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 sm:p-12 shadow-lg border-2 border-blue-300">
                <div className="mb-6 flex justify-center">
                  {activeTab === "hilang" ? (
                    <MagnifyingGlassIcon className="w-24 h-24 sm:w-32 sm:h-32 text-blue-600 opacity-50" />
                  ) : (
                    <CheckCircleIcon className="w-24 h-24 sm:w-32 sm:h-32 text-green-600 opacity-50" />
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
                  {searchQuery ? "Tidak Ditemukan" : "Belum Ada Laporan"}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  {searchQuery 
                    ? "Coba gunakan kata kunci lain untuk mencari" 
                    : `Belum ada laporan ${activeTab === "hilang" ? "barang hilang" : "barang ditemukan"}. Gunakan menu 'Buat Laporan' di sidebar untuk membuat laporan baru.`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Result count */}
            <div className="mb-4 flex items-center justify-between px-2">
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Menampilkan <span className="font-bold text-gray-900">{filteredReports.length}</span> laporan
                {searchQuery && <span> untuk &quot;<span className="font-bold text-blue-600">{searchQuery}</span>&quot;</span>}
              </p>
            </div>
            
            <ReportGrid
              reports={filteredReports.map((report) => ({
                id: report.id,
                title: report.title,
                description: report.description,
                category: report.category || "Lainnya",
                location: report.location,
                type: report.type,
                status: report.status,
                image_url: report.image_url,
                created_at: report.created_at,
              }))}
              showActions={false}
              currentUserId={user?.id}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
