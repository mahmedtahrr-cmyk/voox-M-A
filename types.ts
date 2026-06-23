export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  gender: string | null;
  featured: boolean;
  category_id: string | null;
  created_at: string;
  // Included relations for client convenience
  category?: Category | null;
  product_images?: ProductImage[];
  product_sizes?: ProductSize[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
}

export interface ProductSize {
  id: string;
  product_id: string;
  size: string;
  quantity: number;
}

export interface ShippingAddress {
  id: string;
  user_id: string | null;
  full_name: string;
  phone: string;
  phone2: string | null;
  governorate: string;
  city: string;
  address: string;
  landmark: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  shipping_address_id: string | null;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  payment_method: string;
  subtotal: number;
  shipping_price: number;
  discount_amount?: number;
  promo_code?: string | null;
  total_price: number;
  notes: string | null;
  created_at: string;
  shipping_address?: ShippingAddress | null;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string | null;
  size: string;
  quantity: number;
  price: number;
  products?: Product;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_value: number;
  active: boolean;
  created_at: string;
}
