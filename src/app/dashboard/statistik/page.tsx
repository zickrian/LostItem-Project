"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import StatistikSkeleton from "@/components/StatistikSkeleton";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/contexts/ToastContext";

interface StatsData {
  totalReports: number;
  totalHilang: number;
  totalTemuan: number;
  totalAktif: number;
  totalSelesai: number;
  categoryData: { name: string; value: number }[];
  monthlyData: { month: string; hilang: number; temuan: number }[];
  locationData: { name: string; value: number }[];
}

const COLORS = ["#60A5FA", "#F87171", "#34D399", "#FBBF24", "#A78BFA", "#F472B6", "#2DD4BF", "#FB923C"];

export default function StatistikPage() {
  const router = useRouter();
  const toast = useToast();
  const [stats, setStats] = useState<StatsData>({
    totalReports: 0,
    totalHilang: 0,
    totalTemuan: 0,
    totalAktif: 0,
    totalSelesai: 0,
    categoryData: [],
    monthlyData: [],
    locationData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await checkAuth();
      await fetchStatistics();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/login");
      }
    } catch (error) {
      toast.error("Sesi Anda telah berakhir");
      router.push("/login");
    }
  }

  async function fetchStatistics() {
    try {
      // Fetch all reports
      const { data: reports, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const allReports = reports || [];

      // Calculate basic stats
      const totalReports = allReports.length;
      const totalHilang = allReports.filter((r) => r.type === "hilang").length;
      const totalTemuan = allReports.filter((r) => r.type === "temuan").length;
      const totalAktif = allReports.filter((r) => r.status === "aktif").length;
      const totalSelesai = allReports.filter((r) => r.status === "selesai").length;

      // Category statistics
      const categoryMap: { [key: string]: number } = {};
      allReports.forEach((report) => {
        const cat = report.category || "Lainnya";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });
      const categoryData = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      // Monthly statistics (last 6 months)
      const monthlyMap: { [key: string]: { hilang: number; temuan: number } } = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        monthlyMap[monthKey] = { hilang: 0, temuan: 0 };
      }

      allReports.forEach((report) => {
        const date = new Date(report.created_at);
        const monthKey = date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        if (monthlyMap[monthKey]) {
          if (report.type === "hilang") {
            monthlyMap[monthKey].hilang++;
          } else {
            monthlyMap[monthKey].temuan++;
          }
        }
      });

      const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
        month,
        ...data,
      }));

      // Location statistics
      const locationMap: { [key: string]: number } = {};
      allReports.forEach((report) => {
        if (report.location && report.location.trim()) {
          const loc = report.location.trim();
          locationMap[loc] = (locationMap[loc] || 0) + 1;
        }
      });
      const locationData = Object.entries(locationMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setStats({
        totalReports,
        totalHilang,
        totalTemuan,
        totalAktif,
        totalSelesai,
        categoryData,
        monthlyData,
        locationData,
      });
    } catch (error) {
      toast.error("Gagal memuat statistik");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <StatistikSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Statistik Laporan</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-xl shadow-md">
            <p className="text-xs sm:text-sm opacity-90 mb-1">Total Laporan</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalReports}</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-4 sm:p-6 rounded-xl shadow-md">
            <p className="text-xs sm:text-sm opacity-90 mb-1">Barang Hilang</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalHilang}</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 sm:p-6 rounded-xl shadow-md">
            <p className="text-xs sm:text-sm opacity-90 mb-1">Barang Ditemukan</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalTemuan}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 sm:p-6 rounded-xl shadow-md">
            <p className="text-xs sm:text-sm opacity-90 mb-1">Laporan Aktif</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalAktif}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white p-4 sm:p-6 rounded-xl shadow-md">
            <p className="text-xs sm:text-sm opacity-90 mb-1">Selesai</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalSelesai}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Category Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Kategori Paling Sering</h2>
            {stats.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', color: '#000' }} itemStyle={{ color: '#000' }} labelStyle={{ color: '#000', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Belum ada data</p>
            )}
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Tren Laporan (6 Bulan Terakhir)</h2>
            {stats.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', color: '#000' }} itemStyle={{ color: '#000' }} labelStyle={{ color: '#000', fontWeight: 'bold' }} />
                  <Legend />
                  <Bar dataKey="hilang" fill="url(#colorHilang)" name="Hilang" />
                  <Bar dataKey="temuan" fill="url(#colorTemuan)" name="Temuan" />
                  <defs>
                    <linearGradient id="colorHilang" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F87171" stopOpacity={1} />
                      <stop offset="100%" stopColor="#F472B6" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="colorTemuan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity={1} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Belum ada data</p>
            )}
          </div>

          {/* Location Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Lokasi Paling Sering (Top 5)</h2>
            {stats.locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', color: '#000' }} itemStyle={{ color: '#000' }} labelStyle={{ color: '#000', fontWeight: 'bold' }} />
                  <Bar dataKey="value" fill="url(#colorLokasi)" name="Jumlah" />
                  <defs>
                    <linearGradient id="colorLokasi" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Belum ada data lokasi</p>
            )}
          </div>

          {/* Success Rate Card */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Tingkat Penyelesaian</h2>
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#E5E7EB"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#10B981"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${
                        stats.totalReports > 0
                          ? (stats.totalSelesai / stats.totalReports) * 502.4
                          : 0
                      } 502.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900">
                        {stats.totalReports > 0
                          ? Math.round((stats.totalSelesai / stats.totalReports) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-gray-500">Selesai</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  {stats.totalSelesai} dari {stats.totalReports} laporan telah diselesaikan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Informasi Statistik</h3>
              <p className="text-sm text-gray-600">
                Data statistik ini diperbarui secara real-time berdasarkan laporan yang masuk ke sistem.
                Gunakan informasi ini untuk mengidentifikasi pola kehilangan barang dan meningkatkan awareness
                di kampus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
