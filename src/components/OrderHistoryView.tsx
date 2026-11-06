import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, ArrowRight, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const {
    orders,
    navigateTo,
    addToCart,
    language,
    t,
  } = useStore();

  const handleTrack = (orderId: string) => {
    navigateTo('tracking', { orderId });
  };

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart(item.product, item.quantity, item.selectedColor);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display">
          {t('nav.orders')}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          {language === 'bn'
            ? 'আপনার সকল পূর্ববর্তী অর্ডারের বিবরণ, ট্র্যাকিং ও পেমেন্ট হিস্ট্রি'
            : 'Review all past orders, delivery tracking, and payment receipts'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 space-y-3">
          <Package className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'bn' ? 'কোনো পূর্ববর্তী অর্ডার নেই' : 'No Orders Yet'}
          </h3>
          <p className="text-xs text-neutral-500">
            {language === 'bn'
              ? 'আমাদের কালেকশন থেকে পছন্দমতো পণ্য অর্ডার করুন'
              : 'Browse our collection and place your first order'}
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'শপিং শুরু করুন' : 'Explore Products'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 shadow-sm hover:border-neutral-300 transition-colors space-y-4"
            >
              {/* Order Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <span className="text-base sm:text-lg font-bold text-neutral-950 font-mono">
                    {order.id}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span className="uppercase font-medium text-neutral-700">
                    {order.payment.method} ({order.payment.status})
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/60">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded bg-white border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {language === 'bn' ? item.product.nameBn : item.product.name}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} · ৳{item.product.price.toLocaleString('en-US')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Total & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-neutral-500">{language === 'bn' ? 'মোট মূল্য:' : 'Total Amount:'}</span>
                  <span className="text-base font-bold text-neutral-950 font-mono tabular-nums">
                    ৳{order.summary.total.toLocaleString('en-US')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3.5 py-1.5 border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পুনরায় কিনুন' : 'Reorder'}</span>
                  </button>

                  <button
                    onClick={() => handleTrack(order.id)}
                    className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
