// Server-side Supabase client - HANYA untuk API routes
// JANGAN import ini di client components!

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable");
}

// Client untuk operasi biasa (dengan anon key)
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Server-side tidak perlu persist session
  },
});

// Admin client dengan service role key (untuk operasi admin)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
