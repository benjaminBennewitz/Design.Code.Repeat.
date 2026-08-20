# Phase 2 – Architekturentscheidung

## Abgrenzung zum Portfolio

Die Studio-Website ist kein zweiter Build des Portfolios. Sie besitzt eine eigenständige Angular-Codebasis und verwendet die Portfolio-Inhalte nur als fachliche Quelle für Leistungen und Referenzen.

### Bewusst übernommen

- `Design. Code. Repeat.` als verbindendes Branding
- B² als subtile persönliche Signatur
- Terminal-/Pixel-Motive
- harte Akzentfarben
- lokale Fonts
- Light/Dark Theme
- zweisprachiger Content
- Kontrastprinzip mit semantischen `on-*`-Tokens

### Bewusst reduziert

- keine globale Scroll-Lock-Experience
- kein Custom Cursor als Pflichtinteraktion
- keine Bootsequenz vor dem Content
- keine spielerischen Achievements
- keine stark experimentelle Navigation
- Animationen nur unterstützend, nicht als Bedienvoraussetzung

## Informationsarchitektur

Die Leistungen sind als echte Detailrouten modelliert. Dadurch bleiben Einstieg, interne Verlinkung und SEO klarer als bei einer einzigen langen Verkaufsseite.

Die Referenzseite fasst den geschäftlichen Kontext zusammen. Technische Tiefe und lange Case Studies verbleiben im persönlichen Portfolio und werden dorthin verlinkt.

## Content

DE/EN liegen in einem streng typisierten zentralen Contentmodell. Dadurch bleiben Komponenten strukturell identisch und sichtbare Texte werden nicht über mehrere Templates dupliziert.

## Formular

Das Angular-Frontend und Django-Backend teilen dasselbe Feldmodell semantisch, bleiben aber technisch unabhängig. Das Backend vertraut keinem Frontend-Validator und akzeptiert keine unbekannten Felder.
