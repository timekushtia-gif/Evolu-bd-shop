import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Search, X, Sparkles } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    language,
    t,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: t('filter.all'), icon: '✨' },
    { id: 'audio', label: t('filter.audio'), icon: '🎧' },
    { id: 'wearables', label: t('filter.wearables'), icon: '⌚' },
    { id: 'carry', label: t('filter.carry'), icon: '🎒' },
    { id: 'workspace', label: t('filter.workspace'), icon: '💡' },
    { id: 'gadgets', label: t('filter.gadgets'), icon: '⚡' },
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    let result = products.filter((prod) => {
      const matchCat = activeCategory === 'all' || prod.category === activeCategory;
      const matchPrice = prod.price <= maxPrice;
      const matchStock = !onlyInStock || (prod.inStock && prod.stockCount > 0);
      const matchSearch =
        !searchQuery.trim() ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.nameBn.includes(searchQuery) ||
        prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchPrice && matchStock && matchSearch;
    });

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy, maxPrice, onlyInStock]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'অরিজিনাল ব্র্যান্ড শপ' : 'Official Catalog & Store'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            {language === 'bn' ? 'সকল প্রিমিয়াম গ্যাজেট ও লাইফস্টাইল' : 'Curated Tech & Everyday Essentials'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {language === 'bn'
              ? 'নিখুঁত সাউন্ড, স্মার্ট গ্যাজেট এবং আধুনিক ওয়ার্কস্পেস পণ্যের বিশাল কালেকশন।'
              : 'Engineered for audio purity, tactile precision, and everyday carry comfort.'}
          </p>
        </div>
      </div>

      {/* Main Filter & Products Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>{language === 'bn' ? 'ফিল্টার অপশন' : 'Filter Options'}</span>
            </h3>
            {(activeCategory !== 'all' || maxPrice < 15000 || onlyInStock || searchQuery) && (
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setMaxPrice(15000);
                  setOnlyInStock(false);
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                {language === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
            )}
          </div>

          {/* Search box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800">
              {language === 'bn' ? 'অনুসন্ধান' : 'Search Store'}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search_placeholder')}
                className="w-full pl-9 pr-7 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800">
              {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Categories'}
            </label>
            <div className="space-y-1">
              {categories.map((c) => {
                const count = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      activeCategory === c.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.icon}</span>
                      <span>{c.label}</span>
                    </span>
                    <span className="font-mono text-[11px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-neutral-800">
                {language === 'bn' ? 'সর্বোচ্চ বাজেট:' : 'Max Budget:'}
              </label>
              <span className="font-mono font-bold text-indigo-600 tabular-nums">৳{maxPrice.toLocaleString('en-US')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-neutral-900"
              />
              <span>{language === 'bn' ? 'কেবল স্টকে থাকা পণ্য দেখান' : 'In-Stock Only'}</span>
            </label>
          </div>
        </div>

        {/* Right Products Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="text-xs text-neutral-600 font-medium">
              {filteredProducts.length} {language === 'bn' ? 'টি পণ্য পাওয়া গেছে' : 'products found'}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">{language === 'bn' ? 'সর্ট করুন:' : 'Sort by:'}</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="p-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-neutral-900 font-medium cursor-pointer"
              >
                <option value="featured">{language === 'bn' ? 'নির্বাচিত (Featured)' : 'Featured'}</option>
                <option value="price-low">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-high">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="rating">{language === 'bn' ? 'সেরা রেটিং' : 'Rating'}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
              <p className="text-base font-bold text-neutral-800">
                {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products matched criteria'}
              </p>
              <p className="text-xs text-neutral-500">
                {language === 'bn' ? 'বাজেট বাড়িয়ে বা ফিল্টার শিথিল করে দেখুন।' : 'Try adjusting the price slider or clear filters.'}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setMaxPrice(15000);
                  setOnlyInStock(false);
                }}
                className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {language === 'bn' ? 'সকল ফিল্টার মুছুন' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
