import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Sparkles, Menu, X, ShieldCheck, Camera, MessageSquareText, Truck, User, LogIn } from 'lucide-react';
import { ProductCategory, AuthUser } from '../types';
import { KairaLogo } from './KairaLogo';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAIStylist: () => void;
  onOpenCareGuide: () => void;
  onOpenSmartChat?: () => void;
  onOpenComboBuilder?: (tier?: 'combo999' | 'combo1399' | 'combo1599') => void;
  onOpenOrderTracking?: () => void;
  onOpenPhotoUploader?: () => void;
  onOpenUserProfile?: () => void;
  onOpenAuth?: () => void;
  currentUser?: AuthUser | null;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAIStylist,
  onOpenCareGuide,
  onOpenSmartChat,
  onOpenComboBuilder,
  onOpenOrderTracking,
  onOpenPhotoUploader,
  onOpenUserProfile,
  onOpenAuth,
  currentUser,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DCB8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-[#997320] rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Official Brand Logo Component */}
          <div className="py-2">
            <KairaLogo
              size="md"
              variant="gold"
              showTagline={true}
              onClick={() => onSelectCategory('all')}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-800">
            <button
              onClick={() => onSelectCategory('all')}
              className="hover:text-[#997320] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]"
            >
              All Pieces
            </button>
            <button
              onClick={() => onSelectCategory('necklaces')}
              className="hover:text-[#997320] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]"
            >
              Necklaces
            </button>
            <button
              onClick={() => onSelectCategory('bracelets')}
              className="hover:text-[#997320] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]"
            >
              Bracelets & Cuffs
            </button>
            <button
              onClick={() => onSelectCategory('under499')}
              className="text-[#8C6418] font-semibold hover:text-[#B88E3E] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27] flex items-center gap-1"
            >
              <span>Under ₹499</span>
              <span className="text-[10px] bg-[#F3EBDA] text-[#8C6418] px-1.5 py-0.5 rounded-full border border-[#D8C7A5]">LUXE</span>
            </button>

            {/* Combo Offers Button */}
            {onOpenComboBuilder && (
              <button
                onClick={() => onOpenComboBuilder('combo999')}
                className="flex items-center gap-1 text-[#19243B] font-bold bg-[#F3EBDA] hover:bg-[#EADBBD] px-2.5 py-1 rounded-full text-xs border border-[#C59B27]/40 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Combos (3 for ₹999)</span>
              </button>
            )}

            {/* Smart AI Chat Button */}
            {onOpenSmartChat && (
              <button
                onClick={onOpenSmartChat}
                className="flex items-center gap-1.5 text-stone-800 hover:text-[#997320] transition-colors text-xs font-semibold py-1"
              >
                <MessageSquareText className="w-4 h-4 text-[#C59B27]" />
                <span>Smart AI Chat</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input Bar (Desktop) */}
            <div className="relative hidden md:block w-36 lg:w-48">
              <input
                type="text"
                placeholder="Search 18k gold..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F0E6] text-stone-800 text-xs pl-8 pr-3 py-1.5 rounded-full border border-[#E0D3B5] focus:outline-none focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27] placeholder:text-stone-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2" />
            </div>

            {/* 18k Care Guide Button */}
            <button
              onClick={onOpenCareGuide}
              className="hidden sm:flex items-center gap-1.5 text-stone-700 hover:text-[#997320] text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-[#F3EBDA] transition-colors border border-transparent hover:border-[#E0D3B5]"
              title="18k Gold Plating & Care Instructions"
            >
              <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
              <span>18k Care</span>
            </button>

            {/* Track Order Button */}
            {onOpenOrderTracking && (
              <button
                onClick={onOpenOrderTracking}
                className="hidden md:flex items-center gap-1.5 text-stone-800 hover:text-[#997320] text-xs font-semibold px-2.5 py-1.5 rounded-full bg-[#F3EBDA] hover:bg-[#EAE0CA] border border-[#D8C7A5] transition-all"
                title="Track Shipment Status on kairajewelry.in"
              >
                <Truck className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Track Order</span>
              </button>
            )}

            {/* Upload Real Photos Button */}
            {onOpenPhotoUploader && (
              <button
                onClick={onOpenPhotoUploader}
                className="hidden lg:flex items-center gap-1.5 text-stone-900 hover:text-[#997320] text-xs font-bold px-2.5 py-1.5 rounded-full bg-[#2C241D] text-[#DFBA53] hover:bg-black border border-[#C59B27]/40 transition-all shadow-xs"
                title="Upload Real Jewellery Photos to Store"
              >
                <Camera className="w-3.5 h-3.5 text-[#DFBA53]" />
                <span>Upload Photos</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-stone-800 hover:text-[#997320] hover:bg-[#F5F0E6] rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C59B27] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* My Profile & Orders or Login / Sign Up Button */}
            {currentUser?.isLoggedIn ? (
              <button
                onClick={onOpenUserProfile}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 text-stone-800 hover:text-[#997320] hover:bg-[#F5F0E6] rounded-full transition-all border border-stone-200 hover:border-[#E0D3B5]"
                aria-label="User Profile & My Orders"
                title="My Profile & Orders"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#C59B27]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#2C241D] text-[#DFBA53] flex items-center justify-center font-serif font-bold text-[10px]">
                    {currentUser.name?.charAt(0).toUpperCase() || 'K'}
                  </div>
                )}
                <span className="hidden xl:inline text-xs font-semibold">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-[#FAF7F2] text-[#8C6418] hover:bg-[#F5F0E6] px-3 py-1.5 rounded-full font-bold text-xs border border-[#C59B27]/60 shadow-2xs hover:shadow-xs transition-all"
                title="Login or Sign Up with Gmail / Phone"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Login / Sign Up</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-[#B88E3E] via-[#A0772C] to-[#825C19] text-white px-3.5 py-2 rounded-full hover:brightness-105 transition-all shadow-sm font-medium text-xs border border-[#DFBA53]/30"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-[#FAF7F2] text-[#825C19] font-extrabold text-[11px] px-1.5 py-0.2 rounded-full shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="block md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search 18k gold plated jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F0E6] text-stone-800 text-xs pl-8 pr-3 py-2 rounded-full border border-[#E0D3B5] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E0D3B5] px-6 py-4 space-y-3 font-medium text-sm text-stone-800 shadow-lg">
          <button
            onClick={() => { onSelectCategory('all'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1 hover:text-[#997320]"
          >
            All Collections
          </button>
          <button
            onClick={() => { onSelectCategory('necklaces'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1 hover:text-[#997320]"
          >
            Necklaces
          </button>
          <button
            onClick={() => { onSelectCategory('bracelets'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1 hover:text-[#997320]"
          >
            Bracelets & Cuffs
          </button>
          <button
            onClick={() => { onSelectCategory('under499'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1 text-[#8C6418] font-bold"
          >
            Under ₹499 ✨
          </button>
          <button
            onClick={() => { onSelectCategory('hampers'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-1 hover:text-[#997320]"
          >
            Luxury Gift Hampers
          </button>
          {onOpenComboBuilder && (
            <button
              onClick={() => { onOpenComboBuilder('combo999'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-[#FAF7F2] bg-[#19243B] px-3 py-2 rounded-lg font-bold text-xs border border-[#C59B27]/50"
            >
              <Sparkles className="w-4 h-4 text-[#D8A62A]" /> Build Your Combo (3 for ₹999)
            </button>
          )}
          <div className="pt-2 border-t border-[#E0D3B5] flex flex-col gap-2">
            {!currentUser?.isLoggedIn ? (
              <button
                onClick={() => { onOpenAuth?.(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-[#8C6418] bg-[#F5F0E6] px-3 py-2 rounded-lg font-bold text-xs border border-[#C59B27]/60 shadow-2xs"
              >
                <LogIn className="w-4 h-4 text-[#C59B27]" /> Login / Sign Up with Gmail / Phone
              </button>
            ) : (
              onOpenUserProfile && (
                <button
                  onClick={() => { onOpenUserProfile(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-[#8C6418] bg-[#F5F0E6] px-3 py-2 rounded-lg font-bold text-xs border border-[#D8C7A5]"
                >
                  <User className="w-4 h-4 text-[#C59B27]" /> My Profile ({currentUser.name})
                </button>
              )
            )}
            {onOpenSmartChat && (
              <button
                onClick={() => { onOpenSmartChat(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-[#8C6418] bg-[#F5F0E6] px-3 py-2 rounded-lg font-semibold text-xs border border-[#E0D3B5]"
              >
                <MessageSquareText className="w-4 h-4 text-[#C59B27]" /> Launch KAIRA Smart AI Chat
              </button>
            )}
            {onOpenOrderTracking && (
              <button
                onClick={() => { onOpenOrderTracking(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-stone-900 bg-[#F3EBDA] px-3 py-2 rounded-lg font-bold text-xs border border-[#D8C7A5]"
              >
                <Truck className="w-4 h-4 text-[#C59B27]" /> Track Shipment Order
              </button>
            )}
            {onOpenPhotoUploader && (
              <button
                onClick={() => { onOpenPhotoUploader(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-[#DFBA53] bg-[#2C241D] px-3 py-2 rounded-lg font-bold text-xs border border-[#C59B27]/40"
              >
                <Camera className="w-4 h-4 text-[#DFBA53]" /> Upload Real Jewellery Pictures
              </button>
            )}
            <button
              onClick={() => { onOpenCareGuide(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-stone-700 hover:text-[#997320] text-xs py-1"
            >
              <ShieldCheck className="w-4 h-4 text-[#C59B27]" /> 18k Gold Plating & Care Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


