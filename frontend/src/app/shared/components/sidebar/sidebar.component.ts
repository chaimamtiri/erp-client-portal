import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar__brand">
        <div class="sidebar__brand-mark">E</div>
        <div>
          <div class="sidebar__brand-name">ErpClient</div>
          <div class="sidebar__brand-subtitle">Portail client</div>
        </div>
      </div>

      <nav class="sidebar__nav" aria-label="Navigation principale">
        @for (item of items(); track item.label) {
          @if (hasChildren(item)) {
            <div class="sidebar__dropdown">
              <button class="sidebar__link sidebar__dropdown-toggle" (click)="toggleDropdown(item.label)" [class.expanded]="expandedDropdown() === item.label">
                <mat-icon>{{ item.icon }}</mat-icon>
                <span>{{ item.label }}</span>
                <mat-icon class="chevron">expand_more</mat-icon>
              </button>
              @if (expandedDropdown() === item.label) {
                <div class="sidebar__dropdown-menu">
                  @for (child of item.children; track child.label) {
                    <a class="sidebar__dropdown-item" [routerLink]="child.route" routerLinkActive="active">
                      <mat-icon>{{ child.icon }}</mat-icon>
                      <span>{{ child.label }}</span>
                    </a>
                  }
                </div>
              }
            </div>
          } @else {
            <a class="sidebar__link" [routerLink]="item.route" routerLinkActive="active">
              <mat-icon>{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </a>
          }
        }
      </nav>
    </aside>
  `,
  styles: [
    `:host { display: block; height: 100%; }`,
    `.sidebar { height: 100%; min-height: auto; padding: 1.25rem 1rem; background: rgba(15, 23, 42, 0.98); color: #e2e8f0; border-radius: 24px; display: flex; flex-direction: column; gap: 1.5rem; overflow: visible; }`,
    `.sidebar__brand { display: flex; align-items: center; gap: 0.8rem; padding: 0.2rem 0.4rem; min-width: 0; }`,
    `.sidebar__brand-mark { width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; background: linear-gradient(135deg, #2563eb, #4f46e5); font-weight: 700; flex-shrink: 0; }`,
    `.sidebar__brand-name { font-weight: 700; }`,
    `.sidebar__brand-subtitle { font-size: 0.82rem; color: #94a3b8; }`,
    `.sidebar__nav { display: flex; flex-direction: column; gap: 0.35rem; overflow: visible; }`,
    `.sidebar__link { display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem 0.9rem; border-radius: 12px; color: inherit; text-decoration: none; transition: background 180ms ease; min-width: 0; white-space: normal; width: 100%; border: none; background: none; cursor: pointer; font-family: inherit; font-size: inherit; }`,
    `.sidebar__link:hover, .sidebar__link.active { background: rgba(37,99,235,0.18); color: #fff; }`,
    `.sidebar__dropdown { display: flex; flex-direction: column; gap: 0.25rem; }`,
    `.sidebar__dropdown-toggle { justify-content: space-between; }`,
    `.sidebar__dropdown-toggle .chevron { transition: transform 180ms ease; font-size: 20px; width: 20px; height: 20px; }`,
    `.sidebar__dropdown-toggle.expanded .chevron { transform: rotate(180deg); }`,
    `.sidebar__dropdown-menu { display: flex; flex-direction: column; gap: 0.15rem; padding-left: 2.5rem; margin-top: 0.25rem; }`,
    `.sidebar__dropdown-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.8rem; border-radius: 10px; color: #94a3b8; text-decoration: none; transition: all 180ms ease; font-size: 0.9rem; }`,
    `.sidebar__dropdown-item:hover, .sidebar__dropdown-item.active { background: rgba(37,99,235,0.15); color: #fff; }`,
    `.sidebar__dropdown-item mat-icon { font-size: 18px; width: 18px; height: 18px; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  items = input.required<NavItem[]>();

  expandedDropdown = signal<string | null>(null);

  toggleDropdown(label: string): void {
    this.expandedDropdown.set(this.expandedDropdown() === label ? null : label);
  }

  hasChildren(item: NavItem): boolean {
    return !!(item.children && item.children.length > 0);
  }
}

