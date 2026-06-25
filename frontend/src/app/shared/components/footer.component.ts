import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-logo">ClauStore ✨</div>
        <div class="footer-links">
          <a routerLink="/">Inicio</a>
          <a routerLink="/categories">Categorías</a>
          <a routerLink="/gallery">Galería</a>
          <a routerLink="/about">About</a>
          <a routerLink="/contact">Contacto</a>
        </div>
        <div class="footer-copy">
          © 2026 ClauStore · Hecho con ❤️ por <strong>Vertex Coders</strong>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1a2e;
      padding: 24px 0;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-logo {
      font-size: 18px;
      font-weight: 700;
      color: #FF6B9D;
    }
    .footer-links {
      display: flex;
      gap: 20px;
      a {
        font-size: 13px;
        color: rgba(255,255,255,0.5);
        &:hover { color: #FF6B9D; }
      }
    }
    .footer-copy {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      strong { color: rgba(255,255,255,0.6); }
    }
  `]
})
export class FooterComponent {}
