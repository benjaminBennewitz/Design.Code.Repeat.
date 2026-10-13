/* src/app/shared/system-page/system-page-ui.data.ts */
export const SYSTEM_PAGE_UI = {
  // Lokalisierte Steuertexte der beiden Statusseiten.
  de: {
    navigation: 'Hier geht es weiter',
    linkDescriptions: {
      '/': 'Zurück zum Überblick',
      '/referenzen': 'Arbeiten entdecken',
      '/studio': 'Wer dahintersteckt',
    },
    notFound: {
      eyebrow: 'Falsche Abzweigung',
      title: 'Hier geht’s nicht weiter.',
      label: 'Seite nicht gefunden',
      note: 'Kein Treffer. Aber gute Ziele.',
    },
    thankYou: { eyebrow: 'Nachricht angekommen', title: 'Guter Anfang. Danke!', status: 'Antwort folgt per E-Mail' },
  },
  en: {
    navigation: 'Where to next',
    linkDescriptions: { '/': 'Back to the overview', '/referenzen': 'Explore the work', '/studio': 'Meet the studio' },
    notFound: {
      eyebrow: 'Wrong turn',
      title: 'Nothing here. Yet.',
      label: 'Page not found',
      note: 'No match. Still plenty to explore.',
    },
    thankYou: { eyebrow: 'Message received', title: 'Great start. Thank you!', status: 'Reply follows by email' },
  },
};
