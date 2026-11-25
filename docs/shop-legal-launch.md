# DCR//TOOLS – Rechtliche Freigabe vor Verkaufsstart

Stand: 25.11.2026. Dies ist eine interne Arbeitsgrundlage, keine Rechtsberatung und keine freigegebene Datenschutzerklärung.

## Stand der Vorschau

- Shop-Checkout und Widerruf sind rein lokal; keine echten Bestellungen oder Bestätigungen.
- Rechtstexte sind sichtbar als Entwürfe gekennzeichnet und nicht indexiert.
- Die Kontaktdaten wurden aus dem vorhandenen Impressum übernommen, nicht neu verifiziert.
- Der endgültige Vertragsschluss (ausdrückliche Annahme, nicht bloße Eingangsbestätigung), Lieferzeit, Umsatzsteuerstatus, Lizenzumfang und Supportzusage sind vor Freigabe festzulegen.
- Die Bestellseite muss vor Verkaufsstart von der Produkt-Slug-Demo auf einen geschützten individuellen Bestellzugang umgestellt werden.

## Backend-Widerruf (§ 356a BGB)

- Öffentlicher Zugang ohne Konto, Token, zwingende Bestellnummer oder Begründung. Eingaben: Name, Vertragsidentifizierung (auch Teilwiderruf), E-Mail für Bestätigung. Keine verpflichtende Datenschutzeinwilligung. Kein Identitätsnachweis als Zugangshürde.
- `POST /api/shop/withdrawals/` als vorgeschlagener Endpunkt; serverseitige Validierung, Missbrauchsschutz ohne unangemessene Hürden, CSRF entsprechend tatsächlicher Architektur. Zeitpunkt serverseitig speichern, Erklärung mit Inhalt unveränderbar dokumentieren. Keine personenbezogenen Daten in URL, Telemetrie oder Anwendungslogs.
- Bestätigung unverzüglich per E-Mail mit Inhalt der Erklärung und Datum/Uhrzeit des Eingangs; nicht erst nach manueller Prüfung. Versandfehler überwachen, erneute Zustellung zuverlässig veranlassen; niemals eine erfolgreiche Zustellung vortäuschen.
- Erklärung auch bei nicht unmittelbar zuordenbarer Bestellung annehmen; manuelle Zuordnung und rechtliche Prüfung anschließend. Keine Auskunft über fremde Bestellungen. Bestell-/Downloadberechtigung erst nach sicherer Zuordnung und angemessener Statusprüfung behandeln; keine automatische Erstattung durch unbestätigte Angaben.
- Bei wirksamem Widerruf Rückerstattung grundsätzlich binnen 14 Tagen. Rückerstattung und Zugangsstatus getrennt dokumentieren.
- Bei kostenpflichtigem digitalen Inhalt § 356 Abs. 6 BGB beachten: ausdrückliche Zustimmung, Kenntnisbestätigung, Vertragsbestätigung auf dauerhaftem Datenträger nach § 312f und tatsächlicher Beginn der Bereitstellung. Ohne Zustimmung reguläre Lieferung nach Fristablauf anbieten; keine pauschale Verzichtsklausel. Freischaltung und erste Bereitstellung serverseitig dokumentieren. Mängelrechte nicht ausschließen.

## Datenschutz – Textbaustein zur späteren Anpassung (nicht veröffentlichen, bevor technische Verarbeitung bestätigt wurde)

Für die Abwicklung deiner Bestellung verarbeiten wir die von dir angegebenen Kontakt- und Rechnungsdaten, die bestellten Produkte, den Kaufpreis sowie Bestell- und Zahlungsstatus. Bei SEPA-Vorkasse verarbeiten wir auch die zur Zuordnung des Zahlungseingangs und gegebenenfalls zur Erstattung erforderlichen Überweisungsdaten. Die Daten dienen Vertragsschluss, Vertragserfüllung, Rechnungsstellung und Support (Art. 6 Abs. 1 lit. b DSGVO), bei gesetzlichen Aufbewahrungspflichten Art. 6 Abs. 1 lit. c DSGVO. Bei Ansprechpartnern von Unternehmenskunden ist gegebenenfalls Art. 6 Abs. 1 lit. f DSGVO einschlägig.

Zur geschützten Bereitstellung werden eine individuelle Downloadberechtigung, deren Gültigkeit und erforderliche Abrufinformationen verarbeitet. Sicherheitsmaßnahmen und Missbrauchsschutz beruhen, soweit erforderlich, auf Art. 6 Abs. 1 lit. f DSGVO; die Bereitstellung selbst auf Art. 6 Abs. 1 lit. b DSGVO. Widerrufserklärungen, deren Eingangszeitpunkt und die zur Bestätigung und Rückabwicklung erforderlichen Daten werden zur Erfüllung gesetzlicher Pflichten bzw. zur Vertragsabwicklung verarbeitet (Art. 6 Abs. 1 lit. c und b DSGVO). Es werden keine Zahlungsdienstleister für den Checkout eingesetzt; beteiligte Banken verarbeiten Überweisungsdaten in eigener Verantwortung.

Vor Freigabe tatsächliche Empfänger (Hosting, Mail, Bank, ggf. Steuerberatung), Speicherfristen bzw. Kriterien, konkrete Logdaten und Sicherheitsmaßnahmen, gesetzliche Aufbewahrungsfristen, internationale Übermittlungen, AV-Verträge und Löschkonzept ergänzen. Datenschutztext in DE/EN synchronisieren. Keine nicht überprüften Zusagen über Datenhaltung machen.

## Quellen und Freigabe

- https://www.gesetze-im-internet.de/bgb/__356a.html – elektronische Widerrufsfunktion
- https://www.gesetze-im-internet.de/bgb/__356.html – Frist und Erlöschen
- https://www.gesetze-im-internet.de/bgbeg/art_253anlage_1.html – amtliches Muster der Widerrufsbelehrung (final korrekt ausfüllen)
- https://www.gesetze-im-internet.de/bgb/__327f.html – Aktualisierungen
- https://www.gesetze-im-internet.de/bgb/__357.html – Rückabwicklung

Vor Livebetrieb vollständige Pflichtinformationen nach EGBGB, Checkout, Vertragsbestätigung, Musterbelehrung einschließlich gesetzlichem Musterformular, Verbraucherstreitbeilegung, Preisangaben, Lizenz, Lieferbedingungen und ggf. BFSG-Anwendbarkeit prüfen. Rechtstexte sind Entwürfe. Demo-Kennzeichnung und noindex der Rechtstexte erst mit Freigabe entfernen. Der finale Widerrufsbutton muss ständig zugänglich und funktionsfähig sein. Keine Live-Verkäufe solange diese Voraussetzungen nicht erfüllt sind.
