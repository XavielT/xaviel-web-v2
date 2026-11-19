import { Component, Input } from '@angular/core';
import { Badge } from '../../ui/badge/badge';
import { ProjectCard } from '../../models/project-card.model'
import { CommonModule } from '@angular/common';
import { ReadMore } from '../read-more/read-more';



@Component({
  selector: 'app-card',
  standalone: true,
  imports: [Badge, CommonModule, ReadMore],
  templateUrl: './card.html',
  styleUrl: './card.css',
})

export class Card {
  @Input() project!: ProjectCard;
  @Input() variantOverride?: 'default' | 'featured' | 'minimal';

  get computedVariant(): 'default' | 'featured' | 'minimal' {
    return this.variantOverride ?? this.project.variant ?? 'default';
  }

  /** Feeds the cursor position to CSS so the card shows a spotlight that follows the mouse. */
  onMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
