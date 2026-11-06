import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setSelectedProduct,
    t,
  } = useStore();

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-300">
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-neutral-700 hover:text-red-500 hover:bg-white shadow-sm transition-colors cursor-pointer"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>

        {/* Subtle status tag (clean unboxed or quiet text) */}
        {product.isNew && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-neutral-900/90 text-white text-[11px] font-medium tracking-wide rounded">
            {language === 'bn' ? 'নতুন কালেকশন' : 'New Arrival'}
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-sm text-neutral-900 text-xs font-semibold rounded-lg shadow-sm hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('btn.view_details')}</span>
          </button>
          
          <button
            onClick={() => addToCart(product, 1)}
            className="p-2 bg-neutral-900 text-white rounded-lg shadow-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Quick add to bag"
            aria-label="Quick add"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata line with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>{language === 'bn' ? product.categoryLabelBn : product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-neutral-700 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
              <span className="tabular-nums">{product.rating}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.inStock ? t('stock.in') : t('stock.out')}</span>
          </div>

          {/* Product Name */}
          <button
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="text-left font-semibold text-neutral-900 text-sm hover:text-neutral-700 transition-colors line-clamp-1 mt-1 cursor-pointer"
          >
            {language === 'bn' ? product.nameBn : product.name}
          </button>
        </div>

        {/* Price & Primary Buy */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-neutral-950 font-mono tabular-nums">
              ৳{product.price.toLocaleString('en-US')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                ৳{product.originalPrice.toLocaleString('en-US')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="text-xs font-semibold px-3 py-1.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-900 rounded-md transition-colors cursor-pointer"
          >
            {t('btn.add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  );
};
