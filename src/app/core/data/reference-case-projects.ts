/**
 * @file Gespiegelte DCR-Case-Study-Daten.
 * @description Enthält ausschließlich Intranet und Design Archiv aus dem B²Folio-Stand als lokale DCR-Inhalte.
 */

import { PortfolioLanguage, PortfolioProject, ProjectCatalogPage, ProjectCatalogSpread, ProjectCatalogTocItem, ProjectGalleryItem } from '../models/reference-case.models';

/** Anzahl der einzeln ausgelieferten Katalogseiten inklusive Cover und Rückseite. */
const DESIGN_CATALOG_PAGE_COUNT = 54;

/** Struktur eines Kapitel-Eintrags aus dem Katalog-Inhaltsverzeichnis. */
interface DesignCatalogChapterSeed {
  /** Sichtbare Kapitelnummer. */
  readonly number: string;
  /** Kapitelname aus dem Katalog. */
  readonly title: string;
  /** Unterzeile aus dem Katalog. */
  readonly subtitle: string;
  /** Erste Seite des Kapitels im Reader. */
  readonly startPage: number;
  /** Kurzer Kontexttext aus dem Inhaltsverzeichnis. */
  readonly text: string;
  /** Zugeordnetes Werkzeug oder Thema. */
  readonly tool: string;
  /** Visuelle Seitenstimmung für Platzhalter und Animation. */
  readonly mood: ProjectCatalogPage['mood'];
}

/** Kapitelstruktur des Designkatalogs aus der gelieferten Inhaltsverzeichnis-Seite. */
const DESIGN_CATALOG_CHAPTERS: readonly DesignCatalogChapterSeed[] = [
  { number: '01', title: 'Personal Profile', subtitle: 'resume CV', startPage: 4, text: 'Who is the guy whose portfolio you are holding in your hands? And what is behind the name UNIQUE IDEA?', tool: 'Motivation - Analysis', mood: 'type' },
  { number: '02', title: 'Processing', subtitle: 'chaos or symmetry', startPage: 5, text: 'I like the idea of controlling chaos. A paradox. Is that even possible - I think so.', tool: 'Processing - Generative Arts', mood: 'image' },
  { number: '03', title: 'Illustrations', subtitle: 'vector arts', startPage: 11, text: 'There is nothing nicer than pin-sharp typography - it is essential for printing.', tool: 'Illustrator CC', mood: 'type' },
  { number: '04', title: 'Image Processing', subtitle: 'and photography', startPage: 19, text: 'Digital image editing is a miracle with great power. It makes us wonder and laugh.', tool: 'Photoshop CC', mood: 'detail' },
  { number: '05', title: 'Layout and Typo', subtitle: 'printing stuff', startPage: 43, text: 'The classical advertising media, indispensable for anyone who wants to present themselves.', tool: 'InDesign CC', mood: 'cover' },
];

/** Erstellt die Kapitelnavigation für den Katalog-Reader. */
function createDesignCatalogTocItems(): readonly ProjectCatalogTocItem[] {
  return DESIGN_CATALOG_CHAPTERS.map((chapter) => ({
    number: chapter.number,
    title: chapter.title,
    subtitle: chapter.subtitle,
    text: chapter.text,
    tool: chapter.tool,
    targetSpreadIndex: getDesignCatalogSpreadIndexForPage(chapter.startPage),
  }));
}

/** Erstellt alle Reader-Ansichten: Seite 1 rechts, Doppelseiten, Seite 54 links. */
function createDesignCatalogSpreads(): readonly ProjectCatalogSpread[] {
  const spreads: ProjectCatalogSpread[] = [
    {
      id: 'catalog-spread-01',
      title: 'Cover',
      text: 'Erste Katalogseite als rechter Einstieg im Reader.',
      pages: [createDesignCatalogPage(1, 'right')],
    },
  ];

  for (let pageNumber = 2; pageNumber < DESIGN_CATALOG_PAGE_COUNT; pageNumber += 2) {
    spreads.push({
      id: `catalog-spread-${formatDesignCatalogPageNumber(pageNumber)}-${formatDesignCatalogPageNumber(pageNumber + 1)}`,
      title: `Pages ${formatDesignCatalogPageNumber(pageNumber)}-${formatDesignCatalogPageNumber(pageNumber + 1)}`,
      text: getDesignCatalogChapterForPage(pageNumber).title,
      pages: [createDesignCatalogPage(pageNumber, 'left'), createDesignCatalogPage(pageNumber + 1, 'right')],
    });
  }

  spreads.push({
    id: `catalog-spread-${formatDesignCatalogPageNumber(DESIGN_CATALOG_PAGE_COUNT)}`,
    title: 'Back Cover',
    text: 'Letzte Katalogseite als linker Abschluss im Reader.',
    pages: [createDesignCatalogPage(DESIGN_CATALOG_PAGE_COUNT, 'left')],
  });

  return spreads;
}

/** Erstellt eine einzelne WebP-Katalogseite mit einheitlichem englischem Asset. */
function createDesignCatalogPage(pageNumber: number, side: ProjectCatalogPage['side']): ProjectCatalogPage {
  const chapter = getDesignCatalogChapterForPage(pageNumber);
  const number  = formatDesignCatalogPageNumber(pageNumber);

  return {
    number,
    side,
    eyebrow: chapter.number,
    title: chapter.title,
    text: chapter.subtitle,
    image: getDesignCatalogPagePath(pageNumber),
    imageByLanguage: {
      de: getDesignCatalogPagePath(pageNumber),
      en: getDesignCatalogPagePath(pageNumber),
    },
    assetType: 'image',
    alt: `Designkatalog Seite ${number}: ${chapter.title}`,
    imageHint: getDesignCatalogPagePath(pageNumber),
    mood: chapter.mood,
  };
}

/** Gibt die Kapitelmetadaten zur jeweiligen Katalogseite zurück. */
function getDesignCatalogChapterForPage(pageNumber: number): DesignCatalogChapterSeed {
  return [...DESIGN_CATALOG_CHAPTERS].reverse().find((chapter) => pageNumber >= chapter.startPage) ?? DESIGN_CATALOG_CHAPTERS[0];
}

/** Berechnet den Reader-Index zur echten Seitenzahl. */
function getDesignCatalogSpreadIndexForPage(pageNumber: number): number {
  if (pageNumber <= 1) {
    return 0;
  }

  if (pageNumber >= DESIGN_CATALOG_PAGE_COUNT) {
    return Math.ceil((DESIGN_CATALOG_PAGE_COUNT - 1) / 2);
  }

  return Math.ceil((pageNumber - 1) / 2);
}

/** Formatiert Katalogseiten stabil zweistellig. */
function formatDesignCatalogPageNumber(pageNumber: number): string {
  return pageNumber.toString().padStart(2, '0');
}

/** Baut den erwarteten Asset-Pfad für eine englische WebP-Katalogseite. */
function getDesignCatalogPagePath(pageNumber: number): string {
  return `assets/images/projects/design-catalog/en/catalog-page-${formatDesignCatalogPageNumber(pageNumber)}.webp`;
}


/** Sprachabhängige Textdaten für ein Masonry-Asset. */
interface DesignCatalogGalleryTextSeed {
  /** Sichtbarer Titel der Galeriearbeit. */
  readonly title: string;
  /** Kurzer Kartentext unter dem Masonry-Bild. */
  readonly text: string;
  /** Ausführlicher Lightbox-Text zur Gestaltungsidee. */
  readonly detail: string;
  /** Alternativtext für das Galeriebild. */
  readonly alt: string;
}

/** Rohdaten für eine echte Masonry-Arbeit aus dem Asset-Ordner. */
interface DesignCatalogGallerySeed {
  /** Zweistellige oder vorhandene Dateinummer im Masonry-Ordner. */
  readonly file: string;
  /** Visuelle Gewichtung im Masonry-Raster. */
  readonly size: ProjectGalleryItem['size'];
  /** Material-Symbol für Fallbacks und interne Semantik. */
  readonly icon: string;
  /** Aus dem Asset analysierte Container-Hintergrundfarbe. */
  readonly backgroundColor?: string;
  /** Genutzte oder naheliegende Werkzeuge. */
  readonly tools: readonly string[];
  /** Jahr oder grober Zeitraum der Arbeit. */
  readonly year: string;
  /** Deutsche Texte für die Galerie. */
  readonly de: DesignCatalogGalleryTextSeed;
  /** Englische Texte für die Galerie. */
  readonly en: DesignCatalogGalleryTextSeed;
}

/** Analysierte Hintergrundfarben der lokalen WebP-Galerieassets. */
const DESIGN_CATALOG_GALLERY_BACKGROUNDS: Record<string, string> = {
  '01': '#000000',
  '02': '#fff5e1',
  '03': '#d1d5d7',
  '04': '#78a175',
  '05': '#ffffff',
  '06': '#020300',
  '07': '#03060f',
  '08': '#292929',
  '09': '#653502',
  '10': '#d3d3d3',
  '11': '#c0daae',
  '12': '#fff7f3',
  '13': '#916032',
  '14': '#030303',
  '15': '#374c64',
  '16': '#182122',
  '17': '#f2f2f2',
  '18': '#ffffff',
  '19': '#010101',
  '20': '#ffffff',
  '21': '#1a171a',
  '22': '#030332',
  '23': '#ffffff',
  '24': '#ffffff',
  '25': '#e2e2e2',
  '26': '#ffffff',
  '27': '#c3dce3',
  '28': '#cbdce4',
  '29': '#777877',
  '31': '#000000',
  '32': '#65e2ff',
  '33': '#ffffff',
  '34': '#df7909',
  '35': '#000000',
  '36': '#ffffff',
  '37': '#6a6b70',
  '39': '#000000',
  '40': '#ffffff',
  '41': '#c2bdc3',
  '47': '#000000',
  '49': '#000000',
  '50': '#211717',
  '51': '#312828',
  '52': '#362924',
  '53': '#4f4f4d',
  '54': '#999999',
  '55': '#a0782b',
  '56': '#2e4007',
  '57': '#442e13',
  '58': '#262c3d',
};

