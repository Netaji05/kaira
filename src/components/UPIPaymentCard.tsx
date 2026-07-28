import React, { useState } from 'react';
import { Copy, Check, QrCode, ExternalLink, ShieldCheck, Smartphone, Download } from 'lucide-react';
import { formatPrice } from '../utils/whatsapp';

interface UPIPaymentCardProps {
  amount?: number;
  onPaymentDone?: () => void;
  className?: string;
}

export const UPIPaymentCard: React.FC<UPIPaymentCardProps> = ({
  amount,
  onPaymentDone,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const upiId = 'aryaanushka67@oksbi';
  const name = 'Potato Cake';
  const phone = '9172187501';
  const bank = 'Kotak Mahindra Bank 0010';

  // Construct UPI Intent URL for mobile UPI apps
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&cu=INR${
    amount ? `&am=${amount}` : ''
  }`;

  // QR Code Image URL using qrserver API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    upiUri
  )}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-[#18181B] text-white border border-[#C59B27]/40 rounded-3xl p-5 shadow-2xl space-y-4 font-sans ${className}`}
    >
      {/* Top Header Avatar & Name */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-sm shadow-md ring-2 ring-red-400/30">
            P
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
              <span>{name}</span>
              <span className="text-[10px] bg-[#2C241D] text-[#DFBA53] px-2 py-0.5 rounded-full border border-[#C59B27]/30">
                Verified Merchant
              </span>
            </h3>
            <p className="text-[11px] text-stone-400">Official KAIRA Jewellery Payment</p>
          </div>
        </div>

        {amount && amount > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Amount Due</p>
            <p className="text-base font-extrabold text-[#DFBA53]">{formatPrice(amount)}</p>
          </div>
        )}
      </div>

      {/* QR Code Canvas Box - Styled like GPay / Google Pay dark interface */}
      <div className="bg-[#27272A] p-4 rounded-2xl border border-stone-700/60 flex flex-col items-center justify-center text-center space-y-3">
        <div className="relative group">
          <div className="p-3 bg-white rounded-2xl shadow-xl ring-4 ring-[#C59B27]/20 flex items-center justify-center">
            <img
              src={qrCodeImageUrl}
              alt={`Scan UPI QR code to pay ${name}`}
              className="w-48 h-48 object-contain rounded-lg"
            />
          </div>
          {/* GPay badge indicator */}
          <div className="absolute -bottom-2 bg-stone-900 border border-stone-700 px-3 py-0.5 rounded-full text-[10px] text-stone-300 flex items-center gap-1 shadow-md">
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>GPay • PhonePe • Paytm • BHIM</span>
          </div>
        </div>

        <p className="text-xs text-stone-300 font-medium pt-2">
          Scan to pay with any UPI app
        </p>

        {/* Bank details badge */}
        <div className="w-full bg-[#18181B] border border-stone-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-900/80 border border-blue-500/40 flex items-center justify-center text-[10px] font-bold text-blue-200">
              K
            </div>
            <span className="font-medium">{bank}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">Ready</span>
        </div>

        {/* UPI ID Copy Bar */}
        <div className="w-full bg-[#1F1F23] border border-stone-700/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-stone-400">UPI ID</span>
            <span className="font-mono font-bold text-[#DFBA53] select-all text-xs sm:text-sm">
              {upiId}
            </span>
          </div>
          <button
            onClick={handleCopyUPI}
            className="flex items-center gap-1 bg-[#2C241D] hover:bg-[#3E332A] text-[#DFBA53] border border-[#C59B27]/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Phone number */}
        <div className="w-full text-center pt-1 border-t border-stone-800">
          <p className="text-xs text-stone-400">
            Mobile / WhatsApp Pay Number: <span className="font-semibold text-stone-200 font-mono">+91 {phone}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <a
          href={upiUri}
          className="w-full bg-gradient-to-r from-[#B88E3E] via-[#A0772C] to-[#825C19] hover:brightness-110 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md border border-[#DFBA53]/30"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Pay Directly via UPI App</span>
        </a>

        {onPaymentDone && (
          <button
            onClick={onPaymentDone}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>I Have Completed Payment</span>
          </button>
        )}
      </div>

      {/* Security Guarantee Note */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
        <span>Secured 256-bit Encrypted UPI Payment Gateway</span>
      </div>
    </div>
  );
};
