import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, NavItem } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ThemeService } from '../../Core/services/theme.service';
import { ChatbotComponent } from '../../shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, FooterComponent, ChatbotComponent],
  template: `
    <div class="shell" [class.dark-theme]="theme.darkMode()">
      <div class="shell__sidebar">
        <app-sidebar [items]="navItems" />
      </div>
      <div class="shell__content">
        <app-topbar [title]="pageTitle" />
        <main class="content-body">
          <router-outlet />
        </main>
        <app-footer />
      </div>
      <app-chatbot />
    </div>
  `,
  styles: [
    `:host { display: block; min-height: 100vh; }`,
    `.shell { display: grid; grid-template-columns: 280px 1fr; gap: 1.25rem; min-height: 100vh; padding: 1rem; background: linear-gradient(135deg, #f8fafc, #eef2ff); color: #0f172a; transition: all 200ms ease; }`,
    `.shell.dark-theme { background: linear-gradient(135deg, #020617, #0f172a); color: #f8fafc; }`,
    `.shell__sidebar { position: sticky; top: 1rem; height: calc(100vh - 2rem); }`,
    `.shell__content { display: flex; flex-direction: column; min-width: 0; }`,
    `.content-body { flex: 1; padding-bottom: 1rem; }`,
    `@media (max-width: 960px) { .shell { grid-template-columns: 1fr; } .shell__sidebar { height: auto; position: static; } }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  protected readonly theme: ThemeService = inject(ThemeService);
  protected readonly pageTitle = 'Tableau de bord';
  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Catalogue', icon: 'inventory_2', route: '/products' },
    { 
      label: 'Achats', 
      icon: 'shopping_cart', 
      children: [
        { label: 'Commandes', icon: 'receipt_long', route: '/orders' },
        { label: 'Factures', icon: 'description', route: '/invoices' },
        { label: 'Paiements', icon: 'payments', route: '/payments' }
      ]
    },
    { label: 'Livraisons', icon: 'local_shipping', route: '/deliveries' },
    { label: 'Documents', icon: 'folder_open', route: '/documents' },
    { label: 'Support Ticket', icon: 'support_agent', route: '/support' },
    { label: 'Activité', icon: 'timeline', route: '/activity' }
  ];
}


