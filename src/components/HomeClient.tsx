"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, FileEdit, BarChart3, Shield, Clock, Users, Mail, MapPin, Folder, Bell, Wallet, Smartphone, Book, Key, IdCard } from "lucide-react";

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

export default function HomeClient() {
  const [isPaused, setIsPaused] = useState(false);
  const [foundItemStats, setFoundItemStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from API route instead of direct Supabase call
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/stats/found-items', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Found items stats received:', data);
        
        // Ensure all expected categories exist, even if they're 0
        const defaultStats = {
          'Elektronik': 0,
          'Dokumen': 0,
          'Kunci': 0,
          'Tas & Dompet': 0,
          'Buku & Alat Tulis': 0,
          'Aksesoris': 0,
        };
        
        // Merge with received data, defaulting to 0 for missing categories
        const mergedStats = { ...defaultStats, ...data };
        setFoundItemStats(mergedStats);
      } catch (err) {
        console.error('❌ Error fetching found items stats:', err);
        setFoundItemStats({
          'Elektronik': 0,
          'Dokumen': 0,
          'Kunci': 0,
          'Tas & Dompet': 0,
          'Buku & Alat Tulis': 0,
          'Aksesoris': 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    
    // Optional: Refetch data every 30 seconds to keep stats fresh
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { icon: Smartphone, title: "Elektronik", subtitle: "Jumlah laporan", count: foundItemStats["Elektronik"] || 0, iconBg: "#FECACA" },
    { icon: IdCard, title: "Dokumen", subtitle: "Jumlah laporan", count: foundItemStats["Dokumen"] || 0, iconBg: "#A7F3D0" },
    { icon: Key, title: "Kunci", subtitle: "Jumlah laporan", count: foundItemStats["Kunci"] || 0, iconBg: "#FBCFE8" },
    { icon: Wallet, title: "Tas & Dompet", subtitle: "Jumlah laporan", count: foundItemStats["Tas & Dompet"] || 0, iconBg: "#BFDBFE" },
    { icon: Book, title: "Buku & Alat Tulis", subtitle: "Jumlah laporan", count: foundItemStats["Buku & Alat Tulis"] || 0, iconBg: "#FEF08A" },
    { icon: Folder, title: "Aksesoris", subtitle: "Jumlah laporan", count: foundItemStats["Aksesoris"] || 0, iconBg: "#DDD6FE" },
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
          {/* Render image without white background card */}
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

          {/* Ikon KANAN-ATAS (posisi fix, animasi di child) */}
          <div className="pointer-events-none absolute top-6 right-8 md:top-8 md:right-12 lg:top-10 lg:right-16 z-10">
            <span className="block transform-gpu will-change-transform motion-safe:animate-float-bubble">
              <Mail className="w-7 h-7 text-sky-500 drop-shadow" />
            </span>
          </div>

          {/* Ikon KIRI-BAWAH */}
          <div className="pointer-events-none absolute bottom-10 left-8 md:bottom-12 md:left-12 lg:bottom-14 lg:left-16 z-10">
            <span className="block transform-gpu will-change-transform motion-safe:animate-float-bubble-slow">
              <MapPin className="w-7 h-7 text-green-500 drop-shadow" />
            </span>
          </div>

          {/* Ikon TENGAH-KIRI */}
          <div className="pointer-events-none absolute top-1/3 left-6 md:top-1/3 md:left-8 lg:top-1/3 lg:left-10 z-10">
            <span className="block transform-gpu will-change-transform motion-safe:animate-float-bubble">
              <Folder className="w-7 h-7 text-purple-500 drop-shadow" />
            </span>
          </div>

          {/* Ikon TENGAH-KANAN */}
          <div className="pointer-events-none absolute top-1/4 right-6 md:top-1/4 md:right-8 lg:top-1/4 lg:right-10 z-10">
            <span className="block transform-gpu will-change-transform motion-safe:animate-float-bubble-slow">
              <Bell className="w-7 h-7 text-orange-500 drop-shadow" />
            </span>
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Fitur Utama
          </h2>
          <p className="mt-4 text-slate-500 text-base md:text-lg">
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
              className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4"
            >
              Statistik Laporan Barang
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-gray-300 text-base md:text-lg"
            >
              Jumlah laporan barang hilang dan temuan di kampus kami
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
                {isLoading ? (
                  <div className="text-4xl font-extrabold text-white animate-pulse">0</div>
                ) : (
                  <CountUp target={category.count} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
