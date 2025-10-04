"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      try {
        // Check for error in URL params
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');
        
        if (errorParam) {
          console.error("OAuth error:", errorParam, errorDescription);
          setError(errorDescription || "Terjadi kesalahan saat login");
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Gagal mendapatkan session");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        if (!sessionData.session) {
          console.log("No session found, redirecting to login");
          router.push("/login");
          return;
        }

        const user = sessionData.session.user;
        const email = user.email!;
        
        console.log("User logged in:", email);
        
        // Validasi domain email
        if (!email.endsWith("@mhs.dinus.ac.id")) {
          setError("❌ Pastikan Login menggunakan email kampus!");
          await supabase.auth.signOut();
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        // Cek apakah user sudah ada di database
        const { data: existingUser } = await supabase
          .from("users")
          .select("id, avatar_url")
          .eq("email", email)
          .single();

        // Tentukan avatar URL yang akan digunakan
        const googleAvatar = user.user_metadata.avatar_url || user.user_metadata.picture || user.user_metadata.photo;
        
        let avatarToSave = googleAvatar;
        
        // Jika user sudah ada DAN sudah upload custom avatar (dari Supabase Storage)
        // JANGAN overwrite dengan foto Google
        if (existingUser?.avatar_url && existingUser.avatar_url.includes('supabase.co/storage')) {
          console.log("✅ User already has custom avatar, keeping it:", existingUser.avatar_url);
          avatarToSave = existingUser.avatar_url; // Keep custom avatar
        } else {
          console.log("📸 Using Google avatar:", googleAvatar);
        }

        // Simpan atau update user ke tabel public.users
        const { error: upsertError } = await supabase.from("users").upsert(
          {
            auth_id: user.id,
            name: user.user_metadata.full_name || user.user_metadata.name || user.user_metadata.display_name || email.split("@")[0],
            email: user.email,
            avatar_url: avatarToSave,
            last_login: new Date().toISOString(),
          },
          {
            onConflict: "email",
          }
        );

        if (upsertError) {
          console.error("Error saving user to database:", upsertError);
          setError("⚠️ Terjadi kesalahan saat menyimpan data user");
          // Still redirect to dashboard even if upsert fails
        } else {
          console.log("✅ User saved to database successfully");
        }

        console.log("Redirecting to dashboard...");
        // Redirect ke dashboard
        router.push("/dashboard");
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Terjadi kesalahan tidak terduga");
        setTimeout(() => router.push("/login"), 2000);
      }
    }

    handleAuth();
  }, [router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Login Gagal</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Memproses login...</p>
        <p className="text-gray-500 mt-2">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}
