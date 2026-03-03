import { useState, useEffect } from 'react';

export default function AdminUsage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/admin/usage?days=${days}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then((d) => setData(d.days || []))
      .catch((e) => setError(e.message));
  }, [days]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Nutzung</h1>
      <p className="text-slate-600 mb-4">Anzahl Nutzer und Aktionen pro Tag (basierend auf Track-Events und clientId).</p>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-slate-600">Tage anzeigen:</label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value={7}>7</option>
          <option value={14}>14</option>
          <option value={30}>30</option>
          <option value={90}>90</option>
        </select>
      </div>
      {error && <p className="text-blue-700 mb-2">{error}</p>}
      {data && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 font-semibold">Datum</th>
                <th className="px-4 py-2 font-semibold">Unique Nutzer</th>
                <th className="px-4 py-2 font-semibold">Events gesamt</th>
                <th className="px-4 py-2 font-semibold">Nach Aktion</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-4 text-slate-500">Keine Daten</td></tr>
              )}
              {data.map((row) => (
                <tr key={row.date} className="border-b border-slate-100">
                  <td className="px-4 py-2 font-medium">{row.date}</td>
                  <td className="px-4 py-2">{row.uniqueUsers}</td>
                  <td className="px-4 py-2">{row.totalEvents}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {row.byEvent && Object.entries(row.byEvent).map(([ev, n]) => (
                      <span key={ev} className="mr-2 inline-block"><strong>{ev}</strong>: {n}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!data && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
