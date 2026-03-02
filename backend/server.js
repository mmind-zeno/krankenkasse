/**
 * KK-Check Backend — API + static frontend
 * Version 0.1.2
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kkcheck-dev-secret-change-in-production';
const DATA_DIR = path.join(__dirname, 'data');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');
const LOG_FILE = path.join(DATA_DIR, 'track.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const KNOWLEDGE_PATH = path.join(__dirname, 'knowledge-base.txt');

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

function readSettings() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeSettings(obj) {
  ensureDataDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

function readLog(limit = 200) {
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf8');
    const log = JSON.parse(raw);
    return log.slice(-limit).reverse();
  } catch {
    return [];
  }
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

const KNOWLEDGE_ZUSATZ_PATH = path.join(__dirname, 'knowledge-base-zusatz.txt');

function getKnowledgeBase() {
  let main = '';
  try {
    main = fs.readFileSync(KNOWLEDGE_PATH, 'utf8');
  } catch {
    main = 'Krankenversicherung Liechtenstein: Franchise, Selbstbehalt, Wechselfrist 30. November. Quelle ag.llv.li';
  }
  try {
    const zusatz = fs.readFileSync(KNOWLEDGE_ZUSATZ_PATH, 'utf8');
    return main + '\n\n' + zusatz;
  } catch {
    return main;
  }
}

function authAdmin(req, res, next) {
  const token = req.cookies?.admin_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token) return res.status(401).json({ message: 'Nicht angemeldet' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token ungültig' });
  }
}

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

const staticDir = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(staticDir));

// ——— Chat (optional LLM)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {};
    const last = Array.isArray(messages) && messages.length ? messages[messages.length - 1] : null;
    const userText = last?.role === 'user' ? last.content : '';
    const apiKey = process.env.OPENAI_API_KEY || readSettings().OPENAI_API_KEY;
    const knowledge = getKnowledgeBase();

    if (apiKey && userText) {
      const systemContent = `Du bist ein freundlicher Assistent für KK-Check (Krankenkasse Liechtenstein). Antworte kurz und sachlich auf Deutsch. Nutze dieses Wissen:\n${knowledge}`;
      const openaiMessages = [
        { role: 'system', content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: openaiMessages,
          max_tokens: 500,
        }),
      });
      if (r.ok) {
        const data = await r.json();
        const reply = data.choices?.[0]?.message?.content?.trim() || '';
        if (reply) return res.json({ reply });
      }
    }

    const reply = userText
      ? `Sie haben gefragt: "${userText.slice(0, 100)}". Für KI-Antwort OPENAI_API_KEY im Backend setzen. Siehe Admin → Einstellungen.`
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
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      return res.json({ token, ok: true });
    }
    res.status(401).json({ message: 'Ungültige Anmeldedaten' });
  } catch (e) {
    res.status(500).json({ message: 'Login fehlgeschlagen' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/stats', authAdmin, (req, res) => {
  try {
    const reminders = readReminders();
    let logCount = 0;
    try {
      logCount = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')).length;
    } catch {}
    res.json({ remindersCount: reminders.length, trackEventsCount: logCount });
  } catch (e) {
    res.status(500).json({ message: 'Stats fehlgeschlagen' });
  }
});

app.get('/api/admin/reminders', authAdmin, (req, res) => {
  try {
    res.json({ reminders: readReminders() });
  } catch (e) {
    res.status(500).json({ message: 'Reminders fehlgeschlagen' });
  }
});

app.get('/api/admin/users', authAdmin, (req, res) => {
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  res.json({ users: [{ username: adminUser, role: 'admin' }] });
});

app.get('/api/admin/logs', authAdmin, (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
    res.json({ logs: readLog(limit) });
  } catch (e) {
    res.status(500).json({ message: 'Logs fehlgeschlagen' });
  }
});

app.get('/api/admin/settings', authAdmin, (req, res) => {
  try {
    const s = readSettings();
    res.json({ settings: s });
  } catch (e) {
    res.status(500).json({ message: 'Settings fehlgeschlagen' });
  }
});

app.patch('/api/admin/settings', authAdmin, (req, res) => {
  try {
    const current = readSettings();
    const allowed = ['OPENAI_API_KEY', 'SMTP_HOST', 'SMTP_USER', 'SMTP_FROM'];
    const body = req.body || {};
    for (const k of allowed) {
      if (body[k] !== undefined) current[k] = body[k] === '' ? undefined : body[k];
    }
    writeSettings(current);
    res.json({ settings: current });
  } catch (e) {
    res.status(500).json({ message: 'Settings fehlgeschlagen' });
  }
});

app.get('/api/admin/data', authAdmin, (req, res) => {
  try {
    const premiumsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'premiums_2026.json');
    let meta = {};
    try {
      if (fs.existsSync(premiumsPath)) {
        const data = JSON.parse(fs.readFileSync(premiumsPath, 'utf8'));
        meta = data._meta || {};
      }
    } catch {}
    res.json({
      premiumsFile: 'frontend/src/data/premiums_2026.json',
      meta,
      note: 'Prämien im Repo mit ag.llv.li abgleichen. Nach Änderung neu deployen.',
    });
  } catch (e) {
    res.status(500).json({ message: 'Data fehlgeschlagen' });
  }
});

// Cron: Reminder-E-Mails versenden (CRON_SECRET erforderlich)
app.post('/api/cron/send-reminders', async (req, res) => {
  const secret = process.env.CRON_SECRET || '';
  if (secret && req.query.secret !== secret) return res.status(403).json({ message: 'Forbidden' });
  try {
    const reminders = readReminders();
    const today = new Date().toISOString().slice(0, 10);
    const due = reminders.filter((r) => r.reminderDate && r.reminderDate <= today && !r.sentAt);
    const smtpHost = process.env.SMTP_HOST || readSettings().SMTP_HOST;
    const smtpUser = process.env.SMTP_USER || readSettings().SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || readSettings().SMTP_PASS;
    const from = process.env.SMTP_FROM || readSettings().SMTP_FROM || smtpUser;

    let sent = 0;
    if (smtpHost && smtpUser && smtpPass && due.length > 0) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass },
      });
      for (const r of due) {
        try {
          await transporter.sendMail({
            from,
            to: r.email,
            subject: 'KK-Check Erinnerung: Kassenwechsel / Franchise',
            text: `Hallo,\n\nIhre Erinnerung für heute (KK-Check).\nKasse: ${r.kasse || '–'}, Franchise: ${r.franchise != null ? 'CHF ' + r.franchise : '–'}.\nWechselfrist: 30. November. https://krankenkasse.mmind.space\n\n– KK-Check`,
          });
          r.sentAt = new Date().toISOString();
          sent++;
        } catch (err) {}
      }
      writeReminders(reminders);
    }
    res.json({ ok: true, due: due.length, sent });
  } catch (e) {
    res.status(500).json({ message: 'Send fehlgeschlagen' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`KK-Check backend v0.1.2 listening on port ${PORT}`);
});
