/* src/app/core/data/studio-content/delivered-projects.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für realisierte Kundenprojekte.
 */
export const DE_DELIVERED_PROJECTS_CONTENT: Pick<StudioContent, 'deliveredProjects'> = {
  deliveredProjects: [
    {
      summary:
        'Ein kompakter Webauftritt für einen Fensterreinigungsservice. Leistungen, Preise und Kontaktmöglichkeiten geben Besuchern eine direkte Orientierung zum Angebot.',
      details: [
        'Leistungen und Preisorientierung',
        'Servicebereiche und Kontaktwege',
        'Schlanke Umsetzung mit HTML, CSS und JavaScript',
      ],
      name: 'glashelden24.de',
      url: 'https://glashelden24.de',
      label: 'Website / Direkt, schlank, schnell',
      stack: ['HTML', 'JavaScript', 'CSS'],
      image: 'assets/images/projects/clients/glashelden24.webp',
      imageAlt: 'Startseite von glashelden24.de mit Hero, Preisübersicht und Servicebereichen',
    },
    {
      summary:
        'Eine WordPress-Präsenz für ein Unternehmen im UV-Gel-Bereich. Produktinformationen, Beratung und Neuigkeiten bilden die Schwerpunkte des Auftritts.',
      details: [
        'Strukturierte Produktbereiche',
        'Beratung und Unternehmensinformationen',
        'Pflegbare Inhalte mit WordPress und Elementor',
      ],
      name: 'Sk-uvgele.de',
      url: 'https://sk-uvgele.de',
      label: 'Unternehmen / WordPress-Präsenz',
      stack: ['WordPress', 'Elementor', 'HTML', 'CSS'],
      image: 'assets/images/projects/clients/sk-uvgele.webp',
      imageAlt: 'Startseite von Sk-uvgele.de mit Produktbereichen, Beratung und News',
    },
    {
      summary:
        'Ein Webauftritt für Wellness- und Beauty-Angebote mit integriertem Shop. Behandlungen und Produkte werden in einem gemeinsamen Auftritt präsentiert.',
      details: [
        'Behandlungs- und Angebotsübersicht',
        'Produktverkauf über WooCommerce',
        'Redaktionelle Pflege mit WordPress',
      ],
      name: 'beautynailresort.de',
      url: 'https://beautynailresort.de',
      label: 'Wellness & Spa / Website + Shop',
      stack: ['WordPress', 'WooCommerce', 'Elementor', 'HTML', 'CSS'],
      image: 'assets/images/projects/clients/beautynailresort.webp',
      imageAlt: 'Startseite von beautynailresort.de mit Behandlungen, Empfehlungen und Shop-Elementen',
    },
    {
      summary:
        'Eine Website für eine psychotherapeutische Praxis. Behandlungsangebot, Praxisinformationen und Kontaktwege stehen in einer ruhigen, übersichtlichen Gestaltung im Vordergrund.',
      details: [
        'Behandlungsangebot und Praxisinformationen',
        'Klare Struktur für die Orientierung',
        'Individuelles Angular-Frontend und technisches SEO',
      ],
      name: 'praxis-perspektiefe.de',
      url: 'https://praxis-perspektiefe.de',
      label: 'Psychotherapie / Website + SEO',
      stack: ['Angular', 'TypeScript', 'SCSS', 'SEO'],
      image: 'assets/images/projects/clients/praxis-perspektiefe.webp',
      imageAlt: 'Startseite der psychotherapeutischen Praxis mit Behandlungsangebot und Praxisinformationen',
    },
    {
      summary:
        'Ein Vereinsauftritt mit Informationen, Terminen und Gartenwissen. Ein kleines CMS ergänzt das Angular-Frontend um die Pflege der Vereinsinhalte.',
      details: [
        'Vereinsinformationen und Termine',
        'Redaktionelle Inhalte rund um den Garten',
        'Angular-Frontend mit Django und REST API',
      ],
      name: 'KGV1925',
      url: '#',
      label: 'Kleingartenverein / Angular + Mini-CMS',
      stack: ['Angular', 'Django', 'REST API', 'PostgreSQL'],
      image: 'assets/images/projects/clients/kgv1925.webp',
      imageAlt: 'Startseite des Kleingartenvereins mit Vereinsinfos, Terminen und Gartenwissen',
    },
  ],
};
