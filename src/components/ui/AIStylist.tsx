import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../context/ThemeContext";

interface Message {
  role: "user" | "stylist";
  text: string;
}

const quickQuestions = [
  "ما رأيك في إطلالة كاجوال شتوية؟",
  "أي منتج يناسب البشرة الحنطية؟",
  "كيف أنسق الـ TECH JACKET؟",
  "أريد إطلالة رسمية عصرية",
  "أي الألوان رائجة هذا الموسم؟",
];

export const AIStylist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "stylist", text: "مرحباً بك في ستايل VOOX ✨\nأنا مستشار الموضة الذكي. كيف يمكنني مساعدتك اليوم؟" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const { isDark } = useTheme();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowQuick(false);
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = messages.slice(1).map((m) => ({ role: m.role === "stylist" ? "model" : "user", text: m.text }));

    try {
      const res = await fetch("/api/ai/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "stylist", text: data.text || data.error || "عذراً، حدث خطأ غير متوقع." }]);
    } catch (e) {
      console.warn("AI Stylist fetch failed:", e);
      setMessages((prev) => [...prev, { role: "stylist", text: "عذراً، تعذر الوصول لخادم المساعد حالياً. يرجى المحاولة لاحقاً." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer ${
          isDark ? "bg-[#c4a35a] text-[#1c1814]" : "bg-[#a03232] text-white"
        }`}
        style={{ boxShadow: `0 4px 20px ${isDark ? "rgba(196,163,90,0.3)" : "rgba(160,50,50,0.3)"}` }}
        aria-label="المساعد الذكي"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
          <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"/>
          <path d="M6 10c-2 0-3 1-3 3v1c0 2 1 3 3 3"/>
          <path d="M18 10c2 0 3 1 3 3v1c0 2-1 3-3 3"/>
          <path d="M3 20c0-2 2-4 4-4h10c2 0 4 2 4 4"/>
          <circle cx="9" cy="7" r="0.5" fill="currentColor"/>
          <circle cx="15" cy="7" r="0.5" fill="currentColor"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-24 right-6 z-[90] w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? "bg-[#24201c] border border-[#3a342e]" : "bg-white border border-[#e8ddd3]"
            }`}
            style={{
              boxShadow: isDark
                ? "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(196,163,90,0.08)"
                : "0 20px 60px rgba(45,40,36,0.15), 0 0 40px rgba(160,50,50,0.05)",
            }}
          >
            {/* Header */}
            <div className={`px-5 py-4 flex items-center justify-between ${
              isDark ? "bg-[#1c1814]" : "bg-[#faf6f1]"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isDark ? "bg-[#c4a35a]" : "bg-[#a03232]"
                }`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" width="18" height="18">
                    <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"/>
                    <path d="M6 10c-2 0-3 1-3 3v1c0 2 1 3 3 3"/>
                    <path d="M18 10c2 0 3 1 3 3v1c0 2-1 3-3 3"/>
                    <path d="M3 20c0-2 2-4 4-4h10c2 0 4 2 4 4"/>
                  </svg>
                </div>
                <div>
                  <p className={`font-sans font-bold text-sm ${isDark ? "text-[#f0ece6]" : "text-[#2d2824]"}`}>ستايل VOOX</p>
                  <p className={`font-sans text-[10px] ${isDark ? "text-[#6b635b]" : "text-[#8a8078]"}`}>مساعد الموضة الذكي</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isDark ? "hover:bg-[#3a342e] text-[#a39b93]" : "hover:bg-[#e8ddd3] text-[#8a8078]"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatRef}
              className={`h-[400px] overflow-y-auto p-4 space-y-4 ${
                isDark ? "bg-[#1c1814]" : "bg-[#faf6f1]"
              }`}
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? isDark
                          ? "bg-[#c4a35a] text-[#1c1814]"
                          : "bg-[#a03232] text-white"
                        : isDark
                          ? "bg-[#2a2622] text-[#f0ece6] border border-[#3a342e]"
                          : "bg-white text-[#2d2824] border border-[#e8ddd3]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-4 py-3 ${isDark ? "bg-[#2a2622]" : "bg-white"} border ${isDark ? "border-[#3a342e]" : "border-[#e8ddd3]"}`}>
                    <div className="flex gap-1.5">
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-[#c4a35a]" : "bg-[#a03232]"}`} style={{animationDelay:"0s"}} />
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-[#c4a35a]" : "bg-[#a03232]"}`} style={{animationDelay:"0.15s"}} />
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-[#c4a35a]" : "bg-[#a03232]"}`} style={{animationDelay:"0.3s"}} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            {showQuick && (
              <div className={`px-4 pb-3 ${isDark ? "bg-[#1c1814]" : "bg-[#faf6f1]"}`}>
                <p className={`text-[10px] font-sans font-medium mb-2 ${isDark ? "text-[#6b635b]" : "text-[#8a8078]"}`}>أسئلة سريعة</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isDark
                          ? "border-[#3a342e] text-[#a39b93] hover:border-[#c4a35a] hover:text-[#c4a35a] hover:bg-[#c4a35a]/5"
                          : "border-[#e8ddd3] text-[#8a8078] hover:border-[#a03232] hover:text-[#a03232] hover:bg-[#a03232]/5"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t ${isDark ? "border-[#3a342e] bg-[#24201c]" : "border-[#e8ddd3] bg-white"}`}>
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                isDark ? "bg-[#1c1814] border border-[#3a342e]" : "bg-[#faf6f1] border border-[#e8ddd3]"
              }`}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="اسأل مستشار الموضة..."
                  className={`flex-1 text-sm bg-transparent border-none outline-none placeholder:text-[#b5aba3] ${
                    isDark ? "text-[#f0ece6]" : "text-[#2d2824]"
                  }`}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className={`p-2 rounded-lg transition-all cursor-pointer disabled:opacity-30 ${
                    isDark ? "bg-[#c4a35a] text-[#1c1814] hover:bg-[#d4b36a]" : "bg-[#a03232] text-white hover:bg-[#8a2828]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
