/* src/loader-init.js */

/**
 * Koordiniert den statischen Start-Loader mit dem Angular-Bootstrap.
 * Die Mindestdauer startet bereits beim Parsen des HTML-Dokuments.
 */
(() => {
  const loader = document.getElementById('dcr-site-loader');
  const root = document.documentElement;

  if (!loader) {
    root.classList.remove('dcr-initial-load');
    return;
  }

  let minimumElapsed = false;
  let appReady = false;
  let finished = false;

  const finish = () => {
    if (finished || !minimumElapsed || !appReady) return;

    finished = true;
    loader.classList.add('is-finished');
    loader.setAttribute('aria-hidden', 'true');
    loader.setAttribute('aria-busy', 'false');
    root.classList.remove('dcr-initial-load');

    window.setTimeout(() => loader.remove(), 260);
  };

  window.addEventListener('dcr:app-ready', () => {
    appReady = true;
    finish();
  }, { once: true });

  window.setTimeout(() => {
    minimumElapsed = true;
    finish();
  }, 3000);
})();
