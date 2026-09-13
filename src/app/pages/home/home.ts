import { Component, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";
import { Xlogo } from "../../components/xlogo/xlogo";
import { Badge } from '../../shared/ui/badge/badge';
import { Card } from '../../shared/components/card/card';
import { CertificateCard } from '../../shared/components/certificate-card/certificate-card';
import { Certificate } from '../../shared/models/certificate.model';
import { ProgressBarCard } from '../../shared/components/progress-bar-card/progress-bar-card';
import { Skill } from '../../shared/models/skill.model';
import { ContactForm } from '../../components/contact-form/contact-form';
import { ProjectCard } from '../../shared/models/project-card.model';
import { AppCard as AppCardModel } from '../../shared/models/app-card.model';
import { AppCard } from '../../shared/components/app-card/app-card';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../shared/i18n/i18n.service';
import { TPipe } from '../../shared/i18n/t.pipe';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Footer, Xlogo, Badge, Card, ProgressBarCard, CertificateCard, ContactForm, AppCard, CommonModule, TPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly title = signal('portfolio-v2');
  isHover = false;

  private i18n = inject(I18nService);
  private pageTitle = inject(Title);

  constructor() {
    // `t` reads the language signal, so this re-runs on every switch and the
    // browser tab follows the page. index.html carries the Spanish title as the
    // static default, which is what a visitor sees before Angular boots.
    effect(() => this.pageTitle.setTitle(this.i18n.t('meta.title')));
  }

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

  // Apps you can actually install and use, as opposed to source-code projects.
  // Adding a future app is one entry in this array.
  //
  // TRANSLATED FIELDS HOLD KEYS, NOT PROSE. `description` and `iosHint` are
  // TranslationKeys resolved by `| t` in app-card.html; the words themselves
  // live in es.ts/en.ts. `name` and `badges` stay literal because they are
  // proper nouns and technology names, which are not translated in either
  // language. Keeping the split here means adding a third language never
  // touches this file.
  apps: AppCardModel[] = [
    {
      icon: '/assets/apps-imgs/music-hub.png',
      name: 'Music Hub',
      description: 'app.musicHub.description',
      badges: ['Angular', 'Capacitor', 'Supabase', 'PWA'],
      url: 'https://music-hub-xaviel.vercel.app',
      // Points at the releases page rather than the direct
      // releases/latest/download/music-hub.apk asset: that direct URL 404s
      // whenever no release is published, while this page never breaks and
      // always offers the newest build.
      apkUrl: 'https://github.com/XavielT/music-hub/releases/latest',
      // Both apps ship the same hint, so it is one shared key.
      iosHint: 'apps.iosHint',
    },
    {
      icon: '/assets/apps-imgs/tu-combustible-rd.svg',
      name: 'Tu Combustible RD',
      description: 'app.tuCombustible.description',
      badges: ['React Native', 'Expo', 'TypeScript', 'PWA'],
      url: 'https://tu-combustible-rd.vercel.app',
      // Same reasoning as Music Hub above: the releases page rather than the
      // direct .apk asset, so the link survives a version bump.
      apkUrl: 'https://github.com/XavielT/tu-combustible-rd/releases/latest',
      iosHint: 'apps.iosHint',
    },
  ];

  // Projects cards. Same split as `apps` above: `description` is a
  // TranslationKey, `title` and `badges` are proper nouns left literal.
  projects: ProjectCard[] = [
    {
      image: '/assets/projects-imgs/x-autohub.png',
      title: 'X AutoHub',
      description: 'project.xAutohub.description',
      badges: ['Angular', 'NodeJS', 'SCSS', 'Typescript'],
      variant: 'featured',
      url: 'https://github.com/XavielT/x-autohub',
    },
    {
      image: '/assets/projects-imgs/good-drive.jpeg',
      title: 'Good Drive',
      description: 'project.goodDrive.description',
      badges: ['Flutter', 'Dart'],
      variant: 'featured',
      url: 'https://github.com/XavielT/Good-drive',
    },
    {
      image: '/assets/projects-imgs/under-development.png',
      title: 'Mi Taller',
      description: 'project.miTaller.description',
      badges: ['Angular', 'SCSS', 'Typescript', 'NodeJS'],
      variant: 'featured',
      url: 'https://github.com/XavielT/mi-taller',
    },
    {
      image: '/assets/projects-imgs/under-development.png',
      title: 'Pork Tech',
      description: 'project.porkTech.description',
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

  // `name` is a TranslationKey here — unlike projects and apps, a certificate's
  // name is a descriptive course title rather than a proper noun, so it does
  // translate. The section is currently commented out in app.html.
  certificates : Certificate[]=[
    {
      name: 'certificate.responsiveDesign.name',
      img: 'assets/certificates-imgs/responsive-design-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Responsive-Web-Design.pdf',
    },
    {
      name: 'certificate.scrumFundamentals.name',
      img: 'assets/certificates-imgs/scrum-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Fundamentos-SCRUM.pdf',
    },
    {
      name: 'certificate.jiraFundamentals.name',
      img: 'assets/certificates-imgs/jira-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Introduccion-JIRA.pdf',
    }
  ]

}
