"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar_url?: string;
  };
  isAdmin?: boolean;
}

const baseMenuItems = [
  { name: "Dashboard", path: "/dashboard", Icon: HomeIcon },
  { name: "Buat Laporan", path: "/dashboard/laporan", Icon: DocumentTextIcon },
  { name: "Statistik", path: "/dashboard/statistik", Icon: ChartBarIcon },
  { name: "Setting", path: "/dashboard/setting", Icon: Cog6ToothIcon },
];

export default function Sidebar({ user, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Mobile Header - Modern Minimalist */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-gray-200 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-blue-50 p-2.5 rounded-xl transition-all duration-200"
              style={{ color: '#114D91' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-lg font-black tracking-tight" style={{ color: '#114D91' }}>SITEMU</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay - Improved */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer - Modern Minimalist Tasklify Style */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white z-50 transition-all duration-300 border-r border-gray-200
          lg:translate-x-0 lg:w-72
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-72
          shadow-[0_0_20px_rgba(0,0,0,0.04)]
        `}
        style={{
          backgroundColor: '#FFFFFF'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Modern & Clean */}
          <div className="px-6 py-7 border-b border-gray-100">
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#114D91' }}>SITEMU</h1>
            <p className="text-xs font-semibold text-gray-500 mt-1">Mahasiswa Portal</p>
          </div>

          {/* User Info - Modern Card Style with Vertical Layout */}
          <div className="px-5 py-6 border-b border-gray-100">
            <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={user.avatar_url}
                src={user.avatar_url || "/default-avatar.svg"}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/default-avatar.svg";
                }}
              />
              <div className="flex flex-col items-center text-center w-full">
                <p className="text-sm font-black text-gray-900 truncate w-full">{user.name}</p>
                <p className="text-xs text-gray-600 truncate font-medium w-full mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Modern Minimalist Tasklify Style */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="mb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">Navigation</p>
            </div>
            <ul className="space-y-1">
              {[...
                baseMenuItems.slice(0, 3),
                ...(isAdmin
                  ? [{ name: "Admin", path: "/dashboard/admin", Icon: ShieldCheckIcon }]
                  : []),
                ...baseMenuItems.slice(3),
              ].map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = item.Icon;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group relative"
                      style={{
                        backgroundColor: isActive ? '#114D91' : 'transparent',
                        color: isActive ? '#FFFFFF' : '#6B7280',
                        boxShadow: isActive ? '0 2px 8px rgba(17, 77, 145, 0.15)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#EAF2FF';
                          e.currentTarget.style.color = '#114D91';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#6B7280';
                        }
                      }}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="text-[14px]">{item.name}</span>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ backgroundColor: '#FFFFFF' }}></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button - Modern Clean Style */}
          <div className="px-4 py-5 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md border border-red-200 hover:border-red-600"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="text-[14px]">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-72 flex-shrink-0" />
    </>
  );
}
