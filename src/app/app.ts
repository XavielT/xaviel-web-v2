import { Component, OnDestroy, computed, signal } from '@angular/core';
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
  private readonly roles = ['modern web apps', 'Angular interfaces', 'mobile apps', 'clean UI design'];
  typedText = signal('');
  private typeTimer?: ReturnType<typeof setTimeout>;

  private startTypewriter() {
    // Without motion, show a static line instead of an endless animation.
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typedText.set(this.roles[0]);
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

  onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
  }

  // ---- About ----
  aboutText =
    'Frontend-focused Software Developer building modern web applications with Angular, TypeScript, and JavaScript. ' +
    'I specialize in clean interfaces, smooth user experiences, and scalable frontend architecture. ' +
    'Beyond the browser, I ship real apps: installable PWAs and native Android builds with Capacitor, React Native and Flutter, ' +
    'backed by Supabase and PostgreSQL. I like taking a product from the first sketch in Figma to a deployed, maintained release, ' +
    'and I care about details like offline support, accessibility and performance. ' +
    'I am always learning, and open to freelance work and collaborations.';

  // ---- Skills filter ----
  readonly skillCategories = ['All', 'Frontend', 'Mobile', 'Tools & Data'] as const;
  skillFilter = signal<string>('All');
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
  apps: AppCardModel[] = [
    {
      icon: '/assets/apps-imgs/music-hub.png',
      name: 'Music Hub',
      description:
        'A personal music app: upload your own songs, they sync across every device through Supabase, and download them for offline listening. Installable on iPhone and desktop, with a native Android build.',
      badges: ['Angular', 'Capacitor', 'Supabase', 'PWA'],
      url: 'https://music-hub-xaviel.vercel.app',
      // Points at the releases page rather than the direct
      // releases/latest/download/music-hub.apk asset: that direct URL 404s
      // whenever no release is published, while this page never breaks and
      // always offers the newest build.
      apkUrl: 'https://github.com/XavielT/music-hub/releases/latest',
      iosHint: 'On iPhone: open the app in Safari, then Share → Add to Home Screen.',
    },
    {
      // Tu Combustible RD grew into Car Guy (v2.0, 2026-09-25; v2.1 "Hachi-Gō",
      // 2026-09-29; v2.2 adds trips, partial fill-ups, photo garage; v2.4 "Tōge", 2026-10-01,
      // adds English, drive mode + map, official fuel prices; v2.7 "Sensei", 2026-11-05, adds trips that start on their own
      // when you get in the car, a simpler Today screen, monthly/yearly recaps and calibration).
      // The old web URL still serves it, but this is its home now.
      icon: '/assets/apps-imgs/car-guy.png',
      name: 'Car Guy',
      description:
        'Your car, up to date — with its story. A simple Today screen that shows the one next thing to do; maintenance, checks, fuel (partial fill-ups too, with the official weekly prices) and costs for the whole garage; a drive mode with a live map; GPS trips that start on their own when you get in the car (Android), with a calibrated speed; monthly and yearly recaps you can share; a photo garage and build log, DIY service data, track days with setups and lap times, and a shareable public page. In English or Spanish. Everything lives on your phone; the account is optional.',
      badges: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PWA'],
      url: 'https://car-guy.vercel.app',
      // Same reasoning as Music Hub above: the releases page rather than the
      // direct .apk asset, so the link survives a version bump.
      apkUrl: 'https://github.com/XavielT/car-guy/releases/latest',
      // Stable asset name on every release, so this always downloads the newest build.
      apkDirectUrl: 'https://github.com/XavielT/car-guy/releases/latest/download/car-guy.apk',
      iosHint: 'On iPhone: open the app in Safari, then Share → Add to Home Screen.',
    },
    {
      // X Money 2.24.1 (2026-11): personal finance that works offline and syncs through Supabase.
      // Web app on Vercel; the APK comes from the GitHub release the CI publishes on every new version (stable links:
      // the releases page and the fixed asset name x-money.apk, so they survive a version bump). Needs an invite code to sign up.
      icon: '/assets/apps-imgs/x-money.png',
      name: 'X Money',
      description:
        'Personal finance that keeps your numbers honest. Accounts, credit cards with statements, income sources, budgets, goals, loans with a simulator, a small resale business and smart alerts — all calculated on the device and working offline, then synced across devices. Optional AI never invents a figure: it only explains, and capture turns a bank-notice screenshot, an invoice, a voice note, an email or a bank-app notification on the phone into a draft you approve, and the expense keeps what you bought (items, invoice, tax) even when the bank notice and the store receipt arrive separately. A notice that arrives before you add its card waits and finds it once you do, and a bank name alone never confuses two cards of the same bank. It updates itself on request: a button on the iPhone web app and on the Android app finds the newest version. Settings is a short menu with one screen per topic, a typical expense takes three taps with an undo, and the change history reads as plain sentences. In English or Spanish.',
      badges: ['Angular', 'Capacitor', 'TypeScript', 'Supabase', 'PWA'],
      url: 'https://x-money-xavielts-projects.vercel.app',
      apkUrl: 'https://github.com/XavielT/x-money/releases/latest',
      apkDirectUrl: 'https://github.com/XavielT/x-money/releases/latest/download/x-money.apk',
      iosHint: 'On iPhone: open the app in Safari, then Share → Add to Home Screen.',
    },
  ];

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
