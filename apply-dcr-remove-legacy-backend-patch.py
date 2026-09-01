#!/usr/bin/env python3
# apply-dcr-remove-legacy-backend-patch.py

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT_MARKERS = ("README.md", ".gitignore", "angular.json", "package.json")
FILES = (
    Path(".gitignore"),
    Path("README.md"),
    Path("docs/phase-2-architecture.md"),
    Path("docs/security.md"),
    Path("tools.md"),
)


def detect_newline(text: str) -> str:
    return "\r\n" if "\r\n" in text else "\n"


def read_text(path: Path) -> tuple[str, str]:
    raw = path.read_bytes()
    has_bom = raw.startswith(b"\xef\xbb\xbf")
    if has_bom:
        raw = raw[3:]
    text = raw.decode("utf-8")
    return text, "\ufeff" if has_bom else ""


def write_text(path: Path, text: str, bom: str) -> None:
    data = text.encode("utf-8")
    if bom:
        data = b"\xef\xbb\xbf" + data
    path.write_bytes(data)


def replace_exact(text: str, old: str, new: str, label: str) -> tuple[str, bool]:
    if old not in text:
        print(f"[skip] {label}: bereits entfernt oder nicht vorhanden")
        return text, False

    print(f"[ok]   {label}")
    return text.replace(old, new, 1), True


def remove_markdown_h3_section_containing(text: str, needle: str, label: str) -> tuple[str, bool]:
    pattern = re.compile(
        r"(?ms)^### [^\r\n]+\r?\n"
        r"(?:(?!^### |^## ).)*?"
        + re.escape(needle)
        + r"(?:(?!^### |^## ).)*?"
        r"(?=^### |^## |\Z)"
    )

    updated, count = pattern.subn("", text, count=1)
    if count:
        print(f"[ok]   {label}")
        return updated, True

    print(f"[skip] {label}: kein eigener H3-Block gefunden")
    return text, False


def remove_fenced_block_containing(text: str, needle: str, label: str) -> tuple[str, bool]:
    pattern = re.compile(
        r"(?ms)^```[^\r\n]*\r?\n"
        r"(?:(?!^```\s*$).)*?"
        + re.escape(needle)
        + r"(?:(?!^```\s*$).)*?"
        r"^```\s*\r?\n?"
    )

    updated, count = pattern.subn("", text, count=1)
    if count:
        print(f"[ok]   {label}")
        return updated, True

    print(f"[skip] {label}: kein eigener Codeblock gefunden")
    return text, False


def patch_gitignore(root: Path) -> None:
    path = root / ".gitignore"
    text, bom = read_text(path)
    nl = detect_newline(text)

    legacy_lines = {
        "backend/.venv/",
        "backend/db.sqlite3",
        "backend/**/__pycache__/",
        "backend/**/*.pyc",
        "backend/.env",
    }

    lines = text.splitlines()
    updated_lines = [line for line in lines if line.strip() not in legacy_lines]

    if lines == updated_lines:
        print("[skip] .gitignore: keine Legacy-Backend-Regeln mehr vorhanden")
        return

    trailing = nl if text.endswith(("\n", "\r")) else ""
    write_text(path, nl.join(updated_lines) + trailing, bom)
    print("[ok]   .gitignore: Legacy-Backend-Regeln entfernt")


def patch_readme(root: Path) -> None:
    path = root / "README.md"
    text, bom = read_text(path)

    # Ausschließlich den expliziten alten H3-Abschnitt "Backend" entfernen.
    # Fachliche Django-/Backend-Texte der Website bleiben unangetastet.
    updated, count = re.subn(
        r"(?ms)^### Backend\s*\r?\n(?:(?!^### |^## ).)*(?=^### |^## |\Z)",
        "",
        text,
        count=1,
    )
    if count:
        print("[ok]   README: alter H3-Backend-Abschnitt entfernt")
        text = updated
    else:
        print("[skip] README: H3-Backend-Abschnitt bereits entfernt oder nicht vorhanden")

    # Backend-spezifischen lokalen Start-Codeblock entfernen.
    text, _ = remove_fenced_block_containing(
        text,
        "cd backend",
        "README: lokaler Backend-Startblock entfernt",
    )

    replacements = (
        (
            "├── backend/",
            "",
            "README: backend/ aus Projektbaum entfernt",
        ),
        (
            "`apiBaseUrl` bleibt standardmäßig `/api`, weil das Django-Backend in Produktion vorzugsweise über denselben Host und einen Reverse Proxy bereitgestellt wird.",
            "`apiBaseUrl` bleibt standardmäßig `/api`, damit das Frontend die zentrale Infrastructure API in Produktion weiterhin Same-Origin über den Apache-Reverse-Proxy erreicht. Die API ist nicht Bestandteil dieses Repositories.",
            "README: API-Architektur auf zentralen Service umgestellt",
        ),
        (
            "`backend/.env.production.example` nach `.env` kopieren und **alle Platzhalter sowie Secrets vor dem Start ersetzen**.",
            "Die produktive Konfiguration der zentralen Infrastructure API wird in deren eigenem Repository und ausschließlich über serverseitige Environment-Variablen gepflegt.",
            "README: alte Backend-Environment-Anweisung ersetzt",
        ),
        (
            "Nur der Inhalt des `browser`-Ordners wird in den öffentlichen KeyHelp-Webspace kopiert. Repository-Dateien wie `README.md`, `LICENSE`, `src/`, `backend/`, `.git/` oder `node_modules/` werden nicht ausgeliefert.",
            "Nur der Inhalt des `browser`-Ordners wird in den öffentlichen KeyHelp-Webspace kopiert. Repository-Dateien wie `README.md`, `LICENSE`, `src/`, `.git/` oder `node_modules/` werden nicht ausgeliefert.",
            "README: Deployment-Regel bereinigt",
        ),
        (
            "- Kontaktformular gegen Frontend- **und** Backend-Validierung",
            "- Kontaktformular mit Frontend-Validierung und zusätzlicher serverseitiger Validierung durch die zentrale Infrastructure API",
            "README: Security-Feature aktualisiert",
        ),
        (
            "Das Frontend wird nicht als Sicherheitsgrenze betrachtet. Das Django-Backend validiert alle Kontaktanfragen erneut, akzeptiert nur definierte Felder und übernimmt CSRF-, Rate-Limit- und Mail-Sicherheitslogik.",
            "Das Frontend wird nicht als Sicherheitsgrenze betrachtet. Die zentrale Infrastructure API validiert alle Kontaktanfragen erneut, akzeptiert nur definierte Felder und übernimmt CSRF-, Rate-Limit- und Mail-Sicherheitslogik.",
            "README: Security-Verantwortung aktualisiert",
        ),
    )

    for old, new, label in replacements:
        text, _ = replace_exact(text, old, new, label)

    # Leerzeile aus dem Projektbaum vermeiden, falls die entfernte Zeile allein stand.
    text = re.sub(r"(?m)^[ \t]*\r?\n(?=[│├└])", "", text)

    write_text(path, text, bom)


