import React from 'react';
import { motion } from 'motion/react';

// =========================================================================
// 1. DESIGN BLUEPRINT RED (تصاميم خياطة حمراء خلف الكلام)
// Detailed technical apparel blueprints with glowing red vectors, sewing patterns,
// dimensions, stitch lines, and drafting details.
// =========================================================================
export const DesignBlueprintRed: React.FC = () => {
  return (
    <div className="absolute -inset-16 -z-10 pointer-events-none select-none overflow-hidden opacity-35 bg-radial-gradient">
      {/* Absolute glow centers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-red-600/5 blur-[80px]" />
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 600 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[650px] mx-auto text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.45)]"
      >
        {/* Outer Circular Compasses & Design Radials */}
        <circle cx="300" cy="300" r="240" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 9" className="opacity-40" />
        <circle cx="300" cy="300" r="180" stroke="currentColor" strokeWidth="0.75" className="opacity-25" />
        <circle cx="300" cy="300" r="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" className="opacity-30" />
        
        {/* Horizontal & Vertical Align Rulers / Crosshairs */}
        <line x1="60" y1="300" x2="540" y2="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-50" />
        <line x1="300" y1="60" x2="300" y2="540" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-50" />
        
        {/* Diagonal Drafting Lines */}
        <line x1="120" y1="120" x2="480" y2="480" stroke="currentColor" strokeWidth="0.3" className="opacity-20" />
        <line x1="480" y1="120" x2="120" y2="480" stroke="currentColor" strokeWidth="0.3" className="opacity-20" />

        {/* Technical Markings (Corner Aligners) */}
        <path d="M 70 80 Q 70 70 80 70 M 530 80 Q 530 70 520 70 M 70 520 Q 70 530 80 530 M 530 520 Q 530 530 520 530" stroke="currentColor" strokeWidth="1" className="opacity-65" />

        {/* --------------------------------------------------------- */}
        {/* FASHION HOODIE Blueprint Wireframe / Sewing Pattern Layout */}
        {/* --------------------------------------------------------- */}
        <g transform="translate(100, 110)" className="opacity-60">
          {/* Main Body block outline */}
          <rect x="75" y="80" width="250" height="260" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          
          {/* Streetwear Hood curve */}
          <path 
            d="M 160,80 C 130,50 140,10 200,10 C 260,10 270,50 240,80 Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />
          
          {/* Hood face cutout opening / seam line */}
          <path 
            d="M 175,70 C 160,55 170,25 200,25 C 230,25 240,55 225,70" 
            stroke="currentColor" 
            strokeWidth="0.75" 
            strokeDasharray="2 2" 
          />
          
          {/* Left Sleeve Pattern Draft */}
          <path 
            d="M 75,110 L 10,140 L 40,260 L 75,210 Z" 
            stroke="currentColor" 
            strokeWidth="1.25" 
            strokeLinejoin="round" 
            className="transition-all hover:stroke-red-400"
          />
          {/* Left Cuff Sleeve Seam */}
          <line x1="10" y1="140" x2="40" y2="260" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" />

          {/* Right Sleeve Pattern Draft */}
          <path 
            d="M 325,110 L 390,140 L 360,260 L 325,210 Z" 
            stroke="currentColor" 
            strokeWidth="1.25" 
            strokeLinejoin="round" 
          />
          {/* Right Cuff Sleeve Seam */}
          <line x1="390" y1="140" x2="360" y2="260" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" />

          {/* Chest Pocket pouch outline (Kangaroo pocket style) */}
          <path 
            d="M 140,290 L 160,250 L 240,250 L 260,290 L 250,320 L 150,320 Z" 
            stroke="currentColor" 
            strokeWidth="1" 
          />

          {/* Double stitching lines along bottom waist band hem */}
          <line x1="75" y1="334" x2="325" y2="334" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
          <line x1="75" y1="337" x2="325" y2="337" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />

          {/* --------------------------------------------------------- */}
          {/* Tailor Drafting Blueprint Text Annotations & Dimension Guides */}
          {/* --------------------------------------------------------- */}
          
          {/* BUST / WIDTH MEASUREMENT LINE */}
          <g className="text-[7.5px] font-mono select-none">
            <line x1="75" y1="150" x2="325" y2="150" stroke="currentColor" strokeWidth="0.75" />
            <polygon points="75,150 82,147 82,153" fill="currentColor" />
            <polygon points="325,150 318,147 318,153" fill="currentColor" />
            <text x="200" y="145" textAnchor="middle" fill="currentColor" className="font-bold tracking-widest bg-black">
              BUST WIDTH: 124cm [OVERSIZED]
            </text>
          </g>

          {/* SLEEVE LENGTH MEASUREMENT LINE */}
          <g className="text-[7.5px] font-mono select-none" transform="translate(-10, 0)">
            <line x1="75" y1="110" x2="15" y2="135" stroke="currentColor" strokeWidth="0.75" />
            <polygon points="75,110 70,115 72,108" fill="currentColor" />
            <text x="35" y="115" textAnchor="middle" fill="currentColor" className="font-bold tracking-widest bg-black" transform="rotate(-22 35 115)">
              SLEEVE: 71cm
            </text>
          </g>

          {/* SEAM ALLOWANCE ANNOTATIONS */}
          <g className="text-[7px] font-mono tracking-[0.1em] opacity-80" fill="currentColor">
            <text x="90" y="95">PATTERN_TYPE: STREETWEAR_HOODIE_V2</text>
            <text x="90" y="105">SEAM_ALLOWANCE: +1.5cm</text>
            <text x="145" y="235">HEAVYWEIGHT_COTTON: 450GSM</text>
            <text x="260" y="200">DROP_SHOULDER: 12°</text>
          </g>

          {/* Pattern Center Line Symbol (CL) */}
          <g transform="translate(195, 175)" className="opacity-70 text-red-400">
            <circle cx="5" cy="5" r="7" stroke="currentColor" strokeWidth="0.75" />
            <line x1="5" y1="-5" x2="5" y2="15" stroke="currentColor" strokeWidth="0.75" />
            <line x1="-5" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="0.75" />
            <text x="16" y="9" className="text-[6px] font-mono leading-none font-black text-red-500">CL</text>
          </g>
        </g>

        {/* Legend Coordinates & Technical Brand Stamp */}
        <g transform="translate(60, 50)" className="text-[7px] font-mono tracking-widest opacity-75" fill="currentColor">
          <text x="0" y="0">VOOX_SPEC_FILE: 9812_REV_4</text>
          <text x="0" y="12">SCALE_ RATIO: 1:10_METRIC</text>
          <text x="0" y="24">M&A_STUDIOS_TAILORING_CAD</text>
        </g>
      </svg>
    </div>
  );
};


