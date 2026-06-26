import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SpaceBackground3D } from './components/3d/SpaceBackground3D';
import { HeroShowcase3D } from './components/3d/HeroShowcase3D';
import { TailorsTapeRed, DesignBlueprintRed } from './components/design/TailorsTapeAndBlueprint';
import { GarmentBackdropPattern } from './components/design/GarmentBackdropPattern';
import { Header } from './components/ui/Header';
import { ProductCard } from './components/ui/ProductCard';
import { QuickViewModal } from './components/ui/QuickViewModal';
import { CartDrawer } from './components/ui/CartDrawer';
import { AuthModal } from './components/ui/AuthModal';
import { AdminDashboard } from './components/ui/AdminDashboard';
import { CheckoutView } from './components/ui/CheckoutView';
import { AboutModal } from './components/ui/AboutModal';
import { CollectionsModal } from './components/ui/CollectionsModal';
import { ProfileModal } from './components/ui/ProfileModal';
import { AIStylist } from './components/ui/AIStylist';
import { fetchProducts, fetchCategories, getLocalStorageDB } from './services/db';
import { Product, Category } from './types';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Sparkles,
  Info,
  Sun,
  Moon
} from 'lucide-react';

function MainAppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Showcase overlay triggers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Dynamic visual states
  const [loading, setLoading] = useState(true);
  const [initialLaunchLoader, setInitialLaunchLoader] = useState(false);
  const [loaderPercent, setLoaderPercent] = useState(0);
  const [loaderLog, setLoaderLog] = useState('BOOT_SEQUENCE: INITIALIZING...');

  const shopGridRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Dynamic counting animation for the Intro Loader (Disabled by default, but kept for logic safety)
  useEffect(() => {
    if (!initialLaunchLoader) return;
    let timer: NodeJS.Timeout;
    const logs = [
      'VERIFYING_CYBER_ENCRYPTION_SHELLS...',
      'CONNECTING_SUPABASE_GATEWAY...',
      'LOADING_VIRTUAL_SHOWCASE_MESHES...',
      'SYNCHRONIZING_STOCK_LEDGERS...',
      'VOOX_UX_LOADED: READY_PORTAL'
    ];

    const interval = setInterval(() => {
      setLoaderPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setInitialLaunchLoader(false);
          }, 450);
          return 100;
        }
        
        // Push descriptive logs corresponding to loading depth
        const logIdx = Math.min(Math.floor(prev / 20), logs.length - 1);
        setLoaderLog(logs[logIdx]);
        
        return prev + Math.floor(Math.random() * 8 + 4);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [initialLaunchLoader]);

  // Fetch items from our hybrid store
  const loadStorefrontData = async () => {
    // 1. Optimistic instant UI from cache
    const localStore = getLocalStorageDB();
    setProducts(localStore.products);
    setCategories(localStore.categories);
    setFilteredProducts(localStore.products);
    setLoading(false); // Stop loading visually right away!

    // 2. Background sync
    try {
      const prods = await fetchProducts();
      const cats = await fetchCategories();
      setProducts(prods);
      setCategories(cats);
      
      // Update filter if we are on 'all'
      if (selectedCategory === 'all') {
        setFilteredProducts(prods);
      } else {
        setFilteredProducts(prods.filter(p => p.category_id === selectedCategory));
      }
    } catch (e) {
      console.warn('Error syncing storefront tables in background:', e);
    }
  };

  useEffect(() => {
    // Load database and products immediately on entrance
    loadStorefrontData();
  }, []);

  // Execute filtering selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowDashboard(false);
    setShowCheckout(false);

    if (categoryId === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category_id === categoryId));
    }
  };

  // Smooth cinematic scroll down to our storefront
  const handleScrollToShop = () => {
    setShowDashboard(false);
    setShowCheckout(false);
    setSelectedCategory('all');
    setFilteredProducts(products);
    
    setTimeout(() => {
      shopGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleOrderCompleted = () => {
    setShowCheckout(false);
    setSelectedCategory('all');
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between selection:bg-red-600 selection:text-white antialiased font-sans transition-colors duration-300 ${
      isDark ? 'text-white bg-black' : 'text-gray-900 bg-white'
    }`}>
      
      {/* 3D background of slowly descending red cosmic ash */}
      {isDark && <SpaceBackground3D />}

      {/* Repeating apparel drafting blueprints, sewing outlines & rulers in red background */}
      {isDark && <GarmentBackdropPattern />}

      {/* AI Stylist — floating fashion assistant */}
      <AIStylist />

      {/* 1. INITIAL CINEMATIC INTRO LOADER OVERLAY */}
      <AnimatePresence>
        {initialLaunchLoader && (
          <motion.div
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col justify-between p-12 select-none"
          >
            {/* Header Telemetric details */}
            <div className="flex justify-between items-start font-mono text-[9px] text-zinc-600 tracking-widest leading-loose uppercase">
              <div>
                <p>CORE SYSTEM VER: 20.26_VOOX</p>
                <p>REST ENCRYPTION: ACTIVE</p>
              </div>
              <div className="text-right">
                <p>SECURE LOCATION: CLOUD_RUN CONTAINER</p>
                <p>HOSTING_PORT_INGRESS: 3000</p>
              </div>
            </div>

            {/* Central massive percent loader */}
            <div className="my-auto space-y-6">
              <div className="space-y-2">
                <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[0.35em] text-center text-white">
                  VOO<span className="text-red-650">X</span>
                </h2>
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-zinc-500 text-center">
                  PREMIUM FUTURE STREETWEAR ARCHIVE
                </p>
              </div>

              {/* Glowing progress slider */}
              <div className="max-w-xs mx-auto space-y-3">
                <div className="h-0.5 w-full bg-zinc-950 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loaderPercent}%` }}
                    className="absolute h-full bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                  />
                </div>

                <div className="flex justify-between font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
                  <span className="animate-pulse">{loaderLog}</span>
                  <span className="text-red-500 font-bold">{loaderPercent}%</span>
                </div>
              </div>
            </div>

            {/* Bottom Credits */}
            <div className="font-mono text-[8px] text-zinc-700 text-center tracking-widest leading-loose uppercase">
              <p>DESIGNED & BUILT AS AN AWWWARDS SHOWCASE PORTFOLIO EXPERIENCE</p>
              <p>© 2026 VOOX LABS. ALL RECONSTRUCTIONS INTEGRATED.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN HEADER PANELS */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => {
          setShowDashboard(!showDashboard);
          setShowCheckout(false);
        }}
        onOpenShop={handleScrollToShop}
        onOpenHome={() => {
          setShowDashboard(false);
          setShowCheckout(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenCollections={() => setIsCollectionsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        showDashboard={showDashboard}
      />

      {/* 3. DYNAMIC BODY PORTALS */}
      <AnimatePresence mode="wait">
        
        {/* VIEW A: ADMIN DASHBOARD CONTROL PANEL */}
        {showDashboard && isAdmin ? (
          <motion.div
            key="admin-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6 }}
          >
            <AdminDashboard onProductUpdated={loadStorefrontData} />
          </motion.div>
        ) : 

        /* VIEW B: HIGH SECURITY CHECKOUT PANEL */
        showCheckout ? (
          <motion.div
            key="checkout-page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6 }}
          >
            <CheckoutView 
              onOrderCompleted={handleOrderCompleted}
              onGoHome={() => setShowCheckout(false)}
            />
          </motion.div>
        ) : 

        /* VIEW C: CINEMATIC SHOWROOM CORE EXPERIENCE (HOME + SHOP) */
        (
          <motion.div
            key="main-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            {/* HERO MODULE SECTION - Interactive 3D Orbiters */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden select-none">
              {/* Outer Tailor's Red Measuring Tapes (متر احمر خياط في الخلفية) */}
              <TailorsTapeRed position="left" speed="slow" />
              <TailorsTapeRed position="diagonal" speed="medium" />
              <TailorsTapeRed position="right" speed="slow" />

              <div className="max-w-7xl mx-auto px-12 md:px-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Left Side: Headline & Typographical Core */}
                <div className="space-y-6 text-center lg:text-left relative">
                  {/* Glowing Technical Draft Designs behind text (تصاميم حمراء عند الكلام) */}
                  <DesignBlueprintRed />

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className={`font-mono text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2 justify-center lg:justify-start ${
                      isDark ? 'text-[#c4a35a]' : 'text-[#a03232]'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 7h7l-5 4 2 7-6-4-6 4 2-7-5-4h7z"/></svg>
                    NEW_DROP: COLLATERAL_SERIES
                  </motion.div>

                  <div className="space-y-2">
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={`font-serif font-bold text-5xl sm:text-7xl tracking-tight leading-[0.9] ${
                        isDark ? 'text-[#f0ece6]' : 'text-[#2d2824]'
                      }`}
                    >
                      FEARLESS
                    </motion.h1>
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={`font-serif font-bold text-5xl sm:text-7xl tracking-widest leading-[0.9] outline-text ${
                        isDark ? '' : ''
                      }`}
                    >
                      M&A VOOX
                    </motion.h1>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className={`max-w-md mx-auto lg:mx-0 text-xs sm:text-sm font-sans leading-relaxed ${
                      isDark ? 'text-[#a39b93]' : 'text-[#8a8078]'
                    }`}
                  >
                    Premium technical streetwear crafted of heavy carbon composite fleece, waterproof shells, and high-spec structural details for those who don't follow trends, they create them.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="pt-4"
                  >
                    <button
                      onClick={handleScrollToShop}
                      className={`h-12 px-8 text-xs font-mono font-bold tracking-widest text-white rounded-xl transition-all flex items-center gap-3.5 mx-auto lg:mx-0 cursor-pointer ${
                        isDark
                          ? 'bg-[#c4a35a] hover:bg-[#d4b36a]'
                          : 'bg-[#a03232] hover:bg-[#8a2828]'
                      }`}
                      style={{ boxShadow: isDark ? '0 4px 20px rgba(196,163,90,0.3)' : '0 4px 20px rgba(160,50,50,0.25)' }}
                    >
                      EXPLORE SHOWROOM
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </motion.div>
                </div>

                {/* Right Side: Center glowing Threejs portal */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex justify-center items-center relative w-full h-[360px] sm:h-[480px]"
                >
                  {/* Outer subtle white fog neon glow backdrop */}
                  <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/5 blur-[90px] pointer-events-none select-none z-[-1]" />
                  <HeroShowcase3D 
                    products={products} 
                    onSelectProduct={(p) => setSelectedProduct(p)} 
                  />
                </motion.div>

              </div>

              {/* Bottom scroll-indicator line */}
              <div 
                onClick={handleScrollToShop}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity hidden sm:flex"
              >
                <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">
                  SCROLL_DOWN
                </span>
                <div className="h-10 w-[1px] bg-zinc-800 relative overflow-hidden">
                  <div className="absolute bg-white w-full h-1/2 top-0 left-0 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </section>

            {/* SECTOR 2: ACTIVE street product CATALOG GRID with Crimson Highlights */}
            <section 
              id="showroom-catalog" 
              ref={shopGridRef} 
              className="max-w-7xl mx-auto px-6 py-20 space-y-12 select-none"
            >
              
              {/* Category selector & Filter bar with rich red-lined framing */}
              <div className={`relative flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 pt-6 px-6 bg-gradient-to-r border rounded-2xl overflow-hidden transition-colors duration-300 ${
                isDark 
                  ? 'from-zinc-900/40 via-black/15 to-transparent border-zinc-900' 
                  : 'from-gray-100 via-white/50 to-transparent border-gray-200'
              }`}>
                {/* Embedded laser lines inside shop header panel */}
                <div className="absolute top-0 right-0 w-24 h-[1px] bg-zinc-700" />
                <div className="absolute top-0 right-0 w-[1px] h-12 bg-zinc-700" />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-1.5 w-1.5 rounded-full animate-pulse transition-colors duration-300 ${
                      isDark ? 'bg-[#c4a35a]' : 'bg-[#a03232]'
                    }`} />
                    <h2 className={`font-sans text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 ${
                      isDark ? 'text-[#c4a35a]' : 'text-[#a03232]'
                    }`}>
                      VOOX COLLECTION
                    </h2>
                  </div>
                  <h3 className={`font-serif font-bold text-3xl lg:text-4xl tracking-wide transition-colors duration-300 ${
                    isDark ? 'text-[#f0ece6]' : 'text-[#2d2824]'
                  }`}>
                    أزياء تعكس شخصيتك
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2.5 font-sans text-[11px] relative z-10">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`px-5 h-9 rounded-full border tracking-widest transition-all cursor-pointer font-medium ${
                      selectedCategory === 'all'
                        ? isDark
                          ? 'bg-[#c4a35a] border-[#c4a35a] text-[#1c1814] font-bold'
                          : 'bg-[#a03232] border-[#a03232] text-white font-bold'
                        : isDark
                          ? 'border-[#3a342e] text-[#a39b93] hover:border-[#c4a35a] hover:text-[#c4a35a]'
                          : 'border-[#e8ddd3] text-[#8a8078] hover:border-[#a03232] hover:text-[#a03232]'
                    }`}
                  >
                    ALL
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`px-5 h-9 rounded-full border tracking-widest transition-all cursor-pointer font-medium ${
                        selectedCategory === cat.id
                          ? isDark
                            ? 'bg-[#c4a35a] border-[#c4a35a] text-[#1c1814] font-bold'
                            : 'bg-[#a03232] border-[#a03232] text-white font-bold'
                          : isDark
                            ? 'border-[#3a342e] text-[#a39b93] hover:border-[#c4a35a] hover:text-[#c4a35a]'
                            : 'border-[#e8ddd3] text-[#8a8078] hover:border-[#a03232] hover:text-[#a03232]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic GRID container */}
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-5 h-5 text-red-500 animate-spin" />
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    QUERYING_CYBER_MAPPING_DATABASES...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.length === 0 ? (
                    <div className={`col-span-full py-16 text-center uppercase font-mono text-xs tracking-wider border border-dashed rounded-xl transition-colors duration-300 ${
                      isDark ? 'text-zinc-650 border-zinc-900' : 'text-gray-400 border-gray-200'
                    }`}>
                      No active drops registered under this coordinate segment.
                    </div>
                  ) : (
                    filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onQuickView={(p) => setSelectedProduct(p)}
                      />
                    ))
                  )}
                </div>
              )}

            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. BENEFITS BAR */}
      <section className={`border-t border-b py-8 relative z-10 transition-colors duration-300 ${
        isDark
          ? 'bg-[#24201c]/50 border-[#3a342e]'
          : 'bg-[#f5efe8] border-[#e8ddd3]'
      }`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex gap-4 items-center">
            <div className={`p-2.5 rounded-lg ${
              isDark ? 'bg-[#c4a35a]/10 border border-[#c4a35a]/20 text-[#c4a35a]' : 'bg-[#a03232]/10 border border-[#a03232]/20 text-[#a03232]'
            }`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M12 2l2 7h7l-5 4 2 7-6-4-6 4 2-7-5-4h7z"/></svg>
            </div>
            <div>
              <h5 className={`font-sans font-semibold text-xs tracking-wider transition-colors duration-300 ${isDark ? 'text-[#f0ece6]' : 'text-[#2d2824]'}`}>PREMIUM QUALITY</h5>
              <p className={`font-sans text-[10px] tracking-wider ${isDark ? 'text-[#6b635b]' : 'text-[#8a8078]'}`}>BUILT TO LAST FOREVER.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className={`p-2.5 rounded-lg ${
              isDark ? 'bg-[#c4a35a]/10 border border-[#c4a35a]/20 text-[#c4a35a]' : 'bg-[#a03232]/10 border border-[#a03232]/20 text-[#a03232]'
            }`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div>
              <h5 className={`font-sans font-semibold text-xs tracking-wider transition-colors duration-300 ${isDark ? 'text-[#f0ece6]' : 'text-[#2d2824]'}`}>FAST FREIGHT</h5>
              <p className={`font-sans text-[10px] tracking-wider ${isDark ? 'text-[#6b635b]' : 'text-[#8a8078]'}`}>2-5 BUSINESS DAYS DELIVERY.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className={`p-2.5 rounded-lg ${
              isDark ? 'bg-[#c4a35a]/10 border border-[#c4a35a]/20 text-[#c4a35a]' : 'bg-[#a03232]/10 border border-[#a03232]/20 text-[#a03232]'
            }`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h5 className={`font-sans font-semibold text-xs tracking-wider transition-colors duration-300 ${isDark ? 'text-[#f0ece6]' : 'text-[#2d2824]'}`}>SATISFACTION</h5>
              <p className={`font-sans text-[10px] tracking-wider ${isDark ? 'text-[#6b635b]' : 'text-[#8a8078]'}`}>14 DAYS RISK FREE RETURNS.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className={`p-2.5 rounded-lg ${
              isDark ? 'bg-[#c4a35a]/10 border border-[#c4a35a]/20 text-[#c4a35a]' : 'bg-[#a03232]/10 border border-[#a03232]/20 text-[#a03232]'
            }`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <h5 className={`font-sans font-semibold text-xs tracking-wider transition-colors duration-300 ${isDark ? 'text-[#f0ece6]' : 'text-[#2d2824]'}`}>SECURE CHECKOUT</h5>
              <p className={`font-sans text-[10px] tracking-wider ${isDark ? 'text-[#6b635b]' : 'text-[#8a8078]'}`}>100% PROTECTED DATA.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className={`py-10 border-t select-none relative z-10 transition-colors duration-300 ${
        isDark ? 'bg-[#14110e] border-[#3a342e]' : 'bg-[#2d2824] border-[#3a342e]'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="font-sans text-[10px] tracking-wider text-[#8a8078]">
            <span className="text-[#c4a35a] font-semibold">VOOX</span> — Premium futuristic streetwear archive.
          </div>
          <div className="font-sans text-[10px] tracking-wider text-[#6b635b]">
            © 2026 VOOX CLOTHING SERIES. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* OVERLAY MODULES */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onCheckout={() => setShowCheckout(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <CollectionsModal
        isOpen={isCollectionsOpen}
        onClose={() => setIsCollectionsOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          handleCategorySelect(catId);
          setTimeout(() => {
            shopGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onGoToShop={handleScrollToShop}
      />



    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
