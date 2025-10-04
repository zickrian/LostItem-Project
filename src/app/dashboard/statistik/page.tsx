"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
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

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-700">Memuat statistik...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Statistik Laporan</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-md">
            <p className="text-sm opacity-90 mb-1">Total Laporan</p>
            <p className="text-3xl font-bold">{stats.totalReports}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-md">
            <p className="text-sm opacity-90 mb-1">Barang Hilang</p>
            <p className="text-3xl font-bold">{stats.totalHilang}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md">
            <p className="text-sm opacity-90 mb-1">Barang Ditemukan</p>
            <p className="text-3xl font-bold">{stats.totalTemuan}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-md">
            <p className="text-sm opacity-90 mb-1">Laporan Aktif</p>
            <p className="text-3xl font-bold">{stats.totalAktif}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-md">
            <p className="text-sm opacity-90 mb-1">Selesai</p>
            <p className="text-3xl font-bold">{stats.totalSelesai}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Category Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kategori Paling Sering</h2>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Belum ada data</p>
            )}
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tren Laporan (6 Bulan Terakhir)</h2>
            {stats.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hilang" fill="#EF4444" name="Hilang" />
                  <Bar dataKey="temuan" fill="#10B981" name="Temuan" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Belum ada data</p>
            )}
          </div>

          {/* Location Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lokasi Paling Sering (Top 5)</h2>
            {stats.locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">Belum ada data lokasi</p>
            )}
          </div>

          {/* Success Rate Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tingkat Penyelesaian</h2>
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
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
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
