/**
 * @deprecated Use supabaseBrowser.ts for client-side or supabaseServer.ts for server-side
 * This file kept for backward compatibility during migration
 */

import { createClient } from "@supabase/supabase-js";

// Menggunakan variabel server-side (tanpa NEXT_PUBLIC_) untuk keamanan lebih baik
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Missing Supabase environment variables in supabaseClient.ts");
  console.warn("Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env.local");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
