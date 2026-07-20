import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ThemeService } from '../../../services/theme.service';
import { NotificationService } from '../../../services/notification.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-topbar',
  imports: [DatePipe, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <header class="topbar">
      <!-- Left side: Title and Search -->
      <div class="topbar__left">
        <div class="topbar__title-block">
          <div class="topbar__eyebrow">Portail client ERP</div>
          <h1>{{ title() }}</h1>
        </div>

        <mat-form-field appearance="outline" class="topbar__search">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput placeholder="Recherche globale..." />
        </mat-form-field>
      </div>

      <!-- Right side: Actions -->
      <div class="topbar__actions">
        <!-- ERP Selector -->

        <!-- Theme Toggle -->
        <button mat-icon-button (click)="theme.toggleTheme()" aria-label="Changer le thème">
          @if (theme.darkMode()) {
            <mat-icon>light_mode</mat-icon>
          } @else {
            <mat-icon>dark_mode</mat-icon>
          }
        </button>

        <!-- Notifications Bell -->
        <div class="topbar__dropdown-wrapper">
          <button mat-icon-button (click)="toggleNotifications()" aria-label="Notifications" class="bell-btn">
            <mat-icon>notifications</mat-icon>
            @if (notifications.unreadCount() > 0) {
              <span class="bell-badge">{{ notifications.unreadCount() }}</span>
            }
          </button>

          @if (notificationsOpen()) {
            <div class="dropdown-panel notification-panel">
              <div class="dropdown-panel__header">
                <h3>Notifications</h3>
                @if (notifications.unreadCount() > 0) {
                  <button mat-button class="mark-all-btn" (click)="notifications.markAllAsRead()">Tout marquer comme lu</button>
                }
              </div>
              
              <div class="dropdown-panel__body">
                @if (notifications.notifications().length === 0) {
                  <div class="empty-state">
                    <mat-icon>notifications_off</mat-icon>
                    <p>Aucune notification</p>
                  </div>
                } @else {
                  @for (notif of recentNotifications(); track notif.titre; let idx = $index) {
                    <div class="notification-preview-item" [class.unread]="!notif.est_lu" (click)="markAsRead(idx)">
                      <div class="notif-dot"></div>
                      <div class="notif-content">
                        <strong>{{ notif.titre }}</strong>
                        <p>{{ notif.message }}</p>
                        <span class="notif-time">{{ notif.date_creation | date: 'dd/MM HH:mm' }}</span>
                      </div>
                    </div>
                  }
                }
              </div>

              <div class="dropdown-panel__footer">
                <a routerLink="/notifications" class="view-all-link" (click)="closeAllDropdowns()">Voir toutes les notifications</a>
              </div>
            </div>
          }
        </div>

        <!-- Settings Shortcut -->
        <button mat-icon-button routerLink="/settings" aria-label="Paramètres">
          <mat-icon>settings</mat-icon>
        </button>

        <!-- Profile Avatar Dropdown -->
        <div class="topbar__dropdown-wrapper">
          <button class="profile-avatar-btn" (click)="toggleProfile()" aria-label="Menu profil">
            <div class="avatar-circle">
              {{ initials() }}
            </div>
            <span class="profile-name">{{ profile.profile().name }}</span>
            <mat-icon class="chevron">expand_more</mat-icon>
          </button>

          @if (profileOpen()) {
            <div class="dropdown-panel profile-panel">
              <div class="profile-panel__header">
                <div class="avatar-large">{{ initials() }}</div>
                <div>
                  <h4>{{ profile.profile().name }}</h4>
                  <p>{{ profile.profile().role }}</p>
                </div>
              </div>
              <div class="profile-panel__body">
                <a routerLink="/profile" class="profile-menu-item" (click)="closeAllDropdowns()">
                  <mat-icon>person</mat-icon>
                  <span>Mon Profil & Adresses</span>
                </a>
                <a routerLink="/settings" class="profile-menu-item" (click)="closeAllDropdowns()">
                  <mat-icon>settings</mat-icon>
                  <span>Paramètres</span>
                </a>
                <a routerLink="/notifications" class="profile-menu-item" (click)="closeAllDropdowns()">
                  <mat-icon>notifications</mat-icon>
                  <span>Centre d'alertes</span>
                </a>
              </div>
              <div class="profile-panel__footer">
                <button class="logout-btn">
                  <mat-icon>logout</mat-icon>
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
    .topbar { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; padding: 0.8rem 0 1.25rem; }
    .topbar__left { display: flex; align-items: center; gap: 2rem; flex: 1; }
    .topbar__title-block h1 { margin: 0; font-size: 1.4rem; font-weight: 700; color: #0f172a; }
    .topbar__eyebrow { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; }
    .topbar__search { min-width: 320px; max-width: 420px; }
    .topbar__search ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .topbar__search ::ng-deep .mat-mdc-text-field-wrapper { border-radius: 999px !important; background: white !important; }
    .topbar__actions { display: flex; align-items: center; gap: 0.8rem; }
    
    /* ERP selector badge */
    .topbar__erp-select { position: relative; }
    .erp-badge { display: flex; align-items: center; gap: 0.5rem; background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.15); color: #2563eb; font-weight: 600; padding: 0.5rem 0.9rem; border-radius: 999px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s ease; }
    .erp-badge:hover { background: rgba(37,99,235,0.15); }
    .erp-badge mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .erp-badge .chevron { font-size: 18px; width: 18px; height: 18px; margin-left: 0.2rem; }
    .erp-menu { position: absolute; top: 100%; right: 0; margin-top: 0.5rem; width: 180px; z-index: 1000; }
    .dropdown-menu { background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 0.4rem; display: flex; flex-direction: column; gap: 0.2rem; }
    .dropdown-item { border: none; background: none; text-align: left; padding: 0.5rem 0.8rem; border-radius: 8px; font-size: 0.85rem; color: #475569; cursor: pointer; transition: all 0.2s ease; }
    .dropdown-item:hover, .dropdown-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }

    /* Notifications Badge */
    .bell-btn { position: relative; }
    .bell-badge { position: absolute; top: 4px; right: 4px; background: #ef4444; color: white; font-size: 0.68rem; font-weight: 700; min-width: 16px; height: 16px; border-radius: 999px; display: grid; place-items: center; padding: 0 4px; border: 2px solid #f8fafc; }

    /* Dropdown Wrapper & Panels */
    .topbar__dropdown-wrapper { position: relative; }
    .dropdown-panel { position: absolute; top: 100%; right: 0; margin-top: 0.6rem; width: 340px; background: white; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 1000; display: flex; flex-direction: column; overflow: hidden; animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    
    .dropdown-panel__header { padding: 0.9rem 1.2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
    .dropdown-panel__header h3 { margin: 0; font-size: 0.95rem; font-weight: 600; color: #1e293b; }
    .mark-all-btn { font-size: 0.78rem; height: auto; padding: 0.2rem 0.5rem; line-height: 1; color: #2563eb; }
    
    .dropdown-panel__body { max-height: 280px; overflow-y: auto; }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; color: #94a3b8; gap: 0.5rem; }
    .empty-state mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .empty-state p { margin: 0; font-size: 0.85rem; }
    
    .notification-preview-item { display: flex; gap: 0.8rem; padding: 0.8rem 1.2rem; border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.2s ease; position: relative; }
    .notification-preview-item:hover { background: #f8fafc; }
    .notification-preview-item.unread { background: #eff6ff; }
    .notification-preview-item.unread .notif-dot { background: #2563eb; }
    .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: transparent; margin-top: 0.35rem; flex-shrink: 0; }
    .notif-content { display: flex; flex-direction: column; gap: 0.15rem; }
    .notif-content strong { font-size: 0.85rem; color: #1e293b; font-weight: 600; }
    .notif-content p { margin: 0; font-size: 0.8rem; color: #64748b; line-height: 1.3; }
    .notif-time { font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem; }
    
    .dropdown-panel__footer { padding: 0.8rem; border-top: 1px solid #f1f5f9; text-align: center; background: #f8fafc; }
    .view-all-link { font-size: 0.82rem; color: #2563eb; font-weight: 600; text-decoration: none; display: inline-block; }
    .view-all-link:hover { text-decoration: underline; }

    /* User profile button & panel */
    .profile-avatar-btn { display: flex; align-items: center; gap: 0.6rem; border: none; background: white; padding: 0.3rem 0.6rem; border-radius: 999px; cursor: pointer; border: 1px solid #e2e8f0; transition: all 0.2s ease; }
    .profile-avatar-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
    .avatar-circle { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; display: grid; place-items: center; font-weight: 700; font-size: 0.85rem; }
    .profile-name { font-weight: 600; font-size: 0.88rem; color: #334155; }
    .profile-avatar-btn .chevron { font-size: 18px; width: 18px; height: 18px; color: #64748b; }
    
    .profile-panel { width: 260px; }
    .profile-panel__header { padding: 1.2rem; display: flex; align-items: center; gap: 0.8rem; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
    .avatar-large { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; display: grid; place-items: center; font-weight: 700; font-size: 1.1rem; }
    .profile-panel__header h4 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
    .profile-panel__header p { margin: 0; font-size: 0.78rem; color: #64748b; }
    
    .profile-panel__body { padding: 0.5rem; display: flex; flex-direction: column; gap: 0.2rem; }
    .profile-menu-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.8rem; border-radius: 8px; color: #475569; text-decoration: none; font-size: 0.85rem; transition: all 0.2s ease; }
    .profile-menu-item:hover { background: #f1f5f9; color: #0f172a; }
    .profile-menu-item mat-icon { font-size: 18px; width: 18px; height: 18px; color: #64748b; }
    
    .profile-panel__footer { padding: 0.5rem; border-top: 1px solid #f1f5f9; }
    .logout-btn { width: 100%; border: none; background: none; display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.8rem; border-radius: 8px; color: #ef4444; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; }
    .logout-btn:hover { background: #fef2f2; }
    .logout-btn mat-icon { font-size: 18px; width: 18px; height: 18px; color: #ef4444; }

    /* Dark Mode override styling */
    .dark-theme .topbar__title-block h1 { color: #f8fafc; }
    .dark-theme .topbar__search ::ng-deep .mat-mdc-text-field-wrapper { background: #1e293b !important; }
    .dark-theme .topbar__search ::ng-deep input { color: #f8fafc !important; }
    .dark-theme .topbar__search ::ng-deep mat-icon { color: #94a3b8 !important; }
    .dark-theme .erp-badge { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.25); color: #60a5fa; }
    .dark-theme .erp-badge:hover { background: rgba(59,130,246,0.25); }
    .dark-theme .profile-avatar-btn { background: #1e293b; border-color: #334155; }
    .dark-theme .profile-avatar-btn:hover { background: #334155; }
    .dark-theme .profile-name { color: #e2e8f0; }
    .dark-theme .profile-avatar-btn .chevron { color: #94a3b8; }
    .dark-theme .dropdown-panel, .dark-theme .dropdown-menu { background: #1e293b; border-color: #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .dark-theme .dropdown-panel__header { border-bottom-color: #334155; }
    .dark-theme .dropdown-panel__header h3 { color: #f8fafc; }
    .dark-theme .dropdown-panel__footer { border-top-color: #334155; background: #0f172a; }
    .dark-theme .mark-all-btn, .dark-theme .view-all-link { color: #60a5fa; }
    .dark-theme .notification-preview-item { border-bottom-color: #334155; }
    .dark-theme .notification-preview-item:hover { background: #334155; }
    .dark-theme .notification-preview-item.unread { background: rgba(37,99,235,0.15); }
    .dark-theme .notif-content strong { color: #f8fafc; }
    .dark-theme .notif-content p { color: #cbd5e1; }
    .dark-theme .notif-time { color: #64748b; }
    .dark-theme .profile-panel__header { background: #0f172a; border-bottom-color: #334155; }
    .dark-theme .profile-panel__header h4 { color: #f8fafc; }
    .dark-theme .profile-panel__header p { color: #94a3b8; }
    .dark-theme .profile-menu-item { color: #cbd5e1; }
    .dark-theme .profile-menu-item:hover { background: #334155; color: #f8fafc; }
    .dark-theme .profile-menu-item mat-icon { color: #cbd5e1; }
    .dark-theme .profile-panel__footer { border-top-color: #334155; }
    .dark-theme .logout-btn:hover { background: rgba(239,68,68,0.1); }
    .dark-theme .dropdown-item { color: #cbd5e1; }
    .dark-theme .dropdown-item:hover, .dark-theme .dropdown-item.active { background: rgba(37,99,235,0.15); color: #60a5fa; }

    @media (max-width: 768px) {
      .topbar__search { display: none; }
      .profile-name, .profile-avatar-btn .chevron { display: none; }
      .erp-badge span, .erp-badge .chevron { display: none; }
      .erp-badge { padding: 0.5rem; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  title = input.required<string>();

  protected readonly theme = inject(ThemeService);
  protected readonly notifications = inject(NotificationService);
  protected readonly profile = inject(ProfileService);
  private readonly router = inject(Router);

  erpDropdownOpen = signal<boolean>(false);
  notificationsOpen = signal<boolean>(false);
  profileOpen = signal<boolean>(false);

  recentNotifications = () => {
    return this.notifications.notifications().slice(0, 3);
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
    this.notifications.markAsRead(index);
  }
}
