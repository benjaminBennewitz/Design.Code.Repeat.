@REM scripts/deploy-dcr-local.cmd
@echo off
setlocal EnableExtensions

REM Baut das Angular-Frontend lokal, packt nur den Browser-Build und startet das Server-Deployment.
REM Voraussetzung: OpenSSH-Client, scp, ssh, tar, Node/npm und Git sind lokal verfuegbar.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%.."
set "BUILD_DIR=%PROJECT_DIR%\dist\design-code-repeat-studio\browser"
set "ARCHIVE=%TEMP%\dcr-frontend.tar.gz"
set "SSH_KEY=%USERPROFILE%\.ssh\dcr_vserver_werbung06"
set "SERVER_USER=ben"
set "SERVER_HOST=159.195.54.12"
set "SERVER_ARCHIVE=/tmp/dcr-frontend.tar.gz"
set "SERVER_DEPLOY=/usr/local/bin/deploy-dcr-frontend"

cd /d "%PROJECT_DIR%" || exit /b 1

echo.
echo [DCR] Git aktualisieren...
git pull --ff-only || exit /b 1

echo.
echo [DCR] Dependencies installieren...
npm ci || exit /b 1

echo.
echo [DCR] Production-Build erstellen...
npm run build:production || exit /b 1

if not exist "%BUILD_DIR%\index.html" (
  echo.
  echo [DCR][FEHLER] Build-Output wurde nicht gefunden: %BUILD_DIR%\index.html
  exit /b 1
)

if exist "%ARCHIVE%" del /f /q "%ARCHIVE%"

echo.
echo [DCR] Build-Archiv erstellen...
tar -czf "%ARCHIVE%" -C "%BUILD_DIR%" . || exit /b 1

echo.
echo [DCR] Build-Archiv auf den Server hochladen...
scp -i "%SSH_KEY%" "%ARCHIVE%" %SERVER_USER%@%SERVER_HOST%:%SERVER_ARCHIVE% || exit /b 1

echo.
echo [DCR] Server-Deployment starten...
ssh -t -i "%SSH_KEY%" %SERVER_USER%@%SERVER_HOST% "sudo %SERVER_DEPLOY% %SERVER_ARCHIVE%" || exit /b 1

if exist "%ARCHIVE%" del /f /q "%ARCHIVE%"

echo.
echo [DCR] Deployment abgeschlossen: https://design-code-repeat.de
endlocal
