/**
 * @file Isolierter Druckexport des Website-Audits.
 * @description Überträgt ausschließlich den gerenderten Bericht in ein eigenes Druckdokument.
 */

/** Öffnet ein separates Druckdokument; gedruckt wird erst nach einem Klick in diesem Dokument. */
export function printWebsiteAudit(source: HTMLElement, title: string, language: 'de' | 'en'): void {
  const printWindow = window.open('', '_blank', 'width=960,height=800');
  if (!printWindow) {
    window.alert(language === 'de'
      ? 'Der Druckbericht konnte nicht geöffnet werden. Bitte Pop-ups für diese Website erlauben.'
      : 'The print report could not be opened. Please allow pop-ups for this website.');
    return;
  }

  const printDocument = printWindow.document;
  printDocument.title = title;
  printDocument.documentElement.lang = language;

  const viewport = printDocument.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1';
  printDocument.head.appendChild(viewport);

  const stylesheet = printDocument.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('assets/print/website-audit-print.css', document.baseURI).href;

  const controls = printDocument.createElement('div');
  controls.className = 'audit-print-controls';
  const printButton = printDocument.createElement('button');
  printButton.type = 'button';
  printButton.disabled = true;
  printButton.textContent = language === 'de' ? 'Druckansicht wird vorbereitet …' : 'Preparing print preview …';
  printButton.addEventListener('click', () => printWindow.print());
  const closeButton = printDocument.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = language === 'de' ? 'Schließen' : 'Close';
  closeButton.addEventListener('click', () => printWindow.close());
  controls.append(printButton, closeButton);
  printDocument.body.appendChild(controls);

  const report = printDocument.importNode(source, true);
  report.querySelectorAll('.audit-page__report-actions, .audit-page__category-switcher, .audit-page__cta')
    .forEach(element => element.remove());
  printDocument.body.appendChild(report);

  // Kompakte Kontaktzeile wiederholt sich auf jeder PDF-Seite.
  const contact = printDocument.createElement('footer');
  contact.className = 'audit-print-contact';
  contact.setAttribute('aria-label', language === 'de' ? 'Kontakt zum Bericht' : 'Report contact');

  const contactName = printDocument.createElement('strong');
  contactName.textContent = 'Design. Code. Repeat. · Benjamin Bennewitz';
  const contactLinks = printDocument.createElement('div');
  contactLinks.className = 'audit-print-contact__links';

  const links = [
    { text: 'kontakt@design-code-repeat.de', href: 'mailto:kontakt@design-code-repeat.de' },
    { text: '+49 162 9038166', href: 'tel:+491629038166' },
    { text: 'design-code-repeat.de', href: 'https://design-code-repeat.de/' },
  ];
  for (const [index, item] of links.entries()) {
    if (index > 0) {
      const separator = printDocument.createElement('span');
      separator.textContent = ' · ';
      separator.setAttribute('aria-hidden', 'true');
      contactLinks.appendChild(separator);
    }
    const link = printDocument.createElement('a');
    link.href = item.href;
    link.textContent = item.text;
    contactLinks.appendChild(link);
  }
  contact.append(contactName, contactLinks);
  printDocument.body.appendChild(contact);

  stylesheet.addEventListener('load', () => {
    printButton.disabled = false;
    printButton.textContent = language === 'de' ? 'Drucken / PDF speichern' : 'Print / Save as PDF';
  }, { once: true });
  stylesheet.addEventListener('error', () => {
    printWindow.alert(language === 'de'
      ? 'Das Drucklayout konnte nicht geladen werden. Bitte versuche es erneut.'
      : 'The print layout could not be loaded. Please try again.');
  }, { once: true });
  printDocument.head.appendChild(stylesheet);
  printWindow.focus();
}
