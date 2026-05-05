/**
 * Bilingual dictionary (English + Spanish).
 *
 * Chrome only — data entered by orgs/admins is shown as-typed. Spanish-language
 * services are marked via `organizations.spanish_available` and sector name_es /
 * description_es columns, not via auto-translation.
 */

export type Locale = 'en' | 'es';

export const LOCALES: Locale[] = ['en', 'es'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export type MessageKey =
  | 'brand.name'
  | 'brand.tagline'
  | 'nav.home'
  | 'nav.directory'
  | 'nav.volunteer'
  | 'nav.getHelp'
  | 'nav.about'
  | 'nav.signIn'
  | 'nav.signInOrg'
  | 'nav.signInOrgHint'
  | 'nav.signInAdmin'
  | 'nav.signInAdminHint'
  | 'nav.openMenu'
  | 'nav.closeMenu'
  | 'hero.kicker'
  | 'hero.headline'
  | 'hero.lede'
  | 'hero.ctaHelp'
  | 'hero.ctaVolunteer'
  | 'hero.stat.sectors'
  | 'hero.stat.orgs'
  | 'hero.stat.towns'
  | 'sectors.overlineLabel'
  | 'sectors.sectionTitle'
  | 'sectors.sectionLede'
  | 'sectors.viewAll'
  | 'sectors.orgsLabel'
  | 'sectors.needsLabel'
  | 'sectors.forming'
  | 'sectors.active'
  | 'sectors.archived'
  | 'sectors.orgsCount'
  | 'sectors.volunteerNeedsCount'
  | 'sectors.backToDirectory'
  | 'sectors.viewSector'
  | 'sectors.noOrgs'
  | 'sectors.noOrgsBody'
  | 'sectors.leads'
  | 'sectors.activities'
  | 'sectors.aboutThisSector'
  | 'getHelp.title'
  | 'getHelp.lede'
  | 'getHelp.pickCategory'
  | 'getHelp.seeAll'
  | 'volunteer.title'
  | 'volunteer.lede'
  | 'volunteer.empty'
  | 'volunteer.emptyBody'
  | 'volunteer.filterBySector'
  | 'volunteer.viewOrg'
  | 'volunteer.apply'
  | 'volunteer.applyGeneral'
  | 'volunteer.timeCommitment'
  | 'volunteer.neededDate'
  | 'volunteer.skillsNeeded'
  | 'volunteer.applyForm.title'
  | 'volunteer.applyForm.lede'
  | 'volunteer.applyForm.name'
  | 'volunteer.applyForm.email'
  | 'volunteer.applyForm.phone'
  | 'volunteer.applyForm.willing'
  | 'volunteer.applyForm.willingHint'
  | 'volunteer.applyForm.hours'
  | 'volunteer.applyForm.availability'
  | 'volunteer.applyForm.submit'
  | 'volunteer.applyForm.success'
  | 'volunteer.applyForm.error'
  | 'org.directions'
  | 'org.website'
  | 'org.phone'
  | 'org.email'
  | 'org.mission'
  | 'org.services'
  | 'org.whoServed'
  | 'org.hours'
  | 'org.spanishAvailable'
  | 'org.activeNeeds'
  | 'footer.mission'
  | 'footer.committee'
  | 'footer.quickLinks'
  | 'footer.contact'
  | 'footer.contactLede'
  | 'footer.contactEmail'
  | 'footer.copyright'
  | 'common.loading'
  | 'common.error'
  | 'common.back'
  | 'common.readMore';

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en: {
    'brand.name': 'Carteret Assist Hub',
    'brand.tagline': 'A county-wide directory of help and ways to give help.',
    'nav.home': 'Home',
    'nav.directory': 'Sectors',
    'nav.volunteer': 'Volunteer',
    'nav.getHelp': 'Get help',
    'nav.about': 'About',
    'nav.signIn': 'Sign in',
    'nav.signInOrg': 'Organization',
    'nav.signInOrgHint': 'Update your listing & review applications',
    'nav.signInAdmin': 'Admin',
    'nav.signInAdminHint': 'County community-service committee',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'hero.kicker': 'Carteret County · North Carolina',
    'hero.headline': 'One place for every way this county looks out for its own.',
    'hero.lede':
      'A living index of the non-profits, committees, and volunteers working across thirteen sectors of local need — from food and housing to veterans, the arts, and the coast itself.',
    'hero.ctaHelp': 'I need help',
    'hero.ctaVolunteer': 'I want to volunteer',
    'hero.stat.sectors': 'sectors of need',
    'hero.stat.orgs': 'partner organizations',
    'hero.stat.towns': 'towns served',
    'sectors.overlineLabel': 'The Directory',
    'sectors.sectionTitle': 'Thirteen sectors. One county.',
    'sectors.sectionLede':
      'Each sector is led by a volunteer subcommittee of the county community-service committee. Pick one to see the organizations working there and the ways you can help.',
    'sectors.viewAll': 'View all sectors',
    'sectors.orgsLabel': 'organizations',
    'sectors.needsLabel': 'open volunteer roles',
    'sectors.forming': 'Forming',
    'sectors.active': 'Active',
    'sectors.archived': 'Archived',
    'sectors.orgsCount': 'organizations',
    'sectors.volunteerNeedsCount': 'volunteer roles',
    'sectors.backToDirectory': 'Back to sectors',
    'sectors.viewSector': 'View sector',
    'sectors.noOrgs': 'No organizations listed yet.',
    'sectors.noOrgsBody':
      'This subcommittee is still forming. If you run or know of an organization serving this sector, reach out to the lead.',
    'sectors.leads': 'Subcommittee leadership',
    'sectors.activities': 'Upcoming activity',
    'sectors.aboutThisSector': 'About this sector',
    'getHelp.title': 'What kind of help do you need?',
    'getHelp.lede':
      'Pick a category. We\'ll show you organizations in Carteret County that can help — where they are, when they\'re open, and how to reach them.',
    'getHelp.pickCategory': 'Choose a category',
    'getHelp.seeAll': 'See every organization',
    'volunteer.title': 'Ways to volunteer',
    'volunteer.lede':
      'Roles posted by Carteret County non-profits. Apply to a specific role, or submit a general application and we\'ll match you.',
    'volunteer.empty': 'No open roles right now.',
    'volunteer.emptyBody': 'Check back soon — new opportunities are added weekly.',
    'volunteer.filterBySector': 'Filter by sector',
    'volunteer.viewOrg': 'View organization',
    'volunteer.apply': 'Apply for this role',
    'volunteer.applyGeneral': 'Submit general application',
    'volunteer.timeCommitment': 'Time commitment',
    'volunteer.neededDate': 'Needed by',
    'volunteer.skillsNeeded': 'Skills needed',
    'volunteer.applyForm.title': 'Volunteer application',
    'volunteer.applyForm.lede':
      'We share your application with the organization you\'re applying to (and with the county advisor). They\'ll reach out to you directly.',
    'volunteer.applyForm.name': 'Full name',
    'volunteer.applyForm.email': 'Email',
    'volunteer.applyForm.phone': 'Phone (optional)',
    'volunteer.applyForm.willing': 'What you\'re willing to help with',
    'volunteer.applyForm.willingHint':
      'Tell us in a few sentences. Any relevant experience, preferred type of work, anything the org should know.',
    'volunteer.applyForm.hours': 'Hours per week you can commit',
    'volunteer.applyForm.availability': 'Days / times you\'re available',
    'volunteer.applyForm.submit': 'Send application',
    'volunteer.applyForm.success': 'Sent. The organization will be in touch.',
    'volunteer.applyForm.error': 'Something went wrong. Please try again.',
    'org.directions': 'Get directions',
    'org.website': 'Website',
    'org.phone': 'Phone',
    'org.email': 'Email',
    'org.mission': 'Mission',
    'org.services': 'Services offered',
    'org.whoServed': 'Who they serve',
    'org.hours': 'Hours',
    'org.spanishAvailable': 'Spanish-language services available',
    'org.activeNeeds': 'Open volunteer roles',
    'footer.mission':
      'A project of the Carteret County Democratic Party — Community Service Committee, in partnership with local non-profit partners. Listing an organization is free.',
    'footer.committee': 'Community Service Committee',
    'footer.quickLinks': 'Quick links',
    'footer.contact': 'Get in touch',
    'footer.contactLede':
      'Run a non-profit, support other non-profits, or have a volunteer opportunity to post? Email the committee.',
    'footer.contactEmail': 'committee@carteretassisthub.org',
    'footer.copyright': '© 2026 Carteret County Community Service Committee.',
    'common.loading': 'Loading…',
    'common.error': 'Something went wrong.',
    'common.back': 'Back',
    'common.readMore': 'Read more',
  },
  es: {
    'brand.name': 'Carteret Assist Hub',
    'brand.tagline': 'Un directorio del condado para obtener ayuda y dar ayuda.',
    'nav.home': 'Inicio',
    'nav.directory': 'Sectores',
    'nav.volunteer': 'Voluntariado',
    'nav.getHelp': 'Obtener ayuda',
    'nav.about': 'Acerca de',
    'nav.signIn': 'Iniciar sesión',
    'nav.signInOrg': 'Organización',
    'nav.signInOrgHint': 'Actualizar su listado y revisar solicitudes',
    'nav.signInAdmin': 'Administrador',
    'nav.signInAdminHint': 'Comité de servicio comunitario del condado',
    'nav.openMenu': 'Abrir menú',
    'nav.closeMenu': 'Cerrar menú',
    'hero.kicker': 'Condado de Carteret · Carolina del Norte',
    'hero.headline': 'Un solo lugar para todas las formas en que este condado se cuida.',
    'hero.lede':
      'Un índice vivo de las organizaciones sin fines de lucro, comités y voluntarios que trabajan en trece sectores de necesidad local — desde alimentos y vivienda hasta veteranos, las artes y la costa misma.',
    'hero.ctaHelp': 'Necesito ayuda',
    'hero.ctaVolunteer': 'Quiero ser voluntario',
    'hero.stat.sectors': 'sectores de necesidad',
    'hero.stat.orgs': 'organizaciones aliadas',
    'hero.stat.towns': 'pueblos atendidos',
    'sectors.overlineLabel': 'El Directorio',
    'sectors.sectionTitle': 'Trece sectores. Un condado.',
    'sectors.sectionLede':
      'Cada sector está dirigido por un subcomité voluntario del comité de servicio comunitario del condado. Elija uno para ver las organizaciones que trabajan allí y las formas en que puede ayudar.',
    'sectors.viewAll': 'Ver todos los sectores',
    'sectors.orgsLabel': 'organizaciones',
    'sectors.needsLabel': 'puestos de voluntariado abiertos',
    'sectors.forming': 'En formación',
    'sectors.active': 'Activo',
    'sectors.archived': 'Archivado',
    'sectors.orgsCount': 'organizaciones',
    'sectors.volunteerNeedsCount': 'puestos de voluntariado',
    'sectors.backToDirectory': 'Volver a sectores',
    'sectors.viewSector': 'Ver sector',
    'sectors.noOrgs': 'Aún no hay organizaciones listadas.',
    'sectors.noOrgsBody':
      'Este subcomité aún se está formando. Si usted dirige o conoce una organización de este sector, contacte al líder.',
    'sectors.leads': 'Liderazgo del subcomité',
    'sectors.activities': 'Próxima actividad',
    'sectors.aboutThisSector': 'Sobre este sector',
    'getHelp.title': '¿Qué tipo de ayuda necesita?',
    'getHelp.lede':
      'Elija una categoría. Le mostraremos organizaciones del condado de Carteret que pueden ayudar — dónde están, cuándo están abiertas y cómo contactarlas.',
    'getHelp.pickCategory': 'Elegir una categoría',
    'getHelp.seeAll': 'Ver todas las organizaciones',
    'volunteer.title': 'Formas de ser voluntario',
    'volunteer.lede':
      'Puestos publicados por organizaciones sin fines de lucro del condado de Carteret. Postule a un puesto específico o envíe una solicitud general y lo emparejaremos.',
    'volunteer.empty': 'No hay puestos abiertos en este momento.',
    'volunteer.emptyBody': 'Vuelva pronto — se agregan nuevas oportunidades cada semana.',
    'volunteer.filterBySector': 'Filtrar por sector',
    'volunteer.viewOrg': 'Ver organización',
    'volunteer.apply': 'Postular a este puesto',
    'volunteer.applyGeneral': 'Enviar solicitud general',
    'volunteer.timeCommitment': 'Compromiso de tiempo',
    'volunteer.neededDate': 'Se necesita para',
    'volunteer.skillsNeeded': 'Habilidades requeridas',
    'volunteer.applyForm.title': 'Solicitud de voluntariado',
    'volunteer.applyForm.lede':
      'Compartimos su solicitud con la organización a la que postula (y con el asesor del condado). Se comunicarán con usted directamente.',
    'volunteer.applyForm.name': 'Nombre completo',
    'volunteer.applyForm.email': 'Correo electrónico',
    'volunteer.applyForm.phone': 'Teléfono (opcional)',
    'volunteer.applyForm.willing': 'En qué está dispuesto a ayudar',
    'volunteer.applyForm.willingHint':
      'Cuéntenos en unas frases. Experiencia relevante, tipo de trabajo preferido, cualquier cosa que la organización deba saber.',
    'volunteer.applyForm.hours': 'Horas por semana que puede comprometer',
    'volunteer.applyForm.availability': 'Días y horarios disponibles',
    'volunteer.applyForm.submit': 'Enviar solicitud',
    'volunteer.applyForm.success': 'Enviado. La organización se pondrá en contacto.',
    'volunteer.applyForm.error': 'Algo salió mal. Por favor, inténtelo de nuevo.',
    'org.directions': 'Cómo llegar',
    'org.website': 'Sitio web',
    'org.phone': 'Teléfono',
    'org.email': 'Correo electrónico',
    'org.mission': 'Misión',
    'org.services': 'Servicios ofrecidos',
    'org.whoServed': 'A quién sirven',
    'org.hours': 'Horario',
    'org.spanishAvailable': 'Servicios disponibles en español',
    'org.activeNeeds': 'Puestos de voluntariado abiertos',
    'footer.mission':
      'Un proyecto del Partido Demócrata del Condado de Carteret — Comité de Servicio Comunitario, en colaboración con organizaciones sin fines de lucro locales. Listar una organización es gratis.',
    'footer.committee': 'Comité de Servicio Comunitario',
    'footer.quickLinks': 'Enlaces rápidos',
    'footer.contact': 'Comuníquese',
    'footer.contactLede':
      '¿Dirige una organización sin fines de lucro, apoya a otras, o tiene una oportunidad de voluntariado para publicar? Escríbale al comité.',
    'footer.contactEmail': 'committee@carteretassisthub.org',
    'footer.copyright': '© 2026 Comité de Servicio Comunitario del Condado de Carteret.',
    'common.loading': 'Cargando…',
    'common.error': 'Algo salió mal.',
    'common.back': 'Volver',
    'common.readMore': 'Leer más',
  },
};

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key;
}
