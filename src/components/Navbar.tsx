import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Package,
  X,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle,
  Menu,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    activeView,
    navigateTo,
    cartTotalCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    products,
    t,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search filtering
  const matchingProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameBn.includes(searchQuery) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSelectSearchProduct = (product: any) => {
    navigateTo('product-detail', { productId: product.id });
    setIsSearchOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { view: 'home' as const, label: t('nav.home') },
    { view: 'shop' as const, label: t('nav.shop') },
    { view: 'categories' as const, label: t('nav.categories') },
    { view: 'tracking' as const, label: t('nav.tracking'), icon: Package },
    { view: 'orders' as const, label: t('nav.orders') },
    { view: 'contact' as const, label: t('nav.contact') },
    { view: 'admin' as const, label: t('nav.admin'), highlight: true, icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark & Icon */}
        <button
          onClick={() => navigateTo('home')}
          className="shrink-0 hover:opacity-90 transition-opacity cursor-pointer text-left"
          aria-label="EVolu Home"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: Dedicated Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-semibold text-neutral-600">
          {navLinks.map((item) => {
            const isActive = activeView === item.view;
            const IconComp = item.icon;

            return (
              <button
                key={item.view}
                onClick={() => navigateTo(item.view)}
                className={`whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg ${
                  item.highlight
                    ? isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold border border-neutral-300/80'
                    : isActive
                    ? 'text-neutral-950 font-bold underline underline-offset-8 decoration-2 decoration-indigo-600'
                    : 'hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                {IconComp && <IconComp className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search, Wishlist, Cart & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Live Search Trigger & Bar */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-3 py-1.5 w-44 sm:w-60 border border-neutral-300">
                <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search_placeholder')}
                  className="bg-transparent text-xs sm:text-sm text-neutral-900 focus:outline-none w-full"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-600 hover:text-neutral-950 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Search"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Quick search dropdown */}
            {isSearchOpen && matchingProducts.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50">
                <div className="px-3 py-1 text-[11px] text-neutral-400 uppercase tracking-wider font-bold">
                  {language === 'bn' ? 'অনুসন্ধানের ফলাফল' : 'Quick Results'}
                </div>
                {matchingProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelectSearchProduct(prod)}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {language === 'bn' ? prod.nameBn : prod.name}
                      </div>
                      <div className="text-xs text-neutral-500 tabular-nums">
                        ৳{prod.price.toLocaleString('en-US')}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Page Trigger */}
          <button
            onClick={() => navigateTo('wishlist')}
            className={`p-2 rounded-xl transition-colors relative cursor-pointer ${
              activeView === 'wishlist' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
            title="Wishlist Page"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 && activeView !== 'wishlist' ? 'text-red-500 fill-red-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-2.5 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            title="Toggle language"
          >
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>

          {/* Dedicated Cart Page Trigger */}
          <button
            onClick={() => navigateTo('cart')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
              activeView === 'cart'
                ? 'bg-neutral-950 text-white ring-2 ring-indigo-500'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('cart.title')}</span>
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-mono tabular-nums">
              {cartTotalCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-neutral-700 hover:text-neutral-950 rounded-xl hover:bg-neutral-100"
            aria-label="Mobile Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 p-4 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                navigateTo(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 text-left text-xs font-bold rounded-xl flex items-center justify-between cursor-pointer ${
                activeView === item.view ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
