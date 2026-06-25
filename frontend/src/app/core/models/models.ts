// ─── AUTH ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// ─── CATEGORY ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
}

// ─── PRODUCT ──────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  category?: Category;
  image_url?: string;
  allows_customization: boolean;
  is_active: boolean;
  is_featured: boolean;
  sizes: string;
  colors: string;
  created_at: string;
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
export interface GalleryDesign {
  id: number;
  name: string;
  description?: string;
  image_url: string;
  category_id?: number;
  is_active: boolean;
  sort_order: number;
}

// ─── CART ─────────────────────────────────────────────────────────────────────
export type CustomizationType = 'gallery' | 'upload' | 'ai_generated';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  customization_type?: CustomizationType;
  custom_design_url?: string;
  gallery_design_id?: number;
  gallery_design?: GalleryDesign;
}

// ─── ORDER ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending' | 'awaiting_payment' | 'payment_uploaded'
  | 'payment_confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  size?: string;
  color?: string;
  customization_type?: CustomizationType;
  custom_design_url?: string;
  gallery_design_id?: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  notes?: string;
  zelle_reference?: string;
  payment_screenshot_url?: string;
  created_at: string;
}

export interface CreateOrderRequest {
  items: {
    product_id: number;
    quantity: number;
    size?: string;
    color?: string;
    customization_type?: CustomizationType;
    custom_design_url?: string;
    gallery_design_id?: number;
  }[];
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  notes?: string;
}

// ─── AI PROMPT ────────────────────────────────────────────────────────────────
export interface PromptRequest {
  idea: string;
  style?: string;
  product_type?: string;
}

export interface PromptResponse {
  prompt_en: string;
  prompt_es: string;
  suggestion: string;
}

// ─── ZELLE ────────────────────────────────────────────────────────────────────
export interface ZelleInfo {
  name: string;
  email: string;
  phone: string;
}
