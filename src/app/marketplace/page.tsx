"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Product data structure matching your Flask model
interface Product {
  id: number;
  name: string;
  category: string;
  size: string;
  condition: string;
  price: number;
  quantity: number;
  notes?: string;
  image_url?: string;
  image_file?: string;
  date_added: string;
}

// Sample data from your Flask app
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    category: "Jackets",
    size: "M",
    condition: "Good",
    price: 99.00,
    quantity: 1,
    notes: "Classic 90s denim jacket in excellent condition",
    date_added: "2024-01-01"
  },
  {
    id: 2,
    name: "Retro T-Shirt",
    category: "Tops",
    size: "L",
    condition: "Excellent",
    price: 49.00,
    quantity: 2,
    notes: "Vintage band t-shirt from the 80s",
    date_added: "2024-01-01"
  },
  {
    id: 3,
    name: "Leather Boots",
    category: "Footwear",
    size: "42",
    condition: "Good",
    price: 199.00,
    quantity: 1,
    notes: "Vintage leather boots, barely worn",
    date_added: "2024-01-01"
  },
  {
    id: 4,
    name: "Vintage Sweater",
    category: "Tops",
    size: "S",
    condition: "Excellent",
    price: 79.00,
    quantity: 1,
    notes: "Hand-knitted wool sweater from the 70s",
    date_added: "2024-01-01"
  },
  {
    id: 5,
    name: "Denim Jeans",
    category: "Bottoms",
    size: "32",
    condition: "Good",
    price: 89.00,
    quantity: 2,
    notes: "Classic 90s high-waisted jeans",
    date_added: "2024-01-01"
  }
];

const categories = ["Jackets", "Tops", "Bottoms", "Footwear", "Accessories"];

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime());
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, minPrice, maxPrice, sortBy]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const staffPicks = filteredProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Chambered Inseams</h1>
          <p className="text-gray-300 mt-2">Vintage & Rare Finds</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Staff Picks Carousel */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Staff Picks</h2>
          </div>
          <div className="relative">
            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-6 min-w-max lg:justify-center lg:space-x-8">
                {staffPicks.length > 0 ? (
                  staffPicks.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm w-56 h-80 lg:w-72 lg:h-96 flex-shrink-0 flex flex-col hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        {item.image_file ? (
                          <img 
                            src={`/uploads/${item.image_file}`} 
                            alt={item.name} 
                            className="w-full h-48 lg:h-64 object-cover rounded-t-lg"
                          />
                        ) : item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-48 lg:h-64 object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-48 lg:h-64 flex items-center justify-center bg-gray-100 rounded-t-lg">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-white border border-black px-2 py-1 text-xs font-bold">
                          STAFF PICK
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs uppercase">{item.category}</span>
                            <span className="font-bold text-xs">{item.size}</span>
                          </div>
                          <div className="font-bold text-base leading-tight mb-1">{item.name}</div>
                          <div className="text-sm text-gray-500 mb-1">{item.notes || ''}</div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-red-600 font-bold text-lg">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-50 border border-dashed border-gray-300 rounded-lg w-56 h-80 lg:w-72 lg:h-96 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300 text-lg">No staff picks</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Button and Popup */}
        <div className="mb-8 flex items-center">
          <button
            type="button"
            onClick={() => setShowFilterPopup(!showFilterPopup)}
            className="bg-black text-white px-6 py-2 rounded font-bold text-sm shadow hover:bg-gray-900 focus:outline-none"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>

        {/* Filter Popup */}
        {showFilterPopup && (
          <div className="fixed top-24 left-8 bg-white border border-black rounded-lg shadow-lg p-6 z-50 min-w-[260px]">
            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-xs font-bold mb-1">Category</label>
                <select
                  name="category"
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-black rounded px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div>
                  <label htmlFor="min_price" className="block text-xs font-bold mb-1">Min Price</label>
                  <input
                    type="number"
                    name="min_price"
                    id="min_price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    step="0.01"
                    className="w-full border border-black rounded px-3 py-2 text-sm"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label htmlFor="max_price" className="block text-xs font-bold mb-1">Max Price</label>
                  <input
                    type="number"
                    name="max_price"
                    id="max_price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    step="0.01"
                    className="w-full border border-black rounded px-3 py-2 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="sort_by" className="block text-xs font-bold mb-1">Sort By</label>
                <select
                  name="sort_by"
                  id="sort_by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-black rounded px-3 py-2 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* All Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                {item.image_file ? (
                  <img 
                    src={`/uploads/${item.image_file}`} 
                    alt={item.name} 
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
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
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs uppercase">{item.category}</span>
                  <span className="font-bold text-xs">{item.size}</span>
                </div>
                <div className="font-bold text-base leading-tight mb-2">{item.name}</div>
                <div className="text-sm text-gray-500 mb-2">{item.notes || ''}</div>
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold text-lg">{formatPrice(item.price)}</span>
                  <span className="text-xs text-gray-500">{item.condition}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 