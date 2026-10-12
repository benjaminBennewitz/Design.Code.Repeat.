/* src/app/core/data/design-catalog/gallery/generative.data.ts */
import type { DesignCatalogGallerySeed } from '../catalog-seed.models';

/**
 * Galeriearbeiten: generative Gestaltung.
 */
export const GENERATIVE_GALLERY_ITEMS: readonly DesignCatalogGallerySeed[] = [
  {
    file: '19',
    size: 'sm',
    icon: 'waves',
    tools: ['Processing'],
    year: '2018',
    de: {
      title: 'Perlin Hairs',
      text: 'Generative Haarstruktur aus Perlin-Noise-gesteuerter Linienbewegung.',
      detail:
        'Generative Gestaltung in Processing: Punkte beziehungsweise Linien werden durch ein Perlin-Noise-Feld geführt, wodurch organische Richtungswechsel entstehen. Über Dichte, Schrittweite und Kurvenverhalten formt sich eine haarartige Struktur, die kontrolliert wirkt, aber nie komplett statisch ist.',
      alt: 'Schwarze generative Haarlinien auf dunklem Grund',
    },
    en: {
      title: 'Perlin Hairs',
      text: 'Generative hair structure driven by Perlin-noise line movement.',
      detail:
        'Generative design in Processing: points or lines are guided through a Perlin noise field, creating organic changes in direction. Density, step size and curve behavior form a hair-like structure that feels controlled without becoming completely static.',
      alt: 'Black generative hair lines on dark background',
    },
  },
  {
    file: '20',
    size: 'sm',
    icon: 'all_inclusive',
    tools: ['Processing'],
    year: '2017',
    de: {
      title: 'Perlins Moth',
      text: 'Generatives Mottenmotiv aus kontrollierten Processing-Parametern.',
      detail:
        'Processing wurde so gesteuert, dass aus abstrakten Linien ein mottenähnliches Motiv entstand. Der Fokus lag auf dem Anpassen der Parameter, bis aus rein generativer Bewegung ein erkennbares Bild wurde.',
      alt: 'Generative Linienform wie eine Motte',
    },
    en: {
      title: 'Perlins Moth',
      text: 'Generative moth motif built from controlled Processing parameters.',
      detail:
        'Processing was controlled in a way that turned abstract lines into a moth-like motif. The focus was on adjusting parameters until purely generative movement became a recognizable image.',
      alt: 'Generative line form resembling a moth',
    },
  },
  {
    file: '21',
    size: 'lg',
    icon: 'texture',
    tools: ['Processing', 'Photoshop'],
    year: '2017',
    de: {
      title: 'Purple Flow Field',
      text: 'Anaglyphes Designexperiment mit generativer Tiefe und Rahmenwirkung.',
      detail:
        'Ein anaglyphes Designexperiment: Die 3D-Wirkung wird durch die räumliche Tiefe der Linien verstärkt und durch den weißen Kasten um eine zusätzliche Ebene erweitert. Einige Linien verdecken den Rahmen bewusst und brechen dadurch die klare Bildfläche auf.',
      alt: 'Violettes generatives Flow-Field mit Rahmen',
    },
    en: {
      title: 'Purple Flow Field',
      text: 'Anaglyph design experiment with generative depth and frame effect.',
      detail:
        'An anaglyph design experiment: the 3D effect is intensified by the spatial depth of the lines and extended by the white box as an additional layer. Some lines deliberately cover the frame and break up the clean image surface.',
      alt: 'Violet generative flow field with frame',
    },
  },
  {
    file: '22',
    size: 'md',
    icon: 'waves',
    tools: ['Processing', 'Photoshop'],
    year: '2017',
    de: {
      title: 'Dancing Spirits',
      text: 'Generatives Linienbild, in dem später geisterartige Figuren sichtbar wurden.',
      detail:
        'Zu Beginn wurden verschiedene Versionen erzeugt, bis diese Komposition ausgewählt wurde. Erst später fielen mir in der Linienstruktur mehrere Kreaturen auf, die wie Geister wirken. Farbe und Kontrast wurden anschließend darüber gelegt, um diese Figuren stärker herauszuarbeiten.',
      alt: 'Orange-blaue generative Linienstruktur mit geisterhaften Formen',
    },
    en: {
      title: 'Dancing Spirits',
      text: 'Generative line image in which ghost-like figures became visible later.',
      detail:
        'At first, several versions were generated until this composition was selected. Only later did I notice creatures inside the line structure that looked like spirits. Color and contrast were then added to make those figures stand out more clearly.',
      alt: 'Orange-blue generative line structure with ghost-like forms',
    },
  },
  {
    file: '23',
    size: 'sm',
    icon: 'all_inclusive',
    tools: ['Processing'],
    year: '2017',
    de: {
      title: 'Small Moth',
      text: 'Reduzierte Processing-Variation mit mottenähnlicher Silhouette.',
      detail:
        'Eine Variation des Programms erzeugte dieses reduzierte Motiv. Auch hier wurde Processing so gesteuert, dass aus abstrakten Linien eine mottenähnliche Form entstand. Der Fokus lag auf Parametern, Dichte und Symmetrie, bis ein erkennbares Bild sichtbar wurde.',
      alt: 'Symmetrische schwarze Linienform wie eine kleine Motte',
    },
    en: {
      title: 'Small Moth',
      text: 'Reduced Processing variation with a moth-like silhouette.',
      detail:
        'A variation of the program created this reduced motif. Here too, Processing was controlled until abstract lines formed a moth-like shape. The focus was on parameters, density and symmetry until a recognizable image appeared.',
      alt: 'Symmetrical black line form resembling a small moth',
    },
  },
  {
    file: '24',
    size: 'sm',
    icon: 'all_inclusive',
    tools: ['Processing'],
    year: '2017',
    de: {
      title: 'Bakteria',
      text: 'Organische Processing-Variation zwischen Kreis, Zelle und Bewegung.',
      detail:
        'Eine weitere Variation des Programms erzeugte dieses bakterienartige Motiv. Aus wiederholten Linien, kleinen Richtungswechseln und kontrollierter Überlagerung entstand eine Form, die zwischen Mikroorganismus, Kreisbewegung und generativer Konstruktion liegt.',
      alt: 'Schwarze generative Kreislinien als bakterienartige Form',
    },
    en: {
      title: 'Bacteria',
      text: 'Organic Processing variation between circle, cell and movement.',
      detail:
        'Another variation of the program created this bacteria-like motif. Repeated lines, small changes in direction and controlled overlap formed a shape between microorganism, circular movement and generative construction.',
      alt: 'Black generative circular lines as bacteria-like form',
    },
  },
  {
    file: '25',
    size: 'md',
    icon: 'grain',
    tools: ['Processing'],
    year: '2017',
    de: {
      title: 'Perlin Not Merlin',
      text: 'Der erste Versuch generativer Gestaltung mit dichtem Perlin-Noise-Geflecht.',
      detail:
        'Das war mein erster Versuch im Bereich generative Gestaltung. Das Motiv wurde später immer wieder genutzt, um Flyer, Kataloge und Visitenkarten mit einer organischen, technischen Struktur zu verzieren.',
      alt: 'Dichte schwarzweiße generative Perlin-Struktur',
    },
    en: {
      title: 'Perlin Not Merlin',
      text: 'The first attempt at generative design with a dense Perlin-noise mesh.',
      detail:
        'This was my first attempt at generative design. I later reused the motif to decorate flyers, catalogues and business cards with an organic, technical structure.',
      alt: 'Dense black-and-white generative Perlin structure',
    },
  },
];