/** Einzelne Arbeiten der Masonry-Galerie mit passendem Kurzkontext. */
const DESIGN_CATALOG_GALLERY_ITEMS: readonly DesignCatalogGallerySeed[] = [
  { file: '01', size: 'md', icon: 'face_retouching_natural', tools: ['Photoshop'], year: '2022', de: { title: 'Mein Wille ist dein Wille', text: 'Portrait-Composing mit Fokus auf klaren Cut-outs und präzise gesetzten Assets.', detail: 'Die Arbeit setzt auf harte Tonwerte, digitale Körnung und einen fast plakativen Portraitschnitt. Das Photoshop-Composing lebt von sauberen Cut-outs, bewusst gewählten Assets und einer strengen Lichtführung. Inhaltlich ging es darum, einen unsichtbaren Gedanken sichtbar zu machen: innere Einflussnahme, Fremdsteuerung und den Moment, in dem ein stiller Impuls plötzlich eine konkrete Form bekommt.', alt: 'Dunkles digitales Portrait im Posterlook' }, en: { title: 'Your will is my will', text: 'Portrait compositing focused on clean cut-outs and precisely placed assets.', detail: 'The piece relies on hard tonal values, digital grain and an almost poster-like portrait crop. The Photoshop compositing is driven by clean cut-outs, carefully chosen assets and strict light control. Conceptually, the goal was to make an invisible thought visible: inner influence, outside control and the moment a silent impulse suddenly takes on a concrete form.', alt: 'Dark digital portrait in a poster look' } },
  { file: '02', size: 'md', icon: 'face_retouching_natural', tools: ['Photoshop'], year: '2022', de: { title: 'Splittend thougts', text: 'Portrait-Composing und Flächenexperiment.', detail: 'Photoshop-Composing mit Fokus auf Lichtanpassung, sauber gesetzte Schatten, erzeugte Tiefe und ein klares Cut-out. Die Arbeit visualisiert eine innere Zwiespältigkeit – das Hin und Her von Gedanken, die gleichzeitig anziehen, trennen und den Blick auf das Wesentliche verschieben.', alt: 'Surreales Portrait mit grafischen Farbbändern' }, en: { title: 'Splittend thougts', text: 'Portrait compositing and surface experiment.', detail: 'Photoshop compositing focused on light adjustments, properly placed shadows, created depth and a clean cut-out. The piece visualizes inner conflict – the back and forth of thoughts that attract, separate and shift the view away from what matters.', alt: 'Surreal portrait with graphic color bands' } },
  { file: '03', size: 'md', icon: 'egg_alt', tools: ['Photoshop'], year: '2020', de: { title: 'Seems to be cold', text: 'Kühles Planeten-Composing mit weichen Schatten und abgestimmten Assets.', detail: 'Planeten-Composing in Photoshop: verschiedene Assets wurden über Schatten, Blending, Farbangleichung und zusätzliche Designelemente zu einer kühlen, aber nicht eisigen Gesamtwirkung verbunden.', alt: 'Kühles Planeten-Composing mit schwebenden Elementen' }, en: { title: 'Seems to be cold', text: 'Cool planet compositing with soft shadows and matched assets.', detail: 'Planet compositing in Photoshop: different assets were connected through shadows, blending, color matching and additional design elements to create a cool, but not icy, overall effect.', alt: 'Cool planet compositing with floating elements' } },
  { file: '04', size: 'md', icon: 'eco', tools: ['Photoshop'], year: '2020', de: { title: 'Weinende Welt', text: 'Weiteres Planeten-Composing als Bild einer ausgelaugten und ausgenutzten Welt.', detail: 'Ein weiteres Planeten-Composing als Gedanke einer ausgelaugten und ausgenutzten Welt. Die Arbeit verbindet viele verschiedene Einzelassets, die zusammengeführt, gemerged und weich miteinander verblendet wurden, um eine dichte, erschöpfte Gesamtwirkung zu erzeugen.', alt: 'Grünes Planeten-Composing mit schwebenden Partikeln' }, en: { title: 'Crying world', text: 'Another planet composition visualizing an exhausted and exploited world.', detail: 'Another planet composition built around the idea of an exhausted and exploited world. The piece combines many individual assets that were merged and softly blended together to create a dense, drained overall mood.', alt: 'Green planet composition with floating particles' } },
  { file: '05', size: 'lg', icon: 'auto_fix_high', tools: ['Photoshop'], year: '2020', de: { title: 'Vitiligo', text: 'Kreatives Portrait-Experiment angelehnt an die Hautkrankheit Vitiligo.', detail: 'Eine Arbeit angelehnt an die Hautkrankheit Vitiligo. Ich wollte ein kreatives Vitiligo-Bild nachstellen und gleichzeitig die besondere Schönheit dieser Hautzeichnung hervorheben. Entstanden ist das Motiv in Photoshop mit Assets und vielen Brushes als freies Experiment.', alt: 'Portrait-Experiment angelehnt an Vitiligo auf hellem Hintergrund' }, en: { title: 'Vitiligo', text: 'Creative portrait experiment inspired by the skin condition vitiligo.', detail: 'A piece inspired by the skin condition vitiligo. I wanted to recreate a creative vitiligo look while still emphasizing its beauty. The work was created in Photoshop with assets and many brushes as an open experiment.', alt: 'Portrait experiment inspired by vitiligo on a bright background' } },
  { file: '06', size: 'lg', icon: 'local_fire_department', tools: ['Photoshop'], year: '2021', de: { title: 'Hot Water', text: 'Aufwendiges Font-Composing mit Hitze, Texturen und realistischem Materiallook.', detail: 'Meine bisher aufwendigste Composing-Arbeit. Viele verschiedene Texturen wurden miteinander verblendet, gemaskt und über Ebenenmodi wie Multiplizieren, Aufhellen oder Ineinanderkopieren kombiniert, um einen möglichst realistischen Look zu erzeugen.', alt: 'Brennender Schriftzug mit Partikeln und Rauch' }, en: { title: 'Hot Water', text: 'Ambitious type compositing with heat, textures and a realistic material look.', detail: 'My most elaborate compositing work so far. Many different textures were blended, masked and combined using layer modes such as multiply, screen and overlay to achieve the most realistic look possible.', alt: 'Burning lettering with particles and smoke' } },
  { file: '07', size: 'lg', icon: 'diamond', tools: ['Photoshop'], year: '2022', de: { title: 'Crystal Noise', text: 'Glitch-artige Komposition aus Licht, Rauch und geometrischem Zentrum.', detail: 'Das Motiv bündelt viele Ebenen zu einem dunklen, leuchtenden Posterlook.', alt: 'Dunkle Glitch-Komposition mit geometrischem Kristall' }, en: { title: 'Crystal noise', text: 'Glitch-like composition of light, smoke and a geometric center.', detail: 'The motif combines many layers into a dark glowing poster look.', alt: 'Dark glitch composition with geometric crystal' } },
  { file: '08', size: 'md', icon: 'theater_comedy', tools: ['Photoshop'], year: '2019', de: { title: 'Brush Work 1', text: 'Erste tiefere Brush-Arbeit mit fragmentierten Formen und selbst gebauten Pinseln.', detail: 'Meine erste tiefere Erfahrung mit Brushes. Verschiedene Pinsel wurden gemerged und ineinander gebaut – selbst im Bereich der Augen und einzelner Fragmente. Zum Einsatz kamen kostenlose verfügbare Brushes ebenso wie eigens selbst gebaute Pinsel.', alt: 'Abstraktes Brush-Motiv mit roten und weißen Fragmenten' }, en: { title: 'Brush Work 1', text: 'First deeper brush study with fragmented forms and custom brushes.', detail: 'My first deeper experience working with brushes. Different brushes were merged and built into each other, even in the eyes and smaller fragments. The piece combines free available brushes with brushes I created myself.', alt: 'Abstract brush-based motif with red and white fragments' } },
  { file: '09', size: 'md', icon: 'apartment', tools: ['Lightroom'], year: '2019', de: { title: 'Brutalist Gold', text: 'Reine Fotoarbeit eines Kranturms am Rhein mit harter, goldener Lichtwirkung.', detail: 'Reine Fotoarbeit mit der Nikon D5000 und Bearbeitung ausschließlich in Lightroom. Das Bild zeigt einen Kranturm am Rhein und sollte bewusst Dekadenz und Brutalität widerspiegeln. Zum Look wurden zusätzlich fotografische Filterwirkungen genutzt.', alt: 'Warm getöntes Architekturfoto eines Kranturms am Rhein' }, en: { title: 'Brutalist Gold', text: 'Pure photo work of a crane tower on the Rhine with a harsh golden light mood.', detail: 'Pure photography with the Nikon D5000 and editing only in Lightroom. The image shows a crane tower on the Rhine and was meant to reflect decadence and brutality. Photographic filter effects were also used for the final look.', alt: 'Warm tinted architectural photo of a crane tower on the Rhine' } },
  { file: '10', size: 'lg', icon: 'apartment', tools: ['Lightroom'], year: '2019', de: { title: 'Facade Rhythm', text: 'Variation des Brutalismus mit Fokus auf Spiegelung, Wiederholung und Struktur.', detail: 'Eine fotografische Variation des Brutalismus. Der Fokus lag auf Spiegelung, Wiederholung und einer strengen Rasterwirkung über das gesamte Bild hinweg. Fotoarbeit mit Nikon D5000 und Lightroom.', alt: 'Schwarzweißfoto einer modernen Fassade mit Spiegelung' }, en: { title: 'Facade Rhythm', text: 'A brutalist variation focused on reflection, repetition and structure.', detail: 'A photographic variation on brutalism. The focus was on reflection, repetition and a strict grid-like rhythm throughout the image. Photo work with the Nikon D5000 and Lightroom.', alt: 'Black-and-white photo of a modern facade with reflection' } },
  { file: '11', size: 'md', icon: 'pets', tools: ['Lightroom'], year: '2021', de: { title: 'Anführer', text: 'Schnappschuss meiner treuen Hündin mit ruhiger, fast heroischer Ausstrahlung.', detail: 'Im Urlaub gelang mir dieser Schnappschuss meiner treuen Hündin. Die Fotoarbeit entstand mit der Nikon D5000 und einem Standardobjektiv; die Nachbearbeitung erfolgte in Lightroom.', alt: 'Hund im Wald mit natürlichem Licht' }, en: { title: 'Leader', text: 'Snapshot of my loyal dog with a calm, almost heroic presence.', detail: 'I captured this snapshot of my loyal dog while on vacation. The photo was taken with the Nikon D5000 and a standard lens, with post-processing done in Lightroom.', alt: 'Dog in a forest with natural light' } },
  { file: '12', size: 'md', icon: 'water', tools: ['Lightroom'], year: '2019', de: { title: 'Spiegel', text: 'Landschaftsaufnahme mit Spiegelung, Kontrastverdichtung und ruhiger Fernwirkung.', detail: 'Fotoarbeit mit der Nikon D5000 und einem Teleobjektiv im Bereich von etwa 70 bis 105 mm. Das Original war leicht nebelig und ungesättigt; in der Nachbearbeitung wurden vor allem Kontrast und Lichtintensität verstärkt. Zusätzlich kamen analoge Fotofilter zum Einsatz.', alt: 'Ruhiger See mit Baumspiegelung' }, en: { title: 'Mirror', text: 'Landscape photograph with reflection, deeper contrast and a calm distant mood.', detail: 'Photo work with the Nikon D5000 and a tele lens in the range of roughly 70 to 105 mm. The original shot was slightly foggy and desaturated; post-processing mainly focused on contrast and light intensity. Analog photo filters were also used.', alt: 'Quiet lake with tree reflection' } },
  { file: '13', size: 'md', icon: 'texture', tools: ['Lightroom'], year: '2021', de: { title: 'Bist du Moos?', text: 'Fotoarbeit fasziniert von Detailtiefe, Struktur und kräftigen Naturfarben.', detail: 'Fasziniert von der Detailtiefe und den Farben entstand diese Fotoarbeit. Die Nachbearbeitung blieb auf ein Minimum beschränkt und erfolgte nur in Lightroom – ohne Photoshop und ohne Makroobjektiv.', alt: 'Detailreiche Naturstruktur in Orange- und Grüntönen' }, en: { title: 'Are You Moss?', text: 'Photo work driven by fascination for detail depth, texture and vivid natural colors.', detail: 'This photo work grew out of a fascination with its detail depth and colors. Post-processing was kept minimal and done only in Lightroom — without Photoshop and without a macro lens.', alt: 'Detailed natural texture in orange and green tones' } },
  { file: '14', size: 'md', icon: 'local_fire_department', tools: ['Photoshop'], year: '2021', de: { title: 'Font Work', text: 'Weitere Font-Arbeit mit vielen Layern, Assets und cineastischem Aufbau.', detail: 'Weitere Font-Arbeit mit vielen Ebenen, Composing-Schritten und zahlreichen Einzelassets. In Aufbau und Arbeitsweise ist das Motiv eng mit Hot Water verwandt: viele Texturen, Blend-Modi, Masking und Lichtabstimmungen greifen ineinander.', alt: 'Dunkle Font-Arbeit mit Feuer und Rauch' }, en: { title: 'Font Work', text: 'Another type-based composition with many layers, assets and a cinematic build-up.', detail: 'Another type-based piece with many layers, compositing steps and numerous individual assets. In structure and workflow, the motif is closely related to Hot Water: textures, blend modes, masking and light adjustments all work together.', alt: 'Dark type composition with fire and smoke' } },
  { file: '15', size: 'md', icon: 'description', tools: ['Photoshop', 'Processing'], year: '2022', de: { title: 'Info Sheet Mockup', text: 'Fiktives Infosheet mit Perlin-Hairs-Assets zwischen Print- und generativer Gestaltung.', detail: 'Einsatz der Perlin-Hairs-Assets für ein ausgedachtes Projekt. Das fiktive Infosheet zeigt die Integration klassischer Medien wie Print und Digital Design mit neueren Medien wie Processing und generativer Gestaltung.', alt: 'Schwebendes Infosheet-Mockup auf blauem Hintergrund' }, en: { title: 'Info Sheet Mockup', text: 'Fictional info sheet using Perlin Hairs assets between print and generative design.', detail: 'Use of the Perlin Hairs assets for an invented project. The fictional info sheet demonstrates how classic media such as print and digital design can be integrated with newer media such as Processing and generative design.', alt: 'Floating info sheet mockup on a blue background' } },
  { file: '16', size: 'md', icon: 'local_activity', tools: ['Photoshop', 'Illustrator'], year: '2014', de: { title: 'Partyflyer 2014', text: 'Leuchtendes Eventlayout mit Neonfarben, klarer Blickführung und starkem Zentrum.', detail: 'Reines Photoshop-Layout und einer meiner ersten grafischen Versuche. Damals arbeitete ich ausschließlich mit Photoshop; Illustrator und InDesign habe ich erst später gelernt. Den Flyer habe ich für einen sehr guten Freund und DJ entworfen. Gedruckt wurde er in einer Auflage von 500 Stück.', alt: 'Buntes Eventposter auf dunklem Hintergrund' }, en: { title: 'Party flyer 2014', text: 'Bright event layout with neon colors, clear eye guidance and a strong center.', detail: 'A pure Photoshop layout and one of my first graphic design attempts. At the time I worked exclusively in Photoshop; I only learned Illustrator and InDesign later. I designed the flyer for a very good friend and DJ. It was printed in an edition of 500 copies.', alt: 'Colorful event poster on dark background' } },
  { file: '17', size: 'lg', icon: 'view_carousel', tools: ['Photoshop', 'Illustrator'], year: '2021', de: { title: 'App Design', text: 'Ein erster Versuch eines einfachen App-Designs.', detail: 'Mockup einer App-Idee, die Papierstücke digitalisieren und verwaltbar machen sollte. Rundschreiben, Infos und sonstige Inhalte sollten so schneller an die Mitarbeitenden gelangen; über Lesebestätigungen sollte zusätzlich Verbindlichkeit und Kontrolle entstehen. Das Mockup zeigt vier beispielhafte Screens.', alt: 'Aufgefächertes App-Mockup mit mehreren Screens' }, en: { title: 'App design', text: 'A first attempt at a simple app design.', detail: 'Mockup of an app idea intended to digitize and manage paper-based notes. Circulars, information and other content were meant to reach employees faster, while read confirmations were supposed to add commitment and control. The mockup shows four example screens.', alt: 'Fanned app mockup with multiple screens' } },
  { file: '18', size: 'md', icon: 'text_fields', tools: ['Illustrator'], year: '2023', de: { title: 'UX (3D)', text: 'Typografisches 3D-Experiment, komplett als 2D-Vektorarbeit aufgebaut.', detail: 'Der Schriftzug entstand ohne 3D-Tools: reine 2D-Flächen wurden verschoben, skaliert und über akkurate Bildwiederholungen so gesetzt, dass Tiefe, Kanten und ein räumlicher UX-Schriftzug entstehen.', alt: 'UX-Schriftzug mit dreidimensionalem Linienraster' }, en: { title: 'UX (3D)', text: 'Typographic 3D experiment built entirely as 2D vector work.', detail: 'The lettering was created without 3D tools: pure 2D shapes were moved, scaled and repeated with precision until depth, edges and a spatial UX wordmark emerged.', alt: 'UX lettering with three-dimensional line grid' } },
  { file: '19', size: 'sm', icon: 'waves', tools: ['Processing'], year: '2018', de: { title: 'Perlin Hairs', text: 'Generative Haarstruktur aus Perlin-Noise-gesteuerter Linienbewegung.', detail: 'Generative Gestaltung in Processing: Punkte beziehungsweise Linien werden durch ein Perlin-Noise-Feld geführt, wodurch organische Richtungswechsel entstehen. Über Dichte, Schrittweite und Kurvenverhalten formt sich eine haarartige Struktur, die kontrolliert wirkt, aber nie komplett statisch ist.', alt: 'Schwarze generative Haarlinien auf dunklem Grund' }, en: { title: 'Perlin Hairs', text: 'Generative hair structure driven by Perlin-noise line movement.', detail: 'Generative design in Processing: points or lines are guided through a Perlin noise field, creating organic changes in direction. Density, step size and curve behavior form a hair-like structure that feels controlled without becoming completely static.', alt: 'Black generative hair lines on dark background' } },
  { file: '20', size: 'sm', icon: 'all_inclusive', tools: ['Processing'], year: '2017', de: { title: 'Perlins Moth', text: 'Generatives Mottenmotiv aus kontrollierten Processing-Parametern.', detail: 'Processing wurde so gesteuert, dass aus abstrakten Linien ein mottenähnliches Motiv entstand. Der Fokus lag auf dem Anpassen der Parameter, bis aus rein generativer Bewegung ein erkennbares Bild wurde.', alt: 'Generative Linienform wie eine Motte' }, en: { title: 'Perlins Moth', text: 'Generative moth motif built from controlled Processing parameters.', detail: 'Processing was controlled in a way that turned abstract lines into a moth-like motif. The focus was on adjusting parameters until purely generative movement became a recognizable image.', alt: 'Generative line form resembling a moth' } },
  { file: '21', size: 'lg', icon: 'texture', tools: ['Processing', 'Photoshop'], year: '2017', de: { title: 'Purple Flow Field', text: 'Anaglyphes Designexperiment mit generativer Tiefe und Rahmenwirkung.', detail: 'Ein anaglyphes Designexperiment: Die 3D-Wirkung wird durch die räumliche Tiefe der Linien verstärkt und durch den weißen Kasten um eine zusätzliche Ebene erweitert. Einige Linien verdecken den Rahmen bewusst und brechen dadurch die klare Bildfläche auf.', alt: 'Violettes generatives Flow-Field mit Rahmen' }, en: { title: 'Purple Flow Field', text: 'Anaglyph design experiment with generative depth and frame effect.', detail: 'An anaglyph design experiment: the 3D effect is intensified by the spatial depth of the lines and extended by the white box as an additional layer. Some lines deliberately cover the frame and break up the clean image surface.', alt: 'Violet generative flow field with frame' } },
  { file: '22', size: 'md', icon: 'waves', tools: ['Processing', 'Photoshop'], year: '2017', de: { title: 'Dancing Spirits', text: 'Generatives Linienbild, in dem später geisterartige Figuren sichtbar wurden.', detail: 'Zu Beginn wurden verschiedene Versionen erzeugt, bis diese Komposition ausgewählt wurde. Erst später fielen mir in der Linienstruktur mehrere Kreaturen auf, die wie Geister wirken. Farbe und Kontrast wurden anschließend darüber gelegt, um diese Figuren stärker herauszuarbeiten.', alt: 'Orange-blaue generative Linienstruktur mit geisterhaften Formen' }, en: { title: 'Dancing Spirits', text: 'Generative line image in which ghost-like figures became visible later.', detail: 'At first, several versions were generated until this composition was selected. Only later did I notice creatures inside the line structure that looked like spirits. Color and contrast were then added to make those figures stand out more clearly.', alt: 'Orange-blue generative line structure with ghost-like forms' } },
  { file: '23', size: 'sm', icon: 'all_inclusive', tools: ['Processing'], year: '2017', de: { title: 'Small Moth', text: 'Reduzierte Processing-Variation mit mottenähnlicher Silhouette.', detail: 'Eine Variation des Programms erzeugte dieses reduzierte Motiv. Auch hier wurde Processing so gesteuert, dass aus abstrakten Linien eine mottenähnliche Form entstand. Der Fokus lag auf Parametern, Dichte und Symmetrie, bis ein erkennbares Bild sichtbar wurde.', alt: 'Symmetrische schwarze Linienform wie eine kleine Motte' }, en: { title: 'Small Moth', text: 'Reduced Processing variation with a moth-like silhouette.', detail: 'A variation of the program created this reduced motif. Here too, Processing was controlled until abstract lines formed a moth-like shape. The focus was on parameters, density and symmetry until a recognizable image appeared.', alt: 'Symmetrical black line form resembling a small moth' } },
  { file: '24', size: 'sm', icon: 'all_inclusive', tools: ['Processing'], year: '2017', de: { title: 'Bakteria', text: 'Organische Processing-Variation zwischen Kreis, Zelle und Bewegung.', detail: 'Eine weitere Variation des Programms erzeugte dieses bakterienartige Motiv. Aus wiederholten Linien, kleinen Richtungswechseln und kontrollierter Überlagerung entstand eine Form, die zwischen Mikroorganismus, Kreisbewegung und generativer Konstruktion liegt.', alt: 'Schwarze generative Kreislinien als bakterienartige Form' }, en: { title: 'Bacteria', text: 'Organic Processing variation between circle, cell and movement.', detail: 'Another variation of the program created this bacteria-like motif. Repeated lines, small changes in direction and controlled overlap formed a shape between microorganism, circular movement and generative construction.', alt: 'Black generative circular lines as bacteria-like form' } },
  { file: '25', size: 'md', icon: 'grain', tools: ['Processing'], year: '2017', de: { title: 'Perlin Not Merlin', text: 'Der erste Versuch generativer Gestaltung mit dichtem Perlin-Noise-Geflecht.', detail: 'Das war mein erster Versuch im Bereich generative Gestaltung. Das Motiv wurde später immer wieder genutzt, um Flyer, Kataloge und Visitenkarten mit einer organischen, technischen Struktur zu verzieren.', alt: 'Dichte schwarzweiße generative Perlin-Struktur' }, en: { title: 'Perlin Not Merlin', text: 'The first attempt at generative design with a dense Perlin-noise mesh.', detail: 'This was my first attempt at generative design. I later reused the motif to decorate flyers, catalogues and business cards with an organic, technical structure.', alt: 'Dense black-and-white generative Perlin structure' } },
  { file: '26', size: 'md', icon: 'campaign', tools: ['Photoshop', 'Lightroom'], year: '2022', de: { title: 'Made In Flyer', text: 'Flyerdesign für Your-Origin mit eigener Fotografie und ganzheitlichem Look.', detail: 'Flyerdesign für die Firma Your-Origin. Die Fotos wurden von mir selbst erstellt, in RAW entwickelt, nachbearbeitet und anschließend in das Layout eingebunden. Der Flyer ist ein gutes Beispiel für ganzheitliches Design: Fotografie, Bildlook, Gestaltung und Markenwirkung greifen ineinander.', alt: 'Flyerlayout mit Person und Markenmodulen' }, en: { title: 'Made In Flyer', text: 'Flyer design for Your-Origin with own photography and holistic look.', detail: 'Flyer design for the company Your-Origin. The photos were taken by me, developed from RAW, edited and then integrated into the layout. The flyer is a good example of holistic design: photography, image look, layout and brand impact work together.', alt: 'Flyer layout with person and brand modules' } },
  { file: '27', size: 'lg', icon: 'groups', tools: ['Photoshop', 'Lightroom'], year: '2022', de: { title: 'Made In Promo', text: 'Promomotiv mit eigener Fotografie für Website-Hero und Social Media.', detail: 'Auch dieses Bild basiert auf eigener Fotografie. Das Motiv wurde für den Website-Hero und Social Media verwendet. Die Bearbeitung erfolgte über RAW-Entwicklung, Lightroom-Look und Photoshop-Composing, damit Foto, Kampagnenfarbe und Markenauftritt zusammen funktionieren.', alt: 'Promofoto vor hellblauer grafischer Wand' }, en: { title: 'Made In Promo', text: 'Promotional motif with own photography for website hero and social media.', detail: 'This image is also based on my own photography. The motif was used for the website hero and social media. The edit combined RAW development, Lightroom look and Photoshop compositing so the photo, campaign color and brand presence worked together.', alt: 'Promo photo in front of a light blue graphic wall' } },
  { file: '28', size: 'sm', icon: 'menu_book', tools: ['InDesign', 'Photoshop'], year: '2023', de: { title: 'Made In Produktkataloge', text: 'Editoriale Produktkatalog-Seiten mit ruhigem Raster und klarer Blickführung.', detail: 'Layoutarbeit für Made-In-Produktkataloge. Der Fokus lag auf einem ruhigen Seitenrhythmus, sauberer Bild-/Text-Hierarchie und einer Präsentation, die Produktinformationen schnell erfassbar macht, ohne die visuelle Wirkung zu verlieren.', alt: 'Schmale Editorial-Doppelseite mit Produkt- und Kampagneninhalt' }, en: { title: 'Made In Product Catalogues', text: 'Editorial product catalogue pages with calm grid and clear eye guidance.', detail: 'Layout work for Made In product catalogues. The focus was a calm page rhythm, clean image/text hierarchy and a presentation that makes product information easy to read without losing visual impact.', alt: 'Narrow editorial spread with product and campaign content' } },
  { file: '29', size: 'md', icon: 'badge', tools: ['Photoshop', 'Illustrator'], year: '2022', de: { title: 'Business Cards', text: 'Visitenkarten-Mockup mit dunkler Marke, Relieflack und haptischem Fokus.', detail: 'Die Visitenkarten wurden auf 400-g-Papier in einer Auflage von 5000 Stück gedruckt. Das Logo erhielt einen partiellen Relieflack, wodurch die Karte nicht nur visuell, sondern auch haptisch stärker wirkt.', alt: 'Dunkles Visitenkarten-Mockup mit Logo' }, en: { title: 'Business Cards', text: 'Business card mockup with dark brand, relief varnish and tactile focus.', detail: 'The business cards were printed on 400 gsm paper in an edition of 5000 pieces. The logo received a partial relief varnish, making the card stronger not only visually but also haptically.', alt: 'Dark business card mockup with logo' } },
  { file: '31', size: 'sm', icon: 'flare', tools: ['Illustrator'], year: '2023', de: { title: 'Fox Mark', text: 'Reduziertes Signet mit Fuchsform, Flamme und warmer Farbwelt.', detail: 'Ein Logoexperiment, das Tierform und abstraktes Zeichen zusammenführt.', alt: 'Abstraktes Fuchs- oder Flammenlogo' }, en: { title: 'Fox mark', text: 'Reduced signet with fox form, flame and warm color palette.', detail: 'A logo experiment that brings animal shape and abstract mark together.', alt: 'Abstract fox or flame logo' } },
  { file: '32', size: 'sm', icon: 'sports_esports', tools: ['Illustrator'], year: '2022', de: { title: 'Mega Man Hommage', text: 'Pixel- und Sprite-Studie als Hommage an klassische Mega-Man-Ästhetik.', detail: 'Eine Hommage an Mega Man und den klaren Look klassischer 8- und 16-Bit-Spiele. Im Fokus standen reduzierte Formen, klare Silhouetten, erkennbare Posen und die Frage, wie viel Charakter mit möglichst wenigen Pixeln transportiert werden kann.', alt: 'Pixel-Art-Figuren auf blauem Hintergrund' }, en: { title: 'Mega Man Homage', text: 'Pixel and sprite study as a homage to classic Mega Man aesthetics.', detail: 'A homage to Mega Man and the clear look of classic 8- and 16-bit games. The focus was reduced shapes, clear silhouettes, recognizable poses and the question of how much character can be carried by as few pixels as possible.', alt: 'Pixel art figures on blue background' } },
  { file: '33', size: 'md', icon: 'person', tools: ['Illustrator'], year: '2022', de: { title: 'Avatar Set', text: 'Vektorarbeit mit Comicfigur und verschiedenen Emotionen.', detail: 'Weitere Vektorarbeit und der Versuch, eine einfache Comicfigur zu entwickeln, die über wenige Formen verschiedene Emotionen zeigen kann. Wichtig waren Mimik, Wiedererkennbarkeit und eine saubere, gut wiederholbare Formensprache.', alt: 'Vektorfigur mit mehreren Gesichtsausdrücken' }, en: { title: 'Avatar Set', text: 'Vector work with comic character and different emotions.', detail: 'Another vector piece and an attempt to develop a simple comic character that can show different emotions through only a few shapes. The focus was expression, recognizability and a clean, repeatable visual language.', alt: 'Vector figure with multiple facial expressions' } },
  { file: '34', size: 'md', icon: 'accessibility_new', tools: ['Photoshop', 'Illustrator'], year: '2021', de: { title: 'Fresher then Fresh', text: 'Homage an die 90er und meine absolute Lieblingsserie.', detail: 'Eine Vektorisierung in Illustrator – komplett ohne Bildnachzeichner. Die Umsetzung erfolgte in mühevoller Handarbeit, Form für Form. Als Kind der 90er hat mich diese Serie stark geprägt; die Arbeit ist deshalb zugleich Stilübung, Fan-Hommage und persönliche Reminiszenz.', alt: 'Vektorisierter Charakter auf orangefarbenem Hintergrund' }, en: { title: 'Fresher then Fresh', text: 'A homage to the 90s and my all-time favorite series.', detail: 'A vectorization created in Illustrator completely without image trace. The piece was built through painstaking manual work, shape by shape. As a child of the 90s, this series had a major influence on me, so the work is both a style exercise, a fan homage and a personal throwback.', alt: 'Vectorized character on an orange background' } },
  { file: '35', size: 'sm', icon: 'donut_large', tools: ['Illustrator'], year: '2018', de: { title: 'Chaos or Symmetrie', text: 'Ein erster Versuch der generativen Gestaltung in Illustrator.', detail: 'Die Vektorform zeigt einen Kreis aus mehreren sich überschneidenden Schwingungen. Auf den ersten Blick wirkt alles chaotisch, auf den zweiten offenbart sich eine nahezu perfekte Symmetrie. Gerade dieser Wechsel zwischen Irritation und Ordnung macht den Reiz der Arbeit aus.', alt: 'Bunter generativer Linienkreis auf schwarzem Grund' }, en: { title: 'Chaos or symmetry', text: 'A first attempt at generative design in Illustrator.', detail: 'The vector form shows a circle built from multiple overlapping oscillations. At first glance it feels chaotic, but on a second look it reveals an almost perfect symmetry. That shift between irritation and order is exactly what gives the piece its appeal.', alt: 'Colorful generative line circle on black background' } },
  { file: '36', size: 'sm', icon: 'cyclone', tools: ['Processing'], year: '2018', de: { title: 'Chaos or Symmetrie 2', text: 'Variation von Chaos or Symmetrie mit stärkerer Rotation und offenem Zentrum.', detail: 'Eine zweite Variation von Chaos or Symmetrie. Die Form bleibt generativ, wirkt aber durch Rotation, Linienabstand und Zentrum deutlich dynamischer. Auch hier entsteht der Reiz aus dem Wechsel zwischen scheinbarem Chaos und kontrollierter Ordnung.', alt: 'Blaue generative Spirale auf hellem Hintergrund' }, en: { title: 'Chaos or Symmetry 2', text: 'Variation of Chaos or Symmetry with stronger rotation and an open center.', detail: 'A second variation of Chaos or Symmetry. The form remains generative, but feels more dynamic through rotation, line spacing and center structure. Again, the appeal comes from the shift between apparent chaos and controlled order.', alt: 'Blue generative spiral on bright background' } },
  { file: '37', size: 'lg', icon: 'checkroom', tools: ['Photoshop', 'Illustrator'], year: '2022', de: { title: 'Made In Produktvorschau', text: 'Produktvorschau neuer Made-In-Linien mit knalligen Farben und Logo-Varianten.', detail: 'Produktvorschau für neue Made-In-Produktlinien. Die Präsentation arbeitet mit kräftigen Farben, serieller Anordnung und verändertem Logo, um Varianten schnell vergleichbar und visuell auffällig zu machen.', alt: 'T-Shirt-Mockups in mehreren Reihen' }, en: { title: 'Made In Product Preview', text: 'Product preview for new Made In lines with bold colors and logo variants.', detail: 'Product preview for new Made In product lines. The presentation uses bold colors, serial arrangement and an altered logo to make variants easy to compare and visually striking.', alt: 'T-shirt mockups in several rows' } },
  { file: '39', size: 'sm', icon: 'flutter_dash', tools: ['Illustrator'], year: '2023', de: { title: 'Hummingbird Mark', text: 'Abstraktes Vogelzeichen mit weichen Farbflächen und dunklem Raum.', detail: 'Ein Signet-Experiment mit Überlagerungen, Kurven und reduzierter Formensprache.', alt: 'Abstraktes Kolibri-Logo auf dunklem Hintergrund' }, en: { title: 'Hummingbird mark', text: 'Abstract bird mark with soft color surfaces and dark space.', detail: 'A signet experiment with overlaps, curves and reduced form language.', alt: 'Abstract hummingbird logo on dark background' } },
  { file: '40', size: 'md', icon: 'article', tools: ['InDesign', 'Photoshop'], year: '2025', de: { title: 'Info Poster', text: 'Hochformatiges Layout mit Kampagnenbildern, Prozentwerten und Modulen.', detail: 'Die Gestaltung verbindet Informationsdichte mit einem klaren visuellen Raster.', alt: 'Hochformatiges Poster mit Kampagnenbildern und Prozentwerten' }, en: { title: 'Info poster', text: 'Portrait layout with campaign images, percentages and modules.', detail: 'The design combines information density with a clear visual grid.', alt: 'Portrait poster with campaign images and percentages' } },
  { file: '41', size: 'sm', icon: 'emoji_emotions', tools: ['Illustrator', 'Photoshop'], year: '2023', de: { title: 'Monster Buttons', text: 'Mockup-Design für Buttons mit kleinen Monster- und Alienmotiven.', detail: 'Mockup-Design für Buttons. Als Motivwelt habe ich kleine Monster und Aliens gewählt, weil sie schnell lesbar sind, starke Farben vertragen und auf kleiner Fläche sofort Charakter zeigen.', alt: 'Drei farbige Monster-Icons mit Gesichtern' }, en: { title: 'Monster Buttons', text: 'Mockup design for buttons with small monster and alien motifs.', detail: 'Mockup design for buttons. I chose small monsters and aliens as the motif world because they read quickly, handle strong colors well and show character instantly on a small surface.', alt: 'Three colorful monster icons with faces' } },
  { file: '47', size: 'lg', icon: 'change_history', tools: ['Photoshop'], year: '2019', de: { title: 'Triangle Glitch', text: 'Posterexperiment, das Typografie, Stadtkarte und Glitch-Look verbindet.', detail: 'Ein Posterexperiment, das Typografie und Stadtkarten miteinander verbindet. Über dunkle Flächen, Farbrauschen, Lichtkanten und zentrale Geometrie entsteht ein urbaner Glitch-Look mit technischem Charakter.', alt: 'Dunkles Glitch-Poster mit Dreieck und Farblicht' }, en: { title: 'Triangle Glitch', text: 'Poster experiment combining typography, city map and glitch look.', detail: 'A poster experiment combining typography and city maps. Dark surfaces, color noise, light edges and central geometry create an urban glitch look with a technical character.', alt: 'Dark glitch poster with triangle and colored light' } },
  { file: '49', size: 'lg', icon: 'photo_camera', tools: ['Lightroom'], year: '2019', de: { title: 'Rhein Experience', text: 'Klassische Schwarzweiß-Fotografie mit Nikon D5000, RAW und Lightroom.', detail: 'Klassische Fotografie mit meiner Nikon D5000. Die Nachbearbeitung erfolgte über RAW-Entwicklung und Lightroom. Das Bild gehört zu meinen ersten bewussten Versuchen mit Kontrast, Schwarzweißwirkung und ruhiger Bildkomposition.', alt: 'Schwarzweißfoto einer Person am Rhein mit Brücke' }, en: { title: 'Rhine Experience', text: 'Classic black-and-white photography with Nikon D5000, RAW and Lightroom.', detail: 'Classic photography with my Nikon D5000. The edit was done through RAW development and Lightroom. The image belongs to my first deliberate attempts with contrast, black-and-white impact and calm image composition.', alt: 'Black-and-white photo of a person by the Rhine with bridge' } },
  { file: '50', size: 'sm', icon: 'landscape', tools: ['Photoshop'], year: '2018', de: { title: 'Invasion', text: 'Composing einer möglichen Alieninvasion mit Pinseln, Texturen und Assets.', detail: 'Composing einer möglichen Alieninvasion. Die Arbeit kombiniert viele verschiedene Pinsel, Texturen, Einzelassets, Lichtquellen und atmosphärische Ebenen, um eine cineastische Bedrohungsszene aufzubauen.', alt: 'Dunkle Fantasielandschaft mit Alieninvasion' }, en: { title: 'Invasion', text: 'Compositing of a possible alien invasion with brushes, textures and assets.', detail: 'Compositing of a possible alien invasion. The piece combines many different brushes, textures, individual assets, light sources and atmospheric layers to build a cinematic threat scene.', alt: 'Dark fantasy landscape with alien invasion' } },
  { file: '51', size: 'sm', icon: 'accessibility_new', tools: ['Photoshop'], year: '2018', de: { title: 'Alien Design', text: 'Erster Alien-Character-Entwurf, komplett in Photoshop aufgebaut.', detail: 'Erster Entwurf eines Alien-Characters. Ziel war es, den Umgang mit Pinseln, Ebenen, Licht und Materialflächen zu lernen. Die Arbeit entstand rein in Photoshop und ohne 3D-Tools.', alt: 'Alien-Charakter mit dunkler Rüstung und roten Details' }, en: { title: 'Alien Design', text: 'First alien character draft, built entirely in Photoshop.', detail: 'First draft of an alien character. The goal was to learn how to work with brushes, layers, light and material surfaces. The piece was created entirely in Photoshop and without 3D tools.', alt: 'Alien character with dark armor and red details' } },
  { file: '52', size: 'md', icon: 'brush', tools: ['Photoshop'], year: '2017', de: { title: 'Interior Concept', text: 'Level-Sketch für ein Videospielprojekt mit Licht und Raumstimmung.', detail: 'Sketch eines Levels für ein Videospielprojekt. Im Fokus standen Raumgefühl, Lichtquelle, grobe Perspektive und die Frage, wie schnell eine spielbare Atmosphäre als Konzeptbild lesbar wird.', alt: 'Malerische Innenraumszene mit Lichtquelle' }, en: { title: 'Interior Concept', text: 'Level sketch for a video game project with light and room mood.', detail: 'Sketch of a level for a video game project. The focus was spatial feeling, light source, rough perspective and how quickly a playable atmosphere becomes readable as a concept image.', alt: 'Painterly interior scene with light source' } },
  { file: '53', size: 'sm', icon: 'view_in_ar', tools: ['Photoshop'], year: '2017', de: { title: 'Main Character', text: 'Character-Entwurf mit Fokus auf Perspektive und Proportionen.', detail: 'Weiterer Versuch eines Character-Entwurfs in Photoshop. Neben der Figur selbst ging es vor allem um Perspektive, Proportionen und darum, mehrere Ansichten als zusammenhängendes Design lesbar zu machen.', alt: 'Character Sheet mit mehreren Ansichten einer Figur' }, en: { title: 'Main Character', text: 'Character design focused on perspective and proportions.', detail: 'Another attempt at a character design in Photoshop. Beyond the figure itself, the focus was perspective, proportions and making multiple views read as one coherent design.', alt: 'Character sheet with several views of a figure' } },
  { file: '54', size: 'sm', icon: 'bug_report', tools: ['Photoshop'], year: '2017', de: { title: 'Bug Concept', text: 'Kreaturendesign in Photoshop, ohne Assets und nur mit Pinseln aufgebaut.', detail: 'Kreaturendesign in Photoshop. Die Arbeit entstand ohne externe Assets, nur über Pinsel, Ebenen, Farbe und Formaufbau. Ziel war es, ein glaubwürdiges Insektenwesen aus reiner Mal- und Skizzenarbeit zu entwickeln.', alt: 'Insekten-Concept-Art mit Skizzen und Farbfassung' }, en: { title: 'Bug Concept', text: 'Creature design in Photoshop, built without assets and only with brushes.', detail: 'Creature design in Photoshop. The piece was created without external assets, only through brushes, layers, color and shape building. The goal was to develop a believable insect creature from pure painting and sketch work.', alt: 'Insect concept art with sketches and color version' } },
  { file: '55', size: 'lg', icon: 'desktop_windows', tools: ['Photoshop', 'HTML', 'CSS', 'JavaScript'], year: '2023', de: { title: 'Park Pilot Concept', text: 'Landingpage-Entwurf für einen Valet-Service in Köln mit Premium-Wirkung.', detail: 'Entwurf einer Landingpage für einen Valet-Service in Köln. Gewünscht war ein einfaches, klares Design mit Premium-Wirkung, das Vertrauen und Professionalität erzeugt. Das Vordesign entstand rein in Photoshop; die spätere Umsetzung erfolgte klassisch mit HTML, CSS und JavaScript.', alt: 'Mehrere Landingpage-Mockups auf goldenem Hintergrund' }, en: { title: 'Park Pilot Concept', text: 'Landing page concept for a valet service in Cologne with premium impact.', detail: 'Concept for a landing page for a valet service in Cologne. The goal was a simple, clear design with a premium feel that creates trust and professionalism. The pre-design was created entirely in Photoshop; the later implementation was built with classic HTML, CSS and JavaScript.', alt: 'Several landing page mockups on a golden background' } },
  { file: '56', size: 'lg', icon: 'local_florist', tools: ['Lightroom'], year: '2021', de: { title: 'Always Hustleing', text: 'Reine Fotoarbeit mit Nikon D5000, Standard-Zoomobjektiv und viel Geduld.', detail: 'Reine Fotoarbeit mit einer Nikon D5000 und einem normalen Standard-Zoomobjektiv, ohne Makroobjektiv. Das Motiv entstand durch Geduld, ruhige Hand, Abstand und gutes Licht. Die Nachbearbeitung beschränkte sich auf Lightroom.', alt: 'Makrofoto einer pinken Blüte mit Biene' }, en: { title: 'Always Hustleing', text: 'Pure photography with Nikon D5000, standard zoom lens and patience.', detail: 'Pure photography with a Nikon D5000 and a regular standard zoom lens, without a macro lens. The motif was created through patience, a steady hand, distance and good light. The post-processing was limited to Lightroom.', alt: 'Macro-like photo of a pink flower with a bee' } },
  { file: '57', size: 'lg', icon: 'texture', tools: ['Lightroom'], year: '2021', de: { title: 'Schimmerndes Gras', text: 'Reine Fotoarbeit mit Licht, Glanz und leichter Bewegung.', detail: 'Reine Fotoarbeit mit einer Nikon D5000 und einem normalen Standard-Zoomobjektiv. Das Foto entstand an einem sehr sonnigen Nachmittag. Farbe, Glanz und die leichte Bewegung der Halme haben mich fasziniert; die Bearbeitung blieb bewusst reduziert und erfolgte in Lightroom.', alt: 'Schimmernde Grasstruktur in warmem Licht' }, en: { title: 'Shimmering Grass', text: 'Pure photography with light, shine and subtle movement.', detail: 'Pure photography with a Nikon D5000 and a regular standard zoom lens. The photo was taken on a very sunny afternoon. The color, shine and light movement of the grass fascinated me; the edit was deliberately reduced and done in Lightroom.', alt: 'Shimmering grass texture in warm light' } },
  { file: '58', size: 'lg', icon: 'menu_book', tools: ['Photoshop'], year: '2020', de: { title: 'Bug Talk Booklet', text: 'Mock-Design eines erfundenen IT-Magazins, komplett in Photoshop gebaut.', detail: 'Mock-Design eines erfundenen IT-Magazins. Die Arbeit entstand komplett in Photoshop – sowohl die einzelnen Assets als auch das Mockup selbst. Ziel war ein kleines Editorial, das technisch, illustrativ und trotzdem glaubwürdig als Magazin wirken kann.', alt: 'Print-Mockup eines Bug-Talk-Booklets' }, en: { title: 'Bug Talk Booklet', text: 'Mock design of a fictional IT magazine, built entirely in Photoshop.', detail: 'Mock design of a fictional IT magazine. The work was created entirely in Photoshop – both the individual assets and the mockup itself. The goal was a small editorial piece that could feel technical, illustrative and still believable as a magazine.', alt: 'Print mockup of a Bug Talk booklet' } },
];

