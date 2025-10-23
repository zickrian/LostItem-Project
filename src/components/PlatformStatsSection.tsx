"use client";

import { getPlatformStats } from '@/lib/getPlatformStats';
import { useEffect, useState, useRef } from 'react';

export default function PlatformStatsSection() {
  const [stats, setStats] = useState({ hilang: 0, ditemukan: 0, diklaim: 0 });

  useEffect(() => {
    getPlatformStats().then(setStats);
  }, []);

  return (
    <section id="statistik-platform" className="relative py-24 overflow-hidden" style={{contentVisibility: 'auto', containIntrinsicSize: '0 400px'}}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,_#1E3A8A,_#3B82F6,_#1E40AF,_#1E3A8A)] blur-3xl opacity-25 animate-spinGradient"></div>

      {/* Content */}
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-black">
          Statistik Platform
        </h2>
        <p className="text-gray-600 mt-2">
          Data terkini sistem Lost & Found UDINUS
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
        <div className="bg-[rgba(255,255,255,0.6)] backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg hover:-translate-y-5 hover:scale-[1.03] hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 animate-pulse mb-4">
            <span className="text-4xl">📢</span>
          </div>
          <h3 className="text-gray-700 font-semibold text-lg">Barang Hilang Dilaporkan</h3>
          <CountUp target={stats.hilang} className="text-5xl font-extrabold text-gray-900" />
        </div>
        <div className="bg-[rgba(255,255,255,0.6)] backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg hover:-translate-y-5 hover:scale-[1.03] hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 animate-pulse mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-gray-700 font-semibold text-lg">Barang Ditemukan</h3>
          <CountUp target={stats.ditemukan} className="text-5xl font-extrabold text-gray-900" />
        </div>
        <div className="bg-[rgba(255,255,255,0.6)] backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg hover:-translate-y-5 hover:scale-[1.03] hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 animate-pulse mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h3 className="text-gray-700 font-semibold text-lg">Barang Diklaim</h3>
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
