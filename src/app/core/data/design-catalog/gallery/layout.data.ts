/* src/app/core/data/design-catalog/gallery/layout.data.ts */
import type { DesignCatalogGallerySeed } from '../catalog-seed.models';

/**
 * Galeriearbeiten: Layout und Typografie.
 */
export const LAYOUT_GALLERY_ITEMS: readonly DesignCatalogGallerySeed[] = [
  {
    file: '14',
    size: 'md',
    icon: 'local_fire_department',
    tools: ['Photoshop'],
    year: '2021',
    de: {
      title: 'Font Work',
      text: 'Weitere Font-Arbeit mit vielen Layern, Assets und cineastischem Aufbau.',
      detail:
        'Weitere Font-Arbeit mit vielen Ebenen, Composing-Schritten und zahlreichen Einzelassets. In Aufbau und Arbeitsweise ist das Motiv eng mit Hot Water verwandt: viele Texturen, Blend-Modi, Masking und Lichtabstimmungen greifen ineinander.',
      alt: 'Dunkle Font-Arbeit mit Feuer und Rauch',
    },
    en: {
      title: 'Font Work',
      text: 'Another type-based composition with many layers, assets and a cinematic build-up.',
      detail:
        'Another type-based piece with many layers, compositing steps and numerous individual assets. In structure and workflow, the motif is closely related to Hot Water: textures, blend modes, masking and light adjustments all work together.',
      alt: 'Dark type composition with fire and smoke',
    },
  },
  {
    file: '15',
    size: 'md',
    icon: 'description',
    tools: ['Photoshop', 'Processing'],
    year: '2022',
    de: {
      title: 'Info Sheet Mockup',
      text: 'Fiktives Infosheet mit Perlin-Hairs-Assets zwischen Print- und generativer Gestaltung.',
      detail:
        'Einsatz der Perlin-Hairs-Assets für ein ausgedachtes Projekt. Das fiktive Infosheet zeigt die Integration klassischer Medien wie Print und Digital Design mit neueren Medien wie Processing und generativer Gestaltung.',
      alt: 'Schwebendes Infosheet-Mockup auf blauem Hintergrund',
    },
    en: {
      title: 'Info Sheet Mockup',
      text: 'Fictional info sheet using Perlin Hairs assets between print and generative design.',
      detail:
        'Use of the Perlin Hairs assets for an invented project. The fictional info sheet demonstrates how classic media such as print and digital design can be integrated with newer media such as Processing and generative design.',
      alt: 'Floating info sheet mockup on a blue background',
    },
  },
  {
    file: '16',
    size: 'md',
    icon: 'local_activity',
    tools: ['Photoshop', 'Illustrator'],
    year: '2014',
    de: {
      title: 'Partyflyer 2014',
      text: 'Leuchtendes Eventlayout mit Neonfarben, klarer Blickführung und starkem Zentrum.',
      detail:
        'Reines Photoshop-Layout und einer meiner ersten grafischen Versuche. Damals arbeitete ich ausschließlich mit Photoshop; Illustrator und InDesign habe ich erst später gelernt. Den Flyer habe ich für einen sehr guten Freund und DJ entworfen. Gedruckt wurde er in einer Auflage von 500 Stück.',
      alt: 'Buntes Eventposter auf dunklem Hintergrund',
    },
    en: {
      title: 'Party flyer 2014',
      text: 'Bright event layout with neon colors, clear eye guidance and a strong center.',
      detail:
        'A pure Photoshop layout and one of my first graphic design attempts. At the time I worked exclusively in Photoshop; I only learned Illustrator and InDesign later. I designed the flyer for a very good friend and DJ. It was printed in an edition of 500 copies.',
      alt: 'Colorful event poster on dark background',
    },
  },
  {
    file: '17',
    size: 'lg',
    icon: 'view_carousel',
    tools: ['Photoshop', 'Illustrator'],
    year: '2021',
    de: {
      title: 'App Design',
      text: 'Ein erster Versuch eines einfachen App-Designs.',
      detail:
        'Mockup einer App-Idee, die Papierstücke digitalisieren und verwaltbar machen sollte. Rundschreiben, Infos und sonstige Inhalte sollten so schneller an die Mitarbeitenden gelangen; über Lesebestätigungen sollte zusätzlich Verbindlichkeit und Kontrolle entstehen. Das Mockup zeigt vier beispielhafte Screens.',
      alt: 'Aufgefächertes App-Mockup mit mehreren Screens',
    },
    en: {
      title: 'App design',
      text: 'A first attempt at a simple app design.',
      detail:
        'Mockup of an app idea intended to digitize and manage paper-based notes. Circulars, information and other content were meant to reach employees faster, while read confirmations were supposed to add commitment and control. The mockup shows four example screens.',
      alt: 'Fanned app mockup with multiple screens',
    },
  },
  {
    file: '18',
    size: 'md',
    icon: 'text_fields',
    tools: ['Illustrator'],
    year: '2023',
    de: {
      title: 'UX (3D)',
      text: 'Typografisches 3D-Experiment, komplett als 2D-Vektorarbeit aufgebaut.',
      detail:
        'Der Schriftzug entstand ohne 3D-Tools: reine 2D-Flächen wurden verschoben, skaliert und über akkurate Bildwiederholungen so gesetzt, dass Tiefe, Kanten und ein räumlicher UX-Schriftzug entstehen.',
      alt: 'UX-Schriftzug mit dreidimensionalem Linienraster',
    },
    en: {
      title: 'UX (3D)',
      text: 'Typographic 3D experiment built entirely as 2D vector work.',
      detail:
        'The lettering was created without 3D tools: pure 2D shapes were moved, scaled and repeated with precision until depth, edges and a spatial UX wordmark emerged.',
      alt: 'UX lettering with three-dimensional line grid',
    },
  },
];
