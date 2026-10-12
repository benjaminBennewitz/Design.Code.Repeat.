/* src/app/core/data/design-catalog/gallery/photography.data.ts */
import type { DesignCatalogGallerySeed } from '../catalog-seed.models';

/**
 * Galeriearbeiten: Fotografie.
 */
export const PHOTOGRAPHY_GALLERY_ITEMS: readonly DesignCatalogGallerySeed[] = [
  {
    file: '09',
    size: 'md',
    icon: 'apartment',
    tools: ['Lightroom'],
    year: '2019',
    de: {
      title: 'Brutalist Gold',
      text: 'Reine Fotoarbeit eines Kranturms am Rhein mit harter, goldener Lichtwirkung.',
      detail:
        'Reine Fotoarbeit mit der Nikon D5000 und Bearbeitung ausschließlich in Lightroom. Das Bild zeigt einen Kranturm am Rhein und sollte bewusst Dekadenz und Brutalität widerspiegeln. Zum Look wurden zusätzlich fotografische Filterwirkungen genutzt.',
      alt: 'Warm getöntes Architekturfoto eines Kranturms am Rhein',
    },
    en: {
      title: 'Brutalist Gold',
      text: 'Pure photo work of a crane tower on the Rhine with a harsh golden light mood.',
      detail:
        'Pure photography with the Nikon D5000 and editing only in Lightroom. The image shows a crane tower on the Rhine and was meant to reflect decadence and brutality. Photographic filter effects were also used for the final look.',
      alt: 'Warm tinted architectural photo of a crane tower on the Rhine',
    },
  },
  {
    file: '10',
    size: 'lg',
    icon: 'apartment',
    tools: ['Lightroom'],
    year: '2019',
    de: {
      title: 'Facade Rhythm',
      text: 'Variation des Brutalismus mit Fokus auf Spiegelung, Wiederholung und Struktur.',
      detail:
        'Eine fotografische Variation des Brutalismus. Der Fokus lag auf Spiegelung, Wiederholung und einer strengen Rasterwirkung über das gesamte Bild hinweg. Fotoarbeit mit Nikon D5000 und Lightroom.',
      alt: 'Schwarzweißfoto einer modernen Fassade mit Spiegelung',
    },
    en: {
      title: 'Facade Rhythm',
      text: 'A brutalist variation focused on reflection, repetition and structure.',
      detail:
        'A photographic variation on brutalism. The focus was on reflection, repetition and a strict grid-like rhythm throughout the image. Photo work with the Nikon D5000 and Lightroom.',
      alt: 'Black-and-white photo of a modern facade with reflection',
    },
  },
  {
    file: '11',
    size: 'md',
    icon: 'pets',
    tools: ['Lightroom'],
    year: '2021',
    de: {
      title: 'Anführer',
      text: 'Schnappschuss meiner treuen Hündin mit ruhiger, fast heroischer Ausstrahlung.',
      detail:
        'Im Urlaub gelang mir dieser Schnappschuss meiner treuen Hündin. Die Fotoarbeit entstand mit der Nikon D5000 und einem Standardobjektiv; die Nachbearbeitung erfolgte in Lightroom.',
      alt: 'Hund im Wald mit natürlichem Licht',
    },
    en: {
      title: 'Leader',
      text: 'Snapshot of my loyal dog with a calm, almost heroic presence.',
      detail:
        'I captured this snapshot of my loyal dog while on vacation. The photo was taken with the Nikon D5000 and a standard lens, with post-processing done in Lightroom.',
      alt: 'Dog in a forest with natural light',
    },
  },
  {
    file: '12',
    size: 'md',
    icon: 'water',
    tools: ['Lightroom'],
    year: '2019',
    de: {
      title: 'Spiegel',
      text: 'Landschaftsaufnahme mit Spiegelung, Kontrastverdichtung und ruhiger Fernwirkung.',
      detail:
        'Fotoarbeit mit der Nikon D5000 und einem Teleobjektiv im Bereich von etwa 70 bis 105 mm. Das Original war leicht nebelig und ungesättigt; in der Nachbearbeitung wurden vor allem Kontrast und Lichtintensität verstärkt. Zusätzlich kamen analoge Fotofilter zum Einsatz.',
      alt: 'Ruhiger See mit Baumspiegelung',
    },
    en: {
      title: 'Mirror',
      text: 'Landscape photograph with reflection, deeper contrast and a calm distant mood.',
      detail:
        'Photo work with the Nikon D5000 and a tele lens in the range of roughly 70 to 105 mm. The original shot was slightly foggy and desaturated; post-processing mainly focused on contrast and light intensity. Analog photo filters were also used.',
      alt: 'Quiet lake with tree reflection',
    },
  },
  {
    file: '13',
    size: 'md',
    icon: 'texture',
    tools: ['Lightroom'],
    year: '2021',
    de: {
      title: 'Bist du Moos?',
      text: 'Fotoarbeit fasziniert von Detailtiefe, Struktur und kräftigen Naturfarben.',
      detail:
        'Fasziniert von der Detailtiefe und den Farben entstand diese Fotoarbeit. Die Nachbearbeitung blieb auf ein Minimum beschränkt und erfolgte nur in Lightroom – ohne Photoshop und ohne Makroobjektiv.',
      alt: 'Detailreiche Naturstruktur in Orange- und Grüntönen',
    },
    en: {
      title: 'Are You Moss?',
      text: 'Photo work driven by fascination for detail depth, texture and vivid natural colors.',
      detail:
        'This photo work grew out of a fascination with its detail depth and colors. Post-processing was kept minimal and done only in Lightroom — without Photoshop and without a macro lens.',
      alt: 'Detailed natural texture in orange and green tones',
    },
  },
];
