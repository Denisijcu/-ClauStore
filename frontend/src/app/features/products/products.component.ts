import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, CategoryService } from '../../core/services/api.services';
import { CartService } from '../../core/services/cart.service';
import { Product, Category } from '../../core/models/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Productos<span class="dot">.</span></h1>
        <p class="page-sub">Encuentra el producto perfecto para personalizar</p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Filters -->
        <div class="filters-bar">
          <div class="search-box">
            <i class="ti ti-search"></i>
            <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar productos..." />
          </div>
          <div class="cat-filters">
            <button [class.active]="!selectedCat()" (click)="filterByCat(null)">Todos</button>
            @for (cat of categories(); track cat.id) {
              <button [class.active]="selectedCat() === cat.id" (click)="filterByCat(cat.id)">
                {{ cat.name }}
              </button>
            }
          </div>
        </div>

        @if (loading()) {
          <div class="loading-container"><div class="spinner"></div></div>
        } @else {
          <div class="products-grid">
            @for (product of products(); track product.id) {
              <div class="product-card card">
                <a [routerLink]="['/products', product.id]" class="product-img-wrap">
                  @if (product.image_url) {
                    <img [src]="product.image_url" [alt]="product.name" />
                  } @else {
                    <span class="product-emoji">👕</span>
                  }
                </a>
                <div class="product-body">
                  @if (product.allows_customization) {
                    <span class="badge badge-purple"><i class="ti ti-wand"></i> Personalizable</span>
                  }
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-cat">{{ product.category?.name }}</p>
                  @if (product.description) {
                    <p class="product-desc">{{ product.description }}</p>
                  }
                  <div class="product-footer">
                    <span class="price">\${{ product.price | number:'1.2-2' }}</span>
                    <div class="product-actions">
                      <a [routerLink]="['/products', product.id]" class="btn-view">Ver más</a>
                      <button class="btn-add" (click)="addToCart(product)">
                        <i class="ti ti-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
            @empty {
              <div class="empty-state" style="grid-column: 1/-1">
                <div class="empty-icon">🛍️</div>
                <h3>Sin productos</h3>
                <p>No hay productos en esta categoría todavía</p>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .page-header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 48px 0; }
    .page-title { font-size: 36px; font-weight: 700; color: white; .dot { color: #FF6B9D; } }
    .page-sub { font-size: 15px; color: rgba(255,255,255,0.6); margin-top: 8px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section { padding: 48px 0; }
    .filters-bar { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; align-items: center; }
    .search-box { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid #e8eaed; border-radius: 10px; padding: 10px 14px; flex: 1; min-width: 200px; i { color: #6b7280; } input { border: none; outline: none; font-size: 14px; flex: 1; } }
    .cat-filters { display: flex; gap: 8px; flex-wrap: wrap; button { background: white; border: 1px solid #e8eaed; border-radius: 20px; padding: 6px 16px; font-size: 13px; cursor: pointer; transition: all 0.2s; &.active, &:hover { background: #FF6B9D; color: white; border-color: #FF6B9D; } } }
    .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .product-card { transition: transform 0.2s; &:hover { transform: translateY(-4px); } }
    .product-img-wrap { display: block; height: 200px; background: #f8f8f8; display: flex; align-items: center; justify-content: center; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } }
    .product-emoji { font-size: 64px; }
    .product-body { padding: 16px; }
    .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; border-radius: 12px; padding: 3px 10px; }
    .badge-purple { background: rgba(124,77,255,0.1); color: #7C4DFF; border: 1px solid rgba(124,77,255,0.2); }
    .product-name { font-size: 15px; font-weight: 600; margin: 8px 0 4px; }
    .product-cat { font-size: 12px; color: #6b7280; margin-bottom: 6px; }
    .product-desc { font-size: 12px; color: #9ca3af; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
    .price { font-size: 20px; font-weight: 700; color: #FF6B9D; }
    .product-actions { display: flex; gap: 8px; }
    .btn-view { background: #f3f4f6; color: #1a1a2e; border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 500; }
    .btn-add { background: #1a1a2e; color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 14px; cursor: pointer; }
    .loading-container { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid #e8eaed; border-top-color: #FF6B9D; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 60px; color: #6b7280; .empty-icon { font-size: 48px; margin-bottom: 12px; } h3 { font-size: 18px; color: #1a1a2e; margin-bottom: 8px; } }
  `]
})
export class ProductsComponent implements OnInit {
  private productSvc = inject(ProductService);
  private categorySvc = inject(CategoryService);
  private route = inject(ActivatedRoute);
  cart = inject(CartService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  selectedCat = signal<number | null>(null);
  searchQuery = '';
  private searchTimer: any;

  ngOnInit() {
    this.categorySvc.getAll().subscribe(cats => this.categories.set(cats));
    this.route.queryParams.subscribe(params => {
      const catId = params['category_id'] ? +params['category_id'] : null;
      this.selectedCat.set(catId);
      this.loadProducts();
    });
  }

  filterByCat(catId: number | null) {
    this.selectedCat.set(catId);
    this.loadProducts();
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadProducts(), 400);
  }

  loadProducts() {
    this.loading.set(true);
    this.productSvc.getAll({
      category_id: this.selectedCat() ?? undefined,
      search: this.searchQuery || undefined
    }).subscribe({
      next: prods => { this.products.set(prods); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Product) { this.cart.addToCart(product); }
}
