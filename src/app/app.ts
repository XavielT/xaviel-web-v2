import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
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
import { AppCard as AppCardModel } from './shared/models/app-card.model';
import { AppCard } from './shared/components/app-card/app-card';
import { CommonModule } from '@angular/common';
import { ReadMore } from './shared/components/read-more/read-more';
import { CountUp } from './shared/directives/count-up';
import { I18n } from './core/i18n';
import { TranslationKey } from './core/translations';

type AppBase = Omit<AppCardModel, 'description' | 'iosHint'> & { descKey: TranslationKey; ios?: boolean };
type ProjectBase = Omit<ProjectCard, 'description'> & { descKey: TranslationKey };
type CertificateBase = Omit<Certificate, 'name'> & { nameKey: TranslationKey };


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Xlogo, Badge, Card, ProgressBarCard, CertificateCard, ContactForm, AppCard, CommonModule, ReadMore, CountUp],
  host: { '(window:scroll)': 'onScroll()' },
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly title = signal('portfolio-v2');
  readonly i18n = inject(I18n);
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

  // ---- Hero: typewriter that cycles through what I do ----
  private get roles(): string[] {
    return this.i18n.t('hero.roles').split('|');
  }
  typedText = signal('');
  /** True when motion is reduced: the hero shows one static role instead of typing. */
  private staticRole = signal(false);
  typedDisplay = computed(() => (this.staticRole() ? this.roles[0] : this.typedText()));
  private typeTimer?: ReturnType<typeof setTimeout>;

  private startTypewriter() {
    // Without motion, show a static line instead of an endless animation.
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.staticRole.set(true);
      return;
    }
    let role = 0;
    let chars = 0;
    let deleting = false;
    const step = () => {
      const word = this.roles[role];
      chars += deleting ? -1 : 1;
      this.typedText.set(word.slice(0, chars));
      let delay = deleting ? 35 : 80;
      if (!deleting && chars === word.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && chars === 0) {
        deleting = false;
        role = (role + 1) % this.roles.length;
        delay = 350;
      }
      this.typeTimer = setTimeout(step, delay);
    };
    this.typeTimer = setTimeout(step, 900);
  }

  ngOnDestroy() {
    clearTimeout(this.typeTimer);
  }

  // ---- Scroll progress bar ----
  scrollProgress = signal(0);

  showTop = signal(false);

  onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    this.showTop.set(window.scrollY > 700);
  }

  scrollToTop() {
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  // ---- Skills filter ----
  readonly skillCategories = ['All', 'Frontend', 'Mobile', 'Tools & Data'] as const;
  skillFilter = signal<string>('All');

  catLabel(category: string): string {
    return this.i18n.t(('skills.cat.' + category) as TranslationKey);
  }

  filteredSkills = computed(() => {
    const f = this.skillFilter();
    return f === 'All' ? this.skills : this.skills.filter(s => s.category === f);
  });

  ngAfterViewInit() {
    this.startTypewriter();
    this.onScroll();
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
  private readonly appsBase: AppBase[] = [
    {
      icon: '/assets/apps-imgs/music-hub.webp',
      name: 'Music Hub',
      descKey: 'apps.musichub',
      badges: ['Angular', 'Capacitor', 'Supabase', 'PWA'],
      url: 'https://music-hub-xaviel.vercel.app',
      // Points at the releases page rather than the direct
      // releases/latest/download/music-hub.apk asset: that direct URL 404s
      // whenever no release is published, while this page never breaks and
      // always offers the newest build.
      apkUrl: 'https://github.com/XavielT/music-hub/releases/latest',
      ios: true,
    },
    {
      // Tu Combustible RD grew into Car Guy (v2.0, 2026-09-25; v2.1 "Hachi-Gō",
      // 2026-09-29; v2.2 adds trips, partial fill-ups, photo garage; v2.4 "Tōge", 2026-10-01,
      // adds English, drive mode + map, official fuel prices; v2.7 "Sensei", 2026-11-05, adds trips that start on their own
      // when you get in the car, a simpler Today screen, monthly/yearly recaps and calibration).
      // The old web URL still serves it, but this is its home now.
      icon: '/assets/apps-imgs/car-guy.png',
      name: 'Car Guy',
      descKey: 'apps.carguy',
      badges: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PWA'],
      url: 'https://car-guy.vercel.app',
      // Same reasoning as Music Hub above: the releases page rather than the
      // direct .apk asset, so the link survives a version bump.
      apkUrl: 'https://github.com/XavielT/car-guy/releases/latest',
      // Stable asset name on every release, so this always downloads the newest build.
      apkDirectUrl: 'https://github.com/XavielT/car-guy/releases/latest/download/car-guy.apk',
      ios: true,
    },
    {
      // X Money 2.24.1 (2026-11): personal finance that works offline and syncs through Supabase.
      // Web app on Vercel; the APK comes from the GitHub release the CI publishes on every new version (stable links:
      // the releases page and the fixed asset name x-money.apk, so they survive a version bump). Needs an invite code to sign up.
      icon: '/assets/apps-imgs/x-money.png',
      name: 'X Money',
      descKey: 'apps.xmoney',
      badges: ['Angular', 'Capacitor', 'TypeScript', 'Supabase', 'PWA'],
      url: 'https://x-money-xavielts-projects.vercel.app',
      apkUrl: 'https://github.com/XavielT/x-money/releases/latest',
      apkDirectUrl: 'https://github.com/XavielT/x-money/releases/latest/download/x-money.apk',
      ios: true,
    },
  ];

  //Projects cards
  private readonly projectsBase: ProjectBase[] = [
    {
      image: '/assets/projects-imgs/x-autohub.webp',
      title: 'X AutoHub',
      descKey: 'projects.xautohub',
      badges: ['Angular', 'NodeJS', 'SCSS', 'Typescript'],
      variant: 'featured',
      url: 'https://github.com/XavielT/x-autohub',
      demoUrl: 'https://xautohubrd.com',
    },
    {
      image: '/assets/projects-imgs/mi-taller.webp',
      title: 'Mi Taller',
      descKey: 'projects.mitaller',
      badges: ['Angular', 'SCSS', 'Typescript', 'NodeJS'],
      variant: 'featured',
      url: 'https://github.com/XavielT/mi-taller',
      demoUrl: 'https://mitaller-rd.vercel.app',
    },
    {
      image: '/assets/projects-imgs/good-drive.webp',
      title: 'Good Drive',
      descKey: 'projects.gooddrive',
      badges: ['Flutter', 'Dart'],
      variant: 'featured',
      url: 'https://github.com/XavielT/Good-drive',
    },
    {
      image: '/assets/projects-imgs/under-development.webp',
      title: 'Pork Tech',
      descKey: 'projects.porktech',
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
      level: 63,
      category: 'Frontend'
    },
    {
      name: 'JavaScript',
      icon: 'assets/skills-icons/javascript-icon.svg',
      level: 77,
      category: 'Frontend'
    },
    {
      name: 'TypeScript',
      icon: 'assets/skills-icons/typescript-icon.svg',
      level: 70,
      category: 'Frontend'
    },
    {
      name: 'CSS',
      icon: 'assets/skills-icons/css-icon.svg',
      level: 90,
      category: 'Frontend'
    },
    {
      name: 'React',
      icon: 'assets/skills-icons/react-icon.svg',
      level: 46,
      category: 'Frontend'
    },
    {
      name: 'Git',
      icon: 'assets/skills-icons/git-icon.svg',
      level: 77,
      category: 'Tools & Data'
    },
    {
      name: 'Linux',
      icon: 'assets/skills-icons/linux-icon.svg',
      level: 54,
      category: 'Tools & Data'
    },
    {
      name: 'PostgreSQL',
      icon: 'assets/skills-icons/sql-icon.svg',
      level: 63,
      category: 'Tools & Data'
    },
    {
      name: 'Figma',
      icon: 'assets/skills-icons/figma-icon.svg',
      level: 78,
      category: 'Tools & Data'
    },
    {
      name: 'React Native',
      icon: 'assets/skills-icons/react-icon.svg',
      level: 43,
      category: 'Mobile'
    },
    {
      name: 'Flutter',
      icon: 'assets/skills-icons/flutter-icon.svg',
      level: 43,
      category: 'Mobile'
    },
    {
      name: 'Tailwind CSS',
      icon: 'assets/skills-icons/tailwind-icon.svg',
      level: 43,
      category: 'Frontend'
    },
  ]

  trackByName(index: number, skill: Skill) {
    return skill.name;
  }

  private readonly certificatesBase: CertificateBase[] = [
    {
      nameKey: 'certs.responsive',
      img: 'assets/certificates-imgs/responsive-design-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Responsive-Web-Design.pdf',
    },
    {
      nameKey: 'certs.scrum',
      img: 'assets/certificates-imgs/scrum-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Fundamentos-SCRUM.pdf',
    },
    {
      nameKey: 'certs.jira',
      img: 'assets/certificates-imgs/jira-certificate.png',
      pdf: 'assets/certificates-pdfs/Certificado-Introduccion-JIRA.pdf',
    }
  ]

  // Translated views of the data above. Cards are tracked by identity key so a language change
  // updates their text in place instead of rebuilding them (which would replay the reveal animation).
  apps = computed<AppCardModel[]>(() =>
    this.appsBase.map(({ descKey, ios, ...app }) => ({
      ...app,
      description: this.i18n.t(descKey),
      iosHint: ios ? this.i18n.t('apps.ios') : undefined,
    })),
  );

  projects = computed<ProjectCard[]>(() =>
    this.projectsBase.map(({ descKey, ...project }) => ({ ...project, description: this.i18n.t(descKey) })),
  );

  certificates = computed<Certificate[]>(() =>
    this.certificatesBase.map(({ nameKey, ...cert }) => ({ ...cert, name: this.i18n.t(nameKey) })),
  );

  trackByTitle(_: number, item: { title: string }) {
    return item.title;
  }

  trackByAppName(_: number, item: { name: string }) {
    return item.name;
  }

  trackByCertImg(_: number, item: { img: string }) {
    return item.img;
  }
}
