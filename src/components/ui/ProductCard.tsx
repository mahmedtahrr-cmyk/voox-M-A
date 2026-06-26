import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard3DOverlay } from '../3d/ProductCard3DOverlay';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Fallback to beautiful neon wireframe icon if no images exist
  const primaryImage = product.product_images?.[0]?.image_url || '/placeholder.png';
  const sizeTags = product.product_sizes?.map(s => s.size) || ['M', 'L', 'XL'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (xc - x) / 10; // Max rotation 10deg
    const dy = (y - yc) / 10;
    setTilt({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Quick Add defaults to the first available size in stock
    const firstSize = product.product_sizes?.[0]?.size || 'M';
    addToCart(product, firstSize, 1);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-500 pointer-events-auto group cursor-pointer select-none ${
        isDark
          ? 'bg-[#24201c] border-[#3a342e]'
          : 'bg-white border-[#e8ddd3]'
      } ${
        hovered 
          ? isDark
            ? 'border-[#c4a35a] shadow-[0_0_30px_rgba(196,163,90,0.08)]'
            : 'border-[#c4a35a] shadow-[0_8px_30px_rgba(160,50,50,0.08)]'
          : `shadow-sm ${isDark ? 'shadow-black/20' : 'shadow-[#8a8078]/10'}`
      }`}
      onClick={() => onQuickView(product)}
    >
      {/* Top badges: Stock indicator & Brand symbol */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        {product.stock < 5 ? (
          <span className="px-2.5 py-0.5 bg-[#a03232]/10 border border-[#a03232]/30 text-[8px] font-sans font-semibold tracking-widest text-[#a03232] rounded-full">
            LIMITED
          </span>
        ) : (
          <span className={`px-2.5 py-0.5 border text-[8px] font-sans tracking-widest rounded-full transition-colors duration-300 ${
            isDark
              ? 'border-[#3a342e] text-[#8a8078] bg-[#2a2622]'
              : 'border-[#e8ddd3] text-[#8a8078] bg-[#faf6f1]'
          }`}>
            VX CORE
          </span>
        )}
      </div>

      <div className="absolute top-6 right-6 z-10 font-mono text-[9px] text-zinc-600 tracking-wider">
        {product.sku || 'VX-00'}
      </div>

      {/* Main image container */}
      <div className={`w-full h-80 flex items-center justify-center p-4 relative overflow-hidden rounded-xl border-2 transition-all duration-500 ${
        isDark
          ? 'bg-[#1c1814] border-[#3a342e] group-hover:border-[#c4a35a]/50'
          : 'bg-[#faf6f1] border-[#e8ddd3] group-hover:border-[#c4a35a]'
      }`}>
        {/* Real-time 3D Hologram Background system */}
        <ProductCard3DOverlay isHovered={hovered} />

        {/* Absolute white fog spot light behind product on hover */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[70px] bg-white/5 transition-opacity duration-500 mix-blend-screen pointer-events-none ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`} />

        <img
          src={primaryImage}
          alt={product.title}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:-translate-y-2 pointer-events-none relative z-10"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic HUD details on card image overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex gap-1">
            {sizeTags.map((size) => (
              <span key={size} className={`w-6 h-6 flex items-center justify-center text-[9px] border font-sans rounded-lg font-medium transition-colors duration-300 ${
                isDark
                  ? 'bg-[#24201c] border-[#3a342e] text-[#a39b93]'
                  : 'bg-[#faf6f1] border-[#e8ddd3] text-[#8a8078]'
              }`}>
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Details footer */}
      <div className="mt-4 pt-1 flex flex-col gap-2 relative">
        <div className="flex items-start justify-between gap-1">
          <div>
            <h3 className={`font-sans font-semibold text-sm tracking-wide transition-colors duration-300 ${
              isDark ? 'text-[#f0ece6] group-hover:text-[#c4a35a]' : 'text-[#2d2824] group-hover:text-[#a03232]'
            }`}>
              {product.title}
            </h3>
            <p className="font-sans text-[9px] text-[#b5aba3] tracking-wider uppercase mt-1">
              VOOX COLLECTION
            </p>
          </div>
          <div className="text-right">
            <p className={`font-sans text-sm font-bold tracking-wide transition-colors duration-300 ${
              isDark ? 'text-[#c4a35a]' : 'text-[#a03232]'
            }`}>
              EGP {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Hover quick add / interactive utility section */}
        <div className="flex gap-2.5 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 border text-[10px] font-sans font-medium tracking-widest rounded-xl transition-all ${
              isDark
                ? 'bg-[#24201c] hover:bg-[#2a2622] border-[#3a342e] text-[#a39b93] hover:text-[#f0ece6] hover:border-[#c4a35a]'
                : 'bg-white hover:bg-[#faf6f1] border-[#e8ddd3] text-[#8a8078] hover:text-[#2d2824] hover:border-[#c4a35a]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            SHOWROOM
          </button>
          
          <button
            onClick={handleQuickAdd}
            className={`px-3.5 py-2.5 active:scale-95 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              isDark
                ? 'bg-[#c4a35a] hover:bg-[#d4b36a]'
                : 'bg-[#a03232] hover:bg-[#8a2828]'
            }`}
            style={{ boxShadow: isDark ? '0 4px 15px rgba(196,163,90,0.25)' : '0 4px 15px rgba(160,50,50,0.2)' }}
            title="Quick Add in standard size"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
