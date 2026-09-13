import { Component, inject } from '@angular/core';
import { NgFor, UpperCasePipe } from '@angular/common';
import { I18nService, Lang, LANGUAGES } from '../../i18n/i18n.service';
import { TPipe } from '../../i18n/t.pipe';

/**
 * Picks the language the site renders in.
 *
 * A row of buttons rather than a dropdown, for three reasons: native keyboard
 * and screen-reader behaviour with no ARIA beyond a group label and
 * `aria-pressed`; nothing to open, so no outside-click handling or focus
 * trapping; and no navigation, which is what keeps the visitor's scroll
 * position on a page that is one long anchor-scrolled column.
 *
 * The row is built from `LANGUAGES`, so a third language appears here by adding
 * one entry to that array — there is no two-way toggle to unpick.
 *
 * The buttons show the tag ("ES", "EN") because the navbar is tight; the full
 * endonym goes in each button's accessible name instead. Endonyms are not
 * translated — "Español" reads the same whichever language is active.
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [NgFor, UpperCasePipe, TPipe],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css',
})
export class LanguageSelector {
  private i18n = inject(I18nService);

  readonly languages = LANGUAGES;
  readonly current = this.i18n.lang;

  select(lang: Lang): void {
    this.i18n.use(lang);
  }
}
