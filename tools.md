# Tools und Befehle

## Server starten - fester Port fuer Dev-Mode

```cmd
ng serve --port 4333
```

## Production-Build fuer KeyHelp-Deployment

```cmd
npm run build:production
```

Der auszuliefernde Frontend-Build liegt danach unter:

```txt
dist\design-code-repeat-studio\browser
```

Nur der Inhalt dieses `browser`-Ordners wird spaeter auf den Server nach `/home/users/dcr/www/design-code-repeat.de/` gespiegelt. Repository-Dateien wie `README.md`, `LICENSE`, `src/`, `backend/`, `.git/` oder `node_modules/` werden nicht in den Webspace ausgeliefert.

`src/robots.txt` wird dagegen explizit durch Angular in den Build kopiert. Der aktuelle Vorab-Stand blockiert Crawler (`Disallow: /`) und setzt zusaetzlich `noindex, nofollow` ueber den SEO-Service. Vor dem Launch muss das bewusst auf `Allow: /` beziehungsweise `index, follow` geaendert werden.

## Frontend-Deployment auf KeyHelp-Webspace

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

## Angular-Deep-Links unter Apache / KeyHelp

Direkte Routenaufrufe wie `https://design-code-repeat.de/leistungen` muessen serverseitig auf `index.html` fallen, weil Angular das Routing im Browser uebernimmt.

Die Fallback-Regel liegt in:

```txt
src/.htaccess
```

`angular.json` kopiert diese Datei beim Production-Build automatisch in den Build-Root:

```txt
dist\design-code-repeat-studio\browser\.htaccess
```

Damit werden nur echte Angular-Routen auf `index.html` umgeleitet. Bestehende Dateien, Verzeichnisse, `/api/...` und Asset-Dateien bleiben unberuehrt.

Nach Aenderungen an `.htaccess` immer neu builden und deployen:

```cmd
npm run build:production
scripts\deploy-dcr-local.cmd
```

## Kontaktformular / Django-API Deployment

Das Kontaktformular sendet aus Angular an same-origin API-Endpunkte:

```txt
/api/csrf/
/api/contact/
```

Das Django-Backend wird nicht im Webroot abgelegt. Lokal wird nur der Ordner `backend/` gepackt und auf dem Server als systemd-Service unter `/srv/dcr/contact-api/current/` betrieben.

Laufzeitpfade auf dem Server:

```txt
/srv/dcr/contact-api/current/       # Backend-Code
/srv/dcr/contact-api/.venv/         # Python-Virtualenv
/etc/dcr/contact-api.env            # Production-Secrets und SMTP-Konfiguration
/usr/local/bin/deploy-dcr-contact-api
/etc/systemd/system/dcr-contact-api.service
```

Einmalige Installation des Backend-Deploy-Scripts:

```cmd
scp -i "%USERPROFILE%\.ssh\dcr_vserver_werbung06" scripts\deploy-dcr-backend-server.sh ben@159.195.54.12:/tmp/deploy-dcr-backend-server.sh
ssh -i "%USERPROFILE%\.ssh\dcr_vserver_werbung06" ben@159.195.54.12
```

Auf dem Server:

```bash
sudo apt install -y python3-venv rsync
sudo install -m 755 /tmp/deploy-dcr-backend-server.sh /usr/local/bin/deploy-dcr-contact-api
```

Regulaeres Backend-Deployment lokal aus dem Projektordner:

```cmd
scripts\deploy-dcr-backend-local.cmd
```

Beim ersten Lauf erzeugt das Server-Script automatisch die Datei:

```txt
/etc/dcr/contact-api.env
```

Danach muessen dort die Platzhalter ersetzt werden:

```bash
sudo nano /etc/dcr/contact-api.env
```

Pflichtwerte:

```txt
DJANGO_SECRET_KEY
CONTACT_RECIPIENT
DEFAULT_FROM_EMAIL
SMTP_HOST
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
```

Danach das Backend-Deployment erneut lokal starten:

```cmd
scripts\deploy-dcr-backend-local.cmd
```

Service pruefen:

```bash
sudo systemctl status dcr-contact-api --no-pager
sudo journalctl -u dcr-contact-api -n 80 --no-pager
curl -i -H "Host: design-code-repeat.de" http://127.0.0.1:8101/api/csrf/
```

### Apache-/KeyHelp-Proxy fuer `/api`

Damit `https://design-code-repeat.de/api/...` beim Django-Service landet, muss fuer die Domain `design-code-repeat.de` in KeyHelp unter den Apache-Einstellungen ein Proxy auf `127.0.0.1:8101` gesetzt werden.

Vorher Apache-Module aktivieren:

```bash
sudo a2enmod proxy proxy_http
sudo systemctl reload apache2
```

KeyHelp-Domain `design-code-repeat.de` bearbeiten, Reiter `Apache-Einstellungen`, dort als zusaetzliche Apache-Direktiven fuer diese Domain eintragen:

```apache
ProxyPreserveHost On
ProxyPass /api/ http://127.0.0.1:8101/api/
ProxyPassReverse /api/ http://127.0.0.1:8101/api/
```

Danach speichern und extern testen:

```cmd
curl -I https://design-code-repeat.de/api/csrf/
```

Erwartet wird `200 OK` und ein `Set-Cookie` fuer `csrftoken`. Erst danach ist der Formularversand produktiv testbar.

## Neu bauen + Cache leeren

Wichtig, wenn Angular-/Build-Abhaengigkeiten aktualisiert wurden oder alte Artefakte stoeren.

```cmd
ng cache clean
rmdir /s /q .angular\cache
rmdir /s /q dist
npm run build:production
```

## Doku

`tree.txt` erstellen, PowerShell im Projektordner oeffnen und ausfuehren:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\make-tree.ps1 -Depth 10 -Files -OutFile .\tree.txt
```
