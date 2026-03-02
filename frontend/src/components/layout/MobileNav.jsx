import { Link } from 'react-router-dom';

export default function MobileNav({ open, onClose, links }) {
  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0 z-50" aria-modal="true">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <aside className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl flex flex-col">
        <div className="p-4 flex justify-end">
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Menü schliessen">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="px-4 pb-6 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={onClose} className="py-2 text-slate-800 font-medium hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
