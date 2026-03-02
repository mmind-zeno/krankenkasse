import { Link, Outlet, useNavigate } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/settings', label: 'Einstellungen' },
  { to: '/admin/users', label: 'Benutzer' },
  { to: '/admin/emails', label: 'E-Mails' },
  { to: '/admin/data', label: 'Daten' },
  { to: '/admin/logs', label: 'Logs' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem('admin_token');
    } catch {}
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-56 bg-slate-800 text-white flex flex-col">
        <div className="p-4 font-bold border-b border-slate-700">Admin</div>
        <nav className="p-2 flex-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-700 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={logout} className="m-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white text-left">
          Abmelden
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
