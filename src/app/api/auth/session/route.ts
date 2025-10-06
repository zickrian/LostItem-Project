// API Route: GET /api/auth/session
// Mendapatkan session user saat ini (server-side)

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    // Ambil session token dari cookies
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization header", session: null },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Verify token di server-side
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid token", session: null },
        { status: 401 }
      );
    }

    // Get user data from database
    const { data: userData, error: dbError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json({
      session: {
        user: {
          id: user.id,
          email: user.email,
          ...userData,
        },
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Internal server error", session: null },
      { status: 500 }
    );
  }
}
