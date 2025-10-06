"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";
import Link from "next/link";

interface Login1Props {
  heading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const Login1 = ({
  heading,
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-wordmark.svg",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  googleText = "Sign up with Google",
}: Login1Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Terjadi kesalahan saat login. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex h-full items-center justify-center px-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl flex w-full max-w-md flex-col items-center gap-y-8 rounded-3xl border-2 border-blue-100 px-6 sm:px-8 py-12 shadow-2xl">
          <div className="flex flex-col items-center gap-y-4">
            {/* Logo */}
            <div className="flex items-center gap-1 justify-center mb-2">
              <a href={logo.url} className="transform transition-transform duration-300 hover:scale-105">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-24 w-24 object-contain drop-shadow-lg"
                />
              </a>
            </div>
            {heading && (
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                {heading}
              </h1>
            )}
            <p className="text-gray-600 text-sm text-center">
              Login menggunakan akun Google kampus Anda
            </p>
          </div>
          
          <div className="flex w-full flex-col gap-6">
            {/* Google Login Button with UDINUS color */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
              style={{ 
                backgroundColor: isLoading ? '#9CA3AF' : 'rgba(17, 77, 145, 1)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'rgba(17, 77, 145, 1)';
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FcGoogle className="size-6" />
                  <span>{googleText}</span>
                </div>
              )}
            </Button>
          </div>

          {/* Warning Box */}
          <div className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-xs sm:text-sm text-gray-800 text-center leading-relaxed">
              <span className="text-lg">⚠️</span> <strong className="text-blue-700">Penting:</strong> Pastikan Login hanya menggunakan Email{" "}
              <span className="font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded font-bold">Kampus</span>
            </p>
          </div>

          {/* Back to Home */}
          <div className="w-full">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300 rounded-xl border border-gray-300 group font-medium"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login1 };
