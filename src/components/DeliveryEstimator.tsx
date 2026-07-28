import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, Clock, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

interface DeliveryEstimatorProps {
  className?: string;
}

// Known Metro prefix patterns for instant accurate region matching
const METRO_PINCODE_PREFIXES: Record<string, { city: string; daysMin: number; daysMax: number }> = {
  '11': { city: 'Delhi NCR Region', daysMin: 2, daysMax: 3 },
  '12': { city: 'Gurugram / Haryana NCR', daysMin: 2, daysMax: 3 },
  '20': { city: 'Noida / Ghaziabad NCR', daysMin: 2, daysMax: 3 },
  '40': { city: 'Mumbai Metropolitan Region', daysMin: 1, daysMax: 2 },
  '41': { city: 'Pune & Western Maharashtra', daysMin: 2, daysMax: 3 },
  '56': { city: 'Bengaluru Tech Corridor', daysMin: 2, daysMax: 3 },
  '50': { city: 'Hyderabad & Secunderabad', daysMin: 2, daysMax: 3 },
  '60': { city: 'Chennai Metropolitan Region', daysMin: 2, daysMax: 3 },
  '70': { city: 'Kolkata Metropolitan Area', daysMin: 2, daysMax: 3 },
  '38': { city: 'Ahmedabad & Gandhinagar', daysMin: 2, daysMax: 3 },
  '30': { city: 'Jaipur & Rajasthan Hub', daysMin: 3, daysMax: 4 },
  '22': { city: 'Lucknow & Central UP', daysMin: 3, daysMax: 4 },
  '16': { city: 'Chandigarh Tri-City', daysMin: 3, daysMax: 4 },
  '68': { city: 'Kochi & Ernakulam', daysMin: 3, daysMax: 4 },
  '45': { city: 'Indore & Malwa Region', daysMin: 3, daysMax: 4 },
  '80': { city: 'Patna & Bihar Central', daysMin: 4, daysMax: 5 },
  '78': { city: 'Guwahati & North-East Air Corridor', daysMin: 4, daysMax: 6 },
  '19': { city: 'Srinagar & J&K Region', daysMin: 4, daysMax: 6 },
};

export const DeliveryEstimator: React.FC<DeliveryEstimatorProps> = ({ className = '' }) => {
  const [pincode, setPincode] = useState(() => {
    try {
      return localStorage.getItem('kaira_user_pincode') || '';
    } catch (e) {
      return '';
    }
  });

  const [inputCode, setInputCode] = useState(pincode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimateResult, setEstimateResult] = useState<{
    city: string;
    dateRange: string;
    codAvailable: boolean;
    shippingFeeText: string;
    courier: string;
  } | null>(null);

  // Helper to format date relative to today
  const getFormattedDate = (addDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + addDays);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDelivery = (code: string) => {
    const clean = code.trim().replace(/\D/g, '');
    if (clean.length !== 6) {
      setError('Please enter a valid 6-digit Indian pincode');
      setEstimateResult(null);
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const prefix = clean.substring(0, 2);
      const matched = METRO_PINCODE_PREFIXES[prefix];

      const daysMin = matched ? matched.daysMin : 3;
      const daysMax = matched ? matched.daysMax : 5;
      const city = matched ? matched.city : `Pincode ${clean} Region`;

      const startDate = getFormattedDate(daysMin);
      const endDate = getFormattedDate(daysMax);

      const result = {
        city,
        dateRange: `${startDate} - ${endDate}`,
        codAvailable: true,
        shippingFeeText: 'FREE Shipping on orders over ₹999',
        courier: matched && matched.daysMin <= 2 ? 'BlueDart Air Express' : 'Delhivery / XpressBees',
      };

      setEstimateResult(result);
      setPincode(clean);
      setLoading(false);

      try {
        localStorage.setItem('kaira_user_pincode', clean);
      } catch (e) {
        // ignore
      }
    }, 450);
  };

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      calculateDelivery(pincode);
    }
  }, []);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    calculateDelivery(inputCode);
  };

  return (
    <div className={`bg-[#FAF7F2] border border-[#E0D3B5] rounded-2xl p-3.5 space-y-3 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs">
          <Truck className="w-4 h-4 text-[#C59B27]" />
          <span>Check Delivery Estimate & Serviceability</span>
        </div>
        <span className="text-[10px] bg-[#2C241D] text-[#DFBA53] px-2 py-0.5 rounded-full font-bold uppercase">
          kairajewelry.in policy
        </span>
      </div>

      {/* Pincode Form */}
      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit Pincode (e.g. 400001)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#8C6418]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2C241D] hover:bg-black text-[#DFBA53] text-xs font-bold px-4 py-1.5 rounded-xl transition-all disabled:opacity-50 shrink-0 border border-[#C59B27]/40 flex items-center gap-1"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              Check <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {/* Result Display */}
      {estimateResult && !loading && (
        <div className="bg-white border border-[#E0C995] rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-start justify-between border-b border-stone-100 pb-2">
            <div>
              <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">
                Delivering to: <span className="text-stone-900">{estimateResult.city}</span>
              </p>
              <p className="text-sm font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Estimated by {estimateResult.dateRange}</span>
              </p>
            </div>

            <button
              onClick={() => {
                setEstimateResult(null);
                setInputCode('');
              }}
              className="text-[10px] text-[#8C6418] font-bold underline hover:text-stone-900"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-stone-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Prepaid Dispatch</span>
            </div>

            <div className="flex items-center gap-1.5 text-stone-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{estimateResult.shippingFeeText}</span>
            </div>

            <div className="flex items-center gap-1.5 text-stone-700 font-medium col-span-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
              <span>Dispatched via {estimateResult.courier} with Anti-Tarnish Seal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