def patch_architecture(root: Path) -> None:
    path = root / "docs/phase-2-architecture.md"
    text, bom = read_text(path)

    old = (
        "Das Angular-Frontend und Django-Backend teilen dasselbe Feldmodell semantisch, "
        "bleiben aber technisch unabhängig. Das Backend vertraut keinem Frontend-Validator "
        "und akzeptiert keine unbekannten Felder."
    )
    new = (
        "Das Angular-Frontend und die zentrale Infrastructure API teilen dasselbe Feldmodell "
        "semantisch, bleiben aber technisch und repository-seitig unabhängig. Die API vertraut "
        "keinem Frontend-Validator und akzeptiert keine unbekannten Felder."
    )

    text, _ = replace_exact(
        text,
        old,
        new,
        "phase-2-architecture: zentrale API dokumentiert",
    )
    write_text(path, text, bom)


def patch_security(root: Path) -> None:
    path = root / "docs/security.md"
    text, bom = read_text(path)

    text, changed = replace_exact(
        text,
        "### Backend",
        "### Zentrale Infrastructure API",
        "security.md: Backend-Abschnitt umbenannt",
    )

    # Nur dokumentarische Technologie-Zuordnung bereinigen; fachliche Backend-Begriffe
    # in Leistungs-/Produkttexten bleiben unangetastet.
    text = text.replace("Django-Backend", "zentrale Infrastructure API")
    text = text.replace("Django Backend", "zentrale Infrastructure API")

    if not changed:
        print("[info] security.md: weitere API-Begriffe trotzdem normalisiert")

    write_text(path, text, bom)


def patch_tools(root: Path) -> None:
    path = root / "tools.md"
    text, bom = read_text(path)

    original = text
    text = text.replace("`backend/`, ", "")
    text = text.replace(", `backend/`", "")
    text = text.replace("backend/, ", "")
    text = text.replace(", backend/", "")

    if text == original:
        print("[skip] tools.md: keine Legacy-Backend-Auflistung gefunden")
    else:
        print("[ok]   tools.md: Legacy-Backend-Auflistung entfernt")

    write_text(path, text, bom)


def verify(root: Path) -> int:
    checks = {
        ".gitignore": [
            "backend/.venv/",
            "backend/db.sqlite3",
            "backend/**/__pycache__/",
            "backend/**/*.pyc",
            "backend/.env",
        ],
        "README.md": [
            "├── backend/",
            "cd backend",
            "backend/.env.production.example",
            "Das Django-Backend validiert",
        ],
        "docs/phase-2-architecture.md": [
            "Das Angular-Frontend und Django-Backend teilen",
        ],
        "docs/security.md": [
            "### Backend",
        ],
    }

    remaining: list[str] = []

    for relative, needles in checks.items():
        path = root / relative
        text, _ = read_text(path)
        for needle in needles:
            if needle in text:
                remaining.append(f"{relative}: {needle}")

    if remaining:
        print("\n[WARN] Folgende Legacy-Referenzen sind noch vorhanden:")
        for item in remaining:
            print(f"  - {item}")
        return 1

    print("\n[OK] Legacy-Backend-Referenzen der bereinigten DCR-Struktur sind entfernt.")
    print("[INFO] Fachliche Begriffe wie Frontend/Backend in Leistungs- und Marketingtexten bleiben bewusst bestehen.")
    return 0


def main() -> int:
    root = Path.cwd()

    missing = [marker for marker in ROOT_MARKERS if not (root / marker).exists()]
    if missing:
        print("Patch muss im Root von Design.Code.Repeat ausgeführt werden.")
        print("Fehlende Marker:", ", ".join(missing))
        return 2

    missing_files = [str(path) for path in FILES if not (root / path).exists()]
    if missing_files:
        print("Erwartete Dateien fehlen:", ", ".join(missing_files))
        return 2

    print("DCR Legacy-Backend Cleanup Patch")
    print("================================\n")

    patch_gitignore(root)
    patch_readme(root)
    patch_architecture(root)
    patch_security(root)
    patch_tools(root)

    return verify(root)


if __name__ == "__main__":
    sys.exit(main())
