import { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Search, 
  ShoppingCart, 
  Heart, 
  FileText, 
  HelpCircle, 
  Clock, 
  CheckCircle,
  Truck,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronUp,
  MessageSquare,
  Compass,
  Star
} from 'lucide-react';

import { Product, CartItem } from './types';
import { FRUIT_PRODUCTS, CUSTOMER_REVIEWS } from './data';
import FruitCarousel from './components/FruitCarousel';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import QuickViewModal from './components/QuickViewModal';

export default function App() {
  // Store language state (Default to 'bn' Bengali since the user's inquiry was in Bengali)
  const [language, setLanguage] = useState<'en' | 'bn'>(() => {
    const cached = localStorage.getItem('pfs_lang');
    return (cached === 'en' || cached === 'bn') ? cached : 'bn';
  });

  // Store cart list
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const cached = localStorage.getItem('pfs_cart');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // UI Open/Close States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Flash Sale Countdown States
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 32, seconds: 15 });

  // Floating scroll top indicator
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Notification Banner Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist States
  useEffect(() => {
    localStorage.setItem('pfs_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('pfs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle Scroll to display floating scroll tool
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Flash Sale Countdown Logic (Tick every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Restart countdown
          return { hours: 6, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show auto-dismissible Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart action handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        showToast(
          language === 'bn' 
            ? `${product.nameBn} সফলভাবে কার্টে যোগ করা হয়েছে!` 
            : `${product.nameEn} added to your Cart!`
        );
        return updated;
      } else {
        showToast(
          language === 'bn' 
            ? `${product.nameBn} সফলভাবে কার্টে যোগ করা হয়েছে!` 
            : `${product.nameEn} added to your Cart!`
        );
        return [...prev, { product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      const name = item ? (language === 'bn' ? item.product.nameBn : item.product.nameEn) : '';
      showToast(
        language === 'bn' 
          ? `${name} কার্ট থেকে মুছে ফেলা হয়েছে!` 
          : `${name} has been removed!`
      );
      return prev.filter(i => i.product.id !== productId);
    });
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    showToast(
      language === 'bn' 
        ? 'আপনার অর্ডারটি সার্থকভাবে নেওয়া হয়েছে! ওয়াটসঅ্যাপ বা মোবাইল ফোনে নিশ্চিত করা হবে।' 
        : 'Order processed successfully! Check your phone for verification details.'
    );
  };

  // Filter products dynamically based on search key and category tabs
  const filteredProducts = FRUIT_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesNameEn = product.nameEn.toLowerCase().includes(query);
    const matchesNameBn = product.nameBn.toLowerCase().includes(query);
    const matchesDescEn = product.descriptionEn.toLowerCase().includes(query);
    const matchesDescBn = product.descriptionBn.toLowerCase().includes(query);

    return matchesCategory && (matchesNameEn || matchesNameBn || matchesDescEn || matchesDescBn);
  });

  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5E1] via-[#FFEDD5] to-[#FED7AA] flex flex-col font-sans relative pb-16 sm:pb-0" id="main-root">
      
      {/* 1. TOP UTILITY STRIP */}
      <div className="bg-orange-950/90 text-orange-100 py-1.5 sm:py-2 text-[10px] sm:text-xs border-b border-white/5 select-none z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
          {/* Quick contact and physical location */}
          <div className="flex items-center gap-4">
            <a href="tel:01313667317" className="flex items-center gap-1.5 text-amber-300 font-semibold hover:text-amber-200 transition-colors">
              <Phone size={13} className="animate-pulse" />
              <span>{language === 'bn' ? 'কল করুন:' : 'Order Hot:'} 01313667317</span>
            </a>
            <div className="hidden md:flex items-center gap-1 text-orange-200">
              <MapPin size={13} />
              <span>{language === 'bn' ? 'পলাশবাড়ী, গাইবান্ধা' : 'Palashbari, Gaibandha'}</span>
            </div>
          </div>

          {/* Slogan and Bilingual toggle switch */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-orange-200 italic">
              {language === 'bn' ? '১২ ঘণ্টায় ডেলিভারি, শতভাগ তাজা ফলের নিশ্চয়তা!' : 'Delivered fresh from garden within 12 hours!'}
            </span>
            <div className="flex bg-white/10 rounded-md p-0.5 border border-white/20 overflow-hidden font-bold">
              <button 
                id="btn-lang-bn"
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded-sm transition-all ${language === 'bn' ? 'bg-orange-600 text-white shadow-xs' : 'text-orange-200 hover:text-white'}`}
              >
                বাংলা
              </button>
              <button 
                id="btn-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-sm transition-all ${language === 'en' ? 'bg-orange-600 text-white shadow-xs' : 'text-orange-200 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. CORE HEADER BRAND & DYNAMIC SEARCH */}
      <header className="sticky top-0 bg-white/40 backdrop-blur-md border-b border-white/20 z-40 shadow-xs transition-shadow">
        <div className="max-w-7xl mx-auto px-4 py-3.5 sm:py-4 flex flex-col gap-2.5 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md rotate-6 hover:rotate-0 transition-transform duration-300 select-none">
                P
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex flex-col leading-tight">
                  <span className="text-orange-900 font-serif font-extrabold">
                    {language === 'bn' ? 'পলাশবাড়ী ফ্রুট শপ' : 'Palashbari Fruit Shop'}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-orange-600 tracking-widest uppercase">
                    {language === 'bn' ? 'পলাশবাড়ীর নিজস্ব বাজার' : 'Local Premium Fruits'}
                  </span>
                </h1>
              </div>
            </div>

            {/* Micro shopping cart badge for small screens */}
            <button 
              id="h-cart-btn-mobile"
              onClick={() => setIsCartOpen(true)}
              className="sm:hidden relative p-2 bg-white/60 backdrop-blur-sm border border-white/40 text-orange-600 rounded-full shadow-xs"
            >
              <ShoppingCart size={20} />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white font-mono font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>

          {/* Centered Search Filter Bar */}
          <div className="flex-1 max-w-xl mx-auto sm:mx-6 w-full relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-orange-400 pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'আম, আপেল, আঙুর, লিছু বা অন্যান্য সুস্বাদু তাজা ফল খুজুন...' : 'Search delicious organic fruits (Mango, Apple, Grape, Litchi)...'}
              className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 bg-white/60 backdrop-blur-sm border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-orange-950 placeholder-orange-800/60 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                id="search-clear-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-400 hover:text-orange-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Call hotlines / shopping cart widget */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:01313667317" 
              className="hidden lg:flex flex-col text-right mr-2"
              title="Click to call support"
            >
              <span className="text-[10px] text-orange-850 font-bold uppercase tracking-wider">{language === 'bn' ? 'সরাসরি অর্ডারের নাম্বার' : 'Order Hotline'}</span>
              <span className="text-sm font-extrabold text-orange-950 font-mono">01313667317</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              id="h-cart-btn-desktop"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 text-orange-600 font-extrabold text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingCart size={17} className="text-orange-600" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-orange-600 text-white font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="text-orange-950">{language === 'bn' ? 'আমার থলে' : 'Cart'}</span>
              {cartTotalItems > 0 && (
                <span className="bg-orange-200/90 text-orange-900 font-mono text-xs px-1.5 py-0.5 rounded-md ml-1 font-extrabold">
                  ৳{cartTotalPrice}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 3. DYNAMIC TOAST NOTIFICATION CONTAINER */}
      {toastMessage && (
        <div id="toast-banner" className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8 w-full">
        
        {/* SECTION A: SLIDING HEADERS (CAROUSEL) */}
        {!searchQuery && selectedCategory === 'all' && (
          <section id="hero-carousel-section" className="space-y-1.5">
            <FruitCarousel
              products={FRUIT_PRODUCTS}
              language={language}
              onQuickBuy={(prod) => {
                handleAddToCart(prod, 1);
                setIsCartOpen(true);
              }}
            />
            <div className="text-center">
              <span className="text-[10px] md:text-xs text-slate-400 italic">
                {language === 'bn' 
                  ? '☝️ উপরে সব ধরনের সেরা তাজা ও সুস্বাদু অফারের ফলের লিস্ট স্লাইড হচ্ছে, বিস্তারিত দেখতে স্লাইড লক্ষ্য করুন!' 
                  : '☝️ The sliding header carousel above shows premium fresh fruit bargains! Watch them shift dynamically.'}
              </span>
            </div>
          </section>
        )}

        {/* SECTION B: CONFIDENCE PROMO CARDS */}
        <section id="features-promo-section" className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 select-none">
          <div className="bg-white/40 backdrop-blur-lg border border-white/40 p-3.5 sm:p-4 rounded-3xl flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-orange-950 text-xs sm:text-sm">
                {language === 'bn' ? '১০০% তাজা ও অর্গানিক' : '100% Chemical Free'}
              </h4>
              <p className="text-[10px] sm:text-xs text-orange-900/60 font-medium">
                {language === 'bn' ? 'রাসায়নিক ও ফরমালিন সম্পূর্ণ মুক্ত ফল' : 'Finest organic handpicked orchard fruits'}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-lg border border-white/40 p-3.5 sm:p-4 rounded-3xl flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-700 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-orange-950 text-xs sm:text-sm">
                {language === 'bn' ? ' দ্রুত হোম ডেলিভারি ' : 'Super Fast Hand Delivery'}
              </h4>
              <p className="text-[10px] sm:text-xs text-orange-900/60 font-medium">
                {language === 'bn' ? 'পলাশবাড়ী ও নিকটবর্তী এলাকায় দ্রুত সার্ভিস' : 'Guaranteed fastest delivery (under 3 hours)'}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-lg border border-white/40 p-3.5 sm:p-4 rounded-3xl flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-700 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-orange-950 text-xs sm:text-sm">
                {language === 'bn' ? 'আসল মূল্যের বিশ্বস্ত দোকান' : 'Fair Standard Price'}
              </h4>
              <p className="text-[10px] sm:text-xs text-orange-900/60 font-medium">
                {language === 'bn' ? 'ন্যায্য মূল্যে বাজারে সব ধরনের সেরা ফল' : 'Accurate original pricing structure always'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION C: DARAZ-STYLE HOT FLASH DEALS spotlight */}
        {!searchQuery && (
          <section id="daraz-flash-deals-block" className="bg-gradient-to-r from-orange-500 to-red-500 rounded-[2.5rem] p-4 sm:p-5 text-white shadow-2xl relative overflow-hidden select-none border border-white/30">
            {/* Visual aesthetic elements */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 translate-y-12 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-white text-orange-600 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse shadow-sm">
                    {language === 'bn' ? 'আজকের ফায়ার সেল' : 'HOT FLASH SALE'}
                  </span>
                  <span className="text-xs text-amber-100 font-bold">
                    {language === 'bn' ? 'সীমিত স্টক!' : 'Strictly limited quantity!'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  {language === 'bn' ? 'দিনের সেরা অফারে সস্তা বাজার করুন' : 'Grab Today\'s Fresh Produce Bargains'}
                </h3>
              </div>

              {/* Real Countdown Timers */}
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-2 px-3 rounded-2xl border border-white/20 backdrop-blur-md self-start md:self-auto">
                <span className="text-xs sm:text-sm text-orange-950 font-bold">{language === 'bn' ? 'শেষ হতে বাকি:' : 'Ending In:'}</span>
                <div className="flex gap-1.5 font-mono text-center">
                  <div className="bg-orange-600 text-white p-1.5 px-2.5 rounded-xl font-black text-xs sm:text-sm shadow-sm">
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <span className="text-orange-850 font-bold">:</span>
                  <div className="bg-orange-600 text-white p-1.5 px-2.5 rounded-xl font-black text-xs sm:text-sm shadow-sm">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-orange-850 font-bold">:</span>
                  <div className="bg-orange-600 text-white p-1.5 px-2.5 rounded-xl font-black text-xs sm:text-sm shadow-sm">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* SECTION D: CATEGORY TAB FILTERS & PRODUCT LISTING */}
        <section id="fruit-marketplace-listing" className="space-y-4">
          <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between border-b border-orange-200/30 pb-3">
            
            {/* Title */}
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-orange-950 tracking-tight flex items-center gap-1.5">
                <span className="w-2.5 h-7 bg-orange-600 rounded-full" />
                <span>
                  {searchQuery 
                    ? (language === 'bn' ? `খোঁজা হচ্ছে: "${searchQuery}"` : `Searched for: "${searchQuery}"`)
                    : (language === 'bn' ? 'অর্গানিক তাজা সংকলন' : 'Organic Selection')
                  }
                </span>
                <span className="font-mono text-xs text-orange-900 bg-white/50 border border-white/40 px-2.5 py-0.5 rounded-full ml-1 font-extrabold uppercase">
                  {filteredProducts.length} {language === 'bn' ? 'টি ফল' : 'items'}
                </span>
              </h2>
              <p className="text-xs text-orange-900/60 font-semibold">
                {language === 'bn' ? 'নিচের ক্যাটাগরি বাটনে চাপ দিয়ে নির্দিষ্ট ফল খুঁজুন' : 'Select a category folder from tabs below to narrow down your search'}
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none select-none">
              {[
                { id: 'all', bn: 'সব ফল', en: 'All Fruits' },
                { id: 'local', bn: 'দেশী ফল', en: 'Local Fruits' },
                { id: 'imported', bn: 'বিদেশী ফল', en: 'Premium Imports' },
                { id: 'citrus', bn: 'রসালো ফল', en: 'Citrus & Malta' },
                { id: 'berries', bn: 'পুষ্টিকর বেরি', en: 'DRAGON & BERRIES' }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`cat-tab-${tab.id}`}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                    selectedCategory === tab.id
                      ? 'bg-orange-500 text-white rounded-xl shadow-md font-extrabold'
                      : 'bg-white/40 backdrop-blur-sm text-orange-950/80 border border-white/40 hover:bg-white/60 hover:text-orange-950'
                  }`}
                >
                  {language === 'bn' ? tab.bn : tab.en}
                </button>
              ))}
            </div>

          </div>

          {/* DYNAMIC PRODUCT GRID LIST ("list gula choto choto aktar por akta sajano") */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5" id="products-grid-list">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onAddToCart={(prod) => handleAddToCart(prod, 1)}
                  onQuickView={(prod) => setSelectedQuickProduct(prod)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-6" id="empty-results-box">
              <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search size={22} />
              </div>
              <h4 className="font-bold text-slate-700 text-base mb-1">
                {language === 'bn' ? 'কোনো ফল পাওয়া যায়নি!' : 'No Fruits Match Search!'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'bn' 
                  ? 'আপনার খোঁজা ফলের তথ্য মিলছে না। আপনার নামের বানান পরীক্ষা করুন অথবা সম্পূর্ণ তালিকা দেখতে অন্য বোতামে চাপ দিন।' 
                  : 'We could not find anything matching that specific spelling. Try another organic fruit name.'}
              </p>
              <button
                id="btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2 rounded-lg transition-all"
              >
                {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'View All Fruits'}
              </button>
            </div>
          )}
        </section>

        {/* SECTION E: DARAZ CUSTOMER FEEDBACK & STARS REVIEWS */}
        <section id="testimonials-reviews-block" className="bg-white/40 backdrop-blur-lg border border-white/40 p-5 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-orange-200/20 pb-3">
            <div>
              <h3 className="font-extrabold text-orange-950 text-sm sm:text-base flex items-center gap-1.5">
                <Star size={16} className="text-orange-600 fill-orange-500 stroke-none" />
                {language === 'bn' ? 'গ্রাহকদের মূল্যবান মন্তব্য (রিভিউ)' : 'Trusted Customer Reviews'}
              </h3>
              <p className="text-[10px] sm:text-xs text-orange-900/60 font-medium">
                {language === 'bn' ? 'পলাশবাড়ী অঞ্চলের ক্রেতাদের দেওয়া খাঁটি মতামত' : 'Verifiable customer reviews for Palashbari fruits'}
              </p>
            </div>
            <span className="text-xs font-bold text-orange-900 bg-white/65 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/40 shadow-xs">
              ★ ৪.৮ / ৫.০ ({FRUIT_PRODUCTS.reduce((sum, p) => sum + p.reviewCount, 0)} {language === 'bn' ? 'মোট রেটিং' : 'Total Ratings'})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CUSTOMER_REVIEWS.map(rev => (
              <div key={rev.id} className="bg-white/50 backdrop-blur-xs p-4 rounded-3xl border border-white/30 space-y-2 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-orange-950 text-xs sm:text-sm">{rev.name}</span>
                  <span className="text-[10px] text-orange-900/60 font-mono font-bold">{rev.date}</span>
                </div>
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      fill={i < rev.rating ? 'currentColor' : 'none'} 
                      stroke={i < rev.rating ? 'none' : 'currentColor'} 
                    />
                  ))}
                </div>
                <p className="text-xs text-orange-950/80 leading-relaxed italic font-medium">
                  "{rev.comment}"
                </p>
                <div className="pt-2 text-[10px] text-orange-900/60 font-bold uppercase tracking-wide">
                  {language === 'bn' ? 'ক্রয়কৃত ফল: ' : 'Purchased: '} <strong className="text-orange-700">{rev.fruit}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION F: DETAILED HELP / FAQ SECTION FOR CONVERSION */}
        <section id="store-frequently-faq" className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
          <div className="bg-white/40 backdrop-blur-lg border border-white/40 p-5 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-extrabold text-orange-950 text-xs sm:text-sm flex items-center gap-1.5">
              <Clock size={16} className="text-orange-600" />
              {language === 'bn' ? 'অর্ডার প্রসেস করার সময়সূচী' : 'Store Operational Hours'}
            </h4>
            <p className="text-xs text-orange-900/85 leading-relaxed font-medium">
              {language === 'bn' 
                ? 'পলাশবাড়ী ফ্রুট শপ সকাল ৭:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত খোলা থাকে। এই সময়ের মধ্যে অর্ডার করলে পলাশবাড়ী ও গাইবান্ধা সদর এলাকার ক্রেতারা ৩ ঘণ্টার মধ্যে তাজা ফলের এক্সপ্রেস হোম ডেলিভারি পাবেন। অন্যথায় পরের দিন সকালে পৌঁছানো হবে।' 
                : 'Palashbari Fruit Shop is open from 7:00 AM to 10:00 PM daily. Placing orders within this slot warrants lightning fast delivery within Gaibandha in 3 hours.'}
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-lg border border-white/40 p-5 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-extrabold text-orange-950 text-xs sm:text-sm flex items-center gap-1.5">
              <CheckCircle size={16} className="text-orange-500" />
              {language === 'bn' ? 'রাসায়নিক ও ফরমালিন টেস্ট' : 'Chemical-Free Verification Check'}
            </h4>
            <p className="text-xs text-orange-900/85 leading-relaxed font-medium">
              {language === 'bn' 
                ? 'আমরা আমাদের বাগান এবং চুক্তিবদ্ধ চাষীদের নিকট থেকে ফল সংগ্রহ করি। সংগ্রহের আগে ও পরে পরীক্ষা করে শতভাগ ফরমালিন ও কীটনাশকমুক্ত ডালিম, আম, কমলা ও আঙুর সরবরাহ নিশ্চিত করা হয়ে থাকে। সন্তুষ্ট না হলে ১ দিন এর মধ্যে পরিবর্তনের সুবিধা।' 
                : 'All incoming fruits pass rigorous quality benchmarks before loading. We claim a absolute pesticide-free, chemicals-free natural organic fruit distribution. Exchange return within 24hr permitted if unsatisfied.'}
            </p>
          </div>
        </section>

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 border-t border-slate-800" id="store-footer-details">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Shop branding & Phone number */}
          <div className="space-y-3">
            <h4 className="text-lg font-black text-amber-500 font-serif">
              {language === 'bn' ? 'পলাশবাড়ী ফ্রুট শপ (পিপিএস)' : 'Palashbari Fruit Shop (PFS)'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn' 
                ? 'পলাশবাড়ী উপজেলার সবথেকে বিশ্বস্ত এবং আসল দামের তাজা ফলের অনলাইন মার্কেট। Daraz এর মতো আধুনিক ইন্টারফেস দিয়ে ঘরে বসেই অর্ডার করুন যেকোনো ফল।' 
                : 'Palashbari’s ultimate trustworthy portal to order imported and regional direct orchard fruits. Enjoy smooth Daraz-like checkout and customer relations.'}
            </p>
            <div className="pt-2 text-xs">
              <span className="block font-bold text-slate-300">{language === 'bn' ? 'মোবাইল অর্ডারিং হটলাইন:' : 'Call Store Owner:'}</span>
              <a 
                href="tel:01313667317" 
                className="text-lg font-black text-amber-400 font-mono hover:underline"
              >
                01313667317
              </a>
            </div>
          </div>

          {/* Quick categories links */}
          <div className="space-y-3 select-none">
            <h4 className="font-bold text-slate-200 text-sm tracking-wider uppercase">
              {language === 'bn' ? 'জনপ্রিয় ফলের ক্যাটাগরি' : 'Recommended Fruits'}
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <button onClick={() => setSelectedCategory('local')} className="hover:text-amber-500 transition-colors">
                  {language === 'bn' ? '» রাজশাহীর মিষ্টি আম ও দিনাজপুরের লিচু' : '» Sweet Rajshahi Mangoes & Dinajpur Litchis'}
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('imported')} className="hover:text-amber-500 transition-colors">
                  {language === 'bn' ? '» গালা আপেল ও লাল ডালিম / বেদানা' : '» Gala Apples & Ruby Red Granates'}
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('citrus')} className="hover:text-amber-500 transition-colors">
                  {language === 'bn' ? '» মিষ্টি কমলা ও রসালো মাল্টা' : '» Sweet Orange Clementine & Juicy Malta'}
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('berries')} className="hover:text-amber-500 transition-colors">
                  {language === 'bn' ? '» থাই ড্রাগন ফল ও স্পেশাল বেরিস' : '» Thai Dragon fruits & Special Berries'}
                </button>
              </li>
            </ul>
          </div>

          {/* Location details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm tracking-wider uppercase">
              {language === 'bn' ? 'দোকানের ঠিকানা ও যোগাযোগের ঠিকানা' : 'Store Location Address'}
            </h4>
            <div className="text-xs space-y-2.5 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>
                  {language === 'bn' 
                    ? 'আয়ুর্বেদিক হসপিটাল এর অপর পাশে, গাইবান্ধা রোড, পলাশবাড়ী সদর, পলাশবাড়ী, গাইবান্ধা, বাংলাদেশ।' 
                    : 'Opposite Ayurvedic Clinic, Gaibandha Rd, Palashbari Sadar, Palashbari, Gaibandha, Bangladesh.'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-amber-500 shrink-0" />
                <span>০১৩১৩৬৬৭৩১৭ (01313667317)</span>
              </p>
              
              {/* Fake systems credits avoiding warning but showing standard ecomm badges */}
              <div className="pt-2">
                <span className="block text-[10px] text-slate-500 mb-1.5 uppercase font-bold">{language === 'bn' ? 'পেমেন্ট সাপোর্ট:' : 'We Accept Secure payments:'}</span>
                <div className="flex gap-2 flex-wrap select-none font-mono font-black text-[9px] text-slate-900">
                  <span className="bg-pink-100 px-1.5 py-0.5 rounded-xs" title="Bkash">bKash</span>
                  <span className="bg-orange-100 px-1.5 py-0.5 rounded-xs" title="Nagad">Nagad</span>
                  <span className="bg-[#41b54a] text-white px-1.5 py-0.5 rounded-xs" title="Rocket">Rocket</span>
                  <span className="bg-slate-200 px-1.5 py-0.5 rounded-xs" title="Cash on Delivery">CASH ON DELIVERY</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* copyright sub strip */}
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 select-none">
          <p>© ২০২৬ পলাশবাড়ী ফ্রুট শপ। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-[10px] text-slate-600 mt-1">
            {language === 'bn' ? 'সরাসরি ফ্রন্টএন্ড ডিজাইন ও ডেভলপমেন্ট - পলাশবাড়ী রিজিওনাল বাজার পোর্টাল' : 'Premium Dynamic Single View Digital Storefront Code - Palashbari Regional Grocery Initiative'}
          </p>
        </div>
      </footer>

      {/* 5. STICKY FOOTER NAVIGATION BAR ON SMARTPHONE (DARAZ APP FEEL) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/70 backdrop-blur-xl border-t border-white/40 shadow-xl z-40 py-2 px-4 flex justify-between items-center sm:hidden" id="mobile-sticky-action-bar">
        
        {/* Languages Switch toggle */}
        <button
          id="btn-sticky-toggle-lang"
          onClick={() => setLanguage(prev => prev === 'bn' ? 'en' : 'bn')}
          className="flex flex-col items-center justify-center p-1.5 text-orange-700/80 hover:text-orange-600 active:scale-95 transition-all"
        >
          <Compass size={18} className="text-orange-600" />
          <span className="text-[9px] font-bold mt-0.5">
            {language === 'bn' ? 'English' : 'বাংলায়'}
          </span>
        </button>

        {/* Direct Call shopping link */}
        <a 
          href="tel:01313667317"
          className="flex flex-col items-center justify-center p-1.5 text-orange-700/80 hover:text-orange-600 active:scale-95 transition-all"
          id="mobile-call-nav"
        >
          <Phone size={18} className="text-orange-600 animate-bounce" />
          <span className="text-[9px] font-semibold mt-0.5">{language === 'bn' ? 'কল দিন' : 'Call Order'}</span>
        </a>

        {/* Large green Floating Order WhatsApp Link immediately */}
        <a
          href="https://wa.me/8801313667317"
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 text-white rounded-full p-2.5 shadow-lg relative -top-3 cursor-pointer select-none active:scale-95 text-xs font-bold transition-all flex items-center justify-center gap-1 shrink-0"
          id="mobile-whatsapp-nav"
        >
          <MessageSquare size={16} fill="currentColor" className="stroke-none" />
          <span className="text-[10px]">{language === 'bn' ? 'ওয়াটসঅ্যাপ' : 'WhatsApp'}</span>
        </a>

        {/* Micro Cart sidebar indicator */}
        <button
          id="btn-sticky-cart"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 text-orange-700/80 hover:text-orange-600 active:scale-95 transition-all relative"
        >
          <ShoppingCart size={18} className="text-orange-600" />
          {cartTotalItems > 0 && (
            <span className="absolute top-1 right-2 bg-orange-600 text-white font-mono font-semibold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartTotalItems}
            </span>
          )}
          <span className="text-[9px] font-semibold mt-0.5">
            {language === 'bn' ? '৳' + cartTotalPrice : 'Cart'}
          </span>
        </button>

      </div>

      {/* 6. FLOATING SCROLL TOP BUTTON */}
      {showScrollTop && (
        <button
          id="scroll-top-arrow-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hidden sm:flex fixed bottom-6 right-6 z-40 bg-white/70 hover:bg-white text-slate-700 hover:text-amber-600 active:scale-95 w-10 h-10 rounded-full border border-slate-200 shadow-md backdrop-blur-xs items-center justify-center transition-all duration-300"
          title="Scroll back to top area"
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* 7. CART DRAWER COMPONENT */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        language={language}
      />

      {/* 8. INTERACTIVE CHECKOUT MODAL FORM */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
        language={language}
      />

      {/* 9. VISUAL DETAILS QUICK VIEW Modal */}
      <QuickViewModal
        isOpen={!!selectedQuickProduct}
        product={selectedQuickProduct}
        onClose={() => setSelectedQuickProduct(null)}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        language={language}
      />

    </div>
  );
}
