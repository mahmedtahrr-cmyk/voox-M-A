import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingBag, User, ShieldAlert, Cpu, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
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
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 border-b backdrop-blur-md selection:bg-red-600 selection:text-white transition-colors duration-300 ${
        isDark ? 'bg-black/40 border-zinc-900' : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO: VOOX - Premium Geometric Typeface */}
        <div 
          onClick={onOpenHome}
          className="flex items-center gap-1.5 cursor-pointer group"
        >
          <span className={`font-sans font-black text-2xl tracking-[0.25em] transition-all duration-300 group-hover:text-red-500 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            VOO<span className="text-red-600 group-hover:text-white">X</span>
          </span>
          <span className="h-2 w-2 rounded-full bg-red-600 group-hover:animate-ping hidden sm:inline-block" />
        </div>

        {/* NAVIGATION: Sleek minimalist uppercase links */}
        <nav className={`hidden md:flex items-center gap-8 font-mono text-[11px] font-medium tracking-[0.2em] transition-colors duration-300 ${
          isDark ? 'text-zinc-400' : 'text-gray-500'
        }`}>
          <button 
            onClick={onOpenHome}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b ${
              !showDashboard 
                ? isDark ? 'text-zinc-100 border-red-500' : 'text-gray-900 border-red-500'
                : 'border-transparent'
            } ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
          >
            HOME
          </button>
          <button 
            onClick={onOpenShop}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b border-transparent ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
          >
            SHOP
          </button>
          <button 
            onClick={onOpenCollections}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b border-transparent ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
          >
            COLLECTIONS
          </button>
          <button 
            onClick={onOpenAbout}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b border-transparent ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
          >
            ABOUT
          </button>
        </nav>

        {/* CONTROLS: Profile, Admin tools, Cart */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDark
                ? 'text-yellow-400 bg-black/50 border border-zinc-800 hover:bg-zinc-900'
                : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-100'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Dedicated Active Admin panel view toggle */}
          {isAdmin && (
            <button
              onClick={onOpenDashboard}
              className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[9px] font-mono tracking-widest transition-colors cursor-pointer ${
                showDashboard 
                  ? 'bg-red-600 border-red-500 text-white font-bold' 
                  : isDark
                    ? 'bg-black/80 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
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
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-black/50 hover:bg-zinc-900 border-zinc-900 hover:border-zinc-500/50 text-zinc-300 hover:text-white'
                    : 'bg-white hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
                }`}
                title="View your Profile & Connection Logs"
              >
                <User className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`} />
                <span className="max-w-[80px] sm:max-w-[120px] truncate uppercase font-bold text-[9px] tracking-widest">
                  {profile.full_name?.split(' ')[0] || 'NOMAD'}
                </span>
              </button>
              
              <button 
                onClick={signOut}
                className={`p-2 rounded-full border transition-colors group cursor-pointer ${
                  isDark
                    ? 'text-zinc-400 hover:text-white bg-black/50 hover:bg-zinc-900 border-zinc-900'
                    : 'text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-100 border-gray-200'
                }`}
                title="Disconnect Authenticated Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark
                  ? 'text-zinc-400 hover:text-white bg-black/50 hover:bg-zinc-900 border-zinc-900'
                  : 'text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-100 border-gray-200'
              }`}
              title="Secure Auth Login / Register"
            >
              <User className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Cart Bag with glowing notification */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`p-2.5 border rounded-full transition-all duration-300 relative group cursor-pointer ${
              isDark
                ? 'text-white bg-black/50 border-zinc-900 hover:border-zinc-500/30'
                : 'text-gray-700 bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <ShoppingBag className={`w-4.5 h-4.5 transition-colors ${
              isDark ? 'text-zinc-300 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-800'
            }`} />
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
