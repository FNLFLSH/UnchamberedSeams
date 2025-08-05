"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <button
              onClick={() => router.push("/")}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Inventory Management */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-xl font-bold text-black">Inventory</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage your product inventory, add new items, and update existing products.</p>
            <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
              Manage Inventory
            </button>
          </motion.div>

          {/* Upload Products */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-xl font-bold text-black">Upload</h3>
            </div>
            <p className="text-gray-600 mb-4">Upload new products with images and descriptions to your marketplace.</p>
            <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
              Upload Products
            </button>
          </motion.div>

          {/* Live Dashboard */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-bold text-black">Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">View live analytics, sales data, and performance metrics for your marketplace.</p>
            <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
              View Analytics
            </button>
          </motion.div>

          {/* Portal Management */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-bold text-black">Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure portal settings, manage users, and customize your marketplace.</p>
            <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
              Manage Settings
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 