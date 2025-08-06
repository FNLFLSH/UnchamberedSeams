"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/supabase";
import UniversalHeader from "@/components/UniversalHeader";

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Fallback placeholder products when API fails or database is empty
const fallbackProducts: Product[] = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    price: 99.99,
    description: "Classic 90s denim jacket in excellent condition",
    image_url: "",
    image_file: "",
    category_id: 1,
    category: { id: 1, name: "Jackets", description: "", created_at: "", updated_at: "" },
    is_staff_pick: true,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    title: "Retro T-Shirt",
    price: 49.99,
    description: "Vintage band t-shirt from the 80s",
    image_url: "",
    image_file: "",
    category_id: 2,
    category: { id: 2, name: "Tops", description: "", created_at: "", updated_at: "" },
    is_staff_pick: true,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    title: "Leather Boots",
    price: 199.99,
    description: "Vintage leather boots, barely worn",
    image_url: "",
    image_file: "",
    category_id: 4,
    category: { id: 4, name: "Footwear", description: "", created_at: "", updated_at: "" },
    is_staff_pick: true, // Changed to true for demo
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    title: "Vintage Sweater",
    price: 79.99,
    description: "Hand-knitted wool sweater from the 70s",
    image_url: "",
    image_file: "",
    category_id: 2,
    category: { id: 2, name: "Tops", description: "", created_at: "", updated_at: "" },
    is_staff_pick: true, // Changed to true for demo
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 5,
    title: "Denim Jeans",
    price: 89.99,
    description: "Classic 90s high-waisted jeans",
    image_url: "",
    image_file: "",
    category_id: 3,
    category: { id: 3, name: "Bottoms", description: "", created_at: "", updated_at: "" },
    is_staff_pick: false,
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 6,
    title: "Vintage Bag",
    price: 129.99,
    description: "Authentic leather bag from the 60s",
    image_url: "",
    image_file: "",
    category_id: 5,
    category: { id: 5, name: "Accessories", description: "", created_at: "", updated_at: "" },
    is_staff_pick: false,
    is_active: true,
    created_at: "",
    updated_at: ""
  }
];

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      // If database is empty or has no products, use fallbacks
      if (!data || data.length === 0) {
        console.log('Database empty, using fallback products');
        setProducts(fallbackProducts);
        setUsingFallback(true);
      } else {
        setProducts(data);
        setUsingFallback(false);
      }
    } catch (err) {
      console.log('API failed, using fallback products');
      setProducts(fallbackProducts);
      setUsingFallback(true);
      setError(null); // Don't show error to user, just use fallbacks
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  const staffPicks = products.filter(product => product.is_staff_pick);
  const allProducts = products.filter(product => product.is_active);

  // Always show exactly 4 items in staff picks carousel
  // If we have fewer than 4 staff picks, fill with regular products
  const carouselItems = staffPicks.length >= 4
    ? staffPicks.slice(0, 4)
    : [...staffPicks, ...allProducts.filter(p => !p.is_staff_pick)].slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Universal Header */}
      <UniversalHeader 
        title="Vintage & Rare Finds" 
        showHamburger={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Staff Picks Section */}
        {carouselItems.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Staff Picks</h2>
              {/* Scroll indicator for mobile */}
              <div className="flex items-center space-x-1 md:hidden">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-500 ml-2">Swipe</span>
              </div>
            </div>
            <div className="relative">
              {/* Mobile scroll container with better touch handling */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide pb-4 -mb-4"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="flex space-x-4 md:space-x-6 lg:space-x-8 px-4 md:px-0">
                  {carouselItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm w-64 md:w-56 lg:w-72 flex-shrink-0 flex flex-col hover:shadow-lg transition-shadow"
                      style={{ minHeight: '320px' }}
                    >
                      <div className="relative">
                        {/* Image */}
                        {item.image_url || item.image_file ? (
                          <img
                            src={item.image_url || `/uploads/${item.image_file}`}
                            alt={item.title}
                            className="w-full h-48 md:h-48 lg:h-64 object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-48 md:h-48 lg:h-64 flex items-center justify-center bg-gray-100 rounded-t-lg">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-white border border-black px-2 py-1 text-xs font-bold">
                          {item.is_staff_pick ? 'STAFF PICK' : 'FEATURED'}
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-base leading-tight mb-1">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 mb-1 line-clamp-2">{item.description}</div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-red-600 font-bold text-lg">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scroll gradient indicators for mobile */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
            </div>
          </div>
        )}

        {/* All Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                {/* Image */}
                {item.image_url || item.image_file ? (
                  <img
                    src={item.image_url || `/uploads/${item.image_file}`}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-t-lg">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="font-bold text-base leading-tight mb-2">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-gray-500 mb-2">{item.description}</div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold text-lg">{formatPrice(item.price)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo notice when using fallback */}
        {usingFallback && (
          <div className="mt-8 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-blue-800 text-sm">
                💡 Demo Mode: Showing sample products.
                <a href="/admin/login" className="underline ml-1">Login to admin</a> to add real products.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 