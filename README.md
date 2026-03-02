# KK-Check Liechtenstein

**Version 0.1.1** — Krankenkassen-Prämien, Franchise-Optimizer, Kassenvergleich für Liechtenstein.

- **Live:** [krankenkasse.mmind.space](https://krankenkasse.mmind.space) (nach Deploy)
- Gratis, ohne Anmeldung.

## Lokal starten

```bash
# Frontend
cd frontend && npm install && npm run dev   # http://localhost:5173

# Backend (API + statisches Frontend)
cd backend && npm install
# Zuerst Frontend bauen: cd frontend && npm run build
node server.js   # http://localhost:3000
```

## Docker (ein Container: Frontend-Build + Backend)

```bash
docker build -t kk-check:0.1.0 .
docker run -p 3000:3000 -e JWT_SECRET=xxx -e ADMIN_PASSWORD=xxx kk-check:0.1.0
```

## Live-Deploy

1. **Server:** Docker installiert, SSH-Zugang (z.B. `root@91.107.195.127`). SSH-Key in `~/.ssh/` oder Host in `~/.ssh/config` eintragen.
2. **Auf dem Server:** Verzeichnis anlegen, z.B. `mkdir -p /opt/krankenkasse`. Optional `.env` anlegen (JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD).
3. **Deploy ausführen (PowerShell):**

```powershell
$env:DEPLOY_HOST = "root@91.107.195.127"   # oder dein SSH-Host aus .ssh/config
.\deploy.ps1
```

Optional: `.\deploy.ps1 -Host "root@91.107.195.127" -Path "/opt/krankenkasse"`

Das Skript baut das Frontend, kopiert alle Dateien auf den Server und startet dort `docker compose up -d`. Die App laeuft als Container **kk-app** auf Port 3000 und ist im Caddy-Netzwerk. **Nach dem ersten Deploy (ein Container statt kk-frontend/kk-backend):** Caddy anpassen — siehe `deploy/Caddyfile.snippet` — damit krankenkasse.mmind.space auf `kk-app:3000` zeigt; danach Caddy-Container neu starten.

## Version

- **V0.1.1** — Stand: siehe `VERSION` und `frontend/package.json` / `backend/package.json`.
