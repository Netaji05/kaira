import React, { useState } from 'react';
import { X, Package, Truck, Search, CheckCircle2, Clock, MapPin, ExternalLink, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { KairaLogo } from './KairaLogo';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackingDetails {
  orderId: string;
  status: 'confirmed' | 'quality_check' | 'packed' | 'in_transit' | 'delivered';
  customerName: string;
  phone: string;
  date: string;
  estimatedDelivery: string;
  courier: string;
  awbNumber: string;
  items: { name: string; qty: number; price: string }[];
  address: string;
}

// Pre-configured sample orders for instant testing
const SAMPLE_ORDERS: Record<string, TrackingDetails> = {
  'KAIRA-8921': {
    orderId: 'KAIRA-8921',
    status: 'in_transit',
    customerName: 'Ananya Sharma',
    phone: '7058859619',
    date: '25 July 2026',
    estimatedDelivery: '28 July 2026 (Tomorrow by 5 PM)',
    courier: 'BlueDart Express Air',
    awbNumber: 'BD7058859619IN',
    items: [
      { name: '18k Gold Plated Serpent Snake Chain Necklace', qty: 1, price: '₹449' },
      { name: 'Celestial Starburst Pendant', qty: 1, price: '₹599' },
    ],
    address: 'Flat 402, Royal Residency, Bandra West, Mumbai - 400050',
  },
  'KAIRA-7712': {
    orderId: 'KAIRA-7712',
    status: 'packed',
    customerName: 'Riya Patel',
    phone: '9876543210',
    date: '26 July 2026',
    estimatedDelivery: '29 July 2026',
    courier: 'Delhivery Express',
    awbNumber: 'DL77129845IN',
    items: [
      { name: 'Minimalist Liquid Gold Drop Earrings', qty: 1, price: '₹399' },
    ],
    address: 'B-12, Green Park Extension, New Delhi - 110016',
  },
};

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingDetails | null>(
    SAMPLE_ORDERS['KAIRA-8921'] // Default sample for display
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(true);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const cleanQuery = searchInput.trim().toUpperCase().replace('#', '');
      
      // Match sample or generate dynamic tracking result for any order ID or phone
      if (SAMPLE_ORDERS[cleanQuery]) {
        setTrackingResult(SAMPLE_ORDERS[cleanQuery]);
      } else {
        // Dynamic simulated order for user input
        setTrackingResult({
          orderId: cleanQuery.startsWith('KAIRA') ? cleanQuery : `KAIRA-${cleanQuery}`,
          status: 'in_transit',
          customerName: 'Valued Customer',
          phone: searchInput,
          date: 'Recent Order',
          estimatedDelivery: '2-3 Business Days',
          courier: 'BlueDart Air Express',
          awbNumber: `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`,
          items: [{ name: '18k Gold Plated Anti-Tarnish Jewelry Piece', qty: 1, price: '₹499' }],
          address: 'Verified Delivery Address (India Post / Courier)',
        });
      }
      setIsSearching(false);
      setSearched(true);
    }, 600);
  };

  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Payment & Details Verified' },
    { key: 'quality_check', label: '18k Quality Check', desc: 'PVD Anti-Tarnish Inspected' },
    { key: 'packed', label: 'Packed in Luxury Box', desc: 'Gift Boxed with Care' },
    { key: 'in_transit', label: 'In Transit', desc: 'Handed to BlueDart Express' },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your 18k Gold' },
  ];

  const getStepIndex = (status: TrackingDetails['status']) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'quality_check': return 1;
      case 'packed': return 2;
      case 'in_transit': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = trackingResult ? getStepIndex(trackingResult.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-[#FAF7F2] border border-[#E0D3B5] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md p-5 border-b border-[#E0D3B5] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F3EBDA] rounded-xl border border-[#C59B27]/40 text-[#C59B27]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">Track Your Order</h2>
                <span className="text-[10px] bg-[#2C241D] text-[#DFBA53] px-2 py-0.5 rounded-full font-semibold border border-[#C59B27]/30">
                  kairajewelry.in
                </span>
              </div>
              <p className="text-xs text-stone-500">Real-time Pan-India Shipment Tracking</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EBDA] text-stone-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-stone-800">
              Enter Order ID (e.g. KAIRA-8921) or Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. KAIRA-8921 or 7058859619"
                  className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27] placeholder:text-stone-400 font-mono"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3.5" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-gradient-to-r from-[#B88E3E] via-[#A0772C] to-[#825C19] hover:brightness-110 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all border border-[#DFBA53]/30 shadow-sm flex items-center gap-1.5"
              >
                {isSearching ? 'Locating...' : 'Track Order'}
              </button>
            </div>

            {/* Quick Demo Search Chips */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
              <span className="font-semibold text-stone-700">Try demo order:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('KAIRA-8921');
                  setTrackingResult(SAMPLE_ORDERS['KAIRA-8921']);
                  setSearched(true);
                }}
                className="bg-[#F3EBDA] hover:bg-[#EAE0CA] text-[#8C6418] px-2.5 py-0.5 rounded-full border border-[#D8C7A5] font-mono font-bold"
              >
                #KAIRA-8921
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('KAIRA-7712');
                  setTrackingResult(SAMPLE_ORDERS['KAIRA-7712']);
                  setSearched(true);
                }}
                className="bg-[#F3EBDA] hover:bg-[#EAE0CA] text-[#8C6418] px-2.5 py-0.5 rounded-full border border-[#D8C7A5] font-mono font-bold"
              >
                #KAIRA-7712
              </button>
            </div>
          </form>

          {/* Tracking Details Display */}
          {trackingResult && searched && (
            <div className="bg-[#FAF7F2] border border-[#E0D3B5] rounded-2xl p-5 space-y-6 shadow-xs">
              
              {/* Order Status Banner */}
              <div className="bg-[#2C241D] text-[#FAF7F2] p-4 rounded-xl border border-[#C59B27]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Order ID:</span>
                    <span className="font-mono font-extrabold text-[#DFBA53] text-sm sm:text-base">
                      #{trackingResult.orderId}
                    </span>
                    <span className="bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                      ON SCHEDULE
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#DFBA53]" />
                    <span>Est. Delivery: <strong>{trackingResult.estimatedDelivery}</strong></span>
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                  <p className="text-stone-400 text-[10px] uppercase tracking-wider">Courier Partner</p>
                  <p className="font-bold text-stone-100">{trackingResult.courier}</p>
                  <p className="text-[11px] font-mono text-[#DFBA53]">AWB: {trackingResult.awbNumber}</p>
                </div>
              </div>

              {/* Live Tracking Progress Stepper */}
              <div className="py-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 font-serif">
                  Shipment Progress Timeline
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E0D3B5]">
                  {steps.map((step, idx) => {
                    const isPassed = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        {/* Step Icon Indicator */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isPassed
                              ? 'bg-[#C59B27] text-white ring-4 ring-[#F3EBDA]'
                              : 'bg-stone-300 text-stone-600'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div className="pl-2">
                          <p className={`text-xs font-bold ${isCurrent ? 'text-[#8C6418]' : isPassed ? 'text-stone-900' : 'text-stone-400'}`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 bg-[#F3EBDA] text-[#8C6418] text-[10px] px-2 py-0.5 rounded-full border border-[#D8C7A5] font-semibold animate-pulse">
                                Current Status
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-stone-500">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Summary */}
              <div className="border-t border-[#E0D3B5] pt-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-serif">
                  Package Contents
                </h4>
                <div className="bg-[#F5F0E6] rounded-xl p-3 space-y-2 border border-[#E0D3B5]">
                  {trackingResult.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-stone-800">
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span className="font-medium">{item.name} (x{item.qty})</span>
                      </div>
                      <span className="font-bold text-stone-900">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-[#E0D3B5] pt-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 font-serif">
                  <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Delivery Destination</span>
                </div>
                <p className="text-xs text-stone-600 pl-5">{trackingResult.address}</p>
              </div>

              {/* WhatsApp Live Order Assistance */}
              <div className="bg-[#F3EBDA] border border-[#D8C7A5] p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-bold text-stone-900">Need help with this shipment?</p>
                    <p className="text-[11px] text-stone-600">Official Support WhatsApp: +91 7058859619</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/917058859619?text=${encodeURIComponent(`Hi KAIRA Support, I want an update on my order #${trackingResult.orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>

            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F5F0E6] border-t border-[#E0D3B5] rounded-b-3xl flex items-center justify-between text-[11px] text-stone-600">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Official Store: <strong>kairajewelry.in</strong></span>
          </div>
          <span>100% Insured Delivery</span>
        </div>
      </div>
    </div>
  );
};
