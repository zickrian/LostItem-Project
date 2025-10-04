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
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

const menuItems = [
  { name: "Dashboard", path: "/dashboard", Icon: HomeIcon },
  { name: "Buat Laporan", path: "/dashboard/laporan", Icon: DocumentTextIcon },
  { name: "Statistik", path: "/dashboard/statistik", Icon: ChartBarIcon },
  { name: "Setting", path: "/dashboard/setting", Icon: Cog6ToothIcon },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
              style={{ color: 'rgba(17, 77, 145)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xl font-bold" style={{ color: 'rgba(17, 77, 145)' }}>Lost&Found</span>
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

      {/* Sidebar - Desktop & Mobile Drawer - Improved */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-all duration-300 border-r-2 border-gray-200
          lg:translate-x-0 lg:w-72
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-72
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold" style={{ color: 'rgba(17, 77, 145)' }}>Lost&Found</h1>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={user.avatar_url}
                src={user.avatar_url || "/default-avatar.svg"}
                alt="Avatar"
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/default-avatar.svg";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Improved */}
          <nav className="flex-1 p-5 overflow-y-auto">
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
            </div>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = item.Icon;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 group relative overflow-hidden"
                      style={{
                        backgroundColor: isActive ? 'rgba(17, 77, 145)' : 'transparent',
                        color: isActive ? 'white' : 'rgb(75, 85, 99)',
                        boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                        transform: isActive ? 'translateX(4px)' : 'translateX(0)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.1)';
                          e.currentTarget.style.color = 'rgba(17, 77, 145)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'rgb(75, 85, 99)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                    >

                      <IconComponent className="h-6 w-6 flex-shrink-0" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button - Improved */}
          <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border-t-2 border-red-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 bg-white hover:bg-red-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-2 border-red-200 hover:border-red-600"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-72 flex-shrink-0" />
    </>
  );
}
