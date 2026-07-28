import React, { useState } from 'react';
import { PhoneCall, Mail, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Truck, Camera, Instagram } from 'lucide-react';
import { ProductCategory } from '../types';
import { KairaLogo } from './KairaLogo';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenAIStylist: () => void;
  onOpenCareGuide: () => void;
  onOpenOrderTracking?: () => void;
  onOpenPhotoUploader?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAIStylist,
  onOpenCareGuide,
  onOpenOrderTracking,
  onOpenPhotoUploader,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Are KAIRA jewelry pieces genuinely 100% waterproof?',
      a: 'Yes! All KAIRA jewelry pieces feature 18k Gold PVD Vacuum Plating on surgical 316L stainless steel. You can shower, swim, work out, and sweat without removing them.',
    },
    {
      q: 'Will my skin turn green or break out in rash?',
      a: 'Never. Our metals are 100% hypoallergenic, nickel-free, and lead-free. They will never cause green discoloration or allergic skin irritation.',
    },
    {
      q: 'How does WhatsApp ordering work?',
      a: 'When you tap "Order via WhatsApp" or checkout in your bag, your selected items and shipping address pre-fill into a WhatsApp message directly to our official line (+91 7058859619). We confirm payment via UPI/QR and dispatch immediately!',
    },
    {
      q: 'What is the shipping time across India?',
      a: 'We process all orders within 24 hours. Express shipping takes 2-4 business days for metro cities and 3-5 days for other regions. Orders above ₹999 get FREE shipping!',
    },
  ];

  return (
    <footer className="bg-[#1C1712] text-stone-300 pt-16 pb-12 border-t border-[#C59B27]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info with KairaLogo */}
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <KairaLogo size="md" variant="gold" showTagline={true} />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed pt-2">
              Premium 18k gold plated, anti-tarnish, waterproof, hypoallergenic daily wear & luxury gifting jewelry store.
            </p>
            <p className="text-xs text-[#DFBA53] font-medium">
              Official Store: <a href="https://kairajewelry.in" className="underline hover:text-white">kairajewelry.in</a>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-[#DFBA53] uppercase tracking-wider font-serif">Quick Shop</h4>
            <ul className="space-y-2 text-stone-300">
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-[#DFBA53] transition-colors">
                  All 18k Gold Pieces
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('necklaces')} className="hover:text-[#DFBA53] transition-colors">
                  Necklaces & Pendants
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bracelets')} className="hover:text-[#DFBA53] transition-colors">
                  Bracelets & Cuffs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('under499')} className="hover:text-[#DFBA53] text-[#DFBA53] font-semibold transition-colors">
                  Pieces Under ₹499 ✨
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('hampers')} className="hover:text-[#DFBA53] transition-colors">
                  Luxury Gift Hampers
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Care */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-[#DFBA53] uppercase tracking-wider font-serif">Customer Care</h4>
            <ul className="space-y-2 text-stone-300">
              {onOpenOrderTracking && (
                <li>
                  <button onClick={onOpenOrderTracking} className="hover:text-[#DFBA53] transition-colors flex items-center gap-1.5 font-semibold text-[#DFBA53]">
                    <Truck className="w-3.5 h-3.5 text-[#DFBA53]" /> Track Order Shipment
                  </button>
                </li>
              )}
              {onOpenPhotoUploader && (
                <li>
                  <button onClick={onOpenPhotoUploader} className="hover:text-[#DFBA53] transition-colors flex items-center gap-1.5 font-semibold text-[#DFBA53]">
                    <Camera className="w-3.5 h-3.5 text-[#DFBA53]" /> Upload Real Jewellery Photos
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenCareGuide} className="hover:text-[#DFBA53] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DFBA53]" /> 18k Plating & Care Guide
                </button>
              </li>
              <li>
                <button onClick={onOpenAIStylist} className="hover:text-[#DFBA53] transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#DFBA53]" /> Launch KAIRA AI Stylist
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/917058859619"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> WhatsApp: +91 7058859619
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/kaira.jewels4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DFBA53] transition-colors flex items-center gap-1.5 text-[#DFBA53] font-medium"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#DFBA53]" /> Instagram: @kaira.jewels4
                </a>
              </li>
              <li>
                <a href="mailto:Kaira.jewel4@gmail.com" className="hover:text-[#DFBA53] transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Kaira.jewel4@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#DFBA53] uppercase tracking-wider font-serif">Stay Connected</h4>
            <p className="text-xs text-stone-400">
              Subscribe for exclusive secret drop alerts and secret 10% coupon codes.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to KAIRA Secret Drops!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className="w-full bg-[#2B231B] border border-[#C59B27]/40 rounded-lg px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-[#DFBA53]"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#B88E3E] via-[#A0772C] to-[#825C19] text-white font-bold text-xs py-2.5 rounded-lg hover:brightness-110 transition-colors border border-[#DFBA53]/30"
              >
                Join KAIRA Club
              </button>
            </form>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="pt-8 border-t border-[#C59B27]/20 space-y-4">
          <h4 className="text-sm font-bold text-[#DFBA53] uppercase tracking-wider text-center font-serif">
            Frequently Asked Questions
          </h4>
          <div className="max-w-3xl mx-auto space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#261F18] rounded-xl border border-[#C59B27]/25 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-4 py-3 text-left text-xs font-semibold text-stone-200 flex items-center justify-between hover:bg-[#30281F]"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#DFBA53]" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-3 text-[11px] text-stone-300 leading-relaxed border-t border-[#C59B27]/20 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#C59B27]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} KAIRA Jewellery (kairajewelry.in). All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#DFBA53] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#DFBA53] cursor-pointer">Shipping Policy</span>
            <span className="hover:text-[#DFBA53] cursor-pointer">Warranty Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
