import { ChangeDetectionStrategy, Component, inject, input, signal, computed } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../Core/services/theme.service';
import { NotificationService } from '../../Core/services/notification.service';
import { ProfileService } from '../../Core/services/profile.service';
import { CartService } from '../../Core/services/cart.service';
import { LanguageService } from '../../Core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-topbar',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatMenuModule, RouterLink, TranslatePipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  title = input.required<string>();

  protected readonly theme: ThemeService = inject(ThemeService);
  protected readonly notificationService: NotificationService = inject(NotificationService);
  protected readonly profile: ProfileService = inject(ProfileService);
  protected readonly cartService: CartService = inject(CartService);
  protected readonly languageService: LanguageService = inject(LanguageService);
  private readonly router: Router = inject(Router);

  cartCount = computed(() => this.cartService.getCartCount());
  currentLanguage = computed(() => this.languageService.currentLanguage());

  erpDropdownOpen = signal<boolean>(false);
  notificationsOpen = signal<boolean>(false);
  profileOpen = signal<boolean>(false);

  recentNotifications = () => {
    return this.notificationService.notifications().slice(0, 3);
  };

  initials = () => {
    const name = this.profile.profile().name;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  toggleErpDropdown(): void {
    const current = this.erpDropdownOpen();
    this.closeAllDropdowns();
    this.erpDropdownOpen.set(!current);
  }

  toggleNotifications(): void {
    const current = this.notificationsOpen();
    this.closeAllDropdowns();
    this.notificationsOpen.set(!current);
  }

  toggleProfile(): void {
    const current = this.profileOpen();
    this.closeAllDropdowns();
    this.profileOpen.set(!current);
  }

  closeAllDropdowns(): void {
    this.erpDropdownOpen.set(false);
    this.notificationsOpen.set(false);
    this.profileOpen.set(false);
  }

  markAsRead(index: number): void {
    this.notificationService.markAsRead(index);
  }

  setLanguage(languageCode: 'fr' | 'en' | 'ar'): void {
    this.languageService.setLanguage(languageCode);
  }

  formatNotificationDate(value: string | Date): string {
    const language = this.languageService.currentLanguage();
    const locale = language === 'ar' ? 'ar' : language === 'en' ? 'en-US' : 'fr-FR';
    return formatDate(value, 'dd/MM HH:mm', locale);
  }
}
