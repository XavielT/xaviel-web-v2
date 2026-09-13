/**
 * Spanish dictionary — the default language, and the shape every other language
 * must match.
 *
 * `TranslationKey` is derived from this object and `en.ts` is typed as a
 * complete record of it, so a missing or misspelled English key fails the build
 * rather than quietly showing the raw key to a visitor.
 *
 * Note this is the reverse of Music Hub, where English is the source of shape.
 * Spanish leads here because Spanish is this site's default (ADR-05), and the
 * dictionary that defines the keys should be the one that is never incomplete.
 *
 * Keys are dotted and grouped by the page section they appear in, so a key read
 * on its own says where it renders. `{name}` placeholders are filled by
 * `t(key, { name })`.
 *
 * Written in informal "tú" — this is a personal portfolio, not a bank.
 *
 * WHAT IS NOT IN HERE. Proper nouns and technical terms are deliberately left as
 * literals in the markup and in `app.ts`: brand names (GitHub, Linkedin,
 * Whatsapp, Gmail), project and app names (X AutoHub, Good Drive, Mi Taller,
 * Pork Tech, Music Hub, Tu Combustible RD), technology badges (Angular, Expo,
 * Supabase, PWA…) and skill names. Translating any of them would be wrong in
 * both languages.
 */
export const ES = {
  // --- navigation ---------------------------------------------------------
  'nav.home': 'Inicio',
  'nav.about': 'Sobre mí',
  'nav.mainProjects': 'Proyectos',
  'nav.apps': 'Apps',
  'nav.skills': 'Habilidades',
  'nav.certificates': 'Certificados',
  'nav.contact': 'Contacto',

  // --- language selector --------------------------------------------------
  'lang.label': 'Idioma',
  'lang.switchTo': 'Cambiar idioma a {name}',

  // --- document -----------------------------------------------------------
  'meta.title': 'Xaviel Web — Desarrollador de Software',

  // --- home / hero --------------------------------------------------------
  'home.badge': 'Disponible para proyectos',
  // The highlighted half is always the second one, so each language decides
  // which word carries the emphasis: English lands it on "Developer", Spanish
  // on "Software". Both read naturally; neither is a literal echo of the other.
  'home.titleLead': 'Desarrollador de',
  'home.titleHighlight': 'Software',
  'home.tagline':
    'Creo experiencias web modernas y funcionales. Especializado en Angular y diseño de interfaces.',
  'home.viewProjects': 'Ver proyectos',
  'home.contact': 'Contacto',

  // --- about --------------------------------------------------------------
  'about.title': 'Sobre mí',
  'about.titleIconAlt': 'Icono de perfil',
  'about.description':
    'Desarrollador de software enfocado en frontend. Construyo aplicaciones web modernas con Angular, TypeScript y JavaScript, y me especializo en interfaces limpias, experiencias de usuario fluidas y arquitectura frontend escalable.',
  'about.resume': 'Ver currículum',
  'about.statIconAlt': 'Icono',
  'about.completedProjects': 'Proyectos completados',
  'about.yearsExperience': 'Años de experiencia',
  'about.satisfiedCustomers': 'Clientes satisfechos',

  // --- main projects ------------------------------------------------------
  'projects.title': 'Proyectos principales',
  'projects.subtitle': 'Algunos de mis trabajos recientes',

  // --- apps ---------------------------------------------------------------
  'apps.title': 'Apps',
  'apps.subtitle': 'Cosas que puedes instalar y usar',
  // Both apps ship the same hint, so it lives once rather than per app.
  'apps.iosHint':
    'En iPhone: abre la app en Safari y luego Compartir → Añadir a pantalla de inicio.',
  'appCard.open': 'Abrir app',
  'appCard.apk': 'APK de Android',
  'appCard.comingSoon': 'Próximamente',
  'appCard.iconAlt': 'Icono de {name}',

  // --- skills -------------------------------------------------------------
  'skills.title': 'Habilidades',
  'skills.subtitle': 'Tecnologías principales con las que trabajo',
  'skills.iconAlt': 'Icono de habilidad',

  // --- certificates -------------------------------------------------------
  // The section is commented out in app.html; these exist so uncommenting it
  // does not reintroduce untranslated markup.
  'certificates.title': 'Certificados',
  'certificates.subtitle': 'Tecnologías con las que trabajo',
  'certificates.linkIconAlt': 'Icono de enlace',

  // --- contact ------------------------------------------------------------
  // Spanish opens a question with "¿"; English has no such mark, so its opening
  // key is empty. The span it sits in carries only a font, so an empty value
  // renders nothing.
  'contact.titleOpen': '¿',
  'contact.title': 'Tienes un proyecto en mente',
  'contact.titleClose': '?',
  'contact.subtitle':
    'Estoy disponible para nuevos proyectos y colaboraciones. Escríbeme sin compromiso.',

  // --- contact form -------------------------------------------------------
  'form.heading': 'Información de contacto',
  'form.name': 'Nombre',
  'form.namePlaceholder': 'Tu nombre',
  'form.nameRequired': 'El nombre es obligatorio',
  'form.nameMinLength': 'El nombre debe tener al menos 2 caracteres',
  'form.email': 'Correo',
  'form.emailPlaceholder': 'tucorreo@gmail.com',
  'form.emailRequired': 'El correo es obligatorio',
  'form.emailInvalid': 'Escribe un correo válido',
  'form.reason': 'Motivo del contacto',
  'form.selectOption': 'Selecciona una opción',
  'form.reasonJob': 'Oportunidad de trabajo',
  'form.reasonProject': 'Proyecto',
  'form.reasonOther': 'Otro motivo',
  'form.message': 'Mensaje',
  'form.messagePlaceholder': 'Escribe tu mensaje...',
  'form.messageRequired': 'El mensaje es obligatorio',
  'form.messageMinLength': 'El mensaje debe tener al menos 10 caracteres',
  'form.clear': 'Limpiar',
  'form.send': 'Enviar',
  'form.sending': 'Enviando...',
  'form.successTitle': '¡Mensaje enviado!',
  'form.successBody': 'Te responderé pronto.',
  'form.errorTitle': 'Algo salió mal',
  'form.errorBody': 'Inténtalo de nuevo más tarde.',
  'form.rateLimitTitle': 'Espera un momento',
  'form.rateLimitBody': 'Puedes enviar otro mensaje en unos segundos.',
  'form.inputIconAlt': 'Icono del campo',
  'form.sendIconAlt': 'Icono de enviar',

  // --- footer -------------------------------------------------------------
  'footer.rights': '© 2026 Xaviel Web. Todos los derechos reservados.',
  'footer.contact': 'Contacto',

  // --- maintenance placeholder --------------------------------------------
  'maintenance.title': 'Esta sección está en mantenimiento',
  'maintenance.subtitle': 'Estará disponible pronto',
  'maintenance.iconAlt': 'Icono de mantenimiento',

  // --- app catalog prose (data lives in app.ts, which stores these keys) ---
  'app.musicHub.description':
    'App de música personal: sube tus propias canciones, se sincronizan en todos tus dispositivos con Supabase y las descargas para escucharlas sin conexión. Se instala en iPhone y en computadora, y tiene una versión nativa para Android.',
  'app.tuCombustible.description':
    'Control de combustible y gastos para conductores dominicanos: registra cada carga, mira tu rendimiento real en km/gal y el costo por kilómetro, y lleva los gastos y el mantenimiento de cada vehículo. Los precios usan la referencia semanal del MICM. Todo se queda en tu dispositivo.',

  // --- project prose (data lives in app.ts, which stores these keys) -------
  'project.xAutohub.description':
    'Sitio web para mostrar un catálogo de piezas y vehículos. Implementación de búsqueda, filtrado y carrito de compras. Integración de pasarela de pago y panel de administración para gestionar productos y pedidos.',
  'project.goodDrive.description':
    'App móvil de transporte tipo Uber o inDriver, con un sistema de referidos como diferencial. Implementación de geolocalización, chat en tiempo real, sistema de calificaciones, vista de conductor y pasajero, y referidos con recompensas.',
  'project.miTaller.description':
    'Web para la gestión de talleres mecánicos. Implementación de gestión de clientes, vehículos, órdenes de trabajo, inventario y facturación. Integración de sistema de notificaciones y panel de administración para dar seguimiento a tareas y estadísticas.',
  'project.porkTech.description':
    'App móvil para la gestión de granjas porcinas. Implementación de monitoreo de animales, control de alimentación, control sanitario, registro de eventos y generación de reportes. Integración de sistema de notificaciones para alertas y recordatorios.',

  // --- certificate names (data lives in app.ts, which stores these keys) ---
  'certificate.responsiveDesign.name': 'Diseño web adaptable',
  'certificate.scrumFundamentals.name': 'Fundamentos de Scrum',
  'certificate.jiraFundamentals.name': 'Fundamentos de Jira',
} as const;

export type TranslationKey = keyof typeof ES;
