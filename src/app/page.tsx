"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple login check - you can replace with your actual authentication
    if (username === "admin" && password === "admin123") {
      router.push("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

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
        onClick={() => setShowLoginPopup(true)}
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

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Admin Login</h2>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-bold text-black mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-2 border-black rounded px-4 py-2 text-black focus:outline-none focus:border-gray-600"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-black rounded px-4 py-2 text-black focus:outline-none focus:border-gray-600"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Demo: username: admin, password: admin123
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
