/**
 * Spanish dictionary — the default language, and the shape every other language
 * must match.
 *
 * `TranslationKey` is derived from this object and `en.ts` is typed as a
 * complete record of it, so a missing or misspelled English key fails the build
 * rather than quietly showing the raw key to a visitor.
 *
 * Note this is the reverse of Music Hub, where English is the source of shape.
 * Spanish leads here because Spanish is this site's default (ADR-05), and the
 * dictionary that defines the keys should be the one that is never incomplete.
 *
 * Keys are dotted and grouped by section, matching the page's own sections.
 * `{name}` placeholders are filled by `t(key, { name })`.
 *
 * SCAFFOLD ONLY. Phase 1 extracts the site's remaining ~100 strings into here —
 * the navbar below is the worked example, not the finished job. The templates
 * still carry their own literals until that phase wires the pipe in; nothing
 * reads this file yet.
 */
export const ES = {
  // --- navigation ---------------------------------------------------------
  'nav.home': 'Inicio',
  'nav.about': 'Sobre mí',
  'nav.mainProjects': 'Proyectos',
  'nav.apps': 'Apps',
  'nav.skills': 'Habilidades',
  'nav.certificates': 'Certificados',
  'nav.contact': 'Contacto',

  // --- language selector --------------------------------------------------
  'lang.label': 'Idioma',
} as const;

export type TranslationKey = keyof typeof ES;
