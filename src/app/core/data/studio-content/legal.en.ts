/* src/app/core/data/studio-content/legal.en.ts */
import type { StudioContent } from '../../models/studio.models';

/**
 * Englische Inhalte für rechtliche Seiten.
 */
export const EN_LEGAL_CONTENT: Pick<StudioContent, 'legal'> = {
  legal: {
    noticeSeo: {
      title: 'Legal Notice | Design. Code. Repeat.',
      description: 'Legal notice for Design. Code. Repeat.',
      keywords: ['legal notice'],
    },
    privacySeo: {
      title: 'Privacy | Design. Code. Repeat.',
      description: 'Privacy information for the Design. Code. Repeat. website and contact form.',
      keywords: ['privacy'],
    },
    noticeTitle: 'Legal Notice',
    noticeSections: [
      {
        title: 'Information according to § 5 DDG',
        lines: [
          'Design. Code. Repeat.',
          'Benjamin Bennewitz',
          'c/o',
          'Linzer Straße 45',
          '53604 Bad Honnef',
          'Germany',
        ],
      },
      {
        title: 'Contact',
        lines: [
          'Email: kontakt@design-code-repeat.de',
          'Phone: +49 162 9038166',
          'Additional fast contact option: contact form in the contact section',
        ],
      },
      {
        title: 'Liability for content and links',
        lines: [
          'The content of this website is prepared with care. No liability is assumed for external links; their respective operators are solely responsible for their content.',
        ],
      },
    ],
    privacyTitle: 'Privacy',
    privacySections: [
      {
        title: 'Controller',
        paragraphs: [
          'The controller responsible for processing personal data is Benjamin Bennewitz, Design. Code. Repeat., c/o Linzer Straße 45, 53604 Bad Honnef, Germany. Contact: kontakt@design-code-repeat.de, phone: +49 162 9038166.',
        ],
      },
      {
        title: 'Principles and legal bases',
        paragraphs: [
          'No analytics, marketing or tracking profiles are created. Personal data is processed only where necessary for the technical operation and security of the website or to handle contact initiated by you.',
          'Inquiries relating to potential or existing services are processed under Art. 6(1)(b) GDPR for pre-contractual measures or contractual communication. Processing required for secure and stable technical operation is based on Art. 6(1)(f) GDPR and the legitimate interest in operating a secure and functional website and infrastructure.',
        ],
      },
      {
        title: 'Contact form and Infrastructure API',
        paragraphs: [
          'When you use the contact form, your name, email address, optional company/organization, selected topic and message are processed to handle your inquiry. Company and topic are used to classify the inquiry and are integrated into the message before transmission. Only name, email address, message and the technical honeypot field are sent to the central same-origin Infrastructure API.',
          'Before submission, /api/csrf/ establishes the technically necessary CSRF protection. The server sets a Secure, HttpOnly and SameSite=Lax cookie and returns a CSRF token for the following request. The API also uses server-side validation, honeypot protection and rate limiting. These mechanisms are used exclusively for security and abuse prevention.',
          'Successful inquiries are delivered through the self-managed server and mail infrastructure to kontakt@design-code-repeat.de. The information is not used for advertising, newsletters or profiling.',
        ],
      },
      {
        title: 'Direct contact by email',
        paragraphs: [
          'If you contact me directly by email, the sender address, message content and technically required mail metadata are processed to the extent necessary to handle and answer your inquiry. Sensitive documents should not be sent unencrypted in the initial contact.',
        ],
      },
      {
        title: 'Local storage and necessary cookies',
        paragraphs: [
          'The website may store your privacy/cookie settings locally in your browser. This information remains on your device and is not used for tracking.',
          'The contact form uses a technically necessary CSRF cookie. It is used exclusively to protect against cross-site request forgery and cannot be read by JavaScript because it is HttpOnly.',
        ],
      },
      {
        title: 'Hosting and server operation',
        paragraphs: [
          'The website and the server-side Infrastructure API are operated on rented server infrastructure provided by netcup GmbH, Emmy-Noether-Straße 10, 76131 Karlsruhe, Germany. Technically necessary connection data may be processed in this context. The server, web application and mail services are administered independently within this infrastructure.',
        ],
      },
      {
        title: 'Server logs',
        paragraphs: [
          'When the website is accessed, technically necessary server log data may be processed, such as IP address, request time, requested URL, user agent and technical status information. This data is used only for secure and stable operation, abuse prevention and error analysis. Form content and email addresses are not written to the technical API logs.',
        ],
      },
      {
        title: 'External services and recipients',
        paragraphs: [
          'Material Symbols, Inter and JetBrains Mono are served locally. The website does not embed external tracking scripts or social-media widgets.',
          'Personal data is disclosed only to technical recipients where necessary for operation, communication or legal obligations. Personal data is not shared for advertising purposes or sold.',
        ],
      },
      {
        title: 'Storage period',
        paragraphs: [
          'Personal data from contact inquiries is retained only for as long as necessary to process the inquiry, continue the resulting communication and comply with any applicable statutory retention obligations. Technical log data is retained only for the periods required for operation, security and error analysis.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: [
          'Subject to the applicable legal requirements, you have rights including access, rectification, erasure, restriction of processing, data portability and objection. Consent that has been given can be withdrawn with effect for the future.',
          'You also have the right to lodge a complaint with a competent data protection supervisory authority. Privacy-related requests can be sent to kontakt@design-code-repeat.de.',
        ],
      },
      { title: 'Last updated', paragraphs: ['Last updated: 1 September 2026.'] },
    ],
  },
};
