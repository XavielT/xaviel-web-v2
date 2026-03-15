import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Certificate} from '../../models/certificate.model'

@Component({
  selector: 'app-certificate-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-card.html',
  styleUrl: './certificate-card.css',
})
export class CertificateCard {
  @Input() certificate!: Certificate;
}
