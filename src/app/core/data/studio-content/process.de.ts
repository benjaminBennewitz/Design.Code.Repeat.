/* src/app/core/data/studio-content/process.de.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Deutsche Inhalte für Arbeitsprozess und FAQ.
 */
export const DE_PROCESS_CONTENT: Pick<StudioContent, 'process' | 'faq'> = {
  process: [
    {
      index: '01',
      title: 'Verstehen',
      text: 'Ziel, Nutzer, bestehende Systeme und echte Einschränkungen werden geklärt.',
      command: 'scope --problem-first',
    },
    {
      index: '02',
      title: 'Strukturieren',
      text: 'Informationsarchitektur, Daten, Komponenten und technische Verantwortlichkeiten werden festgelegt.',
      command: 'plan --architecture',
    },
    {
      index: '03',
      title: 'Bauen',
      text: 'Umsetzung in kleinen, nachvollziehbaren Schritten mit laufender Prüfung von UX, A11Y und Performance.',
      command: 'build --iterate',
    },
    {
      index: '04',
      title: 'Prüfen',
      text: 'Funktionen, Responsive-Verhalten, Fehlerzustände und kritische Pfade werden vor dem Go-live kontrolliert.',
      command: 'test --before-launch',
    },
    {
      index: '05',
      title: 'Betreiben',
      text: 'Deployment, Monitoring, Updates und Weiterentwicklung werden auf Wunsch dauerhaft betreut.',
      command: 'ops --keep-running',
    },
  ],
  faq: [
    {
      question: 'Muss ich schon ein fertiges Konzept haben?',
      answer:
        'Nein. Für den Start reichen Ziel, Problem und grober Kontext. Aus diesen Informationen lässt sich ein sinnvoller Scope entwickeln.',
      relatedLink: { label: 'So läuft ein Projekt ab', route: '/', fragment: 'prozess' },
    },
    {
      question: 'Arbeitest du nur mit Angular und Django?',
      answer:
        'Nein. Angular und Django sind mein Hauptstack für größere Anwendungen. Für eine kompakte Website kann ein schlankerer Stack sinnvoller sein. Die Technologie folgt dem Problem.',
      relatedLink: { label: 'Technik im praktischen Einsatz', route: '/referenzen' },
    },
    {
      question: 'Sind SEO und Accessibility extra Leistungen?',
      answer:
        'Grundlegendes technisches SEO, semantische Struktur, responsive Umsetzung und WCAG-orientierte Accessibility gehören zur Qualitätsbasis. Spezialisierte SEO-Kampagnen oder umfangreiche Audits sind davon zu unterscheiden.',
      relatedLink: { label: 'Leistungsumfang der Webentwicklung', route: '/leistungen/webentwicklung' },
    },
    {
      question: 'Was bedeutet Managed Hosting?',
      answer:
        'Nicht nur Speicherplatz: Einrichtung, SSL, Deployment, Monitoring, Backups, Restore und technische Administration werden passend zum Projekt betreut.',
      relatedLink: { label: 'Managed Hosting im Detail', route: '/leistungen/managed-hosting' },
    },
    {
      question: 'Kann E-Mail mit übernommen werden?',
      answer:
        'Ja, als optionale Ergänzung zu Domain, Website oder Managed Hosting. Dazu gehören je nach Bedarf Postfächer, Aliase und technische Einrichtung.',
      relatedLink: { label: 'E-Mail-Einrichtung und Betreuung', route: '/leistungen/email' },
    },
    {
      question: 'Kannst du bestehende Projekte weiterentwickeln?',
      answer:
        'Ja, sofern Codebasis, Zugänge und technischer Zustand eine seriöse Übernahme zulassen. Vorher wird geprüft, ob gezielte Weiterentwicklung oder ein sauberer Neuaufbau wirtschaftlicher ist.',
      relatedLink: { label: 'Wartung und Weiterentwicklung', route: '/leistungen/wartung' },
    },
  ],
};
