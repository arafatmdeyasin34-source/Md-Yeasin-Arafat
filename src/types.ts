export type Category = 'all' | 'local' | 'imported' | 'citrus' | 'berries';

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  category: Category;
  image: string;
  originalPrice: number; // in BDT
  discountPrice: number; // in BDT
  unitEn: string; // e.g. "kg", "dozen", "piece"
  unitBn: string; // e.g. "কেজি", "ডজন", "পিস"
  rating: number; // 1-5
  reviewCount: number;
  stockLeft: number;
  totalStock: number;
  isFlashSale: boolean;
  descriptionEn: string;
  descriptionBn: string;
  benefitsEn: string[];
  benefitsBn: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  notes?: string;
}
