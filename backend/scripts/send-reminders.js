/**
 * Liest reminders.json, findet fällige Erinnerungen (reminderDate <= heute),
 * sendet E-Mail per Nodemailer (SMTP aus ENV) und markiert als versendet.
 * Aufruf: node scripts/send-reminders.js (oder via Cron /api/cron/send-reminders)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REMINDERS_FILE = path.join(__dirname, '..', 'data', 'reminders.json');

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

function readReminders() {
  try {
    const raw = fs.readFileSync(REMINDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeReminders(arr) {
  fs.writeFileSync(REMINDERS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

async function main() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@krankenkasse.mmind.space';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('SMTP_HOST/SMTP_USER/SMTP_PASS nicht gesetzt – überspringe Versand.');
    process.exit(0);
  }

  const reminders = readReminders();
  const due = reminders.filter((r) => r.reminderDate && r.reminderDate <= today && !r.sentAt);
  if (due.length === 0) {
    console.log('Keine fälligen Erinnerungen.');
    process.exit(0);
  }

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
        text: `Hallo,\n\nSie haben eine Erinnerung für heute gesetzt (KK-Check).\nKasse: ${r.kasse || '–'}, Franchise: ${r.franchise != null ? 'CHF ' + r.franchise : '–'}.\n\nWechselfrist: 30. November. https://krankenkasse.mmind.space\n\n– KK-Check`,
      });
      r.sentAt = new Date().toISOString();
      console.log('Gesendet:', r.email);
    } catch (e) {
      console.error('Fehler beim Senden an', r.email, e.message);
    }
  }

  writeReminders(reminders);
  console.log('Fertig.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
