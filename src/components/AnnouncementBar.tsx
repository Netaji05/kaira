import React from 'react';
import { Sparkles, ShieldCheck, Droplets, PhoneCall, Truck, Globe } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenOrderTracking?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenOrderTracking }) => {
  return (
    <div className="bg-[#201A14] text-[#E8DCB8] text-xs py-2 px-4 border-b border-[#C59B27]/30 font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-5 text-[11px] tracking-wide">
          <span className="flex items-center gap-1.5 text-[#DFBA53] font-bold">
            <Globe className="w-3.5 h-3.5 text-[#DFBA53]" /> kairajewelry.in
          </span>
          <span className="text-[#C59B27]/50">•</span>
          <span className="flex items-center gap-1.5 text-[#E6D7B6]">
            <Sparkles className="w-3.5 h-3.5 text-[#DFBA53]" /> 18k Gold Plated & Anti-Tarnish
          </span>
          <span className="text-[#C59B27]/50">•</span>
          <span className="flex items-center gap-1.5 text-[#E6D7B6]">
            <Droplets className="w-3.5 h-3.5 text-[#DFBA53]" /> 100% Waterproof
          </span>
          <span className="text-[#C59B27]/50">•</span>
          <span className="flex items-center gap-1.5 text-[#E6D7B6]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFBA53]" /> 1 Year Guarantee
          </span>
        </div>

        <div className="mx-auto lg:mx-0 flex items-center gap-3">
          <span className="bg-[#3A3026] text-[#DFBA53] px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-[#C59B27]/40">
            FREE SHIPPING OVER ₹999
          </span>

          {onOpenOrderTracking && (
            <button
              onClick={onOpenOrderTracking}
              className="flex items-center gap-1 text-[#DFBA53] hover:text-white transition-colors text-[11px] font-semibold underline"
            >
              <Truck className="w-3 h-3" /> Track Order
            </button>
          )}

          <a
            href="https://wa.me/917058859619"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#E6D7B6] hover:text-white transition-colors underline text-[11px]"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" /> +91 7058859619
          </a>
        </div>
      </div>
    </div>
  );
};
