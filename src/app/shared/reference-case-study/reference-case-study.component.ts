/* src/app/shared/reference-case-study/reference-case-study.component.ts */
import {
  Component,
  ViewEncapsulation,
  HostListener,
  NgZone,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { REFERENCE_CASE_PROJECTS } from '../../core/data/reference-case-projects';
import { REFERENCE_CASE_UI } from '../../core/data/reference-case-ui';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { RevealOnScrollDirective } from '../reference-reveal-on-scroll.directive';
import { ProjectTelemetryComponent } from '../reference-project-telemetry/reference-project-telemetry.component';
import { TextRevealDirective } from '../text-reveal.directive';
import { CaseAssetLoader } from './controllers/case-asset-loader';
import { CaseStudySelection } from './controllers/case-study-selection';
import { CatalogReader } from './controllers/catalog-reader';
import { CatalogMenu } from './controllers/catalog-menu';
import { CatalogLoupe } from './controllers/catalog-loupe';
import { CatalogFlow } from './controllers/catalog-flow';
import { GalleryLightbox } from './controllers/gallery-lightbox';
import type { PortfolioProject } from '../../core/models/reference-project.models';

import { CaseHeroView } from './views/case-hero.view';
import { CaseInfoView } from './views/case-info.view';
import { CaseArchitectureView } from './views/case-architecture.view';
import { CaseReaderView } from './views/case-reader.view';
import { CaseGalleryView } from './views/case-gallery.view';
import { CaseLightboxView } from './views/case-lightbox.view';
import { ProtectedAssetDirective } from './views/protected-asset.directive';

/** Verbindet Case-Study-Inhalte und voneinander getrennte Interaktionszustände mit dem Template. */
@Component({
  selector: 'dcr-reference-case-study',
  standalone: true,
  imports: [
    TextRevealDirective,
    RouterLink,
    RevealOnScrollDirective,
    ProjectTelemetryComponent,
    CaseHeroView,
    CaseInfoView,
    CaseArchitectureView,
    CaseReaderView,
    CaseGalleryView,
    CaseLightboxView,
    ProtectedAssetDirective,
  ],
  templateUrl: './reference-case-study.component.html',
  styleUrls: ['./reference-case-study.component.scss', '../../../styles/reference-case-catalog.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'dcr-case' },
})
export class ReferenceCaseStudyComponent implements OnDestroy {
  private readonly languageService = inject(LanguageService);                      // Aktuelle Sprache und Studio-Inhalte.
  private readonly seoService = inject(SeoService);                                // Metadaten der aktuellen Detailroute.
  private readonly zone = inject(NgZone);                                          // Angular-Zone für die Canvas-Animation.
  readonly projectSlug = input.required<string>();                                 // Projektslug der lokal eingebundenen Case Study.
  readonly canonicalPath = input.required<string>();                               // Kanonischer DCR-Pfad der Detailroute.
  private readonly slug = signal('');                                              // Zuletzt übernommenes Projekt für kontrollierte Zustandswechsel.
  readonly content = computed(this.getContent.bind(this));                         // Übersetzte Case-Study-Bedientexte.
  readonly project = computed(this.getProject.bind(this));                         // Aktuell ausgewählte lokale Case Study.
  readonly catalogLoadingLabel = computed(this.getLoadingLabel.bind(this));        // Zugänglicher Reader-Ladestatus.
  readonly isArchiveTelemetryProject = computed(this.isArchiveProject.bind(this)); // Verdichtetes Archiv-Diagrammlayout.

  private readonly assets = new CaseAssetLoader();                                                           // Gemeinsame Bild-Decodierung der Komponenteninstanz.
  readonly loupe = new CatalogLoupe();                                                                       // Bildausschnitt der Reader-Lupe.
  readonly reader = new CatalogReader(this.project, this.languageService.language, this.assets, this.loupe); // Reader-Zustand.
  readonly menu = new CatalogMenu();                                                                         // Inhaltsverzeichnis und dessen Fokusführung.
  readonly lightbox = new GalleryLightbox(this.project, this.assets);                                        // Galerieauswahl und Dialogzustand.
  readonly flow = new CatalogFlow(this.project, this.zone);                                                  // Sichtbarkeit und Lifecycle der Canvas-Animation.
  readonly selection = new CaseStudySelection(this.project);                                                 // Bestehendes Template-Binding.

  /** Initialisiert die reaktiven Projekt-, SEO- und Interaktionsabläufe. */
  constructor() {
    effect(this.synchronizeProject.bind(this));
    effect(this.updateSeo.bind(this));
    effect(this.flow.synchronize.bind(this.flow));
    effect(this.reader.preloadNearby.bind(this.reader));
    effect(this.lightbox.synchronizeScrollLock.bind(this.lightbox));
  }

  /** Beendet Interaktionen und Browser-Callbacks beim Verlassen der Detailroute. */
  ngOnDestroy(): void {
    this.flow.destroy();
    this.reader.destroy();
    this.menu.reset();
    this.lightbox.reset();
  }

  /**
   * Leitet Tastaturbefehle an das aktuell geöffnete Projekt-Overlay weiter.
   * @param event Tastaturereignis innerhalb der Detailroute.
   */
  @HostListener('window:keydown', ['$event'])
  handleWindowKeydown(event: KeyboardEvent): void {
    if (this.menu.isOpen() && (event.key === 'Escape' || event.key === 'Tab')) this.menu.handleKeydown(event);
    else this.lightbox.handleKeydown(event);
  }

  /** Liefert die übersetzten Case-Study-Bedientexte. */
  private getContent() {
    return REFERENCE_CASE_UI[this.languageService.language()];
  }

  /** Liefert das Projekt des zuletzt übernommenen Slugs. */
  private getProject() {
    return REFERENCE_CASE_PROJECTS[this.languageService.language()].find(this.matchesProject.bind(this));
  }

  /**
   * Prüft den Slug einer verfügbaren Case Study.
   * @param project Zu prüfende lokale Case Study.
   */
  private matchesProject(project: PortfolioProject): boolean {
    return project.slug === this.slug();
  }

  /** Liefert den übersetzten zugänglichen Ladestatus des Readers. */
  private getLoadingLabel(): string {
    return this.languageService.language() === 'de' ? 'Katalog wird geladen' : 'Loading catalogue';
  }

  /** Prüft das projektspezifische Archiv-Diagrammlayout. */
  private isArchiveProject(): boolean {
    return this.project()?.slug === 'grafikdesign-katalog';
  }

  /** Übernimmt einen neuen Projektslug mit zurückgesetzten Interaktionszuständen. */
  private synchronizeProject(): void {
    if (this.slug() === this.projectSlug()) return;
    this.slug.set(this.projectSlug());
    this.selection.reset();
    this.reader.reset();
    this.menu.reset();
    this.loupe.hide();
    this.lightbox.reset();
  }

  /** Synchronisiert die SEO-Metadaten der aktuell sichtbaren Case Study. */
  private updateSeo(): void {
    if (!this.project()) {
      this.seoService.setNoIndex(this.content().notFoundTitle, this.content().notFoundText, this.canonicalPath());
      return;
    }
    this.updateProjectSeo();
  }

  /** Schreibt Titel, Beschreibung und Suchbegriffe des aktuellen Projekts. */
  private updateProjectSeo(): void {
    /**
     * Bereits vorhandenes Projekt nach der Prüfung durch updateSeo.
     */
    const project = this.project()!;
    this.seoService.setPage(
      {
        title: project.name + ' | Design. Code. Repeat.',
        description: project.summary,
        keywords: [...project.techStack, project.type, project.name, 'Design Code Repeat'],
      },
      this.canonicalPath(),
      'article',
    );
  }
}
