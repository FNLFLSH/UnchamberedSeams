"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import UniversalHeader from "@/components/UniversalHeader";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ArchivePost {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date: string;
  is_featured: boolean;
  x: number;
  y: number;
  z: number;
  rotation?: number;
  scale?: number;
}

// Enhanced mock data with 3D positioning
const mockArchivePosts: ArchivePost[] = [
  {
    id: "1",
    title: "Vintage Denim Collection",
    description: "Classic 90s denim pieces in excellent condition",
    image_url: "/media/Untitled-1.png",
    category: "Denim",
    date: "2024-01-15",
    is_featured: true,
    x: 0,
    y: 0,
    z: 0,
    rotation: -2,
    scale: 1.1
  },
  {
    id: "2",
    title: "Retro Band Tees",
    description: "Authentic vintage band t-shirts from the 80s",
    image_url: "/media/SWORD.png",
    category: "Tops",
    date: "2024-01-10",
    is_featured: false,
    x: 300,
    y: 0,
    z: 50,
    rotation: 1,
    scale: 0.95
  },
  {
    id: "3",
    title: "Leather Boots Archive",
    description: "Vintage leather boots, barely worn",
    image_url: "/media/Untitled-1.png",
    category: "Footwear",
    date: "2024-01-05",
    is_featured: true,
    x: 600,
    y: 0,
    z: 100,
    rotation: -1,
    scale: 1.05
  },
  {
    id: "4",
    title: "Wool Sweater Collection",
    description: "Hand-knitted wool sweaters from the 70s",
    image_url: "/media/SWORD.png",
    category: "Tops",
    date: "2023-12-20",
    is_featured: false,
    x: 0,
    y: 300,
    z: 25,
    rotation: 2,
    scale: 0.9
  },
  {
    id: "5",
    title: "High-Waisted Jeans",
    description: "Classic 90s high-waisted jeans",
    image_url: "/media/Untitled-1.png",
    category: "Bottoms",
    date: "2023-12-15",
    is_featured: false,
    x: 300,
    y: 300,
    z: 75,
    rotation: -1,
    scale: 1
  },
  {
    id: "6",
    title: "Vintage Bag Collection",
    description: "Authentic leather bags from the 60s",
    image_url: "/media/SWORD.png",
    category: "Accessories",
    date: "2023-12-10",
    is_featured: true,
    x: 600,
    y: 300,
    z: 125,
    rotation: 1,
    scale: 1.15
  },
  {
    id: "7",
    title: "Classic Denim Jacket",
    description: "Timeless denim jacket from the 80s",
    image_url: "/media/Untitled-1.png",
    category: "Denim",
    date: "2023-12-05",
    is_featured: false,
    x: 150,
    y: 150,
    z: 50,
    rotation: 0,
    scale: 0.85
  },
  {
    id: "8",
    title: "Vintage Concert Tee",
    description: "Rare concert t-shirt from 1985",
    image_url: "/media/SWORD.png",
    category: "Tops",
    date: "2023-11-30",
    is_featured: true,
    x: 450,
    y: 150,
    z: 75,
    rotation: -2,
    scale: 1.2
  }
];

