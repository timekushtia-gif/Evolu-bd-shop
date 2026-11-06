import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Language, Coupon, OrderStatus, PageView } from '../types';
import { PRODUCTS, AVAILABLE_COUPONS, INITIAL_DEMO_ORDERS } from '../data/products';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Navigation & Page routing
  activeView: PageView;
  setActiveView: (view: PageView) => void;
  navigateTo: (view: PageView, params?: { productId?: string; categoryId?: string; orderId?: string }) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Orders & Tracking
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingSteps' | 'courier'>) => Order;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  advanceOrderStatus: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderCourier: (orderId: string, courierData: Partial<Order['courier']>) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Admin Authentication
  isAdminLoggedIn: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Helpers
  t: (key: string) => string;
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  bn: {
    'brand.name': 'EVolu',
    'nav.home': 'হোম',
    'nav.shop': 'সকল পণ্য',
    'nav.categories': 'ক্যাটাগরি',
    'nav.tracking': 'অর্ডার ট্র্যাকিং',
    'nav.orders': 'অর্ডার হিস্ট্রি',
    'nav.wishlist': 'উইশলিস্ট',
    'nav.cart': 'শপিং কার্ট',
    'nav.contact': 'যোগাযোগ ও সাপোর্ট',
    'nav.admin': 'অ্যাডমিন প্যানেল',
    'nav.search_placeholder': 'পণ্য, হেডফোন বা ঘড়ি খুঁজুন...',
    'hero.badge': 'নতুন কালেকশন ২০২৬',
    'hero.title': 'আধুনিক লাইফস্টাইল ও প্রিমিয়াম গ্যাজেট সম্ভার',
    'hero.subtitle': 'অরিজিনাল ব্র্যান্ড ওয়ারেন্টি, দ্রুততম হোম ডেলিভারি এবং সহজ অনলাইন পেমেন্ট বা ক্যাশ অন ডেলিভারিতে শপিং করুন নিশ্চিন্তে।',
    'hero.cta_shop': 'এখনই কিনুন',
    'hero.cta_track': 'অর্ডার ট্র্যাক করুন',
    'feature.genuine': '১০০% অরিজিনাল পণ্য',
    'feature.genuine_desc': 'সরাসরি ব্র্যান্ড থেকে আমদানিকৃত',
    'feature.delivery': '২৪-৪৮ ঘণ্টায় হোম ডেলিভারি',
    'feature.delivery_desc': 'সমগ্র বাংলাদেশে দ্রুততম ডেলিভারি',
    'feature.payment': 'নিরাপদ অনলাইন পেমেন্ট',
    'feature.payment_desc': 'বিকাশ, নগদ, রকেট ও কার্ডে পেমেন্ট',
    'feature.warranty': 'অফিসিয়াল ওয়ারেন্টি ব্যাকড',
    'feature.warranty_desc': 'সহজ রিপ্লেসমেন্ট গ্যারান্টি',
    'section.featured': 'জনপ্রিয় গ্যাজেট ও লাইফস্টাইল পণ্য',
    'section.featured_sub': 'সেরা রিভিউ প্রাপ্ত এবং সবচেয়ে বেশি বিক্রীত অরিজিনাল কালেকশন',
    'filter.all': 'সকল পণ্য',
    'filter.audio': 'অডিও ও সাউন্ড',
    'filter.wearables': 'স্মার্ট ওয়্যারেবল',
    'filter.carry': 'ট্রাভেল ও ব্যাকপ্যাক',
    'filter.workspace': 'ওয়ার্কস্পেস',
    'filter.gadgets': 'স্মার্ট গ্যাজেট',
    'btn.add_to_cart': 'কার্ডে যোগ করুন',
    'btn.buy_now': 'সরাসরি কিনুন',
    'btn.view_details': 'বিস্তারিত পেজ দেখুন',
    'stock.in': 'স্টকে আছে',
    'stock.out': 'স্টক শেষ',
    'cart.title': 'আপনার শপিং কার্ট',
    'cart.empty': 'আপনার কার্টটি এখনো খালি',
    'cart.empty_sub': 'পছন্দের পণ্যটি কার্টে যুক্ত করুন এবং কেনাকাটা শুরু করুন',
    'cart.subtotal': 'সাবটোটাল',
    'cart.discount': 'ডিসকাউন্ট ছাড়',
    'cart.shipping': 'ডেলিভারি চার্জ',
    'cart.total': 'সর্বমোট',
    'cart.checkout': 'চেকআউটে যান',
    'cart.free_shipping_notice': '৳৩,০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি!',
    'cart.free_shipping_achieved': 'অভিনন্দন! আপনার ডেলিভারি একদম ফ্রি',
    'coupon.apply': 'প্রয়োগ করুন',
    'coupon.placeholder': 'কুপন কোড (যেমন: EVOLU10)',
    'tracking.title': 'লাইভ অর্ডার ট্র্যাকিং',
    'tracking.subtitle': 'আপনার অর্ডার আইডি দিয়ে বর্তমান ডেলিভারি স্ট্যাটাস ও অবস্থান জানুন',
    'tracking.input_label': 'অর্ডার আইডি লিখুন',
    'tracking.placeholder': 'উদা: EV-849204',
    'tracking.btn_search': 'ট্র্যাক করুন',
    'tracking.simulate_btn': 'পরবর্তী স্টেজ সিমুলেট করুন',
    'tracking.courier_details': 'কুরিয়ার ও রাইডার তথ্য',
    'tracking.estimated_arrival': 'সম্ভাব্য পৌঁছানোর সময়',
    'payment.method': 'পেমেন্ট মাধ্যম',
    'payment.bkash': 'বিকাশ পেমেন্ট',
    'payment.nagad': 'নগদ পেমেন্ট',
    'payment.rocket': 'রকেট',
    'payment.card': 'ডেবিট / ক্রেডিট কার্ড',
    'payment.cod': 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)',
    'checkout.title': 'অর্ডার ও পেমেন্ট সম্পন্ন করুন',
    'checkout.shipping_info': '১. ডেলিভারি ঠিকানা',
    'checkout.payment_info': '২. পেমেন্ট পদ্ধতি নির্ধারণ',
    'checkout.name': 'পূর্ণ নাম',
    'checkout.phone': 'মোবাইল নম্বর',
    'checkout.email': 'ইমেইল এড্রেস',
    'checkout.address': 'পূর্ণ ঠিকানা (বাসা/রোড/এলাকা)',
    'checkout.city': 'শহর / জেলা',
    'checkout.area': 'থানা / এরিয়া',
    'checkout.postal': 'পোস্ট কোড',
    'checkout.notes': 'বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)',
    'checkout.confirm_pay': 'অর্ডার ও পেমেন্ট নিশ্চিত করুন',
    'checkout.success_title': 'আপনার অর্ডারটি সফল হয়েছে!',
    'checkout.success_sub': 'অর্ডার কনফার্মেশন ও ট্র্যাকিং কোড প্রস্তুত হয়েছে',
  },
  en: {
    'brand.name': 'EVolu',
    'nav.home': 'Home',
    'nav.shop': 'All Products',
    'nav.categories': 'Categories',
    'nav.tracking': 'Track Order',
    'nav.orders': 'Order History',
    'nav.wishlist': 'Wishlist',
    'nav.cart': 'Shopping Bag',
    'nav.contact': 'Contact & Support',
    'nav.admin': 'Admin Panel',
    'nav.search_placeholder': 'Search headphones, watches, bags...',
    'hero.badge': 'Collection 2026',
    'hero.title': 'Refined Everyday Tech & Lifestyle Essentials',
    'hero.subtitle': 'Curated studio-grade acoustics, titanium smart wearables, and architectural workspace gear with nationwide 24-48h express delivery.',
    'hero.cta_shop': 'Explore Store',
    'hero.cta_track': 'Track Live Order',
    'feature.genuine': '100% Authentic',
    'feature.genuine_desc': 'Direct verified warranty imports',
    'feature.delivery': 'Express 24-48h Delivery',
    'feature.delivery_desc': 'Doorstep across Bangladesh',
    'feature.payment': 'Seamless Online Payment',
    'feature.payment_desc': 'bKash, Nagad, Visa, Mastercard, COD',
    'feature.warranty': 'Official Brand Warranty',
    'feature.warranty_desc': 'Hassle-free 7-day replacement',
    'section.featured': 'Signature Essentials',
    'section.featured_sub': 'Engineered for tactile precision, acoustic purity, and architectural living.',
    'filter.all': 'All Products',
    'filter.audio': 'Audio & Acoustics',
    'filter.wearables': 'Smart Wearables',
    'filter.carry': 'Everyday Carry',
    'filter.workspace': 'Workspace',
    'filter.gadgets': 'Smart Gadgets',
    'btn.add_to_cart': 'Add to Cart',
    'btn.buy_now': 'Buy Now',
    'btn.view_details': 'View Dedicated Page',
    'stock.in': 'In Stock',
    'stock.out': 'Out of Stock',
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.empty_sub': 'Discover our curated essentials and add them to your cart',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Discount',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.free_shipping_notice': 'Add more to unlock Free Nationwide Delivery (orders over ৳3,000)!',
    'cart.free_shipping_achieved': 'Free Express Delivery unlocked!',
    'coupon.apply': 'Apply',
    'coupon.placeholder': 'Promo code (e.g. EVOLU10)',
    'tracking.title': 'Live Order Tracking',
    'tracking.subtitle': 'Monitor dispatch status, logistics hub transfers, and courier agent contact in real-time.',
    'tracking.input_label': 'Enter Order Tracking ID',
    'tracking.placeholder': 'e.g. EV-849204',
    'tracking.btn_search': 'Track Order',
    'tracking.simulate_btn': 'Simulate Next Stage',
    'tracking.courier_details': 'Courier & Agent Logistics',
    'tracking.estimated_arrival': 'Estimated Delivery Window',
    'payment.method': 'Payment Gateway',
    'payment.bkash': 'bKash Wallet',
    'payment.nagad': 'Nagad Online',
    'payment.rocket': 'Rocket',
    'payment.card': 'Debit / Credit Card',
    'payment.cod': 'Cash on Delivery (COD)',
    'checkout.title': 'Secure Checkout & Payment',
    'checkout.shipping_info': '1. Delivery Details',
    'checkout.payment_info': '2. Select Payment Method',
    'checkout.name': 'Full Name',
    'checkout.phone': 'Phone Number',
    'checkout.email': 'Email Address',
    'checkout.address': 'Street Address / Apartment',
    'checkout.city': 'City / Division',
    'checkout.area': 'Area / Thana',
    'checkout.postal': 'Postal Code',
    'checkout.notes': 'Delivery Notes (Optional)',
    'checkout.confirm_pay': 'Authorize Payment & Place Order',
    'checkout.success_title': 'Order Confirmed!',
    'checkout.success_sub': 'Your order has been verified and registered for priority dispatch.',
  },
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  
  // Products persisted to localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('evolu_products_v2');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('evolu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('evolu_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state persisted to localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('evolu_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  // Admin login status
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('evolu_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeView, setActiveView] = useState<PageView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => products[0] || null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('EV-849204');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem('evolu_products_v2', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('evolu_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('evolu_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('evolu_orders_v2', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const formatPrice = (amount: number): string => {
    return `৳${amount.toLocaleString('en-US')}`;
  };

  // Centralized Page Navigation Helper
  const navigateTo = (view: PageView, params?: { productId?: string; categoryId?: string; orderId?: string }) => {
    if (params?.productId) {
      const prod = products.find((p) => p.id === params.productId);
      if (prod) setSelectedProduct(prod);
    }
    if (params?.categoryId) {
      setActiveCategory(params.categoryId);
    }
    if (params?.orderId) {
      setTrackingOrderId(params.orderId);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'>): Product => {
    const id = `ev-custom-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      rating: 5.0,
      reviewsCount: 1,
      reviews: [
        {
          id: `rev-initial-${Date.now()}`,
          user: 'EVolu Verified',
          rating: 5,
          date: 'Today',
          comment: 'New authentic brand arrival in store.',
          commentBn: 'স্টোরে নতুন সংযুক্ত অরিজিনাল পণ্য।',
          verified: true,
        },
      ],
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(language === 'bn' ? 'নতুন পণ্য সফলভাবে আপলোড হয়েছে!' : 'Product uploaded successfully!');
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const res = { ...p, ...updated };
          if (selectedProduct?.id === id) setSelectedProduct(res);
          return res;
        }
        return p;
      })
    );
    showToast(language === 'bn' ? 'পণ্য সফলভাবে আপডেট করা হয়েছে!' : 'Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(language === 'bn' ? 'পণ্যটি ডিলিট করা হয়েছে!' : 'Product deleted successfully!', 'info');
  };

  // Admin Auth
  const adminLogin = (password: string): boolean => {
    if (password === 'shomrat11@11') {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem('evolu_admin_session', 'true');
      } catch (e) {
        console.error(e);
      }
      showToast(language === 'bn' ? 'অ্যাডমিন প্যানেলে স্বাগতম!' : 'Welcome to Admin Dashboard!');
      return true;
    }
    showToast(language === 'bn' ? 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।' : 'Incorrect password! Try again.', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('evolu_admin_session');
    } catch (e) {
      console.error(e);
    }
    showToast(language === 'bn' ? 'অ্যাডমিন লগআউট সম্পন্ন হয়েছে' : 'Admin logged out successfully', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity, selectedColor: color || product.colors?.[0]?.name, selectedSize: size }];
    });
    showToast(
      language === 'bn' 
        ? `${product.nameBn} কার্ডে যোগ করা হয়েছে` 
        : `Added ${product.name} to cart`
    );
  };

  const removeFromCart = (productId: string, color?: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && (!color || item.selectedColor === color))));
  };

  const updateQuantity = (productId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!color || item.selectedColor === color)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart Calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      cartDiscount = appliedCoupon.flatDiscount;
    }
  }

  // Free shipping threshold ৳3000 or coupon
  const isFreeShipping = cartSubtotal >= 3000 || (appliedCoupon && appliedCoupon.freeShipping);
  const cartShipping = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 70);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === trimmed);
    if (!coupon) {
      return {
        success: false,
        message: language === 'bn' ? 'অকার্যকর কুপন কোড' : 'Invalid promo code',
      };
    }
    if (cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: language === 'bn' 
          ? `এই কুপনের জন্য সর্বনিম্ন ৳${coupon.minSpend} এর অর্ডার প্রয়োজন` 
          : `Minimum spend of ৳${coupon.minSpend} required for this coupon`,
      };
    }
    setAppliedCoupon(coupon);
    return {
      success: true,
      message: language === 'bn' ? 'কুপন সফলভাবে প্রয়োগ করা হয়েছে!' : 'Coupon applied successfully!',
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist', 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(language === 'bn' ? 'উইশলিস্টে যুক্ত করা হয়েছে' : 'Added to wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Orders & Tracking
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingSteps' | 'courier'>): Order => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newId = `EV-${randomNum}`;
    const nowStr = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: nowStr,
      status: 'confirmed',
      trackingSteps: [
        {
          status: 'confirmed',
          title: 'Order Confirmed & Paid',
          titleBn: 'অর্ডার ও পেমেন্ট কনফার্ম হয়েছে',
          description: `Payment received via ${orderData.payment.method.toUpperCase()}. Order dispatched to packing hub.`,
          descriptionBn: `${orderData.payment.method.toUpperCase()} মাধ্যমে পেমেন্ট নিশ্চিত হয়েছে। অর্ডার প্রস্তুত শুরু হয়েছে।`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'processing',
          title: 'Quality Check & Packing',
          titleBn: 'কোয়ালিটি চেক ও প্যাকেজিং',
          description: 'Items will undergo safety inspection and sealed packaging.',
          descriptionBn: 'নিরাপত্তা নিরীক্ষণ ও সিল প্যাকেজিং প্রক্রিয়াধীন।',
          completed: false,
        },
        {
          status: 'packed',
          title: 'Dispatched to Sorting Center',
          titleBn: 'সর্টিং সেন্টারে প্রেরণ',
          description: 'Package ready for courier pickup at central distribution depot.',
          descriptionBn: 'কুরিয়ার পিকআপের জন্য কেন্দ্রীয় হাবে হস্তান্তর প্রস্তুত।',
          completed: false,
        },
        {
          status: 'shipped',
          title: 'Out for Doorstep Delivery',
          titleBn: 'ডেলিভারির জন্য বের হয়েছে',
          description: 'Assigned courier rider on the route to customer address.',
          descriptionBn: 'রাইডার পণ্য নিয়ে আপনার ঠিকানার দিকে বের হয়েছে।',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered',
          titleBn: 'সফলভাবে ডেলিভারি সম্পন্ন',
          description: 'Package handed over and signed by recipient.',
          descriptionBn: 'গ্রাহকের নিকট সফলভাবে পৌঁছে দেওয়া হয়েছে।',
          completed: false,
        },
      ],
      courier: {
        name: 'Steadfast Priority Logistics',
        trackingCode: `STF-EV-${randomNum}`,
        hub: `${orderData.customer.city} Regional Delivery Hub`,
        riderName: 'Jashim Uddin',
        riderPhone: '01899-234567',
        estimatedDelivery: 'Within 24-48 Hours',
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderId(newId);
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const statusSequence: OrderStatus[] = ['confirmed', 'processing', 'packed', 'shipped', 'delivered'];
        const currentIndex = statusSequence.indexOf(order.status);
        if (currentIndex === -1 || currentIndex >= statusSequence.length - 1) {
          return order;
        }

        const nextStatus = statusSequence[currentIndex + 1];
        const nextSteps = order.trackingSteps.map((step, idx) => {
          if (idx <= currentIndex + 1) {
            return {
              ...step,
              completed: true,
              current: idx === currentIndex + 1,
              timestamp: step.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return {
            ...step,
            completed: false,
            current: false,
          };
        });

        return {
          ...order,
          status: nextStatus,
          trackingSteps: nextSteps,
        };
      })
    );
    showToast(
      language === 'bn' 
        ? 'অর্ডারের ডেলিভারি স্ট্যাটাস পরবর্তী ধাপে আপডেট হয়েছে!' 
        : 'Order tracking stage successfully advanced!',
      'info'
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const statusSequence: OrderStatus[] = ['confirmed', 'processing', 'packed', 'shipped', 'delivered'];
        const targetIndex = statusSequence.indexOf(status);

        const nextSteps = order.trackingSteps.map((step, idx) => ({
          ...step,
          completed: idx <= targetIndex,
          current: idx === targetIndex,
          timestamp: step.timestamp || (idx <= targetIndex ? 'Updated by Admin' : undefined),
        }));

        return {
          ...order,
          status,
          trackingSteps: nextSteps,
        };
      })
    );
    showToast(language === 'bn' ? `অর্ডার স্ট্যাটাস "${status}" এ পরিবর্তন করা হয়েছে!` : `Order status changed to ${status}`);
  };

  const updateOrderCourier = (orderId: string, courierData: Partial<Order['courier']>) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          courier: {
            ...order.courier,
            ...courierData,
          },
        };
      })
    );
    showToast(language === 'bn' ? 'কুরিয়ার ও রাইডারের তথ্য আপডেট হয়েছে!' : 'Courier & Rider info updated!');
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        navigateTo,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        trackingOrderId,
        setTrackingOrderId,
        advanceOrderStatus,
        updateOrderStatus,
        updateOrderCourier,
        getOrderById,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        toasts,
        showToast,
        dismissToast,
        t,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
