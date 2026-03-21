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
import { Maintenance } from './shared/components/maintenance/maintenance';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Xlogo, Badge, Card, ProgressBarCard, CertificateCard, ContactForm, Maintenance, CommonModule],
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
      image: '/assets/projects-imgs/mk4-jetta-lowered.jpg',
      title: 'Lorep ipsum',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      badges: ['React', 'NodeJS'],
      variant: 'featured'
    },
    {
      image: '/assets/projects-imgs/mk4-jetta-lowered.jpg',
      title: 'Lorep ipsum',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      badges: ['Angular', 'NodeJS'],
      variant: 'featured'
    },
    {
      image: '/assets/projects-imgs/mk4-jetta-lowered.jpg',
      title: 'Lorep ipsum',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      badges: ['Kotlin', 'SQLite', 'Javascript'],
      variant: 'featured'
    },
    {
      image: '/assets/projects-imgs/mk4-jetta-lowered.jpg',
      title: 'Lorep ipsum',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      badges: ['Javascript', 'CSS', 'HTML'],
      variant: 'featured'
    },
    {
      image: '/assets/projects-imgs/mk4-jetta-lowered.jpg',
      title: 'Lorep ipsum',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      badges: ['C++'],
      variant: 'featured'
    },
    {
      image: '/assets/projects-imgs/mk4-jetta-lowered.jpg',
      title: 'Lorep ipsum',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      badges: ['TypeScript', 'NodeJS'],
      variant: 'featured'
    }
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
