/* src/app/shared/reference-case-study/reference-case-study.component.spec.ts */
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { CaseAssetLoader } from './controllers/case-asset-loader';
import { ReferenceCaseStudyComponent } from './reference-case-study.component';

/** Verhindert Sichtbarkeitsmeldungen während des reinen Komponenten-Tests. */
class InactiveObserver {
  /** Registriert ein Element ohne Browser-Rendering. */
  observe(): void {}
  /** Entfernt ein Element aus dem Test-Observer. */
  unobserve(): void {}
  /** Beendet den Test-Observer. */
  disconnect(): void {}
}

let fixture: ComponentFixture<ReferenceCaseStudyComponent>; // Komponenteninstanz des aktuellen Tests.

/** Registriert Tests der unveränderten Template-Bindings und Projektwechsel. */
function registerComponentTests(): void {
  beforeEach(prepareComponent);
  afterEach(cleanupComponent);
  it('rendert die Intranet-Auswahl und setzt sie beim Projektwechsel zurück', expectProjectSelectionReset);
  it('behält Auswahlzustände bei einem Sprachwechsel', expectLanguageSelection);
  it('verbindet die ausgelagerte Reader-Darstellung mit Menü und Escape-Taste', expectReaderMenuReferences);
  it('verbindet und entfernt das Canvas der ausgelagerten Hero-Darstellung', expectHeroCanvasReferences);
}

/** Erstellt die Detailkomponente mit Browser-Doubles für das Test-DOM. */
function prepareComponent(): void {
  vi.stubGlobal('IntersectionObserver', InactiveObserver);
  vi.stubGlobal('matchMedia', getMotionPreference);
  vi.spyOn(CaseAssetLoader.prototype, 'preload').mockImplementation(loadReadyAsset);
  localStorage.removeItem('dcr-studio-language');
  TestBed.configureTestingModule({ imports: [ReferenceCaseStudyComponent], providers: [provideRouter([])] });
  fixture = TestBed.createComponent(ReferenceCaseStudyComponent);
  fixture.componentRef.setInput('projectSlug', 'intranet');
  fixture.componentRef.setInput('canonicalPath', '/referenzen/intranet');
  fixture.detectChanges();
}

/** Entfernt Komponenteninstanz und Browser-Doubles. */
function cleanupComponent(): void {
  fixture.destroy();
  TestBed.resetTestingModule();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.removeItem('dcr-studio-language');
}

/** Liefert eine neutrale Bewegungspräferenz für das Test-DOM. */
function getMotionPreference(): MediaQueryList {
  return { matches: false } as MediaQueryList;
}

/** Liefert einen bereits abgeschlossenen Asset-Ladeauftrag. */
function loadReadyAsset(): Promise<void> {
  return Promise.resolve();
}

/** Prüft das Zurücksetzen projektspezifischer Auswahlzustände. */
function expectProjectSelectionReset(): void {
  fixture.componentInstance.selection.selectArchitectureNode('api');
  fixture.componentInstance.selection.closeTerminal();
  expect(fixture.componentInstance.selection.activeArchitectureNode().id).toBe('api');
  expect(fixture.componentInstance.selection.isTerminalVisible()).toBe(false);
  fixture.componentRef.setInput('projectSlug', 'grafikdesign-katalog');
  fixture.componentRef.setInput('canonicalPath', '/referenzen/design-archiv');
  fixture.detectChanges();
  expect(fixture.componentInstance.project()?.slug).toBe('grafikdesign-katalog');
  expect(fixture.componentInstance.reader.activeSpread()?.pageLabel).toBe('01 / 54');
  expect(fixture.componentInstance.selection.isTerminalVisible()).toBe(true);
  expect(fixture.nativeElement.querySelector('.project-detail__catalog-reader')).not.toBeNull();
}

/** Prüft den Erhalt der Architektur-Auswahl bei übersetzten Projektdaten. */
function expectLanguageSelection(): void {
  fixture.componentInstance.selection.selectArchitectureNode('api');
  TestBed.inject(LanguageService).setLanguage('en');
  fixture.detectChanges();
  expect(fixture.componentInstance.selection.activeArchitectureNode().id).toBe('api');
  expect(fixture.componentInstance.project()?.name).toBe('Intranet');
}

/** Aktiviert das Designarchiv für Tests seiner ausgelagerten Darstellungen. */
function showArchive(): void {
  fixture.componentRef.setInput('projectSlug', 'grafikdesign-katalog');
  fixture.componentRef.setInput('canonicalPath', '/referenzen/design-archiv');
  fixture.detectChanges();
}

/** Prüft Dialogreferenzen und die globale Escape-Behandlung nach dem Auslagern. */
function expectReaderMenuReferences(): void {
  showArchive();
  expect(fixture.componentInstance.menu.trigger).toBe(
    fixture.nativeElement.querySelector('.project-detail__catalog-menu-button'),
  );
  fixture.componentInstance.menu.open();
  fixture.detectChanges();
  expect(fixture.componentInstance.menu.dialog).toBe(
    fixture.nativeElement.querySelector('.project-detail__catalog-reader-meta'),
  );
  fixture.componentInstance.handleWindowKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
  fixture.detectChanges();
  expect(fixture.componentInstance.menu.isOpen()).toBe(false);
  expect(fixture.componentInstance.menu.dialog).toBeUndefined();
}

/** Prüft die Canvas-Verbindung bei Wechseln zwischen beiden Case Studies. */
function expectHeroCanvasReferences(): void {
  vi.spyOn(fixture.componentInstance.flow, 'connect');
  showArchive();
  expect(fixture.componentInstance.flow.connect).toHaveBeenCalledWith(fixture.nativeElement.querySelector('canvas'));
  fixture.componentRef.setInput('projectSlug', 'intranet');
  fixture.componentRef.setInput('canonicalPath', '/referenzen/intranet');
  fixture.detectChanges();
  expect(fixture.componentInstance.flow.connect).toHaveBeenCalledWith(undefined);
  expect(fixture.nativeElement.querySelector('canvas')).toBeNull();
}

describe('ReferenceCaseStudyComponent', registerComponentTests);
