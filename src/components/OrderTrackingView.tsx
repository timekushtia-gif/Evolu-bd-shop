import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    trackingOrderId,
    setTrackingOrderId,
    getOrderById,
    advanceOrderStatus,
    language,
    t,
  } = useStore();

  const [inputVal, setInputVal] = useState(trackingOrderId || 'EV-849204');
  const [searchedId, setSearchedId] = useState(trackingOrderId || 'EV-849204');

  const currentOrder = getOrderById(searchedId) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchedId(inputVal.trim());
    setTrackingOrderId(inputVal.trim());
  };

  const handleQuickSelect = (id: string) => {
    setInputVal(id);
    setSearchedId(id);
    setTrackingOrderId(id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Introduction */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
          {language === 'bn' ? 'রিয়েল-টাইম লজিস্টিকস ট্র্যাকিং' : 'Real-Time Logistics Tracking'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display">
          {t('tracking.title')}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          {t('tracking.subtitle')}
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-xl mx-auto bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('tracking.placeholder')}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-neutral-900 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-neutral-900 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            {t('tracking.btn_search')}
          </button>
        </form>

        {/* Quick Recent Order Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-500">
          <span className="text-[11px] font-medium">{language === 'bn' ? 'সাম্প্রতিক অর্ডার:' : 'Recent Orders:'}</span>
          {orders.slice(0, 4).map((o) => (
            <button
              key={o.id}
              onClick={() => handleQuickSelect(o.id)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                currentOrder?.id === o.id
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {o.id}
            </button>
          ))}
        </div>
      </div>

      {/* If Order Found */}
      {currentOrder ? (
        <div className="space-y-8">
          {/* Main Status Hero Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-6">
            {/* Top row: Order meta & live status pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-neutral-950 font-mono">
                    {currentOrder.id}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      currentOrder.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentOrder.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentOrder.status}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {language === 'bn' ? 'অর্ডার তৈরির তারিখ:' : 'Order Date:'}{' '}
                    {new Date(currentOrder.createdAt).toLocaleDateString()}
                  </span>
                  <span>·</span>
                  <span>
                    {currentOrder.payment.method.toUpperCase()} ({currentOrder.payment.status === 'paid' ? (language === 'bn' ? 'পরিশোধিত' : 'Paid') : (language === 'bn' ? 'বকেয়া' : 'Pending')})
                  </span>
                </div>
              </div>

              {/* Interactive Simulator Trigger */}
              {currentOrder.status !== 'delivered' && (
                <button
                  onClick={() => advanceOrderStatus(currentOrder.id)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                  title="Simulate progression of order to next delivery stage"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-700" />
                  <span>{t('tracking.simulate_btn')}</span>
                </button>
              )}
            </div>

            {/* Visual Delivery Route Map Illustration */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  <span>{currentOrder.courier.hub}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Clock className="w-4 h-4" />
                  <span>
                    {language === 'bn' ? 'সম্ভাব্য ডেলিভারি:' : 'Est. Delivery:'}{' '}
                    {currentOrder.courier.estimatedDelivery}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-900" />
                  <span>{currentOrder.customer.area || currentOrder.customer.city}</span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="relative py-2">
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 transition-all duration-700"
                    style={{
                      width:
                        currentOrder.status === 'delivered'
                          ? '100%'
                          : currentOrder.status === 'shipped'
                          ? '75%'
                          : currentOrder.status === 'packed'
                          ? '50%'
                          : currentOrder.status === 'processing'
                          ? '30%'
                          : '15%',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Vertical Multi-Step Visual Timeline */}
            <div className="space-y-6 pt-2">
              <h3 className="text-sm font-bold text-neutral-900">
                {language === 'bn' ? 'ডেলিভারি ট্র্যাকিং হিস্ট্রি' : 'Live Tracking Timeline'}
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-neutral-200 ml-3">
                {currentOrder.trackingSteps.map((step, idx) => {
                  const isDone = step.completed;
                  const isCurrent = step.current;

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot Icon */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-neutral-900 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-neutral-200 text-neutral-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Content Block */}
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-sm font-bold ${
                              isDone || isCurrent ? 'text-neutral-950' : 'text-neutral-400'
                            }`}
                          >
                            {language === 'bn' ? step.titleBn : step.title}
                          </h4>
                          {step.timestamp && (
                            <span className="text-xs font-mono text-neutral-500 tabular-nums">
                              {step.timestamp}
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs ${
                            isDone || isCurrent ? 'text-neutral-600' : 'text-neutral-400'
                          }`}
                        >
                          {language === 'bn' ? step.descriptionBn : step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Courier Agent & Package Item Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Courier Logistics Details */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span>{t('tracking.courier_details')}</span>
              </h3>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">{language === 'bn' ? 'কুরিয়ার পার্টনার:' : 'Courier Service:'}</span>
                  <span className="font-semibold text-neutral-900">{currentOrder.courier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{language === 'bn' ? 'কুরিয়ার ট্র্যাকিং কোড:' : 'AWB Tracking Code:'}</span>
                  <span className="font-mono font-semibold text-neutral-900">{currentOrder.courier.trackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{language === 'bn' ? 'ডেলিভারি রাইডার:' : 'Delivery Agent:'}</span>
                  <span className="font-semibold text-neutral-900 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    {currentOrder.courier.riderName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{language === 'bn' ? 'রাইডার হেল্পলাইন:' : 'Rider Contact:'}</span>
                  <a
                    href={`tel:${currentOrder.courier.riderPhone}`}
                    className="font-mono text-neutral-900 underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-neutral-500" />
                    {currentOrder.courier.riderPhone}
                  </a>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200">
                  <span className="text-neutral-500">{language === 'bn' ? 'ডেলিভারি হাব:' : 'Logistics Hub:'}</span>
                  <span className="font-semibold text-neutral-900">{currentOrder.courier.hub}</span>
                </div>
              </div>
            </div>

            {/* Package Contents */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-700" />
                <span>{language === 'bn' ? 'প্যাকেজের পণ্য তালিকা' : 'Package Items'}</span>
              </h3>

              <div className="space-y-3">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg bg-white border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {language === 'bn' ? item.product.nameBn : item.product.name}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                      </div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-neutral-900 tabular-nums">
                      ৳{(item.product.price * item.quantity).toLocaleString('en-US')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Paid */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-700">{language === 'bn' ? 'সর্বমোট পরিশোধ:' : 'Total Amount:'}</span>
                <span className="font-bold font-mono text-sm text-neutral-950 tabular-nums">
                  ৳{currentOrder.summary.total.toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-900">
            {language === 'bn' ? 'অর্ডারটি খুঁজে পাওয়া যায়নি' : 'Order Not Found'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'অনুগ্রহ করে সঠিক অর্ডার আইডি লিখুন অথবা উপরের সাম্প্রতিক তালিকা থেকে নির্বাচন করুন।'
              : 'Please check your tracking ID or select one of your recent orders above.'}
          </p>
        </div>
      )}
    </div>
  );
};
