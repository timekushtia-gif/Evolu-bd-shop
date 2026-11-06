import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Award,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface Slide {
  id: string;
  tag: string;
  tagBn: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  price: number;
  originalPrice: number;
  image: string;
  gradient: string;
  accentColor: string;
  productId: string;
}

export const HeroSection: React.FC = () => {
  const { language, navigateTo, addToCart, products, formatPrice } = useStore();

  const slides: Slide[] = [
    {
      id: 'slide-1',
      tag: 'Flagship Acoustics · Studio Series',
      tagBn: 'ফ্ল্যাগশিপ অ্যাকোস্টিকস · স্টুডিও সিরিজ',
      title: 'Velocity Wireless ANC Studio Headphones',
      titleBn: 'ভেলোসিটি ওয়্যারলেস এএনসি স্টুডিও হেডফোন',
      subtitle: 'Engineered with bespoke 40mm beryllium drivers and 50-hour ultra-long battery life for continuous studio-grade fidelity.',
      subtitleBn: 'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC), ৪০ মিমি বেরিলিয়াম ড্রাইভার এবং ৫০ ঘণ্টার আল্ট্রা লং ব্যাটারি ব্যাকআপ।',
      price: 8490,
      originalPrice: 10990,
      image: '/src/assets/images/product_anc_headphones_1793976297565.jpg',
      gradient: 'from-slate-950 via-indigo-950 to-neutral-950',
      accentColor: 'text-indigo-400 border-indigo-400/30 bg-indigo-500/10',
      productId: 'ev-audio-01',
    },
    {
      id: 'slide-2',
      tag: 'Titanium Smart Wearables · 2026 Edition',
      tagBn: 'টাইটানিয়াম ওয়্যারেবল · ২০২৬ এডিশন',
      title: 'Titan Horizon Smartwatch Pro with OLED',
      titleBn: 'টাইটান হরাইজন ওএলইডি স্মার্টওয়াচ প্রো',
      subtitle: 'Precision aerospace titanium bezel, always-on AMOLED display, cardiovascular monitoring and HD Bluetooth calling.',
      subtitleBn: 'অ্যারোস্পেস গ্রেড টাইটানিয়াম বডি, অলওয়েজ-অন অ্যামোলেড ডিসপ্লে, হার্ট রেট ও ব্লুটুথ এইচডি কলিং।',
      price: 6290,
      originalPrice: 7990,
      image: '/src/assets/images/product_smart_watch_1793976298205.jpg',
      gradient: 'from-zinc-950 via-slate-900 to-neutral-950',
      accentColor: 'text-teal-400 border-teal-400/30 bg-teal-500/10',
      productId: 'ev-wear-02',
    },
    {
      id: 'slide-3',
      tag: 'Everyday Carry · Weatherproof 900D',
      tagBn: 'এভরিডে ক্যারি · বৃষ্টি-প্রতিরোধী ৯০০ডি',
      title: 'Metropolitan Weatherproof Commuter Daypack',
      titleBn: 'মেট্রোপলিটান ওয়াটারপ্রুফ কমিউটার ডেপ্যাক',
      subtitle: 'Minimalist 20L city backpack crafted from durable 900D water-repellent canvas with 16" padded laptop vault.',
      subtitleBn: 'টেকসই ওয়াটার-রেজিস্ট্যান্ট ক্যানভাস এবং ১৬ ইঞ্চি ল্যাপটপের জন্য ফ্লিস-লাইনড সুরক্ষিত চেম্বার।',
      price: 3890,
      originalPrice: 4800,
      image: '/src/assets/images/product_minimal_backpack_1793976299255.jpg',
      gradient: 'from-stone-950 via-neutral-900 to-zinc-950',
      accentColor: 'text-amber-400 border-amber-400/30 bg-amber-500/10',
      productId: 'ev-carry-03',
    },
    {
      id: 'slide-4',
      tag: 'Architectural Lighting · Eye-Care High CRI',
      tagBn: 'আর্কিটেকচারাল লাইটিং · আই-কেয়ার স্পেকট্রাম',
      title: 'Architectural Slim Brass LED Desk Lamp',
      titleBn: 'আর্কিটেকচারাল স্লিম ব্রাস এলইডি ডেস্ক ল্যাম্প',
      subtitle: 'Machined anodized aluminum stem with warm solid brass swivel joints and touch stepless flicker-free dimming.',
      subtitleBn: 'সলিড ব্রাস জয়েন্ট ও চোখের সুরক্ষায় Ra95 হাই-সিআরআই ফ্লিকার-ফ্রি অ্যাডজাস্টেবল লাইটিং।',
      price: 4490,
      originalPrice: 5600,
      image: '/src/assets/images/product_desk_lamp_1793976299040.jpg',
      gradient: 'from-neutral-950 via-amber-950/40 to-neutral-950',
      accentColor: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
      productId: 'ev-work-04',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play effect
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlide, isPaused]);

  const active = slides[currentSlide];
  const linkedProduct = products.find((p) => p.id === active.productId) || products[0];

  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dynamic Sliding Banner Frame */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r ${active.gradient} text-white min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center transition-all duration-700`}
        >
          {/* Subtle Ambient Glow Elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Content Grid */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 animate-in fade-in duration-500">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm ${active.accentColor} flex items-center gap-1.5`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? active.tagBn : active.tag}</span>
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  0{currentSlide + 1} / 0{slides.length}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-[1.15] text-balance">
                {language === 'bn' ? active.titleBn : active.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                {language === 'bn' ? active.subtitleBn : active.subtitle}
              </p>

              {/* Price Tag & Discount */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                    {formatPrice(active.price)}
                  </span>
                  <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                    {formatPrice(active.originalPrice)}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {Math.round(((active.originalPrice - active.price) / active.originalPrice) * 100)}% OFF
                </span>
              </div>

              {/* Interactive CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={() => navigateTo('product-detail', { productId: active.productId })}
                  className="px-6 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xl hover:scale-102 flex items-center gap-2 cursor-pointer"
                >
                  <span>{language === 'bn' ? 'সরাসরি কিনুন' : 'Buy Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => addToCart(linkedProduct, 1)}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'bn' ? 'কার্ডে যোগ করুন' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => navigateTo('shop')}
                  className="px-4 py-3.5 text-neutral-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'সকল পণ্য দেখুন' : 'Explore All'}
                </button>
              </div>
            </div>

            {/* Right Product Image Showcase Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => navigateTo('product-detail', { productId: active.productId })}
                className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 group cursor-pointer"
              >
                <img
                  key={active.id}
                  src={active.image}
                  alt={active.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Subtle Inner Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold">{language === 'bn' ? 'ক্লিক করে বিস্তারিত দেখুন' : 'Click to inspect product'}</span>
                  <span className="font-mono font-bold text-indigo-300">In Stock</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Chevron Buttons (Left & Right) */}
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-all z-20 cursor-pointer hover:scale-110"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-all z-20 cursor-pointer hover:scale-110"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Dot Pagination Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-white shadow-md' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4-Column Full-Width KPI & Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 mt-8 border-t border-neutral-200">
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-neutral-900 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                {language === 'bn' ? '১০০% অরিজিনাল পণ্য' : '100% Authentic'}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {language === 'bn' ? 'সরাসরি ব্র্যান্ড ওয়ারেন্টি' : 'Direct verified imports'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-neutral-900 shrink-0">
              <Truck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                {language === 'bn' ? '২৪-৪৮ ঘণ্টায় হোম ডেলিভারি' : 'Express Delivery'}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {language === 'bn' ? 'সমগ্র বাংলাদেশে দ্রুততম' : 'Nationwide 24-48h'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-neutral-900 shrink-0">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                {language === 'bn' ? 'নিরাপদ অনলাইন পেমেন্ট' : 'Secure Online Payment'}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {language === 'bn' ? 'বিকাশ, নগদ ও কার্ড' : 'bKash, Nagad, Visa, COD'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
            <div className="p-2.5 rounded-xl bg-white shadow-xs text-neutral-900 shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                {language === 'bn' ? 'অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি' : 'Official Warranty'}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {language === 'bn' ? 'সহজ ৭ দিনের রিপ্লেসমেন্ট' : 'Hassle-free replacement'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
