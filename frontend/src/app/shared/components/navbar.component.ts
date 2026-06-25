import { Component, inject, signal } from '@angular/core';
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

        <div class="nav-right desktop-only">
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

        <div class="mobile-right">
          <a routerLink="/cart" class="cart-btn-mobile">
            <i class="ti ti-shopping-cart"></i>
            @if (cart.totalItems() > 0) {
              <span class="cart-badge">{{ cart.totalItems() }}</span>
            }
          </a>
          <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen()">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <div class="mobile-menu">
          <a routerLink="/" (click)="closeMenu()">Inicio</a>
          <a routerLink="/categories" (click)="closeMenu()">Categorías</a>
          <a routerLink="/gallery" (click)="closeMenu()">Galería</a>
          <a routerLink="/about" (click)="closeMenu()">About</a>
          <a routerLink="/contact" (click)="closeMenu()">Contacto</a>
          @if (auth.isAdmin()) {
            <a routerLink="/admin" (click)="closeMenu()" class="admin-link">
              <i class="ti ti-dashboard"></i> Admin
            </a>
          }
          <div class="mobile-menu-footer">
            @if (auth.isLoggedIn()) {
              <span class="nav-user-mobile">Hola, {{ getUserFirstName() }}!</span>
              <button class="btn-logout-full" (click)="logoutMobile()">
                <i class="ti ti-logout"></i> Cerrar sesión
              </button>
            } @else {
              <a routerLink="/auth/login" class="btn-login-full" (click)="closeMenu()">
                <i class="ti ti-login"></i> Entrar
              </a>
            }
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar { background: #1a1a2e; min-height: 60px; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 20px rgba(0,0,0,0.3); }
    .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
    .nav-logo { font-size: 20px; font-weight: 700; color: #FF6B9D; white-space: nowrap; }
    .nav-logo span { color: #FFD93D; }
    .nav-links { display: flex; gap: 20px; align-items: center; }
    .nav-links a { font-size: 13px; color: rgba(255,255,255,0.7); transition: color 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: #FF6B9D; }
    .admin-link { color: #FFD93D !important; }
    .nav-right { display: flex; align-items: center; gap: 12px; }
    .nav-user { font-size: 13px; color: rgba(255,255,255,0.6); white-space: nowrap; }
    .btn-login { font-size: 13px; color: rgba(255,255,255,0.7); }
    .btn-login:hover { color: white; }
    .btn-logout { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 16px; cursor: pointer; padding: 4px; }
    .btn-logout:hover { color: #FF6B9D; }
    .cart-btn { background: #FF6B9D; color: white; border-radius: 20px; padding: 6px 16px; font-size: 13px; display: flex; align-items: center; gap: 6px; position: relative; transition: opacity 0.2s; white-space: nowrap; }
    .cart-btn:hover { opacity: 0.85; }
    .cart-badge { background: #FFD93D; color: #1a1a2e; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .mobile-right { display: none; align-items: center; gap: 14px; }
    .cart-btn-mobile { position: relative; color: white; font-size: 22px; display: flex; align-items: center; }
    .cart-btn-mobile .cart-badge { position: absolute; top: -6px; right: -8px; background: #FF6B9D; color: white; width: 16px; height: 16px; font-size: 9px; }
    .hamburger { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 5px; padding: 4px; }
    .hamburger span { display: block; width: 22px; height: 2px; background: white; border-radius: 2px; transition: all 0.3s; }
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .mobile-menu { background: #16213e; border-top: 1px solid rgba(255,255,255,0.1); padding: 8px 24px 16px; display: flex; flex-direction: column; }
    .mobile-menu a { font-size: 15px; color: rgba(255,255,255,0.75); padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 8px; }
    .mobile-menu a:hover { color: #FF6B9D; }
    .mobile-menu-footer { padding-top: 14px; display: flex; flex-direction: column; gap: 8px; }
    .nav-user-mobile { font-size: 14px; color: rgba(255,255,255,0.5); }
    .btn-logout-full { background: rgba(255,107,157,0.1); border: 1px solid rgba(255,107,157,0.3); color: #FF6B9D; border-radius: 8px; padding: 10px 16px; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
    .btn-login-full { background: #FF6B9D; color: white; border-radius: 8px; padding: 10px 16px; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .desktop-only { display: none; }
      .mobile-right { display: flex; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  menuOpen = signal(false);

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }

  logoutMobile() {
    this.auth.logout();
    this.closeMenu();
  }

  getUserFirstName(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '';
    return name.split(' ')[0];
  }
}