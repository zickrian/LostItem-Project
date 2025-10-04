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
        {/* Header - Improved */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-100 shadow-sm">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-3">
            Statistik Laporan
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
            Analisis data dan insights dari seluruh laporan di sistem
          </p>
        </div>

        {/* Summary Cards - Improved with Icons and Better Design */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-400">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs sm:text-sm font-bold opacity-90">Total Laporan</p>
              <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-3xl sm:text-4xl font-black">{stats.totalReports}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-red-400">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs sm:text-sm font-bold opacity-90">Barang Hilang</p>
              <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-3xl sm:text-4xl font-black">{stats.totalHilang}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-green-400">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs sm:text-sm font-bold opacity-90">Barang Ditemukan</p>
              <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl sm:text-4xl font-black">{stats.totalTemuan}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-yellow-400">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs sm:text-sm font-bold opacity-90">Laporan Aktif</p>
              <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-3xl sm:text-4xl font-black">{stats.totalAktif}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-purple-400">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs sm:text-sm font-bold opacity-90">Selesai</p>
              <svg className="w-6 h-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-3xl sm:text-4xl font-black">{stats.totalSelesai}</p>
          </div>
        </div>

        {/* Charts Grid - Improved */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Category Chart */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1">Kategori Paling Sering</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Top 8 kategori barang</p>
              </div>
              <span className="text-3xl">🏷️</span>
            </div>
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
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid rgba(17, 77, 145, 0.2)', 
                      borderRadius: '12px', 
                      color: '#000',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                    itemStyle={{ color: '#000', fontWeight: 'bold' }} 
                    labelStyle={{ color: '#000', fontWeight: 'bold' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-gray-500 font-semibold">Belum ada data kategori</p>
              </div>
            )}
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1">Tren Laporan</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">6 bulan terakhir</p>
              </div>
              <span className="text-3xl">📈</span>
            </div>
            {stats.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" style={{ fontSize: '12px', fontWeight: '600' }} />
                  <YAxis style={{ fontSize: '12px', fontWeight: '600' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid rgba(17, 77, 145, 0.2)', 
                      borderRadius: '12px', 
                      color: '#000',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                    itemStyle={{ color: '#000', fontWeight: 'bold' }} 
                    labelStyle={{ color: '#000', fontWeight: 'bold' }} 
                  />
                  <Legend wrapperStyle={{ fontWeight: '600' }} />
                  <Bar dataKey="hilang" fill="url(#colorHilang)" name="Hilang" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="temuan" fill="url(#colorTemuan)" name="Temuan" radius={[8, 8, 0, 0]} />
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
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-5xl mb-3">📈</div>
                <p className="text-gray-500 font-semibold">Belum ada data bulanan</p>
              </div>
            )}
          </div>

          {/* Location Chart */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1">Lokasi Paling Sering</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Top 5 lokasi kejadian</p>
              </div>
              <span className="text-3xl">📍</span>
            </div>
            {stats.locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" style={{ fontSize: '12px', fontWeight: '600' }} />
                  <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px', fontWeight: '600' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid rgba(17, 77, 145, 0.2)', 
                      borderRadius: '12px', 
                      color: '#000',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                    itemStyle={{ color: '#000', fontWeight: 'bold' }} 
                    labelStyle={{ color: '#000', fontWeight: 'bold' }} 
                  />
                  <Bar dataKey="value" fill="url(#colorLokasi)" name="Jumlah" radius={[0, 8, 8, 0]} />
                  <defs>
                    <linearGradient id="colorLokasi" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(17, 77, 145)" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-5xl mb-3">📍</div>
                <p className="text-gray-500 font-semibold">Belum ada data lokasi</p>
              </div>
            )}
          </div>

          {/* Success Rate Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1">Tingkat Penyelesaian</h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Persentase laporan selesai</p>
              </div>
              <span className="text-3xl">🎯</span>
            </div>
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="relative w-52 h-52 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-52 h-52">
                    <circle
                      cx="104"
                      cy="104"
                      r="88"
                      stroke="#E5E7EB"
                      strokeWidth="20"
                      fill="none"
                    />
                    <circle
                      cx="104"
                      cy="104"
                      r="88"
                      stroke="url(#successGradient)"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${
                        stats.totalReports > 0
                          ? (stats.totalSelesai / stats.totalReports) * 552.9
                          : 0
                      } 552.9`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-white rounded-full p-6">
                      <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                        {stats.totalReports > 0
                          ? Math.round((stats.totalSelesai / stats.totalReports) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-xs font-bold text-gray-500">Selesai</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <p className="text-gray-900 font-bold text-sm">
                    <span className="text-green-600 text-2xl font-black">{stats.totalSelesai}</span> dari <span className="text-gray-600 text-2xl font-black">{stats.totalReports}</span>
                  </p>
                  <p className="text-xs text-gray-600 font-semibold mt-1">laporan telah diselesaikan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info - Improved */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-5 sm:p-7 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-gray-900 mb-2">Informasi Statistik</h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                Data statistik ini <span className="font-bold text-blue-700">diperbarui secara real-time</span> berdasarkan laporan yang masuk ke sistem.
                Gunakan informasi ini untuk mengidentifikasi pola kehilangan barang dan meningkatkan awareness
                di kampus. <span className="font-bold text-blue-700">Semua data akurat hingga detik ini!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
