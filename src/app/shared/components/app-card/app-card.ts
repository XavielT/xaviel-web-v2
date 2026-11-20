import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../ui/badge/badge';
import { AppCard as AppCardModel } from '../../models/app-card.model';
import { ReadMore } from '../read-more/read-more';
import { I18n } from '../../../core/i18n';
import { followPointer, releasePointer } from '../../tilt';

@Component({
  selector: 'app-app-card',
  standalone: true,
  imports: [Badge, CommonModule, ReadMore],
  templateUrl: './app-card.html',
  styleUrl: './app-card.css',
})
export class AppCard {
  @Input() app!: AppCardModel;
  readonly i18n = inject(I18n);

  onMove(event: MouseEvent) {
    followPointer(event);
  }

  onLeave(event: MouseEvent) {
    releasePointer(event);
  }

  // Links are only enabled once the target actually exists, so the section can
  // ship before the app is deployed or the APK is released.
  get hasWebApp(): boolean {
    return !!this.app.url;
  }

  get hasApk(): boolean {
    return !!this.app.apkUrl;
  }
}
