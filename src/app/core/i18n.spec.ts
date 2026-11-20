import { TestBed } from '@angular/core/testing';
import { I18n } from './i18n';
import { TRANSLATIONS } from './translations';

describe('I18n', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('switches every lookup when the language is toggled', () => {
    const i18n = TestBed.inject(I18n);
    i18n.lang.set('en');
    expect(i18n.t('nav.home')).toBe('Home');
    i18n.toggle();
    expect(i18n.lang()).toBe('es');
    expect(i18n.t('nav.home')).toBe('Inicio');
  });

  it('has a Spanish string for every English key', () => {
    const missing = Object.keys(TRANSLATIONS.en).filter(k => !(k in TRANSLATIONS.es));
    expect(missing).toEqual([]);
  });
});
