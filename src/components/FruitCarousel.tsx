import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '../types';

interface FruitCarouselProps {
  products: Product[];
  language: 'en' | 'bn';
  onQuickBuy: (product: Product) => void;
}

export default function FruitCarousel({ products, language, onQuickBuy }: FruitCarouselProps) {
  const carouselProducts = products.filter(p => p.isFlashSale).slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselProducts.length);
    }, 3500); // changes every 3.5 seconds

    return () => clearInterval(timer);
  }, [carouselProducts.length, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % carouselProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + carouselProducts.length) % carouselProducts.length);
  };

  if (carouselProducts.length === 0) return null;

  return (
    <div 
      className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-[2.5rem] bg-orange-950 group shadow-2xl border border-white/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="hero-header-carousel"
    >
      {/* Background Gradient & Slides */}
      {carouselProducts.map((product, idx) => {
        const discountPercent = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);
        const isActive = idx === currentIndex;

        return (
          <div
            key={product.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Visual background image with high-contrast overlay */}
            <img
              src={product.image}
              alt={product.nameEn}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms] ease-out"
              style={{ transform: isActive ? 'scale(1)' : 'scale(1.05)' }}
            />
            {/* Peachy glassmorphism gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-950/85 via-orange-950/40 to-transparent z-11" />

            {/* Content Container */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-xl md:max-w-2xl z-20 text-white select-none">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-white text-orange-600 font-mono text-xs font-black px-3 py-1 rounded-full shadow-sm animate-bounce">
                  <Percent size={12} />
                  {language === 'bn' ? `${discountPercent}% ছাড়!` : `${discountPercent}% OFF LIVE!`}
                </span>
                <span className="inline-block bg-white/20 backdrop-blur-md text-white font-sans text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  {language === 'bn' ? 'আজকের সেরা অফার' : 'FLASH DEAL'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-4">
                {language === 'bn' ? product.nameBn : product.nameEn}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-orange-100/80 mb-4 line-clamp-2 md:line-clamp-3">
                {language === 'bn' ? product.descriptionBn : product.descriptionEn}
              </p>

              {/* Price Tag Box */}
              <div className="flex items-baseline gap-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                  ৳{product.discountPrice}
                </span>
                <span className="text-sm sm:text-lg text-white/50 line-through font-mono">
                  ৳{product.originalPrice}
                </span>
                <span className="text-xs sm:text-sm text-orange-200">
                  / {language === 'bn' ? product.unitBn : product.unitEn}
                </span>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  id={`carousel-buy-now-${product.id}`}
                  onClick={() => onQuickBuy(product)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  {language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Buttons */}
      <button
        id="carousel-btn-prev"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md border border-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous slider"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        id="carousel-btn-next"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md border border-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next slider"
      >
        <ChevronRight size={20} />
      </button>

      {/* Progress Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {carouselProducts.map((_, idx) => (
          <button
            key={idx}
            id={`carousel-dot-${idx}`}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-orange-500 w-6' : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
