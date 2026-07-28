import React from 'react';
import { Sparkles, ArrowRight, Droplets, ShieldCheck, PhoneCall, Camera, MessageSquareText } from 'lucide-react';

interface HeroBannerProps {
  onShopClick: () => void;
  onOpenAIStylist: () => void;
  onOpenSmartChat?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopClick,
  onOpenAIStylist,
  onOpenSmartChat,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F6F1E7] to-[#FAF7F2] border-b border-[#E8DCB8]">
      
      {/* Editorial Decorative Background Soft Gold Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFBA53]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 bg-[#2C241D] text-[#DFBA53] px-3.5 py-1.5 rounded-full border border-[#C59B27]/40 text-xs font-bold tracking-wider uppercase shadow-xs">
                <span>OFFICIAL STORE: kairajewelry.in</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#F3EBDA] text-[#7A5712] px-4 py-1.5 rounded-full border border-[#D8C7A5] text-xs font-semibold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>18K GOLD PLATED • WATERPROOF • ANTI-TARNISH</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2A231C] tracking-tight leading-[1.15]">
              Everyday Luxe. <br />
              <span className="text-[#9E7824] italic font-normal">18k Gold Plated Elegance.</span>
            </h1>

            {/* Subtext */}
            <p className="text-stone-700 text-sm sm:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Discover non-tarnish, hypoallergenic 18k gold plated jewelry designed for effortless daily wear. Swim, shower, and shine without ever taking them off — backed by our 1-Year Anti-Tarnish Guarantee.
            </p>

            {/* Trust highlights inline */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-medium text-stone-700">
              <span className="flex items-center gap-1.5 bg-[#F3EBDA]/80 px-3 py-1 rounded-md border border-[#E0D3B5]">
                <Droplets className="w-3.5 h-3.5 text-[#9E7824]" /> Swim & Shower Safe
              </span>
              <span className="flex items-center gap-1.5 bg-[#F3EBDA]/80 px-3 py-1 rounded-md border border-[#E0D3B5]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9E7824]" /> 1-Yr Anti-Tarnish Guarantee
              </span>
              <a
                href="https://wa.me/917058859619"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300/80 px-3 py-1 rounded-md hover:bg-emerald-100 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" /> WhatsApp: +91 7058859619
              </a>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onShopClick}
                className="bg-gradient-to-r from-[#B88E3E] via-[#A0772C] to-[#825C19] text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-full shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 border border-[#DFBA53]/30"
              >
                <span>Shop 18k Gold Plated Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenSmartChat && (
                <button
                  onClick={onOpenSmartChat}
                  className="bg-[#FAF7F2] hover:bg-[#F3EBDA] text-stone-900 font-bold text-xs sm:text-sm px-5 py-3 rounded-full border border-[#E0D3B5] shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquareText className="w-4 h-4 text-[#9E7824]" />
                  <span>Smart AI Chat</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column Hero Imagery Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              
              {/* Main Editorial Image Frame */}
              <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FAF7F2] relative bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80"
                  alt="KAIRA 18k Gold Plated Clover Onyx Collection"
                  loading="eager"
                  // @ts-ignore
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Product Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#2A231C]/90 backdrop-blur-md p-4 rounded-xl border border-[#C59B27]/40 text-white flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#DFBA53] font-bold uppercase tracking-wider">KAIRA Bestseller</p>
                    <p className="text-sm font-serif font-semibold text-[#FAF7F2]">Clover Onyx 4-Piece Set</p>
                    <p className="text-xs text-stone-300">₹1,499 <span className="line-through text-stone-400 text-[10px]">₹2,999</span></p>
                  </div>
                  <button
                    onClick={onShopClick}
                    className="bg-[#A0772C] hover:bg-[#825C19] text-white text-xs px-3 py-1.5 rounded-md font-medium"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Secondary Accent Floating Image */}
              <div className="absolute -top-6 -left-6 w-28 h-28 rounded-xl overflow-hidden shadow-xl border-2 border-[#FAF7F2] hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=400&q=80"
                  alt="Star Love Gold Plated Cuff"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

