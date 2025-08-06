"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/media/A_mesmerizing_highcontrast_202506121917_dc.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Lock Icon - Top Left */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        onClick={() => router.push("/admin/login")}
        className="absolute top-6 left-6 z-50 text-white hover:text-gray-300 transition-colors cursor-pointer"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      </motion.button>

      {/* Chambered Inseams Text - Using Beyond Repair style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute w-full text-center"
        style={{ top: "25%" }}
      >
        <img 
          src="/media/Untitled-1.png" 
          alt="Chambered Inseams" 
          className="mx-auto max-w-md md:max-w-lg lg:max-w-xl"
        />
      </motion.div>

      {/* Sword Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        onClick={() => router.push("/marketplace")}
        className="absolute left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform duration-300"
        style={{ top: "50%" }}
      >
        <img src="/media/SWORD.png" alt="Enter" className="h-24 w-auto md:h-32" />
      </motion.button>
    </main>
  );
}
