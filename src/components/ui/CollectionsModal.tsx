import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Layers, LayoutGrid, Shirt, Sliders, Search } from 'lucide-react';
import { Category } from '../../types';

interface CollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CollectionsModal: React.FC<CollectionsModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search query when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Map icons for categories to add micro-visual elements
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'hoodies':
        return <Shirt className="w-5 h-5 text-red-500" />;
      case 't-shirts':
        return <Shirt className="w-5 h-5 text-red-500 hover:rotate-12 transition-transform" />;
      case 'jackets':
        return <Layers className="w-5 h-5 text-red-500" />;
      case 'pants':
        return <Sliders className="w-5 h-5 text-red-500" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-red-500" />;
    }
  };

  // Filter categories by name (case insensitive)
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check if "All Pieces" segment matches search query (or if query is empty)
  const showAllSegment = !searchQuery || 'all pieces'.includes(searchQuery.toLowerCase());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
          
          {/* Backdrop glass blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal body */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-zinc-950 border-2 border-red-500/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)] z-10 flex flex-col pointer-events-auto"
          >
            {/* Tech Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-500 pointer-events-none" />

            {/* Close button top-right */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="p-8 sm:p-10 space-y-6">
              
              {/* Telemetry Header */}
              <div className="flex justify-between items-center font-mono text-[8px] text-red-500/75 tracking-[0.25em] border-b border-red-950/30 pb-3 uppercase">
                <span>SEGMENT: STREETWEAR_ARCHIVE</span>
                <span className="animate-pulse">COORDINATE_MAPPED</span>
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <span className="px-2.5 py-0.5 bg-red-900/20 border border-red-900/50 text-[9px] font-mono tracking-[0.2em] text-red-400 rounded-full uppercase">
                  ACTIVE COLLECTIONS
                </span>
                <h2 className="font-sans font-black text-3xl tracking-wider text-white uppercase">
                  EXPLORE ARCHIVES
                </h2>
                <p className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
                  Select a category node to decrypt specific apparel databases.
                </p>
              </div>

              {/* Glowing Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 focus:text-red-500 transition-colors pointer-events-none" />
                <input
                  type="text"
                  placeholder="SEARCH ARCHIVE OR CATEGORIES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/50 hover:bg-zinc-900/80 focus:bg-zinc-900 border border-zinc-800 focus:border-red-500/80 rounded-xl font-mono text-xs tracking-wider text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all uppercase"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Collections Grid list */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-zinc-950">
                {/* No results placeholder */}
                {filteredCategories.length === 0 && !showAllSegment && (
                  <div className="p-8 text-center border border-dashed border-red-900/30 rounded-xl bg-zinc-950/60">
                    <p className="font-mono text-xs text-red-500 tracking-wider uppercase">
                      NO DECRYPTED ARCHIVES FOUND MATCHING: "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 px-3.5 py-1.5 bg-red-950/40 hover:bg-red-950 border border-red-900/30 hover:border-red-500 rounded font-mono text-[9px] text-zinc-300 hover:text-white uppercase tracking-widest transition-all cursor-pointer"
                    >
                      RESET SEARCH FILTER
                    </button>
                  </div>
                )}

                {/* "ALL" segment row */}
                {showAllSegment && (
                  <motion.div
                    whileHover={{ scale: 1.01, x: 2 }}
                    onClick={() => {
                      onSelectCategory('all');
                      onClose();
                    }}
                    className={`p-4 bg-zinc-900/40 hover:bg-zinc-900/80 border rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      selectedCategory === 'all'
                        ? 'border-red-500/80 bg-red-955/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                        : 'border-zinc-900/80 hover:border-red-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-sans font-black text-sm text-white tracking-wider uppercase">
                          ALL PIECES
                        </h3>
                        <p className="font-mono text-[10px] text-zinc-500 tracking-wide">
                          Absolute digital directory including whole active drops
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                  </motion.div>
                )}

                {filteredCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ scale: 1.01, x: 2 }}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onClose();
                      }}
                      className={`p-4 bg-zinc-900/40 hover:bg-zinc-900/80 border rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                        isActive
                          ? 'border-red-500/80 bg-red-955/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                          : 'border-zinc-900/80 hover:border-red-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                          {getCategoryIcon(cat.slug)}
                        </div>
                        <div>
                          <h3 className="font-sans font-black text-sm text-white tracking-wider uppercase">
                            {cat.name}
                          </h3>
                          <p className="font-mono text-[10px] text-zinc-500 tracking-wide">
                            {cat.description || 'Highly limited future streetwear sequence'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Secure pathway indicator */}
              <div className="border-t border-zinc-900/80 pt-4 flex justify-between items-center text-[9px] font-mono text-zinc-600 tracking-wider">
                <span>COORD_MATRIX: 29.9792° N, 31.1342° E</span>
                <span>SECURE ACCESS AUTHORIZED</span>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
