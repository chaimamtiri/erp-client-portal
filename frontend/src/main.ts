import 'zone.js';
import { registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import localeAr from '@angular/common/locales/ar';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeAr, 'ar');
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeFr, 'fr-FR');

// Ensure Material icon fonts load even if index.html hasn't been reloaded
(function injectMaterialIconLinks(){
  try {
    const links = [
      { href: 'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap' },
      { href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap' }
    ];
    for (const l of links) {
      if (!document.querySelector(`link[href="${l.href}"]`)) {
        const el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = l.href;
        document.head.appendChild(el);
      }
    }
  } catch (e) { /* ignore during server-side or CSP failures */ }
})();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
