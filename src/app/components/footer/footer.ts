import { Component } from '@angular/core';
import { Xlogo } from '../xlogo/xlogo';
import { TPipe } from '../../shared/i18n/t.pipe';

@Component({
  selector: 'app-footer',
  imports: [Xlogo, TPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

}
