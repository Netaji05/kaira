import React from 'react';
import { X, ShieldCheck, Droplets, Sparkles, Award, HeartHandshake } from 'lucide-react';

interface CareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareGuideModal: React.FC<CareGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="font-serif font-bold text-lg">KAIRA 18k Gold & Care Guide</h2>
              <p className="text-[11px] text-stone-400">Understanding our Anti-Tarnish & Waterproof Guarantee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-stone-700 leading-relaxed">
          
          {/* Section 1: PVD Technology */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2">
            <h3 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-800" /> What makes KAIRA 100% Anti-Tarnish?
            </h3>
            <p>
              Unlike traditional brass or alloy jewelry that oxidizes into green or brown within weeks, KAIRA pieces are coated using <strong>18k Real Gold PVD (Physical Vapor Deposition)</strong> inside a vacuum chamber. This bonds real 18k gold at an atomic level onto heavy-grade 316L stainless steel.
            </p>
          </div>

          {/* Section 2: Waterproof & Sweatproof */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                <Droplets className="w-4 h-4 text-amber-800" /> 100% Waterproof
              </div>
              <p className="text-[11px] text-stone-600">
                You can shower, swim in salt water or pool chlorine, and exercise without removing your jewelry. Water will not wash away or rust the finish.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                <HeartHandshake className="w-4 h-4 text-amber-800" /> Hypoallergenic & Skin-Safe
              </div>
              <p className="text-[11px] text-stone-600">
                316L Surgical Stainless Steel is 100% nickel-free and lead-free. Perfect for sensitive skin that turns red or itchy with cheap alloys.
              </p>
            </div>
          </div>

          {/* Section 3: 1 Year Warranty */}
          <div className="border border-stone-200 p-4 rounded-2xl space-y-2">
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-800" /> 1-Year Color Guarantee
            </h3>
            <p>
              Every KAIRA purchase comes backed by our 1-Year Color Warranty. In the rare event that your piece suffers manufacturing color fading under normal daily wear, we will replace it free of charge!
            </p>
          </div>

          {/* Section 4: Care Tips */}
          <div className="bg-stone-100 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-stone-900">Pro Care Tips for Lifetime Shine:</h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600">
              <li>Wipe gently with a soft microfiber cloth after heavy perfume or sunscreen application.</li>
              <li>Store individually in a soft dry cloth bag or compartment to prevent micro-scratches.</li>
              <li>Clean occasionally with warm water and mild soap for brilliant diamond-like crystal sparkle.</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-stone-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl transition-all"
          >
            Got It! Return to Store
          </button>

        </div>
      </div>
    </div>
  );
};
