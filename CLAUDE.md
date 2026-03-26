# KK-Check Liechtenstein — CLAUDE.md

## Projektübersicht

Kostenloses Krankenversicherungs-Vergleichs- und Optimierungstool für Liechtenstein. Vergleicht die drei FL-Kassen (Concordia, FKB, SWICA) anhand offizieller Prämien des Amts für Gesundheit FL.

**Live:** https://krankenkasse.mmind.space
**Server:** Kimai (91.107.195.127) · `/opt/kk-check`
**Version:** 0.6.3 (aus `frontend/package.json` — `VERSION`-Datei veraltet)

---

## Stack

| Bereich | Technologie |
|--------|------------|
| Frontend | React 18 + React Router v6 + Vite 5 |
| Styling | Tailwind CSS v3 |
| Backend | Node.js 20 + Express 4 |
| Auth | JWT (Admin-Bereich) |
| Persistence | JSON-Dateien in `backend/data/` (kein DB) |
| E-Mail | Nodemailer (SMTP, z.B. Brevo) |
| Chat | OpenAI API (optional) |
| Deployment | Docker + Docker Compose + Caddy |

---

## Commands

```bash
# Frontend
cd frontend && npm run dev          # Dev-Server (Port 5173)
cd frontend && npm run build        # Produktions-Build (inkl. OG-Image)

# Backend
cd backend && node server.js        # API starten (Port 3000)

# Docker (lokal)
docker build -t kk-check:0.6.x .
docker compose up -d

# Deploy
./deploy.ps1                        # PowerShell: build → SCP → docker compose up -d
```

---

## Projektstruktur

```
krankenkasse/
├── frontend/src/
│   ├── pages/          # Public (10) + Admin (8) Seiten
│   ├── components/     # UI, Layout, Module, Chat, Admin
│   ├── data/           # JSON: premiums_2026, franchise_rules, FAQ, benefits
│   └── utils/
├── backend/
│   ├── server.js       # Express API (Hauptdatei)
│   ├── scripts/        # send-reminders.js (Cron)
│   ├── data/           # Laufzeit-JSON (reminders, track, feedback, settings)
│   └── krankenkassen_Wissensdatenbank_Mrz2026/  # Chat-Wissensbasis
├── deploy/
│   └── Caddyfile.snippet
├── Dockerfile          # Multi-stage: React-Build + Node-Runtime
├── docker-compose.yml  # Single Service kk-app, Port 3000
└── deploy.ps1
```

---

## API-Endpoints (Backend)

| Endpoint | Methode | Zweck |
|----------|---------|-------|
| `/api/chat` | POST | Chat (OpenAI) |
| `/api/reminder` | POST | E-Mail-Erinnerung registrieren |
| `/api/track` | POST | Nutzungs-Event loggen |
| `/api/feedback` | POST | Feedback speichern |
| `/api/admin/login` | POST | JWT-Login |
| `/api/admin/settings` | GET/POST | SMTP, OpenAI-Key |
| `/api/admin/reminders` | GET | Erinnerungsliste |
| `/api/admin/data/track` | GET | Nutzungslogs |
| `/api/admin/data/feedback` | GET | Feedback-Liste |
| `/api/cron/send-reminders` | POST | Cron-Job für Erinnerungen |

---

## Environment Variables

```env
# Pflicht
JWT_SECRET=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=

# Optional – Chat
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

# Optional – E-Mail
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Optional – Cron-Authentifizierung
CRON_SECRET=
```

---

## Kritische Regeln

- **Prämien-Daten** nur aus offiziellen FL-Quellen (`docs/okp-praemien-2026-llv-checked.md`) — niemals CH-Tarife.
- **Kassen:** Nur Concordia, FKB, SWICA — das sind die drei FL-zugelassenen OKP-Kassen.
- **Kein DB-Refactoring** ohne explizite Anfrage — JSON-Persistence ist bewusste Entscheidung.
- **Deploy-Verifikation:** Nach jedem Deploy `docker ps | grep kk-app && docker logs kk-app --tail 10` manuell prüfen.
- **`node_modules`** niemals aus Windows in Container kopieren — Docker baut im Container.
- **Volume-Pfad:** `/app/backend/data` muss gemountet bleiben (persistente Nutzerdaten).
- **FL-Kontext:** MwSt 8.1%, LI-Feiertage, LI-KVG-Logik — nicht CH-Werte verwenden.
