"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileEdit, BarChart3, Shield, Clock, Users } from "lucide-react";

export default function FeaturesSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
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
  );
}
