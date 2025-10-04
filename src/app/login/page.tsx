import LoginButton from "@/components/LoginButton";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Underwater Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900"></div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-cyan-300/40 to-transparent blur-3xl animate-light-ray-1"></div>
        <div className="absolute top-0 left-1/2 w-1/3 h-full bg-gradient-to-b from-blue-200/30 to-transparent blur-3xl animate-light-ray-2"></div>
      </div>

      {/* Animated Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Small bubbles */}
        <div className="bubble bubble-sm" style={{ left: '10%', animationDelay: '0s', animationDuration: '8s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '20%', animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '30%', animationDelay: '4s', animationDuration: '9s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '40%', animationDelay: '1s', animationDuration: '11s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '50%', animationDelay: '3s', animationDuration: '7s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '60%', animationDelay: '5s', animationDuration: '10s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '70%', animationDelay: '2.5s', animationDuration: '9s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '80%', animationDelay: '4.5s', animationDuration: '8s' }}></div>
        <div className="bubble bubble-sm" style={{ left: '90%', animationDelay: '1.5s', animationDuration: '10s' }}></div>
        
        {/* Medium bubbles */}
        <div className="bubble bubble-md" style={{ left: '15%', animationDelay: '1s', animationDuration: '12s' }}></div>
        <div className="bubble bubble-md" style={{ left: '35%', animationDelay: '3s', animationDuration: '11s' }}></div>
        <div className="bubble bubble-md" style={{ left: '55%', animationDelay: '2s', animationDuration: '13s' }}></div>
        <div className="bubble bubble-md" style={{ left: '75%', animationDelay: '4s', animationDuration: '10s' }}></div>
        <div className="bubble bubble-md" style={{ left: '85%', animationDelay: '0.5s', animationDuration: '12s' }}></div>
        
        {/* Large bubbles */}
        <div className="bubble bubble-lg" style={{ left: '25%', animationDelay: '2s', animationDuration: '15s' }}></div>
        <div className="bubble bubble-lg" style={{ left: '65%', animationDelay: '5s', animationDuration: '14s' }}></div>
        <div className="bubble bubble-lg" style={{ left: '45%', animationDelay: '3.5s', animationDuration: '16s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-md w-full">
          {/* Login Card with Glass Morphism */}
          <div className="relative group">
            {/* Subtle outer glow - more integrated */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-blue-600/30 rounded-2xl sm:rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-700"></div>
            
            {/* Card */}
            <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/30">
              {/* Decorative corner effects */}
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
              
              <div className="relative p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  {/* Logo with cleaner effect */}
                  <div className="mb-4 sm:mb-6 transform transition-all duration-300 hover:scale-105">
                    <div className="relative inline-block p-3 sm:p-4">
                      {/* Subtle background circle */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl sm:rounded-3xl"></div>
                      {/* Animated ring */}
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-blue-400/20 animate-pulse-slow"></div>
                      <img
                        src="https://dinus.ac.id/wp-content/uploads/2023/11/LogoUdinus.png"
                        alt="Logo UDINUS"
                        className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2 sm:mb-3 animate-fade-in px-2">
                    Selamat Datang! 🌊
                  </h2>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed px-4">
                    Login menggunakan akun Google kampus Anda
                  </p>
                </div>

                {/* Login Button */}
                <div className="transform transition-all duration-300 hover:scale-105">
                  <LoginButton />
                </div>

                {/* Warning Box */}
                <div className="mt-4 sm:mt-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg sm:rounded-xl"></div>
                  <div className="relative p-3 sm:p-4 border border-blue-300/50 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    <p className="text-xs sm:text-sm text-gray-800 text-center leading-relaxed">
                      <span className="text-base sm:text-lg">⚠️</span> <strong className="text-blue-700">Penting:</strong> Pastikan Login hanya menggunakan Email{" "}
                      <span className="font-mono text-blue-600 bg-blue-100/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold text-xs sm:text-sm">Kampus</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6 sm:mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300 rounded-full border border-white/30 group hover:shadow-lg hover:shadow-white/20 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
