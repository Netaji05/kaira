import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  QrCode,
  Check,
  MapPin,
  Edit2,
  Truck,
  Phone,
  Mail,
  Home,
  Briefcase,
  Gift,
  AlertCircle,
  ChevronLeft,
  CheckCircle2,
  CreditCard,
  PackageCheck,
  ExternalLink,
} from 'lucide-react';
import { CartItem, CustomerDetails } from '../types';
import { formatPrice, generateWhatsAppOrderLink, WHATSAPP_NUMBER } from '../utils/whatsapp';
import { UPIPaymentCard } from './UPIPaymentCard';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const INDIAN_STATES = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Kerala',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Bihar',
  'Goa',
  'Assam',
  'Odisha',
  'Other State / UT',
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment' | 'confirmation'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showUPIQRModal, setShowUPIQRModal] = useState(false);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);
  const [hasSavedAddress, setHasSavedAddress] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('kaira_saved_shipment_address'));
    } catch (e) {
      return false;
    }
  });

  // Customer Shipment Address details state (loaded from / saved to localStorage)
  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    try {
      const saved = localStorage.getItem('kaira_saved_shipment_address');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return {
      name: '',
      phone: '',
      email: '',
      address: '',
      landmark: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      addressType: 'home',
      giftNote: '',
    };
  });

  // Body scroll lock and Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClearSavedAddress = () => {
    try {
      localStorage.removeItem('kaira_saved_shipment_address');
    } catch (e) {
      // ignore
    }
    setHasSavedAddress(false);
    setCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      landmark: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      addressType: 'home',
      giftNote: '',
    });
  };

  // Calculate Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold (₹999)
  const freeShippingThreshold = 999;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Apply Coupon
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'KAIRA10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code: 'KAIRA10', discount });
    } else if (code === 'FIRSTGIFT') {
      const discount = Math.min(subtotal, 100);
      setAppliedCoupon({ code: 'FIRSTGIFT', discount });
    } else {
      setCouponError('Invalid code. Try KAIRA10 or FIRSTGIFT');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 60;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Validate Shipment Address before proceeding to Payment step
  const handleProceedToPayment = () => {
    const errors: Record<string, string> = {};

    if (!customer.name.trim()) {
      errors.name = 'Full Name is required';
    }

    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit mobile number required';
    }

    if (!customer.address.trim() || customer.address.trim().length < 5) {
      errors.address = 'Full street address / house no. required';
    }

    if (!customer.city.trim()) {
      errors.city = 'City is required';
    }

    const cleanPincode = customer.pincode.replace(/\D/g, '');
    if (!cleanPincode || cleanPincode.length < 6) {
      errors.pincode = '6-digit Pincode required';
    }

    setAddressErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        if (saveAddressForFuture) {
          localStorage.setItem('kaira_saved_shipment_address', JSON.stringify(customer));
          setHasSavedAddress(true);
        } else {
          localStorage.removeItem('kaira_saved_shipment_address');
          setHasSavedAddress(false);
        }
      } catch (e) {
        // ignore
      }
      setCheckoutStep('payment');
    }
  };

  const handleWhatsAppCheckout = () => {
    const orderNum = `KRA-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderId(orderNum);

    const waUrl = generateWhatsAppOrderLink(items, customer, grandTotal, discountAmount, appliedCoupon?.code);
    window.open(waUrl, '_blank');

    // Move to confirmation step
    setCheckoutStep('confirmation');
  };

  // Step Number for Progress Bar
  const getStepNumber = () => {
    if (checkoutStep === 'cart' || checkoutStep === 'address') return 1;
    if (checkoutStep === 'payment') return 2;
    if (checkoutStep === 'confirmation') return 3;
    return 1;
  };

  const currentStepNum = getStepNumber();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Cart Drawer Header */}
          <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif font-bold text-base sm:text-lg">
                {checkoutStep === 'cart' && `Your Shopping Bag (${items.length})`}
                {checkoutStep === 'address' && '1. Shipment Address Details'}
                {checkoutStep === 'payment' && '2. Select Payment Method'}
                {checkoutStep === 'confirmation' && '3. Order Confirmation'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MULTI-STEP CHECKOUT PROGRESS BAR */}
          <div className="bg-[#FAF7F2] p-3 border-b border-[#E0D3B5] font-sans">
            <div className="relative flex items-center justify-between max-w-xs mx-auto">
              {/* Background Connecting Line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-stone-300 -translate-y-1/2 -z-0" />
              
              {/* Active Progress Fill Line */}
              <div
                className="absolute top-1/2 left-4 h-0.5 bg-[#C59B27] -translate-y-1/2 transition-all duration-500 -z-0"
                style={{
                  width:
                    currentStepNum === 1
                      ? '0%'
                      : currentStepNum === 2
                      ? '50%'
                      : '100%',
                }}
              />

              {/* Step 1: Shipping */}
              <button
                type="button"
                onClick={() => {
                  if (checkoutStep === 'payment' || checkoutStep === 'address') {
                    setCheckoutStep('address');
                  }
                }}
                disabled={checkoutStep === 'confirmation'}
                className="relative z-10 flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStepNum > 1
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : currentStepNum === 1
                      ? 'bg-[#2C241D] text-[#DFBA53] ring-2 ring-[#C59B27]'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {currentStepNum > 1 ? <Check className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-tight ${
                    currentStepNum === 1 ? 'text-[#8C6418]' : 'text-stone-600'
                  }`}
                >
                  Shipping
                </span>
              </button>

              {/* Step 2: Payment */}
              <button
                type="button"
                onClick={() => {
                  if (checkoutStep === 'address' && customer.name && customer.phone) {
                    handleProceedToPayment();
                  }
                }}
                disabled={checkoutStep === 'cart' || checkoutStep === 'confirmation'}
                className="relative z-10 flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStepNum > 2
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : currentStepNum === 2
                      ? 'bg-[#2C241D] text-[#DFBA53] ring-2 ring-[#C59B27]'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {currentStepNum > 2 ? <Check className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-tight ${
                    currentStepNum === 2 ? 'text-[#8C6418]' : 'text-stone-600'
                  }`}
                >
                  Payment
                </span>
              </button>

              {/* Step 3: Confirmation */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStepNum === 3
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-500 shadow-xs'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-tight ${
                    currentStepNum === 3 ? 'text-emerald-800' : 'text-stone-600'
                  }`}
                >
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Free Shipping Progress Indicator (Cart view) */}
          {checkoutStep === 'cart' && (
            <div className="bg-amber-950 text-amber-100 p-2.5 text-xs border-b border-amber-900 font-sans">
              <div className="flex justify-between font-semibold mb-1">
                <span>
                  {subtotal >= freeShippingThreshold
                    ? '🎉 YOU UNLOCKED FREE EXPRESS SHIPPING!'
                    : `Add ${formatPrice(amountForFreeShipping)} more for FREE Shipping!`}
                </span>
              </div>
              <div className="w-full bg-amber-900/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Back Action Bar */}
          {checkoutStep !== 'cart' && checkoutStep !== 'confirmation' && (
            <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 font-sans">
              <button
                onClick={() =>
                  setCheckoutStep(checkoutStep === 'payment' ? 'address' : 'cart')
                }
                className="flex items-center gap-1 text-xs font-bold text-[#8C6418] hover:underline"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  {checkoutStep === 'payment' ? 'Back to Address Details' : 'Back to Shopping Bag'}
                </span>
              </button>
            </div>
          )}

          {/* Items Container / Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans">
            {items.length === 0 && checkoutStep !== 'confirmation' ? (
              <div className="text-center py-16 text-stone-500 space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <p className="font-serif text-base font-semibold text-stone-800">Your bag is empty</p>
                <p className="text-xs max-w-xs mx-auto">
                  Explore our 18k gold plated, anti-tarnish jewelry collection to add your first piece.
                </p>
                <button
                  onClick={onClose}
                  className="bg-amber-900 text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-amber-950 shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* STEP 1: CART BAG SUMMARY */}
                {checkoutStep === 'cart' && (
                  <>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-4 p-3 bg-stone-50 border border-stone-200 rounded-2xl relative"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-xl border border-stone-200"
                          />

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                                  {item.product.name}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-stone-400 hover:text-red-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider">
                                18k Gold Plated • Waterproof
                              </p>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <span className="text-sm font-bold text-stone-900">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>

                              {/* Quantity Control */}
                              <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                                  className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded-l"
                                >
                                  -
                                </button>
                                <span className="px-2 py-0.5 text-xs font-bold text-stone-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                                  className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded-r"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupon Box */}
                    <div className="pt-2">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                        <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-800" /> Apply Coupon Code
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. KAIRA10 or FIRSTGIFT"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800 uppercase"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold px-4 py-1.5 rounded-lg"
                          >
                            Apply
                          </button>
                        </div>
                        {appliedCoupon && (
                          <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Code {appliedCoupon.code} applied! Saved {formatPrice(appliedCoupon.discount)}
                          </p>
                        )}
                        {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                        <div className="text-[10px] text-stone-500 pt-1">
                          Try: <span className="font-mono bg-stone-200 px-1 rounded text-stone-800">KAIRA10</span> (10% off) or <span className="font-mono bg-stone-200 px-1 rounded text-stone-800">FIRSTGIFT</span> (₹100 off)
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2: SHIPMENT ADDRESS DETAILS FORM */}
                {checkoutStep === 'address' && (
                  <div className="space-y-4">
                    {/* Header info & Auto-filled notification */}
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E0D3B5] space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#C59B27] shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-xs font-bold text-stone-900">
                            Where should we deliver your 18k Gold Jewellery?
                          </h3>
                          <p className="text-[11px] text-stone-600">
                            Please enter complete doorstep shipping details for insured express delivery.
                          </p>
                        </div>
                      </div>

                      {hasSavedAddress && (
                        <div className="flex items-center justify-between pt-2 border-t border-[#E0D3B5]/60 text-[11px]">
                          <span className="text-emerald-800 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Auto-filled from saved profile
                          </span>
                          <button
                            type="button"
                            onClick={handleClearSavedAddress}
                            className="text-stone-600 hover:text-red-700 font-semibold underline text-[10px]"
                          >
                            Clear Address
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-800 block mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ananya Sharma"
                          value={customer.name}
                          onChange={(e) => {
                            setCustomer({ ...customer, name: e.target.value });
                            if (addressErrors.name) setAddressErrors({ ...addressErrors, name: '' });
                          }}
                          className={`w-full bg-stone-50 border ${
                            addressErrors.name ? 'border-red-500 bg-red-50' : 'border-stone-300'
                          } rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800`}
                        />
                        {addressErrors.name && (
                          <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {addressErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-800 block mb-1">
                            WhatsApp Phone <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-2.5 text-xs text-stone-500 font-semibold">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder="9876543210"
                              value={customer.phone}
                              onChange={(e) => {
                                setCustomer({ ...customer, phone: e.target.value });
                                if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: '' });
                              }}
                              className={`w-full pl-10 bg-stone-50 border ${
                                addressErrors.phone ? 'border-red-500 bg-red-50' : 'border-stone-300'
                              } rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800`}
                            />
                          </div>
                          {addressErrors.phone && (
                            <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {addressErrors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-800 block mb-1">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            placeholder="ananya@gmail.com"
                            value={customer.email || ''}
                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-800 block mb-1">
                          Flat / House No., Building, Street Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          placeholder="e.g. Flat 402, Royal Residency, Hill Road, Bandra West"
                          rows={2}
                          value={customer.address}
                          onChange={(e) => {
                            setCustomer({ ...customer, address: e.target.value });
                            if (addressErrors.address) setAddressErrors({ ...addressErrors, address: '' });
                          }}
                          className={`w-full bg-stone-50 border ${
                            addressErrors.address ? 'border-red-500 bg-red-50' : 'border-stone-300'
                          } rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800`}
                        />
                        {addressErrors.address && (
                          <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {addressErrors.address}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-800 block mb-1">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near HDFC Bank / Metro Station"
                          value={customer.landmark || ''}
                          onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-1">
                          <label className="text-xs font-bold text-stone-800 block mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Mumbai"
                            value={customer.city}
                            onChange={(e) => {
                              setCustomer({ ...customer, city: e.target.value });
                              if (addressErrors.city) setAddressErrors({ ...addressErrors, city: '' });
                            }}
                            className={`w-full bg-stone-50 border ${
                              addressErrors.city ? 'border-red-500 bg-red-50' : 'border-stone-300'
                            } rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800`}
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs font-bold text-stone-800 block mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={customer.state || 'Maharashtra'}
                            onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800"
                          >
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs font-bold text-stone-800 block mb-1">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="400050"
                            value={customer.pincode}
                            onChange={(e) => {
                              setCustomer({ ...customer, pincode: e.target.value });
                              if (addressErrors.pincode) setAddressErrors({ ...addressErrors, pincode: '' });
                            }}
                            className={`w-full bg-stone-50 border ${
                              addressErrors.pincode ? 'border-red-500 bg-red-50' : 'border-stone-300'
                            } rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800`}
                          />
                        </div>
                      </div>

                      {/* Address Type Pill Selector */}
                      <div>
                        <label className="text-xs font-bold text-stone-800 block mb-1.5">
                          Address Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setCustomer({ ...customer, addressType: 'home' })}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                              customer.addressType === 'home'
                                ? 'bg-[#2C241D] text-[#DFBA53] border-[#C59B27]'
                                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                            }`}
                          >
                            <Home className="w-3.5 h-3.5" /> Home
                          </button>

                          <button
                            type="button"
                            onClick={() => setCustomer({ ...customer, addressType: 'work' })}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                              customer.addressType === 'work'
                                ? 'bg-[#2C241D] text-[#DFBA53] border-[#C59B27]'
                                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                            }`}
                          >
                            <Briefcase className="w-3.5 h-3.5" /> Work
                          </button>

                          <button
                            type="button"
                            onClick={() => setCustomer({ ...customer, addressType: 'gift' })}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                              customer.addressType === 'gift'
                                ? 'bg-[#2C241D] text-[#DFBA53] border-[#C59B27]'
                                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                            }`}
                          >
                            <Gift className="w-3.5 h-3.5" /> Gift Recipient
                          </button>
                        </div>
                      </div>

                      {/* Custom Gift Note */}
                      <div>
                        <label className="text-xs font-bold text-stone-800 block mb-1">
                          Custom Gift Card Note (Optional)
                        </label>
                        <textarea
                          placeholder="e.g. Happy Birthday Di! Love, Ananya"
                          rows={2}
                          value={customer.giftNote || ''}
                          onChange={(e) => setCustomer({ ...customer, giftNote: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-amber-800"
                        />
                      </div>

                      {/* Save Address Toggle Checkbox */}
                      <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E0D3B5] space-y-1">
                        <label className="flex items-center gap-2.5 text-xs font-bold text-stone-900 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveAddressForFuture}
                            onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                            className="w-4 h-4 rounded border-stone-300 text-[#8C6418] focus:ring-[#8C6418] accent-[#2C241D] cursor-pointer shrink-0"
                          />
                          <span>Save details for 1-click returning customer checkout</span>
                        </label>
                        <p className="text-[10px] text-stone-500 pl-6">
                          Safely stored in browser localStorage for quick autofill on future orders.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PAYMENT METHOD SELECTION */}
                {checkoutStep === 'payment' && (
                  <div className="space-y-4">
                    {/* Confirmed Shipment Address Card */}
                    <div className="bg-[#FAF7F2] border border-[#E0D3B5] rounded-2xl p-3.5 shadow-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-[#E0D3B5] pb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C59B27]" />
                          <span className="text-xs font-bold text-stone-900">
                            Delivery Address Confirmed
                          </span>
                        </div>
                        <button
                          onClick={() => setCheckoutStep('address')}
                          className="text-xs font-bold text-[#8C6418] hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit Address
                        </button>
                      </div>

                      <div className="text-xs text-stone-700 space-y-1">
                        <p className="font-bold text-stone-900">
                          {customer.name}{' '}
                          <span className="font-normal text-stone-500">({customer.phone})</span>
                          {customer.addressType && (
                            <span className="ml-2 text-[10px] bg-[#2C241D] text-[#DFBA53] px-2 py-0.5 rounded-full font-bold uppercase">
                              {customer.addressType}
                            </span>
                          )}
                        </p>
                        <p className="text-stone-600 line-clamp-2">
                          {customer.address}
                          {customer.landmark ? `, Near ${customer.landmark}` : ''},{' '}
                          {customer.city}, {customer.state} - {customer.pincode}
                        </p>
                        {customer.giftNote && (
                          <p className="text-[11px] text-[#8C6418] italic pt-1">
                            Gift Note: "{customer.giftNote}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Options Header */}
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                        Select Payment Method ({formatPrice(grandTotal)})
                      </h3>

                      <div className="space-y-3">
                        {/* Option 1: WhatsApp Order */}
                        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                            <span>1. Order & Pay via WhatsApp (+91 {WHATSAPP_NUMBER})</span>
                          </div>
                          <p className="text-[11px] text-emerald-800">
                            Instantly sends your selected items and full shipment address to our Concierge on WhatsApp for instant confirmation.
                          </p>
                          <button
                            onClick={handleWhatsAppCheckout}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-2"
                          >
                            <MessageCircle className="w-4 h-4 fill-current text-emerald-200" />
                            <span>Confirm & Order on WhatsApp</span>
                          </button>
                        </div>

                        {/* Option 2: Instant UPI QR Code */}
                        <div className="bg-stone-50 border border-stone-300 rounded-2xl p-3.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                              <QrCode className="w-4 h-4 text-amber-900" />
                              <span>2. Instant UPI QR (GPay / PhonePe / Paytm)</span>
                            </div>
                            <button
                              onClick={() => setShowUPIQRModal(!showUPIQRModal)}
                              className="text-[11px] font-bold text-[#8C6418] underline"
                            >
                              {showUPIQRModal ? 'Hide QR' : 'Show QR'}
                            </button>
                          </div>

                          {showUPIQRModal && (
                            <div className="pt-2">
                              <UPIPaymentCard
                                amount={grandTotal}
                                onPaymentDone={() => {
                                  handleWhatsAppCheckout();
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Option 3: 100% Prepaid Policy Info */}
                        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                            <span>100% Prepaid Orders Only</span>
                          </div>
                          <p className="text-[11px] text-amber-900/80">
                            We process prepaid orders exclusively to ensure express dispatch, priority courier allocation, and seamless delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: ORDER CONFIRMATION VIEW */}
                {checkoutStep === 'confirmation' && (
                  <div className="space-y-4 py-2">
                    <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center space-y-3">
                      <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <PackageCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Order Sent to WhatsApp
                        </span>
                        <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
                          Thank You, {customer.name || 'Valued Customer'}!
                        </h3>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Order ID: <strong className="text-stone-900 font-mono">{confirmedOrderId || 'KRA-9281'}</strong>
                        </p>
                      </div>

                      <p className="text-xs text-emerald-900 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-200">
                        Our WhatsApp Concierge is processing your 18k anti-tarnish jewelry dispatch. You will receive tracking updates shortly.
                      </p>
                    </div>

                    {/* Delivery Address Summary */}
                    <div className="bg-[#FAF7F2] border border-[#E0D3B5] rounded-2xl p-3.5 space-y-1.5 text-xs">
                      <p className="font-bold text-stone-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C59B27]" /> Delivery Address:
                      </p>
                      <p className="text-stone-700 pl-5">
                        {customer.address}, {customer.city}, {customer.state} - {customer.pincode}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={handleWhatsAppCheckout}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4 fill-current text-emerald-200" />
                        <span>Re-open WhatsApp Chat</span>
                      </button>

                      <button
                        onClick={() => {
                          onClearCart();
                          onClose();
                          setCheckoutStep('cart');
                        }}
                        className="w-full bg-[#2C241D] hover:bg-black text-[#DFBA53] font-bold text-xs py-3 px-4 rounded-xl transition-all border border-[#C59B27]/40 shadow-xs"
                      >
                        Done & Continue Shopping
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Totals & Step Action CTA */}
          {items.length > 0 && checkoutStep !== 'confirmation' && (
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3 font-sans">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-700 uppercase">Free Express</strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Payable</span>
                  <span className="text-amber-950 font-serif text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* STEP 1 CTA: Proceed to Address */}
              {checkoutStep === 'cart' && (
                <button
                  onClick={() => setCheckoutStep('address')}
                  className="w-full bg-stone-900 hover:bg-black text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Proceed to Shipment Address Details</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              )}

              {/* STEP 2 CTA: Confirm Address & Proceed to Payment */}
              {checkoutStep === 'address' && (
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#2C241D] hover:bg-black text-[#DFBA53] font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md border border-[#C59B27]/40"
                >
                  <span>Save Address & Select Payment Method</span>
                  <ArrowRight className="w-4 h-4 text-[#DFBA53]" />
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>100% Anti-Tarnish Guarantee • Direct Brand Support</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
