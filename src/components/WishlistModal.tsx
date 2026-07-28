import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, MessageCircle, Share2, Copy, Check, Sparkles, Send } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, generateQuickWhatsAppProductLink, generateWhatsAppWishlistShareLink } from '../utils/whatsapp';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getShareableLink = () => {
    const productIds = wishlistedProducts.map((p) => p.id).join(',');
    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://kairajewelry.in';
    return `${baseUrl}?wishlist=${encodeURIComponent(productIds)}`;
  };

  const handleCopyLink = () => {
    const shareUrl = getShareableLink();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Wishlist link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    const shareUrl = getShareableLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My KAIRA Jewellery Wishlist',
          text: `Check out my favorite 18k gold plated jewellery pieces on KAIRA!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or error:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalWishlistValue = wishlistedProducts.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-[#2C241D] text-[#DFBA53] px-5 py-2.5 rounded-2xl shadow-2xl border border-[#C59B27]/50 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-[#C59B27]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <div>
              <h2 className="font-serif font-bold text-lg">Your Wishlist ({wishlistedProducts.length})</h2>
              {wishlistedProducts.length > 0 && (
                <p className="text-[11px] text-amber-200/80 font-medium">
                  Total Value: {formatPrice(totalWishlistValue)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="font-serif text-sm font-semibold text-stone-800">No saved pieces yet</p>
              <p className="text-xs text-stone-400">
                Tap the heart icon on any 18k gold jewelry item to save it here for later.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 bg-stone-50 border border-stone-200 rounded-2xl"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-xl border border-stone-200"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 truncate">{p.name}</h4>
                  <p className="text-[10px] text-amber-800 font-semibold uppercase">18k Gold Plated</p>
                  <p className="text-xs font-bold text-stone-900 mt-1">{formatPrice(p.price)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToCart(p)}
                    className="p-2 bg-stone-900 text-white rounded-xl hover:bg-black text-xs font-medium"
                    title="Move to Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={generateQuickWhatsAppProductLink(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 text-xs font-medium"
                    title="Buy via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  </a>

                  <button
                    onClick={() => onRemoveFromWishlist(p)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-xl"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Share Wishlist Options */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 bg-[#FAF7F2] border-t border-[#E0D3B5] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-stone-700 font-bold">
              <span className="flex items-center gap-1.5 text-stone-900 font-serif">
                <Share2 className="w-4 h-4 text-[#C59B27]" /> Share Your Wishlist
              </span>
              <span className="text-[11px] text-stone-500 font-normal">
                {wishlistedProducts.length} items saved
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* WhatsApp Share Button */}
              <a
                href={generateWhatsAppWishlistShareLink(wishlistedProducts)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Share via WhatsApp</span>
              </a>

              {/* Copy Unique Link or Web Share Button */}
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 bg-stone-900 hover:bg-black text-[#DFBA53] border border-[#C59B27]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C59B27]" />
                    <span>Copy Unique Link</span>
                  </>
                )}
              </button>
            </div>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-1.5 text-[11px] text-stone-600 hover:text-stone-900 font-medium underline flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3 text-[#C59B27]" /> More Share Options (Instagram, Email, Messages)
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

