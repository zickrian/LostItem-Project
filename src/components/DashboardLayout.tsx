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

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
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
          // User found in database, ensure role fallback if missing
          setUser({
            ...userData,
            role: userData.role || "student",
          });
        }
        
        setLoading(false);
      } catch {
        router.push("/login");
      }
    }

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login");
      }
    });

    // Subscribe to user updates for real-time changes
    let userChannel: ReturnType<typeof supabase.channel> | null = null;
    
    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData.session?.user.email) {
        userChannel = supabase
          .channel("user-profile-changes")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "users",
              filter: `email=eq.${sessionData.session.user.email}`,
            },
            (payload) => {
              // Update user state with new data
              setUser((prevUser) => {
                if (!prevUser) return null;
                return {
                  ...prevUser,
                  ...(payload.new as Partial<User>),
                };
              });
            }
          )
          .subscribe();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
      if (userChannel) {
        supabase.removeChannel(userChannel);
      }
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4" style={{ borderTopColor: '#114D91', borderBottomColor: '#114D91' }}></div>
          <p className="text-xl font-bold text-gray-700">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      {user && <Sidebar user={user} isAdmin={isAdmin} />}
      <main className="flex-1 w-full lg:ml-0 pt-16 lg:pt-0 overflow-x-hidden">
        <div className="w-full max-w-full min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
