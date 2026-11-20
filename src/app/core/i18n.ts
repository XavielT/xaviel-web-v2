import { Injectable, effect, signal } from '@angular/core';
import { Lang, TRANSLATIONS, TranslationKey } from './translations';

const STORAGE_KEY = 'lang';

/**
 * Language state for the whole site. Components call `t('some.key')` in their templates;
 * because `lang` is a signal, every translated string updates the moment it changes.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>(this.initialLang());

  constructor() {
    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      document.title = TRANSLATIONS[lang]['doc.title'];
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', TRANSLATIONS[lang]['doc.description']);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Storage can be blocked (private window); the choice just won't persist.
      }
    });
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[this.lang()][key];
  }

  toggle() {
    this.lang.set(this.lang() === 'en' ? 'es' : 'en');
  }

  /** Saved choice first, then the browser language, then English. */
  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'es') return saved;
    } catch {
      // ignore
    }
    return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
  }
}
