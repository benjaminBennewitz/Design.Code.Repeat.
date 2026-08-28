# Tools und Befehle

## Server starten - fester Port für Dev-Mode

```cmd
ng serve --port 4333
```

## Production-Build für KeyHelp-Deployment

```cmd
npm run build:production
```

Der auszuliefernde Frontend-Build liegt danach unter:

```txt
dist\design-code-repeat-studio\browser
```

Nur der Inhalt dieses `browser`-Ordners wird später auf den Server nach `/home/users/dcr/www/design-code-repeat.de/` gespiegelt. Repository-Dateien wie `README.md`, `LICENSE`, `src/`, `backend/`, `.git/` oder `node_modules/` werden nicht in den Webspace ausgeliefert.

`src/robots.txt` wird dagegen explizit durch Angular in den Build kopiert. Der aktuelle Vorab-Stand blockiert Crawler (`Disallow: /`) und setzt zusätzlich `noindex, nofollow` über den SEO-Service. Vor dem Launch muss das bewusst auf `Allow: /` beziehungsweise `index, follow` geändert werden.

## Neu bauen + Cache leeren

Wichtig, wenn Angular-/Build-Abhängigkeiten aktualisiert wurden oder alte Artefakte stören.

```cmd
ng cache clean
rmdir /s /q .angular\cache
rmdir /s /q dist
npm run build:production
```

## Doku

`tree.txt` erstellen, PowerShell im Projektordner öffnen und ausführen:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\make-tree.ps1 -Depth 10 -Files -OutFile .\tree.txt
```
