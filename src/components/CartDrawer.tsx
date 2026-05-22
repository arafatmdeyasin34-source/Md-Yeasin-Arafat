import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, PhoneCall } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  language: 'en' | 'bn';
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  language
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalBill = cartItems.reduce(
    (sum, item) => sum + item.product.discountPrice * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Black Backdrop Overlay */}
      <div 
        id="cart-overlay"
        onClick={onClose} 
        className="absolute inset-0 bg-orange-950/20 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Drawer Body Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white/70 backdrop-blur-2xl border-l border-white/40 shadow-2xl flex flex-col h-full z-10 animate-slide-in">
        {/* Header section with close control */}
        <div className="p-5 border-b border-orange-200/20 flex items-center justify-between bg-white/40 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-orange-950">
            <ShoppingBag className="text-orange-600" size={20} />
            <span className="font-extrabold text-base sm:text-lg">
              {language === 'bn' ? 'শপিং কার্ট' : 'Your Shop Cart'}
            </span>
            <span className="bg-orange-600 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button 
            id="btn-close-cart"
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-white/60 text-orange-900/60 hover:text-orange-950 transition-colors border border-transparent hover:border-white/40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Item List Area */}
        <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-orange-200/20">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 select-none">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 text-orange-600 animate-pulse border border-orange-500/20">
                <ShoppingBag size={28} />
              </div>
              <p className="font-extrabold text-orange-950 text-base mb-1">
                {language === 'bn' ? 'আপনার কার্টটি চমৎকার খালি!' : 'Your cart is completely empty!'}
              </p>
              <p className="text-xs text-orange-900/60 max-w-[240px] font-medium">
                {language === 'bn' 
                  ? 'আমাদের তাজা ও পুষ্টিকর মূল ফলের তালিকা থেকে কার্টে যোগ করুন।' 
                  : 'Add fresh, nutritious local & imported fruits to begin shopping.'}
              </p>
              <button
                id="btn-add-some"
                onClick={onClose}
                className="mt-5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {language === 'bn' ? 'ফল দেখতে যান' : 'Browse Fruits'}
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product;
              return (
                <div key={product.id} className="py-4 flex gap-3 group">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-2xl bg-white/50 overflow-hidden relative border border-white/45 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={language === 'bn' ? product.nameBn : product.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Body details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-1">
                        <h4 className="font-extrabold text-orange-950 text-xs sm:text-sm line-clamp-1">
                          {language === 'bn' ? product.nameBn : product.nameEn}
                        </h4>
                        <button
                          id={`btn-remove-item-${product.id}`}
                          onClick={() => onRemoveItem(product.id)}
                          className="text-orange-900/40 hover:text-red-600 transition-colors p-0.5"
                          title={language === 'bn' ? 'মুছে ফেলুন' : 'Remove item'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-orange-900/60 font-semibold mt-0.5">
                        {language === 'bn' ? 'মূল্য/একক:' : 'Rate:'} ৳{product.discountPrice} / {language === 'bn' ? product.unitBn : product.unitEn}
                      </p>
                    </div>

                    {/* Quantity Selector controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/40 rounded-xl bg-white/40 overflow-hidden backdrop-blur-xs">
                        <button
                          id={`btn-minus-qty-${product.id}`}
                          onClick={() => onUpdateQuantity(product.id, item.quantity - 1)}
                          className="p-1 px-2.5 text-orange-950 hover:bg-white/60 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-1 text-xs font-black font-mono text-orange-950">
                          {item.quantity}
                        </span>
                        <button
                          id={`btn-plus-qty-${product.id}`}
                          onClick={() => onUpdateQuantity(product.id, item.quantity + 1)}
                          className="p-1 px-2.5 text-orange-950 hover:bg-white/60 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold font-mono text-xs sm:text-sm text-orange-650">
                          ৳{product.discountPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area with Grand Billing Total & Direct Order Buttons */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-orange-200/20 bg-white/40 backdrop-blur-xs">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-orange-900/60 text-xs font-semibold">
                <span>{language === 'bn' ? 'মোট ফলের দাম' : 'Subtotal'}</span>
                <span className="font-mono font-bold text-orange-950">৳{totalBill}</span>
              </div>
              <div className="flex justify-between text-orange-900/60 text-xs font-semibold">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Cost'}</span>
                <span className="text-emerald-700 font-extrabold text-[10px] sm:text-xs">
                  {language === 'bn' ? 'অর্ডার ফর্মে হিসাবভুক্ত হবে' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="border-t border-dashed border-orange-200/30 pt-2 flex justify-between text-orange-950">
                <span className="font-extrabold text-sm sm:text-base">
                  {language === 'bn' ? 'সর্বমোট বিল' : 'Estimated Bill'}
                </span>
                <span className="font-black font-mono text-base sm:text-lg text-orange-600">
                  ৳{totalBill}
                </span>
              </div>
            </div>

            {/* Direct action buttons split */}
            <div className="grid grid-cols-1 gap-2">
              <button
                id="btn-checkout-drawer"
                onClick={onCheckout}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold py-3 px-4 rounded-2xl shadow-md transition-all duration-300 cursor-pointer"
              >
                <span>{language === 'bn' ? 'ডেলিভারি তথ্য দিন' : 'Enter Delivery Details'}</span>
                <ArrowRight size={16} />
              </button>

              <a
                href="tel:01313667317"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-2.5 px-4 rounded-2xl shadow-xs text-xs transition-all"
                id="btn-direct-call-cart"
              >
                <PhoneCall size={14} />
                <span>০১৩১৩৬৬৭৩১৭ {language === 'bn' ? 'নম্বরে সরাসরি কল করুন' : 'Call Directly'}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
