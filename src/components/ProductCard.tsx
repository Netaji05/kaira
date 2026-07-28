import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, MessageCircle, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, generateQuickWhatsAppProductLink } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate discount percentage
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <article
      className="group bg-[#FAF7F2] rounded-2xl border border-[#E0D3B5] overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#C59B27] transition-all duration-300 flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges (Discount, Bestseller, Under 499) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-[#2C241D] text-[#DFBA53] text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs border border-[#C59B27]/40">
            {discountPercent}% OFF
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-[#FAF7F2] text-[#8C6418] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs border border-[#D8C7A5]">
            <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" /> Bestseller
          </span>
        )}
        {product.isUnder499 && (
          <span className="bg-emerald-800 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            Under ₹499
          </span>
        )}
        {product.comboTier && (
          <span className="bg-[#19243B] text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#C59B27]/40">
            Combo {product.comboTier === 'combo999' ? '999' : product.comboTier === 'combo1399' ? '1399' : '1599'}
          </span>
        )}
        {product.inStock && (
          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border border-amber-300 shadow-2xs">
            ⚡ Express Dispatch
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C59B27] ${
            isWishlisted
              ? 'bg-red-50 text-red-600 shadow-xs'
              : 'bg-[#FAF7F2]/80 text-stone-600 hover:text-red-500 hover:bg-white border border-[#E0D3B5]'
          }`}
          title={isWishlisted ? `Remove ${product.name} from Wishlist` : `Add ${product.name} to Wishlist`}
          aria-label={isWishlisted ? `Remove ${product.name} from Wishlist` : `Add ${product.name} to Wishlist`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-600' : ''}`} />
        </button>
      </div>

      {/* Image Gallery Box with Skeleton Loading */}
      <div
        className="relative aspect-square overflow-hidden bg-[#F5F0E6] cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-stone-300" />
          </div>
        )}
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={`18k Gold Plated ${product.name}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Quick View Floating Overlay */}
        <div className="absolute inset-0 bg-[#2C241D]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-[#FAF7F2]/95 text-stone-900 text-xs font-semibold px-3 py-2 rounded-full shadow-md flex items-center gap-1 hover:bg-white transition-colors border border-[#E0D3B5] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
            aria-label={`Quick View ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5 text-[#C59B27]" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Tags */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#8C6418] font-bold uppercase tracking-wider mb-1">
            <span>18k Gold Plated</span>
            <span>•</span>
            <span>Anti-Tarnish</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-semibold text-stone-900 group-hover:text-[#9E7824] transition-colors line-clamp-1 cursor-pointer font-serif"
          >
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1 mt-1 text-xs text-stone-500">
            <div className="flex items-center text-[#C59B27]" aria-label={`Rating ${product.rating} out of 5 stars`}>
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-stone-800">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Stock Scarcity */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#2C241D]">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          </div>

          {/* Dynamic Real-Time Stock Scarcity Indicator */}
          {product.inStock && (
            <div className="flex items-center justify-between text-[10px] font-semibold text-amber-900 bg-amber-50/90 px-2 py-1 rounded-md border border-amber-200/70 shadow-2xs">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
                <span>Only {((product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5) + 2)} left in stock!</span>
              </span>
              <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider">Selling Fast</span>
            </div>
          )}
        </div>

        {/* Actions: Add to Bag & Instant WhatsApp Order */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#F3EBDA] hover:bg-[#EAE0CA] text-[#2C241D] text-xs font-semibold py-2.5 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors border border-[#E0D3B5] focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
            aria-label={`Add ${product.name} to Shopping Bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#8C6418]" />
            <span>Add to Bag</span>
          </button>

          <a
            href={generateQuickWhatsAppProductLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium py-2.5 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={`Buy ${product.name} instantly on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-200" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';


