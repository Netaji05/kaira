import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  MessageSquareText,
  CheckCircle2,
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'quality' | 'shipping' | 'returns' | 'payment';
  question: string;
  answer: string;
}

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'quality',
    question: 'Is KAIRA Jewellery made of real 18k gold?',
    answer:
      'Yes, all KAIRA jewellery pieces feature premium 18k real gold PVD (Physical Vapor Deposition) plating over surgical-grade 316L stainless steel. This gives them the exact rich shine and luster of solid gold at an accessible price.',
  },
  {
    id: 'faq-2',
    category: 'quality',
    question: 'Is KAIRA jewellery truly waterproof and anti-tarnish?',
    answer:
      '100% Yes! Our advanced 18k gold PVD vacuum coating bonding process makes every piece 100% waterproof, sweatproof, perfume-resistant, and anti-tarnish. You can wear your jewellery in the shower, pool, gym, or ocean without any color fading or tarnish.',
  },
  {
    id: 'faq-3',
    category: 'quality',
    question: 'Is the jewellery safe for sensitive skin (hypoallergenic)?',
    answer:
      'Absolutely. All KAIRA pieces are 100% nickel-free, lead-free, and cadmium-free. We use hypoallergenic 316L surgical stainless steel as the core base metal, preventing green skin or allergic skin reactions.',
  },
  {
    id: 'faq-4',
    category: 'shipping',
    question: 'How long does delivery take across India?',
    answer:
      'We dispatch all orders within 24 hours. Standard express insured shipping takes 2 to 5 business days depending on your location. Metro cities (Mumbai, Delhi, Bangalore, etc.) usually receive packages in 2-3 days.',
  },
  {
    id: 'faq-5',
    category: 'shipping',
    question: 'Is shipping free on orders?',
    answer:
      'We offer FREE express insured shipping across India on all orders over ₹999! For orders under ₹999, a nominal flat shipping fee applies.',
  },
  {
    id: 'faq-6',
    category: 'payment',
    question: 'What payment options do you accept? Is Cash on Delivery (COD) available?',
    answer:
      'We strictly accept 100% prepaid orders only. Cash on Delivery (COD) is not available. We support all major instant prepaid payment options including Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards, and Net Banking for fast dispatch.',
  },
  {
    id: 'faq-7',
    category: 'returns',
    question: 'What is your return & exchange policy?',
    answer:
      'We offer a 7-day hassle-free exchange policy for any transit damage or manufacturing defect. If you receive a damaged piece, simply reach out to our WhatsApp support team with an unboxing photo or video for immediate replacement.',
  },
  {
    id: 'faq-8',
    category: 'returns',
    question: 'Does KAIRA Jewellery come with a warranty?',
    answer:
      'Yes! Every item comes with our Anti-Tarnish Guarantee card included inside our luxurious signature gift packaging box.',
  },
];

interface FAQSectionProps {
  onOpenSmartChat?: () => void;
  onOpenCareGuide?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenSmartChat, onOpenCareGuide }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  // Filter FAQs based on active category & search query
  const filteredFaqs = INITIAL_FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamically generate and inject JSON-LD FAQPage schema into <head>
  useEffect(() => {
    let script = document.getElementById('jsonld-faqpage') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'jsonld-faqpage';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': 'https://kairajewelry.in/#faqpage-dynamic',
      'url': 'https://kairajewelry.in/#faq',
      'name': 'KAIRA Jewellery - Frequently Asked Questions (FAQ)',
      'description':
        'Frequently asked questions about KAIRA Jewellery 18k Gold Plated, Anti-Tarnish, Waterproof Jewellery, Shipping, Prepaid Payments, and Returns.',
      'mainEntity': filteredFaqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    };

    script.text = JSON.stringify(faqSchema);
  }, [filteredFaqs]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'quality', label: '18k Gold & Anti-Tarnish', icon: ShieldCheck },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'payment', label: 'Prepaid Payment Modes', icon: CreditCard },
    { id: 'returns', label: 'Returns & Warranty', icon: RotateCcw },
  ];

  return (
    <section id="faq-section" className="py-16 bg-[#FAF7F2] border-t border-b border-[#E0D3B5]/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#8C6418] text-xs font-bold px-3 py-1.5 rounded-full border border-[#C59B27]/40 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Everything you need to know about our 18k Gold Plated, Anti-Tarnish & Waterproof Jewellery.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. waterproof, COD, delivery)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6418] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2C241D] text-[#DFBA53] shadow-md border border-[#DFBA53]/30'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-stone-200 p-6">
            <HelpCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No questions found matching "{searchQuery}"</p>
            <p className="text-xs text-stone-500 mt-1">Try searching for different keywords or ask our AI assistant.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-3 text-xs font-bold text-[#8C6418] underline hover:text-[#5C410E]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-[#C59B27]/50 transition-all overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-4 sm:px-5 flex items-center justify-between gap-3 focus:outline-none"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#8C6418]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 mt-1">
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Prompt / Live Chat Option */}
        <div className="mt-10 bg-[#2C241D] text-[#FAF7F2] rounded-2xl p-6 text-center shadow-lg border border-[#C59B27]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="text-sm font-bold text-[#DFBA53] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#DFBA53]" />
              Still have a question?
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              Ask our 24/7 Smart AI Stylist or check our 18k Gold Waterproof Care Guide.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenCareGuide && (
              <button
                onClick={onOpenCareGuide}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-all border border-stone-700"
              >
                Care Guide
              </button>
            )}
            {onOpenSmartChat && (
              <button
                onClick={onOpenSmartChat}
                className="px-4 py-2 bg-gradient-to-r from-[#C59B27] to-[#8C6418] hover:brightness-110 text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Ask AI Assistant</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
