import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, MapPin, Truck, ChevronRight, MessageSquare, ClipboardCheck, Phone } from 'lucide-react';
import { CartItem, OrderDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
  language: 'en' | 'bn';
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  language
}: CheckoutModalProps) {
  const [formData, setFormData] = useState<OrderDetails>({
    name: '',
    phone: '',
    address: '',
    city: 'Palashbari',
    deliveryMethod: 'standard',
    paymentMethod: 'cod',
    notes: ''
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<{
    orderId: string;
    items: CartItem[];
    customer: OrderDetails;
    totalBill: number;
    shippingPrice: number;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  const shippingPrice = formData.deliveryMethod === 'express' ? 80 : 40;
  const grandTotal = subtotal + shippingPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateOrderId = () => {
    return 'PFS-' + Math.floor(100000 + Math.random() * 900000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert(language === 'bn' ? 'দয়া করে সবগুলো জরুরি ঘর পূরণ করুন।' : 'Please fill all mandatory fields.');
      return;
    }

    const orderId = generateOrderId();
    setPlacedOrderInfo({
      orderId,
      items: [...cartItems],
      customer: { ...formData },
      totalBill: grandTotal,
      shippingPrice
    });

    setOrderSubmitted(true);
  };

  const getWhatsAppMessageLink = () => {
    if (!placedOrderInfo) return '#';
    
    const { orderId, items, customer, totalBill, shippingPrice } = placedOrderInfo;

    const shopNo = '8801313667317'; // Palashbari Fruit Shop official WhatsApp

    // Create readable text lines
    const lineBreak = '\n';
    let text = `🍓 *পলাশবাড়ী ফ্রুট শপ - নতুন অর্ডার (${orderId})* 🍓${lineBreak}${lineBreak}`;
    text += `*গ্রাহকের তথ্য:*${lineBreak}`;
    text += `👤 নাম: ${customer.name}${lineBreak}`;
    text += `📞 মোবাইল: ${customer.phone}${lineBreak}`;
    text += `📍 ঠিকানা: ${customer.address}, ${customer.city}${lineBreak}`;
    text += `🚚 ডেলিভারি: ${customer.deliveryMethod === 'express' ? 'এক্সপ্রেস ডেলিভারি (৮০ টাকা)' : 'স্ট্যান্ডার্ড ডেলিভারি (৪০ টাকা)'}${lineBreak}`;
    text += `💳 পেমেন্ট: ${customer.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : customer.paymentMethod === 'bkash' ? 'বিকাশ (bKash)' : 'নগদ (Nagad)'}${lineBreak}`;
    if (customer.notes) text += `📝 নোট: ${customer.notes}${lineBreak}`;
    
    text += `${lineBreak}*অর্ডারকৃত ফলের তালিকা:*${lineBreak}`;
    items.forEach((item, index) => {
      text += `${index + 1}. *${item.product.nameBn}* - ${item.quantity} x ৳${item.product.discountPrice} = *৳${item.product.discountPrice * item.quantity}*${lineBreak}`;
    });

    text += `${lineBreak}--------------------------${lineBreak}`;
    text += `💵 ফলের উপ-মোট: ৳${subtotal}${lineBreak}`;
    text += `🚚 ডেলিভারি ফি: ৳${shippingPrice}${lineBreak}`;
    text += `💰 *সর্বমোট বিল: ৳${totalBill}*${lineBreak}${lineBreak}`;
    text += `ধন্যবাদ, অনুগ্রহ করে মোবাইল ফোনে কথা বলে অর্ডারটি দ্রুত কনফার্ম করুন! 🙏🏼`;

    return `https://wa.me/${shopNo}?text=${encodeURIComponent(text)}`;
  };

  const handleFinish = () => {
    onOrderSuccess();
    onClose();
    setOrderSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: 'Palashbari',
      deliveryMethod: 'standard',
      paymentMethod: 'cod',
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Absolute overlay background */}
      <div 
        id="checkout-overlay"
        onClick={orderSubmitted ? undefined : onClose} 
        className="fixed inset-0 bg-orange-950/20 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Card wrapper */}
      <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden z-10 p-0 transform transition-transform animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-orange-200/20 flex items-center justify-between bg-white/40">
          <h3 className="font-extrabold text-orange-950 text-base sm:text-lg flex items-center gap-2">
            <Smartphone className="text-orange-600" size={18} />
            {orderSubmitted ? (
              <span className="text-emerald-700">{language === 'bn' ? 'অর্ডার সফল হয়েছে!' : 'Order Placed!'}</span>
            ) : (
              <span>{language === 'bn' ? 'ডেলিভারি তথ্য ও অর্ডার ফর্ম' : 'Delivery & Checkout'}</span>
            )}
          </h3>
          {!orderSubmitted && (
            <button 
              id="btn-close-checkout"
              onClick={onClose} 
              className="p-1.5 rounded-xl hover:bg-white/60 text-orange-900/65 hover:text-orange-950 transition-colors border border-transparent hover:border-white/40"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Dynamic Body Content */}
        {!orderSubmitted ? (
          <form id="checkout-form" onSubmit={handleSubmitOrder}>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Recipient details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-orange-900/60 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  {language === 'bn' ? 'গ্রাহকের তথ্য' : 'Recipient Details'}
                </h4>

                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">
                    {language === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={language === 'bn' ? 'যেমন: এমডি শাকিল হাসান' : 'e.g. Shakil Hasan'}
                    className="w-full text-xs sm:text-sm px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white/80 transition-all text-orange-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-orange-950 mb-1">
                      {language === 'bn' ? 'মোবাইল নাম্বার *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 01313667317"
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white/80 transition-all font-mono font-bold text-orange-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-orange-950 mb-1">
                      {language === 'bn' ? 'শহর / এলাকা' : 'Your City / Town'}
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-xs sm:text-sm px-3.5 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white/80 transition-all text-orange-950 font-bold"
                    >
                      <option value="Palashbari">পলাশবাড়ী (Palashbari)</option>
                      <option value="Gaibandha">গাইবান্ধা (Gaibandha)</option>
                      <option value="Rangpur">রংপুর (Rangpur)</option>
                      <option value="Gobindaganj">গোবিন্দগঞ্জ (Gobindaganj)</option>
                      <option value="Dhaka">ঢাকা (Dhaka - Courier)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-orange-950 mb-1">
                    {language === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা *' : 'Full Delivery Address *'}
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={language === 'bn' ? 'বাসা/ইউনিয়ন, রোড নম্বর, পলাশবাড়ী এলাকা...' : 'Village/Union, Road, Area detail...'}
                    className="w-full text-xs sm:text-sm px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white/80 transition-all text-orange-950"
                  />
                </div>
              </div>

              {/* Delivery method Selection */}
              <div className="space-y-2 pt-2 border-t border-orange-200/20">
                <h4 className="text-[10px] font-black text-orange-900/60 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  {language === 'bn' ? 'ডেলিভারি পদ্ধতি' : 'Delivery Speed'}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    formData.deliveryMethod === 'standard' 
                    ? 'border-orange-500 bg-orange-500/15 text-orange-950 font-extrabold shadow-xs' 
                    : 'border-white/40 bg-white/30 hover:bg-white/60 text-orange-900'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard"
                      checked={formData.deliveryMethod === 'standard'}
                      onChange={handleInputChange}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-bold">{language === 'bn' ? 'স্ট্যান্ডার্ড' : 'Standard Delivery'}</div>
                      <div className="text-[10px] text-orange-900/60 font-black font-mono">৳৪০ - (১ দিন)</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    formData.deliveryMethod === 'express' 
                    ? 'border-orange-500 bg-orange-500/15 text-orange-950 font-extrabold shadow-xs' 
                    : 'border-white/40 bg-white/30 hover:bg-white/60 text-orange-900'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="express"
                      checked={formData.deliveryMethod === 'express'}
                      onChange={handleInputChange}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-bold">{language === 'bn' ? 'এক্সপ্রেস' : 'Express Delivery'}</div>
                      <div className="text-[10px] text-orange-900/60 font-black font-mono">৳৮০ - (৩ ঘণ্টা)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment selection */}
              <div className="space-y-2 pt-2 border-t border-orange-200/20">
                <h4 className="text-[10px] font-black text-orange-900/60 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  {language === 'bn' ? 'পেমেন্ট এর ধরন' : 'Payment Method'}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border cursor-pointer text-center select-none transition-all ${
                    formData.paymentMethod === 'cod' 
                    ? 'border-orange-500 bg-orange-500/15 text-orange-950 font-black shadow-xs' 
                    : 'border-white/40 bg-white/30 hover:bg-white/60 text-orange-900'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-[10px] sm:text-xs leading-tight">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Hand Cash'}</div>
                  </label>

                  <label className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border cursor-pointer text-center select-none transition-all ${
                    formData.paymentMethod === 'bkash' 
                    ? 'border-pink-500 bg-pink-500/15 text-pink-900 font-black shadow-xs' 
                    : 'border-white/40 bg-white/30 hover:bg-white/60 text-orange-900'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={formData.paymentMethod === 'bkash'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-[10px] sm:text-xs leading-tight">{language === 'bn' ? 'বিকাশ (bKash)' : 'bKash Pay'}</div>
                  </label>

                  <label className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border cursor-pointer text-center select-none transition-all ${
                    formData.paymentMethod === 'nagad' 
                    ? 'border-orange-500 bg-orange-500/20 text-orange-950 font-black shadow-xs' 
                    : 'border-white/40 bg-white/30 hover:bg-white/60 text-orange-900'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={formData.paymentMethod === 'nagad'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-[10px] sm:text-xs leading-tight">{language === 'bn' ? 'নগদ (Nagad)' : 'Nagad Pay'}</div>
                  </label>
                </div>
              </div>

              {/* Special Instructions (Optional) */}
              <div>
                <label className="block text-xs font-bold text-orange-950 mb-1">
                  {language === 'bn' ? 'বিশেষ কোনো নির্দেশ থাকলে লিখুন (ঐচ্ছিক)' : 'Special delivery instructions (Optional)'}
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={language === 'bn' ? 'যেমন: গেটে এসে কল দিবেন, আমগুলো বেশি পাকা দিবেন না ইত্যাদি' : 'e.g. please choose sweet and fresh ones'}
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:border-orange-500 text-orange-950"
                />
              </div>

              {/* Billing Area summary */}
              <div className="bg-white/50 rounded-2xl p-4 border border-white/45 space-y-1.5 text-xs">
                <div className="flex justify-between text-orange-900/60 font-semibold">
                  <span>{language === 'bn' ? 'ফলের সাব-টোটাল:' : 'Fruits cost:'}</span>
                  <span className="font-mono font-bold text-orange-950">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-orange-900/60 font-semibold">
                  <span>{language === 'bn' ? 'ডেলিভারি ফি:' : 'Delivery fee:'}</span>
                  <span className="font-mono font-bold text-orange-950">৳{shippingPrice}</span>
                </div>
                <div className="border-t border-dashed border-orange-200/30 pt-1.5 flex justify-between font-extrabold text-orange-950">
                  <span className="text-sm">{language === 'bn' ? 'মোট দেয় বিল:' : 'Grand overall total:'}</span>
                  <span className="font-mono text-orange-600 text-sm sm:text-base font-black">৳{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Form Actions Footer Panel */}
            <div className="p-5 bg-white/40 border-t border-orange-200/20 flex justify-between gap-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-white/40 bg-white/30 rounded-xl font-bold text-orange-950 hover:bg-white/60 text-xs sm:text-sm transition-all cursor-pointer"
              >
                {language === 'bn' ? 'ফিরে যান' : 'Back'}
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'bn' ? 'অর্ডার সমাপ্ত করুন' : 'Confirm & Place Order'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </form>
        ) : (
          /* Order Submitted Banner Panel representing Daraz Experience */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center mx-auto animate-bounce border border-emerald-500/20">
              <CheckCircle size={38} />
            </div>

            <div className="space-y-1 select-none">
              <h4 className="text-xl font-black text-orange-950">
                {language === 'bn' ? 'অর্ডারটি সার্থকভাবে তৈরি হয়েছে!' : 'Order Processed Successfully!'}
              </h4>
              <p className="text-xs text-orange-900/60 font-bold">
                {language === 'bn' 
                  ? `আপনার অর্ডার নাম্বার: #${placedOrderInfo?.orderId}` 
                  : `Assigned Order ID: #${placedOrderInfo?.orderId}`}
              </p>
            </div>

            {/* Direct business phone message */}
            <div className="p-4 bg-white/50 border border-white/40 rounded-3xl text-left text-xs space-y-2">
              <h5 className="font-extrabold text-orange-950 flex items-center gap-1">
                <Truck size={14} className="text-orange-600 animate-pulse" />
                {language === 'bn' ? 'কিভাবে দ্রুত ডেলিভারি পাবেন?' : 'How to receive it instantly?'}
              </h5>
              <p className="text-orange-950/80 leading-relaxed font-medium">
                {language === 'bn' 
                  ? 'আমরা অর্ডারটি প্রসেস করছি। পলাশবাড়ী ফ্রুট শপ এ দ্রুততম ডেলিভারি নিশ্চিত করতে নিচের ' 
                  : 'We are processing your selection. Settle confirmation instantly by clicking '}
                <strong className="text-emerald-700 font-extrabold">"{language === 'bn' ? 'ওয়াটসঅ্যাপের মাধ্যমে অর্ডার পাঠান' : 'Send via WhatsApp'}"</strong> 
                {language === 'bn' 
                  ? ' বাটনে চাপ দিয়ে মালিকের ফোনে অর্ডার ডিটেইলস পাঠিয়ে দিন অথবা নিচে দেওয়া নাম্বারে সরাসরি কল করুন!' 
                  : ' to alert the shop owner or call directly below.'}
              </p>
            </div>

            {/* Large dynamic WhatsApp order redirect block & Direct calls */}
            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={getWhatsAppMessageLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold py-3 px-4 rounded-xl shadow-lg transition-all"
                id="btn-whatsapp-redirect"
              >
                <MessageSquare size={18} fill="currentColor" className="stroke-none" />
                <span>{language === 'bn' ? 'ওয়াটসঅ্যাপের মাধ্যমে অর্ডার পাঠান' : 'Send via WhatsApp'}</span>
              </a>

              <a
                href="tel:01313667317"
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-black py-2.5 px-4 rounded-xl text-xs transition-all"
                id="btn-call-to-finish"
              >
                <Phone size={14} />
                <span>০১৩১৩৬৬৭৩১৭ {language === 'bn' ? 'নম্বরে সরাসরি কল করুন' : 'Call 01313667317'}</span>
              </a>

              <button
                type="button"
                id="btn-checkout-finish"
                onClick={handleFinish}
                className="mt-3 text-xs font-bold text-orange-900/60 hover:text-orange-950 underline transition-all cursor-pointer"
              >
                {language === 'bn' ? 'ওয়েবসাইট এ ফিরে যান' : 'Go back to Homepage'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
