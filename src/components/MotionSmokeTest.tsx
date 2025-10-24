"use client";
import { motion } from "framer-motion";

export default function MotionSmokeTest() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px 0px -50px 0px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-6 w-fit rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700"
    >
      ✅ Framer-motion in-view OK
    </motion.div>
  );
}
