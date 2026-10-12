/* src/app/core/data/reference-projects/intranet/gallery.en.ts */
import type { PortfolioProject } from '../../../models/reference-project.models';

/**
 * Englische Intranet-Inhalte für Screenshots und Bildbeschreibungen.
 */
export const INTRANET_GALLERY_EN: Pick<PortfolioProject, 'gallery'> = {
  gallery: [
    {
      title: 'Login',
      text: 'Central entry point into the platform with shared authentication and session handling.',
      image: 'assets/images/projects/intranet/intranet-login.webp',
      alt: 'Intranet login interface',
      size: 'md',
    },
    {
      title: 'Dashboard',
      text: 'Operational entry point with metrics, status information and the most important work areas.',
      image: 'assets/images/projects/intranet/intranet-dashboard.webp',
      alt: 'Intranet dashboard with metrics and status information',
      size: 'lg',
    },
    {
      title: 'App overview',
      text: 'Available domain applications are exposed centrally according to role and app permissions.',
      image: 'assets/images/projects/intranet/intranet-app-overview.webp',
      alt: 'Intranet application overview',
      size: 'md',
    },
    {
      title: 'Control Panel',
      text: 'Protected administration area for central system and application settings.',
      image: 'assets/images/projects/intranet/intranet-control-panel.webp',
      alt: 'Intranet control panel',
      size: 'lg',
    },
    {
      title: 'User permissions',
      text: 'Fine-grained app and function permissions can be managed and verified per user.',
      image: 'assets/images/projects/intranet/intranet-user-rights-modal.webp',
      alt: 'User permission management dialog',
      size: 'md',
    },
    {
      title: 'Production import',
      text: 'Incoming AU/XLSX data is validated, synchronized and prepared transparently when conflicts occur.',
      image: 'assets/images/projects/intranet/intranet-import-inbox.webp',
      alt: 'Production import inbox',
      size: 'lg',
    },
    {
      title: 'Order status',
      text: 'Production states, partial quantities and processing progress remain visible in their operational context.',
      image: 'assets/images/projects/intranet/intranet-order-status.webp',
      alt: 'Production order status view',
      size: 'md',
    },
    {
      title: 'Order history',
      text: 'State transitions and relevant changes can be traced directly on the order.',
      image: 'assets/images/projects/intranet/intranet-order-history-modal.webp',
      alt: 'Production order history dialog',
      size: 'md',
    },
    {
      title: 'Maintenance control',
      text: 'Maintenance states can be controlled and communicated transparently for affected areas.',
      image: 'assets/images/projects/intranet/intranet-maintenance-modal.webp',
      alt: 'Intranet maintenance dialog',
      size: 'md',
    },
    {
      title: 'Database Health',
      text: 'Database state, locks and technical metrics are prepared as a protected operations view.',
      image: 'assets/images/projects/intranet/intranet-db-health.webp',
      alt: 'Intranet database health view',
      size: 'lg',
    },
    {
      title: 'Document Share',
      text: 'Documents, categories, previews and permission-aware search paths are bundled in one interface.',
      image: 'assets/images/projects/intranet/document-share.webp',
      alt: 'Intranet Document Share interface',
      size: 'lg',
    },
    {
      title: 'Projects · Welcome',
      text: 'Personal entry point into tasks, projects and upcoming work inside the shared workflow.',
      image: 'assets/images/projects/intranet/projects-welcome.webp',
      alt: 'Intranet Projects welcome view',
      size: 'md',
    },
    {
      title: 'Projects · Board',
      text: 'Boards connect tasks, ownership, state and production context in one operational workspace.',
      image: 'assets/images/projects/intranet/projects-board.webp',
      alt: 'Intranet Projects board',
      size: 'lg',
    },
    {
      title: 'Projects · Inbox',
      text: 'New and assigned tasks are collected centrally before moving into the appropriate workflow.',
      image: 'assets/images/projects/intranet/projects-inbox.webp',
      alt: 'Intranet Projects inbox',
      size: 'md',
    },
  ],
};
