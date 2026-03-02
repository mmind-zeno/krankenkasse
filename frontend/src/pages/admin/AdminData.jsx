import { useState, useEffect } from 'react';

export default function AdminData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/data', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Daten</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {data && (
        <div className="space-y-4">
          <p className="text-slate-600">{data.note}</p>
          <p className="text-sm text-slate-500">Datei: {data.premiumsFile}</p>
          {data.meta && Object.keys(data.meta).length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-800 mb-2">Prämien-Meta</h2>
              <pre className="text-sm text-slate-600 overflow-auto">{JSON.stringify(data.meta, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      {!data && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
