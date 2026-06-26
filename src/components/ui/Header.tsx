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
      className={`fixed top-0 left-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isDark ? 'bg-[#1c1814]/85 border-[#3a342e]' : 'bg-[#faf6f1]/88 border-[#e8ddd3]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO: VOOX - Premium Geometric Typeface */}
        <div 
          onClick={onOpenHome}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className={`font-serif font-bold text-2xl tracking-wide transition-all duration-300 ${
            isDark ? 'text-[#f0ece6] group-hover:text-[#c4a35a]' : 'text-[#2d2824] group-hover:text-[#a03232]'
          }`}>
            VOO<span className={isDark ? 'text-[#c4a35a]' : 'text-[#a03232]'}>X</span>
          </span>
          <span className={`h-2 w-2 rounded-full ${isDark ? 'bg-[#c4a35a]' : 'bg-[#a03232]'} group-hover:animate-ping hidden sm:inline-block`} />
        </div>

        {/* NAVIGATION: Sleek minimalist uppercase links */}
        <nav className={`hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.15em] transition-colors duration-300 ${
          isDark ? 'text-[#a39b93]' : 'text-[#8a8078]'
        }`}>
          <button 
            onClick={onOpenHome}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b ${
              !showDashboard 
                ? isDark ? 'text-[#f0ece6] border-[#c4a35a]' : 'text-[#2d2824] border-[#a03232]'
                : 'border-transparent'
            } ${isDark ? 'hover:text-[#c4a35a]' : 'hover:text-[#a03232]'}`}
          >
            HOME
          </button>
          <button 
            onClick={onOpenShop}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b border-transparent ${isDark ? 'hover:text-[#c4a35a]' : 'hover:text-[#a03232]'}`}
          >
            SHOP
          </button>
          <button 
            onClick={onOpenCollections}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b border-transparent ${isDark ? 'hover:text-[#c4a35a]' : 'hover:text-[#a03232]'}`}
          >
            COLLECTIONS
          </button>
          <button 
            onClick={onOpenAbout}
            className={`cursor-pointer transition-colors duration-300 pb-1 border-b border-transparent ${isDark ? 'hover:text-[#c4a35a]' : 'hover:text-[#a03232]'}`}
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
                ? 'text-[#c4a35a] bg-[#24201c] border border-[#3a342e] hover:bg-[#2a2622]'
                : 'text-[#a03232] bg-white border border-[#e8ddd3] hover:bg-[#faf6f1]'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Dedicated Active Admin panel view toggle */}
          {isAdmin && (
            <button
              onClick={onOpenDashboard}
              className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[9px] font-sans font-medium tracking-widest transition-colors cursor-pointer ${
                showDashboard 
                  ? isDark ? 'bg-[#c4a35a] border-[#c4a35a] text-[#1c1814]' : 'bg-[#a03232] border-[#a03232] text-white' 
                  : isDark
                    ? 'bg-[#24201c] border-[#3a342e] text-[#a39b93] hover:bg-[#2a2622] hover:text-[#f0ece6]'
                    : 'bg-white border-[#e8ddd3] text-[#8a8078] hover:bg-[#faf6f1] hover:text-[#2d2824]'
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
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-[10px] font-sans tracking-wider transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-[#24201c] hover:bg-[#2a2622] border-[#3a342e] hover:border-[#c4a35a]/50 text-[#a39b93] hover:text-[#f0ece6]'
                    : 'bg-white hover:bg-[#faf6f1] border-[#e8ddd3] hover:border-[#c4a35a]/50 text-[#8a8078] hover:text-[#2d2824]'
                }`}
                title="View your Profile & Connection Logs"
              >
                <User className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${
                  isDark ? 'text-[#c4a35a]' : 'text-[#a03232]'
                }`} />
                <span className="max-w-[80px] sm:max-w-[120px] truncate uppercase font-bold text-[9px] tracking-widest">
                  {profile.full_name?.split(' ')[0] || 'NOMAD'}
                </span>
              </button>
              
              <button 
                onClick={signOut}
                className={`p-2 rounded-full border transition-colors group cursor-pointer ${
                  isDark
                    ? 'text-[#a39b93] hover:text-[#c4a35a] bg-[#24201c] hover:bg-[#2a2622] border-[#3a342e]'
                    : 'text-[#8a8078] hover:text-[#a03232] bg-white hover:bg-[#faf6f1] border-[#e8ddd3]'
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
                  ? 'text-[#a39b93] hover:text-[#c4a35a] bg-[#24201c] hover:bg-[#2a2622] border-[#3a342e]'
                  : 'text-[#8a8078] hover:text-[#a03232] bg-white hover:bg-[#faf6f1] border-[#e8ddd3]'
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
                ? 'bg-[#24201c] border-[#3a342e] hover:border-[#c4a35a]/50'
                : 'bg-white border-[#e8ddd3] hover:border-[#c4a35a]/50'
            }`}
          >
            <ShoppingBag className={`w-4.5 h-4.5 transition-colors ${
              isDark ? 'text-[#a39b93] group-hover:text-[#c4a35a]' : 'text-[#8a8078] group-hover:text-[#a03232]'
            }`} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  key="cart-num"
                  className={`absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-sans font-bold text-white px-1 ${
                    isDark ? 'bg-[#c4a35a] border-[#1c1814]' : 'bg-[#a03232] border-white'
                  }`}
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
