import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="nf-container">
      <div class="nf-content">
        <div class="nf-code">404</div>
        <div class="nf-emoji">🛍️</div>
        <h1 class="nf-title">Página no encontrada</h1>
        <p class="nf-sub">Esta página se fue de shopping y no volvió.</p>
        <a routerLink="/" class="nf-btn">
          <i class="ti ti-home"></i> Volver al inicio
        </a>
      </div>
    </div>
  `,
  styles: [`
    .nf-container {
      min-height: calc(100vh - 140px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 40px 24px;
    }
    .nf-content { text-align: center; }
    .nf-code {
      font-size: 120px;
      font-weight: 900;
      background: linear-gradient(135deg, #FF6B9D, #7C4DFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 8px;
    }
    .nf-emoji { font-size: 48px; margin-bottom: 16px; }
    .nf-title { font-size: 28px; font-weight: 700; color: white; margin-bottom: 12px; }
    .nf-sub { font-size: 15px; color: rgba(255,255,255,0.5); margin-bottom: 32px; }
    .nf-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FF6B9D;
      color: white;
      border-radius: 25px;
      padding: 12px 28px;
      font-size: 15px;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    .nf-btn:hover { opacity: 0.85; }
  `]
})
export class NotFoundComponent {}