/** Baut die sichtbaren Masonry-Galerieeinträge für die aktuelle Sprache. */
function createDesignCatalogGalleryItems(language: PortfolioLanguage): readonly ProjectGalleryItem[] {
  return DESIGN_CATALOG_GALLERY_ITEMS.map((item) => {
    const text = item[language];
    const image = `assets/images/projects/design-catalog/masonry/${item.file}.webp`;

    return {
      title: text.title,
      text: text.text,
      detail: text.detail,
      image,
      backgroundColor: item.backgroundColor ?? DESIGN_CATALOG_GALLERY_BACKGROUNDS[item.file],
      imageHint: image,
      alt: text.alt,
      size: item.size,
      icon: item.icon,
      tools: item.tools,
      year: item.year,
    };
  });
}


/** Lokale DCR-Case-Studies ohne Abhängigkeit von b2folio.de. */
export const REFERENCE_CASE_PROJECTS: Record<PortfolioLanguage, readonly PortfolioProject[]> = {
  de: [
      {
        slug: 'intranet',
        name: 'Intranet',
        kicker: 'Mehrere Apps. Ein Backend. Ein Rechtekern.',
        summary: 'Aus vielen internen Arbeitsschritten wird ein zusammenhängendes System: verlässliche Oberflächen, klare Zuständigkeiten und technische Kontrolle, die im laufenden Betrieb nicht im Weg steht.',
        description: 'Das Intranet ist kein einzelnes Dashboard, sondern ein gewachsener Systemverbund aus fachlich getrennten Apps. Login, Produktion, Projects, Document Share, Reklamationen, Rechteverwaltung, Direct Messages und System Health laufen über eine zentrale Django-API, gemeinsame Authentifizierung, rollenbasierte App-Rechte und Echtzeitkanäle über Django Channels.',
        goal: 'Ziel war eine wartbare Plattform, die operative Daten nicht nur anzeigt, sondern Prozesse abbildet: AU-/XLSX-Importe, Konfliktauflösung, Produktionsstatus, automatische Aufgaben, Dokumentenvorschauen, Benachrichtigungen, User-Lifecycle und technische Health-Checks sollten nachvollziehbar, erweiterbar und rechtebasiert zusammenspielen.',
        role: 'Full-Stack-Entwicklung von Architektur, Datenmodell, API, WebSocket-Flows, Rechtekonzept, UI-Struktur, Designsystem, Debugging und Deployment-Logik. Dazu gehören Angular-Komponenten, Django-Services, Serializer, Guards, Signals, Celery-Jobs, Redis-/Channels-Integration und operative Fehleranalyse.',
        year: '2025–2026',
        type: 'Intranet / Business Application',
        accent: 'blue',
        techStack: ['Angular', 'TypeScript', 'Django REST', 'Django Channels', 'Daphne', 'PostgreSQL', 'Redis', 'Celery', 'Celery Beat', 'JWT / Refresh', 'WebSockets', 'Local Mounts / File Access', 'SCSS'],
        highlights: ['Rechtebasierte App-Shell', 'Produktionsimport mit Konfliktmodell', 'WebSocket-Flows für Live-Zustände', 'Celery-Jobs für Previews und Recurrences', 'System-Health für DB, Redis, Channels und Dienste'],
        technicalHighlights: [
          { icon: 'account_tree', title: 'Modulare Architektur', text: 'Getrennte Angular-Frontends teilen Auth, Navigation, Toast und Bug-Reporting als zentrale Libraries; die Fachdomänen bleiben unabhängig erweiterbar.' },
          { icon: 'admin_panel_settings', title: 'Rollen & Rechte', text: 'AppPermission, UserAppPermission, Developer-Zone und ein Pending→Active-User-Lifecycle trennen Sichtbarkeit, Fachaktion und Freigabe konsequent.' },
          { icon: 'sensors', title: 'Echtzeit-Kommunikation', text: 'Daphne, Django Channels und Redis verbinden Presence, Direct Messages, Produktionsimport und Projects-Boards ohne Polling-Flut.' },
          { icon: 'bolt', title: 'Asynchrone Verarbeitung', text: 'Celery, Celery Beat und getrennte Worker-Queues übernehmen Document-Share-Previews, wiederkehrende Projects-Aufgaben und langlaufende Jobs außerhalb des Request-Zyklus.' },
        ],
        appModules: [
          { id: 'document-share', title: 'Document Share', text: 'Gemounteter Dokument-Storage mit Kategorien, eigenem Rechtekern, Vorschauen und spezialisierter Suchlogik.', icon: 'menu_book', badge: 'Live', status: 'live' },
          { id: 'production', title: 'Produktionsplanung', text: 'Weitgehend autonomer XLSX-Sync mit Konfliktklassifizierung, Auftragssteuerung, Mengenaggregation und Produktionsplanung.', icon: 'factory', badge: 'Core', status: 'live' },
          { id: 'projects', title: 'Projects', text: 'Kanban, persönliche Workflows, Recurring Tasks, Messaging, Pool-Logik und Produktions-Sync in einem Rechtekontext.', icon: 'hub', badge: 'Sync', status: 'live' },
          { id: 'health', title: 'System Health', text: 'Geschützte Dev-App für Services, Datenbank, Redis, Worker, Logs und den globalen Maintenance Mode.', icon: 'database', badge: 'Ops', status: 'private' },
          { id: 'inventory', title: 'Inventur', text: 'Bestände, Kunden- und Firmengebinde als strukturierte Übersicht für operative Kontrolle.', icon: 'fact_check', badge: 'Demnächst', status: 'soon' },
          { id: 'complaints', title: 'Reklamationen', text: 'Auftragsbezogene Reklamationshistorien mit Medien, abteilungsübergreifender Prüfung und statistischer Auswertung.', icon: 'crisis_alert', badge: 'Live', status: 'live' },
          { id: 'analysis', title: 'Produktanalyse', text: 'Mehrstufige QM-Analysen mit Kurz-/Langzeittests, Erinnerungen, Radarprofilen und Mehrartikelvergleich.', icon: 'monitoring', badge: 'Lab', status: 'private' },
        ],
        terminalWidgets: [
          { id: 'status', title: 'system-status.bat', position: 'status', lines: ['SYSTEM STATUS', 'API latency: 38ms', 'DB connections: 32', 'Celery queue: healthy', 'Status: OK'] },
          { id: 'events', title: 'websocket.log', position: 'events', lines: ['[14:02:11] WS connected', '[14:02:12] group=produktion.import', '[14:02:13] event=progress.update', '[14:02:14] event=board.refresh'] },
          { id: 'queue', title: 'queue-jobs.bat', position: 'queue', lines: ['document_share_preview=running', 'projects_recurrence=scheduled', 'failed_jobs=0', 'worker=document_share_preview@host'] },
        ],
        terminalTitle: 'intranet.deep_dive.exe',
        terminalLines: [
          'apps=login|produktion|projects|document_share|reklamation|rights|system_health',
          'auth=jwt_cookie + csrf_endpoint + refresh_flow + auth_session_ws',
          'realtime=daphne/channels:news,apps,presence,dm,produktion_import,projects_board',
          'async=celery/beat:document_share_preview + projects_due_recurrences',
          'data=postgresql models with import_conflicts, task_sync_links, permissions',
          'ops=system_health checks:db,redis,cache,channels,systemd,journal',
          'rule=visibility follows app rights, role checks and domain permissions',
        ],
        requirements: ['App-übergreifende Authentifizierung', 'Feingranulare Rechte pro App und Funktion', 'Nachvollziehbarer XLSX-/AU-Reimport', 'Live-Updates ohne harte Reloads', 'Asynchrone Jobs außerhalb des Request-Zyklus', 'Monitoring für Datenbank, Redis, WebSockets und Worker'],
        detailMode: 'case-study',
        metrics: [
          { value: '7', label: 'App-Module', text: 'Fachliche Apps und Ops-Werkzeuge greifen auf dieselbe Plattform und denselben Rechtekern zurück.' },
          { value: '18+', label: 'WS-Kanäle', text: 'News, Apps, Auth-Session, Presence, DMs, Produktion und Projects senden Live-Zustände.' },
          { value: '128+', label: 'Job-Flows', text: 'Preview-Jobs, Recurrences, Imports und Sync-Prozesse laufen außerhalb der UI-Anfrage.' },
          { value: '7', label: 'Rechte-Layer', text: 'Rolle, App, Route, Aktion, Objektbezug, Developer-Zone und Session-Zustand werden getrennt betrachtet.' },
          { value: '24/7', label: 'Ops-Sicht', text: 'System Health macht Datenbank, Redis, Channels, Worker, Logs und Dienste sichtbar.' },
          { value: '5', label: 'Sync-Pipelines', text: 'Produktion, Projects, Document Share, Direct Messages und Health-Daten werden fachlich gekoppelt.' },
          { value: '12K+', label: 'Import-Aktionen', text: 'AU-/XLSX-Daten, Hashes, Konflikte und Soft-Removal werden nachvollziehbar behandelt.' },
        ],
        telemetry: {
          eyebrow: 'platform_telemetry.exe',
          title: 'Ein System. Viele operative Ebenen.',
          subtitle: '',
          statusLabel: 'Platform', statusValue: 'MODULAR / LIVE', source: 'Source: documented modules', kpiAriaLabel: 'Intranet-Projektkennzahlen',
          charts: [
            { id: 'scope', eyebrow: 'building_blocks.radial', title: 'Dokumentierte Bausteine', description: 'Anzahl konkret benannter Bausteine pro Bereich. Der Ring zeigt damit Umfang, nicht Qualität.', variant: 'radial', maxValue: 7, data: [
              { label: 'Apps', value: 7 }, { label: 'Backend-Domains', value: 6 }, { label: 'Realtime-Flows', value: 6 }, { label: 'Job-Familien', value: 2 }, { label: 'Ops-Checks', value: 6 },
            ] },
            { id: 'flow', eyebrow: 'runtime_depth.area', title: 'Runtime Path Depth', description: 'Anzahl beteiligter Architektur-Layer bei typischen Vorgängen. Beispiel Projects-Sync: UI → API → DB → Redis/Channels → Celery → UI.', variant: 'area', maxValue: 7, valueSuffix: ' Layer', data: [
              { label: 'Login', value: 4 }, { label: 'Produktion', value: 5 }, { label: 'Projects', value: 6 }, { label: 'Doc Share', value: 6 }, { label: 'Health', value: 5 },
            ] },
            { id: 'layers', eyebrow: 'async_chain.step', title: 'Async Processing Chain', description: 'Keine Bewertung: Die Höhe entspricht der Reihenfolge im Ablauf – vom fachlichen Event bis zur Rückmeldung ins Frontend.', variant: 'step', maxValue: 6, valueSuffix: ' / 6', data: [
              { label: 'Event', value: 1 }, { label: 'API', value: 2 }, { label: 'Queue', value: 3 }, { label: 'Worker', value: 4 }, { label: 'Persist', value: 5 }, { label: 'Realtime', value: 6 },
            ] },
          ],
        },
        chapters: [
          { eyebrow: 'Auth & Rechte', title: 'Zentrale Anmeldung mit fachlicher Rechte-Matrix', text: 'Die Plattform arbeitet mit einer gemeinsamen Login-Basis, JWT-/Refresh-Flow, CSRF-Endpunkt und einem Rechtekern aus Apps, Permission-Codes und User-Zuweisungen. Dadurch kann eine Oberfläche sichtbar sein, ohne automatisch jede Aktion freizugeben.', points: ['JWT-Cookie-Flow mit Refresh und Logout', 'AppPermission/UserAppPermission als DB-Modell', 'Developer-only Bereiche für System Health', 'Routen- und Aktionsrechte getrennt gedacht'] },
          { eyebrow: 'Produktion', title: 'XLSX-Import als stabiler Daten-Sync statt Tabellenkopie', text: 'Der Produktionsbereich verarbeitet AU-Dateien, Positionen, Versand, Archiv, Teilmengen und Statuslogik. Besonders wichtig ist der nicht-destruktive Reimport: gelöschte oder verschobene XLSX-Zeilen dürfen vorhandene DB-Slots nicht unkontrolliert zerstören.', points: ['OrderFile mit Import-Hash und Zeitstempel', 'OrderPosition mit Soft-Removal und Fingerprint', 'OrderImportConflict mit stabiler conflict_signature', 'Mutation-Log und Blockierung bei offenen Konflikten'] },
          { eyebrow: 'Projects Sync', title: 'Produktionszustände werden zu Aufgaben-Workflows', text: 'Projects übernimmt Produktionsbezüge über Sync-Links und Outbox-Modelle. Aufgaben, Unteraufgaben, Kommentare, Anhänge, Notifications und Pool-Logik werden aus Fachzuständen heraus erzeugt oder aktualisiert.', points: ['ProductionOrderTaskSyncLink als Kopplung', 'Outbox/Celery-Weitergabe für robuste Verarbeitung', 'Board-, Pool- und User-Refresh über Realtime-Service', 'Systemuser für automatische Aufgaben'] },
          { eyebrow: 'Realtime & Async', title: 'Live-UI ohne Polling-Spam', text: 'Echtzeitfunktionen laufen über Daphne, Django Channels und Redis. Zeitintensive Arbeiten wie Document-Share-Previews oder wiederkehrende Projects-Aufgaben werden an Celery ausgelagert, damit UI-Requests schnell bleiben.', points: ['WebSocket-Gruppen für Presence, DM, Import und Boards', 'Redis als Channel Layer, Cache und Worker-Baustein', 'Celery Beat für Fälligkeiten und Recurrences', 'Preview-Generierung getrennt vom UI-Request'] },
          { eyebrow: 'Document Share & Suche', title: 'Dokumente mit Vorschau, Typen, Rechten und Suchindex', text: 'Document Share verwaltet Kategorien, Tags, Medientypen, Favoriten, Recents und Vorschauen. Der Suchindex trennt Volltext von strukturierten Tokens, damit Dateinamen, Titel und nummerische Bereiche gezielter gefunden werden können.', points: ['Strukturierte Tokens für Exact-/Range-Suche', 'Gecachte PDF-Vorschauen pro Dokument', 'Kategorie-Rechte und User-Prefs', 'Zentraler Storage-Service für lokale Mounts und Dateizugriffe'] },
          { eyebrow: 'Ops', title: 'System Health als internes Kontrollzentrum', text: 'Das Backend enthält Health-Services für Datenbank, Redis, Cache, Channels, Systemd und Journal-Logs. Damit wird das Intranet nicht nur entwickelt, sondern im Betrieb beobachtbar gemacht.', points: ['DB-Ping und Tabellen-/Lock-Ansichten', 'Redis- und Cache-Checks', 'Systemd-Service-Status', 'Journal-/Log-Auswertung ohne Secrets'] },
        ],
        architecture: [
          { id: 'frontends', label: 'Angular Frontends', icon: 'deployed_code', role: 'Presentation Layer', text: 'Mehrere eigenständige Angular-Oberflächen bleiben fachlich getrennt. Shared Auth, shared-nav, shared-toast und Bug-Reporting sind zentral in jedem Frontend eingebunden; Guards, Interceptors und Designsystem folgen denselben globalen Konventionen.', connections: ['shared-nav · global', 'shared-toast · global', 'bug-reporter · global', 'Django REST API', 'Django Channels'] },
          { id: 'auth', label: 'Auth & Rights', icon: 'admin_panel_settings', role: 'Access Control', text: 'Login, JWT-/Refresh-Flow, CSRF und AppPermission/UserAppPermission bilden den Zugriffskern. Registrierungen starten geschützt als pending; Freigabe und Developer-Zone bleiben explizit privilegiert.', connections: ['Accounts App', 'Rights Definitions', 'Shared Nav Guards'] },
          { id: 'api', label: 'Django API', icon: 'hub', role: 'Business Layer', text: 'Die API kapselt Serializer, Views, Permissions und Services für Produktion, Projects, Document Share, Reklamationen, Direct Messages und Ops-Funktionen.', connections: ['PostgreSQL', 'Redis', 'Celery', 'Channels'] },
          { id: 'database', label: 'PostgreSQL Models', icon: 'database', role: 'Persistence Layer', text: 'Relationale Modelle halten Nutzer, Rechte, Produktionsaufträge, Import-Konflikte, Task-Sync-Links, Dokumente, Notifications, Kommentare und Audit-/Health-Daten nachvollziehbar zusammen.', connections: ['OrderImportConflict', 'Task Sync Links', 'Document Search Tokens'] },
          { id: 'realtime', label: 'Channels / Redis', icon: 'stream', role: 'Realtime Layer', text: 'WebSocket-Endpunkte über Daphne und Django Channels übertragen News, App-Updates, Auth-Session-Status, Presence, Direct Messages, Produktionsimport-Events und Projects-Board-Refreshs.', connections: ['Redis Channel Layer', 'Angular Clients', 'Realtime Services'] },
          { id: 'workers', label: 'Celery Jobs', icon: 'settings_suggest', role: 'Async Layer', text: 'Celery und Celery Beat verarbeiten wiederkehrende Projects-Aufgaben und Document-Share-Preview-Jobs außerhalb des Request-Zyklus. Dadurch bleiben Uploads, Boards und Dokumentansichten reaktionsfähig.', connections: ['Redis Broker', 'Document Share Preview', 'Projects Recurrence'] },
          { id: 'ops', label: 'System Health', icon: 'monitor_heart', role: 'Observability', text: 'Ops-Services prüfen DB, Redis, Cache, Channels, Systemd und Logs. Der Bereich ist bewusst geschützt und liefert Betriebsfeedback ohne Secrets offenzulegen.', connections: ['DB Health Views', 'Service Health Views', 'Journal Service'] },
        ],
        capabilities: {
          eyebrow: 'extended_capabilities.index',
          title: 'Weitere Funktionen im Systemverbund',
          text: 'Die sichtbaren Oberflächen zeigen nur einen Teil der Plattform. Zentrale Services, Automatisierungen und Fachlogik arbeiten bewusst im Hintergrund.',
          items: [
            { label: 'Platform Core', title: 'Shared Services & Identity', text: 'Navigation, Auth, Toast und Bug-Reporter laufen als zentrale Libraries. App-Nachrichten werden global aggregiert; die Developer-Zone bündelt User, Rechte, Tools und Architektur-Doku. Registrierung über den Login ist zusätzlich passwortgeschützt, startet pending und benötigt aktive Freigabe.' },
            { label: 'Document Share', title: 'Storage, Rechte & Suche', text: 'Gemounteter lokaler Storage mit Tags, Kategorien, nutzerbezogenen Kategorie-Rechten, Passwortschutz, Favoriten, Recents und Medientyp-Whitelist. Preview, Direktöffnung, App-Tour und eine regex-nahe Search-DSL ergänzen den Workflow.' },
            { label: 'Production Planning', title: 'Autonomer Import & Steuerung', text: 'Ein Service scannt alle fünf Minuten definierte lokale Pfade und importiert XLSX-Dateien über Keyword- und Ausschlussregeln. Reimports werden als Edge, Update oder New klassifiziert; nur Edge blockiert bis zur Prüfung. Produktiv-/Historik-Sicht, Statusflags, Positionsbearbeitung, Mengenaggregation, Vorplanung und Deadlines steuern die Produktion.' },
            { label: 'Projects', title: 'Workflows & Collaboration', text: 'Kanban, KPI-/Prio-/Auslastungsdashboard und ein persönliches Dashboard mit dynamischer Neu-Spalte und Sortierregeln ergänzen Recurring Tasks, Inbox, Direct Messages und Chat. Der Pool verteilt freie Aufgaben und übernimmt synchronisierte Produktionsaufträge; Systemprojekte besitzen eigene Rechte.' },
            { label: 'Operations', title: 'Health & Maintenance', text: 'System Health überwacht Services, Datenbank, Redis, Worker und Logs. Ein globaler Maintenance Mode versetzt den Systemverbund zentral in Wartung und beendet aktive Sessions kontrolliert.' },
            { label: 'Quality Management', title: 'Reklamationen & Produktanalyse', text: 'Reklamationen führen manuelle Auftragshistorien, Medien und abteilungsübergreifende Prüfungen inklusive Produkt-/Problemstatistik. Die chemiespezifische Produktanalyse bildet mehrstufige Kurz-/Langzeittests, Erinnerungen, Problemerkennung, Radarprofile und Mehrartikelvergleiche ab.' },
          ],
        },
        gallery: [
          { title: 'Login', text: 'Zentraler Einstieg in den Systemverbund mit gemeinsamer Authentifizierung und Session-Handling.', image: 'assets/images/projects/intranet/screens/intranet-login.webp', alt: 'Login-Oberfläche des Intranets', size: 'md' },
          { title: 'Dashboard', text: 'Operativer Einstieg mit Kennzahlen, Statusinformationen und den wichtigsten Arbeitsbereichen.', image: 'assets/images/projects/intranet/screens/intranet-dashboard.webp', alt: 'Dashboard des Intranets mit Kennzahlen und Statusinformationen', size: 'lg' },
          { title: 'App-Übersicht', text: 'Die verfügbaren Fachanwendungen werden abhängig von Rolle und App-Rechten zentral bereitgestellt.', image: 'assets/images/projects/intranet/screens/intranet-app-overview.webp', alt: 'App-Übersicht des Intranets', size: 'md' },
          { title: 'Control Panel', text: 'Geschützter Administrationsbereich für zentrale System- und Anwendungseinstellungen.', image: 'assets/images/projects/intranet/screens/intranet-control-panel.webp', alt: 'Control Panel des Intranets', size: 'lg' },
          { title: 'User-Rechte', text: 'Feingranulare App- und Funktionsrechte lassen sich nutzerbezogen verwalten und kontrollieren.', image: 'assets/images/projects/intranet/screens/intranet-user-rights-modal.webp', alt: 'Dialog zur Verwaltung von Benutzerrechten', size: 'md' },
          { title: 'Produktionsimport', text: 'Eingehende AU-/XLSX-Daten werden geprüft, synchronisiert und bei Konflikten nachvollziehbar aufbereitet.', image: 'assets/images/projects/intranet/screens/intranet-import-inbox.webp', alt: 'Import-Inbox für Produktionsdaten', size: 'lg' },
          { title: 'Auftragsstatus', text: 'Produktionszustände, Teilmengen und Bearbeitungsfortschritt bleiben im operativen Kontext sichtbar.', image: 'assets/images/projects/intranet/screens/intranet-order-status.webp', alt: 'Statusansicht eines Produktionsauftrags', size: 'md' },
          { title: 'Auftragshistorie', text: 'Statuswechsel und relevante Änderungen können direkt am Auftrag nachvollzogen werden.', image: 'assets/images/projects/intranet/screens/intranet-order-history-modal.webp', alt: 'Historie eines Produktionsauftrags', size: 'md' },
          { title: 'Wartungssteuerung', text: 'Wartungszustände können kontrolliert gesetzt und für betroffene Bereiche transparent kommuniziert werden.', image: 'assets/images/projects/intranet/screens/intranet-maintenance-modal.webp', alt: 'Wartungsdialog des Intranets', size: 'md' },
          { title: 'Database Health', text: 'Datenbankstatus, Locks und technische Kennzahlen werden als geschützte Ops-Sicht aufbereitet.', image: 'assets/images/projects/intranet/screens/intranet-db-health.webp', alt: 'Database-Health-Ansicht des Intranets', size: 'lg' },
          { title: 'Document Share', text: 'Dokumente, Kategorien, Vorschauen und berechtigte Suchpfade werden in einer gemeinsamen Oberfläche gebündelt.', image: 'assets/images/projects/intranet/screens/document-share.webp', alt: 'Document-Share-Oberfläche des Intranets', size: 'lg' },
          { title: 'Projects · Einstieg', text: 'Persönlicher Einstieg in Aufgaben, Projekte und anstehende Arbeit innerhalb des gemeinsamen Workflows.', image: 'assets/images/projects/intranet/screens/projects-welcome.webp', alt: 'Projects-Startansicht des Intranets', size: 'md' },
          { title: 'Projects · Board', text: 'Boards verbinden Aufgaben, Zuständigkeiten, Status und Produktionsbezüge in einer operativen Arbeitsfläche.', image: 'assets/images/projects/intranet/screens/projects-board.webp', alt: 'Projects-Board des Intranets', size: 'lg' },
          { title: 'Projects · Inbox', text: 'Neue und zugewiesene Aufgaben werden zentral gesammelt und anschließend in den passenden Workflow überführt.', image: 'assets/images/projects/intranet/screens/projects-inbox.webp', alt: 'Projects-Inbox des Intranets', size: 'md' },
        ],
        liveDemo: { status: 'private', text: 'Eine öffentliche Demo würde den realen Betrieb nur unzureichend abbilden: Authentifizierung, Rechte, Automatisierungen, Worker, lokale Mounts und interne Dienste sind Teil des Systemverbunds. Die Case Study zeigt deshalb anonymisierte Screenshots und die technische Architektur; produktiver Unternehmenscode und interne Daten bleiben geschützt und nicht öffentlich.' },
      },
      {
        slug: 'grafikdesign-katalog',
        name: 'Design Archiv',
        titleLines: ['Design', 'Archiv'],
        kicker: 'Editorial',
        summary: 'Ein visuelles Archiv ausgewählter Arbeiten aus den Jahren 2017–2023: Editorial-Layouts, Motive, Retuschen und Designexperimente werden als kuratierter WebP-Katalog und als Masonry-Galerie präsentiert.',
        description: 'Das Designarchiv bündelt freie und angewandte Arbeiten aus 2017–2023. Im Mittelpunkt stehen Bildbearbeitung, Komposition, Farbe, Typografie, Layoutgefühl und selbst erstellte Assets. Präsentiert wird die Sammlung als performancefreundlicher WebP-Katalog und als visuelle Masonry-Galerie mit erweitertem Archivkontext.',
        goal: 'Ziel ist eine portfolioartige Archivbühne, die Entwicklung, Stilbreite und gestalterische Handschrift sichtbar macht: groß, ruhig, bildstark und mit genug Kontext, damit Betrachter Werkzeug, Motiv und Entscheidung verstehen.',
        role: 'Bildauswahl, Retusche, Farblook, Composing, Vektorarbeit, Typografie, Layoutaufbau, Seitenrhythmus und digitale Inszenierung des Katalogs.',
        year: '2017–2023',
        type: 'Grafikdesign / Editorial',
        accent: 'pink',
        techStack: ['Photoshop', 'Lightroom', 'Illustrator', 'Composing', 'Editorial Design'],
        highlights: ['WebP-Katalogseiten', 'Katalog-Bildlupe', 'Masonry-Galerie', 'Lightbox mit Bilddetails'],
        requirements: ['Komplette Katalogseiten als WebP zeigen', 'Sonderformat proportional darstellen', 'Bilddetails sichtbar machen', 'Werkzeuge nennen', 'Keine technische Case Study', 'Responsive Galerie', 'Tastaturbedienbare Lightbox', 'Assets performancefreundlich austauschbar halten'],
        detailMode: 'editorial',
        metrics: [
          { value: '2017–23', label: 'Archivarbeiten', text: 'Ausgewählte Archivarbeiten aus den Jahren 2017 bis 2023.' },
          { value: '21×25 cm', label: 'Print-Ursprung', text: 'Ursprünglich als gedrucktes Booklet im handlichen Sonderformat angelegt.' },
          { value: 'PS', label: 'Photoshop', text: 'Composings, Retuschen, Freisteller und Bildmontagen.' },
          { value: 'LR', label: 'Lightroom', text: 'Bildlook, Farbserien, Kontrast und konsistente Stimmungen.' },
          { value: 'AI', label: 'Illustrator', text: 'Vektoren, Zeichen, Layoutgrafiken und präzise Formen.' },
          { value: 'Masonry+', label: 'Galerie', text: 'Die Masonry-Galerie erweitert den Katalog um zusätzliche Arbeiten und Detailkontexte.' },
        ],
        telemetry: {
          eyebrow: 'archive_telemetry.exe',
          title: 'Gestaltung als System, nicht als Bilderordner.',
          subtitle: 'Die Werte beschreiben den relativen Scope der dokumentierten Editorial-, Archiv- und Interaktionsbereiche des digitalen Katalogs.',
          statusLabel: 'Archive', statusValue: 'EDITORIAL / INTERACTIVE', source: 'Source: catalog structure', kpiAriaLabel: 'Grafikdesign-Katalog-Projektkennzahlen',
          charts: [
            { id: 'scope', eyebrow: 'design_scope.radial', title: 'Design Surface', description: 'Relative Gewichtung der zentralen Gestaltungsbereiche.', variant: 'radial', maxValue: 5, data: [
              { label: 'Editorial', value: 5 }, { label: 'Visual', value: 5 }, { label: 'Archive', value: 4 }, { label: 'Interaction', value: 4 }, { label: 'Type', value: 4 },
            ] },
            { id: 'flow', eyebrow: 'reader_flow.area', title: 'Reader Interaction Flow', description: 'Relative Interaktionstiefe vom Einstieg bis zur Detailansicht.', variant: 'area', maxValue: 5, data: [
              { label: 'Cover', value: 1 }, { label: 'TOC', value: 2 }, { label: 'Spread', value: 4 }, { label: 'Loupe', value: 5 }, { label: 'Gallery', value: 4 },
            ] },
            { id: 'layers', eyebrow: 'editorial.step', title: 'Editorial Layers', description: 'Digitale Ebenen des Readers von Inhalt bis Interaktion.', variant: 'step', maxValue: 5, data: [
              { label: 'Content', value: 2 }, { label: 'Layout', value: 3 }, { label: 'Assets', value: 4 }, { label: 'Reader', value: 5 }, { label: 'Lightbox', value: 4 },
            ] },
          ],
        },
        catalogShowcase: {
          eyebrow: 'digital_catalog.indd',
          title: 'Digitales Editorial',
          status: 'Static WebP Editorial',
          lead: 'Das Archiv wird nicht als technische Demo erzählt, sondern als kuratierte Bildstrecke: vorbereitete WebP-Seiten, ruhige Betrachtung und eine Galerie, die Arbeiten aus 2017 bis 2023 portfoliofähig zusammenführt.',
          ctaLabel: 'Arbeiten ansehen',
          chips: ['Photoshop', 'Lightroom', 'Illustrator', 'WebP Reader'],
          readerLabel: 'Designarchiv mit vorbereiteten WebP-Katalogseiten',
          readerEyebrow: 'Katalog Reader',
          readerTitle: 'Ausgewählte Arbeiten',
          readerHint: '',
          tocOpenLabel: 'Inhaltsverzeichnis öffnen',
          tocCloseLabel: 'Inhaltsverzeichnis schließen',
          tocTitle: 'Inhaltsverzeichnis',
          previousLabel: 'Vorherige Doppelseite',
          nextLabel: 'Nächste Doppelseite',
          galleryEyebrow: 'Masonry Gallery',
          galleryTitle: 'Ausgewählte Arbeiten als Bildwand',
          lightboxOpenLabel: 'Bilddetails öffnen',
          lightboxCloseLabel: 'Lightbox schließen',
          lightboxPreviousLabel: 'Vorheriges Bild',
          lightboxNextLabel: 'Nächstes Bild',
          tocItems: createDesignCatalogTocItems(),
          spreads: createDesignCatalogSpreads(),
        },
        chapters: [
          { eyebrow: 'Konzept', title: 'Individueller Printkatalog als Archivformat', text: 'Das ursprüngliche Katalogkonzept sollte kreativ, informativ und bewusst eigenständig wirken. Wichtig waren ein handliches 21×25-cm-Format, starke Schwarz-Weiß-Kontraste, helle und dunkle Seitenrhythmen sowie eine breite Auswahl an Arbeiten, die unterschiedliche gestalterische Skills sichtbar macht.', points: ['21×25-cm-Booklet', 'Schwarz-Weiß-Kontraste', 'Breite Skill-Bandbreite'] },
          { eyebrow: 'Werkzeuge', title: 'Photoshop, Lightroom und Illustrator als Kern', text: 'Die Arbeiten entstanden über Retusche, Composing, Farblook, Vektorformen, Typografie und Layoutentscheidungen. Jedes Werkzeug hatte eine klare Rolle im visuellen Ergebnis und wurde je nach Motiv bewusst kombiniert.', points: ['Photoshop für Composing', 'Lightroom für Look', 'Illustrator für Vektorarbeit'] },
          { eyebrow: 'Inszenierung', title: 'Blättern, Zoomen, Betrachten', text: 'Der Reader zeigt vollständige Archivseiten als WebP, damit Layout, Motiv und Bildwirkung erhalten bleiben. Die Masonry-Bilder werden lazy geladen; aktive Reader-Seiten bleiben bewusst direkt verfügbar. Navigation, Hover-Lupe und Lightbox machen die Sammlung angenehm prüfbar.', points: ['Proportionaler WebP-Reader', 'Lazy geladene Masonry-Galerie', 'Bilddetails per Lupe'] },
        ],
        gallery: createDesignCatalogGalleryItems('de'),
      },
  ],
  en: [
      {
        slug: 'intranet',
        name: 'Intranet',
        kicker: 'Multiple apps. One backend. One permission core.',
        summary: 'Many internal workflows become one connected system: reliable interfaces, clear responsibilities and technical control that does not get in the way during daily operations.',
        description: 'The intranet is not a single dashboard, but a growing system of domain-specific apps. Login, production, Projects, Document Share, complaints, rights management, direct messages and system health run through one Django API, shared authentication, role-based app permissions and realtime channels through Django Channels.',
        goal: 'The goal was a maintainable platform that does more than display operational data: AU/XLSX imports, conflict resolution, production status, automatic tasks, document previews, notifications, user lifecycle and technical health checks should work together in a traceable, extensible and permission-aware way.',
        role: 'Full-stack development across architecture, data model, API, WebSocket flows, permission concept, UI structure, design system, debugging and deployment logic. This includes Angular components, Django services, serializers, guards, signals, Celery jobs, Redis/Channels integration and operational troubleshooting.',
        year: '2025–2026',
        type: 'Intranet / Business Application',
        accent: 'blue',
        techStack: ['Angular', 'TypeScript', 'Django REST', 'Django Channels', 'Daphne', 'PostgreSQL', 'Redis', 'Celery', 'Celery Beat', 'JWT / Refresh', 'WebSockets', 'Local Mounts / File Access', 'SCSS'],
        highlights: ['Permission-based app shell', 'Production import with conflict model', 'WebSocket flows for live state', 'Celery jobs for previews and recurrences', 'System health for DB, Redis, Channels and services'],
        technicalHighlights: [
          { icon: 'account_tree', title: 'Modular architecture', text: 'Separate Angular frontends share auth, navigation, toast and bug reporting as central libraries while domain apps remain independently extensible.' },
          { icon: 'admin_panel_settings', title: 'Roles & permissions', text: 'AppPermission, UserAppPermission, the developer zone and a pending→active user lifecycle separate visibility, domain actions and approval.' },
          { icon: 'sensors', title: 'Realtime communication', text: 'Daphne, Django Channels and Redis connect presence, direct messages, production imports and Projects boards without polling noise.' },
          { icon: 'bolt', title: 'Async processing', text: 'Celery, Celery Beat and dedicated worker queues handle Document Share previews, recurring Projects tasks and long-running jobs outside the request cycle.' },
        ],
        appModules: [
          { id: 'document-share', title: 'Document Share', text: 'Mounted document storage with categories, its own permission core, previews and specialized search logic.', icon: 'menu_book', badge: 'Live', status: 'live' },
          { id: 'production', title: 'Production planning', text: 'Largely autonomous XLSX sync with conflict classification, order control, quantity aggregation and production planning.', icon: 'factory', badge: 'Core', status: 'live' },
          { id: 'projects', title: 'Projects', text: 'Kanban, personal workflows, recurring tasks, messaging, pool logic and production sync within one permission context.', icon: 'hub', badge: 'Sync', status: 'live' },
          { id: 'health', title: 'System Health', text: 'Protected developer app for services, database, Redis, workers, logs and the global maintenance mode.', icon: 'database', badge: 'Ops', status: 'private' },
          { id: 'inventory', title: 'Inventory', text: 'Customer and company container stocks as a structured overview for operational control.', icon: 'fact_check', badge: 'Soon', status: 'soon' },
          { id: 'complaints', title: 'Complaints', text: 'Order-linked complaint histories with media, cross-department review and statistical evaluation.', icon: 'crisis_alert', badge: 'Live', status: 'live' },
          { id: 'analysis', title: 'Product analytics', text: 'Multi-stage quality analysis with short/long-term tests, reminders, radar profiles and multi-product comparison.', icon: 'monitoring', badge: 'Lab', status: 'private' },
        ],
        terminalWidgets: [
          { id: 'status', title: 'system-status.bat', position: 'status', lines: ['SYSTEM STATUS', 'API latency: 38ms', 'DB connections: 32', 'Celery queue: healthy', 'Status: OK'] },
          { id: 'events', title: 'websocket.log', position: 'events', lines: ['[14:02:11] WS connected', '[14:02:12] group=production.import', '[14:02:13] event=progress.update', '[14:02:14] event=board.refresh'] },
          { id: 'queue', title: 'queue-jobs.bat', position: 'queue', lines: ['document_share_preview=running', 'projects_recurrence=scheduled', 'failed_jobs=0', 'worker=document_share_preview@host'] },
        ],
        terminalTitle: 'intranet.deep_dive.exe',
        terminalLines: [
          'apps=login|production|projects|document_share|complaints|rights|system_health',
          'auth=jwt_cookie + csrf_endpoint + refresh_flow + auth_session_ws',
          'realtime=daphne/channels:news,apps,presence,dm,production_import,projects_board',
          'async=celery/beat:document_share_preview + projects_due_recurrences',
          'data=postgresql models with import_conflicts, task_sync_links, permissions',
          'ops=system_health checks:db,redis,cache,channels,systemd,journal',
          'rule=visibility follows app rights, role checks and domain permissions',
        ],
        requirements: ['Cross-app authentication', 'Fine-grained permissions per app and action', 'Traceable XLSX/AU reimport', 'Live updates without hard reloads', 'Async jobs outside the request cycle', 'Monitoring for database, Redis, WebSockets and workers'],
        detailMode: 'case-study',
        metrics: [
          { value: '7', label: 'App modules', text: 'Domain apps and ops tools share the same platform foundation and permission core.' },
          { value: '18+', label: 'WS channels', text: 'News, apps, auth session, presence, DMs, production and Projects publish live state.' },
          { value: '128+', label: 'Job flows', text: 'Preview jobs, recurrences, imports and sync flows run outside the UI request.' },
          { value: '7', label: 'Permission layers', text: 'Role, app, route, action, object scope, developer zone and session state are handled separately.' },
          { value: '24/7', label: 'Ops view', text: 'System Health exposes database, Redis, Channels, workers, logs and service state.' },
          { value: '5', label: 'Sync pipelines', text: 'Production, Projects, Document Share, direct messages and health data are connected by domain logic.' },
          { value: '12K+', label: 'Import actions', text: 'AU/XLSX data, hashes, conflicts and soft-removal states are kept traceable.' },
        ],
        telemetry: {
          eyebrow: 'platform_telemetry.exe',
          title: 'One system. Many operational layers.',
          subtitle: '',
          statusLabel: 'Platform', statusValue: 'MODULAR / LIVE', source: 'Source: documented modules', kpiAriaLabel: 'Intranet project metrics',
          charts: [
            { id: 'scope', eyebrow: 'building_blocks.radial', title: 'Documented Building Blocks', description: 'Count of concrete building blocks named per area. Ring size represents scope, not quality.', variant: 'radial', maxValue: 7, data: [
              { label: 'Apps', value: 7 }, { label: 'Backend domains', value: 6 }, { label: 'Realtime flows', value: 6 }, { label: 'Job families', value: 2 }, { label: 'Ops checks', value: 6 },
            ] },
            { id: 'flow', eyebrow: 'runtime_depth.area', title: 'Runtime Path Depth', description: 'Number of architecture layers involved in typical operations. Example Projects sync: UI → API → DB → Redis/Channels → Celery → UI.', variant: 'area', maxValue: 7, valueSuffix: ' layers', data: [
              { label: 'Login', value: 4 }, { label: 'Production', value: 5 }, { label: 'Projects', value: 6 }, { label: 'Doc Share', value: 6 }, { label: 'Health', value: 5 },
            ] },
            { id: 'layers', eyebrow: 'async_chain.step', title: 'Async Processing Chain', description: 'Not a rating: height represents the step number in the chain, from domain event to feedback in the frontend.', variant: 'step', maxValue: 6, valueSuffix: ' / 6', data: [
              { label: 'Event', value: 1 }, { label: 'API', value: 2 }, { label: 'Queue', value: 3 }, { label: 'Worker', value: 4 }, { label: 'Persist', value: 5 }, { label: 'Realtime', value: 6 },
            ] },
          ],
        },
        chapters: [
          { eyebrow: 'Auth & Rights', title: 'Central login with domain permission matrix', text: 'The platform uses a shared login base, JWT/refresh flow, CSRF endpoint and a permission core built from apps, permission codes and user assignments. An interface can be visible without automatically allowing every action.', points: ['JWT cookie flow with refresh and logout', 'AppPermission/UserAppPermission as database model', 'Developer-only areas for system health', 'Route and action permissions separated'] },
          { eyebrow: 'Production', title: 'XLSX import as stable data sync, not table copy', text: 'The production area handles AU files, positions, shipping, archive, partial quantities and status logic. The non-destructive reimport is critical: removed or shifted XLSX rows must not silently destroy existing database slots.', points: ['OrderFile with import hash and timestamp', 'OrderPosition with soft removal and fingerprint', 'OrderImportConflict with stable conflict_signature', 'Mutation log and blocking for open conflicts'] },
          { eyebrow: 'Projects Sync', title: 'Production states become task workflows', text: 'Projects receives production context through sync links and outbox models. Tasks, subtasks, comments, attachments, notifications and pool logic are created or updated from domain state.', points: ['ProductionOrderTaskSyncLink as coupling', 'Outbox/Celery handoff for robust processing', 'Board, pool and user refresh through realtime service', 'System user for automated tasks'] },
          { eyebrow: 'Realtime & Async', title: 'Live UI without polling noise', text: 'Realtime features run through Daphne, Django Channels and Redis. Expensive work such as Document Share previews or recurring Projects tasks is moved to Celery so UI requests remain fast.', points: ['WebSocket groups for presence, DM, import and boards', 'Redis as channel layer, cache and worker building block', 'Celery Beat for due dates and recurrences', 'Preview generation separated from UI requests'] },
          { eyebrow: 'Document Share & Search', title: 'Documents with previews, types, rights and search index', text: 'Document Share manages categories, tags, media types, favorites, recents and previews. The search index separates full text from structured tokens so filenames, titles and numeric ranges can be found more precisely.', points: ['Structured tokens for exact/range search', 'Cached PDF previews per document', 'Category permissions and user preferences', 'Central storage service for local mounts and file access'] },
          { eyebrow: 'Ops', title: 'System Health as internal control center', text: 'The backend contains health services for database, Redis, cache, Channels, systemd and journal logs. This makes the intranet observable in operation, not just during development.', points: ['DB ping and table/lock views', 'Redis and cache checks', 'Systemd service status', 'Journal/log evaluation without secrets'] },
        ],
        architecture: [
          { id: 'frontends', label: 'Angular Frontends', icon: 'deployed_code', role: 'Presentation Layer', text: 'Multiple standalone Angular interfaces stay separated by domain. Shared auth, shared-nav, shared-toast and bug reporting are central components included in every frontend; guards, interceptors and the design system follow the same global conventions.', connections: ['shared-nav · global', 'shared-toast · global', 'bug-reporter · global', 'Django REST API', 'Django Channels'] },
          { id: 'auth', label: 'Auth & Rights', icon: 'admin_panel_settings', role: 'Access Control', text: 'Login, JWT/refresh flow, CSRF and AppPermission/UserAppPermission form the access core. Registrations start protected as pending; approval and the developer zone remain explicitly privileged.', connections: ['Accounts App', 'Rights Definitions', 'Shared Nav Guards'] },
          { id: 'api', label: 'Django API', icon: 'hub', role: 'Business Layer', text: 'The API encapsulates serializers, views, permissions and services for production, Projects, Document Share, complaints, direct messages and ops features.', connections: ['PostgreSQL', 'Redis', 'Celery', 'Channels'] },
          { id: 'database', label: 'PostgreSQL Models', icon: 'database', role: 'Persistence Layer', text: 'Relational models connect users, permissions, production orders, import conflicts, task sync links, documents, notifications, comments and audit/health data.', connections: ['OrderImportConflict', 'Task Sync Links', 'Document Search Tokens'] },
          { id: 'realtime', label: 'Channels / Redis', icon: 'stream', role: 'Realtime Layer', text: 'WebSocket endpoints through Daphne and Django Channels transfer news, app updates, auth-session state, presence, direct messages, production import events and Projects board refreshes.', connections: ['Redis Channel Layer', 'Angular Clients', 'Realtime Services'] },
          { id: 'workers', label: 'Celery Jobs', icon: 'settings_suggest', role: 'Async Layer', text: 'Celery and Celery Beat process recurring Projects tasks and Document Share preview jobs outside the request cycle so uploads, boards and document views stay responsive.', connections: ['Redis Broker', 'Document Share Preview', 'Projects Recurrence'] },
          { id: 'ops', label: 'System Health', icon: 'monitor_heart', role: 'Observability', text: 'Ops services check DB, Redis, cache, Channels, systemd and logs. The area is intentionally protected and exposes operational feedback without leaking secrets.', connections: ['DB Health Views', 'Service Health Views', 'Journal Service'] },
        ],
        capabilities: {
          eyebrow: 'extended_capabilities.index',
          title: 'Additional capabilities across the platform',
          text: 'The visible interfaces show only part of the platform. Shared services, automations and domain logic intentionally operate in the background.',
          items: [
            { label: 'Platform Core', title: 'Shared Services & Identity', text: 'Navigation, auth, toast and bug reporting run as central libraries. App messages are aggregated globally; the developer zone bundles users, permissions, tools and architecture docs. Registration from login is additionally password-protected, starts pending and requires explicit approval.' },
            { label: 'Document Share', title: 'Storage, Permissions & Search', text: 'Mounted local storage with tags, categories, user-specific category permissions, password protection, favorites, recents and a media-type allowlist. Preview, direct opening, app tour and a regex-like search DSL complete the workflow.' },
            { label: 'Production Planning', title: 'Autonomous Import & Control', text: 'A service scans defined local paths every five minutes and imports XLSX files through keyword and exclusion rules. Reimports are classified as Edge, Update or New; only Edge blocks for review. Live/history views, status flags, position editing, quantity aggregation, preplanning and deadlines drive production.' },
            { label: 'Projects', title: 'Workflows & Collaboration', text: 'Kanban, KPI/priority/workload dashboards and a personal dashboard with a dynamic New column and sorting rules complement recurring tasks, inbox, direct messages and chat. The pool distributes open tasks and receives synced production work; system projects have dedicated permissions.' },
            { label: 'Operations', title: 'Health & Maintenance', text: 'System Health monitors services, database, Redis, workers and logs. A global maintenance mode puts the platform into maintenance centrally and terminates active sessions in a controlled way.' },
            { label: 'Quality Management', title: 'Complaints & Product Analysis', text: 'Complaints maintain manual order histories, media and cross-department reviews including product/issue statistics. Chemistry-specific product analysis covers multi-stage short/long-term tests, reminders, issue detection, radar profiles and multi-product comparison.' },
          ],
        },
        gallery: [
          { title: 'Login', text: 'Central entry point into the platform with shared authentication and session handling.', image: 'assets/images/projects/intranet/screens/intranet-login.webp', alt: 'Intranet login interface', size: 'md' },
          { title: 'Dashboard', text: 'Operational entry point with metrics, status information and the most important work areas.', image: 'assets/images/projects/intranet/screens/intranet-dashboard.webp', alt: 'Intranet dashboard with metrics and status information', size: 'lg' },
          { title: 'App overview', text: 'Available domain applications are exposed centrally according to role and app permissions.', image: 'assets/images/projects/intranet/screens/intranet-app-overview.webp', alt: 'Intranet application overview', size: 'md' },
          { title: 'Control Panel', text: 'Protected administration area for central system and application settings.', image: 'assets/images/projects/intranet/screens/intranet-control-panel.webp', alt: 'Intranet control panel', size: 'lg' },
          { title: 'User permissions', text: 'Fine-grained app and function permissions can be managed and verified per user.', image: 'assets/images/projects/intranet/screens/intranet-user-rights-modal.webp', alt: 'User permission management dialog', size: 'md' },
          { title: 'Production import', text: 'Incoming AU/XLSX data is validated, synchronized and prepared transparently when conflicts occur.', image: 'assets/images/projects/intranet/screens/intranet-import-inbox.webp', alt: 'Production import inbox', size: 'lg' },
          { title: 'Order status', text: 'Production states, partial quantities and processing progress remain visible in their operational context.', image: 'assets/images/projects/intranet/screens/intranet-order-status.webp', alt: 'Production order status view', size: 'md' },
          { title: 'Order history', text: 'State transitions and relevant changes can be traced directly on the order.', image: 'assets/images/projects/intranet/screens/intranet-order-history-modal.webp', alt: 'Production order history dialog', size: 'md' },
          { title: 'Maintenance control', text: 'Maintenance states can be controlled and communicated transparently for affected areas.', image: 'assets/images/projects/intranet/screens/intranet-maintenance-modal.webp', alt: 'Intranet maintenance dialog', size: 'md' },
          { title: 'Database Health', text: 'Database state, locks and technical metrics are prepared as a protected operations view.', image: 'assets/images/projects/intranet/screens/intranet-db-health.webp', alt: 'Intranet database health view', size: 'lg' },
          { title: 'Document Share', text: 'Documents, categories, previews and permission-aware search paths are bundled in one interface.', image: 'assets/images/projects/intranet/screens/document-share.webp', alt: 'Intranet Document Share interface', size: 'lg' },
          { title: 'Projects · Welcome', text: 'Personal entry point into tasks, projects and upcoming work inside the shared workflow.', image: 'assets/images/projects/intranet/screens/projects-welcome.webp', alt: 'Intranet Projects welcome view', size: 'md' },
          { title: 'Projects · Board', text: 'Boards connect tasks, ownership, state and production context in one operational workspace.', image: 'assets/images/projects/intranet/screens/projects-board.webp', alt: 'Intranet Projects board', size: 'lg' },
          { title: 'Projects · Inbox', text: 'New and assigned tasks are collected centrally before moving into the appropriate workflow.', image: 'assets/images/projects/intranet/screens/projects-inbox.webp', alt: 'Intranet Projects inbox', size: 'md' },
        ],
        liveDemo: { status: 'private', text: 'A public demo would only approximate the real operating environment: authentication, permissions, automations, workers, local mounts and internal services are part of the wider system. The case study therefore uses anonymized screenshots and the technical architecture, while production company code and internal data remain protected and private.' },
      },
      {
        slug: 'grafikdesign-katalog',
        name: 'Design Archive',
        titleLines: ['Design', 'Archive'],
        kicker: 'Editorial',
        summary: 'A visual archive of selected work from 2017–2023: editorial layouts, motifs, retouching and design experiments are presented as a curated WebP catalogue and masonry gallery.',
        description: 'The design archive brings together free and applied work from 2017–2023. The focus is image editing, composition, color, typography, layout rhythm and self-built assets. The collection is presented as a performance-friendly WebP catalogue and as a visual masonry gallery with extended archive context.',
        goal: 'The goal is a portfolio-like archive stage that makes development, range and visual handwriting visible: large, calm, image-led and with enough context to understand tools, motifs and design decisions.',
        role: 'Image selection, retouching, color look, compositing, vector work, typography, layout structure, page rhythm and digital staging of the catalogue.',
        year: '2017–2023',
        type: 'Graphic Design / Editorial',
        accent: 'pink',
        techStack: ['Photoshop', 'Lightroom', 'Illustrator', 'Compositing', 'Editorial Design'],
        highlights: ['WebP catalogue pages', 'Catalogue magnifier', 'Masonry gallery', 'Lightbox with image details'],
        requirements: ['Show complete catalogue pages as WebP', 'Display the custom format proportionally', 'Make image details visible', 'Name the tools', 'No technical case study', 'Responsive gallery', 'Keyboard-friendly lightbox', 'Keep assets performance-friendly and easy to swap'],
        detailMode: 'editorial',
        metrics: [
          { value: '2017–23', label: 'Archive works', text: 'Selected archive works from the years 2017 to 2023.' },
          { value: '21×25 cm', label: 'Print origin', text: 'Originally created as a printed booklet in a compact custom format.' },
          { value: 'PS', label: 'Photoshop', text: 'Compositings, retouches, cut-outs and image montages.' },
          { value: 'LR', label: 'Lightroom', text: 'Image look, color series, contrast and consistent moods.' },
          { value: 'AI', label: 'Illustrator', text: 'Vectors, signs, layout graphics and precise shapes.' },
          { value: 'Masonry+', label: 'Gallery', text: 'The masonry gallery expands the catalogue with additional works and detail context.' },
        ],
        telemetry: {
          eyebrow: 'archive_telemetry.exe',
          title: 'Design as a system, not an image folder.',
          subtitle: 'The values describe the relative scope of the documented editorial, archive and interaction areas of the digital catalog.',
          statusLabel: 'Archive', statusValue: 'EDITORIAL / INTERACTIVE', source: 'Source: catalog structure', kpiAriaLabel: 'Graphic design catalog project metrics',
          charts: [
            { id: 'scope', eyebrow: 'design_scope.radial', title: 'Design Surface', description: 'Relative weighting of the central design areas.', variant: 'radial', maxValue: 5, data: [
              { label: 'Editorial', value: 5 }, { label: 'Visual', value: 5 }, { label: 'Archive', value: 4 }, { label: 'Interaction', value: 4 }, { label: 'Type', value: 4 },
            ] },
            { id: 'flow', eyebrow: 'reader_flow.area', title: 'Reader Interaction Flow', description: 'Relative interaction depth from entry to detail view.', variant: 'area', maxValue: 5, data: [
              { label: 'Cover', value: 1 }, { label: 'TOC', value: 2 }, { label: 'Spread', value: 4 }, { label: 'Loupe', value: 5 }, { label: 'Gallery', value: 4 },
            ] },
            { id: 'layers', eyebrow: 'editorial.step', title: 'Editorial Layers', description: 'Digital reader layers from content to interaction.', variant: 'step', maxValue: 5, data: [
              { label: 'Content', value: 2 }, { label: 'Layout', value: 3 }, { label: 'Assets', value: 4 }, { label: 'Reader', value: 5 }, { label: 'Lightbox', value: 4 },
            ] },
          ],
        },
        catalogShowcase: {
          eyebrow: 'digital_catalog.indd',
          title: 'Digital editorial',
          status: 'Static WebP Editorial',
          lead: 'The archive is not presented as a technical demo, but as a curated image sequence: prepared WebP pages, calm viewing and a gallery that brings work from 2017 to 2023 into a portfolio-ready format.',
          ctaLabel: 'View works',
          chips: ['Photoshop', 'Lightroom', 'Illustrator', 'WebP Reader'],
          readerLabel: 'Design archive with prepared WebP catalogue pages',
          readerEyebrow: 'Catalogue Reader',
          readerTitle: 'Selected works',
          readerHint: '',
          tocOpenLabel: 'Open table of contents',
          tocCloseLabel: 'Close table of contents',
          tocTitle: 'Catalogue contents',
          previousLabel: 'Previous spread',
          nextLabel: 'Next spread',
          galleryEyebrow: 'Masonry Gallery',
          galleryTitle: 'Selected works as an image wall',
          lightboxOpenLabel: 'Open image details',
          lightboxCloseLabel: 'Close lightbox',
          lightboxPreviousLabel: 'Previous image',
          lightboxNextLabel: 'Next image',
          tocItems: createDesignCatalogTocItems(),
          spreads: createDesignCatalogSpreads(),
        },
        chapters: [
          { eyebrow: 'Concept', title: 'Individual print catalogue as archive format', text: 'The original catalogue concept was meant to feel creative, informative and deliberately individual. The compact 21×25 cm format, strong black-and-white contrasts, light and dark page rhythms and a broad range of work were chosen to make different design skills visible.', points: ['21×25 cm booklet', 'Black-and-white contrasts', 'Broad skill range'] },
          { eyebrow: 'Tools', title: 'Photoshop, Lightroom and Illustrator at the core', text: 'The works were created through retouching, compositing, color looks, vector shapes, typography and layout decisions. Each tool had a clear role in the visual result and was combined deliberately depending on the motif.', points: ['Photoshop for compositing', 'Lightroom for the look', 'Illustrator for vector work'] },
          { eyebrow: 'Staging', title: 'Browse, zoom, look closer', text: 'The reader shows complete archive pages as WebP files so layout, motif and visual impact remain intact. The masonry images are lazy-loaded, while active reader pages remain directly available. Navigation, hover magnifier and the lightbox keep the collection easy to inspect.', points: ['Proportional WebP reader', 'Lazy-loaded masonry gallery', 'Image details via magnifier'] },
        ],
        gallery: createDesignCatalogGalleryItems('en'),
      },
  ],
};
