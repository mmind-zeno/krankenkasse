import { useState, useEffect } from 'react';

export default function AdminLogs() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/logs?limit=200', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then((data) => setLogs(data.logs || []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Logs</h1>
      {error && <p className="text-blue-700 mb-2">{error}</p>}
      {logs && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-2 font-semibold">Zeit</th>
                <th className="px-4 py-2 font-semibold">Event</th>
                <th className="px-4 py-2 font-semibold">Payload</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-4 text-slate-500">Keine Einträge</td></tr>
              )}
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-2 text-slate-500 whitespace-nowrap">{log.ts}</td>
                  <td className="px-4 py-2">{log.event || '–'}</td>
                  <td className="px-4 py-2 text-slate-600">{typeof log.payload === 'object' ? JSON.stringify(log.payload) : log.payload}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!logs && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
