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
  );
}
