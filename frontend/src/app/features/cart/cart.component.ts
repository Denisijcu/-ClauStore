import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div style="padding:48px 0;min-height:60vh">
      <div class="container">
        <h1 class="page-title">Carrito<span class="dot">.</span></h1>
        @if (cart.items().length === 0) {
          <div style="text-align:center;padding:80px;color:#6b7280">
            <div style="font-size:64px;margin-bottom:16px">🛒</div>
            <h3 style="font-size:20px;color:#1a1a2e;margin-bottom:8px">Tu carrito está vacío</h3>
            <p style="margin-bottom:24px">Agrega productos para comenzar</p>
            <a routerLink="/products" class="btn-primary">Ver productos</a>
          </div>
        } @else {
          <div class="cart-layout">
            <div class="cart-items">
              @for (item of cart.items(); track $index; let i = $index) {
                <div class="cart-item card">
                  <div class="item-img">
                    @if (item.product.image_url) { <img [src]="item.product.image_url" [alt]="item.product.name" /> }
                    @else { <span>👕</span> }
                  </div>
                  <div class="item-info">
                    <h3>{{ item.product.name }}</h3>
                    <p>{{ item.product.category?.name }}</p>
                    @if (item.size) { <span class="tag">{{ item.size }}</span> }
                    @if (item.color) { <span class="tag">{{ item.color }}</span> }
                    @if (item.customization_type) { <span class="tag purple">🎨 {{ item.customization_type }}</span> }
                  </div>
                  <div class="item-qty">
                    <button (click)="cart.updateQuantity(i, item.quantity - 1)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="cart.updateQuantity(i, item.quantity + 1)">+</button>
                  </div>
                  <div class="item-price">\${{ (item.product.price * item.quantity) | number:'1.2-2' }}</div>
                  <button class="remove-btn" (click)="cart.removeItem(i)"><i class="ti ti-trash"></i></button>
                </div>
              }
            </div>
            <div class="cart-summary card">
              <h3 style="font-size:18px;font-weight:700;margin-bottom:20px">Resumen</h3>
              <div class="summary-row"><span>Subtotal ({{ cart.totalItems() }} items)</span><span>\${{ cart.totalPrice() | number:'1.2-2' }}</span></div>
              <div class="summary-row"><span>Envío</span><span style="color:#10b981">A coordinar</span></div>
              <div class="summary-total"><span>Total</span><span>\${{ cart.totalPrice() | number:'1.2-2' }}</span></div>
              @if (auth.isLoggedIn()) {
                <a routerLink="/checkout" class="checkout-btn">Proceder al pago <i class="ti ti-arrow-right"></i></a>
              } @else {
                <a routerLink="/auth/login" class="checkout-btn">Iniciar sesión para pagar</a>
              }
              <a routerLink="/products" style="display:block;text-align:center;font-size:13px;color:#6b7280;margin-top:12px">← Seguir comprando</a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container{max-width:1200px;margin:0 auto;padding:0 24px}
    .page-title{font-size:32px;font-weight:700;margin-bottom:28px}.dot{color:#FF6B9D}
    .cart-layout{display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start}
    .cart-items{display:flex;flex-direction:column;gap:14px}
    .cart-item{display:flex;align-items:center;gap:16px;padding:16px}
    .item-img{width:80px;height:80px;border-radius:10px;overflow:hidden;background:#f8f8f8;display:flex;align-items:center;justify-content:center;flex-shrink:0;span{font-size:36px}img{width:100%;height:100%;object-fit:cover}}
    .item-info{flex:1;h3{font-size:15px;font-weight:600;margin-bottom:4px}p{font-size:12px;color:#6b7280;margin-bottom:8px}}
    .tag{background:#f3f4f6;border-radius:6px;padding:2px 8px;font-size:11px;margin-right:4px}.tag.purple{background:rgba(124,77,255,0.1);color:#7C4DFF}
    .item-qty{display:flex;align-items:center;gap:10px;button{width:28px;height:28px;border:1px solid #e8eaed;border-radius:6px;background:white;cursor:pointer;font-size:16px}&span{font-size:14px;font-weight:500;min-width:20px;text-align:center}}
    .item-price{font-size:16px;font-weight:700;color:#FF6B9D;min-width:70px;text-align:right}
    .remove-btn{background:none;border:none;color:#9ca3af;cursor:pointer;font-size:16px;padding:4px;&:hover{color:#FF6B9D}}
    .cart-summary{padding:24px}
    .summary-row{display:flex;justify-content:space-between;font-size:14px;color:#6b7280;margin-bottom:12px}
    .summary-total{display:flex;justify-content:space-between;font-size:18px;font-weight:700;border-top:1px solid #e8eaed;padding-top:16px;margin:16px 0}
    .checkout-btn{display:block;background:#FF6B9D;color:white;text-align:center;padding:14px;border-radius:12px;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px}
    .btn-primary{background:#FF6B9D;color:white;border:none;border-radius:25px;padding:12px 28px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
    .card{background:white;border-radius:14px;border:1px solid #e8eaed;box-shadow:0 2px 12px rgba(0,0,0,0.06);overflow:hidden}
  `]
})
export class CartComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
}
