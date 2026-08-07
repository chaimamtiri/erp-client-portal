import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, NavItem } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ChatbotComponent } from '../../ui/chatbot/chatbot.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, FooterComponent, ChatbotComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  navItems: NavItem[] = [
    { label: 'SIDEBAR.DASHBOARD', icon: 'dashboard', route: '/dashboard' },
    { label: 'SIDEBAR.ORDERS', icon: 'shopping_bag', route: '/orders' },
    { label: 'SIDEBAR.CART', icon: 'shopping_cart', route: '/cart' },
    { label: 'SIDEBAR.CATALOG', icon: 'inventory_2', route: '/products' },
    { label: 'SIDEBAR.DELIVERIES', icon: 'local_shipping', route: '/deliveries' },
    { label: 'SIDEBAR.INVOICES', icon: 'receipt', route: '/invoices' },
    { label: 'SIDEBAR.PAYMENTS', icon: 'payments', route: '/payments' },
    { label: 'SIDEBAR.DOCUMENTS', icon: 'folder', route: '/documents' },
    { label: 'SIDEBAR.NOTIFICATIONS', icon: 'notifications', route: '/notifications' },
    { label: 'SIDEBAR.PROFILE', icon: 'person', route: '/profile' },
    { label: 'SIDEBAR.SETTINGS', icon: 'settings', route: '/settings' },
    { label: 'SIDEBAR.SUPPORT', icon: 'headset', route: '/support' }
  ];
}