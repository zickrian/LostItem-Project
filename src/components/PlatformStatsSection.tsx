"use client";

import { getPlatformStats } from '@/lib/getPlatformStats';
import { useEffect, useState, useRef } from 'react';

export default function PlatformStatsSection() {
  const [stats, setStats] = useState({ hilang: 0, ditemukan: 0, diklaim: 0 });

  useEffect(() => {
    getPlatformStats().then(setStats);
  }, []);

  return (
    <section
      id="platform-stats"
      className="relative bg-gradient-to-b from-[#e6f0ff] via-white to-[#f7faff] pt-24 md:pt-28 pb-16 -mt-4 overflow-hidden"
    >
      {/* Background bubble animation (opsional, jika ingin konsisten dengan fitur utama) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bubble-particle w-24 h-24 top-10 left-12" />
        <div className="bubble-particle w-20 h-20 top-24 right-20 delay-2" />
        <div className="bubble-particle w-28 h-28 bottom-16 left-1/4 delay-4" />
      </div>

      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Statistik Platform
        </h2>
        <p className="mt-4 text-slate-500 text-base md:text-lg">
          Data terkini <span className="font-semibold">SITEMU - UDINUS</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 animate-pulse mb-4">
            <span className="text-4xl">📢</span>
          </div>
          <h3 className="text-gray-800 font-semibold text-lg">Barang Hilang Dilaporkan</h3>
          <CountUp target={stats.hilang} className="text-5xl font-extrabold text-gray-900" />
        </div>
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 animate-pulse mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-gray-800 font-semibold text-lg">Barang Ditemukan</h3>
          <CountUp target={stats.ditemukan} className="text-5xl font-extrabold text-gray-900" />
        </div>
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 animate-pulse mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h3 className="text-gray-800 font-semibold text-lg">Barang Diklaim</h3>
          <CountUp target={stats.diklaim} className="text-5xl font-extrabold text-gray-900" />
        </div>
      </div>
    </section>
  );
}

// CountUp component with animation
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
