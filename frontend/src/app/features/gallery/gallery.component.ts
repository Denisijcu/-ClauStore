// gallery.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService, CategoryService } from '../../core/services/api.services';
import { GalleryDesign, Category } from '../../core/models/models';
import { FormsModule } from '@angular/forms';

export { GalleryComponent };

@Component({ selector: 'app-gallery', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><div class="container"><h1 class="page-title">Galería de Diseños<span class="dot">.</span></h1><p class="page-sub">Elige un diseño predefinido para tu producto</p></div></div>
    <section style="padding:48px 0"><div class="container">
      <div class="gallery-grid">
        @for (design of designs(); track design.id) {
          <div class="gallery-card"><img [src]="design.image_url" [alt]="design.name" /><div class="gallery-name">{{ design.name }}</div></div>
        }
        @empty { <div style="grid-column:1/-1;text-align:center;padding:60px;color:#6b7280"><div style="font-size:48px;margin-bottom:12px">🎨</div><h3>Sin diseños todavía</h3><p>El admin está subiendo diseños</p></div> }
      </div>
    </div></section>
  `,
  styles: [`.container{max-width:1200px;margin:0 auto;padding:0 24px}.page-header{background:linear-gradient(135deg,#1a1a2e,#16213e);padding:48px 0}.page-title{font-size:36px;font-weight:700;color:white}.dot{color:#FF6B9D}.page-sub{font-size:15px;color:rgba(255,255,255,0.6);margin-top:8px}.gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.gallery-card{border-radius:14px;overflow:hidden;border:1px solid #e8eaed;background:white}.gallery-card img{width:100%;aspect-ratio:1;object-fit:cover}.gallery-name{padding:10px;font-size:13px;font-weight:500;text-align:center}`]
})
class GalleryComponent implements OnInit {
  private gallerySvc = inject(GalleryService);
  designs = signal<GalleryDesign[]>([]);
  ngOnInit() { this.gallerySvc.getAll().subscribe(d => this.designs.set(d)); }
}
