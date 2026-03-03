import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/users', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then((data) => setUsers(data.users || []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Benutzer</h1>
      {error && <p className="text-blue-700 mb-2">{error}</p>}
      {users && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-2 font-semibold">Benutzername</th>
                <th className="px-4 py-2 font-semibold">Rolle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.username} className="border-b border-slate-100">
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.role || 'admin'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!users && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
