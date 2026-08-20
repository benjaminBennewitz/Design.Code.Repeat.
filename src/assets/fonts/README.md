# Lokale Fonts

Die Anwendung erwartet diese bereits im Portfolio verwendeten lokalen Dateien in diesem Ordner:

- `inter-variable.ttf`
- `jetbrains-mono-variable.ttf`
- `material-symbols-outlined-latin-fill-normal.woff2`

Unter Windows können sie aus dem bestehenden Portfolio übernommen werden:

```powershell
.\scripts\copy-fonts.ps1 -PortfolioRoot "C:\Pfad\zum\Portfolio"
```

Die Dateinamen sind in `src/styles/tokens.scss` zentral referenziert.
