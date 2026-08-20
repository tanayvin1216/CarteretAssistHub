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
  | 'nav.allies'
  | 'nav.report'
  | 'nav.resources'
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
  | 'getHelp.resourcesTitle'
  | 'getHelp.resourcesLede'
  | 'getHelp.resourcesCta'
  | 'resources.title'
  | 'resources.lede'
  | 'resources.searchPlaceholder'
  | 'resources.allCategories'
  | 'resources.results'
  | 'resources.result'
  | 'resources.noResults'
  | 'resources.clear'
  | 'resources.jumpTo'
  | 'resources.filterTown'
  | 'resources.allTowns'
  | 'resources.call'
  | 'resources.visit'
  | 'resources.email'
  | 'resources.relatedSector'
  | 'resources.source'
  | 'resources.print'
  | 'about.eyebrow'
  | 'about.title'
  | 'about.lede'
  | 'allies.eyebrow'
  | 'allies.title'
  | 'allies.lede'
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
  | 'report.eyebrow'
  | 'report.title'
  | 'report.lede'
  | 'report.form.type'
  | 'report.type.listing_issue'
  | 'report.type.listing_issueHint'
  | 'report.type.unmet_need'
  | 'report.type.unmet_needHint'
  | 'report.type.other'
  | 'report.type.otherHint'
  | 'report.form.organization'
  | 'report.form.organizationHint'
  | 'report.form.sector'
  | 'report.form.sectorHint'
  | 'report.form.none'
  | 'report.form.details'
  | 'report.form.detailsHint'
  | 'report.form.contactTitle'
  | 'report.form.contactLede'
  | 'report.form.name'
  | 'report.form.email'
  | 'report.form.phone'
  | 'report.form.submit'
  | 'report.form.success'
  | 'report.form.error'
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
  | 'pdf.link'
  | 'pdf.title'
  | 'pdf.lede'
  | 'pdf.cta'
  | 'pdf.note'
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
    'nav.allies': 'Allies',
    'nav.report': 'Report',
    'nav.resources': 'Resources',
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
    'getHelp.resourcesTitle': 'Looking for a specific service?',
    'getHelp.resourcesLede':
      'The Resource Aide directory lists every local service by need — food pantries, clinics, shelters, senior care, transportation, legal aid and more.',
    'getHelp.resourcesCta': 'Browse the resource directory',
    'resources.title': 'Carteret County resource directory',
    'resources.lede':
      'Every service in the county Resource Aide booklet, grouped by the kind of help you need. Search by name, town, or what you are looking for.',
    'resources.searchPlaceholder': 'Search by name, town, or service…',
    'resources.allCategories': 'All categories',
    'resources.results': 'results',
    'resources.result': 'result',
    'resources.noResults': 'Nothing matches that search. Try a shorter word, or clear the filters.',
    'resources.clear': 'Clear filters',
    'resources.jumpTo': 'Jump to a category',
    'resources.filterTown': 'Town',
    'resources.allTowns': 'All towns',
    'resources.call': 'Call',
    'resources.visit': 'Website',
    'resources.email': 'Email',
    'resources.relatedSector': 'Related sector',
    'resources.source':
      'From the Carteret County and Surrounding Area Resource Aide, maintained by the Community Service Committee. Something out of date? Tell us.',
    'resources.print': 'Print this directory',
    'about.eyebrow': 'About',
    'about.title': 'About Assist Hub',
    'about.lede':
      'A single directory of the people and organizations taking care of Carteret County, NC.',
    'allies.eyebrow': 'The network behind the network',
    'allies.title': 'Allies & Funders',
    'allies.lede':
      'Local foundations, giving circles, and peer-support networks that fund and resource Carteret County non-profits. They don’t serve residents directly — they make sure the organizations that do can keep going.',
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
    'report.eyebrow': 'Tell the committee',
    'report.title': 'Something we should know about?',
    'report.lede':
      'This directory is only as good as the county keeps it. If a listing is wrong, a program has closed, or you see a need nobody is covering — tell us. Reports go straight to the community service committee.',
    'report.form.type': 'What are you reporting?',
    'report.type.listing_issue': 'A listing is wrong or closed',
    'report.type.listing_issueHint': 'Bad hours, disconnected phone, a program that no longer runs.',
    'report.type.unmet_need': 'An unmet need in the county',
    'report.type.unmet_needHint': 'A gap in coverage — something people need and nobody provides.',
    'report.type.other': 'Something else',
    'report.type.otherHint': 'Anything the committee should hear about.',
    'report.form.organization': 'Which organization?',
    'report.form.organizationHint': 'Leave blank if it isn\'t one of these.',
    'report.form.sector': 'Which sector does this fall under?',
    'report.form.sectorHint': 'Optional — helps us route it to the right subcommittee.',
    'report.form.none': 'Not sure / not listed',
    'report.form.details': 'What should we know?',
    'report.form.detailsHint':
      'Be as specific as you can — what you saw, when, and what should change.',
    'report.form.contactTitle': 'How to reach you (optional)',
    'report.form.contactLede':
      'Leave this blank to report anonymously. We only use it if we need to follow up.',
    'report.form.name': 'Your name',
    'report.form.email': 'Email',
    'report.form.phone': 'Phone',
    'report.form.submit': 'Send report',
    'report.form.success': 'Report sent. Thank you.',
    'report.form.error': 'Something went wrong. Please try again.',
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
    'pdf.link': 'Printed directory (PDF)',
    'pdf.title': 'Take the whole directory with you',
    'pdf.lede':
      'Every organization in the county, grouped by sector, typeset as a printable booklet — for waiting rooms, food pantry tables, home visits, and anyone who cannot get online.',
    'pdf.cta': 'Download the PDF',
    'pdf.note': 'Built fresh each time you download it, so it always matches the site.',
    'footer.mission':
      'A project of the Carteret County Democratic Party — Community Service Committee, in partnership with local non-profit partners. Listing an organization is free.',
    'footer.committee': 'Community Service Committee',
    'footer.quickLinks': 'Quick links',
    'footer.contact': 'Get in touch',
    'footer.contactLede':
      'Run a non-profit, support other non-profits, or have a volunteer opportunity to post? Email the committee.',
    'footer.contactEmail': 'communityservicecarteret@gmail.com',
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
    'nav.allies': 'Aliados',
    'nav.report': 'Reportar',
    'nav.resources': 'Recursos',
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
    'getHelp.resourcesTitle': '¿Busca un servicio específico?',
    'getHelp.resourcesLede':
      'El directorio de Centros de ayuda y recursos enumera todos los servicios locales según la necesidad: despensas de alimentos, clínicas, refugios, cuidado de personas mayores, transporte, asistencia legal y más.',
    'getHelp.resourcesCta': 'Ver el directorio de recursos',
    'resources.title': 'Directorio de recursos del condado de Carteret',
    'resources.lede':
      'Todos los servicios del folleto de Centros de ayuda y recursos del condado, agrupados según el tipo de ayuda que necesita. Busque por nombre, ciudad o el servicio que busca.',
    'resources.searchPlaceholder': 'Buscar por nombre, ciudad o servicio…',
    'resources.allCategories': 'Todas las categorías',
    'resources.results': 'resultados',
    'resources.result': 'resultado',
    'resources.noResults':
      'No hay coincidencias. Pruebe con una palabra más corta o borre los filtros.',
    'resources.clear': 'Borrar filtros',
    'resources.jumpTo': 'Ir a una categoría',
    'resources.filterTown': 'Ciudad',
    'resources.allTowns': 'Todas las ciudades',
    'resources.call': 'Llamar',
    'resources.visit': 'Sitio web',
    'resources.email': 'Correo',
    'resources.relatedSector': 'Sector relacionado',
    'resources.source':
      'Del folleto Centros de ayuda y recursos del condado de Carteret y sus alrededores, a cargo del Comité de Servicio Comunitario. ¿Algo desactualizado? Avísenos.',
    'resources.print': 'Imprimir este directorio',
    'about.eyebrow': 'Acerca de',
    'about.title': 'Acerca de Assist Hub',
    'about.lede':
      'Un directorio único de las personas y organizaciones que cuidan del Condado de Carteret, NC.',
    'allies.eyebrow': 'La red detrás de la red',
    'allies.title': 'Aliados y Financiadores',
    'allies.lede':
      'Fundaciones locales, círculos de donación y redes de apoyo que financian y dan recursos a las organizaciones sin fines de lucro del Condado de Carteret. No atienden directamente a los residentes — se aseguran de que las organizaciones que sí lo hacen puedan seguir adelante.',
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
    'report.eyebrow': 'Informe al comité',
    'report.title': '¿Hay algo que debamos saber?',
    'report.lede':
      'Este directorio solo funciona si el condado lo mantiene al día. Si un listado está incorrecto, un programa cerró, o usted ve una necesidad que nadie está cubriendo — díganos. Los reportes llegan directamente al comité de servicio comunitario.',
    'report.form.type': '¿Qué desea reportar?',
    'report.type.listing_issue': 'Un listado está incorrecto o cerrado',
    'report.type.listing_issueHint':
      'Horario equivocado, teléfono desconectado, un programa que ya no existe.',
    'report.type.unmet_need': 'Una necesidad sin cubrir en el condado',
    'report.type.unmet_needHint':
      'Un vacío en la cobertura — algo que la gente necesita y nadie ofrece.',
    'report.type.other': 'Otra cosa',
    'report.type.otherHint': 'Cualquier cosa que el comité deba saber.',
    'report.form.organization': '¿Cuál organización?',
    'report.form.organizationHint': 'Déjelo en blanco si no es ninguna de estas.',
    'report.form.sector': '¿A qué sector corresponde?',
    'report.form.sectorHint': 'Opcional — nos ayuda a enviarlo al subcomité correcto.',
    'report.form.none': 'No estoy seguro / no aparece',
    'report.form.details': '¿Qué debemos saber?',
    'report.form.detailsHint':
      'Sea lo más específico posible — qué vio, cuándo, y qué debería cambiar.',
    'report.form.contactTitle': 'Cómo comunicarnos con usted (opcional)',
    'report.form.contactLede':
      'Deje esto en blanco para reportar de forma anónima. Solo lo usamos si necesitamos dar seguimiento.',
    'report.form.name': 'Su nombre',
    'report.form.email': 'Correo electrónico',
    'report.form.phone': 'Teléfono',
    'report.form.submit': 'Enviar reporte',
    'report.form.success': 'Reporte enviado. Gracias.',
    'report.form.error': 'Algo salió mal. Inténtelo de nuevo.',
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
    'pdf.link': 'Directorio impreso (PDF)',
    'pdf.title': 'Lleve el directorio completo con usted',
    'pdf.lede':
      'Todas las organizaciones del condado, agrupadas por sector, en un folleto listo para imprimir — para salas de espera, despensas de alimentos, visitas a domicilio y quienes no pueden conectarse.',
    'pdf.cta': 'Descargar el PDF',
    'pdf.note': 'Se genera en el momento de la descarga, así que siempre coincide con el sitio.',
    'footer.mission':
      'Un proyecto del Partido Demócrata del Condado de Carteret — Comité de Servicio Comunitario, en colaboración con organizaciones sin fines de lucro locales. Listar una organización es gratis.',
    'footer.committee': 'Comité de Servicio Comunitario',
    'footer.quickLinks': 'Enlaces rápidos',
    'footer.contact': 'Comuníquese',
    'footer.contactLede':
      '¿Dirige una organización sin fines de lucro, apoya a otras, o tiene una oportunidad de voluntariado para publicar? Escríbale al comité.',
    'footer.contactEmail': 'communityservicecarteret@gmail.com',
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
