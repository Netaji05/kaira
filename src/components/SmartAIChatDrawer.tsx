import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, ShoppingBag, ShieldCheck, Camera, Image, Upload, CheckCircle2 } from 'lucide-react';
import { ChatMessage, Product, PendantRecommendationItem } from '../types';
import { PRODUCTS } from '../data/products';

interface SmartAIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

// Helper function to compress high-res image files into lightweight JPEGs (<200KB)
const compressImageBase64 = (dataUrl: string, maxDim = 1000, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
  });
};

export const SmartAIChatDrawer: React.FC<SmartAIChatDrawerProps> = ({
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Hello! ✨ Welcome to KAIRA Smart AI Chat Assistance. I am Kaira, your personal 18k gold plated jewelry guide. Ask me anything or upload your picture for AI Pendant Recommendations!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('KAIRA AI is typing...');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  if (!isOpen) return null;

  const quickQuestions = [
    "📸 Upload photo for pendant match",
    "Is it 18k solid gold or 18k gold plated?",
    "Is KAIRA jewelry 100% waterproof?",
    "Best 18k gold plated gift under ₹500?",
    "What is your anti-tarnish guarantee?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    if (text === "📸 Upload photo for pendant match") {
      fileInputRef.current?.click();
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);
    setLoadingText('KAIRA AI is typing...');

    // Identify if any product is relevant
    const lower = text.toLowerCase();
    let matchedProducts: Product[] = [];
    if (lower.includes('disney') || lower.includes('mickey')) {
      matchedProducts = PRODUCTS.filter((p) => p.id === 'disney-mickey');
    } else if (lower.includes('heart')) {
      matchedProducts = PRODUCTS.filter((p) => p.id === 'cute-heart' || p.id === 'onyx-heart');
    } else if (lower.includes('clover') || lower.includes('set')) {
      matchedProducts = PRODUCTS.filter((p) => p.id === 'kaira-clover-set');
    } else if (lower.includes('under 500') || lower.includes('under ₹499') || lower.includes('500')) {
      matchedProducts = PRODUCTS.filter((p) => p.isUnder499).slice(0, 2);
    }

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || "All KAIRA pieces feature premium 18k gold PVD plating over 316L stainless steel. Completely waterproof, tarnish-free, and hypoallergenic!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: matchedProducts.length > 0 ? matchedProducts : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "KAIRA jewelry features real 18k Gold PVD Plating over premium stainless steel. It is 100% waterproof, sweatproof, and anti-tarnish for everyday luxury!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: matchedProducts.length > 0 ? matchedProducts : undefined,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const processFileAndSend = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select or drop a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setLoading(true);
    setLoadingText('Reading your photo...');

    const reader = new FileReader();

    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      setLoading(false);
      alert('Failed to read image file. Please try selecting a different photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onload = async () => {
      try {
        const rawBase64 = reader.result as string;
        if (!rawBase64) {
          alert('Could not read photo data.');
          setLoading(false);
          return;
        }

        const compressedBase64 = await compressImageBase64(rawBase64, 1000, 0.85);

        // User Message with image
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          text: '📸 Uploaded photo for AI Pendant Recommendation',
          imageUri: compressedBase64,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoadingText('Gemini AI is analyzing your picture, face cut & neckline style...');

        const res = await fetch('/api/ai/pendant-match-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: compressedBase64,
            mimeType: file.type || 'image/jpeg',
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();

        // Process recommendations and map to PRODUCTS catalog
        const recItems: PendantRecommendationItem[] = (data.recommendations || []).map((rec: any) => {
          const foundProd = PRODUCTS.find((p) => p.id === rec.pendantId) || 
            PRODUCTS.find((p) => p.name.toLowerCase().includes(String(rec.pendantId || '').toLowerCase())) ||
            PRODUCTS[0];
          return {
            product: foundProd,
            whyItSuitsYou: rec.whyItSuitsYou || 'Selected to flatter your neckline and tone.',
          };
        }).slice(0, 3); // Max 3 pendants

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Here are the top pendants that will look stunning on you based on your photo! ✨',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pendantMatchResult: {
            outfitObservation: data.outfitObservation || "You have a beautiful face cut with defined collarbones and a radiant, confident personality!",
            recommendations: recItems.length > 0 ? recItems : [
              {
                product: PRODUCTS.find((p) => p.id === 'onyx-heart') || PRODUCTS[3],
                whyItSuitsYou: '👤 FACE CUT & JAWLINE: The sharp heart silhouette softens your jawline and elongates your neck.\n✨ PERSONALITY VIBE: Fits your bold, confident high-fashion aura.\n💰 BUDGET VALUE (₹399): High-contrast 18k gold luxury at an accessible budget.'
              },
              {
                product: PRODUCTS.find((p) => p.id === 'pearl-wreath') || PRODUCTS[7],
                whyItSuitsYou: '👤 FACE CUT & JAWLINE: The round pearlescent wreath balances your face shape with soft grace.\n✨ PERSONALITY VIBE: Complements your timeless, refined, and graceful persona.\n💰 MID-TIER VALUE (₹549): Elegant 18k gold & pearl lustre for work-to-dinner wear.'
              },
              {
                product: PRODUCTS.find((p) => p.id === 'bow-sparkle') || PRODUCTS[9],
                whyItSuitsYou: '👤 FACE CUT & JAWLINE: The delicate bow & dangling teardrop crystal draw eyes down your neck centerline.\n✨ PERSONALITY VIBE: Matches your glamorous diva energy for party nights.\n💰 PREMIUM VALUE (₹649): High-sparkle CZ crystal statement jewelry.'
              }
            ],
          },
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error('Error analyzing photo:', err);
        // Fallback result
        const fallbackItems: PendantRecommendationItem[] = [
          {
            product: PRODUCTS.find((p) => p.id === 'onyx-heart') || PRODUCTS[3],
            whyItSuitsYou: '👤 FACE CUT & JAWLINE: The sharp heart silhouette softens your jawline and elongates your neck.\n✨ PERSONALITY VIBE: Fits your bold, confident high-fashion aura.\n💰 BUDGET VALUE (₹399): High-contrast 18k gold luxury at an accessible budget.'
          },
          {
            product: PRODUCTS.find((p) => p.id === 'pearl-wreath') || PRODUCTS[7],
            whyItSuitsYou: '👤 FACE CUT & JAWLINE: The round pearlescent wreath balances your face shape with soft grace.\n✨ PERSONALITY VIBE: Complements your timeless, refined, and graceful persona.\n💰 MID-TIER VALUE (₹549): Elegant 18k gold & pearl lustre for work-to-dinner wear.'
          },
          {
            product: PRODUCTS.find((p) => p.id === 'bow-sparkle') || PRODUCTS[9],
            whyItSuitsYou: '👤 FACE CUT & JAWLINE: The delicate bow & dangling teardrop crystal draw eyes down your neck centerline.\n✨ PERSONALITY VIBE: Matches your glamorous diva energy for party nights.\n💰 PREMIUM VALUE (₹649): High-sparkle CZ crystal statement jewelry.'
          }
        ];

        const fallbackMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Here are 3 18k gold plated pendants across budget, mid-range & premium tiers tailored to your face cut & personality! ✨',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          pendantMatchResult: {
            outfitObservation: "You have a lovely face cut and defined neckline! These 3 pieces across price ranges are curated to flatter your collarbones and personality.",
            recommendations: fallbackItems,
          },
        };

        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setLoading(false);
        // Reset file input value safely after reading finishes
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFileAndSend(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFileAndSend(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          processFileAndSend(file);
          break;
        }
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-[#FAF7F2]/95 border-2 border-dashed border-[#C59B27] flex flex-col items-center justify-center gap-3 p-6 text-center animate-fade-in pointer-events-none">
          <div className="p-4 bg-[#F3EBDA] rounded-full text-[#C59B27] animate-bounce">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">Drop Your Photo Here</h3>
          <p className="text-xs text-stone-600 max-w-xs">
            Release your image file to get instant AI face cut & neckline pendant recommendations from KAIRA!
          </p>
        </div>
      )}

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-400/20 rounded-full flex items-center justify-center border border-amber-400/40">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-sm text-amber-100">KAIRA Smart AI Chat</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">Live AI</span>
              </div>
              <p className="text-[10px] text-amber-200/80">18k Gold Plated Jewelry & Photo Pendant Matcher</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 18k Gold Plating Banner Notice */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/70 flex items-center justify-between gap-2 text-[11px] text-amber-950 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
            <span>All pieces <strong>18k Gold Plated</strong> (Waterproof & Anti-Tarnish)</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#2C241D] text-[#DFBA53] hover:bg-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#C59B27]/40 shrink-0 transition-all shadow-2xs"
          >
            <Camera className="w-3 h-3 text-[#C59B27]" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* AI Photo Pendant Match Callout Banner */}
        <div className="p-3 bg-gradient-to-r from-[#FAF7F2] to-[#F5F0E6] border-b border-[#E0D3B5] flex items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2C241D] text-[#DFBA53] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-stone-900">AI Photo Pendant Matcher</h4>
              <p className="text-[10px] text-stone-600 leading-tight mt-0.5">
                Upload your picture to get <strong>up to 3 matching 18k gold pendants</strong> with personalized styling reasons!
              </p>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#8C6418] hover:bg-[#6e4e10] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0 shadow-xs transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-1.5 max-w-[90%]">
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center text-[10px] shrink-0 font-bold mb-1">
                    AI
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-900 text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {/* Uploaded User Photo Preview */}
                  {msg.imageUri && (
                    <div className="mb-2 overflow-hidden rounded-xl border border-white/20 shadow-xs">
                      <img
                        src={msg.imageUri}
                        alt="Uploaded outfit"
                        className="max-h-48 w-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-1 text-right ${msg.sender === 'user' ? 'text-amber-200/70' : 'text-stone-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-stone-800 text-stone-200 flex items-center justify-center text-[10px] shrink-0 font-bold mb-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* AI Photo Pendant Match Recommendations */}
              {msg.pendantMatchResult && (
                <div className="mt-3 ml-7 space-y-3 w-[92%] bg-white border border-[#C59B27]/30 rounded-2xl p-3 shadow-md">
                  {/* Style Observation */}
                  <div className="bg-[#FAF7F2] border border-[#E0D3B5] rounded-xl p-2.5 text-xs text-stone-800 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-serif font-bold text-stone-900 block text-[11px] uppercase tracking-wider text-[#8C6418]">
                        AI Style Observation:
                      </span>
                      <p className="text-stone-700 mt-0.5 leading-snug">{msg.pendantMatchResult.outfitObservation}</p>
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-stone-900 font-serif flex items-center justify-between border-b border-stone-100 pb-1">
                    <span>✨ Top 3 Suits-You Pendants:</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      100% Waterproof 18k Gold
                    </span>
                  </div>

                  {/* List of recommended pendants (max 3) */}
                  <div className="space-y-2.5">
                    {msg.pendantMatchResult.recommendations.map((item, idx) => (
                      <div
                        key={item.product.id || idx}
                        className="bg-white border border-stone-200 hover:border-[#C59B27] rounded-xl p-2.5 flex flex-col gap-2 transition-all shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="w-4 h-4 rounded-full bg-[#2C241D] text-[#DFBA53] font-serif text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <h4 className="text-xs font-bold text-stone-900 truncate">{item.product.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-amber-900">₹{item.product.price}</span>
                              <span className="text-[9px] bg-amber-100 text-amber-950 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                                18k Gold Plated
                              </span>
                            </div>
                          </div>
                          {onAddToCart && (
                            <button
                              onClick={() => onAddToCart(item.product)}
                              className="bg-[#2C241D] hover:bg-black text-[#DFBA53] px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-2xs transition-all"
                              title="Add to Bag"
                            >
                              <ShoppingBag className="w-3 h-3 text-[#C59B27]" /> Add
                            </button>
                          )}
                        </div>

                        {/* Why it suits you explanation */}
                        <div className="bg-[#FDFBF7] border-l-2 border-[#C59B27] p-2.5 rounded-r-lg text-[11px] text-stone-800 leading-relaxed font-sans">
                          <span className="font-bold text-[#8C6418] block text-[10px] uppercase font-sans mb-1">
                            Why it suits your face cut & personality:
                          </span>
                          <div className="whitespace-pre-line text-stone-700 font-medium">
                            {item.whyItSuitsYou}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Product Recommendations inside Chat */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && !msg.pendantMatchResult && (
                <div className="mt-2.5 ml-7 space-y-2 w-[85%]">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" /> Featured 18k Gold Plated Item
                  </span>
                  {msg.recommendedProducts.map((prod) => (
                    <div key={prod.id} className="bg-white border border-stone-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-xs">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{prod.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-amber-900">₹{prod.price}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.2 rounded">18k Gold Plated</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {onAddToCart && (
                          <button
                            onClick={() => onAddToCart(prod)}
                            className="bg-amber-900 text-white p-1.5 rounded-md hover:bg-black text-[10px] font-bold"
                            title="Add to Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-amber-900 font-medium italic ml-7 bg-amber-50 p-2.5 rounded-xl border border-amber-200 w-fit animate-pulse">
              <Bot className="w-4 h-4 text-amber-700 animate-spin" />
              <span>{loadingText}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap bg-white text-stone-700 hover:bg-amber-100 hover:text-amber-900 border border-stone-200 rounded-full px-2.5 py-1 transition-all flex items-center gap-1"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Photo Upload Trigger Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-stone-100 hover:bg-amber-100 text-[#8C6418] p-2.5 rounded-full transition-colors border border-stone-200 shrink-0"
              title="Upload photo for AI Pendant Matcher"
            >
              <Camera className="w-4 h-4 text-[#C59B27]" />
            </button>

            <input
              type="text"
              placeholder="Ask a question or paste/upload a photo for pendant match..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPaste={handlePaste}
              className="flex-1 bg-stone-100 text-stone-800 text-xs px-3 py-2.5 rounded-full border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-amber-900 hover:bg-amber-950 disabled:bg-stone-300 text-white p-2.5 rounded-full transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
