import { TranslationKey } from './es';

/**
 * English dictionary.
 *
 * Typed as a complete record of `TranslationKey`, so the build fails if a key is
 * added to `es.ts` and forgotten here — a missing key would otherwise surface as
 * the Spanish string (the fallback in `I18nService.t`) sitting in an English
 * page, which is exactly the kind of thing nobody notices until a visitor does.
 *
 * Natural English, not transliterated Spanish. Proper nouns, project names, app
 * names and technical terms are not translated.
 *
 * SCAFFOLD ONLY — see the note in `es.ts`.
 */
export const EN: Record<TranslationKey, string> = {
  // --- navigation ---------------------------------------------------------
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.mainProjects': 'Main Projects',
  'nav.apps': 'Apps',
  'nav.skills': 'Skills',
  'nav.certificates': 'Certificates',
  'nav.contact': 'Contact',

  // --- language selector --------------------------------------------------
  'lang.label': 'Language',
};
