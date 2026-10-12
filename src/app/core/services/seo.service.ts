/* src/app/core/services/seo.service.ts */
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
  private readonly document = inject(DOCUMENT);                                // Dokument für Attribute und Browserzugriffe.
  private readonly meta = inject(Meta);                                        // Angular-Metadatenverwaltung der Seite.
  private readonly tabTitle = inject(TabTitleService);                         // Aktiver Titel und Rückkehrhinweis des Browser-Tabs.
  private readonly structuredDataId = 'dcr-structured-data';                   // Bestehende ID des zentralen JSON-LD-Scripts.
  private readonly configuredSiteUrl = environment.siteUrl.replace(/\/$/, ''); // Konfigurierte Site-Adresse ohne abschließenden Slash.
  private readonly robotsDirective = environment.robots;                       // Umgebungsspezifische Indexierungsregel.

  /**
   * Aktualisiert Titel, Metadaten, Canonical und JSON-LD einer regulären Seite.
   * @param content Routenabhängiger SEO-Inhalt in der aktiven Sprache.
   * @param path Relativer Pfad der Seite.
   * @param type Bisheriger Open-Graph-Seitentyp.
   */
  setPage(content: SeoPageContent, path: string, type: 'website' | 'article' = 'website'): void {
    /**
     * Absolute Seitenadresse für Canonical, Open Graph und strukturierte Daten.
     */
    const url = this.absoluteUrl(path);
    this.tabTitle.setActiveTitle(content.title);
    this.updatePageMeta(content);
    this.updateSocialMeta(content, url, type);
    this.setCanonical(url);
    this.setStructuredData([this.organizationSchema(), this.webPageSchema(content, url)]);
  }

  /**
   * Überträgt Beschreibung, Keywords und die konfigurierte Indexierungsregel.
   * @param content Routenabhängiger SEO-Inhalt.
   */
  private updatePageMeta(content: SeoPageContent): void {
    this.meta.updateTag({ name: 'description', content: content.description });
    this.meta.updateTag({ name: 'keywords', content: content.keywords.join(', ') });
    this.meta.updateTag({ name: 'robots', content: this.robotsDirective });
  }

  /**
   * Aktualisiert die bisherigen Open-Graph- und Twitter-Metadaten.
   * @param content Routenabhängiger SEO-Inhalt.
   * @param url Absolute Seitenadresse.
   * @param type Bisheriger Open-Graph-Seitentyp.
   */
  private updateSocialMeta(content: SeoPageContent, url: string, type: 'website' | 'article'): void {
    this.meta.updateTag({ property: 'og:site_name', content: 'Design. Code. Repeat.' });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: content.title });
    this.meta.updateTag({ property: 'og:description', content: content.description });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: content.title });
    this.meta.updateTag({ name: 'twitter:description', content: content.description });
  }

  /**
   * Erstellt die bisherigen strukturierten Seitendaten ohne HTML-Interpolation.
   * @param content Routenabhängiger SEO-Inhalt.
   * @param url Absolute Seitenadresse.
   */
  private webPageSchema(content: SeoPageContent, url: string): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: content.title,
      description: content.description,
      url,
      inLanguage: this.document.documentElement.lang || 'de',
    };
  }

  /**
   * Setzt noindex für Systemseiten wie 404 und Danke.
   * @param title Gewünschter Dokumenttitel.
   * @param description Beschreibung der Systemseite.
   * @param path Relativer Pfad der Seite.
   */
  setNoIndex(title: string, description: string, path: string): void {
    this.tabTitle.setActiveTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.setCanonical(this.absoluteUrl(path));
  }

  /**
   * Erstellt eine absolute URL auf Basis des realen Hosts mit Environment-Fallback.
   * @param path Relativer Pfad der Seite.
   */
  private absoluteUrl(path: string): string {
    /**
     * Seitenpfad mit dem erforderlichen führenden Slash.
     */
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${this.siteOrigin()}${normalized}`;
  }

  /** Liefert im Browser die reale Origin und außerhalb davon die konfigurierte Site-URL. */
  private siteOrigin(): string {
    /**
     * Origin des realen Dokuments für die absolute Seitenadresse.
     */
    const documentOrigin = this.document.location?.origin;
    return documentOrigin && documentOrigin !== 'null' ? documentOrigin : this.configuredSiteUrl;
  }

  /**
   * Aktualisiert den Canonical-Link.
   * @param url Absolute Seitenadresse.
   */
  private setCanonical(url: string): void {
    /**
     * Vorhandener oder neu anzulegender Canonical-Link.
     */
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.append(canonical);
    }

    canonical.href = url;
  }

  /**
   * Schreibt kontrollierte JSON-LD-Daten ohne HTML-Interpolation.
   * @param data Kontrollierte JSON-LD-Objekte der Seite.
   */
  private setStructuredData(data: readonly Record<string, unknown>[]): void {
    /**
     * Bereits vorhandenes zentrales JSON-LD-Script.
     */
    const existingScript = this.document.getElementById(this.structuredDataId) as HTMLScriptElement | null;
    /**
     * Für die aktuelle JSON-LD-Ausgabe verwendetes Script-Element.
     */
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
      email: 'mailto:kontakt@design-code-repeat.de',
      founder: {
        '@type': 'Person',
        name: 'Benjamin Bennewitz',
        alternateName: 'B²',
      },
      areaServed: 'DE',
    };
  }
}
