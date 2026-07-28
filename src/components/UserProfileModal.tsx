import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  MessageSquare,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  ShieldCheck,
  Star,
  Copy,
  Check,
  Camera,
  Image as ImageIcon,
  Folder,
  LogOut,
} from 'lucide-react';
import { Product, AuthUser } from '../types';

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  category?: string;
}

interface OrderRecord {
  orderId: string;
  date: string;
  status: 'delivered' | 'in_transit' | 'packed' | 'processing';
  statusText: string;
  deliveryDate: string;
  courier?: string;
  awbNumber?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder?: (orderId: string) => void;
  onAddToCart?: (product: Product, qty?: number) => void;
  allProducts?: Product[];
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onUpdateUser?: (updated: AuthUser) => void;
}

// Sample customer order history for kairajewelry.in
const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderId: 'KAIRA-8921',
    date: '25 July 2026',
    status: 'in_transit',
    statusText: 'In Transit via BlueDart Express',
    deliveryDate: 'Expected Tomorrow (28 July) by 5:00 PM',
    courier: 'BlueDart Express Air',
    awbNumber: 'BD7058859619IN',
    items: [
      {
        id: '1',
        name: '18k Gold Plated Serpent Snake Chain Necklace',
        qty: 1,
        price: 449,
        image:
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        category: 'necklaces',
      },
      {
        id: '2',
        name: 'Celestial Starburst Pendant',
        qty: 1,
        price: 599,
        image:
          'https://images.unsplash.com/photo-1611591475161-fb96740bfa09?auto=format&fit=crop&w=600&q=80',
        category: 'necklaces',
      },
    ],
    totalAmount: 1048,
    shippingAddress: 'Flat 402, Royal Residency, Bandra West, Mumbai, Maharashtra - 400050',
  },
  {
    orderId: 'KAIRA-7712',
    date: '12 June 2026',
    status: 'delivered',
    statusText: 'Delivered Successfully',
    deliveryDate: 'Delivered on 15 June 2026',
    courier: 'Delhivery Express',
    awbNumber: 'DL77129845IN',
    items: [
      {
        id: '3',
        name: 'Minimalist Liquid Gold Drop Earrings',
        qty: 1,
        price: 399,
        image:
          'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
        category: 'earrings',
      },
      {
        id: '4',
        name: 'Versatile 18k Gold Layered Paperclip Chain',
        qty: 1,
        price: 549,
        image:
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        category: 'necklaces',
      },
    ],
    totalAmount: 948,
    shippingAddress: 'Flat 402, Royal Residency, Bandra West, Mumbai, Maharashtra - 400050',
  },
  {
    orderId: 'KAIRA-6540',
    date: '02 May 2026',
    status: 'delivered',
    statusText: 'Delivered Successfully',
    deliveryDate: 'Delivered on 05 May 2026',
    courier: 'India Post Speed Post',
    awbNumber: 'IP65401123IN',
    items: [
      {
        id: '5',
        name: 'Royal Textured Hammered Gold Cuff Bracelet',
        qty: 1,
        price: 699,
        image:
          'https://images.unsplash.com/photo-1611591475161-fb96740bfa09?auto=format&fit=crop&w=600&q=80',
        category: 'bracelets',
      },
    ],
    totalAmount: 699,
    shippingAddress: 'Flat 402, Royal Residency, Bandra West, Mumbai, Maharashtra - 400050',
  },
  {
    orderId: 'KAIRA-5109',
    date: '26 July 2026',
    status: 'packed',
    statusText: 'Packed in Luxury Gift Box',
    deliveryDate: 'Dispatches Today',
    courier: 'BlueDart Express',
    awbNumber: 'BD51098822IN',
    items: [
      {
        id: '6',
        name: 'Chic Pearl & 18k Gold Choker',
        qty: 1,
        price: 599,
        image:
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        category: 'necklaces',
      },
    ],
    totalAmount: 599,
    shippingAddress: 'Flat 402, Royal Residency, Bandra West, Mumbai, Maharashtra - 400050',
  },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
  onAddToCart,
  allProducts = [],
  currentUser,
  onOpenAuth,
  onLogout,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'address'>('orders');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_transit' | 'delivered' | 'packed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Photo Picker Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // File Input Refs for Photo Update
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync state with currentUser if provided
  const [userInfo, setUserInfo] = useState({
    name: currentUser?.name || 'Ananya Sharma',
    phone: currentUser?.phone || '+91 7058859619',
    email: currentUser?.email || 'ananya.sharma@gmail.com',
    memberTier: currentUser?.memberTier || 'KAIRA Gold VIP Member',
    rewardPoints: currentUser?.rewardPoints || 480,
    address: currentUser?.address || 'Flat 402, Royal Residency, Hill Road, Bandra West, Mumbai, Maharashtra - 400050',
    avatar: currentUser?.avatar || '',
  });

  useEffect(() => {
    if (currentUser) {
      setUserInfo({
        name: currentUser.name || 'Ananya Sharma',
        phone: currentUser.phone || '+91 7058859619',
        email: currentUser.email || 'ananya.sharma@gmail.com',
        memberTier: currentUser.memberTier || 'KAIRA Gold VIP Member',
        rewardPoints: currentUser.rewardPoints || 480,
        address: currentUser.address || 'Flat 402, Royal Residency, Hill Road, Bandra West, Mumbai, Maharashtra - 400050',
        avatar: currentUser.avatar || '',
      });
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Photo File Selected
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const newAvatar = reader.result.toString();
          setUserInfo((prev) => ({ ...prev, avatar: newAvatar }));
          if (currentUser && onUpdateUser) {
            onUpdateUser({ ...currentUser, avatar: newAvatar });
          }
          setIsPhotoModalOpen(false);
          showToast('Profile photo updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // WebCam Camera Start
  const handleStartLiveCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      cameraInputRef.current?.click();
      setIsCameraActive(false);
    }
  };

  // Capture Photo from WebCam Stream
  const handleCaptureWebcam = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setUserInfo((prev) => ({ ...prev, avatar: dataUrl }));
        if (currentUser && onUpdateUser) {
          onUpdateUser({ ...currentUser, avatar: dataUrl });
        }

        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);
        setIsPhotoModalOpen(false);
        showToast('Camera photo captured and saved!');
      }
    }
  };

  // Close WebCam
  const handleCloseWebcam = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  // WhatsApp Re-Order Trigger Handler
  const handleWhatsAppReorder = (order: OrderRecord, singleItem?: OrderItem) => {
    const targetItems = singleItem ? [singleItem] : order.items;
    
    let itemsText = targetItems
      .map((item) => `• ${item.name} (Qty: ${item.qty}, ₹${item.price})`)
      .join('\n');

    const totalVal = targetItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

    const message = 
`Hi KAIRA Jewellery team! ✨

I would like to RE-ORDER my favorite item(s) from Order #${order.orderId}:

${itemsText}

Total: ₹${totalVal}
Delivery Address: ${userInfo.address}

Please confirm stock availability and share the UPI/Card payment link for instant dispatch. Thank you!`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917058859619?text=${encodedMsg}`;

    showToast(`Opening WhatsApp for instant Re-Order of Order #${order.orderId}...`);
    window.open(whatsappUrl, '_blank');
  };

  // Add all items from order to Bag
  const handleAddOrderToBag = (order: OrderRecord) => {
    order.items.forEach((item) => {
      const match = allProducts.find((p) => p.id === item.id || p.name.toLowerCase() === item.name.toLowerCase());
      if (match && onAddToCart) {
        onAddToCart(match, item.qty);
      } else if (onAddToCart) {
        onAddToCart(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.price + 200,
            image: item.image,
            category: (item.category as any) || 'necklaces',
            description: '18k Gold Plated Anti-Tarnish Jewellery',
            inStock: true,
            rating: 4.9,
            reviewCount: 42,
          },
          item.qty
        );
      }
    });
    showToast(`Added ${order.items.length} item(s) from #${order.orderId} to your Shopping Bag!`);
  };

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
    showToast(`Copied Order ID ${orderId} to clipboard!`);
  };

  // Filter Orders
  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Truck className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Delivered
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
            <Package className="w-3.5 h-3.5 text-blue-700" />
            Packed in Box
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-300">
            <Clock className="w-3.5 h-3.5 text-stone-600" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/80 backdrop-blur-md animate-fade-in">
      {/* Hidden File Inputs for Profile Photo Updates */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handlePhotoFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="user"
        onChange={handlePhotoFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,.png,.jpg,.jpeg,.webp"
        onChange={handlePhotoFileChange}
        className="hidden"
      />

      {/* Photo Selection Modal / Popover */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-60 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E0D3B5] max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                handleCloseWebcam();
                setIsPhotoModalOpen(false);
              }}
              className="absolute top-3 right-3 p-1 text-stone-400 hover:text-stone-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center">
              <h3 className="font-serif font-bold text-stone-900 text-base">Update Profile Photo</h3>
              <p className="text-xs text-stone-500">Select source to upload or take a new picture</p>
            </div>

            {/* Live WebCam Stream if active */}
            {isCameraActive ? (
              <div className="bg-black p-2 rounded-xl relative space-y-2">
                <video ref={videoRef} autoPlay playsInline className="w-full h-44 rounded-lg object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCaptureWebcam}
                    className="flex-1 py-1.5 bg-[#C59B27] text-stone-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" /> Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseWebcam}
                    className="py-1.5 px-3 bg-stone-700 text-white font-bold text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-stone-200 rounded-xl hover:border-[#C59B27] hover:bg-amber-50/50 transition-all text-stone-800"
                >
                  <ImageIcon className="w-5 h-5 text-[#8C6418] mb-1" />
                  <span className="text-[10px] font-bold">Camera Roll</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartLiveCamera}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-stone-200 rounded-xl hover:border-[#C59B27] hover:bg-amber-50/50 transition-all text-stone-800"
                >
                  <Camera className="w-5 h-5 text-[#8C6418] mb-1" />
                  <span className="text-[10px] font-bold">Take Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-stone-200 rounded-xl hover:border-[#C59B27] hover:bg-amber-50/50 transition-all text-stone-800"
                >
                  <Folder className="w-5 h-5 text-[#8C6418] mb-1" />
                  <span className="text-[10px] font-bold">Device Files</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-[#2C241D] text-[#DFBA53] px-5 py-3 rounded-2xl shadow-2xl border border-[#C59B27]/50 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-[#DFBA53]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div
        className="bg-[#FAF7F2] border border-[#E0D3B5] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header Bar */}
        <div className="sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md p-5 border-b border-[#E0D3B5] flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="relative group">
              {userInfo.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C59B27] shadow-md shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#2C241D] text-[#DFBA53] border-2 border-[#C59B27] flex items-center justify-center font-serif font-bold text-base shadow-md shrink-0">
                  {userInfo.name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AS'}
                </div>
              )}
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute -bottom-1 -right-1 p-1 bg-[#C59B27] text-stone-950 rounded-full text-[10px] shadow-md hover:scale-110 transition-all border border-white"
                title="Change Photo (Camera Roll, Camera, Files)"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                  {userInfo.name}
                </h2>
                <span className="text-[10px] bg-[#2C241D] text-[#DFBA53] px-2 py-0.5 rounded-full font-bold border border-[#C59B27]/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#DFBA53]" />
                  {userInfo.memberTier}
                </span>
              </div>
              <p className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                <span>{userInfo.email || userInfo.phone}</span>
                <span>•</span>
                <span className="text-[#8C6418] font-medium">{userInfo.rewardPoints} Reward Points</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  showToast('Logged out successfully');
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-red-100 text-stone-500 hover:text-red-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F3EBDA] text-stone-600 transition-colors"
              aria-label="Close profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="bg-[#F5F0E6] border-b border-[#E0D3B5] px-5 pt-3 pb-0 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#C59B27] text-[#8C6418] bg-[#FAF7F2] rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-[#C59B27]" />
            <span>My Orders ({INITIAL_ORDERS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-[#C59B27] text-[#8C6418] bg-[#FAF7F2] rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-[#C59B27]" />
            <span>WhatsApp Quick Re-Order</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'address'
                ? 'border-[#C59B27] text-[#8C6418] bg-[#FAF7F2] rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#C59B27]" />
            <span>Saved Address & Account</span>
          </button>
        </div>

        {/* Modal Main Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by Order ID (e.g. KAIRA-8921) or item name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F5F0E6] text-stone-800 text-xs pl-8 pr-3 py-2 rounded-xl border border-[#E0D3B5] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Filter Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                      statusFilter === 'all'
                        ? 'bg-[#2C241D] text-[#DFBA53] font-bold'
                        : 'bg-[#F5F0E6] text-stone-700 hover:bg-[#EAE0CA]'
                    }`}
                  >
                    All ({INITIAL_ORDERS.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('in_transit')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                      statusFilter === 'in_transit'
                        ? 'bg-amber-800 text-amber-100 font-bold'
                        : 'bg-[#F5F0E6] text-stone-700 hover:bg-[#EAE0CA]'
                    }`}
                  >
                    In Transit
                  </button>
                  <button
                    onClick={() => setStatusFilter('delivered')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                      statusFilter === 'delivered'
                        ? 'bg-emerald-800 text-emerald-100 font-bold'
                        : 'bg-[#F5F0E6] text-stone-700 hover:bg-[#EAE0CA]'
                    }`}
                  >
                    Delivered
                  </button>
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-[#F5F0E6]/60 rounded-2xl border border-dashed border-[#E0D3B5]">
                  <Package className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <p className="text-stone-700 font-bold text-sm">No matching orders found</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Try clearing your search query or status filter.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white border border-[#E0D3B5] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#C59B27] transition-all space-y-4"
                  >
                    {/* Order Top Line Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          #{order.orderId}
                        </span>
                        <button
                          onClick={() => copyOrderId(order.orderId)}
                          className="p-1 hover:bg-[#F3EBDA] rounded-md text-stone-500 hover:text-[#8C6418] transition-colors"
                          title="Copy Order ID"
                        >
                          {copiedOrderId === order.orderId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-500">{order.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Order Delivery Status Detail Bar */}
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE0CA] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Truck className="w-4 h-4 text-[#C59B27] shrink-0" />
                        <span className="font-semibold">{order.statusText}:</span>
                        <span className="text-stone-600">{order.deliveryDate}</span>
                      </div>

                      {onTrackOrder && (
                        <button
                          onClick={() => onTrackOrder(order.orderId)}
                          className="text-xs font-bold text-[#8C6418] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Live Tracking</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-2.5">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-[#E0D3B5]"
                            />
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                                <span>Qty: {item.qty}</span>
                                <span>•</span>
                                <span className="font-semibold text-stone-800">₹{item.price}</span>
                                <span className="text-[10px] bg-[#F3EBDA] text-[#8C6418] px-1.5 py-0.2 rounded-full border border-[#D8C7A5]">
                                  18k Anti-Tarnish
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick WhatsApp Re-Order for individual item */}
                          <button
                            onClick={() => handleWhatsAppReorder(order, item)}
                            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg transition-all"
                            title="Re-order this item on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>Re-Order Item</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer Actions & Total */}
                    <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="text-xs text-stone-600">
                        Total Amount Paid:{' '}
                        <span className="text-sm font-extrabold text-stone-900 font-serif">
                          ₹{order.totalAmount}
                        </span>{' '}
                        <span className="text-[10px] text-emerald-700 font-semibold">(Free Shipping)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Add all to Bag button */}
                        <button
                          onClick={() => handleAddOrderToBag(order)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-800 bg-[#F5F0E6] hover:bg-[#EAE0CA] border border-[#E0D3B5] px-3 py-2 rounded-xl transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span>Add to Bag</span>
                        </button>

                        {/* WhatsApp Main Re-Order Button */}
                        <button
                          onClick={() => handleWhatsAppReorder(order)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 hover:brightness-110 shadow-sm border border-emerald-500/30 px-4 py-2 rounded-xl transition-all"
                        >
                          <MessageSquare className="w-4 h-4 fill-white" />
                          <span>Re-Order via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: WHATSAPP QUICK RE-ORDER & FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-[#2C241D] to-[#18130E] text-[#FAF7F2] p-4 rounded-2xl border border-[#C59B27]/40 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#DFBA53]" />
                    <h3 className="text-sm font-bold font-serif text-[#DFBA53]">
                      Instant WhatsApp Re-Order Service
                    </h3>
                  </div>
                  <p className="text-xs text-stone-300">
                    Loved your previous pieces? Click any favorite piece below to trigger a pre-filled WhatsApp message directly to our Concierge at +91 7058859619.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIAL_ORDERS.flatMap((ord) => ord.items).map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="bg-white border border-[#E0D3B5] rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs hover:border-[#C59B27] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover border border-[#E0D3B5]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#8C6418] font-bold mt-0.5">₹{item.price}</p>
                        <span className="inline-block mt-1 text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded-full border border-emerald-200">
                          Previously Ordered
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleWhatsAppReorder(
                          {
                            orderId: 'FAV-REORDER',
                            date: 'Today',
                            status: 'processing',
                            statusText: '',
                            deliveryDate: '',
                            items: [item],
                            totalAmount: item.price,
                            shippingAddress: userInfo.address,
                          },
                          item
                        )
                      }
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors shrink-0"
                      title="Re-Order this piece on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SAVED ADDRESS & ACCOUNT SETTINGS */}
          {activeTab === 'address' && (
            <div className="space-y-5">
              <div className="bg-white border border-[#E0D3B5] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C59B27]" />
                    <h3 className="text-sm font-bold text-stone-900 font-serif">
                      Default Delivery Address
                    </h3>
                  </div>
                  <span className="text-[10px] bg-[#F3EBDA] text-[#8C6418] px-2 py-0.5 rounded-full font-bold">
                    Primary Address
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="w-full bg-[#FAF7F2] text-stone-800 text-xs p-2.5 rounded-xl border border-[#E0D3B5] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Phone Number (WhatsApp Enabled)
                      </label>
                      <input
                        type="text"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] text-stone-800 text-xs p-2.5 rounded-xl border border-[#E0D3B5] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full bg-[#FAF7F2] text-stone-800 text-xs p-2.5 rounded-xl border border-[#E0D3B5] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      Complete Street Address & Pincode
                    </label>
                    <textarea
                      rows={2}
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                      className="w-full bg-[#FAF7F2] text-stone-800 text-xs p-2.5 rounded-xl border border-[#E0D3B5] focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                    />
                  </div>

                  <button
                    onClick={() => showToast('Address and contact settings updated successfully!')}
                    className="w-full bg-[#2C241D] text-[#DFBA53] font-bold text-xs py-2.5 rounded-xl hover:bg-black transition-colors"
                  >
                    Save Address & Profile Details
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Banner */}
        <div className="sticky bottom-0 bg-[#F5F0E6] p-4 border-t border-[#E0D3B5] flex items-center justify-between text-xs text-stone-600 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
            <span>18k Gold Anti-Tarnish Guarantee • Lifetime Polish Support</span>
          </div>

          <a
            href="https://wa.me/917058859619"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8C6418] font-bold hover:underline flex items-center gap-1"
          >
            <span>Need Help? Contact Concierge</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
