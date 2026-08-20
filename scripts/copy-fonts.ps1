param(
    [Parameter(Mandatory = $true)]
    [string]$PortfolioRoot
)

$ErrorActionPreference = 'Stop'

$sourceDirectory = Join-Path $PortfolioRoot 'src/assets/fonts'
$targetDirectory = Join-Path $PSScriptRoot '..\src\assets\fonts'
$requiredFonts = @(
    'inter-variable.ttf',
    'jetbrains-mono-variable.ttf',
    'material-symbols-outlined-latin-fill-normal.woff2'
)

if (-not (Test-Path $sourceDirectory)) {
    throw "Font-Ordner nicht gefunden: $sourceDirectory"
}

New-Item -ItemType Directory -Force -Path $targetDirectory | Out-Null

foreach ($font in $requiredFonts) {
    $source = Join-Path $sourceDirectory $font
    if (-not (Test-Path $source)) {
        throw "Erforderliche Font-Datei nicht gefunden: $source"
    }

    Copy-Item -Path $source -Destination (Join-Path $targetDirectory $font) -Force
}

Write-Host 'Lokale Studio-Fonts wurden übernommen.'
