# Architektur der Studio-Website

Diese Datei beschreibt den aktuellen Aufbau von Design. Code. Repeat.

## Zweck und Abgrenzung

Die Studio-Website präsentiert Leistungen, Referenzen und Kontaktmöglichkeiten. Sie besitzt eine eigenständige Angular-Codebasis und teilt Branding und fachliche Inhalte mit dem persönlichen Portfolio.

Die Gestaltung kombiniert Terminal- und Pixel-Motive mit lokalen Fonts, klarer Typografie, Light/Dark Theme und semantischen Farb-Tokens. Animationen unterstützen die Präsentation und dürfen die Bedienbarkeit nicht voraussetzen.

## Struktur und Verantwortlichkeiten

- `core/`: typisierte Inhaltsmodelle, DE/EN-Inhalte und zentrale Services.
- `layout/`: Header, Footer und globale Bedienhilfen.
- `pages/`: Seiten und deren routenspezifische Darstellung.
- `shared/`: wiederverwendbare Komponenten und Direktiven.
- `styles/`: Design-Tokens, grundlegende Regeln und gemeinsam verwendete Styles.

Neue Funktionen nutzen vorhandene Services, Komponenten und Design-Tokens. Seitenspezifische Logik bleibt bei der zuständigen Seite oder Komponente.

## Navigation und Inhalte

Seiten werden über eigenständige Routen geladen. Leistungen besitzen Detailseiten; Intranet und Design-Archiv haben eigene Case-Study-Routen innerhalb der Studio-Website.

Die sichtbaren Inhalte werden zentral und typisiert für Deutsch und Englisch gepflegt. Komponenten behalten bei einem Sprachwechsel dieselbe Struktur.

SEO-Metadaten werden über den vorhandenen SEO-Service gepflegt. Interne Links verbinden fachlich passende Leistungen, Referenzen und Kontaktmöglichkeiten.

## Darstellung und Bewegung

Der normale Body-Scroll steuert die Seite. Einzelne Bereiche können zusätzliche Scroll-Interaktionen verwenden. Der Start-Loader wird mit dem Angular-Start koordiniert.

Der gemeinsame ScrollRevealService aktiviert Text-, Inhalts- und Referenzkarten-Reveals einmalig. Bereits übersprungene Inhalte werden ebenfalls aufgedeckt. Die TextRevealDirective ergänzt die wortweise Textdarstellung.

Reduzierte Bewegung und die vorhandenen Accessibility-Einstellungen werden berücksichtigt. Inhalte müssen lesbar und interaktive Elemente per Tastatur erreichbar bleiben.

## Kontaktformular

Das Frontend übernimmt Eingabehilfen, Validierung für die Bedienung, Versandstatus und verständliche Fehlermeldungen. Der ContactApiService kapselt die Kommunikation mit der separaten Infrastructure API.

Die API verantwortet die verbindliche Prüfung und den Mailversand. Ihre Implementierung und Betriebsdokumentation werden im eigenen Repository gepflegt. Frontend und API werden über denselben Website-Ursprung angesprochen.

## Pflege

Änderungen führen die bestehende Architektur fort und bleiben auf die betroffenen Verantwortlichkeiten begrenzt. Für funktionale Änderungen werden passende Tests und ein Production-Build ausgeführt. UI-Änderungen werden zusätzlich auf responsive Darstellung, Themes und Barrierefreiheit geprüft.
