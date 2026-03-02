import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_LOGIN = '/api/admin/login';

export default function AdminLoginPage() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: user, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok || data.token) {
        try {
          localStorage.setItem('admin_logged_in', '1');
        } catch {}
        navigate('/admin/dashboard');
      } else {
        setError('Anmeldung fehlgeschlagen. Benutzername oder Passwort falsch.');
      }
    } catch {
      setError('Verbindung fehlgeschlagen.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Admin Login</h1>
        <div className="space-y-3">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Benutzername"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="mt-4 w-full btn-primary">Anmelden</button>
      </form>
    </div>
  );
}
