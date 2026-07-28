import React from 'react';
import { ShieldCheck, Droplets, Sparkles, Award, Truck, MessageSquare } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#C59B27]" />,
      title: '18k Real Gold Plated',
      desc: 'Heavy PVD vacuum gold coating for lasting mirror polish',
    },
    {
      icon: <Droplets className="w-5 h-5 text-[#C59B27]" />,
      title: '100% Waterproof',
      desc: 'Wear in shower, pool & gym with zero worry',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C59B27]" />,
      title: 'Anti-Tarnish & Skin Safe',
      desc: '316L Surgical stainless steel base — 100% nickel-free',
    },
    {
      icon: <Award className="w-5 h-5 text-[#C59B27]" />,
      title: '1-Year Color Warranty',
      desc: 'Guaranteed no green skin or color fading',
    },
    {
      icon: <Truck className="w-5 h-5 text-[#C59B27]" />,
      title: 'Free Shipping over ₹999',
      desc: 'Fast Pan-India delivery within 2-4 business days',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      title: 'WhatsApp Direct Checkout',
      desc: 'Place orders easily via +91 7058859619',
    },
  ];

  return (
    <section className="bg-[#F5F0E6] border-y border-[#E0D3B5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {trustItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D3B5]/80 shadow-2xs hover:border-[#C59B27] transition-all">
            <div className="p-2.5 bg-[#F3EBDA] rounded-full mb-2">
              {item.icon}
            </div>
            <h4 className="text-xs font-semibold text-stone-900 mb-1">{item.title}</h4>
            <p className="text-[11px] text-stone-600 leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
