import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">ClauStore ✨</div>
        <h2 class="auth-title">Bienvenido de vuelta</h2>
        <p class="auth-sub">Entra para continuar comprando</p>

        @if (error()) {
          <div class="auth-error"><i class="ti ti-alert-circle"></i> {{ error() }}</div>
        }

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="tu@email.com" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" (keydown.enter)="login()" placeholder="••••••••" />
        </div>
        <button class="auth-btn" (click)="login()" [disabled]="loading()">
          @if (loading()) { <i class="ti ti-loader-2 spin"></i> Entrando... }
          @else { <i class="ti ti-login"></i> Entrar }
        </button>
        <p class="auth-link">
          ¿No tienes cuenta? <a routerLink="/auth/register">Regístrate gratis</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f8f9fc; padding: 24px; }
    .auth-card { background: white; border-radius: 20px; padding: 40px; width: 100%; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .auth-logo { font-size: 24px; font-weight: 700; color: #FF6B9D; text-align: center; margin-bottom: 8px; }
    .auth-title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 4px; }
    .auth-sub { font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 28px; }
    .auth-error { background: rgba(255,107,157,0.1); border: 1px solid rgba(255,107,157,0.3); color: #FF6B9D; border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; label { font-size: 13px; font-weight: 500; } input { padding: 10px 14px; border: 1px solid #e8eaed; border-radius: 10px; font-size: 14px; outline: none; &:focus { border-color: #FF6B9D; } } }
    .auth-btn { width: 100%; background: #FF6B9D; color: white; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; transition: opacity 0.2s; &:disabled { opacity: 0.7; } }
    .auth-link { text-align: center; font-size: 13px; color: #6b7280; margin-top: 20px; a { color: #FF6B9D; font-weight: 500; } }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  login() {
    if (!this.email || !this.password) { this.error.set('Completa todos los campos'); return; }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.error.set('Email o contraseña incorrectos'); this.loading.set(false); }
    });
  }
}
