import React from 'react';
import { Star, ShoppingCart, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  language: 'en' | 'bn';
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, language, onAddToCart, onQuickView }: ProductCardProps) {
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  const isLowStock = product.stockLeft <= 15;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white/40 backdrop-blur-lg border border-white/40 p-3 sm:p-4 rounded-[2rem] shadow-xs hover:shadow-lg hover:bg-white/60 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full bg-white/50 rounded-2xl overflow-hidden border border-white/25">
        <img
          src={product.image}
          alt={language === 'bn' ? product.nameBn : product.nameEn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="inline-flex items-center justify-center bg-red-600 text-white font-mono text-[9px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </span>
          {product.isFlashSale && (
            <span className="inline-flex items-center justify-center bg-orange-500 text-white font-black text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              {language === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash'}
            </span>
          )}
        </div>

        {/* Daily Fresh Tag */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="bg-emerald-600/90 text-white font-extrabold text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
            {language === 'bn' ? '১০০% তাজা' : '100% Fresh'}
          </span>
        </div>
      </div>

      {/* Product Content Wrapper */}
      <div className="flex flex-col flex-1 pt-3 text-center sm:text-left">
        {/* Title */}
        <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-orange-950 line-clamp-1 group-hover:text-orange-600 transition-colors duration-200">
          {language === 'bn' ? product.nameBn : product.nameEn}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
          <div className="flex items-center text-amber-500">
            <Star size={11} fill="currentColor" stroke="none" />
            <span className="font-black text-[9px] sm:text-xs text-orange-950 ml-0.5">
              {product.rating}
            </span>
          </div>
          <span className="text-[9px] sm:text-xs text-orange-900/60 font-medium">
            ({product.reviewCount})
          </span>
        </div>

        {/* Sells Progress Bar for Flash sale to match Daraz design */}
        {product.isFlashSale && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[9px] sm:text-[10px] text-orange-900/60 font-semibold">
              <span>{language === 'bn' ? 'স্টক বাকি আছে' : 'Available stock'}</span>
              <span className={`font-bold ${isLowStock ? 'text-red-500 font-black' : 'text-orange-950'}`}>
                {language === 'bn' ? `${product.stockLeft}টি` : `${product.stockLeft} left`}
              </span>
            </div>
            <div className="w-full bg-orange-100/40 h-1.5 rounded-full overflow-hidden border border-white/20">
              <div 
                className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-orange-500'}`} 
                style={{ width: `${(product.stockLeft / product.totalStock) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-[4px]" />

        {/* Pricing Layout */}
        <div className="mt-2.5 flex items-baseline justify-center sm:justify-start flex-wrap gap-1 sm:gap-1.5">
          <span className="text-sm sm:text-base md:text-lg font-black text-orange-600 font-mono">
            ৳{product.discountPrice}
          </span>
          <span className="text-[10px] sm:text-xs text-orange-900/40 line-through font-mono">
            ৳{product.originalPrice}
          </span>
          <span className="text-[9px] sm:text-[10px] text-orange-700/60 font-semibold">
            / {language === 'bn' ? product.unitBn : product.unitEn}
          </span>
        </div>

        {/* Action Button Strip */}
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          <button
            id={`btn-view-${product.id}`}
            onClick={() => onQuickView(product)}
            className="col-span-1 flex items-center justify-center p-2 rounded-xl border border-white/40 text-orange-600 bg-white/40 backdrop-blur-sm hover:border-orange-400 hover:text-orange-700 hover:bg-white/70 transition-all duration-200"
            title={language === 'bn' ? 'বিস্তারিত তথ্য' : 'Quick View details'}
          >
            <Info size={14} />
          </button>
          <button
            id={`btn-add-cart-${product.id}`}
            onClick={() => onAddToCart(product)}
            className="col-span-3 flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-xs"
          >
            <ShoppingCart size={12} />
            <span>{language === 'bn' ? 'কিনুন' : 'Buy Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
