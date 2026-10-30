# Sicherheit der Studio-Website

Diese Dokumentation beschreibt die Verantwortlichkeiten des DCR-Frontends und die Zusammenarbeit mit der separaten Infrastructure API. Interne Betriebsdetails und produktive Konfigurationswerte gehören nicht in diese Datei.

## Verantwortlichkeiten

Der Browser ist keine vertrauenswürdige Sicherheitsgrenze. Frontend-Prüfungen unterstützen die Bedienung; die API validiert eingehende Kontaktanfragen unabhängig davon.

Das Frontend verantwortet:

- verständliche Eingabe- und Fehlerhinweise;
- zugängliche Formularzustände;
- einen explizit aufgebauten Request;
- kontrollierten Versand und verständliche Statusmeldungen;
- die Anbindung an den serverseitigen CSRF-Schutz.

Die API verantwortet die verbindliche Validierung, Missbrauchsschutz und den Mailversand. Die ausführliche Backend-Dokumentation liegt im Infrastructure-API-Repository.

## Formular und API-Vertrag

Das Frontend erstellt ein fest definiertes Datenmodell. Zusätzliche Formularangaben werden innerhalb des vorgesehenen Nachrichtentexts zusammengeführt.

Empfänger, Absender und Mailbetreff werden serverseitig festgelegt. Das Frontend enthält keine Mailzugangsdaten und keine produktiven Geheimnisse.

Frontend und API verwenden denselben Website-Ursprung. Der ContactApiService holt den für den Versand benötigten CSRF-Token ab und hält ihn ausschließlich im Arbeitsspeicher. Er verhindert parallele Submits und begrenzt die Wiederholung nach einer CSRF-Ablehnung.

Der Versand besitzt eine Zeitbegrenzung und wird bei unklarem Ausgang nicht automatisch wiederholt. Das Formular berücksichtigt serverseitige Wartehinweise. Nur eine passende API-Bestätigung führt zum erfolgreichen Abschluss; bei Fehlern bleiben die Eingaben erhalten. Die endgültige Anfrage wird vor der Übertragung auf die vereinbarten Größenbeschränkungen geprüft.

## Eingaben und Darstellung

Formulare verwenden die vorhandenen Validierungen und führen Nutzereingaben als Daten. Die API prüft das erlaubte Feldmodell, Datentypen und fachliche Eingaben erneut.

Text-Reveals erzeugen Textknoten. Textinhalte werden dabei nicht als HTML interpretiert. Sicherheitsprüfungen des Frameworks werden im bestehenden Anwendungscode nicht durch Trust-Bypass-Aufrufe umgangen.

## Mail und Datenverarbeitung

Kontaktanfragen werden serverseitig als Klartext-Mail verarbeitet. Die validierte Besucheradresse dient als Antwortadresse. Die API legt Formularinhalte nicht in einer eigenen Datenbank ab; der Mailversand führt zur Verarbeitung im Mail-System.

Die eigenen strukturierten API-Zugriffslogs sind auf technische Metadaten ausgelegt. Angaben zur weiteren Verarbeitung und Aufbewahrung werden in der Datenschutzerklärung und der zuständigen Betriebsdokumentation gepflegt.

## Build und Betrieb

Der Angular-Production-Build verwendet die vorhandene automatische CSP-Erzeugung. Zusätzliche serverseitige Schutzmaßnahmen und die produktive Infrastruktur werden im jeweils zuständigen Repository dokumentiert.

Code und lokale Tests bestätigen die Implementierung. Die tatsächlich aktive Serverkonfiguration und die vollständige Mailzustellung müssen gesondert im Betriebsumfeld geprüft werden.

## Pflege

Bei Änderungen am Formular oder an der API-Anbindung werden Request-Modell, Validierung und Fehlerbehandlung gemeinsam geprüft. Änderungen am API-Vertrag werden zwischen beiden Projekten abgestimmt.

Geheimnisse und produktive Konfigurationsdateien bleiben außerhalb der versionierten Frontend-Codebasis. Dependencies werden gepflegt; Änderungen werden mit passenden Tests und einem Production-Build geprüft.
