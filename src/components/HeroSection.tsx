"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Folder, Bell } from "lucide-react";

export default function HeroSection() {
  return (
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
  );
}
