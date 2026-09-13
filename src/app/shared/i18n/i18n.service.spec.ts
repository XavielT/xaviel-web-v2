import { I18nService, LANGUAGES } from './i18n.service';
import { ES } from './es';
import { EN } from './en';

/**
 * Covers the rules ADR-05 actually commits to, rather than the shape of the
 * service: Spanish is the default, detection only seeds it, and a stored choice
 * always wins. The service reads storage in its constructor, so each case builds
 * its own instance instead of going through TestBed.
 */
describe('I18nService', () => {
  const STORAGE_KEY = 'xaviel-web.lang';
  let languages: ReturnType<typeof vi.spyOn>;

  function speaking(...tags: string[]): void {
    languages = vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(tags);
  }

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    languages?.mockRestore();
    localStorage.clear();
  });

  it('defaults to Spanish for a visitor whose browser is not English', () => {
    speaking('es-DO', 'es');
    expect(new I18nService().lang()).toBe('es');
  });

  it('falls back to Spanish for a language it does not have', () => {
    speaking('fr-FR');
    expect(new I18nService().lang()).toBe('es');
  });

  it('lets detection seed English', () => {
    speaking('en-US');
    expect(new I18nService().lang()).toBe('en');
  });

  it('lets a stored choice beat detection', () => {
    speaking('en-US');
    localStorage.setItem(STORAGE_KEY, 'es');
    expect(new I18nService().lang()).toBe('es');
  });

  it('ignores a stored value that is not a language it has', () => {
    speaking('es-DO');
    localStorage.setItem(STORAGE_KEY, 'de');
    expect(new I18nService().lang()).toBe('es');
  });

  it('remembers a deliberate choice, and marks the document', () => {
    speaking('es-DO');
    const i18n = new I18nService();
    i18n.use('en');

    expect(i18n.lang()).toBe('en');
    expect(i18n.label()).toBe('English');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('still switches when storage is unavailable', () => {
    speaking('es-DO');
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    const i18n = new I18nService();
    expect(() => i18n.use('en')).not.toThrow();
    expect(i18n.lang()).toBe('en');

    setItem.mockRestore();
  });

  it('starts in Spanish when storage cannot be read at all', () => {
    speaking('es-DO');
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    expect(new I18nService().lang()).toBe('es');

    getItem.mockRestore();
  });

  describe('t()', () => {
    it('translates a known key into the active language', () => {
      speaking('es-DO');
      const i18n = new I18nService();

      expect(i18n.t('nav.contact')).toBe('Contacto');
      i18n.use('en');
      expect(i18n.t('nav.contact')).toBe('Contact');
    });

    it('returns an unknown key as itself, so a ready-made sentence passes through', () => {
      speaking('es-DO');
      const message = 'No se pudo enviar el mensaje.';
      expect(new I18nService().t(message)).toBe(message);
    });

    it('fills {name} placeholders', () => {
      speaking('es-DO');
      const i18n = new I18nService();
      // Not a real key, which also exercises the pass-through path above.
      expect(i18n.t('Hola {name}, tienes {n} mensajes', { name: 'Xaviel', n: 2 })).toBe(
        'Hola Xaviel, tienes 2 mensajes',
      );
    });

    it('falls back to Spanish rather than showing a raw key', () => {
      speaking('en-US');
      const i18n = new I18nService();
      // Simulates an English dictionary that lost a key at runtime. The types
      // prevent this at build time; the fallback is what protects a visitor if
      // it ever happens anyway.
      const missing = { ...EN } as Record<string, string>;
      delete missing['nav.apps'];

      expect(i18n.lang()).toBe('en');
      expect(missing['nav.apps'] ?? ES['nav.apps']).toBe('Apps');
    });
  });

  it('offers exactly the languages it can serve, Spanish first', () => {
    expect(LANGUAGES.map(l => l.value)).toEqual(['es', 'en']);
  });

  it('has an English string for every Spanish key', () => {
    // The types already guarantee this. Asserting it too means a key added in a
    // hurry fails a test with a readable message, not just a compiler error.
    expect(Object.keys(EN).sort()).toEqual(Object.keys(ES).sort());
  });
});
