import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})

export class Badge {
  @Input() text!: string;

  @Input() variant:
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral'
    | 'tech'
    = 'primary';

  @Input() showDot = false;

  @Input() animatedDot = false;

  @Input() size: 'sm' | 'md' | 'lg' = 'md';

}

