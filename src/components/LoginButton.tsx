"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/contexts/ToastContext";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (signInError) {
        const errorMessage = "Gagal memulai proses login. Silakan coba lagi.";
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      }
      // Note: If successful, browser will redirect, so we don't need to setLoading(false)
    } catch {
      const errorMessage = "Terjadi kesalahan tidak terduga";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="relative w-full group overflow-hidden"
      >
        {/* Background gradient with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 transition-all duration-300 group-hover:scale-105"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        {/* Button content */}
        <div className="relative px-8 py-4 flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
              <span className="animate-pulse">Memproses...</span>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 blur-lg rounded-full animate-pulse-slow"></div>
                <svg className="relative w-6 h-6 transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffffff"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#ffffff"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ffffff"/>
                </svg>
              </div>
              <span className="group-hover:tracking-wide transition-all duration-300">Login dengan Google</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </div>
      </button>
      
      {error && (
        <div className="mt-4 relative overflow-hidden rounded-xl animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100"></div>
          <div className="relative p-4 border border-red-300/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
