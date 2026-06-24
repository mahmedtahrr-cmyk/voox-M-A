import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { 
  motion, 
  useAnimation, 
  AnimatePresence 
} from 'motion/react';
import { 
  ShoppingBag, 
  Cpu, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Eye 
} from 'lucide-react';

interface HeroShowcase3DProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const HeroShowcase3D: React.FC<HeroShowcase3DProps> = ({ products, onSelectProduct }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);

  // If products are loaded, we duplicate them to create a seamless infinite marquee loop!
  const hasProducts = products && products.length > 0;
  const displayProducts = hasProducts ? [...products, ...products, ...products] : [];

  // Marquee scroll loop
  useEffect(() => {
    if (!isAutoPlaying || !hasProducts || hoveredIndex !== null) return;
    
    let animationFrameId: number;
    const speed = 1.35; // Pixels per frame drift (increased from 0.55 for faster display movement)
    
    const updateScroll = () => {
      if (!scrollRef.current) return;
      
      const maxScroll = scrollRef.current.scrollWidth / 3;
      setScrollX((prev) => {
        const next = prev + speed;
        return next >= maxScroll ? 0 : next;
      });
      
      animationFrameId = requestAnimationFrame(updateScroll);
    };
    
    animationFrameId = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoPlaying, hasProducts, hoveredIndex]);

  // Handle manual navigation
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setScrollX((prev) => Math.max(0, prev - 240));
    // Re-engage autoplay after a delay
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    if (scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth / 3;
      setScrollX((prev) => (prev + 240 >= maxScroll ? 0 : prev + 240));
    }
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  if (!hasProducts) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/40 border border-zinc-900 rounded-2xl p-8">
        <div className="text-center space-y-3">
          <Cpu className="w-8 h-8 text-red-650 animate-spin mx-auto opacity-70" />
          <p className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">
            CONNECTING_VIRTUAL_CLOTHES_RACK...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative flex flex-col justify-between overflow-hidden select-none py-4"
    >
      {/* 1. Cyberwear Overhead Steel Support Rod (The clothing conveyor rail) */}
      <div className="absolute top-12 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-red-950 to-transparent flex justify-center items-center z-10">
        {/* Neon laser guiding line underneath the rod */}
        <div className="absolute top-0 bottom-0 left-1/4 right-1/4 bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.95)] h-[1px]" />
        
        {/* Support brackets */}
        <div className="absolute left-10 w-2 h-6 bg-zinc-950 border-r border-red-900/60 top-0" />
        <div className="absolute right-10 w-2 h-6 bg-zinc-950 border-l border-red-900/60 top-0" />
        
        <div className="absolute px-4 py-0.5 bg-black/90 border border-red-950 text-[7px] font-mono text-red-500 rounded-md tracking-[0.25em] -top-3 uppercase">
          AUTOMATED_CLOTHES_CONVEY_BELT_V2
        </div>
      </div>

      {/* Grid pattern backdrop styled around products */}
      <div className="absolute inset-x-0 top-12 bottom-0 bg-[linear-gradient(rgba(255,17,17,0.012)_1px,transparent_1px)] bg-[size:100%_18px] pointer-events-none" />

      {/* 2. Scrollable Runway Conveyor Section */}
      <div className="flex-1 flex items-center relative overflow-hidden mt-6">
        
        {/* Soft fading left & right shadow vignettes for seamless aesthetic edge integration */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        <div 
          ref={scrollRef}
          className="flex gap-8 items-center h-full py-6 pr-8 cursor-grab active:cursor-grabbing"
          style={{ transform: `translateX(-${scrollX}px)` }}
        >
          {displayProducts.map((product, idx) => {
            const isHovered = hoveredIndex === idx;
            const primaryImage = product.product_images?.[0]?.image_url || '/placeholder.png';
            
            return (
              <motion.div
                key={`${product.id}-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: 8 }}
                onClick={() => onSelectProduct && onSelectProduct(product)}
                className="flex-shrink-0 w-60 relative flex flex-col items-center group cursor-pointer"
              >
                
                {/* A. CUSTOM NEON RED CLOTHES HANGER (علاقة ملابس حمراء مضيئة) */}
                <div className="relative w-full flex flex-col items-center">
                  
                  {/* Hanger Hook spinning/hanging on the overhead steel bar */}
                  <svg 
                    width="48" 
                    height="44" 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-all duration-300 ${
                      isHovered ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-red-900/60'
                    }`}
                  >
                    {/* Hook Loop */}
                    <path 
                      d="M50,45 C42,40 38,25 50,15 C62,5 72,18 64,30 C60,36 55,38 52,44" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                    {/* Floating Connection Neck */}
                    <line x1="50" y1="42" x2="50" y2="60" stroke="currentColor" strokeWidth="4" />
                    {/* Curved wire-frame hanger shoulders */}
                    <path 
                      d="M6,76 L40,60 L50,56 L60,60 L94,76 C95,76 96,78 95,80 C93,82 6,80 6,76" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinejoin="round" 
                      fill="none"
                    />
                  </svg>

                  {/* Gentle tension line connecting hanger to product frame */}
                  <div className={`w-[1px] h-3 bg-red-900/60 transition-all ${
                    isHovered ? 'bg-red-500 h-4' : ''
                  }`} />
                </div>

                {/* B. HIGH TECH DOUBLE CYBER NEON-RED FRAME (إطار ملابس أحمر) */}
                <div 
                  className={`w-full bg-zinc-950/90 border rounded-xl p-3.5 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden ${
                    isHovered 
                      ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] bg-black scale-105' 
                      : 'border-red-950/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Top telemetry brackets */}
                  <div className="flex justify-between items-center font-mono text-[7px] text-zinc-650 tracking-widest border-b border-zinc-900/80 pb-1.5 uppercase">
                    <span>VX_RACK_POS_{idx % products.length + 1}</span>
                    <span className={isHovered ? 'text-red-500 animate-pulse' : 'text-zinc-650'}>
                      LIVE_STREAM
                    </span>
                  </div>

                  {/* Corner accent bracket markers for cyber streetwear style */}
                  <div className="absolute top-2 left-2 w-1 h-1 border-t border-l border-red-500/50" />
                  <div className="absolute top-2 right-2 w-1 h-1 border-t border-r border-red-500/50" />
                  <div className="absolute bottom-2 left-2 w-1 h-1 border-b border-l border-red-500/50" />
                  <div className="absolute bottom-2 right-2 w-1 h-1 border-b border-r border-red-500/50" />

                  {/* Clothing Image Container inside red glowing frame */}
                  <div className="w-full h-40 bg-gradient-to-b from-zinc-900/30 to-black/40 rounded-lg flex items-center justify-center relative p-3 overflow-hidden">
                    {/* Embedded micro red scanlines inside frame */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.035)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                    
                    {/* Glowing light behind apparel */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-[40px] bg-red-600/5 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100 bg-red-600/15' : 'opacity-40'
                    }`} />

                    <img 
                      src={primaryImage} 
                      alt={product.title}
                      className={`max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-all duration-500 ${
                        isHovered ? 'scale-110 -rotate-2' : 'scale-100'
                      }`}
                      referrerPolicy="no-referrer"
                    />

                    {/* Quick indicator when hovered */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 py-0.5 px-2 bg-black/90 border border-red-950 rounded text-[7px] tracking-widest font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 uppercase">
                      <Eye className="w-2.5 h-2.5 text-red-500" />
                      ACQUIRE_PIECE
                    </div>
                  </div>

                  {/* Apparel Metadata details */}
                  <div className="space-y-1 text-center">
                    <h4 className="font-sans font-black text-[11px] tracking-wider text-zinc-100 group-hover:text-red-500 transition-colors duration-200 uppercase truncate">
                      {product.title}
                    </h4>
                    <div className="flex justify-between items-center px-1 font-mono text-[8px] tracking-wider text-zinc-500 mt-1 uppercase">
                      <span>SIZE {product.product_sizes?.[0]?.size || 'M'}</span>
                      <span className="text-red-500 font-bold">EGP {product.price.toLocaleString()}</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. Lower Control Interface Overlay on central rack panel */}
      <div className="relative z-20 flex items-center justify-between px-6 py-2 border-t border-zinc-950/60 bg-black/10 mt-2">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-mono text-[8px] text-zinc-500 tracking-[0.2em] uppercase">
            ACTIVE_PRODUCTS: {products.length}_PIECES_CONVEYED
          </span>
        </div>

        {/* Navigation controllers */}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="w-7 h-7 flex items-center justify-center rounded bg-black border border-zinc-900 hover:border-red-650/40 text-zinc-500 hover:text-white transition-all cursor-pointer"
            title="Slide Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3.5 h-7 rounded text-[8px] font-mono tracking-widest border transition-all cursor-pointer ${
              isAutoPlaying 
                ? 'bg-red-950/25 border-red-900/45 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.1)]' 
                : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-white'
            }`}
          >
            {isAutoPlaying ? 'PAUSE_CONVEYOR' : 'DRIFT_CONVEYOR'}
          </button>

          <button
            onClick={handleNext}
            className="w-7 h-7 flex items-center justify-center rounded bg-black border border-zinc-900 hover:border-red-650/40 text-zinc-500 hover:text-white transition-all cursor-pointer"
            title="Slide Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
