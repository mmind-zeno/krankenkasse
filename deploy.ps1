# KK-Check v0.6.1 - Deploy auf Server (Kimai 91.107.195.127)
# SSH-Alias kimai nutzt Key ssh-kimai-zeno in ~/.ssh/config
# Nutzung: .\deploy.ps1   oder  .\deploy.ps1 -Host kimai -Path /opt/kk-check

param(
    [string]$DeployHost = $env:DEPLOY_HOST,
    [string]$Path = $env:DEPLOY_PATH
)
if (-not $DeployHost) { $DeployHost = "kimai" }
if (-not $Path) { $Path = "/opt/kk-check" }

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host "KK-Check v0.6.1 - Deploy zu $DeployHost : $Path" -ForegroundColor Green

Write-Host "[1/4] Frontend build..." -ForegroundColor Cyan
Push-Location $projectRoot\frontend
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

$deployDir = Join-Path $env:TEMP "kk-check-deploy"
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }
New-Item -ItemType Directory -Path $deployDir | Out-Null
New-Item -ItemType Directory -Path $deployDir\frontend\src | Out-Null
New-Item -ItemType Directory -Path $deployDir\backend | Out-Null

Write-Host "[2/4] Kopiere Dateien..." -ForegroundColor Cyan
Copy-Item $projectRoot\frontend\package.json $deployDir\frontend\
Copy-Item $projectRoot\frontend\package-lock.json $deployDir\frontend\ -ErrorAction SilentlyContinue
Copy-Item $projectRoot\frontend\index.html $deployDir\frontend\
Copy-Item $projectRoot\frontend\vite.config.js $deployDir\frontend\
Copy-Item $projectRoot\frontend\postcss.config.js $deployDir\frontend\
Copy-Item $projectRoot\frontend\tailwind.config.js $deployDir\frontend\
Copy-Item $projectRoot\frontend\src\* $deployDir\frontend\src\ -Recurse -Force
Copy-Item $projectRoot\frontend\dist $deployDir\frontend\dist -Recurse -Force
if (Test-Path $projectRoot\frontend\scripts) { Copy-Item $projectRoot\frontend\scripts $deployDir\frontend\ -Recurse -Force }
if (Test-Path $projectRoot\frontend\public) { Copy-Item $projectRoot\frontend\public $deployDir\frontend\ -Recurse -Force }
Copy-Item $projectRoot\backend\package.json $deployDir\backend\
Copy-Item $projectRoot\backend\package-lock.json $deployDir\backend\ -ErrorAction SilentlyContinue
Copy-Item $projectRoot\backend\server.js $deployDir\backend\
Copy-Item $projectRoot\backend\knowledge-base.txt $deployDir\backend\ -ErrorAction SilentlyContinue
Copy-Item $projectRoot\backend\knowledge-base-zusatz.txt $deployDir\backend\ -ErrorAction SilentlyContinue
if (Test-Path $projectRoot\backend\krankenkassen_Wissensdatenbank_Mrz2026) { Copy-Item $projectRoot\backend\krankenkassen_Wissensdatenbank_Mrz2026 $deployDir\backend\ -Recurse -Force }
if (Test-Path $projectRoot\backend\scripts) { Copy-Item $projectRoot\backend\scripts $deployDir\backend\ -Recurse -Force }
Copy-Item $projectRoot\Dockerfile $deployDir\
Copy-Item $projectRoot\docker-compose.yml $deployDir\
Copy-Item $projectRoot\.env.example $deployDir\ -ErrorAction SilentlyContinue

Write-Host "[3/4] Upload zu Server..." -ForegroundColor Cyan
$scpDest = $DeployHost + ":" + $Path + "/"
scp -r $deployDir\* $scpDest

Write-Host "[4/4] Docker auf Server starten..." -ForegroundColor Cyan
$remoteCmd = 'cd ' + $Path + '; docker compose build --no-cache; docker compose up -d'
ssh $DeployHost $remoteCmd

Remove-Item $deployDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Deploy abgeschlossen. App auf Port 3000." -ForegroundColor Green
