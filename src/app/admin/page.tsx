"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/lib/supabase";

export default function Admin() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    is_staff_pick: false,
    is_active: true
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Check authentication
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!adminLoggedIn) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      if (productsRes.ok && categoriesRes.ok) {
        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Clear URL input when file is selected
      setFormData({...formData, image_url: ""});
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({...formData, image_url: url});
    // Clear file input when URL is entered
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      // If we have a file, we'd need to upload it first
      // For now, we'll use the URL approach
      const submitData = {
        ...formData,
        image_url: imageFile ? imagePreview : formData.image_url
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        setShowAddForm(false);
        setEditingProduct(null);
        resetForm();
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      category_id: product.category_id.toString(),
      image_url: product.image_url || "",
      is_staff_pick: product.is_staff_pick,
      is_active: product.is_active
    });
    setImagePreview(product.image_url || null);
    setImageFile(null);
    setShowAddForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData(); // Refresh data
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category_id: "",
      image_url: "",
      is_staff_pick: false,
      is_active: true
    });
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/marketplace")}
                className="text-white hover:text-gray-300 transition-colors"
              >
                View Marketplace
              </button>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Logout
              </button>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Navigation Buttons */}
        {!activeSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Inventory Management */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveSection('inventory')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-bold text-black">Inventory Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage your product inventory, add new items, and update existing products.</p>
              <div className="text-sm text-gray-500">
                {products.length} products • {products.filter(p => p.is_staff_pick).length} staff picks
              </div>
            </motion.div>

            {/* Analytics */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveSection('analytics')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-xl font-bold text-black">Analytics</h3>
              </div>
              <p className="text-gray-600 mb-4">View live analytics, sales data, and performance metrics for your marketplace.</p>
              <div className="text-sm text-gray-500">
                Sales tracking • Performance metrics • Customer insights
              </div>
            </motion.div>

            {/* Promotions & Discounts */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveSection('promotions')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <h3 className="text-xl font-bold text-black">Promotions & Discounts</h3>
              </div>
              <p className="text-gray-600 mb-4">Create and manage coupon codes, sales, bundle deals, and flash sales.</p>
              <div className="text-sm text-gray-500">
                Coupon codes • Flash sales • Bundle deals • Usage tracking
              </div>
            </motion.div>

            {/* Shipping & Logistics */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveSection('shipping')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-bold text-black">Shipping & Logistics</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage shipping zones, carriers, fulfillment settings, and delivery tracking.</p>
              <div className="text-sm text-gray-500">
                Shipping zones • USPS/UPS integration • Delivery tracking • Fulfillment
              </div>
            </motion.div>

            {/* Content / Blog Management */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveSection('content')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-bold text-black">Content / Blog Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Add editorial content, blog posts, style guides, and seasonal picks to drive traffic.</p>
              <div className="text-sm text-gray-500">
                Blog posts • Style guides • Editorial content • Product linking
              </div>
            </motion.div>

            {/* Money Management */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-black rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setActiveSection('money')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-xl font-bold text-black">Money Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Track revenue, manage expenses, and view financial reports.</p>
              <div className="text-sm text-gray-500">
                Revenue tracking • Expense management • Financial reports
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Inventory Management Section */}
        {activeSection === 'inventory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <button
                onClick={() => setActiveSection(null)}
                className="mr-4 text-gray-600 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">Inventory Management</h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-black rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-black">{products.length}</h3>
                <p className="text-gray-600">Total Products</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-black rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-black">
                  {products.filter(p => p.is_staff_pick).length}
                </h3>
                <p className="text-gray-600">Staff Picks</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-black rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-black">{categories.length}</h3>
                <p className="text-gray-600">Categories</p>
              </motion.div>
            </div>

            {/* Add Product Button */}
            <div className="mb-8">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 transition-colors"
              >
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-black rounded-lg p-6 mb-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-black rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full border border-black rounded px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-black rounded px-3 py-2 h-24"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Category</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                        className="w-full border border-black rounded px-3 py-2"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Image</label>
                      <div className="space-y-2">
                        {/* Image URL Input */}
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          className="w-full border border-black rounded px-3 py-2"
                          placeholder="https://example.com/image.jpg"
                        />
                        <div className="text-center">
                          <span className="text-sm text-gray-500">OR</span>
                        </div>
                        {/* File Upload */}
                        <div className="flex items-center space-x-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="bg-gray-100 border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors text-sm"
                          >
                            📷 Choose from Camera Roll
                          </label>
                          {imageFile && (
                            <span className="text-sm text-green-600">
                              ✓ {imageFile.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || formData.image_url) && (
                    <div className="mt-4">
                      <label className="block text-sm font-bold mb-2">Image Preview</label>
                      <div className="w-32 h-32 border border-gray-300 rounded overflow-hidden">
                        <img
                          src={imagePreview || formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_staff_pick}
                        onChange={(e) => setFormData({...formData, is_staff_pick: e.target.checked})}
                        className="mr-2"
                      />
                      Staff Pick
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 transition-colors"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Products List */}
            <div className="bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b-2 border-black">
                <h2 className="text-2xl font-bold">Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {product.image_url ? (
                                <img className="h-10 w-10 rounded object-cover" src={product.image_url} alt={product.title} />
                              ) : (
                                <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {product.is_staff_pick && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Staff Pick
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <button
                onClick={() => setActiveSection(null)}
                className="mr-4 text-gray-600 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">Analytics</h2>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
              <p className="text-gray-600">Analytics dashboard coming soon...</p>
            </div>
          </motion.div>
        )}

        {/* Promotions & Discounts Section */}
        {activeSection === 'promotions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <button
                onClick={() => setActiveSection(null)}
                className="mr-4 text-gray-600 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">Promotions & Discounts</h2>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Coupon Codes</h3>
                  <p className="text-gray-600 mb-4">Create and manage discount codes for your customers.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Create Coupon Code
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Flash Sales</h3>
                  <p className="text-gray-600 mb-4">Set up time-limited sales to drive urgency and conversions.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Create Flash Sale
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Bundle Deals</h3>
                  <p className="text-gray-600 mb-4">Create product bundles with special pricing.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Create Bundle Deal
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Shipping & Logistics Section */}
        {activeSection === 'shipping' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <button
                onClick={() => setActiveSection(null)}
                className="mr-4 text-gray-600 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">Shipping & Logistics</h2>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Shipping Zones</h3>
                  <p className="text-gray-600 mb-4">Configure shipping rates and delivery times by region.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Manage Shipping Zones
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Carrier Integration</h3>
                  <p className="text-gray-600 mb-4">Connect with USPS, UPS, and other shipping carriers.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Setup Carriers
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Fulfillment Settings</h3>
                  <p className="text-gray-600 mb-4">Configure order fulfillment and tracking settings.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Configure Fulfillment
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content / Blog Management Section */}
        {activeSection === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <button
                onClick={() => setActiveSection(null)}
                className="mr-4 text-gray-600 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">Content / Blog Management</h2>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Blog Posts</h3>
                  <p className="text-gray-600 mb-4">Create editorial content to drive traffic and build your brand.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Create Blog Post
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Style Guides</h3>
                  <p className="text-gray-600 mb-4">Create seasonal style guides and outfit inspiration.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Create Style Guide
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Product Linking</h3>
                  <p className="text-gray-600 mb-4">Link blog content to relevant products for better conversion.</p>
                  <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-colors">
                    Manage Product Links
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Money Management Section */}
        {activeSection === 'money' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-8">
              <button
                onClick={() => setActiveSection(null)}
                className="mr-4 text-gray-600 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">Money Management</h2>
            </div>
            <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
              <p className="text-gray-600">Money management coming soon...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 