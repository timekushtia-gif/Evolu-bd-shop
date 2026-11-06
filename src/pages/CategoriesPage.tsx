import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Headphones, Watch, Backpack, Lamp, Zap } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { navigateTo, products, language } = useStore();

  const categoryCards = [
    {
      id: 'audio',
      title: 'Audio & Acoustics',
      titleBn: 'অডিও ও সাউন্ড',
      subtitle: 'ANC Headphones, Studio Buds, and Hi-Fi Acoustics',
      subtitleBn: 'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন হেডফোন ও ইয়ারবাডস',
      gradient: 'from-indigo-600 to-blue-700',
      icon: Headphones,
      image: '/src/assets/images/product_anc_headphones_1793976297565.jpg',
    },
    {
      id: 'wearables',
      title: 'Smart Wearables',
      titleBn: 'স্মার্ট ওয়্যারেবল',
      subtitle: 'AMOLED Watches, Fitness Trackers, and Health Tech',
      subtitleBn: 'টাইটানিয়াম স্মার্টওয়াচ ও হেলথ ট্র্যাকার',
      gradient: 'from-rose-600 to-pink-700',
      icon: Watch,
      image: '/src/assets/images/product_smart_watch_1793976298205.jpg',
    },
    {
      id: 'carry',
      title: 'Everyday Carry',
      titleBn: 'ট্রাভেল ও ব্যাকপ্যাক',
      subtitle: 'Weatherproof Commuter Packs & Minimalist Sleeves',
      subtitleBn: 'বৃষ্টি-প্রতিরোধী ব্যাকপ্যাক ও ট্রাভেল গিয়ার',
      gradient: 'from-amber-600 to-orange-700',
      icon: Backpack,
      image: '/src/assets/images/product_minimal_backpack_1793976299255.jpg',
    },
    {
      id: 'workspace',
      title: 'Workspace & Studio',
      titleBn: 'ওয়ার্কস্পেস ও স্টুডিও',
      subtitle: 'Architectural LED Lamps, Laptop Stands & Ergonomics',
      subtitleBn: 'মিনিমালিস্ট এলইডি ডেস্ক ল্যাম্প ও ডেস্ক এক্সেসরিজ',
      gradient: 'from-emerald-600 to-teal-700',
      icon: Lamp,
      image: '/src/assets/images/product_desk_lamp_1793976299040.jpg',
    },
    {
      id: 'gadgets',
      title: 'Smart Fast Chargers & Gadgets',
      titleBn: 'স্মার্ট গ্যাজেট ও চার্জার',
      subtitle: 'GaN Multi-port fast chargers & daily tech utilities',
      subtitleBn: '৬৫ ওয়াট গ্যালিয়াম নাইট্রাইড ফাস্ট চার্জার ও কেবল',
      gradient: 'from-cyan-600 to-blue-800',
      icon: Zap,
      image: '/src/assets/images/hero_modern_lifestyle_1793976297485.jpg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          {language === 'bn' ? 'ক্যাটাগরি সংগ্রহ' : 'Curated Categories'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950">
          {language === 'bn' ? 'পছন্দের ক্যাটাগরি ব্রাউজ করুন' : 'Explore by Category'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {language === 'bn'
            ? 'প্রতিটি ক্যাটাগরিতে রয়েছে আন্তর্জাতিক মানের অরিজিনাল লাইফস্টাইল পণ্য'
            : 'Select any category to view our complete collection with real-time stock.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categoryCards.map((card) => {
          const count = products.filter((p) => p.category === card.id).length;
          const IconComp = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => {
                navigateTo('shop', { categoryId: card.id });
              }}
              className="group bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Preview Slot */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src={card.image}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur-sm text-neutral-900 shadow-sm">
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-mono font-semibold text-neutral-300">
                    {count} {language === 'bn' ? 'টি পণ্য পাওয়া যাচ্ছে' : 'Products Available'}
                  </div>
                  <h3 className="text-xl font-bold font-display mt-0.5">
                    {language === 'bn' ? card.titleBn : card.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-5 flex items-center justify-between text-xs font-semibold text-neutral-700 group-hover:text-neutral-950">
                <span>{language === 'bn' ? card.subtitleBn : card.subtitle}</span>
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center shrink-0 ml-3">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
