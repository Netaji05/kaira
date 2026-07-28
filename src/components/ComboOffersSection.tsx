import React from 'react';
import { Sparkles, ShoppingBag, CheckCircle, Gift } from 'lucide-react';

export interface ComboOffer {
  id: 'combo999' | 'combo1399' | 'combo1599';
  price: number;
  badge?: string;
  piecesCount: number;
  tagline: string;
  savingsText: string;
}

export const COMBO_OFFERS: ComboOffer[] = [
  {
    id: 'combo999',
    price: 999,
    piecesCount: 3,
    tagline: 'Pick any 3 items under ₹399',
    savingsText: 'Save up to 40%',
  },
  {
    id: 'combo1399',
    price: 1399,
    badge: 'MOST LOVED',
    piecesCount: 3,
    tagline: 'Pick any 3 items (₹400 - ₹549)',
    savingsText: 'Save up to 45%',
  },
  {
    id: 'combo1599',
    price: 1599,
    badge: 'STATEMENT',
    piecesCount: 3,
    tagline: 'Pick any 3 items above ₹550',
    savingsText: 'Save up to 48%',
  },
];

interface ComboOffersSectionProps {
  onSelectCombo: (comboId: 'combo999' | 'combo1399' | 'combo1599') => void;
}

export const ComboOffersSection: React.FC<ComboOffersSectionProps> = ({ onSelectCombo }) => {
  return (
    <section id="combo-offers-section" className="py-12 bg-[#222222] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#333333] border border-[#C59B27]/40 text-[#DFBA53] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#DFBA53]" />
            <span>Exclusive Mix & Match Bundles</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#FAF7F2] tracking-wide">
            Build Your Own Combo
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Select any 3 pieces from our 18k gold plated anti-tarnish collection and unlock massive bundle savings!
          </p>
        </div>

        {/* 3 Combo Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {COMBO_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="bg-white text-stone-900 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-lg relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-stone-200"
            >
              {/* Optional Top Pill Badge */}
              <div className="min-h-[28px] mb-2 flex items-center justify-center">
                {offer.badge ? (
                  <span className="bg-[#D8A62A] text-[#1E1914] text-[10px] sm:text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full tracking-widest shadow-xs">
                    {offer.badge}
                  </span>
                ) : null}
              </div>

              {/* Sub-label */}
              <span className="text-stone-500 text-[11px] font-semibold tracking-widest uppercase mb-1">
                ANY {offer.piecesCount} PIECES
              </span>

              {/* Price */}
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                  ₹{offer.price}
                </span>
              </div>

              {/* Tagline & Savings */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                {offer.tagline} · <span className="font-semibold text-amber-800">{offer.savingsText}</span>
              </p>

              {/* Action Button */}
              <button
                onClick={() => onSelectCombo(offer.id)}
                className="w-full bg-[#19243B] hover:bg-[#0F172A] text-white text-xs sm:text-sm font-semibold tracking-wider py-3.5 px-4 rounded-lg uppercase transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#D8A62A]" />
                <span>SHOP THIS COMBO</span>
              </button>
            </div>
          ))}
        </div>

        {/* Features / Guarantee footer */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-center gap-6 text-stone-400 text-xs text-center">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Free Shipping Over ₹999
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 100% Waterproof & Anti-Tarnish
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1 Year Guarantee
          </span>
        </div>

      </div>
    </section>
  );
};
