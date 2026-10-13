/* src/app/pages/service-detail-page/managed/content/care.en.ts */
import { ManagedServiceContent } from '../managed-service.models';

export const CARE_EN: ManagedServiceContent = {
  back: "All services",
  priceLabel: "Your pricing framework",
  priceNote: "The stated price provides initial guidance. Before commissioning, we agree on scope and clearly specify included work, one-off costs and any recurring costs.",
  availabilityLabel: "Project start",
  availability: "Scheduled together",
  availabilityNote: "We discuss your preferred date and existing setup. The actual start is agreed around scope and capacity.",
  priceFactors: [
    "Scope and desired results",
    "Existing work and required input",
    "Additional functions or ongoing support"
  ],
  offerLabel: "What determines the price?",
  includedTitle: "What you receive",
  processTitle: "How we work together",
  linksTitle: "Useful next steps",
  eyebrow: "Maintenance and support / personally managed",
  headline: "Your project stays maintained. You have a point of contact.",
  introduction: "A published website or application needs attention after launch too. I help with agreed technical checks, issues, small changes and further development, based on your actual requirements.",
  promise: "Tell me what you need. I assess the technical work.",
  promiseText: "You do not need to diagnose issues or plan updates yourself. Describe what you notice or want to change. I assess the request, explain the next step and take care of the agreed work.",
  benefitsTitle: "Support that fits your working day.",
  benefits: [
    {
      title: "A direct point of contact",
      text: "You know who to approach with technical questions and changes. Requests are assessed in the context of the supported project."
    },
    {
      title: "Address small issues early",
      text: "Agreed checks and targeted maintenance make technical needs visible, helping necessary changes to be tackled in an organised way."
    },
    {
      title: "Make understandable changes",
      text: "Text, layout details, bug fixes and small improvements can be handled within the agreed scope. Larger extensions are discussed beforehand."
    },
    {
      title: "Keep scope and costs visible",
      text: "Support is clearly defined. Additional work is assessed and agreed rather than becoming part of an unexplained open-ended cost list."
    }
  ],
  scopeTitle: "How I can support your project",
  offerText: "Choose Basic Care at €15, Content Care at €39 or Priority Care at €79 per month. The plans differ by type and frequency of tasks. System condition, larger extensions and special operational requirements are assessed separately.",
  steps: [
    {
      title: "Review the existing setup",
      text: "We discuss the project, available access, known issues and desired support."
    },
    {
      title: "Agree on support",
      text: "Tasks, responsibilities and costs are clearly stated. Special response-time requirements are clarified beforehand."
    },
    {
      title: "Handle requests",
      text: "I assess reported issues or changes and carry out the agreed work transparently."
    },
    {
      title: "Review evolving requirements",
      text: "As the project or your needs change, we adjust support together."
    }
  ],
  faqTitle: "Questions about maintenance and support",
  faqs: [
    {
      title: "Do I need technical knowledge?",
      text: "No. Explain the request in your own words. I assess the technical situation and explain useful next steps."
    },
    {
      title: "Which support plans are available and what is included?",
      text: "Basic Care: €15 per month for small text/image changes and a short monthly technical check. Content Care: €39 per month for regular content updates, small layout changes and important SEO snippets. Priority Care: €79 per month for prioritised changes, monitoring checks and short technical advice. Specific scope is agreed for your project."
    },
    {
      title: "Can you support projects built by other developers?",
      text: "This can be possible after reviewing the system and available access. Technical condition and documentation determine whether taking over is useful and feasible."
    },
    {
      title: "How quickly are requests handled?",
      text: "Priority and desired response times are agreed around the proposal. Round-the-clock availability is not automatically part of support."
    },
    {
      title: "Are new features part of maintenance?",
      text: "Small improvements can be agreed. Larger new features or additional pages are assessed and offered separately as extensions."
    },
    {
      title: "Is managed hosting included?",
      text: "Maintenance and hosting are different services and can be combined. The proposal makes clear which tasks concern application care and which concern technical operations."
    }
  ],
  nextTitle: "What should become easier for your project?",
  nextText: "Describe the current setup and the support you are looking for. Together we can find a manageable scope.",
  links: [
    {
      route: "/kontakt",
      title: "Discuss your project",
      text: "Clarify goals, pricing and timing"
    },
    {
      route: "/referenzen",
      title: "Explore the work",
      text: "See actual projects and results"
    },
    {
      route: "/leistungen/managed-hosting",
      title: "Related service",
      text: "Plan implementation and ongoing support"
    }
  ],
  hooks: [
    {
      title: "Suitable support rather than an oversized package.",
      text: "Basic, Content or Priority Care: we review the tasks that actually recur and select a suitable scope."
    },
    {
      title: "A small issue or a specific change?",
      text: "Describe the request. I review the existing setup and explain which work belongs to agreed support and which is additional."
    }
  ],
  carePlanTitle: "Compare three support options",
  carePlanNote: "Basic Care suits occasional small changes, Content Care suits regularly maintained content, and Priority Care suits more frequent tasks with prioritised handling. We agree on suitable scope, specific tasks and response times before commissioning."
}; // Eigene Kundeninformationen und FAQ-Einträge dieser Leistung.
