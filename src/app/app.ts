import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { Xlogo } from "./components/xlogo/xlogo";
import { Badge } from './shared/ui/badge/badge';
import { Card } from './shared/components/card/card';
import { CertificateCard } from './shared/components/certificate-card/certificate-card';
import { Certificate } from './shared/models/certificate.model';
import { ProgressBarCard } from './shared/components/progress-bar-card/progress-bar-card';
import { Skill } from './shared/models/skill.model';
import { ContactForm } from './components/contact-form/contact-form';
import { ProjectCard } from './shared/models/project-card.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Xlogo, Badge, Card, ProgressBarCard, CertificateCard, ContactForm, CommonModule],
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

  //Projects cards
  projects: ProjectCard[] = [
    {
      image: '/assets/projects-imgs/x-autohub.png',
      title: 'X AutoHub',
      description: 'Website for displaying a catalog of parts and vehicles. Implementation of search, filtering and shopping cart functionalities. Integration of payment gateway and administration panel for product and order management.',
      badges: ['Angular', 'NodeJS', 'SCSS', 'Typescript'],
      variant: 'featured',
      url: 'https://github.com/XavielT/x-autohub',
    },
    {
      image: '/assets/projects-imgs/good-drive.jpeg',
      title: 'Good Drive',
      description: 'Uber / Indriver type travel platform mobile app. With the specialty of referral system. Implementation of geolocation functionalities, real-time chat, rating system, driver and passenger view, and referral system with rewards.',
      badges: ['Flutter', 'Dart'],
      variant: 'featured',
      url: 'https://github.com/XavielT/Good-drive',
    },
    {
      image: '/assets/projects-imgs/under-development.png',
      title: 'Mi Taller',
      description: 'Web for mechanical workshop management. Implementation of customer, vehicle, work order, inventory and billing management functionalities. Integration of notification system and administration panel to track tasks and statistics.',
      badges: ['Angular', 'SCSS', 'Typescript', 'NodeJS'],
      variant: 'featured',
      url: 'https://github.com/XavielT/mi-taller',
    },
    {
      image: '/assets/projects-imgs/under-development.png',
      title: 'Pork Tech',
      description: 'Mobile app for pig farm management. Implementation of functionalities for animal monitoring, feed management, health control, event registration and report generation. Integration of notification system for alerts and reminders.',
      badges: ['Flutter', 'Dart', 'PostgreSQL', 'NodeJS'],
      variant: 'featured',
      url: 'https://github.com/XavielT/pork-tech',
    },
  ]

  //Skills progress bars
  skills: Skill[]=[
    {
      name: 'Angular',
      icon: 'assets/skills-icons/angular-icon.svg',
      level: 63
    },
    {
      name: 'JavaScript',
      icon: 'assets/skills-icons/javascript-icon.svg',
      level: 77
    },
    {
      name: 'TypeScript',
      icon: 'assets/skills-icons/typescript-icon.svg',
      level: 70
    },
    {
      name: 'CSS',
      icon: 'assets/skills-icons/css-icon.svg',
      level: 90
    },
    {
      name: 'React',
      icon: 'assets/skills-icons/react-icon.svg',
      level: 46
    },
    {
      name: 'Git',
      icon: 'assets/skills-icons/git-icon.svg',
      level: 77
    },
    {
      name: 'Linux',
      icon: 'assets/skills-icons/linux-icon.svg',
      level: 54
    },
    {
      name: 'PostgreSQL',
      icon: 'assets/skills-icons/sql-icon.svg',
      level: 63
    },
    {
      name: 'Figma',
      icon: 'assets/skills-icons/figma-icon.svg',
      level: 78
    },
    {
      name: 'React Native',
      icon: 'assets/skills-icons/react-icon.svg',
      level: 43
    },
    {
      name: 'Flutter',
      icon: 'assets/skills-icons/flutter-icon.svg',
      level: 43
    },
    {
      name: 'Tailwind CSS',
      icon: 'assets/skills-icons/tailwind-icon.svg',
      level: 43
    },
  ]

  trackByName(index: number, skill: Skill) {
    return skill.name;
  }

  certificates : Certificate[]=[
    {
      name: 'Responsive Design',
      img: 'assets/certificates-imgs/responsive-design-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Responsive-Web-Design.pdf',
    },
    {
      name: 'Scrum fundamentals',
      img: 'assets/certificates-imgs/scrum-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Fundamentos-SCRUM.pdf',
    },
    {
      name: 'Jira fundamentals',
      img: 'assets/certificates-imgs/jira-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Introduccion-JIRA.pdf',
    }
  ]

}
