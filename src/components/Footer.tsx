import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { language, navigateTo, t } = useStore();

  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" />
            <p className="text-xs text-neutral-500 leading-relaxed">
              {language === 'bn'
                ? 'আধুনিক প্রযুক্তি, অডিও ও লাইফস্টাইল পণ্যের শীর্ষস্থানীয় প্ল্যাটফর্ম। দ্রুততম ডেলিভারি ও সুরক্ষিত অনলাইন পেমেন্ট।'
                : 'Modern technology, acoustics, and curated lifestyle essentials with nationwide delivery and secure online payments.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'bn' ? '১০০% অরিজিনাল পণ্য গ্যারান্টি' : '100% Genuine Guaranteed'}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              {language === 'bn' ? 'শপ ও পেজ' : 'Explore Store'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  {t('nav.shop')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('categories')}
                  className="hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  {t('nav.categories')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('tracking')}
                  className="hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  {t('nav.tracking')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('orders')}
                  className="hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  {t('nav.orders')}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              {language === 'bn' ? 'গ্রাহক সেবা ও নীতি' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & Support'}
                </button>
              </li>
              <li>{language === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট পলিসি' : '7-Day Replacement Policy'}</li>
              <li>{language === 'bn' ? 'ওয়ারেন্টি ক্লেইম গাইড' : 'Warranty Claim Guide'}</li>
              <li>{language === 'bn' ? 'প্রাইভেসি ও শর্তাবলী' : 'Privacy & Terms'}</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              {language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact Support'}
            </h4>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <a href="tel:+8801625534570" className="font-mono hover:text-neutral-950 hover:underline transition-colors">
                  +880 1625-534570 (10 AM - 8 PM)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>support@evolu.store</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>16 Dag Boro Mosque, Bheramara, Kushtia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Partners & Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} EVolu Online Market. All rights reserved.
          </div>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 font-medium">
              {language === 'bn' ? 'পেমেন্ট পার্টনারস:' : 'Supported Payments:'}
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-neutral-700">
              <span className="px-2 py-0.5 bg-pink-50 text-pink-700 rounded font-bold">bKash</span>
              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded font-bold">Nagad</span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-bold">Rocket</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold">Visa</span>
              <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded font-bold">Mastercard</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
