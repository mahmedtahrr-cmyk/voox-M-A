import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Github, Globe, Hammer, Linkedin, Mail, Phone, ShieldAlert, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-zinc-950 border-2 border-red-500/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)] z-10 flex flex-col pointer-events-auto"
          >
            {/* Tech Corner brackets for futuristic aesthetic */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-500 pointer-events-none" />

            {/* Close button absolute top-right */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal content */}
            <div className="p-8 sm:p-10 space-y-8">
              
              {/* Header Telemetry */}
              <div className="flex justify-between items-center font-mono text-[8px] text-red-500/75 tracking-[0.25em] border-b border-red-950/30 pb-3 uppercase">
                <span>SYSTEM_PROFILE: VOOX_GEN_0</span>
                <span className="animate-pulse">ONLINE_ACCESS_AUTHORIZED</span>
              </div>

              {/* Developer Profile Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* Visual Avatar Placeholder / Cyber Hologram */}
                <div className="relative w-28 h-28 rounded-xl border border-red-500 bg-red-950/20 flex flex-col items-center justify-center overflow-hidden shrink-0 group">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.06)_1.5px,transparent_1.5px)] bg-[size:100%_6px] pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-650/15 blur-xl group-hover:scale-125 transition-all duration-300" />
                  
                  {/* Neon mechanical construct representing the Lead developer */}
                  <Cpu className="w-10 h-10 text-red-500 group-hover:rotate-12 transition-all duration-300" />
                  
                  <div className="absolute bottom-2 px-2 py-0.5 bg-black/90 border border-red-900/60 rounded text-[6px] font-mono tracking-widest text-red-400 font-bold uppercase">
                    SYS_ENG
                  </div>
                </div>

                {/* Developer details */}
                <div className="space-y-3 text-center sm:text-left flex-1">
                  <span className="px-2.5 py-0.5 bg-red-900/20 border border-red-900/50 text-[9px] font-mono tracking-[0.2em] text-red-400 rounded-full uppercase">
                    LEAD SOFTWARE ENGINEER
                  </span>
                  <div className="space-y-1">
                    <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-wider text-white uppercase">
                      ENG.Mohamed Taher
                    </h2>
                    <p className="font-mono text-[10px] text-zinc-500 tracking-wider">
                      CO-FOUNDER & CHIEF DIGITAL ARCHITECT OF VOOX
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-1 text-xs justify-center sm:justify-start">
                    <a href="tel:01276812022" className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      <span>01276812022</span>
                    </a>
                    <span className="hidden sm:inline text-zinc-800">|</span>
                    <a href="mailto:mahmedtahrr@gmail.com" className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span>mahmedtahrr@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Detailed statement or Bio about VooX and Mohamed Taher */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-red-500" />
                  <h3 className="font-mono text-xs font-bold text-zinc-200 tracking-[0.15em] uppercase">
                    CRAFT SPECIFICATION
                  </h3>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                  VooX represents a modern frontier in high-performance digital storefronts, designed and hand-coded from the ground up by <strong className="text-red-500 font-bold">ENG.Mohamed Taher</strong>. Built using sleek reactive patterns, hardware-accelerated 3D projection layers, and automated cyber couture frameworks to ensure premium visual precision.
                </p>
              </div>

              {/* Operational stats / credentials */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-1">
                  <div className="font-mono text-[8px] text-zinc-500 tracking-wider uppercase">ARCH_ENGINE</div>
                  <div className="font-sans font-black text-[11px] text-zinc-100 tracking-wider uppercase">REACT 19 + VITE</div>
                </div>
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-1">
                  <div className="font-mono text-[8px] text-zinc-500 tracking-wider uppercase">STYLING_CORE</div>
                  <div className="font-sans font-black text-[11px] text-zinc-100 tracking-wider uppercase">TAILWIND RED SFX</div>
                </div>
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl col-span-2 sm:col-span-1 space-y-1">
                  <div className="font-mono text-[8px] text-zinc-500 tracking-wider uppercase">ESTABLISHED</div>
                  <div className="font-sans font-black text-[11px] text-zinc-100 tracking-wider uppercase">MAY 2026_EG</div>
                </div>
              </div>

              {/* Secure Developer Contact Pathways */}
              <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase">
                    CONNECT_VIA_DECRYPTED_LINE
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  <a 
                    href="tel:01276812022"
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-950 rounded text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-mono text-[9px] tracking-widest uppercase">CALL</span>
                  </a>
                  <a 
                    href="mailto:mahmedtahrr@gmail.com"
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-950 rounded text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-mono text-[9px] tracking-widest uppercase">EMAIL</span>
                  </a>
                  <button 
                    onClick={() => alert('Secure channel connected through admin suite! Ensure configuration.')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500 rounded text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-mono text-[9px] tracking-widest uppercase">PORTFOLIO</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
