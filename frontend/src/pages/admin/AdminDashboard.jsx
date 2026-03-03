import { useState, useEffect } from 'react';

const API = '/api/admin/stats';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Dashboard</h1>
      {error && <p className="text-blue-700 mb-2">{error}</p>}
      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Erinnerungen gespeichert</p>
            <p className="text-2xl font-bold text-primary">{stats.remindersCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Track-Events (Log)</p>
            <p className="text-2xl font-bold text-primary">{stats.trackEventsCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Likes</p>
            <p className="text-2xl font-bold text-primary">{stats.likesCount ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Feedback (Text)</p>
            <p className="text-2xl font-bold text-primary">{stats.feedbackCount ?? 0}</p>
          </div>
        </div>
      )}
      {!stats && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
