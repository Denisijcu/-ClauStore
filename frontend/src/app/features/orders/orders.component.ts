import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/api.services';
import { Order } from '../../core/models/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:48px 0;min-height:60vh">
      <div class="container">
        <h1 class="page-title">Mis Pedidos<span class="dot">.</span></h1>
        @if (loading()) {
          <div style="text-align:center;padding:60px"><div class="spinner"></div></div>
        } @else {
          @for (order of orders(); track order.id) {
            <div class="order-card">
              <div class="order-header">
                <div>
                  <div class="order-num">{{ order.order_number }}</div>
                  <div class="order-date">{{ order.created_at | date:'dd/MM/yyyy' }}</div>
                </div>
                <span class="order-status" [class]="'status-' + order.status">{{ order.status }}</span>
                <div class="order-total">\${{ order.total_amount | number:'1.2-2' }}</div>
              </div>
              @if (order.status === 'awaiting_payment') {
                <div class="payment-prompt">
                  <p>⚡ Envía el pago por Zelle y sube tu comprobante</p>
                  <div class="form-row">
                    <input [(ngModel)]="zelleRef" placeholder="Referencia Zelle (opcional)" />
                    <input type="file" #fileInput accept="image/*" (change)="onFile($event, order.id)" style="display:none" />
                    <button (click)="fileInput.click()" class="upload-btn" [disabled]="uploading()">
                      {{ uploading() ? 'Subiendo...' : '📤 Subir comprobante' }}
                    </button>
                  </div>
                </div>
              }
              @if (order.payment_screenshot_url) {
                <div style="margin-top:10px">
                  <a [href]="order.payment_screenshot_url" target="_blank" style="font-size:13px;color:#7C4DFF">
                    👁 Ver comprobante subido
                  </a>
                </div>
              }
            </div>
          }
          @empty {
            <div style="text-align:center;padding:80px;color:#6b7280">
              <div style="font-size:64px;margin-bottom:16px">📦</div>
              <h3 style="font-size:20px;color:#1a1a2e;margin-bottom:8px">Sin pedidos aún</h3>
              <p>Tus pedidos aparecerán aquí</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .page-title { font-size: 32px; font-weight: 700; margin-bottom: 28px; }
    .dot { color: #FF6B9D; }
    .order-card { background: white; border-radius: 14px; border: 1px solid #e8eaed; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .order-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .order-num { font-size: 16px; font-weight: 700; }
    .order-date { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .order-status { font-size: 11px; padding: 3px 12px; border-radius: 20px; font-weight: 600; }
    .status-awaiting_payment { background: rgba(255,217,61,0.15); color: #d97706; }
    .status-payment_uploaded { background: rgba(124,77,255,0.1); color: #7C4DFF; }
    .status-payment_confirmed { background: rgba(16,185,129,0.1); color: #10b981; }
    .status-processing { background: rgba(59,130,246,0.1); color: #3b82f6; }
    .order-total { font-size: 18px; font-weight: 700; color: #FF6B9D; }
    .payment-prompt { background: #f8f9fc; border-radius: 10px; padding: 14px; margin-top: 14px; }
    .payment-prompt p { font-size: 13px; color: #374151; margin-bottom: 10px; }
    .form-row { display: flex; gap: 10px; }
    .form-row input { flex: 1; padding: 8px 12px; border: 1px solid #e8eaed; border-radius: 8px; font-size: 13px; outline: none; }
    .upload-btn { background: #7C4DFF; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; white-space: nowrap; }
    .upload-btn:disabled { opacity: 0.6; }
    .spinner { width: 40px; height: 40px; border: 3px solid #e8eaed; border-top-color: #FF6B9D; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class OrdersComponent implements OnInit {
  private orderSvc = inject(OrderService);
  orders = signal<Order[]>([]);
  loading = signal(true);
  uploading = signal(false);
  zelleRef = '';

  ngOnInit() {
    this.orderSvc.getMyOrders().subscribe({
      next: o => { this.orders.set(o); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onFile(event: Event, orderId: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    const fd = new FormData();
    fd.append('screenshot', file);
    if (this.zelleRef) fd.append('zelle_reference', this.zelleRef);
    this.orderSvc.uploadPayment(orderId, fd).subscribe({
      next: () => { this.uploading.set(false); this.ngOnInit(); },
      error: () => this.uploading.set(false)
    });
  }
}
