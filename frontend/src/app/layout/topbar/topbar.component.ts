import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService, LanguageCode } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    TranslatePipe
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  protected readonly profile = inject(ProfileService);
  private readonly authService = inject(AuthService);
  protected readonly languageService = inject(LanguageService);
  protected readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly currentLanguage = this.languageService.currentLanguage;
  readonly title = signal('ERP Portal');
  readonly profileOpen = signal(false);
  readonly notificationsOpen = signal(false);
  readonly cartCount = signal(0);

  readonly initials = computed(() => {
    const name = this.profile.profile()?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  });

  readonly recentNotifications = computed(() => {
    return this.notificationService.notifications().slice(0, 5);
  });

  ngOnInit(): void {
    this.profile.loadCurrentUser().subscribe();
    this.notificationService.loadNotifications().subscribe();
  }

  toggleProfile(): void {
    this.profileOpen.update(v => !v);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
  }

  closeAllDropdowns(): void {
    this.profileOpen.set(false);
    this.notificationsOpen.set(false);
  }

  setLanguage(lang: LanguageCode): void {
    this.languageService.setLanguage(lang);
    this.closeAllDropdowns();
  }

  markAsRead(index: number): void {
    this.notificationService.toggleReadStatus(index);
  }

  formatNotificationDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(this.currentLanguage(), {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
