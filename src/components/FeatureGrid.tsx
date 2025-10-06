"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactElement, ComponentType } from "react";

interface FeatureCardProps {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  cta: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, cta, delay }: FeatureCardProps): ReactElement {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -10, boxShadow: "0 20px 40px rgba(63,123,209,0.3)" }}
      whileTap={{ scale: 0.98 }}
      tabIndex={0}
      role="button"
      aria-label={`${title} - ${description}`}
      className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md border border-transparent cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500 transition flex-shrink-0 w-80 mx-4 scroll-snap-align-start"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 p-3 bg-gradient-to-tr from-[#3f7bd1] to-indigo-600 rounded-xl shadow-lg animate-bounce">
          <Icon className="w-8 h-8 text-white" aria-hidden={true} />
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-700 flex-grow">{description}</p>
          <a
            href="#"
            className="mt-4 inline-flex items-center text-[#3f7bd1] font-semibold hover:underline focus:underline focus:outline-none"
            tabIndex={-1}
          >
            {cta}
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-[#3f7bd1] to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></span>
    </motion.article>
  );
}

function PulsingDot(): ReactElement {
  return (
    <span className="inline-block w-3 h-3 bg-[#3f7bd1] rounded-full animate-pulse mr-2" aria-hidden={true}></span>
  );
}

export default function FeatureGrid(): ReactElement {
  const features = [
    {
      title: "Laporan barang hilang",
      description: "dokumentasikan detail barang anda untuk mempermudah pencarian",
      cta: "detail →",
      icon: ArrowRight,
    },
    {
      title: "Laporan barang ditemukan",
      description: "bantu pemilik asli menemukan kembali barangnya",
      cta: "detail →",
      icon: ArrowRight,
    },
    {
      title: "Pencarian barang",
      description: "telusuri database kami untuk menemukan barang yang hilang",
      cta: "cari →",
      icon: ArrowRight,
    },
    {
      title: "Laporan barang hilang",
      description: "dokumentasikan detail barang anda untuk mempermudah pencarian",
      cta: "detail →",
      icon: ArrowRight,
    },
    {
      title: "Laporan barang ditemukan",
      description: "bantu pemilik asli menemukan kembali barangnya",
      cta: "detail →",
      icon: ArrowRight,
    },
    {
      title: "Pencarian barang",
      description: "telusuri database kami untuk menemukan barang yang hilang",
      cta: "cari →",
      icon: ArrowRight,
    },
  ];

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Fitur Utama</h1>
          <p className="text-lg text-gray-700">
            Kemudahan dalam melaporkan, mencari, dan mengklaim barang hilang
          </p>
        </motion.header>

        <div className="relative">
          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-blue-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none"></div>

          <motion.div
            drag="x"
            dragConstraints={{ left: -1000, right: 0 }}
            dragElastic={0.1}
            className="flex overflow-x-auto scroll-smooth scroll-snap-x-mandatory scrollbar-hide"
            onWheel={handleWheel}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={`${feature.title}-${index}`}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                cta={feature.cta}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-12 flex items-center justify-center space-x-2 text-sm text-gray-600"
          >
            <PulsingDot />
            <span>Terintegrasi moderasi & notifikasi real-time</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
