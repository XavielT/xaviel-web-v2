import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCard } from '../components/app-card/app-card';
import { Footer } from '../../components/footer/footer';
import { I18nService } from './i18n.service';

/**
 * Renders real components in both languages and reads the words back off them.
 *
 * The point is the indirection that is easy to get wrong and invisible to a
 * typecheck: `app.ts` stores TranslationKeys in the data arrays rather than
 * prose, and the card templates resolve them with `| t`. A key that never
 * reaches a dictionary renders as itself — "app.musicHub.description" sitting
 * on the page — and nothing else in the suite would catch it.
 *
 * Same caveat as the selector's spec: this is not a visual check, and the
 * browser in this environment cannot reach a local dev server to do one.
 */
describe('renders in both languages', () => {
  const musicHub = {
    icon: '/assets/apps-imgs/music-hub.png',
    name: 'Music Hub',
    description: 'app.musicHub.description',
    badges: ['Angular', 'Supabase'],
    url: 'https://music-hub-xaviel.vercel.app',
    apkUrl: 'https://github.com/XavielT/music-hub/releases/latest',
    iosHint: 'apps.iosHint',
  };

  let fixture: ComponentFixture<AppCard>;
  let i18n: I18nService;

  function text(): string {
    return fixture.nativeElement.textContent ?? '';
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [AppCard] }).compileComponents();

    fixture = TestBed.createComponent(AppCard);
    i18n = TestBed.inject(I18nService);
    fixture.componentRef.setInput('app', musicHub);
  });

  afterEach(() => localStorage.clear());

  it('resolves the catalog keys into Spanish prose', () => {
    i18n.use('es');
    fixture.detectChanges();

    expect(text()).toContain('App de música personal');
    expect(text()).toContain('Abrir app');
    expect(text()).toContain('APK de Android');
    expect(text()).toContain('Añadir a pantalla de inicio');
  });

  it('resolves the same keys into English', () => {
    i18n.use('en');
    fixture.detectChanges();

    expect(text()).toContain('A personal music app');
    expect(text()).toContain('Open app');
    expect(text()).toContain('Android APK');
    expect(text()).toContain('Add to Home Screen');
  });

  it('leaves no raw keys on the page in either language', () => {
    for (const lang of ['es', 'en'] as const) {
      i18n.use(lang);
      fixture.detectChanges();
      // Every key in this project is dotted; prose is not.
      expect(text()).not.toMatch(/\b(app|apps|appCard)\.[a-zA-Z]+/);
    }
  });

  it('keeps proper nouns untranslated', () => {
    for (const lang of ['es', 'en'] as const) {
      i18n.use(lang);
      fixture.detectChanges();
      expect(text()).toContain('Music Hub');
      expect(text()).toContain('Angular');
      expect(text()).toContain('Supabase');
    }
  });

  it('fills the {name} placeholder in the icon alt text', () => {
    i18n.use('es');
    fixture.detectChanges();

    const icon: HTMLImageElement = fixture.nativeElement.querySelector('.app-card-icon');
    expect(icon.getAttribute('alt')).toBe('Icono de Music Hub');
  });

  it('switches a rendered component in place, without rebuilding it', async () => {
    i18n.use('es');
    fixture.detectChanges();
    expect(text()).toContain('Abrir app');

    // The same component instance, no re-creation: this is what the impure pipe
    // buys, and what keeps the visitor's scroll position on a switch.
    i18n.use('en');
    fixture.detectChanges();
    expect(text()).toContain('Open app');
    expect(text()).not.toContain('Abrir app');
  });

});

/**
 * Separate module, because the footer needs its own TestBed and the one above
 * has already been instantiated by `createComponent`.
 */
describe('footer renders in both languages', () => {
  let footer: ComponentFixture<Footer>;
  let i18n: I18nService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [Footer] }).compileComponents();

    footer = TestBed.createComponent(Footer);
    i18n = TestBed.inject(I18nService);
  });

  afterEach(() => localStorage.clear());

  it('translates the rights line that was already Spanish before this phase', () => {
    i18n.use('en');
    footer.detectChanges();
    expect(footer.nativeElement.textContent).toContain('All rights reserved');

    i18n.use('es');
    footer.detectChanges();
    expect(footer.nativeElement.textContent).toContain('Todos los derechos reservados');
  });

  it('leaves the brand names alone', () => {
    i18n.use('es');
    footer.detectChanges();
    const text = footer.nativeElement.textContent;
    expect(text).toContain('GitHub');
    expect(text).toContain('Linkedin');
    expect(text).toContain('Gmail');
  });
});
