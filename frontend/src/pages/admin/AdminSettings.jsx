import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ OPENAI_API_KEY: '', SMTP_HOST: '', SMTP_USER: '', SMTP_FROM: '' });
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then((data) => {
        setSettings(data.settings || {});
        setForm({
          OPENAI_API_KEY: data.settings?.OPENAI_API_KEY ?? '',
          SMTP_HOST: data.settings?.SMTP_HOST ?? '',
          SMTP_USER: data.settings?.SMTP_USER ?? '',
          SMTP_FROM: data.settings?.SMTP_FROM ?? '',
        });
      })
      .catch((e) => setError(e.message));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        const data = await res.json();
        setSettings(data.settings || {});
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Einstellungen</h1>
      {error && <p className="text-blue-700 mb-2">{error}</p>}
      {saved && <p className="text-blue-600 mb-2">Gespeichert.</p>}
      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">OPENAI_API_KEY (für Chat-KI)</label>
          <input
            type="password"
            value={form.OPENAI_API_KEY}
            onChange={(e) => setForm((f) => ({ ...f, OPENAI_API_KEY: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="sk-..."
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP_HOST (Reminder-E-Mails)</label>
          <input
            type="text"
            value={form.SMTP_HOST}
            onChange={(e) => setForm((f) => ({ ...f, SMTP_HOST: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="smtp.example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP_USER</label>
          <input
            type="text"
            value={form.SMTP_USER}
            onChange={(e) => setForm((f) => ({ ...f, SMTP_USER: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP_FROM (Absender)</label>
          <input
            type="text"
            value={form.SMTP_FROM}
            onChange={(e) => setForm((f) => ({ ...f, SMTP_FROM: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="noreply@krankenkasse.mmind.space"
          />
        </div>
        <p className="text-sm text-slate-500">SMTP_PASS nur per Umgebungsvariable auf dem Server setzen (wird nicht hier gespeichert).</p>
        <button type="submit" className="btn-primary">Speichern</button>
      </form>
    </div>
  );
}
