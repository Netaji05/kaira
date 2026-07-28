import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  searchQuery,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory === 'necklaces') {
      list = list.filter((p) => p.category === 'necklaces');
    } else if (selectedCategory === 'bracelets') {
      list = list.filter((p) => p.category === 'bracelets');
    } else if (selectedCategory === 'hampers') {
      list = list.filter((p) => p.category === 'hampers');
    } else if (selectedCategory === 'under499') {
      list = list.filter((p) => p.price <= 499 || p.isUnder499);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: 'All Collections' },
    { key: 'under499', label: 'Under ₹499 ✨' },
    { key: 'necklaces', label: 'Necklaces' },
    { key: 'bracelets', label: 'Bracelets & Cuffs' },
    { key: 'hampers', label: 'Luxury Hampers' },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="shop-catalog">
      
      {/* Category Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-[#B88E3E] via-[#A0772C] to-[#825C19] text-white border-[#DFBA53]/30 shadow-xs'
                  : 'bg-[#F5F0E6] text-stone-800 border-[#E0D3B5] hover:bg-[#F3EBDA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-stone-100 text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-800"
          >
            <option value="featured">Featured / Bestsellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Savings</option>
          </select>
        </div>
      </div>

      {/* Item Counter */}
      <div className="py-4 flex items-center justify-between text-xs text-stone-500 font-medium">
        <span>
          Showing <strong className="text-stone-900">{filteredProducts.length}</strong> 18k gold plated pieces
        </span>
        {searchQuery && (
          <span>
            Search results for: "<strong className="text-stone-900">{searchQuery}</strong>"
          </span>
        )}
      </div>

      {/* Product Grid Layout */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <Sparkles className="w-8 h-8 text-amber-800 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-stone-800 mb-1">No jewelry pieces found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            We couldn't find any pieces matching your search or category criteria.
          </p>
          <button
            onClick={() => onSelectCategory('all')}
            className="bg-amber-900 text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-amber-950"
          >
            Clear Filters & View All
          </button>
        </div>
      )}
    </section>
  );
};
