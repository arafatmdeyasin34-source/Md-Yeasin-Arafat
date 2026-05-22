import { X, Star, ShoppingCart, Heart, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  language: 'en' | 'bn';
}

export default function QuickViewModal({
  isOpen,
  product,
  onClose,
  onAddToCart,
  language
}: QuickViewModalProps) {
  if (!isOpen || !product) return null;

  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark backdrop overlay */}
      <div 
        id="quickview-overlay"
        onClick={onClose} 
        className="fixed inset-0 bg-orange-950/20 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container Card */}
      <div className="relative bg-white/75 backdrop-blur-2xl border border-white/40 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden z-10 p-0 transform transition-transform animate-scale-up grid grid-cols-1 md:grid-cols-2">
        
        {/* Close Switch */}
        <button 
          id="btn-close-quickview"
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors border border-transparent hover:border-white/20"
          title="Close modal"
        >
          <X size={16} />
        </button>

        {/* Left Column: Premium Fruit Photo Banner */}
        <div className="relative aspect-square md:aspect-auto md:h-full bg-white/50 min-h-[240px] border-r border-orange-200/20">
          <img
            src={product.image}
            alt={language === 'bn' ? product.nameBn : product.nameEn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Top badges floating in image */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            <span className="bg-red-600 text-white font-mono text-xs font-black px-2.5 py-1 rounded-full shadow-md">
              -{discountPercent}% {language === 'bn' ? 'ছাড়' : 'OFF'}
            </span>
            <span className="bg-emerald-600/90 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md select-none backdrop-blur-xs">
              {language === 'bn' ? 'রাসায়নিক মুক্ত তাজা ফল' : 'Chemical-Free Freshness'}
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Data Details */}
        <div className="p-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto bg-transparent">
          <div className="space-y-4">
            {/* Header category and rating */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] tracking-widest uppercase font-black text-orange-900 bg-orange-500/10 border border-orange-500/25 px-2.5 py-1 rounded-full select-none">
                {product.category === 'local' ? (language === 'bn' ? 'দেশী ফল' : 'Local Fruit') : 
                 product.category === 'imported' ? (language === 'bn' ? 'আমদানিকৃত' : 'Imported') :
                 product.category === 'citrus' ? (language === 'bn' ? 'রসালো / সাইট্রাস' : 'Citrus & Juicy') : 
                 (language === 'bn' ? 'পুষ্টিকর বেরি ফল' : 'Superfood Berries')}
              </span>
              <div className="flex items-center text-amber-500 text-xs">
                <Star size={14} fill="currentColor" className="stroke-none mr-1" />
                <span className="font-black text-orange-950">{product.rating}</span>
                <span className="text-orange-900/60 ml-1 font-bold">({product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </div>
            </div>

            {/* Title / Description */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-orange-950 tracking-tight">
                {language === 'bn' ? product.nameBn : product.nameEn}
              </h3>
              <p className="text-xs sm:text-sm text-orange-900/80 leading-relaxed font-semibold">
                {language === 'bn' ? product.descriptionBn : product.descriptionEn}
              </p>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl sm:text-3xl font-black text-orange-655 font-mono">
                ৳{product.discountPrice}
              </span>
              <span className="text-sm text-orange-900/40 line-through font-mono">
                ৳{product.originalPrice}
              </span>
              <span className="text-xs text-orange-700/60 font-semibold">
                / {language === 'bn' ? product.unitBn : product.unitEn}
              </span>
            </div>

            {/* Health Benefits Bullets List */}
            <div className="space-y-1.5 pt-2 border-t border-orange-200/20">
              <h4 className="text-xs font-black text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                {language === 'bn' ? 'ফলের স্বাস্থ্য উপকারিতা:' : 'Vitamins & Health Benefits:'}
              </h4>
              <ul className="text-xs text-orange-950/85 space-y-1 pl-5 list-disc leading-relaxed font-bold">
                {(language === 'bn' ? product.benefitsBn : product.benefitsEn).map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Delivery Tagline snippet */}
            <div className="flex gap-2 items-center text-[10px] sm:text-xs text-orange-900/60 font-bold pt-2">
              <Zap size={14} className="text-orange-600 shrink-0" />
              <span>{language === 'bn' ? 'আজ অর্ডার দিলে আজকেই পাবেন ১ ঘণ্টার এক্সপ্রেস ফিট!' : 'Order today for same-day lightning express home delivery!'}</span>
            </div>
          </div>

          {/* Checkout action row */}
          <div className="pt-6 border-t border-orange-200/20 mt-4 flex gap-2">
            <button
              id={`btn-modal-add-cart-${product.id}`}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart size={16} />
              <span>{language === 'bn' ? 'খুচরা তালিকায় যোগ করুন' : 'Add to Shopping List'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-white/40 bg-white/30 hover:bg-white/60 rounded-xl text-orange-950 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
