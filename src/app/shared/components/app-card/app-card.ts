import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../ui/badge/badge';
import { AppCard as AppCardModel } from '../../models/app-card.model';

@Component({
  selector: 'app-app-card',
  standalone: true,
  imports: [Badge, CommonModule],
  templateUrl: './app-card.html',
  styleUrl: './app-card.css',
})
export class AppCard {
  @Input() app!: AppCardModel;

  // Links are only enabled once the target actually exists, so the section can
  // ship before the app is deployed or the APK is released.
  get hasWebApp(): boolean {
    return !!this.app.url;
  }

  get hasApk(): boolean {
    return !!this.app.apkUrl;
  }
}
