export type Lang = 'en' | 'es';

/**
 * Every visible string on the site lives here, once per language.
 * `en` is the source of truth: `es` must provide the same keys (the compiler enforces it),
 * so a missing translation is a build error rather than a blank on the page.
 */
const en = {
  // Navbar
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.projects': 'Main Projects',
  'nav.apps': 'Apps',
  'nav.skills': 'Skills',
  'nav.certificates': 'Certificates',
  'nav.contact': 'Contact',
  'nav.toggle': 'Toggle navigation menu',
  'nav.lang': 'Switch language to Spanish',
  'nav.backTop': 'Back to top',

  // Hero
  'hero.badge': 'Available for projects',
  'hero.titleA': 'Software',
  'hero.titleB': 'Developer',
  'hero.typedPrefix': 'I build ',
  'hero.roles': 'modern web apps|Angular interfaces|mobile apps|clean UI design',
  'hero.text': 'Creating modern and functional web experiences. Specializing in Angular and UI design.',
  'hero.viewProjects': 'View Projects',
  'hero.hire': 'Hire me',

  // About
  'about.title': 'About Me',
  'about.text': "Frontend-focused Software Developer building modern web applications with Angular, TypeScript, and JavaScript. I specialize in clean interfaces, smooth user experiences, and scalable frontend architecture. Beyond the browser, I ship real apps: installable PWAs and native Android builds with Capacitor, React Native and Flutter, backed by Supabase and PostgreSQL. I like taking a product from the first sketch in Figma to a deployed, maintained release, and I care about details like offline support, accessibility and performance. I am always learning, and open to freelance work and collaborations.",
  'about.resumeEn': 'Resume (EN)',
  'about.resumeEs': 'Currículum (ES)',
  'about.statProjects': 'Completed Projects',
  'about.statYears': 'Years of experience',
  'about.statClients': 'Satisfied Customers',

  // Sections
  'projects.title': 'Main Projects',
  'projects.subtitle': 'Some of my recent work',
  'projects.code': 'View code',
  'projects.demo': 'Live demo',
  'apps.title': 'Apps',
  'apps.subtitle': 'Things you can install and use',
  'skills.title': 'Skills',
  'skills.subtitle': 'Main Technologies I work with',
  'skills.filter': 'Filter skills',
  'skills.cat.All': 'All',
  'skills.cat.Frontend': 'Frontend',
  'skills.cat.Mobile': 'Mobile',
  'skills.cat.Tools & Data': 'Tools & Data',
  'certs.title': 'Certificates',
  'certs.subtitle': 'Courses I have completed',
  'certs.responsive': 'Responsive Design',
  'certs.scrum': 'Scrum fundamentals',
  'certs.jira': 'Jira fundamentals',

  // Project and app descriptions
  'projects.xautohub': "Website for displaying a catalog of parts and vehicles. Implementation of search, filtering and shopping cart functionalities. Integration of payment gateway and administration panel for product and order management.",
  'projects.gooddrive': "Uber / Indriver type travel platform mobile app. With the specialty of referral system. Implementation of geolocation functionalities, real-time chat, rating system, driver and passenger view, and referral system with rewards.",
  'projects.mitaller': "Web for mechanical workshop management. Implementation of customer, vehicle, work order, inventory and billing management functionalities. Integration of notification system and administration panel to track tasks and statistics.",
  'projects.porktech': "Mobile app for pig farm management. Implementation of functionalities for animal monitoring, feed management, health control, event registration and report generation. Integration of notification system for alerts and reminders.",
  'apps.musichub': "A personal music app: upload your own songs, they sync across every device through Supabase, and download them for offline listening. Installable on iPhone and desktop, with a native Android build.",
  'apps.carguy': "Your car, up to date — with its story. A simple Today screen that shows the one next thing to do; maintenance, checks, fuel (partial fill-ups too, with the official weekly prices) and costs for the whole garage; a drive mode with a live map; GPS trips that start on their own when you get in the car (Android), with a calibrated speed; monthly and yearly recaps you can share; a photo garage and build log, DIY service data, track days with setups and lap times, and a shareable public page. In English or Spanish. Everything lives on your phone; the account is optional.",
  'apps.xmoney': "Personal finance that keeps your numbers honest. Accounts, credit cards with statements, income sources, budgets, goals, loans with a simulator, a small resale business and smart alerts — all calculated on the device and working offline, then synced across devices. Optional AI never invents a figure: it only explains, and capture turns a bank-notice screenshot, an invoice, a voice note, an email or a bank-app notification on the phone into a draft you approve, and the expense keeps what you bought (items, invoice, tax) even when the bank notice and the store receipt arrive separately. A notice that arrives before you add its card waits and finds it once you do, and a bank name alone never confuses two cards of the same bank. It updates itself on request: a button on the iPhone web app and on the Android app finds the newest version. Settings is a short menu with one screen per topic, a typical expense takes three taps with an undo, and the change history reads as plain sentences. In English or Spanish.",
  'apps.open': 'Open app',
  'apps.apk': 'Android APK',
  'apps.apkDirect': 'Direct APK',
  'apps.soon': 'Coming soon',
  'apps.ios': 'On iPhone: open the app in Safari, then Share → Add to Home Screen.',

  // Read more
  'readmore.more': 'Read more',
  'readmore.less': 'Read less',

  // Contact
  'contact.title': 'Do you have a project in mind',
  'contact.text': "I'm available for new projects and collaborations. Feel free to contact me.",
  'contact.availability': 'Usually replies within 24 hours · Dominican Republic (GMT-4)',
  'form.title': 'Contact Information',
  'form.preferEmail': 'Prefer email?',
  'form.copied': '✓ Copied!',
  'form.copyPrompt': 'Copy my email:',
  'form.name': 'Name',
  'form.namePh': 'Your Name',
  'form.nameReq': 'Name is required',
  'form.nameMin': 'Name must be at least 2 characters',
  'form.email': 'Email',
  'form.emailReq': 'Email is required',
  'form.emailInvalid': 'Enter a valid email',
  'form.reason': 'Reason for contact',
  'form.select': 'Select an option',
  'form.optJob': 'Job Opportunity',
  'form.optProject': 'Project',
  'form.optOther': 'Other reason',
  'form.reasonReq': 'Please choose a reason',
  'form.message': 'Message',
  'form.messagePh': 'Write your message...',
  'form.messageReq': 'Message is required',
  'form.messageMin': 'Message must be at least 10 characters',
  'form.clear': 'Clear',
  'form.send': 'Send',
  'form.sending': 'Sending...',
  'form.okTitle': 'Message sent!',
  'form.okText': 'I will get back to you soon.',
  'form.errTitle': 'Something went wrong',
  'form.errText': 'Please try again later.',
  'form.waitTitle': 'Please wait',
  'form.waitText': 'You can send another message in a few seconds.',

  // Footer and document
  'footer.rights': '© 2026 Xaviel Web. All rights reserved.',
  'footer.contact': 'Contact',
  'doc.title': 'Xaviel Terrero | Software Developer',
  'doc.description':
    'Portfolio of Xaviel Terrero, a software developer building modern web and mobile apps with Angular, TypeScript and Flutter. Available for freelance projects.',
} as const;

