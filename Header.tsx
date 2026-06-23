import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, User, ShieldAlert, Cpu, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenShop: () => void;
  onOpenHome: () => void;
  onOpenAbout: () => void;
  onOpenCollections: () => void;
  onOpenProfile: () => void;
  showDashboard: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenDashboard,
  onOpenHome,
  onOpenShop,
  onOpenAbout,
  onOpenCollections,
  onOpenProfile,
  showDashboard
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { profile, isAdmin, signOut, simulateAdmin } = useAuth();

  return (
    <motion.header 
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 bg-black/40 border-b border-zinc-900 backdrop-blur-md selection:bg-red-600 selection:text-white"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO: VOOX - Premium Geometric Typeface */}
        <div 
          onClick={onOpenHome}
          className="flex items-center gap-1.5 cursor-pointer group"
        >
          <span className="font-sans font-black text-2xl tracking-[0.25em] text-white transition-all duration-300 group-hover:text-red-500">
            VOO<span className="text-red-600 group-hover:text-white">X</span>
          </span>
          <span className="h-2 w-2 rounded-full bg-red-600 group-hover:animate-ping hidden sm:inline-block" />
        </div>

        {/* NAVIGATION: Sleek minimalist uppercase links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] font-medium tracking-[0.2em] text-zinc-400">
          <button 
            onClick={onOpenHome}
            className={`cursor-pointer transition-colors duration-300 hover:text-white ${!showDashboard ? 'text-zinc-100 border-b border-red-500 pb-1' : 'pb-1 border-b border-transparent'}`}
          >
            HOME
          </button>
          <button 
            onClick={onOpenShop}
            className="cursor-pointer transition-colors duration-300 hover:text-white pb-1 border-b border-transparent"
          >
            SHOP
          </button>
          <button 
            onClick={onOpenCollections}
            className="cursor-pointer transition-colors duration-300 hover:text-white pb-1 border-b border-transparent"
          >
            COLLECTIONS
          </button>
          <button 
            onClick={onOpenAbout}
            className="cursor-pointer transition-colors duration-300 hover:text-white pb-1 border-b border-transparent"
          >
            ABOUT
          </button>
        </nav>

        {/* CONTROLS: Profile, Admin tools, Cart */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Dedicated Active Admin panel view toggle */}
          {isAdmin && (
            <button
              onClick={onOpenDashboard}
              className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[9px] font-mono tracking-widest transition-colors cursor-pointer ${
                showDashboard 
                  ? 'bg-red-600 border-red-500 text-white font-bold' 
                  : 'bg-black/80 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              PORT_ADMIN
            </button>
          )}

          {/* Profile Portal trigger */}
          {profile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 bg-black/50 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-500/50 rounded-full text-[10px] font-mono tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer group"
                title="View your Profile & Connection Logs"
              >
                <User className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate uppercase font-bold text-[9px] tracking-widest">
                  {profile.full_name?.split(' ')[0] || 'NOMAD'}
                </span>
              </button>
              
              <button 
                onClick={signOut}
                className="p-2 text-zinc-400 hover:text-white rounded-full bg-black/50 hover:bg-zinc-900 border border-zinc-900 transition-colors group cursor-pointer"
                title="Disconnect Authenticated Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="p-2 text-zinc-400 hover:text-white rounded-full bg-black/50 hover:bg-zinc-900 border border-zinc-900 transition-colors cursor-pointer"
              title="Secure Auth Login / Register"
            >
              <User className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Cart Bag with glowing notification */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 text-white bg-black/50 border border-zinc-900 hover:border-zinc-500/30 rounded-full transition-all duration-300 relative group cursor-pointer"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-zinc-300 group-hover:text-white transition-colors" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  key="cart-num"
                  className="absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center rounded-full bg-red-600 border border-black text-[9px] font-mono font-bold text-white px-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.header>
  );
};
