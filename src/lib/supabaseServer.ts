// Server-side Supabase client - HANYA untuk API routes
// JANGAN import ini di client components!

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// Validation dengan error message yang jelas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
  console.error("SUPABASE_URL:", supabaseUrl ? "✓" : "✗ MISSING");
  console.error("SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓" : "✗ MISSING");
  console.error("\n📝 Setup Instructions:");
  console.error("1. Go to Vercel Dashboard → Your Project → Settings");
  console.error("2. Add Environment Variables:");
  console.error("   - SUPABASE_URL=https://your-project.supabase.co");
  console.error("   - SUPABASE_ANON_KEY=your-anon-key");
  console.error("3. Redeploy your application\n");
  
  // Don't throw during build, just use placeholder
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️ Using placeholder Supabase client for build");
  }
}

// Client untuk operasi biasa (dengan anon key)
export const supabaseServer = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false, // Server-side tidak perlu persist session
    },
  }
);

// Admin client dengan service role key (untuk operasi admin)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// Helper untuk check apakah Supabase sudah dikonfigurasi
export const isSupabaseServerConfigured = () => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://placeholder.supabase.co" &&
    supabaseAnonKey !== "placeholder-key"
  );
};
