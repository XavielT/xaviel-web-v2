import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import {Skill} from '../../models/skill.model';

@Component({
  selector: 'app-progress-bar-card',
  imports: [],
  templateUrl: './progress-bar-card.html',
  styleUrl: './progress-bar-card.css',
})

export class ProgressBarCard {
  @Input() skill!:Skill;

  animatedLevel = 0;


  constructor(private el: ElementRef) {}

  ngAfterViewInit(){
    const observer = new IntersectionObserver(entries => 
    {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          setTimeout(() => {
            this.animatedLevel = this.skill.level;
          }, 200);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(this.el.nativeElement);
  }
}
