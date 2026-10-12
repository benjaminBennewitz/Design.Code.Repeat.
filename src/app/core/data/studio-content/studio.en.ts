/* src/app/core/data/studio-content/studio.en.ts */
import type { StudioContent } from '../../models/studio.models';
import { DE_STUDIO_CONTENT } from './studio.de';

/**
 * Englische Inhalte für Studio-Profil.
 */
export const EN_STUDIO_CONTENT: Pick<StudioContent, 'studioPage'> = {
  studioPage: {
    identity: {
      name: 'Benjamin Bennewitz',
      role: 'Development, design & operations',
      location: 'Mönchengladbach · Germany',
      portraitAlt: 'Ben holding a coffee cup',
      facets: [
        { icon: 'data_object', title: 'Full stack', text: 'Interfaces, data and applications' },
        { icon: 'design_services', title: 'Design', text: 'Visual systems and clear interaction' },
        { icon: 'dns', title: 'Operations', text: 'From deployment to ongoing development' },
      ],
    },
    collaboration: {
      heading: {
        eyebrow: 'Working together',
        title: 'Talk to the person who builds it.',
        text: 'Behind Design. Code. Repeat. is me: Ben. Design, technical decisions and implementation connect directly in my work. For you, that means short paths and one point of contact who sees the whole project.',
      },
      items: [
        {
          icon: 'forum',
          title: 'Direct communication',
          text: 'We start with your goal, the people behind the project and the workflows it should support. Even without a finished concept, that gives us a direction to explore together.',
        },
        {
          icon: 'account_tree',
          title: 'Decisions you can understand',
          text: 'I explain the solution I suggest and why. Scope, technical dependencies and trade-offs should stay understandable so you can make informed decisions.',
        },
        {
          icon: 'handshake',
          title: 'Looking beyond launch',
          text: 'A website or application will be maintained and used over time. That is why I consider future changes, operations and development from the start. We agree on the level of support that fits your project.',
        },
      ],
    },
    location: {
      heading: {
        eyebrow: 'Location & collaboration',
        title: 'At home in the Rhineland. Connected wherever you are.',
        text: 'My base is Mönchengladbach. Düsseldorf, Cologne and Bonn are close by, but collaboration is not tied to one region. I also work on websites, applications and design projects across Germany through digital communication.',
      },
      regions: [
        { code: 'MG', name: 'Mönchengladbach' },
        { code: 'D', name: 'Düsseldorf' },
        { code: 'K', name: 'Cologne' },
        { code: 'BN', name: 'Bonn' },
      ],
      note: 'For me, closeness is mostly about how we work together. The practice website in Weinheim is one example outside the Rhineland: clear agreements and a shared understanding of the project matter most.',
      cta: 'Explore client projects',
    },
    seo: {
      title: 'Studio | Design. Code. Repeat.',
      description:
        'Design. Code. Repeat. combines full-stack web development, UI/UX, design and technical operations in a personal studio structure.',
      keywords: ['web studio', 'full stack developer', 'graphic design', 'Angular Django'],
    },
    heading: {
      eyebrow: 'about.studio',
      title: 'Design & code. With Ben.',
      text: 'Design. Code. Repeat. combines web development, custom software, design and technical support in a direct studio structure. B² is the developer signature behind it.',
    },
    intro: [
      'I do not stop at the polished screen. Structure, frontend, backend, data, deployment and maintainability are treated as one connected product.',
      'Collaboration stays direct: requirements are translated into understandable decisions, technical trade-offs stay visible and unnecessary complexity is avoided.',
    ],
    vita: {
      eyebrow: 'vita.log // ben',
      title: 'Development and design for more than 10 years.',
      text: 'I am Ben, a state-certified media IT specialist in multimedia and a certified Full Stack Web Developer. My focus is where design and technology meet: from UI/UX and visual systems to full-stack applications, data logic and production operations.',
      facts: ['Media IT · Multimedia', 'Web Developer · Full Stack', 'Design · UI/UX · Software'],
    },
    principlesHeading: {
      eyebrow: 'principles.cfg',
      title: 'How project decisions are made.',
      text: 'Not every technically interesting option is automatically the right product decision.',
    },
    principles: [
      { title: 'Problem before stack', text: 'Technology follows requirements, not the other way around.' },
      { title: 'Maintainable before clever', text: 'Clear architecture and readable code beat unnecessary magic.' },
      { title: 'Accessible from day one', text: 'A11Y, contrast and keyboard support are not added at the end.' },
      {
        title: 'Think about operations',
        text: 'Deployment, backups, monitoring and updates are part of a product’s real lifetime.',
      },
    ],
    stackHeading: {
      eyebrow: 'stack.current',
      title: 'Technology used productively.',
      text: 'A focus on proven web technologies instead of an unnecessarily large toolchain.',
    },
    stack: DE_STUDIO_CONTENT.studioPage.stack,
  },
};
