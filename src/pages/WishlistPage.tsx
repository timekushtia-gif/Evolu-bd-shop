import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    navigateTo,
    language,
    formatPrice,
  } = useStore();

  const handleAddAllToCart = () => {
    wishlist.forEach((p) => {
      addToCart(p, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950 flex items-center gap-2.5">
            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
            <span>{language === 'bn' ? 'আমার পছন্দের তালিকা (Wishlist)' : 'Saved Favorites'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {language === 'bn'
              ? `আপনার তালিকায় মোট ${wishlist.length} টি পণ্য সংরক্ষিত আছে`
              : `${wishlist.length} item(s) currently saved for later`}
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{language === 'bn' ? 'সবগুলো কার্ডে যুক্ত করুন' : 'Move All to Cart'}</span>
          </button>
        )}
      </div>

      {/* Grid or Empty */}
      {wishlist.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-neutral-200 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            {language === 'bn' ? 'আপনার উইশলিস্ট খালি রয়েছে' : 'Your Wishlist is Empty'}
          </h3>
          <p className="text-xs text-neutral-500">
            {language === 'bn'
              ? 'পছন্দের পণ্যগুলোর হার্ট (Heart) আইকনে ক্লিক করে তালিকায় সংরক্ষণ করুন।'
              : 'Save products you love by tapping the heart icon while browsing.'}
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>{language === 'bn' ? 'শপে পণ্য খুঁজুন' : 'Browse Products'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {wishlist.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div
                onClick={() => navigateTo('product-detail', { productId: prod.id })}
                className="relative aspect-[4/3] bg-neutral-100 cursor-pointer overflow-hidden group"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(prod);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-500 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <div className="text-[11px] text-neutral-400 font-semibold uppercase">{prod.brand}</div>
                  <h3
                    onClick={() => navigateTo('product-detail', { productId: prod.id })}
                    className="font-bold text-sm text-neutral-900 hover:underline cursor-pointer line-clamp-1 mt-0.5"
                  >
                    {language === 'bn' ? prod.nameBn : prod.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-base font-bold font-mono text-neutral-950 tabular-nums">
                    {formatPrice(prod.price)}
                  </span>
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'কার্ডে যোগ করুন' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