// =========================================================================
// 2. TAILORS TAPE RED (متر احمر للملابس في الخلفية)
// Continuous scrolling/drifting bright red measurement tape complete with 
// centimeter ticks, high-spec millimetric lines, and big bold numbers.
// =========================================================================
interface TailorsTapeRedProps {
  position?: 'left' | 'right' | 'diagonal';
  speed?: 'slow' | 'medium' | 'fast';
}

export const TailorsTapeRed: React.FC<TailorsTapeRedProps> = ({ 
  position = 'left',
  speed = 'slow' 
}) => {
  // Setup speed configuration
  const duration = speed === 'fast' ? 12 : speed === 'medium' ? 24 : 45;

  // Render highly-detailed mock metric centimeter ruler ticks (10cm blocks)
  const renderTapeSegment = (indexOffset: number, keySuffix: string) => {
    return (
      <div key={`${indexOffset}-${keySuffix}`} className="flex flex-col select-none shrink-0 w-full">
        {Array.from({ length: 15 }).map((_, segmentIdx) => {
          const cmValue = indexOffset * 15 + segmentIdx + 1;
          const isDecade = cmValue % 10 === 0;
          const isHalf = cmValue % 5 === 0 && !isDecade;

          return (
            <div 
              key={segmentIdx} 
              className="relative flex items-center h-10 w-full border-b border-red-950/20 px-2"
            >
              {/* Left-align thick core metric ruler millimeter lines */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-1">
                {Array.from({ length: 10 }).map((_, mmIdx) => {
                  const isCoreTick = mmIdx === 0;
                  const isMidTick = mmIdx === 5;
                  
                  return (
                    <div 
                      key={mmIdx}
                      className={`h-[1px] bg-black transition-all ${
                        isCoreTick 
                          ? 'w-4 opacity-100 bg-red-950' 
                          : isMidTick 
                            ? 'w-2.5 opacity-80 bg-red-950/80' 
                            : 'w-1.5 opacity-60 bg-red-950/50'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Right-align corresponding reverse metric lines for dual-sided measure tape */}
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-1">
                {Array.from({ length: 10 }).map((_, mmIdx) => {
                  const isCoreTick = mmIdx === 0;
                  const isMidTick = mmIdx === 5;
                  
                  return (
                    <div 
                      key={mmIdx}
                      className={`h-[1px] bg-black transition-all ml-auto ${
                        isCoreTick 
                          ? 'w-4 opacity-100 bg-red-950' 
                          : isMidTick 
                            ? 'w-2.5 opacity-80 bg-red-950/80' 
                            : 'w-1.5 opacity-60 bg-red-950/50'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Center Content: Century Centimeter Digits */}
              <div className="mx-auto flex flex-col items-center justify-center">
                {isDecade ? (
                  // Large highlighted 10cm markers
                  <div className="bg-black text-[9px] font-mono leading-none font-bold text-red-500 px-1 py-0.5 rounded border border-red-900 shadow-[0_0_8px_rgba(239,68,68,0.25)] tracking-tighter">
                    {cmValue}
                  </div>
                ) : isHalf ? (
                  // Elegant dot or smaller numerical marker for every 5cm
                  <span className="font-mono text-[9px] font-semibold text-black/70 italic">
                    {cmValue}
                  </span>
                ) : (
                  // Tiny simple measurement figures for general cm numbers
                  <span className="font-mono text-[8px] font-medium text-black/45 scale-90">
                    {cmValue}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Positions configurations
  let alignmentClasses = "";
  let rotationClasses = "";

  if (position === 'left') {
    alignmentClasses = "absolute left-6 lg:left-14 top-0 bottom-0 w-8 sm:w-8.5 h-full z-1 pointer-events-none";
    rotationClasses = "shadow-[2px_0_15px_rgba(220,38,38,0.12),-1px_0_3px_rgba(0,0,0,0.5)] border-r border-red-950/45";
  } else if (position === 'right') {
    alignmentClasses = "absolute right-6 lg:right-14 top-0 bottom-0 w-8 sm:w-8.5 h-full z-1 pointer-events-none";
    rotationClasses = "shadow-[-2px_0_15px_rgba(220,38,38,0.12),1px_0_3px_rgba(0,0,0,0.5)] border-l border-red-950/45";
  } else {
    // Diagonal background striping design element
    alignmentClasses = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8.5 h-[200vh] z-0 pointer-events-none";
    rotationClasses = "-rotate-12 opacity-25 shadow-[0_0_20px_rgba(220,38,38,0.15)]";
  }

  return (
    <div className={`${alignmentClasses} overflow-hidden`}>
      {/* Tape Measure body carrying tape metrics, sliding infinitely */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: '-50%' }}
        transition={{ 
          repeat: Infinity, 
          duration: duration, 
          ease: 'linear' 
        }}
        className={`w-full flex flex-col bg-gradient-to-b from-red-600 via-red-500/95 to-red-600 border-x border-red-700 ${rotationClasses}`}
      >
        {/* Render sequential tape blocks twice to achieve ideal continuous overlay loop */}
        {renderTapeSegment(0, 'a')}
        {renderTapeSegment(1, 'a')}
        {renderTapeSegment(0, 'b')}
        {renderTapeSegment(1, 'b')}
      </motion.div>
    </div>
  );
};
