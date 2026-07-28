import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Google GenAI lazily or when endpoint is invoked
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", brand: "KAIRA Jewellery", domain: "kairajewelry.in" });
});

// AI Stylist & Gift Recommender Endpoint
app.post("/api/ai/stylist", async (req, res) => {
  try {
    const { occasion, recipient, stylePreference, budget, notes } = req.body;
    
    const ai = getGeminiClient();
    
    // System instruction & prompt for KAIRA AI Stylist
    const prompt = `You are "Kaira", the AI Jewellery Stylist & Gift Concierge for KAIRA (kairajewelry.in) — a luxury daily-wear jewelry brand specializing in 18k gold-plated, anti-tarnish, waterproof, hypoallergenic stainless steel jewelry.

User Details:
- Occasion: ${occasion || "General Gifting / Daily Wear"}
- Recipient: ${recipient || "Myself or Loved One"}
- Style Preference: ${stylePreference || "Minimalist & Elegant"}
- Budget Target: ${budget ? `₹${budget}` : "flexible"}
- Additional Notes: ${notes || "None"}

Please provide a warm, expert styling response formatted as JSON with the following structure:
{
  "greeting": "Warm 1-sentence personalized welcome from Kaira Concierge",
  "recommendedStyles": ["List of 3 specific jewelry types, e.g. Dainty Heart Layering Necklace, 18k Gold Textured Bangle, Clover Onyx Set"],
  "stylingAdvice": "2-3 sentences explaining how to layer, pair with outfits, or care for these 18k gold plated waterproof pieces.",
  "giftMessage": "A heartfelt, ready-to-use gift card message tailored for the recipient and occasion."
}

Respond ONLY with valid JSON. Do not include markdown code block syntax if possible, just raw JSON or clean JSON string.`;

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      return res.json({
        greeting: `Welcome to KAIRA Concierge! We're delighted to curate pieces for ${recipient || "you"}.`,
        recommendedStyles: [
          "18k Gold Plated Dainty Heart Station Necklace (₹399)",
          "Star Love 18k Gold Starfish Cuff (₹599)",
          "Kaira Clover Onyx 4-Piece Luxury Set (₹1,499)"
        ],
        stylingAdvice: "Pair our anti-tarnish 18k gold pieces with neutral linen, silk blouses, or everyday casuals. Since all KAIRA jewelry is 100% waterproof and sweatproof, you can wear them effortlessly from beach to evening dinners.",
        giftMessage: `To someone who shines brighter every day. May this 18k gold KAIRA piece remind you of how cherished you truly are!`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const textResult = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(textResult);
    } catch {
      parsedData = {
        greeting: "Welcome to KAIRA Jewellery Concierge!",
        recommendedStyles: ["Dainty Heart Station Necklace", "18k Gold Statement Bangle", "Custom Luxury Gift Hamper"],
        stylingAdvice: "All KAIRA pieces feature 18k gold plating over hypoallergenic stainless steel. Perfect for daily layering!",
        giftMessage: "Elegance is an attitude. Wear it with pride."
      };
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/ai/stylist:", err);
    return res.status(500).json({
      error: "Unable to generate AI recommendations right now.",
      details: err?.message || String(err)
    });
  }
});

// AI Virtual Outfit & Layering Matcher
app.post("/api/ai/outfit-match", async (req, res) => {
  try {
    const { outfitDescription, neckline, vibe } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        recommendation: "For a classic neckline, we recommend our Rose Coin Satin 18k Gold Plated Pendant paired with a dainty Star Stuck chain for an effortless 18k gold plated layered look.",
        matchingColorNotes: "Warm 18k gold plating beautifully complements black, white, emerald green, and champagne tones.",
        topPickId: "rose-coin"
      });
    }

    const prompt = `As KAIRA's Virtual Jewelry Assistant, suggest the perfect 18k gold plated jewelry combination for this outfit:
Outfit: ${outfitDescription || "Black blazer / slip dress"}
Neckline: ${neckline || "V-neck / Crew neck"}
Vibe: ${vibe || "Casual Chic / Evening Luxe"}

Return JSON with keys:
{
  "recommendation": "Detailed recommendation string",
  "matchingColorNotes": "Color pairing tips",
  "topPickCategory": "Necklace / Bracelet / Set"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    return res.status(500).json({ error: "Outfit match failed." });
  }
});

// Real-Time Smart Chat Assistant Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const ai = getGeminiClient();

    const systemContext = `You are KAIRA Smart AI Assistant — an expert, friendly jewelry concierge for KAIRA (kairajewelry.in).
IMPORTANT BRAND FACTS TO BE ACCURATE ABOUT:
1. All KAIRA pieces are 18k GOLD PLATED over premium 316L hypoallergenic stainless steel (PVD vacuum plated).
2. They are NOT solid 18k gold — they are luxury 18k GOLD PLATED stainless steel jewelry designed for everyday wear.
3. They are 100% WATERPROOF, SWEATPROOF, ANTI-TARNISH, and come with a 1-Year Anti-Tarnish Guarantee.
4. Prices start under ₹499 (e.g. Disney Mickey 18k Gold Plated Pendant at ₹399, Onyx Heart Pendant at ₹399, Rose Coin Pendant at ₹399).
5. Fast shipping across India (3-5 business days). Free gift packaging & customized handwritten notes available.

Help the user with advice on jewelry care, styling, 18k gold plating details, gift selection, or ordering. Keep replies helpful, concise (2-4 sentences max), polite, and elegant!`;

    if (!ai) {
      // Fallback response generator
      const lower = (message || "").toLowerCase();
      let responseText = "Hello! I am KAIRA Smart AI Chat Assistant. How can I assist you with our 18k gold plated waterproof jewelry collection today?";
      
      if (lower.includes("gold") || lower.includes("real") || lower.includes("plated") || lower.includes("material")) {
        responseText = "All KAIRA pieces are crafted from 316L hypoallergenic stainless steel finished with real 18k Gold PVD Plating. They are 100% waterproof, anti-tarnish, and skin-friendly — providing luxury 18k gold shine at everyday prices!";
      } else if (lower.includes("waterproof") || lower.includes("tarnish") || lower.includes("shower") || lower.includes("swim")) {
        responseText = "Yes! Every single KAIRA piece is 100% waterproof and tarnish-resistant. You can wear them while showering, swimming, working out, or applying perfume without fading.";
      } else if (lower.includes("gift") || lower.includes("box") || lower.includes("note")) {
        responseText = "Our Luxury Gift Hampers (starting at ₹479) include free premium gift boxing, velvet pouches, and a custom handwritten gift note of your choice!";
      }

      return res.json({ text: responseText });
    }

    const chatPrompt = `${systemContext}\n\nUser Question: ${message}\n\nRespond concisely and gracefully:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatPrompt,
    });

    return res.json({ text: response.text || "I am happy to assist you with any questions about KAIRA 18k gold plated jewelry!" });
  } catch (err: any) {
    console.error("Chat error:", err);
    return res.status(500).json({ text: "Sorry, I am temporarily having trouble connecting. Feel free to reach out on WhatsApp!" });
  }
});

