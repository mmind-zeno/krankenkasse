import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/modules/HeroSection';

/* Zwei-Farben-Symbole: Icon in Akzentfarbe auf hellem Karten-Hintergrund */
const icons = {
  franchise: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h8M8 14h4M8 18h2" />
    </svg>
  ),
  vergleich: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-5" />
      <path d="M7 10l4 4 4-4 5 5" />
    </svg>
  ),
  leistungscheck: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 15l2 2 4-4" />
    </svg>
  ),
  familie: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  grenzgaenger: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l4 4-4 4" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  faq: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
};

const modules = [
  { to: '/franchise', label: 'Franchise-Optimizer', desc: 'Finde optimale Franchise', iconKey: 'franchise', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-600', hover: 'hover:border-blue-400 hover:bg-blue-100', badge: null },
  { to: '/vergleich', label: 'Kassenvergleich', desc: 'Prämien BASIC/PLUS vergleichen', iconKey: 'vergleich', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-700', hover: 'hover:border-blue-400 hover:bg-blue-100', badge: null },
  { to: '/leistungs-check', label: 'Leistungs-Check', desc: 'Was zahlt Ihre Krankenkasse zurück?', iconKey: 'leistungscheck', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-600', hover: 'hover:border-blue-400 hover:bg-blue-100', badge: 'NEU' },
  { to: '/familie', label: 'Familienrechner', desc: 'Kosten für Familien', iconKey: 'familie', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-600', hover: 'hover:border-blue-400 hover:bg-blue-100', badge: null },
  { to: '/grenzgaenger', label: 'Grenzgänger', desc: 'Wohnhaft in Österreich oder Schweiz', iconKey: 'grenzgaenger', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-700', hover: 'hover:border-blue-400 hover:bg-blue-100', badge: null },
  { to: '/faq', label: 'FAQ', desc: 'Häufige Fragen zu Franchise, Kassenwechsel und Prämien', iconKey: 'faq', bg: 'bg-white', border: 'border-blue-200', iconColor: 'text-blue-600', hover: 'hover:border-blue-400 hover:bg-blue-50', badge: null },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="heading-h2 text-primary">Module</h2>
            <p className="text-sm text-blue-600/80 hidden sm:block">Alle Tools kostenlos & ohne Anmeldung</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(({ to, label, desc, iconKey, bg, border, iconColor, hover, badge }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col p-5 min-h-[140px] rounded-2xl border-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${bg} ${border} ${hover}`}
                aria-label={`${label}: ${desc}`}
              >
                {badge && (
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[0.62rem] font-bold uppercase tracking-wider shadow-sm z-10">
                    {badge}
                  </span>
                )}
                <div className={`w-12 h-12 shrink-0 mb-3 ${iconColor}`}>
                  {icons[iconKey]}
                </div>
                <h3 className="font-bold text-blue-900 text-base leading-snug">{label}</h3>
                <p className="text-sm text-blue-700/90 mt-1 leading-snug">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/80 border border-blue-200 p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">✓</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-blue-900 text-lg">Neu: Leistungs-Check</p>
              <p className="text-sm text-blue-800/90 mt-1">
                Jetzt mit verifizierten Daten zu Spitalkomfort, Psychotherapie, Unfall-Schutz,
                Zahnarzt und mehr — alle 3 Kassen im direkten Vergleich.
              </p>
            </div>
            <Link
              to="/leistungs-check"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Leistungen checken →
            </Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-blue-200">
          <p className="text-center text-blue-700/90 text-sm">
            <Link to="/datenschutz" className="underline hover:text-primary">Datenschutz</Link>
            {' · '}
            <Link to="/disclaimer" className="underline hover:text-primary">Disclaimer</Link>
            {' · '}
            <Link to="/impressum" className="underline hover:text-primary">Impressum</Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
