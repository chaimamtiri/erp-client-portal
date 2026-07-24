import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly darkMode = signal(false);

  toggleTheme(): void {
    this.darkMode.set(!this.darkMode());
  }

  setTheme(value: boolean): void {
    this.darkMode.set(value);
  }
}
