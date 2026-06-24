import React from 'react';
import { motion } from 'motion/react';
import { Ruler, Scissors } from 'lucide-react';

export const GarmentBackdropPattern: React.FC = () => {
  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 0. Ambient Red Design Blurs & Glows in the Background */}
      <div className="absolute top-[10%] left-[15%] w-[350px] h-[350px] bg-red-900/10 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] bg-red-950/15 blur-[180px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-[15%] left-[5%] w-[400px] h-[400px] bg-red-900/10 blur-[150px] rounded-full" />

      {/* 1. Large repeating grid of sewing pattern lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />

      {/* 2. Top-Left: Tailor Drafting Blueprint (Streetwear Jacket CAD) */}
      <div className="absolute top-[15%] left-[5%] max-w-[280px] hidden md:block opacity-35 hover:opacity-75 transition-opacity duration-500">
        <svg viewBox="0 0 200 200" className="text-red-500 w-full h-auto drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
          {/* Jacket / Hoodie Outline */}
          <path 
            d="M 50,50 L 150,50 L 180,90 L 160,110 L 140,100 L 140,180 L 60,180 L 60,100 L 40,110 L 20,90 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.75" 
            strokeDasharray="4 2" 
          />
          {/* Inner Zipper Seam */}
          <line x1="100" y1="50" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
          {/* Tech Spec Annotations */}
          <text x="105" y="65" className="text-[6px] font-mono fill-current font-bold tracking-wider">FRONT_ZIP: YKK</text>
          <text x="105" y="140" className="text-[6px] font-mono fill-current font-bold tracking-wider">BODY_LENGTH: 76CM</text>
          <text x="105" y="150" className="text-[6px] font-mono fill-current opacity-70">WAIST_RISE: +2.5CM</text>
          <circle cx="100" cy="50" r="3" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* 3. Mid-Right: Giant floating scissors drafting angle */}
      <div className="absolute top-[45%] right-[3%] opacity-40 hidden lg:block text-red-500 hover:opacity-80 transition-opacity duration-300">
        <motion.div 
          animate={{ rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <Scissors className="w-10 h-10 stroke-[1]" />
          <span className="font-mono text-[7px] tracking-widest text-red-500">CUT_GUIDE_LINE_A</span>
        </motion.div>
      </div>

      {/* 4. Bottom-Left: Detailed T-Shirt Sewing Outline & Seam Margins */}
      <div className="absolute bottom-[20%] left-[3%] max-w-[240px] hidden lg:block opacity-45 hover:opacity-80 transition-opacity duration-500">
        <svg viewBox="0 0 160 160" className="w-full h-auto text-red-500">
          {/* T-shirt sleeve and collar layout */}
          <path 
            d="M 40,30 L 120,30 L 155,55 L 140,75 L 120,65 L 120,135 L 40,135 L 40,65 L 20,75 L 5,55 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
          />
          {/* Double stitch hem seam */}
          <path 
            d="M 40,132 L 120,132 M 40,130 L 120,130" 
            stroke="currentColor" 
            strokeWidth="0.25" 
            strokeDasharray="1 1" 
          />
          {/* Spec details */}
          <text x="45" y="80" className="text-[5px] font-mono fill-red-500/80">OVERSIZED_TEE_V1</text>
          <text x="45" y="90" className="text-[5px] font-mono fill-red-500/50">CHEST: 118CM</text>
          <text x="45" y="100" className="text-[5px] font-mono fill-red-500/50">HEMWEAVE: DOUBLE</text>
        </svg>
      </div>

      {/* 5. Center-Down: Floating Tape Measure strip with glowing red indicators */}
      <div className="absolute top-[75%] right-[10%] max-w-[220px] hidden md:block opacity-40 hover:opacity-80 transition-opacity duration-500">
        <svg viewBox="0 0 180 80" className="text-red-500 w-full h-auto">
          {/* Ruler tick lines */}
          <line x1="10" y1="40" x2="170" y2="40" stroke="currentColor" strokeWidth="1" />
          {Array.from({ length: 17 }).map((_, i) => {
            const x = 10 + i * 10;
            const isFive = i % 5 === 0;
            return (
              <line 
                key={i} 
                x1={x} 
                y1="40" 
                x2={x} 
                y2={isFive ? "28" : "33"} 
                stroke="currentColor" 
                strokeWidth={isFive ? "0.75" : "0.5"} 
              />
            );
          })}
          <text x="90" y="55" textAnchor="middle" className="text-[6px] font-mono fill-current font-black tracking-widest uppercase">
            HEM_SEWING_MATRIX_ALLOWANCE
          </text>
        </svg>
      </div>

      {/* 6. Background Laser Projection Grid lines */}
      <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-gradient-to-b from-transparent via-red-500/15 to-transparent" />
      <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-gradient-to-b from-transparent via-red-500/15 to-transparent" />
      <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
      <div className="absolute left-0 right-0 top-2/3 h-[1px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
    </div>
  );
};
