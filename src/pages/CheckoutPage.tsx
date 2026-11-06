import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Printer,
  Package,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    createOrder,
    navigateTo,
    language,
    formatPrice,
    t,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment_process' | 'confirmed'>('details');

  // Customer Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Selection
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');

  // Gateway Simulation Fields
  const [mfsNumber, setMfsNumber] = useState('');
  const [mfsOtp, setMfsOtp] = useState('');
  const [mfsPin, setMfsPin] = useState('');
  const [mfsSubStep, setMfsSubStep] = useState<'number' | 'otp' | 'pin'>('number');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert(language === 'bn' ? 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required delivery fields');
      return;
    }

    if (selectedMethod === 'cod') {
      completeOrderPlacement('COD-' + Math.floor(100000 + Math.random() * 900000));
    } else {
      setStep('payment_process');
      setMfsSubStep('number');
      if (phone && !mfsNumber) {
        setMfsNumber(phone);
      }
    }
  };

  const completeOrderPlacement = (txId?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = createOrder({
        items: [...cart],
        customer: {
          fullName,
          phone,
          email: email || 'customer@evolu.store',
          address,
          city,
          area: area || city,
          postalCode,
          deliveryNotes,
        },
        payment: {
          method: selectedMethod,
          status: selectedMethod === 'cod' ? 'pending' : 'paid',
          transactionId: txId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          accountNumber: mfsNumber || (cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : phone),
        },
        summary: {
          subtotal: cartSubtotal,
          discount: cartDiscount,
          shipping: cartShipping,
          total: cartTotal,
          couponApplied: appliedCoupon?.code,
        },
      });

      setPlacedOrderId(newOrder.id);
      setIsProcessing(false);
      setStep('confirmed');
    }, 1000);
  };

  const handleGatewaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === 'bkash' || selectedMethod === 'nagad' || selectedMethod === 'rocket') {
      if (mfsSubStep === 'number') {
        if (mfsNumber.length < 10) return;
        setMfsSubStep('otp');
      } else if (mfsSubStep === 'otp') {
        if (!mfsOtp) return;
        setMfsSubStep('pin');
      } else if (mfsSubStep === 'pin') {
        if (!mfsPin) return;
        const prefix = selectedMethod === 'bkash' ? 'BKS' : selectedMethod === 'nagad' ? 'NGD' : 'RCK';
        completeOrderPlacement(`${prefix}-${Math.floor(10000000 + Math.random() * 90000000)}`);
      }
    } else if (selectedMethod === 'card') {
      completeOrderPlacement(`VISA-${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  };

  if (cart.length === 0 && step !== 'confirmed') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-display text-neutral-900">
          {language === 'bn' ? 'চেকআউট করার জন্য কোনো পণ্য কার্টে নেই' : 'Your cart is empty'}
        </h2>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          {language === 'bn' ? 'শপে ফিরে যান' : 'Browse Products'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950 flex items-center gap-3">
          <Lock className="w-6 h-6 text-emerald-600" />
          <span>
            {step === 'confirmed'
              ? t('checkout.success_title')
              : step === 'payment_process'
              ? (language === 'bn' ? 'অনলাইন পেমেন্ট গেটওয়ে' : 'Online Payment Authorization')
              : t('checkout.title')}
          </span>
        </h1>
        {step !== 'confirmed' && (
          <button
            onClick={() => navigateTo('cart')}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'কার্টে ফিরে যান' : 'Back to Cart'}</span>
          </button>
        )}
      </div>

      {/* CONFIRMED STATE */}
      {step === 'confirmed' ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
              {t('checkout.success_title')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {t('checkout.success_sub')}
            </p>
          </div>

          {/* Tracking ID Badge */}
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
            <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
              {language === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি' : 'Assigned Tracking ID'}
            </div>
            <div className="text-3xl font-bold font-mono text-neutral-950 tracking-wider">
              {placedOrderId}
            </div>
            <div className="text-xs text-neutral-500">
              {selectedMethod.toUpperCase()} · <span className="text-emerald-700 font-bold">Confirmed</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigateTo('tracking', { orderId: placedOrderId })}
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>{language === 'bn' ? 'অর্ডারটি লাইভ ট্র্যাক করুন' : 'Track Order Live'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'রিসিপ্ট প্রিন্ট' : 'Print Invoice'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* CHECKOUT SPLIT: Form on left, Summary on right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
            {step === 'details' && (
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                {/* 1. Address Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-2">
                    <span>{t('checkout.shipping_info')}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">{t('checkout.name')} *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Tanvir Hasan"
                        className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">{t('checkout.phone')} *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 01625-534570"
                        className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">{t('checkout.email')}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">{t('checkout.city')} *</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                      >
                        <option value="Dhaka">Dhaka (ঢাকা)</option>
                        <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                        <option value="Sylhet">Sylhet (সিলেট)</option>
                        <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                        <option value="Khulna">Khulna (খুলনা)</option>
                        <option value="Kushtia">Kushtia (কুষ্টিয়া)</option>
                        <option value="Barisal">Barisal (বরিশাল)</option>
                        <option value="Other">Other Districts</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">{t('checkout.address')} *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House, Road, Area, Ward"
                      className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">{t('checkout.notes')}</label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: বিকেলে ডেলিভারি করবেন' : 'e.g. Call before arrival'}
                      className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                    />
                  </div>
                </div>

                {/* 2. Payment Method Options */}
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <h3 className="font-bold text-sm text-neutral-950 flex items-center justify-between">
                    <span>{t('checkout.payment_info')}</span>
                    <span className="text-xs font-normal text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>256-Bit SSL Secured</span>
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                        selectedMethod === 'bkash'
                          ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-600'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={selectedMethod === 'bkash'}
                        onChange={() => setSelectedMethod('bkash')}
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                          <span>bKash (বিকাশ)</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">Direct mobile wallet</div>
                      </div>
                    </label>

                    <label
                      className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                        selectedMethod === 'nagad'
                          ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-600'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={selectedMethod === 'nagad'}
                        onChange={() => setSelectedMethod('nagad')}
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                          <span>Nagad (নগদ)</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">Postal digital wallet</div>
                      </div>
                    </label>

                    <label
                      className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                        selectedMethod === 'card'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={selectedMethod === 'card'}
                        onChange={() => setSelectedMethod('card')}
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          <span>Visa / MasterCard</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">All local & global cards</div>
                      </div>
                    </label>

                    <label
                      className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                        selectedMethod === 'cod'
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={selectedMethod === 'cod'}
                        onChange={() => setSelectedMethod('cod')}
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span>Cash on Delivery</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">Pay when delivered</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {selectedMethod === 'cod'
                      ? (language === 'bn' ? 'ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন' : 'Confirm Cash on Delivery')
                      : (language === 'bn' ? `অনলাইন গেটওয়েতে ৳${cartTotal.toLocaleString('en-US')} পরিশোধ করুন` : `Proceed to Secure Payment ৳${cartTotal.toLocaleString('en-US')}`)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Interactive Payment Gateway Simulation */}
            {step === 'payment_process' && (
              <div className="space-y-6">
                {(selectedMethod === 'bkash' || selectedMethod === 'nagad' || selectedMethod === 'rocket') && (
                  <div className="rounded-2xl border border-neutral-300 overflow-hidden shadow-lg bg-white">
                    <div
                      className={`p-4 text-white flex items-center justify-between ${
                        selectedMethod === 'bkash'
                          ? 'bg-[#d12053]'
                          : selectedMethod === 'nagad'
                          ? 'bg-[#e2481e]'
                          : 'bg-[#7f2679]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold uppercase text-sm">
                        <Smartphone className="w-5 h-5" />
                        <span>{selectedMethod} Payment Gateway</span>
                      </div>
                      <div className="font-mono font-bold text-sm">৳{cartTotal.toLocaleString('en-US')}</div>
                    </div>

                    <form onSubmit={handleGatewaySubmit} className="p-6 space-y-4">
                      {mfsSubStep === 'number' && (
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-neutral-700 text-center">
                            {language === 'bn'
                              ? `আপনার ${selectedMethod.toUpperCase()} অ্যাকাউন্ট নম্বর দিন`
                              : `Enter your ${selectedMethod.toUpperCase()} Number`}
                          </label>
                          <input
                            type="tel"
                            required
                            autoFocus
                            value={mfsNumber}
                            onChange={(e) => setMfsNumber(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full text-center p-3 text-lg border-2 border-neutral-300 rounded-xl font-mono focus:border-neutral-900 focus:outline-none"
                          />
                        </div>
                      )}

                      {mfsSubStep === 'otp' && (
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-neutral-700 text-center">
                            {language === 'bn' ? '৬-সংখ্যার ওটিপি (OTP) কোড দিন' : 'Enter 6-Digit OTP Code'}
                          </label>
                          <input
                            type="text"
                            required
                            autoFocus
                            maxLength={6}
                            value={mfsOtp}
                            onChange={(e) => setMfsOtp(e.target.value)}
                            placeholder="849201"
                            className="w-full text-center tracking-widest text-xl p-3 border-2 border-neutral-300 rounded-xl font-mono focus:border-neutral-900 focus:outline-none"
                          />
                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => setMfsOtp('849201')}
                              className="text-xs text-neutral-600 underline cursor-pointer"
                            >
                              Auto-fill Demo OTP (849201)
                            </button>
                          </div>
                        </div>
                      )}

                      {mfsSubStep === 'pin' && (
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-neutral-700 text-center">
                            {language === 'bn'
                              ? `আপনার ${selectedMethod.toUpperCase()} পিন (PIN) দিন`
                              : `Enter ${selectedMethod.toUpperCase()} PIN`}
                          </label>
                          <input
                            type="password"
                            required
                            autoFocus
                            maxLength={5}
                            value={mfsPin}
                            onChange={(e) => setMfsPin(e.target.value)}
                            placeholder="•••••"
                            className="w-full text-center tracking-widest text-xl p-3 border-2 border-neutral-300 rounded-xl font-mono focus:border-neutral-900 focus:outline-none"
                          />
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (mfsSubStep === 'pin') setMfsSubStep('otp');
                            else if (mfsSubStep === 'otp') setMfsSubStep('number');
                            else setStep('details');
                          }}
                          className="p-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="flex-1 py-3 text-white text-xs font-bold rounded-xl transition-all cursor-pointer bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50"
                        >
                          {isProcessing ? 'Processing Transaction...' : mfsSubStep === 'pin' ? 'Authorize Payment' : 'Next Step'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="rounded-2xl border border-neutral-300 p-6 space-y-4 bg-white shadow-lg">
                    <div className="font-bold text-sm text-neutral-900 pb-2 border-b border-neutral-100 flex items-center justify-between">
                      <span>Card Payment Simulation</span>
                      <span className="font-mono">৳{cartTotal.toLocaleString('en-US')}</span>
                    </div>

                    <form onSubmit={handleGatewaySubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="TANVIR HASAN"
                          className="w-full p-2.5 text-xs border border-neutral-200 rounded-lg uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4123 4567 8901 2345"
                          className="w-full p-2.5 text-xs border border-neutral-200 rounded-lg font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full p-2.5 text-xs border border-neutral-200 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full p-2.5 text-xs border border-neutral-200 rounded-lg font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep('details')}
                          className="p-3 border border-neutral-300 rounded-xl hover:bg-neutral-50 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="flex-1 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? 'Verifying 3D-Secure...' : `Confirm & Pay ৳${cartTotal.toLocaleString('en-US')}`}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Order Items & Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-neutral-950 border-b border-neutral-100 pb-3">
              {language === 'bn' ? 'অর্ডারকৃত আইটেমসমূহ' : 'Items in Bag'} ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg bg-white border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-neutral-900 truncate">
                      {language === 'bn' ? item.product.nameBn : item.product.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                    </div>
                  </div>
                  <div className="text-xs font-bold font-mono text-neutral-900 tabular-nums">
                    ৳{(item.product.price * item.quantity).toLocaleString('en-US')}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900">৳{cartSubtotal.toLocaleString('en-US')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-৳{cartDiscount.toLocaleString('en-US')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {cartShipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `৳${cartShipping.toLocaleString('en-US')}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total Payable</span>
                <span className="font-mono tabular-nums text-lg">৳{cartTotal.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
