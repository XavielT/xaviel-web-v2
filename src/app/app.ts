import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { Xlogo } from "./components/xlogo/xlogo";
import { Badge } from './shared/ui/badge/badge';
import { Card } from './shared/components/card/card';
import { CertificateCard } from './shared/components/certificate-card/certificate-card';
import { ProgressBarCard } from './shared/components/progress-bar-card/progress-bar-card';
import { ContactForm } from './components/contact-form/contact-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Xlogo, Badge, Card, CertificateCard, ProgressBarCard, ContactForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio-v2');
  isHover = false;

  isGithubHover = signal(false);
  isEmailHover = signal(false);

  onGithubEnter() {
    this.isGithubHover.set(true);
  }

  onGithubLeave() {
    this.isGithubHover.set(false);
  }

  onEmailEnter() {
    this.isEmailHover.set(true);
  }

  onEmailLeave() {
    this.isEmailHover.set(false);
  }

  ngAfterViewInit() {
    const reveals = document.querySelectorAll('.reveal');
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
  
    reveals.forEach(el => observer.observe(el));

    /* Reactive Glow */
    /*const card = document.querySelector('.about-right') as HTMLElement;

    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
  
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });*/
  }
}
