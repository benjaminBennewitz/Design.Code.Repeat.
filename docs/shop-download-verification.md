# DCR//TOOLS – Paketprüfung und geschützte Downloads

## Aktueller Frontend-Stand

Nur öffentliche WebP-Muster werden per HTTP abgerufen, mit der bekannten SHA-256-Prüfsumme verglichen und bei Übereinstimmung über eine temporäre Blob-URL zum Speichern angeboten. Kein Virenscan, keine simulierte Erfolgsmeldung, keine bezahlte ZIP-Datei im Webroot. HTTPS bzw. localhost ist für Web Crypto nötig. Bei geändertem Muster die Referenzwerte in `shop-sample-hashes.data.ts` aus den finalen Bytes neu erzeugen. Die Manifestdaten von Year Grid 0.1.8 stammen aus dem gelieferten Archiv.

## Spätere Django-Integration

1. ZIP ausschließlich im privaten Storage ablegen. Dateigröße, SHA-256, Manifest und Version serverseitig ermitteln. Archivpfade, erlaubte Dateitypen, Größenlimits und ZIP-Bomben prüfen. Keine ungeprüften Inhalte extrahieren oder ausführen.
2. Optional echte Malwareprüfung z. B. mit lokal betriebenem ClamAV bei Freigabe. Scanstatus (pending/clean/infected/error), geprüfter Hash, Zeitpunkt und Signaturstand speichern. Nur geprüfte, unveränderte Releases freigeben. Bei Fehler oder veralteter Prüfung keine positive Scanmeldung.
3. Vor dem Download serverseitig prüfen: Bestellberechtigung, Zahlung, tatsächliche Bereitstellungsberechtigung, Ablauf, Sperrung, Abruflimit und unveränderte Datei. Token nicht protokollieren, Cache-Control: no-store, Referrer-Policy: no-referrer. Keine öffentliche Storage-URL.
4. Ein authentisierter, CSRF-geschützter POST im bestehenden Bestellkontext kann einen kurzlebigen Download-Grant ausstellen. Die Antwort enthält nur die tatsächlichen Prüfergebnisse; ein mögliches Schema ist `{ integrity: "verified", malware: "clean" | "not_scanned", checked_at, download_url }`. Das ist ein Vorschlag, keine vorhandene API. Bei Fehlern bleibt der Download gesperrt. Keine Scanmeldung, wenn nur Hash/Verfügbarkeit geprüft wurden.
5. Der eigentliche Download-Endpunkt prüft alle Berechtigungen erneut und verbraucht das Abrufkontingent transaktionssicher. Datei streamen, nicht in Angular laden. Keine Weitergabe der ZIP-URL in öffentliche Produktdaten. Native Browser-Speicherfunktion verwenden.
6. UI-Text bei echter Prüfung: „Paket geprüft – keine bekannten Bedrohungen erkannt (Stand …)“. Kein Versprechen vollständiger Schadcodefreiheit; bei fehlendem Scan „Dateiintegrität geprüft“.

Das hochgeladene Produktpaket ist ein Prototyp und wird durch diesen Frontend-Patch nicht käuflich oder öffentlich herunterladbar. Die echte serverseitige Prüfung wird erst mit dem separaten Shop-Backend implementiert.
