/**
 * @file Globales Accessibility-Panel der Studio-Website.
 * @description Bietet persistente Einstellungen für Motion, visuelle Komplexität, Kontrast und Farbseh-Anpassungen.
 */

import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, effect, inject } from '@angular/core';
import {
  AccessibilityPreferenceService,
  ColorVisionMode,
  ComfortMode,
  ContrastMode,
  MotionMode,
} from '../../core/services/accessibility-preference.service';
import { AccessibilityPanelService } from '../../core/services/accessibility-panel.service';
import { LanguageService } from '../../core/services/language.service';

/** Übersetzte Texte des Accessibility-Panels. */
interface AccessibilityPanelTexts {
  readonly openLabel: string;
  readonly closeLabel: string;
  readonly title: string;
  readonly intro: string;
  readonly statusTitle: string;
  readonly calmMode: string;
  readonly reset: string;
  readonly motionTitle: string;
  readonly comfortTitle: string;
  readonly contrastTitle: string;
  readonly colorTitle: string;
  readonly storageHint: string;
  readonly motion: Record<MotionMode, string>;
  readonly comfort: Record<ComfortMode, string>;
  readonly contrast: Record<ContrastMode, string>;
  readonly color: Record<ColorVisionMode, string>;
}

/** Global erreichbares Accessibility-Panel. */
@Component({
  selector: 'dcr-accessibility-panel',
  standalone: true,
  templateUrl: './accessibility-panel.component.html',
  styleUrl: './accessibility-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPanelComponent {
  /** Native Dialog-Referenz für Focus Management und Escape-Verhalten. */
  @ViewChild('accessibilityDialog') private dialog?: ElementRef<HTMLDialogElement>;

  /** Persistierte Accessibility-Einstellungen. */
  readonly accessibility = inject(AccessibilityPreferenceService);

  /** UI-Controller für zusätzliche Trigger außerhalb dieser Komponente. */
  private readonly panelService = inject(AccessibilityPanelService);

  /** Sprachservice für DE/EN-Texte. */
  private readonly languageService = inject(LanguageService);

  /** Verfügbare Motion-Optionen. */
  readonly motionModes: readonly MotionMode[] = ['full', 'reduced', 'off'];

  /** Verfügbare Comfort-Optionen. */
  readonly comfortModes: readonly ComfortMode[] = ['expressive', 'simple'];

  /** Verfügbare Kontrast-Optionen. */
  readonly contrastModes: readonly ContrastMode[] = ['normal', 'high'];

  /** Verfügbare Farbseh-Optionen. */
  readonly colorModes: readonly ColorVisionMode[] = ['default', 'deuteranopia', 'protanopia', 'tritanopia', 'achromatopsia'];

  /** Übersetzte Texte der aktiven Sprache. */
  readonly texts = computed<AccessibilityPanelTexts>(() => PANEL_TEXTS[this.languageService.language()]);

  constructor() {
    effect(() => {
      const request = this.panelService.openRequest();
      if (request === 0) {
        return;
      }

      queueMicrotask(() => this.open());
    });
  }

  /** Kompakter Status für den festen Trigger. */
  readonly statusText = computed<string>(() => {
    const texts = this.texts();
    const preferences = this.accessibility.preferences();

    return [
      texts.motion[preferences.motion],
      texts.contrast[preferences.contrast],
      texts.color[preferences.colorVision],
    ].join(' · ');
  });

  /** Öffnet den nativen Modal-Dialog inklusive browserseitigem Focus Management. */
  open(): void {
    const dialog = this.dialog?.nativeElement;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  /** Schließt das Accessibility-Panel. */
  close(): void {
    this.dialog?.nativeElement.close();
  }

  /** Schließt nur bei einem Klick auf die native Dialog-Backdrop-Fläche. */
  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /** Setzt den Bewegungsmodus. */
  setMotionMode(mode: MotionMode): void {
    this.accessibility.setMotionMode(mode);
  }

  /** Setzt die visuelle Komplexität. */
  setComfortMode(mode: ComfortMode): void {
    this.accessibility.setComfortMode(mode);
  }

  /** Setzt den Kontrastmodus. */
  setContrastMode(mode: ContrastMode): void {
    this.accessibility.setContrastMode(mode);
  }

  /** Setzt die Farbseh-Anpassung. */
  setColorVisionMode(mode: ColorVisionMode): void {
    this.accessibility.setColorVisionMode(mode);
  }
}

/** Lokale Übersetzungen; keine Marketing-Inhalte, daher bewusst komponentennah gehalten. */
const PANEL_TEXTS: Record<'de' | 'en', AccessibilityPanelTexts> = {
  de: {
    openLabel: 'Barrierefreiheit einstellen',
    closeLabel: 'Barrierefreiheits-Panel schließen',
    title: 'Barrierefreiheit',
    intro: 'Passe Bewegung, visuelle Komplexität, Kontrast und Farbseh-Modus an deine Bedürfnisse an.',
    statusTitle: 'Access',
    calmMode: 'Ruhigen Modus aktivieren',
    reset: 'Zurücksetzen',
    motionTitle: 'Animationen',
    comfortTitle: 'Oberfläche',
    contrastTitle: 'Kontrast',
    colorTitle: 'Farbseh-Anpassungen',
    storageHint: 'Die Auswahl wird ausschließlich lokal in diesem Browser gespeichert.',
    motion: { full: 'Voll animiert', reduced: 'Reduziert', off: 'Aus' },
    comfort: { expressive: 'Expressiv', simple: 'Ruhig' },
    contrast: { normal: 'Normal', high: 'Hoch' },
    color: {
      default: 'Standard',
      deuteranopia: 'Deuteranopie',
      protanopia: 'Protanopie',
      tritanopia: 'Tritanopie',
      achromatopsia: 'Graustufen',
    },
  },
  en: {
    openLabel: 'Adjust accessibility',
    closeLabel: 'Close accessibility panel',
    title: 'Accessibility',
    intro: 'Adjust motion, visual complexity, contrast and color-vision mode to your needs.',
    statusTitle: 'Access',
    calmMode: 'Enable calm mode',
    reset: 'Reset',
    motionTitle: 'Motion',
    comfortTitle: 'Interface',
    contrastTitle: 'Contrast',
    colorTitle: 'Color vision',
    storageHint: 'Your selection is stored only in this browser.',
    motion: { full: 'Full', reduced: 'Reduced', off: 'Off' },
    comfort: { expressive: 'Expressive', simple: 'Calm' },
    contrast: { normal: 'Normal', high: 'High' },
    color: {
      default: 'Default',
      deuteranopia: 'Deuteranopia',
      protanopia: 'Protanopia',
      tritanopia: 'Tritanopia',
      achromatopsia: 'Grayscale',
    },
  },
};
