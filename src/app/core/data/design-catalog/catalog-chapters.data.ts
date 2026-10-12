/* src/app/core/data/design-catalog/catalog-chapters.data.ts */
import type { DesignCatalogChapterSeed } from './catalog-seed.models';

/**
 * Anzahl der ausgelieferten Katalogseiten einschließlich Cover und Rückseite.
 */
export const DESIGN_CATALOG_PAGE_COUNT = 54;

/**
 * Geordnete Kapitelmetadaten des Printkatalogs.
 */
export const DESIGN_CATALOG_CHAPTERS: readonly DesignCatalogChapterSeed[] = [
  {
    number: '01',
    title: 'Personal Profile',
    subtitle: 'resume CV',
    startPage: 4,
    text: 'Who is the guy whose portfolio you are holding in your hands? And what is behind the name UNIQUE IDEA?',
    tool: 'Motivation - Analysis',
    mood: 'type',
  },
  {
    number: '02',
    title: 'Processing',
    subtitle: 'chaos or symmetry',
    startPage: 5,
    text: 'I like the idea of controlling chaos. A paradox. Is that even possible - I think so.',
    tool: 'Processing - Generative Arts',
    mood: 'image',
  },
  {
    number: '03',
    title: 'Illustrations',
    subtitle: 'vector arts',
    startPage: 11,
    text: 'There is nothing nicer than pin-sharp typography - it is essential for printing.',
    tool: 'Illustrator CC',
    mood: 'type',
  },
  {
    number: '04',
    title: 'Image Processing',
    subtitle: 'and photography',
    startPage: 19,
    text: 'Digital image editing is a miracle with great power. It makes us wonder and laugh.',
    tool: 'Photoshop CC',
    mood: 'detail',
  },
  {
    number: '05',
    title: 'Layout and Typo',
    subtitle: 'printing stuff',
    startPage: 43,
    text: 'The classical advertising media, indispensable for anyone who wants to present themselves.',
    tool: 'InDesign CC',
    mood: 'cover',
  },
];
