import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    language,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setIsCartOpen,
    showToast,
    t,
  } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');
  
  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!selectedProduct) return null;

  const currentImg = selectedImage || selectedProduct.image;
  const isWishlisted = isInWishlist(selectedProduct.id);
  const activeColor = selectedColor || selectedProduct.colors?.[0]?.name || '';

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, activeColor);
    setSelectedProduct(null);
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    setIsSubmittingReview(true);
    setTimeout(() => {
      selectedProduct.reviews.unshift({
        id: `rev-${Date.now()}`,
        user: newReviewAuthor.trim(),
        rating: newReviewRating,
        date: 'Just now',
        comment: newReviewText.trim(),
        verified: true,
      });
      selectedProduct.reviewsCount += 1;
      setIsSubmittingReview(false);
      setNewReviewAuthor('');
      setNewReviewText('');
      showToast(language === 'bn' ? 'আপনার রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Your review has been submitted!');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedProduct(null)}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-neutral-200 z-10 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            {selectedProduct.brand} · {language === 'bn' ? selectedProduct.categoryLabelBn : selectedProduct.categoryLabel}
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Main 2-Column Contiguous Purchase Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 relative">
                <img
                  src={currentImg}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-neutral-700 hover:text-red-500 transition-colors cursor-pointer"
                  title="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
                <div className="flex gap-2">
                  {selectedProduct.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        currentImg === img ? 'border-neutral-950 scale-102' : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Mini Guarantees */}
              <div className="p-3.5 bg-neutral-50 rounded-xl space-y-2 border border-neutral-200/60 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>{language === 'bn' ? '২৪-৪৮ ঘণ্টার মধ্যে দ্রুত হোম ডেলিভারি' : 'Express delivery in 24-48 hours'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>{language === 'bn' ? '১০০% অরিজিনাল ব্র্যান্ড রিপ্লেসমেন্ট ওয়ারেন্টি' : '100% Genuine brand replacement guarantee'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>{language === 'bn' ? '৭ দিনের ঝামেলাহীন সহজ রিটার্ন সুবিধা' : '7-day hassle-free return policy'}</span>
                </div>
              </div>
            </div>

            {/* Right Purchase Details */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
                  {language === 'bn' ? selectedProduct.nameBn : selectedProduct.name}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1 font-semibold text-neutral-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </span>
                  <span>·</span>
                  <span>{selectedProduct.reviewsCount} {language === 'bn' ? 'টি কাস্টমার রিভিউ' : 'Customer Reviews'}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">
                    {selectedProduct.inStock ? `${selectedProduct.stockCount} ${language === 'bn' ? 'টি স্টকে আছে' : 'units available'}` : t('stock.out')}
                  </span>
                </div>
              </div>

              {/* Price Container */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-950 font-mono tabular-nums">
                  ৳{selectedProduct.price.toLocaleString('en-US')}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                    ৳{selectedProduct.originalPrice.toLocaleString('en-US')}
                  </span>
                )}
                {selectedProduct.originalPrice && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Color Variant Selector */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-neutral-700">
                    {language === 'bn' ? 'কালার নির্বাচন করুন:' : 'Select Color:'}{' '}
                    <span className="font-normal text-neutral-500">{activeColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                          activeColor === c.name
                            ? 'border-neutral-950 bg-neutral-900 text-white shadow-sm'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
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
                <div className="text-xs font-semibold text-neutral-700">
                  {language === 'bn' ? 'পরিমাণ (Quantity)' : 'Quantity'}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-600 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold text-neutral-900 font-mono tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount, q + 1))}
                      className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-600 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {language === 'bn' ? `সর্বোচ্চ ${selectedProduct.stockCount} টি অর্ডারযোগ্য` : `Max ${selectedProduct.stockCount} units`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(selectedProduct, quantity, activeColor)}
                  className="flex-1 py-3 px-4 bg-white border border-neutral-900 text-neutral-900 font-semibold text-sm rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('btn.add_to_cart')}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 bg-neutral-900 text-white font-semibold text-sm rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>{t('btn.buy_now')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed Info: Specs / Description / Customer Reviews */}
          <div className="border-t border-neutral-200 pt-6">
            {/* Tab buttons */}
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'specs'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {language === 'bn' ? 'স্পেসিফিকেশন' : 'Specifications'}
              </button>
              <button
                onClick={() => setActiveTab('desc')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'desc'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {language === 'bn' ? 'বিবরণ ও ফিচার' : 'Overview & Features'}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {language === 'bn' ? `রিভিউ (${selectedProduct.reviews.length})` : `Reviews (${selectedProduct.reviews.length})`}
              </button>
            </div>

            {/* Tab content */}
            <div className="pt-4">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(
                    language === 'bn' && selectedProduct.specsBn
                      ? selectedProduct.specsBn
                      : selectedProduct.specs
                  ).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/70 flex justify-between gap-4"
                    >
                      <span className="font-semibold text-neutral-600">{key}</span>
                      <span className="font-medium text-neutral-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'desc' && (
                <div className="prose prose-sm text-neutral-600 max-w-none text-sm leading-relaxed">
                  <p>{language === 'bn' ? selectedProduct.descriptionBn : selectedProduct.description}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews list */}
                  <div className="space-y-3">
                    {selectedProduct.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/70 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-900">{rev.user}</span>
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" />
                                {language === 'bn' ? 'যাচাইকৃত ক্রেতা' : 'Verified Buyer'}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-neutral-700 leading-normal">
                          {language === 'bn' && rev.commentBn ? rev.commentBn : rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add review form */}
                  <form onSubmit={handleAddReview} className="p-4 border border-neutral-200 rounded-xl bg-white space-y-3">
                    <div className="text-xs font-semibold text-neutral-900">
                      {language === 'bn' ? 'আপনার মতামত বা রিভিউ দিন' : 'Write a Customer Review'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder={language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                        className="p-2 text-xs border border-neutral-200 rounded-lg focus:outline-neutral-900"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">{language === 'bn' ? 'রেটিং:' : 'Rating:'}</span>
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
                      placeholder={language === 'bn' ? 'পণ্যের মান ও অভিজ্ঞতা সম্পর্কে বিস্তারিত লিখুন...' : 'Share your thoughts about this product...'}
                      className="w-full p-2 text-xs border border-neutral-200 rounded-lg focus:outline-neutral-900"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
