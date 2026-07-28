export type ProductCategory = 'necklaces' | 'bracelets' | 'hampers' | 'under499' | 'all';

export interface Product {
  id: string;
  name: string;
  category: 'necklaces' | 'bracelets' | 'hampers';
  price: number; // Offer Price (e.g., 399)
  mrp: number; // Struck-through price (e.g., 1000)
  rating: number;
  reviewCount: number;
  image: string;
  hoverImage?: string;
  description: string;
  tags: string[]; // e.g. ["18k Gold Plated", "Waterproof", "Hypoallergenic", "Anti-Tarnish"]
  specs?: {
    material: string;
    plating: string;
    chainLength?: string;
    warranty: string;
    waterproof: boolean;
  };
  isBestseller?: boolean;
  isNew?: boolean;
  isUnder499?: boolean;
  comboTier?: 'combo999' | 'combo1399' | 'combo1599';
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  giftNote?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  addressType?: 'home' | 'work' | 'gift';
  giftNote?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  memberTier?: string;
  rewardPoints?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isLoggedIn: boolean;
  loginMethod?: 'gmail' | 'phone';
  createdAt?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  createdAt?: number;
  comment: string;
  productName: string;
  verified: boolean;
  avatar?: string;
  helpfulCount?: number;
}

export interface AIStylistRecommendation {
  greeting: string;
  recommendedStyles: string[];
  stylingAdvice: string;
  giftMessage: string;
}

export interface PendantRecommendationItem {
  product: Product;
  whyItSuitsYou: string;
}

export interface PendantMatchResult {
  outfitObservation: string;
  recommendations: PendantRecommendationItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  imageUri?: string;
  recommendedProducts?: Product[];
  pendantMatchResult?: PendantMatchResult;
}

