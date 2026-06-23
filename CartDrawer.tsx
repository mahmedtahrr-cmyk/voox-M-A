import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { 
    cart, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onCheckout();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end selection:bg-red-600 selection:text-white">
          
          {/* Translucent Backdrop curtain */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Panel structure */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-black border-l border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col justify-between z-10 pointer-events-auto"
          >
            {/* Header block */}
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-white" />
                <h2 className="font-sans font-black text-sm tracking-widest text-zinc-100">
                  CART_PORTAL
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Product checklist container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border border-zinc-800/60 bg-zinc-900/10 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-bold text-zinc-400 tracking-widest uppercase">
                      Bag is Empty
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-600 tracking-wider mt-1">
                      NO ACTIVE THREADS SECURED
                    </p>
                  </div>
                </div>
              ) : (
                cart.map((item) => {
                  const image = item.product.product_images?.[0]?.image_url || '/placeholder.png';
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="p-4 rounded-xl border border-zinc-900/40 bg-black/80 flex gap-4 items-center"
                    >
                      {/* Image Frame */}
                      <div className="w-16 h-16 rounded-lg bg-zinc-900/40 border border-zinc-800/40 flex items-center justify-center p-2">
                        <img 
                          src={image} 
                          alt={item.product.title} 
                          className="max-h-full max-w-full object-contain filter drop-shadow"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Content block */}
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-sans font-black text-xs tracking-wider text-white">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="font-mono text-[9px] text-zinc-400 flex items-center gap-2">
                          <span>SIZE: {item.selectedSize}</span>
                          <span className="text-zinc-700">|</span>
                          <span className="text-zinc-400">
                            EGP {item.product.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center gap-2 bg-zinc-900/65 border border-zinc-800/50 rounded-md p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-500 hover:text-white font-mono text-[10px]"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-mono text-[10px] text-zinc-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-500 hover:text-white font-mono text-[10px]"
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="ml-auto font-mono text-[10px] font-bold text-zinc-300 select-none">
                            EGP {(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 1 })}
                          </span>
                        </div>

                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Summary / Checkout action details */}
            <div className="p-6 border-t border-zinc-900 bg-black/40 space-y-4">
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>CART_TOTAL:</span>
                  <span className="text-zinc-300">
                    EGP {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>SHIPPING_CO:</span>
                  <span className="text-zinc-300">
                    {cart.length > 0 ? 'EGP 150.00' : 'EGP 0.00'}
                  </span>
                </div>
                <div className="border-t border-dashed border-zinc-900 my-2 pt-2 flex justify-between font-bold text-sm">
                  <span className="text-zinc-200">TOTAL:</span>
                  <span className="text-white tracking-wide font-mono">
                    EGP {cart.length > 0 ? (cartTotal + 150.00).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                  </span>
                </div>
              </div>

              {/* Action checkout buttons */}
              <button
                disabled={cart.length === 0}
                onClick={handleCheckoutClick}
                className="w-full h-12 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed text-white text-xs font-mono font-bold tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              >
                INITIATE_CHECKOUT
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5 justify-center text-[9px] font-mono text-zinc-600">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                <span>CYBER_SECURED PAYMENT SYSTEMS</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
