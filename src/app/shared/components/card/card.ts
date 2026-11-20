import { Component, Input, inject } from '@angular/core';
import { Badge } from '../../ui/badge/badge';
import { ProjectCard } from '../../models/project-card.model'
import { CommonModule } from '@angular/common';
import { ReadMore } from '../read-more/read-more';
import { I18n } from '../../../core/i18n';
import { followPointer, releasePointer } from '../../tilt';



@Component({
  selector: 'app-card',
  standalone: true,
  imports: [Badge, CommonModule, ReadMore],
  templateUrl: './card.html',
  styleUrl: './card.css',
})

export class Card {
  readonly i18n = inject(I18n);
  @Input() project!: ProjectCard;
  @Input() variantOverride?: 'default' | 'featured' | 'minimal';

  get computedVariant(): 'default' | 'featured' | 'minimal' {
    return this.variantOverride ?? this.project.variant ?? 'default';
  }

  onMove(event: MouseEvent) {
    followPointer(event);
  }

  onLeave(event: MouseEvent) {
    releasePointer(event);
  }
}
