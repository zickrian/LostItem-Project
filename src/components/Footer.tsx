"use client";

import Link from "next/link";
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden py-16 bg-gradient-to-t from-[#0b0f19] to-[#111827] text-[#ffffff]"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-400/10 rounded-full top-10 left-20 blur-3xl animate-[floatBubblesFooter_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute w-80 h-80 bg-indigo-400/10 rounded-full bottom-16 right-10 blur-3xl animate-[floatBubblesFooter_16s_ease-in-out_infinite_alternate]" />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-[#ffffff] font-bold text-lg">S</span>
            </div>
            <div>
              <h3 className="font-semibold text-2xl bg-gradient-to-r from-[#3b82f6] to-[#3b82f6] bg-clip-text text-transparent">
                SITEMU
              </h3>
              <p className="text-[#3b82f6] text-sm">UDINUS</p>
            </div>
          </div>
          <p className="text-[#cbd5e1] max-w-md">
            Platform resmi untuk menemukan dan melaporkan barang hilang di kampus Universitas Dian Nuswantoro.
          </p>
        </div>

        {/* Middle Section - Quick Links */}
        <div>
          <h4 className="text-[#ffffff] font-semibold text-lg mb-3">Tautan Cepat</h4>
          <ul className="space-y-2 text-[#cbd5e1]">
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-[#3b82f6] transition"
              >
                <ChevronRight className="w-4 h-4 text-[#3b82f6]" /> Beranda
              </a>
            </li>
            <li>
              <a
                href="#found-items"
                className="flex items-center gap-2 hover:text-[#3b82f6] transition"
              >
                <ChevronRight className="w-4 h-4 text-[#3b82f6]" /> Cari Barang
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-[#3b82f6] transition"
              >
                <ChevronRight className="w-4 h-4 text-[#3b82f6]" /> Lapor Barang
              </a>
            </li>
            <li>
              <a
                href="#platform-stats"
                className="flex items-center gap-2 hover:text-[#3b82f6] transition"
              >
                <ChevronRight className="w-4 h-4 text-[#3b82f6]" /> Statistik
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="flex items-center gap-2 hover:text-[#3b82f6] transition"
              >
                <ChevronRight className="w-4 h-4 text-[#3b82f6]" /> Tentang Kami
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div>
          <h4 className="text-[#ffffff] font-semibold text-lg mb-3">Hubungi Kami</h4>
          <ul className="space-y-3 text-[#cbd5e1]">
            <li className="flex items-center gap-3 hover:text-[#3b82f6] transition">
              <Mail className="w-5 h-5 text-[#3b82f6]" />
              <a href="mailto:sitemuDinus@dinus.ac.id">sitemuDinus@dinus.ac.id</a>
            </li>
            <li className="flex items-center gap-3 hover:text-[#3b82f6] transition">
              <Phone className="w-5 h-5 text-[#3b82f6]" />
              <a href="tel:+62243517261">+62 24 3517261</a>
            </li>
            <li className="flex items-center gap-3 hover:text-[#3b82f6] transition">
              <MapPin className="w-5 h-5 text-[#3b82f6]" />
              <span>Jl. Imam Bonjol No.207, Semarang</span>
            </li>
          </ul>

          <h4 className="text-[#ffffff] font-semibold text-lg mt-6 mb-3">
            Media Sosial
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="bg-white/10 p-3 rounded-full hover:bg-blue-500/30 hover:text-[#3b82f6] transition transform hover:scale-110"
            >
              <Instagram className="w-5 h-5 text-[#e2e8f0]" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="bg-white/10 p-3 rounded-full hover:bg-blue-500/30 hover:text-[#3b82f6] transition transform hover:scale-110"
            >
              <Facebook className="w-5 h-5 text-[#e2e8f0]" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="bg-white/10 p-3 rounded-full hover:bg-blue-500/30 hover:text-[#3b82f6] transition transform hover:scale-110"
            >
              <Linkedin className="w-5 h-5 text-[#e2e8f0]" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 text-center mt-10 border-t border-blue-400/20 pt-6 text-[#cbd5e1] text-sm">
        {new Date().getFullYear()} SITEMU UDINUS. All rights reserved. <br />
        Dibuat dengan{" "}
        <span className="inline-block text-red-400 align-middle animate-[heartbeat_1.3s_ease-in-out_infinite]">
          ❤
        </span>{" "}
        untuk Mahasiswa UDINUS.
      </div>

      {/* Heartbeat animation */}
      <style jsx>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.3);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.15);
          }
          70% {
            transform: scale(1);
          }
        }
      `}</style>
    </footer>
  );
}
