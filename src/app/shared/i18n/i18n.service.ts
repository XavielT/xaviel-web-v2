import { Injectable, computed, signal } from '@angular/core';
import { ES, TranslationKey } from './es';
import { EN } from './en';

export type Lang = 'es' | 'en';

export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

/** Namespaced so it never collides with another app on the same origin. */
const STORAGE_KEY = 'xaviel-web.lang';

const DEFAULT_LANG: Lang = 'es';

const DICTIONARIES: Record<Lang, Record<TranslationKey, string>> = { es: ES, en: EN };

export function isLang(value: unknown): value is Lang {
  return value === 'es' || value === 'en';
}

/**
 * Runtime translation for the whole site.
 *
 * Ported from Music Hub's `I18nService` (see that repo's
 * `src/shared/services/i18n.service.ts`), which is the reference ADR-05 points
 * at. Three deliberate differences, because this site is not that app:
 *
 *  - **Spanish is the default and the source of shape.** Music Hub leads with
 *    English; here `es.ts` defines `TranslationKey` and is the fallback when a
 *    key is missing.
 *  - **No `applyRemote` / `applyDefault`.** Those existed to let a Supabase
 *    profile and a library-wide setting outrank the device. This site has no
 *    auth and no settings table, so the device's choice is the only input
 *    besides detection. If Phase 2 ever adds a profile language, that is when
 *    the remote override comes back — not before.
 *  - **Its own storage key**, so an installed Music Hub and this site never read
 *    each other's choice.
 *
 * Both dictionaries are imported statically rather than fetched. Two languages
 * of ~100 short strings cost a handful of KB, and paying that buys the two
 * things lazy JSON would have cost: no async gap where the first paint shows
 * keys instead of words, and nothing extra to teach the service worker in
 * Phase 7, so it still reads right offline.
 *
 * The service knows nothing about the rest of the app. Components that emit
 * user-facing text inject this one; it injects none of them.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private _lang = signal<Lang>(DEFAULT_LANG);
  lang = this._lang.asReadonly();

  label = computed(
    () => LANGUAGES.find(l => l.value === this._lang())?.label ?? 'Español',
  );

  constructor() {
    // A stored choice always outranks detection (ADR-05): detection only
    // decides for somebody who has never answered.
    const stored = this.stored();
    this.apply(stored ?? browserLanguage());
  }

  /**
   * Translate. Unknown keys come back as themselves, which is what makes it
   * safe to pass a string that is already a sentence — a server error the site
   * did not write, say — through the same call as a real key.
   */
  t(key: TranslationKey | string, params?: Record<string, string | number>): string {
    const dict = DICTIONARIES[this._lang()];
    let text =
      (dict as Record<string, string>)[key] ?? (ES as Record<string, string>)[key] ?? key;
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.split(`{${name}}`).join(String(value));
      }
    }
    return text;
  }

  /** A deliberate choice by the visitor: applied, and remembered on this device. */
  use(lang: Lang): void {
    this.apply(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Private window, or site data blocked. The choice still holds for this
      // session; it just will not survive the tab.
    }
  }

  private apply(lang: Lang): void {
    this._lang.set(lang);
    // Keeps the document honest for screen readers, and stops the browser
    // offering to translate a page that just translated itself.
    try {
      document.documentElement.lang = lang;
    } catch {
      /* no document (tests) */
    }
  }

  private stored(): Lang | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return isLang(raw) ? raw : null;
    } catch {
      return null;
    }
  }
}

// 'en-US', 'en-GB' and plain 'en' all mean English here; everything else falls
// to Spanish, which is both the default and the right guess for the audience.
// Note this is inverted from Music Hub, where the fallback is English.
function browserLanguage(): Lang {
  try {
    const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const tag of tags) {
      if (typeof tag === 'string' && tag.toLowerCase().startsWith('en')) return 'en';
    }
  } catch {
    /* no navigator (tests) */
  }
  return DEFAULT_LANG;
}
