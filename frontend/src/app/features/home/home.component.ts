import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, CategoryService, AiPromptService } from '../../core/services/api.services';
import { CartService } from '../../core/services/cart.service';
import { Product, Category, PromptResponse } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-decor"></div>
      <div class="hero-decor2"></div>
      <div class="container hero-inner">
        <div class="hero-left">
          <div class="hero-badge">
            <i class="ti ti-sparkles"></i> Diseños únicos con IA
          </div>
          <h1 class="hero-title">
            Tu estilo,<br>
            <span class="accent">tus diseños,</span><br>
            <span class="accent2">tu historia.</span>
          </h1>
          <p class="hero-sub">
            Camisetas y objetos sublimados con diseños personalizados. Sube tu logo,
            elige de nuestra galería, o genera tu idea con inteligencia artificial.
          </p>
          <div class="hero-btns">
            <a routerLink="/products" class="btn-primary">
              <i class="ti ti-shopping-bag"></i> Ver catálogo
            </a>
            <a routerLink="/gallery" class="btn-outline">
              <i class="ti ti-wand"></i> Ver galería
            </a>
          </div>
        </div>
        <div class="hero-right">
          <div class="ai-preview-card">
            <div class="ai-card-label">✨ Generador IA en acción</div>
            <div class="ai-input-demo">
              <div class="ai-label">Tu idea:</div>
              <div class="ai-text">"Un dragón japonés rodeado de flores de cerezo"</div>
            </div>
            <div class="ai-output-demo">
              <div class="ai-label" style="color:#4ECDC4">🎨 Prompt para Gemini:</div>
              <div class="ai-text small">Majestic Japanese dragon surrounded by sakura blossoms, watercolor style, vibrant colors, white background...</div>
              <button class="copy-demo-btn"><i class="ti ti-copy"></i> Copiar prompt</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <div class="stats-bar">
      <div class="stat"><div class="stat-num">500+</div><div class="stat-label">Diseños</div></div>
      <div class="stat"><div class="stat-num">1,200+</div><div class="stat-label">Clientes felices</div></div>
      <div class="stat"><div class="stat-num">48h</div><div class="stat-label">Entrega rápida</div></div>
      <div class="stat"><div class="stat-num">100%</div><div class="stat-label">Premium</div></div>
    </div>

    <div class="wave-divider"></div>

    <!-- CATEGORIES -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Categorías<span class="dot">.</span></h2>
          <a routerLink="/categories" class="see-all">Ver todas <i class="ti ti-arrow-right"></i></a>
        </div>
        @if (loadingCats()) {
          <div class="loading-container"><div class="spinner"></div></div>
        } @else {
          <div class="cat-grid">
            @for (cat of categories(); track cat.id) {
              <a routerLink="/products" [queryParams]="{category_id: cat.id}" class="cat-card">
                <div class="cat-img">
                  @if (cat.image_url) {
                    <img [src]="cat.image_url" [alt]="cat.name">
                  } @else {
                    <span class="cat-emoji">🎨</span>
                  }
                </div>
                <div class="cat-overlay">
                  <div class="cat-name">{{ cat.name }}</div>
                </div>
              </a>
            }
            @empty {
              <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>Sin categorías aún</h3>
                <p>El admin las está configurando</p>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Productos destacados<span class="dot">.</span></h2>
          <a routerLink="/products" class="see-all">Ver todos <i class="ti ti-arrow-right"></i></a>
        </div>
        @if (loadingProducts()) {
          <div class="loading-container"><div class="spinner"></div></div>
        } @else {
          <div class="products-grid">
            @for (product of featuredProducts(); track product.id) {
              <div class="product-card card">
                <a [routerLink]="['/products', product.id]" class="product-img">
                  @if (product.image_url) {
                    <img [src]="product.image_url" [alt]="product.name">
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
                  <div class="product-footer">
                    <span class="price">\${{ product.price | number:'1.2-2' }}</span>
                    <button class="btn-dark" (click)="addToCart(product)">
                      <i class="ti ti-plus"></i> Agregar
                    </button>
                  </div>
                </div>
              </div>
            }
            @empty {
              <div class="empty-state">
                <div class="empty-icon">🛍️</div>
                <h3>Sin productos aún</h3>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <div class="wave-divider"></div>

    <!-- AI SECTION -->
    <section class="ai-section">
      <div class="container">
        <div class="section-header" style="margin-bottom:8px">
          <h2 class="section-title" style="color:white">Diseña con IA<span style="color:#FFD93D">.</span></h2>
        </div>
        <p class="ai-subtitle">Describe tu idea y generamos el prompt perfecto para Gemini o cualquier IA.</p>
        <div class="ai-box">
          <div class="ai-steps">
            <div class="ai-step">
              <div class="ai-step-icon" style="background:rgba(255,107,157,0.15)">✍️</div>
              <div class="ai-step-title">1. Describe tu idea</div>
              <div class="ai-step-desc">Escribe en español lo que imaginás</div>
            </div>
            <div class="ai-step">
              <div class="ai-step-icon" style="background:rgba(124,77,255,0.15)">🤖</div>
              <div class="ai-step-title">2. IA genera el prompt</div>
              <div class="ai-step-desc">Transformamos tu idea en prompt profesional</div>
            </div>
            <div class="ai-step">
              <div class="ai-step-icon" style="background:rgba(78,205,196,0.15)">🎨</div>
              <div class="ai-step-title">3. Genera en Gemini</div>
              <div class="ai-step-desc">Pega el prompt y descarga tu imagen</div>
            </div>
          </div>
          <div class="ai-input-row">
            <select [(ngModel)]="aiStyle" class="ai-select">
              <option value="moderno">Moderno</option>
              <option value="vintage">Vintage</option>
              <option value="abstracto">Abstracto</option>
              <option value="cartoon">Cartoon</option>
              <option value="realista">Realista</option>
            </select>
            <input
              [(ngModel)]="aiIdea"
              (keydown.enter)="generatePrompt()"
              class="ai-input"
              placeholder="Ej: Un sol con cara feliz y colores tropicales..."
            />
            <button class="ai-gen-btn" (click)="generatePrompt()" [disabled]="generatingPrompt()">
              @if (generatingPrompt()) {
                <i class="ti ti-loader-2 spin"></i> Generando...
              } @else {
                <i class="ti ti-sparkles"></i> Generar
              }
            </button>
          </div>
          @if (promptResult()) {
            <div class="ai-output">
              <div class="ai-output-label">✨ Tu prompt profesional:</div>
              <div class="ai-output-text">{{ promptResult()!.prompt_en }}</div>
              <div class="ai-tip">💡 {{ promptResult()!.suggestion }}</div>
              <div class="copy-row">
                <button class="copy-pill active" (click)="copyPrompt()">
                  <i class="ti ti-copy"></i> {{ copied() ? '¡Copiado!' : 'Copiar prompt' }}
                </button>
                <a href="https://gemini.google.com" target="_blank" class="copy-pill">
                  <i class="ti ti-external-link"></i> Abrir Gemini ↗
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ZELLE SECTION -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Pago fácil con Zelle<span class="dot">.</span></h2>
        </div>
        <div class="zelle-box card">
          <div class="zelle-icon">💜</div>
          <div class="zelle-content">
            <h3 class="zelle-title">Sin complicaciones, sin comisiones</h3>
            <p class="zelle-desc">Aceptamos pagos directos por Zelle. Simple, rápido y sin cargos extra.</p>
            <div class="zelle-steps">
              <div class="zelle-step"><span class="zstep-num">1</span> Haz tu pedido</div>
              <div class="zelle-step"><span class="zstep-num">2</span> Envía por Zelle</div>
              <div class="zelle-step"><span class="zstep-num">3</span> Sube comprobante</div>
              <div class="zelle-step"><span class="zstep-num">4</span> ¡Enviamos!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* HERO */
    .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%); padding: 80px 0; position: relative; overflow: hidden; }
    .hero-decor { position: absolute; top: -60px; right: -60px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 70%); pointer-events: none; }
    .hero-decor2 { position: absolute; bottom: -80px; left: 35%; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(124,77,255,0.1) 0%, transparent 70%); pointer-events: none; }
    .hero-inner { display: flex; align-items: center; gap: 48px; position: relative; z-index: 1; }
    .hero-left { flex: 1; }
    .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,107,157,0.15); border: 1px solid rgba(255,107,157,0.3); border-radius: 20px; padding: 5px 16px; font-size: 13px; color: #FF6B9D; margin-bottom: 20px; }
    .hero-title { font-size: 42px; font-weight: 700; color: white; line-height: 1.2; margin-bottom: 16px; .accent { color: #FF6B9D; } .accent2 { color: #FFD93D; } }
    .hero-sub { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 28px; max-width: 440px; }
    .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn-primary { background: #FF6B9D; color: white; border: none; border-radius: 25px; padding: 12px 28px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.2s; &:hover { transform: translateY(-2px); } }
    .btn-outline { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px; padding: 12px 28px; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: border-color 0.2s; &:hover { border-color: #4ECDC4; color: #4ECDC4; } }
    .hero-right { flex: 0 0 300px; }
    .ai-preview-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 20px; backdrop-filter: blur(10px); }
    .ai-card-label { font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
    .ai-input-demo { background: rgba(124,77,255,0.12); border: 1px solid rgba(124,77,255,0.25); border-radius: 10px; padding: 12px; margin-bottom: 10px; }
    .ai-output-demo { background: rgba(78,205,196,0.1); border: 1px solid rgba(78,205,196,0.25); border-radius: 10px; padding: 12px; }
    .ai-label { font-size: 11px; color: #7C4DFF; margin-bottom: 6px; }
    .ai-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; &.small { font-size: 11px; } }
    .copy-demo-btn { display: flex; align-items: center; gap: 6px; background: #4ECDC4; color: #1a1a2e; border: none; border-radius: 6px; padding: 6px 12px; font-size: 11px; cursor: pointer; font-weight: 500; margin-top: 10px; }

    /* STATS */
    .stats-bar { display: flex; background: #FF6B9D; }
    .stat { flex: 1; text-align: center; padding: 16px; border-right: 1px solid rgba(255,255,255,0.2); &:last-child { border-right: none; } }
    .stat-num { font-size: 24px; font-weight: 700; color: white; }
    .stat-label { font-size: 12px; color: rgba(255,255,255,0.8); }

    /* CATEGORIES */
    .section { padding: 60px 0; }
    .section-alt { padding: 60px 0; background: white; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
    .section-title { font-size: 26px; font-weight: 700; .dot { color: #FF6B9D; } }
    .see-all { font-size: 13px; color: #FF6B9D; display: flex; align-items: center; gap: 4px; }
    .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .cat-card { border-radius: 14px; overflow: hidden; cursor: pointer; position: relative; aspect-ratio: 1; display: block; transition: transform 0.2s; &:hover { transform: scale(1.03); } }
    .cat-img { width: 100%; height: 100%; background: linear-gradient(135deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center; img { width: 100%; height: 100%; object-fit: cover; } }
    .cat-emoji { font-size: 48px; }
    .cat-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px; background: linear-gradient(transparent, rgba(0,0,0,0.75)); }
    .cat-name { color: white; font-size: 15px; font-weight: 600; }

    /* PRODUCTS */
    .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .product-card { transition: transform 0.2s; &:hover { transform: translateY(-4px); } }
    .product-img { display: block; height: 180px; background: #f8f8f8; display: flex; align-items: center; justify-content: center; img { width: 100%; height: 100%; object-fit: cover; } }
    .product-emoji { font-size: 60px; }
    .product-body { padding: 16px; }
    .product-name { font-size: 15px; font-weight: 600; margin: 8px 0 4px; }
    .product-cat { font-size: 12px; color: #6b7280; margin-bottom: 12px; }
    .product-footer { display: flex; align-items: center; justify-content: space-between; }
    .price { font-size: 20px; font-weight: 700; color: #FF6B9D; }
    .btn-dark { background: #1a1a2e; color: white; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; border-radius: 12px; padding: 3px 10px; }
    .badge-purple { background: rgba(124,77,255,0.1); color: #7C4DFF; border: 1px solid rgba(124,77,255,0.2); }

    /* AI SECTION */
    .wave-divider { height: 4px; background: linear-gradient(90deg, #FF6B9D, #7C4DFF, #4ECDC4, #FFD93D); }
    .ai-section { background: #1a1a2e; padding: 60px 0; }
    .ai-subtitle { font-size: 14px; color: rgba(255,255,255,0.55); margin-bottom: 28px; }
    .ai-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 28px; }
    .ai-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 24px; text-align: center; }
    .ai-step-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px; }
    .ai-step-title { font-size: 13px; font-weight: 600; color: white; margin-bottom: 4px; }
    .ai-step-desc { font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.5; }
    .ai-input-row { display: flex; gap: 10px; }
    .ai-select { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: white; outline: none; }
    .ai-select option { background: #1a1a2e; }
    .ai-input { flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: white; outline: none; &::placeholder { color: rgba(255,255,255,0.3); } }
    .ai-gen-btn { background: #FFD93D; color: #1a1a2e; border: none; border-radius: 10px; padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap; &:disabled { opacity: 0.6; } }
    .ai-output { margin-top: 16px; background: rgba(78,205,196,0.08); border: 1px solid rgba(78,205,196,0.2); border-radius: 10px; padding: 16px; }
    .ai-output-label { font-size: 11px; color: #4ECDC4; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .ai-output-text { font-size: 13px; color: rgba(255,255,255,0.85); line-height: 1.6; }
    .ai-tip { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 8px; font-style: italic; }
    .copy-row { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
    .copy-pill { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); border-radius: 6px; padding: 6px 14px; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; &.active { background: #4ECDC4; color: #1a1a2e; border-color: #4ECDC4; } }

    /* ZELLE */
    .zelle-box { display: flex; gap: 24px; align-items: flex-start; padding: 28px; }
    .zelle-icon { width: 60px; height: 60px; border-radius: 16px; background: #6C1CD1; display: flex; align-items: center; justify-content: center; font-size: 30px; flex-shrink: 0; }
    .zelle-title { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
    .zelle-desc { font-size: 14px; color: #6b7280; margin-bottom: 16px; }
    .zelle-steps { display: flex; gap: 10px; flex-wrap: wrap; }
    .zelle-step { display: flex; align-items: center; gap: 8px; background: #f8f9fc; border: 1px solid #e8eaed; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #6b7280; }
    .zstep-num { width: 22px; height: 22px; border-radius: 50%; background: #6C1CD1; color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    /* SPINNER */
    .loading-container { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 3px solid #e8eaed; border-top-color: #FF6B9D; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 40px; color: #6b7280; .empty-icon { font-size: 40px; margin-bottom: 12px; } h3 { font-size: 16px; color: #1a1a2e; } }
    .spin { animation: spin 1s linear infinite; }
  `]
})
export class HomeComponent implements OnInit {
  private productSvc = inject(ProductService);
  private categorySvc = inject(CategoryService);
  private aiSvc = inject(AiPromptService);
  cart = inject(CartService);

  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);
  loadingCats = signal(true);
  loadingProducts = signal(true);

  aiIdea = '';
  aiStyle = 'moderno';
  generatingPrompt = signal(false);
  promptResult = signal<PromptResponse | null>(null);
  copied = signal(false);

  ngOnInit() {
    this.categorySvc.getAll().subscribe({
      next: cats => { this.categories.set(cats.slice(0, 4)); this.loadingCats.set(false); },
      error: () => this.loadingCats.set(false)
    });
    this.productSvc.getAll({ featured: true }).subscribe({
      next: prods => { this.featuredProducts.set(prods.slice(0, 3)); this.loadingProducts.set(false); },
      error: () => this.loadingProducts.set(false)
    });
  }

  generatePrompt() {
    if (!this.aiIdea.trim()) return;
    this.generatingPrompt.set(true);
    this.aiSvc.generatePrompt({ idea: this.aiIdea, style: this.aiStyle, product_type: 'camiseta' }).subscribe({
      next: res => { this.promptResult.set(res); this.generatingPrompt.set(false); },
      error: () => this.generatingPrompt.set(false)
    });
  }

  copyPrompt() {
    const text = this.promptResult()?.prompt_en;
    if (text) navigator.clipboard.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  addToCart(product: Product) {
    this.cart.addToCart(product);
  }
}
