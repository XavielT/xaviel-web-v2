import { Component, inject } from '@angular/core';
import { Xlogo } from '../xlogo/xlogo';
import { I18n } from '../../core/i18n';

@Component({
  selector: 'app-footer',
  imports: [Xlogo],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly i18n = inject(I18n);

}
