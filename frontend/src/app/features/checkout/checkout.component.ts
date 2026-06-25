// checkout.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/api.services';

export { CheckoutComponent };

@Component({ selector: 'app-checkout', standalone: true, imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div style="padding:48px 0;min-height:60vh"><div class="container">
      <h1 class="page-title">Checkout<span class="dot">.</span></h1>
      <div class="checkout-layout">
        <div class="checkout-form card">
          <h3 style="font-size:18px;font-weight:700;margin-bottom:20px">Datos de envío</h3>
          <div class="form-group"><label>Nombre completo</label><input [(ngModel)]="name" placeholder="Tu nombre completo" /></div>
          <div class="form-group"><label>Dirección</label><textarea [(ngModel)]="address" placeholder="Tu dirección completa" rows="3"></textarea></div>
          <div class="form-group"><label>Teléfono</label><input [(ngModel)]="phone" placeholder="+1 305 XXX XXXX" /></div>
          <div class="form-group"><label>Notas (opcional)</label><input [(ngModel)]="notes" placeholder="Instrucciones especiales..." /></div>
        </div>
        <div class="order-summary card">
          <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">Tu pedido</h3>
          @for (item of cart.items(); track $index) {
            <div class="order-item"><span>{{ item.product.name }} x{{ item.quantity }}</span><span>\${{ (item.product.price * item.quantity) | number:'1.2-2' }}</span></div>
          }
          <div class="order-total"><span>Total</span><span>\${{ cart.totalPrice() | number:'1.2-2' }}</span></div>
          <div class="zelle-info">
            <div class="zelle-info-title">💜 Pago por Zelle</div>
            <p style="font-size:13px;color:#6b7280;margin-bottom:8px">Después de confirmar, te daremos los datos de Zelle para pagar.</p>
          </div>
          @if (error()) { <div class="error-msg">{{ error() }}</div> }
          <button class="confirm-btn" (click)="placeOrder()" [disabled]="loading()">
            @if (loading()) { Procesando... } @else { Confirmar pedido }
          </button>
        </div>
      </div>
    </div></div>
  `,
  styles: [`.container{max-width:1200px;margin:0 auto;padding:0 24px}.page-title{font-size:32px;font-weight:700;margin-bottom:28px}.dot{color:#FF6B9D}.checkout-layout{display:grid;grid-template-columns:1fr 360px;gap:24px;align-items:start}.card{background:white;border-radius:14px;border:1px solid #e8eaed;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06)}.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;label{font-size:13px;font-weight:500}input,textarea{padding:10px 14px;border:1px solid #e8eaed;border-radius:10px;font-size:14px;outline:none;&:focus{border-color:#FF6B9D}}textarea{resize:vertical}}.order-item{display:flex;justify-content:space-between;font-size:14px;color:#6b7280;margin-bottom:10px}.order-total{display:flex;justify-content:space-between;font-size:18px;font-weight:700;border-top:1px solid #e8eaed;padding-top:14px;margin:14px 0}.zelle-info{background:rgba(108,28,209,0.05);border:1px solid rgba(108,28,209,0.15);border-radius:10px;padding:14px;margin-bottom:16px}.zelle-info-title{font-size:14px;font-weight:600;margin-bottom:6px}.error-msg{background:rgba(255,107,157,0.1);color:#FF6B9D;border-radius:8px;padding:10px;font-size:13px;margin-bottom:12px}.confirm-btn{width:100%;background:#FF6B9D;color:white;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;&:disabled{opacity:0.6}}`]
})
class CheckoutComponent {
  private orderSvc = inject(OrderService);
  private router = inject(Router);
  cart = inject(CartService);
  name = ''; address = ''; phone = ''; notes = '';
  loading = signal(false); error = signal('');

  placeOrder() {
    if (!this.name || !this.address || !this.phone) { this.error.set('Completa todos los campos requeridos'); return; }
    this.loading.set(true);
    const orderData = {
      items: this.cart.items().map(i => ({ product_id: i.product.id, quantity: i.quantity, size: i.size, color: i.color, customization_type: i.customization_type, gallery_design_id: i.gallery_design_id })),
      shipping_name: this.name, shipping_address: this.address, shipping_phone: this.phone, notes: this.notes
    };
    this.orderSvc.create(orderData as any).subscribe({
      next: order => { this.cart.clearCart(); this.router.navigate(['/orders']); },
      error: e => { this.error.set(e.error?.detail || 'Error al procesar pedido'); this.loading.set(false); }
    });
  }
}
