import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">ClauStore ✨</div>
        <h2 class="auth-title">Crear cuenta</h2>
        <p class="auth-sub">Únete y personaliza tus productos</p>

        @if (error()) {
          <div class="auth-error"><i class="ti ti-alert-circle"></i> {{ error() }}</div>
        }

        <div class="form-group">
          <label>Nombre completo</label>
          <input type="text" [(ngModel)]="name" placeholder="Tu nombre" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="tu@email.com" />
        </div>
        <div class="form-group">
          <label>Teléfono (opcional)</label>
          <input type="tel" [(ngModel)]="phone" placeholder="+1 305 XXX XXXX" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" placeholder="••••••••" />
        </div>
        <button class="auth-btn" (click)="register()" [disabled]="loading()">
          @if (loading()) { <i class="ti ti-loader-2 spin"></i> Creando cuenta... }
          @else { <i class="ti ti-user-plus"></i> Crear cuenta }
        </button>
        <p class="auth-link">
          ¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f8f9fc; padding: 24px; }
    .auth-card { background: white; border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .auth-logo { font-size: 24px; font-weight: 700; color: #FF6B9D; text-align: center; margin-bottom: 8px; }
    .auth-title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 4px; }
    .auth-sub { font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 28px; }
    .auth-error { background: rgba(255,107,157,0.1); border: 1px solid rgba(255,107,157,0.3); color: #FF6B9D; border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; label { font-size: 13px; font-weight: 500; } input { padding: 10px 14px; border: 1px solid #e8eaed; border-radius: 10px; font-size: 14px; outline: none; &:focus { border-color: #FF6B9D; } } }
    .auth-btn { width: 100%; background: #FF6B9D; color: white; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; transition: opacity 0.2s; &:disabled { opacity: 0.7; } }
    .auth-link { text-align: center; font-size: 13px; color: #6b7280; margin-top: 20px; a { color: #FF6B9D; font-weight: 500; } }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = ''; email = ''; password = ''; phone = '';
  loading = signal(false);
  error = signal('');

  register() {
    if (!this.name || !this.email || !this.password) { this.error.set('Nombre, email y contraseña son requeridos'); return; }
    this.loading.set(true);
    this.error.set('');
    this.auth.register({ name: this.name, email: this.email, password: this.password, phone: this.phone || undefined }).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (e) => { this.error.set(e.error?.detail || 'Error al crear cuenta'); this.loading.set(false); }
    });
  }
}
