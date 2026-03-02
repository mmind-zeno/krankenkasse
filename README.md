# KK-Check Liechtenstein

**Version 0.1.4** — Krankenkassen-Prämien, Franchise-Optimizer, Kassenvergleich für Liechtenstein.

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

**OG-Image:** Wird beim Frontend-Build erzeugt (`npm run generate:og` → `frontend/public/og-image.png`, 1200×630).

### Cron: Erinnerungsmails

Erinnerungs-E-Mails werden über den Endpoint `POST /api/cron/send-reminders` ausgelöst. Auf dem Server in der `.env` (oder Docker-Umgebung) setzen:

- `CRON_SECRET` — Geheimnis für den Cron-Aufruf (beliebiger langer String)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (optional `SMTP_PORT`, `SMTP_SECURE`) — für den E-Mail-Versand

Beispiel Cron (täglich 9:00 Uhr, auf dem Server oder von außen):

```bash
0 9 * * * curl -s -X POST "https://krankenkasse.mmind.space/api/cron/send-reminders?secret=DEIN_CRON_SECRET"
```

Alternativ im Container: `docker exec kk-app node /app/backend/scripts/send-reminders.js` (täglich per Cron auf dem Host ausführen).

## Version

- **V0.1.4** — Stand: siehe `VERSION` und `frontend/package.json` / `backend/package.json`.
