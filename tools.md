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


## Deployment auf KeyHelp-Webspace

Das Repository wird nicht auf dem Server gebaut. Lokal wird der Angular-Production-Build erstellt, als Archiv gepackt und auf den Server geladen. Das Server-Script entpackt nur den fertigen Build und spiegelt ihn in den KeyHelp-Webspace.

Zielpfad auf dem Server:

```txt
/home/users/dcr/www/design-code-repeat.de/
```

Build-Quelle lokal:

```txt
dist\design-code-repeat-studio\browser
```

Einmalige Installation des Server-Scripts:

```cmd
scp -i "%USERPROFILE%\.ssh\dcr_vserver_werbung06" scripts\deploy-dcr-server.sh ben@159.195.54.12:/tmp/deploy-dcr-server.sh
ssh -i "%USERPROFILE%\.ssh\dcr_vserver_werbung06" ben@159.195.54.12
```

Auf dem Server:

```bash
sudo install -m 755 /tmp/deploy-dcr-server.sh /usr/local/bin/deploy-dcr-frontend
sudo apt install -y rsync
```


Hinweis fuer Windows-Batch-Scripte: `npm` wird als `npm.cmd` ausgefuehrt. Deshalb muessen npm-Befehle innerhalb von `.cmd`-Dateien mit `call` gestartet werden, sonst endet das Deploy-Script direkt nach `npm ci`.

Regulaeres Frontend-Deployment lokal aus dem Projektordner:

```cmd
scripts\deploy-dcr-local.cmd
```

Der Ablauf ist bewusst zweigeteilt:

```txt
Lokal:  git pull -> npm ci -> npm run build:production -> tar.gz -> scp
Server: tar.gz entpacken -> rsync in Webroot -> chown dcr:dcr -> Rechte setzen
```

`README.md`, `LICENSE`, `src/`, `backend/`, `.git/` und `node_modules/` werden dabei nicht ausgeliefert. Im Webroot landet nur der Inhalt des Angular-Build-Ordners.

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
