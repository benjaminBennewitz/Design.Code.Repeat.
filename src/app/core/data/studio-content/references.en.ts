/* src/app/core/data/studio-content/references.en.ts */
import type { StudioContent } from '../../models/studio.models';
import { DE_REFERENCES_CONTENT } from './references.de';

/**
 * Englische Inhalte für technische Referenzen.
 */
export const EN_REFERENCES_CONTENT: Pick<StudioContent, 'references'> = {
  references: [
    {
      ...DE_REFERENCES_CONTENT.references[0],
      type: 'Modular Business Platform',
      summary:
        'Modular intranet with project management, automated order handling, Document Share, admin panel, quality management, complaint management and more on one shared permission and data core.',
      details: [
        'Central auth, permissions and data core',
        'Multiple business apps inside one connected system',
        'Private case study with screenshots instead of a live demo',
      ],
      linkHint: 'No public live demo: the dedicated DCR page shows structured screenshots and the system logic.',
      ctaLabel: 'View screenshots',
    },
    {
      ...DE_REFERENCES_CONTENT.references[1],
      type: 'Project Management',
      summary:
        'Project management app with Kanban, tasks, comments, attachments and live collaboration, plus a playful Tamagotchi-like layer built around the interactive mascot Carly.',
      details: [
        'Board, inbox, pool and team views',
        'Live sync, comments and attachments directly on each task',
        'Carly as an optional mascot-UX and gamification layer',
      ],
      linkHint: 'The controlled public demo shows Carly Managed with prepared projects and safe test data.',
      ctaLabel: 'Open live demo',
    },
    {
      ...DE_REFERENCES_CONTENT.references[2],
      type: 'Interactive Simulation',
      summary:
        'Interactive ecosystem simulation that turns personal choices into delayed, visible consequences and makes complex relationships tangible through play.',
      details: [
        'Three reactive ecosystems',
        'Delayed consequences instead of instant effects',
        'Fully client-side simulation in the browser',
      ],
      linkHint: 'The case study is prepared but has not yet been released publicly.',
    },
    {
      ...DE_REFERENCES_CONTENT.references[3],
      type: 'Local OCR / Health Data Workflow',
      summary:
        'Local lab-value assistance workflow for synthetic test data: PDF text layers or OCR, reviewable values, approval and a patient report – backed by a hardened upload and document-processing path.',
      details: [
        'Local PDF/OCR processing with Poppler and Tesseract',
        'Private upload quarantine with signature/MIME validation and local ClamAV scanning',
        'Session/CSRF isolation, separate parser process, review approval and controlled patient reporting',
      ],
      linkHint:
        'The public demo runs in isolation with synthetic test data only; real health data and external analysis APIs are excluded.',
      ctaLabel: 'Open live demo',
    },
    {
      ...DE_REFERENCES_CONTENT.references[4],
      type: 'Graphic Design / Editorial',
      summary:
        'Interactive design catalogue presenting editorial work, retouching, compositing and experimental visual pieces from several years.',
      details: [
        'Interactive reader instead of a static PDF preview',
        'Editorial, retouching and compositing across several years',
        'Curated archive with a real WebP gallery',
      ],
    },
  ],
};
