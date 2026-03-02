import { useState, useEffect } from 'react';

const API = '/api/admin/stats';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {stats && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Erinnerungen gespeichert</p>
            <p className="text-2xl font-bold text-primary">{stats.remindersCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Track-Events</p>
            <p className="text-2xl font-bold text-primary">{stats.trackEventsCount}</p>
          </div>
        </div>
      )}
      {!stats && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
