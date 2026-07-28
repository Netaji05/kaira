import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Product, ProductCategory, CartItem, AuthUser } from './types';
import { PRODUCTS } from './data/products';

import { SEOStructuredData } from './components/SEOStructuredData';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrustBar } from './components/TrustBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { ReviewsSection } from './components/ReviewsSection';
import { InstagramWall } from './components/InstagramWall';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ComboOffersSection } from './components/ComboOffersSection';
import { ComboBuilderModal } from './components/ComboBuilderModal';
import { AuthModal } from './components/AuthModal';
import { MessageSquareText } from 'lucide-react';

// Lazy-loaded secondary modals & drawers for bundle optimization
const WishlistModal = lazy(() => import('./components/WishlistModal').then(m => ({ default: m.WishlistModal })));
const AIStylistModal = lazy(() => import('./components/AIStylistModal').then(m => ({ default: m.AIStylistModal })));
const CareGuideModal = lazy(() => import('./components/CareGuideModal').then(m => ({ default: m.CareGuideModal })));
const SmartAIChatDrawer = lazy(() => import('./components/SmartAIChatDrawer').then(m => ({ default: m.SmartAIChatDrawer })));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal').then(m => ({ default: m.OrderTrackingModal })));
const PhotoUploaderModal = lazy(() => import('./components/PhotoUploaderModal').then(m => ({ default: m.PhotoUploaderModal })));
const UserProfileModal = lazy(() => import('./components/UserProfileModal').then(m => ({ default: m.UserProfileModal })));

