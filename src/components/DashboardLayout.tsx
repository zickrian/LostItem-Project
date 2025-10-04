"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          router.push("/login");
          return;
        }

        const currentUser = sessionData.session.user;
        
        if (!currentUser.email?.endsWith("@mhs.dinus.ac.id")) {
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", currentUser.email)
          .single();

        if (userError) {
          // User not in database yet, use auth metadata
          const fallbackAvatar = currentUser.user_metadata.avatar_url || 
                                 currentUser.user_metadata.picture || 
                                 currentUser.user_metadata.photo;
          
          setUser({
            id: currentUser.id,
            name: currentUser.user_metadata.full_name || currentUser.email?.split("@")[0],
            email: currentUser.email,
            avatar_url: fallbackAvatar,
            role: "student",
          });
        } else {
          // User found in database, use avatar from database (Google photo)
          setUser(userData);
        }
        
        setLoading(false);
      } catch (error) {
        router.push("/login");
      }
    }

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4" style={{ borderTopColor: 'rgba(17, 77, 145)', borderBottomColor: 'rgba(17, 77, 145)' }}></div>
          <p className="text-xl text-gray-700">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {user && <Sidebar user={user} />}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
