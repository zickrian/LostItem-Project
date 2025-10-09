"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, FileEdit, BarChart3, Shield, Clock, Users, Mail, MapPin, Folder, Bell, Wallet, Smartphone, Book, Key, Headphones, Laptop, Instagram, Facebook, Linkedin } from "lucide-react";

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
}

function CountUp({ target, duration = 2000, className = "text-4xl font-extrabold text-white" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const start = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [isVisible, target, duration]);

  return <span ref={ref} className={className}>{count}</span>;
}

export default function Home() {
  const [isPaused, setIsPaused] = useState(false);

  const categories = [
    { icon: Wallet, title: "Dompet", subtitle: "Jumlah yang ditemukan", count: 150, iconBg: "#FEF08A" },
    { icon: Smartphone, title: "Handphone", subtitle: "Jumlah yang ditemukan", count: 85, iconBg: "#A7F3D0" },
    { icon: Book, title: "Buku", subtitle: "Jumlah yang ditemukan", count: 250, iconBg: "#FBCFE8" },
    { icon: Key, title: "Kunci", subtitle: "Jumlah yang ditemukan", count: 120, iconBg: "#BFDBFE" },
    { icon: Headphones, title: "Headphone", subtitle: "Jumlah yang ditemukan", count: 60, iconBg: "#FECACA" },
    { icon: Laptop, title: "Laptop", subtitle: "Jumlah yang ditemukan", count: 30, iconBg: "#DDD6FE" },
  ];

  const foundItems = [
    { icon: Wallet, title: "Dompet Kulit", location: "Gedung A Lt.2", date: "3 Okt 2025", iconBg: "#FEF08A" },
    { icon: Smartphone, title: "Handphone Samsung", location: "Perpustakaan", date: "2 Okt 2025", iconBg: "#A7F3D0" },
    { icon: Book, title: "Buku Matematika", location: "Kelas 101", date: "1 Okt 2025", iconBg: "#FBCFE8" },
    { icon: Key, title: "Kunci Motor", location: "Parkiran Utama", date: "30 Sep 2025", iconBg: "#BFDBFE" },
    { icon: Headphones, title: "Headphone Sony", location: "Kantin", date: "29 Sep 2025", iconBg: "#FECACA" },
    { icon: Laptop, title: "Laptop Asus", location: "Lab Komputer", date: "28 Sep 2025", iconBg: "#DDD6FE" },
  ];

  const statistics = [
    { icon: "📢", title: "Barang Hilang Dilaporkan", count: 300, gradient: "from-rose-400 to-pink-500" },
    { icon: "🔍", title: "Barang Ditemukan", count: 250, gradient: "from-sky-400 to-blue-600" },
    { icon: "✅", title: "Barang Diklaim", count: 200, gradient: "from-emerald-400 to-green-500" },
  ];



  return (
    <div className="min-h-screen relative overflow-hidden bg-white text-gray-900 font-sans">

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-10 lg:px-20 py-24 bg-white overflow-hidden">
        {/* Floating bubbles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bubble-particle w-16 h-16 absolute top-20 left-10"></div>
          <div className="bubble-particle w-10 h-10 absolute top-40 right-20 delay-2"></div>
          <div className="bubble-particle w-12 h-12 absolute bottom-20 left-1/4 delay-4"></div>
          <div className="bubble-particle w-8 h-8 absolute top-60 right-1/3 delay-6"></div>
          <div className="bubble-particle w-14 h-14 absolute bottom-40 right-10 delay-8"></div>
        </div>

        {/* Text */}
        <div className="z-10 max-w-xl space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight animate-fadeInUp">
              Temukan Kembali <br/>
              <span className="animated-gradient-text">Barang Anda</span><br/>
              Dengan Mudah
            </h1>
          <p className="text-gray-600 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Sistem pelaporan barang hilang yang cepat dan aman untuk mahasiswa.
            Bantu kami menghubungkan kembali Anda dengan barang yang hilang.
          </p>
          <div className="flex gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Link
              href="/login"
              className="px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all hover:-translate-y-0.5"
              style={{backgroundColor: '#3f7bd1', boxShadow: '0 4px 6px rgba(63, 123, 209, 0.5)'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3461a8'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3f7bd1'}
            >
              Coba Sekarang
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border rounded-lg font-medium transition"
              style={{borderColor: '#3f7bd1', color: '#3f7bd1'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e6f0ff'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        {/* Phone + floating icons (LCP optimized) */}
        <div className="relative mt-10 md:mt-0">
          {/* Container card to ensure any unexpected transparent/colored pixels behind the image are hidden */}
          <div className="bg-white rounded-2xl p-4 md:p-6 drop-shadow-xl inline-block" style={{ backgroundColor: '#ffffff' }}>
            <Image
              src="https://res.cloudinary.com/dujp9ydkx/image/upload/v1760019516/phone_aw3azc.avif"
              alt="App Preview"
              width={360}
              height={720}
              priority
              quality={85}
              className="w-[320px] md:w-[360px]"
              placeholder="empty"
              sizes="(max-width: 768px) 90vw, 360px"
              style={{ backgroundColor: 'transparent' }}
              loading="eager"
            />
          </div>
          <div className="absolute w-8 top-8 right-16 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Mail className="w-8 h-8 drop-shadow-lg" style={{color: '#3f7bd1'}} />
          </div>
          <div className="absolute w-7 bottom-12 left-12 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            <MapPin className="w-7 h-7 text-green-500 drop-shadow-lg" />
          </div>
          <div className="absolute w-8 top-1/3 left-8 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Folder className="w-8 h-8 text-purple-500 drop-shadow-lg" />
          </div>
          <div className="absolute w-8 top-1/4 right-8 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <Bell className="w-8 h-8 text-orange-500 drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* Curved divider */}
      <div className="relative">
        <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
          <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>

      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden" style={{contentVisibility: 'auto'}}>
        {/* Animated background - Deferred */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,_#1E3A8A,_#3B82F6,_#1E40AF,_#1E3A8A)] blur-3xl opacity-25 animate-spinGradient" style={{willChange: 'transform'}}></div>

        {/* Header */}
        <div className="relative z-10 text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Fitur Utama
          </h2>
          <p className="text-gray-700 mt-2">
            Kemudahan dalam melaporkan, mencari, dan mengklaim barang hilang
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative z-10 overflow-x-auto scrollbar-hide">
          <div className={`flex gap-6 ${isPaused ? '' : 'animate-scrollLeft'} cursor-grab active:cursor-grabbing`} onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}>
            {/* Group 1 */}
            <div className="flex gap-6">
              <div className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]">

                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Cari Barang Hilang</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Filter dan cari laporan barang hilang dengan mudah berdasarkan kategori, lokasi, dan waktu.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <FileEdit className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Lapor Barang Hilang</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Form laporan cepat dan mudah untuk melaporkan barang yang hilang atau ditemukan.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Statistik Laporan</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Lihat data dan statistik barang hilang dan temuan kampus secara real-time.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Keamanan Terjamin</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Data laporan dan informasi pengguna dilindungi dengan sistem keamanan terbaik.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Notifikasi Real-time</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Dapatkan pemberitahuan langsung ketika ada update tentang barang yang Anda cari.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Komunitas Kampus</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Bergabung dengan komunitas mahasiswa yang saling membantu menemukan barang hilang.
                </p>
              </motion.div>
            </div>

            {/* Group 2 (duplicate for infinite loop) */}
            <div className="flex gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Cari Barang Hilang</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Filter dan cari laporan barang hilang dengan mudah berdasarkan kategori, lokasi, dan waktu.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <FileEdit className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Lapor Barang Hilang</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Form laporan cepat dan mudah untuk melaporkan barang yang hilang atau ditemukan.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Statistik Laporan</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Lihat data dan statistik barang hilang dan temuan kampus secara real-time.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Keamanan Terjamin</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Data laporan dan informasi pengguna dilindungi dengan sistem keamanan terbaik.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Notifikasi Real-time</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Dapatkan pemberitahuan langsung ketika ada update tentang barang yang Anda cari.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="w-[220px] md:w-[260px] h-[200px] md:h-[230px] flex-shrink-0 bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-blue-400/30 transition-all hover:-translate-y-1 hover:scale-[1.03]"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold text-base md:text-lg mb-2">Komunitas Kampus</h3>
                <p className="text-gray-700 text-sm leading-snug line-clamp-3 break-words">
                  Bergabung dengan komunitas mahasiswa yang saling membantu menemukan barang hilang.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-900 text-white" style={{contentVisibility: 'auto', containIntrinsicSize: '0 500px'}}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Barang Yang Sering Ditemukan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-gray-300 text-lg"
            >
              Statistik barang hilang yang berhasil ditemukan di kampus kami
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:bg-gray-800/70 transition-all hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: category.iconBg }}
                  >
                    <category.icon className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{category.subtitle}</p>
                <CountUp target={category.count} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Found Items Section */}
      <section className="relative py-24 bg-white overflow-hidden" style={{contentVisibility: 'auto', containIntrinsicSize: '0 600px'}}>
        {/* Floating bubbles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bubble-particle w-16 h-16 absolute top-20 left-10 animate-floatBubbles"></div>
          <div className="bubble-particle w-10 h-10 absolute top-40 right-20 animate-floatBubbles-delay"></div>
          <div className="bubble-particle w-12 h-12 absolute bottom-20 left-1/4 animate-floatBubbles"></div>
          <div className="bubble-particle w-8 h-8 absolute top-60 right-1/3 animate-floatBubbles-delay"></div>
          <div className="bubble-particle w-14 h-14 absolute bottom-40 right-10 animate-floatBubbles"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp"
            >
              Barang yang Ditemukan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-gray-600 text-lg"
            >
              Barang-barang yang berhasil ditemukan dan dikembalikan kepada pemiliknya
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foundItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <item.icon className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Ditemukan pada {item.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Platform Section */}
      <section id="statistik-platform" className="relative py-24 overflow-hidden" style={{contentVisibility: 'auto', containIntrinsicSize: '0 400px'}}>
        {/* Animated background */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,_#1E3A8A,_#3B82F6,_#1E40AF,_#1E3A8A)] blur-3xl opacity-25 animate-spinGradient"></div>

        {/* Content */}
        <div className="relative z-10 text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black"
          >
            Statistik Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-600 mt-2"
          >
            Data terkini sistem Lost & Found UDINUS
          </motion.p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-[rgba(255,255,255,0.6)] backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg hover:-translate-y-5 hover:scale-[1.03] hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br ${stat.gradient} animate-pulse mb-4`}>
                <span className="text-4xl">{stat.icon}</span>
              </div>
              <h3 className="text-gray-700 font-semibold text-lg">{stat.title}</h3>
              <CountUp target={stat.count} className="text-5xl font-extrabold text-gray-900" />
            </motion.div>
          ))}
        </div>
      </section>



      {/* Footer */}
      <footer className="relative overflow-hidden py-16 bg-gradient-to-t from-[#0b0f19] to-[#111827] text-[#ffffff]" style={{contentVisibility: 'auto', containIntrinsicSize: '0 400px'}}>
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-72 h-72 bg-blue-400/10 rounded-full top-10 left-20 blur-3xl animate-[floatBubblesFooter_14s_ease-in-out_infinite_alternate]"></div>
          <div className="absolute w-80 h-80 bg-indigo-400/10 rounded-full bottom-16 right-10 blur-3xl animate-[floatBubblesFooter_16s_ease-in-out_infinite_alternate]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-[#ffffff] font-bold text-lg">F</span>
              </div>
              <div>
                <h3 className="font-semibold text-2xl bg-gradient-to-r from-[#3b82f6] to-[#3b82f6] bg-clip-text text-transparent">SITEMU</h3>
                <p className="text-[#3b82f6] text-sm">UDINUS</p>
              </div>
            </div>
            <p className="text-[#cbd5e1] max-w-md">Platform resmi untuk menemukan dan melaporkan barang hilang di kampus Universitas Dian Nuswantoro.</p>
          </div>

          {/* Right */}
          <div>
            <h4 className="text-[#ffffff] font-semibold text-lg mb-3">Hubungi Kami</h4>
            <p className="text-[#cbd5e1] hover:text-[#3b82f6] transition">+62 24 3517261</p>
            <p className="text-[#cbd5e1] hover:text-[#3b82f6] transition">sitemuDinus@dinus.ac.id</p>
            <p className="text-[#cbd5e1] hover:text-[#3b82f6] transition">Jl. Imam Bonjol No.207, Semarang</p>

            <h4 className="text-[#ffffff] font-semibold text-lg mt-6 mb-3">Media Sosial</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-blue-500/30 hover:text-[#3b82f6] transition transform hover:scale-110">
                <Instagram className="w-5 h-5 text-[#e2e8f0]" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-blue-500/30 hover:text-[#3b82f6] transition transform hover:scale-110">
                <Facebook className="w-5 h-5 text-[#e2e8f0]" />
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-blue-500/30 hover:text-[#3b82f6] transition transform hover:scale-110">
                <Linkedin className="w-5 h-5 text-[#e2e8f0]" />
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-center mt-10 border-t border-blue-400/20 pt-6 text-[#cbd5e1] text-sm">
          2025 SITEMU UDINUS. All rights reserved. <br/>
          Dibuat dengan <span className="text-red-400 animate-pulse">❤</span> untuk Mahasiswa UDINUS.
        </div>
      </footer>
    </div>
  );
}
