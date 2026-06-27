export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url || "";
  const pathname = url.split("?")[0];

  try {
    if (pathname === "/api/health") {
      return res.status(200).json({
        ok: true,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV || "not set",
      });
    }

    if (pathname === "/api/ai/stylist" && req.method === "POST") {
      return await handleStylist(req, res);
    }

    if (pathname === "/api/ai/tryon" && req.method === "POST") {
      return await handleTryon(req, res);
    }

    return res.status(404).json({ error: "Not found" });
  } catch (e: any) {
    console.error("Handler error:", e?.message || e);
    return res.status(500).json({ error: e?.message || "Internal error" });
  }
}

async function handleStylist(req: any, res: any) {
  const { message, history } = req.body || {};
  if (!message) return res.status(400).json({ error: "الرسالة مطلوبة" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "مفتاح Gemini غير مضبوط" });
  }

  let GoogleGenAI: any;
  try {
    const genai = await import("@google/genai");
    GoogleGenAI = genai.GoogleGenAI;
  } catch {
    return res.status(503).json({ error: "مكتبة Gemini غير متوفرة" });
  }

  const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

  const systemPrompt = `أنت "ستايل VOOX" — مساعد الموضة الذكي لعلامة VOOX للأزياء العصرية الفاخرة.
مهمتك تقديم نصائح موضة مخصصة، اقتراح أزياء كاملة، وتحليل الأنماط الشخصية.
كن محترفاً، أنيقاً، وملهماً. استخدم لغة عربية فصيحة سلسة.
تخصصك: الملابس الرجالية والنسائية العصرية، إكسسوارات الموضة، تنسيق الألوان، تحليل الجسم، ومناسبات الموضة.
لدينا منتجات مثل: VOID HOODIE, GLITCH T-SHIRT, SHADOW HOODIE, TECH JACKET, CARGO PANTS.
عند الاقتراح، اذكر أسماء منتجات VOOX المحددة.`;

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "تفهمت! أنا مستعد لتقديم نصائح الموضة." }] },
  ];
  if (history) history.forEach((h: any) => contents.push({ role: h.role, parts: [{ text: h.text }] }));
  contents.push({ role: "user", parts: [{ text: message }] });

  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let response: any;
  for (const model of modelsToTry) {
    try {
      response = await ai.models.generateContent({ model, contents });
      break;
    } catch (e: any) {
      if (e.message?.includes("not support") || e.message?.includes("not found")) continue;
      throw e;
    }
  }
  if (!response) throw new Error("No Gemini model available");
  return res.json({ text: response.text });
}

async function handleTryon(req: any, res: any) {
  return res.status(503).json({ error: "خدمة التجربة غير متوفرة حالياً" });
}
