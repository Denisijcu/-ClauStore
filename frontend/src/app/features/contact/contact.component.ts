import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Contacto<span class="dot">.</span></h1>
        <p style="color:rgba(255,255,255,0.6);margin-top:8px">Estamos aquí para ayudarte</p>
      </div>
    </div>
    <section style="padding:60px 0">
      <div class="container">
        <div class="contact-grid">
          <div class="card">
            <h3 style="font-size:20px;font-weight:700;margin-bottom:20px">Envíanos un mensaje</h3>
            <div class="form-group"><label>Nombre</label><input [(ngModel)]="name" placeholder="Tu nombre" /></div>
            <div class="form-group"><label>Email</label><input [(ngModel)]="email" type="email" placeholder="tu@email.com" /></div>
            <div class="form-group"><label>Mensaje</label><textarea [(ngModel)]="message" rows="5" placeholder="¿En qué podemos ayudarte?"></textarea></div>
            @if (sent) {
              <div class="success-msg">✅ ¡Mensaje enviado! Te respondemos pronto.</div>
            } @else {
              <button class="send-btn" (click)="send()">Enviar mensaje</button>
            }
          </div>
          <div class="contact-info">
            <div class="info-card card"><div style="font-size:32px;margin-bottom:12px">📧</div><h4>Email</h4><p>claudia&#64;claustore.com</p></div>
            <div class="info-card card"><div style="font-size:32px;margin-bottom:12px">💬</div><h4>WhatsApp</h4><p>+1 305 XXX XXXX</p></div>
            <div class="info-card card"><div style="font-size:32px;margin-bottom:12px">📍</div><h4>Ubicación</h4><p>Miami, Florida, USA</p></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .page-header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 48px 0; }
    .page-title { font-size: 36px; font-weight: 700; color: white; }
    .dot { color: #FF6B9D; }
    .contact-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
    .card { background: white; border-radius: 16px; border: 1px solid #e8eaed; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .form-group label { font-size: 13px; font-weight: 500; }
    .form-group input, .form-group textarea { padding: 10px 14px; border: 1px solid #e8eaed; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; }
    .form-group input:focus, .form-group textarea:focus { border-color: #FF6B9D; }
    .form-group textarea { resize: vertical; }
    .send-btn { background: #FF6B9D; color: white; border: none; border-radius: 12px; padding: 12px 28px; font-size: 15px; font-weight: 600; cursor: pointer; }
    .success-msg { background: rgba(16,185,129,0.1); color: #10b981; border-radius: 10px; padding: 12px 16px; font-size: 14px; }
    .contact-info { display: flex; flex-direction: column; gap: 16px; }
    .info-card { text-align: center; }
    .info-card h4 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .info-card p { font-size: 13px; color: #6b7280; }
  `]
})
export class ContactComponent {
  name = ''; email = ''; message = ''; sent = false;
  send() {
    if (this.name && this.email && this.message) {
      this.sent = true;
      setTimeout(() => { this.sent = false; this.name = ''; this.email = ''; this.message = ''; }, 3000);
    }
  }
}
