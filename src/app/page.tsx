import Link from "next/link";
import { Search, FileEdit, BarChart3, Shield, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">Lost&Found</span>
            </div>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Sistem Barang Hilang<br />
            <span className="text-blue-600">Mahasiswa</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Platform untuk melaporkan dan menemukan barang hilang dengan mudah
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FileEdit className="w-4 h-4 sm:w-5 sm:h-5" />
            Mulai Lapor
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Fitur Utama
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              Solusi lengkap untuk mengelola barang hilang di kampus
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Cari Barang Hilang
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Filter dan cari laporan barang hilang dengan mudah berdasarkan kategori, lokasi, dan waktu.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <FileEdit className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Lapor Barang Hilang
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Form laporan cepat dan mudah untuk melaporkan barang yang hilang atau ditemukan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Statistik Laporan
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Lihat data dan statistik barang hilang dan temuan di kampus secara real-time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Keamanan Terjamin
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Data laporan dan informasi pengguna dilindungi dengan sistem keamanan terbaik.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Notifikasi Real-time
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Dapatkan pemberitahuan langsung ketika ada update tentang barang yang Anda cari.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Komunitas Kampus
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Bergabung dengan komunitas mahasiswa yang saling membantu menemukan barang hilang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">Tentang Aplikasi</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed opacity-95 px-4">
            Aplikasi ini dibuat khusus untuk memudahkan mahasiswa Universitas Dian Nuswantoro 
            dalam menjaga dan melacak barang-barang mereka. Dengan sistem yang terintegrasi, 
            kita bisa saling membantu menemukan barang yang hilang dengan cepat dan efisien.
          </p>
          <div className="mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 md:pt-10 border-t border-blue-500/30">
            <p className="text-blue-200 text-xs sm:text-sm px-4">
              Dikembangkan dengan ❤️ untuk mahasiswa UDINUS
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2 font-medium">
              &copy; 2025 Lost&Found – Universitas Dian Nuswantoro
            </p>
            <p className="text-gray-500 text-sm">
              Hubungi Developer: <a href="mailto:support@lostfound.dinus.ac.id" className="text-blue-600 hover:underline">support@lostfound.dinus.ac.id</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
