import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-logo">Clau<span>Store</span> ✨</a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Inicio</a>
          <a routerLink="/categories" routerLinkActive="active">Categorías</a>
          <a routerLink="/gallery" routerLinkActive="active">Galería</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/contact" routerLinkActive="active">Contacto</a>
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" class="admin-link">
              <i class="ti ti-dashboard"></i> Admin
            </a>
          }
        </div>
        <div class="nav-right">
          @if (auth.isLoggedIn()) {
            <span class="nav-user">Hola, {{ getUserFirstName() }}!</span>
            <button class="btn-logout" (click)="auth.logout()">
              <i class="ti ti-logout"></i>
            </button>
          } @else {
            <a routerLink="/auth/login" class="btn-login">Entrar</a>
          }
          <a routerLink="/cart" class="cart-btn">
            <i class="ti ti-shopping-cart"></i>
            Carrito
            @if (cart.totalItems() > 0) {
              <span class="cart-badge">{{ cart.totalItems() }}</span>
            }
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: #1a1a2e; height: 60px; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 20px rgba(0,0,0,0.3); }
    .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
    .nav-logo { font-size: 20px; font-weight: 700; color: #FF6B9D; white-space: nowrap; }
    .nav-logo span { color: #FFD93D; }
    .nav-links { display: flex; gap: 20px; align-items: center; }
    .nav-links a { font-size: 13px; color: rgba(255,255,255,0.7); transition: color 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: #FF6B9D; }
    .admin-link { color: #FFD93D !important; }
    .nav-right { display: flex; align-items: center; gap: 12px; }
    .nav-user { font-size: 13px; color: rgba(255,255,255,0.6); }
    .btn-login { font-size: 13px; color: rgba(255,255,255,0.7); }
    .btn-login:hover { color: white; }
    .btn-logout { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 16px; cursor: pointer; padding: 4px; }
    .btn-logout:hover { color: #FF6B9D; }
    .cart-btn { background: #FF6B9D; color: white; border-radius: 20px; padding: 6px 16px; font-size: 13px; display: flex; align-items: center; gap: 6px; position: relative; transition: opacity 0.2s; }
    .cart-btn:hover { opacity: 0.85; }
    .cart-badge { background: #FFD93D; color: #1a1a2e; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);

  getUserFirstName(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '';
    return name.split(' ')[0];
  }
}
