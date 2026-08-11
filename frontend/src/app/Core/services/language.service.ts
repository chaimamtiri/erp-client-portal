import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LanguageCode = 'fr' | 'en' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  labelKey: string;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', labelKey: 'LANGUAGE.FRENCH' },
  { code: 'en', labelKey: 'LANGUAGE.ENGLISH' },
  { code: 'ar', labelKey: 'LANGUAGE.ARABIC' }
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate: TranslateService = inject(TranslateService);
  private readonly storageKey = 'erp_lang';

  readonly languages = SUPPORTED_LANGUAGES;
  readonly currentLanguage = signal<LanguageCode>('fr');

  initialize(): void {
    const storedLang = this.readStoredLanguage();
    const browserLang = this.normalizeLanguage(this.translate.getBrowserLang());
    const initialLang = storedLang ?? browserLang ?? 'fr';

    this.currentLanguage.set(initialLang);
    this.persistLanguage(initialLang);
    this.applyDirection(initialLang);
    this.translate.use(initialLang);
  }

  setLanguage(lang: LanguageCode): void {
    const normalizedLang = this.normalizeLanguage(lang);

    if (this.currentLanguage() === normalizedLang) {
      return;
    }

    this.translate.use(normalizedLang);
    this.currentLanguage.set(normalizedLang);
    this.persistLanguage(normalizedLang);
    this.applyDirection(normalizedLang);
  }

  getCurrentLang(): string {
    return this.currentLanguage();
  }

  private readStoredLanguage(): LanguageCode | null {
    const storedLang = localStorage.getItem(this.storageKey);
    return this.normalizeLanguage(storedLang);
  }

  private persistLanguage(lang: LanguageCode): void {
    localStorage.setItem(this.storageKey, lang);
  }

  private applyDirection(lang: LanguageCode): void {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = direction;
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
  }

  private normalizeLanguage(lang: string | null | undefined): LanguageCode {
    if (lang === 'fr' || lang === 'en' || lang === 'ar') {
      return lang;
    }
    return 'fr';
  }
}
