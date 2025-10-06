// Client-side Supabase client - AMAN untuk browser
// Hanya untuk auth operations yang HARUS dilakukan di client
// Credentials TIDAK diekspos ke browser

import { createClient } from "@supabase/supabase-js";

// Client-side hanya butuh URL publik untuk auth redirect
// Actual operations dilakukan lewat API routes
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder", // Fallback untuk build
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Helper untuk check jika client sudah dikonfigurasi dengan benar
export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
};
