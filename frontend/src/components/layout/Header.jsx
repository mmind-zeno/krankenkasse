import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Start' },
    { to: '/franchise', label: 'Franchise-Optimizer' },
    { to: '/vergleich', label: 'Kassenvergleich' },
    { to: '/faq', label: 'FAQ' },
    { to: '/datenschutz', label: 'Datenschutz' },
    { to: '/disclaimer', label: 'Disclaimer' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl">🏥</span>
          <div>
            <span className="font-bold text-lg leading-tight block">KK-Check</span>
            <span className="text-xs text-blue-200">von mmind.ai</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {navLinks.slice(0, 4).map(({ to, label }) => (
            <Link key={to} to={to} className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
              {label}
            </Link>
          ))}
          <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer" className="text-amber-200 hover:text-white text-sm font-medium">
            mmind.ai
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
          onClick={() => setMobileOpen(true)}
          aria-label="Menü öffnen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </header>
  );
}
