"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        // Check session first
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.log("No session found, redirecting to login");
          router.push("/login");
          return;
        }

        const currentUser = sessionData.session.user;
        
        // Validate email domain
        if (!currentUser.email?.endsWith("@mhs.dinus.ac.id")) {
          console.log("Invalid email domain");
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        // Get user data from public.users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", currentUser.email)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          // Still show basic info even if custom table fetch fails
          setUser({
            name: currentUser.user_metadata.full_name || currentUser.email?.split("@")[0],
            email: currentUser.email,
            avatar_url: currentUser.user_metadata.avatar_url,
            role: "student",
          });
        } else {
          setUser(userData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in checkUser:", error);
        router.push("/login");
      }
    }

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-700">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Lost&Found</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10">
                <Image
                  src={user?.avatar_url || "/default-avatar.svg"}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-blue-600 object-cover"
                  priority
                />
              </div>
              <span className="text-gray-700 font-medium hidden sm:inline">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Anda di Dashboard 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Selamat datang, {user?.name}!
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={user?.avatar_url || "/default-avatar.svg"}
                alt="Avatar"
                width={96}
                height={96}
                className="rounded-full border-4 border-blue-600 object-cover"
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-1">📧 {user?.email}</p>
              <p className="text-gray-500 text-sm">
                👤 Role: <span className="font-semibold capitalize">{user?.role}</span>
              </p>
              <p className="text-gray-500 text-sm">
                🕐 Last login: {user?.last_login ? new Date(user.last_login).toLocaleString("id-ID") : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder untuk fitur selanjutnya */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Buat Laporan</h3>
            <p className="text-gray-600 text-sm">Fitur akan segera hadir</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cari Barang</h3>
            <p className="text-gray-600 text-sm">Fitur akan segera hadir</p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Laporan Saya</h3>
            <p className="text-gray-600 text-sm">Fitur akan segera hadir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
