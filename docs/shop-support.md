# DCR//TOOLS – Produktsupport

## Frontend
- Zentrale Route `/shop/support`, optionale Query-Parameter `product`, `type`, `version`.
- Produktslug und Anfrageart werden gegen den Katalog geprüft; keine personenbezogenen Daten oder Bestellreferenzen in URLs übernehmen.
- Aktuell nur lokale Validierung und Erstellung eines E-Mail-Entwurfs. Kein Ticket, keine Uploads und keine automatische Übermittlung. Anhänge fügt der Nutzer in seinem Mailprogramm hinzu.

## Backend-Anbindung
- Separates Supportmodell mit Ticketnummer, Anfrageart, Produktbezug, optionaler Version/Umgebung/Bestellreferenz, Nachricht, Status, Zeitstempeln und internen Notizen.
- Serverseitige Pflichtfeld-, Längen- und Produktvalidierung, Rate-Limits und Spam-Schutz. Keine unautorisierte Offenlegung von Bestelldaten.
- Screenshots als optionale private Uploads (PNG/JPEG/WebP; z. B. max. 3 Dateien, 10 MiB je Datei; Inhalt validieren, Malwareprüfung, Zugriffsrechte, Löschfristen). Keine Kundendokumente oder ausführbaren Dateien annehmen.
- Ticket erst nach erfolgreicher Speicherung bestätigen. Unverzügliche Eingangsbestätigung mit Ticketnummer und Benachrichtigung an den Entwickler über vorhandenen E-Mail-Dienst; Fehlerzustände und Wiederholung behandeln.
- Datenschutz vor Aktivierung um tatsächliche Verarbeitung, Rechtsgrundlagen, Empfänger und Aufbewahrung ergänzen.
- Supportverweise aus Produktdokumentation und Skriptoberflächen bei der nächsten Produktversion ergänzen.
