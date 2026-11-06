import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
    language,
    showToast,
    t,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const res = applyCoupon(code);
    if (res.success) {
      setCouponError('');
      setCouponInput('');
      showToast(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
              {t('cart.title')}
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="p-3.5 bg-neutral-50 border-b border-neutral-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-neutral-700">
            <span>
              {progressPercent >= 100
                ? t('cart.free_shipping_achieved')
                : language === 'bn'
                ? `ফ্রি ডেলিভারির জন্য আরও ৳${remainingForFreeShipping.toLocaleString('en-US')} যোগ করুন`
                : `Add ৳${remainingForFreeShipping.toLocaleString('en-US')} more for Free Express Delivery`}
            </span>
            <span className="font-mono tabular-nums text-neutral-500">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">{t('cart.empty')}</h3>
              <p className="text-xs text-neutral-500 max-w-xs">{t('cart.empty_sub')}</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Browsing'}
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedColor || idx}`}
                className="flex gap-3.5 pb-4 border-b border-neutral-100 last:border-0"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 object-cover rounded-lg bg-neutral-100 border border-neutral-200 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                        {language === 'bn' ? item.product.nameBn : item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedColor && (
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {language === 'bn' ? 'কালার:' : 'Color:'} {item.selectedColor}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-200 rounded-md bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                        className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-semibold text-neutral-900 font-mono tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                        className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-neutral-900 font-mono tabular-nums">
                      ৳{(item.product.price * item.quantity).toLocaleString('en-US')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold font-mono">{appliedCoupon.code}</span>
                    <span>·</span>
                    <span>{language === 'bn' ? appliedCoupon.descriptionBn : appliedCoupon.description}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-emerald-700 hover:text-emerald-950 underline font-medium cursor-pointer"
                  >
                    {language === 'bn' ? 'মুছুন' : 'Remove'}
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        placeholder={t('coupon.placeholder')}
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-neutral-900 uppercase font-mono"
                      />
                    </div>
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                    >
                      {t('coupon.apply')}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                  
                  {/* Quick Clickable Suggestions */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {language === 'bn' ? 'অফার:' : 'Offer:'}
                    </span>
                    <button
                      onClick={() => handleApplyCoupon('EVOLU10')}
                      className="underline hover:text-neutral-900 font-mono cursor-pointer"
                    >
                      EVOLU10 (-10%)
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => handleApplyCoupon('FREESHIP')}
                      className="underline hover:text-neutral-900 font-mono cursor-pointer"
                    >
                      FREESHIP
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-mono tabular-nums text-neutral-900">৳{cartSubtotal.toLocaleString('en-US')}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t('cart.discount')}</span>
                  <span className="font-mono tabular-nums">-৳{cartDiscount.toLocaleString('en-US')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span className="font-mono tabular-nums">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">{language === 'bn' ? 'ফ্রি' : 'FREE'}</span>
                  ) : (
                    `৳${cartShipping.toLocaleString('en-US')}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>{t('cart.total')}</span>
                <span className="font-mono tabular-nums text-base">৳{cartTotal.toLocaleString('en-US')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3 px-4 bg-neutral-900 text-white font-semibold text-sm rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
