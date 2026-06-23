import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard3DOverlay } from '../3d/ProductCard3DOverlay';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
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
      className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 pointer-events-auto bg-black/60 border-zinc-900 group content-box cursor-pointer select-none ${
        hovered 
          ? 'border-zinc-700 shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-black/80' 
          : ''
      }`}
      onClick={() => onQuickView(product)}
    >
      {/* Top badges: Stock indicator & Brand symbol */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        {product.stock < 5 ? (
          <span className="px-2.5 py-0.5 bg-red-950/70 border border-red-800 text-[8px] font-mono font-bold tracking-widest text-red-500 rounded">
            LIMITED
          </span>
        ) : (
          <span className="px-2.5 py-0.5 bg-zinc-900/80 border border-zinc-800 text-[8px] font-mono tracking-widest text-zinc-400 rounded">
            VX_CORE
          </span>
        )}
      </div>

      <div className="absolute top-6 right-6 z-10 font-mono text-[9px] text-zinc-600 tracking-wider">
        {product.sku || 'VX-00'}
      </div>

      {/* Main image container with futuristic glowing white frame */}
      <div className="w-full h-80 flex items-center justify-center p-4 relative overflow-hidden bg-black/40 rounded-lg border-2 border-zinc-900 group-hover:border-white shadow-none transition-all duration-300">
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
              <span key={size} className="w-6 h-6 flex items-center justify-center text-[9px] bg-black/80 border border-zinc-800 font-mono text-zinc-300 rounded font-semibold">
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
            <h3 className="font-sans font-black text-sm tracking-widest text-white group-hover:text-zinc-300 transition-colors duration-300">
              {product.title}
            </h3>
            <p className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase mt-1">
              SYSTEM_SUITE: STREETWEAR
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs font-bold text-white tracking-widest">
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
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-black hover:bg-zinc-900 border border-zinc-900 text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white rounded-lg transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            SHOWROOM
          </button>
          
          <button
            onClick={handleQuickAdd}
            className="px-3.5 py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            title="Quick Add in standard size"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
