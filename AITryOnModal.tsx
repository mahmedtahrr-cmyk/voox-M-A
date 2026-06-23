import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  Sparkles,
  Camera,
  RefreshCw,
  Palette,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  Maximize2,
  Minimize2,
  Trash2,
  Undo
} from "lucide-react";
import { Product } from "../../types";

interface AITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

interface AIStylistReport {
  fitScore: number;
  sizeRecommendation: string;
  sizeConfidence: number;
  bodyType: string;
  skinToneMatch: string;
  measurementsEstimate: string;
  imagQualityNote: string;
  stylingTips: string[];
  fitterAnalysis: string;
  aestheticVerdict: string;
}

export const AITryOnModal: React.FC<AITryOnModalProps> = ({
  isOpen,
  onClose,
  products
}) => {
  // File upload state & visual try-on state
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProd, setSelectedProd] = useState<Product | null>(
    products.length > 0 ? products[0] : null
  );

  // Overlay position/scale adjustment parameters
  const [scale, setScale] = useState<number>(0.85);
  const [yOffset, setYOffset] = useState<number>(10);
  const [xOffset, setXOffset] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(0.9);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [gender, setGender] = useState<string>("unisex");

  // Smart size calculator state
  const [heightCm, setHeightCm] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [calcSize, setCalcSize] = useState<string | null>(null);

  // Smart size calculator function
  const computeSmartSize = (h: number, w: number): string => {
    const bmi = w / ((h / 100) * (h / 100));
    if (h < 165) {
      if (bmi < 20) return "S";
      if (bmi < 24) return "M";
      if (bmi < 28) return "L";
      return "XL";
    } else if (h < 175) {
      if (bmi < 19) return "S";
      if (bmi < 23) return "M";
      if (bmi < 27) return "L";
      if (bmi < 31) return "XL";
      return "XXL";
    } else if (h < 185) {
      if (bmi < 18.5) return "S";
      if (bmi < 22) return "M";
      if (bmi < 26) return "L";
      if (bmi < 30) return "XL";
      return "XXL";
    } else {
      if (bmi < 18) return "M";
      if (bmi < 22) return "L";
      if (bmi < 27) return "XL";
      return "XXL";
    }
  };

  // Dragging interaction states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 });

  // AI loading and response states
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [loaderLog, setLoaderLog] = useState<string>("");
  const [report, setReport] = useState<AIStylistReport | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Drag and drop states for file input
  const [dragOver, setDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync size changes with subtle changes in garment scale for a smart layout
  useEffect(() => {
    switch (selectedSize) {
      case "S":
        setScale(0.75);
        break;
      case "M":
        setScale(0.85);
        break;
      case "L":
        setScale(0.95);
        break;
      case "XL":
        setScale(1.05);
        break;
      case "XXL":
        setScale(1.15);
        break;
      default:
        setScale(0.85);
    }
  }, [selectedSize]);

  // Set default product if none is active
  useEffect(() => {
    if (!selectedProd && products.length > 0) {
      setSelectedProd(products[0]);
    }
  }, [products]);

  // Cyberpunk fitting logs interval
  useEffect(() => {
    if (!loadingAI) return;
    const logs = [
      "جاري تحليل البنية الجسدية وملامح الوقوف...",
      "جاري فحص الإضاءة والظلال التفاعلية في صورتك...",
      "جاري ملاءمة خامة نسيج VOOX مع طيات ملابسك الحالية...",
      "خبير المظهر الافتراضي يقيّم التناسق اللوني...",
      "منصة VOOX تحسب أبعاد المظهر بدقة 4K...",
      "جاري كتابة تقرير الملاءمة المتقدم للاتحاد السيبراني..."
    ];
    let logIdx = 0;
    setLoaderLog(logs[0]);

    const interval = setInterval(() => {
      logIdx = (logIdx + 1) % logs.length;
      setLoaderLog(logs[logIdx]);
    }, 2800);

    return () => clearInterval(interval);
  }, [loadingAI]);

  // Handle local file read
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserImage(event.target.result as string);
          setAiError(null);
          setReport(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserImage(event.target.result as string);
          setAiError(null);
          setReport(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dragging garment overlay on canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!userImage) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOffsetStart({ x: xOffset, y: yOffset });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setXOffset(offsetStart.x + dx);
    setYOffset(offsetStart.y + dy);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!userImage || e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setOffsetStart({ x: xOffset, y: yOffset });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;
    setXOffset(offsetStart.x + dx);
    setYOffset(offsetStart.y + dy);
  };

  // Reset overlay offsets
  const handleResetAdjustments = () => {
    setXOffset(0);
    setYOffset(10);
    setRotation(0);
    setOpacity(0.9);
    setSelectedSize("M");
  };

  // Trigger server-side Gemini Fitting Suite analysis
  const handleGenerateAIRecommendation = async () => {
    if (!userImage || !selectedProd) return;
    setLoadingAI(true);
    setAiError(null);
    setReport(null);

    try {
      const response = await fetch("/api/ai/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: userImage,
          productTitle: selectedProd.title,
          productDescription: selectedProd.description,
          gender: gender,
        }),
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || "فشل خادم الذكاء الاصطناعي في الاتصال.");
      }

      const parsedReport: AIStylistReport = await response.json();
      setReport(parsedReport);
    } catch (err: any) {
      console.error("AI Tryon Error:", err);
      setAiError(
        err.message ||
          "حدث خطأ سيبراني أثناء معالجة الصورة. يرجى التحقق من توفر مفتاح GEMINI_API_KEY."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  const activeProductImage =
    selectedProd?.product_images?.[0]?.image_url || "/placeholder.png";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto selection:bg-red-600 selection:text-white">
          {/* Glass blur background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-zinc-950 border border-red-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] z-10 flex flex-col pointer-events-auto h-auto max-h-[90vh]"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Tech Corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-red-500/60 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-red-500/60 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-red-500/60 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-red-500/60 pointer-events-none" />

            {/* Header section with telemetry and close button */}
            <div className="p-6 border-b border-zinc-900 flex justify-between items-start md:items-center gap-4 bg-gradient-to-r from-red-950/20 to-black/20 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[9px] text-red-500 tracking-[0.2em] font-bold uppercase">
                    SECURE_AI_VIRTUAL_FITTING_SUITE_V1
                  </span>
                </div>
                <h2 className="font-sans font-black text-xl md:text-2xl text-zinc-100 tracking-wide">
                  غرفة القياس بالذكاء الاصطناعي
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main content body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: Visual Try-On Editor (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-red-500" />
                    تعديل موضع اللباس على صورتك
                  </span>
                  {userImage && (
                    <button
                      onClick={handleResetAdjustments}
                      className="text-red-500 hover:text-red-400 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Undo className="w-3 h-3" />
                      إعادة ضبط
                    </button>
                  )}
                </div>

                {/* Main Visual Try-On Canvas / Container */}
                <div
                  ref={containerRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex-1 min-h-[380px] md:min-h-[440px] rounded-2xl bg-zinc-950 border overflow-hidden flex flex-col justify-center items-center transition-all ${
                    dragOver
                      ? "border-red-500 bg-red-950/10 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                      : "border-zinc-900 bg-zinc-950"
                  }`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1.5px,transparent_1.5px)] bg-[size:100%_10px] pointer-events-none" />

                  {userImage ? (
                    /* Render fitting canvas with original user portrait + overlaid product */
                    <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
                      <img
                        src={userImage}
                        alt="User portrait"
                        className="w-full h-full object-contain pointer-events-none opacity-80"
                      />

                      {/* Overlaid Streetwear garment */}
                      <div
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        style={{
                          transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
                          opacity: opacity,
                          cursor: isDragging ? "grabbing" : "grab"
                        }}
                        className="absolute w-56 flex justify-center items-center select-none active:scale-95 transition-transform duration-75 cursor-grab shrink-0"
                      >
                        <img
                          src={activeProductImage}
                          alt={selectedProd?.title || "Garment"}
                          className="max-h-56 object-contain pointer-events-none drop-shadow-[0_4px_20px_rgba(239,68,68,0.35)]"
                        />
                        {/* Interactive red dot bounds representing coordinates */}
                        <div className="absolute top-0 left-0 w-2 h-2 rounded-full border border-red-500" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-red-500" />
                      </div>

                      {/* Action tag details overlay */}
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 border border-zinc-900 rounded-lg text-[9px] font-mono tracking-widest text-zinc-400 select-none">
                        ZOOM_FACTOR: {Math.round(scale * 100)}% | PAN: X:{xOffset} Y:{yOffset}
                      </div>

                      {/* Remove image button */}
                      <button
                        onClick={() => {
                          setUserImage(null);
                          setReport(null);
                        }}
                        className="absolute top-3 right-3 p-2 bg-red-950/60 hover:bg-red-650 border border-red-900/40 rounded-xl text-white transition-all cursor-pointer shadow-lg"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Empty state - Upload Trigger */
                    <div className="p-8 text-center space-y-4 max-w-sm flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-red-950/20 border border-red-900/40 flex items-center justify-center text-red-500 animate-pulse">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans font-black text-zinc-100 tracking-wide text-lg">
                          قم بتحميل صورتك الخاصة لقياستها
                        </h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">
                          اسحب صورتك هنا أو انقر لتحديد صورة شخصية واضحة وجيدة الإضاءة لبرنامج الذكاء الاصطناعي.
                        </p>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-950 text-xs font-mono font-bold tracking-widest text-zinc-100 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        CHOOSE_PORTRAIT_IMG
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Adjustments Panel (only visible when user has uploaded an image) */}
                {userImage && (
                  <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                        <span>المقاس وعامل الحجم</span>
                        <span className="text-red-500 font-bold">{Math.round(scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="1.8"
                        step="0.02"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full accent-red-650 rounded-lg cursor-ew-resize opacity-80"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                        <span>قوة المحاذاة الشفافة</span>
                        <span className="text-red-500 font-bold">{Math.round(opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        value={opacity}
                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                        className="w-full accent-red-650 rounded-lg cursor-ew-resize opacity-80"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                        <span>الإزاحة الرأسية (Y-Offset)</span>
                        <span className="text-red-500 font-bold">{yOffset}px</span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        step="1"
                        value={yOffset}
                        onChange={(e) => setYOffset(parseInt(e.target.value))}
                        className="w-full accent-red-650 rounded-lg cursor-ew-resize opacity-80"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                        <span>تعديل زاوية الدوران</span>
                        <span className="text-red-500 font-bold">{rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        step="1"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full accent-red-650 rounded-lg cursor-ew-resize opacity-80"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Product Selector & AI Stylist Analyst (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                {/* Product Select Section */}
                <div className="space-y-4">
                  <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-red-500" />
                    اختر الملابس لتجربتها
                  </span>

                  {/* Horizontal visual catalog picker */}
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {products.map((p) => {
                      const img = p.product_images?.[0]?.image_url || "/placeholder.png";
                      const isSelected = selectedProd?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProd(p);
                            setReport(null);
                          }}
                          className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                            isSelected
                              ? "bg-red-950/20 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                              : "bg-zinc-900/30 border-zinc-900/80 hover:border-red-950 hover:bg-zinc-900/50"
                          }`}
                        >
                          <img
                            src={img}
                            alt={p.title}
                            className="w-10 h-10 object-contain bg-zinc-950 border border-zinc-900 rounded p-1 shrink-0"
                          />
                          <div className="space-y-0.5 overflow-hidden">
                            <h5 className="font-sans font-black text-[10px] text-zinc-100 uppercase tracking-widest truncate">
                              {p.title}
                            </h5>
                            <p className="font-mono text-[9px] text-red-500 font-semibold">
                              {p.price} EGP
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Config settings for try-on (Size, gender) */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">
                        مقاسك المفضل:
                      </label>
                      <div className="flex gap-1">
                        {["S", "M", "L", "XL", "XXL"].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`flex-1 h-7 rounded border font-mono text-[9px] font-bold tracking-widest transition-all cursor-pointer ${
                              selectedSize === sz
                                ? "bg-red-650 border-red-500 text-white"
                                : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-200"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">
                        اختيار الجنس:
                      </label>
                      <div className="flex gap-1">
                        {[
                          { id: "unisex", label: "للجنسين" },
                          { id: "male", label: "رجالي" },
                          { id: "female", label: "نسائي" }
                        ].map((g) => (
                          <button
                            key={g.id}
                            onClick={() => setGender(g.id)}
                            className={`flex-1 h-7 rounded border font-sans text-[9px] font-bold tracking-wider transition-all cursor-pointer ${
                              gender === g.id
                                ? "bg-red-650 border-red-500 text-white"
                                : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-200"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Smart Size Calculator */}
                  <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-xl p-3 space-y-2.5">
                    <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      حاسبة المقاس الذكية (طولك + وزنك)
                    </span>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <label className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest block">الطول (سم)</label>
                        <input
                          type="number"
                          min="140" max="220"
                          placeholder="مثال: 175"
                          value={heightCm}
                          onChange={(e) => {
                            setHeightCm(e.target.value);
                            const h = parseFloat(e.target.value);
                            const w = parseFloat(weightKg);
                            if (h > 100 && w > 20) {
                              const sz = computeSmartSize(h, w);
                              setCalcSize(sz);
                              setSelectedSize(sz);
                            }
                          }}
                          className="w-full h-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 rounded-lg px-2 text-xs text-zinc-200 font-mono outline-none focus:border-red-900 transition-colors"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest block">الوزن (كغ)</label>
                        <input
                          type="number"
                          min="30" max="200"
                          placeholder="مثال: 75"
                          value={weightKg}
                          onChange={(e) => {
                            setWeightKg(e.target.value);
                            const w = parseFloat(e.target.value);
                            const h = parseFloat(heightCm);
                            if (h > 100 && w > 20) {
                              const sz = computeSmartSize(h, w);
                              setCalcSize(sz);
                              setSelectedSize(sz);
                            }
                          }}
                          className="w-full h-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 rounded-lg px-2 text-xs text-zinc-200 font-mono outline-none focus:border-red-900 transition-colors"
                        />
                      </div>
                      {calcSize && (
                        <div className="shrink-0 h-8 px-3 bg-red-950/30 border border-red-500/50 rounded-lg flex items-center justify-center">
                          <span className="font-mono text-xs text-red-400 font-black tracking-widest">{calcSize}</span>
                        </div>
                      )}
                    </div>
                    {calcSize && (
                      <p className="font-sans text-[9px] text-zinc-500 text-right">
                        ✔ تم تحديد مقاس <span className="text-red-400 font-bold">{calcSize}</span> تلقائياً بناءً على قياساتك
                      </p>
                    )}
                  </div>
                </div>

                {/* AI Stylist Analysis Box */}
                <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-5 flex-1 flex flex-col justify-center min-h-[220px]">
                  {loadingAI ? (
                    /* Cyberpunk loading status panel */
                    <div className="space-y-4 text-center">
                      <div className="relative w-12 h-12 mx-auto">
                        <div className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto text-red-500 w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-mono text-zinc-100 text-xs tracking-widest uppercase">
                          AI_STYLING_ENGINE_COMPUTING...
                        </h4>
                        <p className="font-sans text-[11px] text-red-400 font-bold tracking-wide animate-pulse">
                          {loaderLog}
                        </p>
                      </div>
                    </div>
                  ) : report ? (
                    /* Elegant results output */
                    <div className="space-y-4 text-right">
                      {/* Top metrics row */}
                      <div className="flex gap-3 items-center justify-between border-b border-zinc-900/60 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1 px-2.5 bg-red-950/30 border border-red-900/40 rounded-lg text-center font-mono text-xs font-black tracking-widest text-red-500">
                            {report.sizeRecommendation}
                          </div>
                          <span className="font-sans text-[10px] text-zinc-400">المقاس المقترح</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-sans text-[9px] text-zinc-500 block uppercase font-bold">دقة التحليل</span>
                            <span className="font-sans font-black text-xs text-green-500">
                              ثقة: {report.sizeConfidence}%
                            </span>
                          </div>
                          <div className="relative flex items-center justify-center p-2.5 rounded-xl border border-red-500/20 bg-red-950/10 shrink-0">
                            <span className="font-mono text-sm text-red-500 font-extrabold">{report.fitScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Body analysis cards */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-1">
                          <span className="font-mono text-[8px] text-zinc-500 tracking-widest uppercase block">BODY_TYPE</span>
                          <p className="font-sans text-[10px] text-zinc-200 font-bold leading-snug">{report.bodyType}</p>
                        </div>
                        <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-1">
                          <span className="font-mono text-[8px] text-zinc-500 tracking-widest uppercase block">SKIN_TONE_MATCH</span>
                          <p className="font-sans text-[10px] text-zinc-200 font-bold leading-snug">{report.skinToneMatch}</p>
                        </div>
                        <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-1 col-span-2">
                          <span className="font-mono text-[8px] text-zinc-500 tracking-widest uppercase block">MEASUREMENTS_ESTIMATE</span>
                          <p className="font-sans text-[10px] text-zinc-200 font-bold leading-snug">{report.measurementsEstimate}</p>
                        </div>
                        <div className="p-2.5 bg-zinc-950 border border-zinc-900/60 rounded-xl col-span-2 flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                          <p className="font-sans text-[9px] text-zinc-400 text-right">{report.imagQualityNote}</p>
                        </div>
                      </div>

                      {/* Analysis commentary */}
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-zinc-500 block font-bold tracking-[0.1em] uppercase">FIT_ANALYSIS:</span>
                        <p className="font-sans text-xs text-zinc-300 leading-relaxed font-normal">
                          {report.fitterAnalysis}
                        </p>
                      </div>

                      {/* Styling tips bullets */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] text-zinc-500 block font-bold tracking-[0.1em] uppercase">STYLING_PRO_REC:</span>
                        <ul className="space-y-1.5">
                          {report.stylingTips.map((tip, idx) => (
                            <li key={idx} className="flex gap-2 items-start justify-end">
                              <span className="font-sans text-xs text-zinc-400 text-right shrink">{tip}</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Futuristic verdict watermark */}
                      <div className="pt-2 text-center">
                        <div className="inline-block py-1 px-3 bg-red-950/20 border border-red-900/60 rounded text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase">
                          {report.aestheticVerdict}
                        </div>
                      </div>
                    </div>
                  ) : aiError ? (
                    /* Error Feedback */
                    <div className="space-y-3 text-center">
                      <div className="w-10 h-10 rounded-xl border border-red-500 bg-red-950/20 mx-auto flex items-center justify-center text-red-500">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-sans font-black text-red-500 text-xs">تعذر محاكاة الذكاء الاصطناعي</h5>
                        <p className="font-sans text-[10px] text-zinc-500 leading-relaxed">
                          {aiError}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Action Call to compute AI recommended values */
                    <div className="space-y-3 text-center p-4">
                      <Sparkles className="w-6 h-6 text-red-500/80 mx-auto animate-pulse" />
                      <div className="space-y-1">
                        <h5 className="font-sans font-black text-zinc-200 text-xs">استشارة مصمم VOOX الافتراضي</h5>
                        <p className="font-sans text-[10px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
                          يرجى تحميل صورتك أولاً وتحديد المقاس، ثم اضغط على زر التحليل بالأسفل لتلقي تقرير فوري يناسب بنية جسدك وأسلوبك الشخصي.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Process Button */}
                <button
                  disabled={!userImage || loadingAI}
                  onClick={handleGenerateAIRecommendation}
                  className={`w-full h-11 border text-xs font-mono font-bold tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    userImage && !loadingAI
                      ? "bg-red-650 hover:bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : "bg-zinc-900 border-zinc-950 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  GENERATE_AI_LOOK_RECOMMENDATIONS
                </button>
              </div>
            </div>

            {/* Modal system info footer */}
            <div className="p-4 border-t border-zinc-950 bg-black flex justify-between items-center font-mono text-[8px] text-zinc-600 tracking-widest uppercase shrink-0">
              <span className="hidden sm:inline">ALGORITHM: DEEP_STREETWEAR_FITTING_INTEGRATIONS_VOOX</span>
              <span>STATE: ACTIVE_SYS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