// AI Photo Analysis & Pendant Matcher Endpoint
app.post("/api/ai/pendant-match-photo", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    const ai = getGeminiClient();

    const fallbackResult = {
      outfitObservation: "You have a beautiful face cut with defined collarbones and a radiant, confident personality! Your outfit and neck silhouette create a perfect canvas for 18k gold lustre.",
      recommendations: [
        {
          pendantId: "onyx-heart",
          whyItSuitsYou: "👤 FACE CUT & JAWLINE: The sharp, clean heart silhouette softens your jawline and elongates your neck.\n✨ PERSONALITY VIBE: Perfect for your bold, high-fashion aura.\n💰 BUDGET VALUE (₹399): Budget-friendly 18k gold luxury contrast against your skin."
        },
        {
          pendantId: "pearl-wreath",
          whyItSuitsYou: "👤 FACE CUT & JAWLINE: The round pearlescent wreath balances your face proportions with soft grace.\n✨ PERSONALITY VIBE: Matches your timeless, graceful, and sophisticated persona.\n💰 MID-TIER VALUE (₹549): Mid-range 18k gold elegance suitable for work & dinner dates."
        },
        {
          pendantId: "bow-sparkle",
          whyItSuitsYou: "👤 FACE CUT & JAWLINE: The delicate bow and dangling teardrop crystal draw focus along your neck centerline.\n✨ PERSONALITY VIBE: Complements your glamorous, romantic diva energy.\n💰 PREMIUM VALUE (₹649): High-sparkle CZ crystal statement jewelry for special occasions."
        }
      ]
    };

    if (!ai || !imageBase64) {
      return res.json(fallbackResult);
    }

    // Clean base64 string if data URL prefix exists
    let cleanBase64 = imageBase64;
    if (cleanBase64.includes(',')) {
      cleanBase64 = cleanBase64.split(',')[1];
    }

    const prompt = `You are "Kaira", the AI Jewellery, Face Cut & Personal Styling Expert for KAIRA (kairajewelry.in) — a luxury 18k gold-plated, anti-tarnish, waterproof, hypoallergenic stainless steel jewelry brand.

Look closely at the person in this photo: observe their FACE CUT / JAWLINE STRUCTURE (e.g., oval, round, heart-shaped, angular, square, elongated neck), PERCEIVED PERSONALITY & STYLE VIBE (e.g., bold diva, sweet romantic, chic professional, playful boho, minimalist queen), and OUTFIT / NECKLINE (e.g., V-neck, square neck, saree, casual tee).

AVAILABLE KAIRA PENDANTS & NECKLACES CATALOG (ACROSS DIFFERENT PRICE TIERS):
--- BUDGET TIER (₹399) ---
1. id: "disney-mickey" | Name: "Disney Mickey 18k Gold Plated Pendant" | Price: ₹399 | Vibe: Playful, cute, youthful
2. id: "cute-heart" | Name: "Cute Heart Dainty Station 18k Gold Plated Necklace" | Price: ₹399 | Vibe: Delicate, subtle, sweet
3. id: "rose-coin" | Name: "Rose Coin Satin 18k Gold Plated Pendant" | Price: ₹399 | Vibe: Vintage romantic, artistic, textured
4. id: "onyx-heart" | Name: "Onyx Heart Black 18k Gold Plated Pendant" | Price: ₹399 | Vibe: Bold contrast, high fashion, edgy luxury
5. id: "star-stuck" | Name: "Star Stuck North Star Pink Crystal 18k Gold Plated Pendant" | Price: ₹399 | Vibe: Celestial, dreamy, sparkling

--- MID TIER (₹449 - ₹549) ---
6. id: "under-the-sea" | Name: "Under The Sea Shell & Starfish 18k Gold Plated Necklace" | Price: ₹449 | Vibe: Vacation, beachy boho, breezy
7. id: "bloom-bae" | Name: "Bloom Bae Pink Rose Stem 18k Gold Plated Pendant" | Price: ₹499 | Vibe: Sculpted floral, charming, romantic
8. id: "ribbon-drip" | Name: "Ribbon Drip Liquid Gold Plated Bow Pendant" | Price: ₹529 | Vibe: Liquid gold modern art, trendsetter
9. id: "pearl-wreath" | Name: "Pearl Wreath 18k Gold Plated Pendant" | Price: ₹549 | Vibe: Graceful pearl halo, classic royalty

--- PREMIUM TIER (₹649 - ₹699) ---
10. id: "bow-sparkle" | Name: "Bow Sparkle Teardrop Crystal 18k Gold Plated Necklace" | Price: ₹649 | Vibe: Glamorous CZ teardrop, red carpet star
11. id: "rainbow-confetti" | Name: "Rainbow Confetti Gem 18k Gold Plated Necklace" | Price: ₹699 | Vibe: Vibrant multi-gem bezel, festive, statement

STRICT SELECTION MANDATE:
Select EXACTLY 3 pendants from DIFFERENT PRICE TIERS (e.g. 1 from Budget ₹399, 1 from Mid Tier ₹449-₹549, and 1 from Premium Tier ₹649-₹699) so the customer gets a comprehensive choice across budgets!

INSTRUCTIONS FOR ANALYSIS:
1. "outfitObservation": In 2 warm, flattering sentences, explicitly analyze their FACE CUT / JAWLINE, PERCEIVED PERSONALITY VIBE, and OUTFIT/NECKLINE.
2. "whyItSuitsYou" for EACH pendant: Must explicitly cover ALL 3 aspects:
   a) FACE CUT & JAWLINE MATCH: Explain how the pendant shape/length flatters their specific face cut or chin/neck structure.
   b) PERSONALITY VIBE MATCH: Explain why this piece fits their visible style persona.
   c) PRICE VALUE & OUTFIT MATCH: Mention the price tier (e.g. Budget ₹399, Mid-tier ₹549, Premium ₹649) and how it elevates their neckline.

Return ONLY valid JSON matching this schema:
{
  "outfitObservation": "Your elegant V-neckline in dark emerald green creates a gorgeous canvas for 18k gold warm lustre...",
  "recommendations": [
    {
      "pendantId": "rose-coin",
      "whyItSuitsYou": "The textured 18k gold satin finish provides a rich vintage contrast against your emerald green dress, drawing eyes straight to your collarbone."
    },
    {
      "pendantId": "onyx-heart",
      "whyItSuitsYou": "The deep black onyx heart echoes the rich depth of your outfit while the 18k gold bezel adds a striking touch of red-carpet glamour."
    },
    {
      "pendantId": "cute-heart",
      "whyItSuitsYou": "Its dainty station hearts add a subtle romantic sparkle that balances your bold neckline perfectly for both daytime and evening events."
    }
  ]
}`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [imagePart, textPart],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(resultText);
    } catch {
      parsedData = fallbackResult;
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/ai/pendant-match-photo:", err);
    return res.json({
      outfitObservation: "You look lovely in this picture! Our 18k gold plated waterproof pendants are designed to flatter every neckline.",
      recommendations: [
        {
          pendantId: "onyx-heart",
          whyItSuitsYou: "The deep onyx heart bordered in rich 18k gold provides a timeless luxury contrast that instantly elevates your look."
        },
        {
          pendantId: "rose-coin",
          whyItSuitsYou: "Embossed with a delicate wild rose, this 18k gold plated coin pendant catches light gracefully against your neck."
        },
        {
          pendantId: "star-stuck",
          whyItSuitsYou: "The celestial pink crystal starburst adds a romantic, sparkling focal point right at your collarbone."
        }
      ]
    });
  }
});


// Start Express + Vite Middleware / Production Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ KAIRA Jewellery server running at http://localhost:${PORT}`);
  });
}

startServer();
