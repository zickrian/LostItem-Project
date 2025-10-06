import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// NextAuth handler for App Router (route.ts)
// Exports GET and POST handlers so Next.js can use the built-in request handlers
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL 
            ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
            : 'https://sitemudinus.vercel.app/api/auth/callback/google',
        },
      },
    }),
  ],

  // Jika Anda ingin mengarahkan user ke halaman callback frontend setelah login,
  // gunakan redirect callback di bawah ini (opsional). Anda juga bisa mengandalkan
  // `callbackUrl` yang dikirim saat memulai flow auth.
  callbacks: {
    async redirect({ url }: { url: string; baseUrl: string }) {
      // Gunakan NEXTAUTH_URL atau domain Vercel
      const prodUrl = process.env.NEXTAUTH_URL || 'https://sitemudinus.vercel.app';
      
      // Jika url sudah absolute dan dari domain yang sama, gunakan itu
      if (url.startsWith(prodUrl)) return url;
      // Jika relative path, gabungkan dengan base URL
      if (url.startsWith("/")) return `${prodUrl}${url}`;
      // Default: arahkan ke halaman callback frontend
      return `${prodUrl}/auth/callback`;
    },
  },
});

export { handler as GET, handler as POST };
