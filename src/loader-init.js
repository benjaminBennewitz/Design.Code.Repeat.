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

  /** Kritische Textfonts werden hinter dem Loader geladen, damit beim Reveal kein Font-Swap mehr stattfindet. */
  let criticalFontsReady = Promise.resolve();

  const waitForCriticalFonts = () => {
    if (!document.fonts?.load) return Promise.resolve();

    return Promise.allSettled([
      document.fonts.load('400 1rem Inter', 'Design Code Repeat'),
      document.fonts.load('700 1rem "JetBrains Mono"', 'INITIALIZING EXPERIENCE'),
    ]).then(() => undefined);
  };

  /**
   * Wartet höchstens kurz auf Fonts. Sind sie danach noch nicht verfügbar,
   * bleibt diese Sitzung bewusst auf metrisch stabilen System-Fallbacks.
   */
  const stabilizeFonts = async () => {
    await Promise.race([
      criticalFontsReady,
      new Promise((resolve) => window.setTimeout(resolve, 650)),
    ]);

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
        loader.classList.add('is-finished');
        loader.setAttribute('aria-hidden', 'true');
        loader.setAttribute('aria-busy', 'false');
        window.setTimeout(() => loader.remove(), 260);
      });
    });
  };

  const finish = async () => {
    if (finishing || !minimumElapsed || !appReady) return;

    finishing = true;
    await stabilizeFonts();

    // Scroll-Lock zuerst lösen. Die App bleibt noch verborgen, sodass die neue
    // Scrollbarbreite keinen sichtbaren Layout Shift auslösen kann.
    root.classList.remove('dcr-initial-load');
    revealApp();
  };

  window.addEventListener('dcr:app-ready', () => {
    appReady = true;
    criticalFontsReady = waitForCriticalFonts();
    void finish();
  }, { once: true });

  window.setTimeout(() => {
    minimumElapsed = true;
    void finish();
  }, 3000);
})();
