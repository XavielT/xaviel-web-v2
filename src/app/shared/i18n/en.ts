import { TranslationKey } from './es';

/**
 * English dictionary.
 *
 * Typed as a complete record of `TranslationKey`, so the build fails if a key is
 * added to `es.ts` and forgotten here — a missing key would otherwise surface as
 * the Spanish string (the fallback in `I18nService.t`) sitting in an English
 * page, which is exactly the kind of thing nobody notices until a visitor does.
 *
 * Natural English, not transliterated Spanish. Proper nouns, project names, app
 * names and technical terms are not translated — see the note in `es.ts` for
 * what is deliberately left out of both dictionaries.
 */
export const EN: Record<TranslationKey, string> = {
  // --- navigation ---------------------------------------------------------
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.mainProjects': 'Main Projects',
  'nav.apps': 'Apps',
  'nav.skills': 'Skills',
  'nav.certificates': 'Certificates',
  'nav.contact': 'Contact',

  // --- language selector --------------------------------------------------
  'lang.label': 'Language',
  'lang.switchTo': 'Switch language to {name}',

  // --- document -----------------------------------------------------------
  'meta.title': 'Xaviel Web — Software Developer',

  // --- home / hero --------------------------------------------------------
  'home.badge': 'Available for projects',
  'home.titleLead': 'Software',
  'home.titleHighlight': 'Developer',
  'home.tagline':
    'Creating modern and functional web experiences. Specializing in Angular and UI design.',
  'home.viewProjects': 'View Projects',
  'home.contact': 'Contact',

  // --- about --------------------------------------------------------------
  'about.title': 'About Me',
  'about.titleIconAlt': 'Profile icon',
  'about.description':
    'Frontend-focused Software Developer building modern web applications with Angular, TypeScript, and JavaScript. I specialize in clean interfaces, smooth user experiences, and scalable frontend architecture.',
  'about.resume': 'See Resume',
  'about.statIconAlt': 'Icon',
  'about.completedProjects': 'Completed Projects',
  'about.yearsExperience': 'Years of experience',
  'about.satisfiedCustomers': 'Satisfied Customers',

  // --- main projects ------------------------------------------------------
  'projects.title': 'Main Projects',
  'projects.subtitle': 'Some of my recent work',

  // --- apps ---------------------------------------------------------------
  'apps.title': 'Apps',
  'apps.subtitle': 'Things you can install and use',
  'apps.iosHint': 'On iPhone: open the app in Safari, then Share → Add to Home Screen.',
  'appCard.open': 'Open app',
  'appCard.apk': 'Android APK',
  'appCard.comingSoon': 'Coming soon',
  'appCard.iconAlt': '{name} icon',

  // --- skills -------------------------------------------------------------
  'skills.title': 'Skills',
  'skills.subtitle': 'Main Technologies I work with',
  'skills.iconAlt': 'Skill icon',

  // --- certificates -------------------------------------------------------
  'certificates.title': 'Certificates',
  'certificates.subtitle': 'Technologies I work with',
  'certificates.linkIconAlt': 'Link icon',

  // --- contact ------------------------------------------------------------
  // English has no opening question mark; see the note in es.ts.
  'contact.titleOpen': '',
  'contact.title': 'Do you have a project in mind',
  'contact.titleClose': '?',
  'contact.subtitle':
    "I'm available for new projects and collaborations. Feel free to contact me.",

  // --- contact form -------------------------------------------------------
  'form.heading': 'Contact Information',
  'form.name': 'Name',
  'form.namePlaceholder': 'Your Name',
  'form.nameRequired': 'Name is required',
  'form.nameMinLength': 'Name must be at least 2 characters',
  'form.email': 'Email',
  'form.emailPlaceholder': 'your@gmail.com',
  'form.emailRequired': 'Email is required',
  'form.emailInvalid': 'Enter a valid email',
  'form.reason': 'Reason for contact',
  'form.selectOption': 'Select an option',
  'form.reasonJob': 'Job Opportunity',
  'form.reasonProject': 'Project',
  'form.reasonOther': 'Other reason',
  'form.message': 'Message',
  'form.messagePlaceholder': 'Write your message...',
  'form.messageRequired': 'Message is required',
  'form.messageMinLength': 'Message must be at least 10 characters',
  'form.clear': 'Clear',
  'form.send': 'Send',
  'form.sending': 'Sending...',
  'form.successTitle': 'Message sent!',
  'form.successBody': 'I will get back to you soon.',
  'form.errorTitle': 'Something went wrong',
  'form.errorBody': 'Please try again later.',
  'form.rateLimitTitle': 'Please wait',
  'form.rateLimitBody': 'You can send another message in a few seconds.',
  'form.inputIconAlt': 'Input icon',
  'form.sendIconAlt': 'Send icon',

  // --- footer -------------------------------------------------------------
  'footer.rights': '© 2026 Xaviel Web. All rights reserved.',
  'footer.contact': 'Contact',

  // --- maintenance placeholder --------------------------------------------
  'maintenance.title': 'This section is under Maintenance',
  'maintenance.subtitle': 'It will be available shortly',
  'maintenance.iconAlt': 'Maintenance icon',

  // --- app catalog prose (data lives in app.ts, which stores these keys) ---
  'app.musicHub.description':
    'A personal music app: upload your own songs, they sync across every device through Supabase, and download them for offline listening. Installable on iPhone and desktop, with a native Android build.',
  'app.tuCombustible.description':
    'Fuel and running-cost tracker for Dominican drivers: log every fill-up, see your real km/gal and cost per kilometre, and keep expenses and maintenance per vehicle. Prices use the weekly MICM reference. Everything stays on your device.',

  // --- project prose (data lives in app.ts, which stores these keys) -------
  'project.xAutohub.description':
    'Website for displaying a catalog of parts and vehicles. Implementation of search, filtering and shopping cart functionalities. Integration of payment gateway and administration panel for product and order management.',
  'project.goodDrive.description':
    'Uber / Indriver type travel platform mobile app. With the specialty of referral system. Implementation of geolocation functionalities, real-time chat, rating system, driver and passenger view, and referral system with rewards.',
  'project.miTaller.description':
    'Web for mechanical workshop management. Implementation of customer, vehicle, work order, inventory and billing management functionalities. Integration of notification system and administration panel to track tasks and statistics.',
  'project.porkTech.description':
    'Mobile app for pig farm management. Implementation of functionalities for animal monitoring, feed management, health control, event registration and report generation. Integration of notification system for alerts and reminders.',

  // --- certificate names (data lives in app.ts, which stores these keys) ---
  'certificate.responsiveDesign.name': 'Responsive Web Design',
  'certificate.scrumFundamentals.name': 'Scrum Fundamentals',
  'certificate.jiraFundamentals.name': 'Jira Fundamentals',
};
