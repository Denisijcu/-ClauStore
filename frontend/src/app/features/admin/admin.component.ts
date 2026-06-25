import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, ProductService, CategoryService, GalleryService } from '../../core/services/api.services';
import { Order, Product, Category } from '../../core/models/models';

// ─── ADMIN SHELL ──────────────────────────────────────────────────────────────
@Component({ selector: 'app-admin', standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-logo">ClauStore Admin</div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active"><i class="ti ti-dashboard"></i> Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active"><i class="ti ti-shirt"></i> Productos</a>
          <a routerLink="/admin/categories" routerLinkActive="active"><i class="ti ti-category"></i> Categorías</a>
          <a routerLink="/admin/gallery" routerLinkActive="active"><i class="ti ti-photo"></i> Galería</a>
          <a routerLink="/admin/orders" routerLinkActive="active"><i class="ti ti-shopping-bag"></i> Pedidos</a>
          <a routerLink="/" class="home-link"><i class="ti ti-home"></i> Ver tienda</a>
        </nav>
      </aside>
      <main class="admin-main"><router-outlet /></main>
    </div>
  `,
  styles: [`:host{display:block}.admin-layout{display:grid;grid-template-columns:220px 1fr;min-height:100vh}.admin-sidebar{background:#1a1a2e;padding:24px 16px}.sidebar-logo{font-size:16px;font-weight:700;color:#FF6B9D;margin-bottom:28px;padding:0 8px}.sidebar-nav{display:flex;flex-direction:column;gap:4px;a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:14px;color:rgba(255,255,255,0.6);transition:all 0.2s;&:hover,&.active{background:rgba(255,107,157,0.15);color:#FF6B9D}}.home-link{margin-top:auto;color:rgba(255,255,255,0.4)!important}}.admin-main{background:#f8f9fc;padding:32px;overflow:auto}`]
})
export class AdminComponent {}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
@Component({ selector: 'app-dashboard', standalone: true, imports: [CommonModule],
  template: `
    <h2 style="font-size:24px;font-weight:700;margin-bottom:24px">Dashboard</h2>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:rgba(255,107,157,0.1);color:#FF6B9D">📦</div><div class="stat-val">{{ orders().length }}</div><div class="stat-label">Pedidos totales</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(255,217,61,0.1);color:#d97706">⏳</div><div class="stat-val">{{ pendingOrders() }}</div><div class="stat-label">Pendientes de pago</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,0.1);color:#10b981">✅</div><div class="stat-val">{{ confirmedOrders() }}</div><div class="stat-label">Confirmados</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(124,77,255,0.1);color:#7C4DFF">💰</div><div class="stat-val">\${{ totalRevenue() | number:'1.2-2' }}</div><div class="stat-label">Revenue total</div></div>
    </div>
    <div class="recent-orders" style="margin-top:28px">
      <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">Pedidos recientes</h3>
      @for (order of orders().slice(0,5); track order.id) {
        <div class="order-row"><span class="on">{{ order.order_number }}</span><span class="os status-{{order.status}}">{{ order.status }}</span><span style="font-weight:600;color:#FF6B9D">\${{ order.total_amount | number:'1.2-2' }}</span></div>
      }
    </div>
  `,
  styles: [`.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.stat-card{background:white;border-radius:14px;border:1px solid #e8eaed;padding:20px;display:flex;flex-direction:column;gap:8px}.stat-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px}.stat-val{font-size:28px;font-weight:700}.stat-label{font-size:13px;color:#6b7280}.order-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:white;border-radius:10px;margin-bottom:8px;border:1px solid #e8eaed}.on{font-weight:600;font-size:14px}.os{font-size:12px;padding:3px 10px;border-radius:12px}.status-awaiting_payment{background:rgba(255,217,61,0.15);color:#d97706}.status-payment_confirmed{background:rgba(16,185,129,0.1);color:#10b981}.status-payment_uploaded{background:rgba(124,77,255,0.1);color:#7C4DFF}`]
})
export class DashboardComponent implements OnInit {
  private orderSvc = inject(OrderService);
  orders = signal<Order[]>([]);
  pendingOrders = signal(0); confirmedOrders = signal(0); totalRevenue = signal(0);
  ngOnInit() { this.orderSvc.getAllOrders().subscribe(o => { this.orders.set(o); this.pendingOrders.set(o.filter(x => x.status === 'awaiting_payment').length); this.confirmedOrders.set(o.filter(x => x.status === 'payment_confirmed').length); this.totalRevenue.set(o.reduce((s,x) => s + x.total_amount, 0)); }); }
}

// ─── ADMIN ORDERS ─────────────────────────────────────────────────────────────
@Component({ selector: 'app-admin-orders', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <h2 style="font-size:24px;font-weight:700;margin-bottom:24px">Pedidos</h2>
    <div class="filter-row">
      <select [(ngModel)]="statusFilter" (ngModelChange)="loadOrders()">
        <option value="">Todos</option>
        <option value="payment_uploaded">Comprobante subido</option>
        <option value="awaiting_payment">Esperando pago</option>
        <option value="payment_confirmed">Confirmados</option>
        <option value="processing">En proceso</option>
        <option value="shipped">Enviados</option>
      </select>
    </div>
    @for (order of orders(); track order.id) {
      <div class="order-card">
        <div class="oh"><div><b>{{ order.order_number }}</b><span class="date">{{ order.created_at | date:'dd/MM/yyyy HH:mm' }}</span></div><span class="os status-{{order.status}}">{{ order.status }}</span><span style="font-weight:700;color:#FF6B9D">\${{ order.total_amount | number:'1.2-2' }}</span></div>
        <div class="od"><span>{{ order.shipping_name }}</span><span>{{ order.shipping_phone }}</span></div>
        @if (order.payment_screenshot_url) {
          <div class="proof-row"><a [href]="order.payment_screenshot_url" target="_blank" class="view-proof">👁 Ver comprobante</a>
          @if (order.status === 'payment_uploaded') { <button class="confirm-btn" (click)="confirmPayment(order.id)">✅ Confirmar pago</button> }
          </div>
        }
        <div class="status-actions">
          <select [(ngModel)]="order.status" (ngModelChange)="updateStatus(order.id, $event)">
            <option value="awaiting_payment">Esperando pago</option>
            <option value="payment_uploaded">Comprobante subido</option>
            <option value="payment_confirmed">Pago confirmado</option>
            <option value="processing">En proceso</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
          </select>
        </div>
      </div>
    }
  `,
  styles: [`.filter-row{margin-bottom:16px;select{padding:8px 12px;border:1px solid #e8eaed;border-radius:8px;font-size:13px;outline:none}}.order-card{background:white;border-radius:12px;border:1px solid #e8eaed;padding:16px;margin-bottom:12px}.oh{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px;b{font-size:15px;display:block}}.date{font-size:12px;color:#6b7280;margin-top:2px}.od{display:flex;gap:20px;font-size:13px;color:#6b7280;margin-bottom:10px}.os{font-size:11px;padding:3px 10px;border-radius:12px;white-space:nowrap}.status-awaiting_payment{background:rgba(255,217,61,0.15);color:#d97706}.status-payment_confirmed{background:rgba(16,185,129,0.1);color:#10b981}.status-payment_uploaded{background:rgba(124,77,255,0.1);color:#7C4DFF}.status-processing{background:rgba(59,130,246,0.1);color:#3b82f6}.proof-row{display:flex;gap:10px;align-items:center;margin-bottom:10px}.view-proof{font-size:13px;color:#7C4DFF;padding:6px 12px;background:rgba(124,77,255,0.08);border-radius:6px}.confirm-btn{background:#10b981;color:white;border:none;border-radius:6px;padding:6px 14px;font-size:13px;cursor:pointer}.status-actions select{padding:6px 10px;border:1px solid #e8eaed;border-radius:6px;font-size:12px;outline:none}`]
})
export class AdminOrdersComponent implements OnInit {
  private orderSvc = inject(OrderService);
  orders = signal<Order[]>([]); statusFilter = '';
  ngOnInit() { this.loadOrders(); }
  loadOrders() { this.orderSvc.getAllOrders(this.statusFilter || undefined).subscribe(o => this.orders.set(o)); }
  confirmPayment(id: number) { this.orderSvc.confirmPayment(id).subscribe(() => this.loadOrders()); }
  updateStatus(id: number, status: string) { this.orderSvc.updateStatus(id, status).subscribe(() => this.loadOrders()); }
}

// ─── ADMIN PRODUCTS ───────────────────────────────────────────────────────────
@Component({ selector: 'app-admin-products', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <h2 style="font-size:24px;font-weight:700">Productos</h2>
      <button class="add-btn" (click)="showForm.set(!showForm())">{{ showForm() ? 'Cancelar' : '+ Nuevo producto' }}</button>
    </div>
    @if (showForm()) {
      <div class="form-card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Nuevo producto</h3>
        <div class="form-grid">
          <div class="form-group"><label>Nombre</label><input [(ngModel)]="form.name" placeholder="Nombre del producto" /></div>
          <div class="form-group"><label>Precio ($)</label><input [(ngModel)]="form.price" type="number" placeholder="0.00" /></div>
          <div class="form-group"><label>Stock</label><input [(ngModel)]="form.stock" type="number" placeholder="0" /></div>
          <div class="form-group"><label>Categoría</label>
            <select [(ngModel)]="form.category_id">
              <option value="">Selecciona...</option>
              @for (cat of categories(); track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
            </select>
          </div>
        </div>
        <div class="form-group"><label>Descripción</label><textarea [(ngModel)]="form.description" rows="2" placeholder="Descripción del producto"></textarea></div>
        <div class="form-group"><label>Imagen</label><input type="file" accept="image/*" (change)="onImg($event)" /></div>
        <div class="form-check"><label><input type="checkbox" [(ngModel)]="form.allows_customization" /> Permite personalización</label><label><input type="checkbox" [(ngModel)]="form.is_featured" /> Producto destacado</label></div>
        <button class="save-btn" (click)="saveProduct()" [disabled]="saving()">{{ saving() ? 'Guardando...' : 'Guardar producto' }}</button>
      </div>
    }
    <div class="products-list">
      @for (p of products(); track p.id) {
        <div class="prod-row"><div class="prod-img">@if(p.image_url){<img [src]="p.image_url" />}@else{👕}</div><div class="prod-info"><b>{{ p.name }}</b><span>{{ p.category?.name }}</span></div><span style="font-weight:700;color:#FF6B9D">\${{ p.price | number:'1.2-2' }}</span><span style="font-size:12px;color:#6b7280">Stock: {{ p.stock }}</span><button class="del-btn" (click)="deleteProduct(p.id)">🗑</button></div>
      }
    </div>
  `,
  styles: [`.add-btn{background:#FF6B9D;color:white;border:none;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer}.form-card{background:white;border-radius:14px;border:1px solid #e8eaed;padding:24px;margin-bottom:24px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;label{font-size:13px;font-weight:500}input,select,textarea{padding:8px 12px;border:1px solid #e8eaed;border-radius:8px;font-size:13px;outline:none;&:focus{border-color:#FF6B9D}}textarea{resize:vertical}}.form-check{display:flex;gap:20px;margin-bottom:16px;label{display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer}}.save-btn{background:#1a1a2e;color:white;border:none;border-radius:10px;padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer;&:disabled{opacity:0.6}}.products-list{display:flex;flex-direction:column;gap:10px}.prod-row{background:white;border-radius:10px;border:1px solid #e8eaed;padding:14px 16px;display:flex;align-items:center;gap:14px}.prod-img{width:48px;height:48px;border-radius:8px;overflow:hidden;background:#f8f8f8;display:flex;align-items:center;justify-content:center;font-size:24px;img{width:100%;height:100%;object-fit:cover}}.prod-info{flex:1;b{display:block;font-size:14px;font-weight:600}span{font-size:12px;color:#6b7280}}.del-btn{background:none;border:none;font-size:18px;cursor:pointer;opacity:0.5;&:hover{opacity:1}}`]
})
export class AdminProductsComponent implements OnInit {
  private productSvc = inject(ProductService);
  private categorySvc = inject(CategoryService);
  products = signal<Product[]>([]); categories = signal<Category[]>([]);
  showForm = signal(false); saving = signal(false);
  form: any = { name: '', price: 0, stock: 0, category_id: '', description: '', allows_customization: true, is_featured: false };
  imgFile: File | null = null;

  ngOnInit() { this.productSvc.getAll().subscribe(p => this.products.set(p)); this.categorySvc.getAll().subscribe(c => this.categories.set(c)); }
  onImg(e: Event) { this.imgFile = (e.target as HTMLInputElement).files?.[0] || null; }

  saveProduct() {
    this.saving.set(true);
    const fd = new FormData();
    Object.entries(this.form).forEach(([k,v]) => fd.append(k, String(v)));
    if (this.imgFile) fd.append('image', this.imgFile);
    this.productSvc.create(fd).subscribe({ next: p => { this.products.update(list => [p, ...list]); this.showForm.set(false); this.saving.set(false); }, error: () => this.saving.set(false) });
  }
  deleteProduct(id: number) { if (confirm('¿Eliminar producto?')) this.productSvc.delete(id).subscribe(() => this.products.update(p => p.filter(x => x.id !== id))); }
}

// ─── ADMIN CATEGORIES ─────────────────────────────────────────────────────────
@Component({ selector: 'app-admin-categories', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <h2 style="font-size:24px;font-weight:700">Categorías</h2>
      <button class="add-btn" (click)="showForm.set(!showForm())">{{ showForm() ? 'Cancelar' : '+ Nueva categoría' }}</button>
    </div>
    @if (showForm()) {
      <div class="form-card">
        <div class="form-group"><label>Nombre</label><input [(ngModel)]="catName" placeholder="Nombre de categoría" /></div>
        <div class="form-group"><label>Descripción</label><input [(ngModel)]="catDesc" placeholder="Descripción" /></div>
        <div class="form-group"><label>Imagen</label><input type="file" accept="image/*" (change)="onImg($event)" /></div>
        <button class="save-btn" (click)="saveCategory()" [disabled]="saving()">{{ saving() ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    }
    <div class="cat-list">
      @for (cat of categories(); track cat.id) {
        <div class="cat-row">@if(cat.image_url){<img [src]="cat.image_url" class="cat-thumb"/>}@else{<div class="cat-thumb-empty">🎨</div>}<b>{{ cat.name }}</b><span style="font-size:13px;color:#6b7280">{{ cat.description }}</span><button class="del-btn" (click)="deleteCategory(cat.id)">🗑</button></div>
      }
    </div>
  `,
  styles: [`.add-btn{background:#FF6B9D;color:white;border:none;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer}.form-card{background:white;border-radius:14px;border:1px solid #e8eaed;padding:24px;margin-bottom:24px}.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;label{font-size:13px;font-weight:500}input{padding:8px 12px;border:1px solid #e8eaed;border-radius:8px;font-size:13px;outline:none;&:focus{border-color:#FF6B9D}}}.save-btn{background:#1a1a2e;color:white;border:none;border-radius:10px;padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer;&:disabled{opacity:0.6}}.cat-list{display:flex;flex-direction:column;gap:10px}.cat-row{background:white;border-radius:10px;border:1px solid #e8eaed;padding:14px 16px;display:flex;align-items:center;gap:14px;b{flex:1;font-size:14px}}.cat-thumb{width:48px;height:48px;border-radius:8px;object-fit:cover}.cat-thumb-empty{width:48px;height:48px;border-radius:8px;background:#f8f8f8;display:flex;align-items:center;justify-content:center;font-size:24px}.del-btn{background:none;border:none;font-size:18px;cursor:pointer;opacity:0.5;&:hover{opacity:1}}`]
})
export class AdminCategoriesComponent implements OnInit {
  private categorySvc = inject(CategoryService);
  categories = signal<Category[]>([]); showForm = signal(false); saving = signal(false);
  catName = ''; catDesc = ''; imgFile: File | null = null;
  ngOnInit() { this.categorySvc.getAll().subscribe(c => this.categories.set(c)); }
  onImg(e: Event) { this.imgFile = (e.target as HTMLInputElement).files?.[0] || null; }
  saveCategory() { this.saving.set(true); const fd = new FormData(); fd.append('name', this.catName); fd.append('description', this.catDesc); if (this.imgFile) fd.append('image', this.imgFile); this.categorySvc.create(fd).subscribe({ next: c => { this.categories.update(l => [c, ...l]); this.showForm.set(false); this.saving.set(false); }, error: () => this.saving.set(false) }); }
  deleteCategory(id: number) { if (confirm('¿Eliminar categoría?')) this.categorySvc.delete(id).subscribe(() => this.categories.update(c => c.filter(x => x.id !== id))); }
}

// ─── ADMIN GALLERY ────────────────────────────────────────────────────────────
@Component({ selector: 'app-admin-gallery', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <h2 style="font-size:24px;font-weight:700">Galería de Diseños</h2>
      <button class="add-btn" (click)="showForm.set(!showForm())">{{ showForm() ? 'Cancelar' : '+ Subir diseño' }}</button>
    </div>
    @if (showForm()) {
      <div class="form-card">
        <div class="form-group"><label>Nombre del diseño</label><input [(ngModel)]="dName" placeholder="Ej: Dragón Japonés" /></div>
        <div class="form-group"><label>Imagen (requerida)</label><input type="file" accept="image/*" (change)="onImg($event)" /></div>
        <button class="save-btn" (click)="saveDesign()" [disabled]="saving() || !imgFile">{{ saving() ? 'Subiendo...' : 'Subir diseño' }}</button>
      </div>
    }
    <div class="gallery-grid">
      @for (d of designs(); track d.id) {
        <div class="design-card"><img [src]="d.image_url" [alt]="d.name" /><div class="design-name">{{ d.name }}</div><button class="del-btn" (click)="deleteDesign(d.id)">🗑 Eliminar</button></div>
      }
    </div>
  `,
  styles: [`.add-btn{background:#FF6B9D;color:white;border:none;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer}.form-card{background:white;border-radius:14px;border:1px solid #e8eaed;padding:24px;margin-bottom:24px}.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;label{font-size:13px;font-weight:500}input{padding:8px 12px;border:1px solid #e8eaed;border-radius:8px;font-size:13px;outline:none;&:focus{border-color:#FF6B9D}}}.save-btn{background:#1a1a2e;color:white;border:none;border-radius:10px;padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer;&:disabled{opacity:0.6}}.gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.design-card{background:white;border-radius:12px;border:1px solid #e8eaed;overflow:hidden;img{width:100%;aspect-ratio:1;object-fit:cover}}.design-name{padding:10px;font-size:13px;font-weight:500}.del-btn{display:block;width:100%;padding:8px;background:none;border:none;border-top:1px solid #e8eaed;color:#9ca3af;cursor:pointer;font-size:12px;&:hover{color:#FF6B9D}}`]
})
export class AdminGalleryComponent implements OnInit {
  private gallerySvc = inject(GalleryService);
  designs = signal<any[]>([]); showForm = signal(false); saving = signal(false);
  dName = ''; imgFile: File | null = null;
  ngOnInit() { this.gallerySvc.getAll().subscribe(d => this.designs.set(d)); }
  onImg(e: Event) { this.imgFile = (e.target as HTMLInputElement).files?.[0] || null; }
  saveDesign() { this.saving.set(true); const fd = new FormData(); fd.append('name', this.dName); fd.append('image', this.imgFile!); this.gallerySvc.create(fd).subscribe({ next: d => { this.designs.update(l => [d, ...l]); this.showForm.set(false); this.saving.set(false); }, error: () => this.saving.set(false) }); }
  deleteDesign(id: number) { if (confirm('¿Eliminar diseño?')) this.gallerySvc.delete(id).subscribe(() => this.designs.update(d => d.filter((x: any) => x.id !== id))); }
}
