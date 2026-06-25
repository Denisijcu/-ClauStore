// product-detail.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, GalleryService, AiPromptService } from '../../core/services/api.services';
import { CartService } from '../../core/services/cart.service';
import { Product, GalleryDesign, PromptResponse, CustomizationType } from '../../core/models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    @if (loading()) {
      <div style="display:flex;justify-content:center;padding:80px"><div class="spinner"></div></div>
    } @else if (product()) {
    <div class="detail-page">
      <div class="container">
        <a routerLink="/products" class="back-link"><i class="ti ti-arrow-left"></i> Volver</a>
        <div class="detail-grid">
          <!-- IMAGE -->
          <div class="detail-img">
            @if (product()!.image_url) {
              <img [src]="product()!.image_url" [alt]="product()!.name" />
            } @else {
              <div class="img-placeholder">👕</div>
            }
          </div>

          <!-- INFO -->
          <div class="detail-info">
            <div class="detail-cat">{{ product()!.category?.name }}</div>
            <h1 class="detail-name">{{ product()!.name }}</h1>
            <div class="detail-price">\${{ product()!.price | number:'1.2-2' }}</div>
            @if (product()!.description) {
              <p class="detail-desc">{{ product()!.description }}</p>
            }

            <!-- SIZE -->
            <div class="option-group">
              <label>Talla</label>
              <div class="option-pills">
                @for (size of sizes(); track size) {
                  <button [class.active]="selectedSize() === size" (click)="selectedSize.set(size)">{{ size }}</button>
                }
              </div>
            </div>

            <!-- COLOR -->
            <div class="option-group">
              <label>Color</label>
              <div class="option-pills">
                @for (color of colors(); track color) {
                  <button [class.active]="selectedColor() === color" (click)="selectedColor.set(color)">{{ color }}</button>
                }
              </div>
            </div>

            <!-- CUSTOMIZATION -->
            @if (product()!.allows_customization) {
              <div class="custom-section">
                <label>Personalización <span class="badge badge-purple">Opcional</span></label>
                <div class="custom-tabs">
                  <button [class.active]="customTab() === 'none'" (click)="customTab.set('none')">Sin diseño</button>
                  <button [class.active]="customTab() === 'gallery'" (click)="customTab.set('gallery')">Galería</button>
                  <button [class.active]="customTab() === 'upload'" (click)="customTab.set('upload')">Subir imagen</button>
                  <button [class.active]="customTab() === 'ai'" (click)="customTab.set('ai')">Generar con IA</button>
                </div>

                @if (customTab() === 'gallery') {
                  <div class="gallery-grid">
                    @for (design of galleryDesigns(); track design.id) {
                      <div class="gallery-item" [class.selected]="selectedGallery() === design.id" (click)="selectedGallery.set(design.id)">
                        <img [src]="design.image_url" [alt]="design.name" />
                        @if (selectedGallery() === design.id) { <div class="check">✓</div> }
                      </div>
                    }
                  </div>
                }

                @if (customTab() === 'upload') {
                  <div class="upload-area" (click)="fileInput.click()">
                    <input #fileInput type="file" accept="image/*" (change)="onFileSelect($event)" style="display:none" />
                    @if (uploadPreview()) {
                      <img [src]="uploadPreview()" style="max-height:150px;border-radius:8px" />
                    } @else {
                      <div class="upload-placeholder">
                        <i class="ti ti-upload" style="font-size:32px;color:#6b7280"></i>
                        <p>Click para subir tu imagen</p>
                        <span>PNG, JPG hasta 5MB</span>
                      </div>
                    }
                  </div>
                }

                @if (customTab() === 'ai') {
                  <div class="ai-mini">
                    <input [(ngModel)]="aiIdea" placeholder="Describe tu idea para el diseño..." class="ai-mini-input" />
                    <button (click)="generatePrompt()" [disabled]="generatingPrompt()" class="ai-mini-btn">
                      @if (generatingPrompt()) { Generando... } @else { <i class="ti ti-sparkles"></i> Generar prompt }
                    </button>
                    @if (promptResult()) {
                      <div class="ai-result-box">
                        <div class="ai-result-text">{{ promptResult()!.prompt_en }}</div>
                        <div class="ai-result-actions">
                          <button (click)="copyAiPrompt()" class="copy-btn">{{ copied() ? '✓ Copiado' : 'Copiar prompt' }}</button>
                          <a href="https://gemini.google.com" target="_blank" class="gemini-btn">Abrir Gemini ↗</a>
                        </div>
                        <p style="font-size:11px;color:#6b7280;margin-top:8px">Genera la imagen en Gemini y luego súbela usando "Subir imagen"</p>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <button class="add-to-cart-btn" (click)="addToCart()">
              <i class="ti ti-shopping-cart"></i> Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
    }
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .detail-page { padding: 40px 0 80px; }
    .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: #6b7280; margin-bottom: 28px; &:hover { color: #FF6B9D; } }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .detail-img { border-radius: 20px; overflow: hidden; background: #f8f8f8; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; img { width: 100%; height: 100%; object-fit: cover; } }
    .img-placeholder { font-size: 120px; }
    .detail-cat { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .detail-name { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    .detail-price { font-size: 32px; font-weight: 700; color: #FF6B9D; margin-bottom: 16px; }
    .detail-desc { font-size: 14px; color: #6b7280; line-height: 1.7; margin-bottom: 24px; }
    .option-group { margin-bottom: 20px; label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 10px; } }
    .option-pills { display: flex; gap: 8px; flex-wrap: wrap; button { padding: 6px 16px; border: 1px solid #e8eaed; border-radius: 20px; font-size: 13px; cursor: pointer; background: white; transition: all 0.2s; &.active { background: #1a1a2e; color: white; border-color: #1a1a2e; } &:hover { border-color: #FF6B9D; } } }
    .custom-section { margin-bottom: 24px; label { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; } }
    .badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 10px; font-size: 10px; }
    .badge-purple { background: rgba(124,77,255,0.1); color: #7C4DFF; border: 1px solid rgba(124,77,255,0.2); }
    .custom-tabs { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; button { padding: 6px 14px; border: 1px solid #e8eaed; border-radius: 8px; font-size: 12px; cursor: pointer; background: white; &.active { background: #FF6B9D; color: white; border-color: #FF6B9D; } } }
    .gallery-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
    .gallery-item { border-radius: 10px; overflow: hidden; cursor: pointer; position: relative; aspect-ratio: 1; border: 2px solid transparent; &.selected { border-color: #FF6B9D; } img { width: 100%; height: 100%; object-fit: cover; } }
    .check { position: absolute; top: 4px; right: 4px; background: #FF6B9D; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
    .upload-area { border: 2px dashed #e8eaed; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: border-color 0.2s; &:hover { border-color: #FF6B9D; } }
    .upload-placeholder p { font-size: 14px; color: #6b7280; margin: 8px 0 4px; } .upload-placeholder span { font-size: 12px; color: #9ca3af; }
    .ai-mini { display: flex; flex-direction: column; gap: 10px; }
    .ai-mini-input { padding: 10px 14px; border: 1px solid #e8eaed; border-radius: 10px; font-size: 13px; outline: none; &:focus { border-color: #7C4DFF; } }
    .ai-mini-btn { background: #7C4DFF; color: white; border: none; border-radius: 8px; padding: 10px 16px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; align-self: flex-start; &:disabled { opacity: 0.6; } }
    .ai-result-box { background: rgba(124,77,255,0.05); border: 1px solid rgba(124,77,255,0.2); border-radius: 10px; padding: 14px; }
    .ai-result-text { font-size: 12px; color: #374151; line-height: 1.6; margin-bottom: 10px; }
    .ai-result-actions { display: flex; gap: 8px; }
    .copy-btn { background: #7C4DFF; color: white; border: none; border-radius: 6px; padding: 6px 14px; font-size: 12px; cursor: pointer; }
    .gemini-btn { background: white; color: #7C4DFF; border: 1px solid rgba(124,77,255,0.3); border-radius: 6px; padding: 6px 14px; font-size: 12px; }
    .add-to-cart-btn { width: 100%; background: #FF6B9D; color: white; border: none; border-radius: 14px; padding: 16px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px; transition: transform 0.2s; &:hover { transform: translateY(-2px); } }
    .spinner { width: 40px; height: 40px; border: 3px solid #e8eaed; border-top-color: #FF6B9D; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productSvc = inject(ProductService);
  private gallerySvc = inject(GalleryService);
  private aiSvc = inject(AiPromptService);
  cart = inject(CartService);

  product = signal<Product | null>(null);
  galleryDesigns = signal<GalleryDesign[]>([]);
  loading = signal(true);
  selectedSize = signal('');
  selectedColor = signal('');
  customTab = signal<'none'|'gallery'|'upload'|'ai'>('none');
  selectedGallery = signal<number|null>(null);
  uploadPreview = signal<string|null>(null);
  uploadedFile: File | null = null;
  aiIdea = '';
  generatingPrompt = signal(false);
  promptResult = signal<PromptResponse|null>(null);
  copied = signal(false);

  sizes = signal<string[]>([]);
  colors = signal<string[]>([]);

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.productSvc.getById(id).subscribe({ next: p => { this.product.set(p); this.sizes.set(p.sizes.split(',')); this.colors.set(p.colors.split(',')); this.loading.set(false); }, error: () => this.loading.set(false) });
    this.gallerySvc.getAll().subscribe(d => this.galleryDesigns.set(d));
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadedFile = file;
    const reader = new FileReader();
    reader.onload = e => this.uploadPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  generatePrompt() {
    if (!this.aiIdea.trim()) return;
    this.generatingPrompt.set(true);
    this.aiSvc.generatePrompt({ idea: this.aiIdea, style: 'moderno', product_type: this.product()?.name }).subscribe({ next: r => { this.promptResult.set(r); this.generatingPrompt.set(false); }, error: () => this.generatingPrompt.set(false) });
  }

  copyAiPrompt() { navigator.clipboard.writeText(this.promptResult()?.prompt_en || ''); this.copied.set(true); setTimeout(() => this.copied.set(false), 2000); }

  addToCart() {
    const p = this.product();
    if (!p) return;
    let customType: CustomizationType | undefined;
    if (this.customTab() === 'gallery') customType = 'gallery';
    else if (this.customTab() === 'upload') customType = 'upload';
    else if (this.customTab() === 'ai') customType = 'ai_generated';

    this.cart.addToCart(p, 1, {
      size: this.selectedSize() || undefined,
      color: this.selectedColor() || undefined,
      customization_type: customType,
      gallery_design_id: this.selectedGallery() ?? undefined
    });
  }
}
