/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /^animate-/ },          // pastikan kelas animasi tidak di-purge
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
          lighter: 'var(--primary-lighter)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'var(--font-inter)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      keyframes: {
        floatBubble: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-12px) translateX(8px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        floatBubbleSlow: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-18px) translateX(-10px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        floatMail: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-10px) translateX(5px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        floatLocation: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-15px) translateX(-8px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        floatFolder: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-12px) translateX(6px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        floatBell: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-8px) translateX(-4px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        heartbeat: {
          "0%,100%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.15)" },
          "60%": { transform: "scale(0.98)" },
        },
      },
      animation: {
        "float-bubble": "floatBubble 12s ease-in-out infinite alternate",
        "float-bubble-slow": "floatBubbleSlow 16s ease-in-out infinite alternate",
        "float-mail": "floatMail 8s ease-in-out infinite",
        "float-location": "floatLocation 10s ease-in-out infinite",
        "float-folder": "floatFolder 9s ease-in-out infinite",
        "float-bell": "floatBell 7s ease-in-out infinite",
        heartbeat: "heartbeat 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
