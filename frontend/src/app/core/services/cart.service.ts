import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product, GalleryDesign, CustomizationType } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_KEY = 'claustore_cart';
  items = signal<CartItem[]>(this.loadCart());

  totalItems = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));
  totalPrice = computed(() => this.items().reduce((sum, i) => sum + (i.product.price * i.quantity), 0));

  addToCart(
    product: Product,
    quantity: number = 1,
    options: {
      size?: string;
      color?: string;
      customization_type?: CustomizationType;
      custom_design_url?: string;
      gallery_design_id?: number;
      gallery_design?: GalleryDesign;
    } = {}
  ) {
    const current = this.items();
    const existingIdx = current.findIndex(
      i => i.product.id === product.id &&
           i.size === options.size &&
           i.color === options.color &&
           i.gallery_design_id === options.gallery_design_id
    );

    if (existingIdx >= 0) {
      const updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + quantity };
      this.items.set(updated);
    } else {
      this.items.set([...current, { product, quantity, ...options }]);
    }
    this.saveCart();
  }

  removeItem(index: number) {
    const updated = this.items().filter((_, i) => i !== index);
    this.items.set(updated);
    this.saveCart();
  }

  updateQuantity(index: number, quantity: number) {
    if (quantity <= 0) { this.removeItem(index); return; }
    const updated = [...this.items()];
    updated[index] = { ...updated[index], quantity };
    this.items.set(updated);
    this.saveCart();
  }

  clearCart() {
    this.items.set([]);
    localStorage.removeItem(this.CART_KEY);
  }

  private saveCart() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.items()));
  }

  private loadCart(): CartItem[] {
    const stored = localStorage.getItem(this.CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
