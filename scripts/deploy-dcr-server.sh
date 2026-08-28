#!/usr/bin/env bash
# scripts/deploy-dcr-server.sh
set -euo pipefail

# Deployed ein lokal gebautes Angular-Archiv in den KeyHelp-Webspace von Design. Code. Repeat.
# Dieses Script wird einmalig nach /usr/local/bin/deploy-dcr-frontend installiert und per sudo ausgefuehrt.

ARCHIVE="${1:-/tmp/dcr-frontend.tar.gz}"
WEB_DIR="/home/users/dcr/www/design-code-repeat.de"
WEB_USER="dcr"
WEB_GROUP="dcr"
TMP_DIR="$(mktemp -d /tmp/dcr-frontend.XXXXXX)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [[ "$(id -u)" -ne 0 ]]; then
  echo "[DCR][FEHLER] Dieses Script muss mit sudo/root ausgefuehrt werden." >&2
  exit 1
fi

if [[ ! -f "$ARCHIVE" ]]; then
  echo "[DCR][FEHLER] Build-Archiv nicht gefunden: $ARCHIVE" >&2
  exit 1
fi

if [[ ! -d "$WEB_DIR" ]]; then
  echo "[DCR][FEHLER] Webroot nicht gefunden: $WEB_DIR" >&2
  exit 1
fi

command -v tar >/dev/null 2>&1 || { echo "[DCR][FEHLER] tar fehlt." >&2; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "[DCR][FEHLER] rsync fehlt. Installation: sudo apt install -y rsync" >&2; exit 1; }

echo "[DCR] Build-Archiv entpacken..."
tar -xzf "$ARCHIVE" -C "$TMP_DIR"

if [[ ! -f "$TMP_DIR/index.html" ]]; then
  echo "[DCR][FEHLER] index.html fehlt im Build-Archiv." >&2
  exit 1
fi

echo "[DCR] Build nach $WEB_DIR spiegeln..."
rsync -a --delete --exclude='.well-known/' "$TMP_DIR/" "$WEB_DIR/"

echo "[DCR] Besitzer und Rechte korrigieren..."
chown -R "$WEB_USER:$WEB_GROUP" "$WEB_DIR"
find "$WEB_DIR" -type d -exec chmod 755 {} \;
find "$WEB_DIR" -type f -exec chmod 644 {} \;

rm -f "$ARCHIVE"

echo "[DCR] Deployment erfolgreich."