export default function Archive() {
  const [posts, setPosts] = useState<ArchivePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ArchivePost | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'focused'>('overview');
  const [floatingPositions, setFloatingPositions] = useState<{ [key: string]: { x: number; y: number; z: number } }>({});
  const [stackedPosts, setStackedPosts] = useState<ArchivePost[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPost, setDraggedPost] = useState<ArchivePost | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const stackAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load posts on component mount
    fetchPosts();
    
    // Initialize floating positions
    const initialPositions: { [key: string]: { x: number; y: number; z: number } } = {};
    mockArchivePosts.forEach(post => {
      initialPositions[post.id] = {
        x: post.x,
        y: post.y,
        z: post.z
      };
    });
    setFloatingPositions(initialPositions);
    
    // Custom cursor setup
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsCursorHovering(true);
    const handleMouseLeave = () => setIsCursorHovering(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Floating animation effect
  useEffect(() => {
    if (!posts.length || Object.keys(floatingPositions).length === 0) return;

    const animateFloating = () => {
      setFloatingPositions(prevPositions => {
        const newPositions = { ...prevPositions };
        const mouseX = cursorPosition.x;
        const mouseY = cursorPosition.y;
        const repulsionRadius = 100; // Distance at which posts start moving away
        const repulsionStrength = 1.2; // How strongly posts are repelled

        posts.forEach(post => {
          const currentPos = newPositions[post.id];
          if (!currentPos) return;

          // Calculate distance from mouse to post
          const dx = mouseX - currentPos.x;
          const dy = mouseY - currentPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If mouse is close enough, repel the post
          if (distance < repulsionRadius && distance > 0) {
            const force = (repulsionRadius - distance) / repulsionRadius * repulsionStrength;
            const repelX = (dx / distance) * force * 5;
            const repelY = (dy / distance) * force * 5;

            // Add some natural floating movement
            const time = Date.now() * 0.001;
            const floatX = Math.sin(time + post.id.charCodeAt(0)) * 0.5;
            const floatY = Math.cos(time + post.id.charCodeAt(0)) * 0.5;

            newPositions[post.id] = {
              x: Math.max(50, Math.min(window.innerWidth - 200, currentPos.x - repelX + floatX)),
              y: Math.max(50, Math.min(window.innerHeight - 200, currentPos.y - repelY + floatY)),
              z: currentPos.z
            };
          } else {
            // Natural floating movement when not being repelled
            const time = Date.now() * 0.001;
            const floatX = Math.sin(time + post.id.charCodeAt(0)) * 0.3;
            const floatY = Math.cos(time + post.id.charCodeAt(0)) * 0.3;

            newPositions[post.id] = {
              x: Math.max(50, Math.min(window.innerWidth - 200, currentPos.x + floatX)),
              y: Math.max(50, Math.min(window.innerHeight - 200, currentPos.y + floatY)),
              z: currentPos.z
            };
          }
        });

        return newPositions;
      });

      animationFrameRef.current = requestAnimationFrame(animateFloating);
    };

    animationFrameRef.current = requestAnimationFrame(animateFloating);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [posts, cursorPosition]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Use mock data for now - Instagram API will be implemented later
      const archivePosts: ArchivePost[] = mockArchivePosts.map((post, index) => ({
        ...post,
        rotation: post.rotation || Math.random() * 4 - 2,
        scale: post.scale || 0.9 + Math.random() * 0.3
      }));
      
      setPosts(archivePosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts(mockArchivePosts);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post: ArchivePost) => {
    setIsZoomed(true);
    setSelectedPost(post);
    setViewMode('focused');

    // Enhanced GSAP zoom animation with 3D effects
    gsap.to(gridRef.current, {
      scale: 1.8,
      duration: 1.5,
      ease: "power4.inOut",
      onComplete: () => {
        showPostModal(post);
      }
    });

    // Animate the clicked post to center
    gsap.to(`#post-${post.id}`, {
      scale: 1.3,
      rotation: 0,
      duration: 1.2,
      ease: "power3.out"
    });
  };

  const showPostModal = (post: ArchivePost) => {
    console.log("Showing post modal for:", post.title);
  };

  const handleBackToGrid = () => {
    setIsZoomed(false);
    setSelectedPost(null);
    setViewMode('overview');

    // Enhanced GSAP zoom out animation
    gsap.to(gridRef.current, {
      scale: 1,
      duration: 1.2,
      ease: "power4.inOut"
    });

    // Reset all posts
    posts.forEach(post => {
      gsap.to(`#post-${post.id}`, {
        scale: post.scale || 1,
        rotation: post.rotation || 0,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  };

  const handleDragStart = (post: ArchivePost) => {
    setIsDragging(true);
    setDraggedPost(post);
    setIsCursorHovering(false);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const draggedPostData = draggedPost;
    setDraggedPost(null);
    
    if (!draggedPostData) return;
    
    // Check if dropped in stack area
    if (stackAreaRef.current) {
      const stackRect = stackAreaRef.current.getBoundingClientRect();
      const dropX = info.point.x;
      const dropY = info.point.y;
      
      if (dropY > stackRect.top && dropX > stackRect.left && dropX < stackRect.right) {
        // Add to stack
        setStackedPosts(prev => [...prev, draggedPostData]);
        // Remove from floating posts
        setPosts(prev => prev.filter(p => p.id !== draggedPostData.id));
        // Remove from floating positions
        setFloatingPositions(prev => {
          const newPos = { ...prev };
          delete newPos[draggedPostData.id];
          return newPos;
        });
      }
    }
  };

  const removeFromStack = (postId: string) => {
    const post = stackedPosts.find(p => p.id === postId);
    if (post) {
      setStackedPosts(prev => prev.filter(p => p.id !== postId));
      setPosts(prev => [...prev, post]);
      // Add back to floating positions
      setFloatingPositions(prev => ({
        ...prev,
        [post.id]: {
          x: Math.random() * (window.innerWidth - 200) + 100,
          y: Math.random() * (window.innerHeight - 300) + 100,
          z: Math.floor(Math.random() * 10)
        }
      }));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Denim': 'bg-blue-500',
      'Tops': 'bg-red-500',
      'Footwear': 'bg-green-500',
      'Accessories': 'bg-purple-500',
      'Vintage': 'bg-yellow-500',
      'General': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isCursorHovering ? 'hover' : ''}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`
        }}
      />

      {/* Universal Header */}
      <UniversalHeader 
        title="Archive" 
        showBackButton={true}
        showHamburger={true}
      />

      {/* 3D Chalkboard Grid Container */}
      <div className="relative w-full h-screen perspective-1000">
        {/* Chalkboard Background with Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-95">
          {/* Chalkboard texture overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div 
              className="text-white text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Loading archive posts...
            </motion.div>
          </div>
        )}
        
        {/* 3D Grid Container */}
        <div
          ref={gridRef}
          className="relative w-full h-full p-8 transition-all duration-1000 transform-style-preserve-3d"
          style={{ perspective: '1000px' }}
        >
          <div className="relative w-full h-full transform-style-preserve-3d">
            {posts.map((post, index) => {
              const floatingPos = floatingPositions[post.id];
              if (!floatingPos) return null;
              
              return (
                <motion.div
                  key={post.id}
                  id={`post-${post.id}`}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, // Full scale for Instagram posts
                    y: 0,
                    rotateY: post.rotation || 0
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute post-brick group cursor-pointer transform-style-preserve-3d"
                  style={{
                    left: `${floatingPos.x}px`,
                    top: `${floatingPos.y}px`,
                    zIndex: floatingPos.z,
                    transform: `rotateY(${post.rotation || 0}deg) scale(1)`,
                    transition: 'left 0.1s ease-out, top 0.1s ease-out'
                  }}
                  onMouseEnter={() => setIsCursorHovering(true)}
                  onMouseLeave={() => setIsCursorHovering(false)}
                  onClick={() => handlePostClick(post)}
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 0,
                    transition: { duration: 0.3 }
                  }}
                >
                                  <motion.div 
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl border border-gray-200 w-32 h-40 cursor-grab active:cursor-grabbing"
                  drag
                  dragMomentum={false}
                  onDragStart={() => handleDragStart(post)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ 
                    scale: 1.2,
                    zIndex: 1000,
                    rotate: 5
                  }}
                >
                  {/* Instagram-style header */}
                  <div className="flex items-center justify-between px-2 py-1 bg-white border-b border-gray-100">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="text-xs font-semibold text-gray-900">chambered_inseams</span>
                    </div>
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                  
                  {/* Instagram-style image */}
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {post.is_featured && (
                      <motion.div 
                        className="absolute top-1 right-1 bg-red-500 text-white px-1 py-0.5 text-xs font-bold rounded"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        🔥
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Instagram-style actions */}
                  <div className="px-2 py-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    
                    {/* Instagram-style caption */}
                    <div className="text-xs text-gray-900 mb-1">
                      <span className="font-semibold">chambered_inseams</span> {post.title}
                    </div>
                    
                    {/* Instagram-style likes */}
                    <div className="text-xs text-gray-500 mb-1">
                      Liked by <span className="font-semibold">vintage_lover</span> and <span className="font-semibold">others</span>
                    </div>
                    
                    {/* Instagram-style timestamp */}
                    <div className="text-xs text-gray-400">
                      {post.date}
                                         </div>
                   </div>
                 </motion.div>
               </motion.div>
             );
           })}
          </div>
        </div>

        {/* Tetris-style Stack Area */}
        <div 
          ref={stackAreaRef}
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-40"
        >
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="text-white text-xs mb-2 text-center">📚 Stack Posts Here</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {stackedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  <div className="w-24 h-30 bg-white rounded shadow-lg overflow-hidden">
                    <div className="h-16 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-1">
                      <div className="text-xs font-semibold text-gray-900 truncate">
                        {post.title}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromStack(post.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="absolute bottom-40 right-6 z-50">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={() => setViewMode(viewMode === 'overview' ? 'focused' : 'overview')}
            className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors border border-white/20"
          >
            {viewMode === 'overview' ? '🔍 Focus View' : '📋 Overview'}
          </motion.button>
        </div>

        {/* Zoom Controls */}
        {isZoomed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackToGrid}
            className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg z-50 hover:bg-black/90 transition-colors border border-white/20"
          >
            ← Back to Grid
          </motion.button>
        )}
      </div>

      {/* Enhanced Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="w-full h-80 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{selectedPost.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className={`text-white px-4 py-2 rounded-full font-medium ${getCategoryColor(selectedPost.category)}`}>
                    {selectedPost.category}
                  </span>
                  <span className="text-gray-500 font-mono">{selectedPost.date}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        .custom-cursor {
          width: 20px;
          height: 20px;
          background: white;
          border: 2px solid #ccc;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          mix-blend-mode: difference;
          transition: transform 0.2s ease;
          z-index: 9999;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }

        .custom-cursor.hover {
          transform: scale(2.5);
          background: #fff;
          border-color: #fff;
          box-shadow: 0 0 20px rgba(255,255,255,0.5);
        }

        .post-brick {
          position: relative;
          transform-style: preserve-3d;
        }

        .post-brick::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 8px;
        }

        .post-brick:hover::before {
          opacity: 1;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
} 