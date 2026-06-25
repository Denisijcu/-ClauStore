import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Sobre Nosotros<span class="dot">.</span></h1>
      </div>
    </div>
    <section style="padding:60px 0">
      <div class="container">
        <div class="about-grid">
          <div class="about-card card">
            <div style="font-size:48px;margin-bottom:16px">✨</div>
            <h3>Nuestra Historia</h3>
            <p>ClauStore nació de la pasión por los diseños únicos y la personalización. Creemos que cada persona merece llevar algo que la represente.</p>
          </div>
          <div class="about-card card">
            <div style="font-size:48px;margin-bottom:16px">🎨</div>
            <h3>Nuestra Misión</h3>
            <p>Hacer accesible la personalización de productos con la mejor calidad de sublimación, combinando creatividad humana e inteligencia artificial.</p>
          </div>
          <div class="about-card card">
            <div style="font-size:48px;margin-bottom:16px">💜</div>
            <h3>Nuestros Valores</h3>
            <p>Calidad, creatividad y cercanía con cada cliente. Tu satisfacción es nuestra prioridad.</p>
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
    .about-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    .about-card { background: white; border-radius: 16px; border: 1px solid #e8eaed; padding: 32px; text-align: center; }
    .about-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
    .about-card p { font-size: 14px; color: #6b7280; line-height: 1.7; }
  `]
})
export class AboutComponent {}
