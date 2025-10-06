"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      try {
        // Check for error in URL params
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');
        
        if (errorParam) {
          const errorMsg = errorDescription || "Terjadi kesalahan saat login";
          setError(errorMsg);
          toast.error(errorMsg);
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError("Gagal mendapatkan session");
          toast.error("Gagal mendapatkan session");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        if (!sessionData.session) {
          router.push("/login");
          return;
        }

        const user = sessionData.session.user;
        const email = user.email!;
        
        // Validasi domain email
        if (!email.endsWith("@mhs.dinus.ac.id")) {
          const errorMsg = "Pastikan Login menggunakan email kampus!";
          setError(errorMsg);
          toast.error(errorMsg);
          await supabase.auth.signOut();
          setTimeout(() => router.push("/login"), 8000);
          return;
        }

        // Get Google avatar from user metadata
        const googleAvatar = user.user_metadata.avatar_url || user.user_metadata.picture || user.user_metadata.photo;

        // Ambil data user yang sudah ada untuk menjaga perubahan manual
        const { data: existingUser } = await supabase
          .from("users")
          .select("id, name, avatar_url")
          .eq("auth_id", user.id)
          .maybeSingle();

        const fallbackName =
          user.user_metadata.full_name ||
          user.user_metadata.name ||
          user.user_metadata.display_name ||
          email.split("@")[0];

        const nameToUse = existingUser?.name?.trim() ? existingUser.name : fallbackName;
        const avatarToUse = googleAvatar || existingUser?.avatar_url || null;

        // Simpan atau update user ke tabel public.users
        const { error: upsertError } = await supabase
          .from("users")
          .upsert(
            {
              auth_id: user.id,
              name: nameToUse,
              email: user.email,
              avatar_url: avatarToUse,
              last_login: new Date().toISOString(),
            },
            {
              onConflict: "email",
            }
          )
          .select();

        if (upsertError) {
          setError("⚠️ Terjadi kesalahan saat menyimpan data user");
          toast.error("Terjadi kesalahan saat menyimpan data user");
          // Still redirect to dashboard even if upsert fails
        }

        // Redirect ke dashboard
        toast.success("Login berhasil!");
        router.push("/dashboard");
      } catch {
        setError("Terjadi kesalahan tidak terduga");
        toast.error("Terjadi kesalahan tidak terduga");
        setTimeout(() => router.push("/login"), 2000);
      }
    }

    handleAuth();
  }, [router, toast]);

  if (error) {
    return (
      <section className="bg-gradient-to-b from-blue-50 to-white h-screen relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="flex h-full items-center justify-center px-4 relative z-10">
          <div className="bg-white/95 backdrop-blur-xl flex w-full max-w-md flex-col items-center gap-y-6 rounded-3xl border-2 border-red-200 px-6 sm:px-8 py-12 shadow-2xl">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            {/* Error Title */}
            <h2 className="text-3xl font-black text-red-600">Login Gagal</h2>
            
            {/* Error Message */}
            <div className="w-full bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-5">
              <p className="text-gray-800 text-center font-semibold leading-relaxed">
                {error}
              </p>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-medium">Mengalihkan ke halaman login...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex h-full items-center justify-center px-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl flex w-full max-w-md flex-col items-center gap-y-6 rounded-3xl border-2 border-blue-100 px-6 sm:px-8 py-12 shadow-2xl">
          {/* Loading Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          
          {/* Loading Title */}
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Memproses Login</h2>
          
          {/* Loading Message */}
          <div className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5">
            <p className="text-gray-700 text-center font-medium">
              Mohon tunggu sebentar, kami sedang memverifikasi akun Anda...
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
