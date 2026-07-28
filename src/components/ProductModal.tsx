import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Droplets, Sparkles, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, generateQuickWhatsAppProductLink } from '../utils/whatsapp';
import { DeliveryEstimator } from './DeliveryEstimator';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, giftNote?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [giftNote, setGiftNote] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, giftNote);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image Display */}
        <div className="md:w-1/2 relative bg-stone-100 flex items-center justify-center p-6 min-h-[300px]">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[400px] object-cover rounded-2xl shadow-sm"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <span className="bg-amber-900 text-amber-100 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
              {discountPercent}% OFF
            </span>
            <span className="bg-stone-900 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 18k Gold Plated
            </span>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-4">
          <div>
            <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
              {product.category.toUpperCase()} • 18K GOLD PLATED • ANTI-TARNISH
            </p>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">{product.name}</h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-800">{product.rating} / 5.0</span>
              <span className="text-xs text-stone-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-stone-900">{formatPrice(product.price)}</span>
              <span className="text-sm text-stone-400 line-through">{formatPrice(product.mrp)}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Save {formatPrice(product.mrp - product.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed mb-4">{product.description}</p>

            {/* Guarantees Box */}
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-2 text-xs font-medium text-stone-700 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                <span>316L Surgical Stainless Steel + 18k PVD Gold Coating</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-800 shrink-0" />
                <span>100% Sweatproof, Waterproof & Hypoallergenic</span>
              </div>
              {product.specs?.chainLength && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Chain Length: {product.specs.chainLength}</span>
                </div>
              )}
            </div>

            {/* Delivery Estimator Component */}
            <DeliveryEstimator className="mb-4" />

            {/* Optional Gift Note */}
            <div className="space-y-1 mb-4">
              <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
                <span>Gift Card Message (Optional):</span>
                <span className="text-[10px] text-stone-400">Free Handwritten Card</span>
              </label>
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Write a message for your loved one..."
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold text-stone-800">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-stone-700 hover:bg-stone-200 rounded-l-lg"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-stone-700 hover:bg-stone-200 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                addedToast
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-900 hover:bg-black text-white'
              }`}
            >
              {addedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Added to Shopping Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-amber-400" /> Add to Shopping Bag
                </>
              )}
            </button>

            <a
              href={generateQuickWhatsAppProductLink(product, giftNote)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md text-center"
            >
              <MessageCircle className="w-4 h-4 fill-current text-emerald-200" />
              <span>Instant Buy via WhatsApp (+91 7058859619)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

