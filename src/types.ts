export type Language = 'bn' | 'en';

export type PageView =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'categories'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'tracking'
  | 'orders'
  | 'contact'
  | 'admin';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  commentBn?: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  brand: string;
  category: 'audio' | 'wearables' | 'carry' | 'workspace' | 'gadgets';
  categoryLabel: string;
  categoryLabelBn: string;
  price: number; // in BDT (৳)
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  descriptionBn: string;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  specs: Record<string, string>;
  specsBn?: Record<string, string>;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod';

export type OrderStatus = 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    area: string;
    postalCode?: string;
    deliveryNotes?: string;
  };
  payment: {
    method: PaymentMethod;
    status: 'paid' | 'pending';
    transactionId?: string;
    accountNumber?: string;
  };
  summary: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    couponApplied?: string;
  };
  status: OrderStatus;
  trackingSteps: TrackingStep[];
  courier: {
    name: string;
    trackingCode: string;
    hub: string;
    riderName: string;
    riderPhone: string;
    estimatedDelivery: string;
  };
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  freeShipping?: boolean;
  minSpend: number;
  description: string;
  descriptionBn: string;
}

