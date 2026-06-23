import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { X, ShoppingBag, Check, Info, Shield, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductMeshViewer3D } from '../3d/ProductMeshViewer3D';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const primaryImage = product.product_images?.[0]?.image_url || '/placeholder.png';
  const sizes = product.product_sizes?.map(s => s.size) || ['S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
        
        {/* Backdrop glass blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal body */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-black/95 border border-zinc-900 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col md:flex-row pointer-events-auto"
        >
          {/* Close button absolute top-right */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-white rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left panel: Immersive interactive WebGL 3D showcase */}
          <div className="flex-1 min-h-[360px] md:min-h-[480px] bg-black p-0 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-zinc-900 overflow-hidden">
            <ProductMeshViewer3D 
              productImageUrl={primaryImage} 
              productName={product.title} 
              skuCode={product.sku}
            />
          </div>

          {/* Right panel: Information sheet */}
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Product SKU & Tag */}
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 bg-zinc-900/40 border border-zinc-800 text-[9px] font-mono tracking-widest text-zinc-300 rounded">
                  {product.sku || 'VOOX CORE'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
                  STREETWEAR_03-V
                </span>
              </div>

              {/* Title & Price */}
              <div className="space-y-1">
                <h2 className="font-sans font-black text-2xl tracking-widest text-white">
                  {product.title}
                </h2>
                <div className="text-xl font-mono text-red-500 font-bold tracking-wider pt-1">
                  EGP {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Technical features layout */}
              <div className="grid grid-cols-2 gap-3.5 pt-1.5 font-mono">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] border border-zinc-900/50 p-2.5 rounded bg-black">
                  <Layers className="w-3.5 h-3.5 text-white" />
                  <span>PREMIUM FABRIC</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] border border-zinc-900/50 p-2.5 rounded bg-black">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>CYBER SHIELD SHELL</span>
                </div>
              </div>

              {/* Sizes checklist */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 tracking-wider">
                  <span>SELECT ARCHITECTURAL SIZE</span>
                  <span className="text-zinc-600">EU_STANDARDS</span>
                </div>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 w-11 flex items-center justify-center font-mono text-xs rounded transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-white border border-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                          : 'bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity manipulator */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-mono text-zinc-400 tracking-wider">QUANTITY</label>
                <div className="flex items-center gap-3 w-max bg-zinc-900/60 border border-zinc-800 p-1.5 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 font-mono text-center text-xs text-zinc-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Footer triggers */}
            <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 h-12 rounded-xl text-xs font-mono font-bold tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 transform scale-110" />
                    ADDED_TO_CATALOG
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    ADD_TO_CART_PORTA
                  </>
                )}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
