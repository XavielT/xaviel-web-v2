import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Certificate} from '../../models/certificate.model'
import { TPipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-certificate-card',
  standalone: true,
  imports: [CommonModule, TPipe],
  templateUrl: './certificate-card.html',
  styleUrl: './certificate-card.css',
})
export class CertificateCard {
  @Input() certificate!: Certificate;
}
