import { useState, useEffect } from 'react';

const API = '/api/admin/reminders';

export default function AdminEmails() {
  const [reminders, setReminders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then((data) => setReminders(data.reminders || []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">E-Mails / Erinnerungen</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {reminders && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-2 font-semibold">E-Mail</th>
                <th className="px-4 py-2 font-semibold">Kasse</th>
                <th className="px-4 py-2 font-semibold">Franchise</th>
                <th className="px-4 py-2 font-semibold">Erinnerung am</th>
                <th className="px-4 py-2 font-semibold">Erstellt</th>
              </tr>
            </thead>
            <tbody>
              {reminders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-4 text-slate-500">Keine Einträge</td></tr>
              )}
              {reminders.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.kasse || '–'}</td>
                  <td className="px-4 py-2">{r.franchise != null ? `CHF ${r.franchise}` : '–'}</td>
                  <td className="px-4 py-2">{r.reminderDate || '–'}</td>
                  <td className="px-4 py-2 text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleString('de-CH') : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!reminders && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
