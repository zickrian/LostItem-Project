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
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
              style={{ color: isMobileMenuOpen ? 'rgba(17, 77, 145)' : undefined }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(17, 77, 145)'}
              onMouseLeave={(e) => e.currentTarget.style.color = isMobileMenuOpen ? 'rgba(17, 77, 145)' : 'rgb(55, 65, 81)'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xl font-bold" style={{ color: 'rgba(17, 77, 145)' }}>Lost&Found</span>
          </div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={user.avatar_url}
              src={user.avatar_url || "/default-avatar.svg"}
              alt="Avatar"
              className="h-8 w-8 rounded-full border-2 object-cover"
              style={{ borderColor: 'rgba(17, 77, 145)' }}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/default-avatar.svg";
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay - Transparent clickable area */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300
          lg:translate-x-0 lg:w-64
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold" style={{ color: 'rgba(17, 77, 145)' }}>Lost&Found</h1>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={user.avatar_url}
                src={user.avatar_url || "/default-avatar.svg"}
                alt="Avatar"
                className="h-12 w-12 rounded-full border-2 object-cover"
                style={{ borderColor: 'rgba(17, 77, 145)' }}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/default-avatar.svg";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = item.Icon;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: isActive ? 'rgba(17, 77, 145)' : 'transparent',
                        color: isActive ? 'white' : 'rgba(17, 77, 145)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.05)';
                          e.currentTarget.style.color = 'rgba(17, 77, 145, 0.9)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'rgba(17, 77, 145)';
                        }
                      }}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