export function App() {
  // Local Storage State for Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kaira_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local Storage State for Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kaira_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Filter States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Local Storage State for Custom Products & Images
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const savedOverrides = localStorage.getItem('kaira_custom_product_images');
      const customAdded: Product[] = JSON.parse(localStorage.getItem('kaira_custom_added_products') || '[]');
      let overrides: Record<string, { image?: string; hoverImage?: string }> = {};
      if (savedOverrides) {
        overrides = JSON.parse(savedOverrides);
      }
      const updatedBase = PRODUCTS.map((p) => ({
        ...p,
        image: overrides[p.id]?.image || p.image,
        hoverImage: overrides[p.id]?.hoverImage || p.hoverImage,
      }));
      return [...customAdded, ...updatedBase];
    } catch (e) {
      console.error('Failed to load saved products:', e);
      return PRODUCTS;
    }
  });

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAIStylistOpen, setIsAIStylistOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);
  const [isSmartChatOpen, setIsSmartChatOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isPhotoUploaderOpen, setIsPhotoUploaderOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const [selectedComboTier, setSelectedComboTier] = useState<'combo999' | 'combo1399' | 'combo1599'>('combo999');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('kaira_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Handler to open Auth or User Profile
  const handleOpenProfileOrAuth = () => {
    if (currentUser?.isLoggedIn) {
      setIsUserProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('kaira_auth_user', JSON.stringify(user));
    setIsAuthOpen(false);
    setIsUserProfileOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kaira_auth_user');
    setIsUserProfileOpen(false);
  };

  const handleUpdateUser = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('kaira_auth_user', JSON.stringify(updatedUser));
  };

  const handleOpenComboBuilder = (tier: 'combo999' | 'combo1399' | 'combo1599' = 'combo999') => {
    setSelectedComboTier(tier);
    setIsComboBuilderOpen(true);
  };

  // Update Product Image Handler
  const handleUpdateProductImage = (productId: string, mainImg: string, hoverImg?: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, image: mainImg, hoverImage: hoverImg || p.hoverImage } : p))
    );

    try {
      const savedOverrides = JSON.parse(localStorage.getItem('kaira_custom_product_images') || '{}');
      savedOverrides[productId] = { image: mainImg, hoverImage: hoverImg };
      localStorage.setItem('kaira_custom_product_images', JSON.stringify(savedOverrides));
    } catch (e) {
      console.error('Failed to save image override:', e);
    }
  };

  // Add Custom Product Handler
  const handleAddCustomProduct = (newProduct: Product) => {
    setProductsList((prev) => [newProduct, ...prev]);

    try {
      const customAdded: Product[] = JSON.parse(localStorage.getItem('kaira_custom_added_products') || '[]');
      localStorage.setItem('kaira_custom_added_products', JSON.stringify([newProduct, ...customAdded]));
    } catch (e) {
      console.error('Failed to save new custom product:', e);
    }
  };

  // Reset All Images Handler
  const handleResetAllImages = () => {
    if (window.confirm('Are you sure you want to reset all product photos to default?')) {
      localStorage.removeItem('kaira_custom_product_images');
      localStorage.removeItem('kaira_custom_added_products');
      setProductsList(PRODUCTS);
    }
  };

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kaira_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kaira_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlistIds]);

  // Shared Wishlist Link Auto-Detect
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedWishlist = urlParams.get('wishlist');
      if (sharedWishlist) {
        const sharedIds = sharedWishlist.split(',').filter(Boolean);
        if (sharedIds.length > 0) {
          setWishlistIds((prev) => Array.from(new Set([...prev, ...sharedIds])));
          setIsWishlistOpen(true);
        }
      }
    } catch (err) {
      console.error('Error parsing shared wishlist link:', err);
    }
  }, []);


  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1, giftNote?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (giftNote) updated[existingIdx].giftNote = giftNote;
        return updated;
      } else {
        return [...prev, { product, quantity, giftNote }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => setCart([]);

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const wishlistedProducts = productsList.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleShopClick = () => {
    const catalog = document.getElementById('shop-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-stone-900 selection:bg-[#F3EBDA] selection:text-[#8C6418] flex flex-col relative">
      {/* Dynamic Schema.org JSON-LD Structured Data for Google Search Indexing */}
      <SEOStructuredData products={productsList} selectedProduct={quickViewProduct} />
      
      {/* 1. Announcement Header Bar */}
      <AnnouncementBar onOpenOrderTracking={() => setIsOrderTrackingOpen(true)} />

      {/* 2. Main Navigation Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenCareGuide={() => setIsCareGuideOpen(true)}
        onOpenSmartChat={() => setIsSmartChatOpen(true)}
        onOpenComboBuilder={handleOpenComboBuilder}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenPhotoUploader={() => setIsPhotoUploaderOpen(true)}
        onOpenUserProfile={handleOpenProfileOrAuth}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleShopClick();
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 3. Hero Showcase Banner */}
      <HeroBanner
        onShopClick={handleShopClick}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenSmartChat={() => setIsSmartChatOpen(true)}
      />

      {/* 4. Trust Badges & Anti-Tarnish Guarantee Bar */}
      <TrustBar />

      {/* 4.5 Build Your Combo Feature Section */}
      <ComboOffersSection onSelectCombo={handleOpenComboBuilder} />

      {/* 5. Product Catalog Grid */}
      <main className="flex-1">
        <ProductGrid
          products={productsList}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={(product) => handleAddToCart(product, 1)}
          onQuickView={(product) => setQuickViewProduct(product)}
          searchQuery={searchQuery}
        />

        {/* 6. Customer Social Proof & Reviews */}
        <ReviewsSection />

        {/* 7. Instagram Community Wall */}
        <InstagramWall />

        {/* 8. Frequently Asked Questions & Dynamic FAQ Schema */}
        <FAQSection
          onOpenSmartChat={() => setIsSmartChatOpen(true)}
          onOpenCareGuide={() => setIsCareGuideOpen(true)}
        />
      </main>

      {/* Floating Smart AI Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsSmartChatOpen(true)}
          className="group bg-gradient-to-r from-[#2C241D] via-[#1F1812] to-[#2C241D] hover:brightness-125 text-[#FAF7F2] p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border border-[#C59B27]/50 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
          title="Smart AI Assistant"
        >
          <div className="relative">
            <MessageSquareText className="w-5 h-5 text-[#DFBA53]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1F1812] animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            Smart AI Chat
          </span>
          <span className="bg-[#C59B27]/20 text-[#DFBA53] text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-[#DFBA53]/30 hidden md:inline">
            18k Gold Assistant
          </span>
        </button>
      </div>

      {/* 8. Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleShopClick();
        }}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenCareGuide={() => setIsCareGuideOpen(true)}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenPhotoUploader={() => setIsPhotoUploaderOpen(true)}
      />

      {/* Overlays / Modals */}

      {/* Quick View Product Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Lazy-loaded Overlays & Modals */}
      <Suspense fallback={null}>
        {/* Wishlist Modal */}
        {isWishlistOpen && (
          <WishlistModal
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlistedProducts={wishlistedProducts}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCart={(p) => handleAddToCart(p, 1)}
          />
        )}

        {/* AI Stylist & Gift Recommender Modal */}
        {isAIStylistOpen && (
          <AIStylistModal
            isOpen={isAIStylistOpen}
            onClose={() => setIsAIStylistOpen(false)}
          />
        )}

        {/* 18k Care & Waterproof Science Modal */}
        {isCareGuideOpen && (
          <CareGuideModal
            isOpen={isCareGuideOpen}
            onClose={() => setIsCareGuideOpen(false)}
          />
        )}

        {/* Real-Time Smart AI Chat Drawer */}
        {isSmartChatOpen && (
          <SmartAIChatDrawer
            isOpen={isSmartChatOpen}
            onClose={() => setIsSmartChatOpen(false)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
          />
        )}

        {/* Real-time Order Tracking Modal */}
        {isOrderTrackingOpen && (
          <OrderTrackingModal
            isOpen={isOrderTrackingOpen}
            onClose={() => setIsOrderTrackingOpen(false)}
          />
        )}

        {/* Photo Uploader / Real Jewellery Picture Manager Modal */}
        {isPhotoUploaderOpen && (
          <PhotoUploaderModal
            isOpen={isPhotoUploaderOpen}
            onClose={() => setIsPhotoUploaderOpen(false)}
            products={productsList}
            onUpdateProductImage={handleUpdateProductImage}
            onAddCustomProduct={handleAddCustomProduct}
            onResetAllImages={handleResetAllImages}
          />
        )}

        {/* Login / Sign Up Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* User Profile & My Orders Modal */}
        {isUserProfileOpen && (
          <UserProfileModal
            isOpen={isUserProfileOpen}
            onClose={() => setIsUserProfileOpen(false)}
            onTrackOrder={() => {
              setIsUserProfileOpen(false);
              setIsOrderTrackingOpen(true);
            }}
            onAddToCart={(p, qty) => handleAddToCart(p, qty || 1)}
            allProducts={productsList}
            currentUser={currentUser}
            onOpenAuth={() => {
              setIsUserProfileOpen(false);
              setIsAuthOpen(true);
            }}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* Combo Builder Modal */}
        <ComboBuilderModal
          isOpen={isComboBuilderOpen}
          onClose={() => setIsComboBuilderOpen(false)}
          comboTier={selectedComboTier}
          products={productsList}
          onAddToCart={(bundleProduct, qty) => {
            handleAddToCart(bundleProduct, qty);
            setIsCartOpen(true);
          }}
        />
      </Suspense>

    </div>
  );
}

export default App;
