/* src/app/core/data/design-catalog/gallery/editorial.data.ts */
import type { DesignCatalogGallerySeed } from '../catalog-seed.models';

/**
 * Galeriearbeiten: Editorial.
 */
export const EDITORIAL_GALLERY_ITEMS: readonly DesignCatalogGallerySeed[] = [
  {
    file: '26',
    size: 'md',
    icon: 'campaign',
    tools: ['Photoshop', 'Lightroom'],
    year: '2022',
    de: {
      title: 'Made In Flyer',
      text: 'Flyerdesign für Your-Origin mit eigener Fotografie und ganzheitlichem Look.',
      detail:
        'Flyerdesign für die Firma Your-Origin. Die Fotos wurden von mir selbst erstellt, in RAW entwickelt, nachbearbeitet und anschließend in das Layout eingebunden. Der Flyer ist ein gutes Beispiel für ganzheitliches Design: Fotografie, Bildlook, Gestaltung und Markenwirkung greifen ineinander.',
      alt: 'Flyerlayout mit Person und Markenmodulen',
    },
    en: {
      title: 'Made In Flyer',
      text: 'Flyer design for Your-Origin with own photography and holistic look.',
      detail:
        'Flyer design for the company Your-Origin. The photos were taken by me, developed from RAW, edited and then integrated into the layout. The flyer is a good example of holistic design: photography, image look, layout and brand impact work together.',
      alt: 'Flyer layout with person and brand modules',
    },
  },
  {
    file: '27',
    size: 'lg',
    icon: 'groups',
    tools: ['Photoshop', 'Lightroom'],
    year: '2022',
    de: {
      title: 'Made In Promo',
      text: 'Promomotiv mit eigener Fotografie für Website-Hero und Social Media.',
      detail:
        'Auch dieses Bild basiert auf eigener Fotografie. Das Motiv wurde für den Website-Hero und Social Media verwendet. Die Bearbeitung erfolgte über RAW-Entwicklung, Lightroom-Look und Photoshop-Composing, damit Foto, Kampagnenfarbe und Markenauftritt zusammen funktionieren.',
      alt: 'Promofoto vor hellblauer grafischer Wand',
    },
    en: {
      title: 'Made In Promo',
      text: 'Promotional motif with own photography for website hero and social media.',
      detail:
        'This image is also based on my own photography. The motif was used for the website hero and social media. The edit combined RAW development, Lightroom look and Photoshop compositing so the photo, campaign color and brand presence worked together.',
      alt: 'Promo photo in front of a light blue graphic wall',
    },
  },
  {
    file: '28',
    size: 'sm',
    icon: 'menu_book',
    tools: ['InDesign', 'Photoshop'],
    year: '2023',
    de: {
      title: 'Made In Produktkataloge',
      text: 'Editoriale Produktkatalog-Seiten mit ruhigem Raster und klarer Blickführung.',
      detail:
        'Layoutarbeit für Made-In-Produktkataloge. Der Fokus lag auf einem ruhigen Seitenrhythmus, sauberer Bild-/Text-Hierarchie und einer Präsentation, die Produktinformationen schnell erfassbar macht, ohne die visuelle Wirkung zu verlieren.',
      alt: 'Schmale Editorial-Doppelseite mit Produkt- und Kampagneninhalt',
    },
    en: {
      title: 'Made In Product Catalogues',
      text: 'Editorial product catalogue pages with calm grid and clear eye guidance.',
      detail:
        'Layout work for Made In product catalogues. The focus was a calm page rhythm, clean image/text hierarchy and a presentation that makes product information easy to read without losing visual impact.',
      alt: 'Narrow editorial spread with product and campaign content',
    },
  },
  {
    file: '29',
    size: 'md',
    icon: 'badge',
    tools: ['Photoshop', 'Illustrator'],
    year: '2022',
    de: {
      title: 'Business Cards',
      text: 'Visitenkarten-Mockup mit dunkler Marke, Relieflack und haptischem Fokus.',
      detail:
        'Die Visitenkarten wurden auf 400-g-Papier in einer Auflage von 5000 Stück gedruckt. Das Logo erhielt einen partiellen Relieflack, wodurch die Karte nicht nur visuell, sondern auch haptisch stärker wirkt.',
      alt: 'Dunkles Visitenkarten-Mockup mit Logo',
    },
    en: {
      title: 'Business Cards',
      text: 'Business card mockup with dark brand, relief varnish and tactile focus.',
      detail:
        'The business cards were printed on 400 gsm paper in an edition of 5000 pieces. The logo received a partial relief varnish, making the card stronger not only visually but also haptically.',
      alt: 'Dark business card mockup with logo',
    },
  },
];
