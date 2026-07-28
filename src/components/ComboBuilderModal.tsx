import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Trash2, ShoppingBag, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/whatsapp';

interface ComboBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  comboTier: 'combo999' | 'combo1399' | 'combo1599';
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

const TIER_DETAILS = {
  combo999: {
    title: 'Combo 999',
    price: 999,
    savingsText: 'Save up to 40%',
    badge: 'Best Value',
  },
  combo1399: {
    title: 'Combo 1399',
    price: 1399,
    savingsText: 'Save up to 45%',
    badge: 'MOST LOVED',
  },
  combo1599: {
    title: 'Combo 1599',
    price: 1599,
    savingsText: 'Save up to 48%',
    badge: 'STATEMENT',
  },
};

export const ComboBuilderModal: React.FC<ComboBuilderModalProps> = ({
  isOpen,
  onClose,
  comboTier,
  products,
  onAddToCart,
}) => {
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'necklaces' | 'bracelets'>('all');

  const tierInfo = TIER_DETAILS[comboTier] || TIER_DETAILS.combo999;

  // Filter products eligible for this combo tier based on price bracket rules
  const eligibleProducts = products.filter((p) => {
    const isCategoryMatch = activeCategory === 'all' || p.category === activeCategory;
    const isTierMatch = 
      comboTier === 'combo999'
        ? p.price <= 399 || p.comboTier === 'combo999'
        : comboTier === 'combo1399'
        ? (p.price > 399 && p.price <= 549) || p.comboTier === 'combo1399'
        : (p.price > 549) || p.comboTier === 'combo1599';

    return isCategoryMatch && isTierMatch;
  });

  // Reset selected items when tier changes
  useEffect(() => {
    setSelectedItems([]);
  }, [comboTier]);

  if (!isOpen) return null;

  const handleToggleProduct = (product: Product) => {
    const existsIndex = selectedItems.findIndex((item) => item.id === product.id);
    if (existsIndex > -1) {
      // Remove item
      setSelectedItems(selectedItems.filter((_, idx) => idx !== existsIndex));
    } else {
      if (selectedItems.length >= 3) {
        return; // Max 3 items reached
      }
      setSelectedItems([...selectedItems, product]);
    }
  };

  const isSelected = (productId: string) => {
    return selectedItems.some((item) => item.id === productId);
  };

  const originalTotalMRP = selectedItems.reduce((sum, item) => sum + (item.mrp || item.price * 2), 0);
  const originalTotalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = Math.max(0, originalTotalPrice - tierInfo.price);

  const handleAddComboToBag = () => {
    if (selectedItems.length < 3) return;

    const bundleTitle = `Mix & Match ${tierInfo.title} (${selectedItems.length} Pieces)`;
    const bundleDescription = `3 Selected 18k Gold Plated Pieces: ${selectedItems.map((i) => i.name).join(' + ')}`;

    const bundleProduct: Product = {
      id: `combo-pack-${comboTier}-${Date.now()}`,
      name: bundleTitle,
      category: 'hampers',
      price: tierInfo.price,
      mrp: originalTotalMRP > 0 ? originalTotalMRP : tierInfo.price * 2,
      rating: 5.0,
      reviewCount: 99,
      image: selectedItems[0]?.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      description: bundleDescription,
      tags: ['Combo Offer', tierInfo.title, '18k Gold Plated', 'Waterproof'],
      inStock: true,
    };

    onAddToCart(bundleProduct, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-stone-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#E0D3B5]">
        
        {/* Header Bar */}
        <div className="bg-[#1C1814] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between border-b border-[#383027] sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D8A62A] text-[#1E1914] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {tierInfo.badge}
              </span>
              <span className="text-amber-400 text-xs font-semibold">{tierInfo.savingsText}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-semibold mt-1 text-[#FAF7F2]">
              Build Your {tierInfo.title} Bundle (Any 3 Pieces for ₹{tierInfo.price})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            aria-label="Close Combo Builder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Slot Selection Bar */}
        <div className="bg-[#F3EBDA] p-3 sm:p-4 border-b border-[#E0D3B5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Selected Pieces ({selectedItems.length}/3)</span>
            </span>
            <span className="text-xs text-stone-600 font-medium">
              {selectedItems.length === 3 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Bundle Complete!
                </span>
              ) : (
                `Pick ${3 - selectedItems.length} more piece${3 - selectedItems.length > 1 ? 's' : ''}`
              )}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[0, 1, 2].map((index) => {
              const item = selectedItems[index];
              return (
                <div
                  key={index}
                  className={`relative rounded-xl border p-2 flex items-center gap-2 transition-all ${
                    item
                      ? 'bg-white border-amber-600 shadow-xs'
                      : 'bg-stone-100/80 border-dashed border-stone-300 items-center justify-center min-h-[64px]'
                  }`}
                >
                  {item ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[11px] font-bold text-stone-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-stone-500 line-through">₹{item.mrp || item.price * 2}</p>
                      </div>
                      <button
                        onClick={() => handleToggleProduct(item)}
                        className="absolute top-1 right-1 p-1 text-stone-400 hover:text-red-600 rounded-full"
                        title="Remove piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 text-stone-400 text-xs font-medium">
                      <Plus className="w-4 h-4" />
                      <span>Slot #{index + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveCategory('necklaces')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'necklaces'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
            }`}
          >
            Necklaces
          </button>
          <button
            onClick={() => setActiveCategory('bracelets')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'bracelets'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
            }`}
          >
            Bracelets & Cuffs
          </button>
        </div>

        {/* Product Selection Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {eligibleProducts.map((product) => {
              const selected = isSelected(product.id);
              const disabled = !selected && selectedItems.length >= 3;

              return (
                <div
                  key={product.id}
                  onClick={() => !disabled && handleToggleProduct(product)}
                  className={`group relative bg-white rounded-xl border p-2.5 transition-all cursor-pointer flex flex-col justify-between ${
                    selected
                      ? 'border-amber-600 ring-2 ring-amber-500/30 bg-amber-50/20'
                      : disabled
                      ? 'opacity-50 cursor-not-allowed border-stone-200'
                      : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100 mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {selected && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-600 text-white p-1 rounded-full shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-semibold text-stone-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Add Button */}
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900">{formatPrice(product.price)}</span>
                      <span className="text-[10px] text-stone-400 line-through ml-1">
                        {formatPrice(product.mrp)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) handleToggleProduct(product);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                        selected
                          ? 'bg-amber-600 text-white'
                          : disabled
                          ? 'bg-stone-200 text-stone-400'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="bg-[#1C1814] text-[#FAF7F2] p-4 border-t border-[#383027] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Combo Total:</span>
              <span className="text-2xl font-serif font-bold text-amber-400">₹{tierInfo.price}</span>
              {originalTotalPrice > 0 && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{originalTotalPrice}
                </span>
              )}
            </div>
            {totalSavings > 0 && (
              <span className="text-[11px] text-emerald-400 font-semibold">
                You Save ₹{totalSavings} with this bundle!
              </span>
            )}
          </div>

          <button
            onClick={handleAddComboToBag}
            disabled={selectedItems.length < 3}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              selectedItems.length === 3
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {selectedItems.length === 3
                ? `ADD COMBO TO BAG (₹${tierInfo.price})`
                : `SELECT 3 PIECES (${selectedItems.length}/3)`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
