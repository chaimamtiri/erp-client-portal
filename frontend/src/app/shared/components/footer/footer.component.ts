import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <span>© 2026 ErpClient — Prototype de portail client</span>
      <span>Support • Sécurité • Documentation</span>
    </footer>
  `,
  styles: [
    `:host { display: block; margin-top: 1.5rem; }`,
    `.footer { display: flex; justify-content: space-between; gap: 1rem; padding: 1rem 0; color: #64748b; font-size: 0.9rem; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}

