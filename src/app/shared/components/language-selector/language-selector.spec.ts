import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelector } from './language-selector';
import { I18nService } from '../../i18n/i18n.service';

/**
 * Drives the selector the way a visitor does and reads the result back off the
 * rendered markup.
 *
 * This exists because the visual pass could not happen: the browser in this
 * environment cannot reach a local dev server, so `ng serve` plus a real click
 * was not available. Music Hub hit the same wall and moved its language check
 * into a component test for the same reason.
 *
 * It is not a substitute for looking at the thing — nothing here would notice a
 * longer Spanish label overflowing the navbar pill, which is the failure mode a
 * translated UI actually has. What it does prove is that the buttons render,
 * that clicking one switches the language and persists it, and that the
 * accessible names are present.
 */
describe('LanguageSelector', () => {
  let fixture: ComponentFixture<LanguageSelector>;
  let i18n: I18nService;

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button.lang-option'));
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [LanguageSelector] }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelector);
    i18n = TestBed.inject(I18nService);
    i18n.use('es');
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('renders one button per available language', () => {
    expect(buttons().map(b => b.textContent?.trim())).toEqual(['ES', 'EN']);
  });

  it('marks the active language, and only that one', () => {
    const pressed = buttons().map(b => b.getAttribute('aria-pressed'));
    expect(pressed).toEqual(['true', 'false']);
  });

  it('gives the group and each button an accessible name', () => {
    const group = fixture.nativeElement.querySelector('.lang-selector');
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Idioma');

    // The endonym, not the tag — "EN" alone would be read out as letters.
    expect(buttons()[1].getAttribute('aria-label')).toBe('Cambiar idioma a English');
  });

  it('switches language on click and remembers it', () => {
    buttons()[1].click();
    fixture.detectChanges();

    expect(i18n.lang()).toBe('en');
    expect(localStorage.getItem('xaviel-web.lang')).toBe('en');
    expect(buttons().map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
  });

  it('relabels its own group when the language changes', () => {
    buttons()[1].click();
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('.lang-selector');
    expect(group.getAttribute('aria-label')).toBe('Language');
    expect(buttons()[1].getAttribute('aria-label')).toBe('Switch language to English');
  });

  it('uses buttons, so there is nothing to navigate to', () => {
    // The page is one long anchor-scrolled column; an <a href> here would jump
    // the visitor to the top on every switch.
    for (const button of buttons()) {
      expect(button.tagName).toBe('BUTTON');
      expect(button.getAttribute('type')).toBe('button');
      expect(button.hasAttribute('href')).toBe(false);
    }
  });
});
