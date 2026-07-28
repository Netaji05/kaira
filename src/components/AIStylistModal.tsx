import React, { useState } from 'react';
import { X, Sparkles, Send, Gift, Heart, MessageCircle, RefreshCw } from 'lucide-react';
import { AIStylistRecommendation } from '../types';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';

interface AIStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductById?: (id: string) => void;
}

export const AIStylistModal: React.FC<AIStylistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [occasion, setOccasion] = useState('Birthday Gift');
  const [recipient, setRecipient] = useState('Sister');
  const [stylePreference, setStylePreference] = useState('Dainty & Minimalist');
  const [budget, setBudget] = useState('500-1000');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIStylistRecommendation | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          recipient,
          stylePreference,
          budget,
          notes,
        }),
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      setRecommendation({
        greeting: `Welcome to KAIRA Concierge! We're delighted to curate pieces for your ${recipient}.`,
        recommendedStyles: [
          "18k Gold Plated Dainty Heart Station Necklace (₹399)",
          "Star Love 18k Gold Starfish Cuff (₹599)",
          "Kaira Clover Onyx 4-Piece Luxury Set (₹1,499)"
        ],
        stylingAdvice: "Pair our anti-tarnish 18k gold pieces with neutral linen, silk blouses, or everyday casuals. All KAIRA pieces are 100% waterproof and sweatproof.",
        giftMessage: `To someone who shines brighter every day. May this 18k gold KAIRA piece remind you of how cherished you truly are!`
      });
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppConsultLink = () => {
    const text = `Hi KAIRA Concierge! ✨\nI used your AI Gift Finder for a ${occasion} gift for my ${recipient}.\nStyle: ${stylePreference}\nCan you recommend matching 18k gold pieces in stock?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400/20 rounded-full border border-amber-400/40">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-amber-100">KAIRA AI Jewellery Stylist</h2>
              <p className="text-[11px] text-amber-200/80">Personalized gift recommender & layering assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {!recommendation ? (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Answer a few quick questions and Kaira AI will curate the perfect 18k gold jewelry recommendations, styling advice, and a custom gift note!
              </p>

              {/* Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs font-semibold text-stone-800">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-800 focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="Birthday Gift">Birthday Celebration 🎂</option>
                    <option value="Anniversary">Anniversary / Romance 💕</option>
                    <option value="Rakhi / Festive">Festive & Rakhi Special 🎁</option>
                    <option value="Daily Wear Self Gift">Self Care / Daily Wear ✨</option>
                    <option value="Date Night">Date Night / Party Glam 🥂</option>
                    <option value="Beach Vacation">Beach & Swim Vacation 🏖️</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800">Recipient</label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-800 focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="Sister">Sister / Sister-in-law</option>
                    <option value="Best Friend">Bestie / Friend</option>
                    <option value="Partner / Girlfriend / Wife">Girlfriend / Wife / Partner</option>
                    <option value="Mother">Mom / Aunt</option>
                    <option value="Myself">Myself</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800">Style Aesthetic</label>
                  <select
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-800 focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="Dainty & Minimalist">Dainty & Minimalist Layering</option>
                    <option value="Bold Statement">Bold 18k Gold Statement Cuffs</option>
                    <option value="Black Onyx & Clover">Iconic Black Onyx & Clover</option>
                    <option value="Freshwater Pearl & Floral">Pearls & Floral Feminine</option>
                    <option value="Complete Hamper Box">Complete Gift Box Suite</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800">Budget Range</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-800 focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="Under 500">Under ₹500 (Dainty Single Item)</option>
                    <option value="500-1000">₹500 - ₹1,000 (Popular Gift Range)</option>
                    <option value="1000-2000">₹1,000 - ₹2,000 (Luxury Gift Hampers)</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800">Additional Preferences or Vibe</label>
                <input
                  type="text"
                  placeholder="e.g. Loves butterflies, allergic to nickel, needs waterproof jewelry..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-stone-900 hover:bg-black text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-4"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Curating 18k Gold Recommendations...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Get AI Recommendations</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* AI Results View */
            <div className="space-y-5">
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <p className="text-xs font-serif italic text-amber-950">{recommendation.greeting}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-800" /> Recommended Jewelry Pieces
                </h3>
                <div className="space-y-2">
                  {recommendation.recommendedStyles?.map((style, idx) => (
                    <div key={idx} className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800">{style}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">18k Gold</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-800" /> Styling & Layering Tip
                </h3>
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
                  {recommendation.stylingAdvice}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-600" /> Ready-to-use Gift Card Message
                </h3>
                <div className="bg-amber-50/80 border border-amber-300 p-3 rounded-xl text-xs font-serif text-amber-950 italic">
                  "{recommendation.giftMessage}"
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setRecommendation(null)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-3 px-4 rounded-xl"
                >
                  Start New Search
                </button>

                <a
                  href={getWhatsAppConsultLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-center shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-emerald-200" />
                  <span>Consult Stylist on WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
