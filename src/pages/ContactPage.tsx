import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      language === 'bn'
        ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! শীঘ্রই আমরা যোগাযোগ করব।'
        : 'Your inquiry has been submitted! Our team will respond shortly.'
    );
  };

  const faqs = [
    {
      q: language === 'bn' ? 'অর্ডার করার কতদিনের মধ্যে ডেলিভারি পাওয়া যাবে?' : 'How long does delivery take?',
      a: language === 'bn'
        ? 'ঢাকা মেট্রোপলিটন এলাকায় ২৪ ঘণ্টার মধ্যে এবং ঢাকার বাইরে যেকোনো জেলায় ৪৮ ঘণ্টার মধ্যে স্টেডফাস্ট ও পাঠাও এক্সপ্রেসের মাধ্যমে হোম ডেলিভারি নিশ্চিত করা হয়।'
        : 'Orders in Dhaka metropolitan area are delivered within 24 hours. Outside Dhaka, doorstep delivery takes 24-48 hours via Steadfast Priority.',
    },
    {
      q: language === 'bn' ? 'কীভাবে অনলাইনে বিকাশ বা নগদে পেমেন্ট করব?' : 'How to pay via bKash or Nagad?',
      a: language === 'bn'
        ? 'চেকআউটে বিকাশ বা নগদ সিলেক্ট করে পেমেন্ট বাটনে ক্লিক করুন। এরপর আমাদের ইন্টারেক্টিভ গেটওয়েতে আপনার নম্বর, ওটিপি এবং পিন দিয়ে মুহূর্তেই নিরাপদে পেমেন্ট নিশ্চিত করতে পারবেন।'
        : 'Select bKash or Nagad at checkout. You can verify your wallet number, OTP and PIN in our secure gateway dialog for instant receipt generation.',
    },
    {
      q: language === 'bn' ? 'পণ্য নষ্ট বা ক্ষতিগ্রস্ত হলে ওয়ারেন্টি কীভাবে ক্লেইম করব?' : 'How to claim warranty or replacement?',
      a: language === 'bn'
        ? 'সকল পণ্যে ৭ দিনের রিপ্লেসমেন্ট এবং ১ বছরের অফিশিয়াল ব্র্যান্ড ওয়ারেন্টি রয়েছে। কোনো ত্রুটি পেলে আমাদের হেল্পলাইন বা এই পেজ থেকে যোগাযোগ করলেই সমাধান পাবেন।'
        : 'All EVolu products include a 7-day hassle-free replacement guarantee and 1-year brand warranty. Contact our support team with your Order ID.',
    },
    {
      q: language === 'bn' ? 'অর্ডার ট্র্যাকিং আইডি কোথায় পাব?' : 'Where can I find my Tracking Order ID?',
      a: language === 'bn'
        ? 'অর্ডার কনফার্ম করার পর স্ক্রিনে "EV-XXXXXX" ট্র্যাকিং কোড প্রদর্শিত হয়। এছাড়াও আপনার "অর্ডার হিস্ট্রি" পেজে যেকোনো সময় আপনার সকল অর্ডারের কোড পাবেন।'
        : 'Your unique Order ID (e.g. EV-849204) is generated upon checkout confirmation and always stored in your Order History tab.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          {language === 'bn' ? 'গ্রাহক সেবা ও সহায়তা' : 'Customer Support & Helpdesk'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950">
          {language === 'bn' ? 'আমরা আপনাকে সাহায্য করতে প্রস্তুত' : 'We are here to assist you'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {language === 'bn'
            ? 'পণ্য সম্পর্কে প্রশ্ন, ডেলিভারি ট্র্যাকিং বা ওয়ারেন্টি সংক্রান্ত যে কোনো সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।'
            : 'Get in touch with our support team regarding orders, courier tracking, or product warranties.'}
        </p>
      </div>

      {/* 3 Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">{language === 'bn' ? 'সরাসরি হেল্পলাইন' : 'Helpline & Hotline'}</h3>
          <p className="text-xs text-neutral-500">সকাল ১০টা থেকে রাত ৮টা পর্যন্ত খোলা</p>
          <a href="tel:+8801625534570" className="text-sm font-bold font-mono text-neutral-950 block hover:underline">
            +880 1625-534570
          </a>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">{language === 'bn' ? 'ইমেইল সাপোর্ট' : 'Official Email'}</h3>
          <p className="text-xs text-neutral-500">২৪ ঘণ্টার মধ্যে উত্তর দেওয়া হয়</p>
          <a href="mailto:support@evolu.store" className="text-sm font-semibold text-neutral-950 block hover:underline">
            support@evolu.store
          </a>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">{language === 'bn' ? 'ঠিকানা ও লোকেশন' : 'Main Office & Store'}</h3>
          <p className="text-xs text-neutral-500">
            {language === 'bn' ? '১৬ দাগ বড় মসজিদ, ভেড়ামারা, কুষ্টিয়া' : '16 Dag Boro Mosque, Bheramara'}
          </p>
          <div className="text-xs font-semibold text-neutral-950">
            16 Dag Boro Mosque, Bheramara, Kushtia
          </div>
        </div>
      </div>

      {/* Form & FAQ Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-lg font-bold font-display text-neutral-950">
            {language === 'bn' ? 'বার্তা পাঠান' : 'Send an Inquiry'}
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base text-emerald-950">
                {language === 'bn' ? 'বার্তাটি সফলভাবে পৌঁছেছে!' : 'Message Received!'}
              </h4>
              <p className="text-xs text-emerald-800">
                {language === 'bn'
                  ? 'আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।'
                  : 'Our customer support representative will get back to you shortly.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold underline text-emerald-900 cursor-pointer pt-2"
              >
                {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">{language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">{language === 'bn' ? 'ইমেইল বা ফোন *' : 'Email or Phone *'}</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. 01625-534570"
                    className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">{language === 'bn' ? 'অর্ডার আইডি (যদি থাকে)' : 'Order ID (Optional)'}</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. EV-849204"
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">{language === 'bn' ? 'আপনার বার্তা বা অভিযোগ *' : 'Your Message *'}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'bn' ? 'বিস্তারিত লিখুন...' : 'Describe your question or issue in detail...'}
                  className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold font-display text-neutral-950 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>{language === 'bn' ? 'সাধারণ প্রশ্নোত্তর (FAQ)' : 'Frequently Asked Questions'}</span>
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-neutral-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between gap-3 bg-neutral-50/50 hover:bg-neutral-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
