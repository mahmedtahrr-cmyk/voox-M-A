import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

export async function createApp() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" },
        },
      })
    : null;

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      envKeys: Object.keys(process.env).filter(k => !k.toLowerCase().includes("key") && !k.toLowerCase().includes("token") && !k.toLowerCase().includes("secret")).sort(),
    });
  });

  app.post("/api/ai/tryon", async (req, res) => {
    try {
      const { userImage, productTitle, productDescription, gender } = req.body;

      if (!userImage) {
        return res.status(400).json({ error: "No user image supplied." });
      }

      if (!ai) {
        return res.status(503).json({
          error: "مفتاح Gemini غير مضبوط. يرجى الذهاب إلى https://aistudio.google.com/app/apikey للحصول على مفتاح مجاني ثم وضعه في ملف .env في المتغير GEMINI_API_KEY",
        });
      }

      const geminiKey = process.env.GEMINI_API_KEY || '';
      if (geminiKey.startsWith('sb_') || geminiKey.startsWith('pk_') || geminiKey.startsWith('sk_') || geminiKey.length < 20) {
        return res.status(400).json({
          error: "⚠️ مفتاح API خاطئ! المفتاح الحالي يبدو أنه مفتاح Supabase أو Stripe. للحصول على مفتاح Gemini الصحيح:\n1. اذهب إلى: https://aistudio.google.com/app/apikey\n2. انقر 'Create API Key'\n3. انسخ المفتاح وضعه في ملف .env في السطر: GEMINI_API_KEY=\"AIza...\"\n4. أعد تشغيل الخادم",
        });
      }

      let base64Data = userImage;
      let mimeType = "image/jpeg";

      if (userImage.includes(";base64,")) {
        const parts = userImage.split(";base64,");
        mimeType = parts[0].split(":")[1] || "image/jpeg";
        base64Data = parts[1];
      }

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const systemPrompt = `أنت د. أيزور — كبير مصممي الذكاء الاصطناعي الافتراضي لدى علامة VOOX الفاخرة لملابس الشوارع العصرية. تمتلك دقة تحليل يصل إلى 97% في قراءة الصور البشرية وتقدير الملاءمة اللباسية.

قام العميل بتحميل صورته لتجربة المنتج التالي من VOOX:
- اسم المنتج: "${productTitle}"
- وصف المنتج الكامل: "${productDescription}"
- التوجه الجنسي للمنتج: "${gender || 'unisex'}"

مهمتك الدقيقة والمتقدمة:
1. افحص الصورة بعناية شديدة: تحليل بنية الجسم (نحيف / متوسط / رياضي / ممتلئ), الطول التقديري من الإطار, شكل الكتفين ونسبة الخصر للأرداف, لون البشرة الدقيق (ذهبي / قمحي / عسلي / زيتوني / فاتح / غامق), الوضعية العامة, وجودة الإضاءة في الصورة.
2. قارن هذه الخصائص مع قصة المنتج وخاماته وتصميمه البصري.
3. حدد المقاس الأنسب بدقة هندسية بناءً على التحليل الجسدي.
4. قيّم التناسق اللوني بين بشرة العميل وألوان تصميم المنتج (تناسق لوني بارد/دافئ).
5. أعطِ نصائح تنسيق مخصصة تماماً لهذا الجسم وهذا المنتج تحديداً مع مقترحات VOOX المكملة.
6. قيّم مدى جاهزية الصورة للتحليل الدقيق (إضاءة، وضوح، زاوية التصوير).

استجب بـ JSON دقيق ومطابق 100% للهيكل التالي (جميع النصوص بالعربية الفصحى الاحترافية فقط):
{
  "fitScore": number من 0 إلى 100 (درجة ملاءمة هذا المنتج تحديداً لهذا الجسم تحديداً),
  "sizeRecommendation": string ("S" أو "M" أو "L" أو "XL" أو "XXL"),
  "sizeConfidence": number من 0 إلى 100 (نسبة ثقتك في المقاس المقترح بناءً على وضوح الصورة وكمية المعطيات),
  "bodyType": string (تصنيف بنية الجسم: مثال "نحيف ممشوق" أو "رياضي متوازن" أو "ممتلئ بكتفين عريضة"),
  "skinToneMatch": string (وصف تناسق لون البشرة مع ألوان المنتج: مثال "تناسق ممتاز — اللون الأحمر يُبرز البشرة الذهبية"),
  "measurementsEstimate": string (تقدير القياسات العامة من الصورة: مثال "طول تقديري 175-180 سم، صدر واسع نسبياً، خصر معتدل"),
  "imagQualityNote": string (تقييم جودة الصورة للتحليل: مثال "إضاءة ممتازة وزاوية أمامية مثالية للتحليل"),
  "stylingTips": array of exactly 4 strings (4 نصائح تنسيق مخصصة ومفصلة لهذا الجسم مع هذا المنتج تحديداً, اذكر في كل نصيحة منتجات VOOX مكملة محددة),
  "fitterAnalysis": string (تحليل مفصل من 4-5 جمل متكاملة يصف بدقة كيف سيبدو هذا المنتج على هذا الجسم تحديداً — اذكر تأثير قصة الكتف والطول وخامة القماش ولون المنتج على المظهر العام),
  "aestheticVerdict": string (عبارة حكم نهائي قوية ومثيرة بالإنجليزية مثل: "VOID HOODIE — CONFIRMED STREETWEAR AUTHORITY" أو "GLITCH APPROVED — CYBER OPERATOR TIER")
}`;

      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      let response;
      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: [imagePart, { text: systemPrompt }],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  fitScore: { type: Type.INTEGER },
                  sizeRecommendation: { type: Type.STRING },
                  sizeConfidence: { type: Type.INTEGER },
                  bodyType: { type: Type.STRING },
                  skinToneMatch: { type: Type.STRING },
                  measurementsEstimate: { type: Type.STRING },
                  imagQualityNote: { type: Type.STRING },
                  stylingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fitterAnalysis: { type: Type.STRING },
                  aestheticVerdict: { type: Type.STRING },
                },
                required: [
                  "fitScore", "sizeRecommendation", "sizeConfidence",
                  "bodyType", "skinToneMatch", "measurementsEstimate",
                  "imagQualityNote", "stylingTips", "fitterAnalysis", "aestheticVerdict"
                ],
              },
            },
          });
          break;
        } catch (e: any) {
          if (e.message?.includes("not support") || e.message?.includes("not found") || e.message?.includes("unsupported")) continue;
          throw e;
        }
      }
      if (!response) throw new Error("No image-capable Gemini model available. Try a different API key or region.");
      const responseText = response.text || "{}";
      const payload = JSON.parse(responseText.trim());

      return res.json(payload);
    } catch (error: any) {
      console.error("Error in AI TryOn Endpoint:", error);
      return res.status(500).json({
        error: error.message || "An exception occurred inside the server-side Gemini client during try-on analysis.",
      });
    }
  });

  // AI Stylist — text-based fashion advice using Gemini
  app.post("/api/ai/stylist", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) return res.status(400).json({ error: "الرسالة مطلوبة" });
      if (!ai) return res.status(503).json({ error: "مفتاح Gemini غير مضبوط" });

      const systemPrompt = `أنت "ستايل VOOX" — مساعد الموضة الذكي لعلامة VOOX للأزياء العصرية الفاخرة.
مهمتك تقديم نصائح موضة مخصصة، اقتراح أزياء كاملة، وتحليل الأنماط الشخصية.
كن محترفاً، أنيقاً، وملهماً. استخدم لغة عربية فصيحة سلسة.
تخصصك: الملابس الرجالية والنسائية العصرية، إكسسوارات الموضة، تنسيق الألوان، تحليل الجسم، ومناسبات الموضة.
لدينا منتجات مثل: VOID HOODIE, GLITCH T-SHIRT, SHADOW HOODIE, TECH JACKET, CARGO PANTS.
عند الاقتراح، اذكر أسماء منتجات VOOX المحددة.`;

      const contents = [{ role: "user", parts: [{ text: systemPrompt }] }, { role: "model", parts: [{ text: "تفهمت! أنا مستعد لتقديم نصائح الموضة." }] }];
      if (history) history.forEach((h: any) => contents.push({ role: h.role, parts: [{ text: h.text }] }));
      contents.push({ role: "user", parts: [{ text: message }] });

      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      let response;
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
    } catch (e: any) {
      console.error("AI Stylist error:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  return app;
}
