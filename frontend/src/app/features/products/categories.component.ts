import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-categories', standalone: true, imports: [RouterLink],
  template: `<div style="padding:60px;text-align:center"><h1>Categorías 🎨</h1><p style="color:#6b7280;margin-top:12px">Explora nuestras categorías</p><a routerLink="/products" style="display:inline-block;margin-top:24px;background:#FF6B9D;color:white;padding:12px 28px;border-radius:25px;font-weight:600">Ver productos</a></div>` })
export class CategoriesComponent {}
