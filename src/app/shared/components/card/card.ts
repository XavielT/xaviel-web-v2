import { Component, Input } from '@angular/core';
import { Badge } from '../../ui/badge/badge';
import { ProjectCard } from '../../models/project-card.model'
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-card',
  standalone: true,
  imports: [Badge, CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})

export class Card {
  @Input() project!: ProjectCard;
  @Input() variantOverride?: 'default' | 'featured' | 'minimal';

  get computedVariant(): 'default' | 'featured' | 'minimal' {
    return this.variantOverride ?? this.project.variant ?? 'default';
  }
}
