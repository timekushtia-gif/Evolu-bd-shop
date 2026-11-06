import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Heart,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Check,
  Sparkles,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    navigateTo,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    language,
    showToast,
    t,
  } = useStore();

  const product = selectedProduct || products[0];

  const [activeImg, setActiveImg] = useState<string>(product.image);
  const [activeColor, setActiveColor] = useState<string>(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  // Related Products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleBuyNow = () => {
    addToCart(product, quantity, activeColor);
    navigateTo('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    setIsSubmittingReview(true);
    setTimeout(() => {
      product.reviews.unshift({
        id: `rev-${Date.now()}`,
        user: newReviewAuthor.trim(),
        rating: newReviewRating,
        date: 'Just now',
        comment: newReviewText.trim(),
        verified: true,
      });
      product.reviewsCount += 1;
      setIsSubmittingReview(false);
      setNewReviewAuthor('');
      setNewReviewText('');
      showToast(language === 'bn' ? 'আপনার রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Your review has been submitted!');
    }, 400);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Product link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <button
          onClick={() => navigateTo('shop')}
          className="flex items-center gap-1.5 hover:text-neutral-950 font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'সকল পণ্যে ফিরে যান' : 'Back to Shop'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span>{product.brand}</span>
          <span>/</span>
          <span className="font-semibold text-neutral-900 capitalize">{product.category}</span>
        </div>
      </div>

      {/* Main 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 relative group shadow-sm">
            <img
              src={activeImg || product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />

            {/* Wishlist and Share Floating Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 rounded-full bg-white/95 backdrop-blur-sm text-neutral-700 hover:text-red-500 shadow-md transition-all cursor-pointer hover:scale-110"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/95 backdrop-blur-sm text-neutral-700 hover:text-neutral-950 shadow-md transition-all cursor-pointer hover:scale-110"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {product.isNew && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">
                {language === 'bn' ? 'নতুন আগমন' : 'New Release'}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    (activeImg || product.image) === img
                      ? 'border-neutral-950 scale-102 ring-2 ring-neutral-300'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantees Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-neutral-900">{language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Express Delivery'}</div>
                <div className="text-neutral-500">২৪-৪৮ ঘণ্টার মধ্যে</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-neutral-900">{language === 'bn' ? '১০০% অরিজিনাল' : '100% Genuine'}</div>
                <div className="text-neutral-500">ব্র্যান্ড ওয়ারেন্টি সহ</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-neutral-900">{language === 'bn' ? '৭ দিনের রিটার্ন' : 'Easy Returns'}</div>
                <div className="text-neutral-500">সহজ প্রতিস্থাপন</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-neutral-400">
              {product.brand} · {language === 'bn' ? product.categoryLabelBn : product.categoryLabel}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950 mt-1">
              {language === 'bn' ? product.nameBn : product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="flex items-center gap-1 font-bold text-neutral-900 bg-amber-50 px-2 py-1 rounded-md text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
              </span>
              <span className="text-neutral-500">{product.reviewsCount} {language === 'bn' ? 'টি কাস্টমার রিভিউ' : 'reviews'}</span>
              <span className="text-neutral-300">·</span>
              <span className="text-emerald-700 font-bold">
                {product.inStock ? `${product.stockCount} ${language === 'bn' ? 'টি স্টকে আছে' : 'in stock'}` : t('stock.out')}
              </span>
            </div>
          </div>

          {/* Price Container */}
          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono text-neutral-950 tabular-nums">
              ৳{product.price.toLocaleString('en-US')}
            </span>
            {product.originalPrice && (
              <span className="text-base text-neutral-400 line-through font-mono tabular-nums">
                ৳{product.originalPrice.toLocaleString('en-US')}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full ml-auto">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-800">
                {language === 'bn' ? 'কালার নির্বাচন:' : 'Select Color:'}{' '}
                <span className="font-normal text-neutral-500">{activeColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setActiveColor(c.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                      activeColor === c.name
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-800">
              {language === 'bn' ? 'পরিমাণ (Quantity)' : 'Quantity'}
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 hover:bg-neutral-100 font-bold text-neutral-700 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold font-mono text-neutral-950 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="px-3.5 py-2 hover:bg-neutral-100 font-bold text-neutral-700 cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                Total: <strong className="text-neutral-950 font-mono">৳{(product.price * quantity).toLocaleString('en-US')}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => addToCart(product, quantity, activeColor)}
              className="w-full py-3.5 px-4 bg-white border-2 border-neutral-900 hover:bg-neutral-50 text-neutral-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('btn.add_to_cart')}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-neutral-900/10"
            >
              <span>{t('btn.buy_now')} (৳{(product.price * quantity).toLocaleString('en-US')})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications / Description / Reviews */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            {language === 'bn' ? 'স্পেসিফিকেশন' : 'Specifications'}
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'desc'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            {language === 'bn' ? `গ্রাহক রিভিউ (${product.reviews.length})` : `Customer Reviews (${product.reviews.length})`}
          </button>
        </div>

        <div>
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(language === 'bn' && product.specsBn ? product.specsBn : product.specs).map(([k, v]) => (
                <div key={k} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between gap-4">
                  <span className="font-bold text-neutral-600">{k}</span>
                  <span className="font-semibold text-neutral-900 text-right">{v}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="prose prose-sm text-neutral-700 max-w-none leading-relaxed text-sm">
              <p>{language === 'bn' ? product.descriptionBn : product.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900">{rev.user}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {language === 'bn' ? 'যাচাইকৃত ক্রেতা' : 'Verified Purchase'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-700">
                      {language === 'bn' && rev.commentBn ? rev.commentBn : rev.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Review submit form */}
              <form onSubmit={handleAddReview} className="p-5 border border-neutral-200 rounded-2xl bg-white space-y-4">
                <div className="font-bold text-sm text-neutral-900">
                  {language === 'bn' ? 'আপনার মতামত বা রিভিউ দিন' : 'Write a Review'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                    className="p-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-neutral-900"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-medium">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea
                  required
                  rows={2}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder={language === 'bn' ? 'পণ্যটি সম্পর্কে লিখুন...' : 'Write your detailed review...'}
                  className="w-full p-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-neutral-900"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-neutral-950">
              {language === 'bn' ? 'সম্পর্কিত অন্যান্য পণ্য' : 'Related Essentials'}
            </h2>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs text-neutral-600 hover:text-neutral-950 font-semibold underline cursor-pointer"
            >
              {language === 'bn' ? 'আরও দেখুন' : 'Explore All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  navigateTo('product-detail', { productId: rel.id });
                }}
                className="bg-white rounded-2xl border border-neutral-200 p-4 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-3">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                </div>
                <div className="font-bold text-sm text-neutral-900 truncate">
                  {language === 'bn' ? rel.nameBn : rel.name}
                </div>
                <div className="text-xs font-mono font-bold text-neutral-950 mt-1">
                  ৳{rel.price.toLocaleString('en-US')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
