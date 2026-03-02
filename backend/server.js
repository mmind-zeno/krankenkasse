/**
 * KK-Check Backend — API + static frontend
 * Version 0.1.1
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kkcheck-dev-secret-change-in-production';
const DATA_DIR = path.join(__dirname, 'data');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');
const LOG_FILE = path.join(DATA_DIR, 'track.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readReminders() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(REMINDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeReminders(arr) {
  ensureDataDir();
  fs.writeFileSync(REMINDERS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

function appendLog(entry) {
  ensureDataDir();
  let log = [];
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf8');
    log = JSON.parse(raw);
  } catch {}
  log.push({ ...entry, ts: new Date().toISOString() });
  if (log.length > 5000) log = log.slice(-4000);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
}

function authAdmin(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Nicht angemeldet' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token ungültig' });
  }
}

app.use(cors());
app.use(express.json());

const staticDir = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(staticDir));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {};
    const last = Array.isArray(messages) && messages.length ? messages[messages.length - 1] : null;
    const userText = last?.role === 'user' ? last.content : '';
    const reply = userText
      ? `Sie haben gefragt: "${userText.slice(0, 100)}". Für eine vollständige KI-Antwort bitte Backend mit LLM-Anbindung konfigurieren. Vgl. KNOWLEDGE_BASE.md.`
      : 'Bitte stellen Sie eine Frage zu Franchise, Kassenwechsel oder Prämien in Liechtenstein.';
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ message: 'Chat fehlgeschlagen' });
  }
});

app.post('/api/reminder', (req, res) => {
  try {
    const { email, kasse, franchise, reminderDate } = req.body || {};
    if (!email) return res.status(400).json({ message: 'E-Mail fehlt' });
    const reminders = readReminders();
    reminders.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      email: email.trim(),
      kasse: kasse || null,
      franchise: franchise ?? null,
      reminderDate: reminderDate || null,
      createdAt: new Date().toISOString(),
    });
    writeReminders(reminders);
    res.json({ ok: true, message: 'Erinnerung gespeichert' });
  } catch (e) {
    res.status(500).json({ message: 'Reminder fehlgeschlagen' });
  }
});

app.post('/api/track', (req, res) => {
  try {
    const { event, payload } = req.body || {};
    appendLog({ event: event || 'event', payload: payload || {} });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Track fehlgeschlagen' });
  }
});

app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body || {};
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin';
    if (username === adminUser && password === adminPass) {
      const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token });
    }
    res.status(401).json({ message: 'Ungültige Anmeldedaten' });
  } catch (e) {
    res.status(500).json({ message: 'Login fehlgeschlagen' });
  }
});

app.get('/api/admin/stats', authAdmin, (req, res) => {
  try {
    const reminders = readReminders();
    let logCount = 0;
    try {
      const raw = fs.readFileSync(LOG_FILE, 'utf8');
      logCount = JSON.parse(raw).length;
    } catch {}
    res.json({
      remindersCount: reminders.length,
      trackEventsCount: logCount,
    });
  } catch (e) {
    res.status(500).json({ message: 'Stats fehlgeschlagen' });
  }
});

app.get('/api/admin/reminders', authAdmin, (req, res) => {
  try {
    const reminders = readReminders();
    res.json({ reminders });
  } catch (e) {
    res.status(500).json({ message: 'Reminders fehlgeschlagen' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`KK-Check backend v0.1.1 listening on port ${PORT}`);
});
