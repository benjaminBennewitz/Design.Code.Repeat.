/* src/app/pages/faq-page/faq.models.ts */

/** Einzelne Frage mit stabilem Ziel und bereits normalisiertem Suchtext. */
export interface SearchableFaq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly fragment?: string;
  readonly route: string;
  readonly searchText: string;
}

/** Themenblock der zentralen FAQ-Seite. */
export interface FaqGroup {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly items: readonly SearchableFaq[];
}
