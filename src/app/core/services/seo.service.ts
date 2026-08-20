/**
 * @file SEO-Service für Meta-Daten, Canonical und strukturierte Daten.
 * @description Nutzt im Browser die aktuelle Origin und fällt außerhalb davon auf das Angular-Environment zurück.
 */

import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { SeoPageContent } from '../models/studio.models';
import { TabTitleService } from './tab-title.service';

/** Kapselt routenabhängige SEO-Ausgabe. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly tabTitle = inject(TabTitleService);
  private readonly structuredDataId = 'dcr-structured-data';
  private readonly configuredSiteUrl = environment.siteUrl.replace(/\/$/, '');

  /** Setzt SEO-Daten für eine reguläre indexierbare Seite. */
  setPage(content: SeoPageContent, path: string, type: 'website' | 'article' = 'website'): void {
    const url = this.absoluteUrl(path);

    this.tabTitle.setActiveTitle(content.title);
    this.meta.updateTag({ name: 'description', content: content.description });
    this.meta.updateTag({ name: 'keywords', content: content.keywords.join(', ') });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Design. Code. Repeat.' });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: content.title });
    this.meta.updateTag({ property: 'og:description', content: content.description });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: content.title });
    this.meta.updateTag({ name: 'twitter:description', content: content.description });
    this.setCanonical(url);
    this.setStructuredData([
      this.organizationSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: content.title,
        description: content.description,
        url,
        inLanguage: this.document.documentElement.lang || 'de',
      },
    ]);
  }

  /** Setzt noindex für Systemseiten wie 404 und Danke. */
  setNoIndex(title: string, description: string, path: string): void {
    this.tabTitle.setActiveTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    this.setCanonical(this.absoluteUrl(path));
  }

  /** Erstellt eine absolute URL auf Basis des realen Hosts mit Environment-Fallback. */
  private absoluteUrl(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${this.siteOrigin()}${normalized}`;
  }

  /** Liefert im Browser die reale Origin und außerhalb davon die konfigurierte Site-URL. */
  private siteOrigin(): string {
    const documentOrigin = this.document.location?.origin;
    return documentOrigin && documentOrigin !== 'null' ? documentOrigin : this.configuredSiteUrl;
  }

  /** Aktualisiert den Canonical-Link. */
  private setCanonical(url: string): void {
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.append(canonical);
    }

    canonical.href = url;
  }

  /** Schreibt kontrollierte JSON-LD-Daten ohne HTML-Interpolation. */
  private setStructuredData(data: readonly Record<string, unknown>[]): void {
    const existingScript = this.document.getElementById(this.structuredDataId) as HTMLScriptElement | null;
    const script = existingScript ?? this.document.createElement('script');

    if (!existingScript) {
      script.id = this.structuredDataId;
      script.type = 'application/ld+json';
      this.document.head.append(script);
    }

    script.textContent = JSON.stringify(data);
  }

  /** Schema.org-Entität für den kommerziellen Studio-Auftritt. */
  private organizationSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Design. Code. Repeat.',
      description: 'Webentwicklung, Softwareentwicklung, UI/UX, Wartung und Managed Hosting.',
      url: this.siteOrigin(),
      email: 'mailto:kontakt@bennewitz.de',
      founder: {
        '@type': 'Person',
        name: 'Benjamin Bennewitz',
        alternateName: 'B²',
      },
      areaServed: 'DE',
    };
  }
}
