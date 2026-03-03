import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import LogoMark from './LogoMark';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Start' },
    { to: '/franchise', label: 'Franchise-Optimizer' },
    { to: '/vergleich', label: 'Kassenvergleich' },
    { to: '/leistungs-check', label: 'Leistungs-Check' },
    { to: '/faq', label: 'FAQ' },
    { to: '/datenschutz', label: 'Datenschutz' },
    { to: '/disclaimer', label: 'Disclaimer' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-lg">
          <LogoMark className="h-10 w-10 sm:h-12 sm:w-12" />
          <div>
            <span className="font-bold text-lg leading-tight block">KK-Check</span>
            <span className="text-xs text-blue-200">von mmind.ai</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {navLinks.slice(0, 4).map(({ to, label }) => (
            <Link key={to} to={to} className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2 text-blue-100 hover:text-white text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset">
              {label}
            </Link>
          ))}
          <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset rounded" aria-label="mmind.ai">
            <img src="/MMIND-Logo_white.svg" alt="mmind.ai" className="h-6 w-auto" />
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
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
