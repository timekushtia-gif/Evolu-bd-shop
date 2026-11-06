import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { OrderTrackingView } from './components/OrderTrackingView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { ArrowRight, ShieldCheck, Zap, Headphones, Watch, Backpack, Lamp } from 'lucide-react';

const HomePageContent: React.FC = () => {
  const { products, navigateTo, language } = useStore();

  const featuredList = products.slice(0, 6);

  const categoryHighlights = [
    { id: 'audio', label: 'Audio & Acoustics', labelBn: 'অডিও ও সাউন্ড', icon: Headphones, count: '3+ Models', color: 'from-blue-600 to-indigo-700' },
    { id: 'wearables', label: 'Smart Wearables', labelBn: 'স্মার্ট ওয়্যারেবল', icon: Watch, count: 'AMOLED Watches', color: 'from-rose-600 to-pink-700' },
    { id: 'carry', label: 'Everyday Carry', labelBn: 'ট্রাভেল ও ব্যাকপ্যাক', icon: Backpack, count: 'Weatherproof', color: 'from-amber-600 to-orange-700' },
    { id: 'workspace', label: 'Workspace Gear', labelBn: 'ওয়ার্কস্পেস ও স্টুডিও', icon: Lamp, count: 'Studio Lamps', color: 'from-emerald-600 to-teal-700' },
  ];

  return (
    <div className="space-y-16">
      {/* 1. Hero Showcase */}
      <HeroSection />

      {/* 2. Colorful Dynamic Category Quick Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-neutral-950">
              {language === 'bn' ? 'ক্যাটাগরি অনুযায়ী ব্রাউজ করুন' : 'Explore Top Categories'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'bn' ? 'সরাসরি পছন্দের পণ্যের কালেকশন দেখুন' : 'Quick access to curated lifestyle essentials'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'bn' ? 'সবগুলো ক্যাটাগরি' : 'All Categories'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryHighlights.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigateTo('shop', { categoryId: cat.id })}
                className="group relative p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[140px]"
              >
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    {language === 'bn' ? cat.labelBn : cat.label}
                  </h3>
                  <div className="text-[11px] text-neutral-400 font-medium">{cat.count}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Essentials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {language === 'bn' ? 'সিগনেচার কালেকশন' : 'Signature Collection'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950 mt-1">
              {language === 'bn' ? 'জনপ্রিয় গ্যাজেট ও লাইফস্টাইল পণ্য' : 'Top Trending Essentials'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {language === 'bn'
                ? 'সেরা রিভিউ প্রাপ্ত এবং সবচেয়ে বেশি বিক্রীত অরিজিনাল কালেকশন'
                : 'Highest rated acoustics, smart wearables, and workspaces.'}
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'Explore All Products'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Live Tracking Interactive Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-neutral-950 via-neutral-900 to-indigo-950 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-neutral-800">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Real-Time Logistics Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              {language === 'bn'
                ? 'অনলাইন পেমেন্ট করুন এবং লাইভ অর্ডার ট্র্যাক করুন'
                : 'Seamless Online Payment with Real-Time Tracking'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {language === 'bn'
                ? 'বিকাশ, নগদ, কার্ড অথবা ক্যাশ অন ডেলিভারিতে শপিং করে সরাসরি প্রতিটি ডেলিভারি স্টেজ ট্র্যাক করুন।'
                : 'Pay with bKash, Nagad, Visa, Mastercard or Cash on Delivery. Track rider contact, logistics hub and delivery status.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => navigateTo('tracking')}
              className="px-6 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'bn' ? 'লাইভ ট্র্যাকার খুলুন' : 'Open Order Tracker'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeView, navigateTo, language } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/70 text-neutral-900">
      {/* Main Top Navigation */}
      <Navbar />

      {/* Main View Router (Every button renders its own full dedicated page!) */}
      <main className="flex-1">
        {activeView === 'home' && <HomePageContent />}
        {activeView === 'shop' && <ShopPage />}
        {activeView === 'product-detail' && <ProductDetailPage />}
        {activeView === 'categories' && <CategoriesPage />}
        {activeView === 'wishlist' && <WishlistPage />}
        {activeView === 'cart' && <CartPage />}
        {activeView === 'checkout' && <CheckoutPage />}
        {activeView === 'tracking' && <OrderTrackingView />}
        {activeView === 'orders' && <OrderHistoryView />}
        {activeView === 'contact' && <ContactPage />}
        {activeView === 'admin' && <AdminPage />}
      </main>

      {/* Global Notifications Toast Container */}
      <ToastContainer />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
