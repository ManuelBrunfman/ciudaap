# ────────────────────────────────────────────────────────────────
# export-bancaapp.ps1
# Empaqueta solo los archivos necesarios de BancaApp en un ZIP.
# Ejecuta con:
#   pwsh -ExecutionPolicy Bypass -File .\export-bancaapp.ps1
# ────────────────────────────────────────────────────────────────
$ErrorActionPreference = 'Stop'

$projectRoot = (Get-Item -Path $PSScriptRoot).FullName
$destDir     = Join-Path $projectRoot 'BancaApp_support'
$zipPath     = Join-Path $projectRoot 'BancaApp_support.zip'

# Limpia destino
if (Test-Path $destDir) { Remove-Item $destDir -Recurse -Force }
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
New-Item -ItemType Directory -Path $destDir | Out-Null

# Lista de archivos / carpetas a incluir
$include = @(
  'app.json',
  'package.json',
  'package-lock.json',      # cambia por yarn.lock / pnpm-lock.yaml si aplica
  'babel.config.js',
  '.env*',                  # variantes (.env.example, etc.) — nunca secretos reales
  'tsconfig.json',
  'metro.config.js',
  'eas.json',

  # Código fuente y recursos
  'src',
  'assets',

  # Configuración Android
  'android/app/build.gradle',
  'android/build.gradle',
  'android/gradle.properties',
  'android/settings.gradle',
  'android/gradle/wrapper/gradle-wrapper.properties',
  'android/gradle/wrapper/gradle-wrapper.jar',

  # Configuración iOS (si existe)
  'ios',

  # Otros
  '.expo',
  '.gitignore'
)

# Copia manteniendo estructura
foreach ($item in $include) {
  Get-ChildItem -Path (Join-Path $projectRoot $item) -Recurse -Force -ErrorAction SilentlyContinue |
    Copy-Item -Destination {
      $relative = $_.FullName.Substring($projectRoot.Length)
      Join-Path $destDir $relative.TrimStart('\')
    } -Force
}

# Crea el ZIP
Compress-Archive -Path (Join-Path $destDir '*') -DestinationPath $zipPath -Force

Write-Host "√ Listo: $zipPath"
