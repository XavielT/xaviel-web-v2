import { Component, Input, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Skill } from '../../models/skill.model';

@Component({
  selector: 'app-progress-bar-card',
  templateUrl: './progress-bar-card.html',
  styleUrl: './progress-bar-card.css',
})
export class ProgressBarCard implements AfterViewInit {

  @Input() skill!: Skill;
  animatedLevel = 0;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {

    setTimeout(() => {

      const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            setTimeout(() => {
              this.animatedLevel = this.skill.level;
              this.cdr.detectChanges();
            }, 150 + Math.random() * 300);

            observer.unobserve(entry.target);

          }

        });

      }, { threshold: 0.2 });

      observer.observe(this.el.nativeElement);

    });

  }

}

