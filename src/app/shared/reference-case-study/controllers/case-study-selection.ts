/* src/app/shared/reference-case-study/controllers/case-study-selection.ts */
import { computed, signal, type Signal } from '@angular/core';
import type {
  PortfolioProject,
  ProjectAppModule,
  ProjectArchitectureNode,
} from '../../../core/models/reference-project.models';
import type { ProjectBloodGuideModeKey } from '../../../core/models/reference-showcase.models';

/** Verwaltet Auswahlzustände der Architektur-, App- und Terminaldarstellung. */
export class CaseStudySelection {
  private readonly architectureId = signal('');                                    // Ausgewählter Architektur-Knoten.
  private readonly appId = signal('');                                             // Ausgewählte App-Karte des Hero-Stacks.
  private readonly closedWidgets = signal<readonly string[]>([]);                  // Geschlossene Terminalfenster.
  readonly isTerminalVisible = signal(true);                                       // Sichtbarkeit des Fallback-Terminals.
  readonly isCaseNoteVisible = signal(true);                                       // Sichtbarkeit des technischen Hinweisfensters.
  readonly bloodGuideMode = signal<ProjectBloodGuideModeKey>('scale');             // Ausgewählter Werte-Guide.
  readonly activeArchitectureNode = computed(this.getArchitectureNode.bind(this)); // Aktiver Architektur-Knoten.
  readonly activeAppModule = computed(this.getAppModule.bind(this));               // Aktive Hero-App-Karte.
  readonly activeAppModuleIndex = computed(this.getAppIndex.bind(this));           // Position der Hero-App-Karte.
  readonly primaryDetailFragment = computed(this.getPrimaryFragment.bind(this));   // Ziel des primären Hero-Links.

  /**
   * Verbindet die Auswahlzustände mit dem aktuellen Projekt.
   * @param project Aktuell ausgewählte Case Study.
   */
  constructor(private readonly project: Signal<PortfolioProject | undefined>) {}

  /** Setzt projektspezifische Auswahl- und Fensterzustände zurück. */
  reset(): void {
    this.architectureId.set('');
    this.appId.set('');
    this.closedWidgets.set([]);
    this.isTerminalVisible.set(true);
    this.isCaseNoteVisible.set(true);
  }

  /**
   * Wählt einen Architektur-Knoten aus.
   * @param nodeId Kennung des gewünschten Architektur-Knotens.
   */
  selectArchitectureNode(nodeId: string): void {
    this.architectureId.set(nodeId);
  }

  /**
   * Wählt eine Hero-App-Karte aus.
   * @param moduleId Kennung der gewünschten App-Karte.
   */
  selectAppModule(moduleId: string): void {
    this.appId.set(moduleId);
  }

  /**
   * Navigiert zyklisch durch den Hero-App-Stack.
   * @param direction Vorwärts- oder Rückwärtsnavigation.
   */
  selectAdjacentAppModule(direction: 1 | -1): void {
    /**
     * App-Karten des aktuell ausgewählten Projekts.
     */
    const modules = this.project()?.appModules ?? [];
    if (!modules.length) return;
    this.selectAppModule(modules[(this.activeAppModuleIndex() + direction + modules.length) % modules.length].id);
  }

  /**
   * Prüft die Sichtbarkeit eines Terminalfensters.
   * @param widgetId Kennung des zu prüfenden Fensters.
   */
  isTerminalWidgetVisible(widgetId: string): boolean {
    return !this.closedWidgets().includes(widgetId);
  }

  /**
   * Schließt ein einzelnes Terminalfenster.
   * @param widgetId Kennung des zu schließenden Fensters.
   */
  closeTerminalWidget(widgetId: string): void {
    this.closedWidgets.update(this.addClosedWidget.bind(this, widgetId));
  }

  /** Schließt das Fallback-Terminal. */
  closeTerminal(): void {
    this.isTerminalVisible.set(false);
  }

  /** Schließt das technische Hinweisfenster. */
  closeCaseNote(): void {
    this.isCaseNoteVisible.set(false);
  }

  /**
   * Wählt einen Diagrammstil des Werte-Guides.
   * @param mode Kennung des gewünschten Diagrammstils.
   */
  selectBloodGuideMode(mode: ProjectBloodGuideModeKey): void {
    this.bloodGuideMode.set(mode);
  }

  /**
   * Prüft den aktuell ausgewählten Diagrammstil.
   * @param mode Kennung des zu prüfenden Diagrammstils.
   */
  isBloodGuideMode(mode: ProjectBloodGuideModeKey): boolean {
    return this.bloodGuideMode() === mode;
  }

  /** Liefert den Positionierungsindex des Werte-Guide-Schalters. */
  bloodGuideModeIndex(): number {
    return this.bloodGuideMode() === 'bar' ? 1 : this.bloodGuideMode() === 'chart' ? 2 : 0;
  }

  /** Liefert den gewählten Architektur-Knoten mit Fallback auf den ersten Eintrag. */
  private getArchitectureNode(): ProjectArchitectureNode {
    return findSelected(this.project()?.architecture ?? [], this.architectureId());
  }

  /** Liefert die gewählte Hero-App-Karte mit Fallback auf den ersten Eintrag. */
  private getAppModule(): ProjectAppModule | undefined {
    return findSelected(this.project()?.appModules ?? [], this.appId());
  }

  /** Liefert den Stack-Index der aktiven Hero-App-Karte. */
  private getAppIndex(): number {
    return Math.max((this.project()?.appModules ?? []).findIndex(this.isActiveApp.bind(this)), 0);
  }

  /**
   * Prüft die Zugehörigkeit zur aktuell ausgewählten Hero-App-Karte.
   * @param module Zu prüfende App-Karte.
   */
  private isActiveApp(module: ProjectAppModule): boolean {
    return module.id === this.activeAppModule()?.id;
  }

  /**
   * Ergänzt ein geschlossenes Fenster ohne doppelte Kennungen.
   * @param widgetId Kennung des geschlossenen Fensters.
   * @param ids Bisherige Kennungen geschlossener Fenster.
   */
  private addClosedWidget(widgetId: string, ids: readonly string[]): readonly string[] {
    return ids.includes(widgetId) ? ids : [...ids, widgetId];
  }

  /** Liefert das passende Fragmentziel für die projektspezifische Detaildarstellung. */
  private getPrimaryFragment(): string {
    if (this.project()?.boardShowcase) return 'project-board-workflow';
    if (this.project()?.bloodShowcase) return 'project-blood-workflow';
    if (this.project()?.catalogShowcase) return 'project-catalog-spread';
    if (this.project()?.telemetry) return 'project-telemetry';
    return 'project-deep-dive';
  }
}

/**
 * Liefert den gewählten Eintrag mit Fallback auf das erste Element.
 * @param items Verfügbare Einträge in ihrer Darstellungsreihenfolge.
 * @param id Kennung des gewünschten Eintrags.
 */
function findSelected<T extends { readonly id: string }>(items: readonly T[], id: string): T {
  /**
   * Aktuell auf die gewünschte Kennung geprüfter Eintrag.
   */
  for (const item of items) if (item.id === id) return item;
  return items[0];
}
