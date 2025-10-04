"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import ReportGrid from "@/components/ReportGrid";
import ReportGridSkeleton from "@/components/ReportGridSkeleton";
import { MagnifyingGlassIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/contexts/ToastContext";

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
  }, [reports, activeTab, searchQuery]);

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

    setFilteredReports(filtered);
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
  }

  async function handleDeleteReport(reportId: string) {
    if (!user || !confirm("Hapus laporan ini?")) return;

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Laporan berhasil dihapus!");
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
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Temukan atau laporkan barang hilang/ditemukan</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("hilang")}
            className="flex items-center gap-1.5 sm:gap-2 pb-2 sm:pb-3 px-3 sm:px-4 font-semibold transition-all duration-200 whitespace-nowrap text-sm sm:text-base"
            style={{
              color: activeTab === "hilang" ? 'rgba(17, 77, 145)' : 'rgb(107, 114, 128)',
              borderBottom: activeTab === "hilang" ? '2px solid rgba(17, 77, 145)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "hilang") {
                e.currentTarget.style.color = 'rgba(17, 77, 145, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "hilang") {
                e.currentTarget.style.color = 'rgb(107, 114, 128)';
              }
            }}
          >
            <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>Barang Hilang</span>
          </button>
          <button
            onClick={() => setActiveTab("temuan")}
            className="flex items-center gap-1.5 sm:gap-2 pb-2 sm:pb-3 px-3 sm:px-4 font-semibold transition-all duration-200 whitespace-nowrap text-sm sm:text-base"
            style={{
              color: activeTab === "temuan" ? 'rgba(17, 77, 145)' : 'rgb(107, 114, 128)',
              borderBottom: activeTab === "temuan" ? '2px solid rgba(17, 77, 145)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "temuan") {
                e.currentTarget.style.color = 'rgba(17, 77, 145, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "temuan") {
                e.currentTarget.style.color = 'rgb(107, 114, 128)';
              }
            }}
          >
            <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>Barang Temuan</span>
          </button>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
              {activeTab === "hilang" ? "🔍" : "✅"}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              Tidak ada laporan {activeTab === "hilang" ? "barang hilang" : "barang ditemukan"}
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              {searchQuery ? "Coba kata kunci lain" : "Jadilah yang pertama membuat laporan!"}
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </DashboardLayout>
  );
}
