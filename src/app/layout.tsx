import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Lost&Found - UDINUS",
  description: "Platform untuk melaporkan dan menemukan barang hilang di kampus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        
        {/* Preconnect to Supabase for faster image loading */}
        <link rel="preconnect" href="https://bcxpmqhxcqiyfnlmnhvv.supabase.co" />
        <link rel="dns-prefetch" href="https://bcxpmqhxcqiyfnlmnhvv.supabase.co" />
        
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
        style={{ fontFamily: 'var(--font-inter), var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
