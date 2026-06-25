import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export { AboutComponent, ContactComponent };

@Component({ selector: 'app-about', standalone: true, imports: [],
  template: `
    <div class="page-header"><div class="container"><h1 class="page-title">Sobre Nosotros<span class="dot">.</span></h1></div></div>
    <section style="padding:60px 0"><div class="container">
      <div class="about-grid">
        <div class="about-card card"><div style="font-size:48px;margin-bottom:16px">✨</div><h3>Nuestra Historia</h3><p>ClauStore nació de la pasión por los diseños únicos y la personalización. Creemos que cada persona merece llevar algo que la represente.</p></div>
        <div class="about-card card"><div style="font-size:48px;margin-bottom:16px">🎨</div><h3>Nuestra Misión</h3><p>Hacer accesible la personalización de productos con la mejor calidad de sublimación, combinando creatividad humana e inteligencia artificial.</p></div>
        <div class="about-card card"><div style="font-size:48px;margin-bottom:16px">💜</div><h3>Nuestros Valores</h3><p>Calidad, creatividad y cercanía con cada cliente. Tu satisfacción es nuestra prioridad.</p></div>
      </div>
    </div></section>
  `,
  styles: [`.container{max-width:1200px;margin:0 auto;padding:0 24px}.page-header{background:linear-gradient(135deg,#1a1a2e,#16213e);padding:48px 0}.page-title{font-size:36px;font-weight:700;color:white}.dot{color:#FF6B9D}.about-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.about-card{background:white;border-radius:16px;border:1px solid #e8eaed;padding:32px;text-align:center;h3{font-size:18px;font-weight:700;margin-bottom:12px}p{font-size:14px;color:#6b7280;line-height:1.7}}`]
})
class AboutComponent {}

@Component({ selector: 'app-contact', standalone: true, imports: [FormsModule],
  template: `
    <div class="page-header"><div class="container"><h1 class="page-title">Contacto<span class="dot">.</span></h1><p style="color:rgba(255,255,255,0.6);margin-top:8px">Estamos aquí para ayudarte</p></div></div>
    <section style="padding:60px 0"><div class="container">
      <div class="contact-grid">
        <div class="contact-form card">
          <h3 style="font-size:20px;font-weight:700;margin-bottom:20px">Envíanos un mensaje</h3>
          <div class="form-group"><label>Nombre</label><input [(ngModel)]="name" placeholder="Tu nombre" /></div>
          <div class="form-group"><label>Email</label><input [(ngModel)]="email" type="email" placeholder="tu@email.com" /></div>
          <div class="form-group"><label>Mensaje</label><textarea [(ngModel)]="message" rows="5" placeholder="¿En qué podemos ayudarte?"></textarea></div>
          <button class="send-btn" (click)="send()">{{ sent ? '✓ Mensaje enviado!' : 'Enviar mensaje' }}</button>
        </div>
        <div class="contact-info">
          <div class="info-card card"><div style="font-size:32px;margin-bottom:12px">📧</div><h4>Email</h4><p>claudia&#64;claustore.com</p></div>
          <div class="info-card card"><div style="font-size:32px;margin-bottom:12px">💬</div><h4>WhatsApp</h4><p>+1 305 XXX XXXX</p></div>
          <div class="info-card card"><div style="font-size:32px;margin-bottom:12px">📍</div><h4>Ubicación</h4><p>Miami, Florida, USA</p></div>
        </div>
      </div>
    </div></section>
  `,
  styles: [`.container{max-width:1200px;margin:0 auto;padding:0 24px}.page-header{background:linear-gradient(135deg,#1a1a2e,#16213e);padding:48px 0}.page-title{font-size:36px;font-weight:700;color:white}.dot{color:#FF6B9D}.contact-grid{display:grid;grid-template-columns:1fr 300px;gap:24px}.card{background:white;border-radius:16px;border:1px solid #e8eaed;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06)}.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;label{font-size:13px;font-weight:500}input,textarea{padding:10px 14px;border:1px solid #e8eaed;border-radius:10px;font-size:14px;outline:none;&:focus{border-color:#FF6B9D}}textarea{resize:vertical}}.send-btn{background:#FF6B9D;color:white;border:none;border-radius:12px;padding:12px 28px;font-size:15px;font-weight:600;cursor:pointer}.contact-info{display:flex;flex-direction:column;gap:16px}.info-card{background:white;border-radius:14px;border:1px solid #e8eaed;padding:20px;text-align:center;h4{font-size:14px;font-weight:600;margin-bottom:4px}p{font-size:13px;color:#6b7280}}`]
})
class ContactComponent {
  name = ''; email = ''; message = ''; sent = false;
  send() { if (this.name && this.email && this.message) { this.sent = true; setTimeout(() => this.sent = false, 3000); } }
}
