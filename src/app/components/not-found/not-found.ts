import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';

/**
 * Shown for any address that is not the home page. The whole site is a single page at "/",
 * so this is a full-screen layer over it with a clear way back.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  readonly i18n = inject(I18n);
}
