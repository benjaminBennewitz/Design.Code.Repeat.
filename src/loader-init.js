/* src/loader-init.js */

/** Koordiniert die Mindestdauer des statischen Loaders mit dem Angular-Bootstrap. */
class StartupLoader {
  loader = document.getElementById('dcr-site-loader'); // Statischer Loader vor dem Angular-Start.
  root = document.documentElement; // Dokumentwurzel mit Lade- und Sichtbarkeitsklassen.
  minimumElapsed = false; // Freigabe nach der bestehenden Mindestdauer.
  appReady = false; // Freigabe nach erfolgreichem Angular-Bootstrap.
  finishing = false; // Schutz vor mehrfacher Freigabe der Anwendung.

  /** Startet Mindestdauer und einmalige Beobachtung des Angular-Bootstraps. */
  start() {
    if (!this.loader) {
      this.root.classList.remove('dcr-initial-load', 'dcr-app-hidden');
      return;
    }
    window.addEventListener('dcr:app-ready', this.handleAppReady.bind(this), { once: true });
    window.setTimeout(this.handleMinimumElapsed.bind(this), 3000);
  }

  /** Fordert nach dem Angular-Start die kritischen Fonts an und prüft die Freigabe. */
  handleAppReady() {
    this.appReady = true;
    this.requestCriticalFonts();
    this.finish();
  }

  /** Gibt den Loader nach Ablauf der Mindestdauer für den Abschluss frei. */
  handleMinimumElapsed() {
    this.minimumElapsed = true;
    this.finish();
  }

  /** Lädt kritische Textfonts im Hintergrund ohne den Abschluss vom Netz abhängig zu machen. */
  requestCriticalFonts() {
    if (!document.fonts?.load) return;
    void Promise.allSettled([
      document.fonts.load('400 1rem Inter', 'Design Code Repeat'),
      document.fonts.load('700 1rem "JetBrains Mono"', 'INITIALIZING EXPERIENCE'),
    ]);
  }

  /** Fixiert vor der Freigabe die verfügbare Font-Variante ohne späteren Font-Swap. */
  stabilizeFontChoice() {
    if (!document.fonts?.check) return;
    /**
     * Ladezustand der kritischen Schrift für normale Texte.
     */
    const bodyFontReady = document.fonts.check('400 1rem Inter', 'Design Code Repeat');
    /**
     * Ladezustand der kritischen Schrift für technische Beschriftungen.
     */
    const monoFontReady = document.fonts.check('700 1rem "JetBrains Mono"', 'INITIALIZING EXPERIENCE');
    if (!bodyFontReady || !monoFontReady) this.root.classList.add('dcr-critical-font-fallback');
  }

  /** Löst nach beiden Freigaben den Scroll-Lock vor der sichtbaren Anwendung. */
  finish() {
    if (this.finishing || !this.minimumElapsed || !this.appReady) return;
    this.finishing = true;
    this.stabilizeFontChoice();
    this.root.classList.remove('dcr-initial-load');
    window.requestAnimationFrame(this.prepareReveal.bind(this));
  }

  /** Wartet einen weiteren Frame für Scrollbarbreite und endgültigen Font-Umbruch. */
  prepareReveal() {
    window.requestAnimationFrame(this.revealApp.bind(this));
  }

  /** Macht die Anwendung sichtbar und entfernt den abgeschlossenen Loader. */
  revealApp() {
    this.root.classList.remove('dcr-app-hidden');
    this.loader.setAttribute('aria-hidden', 'true');
    this.loader.setAttribute('aria-busy', 'false');
    this.loader.remove();
  }
}

new StartupLoader().start();