export type TranslationKey = keyof typeof en;

const es: Record<TranslationKey, string> = {
  // Navbar
  'nav.home': 'Inicio',
  'nav.about': 'Sobre mí',
  'nav.projects': 'Proyectos',
  'nav.apps': 'Apps',
  'nav.skills': 'Habilidades',
  'nav.certificates': 'Certificados',
  'nav.contact': 'Contacto',
  'nav.toggle': 'Abrir o cerrar el menú',
  'nav.lang': 'Cambiar el idioma a inglés',
  'nav.backTop': 'Volver arriba',

  // Hero
  'hero.badge': 'Disponible para proyectos',
  'hero.titleA': 'Desarrollador de',
  'hero.titleB': 'Software',
  'hero.typedPrefix': 'Creo ',
  'hero.roles': 'aplicaciones web modernas|interfaces con Angular|aplicaciones móviles|diseño de interfaces limpio',
  'hero.text': 'Creo experiencias web modernas y funcionales. Especializado en Angular y diseño de interfaces.',
  'hero.viewProjects': 'Ver proyectos',
  'hero.hire': 'Contrátame',

  // About
  'about.title': 'Sobre mí',
  'about.text':
    'Desarrollador de software enfocado en el frontend, creo aplicaciones web modernas con Angular, TypeScript y JavaScript. Me especializo en interfaces limpias, experiencias de usuario fluidas y una arquitectura frontend escalable. Más allá del navegador, entrego apps reales: PWAs instalables y versiones nativas para Android con Capacitor, React Native y Flutter, respaldadas por Supabase y PostgreSQL. Me gusta llevar un producto desde el primer boceto en Figma hasta una versión publicada y mantenida, y cuido detalles como el soporte sin conexión, la accesibilidad y el rendimiento. Siempre estoy aprendiendo y estoy abierto a trabajos freelance y colaboraciones.',
  'about.resumeEn': 'Resume (EN)',
  'about.resumeEs': 'Currículum (ES)',
  'about.statProjects': 'Proyectos completados',
  'about.statYears': 'Años de experiencia',
  'about.statClients': 'Clientes satisfechos',

  // Sections
  'projects.title': 'Proyectos principales',
  'projects.subtitle': 'Algunos de mis trabajos recientes',
  'projects.code': 'Ver código',
  'projects.demo': 'Ver demo',
  'apps.title': 'Apps',
  'apps.subtitle': 'Cosas que puedes instalar y usar',
  'skills.title': 'Habilidades',
  'skills.subtitle': 'Principales tecnologías con las que trabajo',
  'skills.filter': 'Filtrar habilidades',
  'skills.cat.All': 'Todas',
  'skills.cat.Frontend': 'Frontend',
  'skills.cat.Mobile': 'Móvil',
  'skills.cat.Tools & Data': 'Herramientas y datos',
  'certs.title': 'Certificados',
  'certs.subtitle': 'Cursos que he completado',
  'certs.responsive': 'Diseño web adaptable',
  'certs.scrum': 'Fundamentos de Scrum',
  'certs.jira': 'Fundamentos de Jira',

  // Project and app descriptions
  'projects.xautohub':
    'Sitio web para mostrar un catálogo de piezas y vehículos. Implementación de búsqueda, filtros y carrito de compras. Integración de pasarela de pago y panel de administración para gestionar productos y pedidos.',
  'projects.gooddrive':
    'Aplicación móvil de transporte tipo Uber / InDrive, con un sistema de referidos como especialidad. Implementación de geolocalización, chat en tiempo real, sistema de calificaciones, vistas de conductor y pasajero, y referidos con recompensas.',
  'projects.mitaller':
    'Aplicación web para la gestión de talleres mecánicos. Implementación de gestión de clientes, vehículos, órdenes de trabajo, inventario y facturación. Integración de sistema de notificaciones y panel de administración para seguir tareas y estadísticas.',
  'projects.porktech':
    'Aplicación móvil para la gestión de granjas porcinas. Implementación de monitoreo de animales, gestión de alimento, control de salud, registro de eventos y generación de reportes. Integración de notificaciones para alertas y recordatorios.',
  'apps.musichub':
    'Una app de música personal: sube tus propias canciones, se sincronizan en todos tus dispositivos con Supabase y puedes descargarlas para escucharlas sin conexión. Instalable en iPhone y escritorio, con una versión nativa para Android.',
  'apps.carguy':
    'Tu carro, al día y con su historia. Una pantalla de Hoy sencilla que muestra lo único que toca hacer; mantenimiento, revisiones, combustible (también llenados parciales, con los precios oficiales semanales) y costos de todo el garaje; un modo de manejo con mapa en vivo; viajes por GPS que empiezan solos cuando te subes al carro (Android), con velocidad calibrada; resúmenes mensuales y anuales que puedes compartir; un garaje de fotos y bitácora de modificaciones, datos de servicio para hacerlo tú mismo, track days con configuraciones y tiempos por vuelta, y una página pública para compartir. En inglés o español. Todo vive en tu teléfono; la cuenta es opcional.',
  'apps.xmoney':
    'Finanzas personales que mantienen tus números honestos. Cuentas, tarjetas de crédito con estados de cuenta, fuentes de ingreso, presupuestos, metas, préstamos con simulador, un pequeño negocio de reventa y alertas inteligentes, todo calculado en el dispositivo, disponible sin conexión y sincronizado entre dispositivos. La IA opcional nunca inventa una cifra: solo explica, y la captura convierte en un borrador que tú apruebas una captura de aviso del banco, una factura, una nota de voz, un correo o una notificación de la app del banco en el teléfono; el gasto conserva lo que compraste (artículos, factura, impuesto) aunque el aviso del banco y el recibo de la tienda lleguen por separado. Un aviso que llega antes de que agregues su tarjeta espera y la encuentra cuando lo haces, y el nombre de un banco por sí solo nunca confunde dos tarjetas del mismo banco. Se actualiza cuando lo pides: un botón en la app web de iPhone y en la app de Android busca la versión más reciente. Ajustes es un menú corto con una pantalla por tema, un gasto típico toma tres toques con opción de deshacer, y el historial de cambios se lee como oraciones simples. En inglés o español.',
  'apps.open': 'Abrir app',
  'apps.apk': 'APK de Android',
  'apps.apkDirect': 'APK directo',
  'apps.soon': 'Próximamente',
  'apps.ios': 'En iPhone: abre la app en Safari, luego Compartir → Añadir a pantalla de inicio.',

  // Read more
  'readmore.more': 'Leer más',
  'readmore.less': 'Leer menos',

  // Contact
  'contact.title': 'Tienes un proyecto en mente',
  'contact.text': 'Estoy disponible para nuevos proyectos y colaboraciones. No dudes en escribirme.',
  'contact.availability': 'Suele responder en 24 horas · República Dominicana (GMT-4)',
  'form.title': 'Información de contacto',
  'form.preferEmail': '¿Prefieres correo?',
  'form.copied': '✓ ¡Copiado!',
  'form.copyPrompt': 'Copia mi correo:',
  'form.name': 'Nombre',
  'form.namePh': 'Tu nombre',
  'form.nameReq': 'El nombre es obligatorio',
  'form.nameMin': 'El nombre debe tener al menos 2 caracteres',
  'form.email': 'Correo',
  'form.emailReq': 'El correo es obligatorio',
  'form.emailInvalid': 'Ingresa un correo válido',
  'form.reason': 'Motivo del contacto',
  'form.select': 'Selecciona una opción',
  'form.optJob': 'Oportunidad laboral',
  'form.optProject': 'Proyecto',
  'form.optOther': 'Otro motivo',
  'form.reasonReq': 'Elige un motivo',
  'form.message': 'Mensaje',
  'form.messagePh': 'Escribe tu mensaje...',
  'form.messageReq': 'El mensaje es obligatorio',
  'form.messageMin': 'El mensaje debe tener al menos 10 caracteres',
  'form.clear': 'Limpiar',
  'form.send': 'Enviar',
  'form.sending': 'Enviando...',
  'form.okTitle': '¡Mensaje enviado!',
  'form.okText': 'Te responderé pronto.',
  'form.errTitle': 'Algo salió mal',
  'form.errText': 'Inténtalo de nuevo más tarde.',
  'form.waitTitle': 'Espera un momento',
  'form.waitText': 'Podrás enviar otro mensaje en unos segundos.',

  // Footer and document
  'footer.rights': '© 2026 Xaviel Web. Todos los derechos reservados.',
  'footer.contact': 'Contacto',
  'doc.title': 'Xaviel Terrero | Desarrollador de Software',
  'doc.description':
    'Portafolio de Xaviel Terrero, desarrollador de software que crea aplicaciones web y móviles modernas con Angular, TypeScript y Flutter. Disponible para proyectos freelance.',
};

export const TRANSLATIONS: Record<Lang, Record<TranslationKey, string>> = { en, es };
