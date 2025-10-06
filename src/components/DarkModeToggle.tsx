"use client";

import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // To avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => {
        toggleTheme();
        // Optional: add sound or haptic feedback here
      }}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-gradient-to-br p-1 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform active:scale-95"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-full w-full h-full flex items-center justify-center shadow-inner"
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 1.1 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <AnimatePresence initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Moon size={24} color="#6366F1" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Sun size={24} color="#2563EB" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Glow pulse when switching to dark mode */}
      {isDark && (
        <motion.div
          className="absolute rounded-full w-14 h-14 bg-indigo-500 opacity-30 blur-xl"
          layoutId="glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </motion.button>
  );
}
