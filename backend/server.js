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
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
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

function readFeedback() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function appendFeedback(entry) {
  ensureDataDir();
  const list = readFeedback();
  list.push({ ...entry, ts: new Date().toISOString() });
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function getUsageByDay(limitDays = 30) {
  let log = [];
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf8');
    log = JSON.parse(raw);
  } catch {
    return [];
  }
  const byDay = {};
  const cut = new Date();
  cut.setDate(cut.getDate() - limitDays);
  const cutStr = cut.toISOString().slice(0, 10);
  for (const e of log) {
    const ts = e.ts || '';
    const date = ts.slice(0, 10);
    if (date < cutStr) continue;
    if (!byDay[date]) byDay[date] = { date, uniqueClients: new Set(), totalEvents: 0, byEvent: {} };
    byDay[date].totalEvents += 1;
    const cid = e.payload?.clientId;
    if (cid) byDay[date].uniqueClients.add(cid);
    const ev = e.event || 'unknown';
    byDay[date].byEvent[ev] = (byDay[date].byEvent[ev] || 0) + 1;
  }
  return Object.keys(byDay)
    .sort()
    .reverse()
    .slice(0, limitDays)
    .map((d) => ({
      date: d,
      uniqueUsers: byDay[d].uniqueClients.size,
      totalEvents: byDay[d].totalEvents,
      byEvent: byDay[d].byEvent,
    }));
}

const KNOWLEDGE_ZUSATZ_PATH = path.join(__dirname, 'knowledge-base-zusatz.txt');
const WISSENSDATENBANK_DIR = path.join(__dirname, 'krankenkassen_Wissensdatenbank_Mrz2026');
const KNOWLEDGE_MAX_CHARS = 100000;

function readWissensdatenbank() {
  let out = '';
  if (!fs.existsSync(WISSENSDATENBANK_DIR)) return out;
  const files = [];
  function walk(dir) {
    try {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (name.endsWith('.md')) files.push(full);
      }
    } catch {
      // ignore
    }
  }
  walk(WISSENSDATENBANK_DIR);
  files.sort();
  for (const f of files) {
    if (out.length >= KNOWLEDGE_MAX_CHARS) break;
    try {
      const rel = path.relative(WISSENSDATENBANK_DIR, f);
      const text = fs.readFileSync(f, 'utf8');
      out += `\n\n--- ${rel} ---\n\n` + text.slice(0, KNOWLEDGE_MAX_CHARS - out.length);
    } catch {
      // skip
    }
  }
  return out.trim();
}

function getKnowledgeBase() {
  let main = '';
  try {
    main = fs.readFileSync(KNOWLEDGE_PATH, 'utf8');
  } catch {
    main = 'Krankenversicherung Liechtenstein: Franchise, Selbstbehalt, Wechselfrist 30. November. Quelle ag.llv.li';
  }
  try {
    const zusatz = fs.readFileSync(KNOWLEDGE_ZUSATZ_PATH, 'utf8');
    main = main + '\n\n' + zusatz;
  } catch {}
  const wdb = readWissensdatenbank();
  if (wdb) main = main + '\n\n## Wissensdatenbank Zusatzversicherungen (FKB, Concordia, SWICA Liechtenstein)\n\n' + wdb;
  return main;
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
      const systemContent = `Du bist der Assistent für KK-Check (Krankenversicherung Liechtenstein).

Regeln:
- Beantworte NUR Fragen zur Krankenversicherung in Liechtenstein: OKP (obligatorische Krankenpflegeversicherung), Franchise, Selbstbehalt, Prämien, Kassenwechsel, Zusatzversicherungen in FL, Kassen Concordia/FKB/SWICA in Liechtenstein, Grenzgänger in Bezug auf FL.
- Antworte kurz und sachlich auf Deutsch.
- Wenn die Frage NICHT zur Krankenversicherung in Liechtenstein gehört (anderes Land, anderes Thema): lehne freundlich ab und bitte um eine passende Frage. Erfinde keine Antworten zu anderen Ländern oder Themen.
- Nutze ausschliesslich das folgende Wissen. Erfinde keine Leistungen, Fristen oder Zahlen. Wenn etwas nicht in den Quellen steht, sage das und verweise auf die Kasse oder ag.llv.li.

Wissen:
${knowledge}`;
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

app.post('/api/feedback', (req, res) => {
  try {
    const { type, text } = req.body || {};
    const t = type === 'feedback' ? 'feedback' : 'like';
    appendFeedback({ type: t, text: text ? String(text).trim().slice(0, 2000) : null });
    res.json({ ok: true, message: 'Danke für dein Feedback!' });
  } catch (e) {
    res.status(500).json({ message: 'Feedback fehlgeschlagen' });
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
    const feedback = readFeedback();
    let logCount = 0;
    try {
      logCount = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')).length;
    } catch {}
    const likesCount = feedback.filter((f) => f.type === 'like').length;
    const feedbackCount = feedback.filter((f) => f.type === 'feedback').length;
    res.json({
      remindersCount: reminders.length,
      trackEventsCount: logCount,
      likesCount,
      feedbackCount,
    });
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

app.get('/api/admin/usage', authAdmin, (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days || '30', 10), 90);
    res.json({ days: getUsageByDay(days) });
  } catch (e) {
    res.status(500).json({ message: 'Nutzung fehlgeschlagen' });
  }
});

app.get('/api/admin/feedback', authAdmin, (req, res) => {
  try {
    const list = readFeedback();
    res.json({ feedback: list.slice().reverse() });
  } catch (e) {
    res.status(500).json({ message: 'Feedback fehlgeschlagen' });
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
