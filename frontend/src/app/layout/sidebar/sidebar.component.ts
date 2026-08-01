import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  host: {
    '[class.is-collapsed]': 'isCollapsed()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  items = input.required<NavItem[]>();

  expandedDropdown = signal<string | null>(null);
  isCollapsed = signal(false);

  toggleSidebar(): void {
    const nextValue = !this.isCollapsed();
    this.isCollapsed.set(nextValue);

    if (nextValue) {
      this.expandedDropdown.set(null);
    }
  }

  toggleDropdown(label: string): void {
    if (this.isCollapsed()) {
      return;
    }

    this.expandedDropdown.set(this.expandedDropdown() === label ? null : label);
  }

  hasChildren(item: NavItem): boolean {
    return !!(item.children && item.children.length > 0);
  }
}
