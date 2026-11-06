import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Tag, Sparkles, Check, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
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
    formatPrice,
    t,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponErr, setCouponErr] = useState('');

  const handleApply = (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code) return;
    const res = applyCoupon(code);
    if (res.success) {
      setCouponErr('');
      setCouponCode('');
      showToast(res.message);
    } else {
      setCouponErr(res.message);
    }
  };

  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950 flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-neutral-900" />
          <span>{t('cart.title')}</span>
        </h1>
        <button
          onClick={() => navigateTo('shop')}
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-neutral-200 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">{t('cart.empty')}</h3>
          <p className="text-xs text-neutral-500">{t('cart.empty_sub')}</p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>{language === 'bn' ? 'পণ্য দেখুন' : 'Explore Store'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Tracker Banner */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                <span>
                  {progressPercent >= 100
                    ? t('cart.free_shipping_achieved')
                    : language === 'bn'
                    ? `ফ্রি ডেলিভারির জন্য আরও ৳${remainingForFreeShipping.toLocaleString('en-US')} যোগ করুন`
                    : `Add ৳${remainingForFreeShipping.toLocaleString('en-US')} more for Free Express Delivery`}
                </span>
                <span className="font-mono text-neutral-500 tabular-nums">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Itemized Cards */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs divide-y divide-neutral-100 overflow-hidden">
              {cart.map((item, idx) => (
                <div key={idx} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded-2xl bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div>
                      <div className="text-[11px] text-neutral-400 font-bold uppercase">{item.product.brand}</div>
                      <h3
                        onClick={() => navigateTo('product-detail', { productId: item.product.id })}
                        className="font-bold text-sm text-neutral-900 hover:underline cursor-pointer line-clamp-1"
                      >
                        {language === 'bn' ? item.product.nameBn : item.product.name}
                      </h3>
                      {item.selectedColor && (
                        <div className="text-xs text-neutral-500 mt-0.5">
                          Color: <span className="font-medium text-neutral-800">{item.selectedColor}</span>
                        </div>
                      )}
                      <div className="font-mono font-bold text-xs text-neutral-900 mt-1 tabular-nums">
                        ৳{item.product.price.toLocaleString('en-US')} / unit
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-neutral-100">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                        className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold font-mono text-neutral-950 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                        className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-neutral-950 tabular-nums">
                        ৳{(item.product.price * item.quantity).toLocaleString('en-US')}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                        className="text-[11px] text-red-500 hover:text-red-700 font-medium cursor-pointer mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-bold text-base text-neutral-950 border-b border-neutral-100 pb-3">
              {language === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
            </h3>

            {/* Coupons */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold">{appliedCoupon.code}</span>
                    <span>·</span>
                    <span>{language === 'bn' ? appliedCoupon.descriptionBn : appliedCoupon.description}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-emerald-700 underline font-bold cursor-pointer">
                    X
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponErr('');
                        }}
                        placeholder="EVOLU10"
                        className="w-full pl-9 pr-2 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl uppercase font-mono"
                      />
                    </div>
                    <button
                      onClick={() => handleApply()}
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      {t('coupon.apply')}
                    </button>
                  </div>
                  {couponErr && <div className="text-[11px] text-red-600">{couponErr}</div>}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Quick: </span>
                    <button onClick={() => handleApply('EVOLU10')} className="underline font-mono cursor-pointer">
                      EVOLU10 (-10%)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-mono tabular-nums text-neutral-900 font-medium">৳{cartSubtotal.toLocaleString('en-US')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t('cart.discount')}</span>
                  <span className="font-mono tabular-nums">-৳{cartDiscount.toLocaleString('en-US')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span className="font-mono tabular-nums">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-700 font-bold">{language === 'bn' ? 'ফ্রি ডেলিভারি' : 'FREE'}</span>
                  ) : (
                    `৳${cartShipping.toLocaleString('en-US')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-950 pt-3 border-t border-neutral-200">
                <span>{t('cart.total')}</span>
                <span className="font-mono tabular-nums text-lg">৳{cartTotal.toLocaleString('en-US')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & 100% Encrypted Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
