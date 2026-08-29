/* src/loader-init.js */

/**
 * Koordiniert den statischen Start-Loader mit dem Angular-Bootstrap.
 * Die Mindestdauer startet bereits beim Parsen des HTML-Dokuments.
 */
(() => {
  const loader = document.getElementById('dcr-site-loader');
  const root = document.documentElement;

  if (!loader) {
    root.classList.remove('dcr-initial-load', 'dcr-app-hidden');
    return;
  }

  let minimumElapsed = false;
  let appReady = false;
  let finishing = false;

  /**
   * Startet die kritischen Textfonts früh im Hintergrund, ohne den Loader-Abschluss
   * von einem Netzwerkrequest abhängig zu machen.
   */
  const requestCriticalFonts = () => {
    if (!document.fonts?.load) return;

    void Promise.allSettled([
      document.fonts.load('400 1rem Inter', 'Design Code Repeat'),
      document.fonts.load('700 1rem "JetBrains Mono"', 'INITIALIZING EXPERIENCE'),
    ]);
  };

  /**
   * Fixiert vor dem Reveal die bereits verfügbare Font-Variante. Ein langsamer
   * Erstaufruf kann dadurch nachträglich keinen sichtbaren Font-Swap auslösen.
   */
  const stabilizeFontChoice = () => {
    if (!document.fonts?.check) return;

    const bodyFontReady = document.fonts.check('400 1rem Inter', 'Design Code Repeat');
    const monoFontReady = document.fonts.check('700 1rem "JetBrains Mono"', 'INITIALIZING EXPERIENCE');

    if (!bodyFontReady || !monoFontReady) {
      root.classList.add('dcr-critical-font-fallback');
    }
  };

  /** Zwei Frames lassen Scrollbar und finalen Font-Umbruch setzen, solange die App noch unsichtbar ist. */
  const revealApp = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.classList.remove('dcr-app-hidden');
        loader.setAttribute('aria-hidden', 'true');
        loader.setAttribute('aria-busy', 'false');
        loader.remove();
      });
    });
  };

  const finish = () => {
    if (finishing || !minimumElapsed || !appReady) return;

    finishing = true;
    stabilizeFontChoice();

    // Scroll-Lock zuerst lösen. Die App bleibt noch verborgen, sodass die neue
    // Scrollbarbreite keinen sichtbaren Layout Shift auslösen kann.
    root.classList.remove('dcr-initial-load');
    revealApp();
  };

  window.addEventListener('dcr:app-ready', () => {
    appReady = true;
    requestCriticalFonts();
    finish();
  }, { once: true });

  window.setTimeout(() => {
    minimumElapsed = true;
    finish();
  }, 3000);
})();
