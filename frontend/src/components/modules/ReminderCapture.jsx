import { useState } from 'react';

const API_REMINDER = '/api/reminder';

export default function ReminderCapture({ defaultKasse, defaultFranchise, onSuccess }) {
  const [email, setEmail] = useState('');
  const [kasse, setKasse] = useState(defaultKasse || '');
  const [franchise, setFranchise] = useState(defaultFranchise ?? 500);
  const [reminderDate, setReminderDate] = useState('');
  const [status, setStatus] = useState(''); // 'idle' | 'sending' | 'ok' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(API_REMINDER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          kasse: kasse || undefined,
          franchise: franchise || undefined,
          reminderDate: reminderDate || undefined,
        }),
      });
      if (res.ok) {
        setStatus('ok');
        onSuccess?.();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="reminder-email" className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
        <input
          id="reminder-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          placeholder="ihre@email.li"
        />
      </div>
      <div>
        <label htmlFor="reminder-date" className="block text-sm font-medium text-slate-700 mb-1">Erinnerung am (optional)</label>
        <input
          id="reminder-date"
          type="date"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
      </div>
      {status === 'ok' && <p className="text-sm text-blue-600">Erinnerung geplant. Sie erhalten eine E-Mail.</p>}
      {status === 'error' && <p className="text-sm text-blue-700">Speichern fehlgeschlagen. Bitte später erneut versuchen.</p>}
      <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">
        {status === 'sending' ? 'Wird gesendet...' : 'Erinnerung anfordern'}
      </button>
    </form>
  );
}
