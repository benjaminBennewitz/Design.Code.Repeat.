# Security-Konzept

## Vertrauensgrenzen

Der Browser ist nicht vertrauenswürdig. Jede Anfrage an `/api/contact/` wird daher so behandelt, als wäre sie manuell konstruiert worden.

### Frontend

Das Angular-Formular übernimmt ausschließlich UX-Aufgaben:

- Required-, Format- und Längenhinweise
- Accessibility-Zuordnung mit `aria-invalid`/Fehlertexten
- Honeypot
- Timing-Heuristik
- Normalisierung von Whitespace und E-Mail-Adresse
- explizites `ContactRequest`-Payload ohne DOM-/Form-Zusatzdaten

Diese Prüfungen dürfen serverseitig niemals vorausgesetzt werden.

### Backend

Das Django-API erzwingt unabhängig vom Frontend:

1. CSRF-Prüfung für `POST`
2. `application/json`
3. maximales Request-Body-Limit
4. JSON-Objekt als Root
5. exakt fünf erlaubte Felder
6. ausschließlich String-Werte
7. serverseitige Feld-/Längen-/E-Mail-/Enum-Validierung
8. Rate Limit
9. Plain-Text-Mail ohne Nutzereingaben in Header-Betreff
10. keine Persistenz des Formularinhalts

## CSRF / XSRF

`GET /api/csrf/` setzt mit Djangos `ensure_csrf_cookie` einen CSRF-Cookie. Angular ist mit `csrftoken` und `X-CSRFToken` konfiguriert und initialisiert den Cookie unmittelbar vor einem Submit.

`csrf_exempt` wird bewusst **nicht** verwendet.

Im Produktionsbetrieb müssen Frontend und API über dieselbe vertrauenswürdige Origin ausgeliefert werden. Falls ein Reverse Proxy eingesetzt wird, muss dessen HTTPS-/Host-Konfiguration korrekt sein.

## Rate Limiting

Der öffentliche Endpunkt verwendet einen gehashten Client-Identifier als Cache-Key. Standard sind 8 Requests pro Stunde.

- Entwicklung: `LocMemCache`
- Produktion mit mehreren Workern: Redis über `DJANGO_REDIS_URL`

`X-Real-IP` wird standardmäßig ignoriert. `CONTACT_TRUST_X_REAL_IP=true` darf nur gesetzt werden, wenn der Reverse Proxy diesen Header zuverlässig überschreibt und Direktzugriff auf den App-Server verhindert.

## Mail

Kontaktanfragen werden nicht als HTML gerendert. Der Nachrichtentext wird als `text/plain` versendet.

- Betreff basiert ausschließlich auf einem serverseitigen Topic-Mapping.
- `reply_to` nutzt die zuvor serverseitig validierte E-Mail-Adresse.
- Django übernimmt zusätzlich CRLF-/Header-Validierung.
- Mailfehler werden ohne Formularinhalt geloggt.

## HTTP-Härtung

Django konfiguriert:

- `SECURE_CONTENT_TYPE_NOSNIFF`
- `SECURE_REFERRER_POLICY`
- `SECURE_CROSS_ORIGIN_OPENER_POLICY`
- `X_FRAME_OPTIONS = DENY`
- Secure-CSRF-Cookie außerhalb Debug
- optional HSTS nach bewusster Aktivierung
- HTTPS-Redirect außerhalb Development, konfigurierbar für Reverse-Proxy-Setups

Angular aktiviert `security.autoCsp`. Das Deployment-Beispiel ergänzt auf Reverse-Proxy-Ebene eine separate Trusted-Types-Policy; die Angular-CSP für Script-Quellen bleibt weiterhin Aufgabe des CLI-Builds.

## Datenschutz / Logs

Das Contact-API speichert Kontaktanfragen nicht in einer Datenbank. Logmeldungen enthalten bewusst weder Name, E-Mail, Unternehmen noch Nachricht.

Server-/Proxy-Access-Logs können trotzdem IP-/Request-Metadaten enthalten. Aufbewahrung, Rechtsgrundlage und Logformat müssen vor dem echten Go-live zum finalen Hosting-Setup passend dokumentiert und konfiguriert werden.

## Produktionscheck

- [ ] `DJANGO_DEBUG=false`
- [ ] zufälliger `DJANGO_SECRET_KEY`
- [ ] exakte `DJANGO_ALLOWED_HOSTS`
- [ ] nur notwendige `DJANGO_CSRF_TRUSTED_ORIGINS`
- [ ] HTTPS aktiv
- [ ] Proxy-Header-Vertrauen korrekt konfiguriert
- [ ] SMTP nur via TLS/SSL
- [ ] Redis für Multi-Worker-Rate-Limit
- [ ] Nginx `client_max_body_size` aktiv
- [ ] HSTS erst nach finaler HTTPS-Prüfung aktivieren
- [ ] keine Secrets im Git-Repository
- [ ] Dependency-/Security-Updates regelmäßig einspielen
- [ ] Impressum/Datenschutz mit realen Daten rechtlich prüfen

## Trusted Types und CSP

Der Angular-Build nutzt `security.autoCsp`. Das Nginx-Beispiel ergänzt serverseitig `require-trusted-types-for 'script'` mit den Angular-Policies `angular` und `angular#bundler`. Letztere wird wegen des Lazy Routings benötigt. Im Anwendungscode werden keine `bypassSecurityTrust*`-APIs eingesetzt.
