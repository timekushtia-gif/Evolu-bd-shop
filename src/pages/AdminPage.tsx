import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import {
  Lock,
  Unlock,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Truck,
  User,
  Phone,
  MapPin,
  X,
  Save,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    updateOrderCourier,
    navigateTo,
    language,
    formatPrice,
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');

  // Search & Filter in Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newName, setNewName] = useState('');
  const [newNameBn, setNewNameBn] = useState('');
  const [newBrand, setNewBrand] = useState('EVolu Gear');
  const [newCategory, setNewCategory] = useState<'audio' | 'wearables' | 'carry' | 'workspace' | 'gadgets'>('audio');
  const [newPrice, setNewPrice] = useState<number>(3500);
  const [newOrigPrice, setNewOrigPrice] = useState<number>(4500);
  const [newStock, setNewStock] = useState<number>(20);
  const [newImage, setNewImage] = useState('/src/assets/images/hero_modern_lifestyle_1793976297485.jpg');
  const [newDesc, setNewDesc] = useState('');
  const [newDescBn, setNewDescBn] = useState('');
  const [newColor, setNewColor] = useState('Matte Black');

  // If not logged in, show Password Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/80 shadow-2xl p-8 space-y-6 text-center relative overflow-hidden">
          {/* Subtle colorful top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="flex flex-col items-center justify-center pt-2">
            <BrandLogo size="lg" className="justify-center" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-[11px] font-semibold text-neutral-600 mt-4">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'bn' ? 'সুরক্ষিত অ্যাডমিন পোর্টাল' : 'Secure Admin Portal'}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold font-display text-neutral-950">
              {language === 'bn' ? 'অ্যাডমিন প্যানেল লগইন' : 'Admin Portal Login'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {language === 'bn'
                ? 'পণ্য আপলোড, এডিটিং এবং কাস্টমার অর্ডার ব্যবস্থাপনার জন্য পাসওয়ার্ড প্রবেশ করুন।'
                : 'Enter security password to access product management and order controls.'}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminLogin(passwordInput);
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড (Admin Password)' : 'Admin Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3.5 pr-11 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্যানেলে প্রবেশ করুন' : 'Unlock Dashboard'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized access only · EVolu Management</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.summary.total, 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockCount, 0);

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchQuery =
      !orderSearch.trim() ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    const matchStatus = orderFilterStatus === 'all' || o.status === orderFilterStatus;
    return matchQuery && matchStatus;
  });

  // Filter Products
  const filteredProducts = products.filter((p) => {
    return (
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameBn.includes(productSearch) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    const categoryLabels: Record<string, { en: string; bn: string }> = {
      audio: { en: 'Audio & Acoustics', bn: 'অডিও ও সাউন্ড' },
      wearables: { en: 'Smart Wearables', bn: 'স্মার্ট ওয়্যারেবল' },
      carry: { en: 'Everyday Carry', bn: 'ট্রাভেল ও ব্যাকপ্যাক' },
      workspace: { en: 'Workspace & Studio', bn: 'ওয়ার্কস্পেস ও স্টুডিও' },
      gadgets: { en: 'Smart Gadgets', bn: 'স্মার্ট গ্যাজেট' },
    };

    addProduct({
      name: newName.trim(),
      nameBn: newNameBn.trim() || newName.trim(),
      brand: newBrand.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory].en,
      categoryLabelBn: categoryLabels[newCategory].bn,
      price: Number(newPrice),
      originalPrice: Number(newOrigPrice) || Number(newPrice) * 1.2,
      image: newImage,
      gallery: [newImage],
      description: newDesc.trim() || 'High quality original product from EVolu catalog.',
      descriptionBn: newDescBn.trim() || 'ইভলু স্টোরের প্রিমিয়াম অরিজিনাল পণ্য।',
      inStock: newStock > 0,
      stockCount: Number(newStock),
      isNew: true,
      colors: [{ name: newColor || 'Standard', hex: '#18181b' }],
      specs: {
        'Warranty': '1 Year Brand Warranty',
        'Condition': 'Brand New 100% Authentic',
      },
      specsBn: {
        'ওয়ারেন্টি': '১ বছরের অফিসিয়াল ওয়ারেন্টি',
        'কন্ডিশন': 'সম্পূর্ণ নতুন ও অরিজিনাল',
      },
    });

    setIsAddProductOpen(false);
    // Reset
    setNewName('');
    setNewNameBn('');
    setNewDesc('');
    setNewDescBn('');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      nameBn: editingProduct.nameBn,
      brand: editingProduct.brand,
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice),
      stockCount: Number(editingProduct.stockCount),
      inStock: Number(editingProduct.stockCount) > 0,
      description: editingProduct.description,
      descriptionBn: editingProduct.descriptionBn,
      image: editingProduct.image,
    });
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Bar */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-neutral-800">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <BrandLogo size="sm" variant="light" showSubtitle={false} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mt-1">
            {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড ও ম্যানেজমেন্ট' : 'Admin Dashboard & Management'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {language === 'bn'
              ? 'সকল গ্রাহকের অর্ডার বিস্তারিত, পণ্য আপলোড ও লাইভ স্ট্যাটাস আপডেট করুন এখান থেকে।'
              : 'Oversee all customer orders, upload & edit products, and track real-time fulfillment.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লাইভ স্টোর দেখুন' : 'View Storefront'}</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-4 py-2.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Vibrant & Colorful) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {language === 'bn' ? 'মোট বিক্রয় (Revenue)' : 'Total Sales'}
            </span>
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-950 mt-3 tabular-nums">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            {language === 'bn' ? 'অনলাইন ও সিওডি সর্বমোট আয়' : 'Online & COD aggregated'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">
              {language === 'bn' ? 'অর্ডার সংখ্যা' : 'Total Orders'}
            </span>
            <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-950 mt-3 tabular-nums">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-indigo-700 mt-1">
            {pendingOrders} {language === 'bn' ? 'টি ডেলিভারির অপেক্ষায়' : 'awaiting delivery'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
              {language === 'bn' ? 'স্টোর পণ্য সংখ্যা' : 'Live Products'}
            </span>
            <div className="p-2 bg-purple-500 text-white rounded-xl shadow-xs">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-950 mt-3 tabular-nums">
            {products.length}
          </div>
          <div className="text-[11px] text-purple-700 mt-1">
            {totalStockUnits} {language === 'bn' ? 'টি আইটেম স্টকে বিদ্যমান' : 'units in current stock'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              {language === 'bn' ? 'ডেলিভারি সাফল্য হার' : 'Success Rate'}
            </span>
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-950 mt-3 tabular-nums">
            99.2%
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {language === 'bn' ? 'Steadfast & Pathao এক্সপ্রেস' : 'Steadfast & Pathao Express'}
          </div>
        </div>
      </div>

      {/* Main Admin Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {language === 'bn' ? `অর্ডার ম্যানেজমেন্ট (${orders.length})` : `Order Management (${orders.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>
              {language === 'bn' ? `পণ্য আপলোড ও এডিটিং (${products.length})` : `Products Catalog (${products.length})`}
            </span>
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন পণ্য আপলোড' : 'Add New Product'}</span>
          </button>
        )}
      </div>

      {/* TAB 1: ORDERS MANAGEMENT (Customer details, ordered items, payment status, status updater) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder={language === 'bn' ? 'অর্ডার আইডি, গ্রাহকের নাম বা ফোন...' : 'Search Order ID, customer, phone...'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-neutral-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
              {['all', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilterStatus(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap cursor-pointer transition-colors ${
                    orderFilterStatus === st
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 space-y-2">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-800">
                {language === 'bn' ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No orders matched your search'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:border-neutral-300 transition-all"
                >
                  {/* Order Top Ribbon */}
                  <div className="p-4 sm:p-5 bg-neutral-50/70 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base sm:text-lg font-bold font-mono text-neutral-950">
                        {order.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'packed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-600">
                        {language === 'bn' ? 'স্ট্যাটাস পরিবর্তন:' : 'Change Status:'}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 focus:outline-neutral-900 cursor-pointer shadow-xs"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => navigateTo('tracking', { orderId: order.id })}
                        className="p-1.5 text-neutral-600 hover:text-neutral-950 rounded-lg hover:bg-neutral-200 transition-colors"
                        title="View Public Tracker"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Main Details Grid */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer Information (FULL DETAILS) */}
                    <div className="space-y-3 bg-neutral-50/60 p-4 rounded-xl border border-neutral-100">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span>{language === 'bn' ? 'গ্রাহকের বিবরণ' : 'Customer Details'}</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-neutral-700">
                        <div className="font-bold text-sm text-neutral-950">{order.customer.fullName}</div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          <a href={`tel:${order.customer.phone}`} className="font-mono text-indigo-600 underline font-medium">
                            {order.customer.phone}
                          </a>
                        </div>
                        <div className="text-neutral-500">{order.customer.email}</div>
                        <div className="flex items-start gap-1.5 pt-1 border-t border-neutral-200/60">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-neutral-900">{order.customer.address}</span>
                            <div className="text-[11px] text-neutral-500">
                              {order.customer.area}, {order.customer.city} {order.customer.postalCode ? `(${order.customer.postalCode})` : ''}
                            </div>
                          </div>
                        </div>
                        {order.customer.deliveryNotes && (
                          <div className="text-[11px] bg-amber-50 text-amber-800 p-2 rounded border border-amber-200/60">
                            <strong>Note:</strong> {order.customer.deliveryNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-3 md:col-span-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'bn' ? 'অর্ডারকৃত পণ্যসমূহ' : 'Ordered Items'}</span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded bg-white border border-neutral-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-neutral-900 truncate">
                                {language === 'bn' ? item.product.nameBn : item.product.name}
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                Qty: <strong className="text-neutral-900">{item.quantity}</strong> {item.selectedColor ? `· ${item.selectedColor}` : ''}
                              </div>
                            </div>
                            <div className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                              ৳{(item.product.price * item.quantity).toLocaleString('en-US')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment & Logistics Summary */}
                    <div className="space-y-3 bg-neutral-50/60 p-4 rounded-xl border border-neutral-100 flex flex-col justify-between">
                      <div className="space-y-2 text-xs">
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center justify-between">
                          <span>{language === 'bn' ? 'পেমেন্ট ও কুরিয়ার' : 'Payment & Logistics'}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.payment.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.payment.status}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-neutral-500">Payment Method:</span>
                          <span className="font-bold uppercase text-neutral-900">{order.payment.method}</span>
                        </div>
                        {order.payment.transactionId && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">TxID:</span>
                            <span className="font-mono text-neutral-900 font-semibold">{order.payment.transactionId}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Courier:</span>
                          <span className="font-medium text-neutral-900">{order.courier.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Rider:</span>
                          <span className="font-medium text-neutral-900">
                            {order.courier.riderName} ({order.courier.riderPhone})
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                        <span className="text-xs font-bold text-neutral-700">{language === 'bn' ? 'সর্বমোট আদায়:' : 'Total Payable:'}</span>
                        <span className="text-base font-bold font-mono text-neutral-950 tabular-nums">
                          ৳{order.summary.total.toLocaleString('en-US')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT (Add new, Edit, Delete, Stock) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder={language === 'bn' ? 'পণ্য বা ব্র্যান্ড খুঁজুন...' : 'Search products or brand...'}
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-neutral-900"
              />
            </div>
            <div className="text-xs text-neutral-500">
              {filteredProducts.length} {language === 'bn' ? 'টি পণ্য পাওয়া গেছে' : 'products found'}
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Image & Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (৳)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg bg-neutral-100 border border-neutral-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-neutral-900 sm:text-sm">
                              {language === 'bn' ? p.nameBn : p.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-medium">{p.brand}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-medium text-neutral-700 capitalize">
                        {p.category}
                      </td>

                      <td className="p-4 font-mono font-bold text-neutral-900 tabular-nums">
                        ৳{p.price.toLocaleString('en-US')}
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] font-mono tabular-nums ${
                            p.stockCount > 5
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.stockCount > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {p.stockCount} in stock
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-neutral-800">
                        ⭐ {p.rating} ({p.reviewsCount})
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 text-neutral-600 hover:text-indigo-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত এই পণ্যটি ডিলিট করতে চান?' : 'Are you sure you want to delete this product?')) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setIsAddProductOpen(false)} className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold font-display text-neutral-950">
                {language === 'bn' ? 'নতুন পণ্য আপলোড ফরম' : 'Upload New Product'}
              </h2>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Sonic Pro Earphones"
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Name (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={newNameBn}
                    onChange={(e) => setNewNameBn(e.target.value)}
                    placeholder="উদা: সনিক প্রো ইয়ারফোন"
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                  >
                    <option value="audio">Audio & Acoustics</option>
                    <option value="wearables">Smart Wearables</option>
                    <option value="carry">Everyday Carry</option>
                    <option value="workspace">Workspace</option>
                    <option value="gadgets">Smart Gadgets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Selling Price (৳) *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Image Selection</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    '/src/assets/images/hero_modern_lifestyle_1793976297485.jpg',
                    '/src/assets/images/product_anc_headphones_1793976297565.jpg',
                    '/src/assets/images/product_smart_watch_1793976298205.jpg',
                    '/src/assets/images/product_minimal_backpack_1793976299255.jpg',
                  ].map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setNewImage(img)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        newImage === img ? 'border-neutral-950 scale-102 ring-2 ring-neutral-400' : 'border-neutral-200 opacity-60'
                      }`}
                    >
                      <img src={img} alt="choice" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Or enter custom image path / URL"
                  className="w-full p-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Description (বাংলা)</label>
                <textarea
                  rows={2}
                  value={newDescBn}
                  onChange={(e) => setNewDescBn(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'bn' ? 'পণ্য সংরক্ষণ ও প্রকাশ করুন' : 'Publish Product'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setEditingProduct(null)} className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold font-display text-neutral-950">
                {language === 'bn' ? 'পণ্য এডিটিং ফরম' : 'Edit Product'}
              </h2>
              <button onClick={() => setEditingProduct(null)} className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Name (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameBn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
