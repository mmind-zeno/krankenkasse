import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/modules/HeroSection';

const modules = [
  {
    to: '/franchise',
    label: 'Franchise-Optimizer',
    desc: 'Optimale Franchise in 3 Schritten berechnen',
    icon: '🎯',
    accent: { bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:border-blue-400 hover:bg-blue-50/80', icon: 'bg-blue-100' },
    badge: null,
  },
  {
    to: '/vergleich',
    label: 'Kassenvergleich',
    desc: 'Prämien BASIC / PLUS aller Kassen vergleichen',
    icon: '📊',
    accent: { bg: 'bg-indigo-50', border: 'border-indigo-200', hover: 'hover:border-indigo-400 hover:bg-indigo-50/80', icon: 'bg-indigo-100' },
    badge: null,
  },
  {
    to: '/leistungs-check',
    label: 'Leistungs-Check',
    desc: 'Was zahlt Ihre Kasse für Fitness, Zahnarzt & mehr?',
    icon: '💡',
    accent: { bg: 'bg-emerald-50', border: 'border-emerald-200', hover: 'hover:border-emerald-400 hover:bg-emerald-50/80', icon: 'bg-emerald-100' },
    badge: 'NEU',
  },
  {
    to: '/familie',
    label: 'Familienrechner',
    desc: 'Prämienkosten für Familien & Kinder',
    icon: '👨‍👩‍👧‍👦',
    accent: { bg: 'bg-pink-50', border: 'border-pink-200', hover: 'hover:border-pink-400 hover:bg-pink-50/80', icon: 'bg-pink-100' },
    badge: null,
  },
  {
    to: '/grenzgaenger',
    label: 'Grenzgänger',
    desc: 'AT / CH — Wahlrecht & Tipps',
    icon: '🚗',
    accent: { bg: 'bg-amber-50', border: 'border-amber-200', hover: 'hover:border-amber-400 hover:bg-amber-50/80', icon: 'bg-amber-100' },
    badge: null,
  },
  {
    to: '/faq',
    label: 'FAQ',
    desc: 'Häufige Fragen rund um die Krankenkasse',
    icon: '❓',
    accent: { bg: 'bg-slate-50', border: 'border-slate-200', hover: 'hover:border-slate-400 hover:bg-slate-100', icon: 'bg-slate-100' },
    badge: null,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Module grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="heading-h2 text-primary">Module</h2>
            <p className="text-sm text-slate-400 hidden sm:block">Alle Tools kostenlos & ohne Anmeldung</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(({ to, label, desc, icon, accent, badge }) => (
              <Link
                key={to}
                to={to}
                className={`relative block p-5 min-h-[140px] rounded-2xl border-2 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${accent.bg} ${accent.border} ${accent.hover}`}
              >
                {badge && (
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[0.62rem] font-bold uppercase tracking-wider shadow-sm">
                    {badge}
                  </span>
                )}
                <div
                  className={`w-11 h-11 ${accent.icon} rounded-xl flex items-center justify-center text-2xl mb-3`}
                >
                  {icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{label}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-snug">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Highlight strip */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="text-4xl shrink-0">💡</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-slate-900 text-lg">Neu: Leistungs-Check</p>
              <p className="text-sm text-slate-600 mt-1">
                Jetzt mit verifizierten Daten zu Spitalkomfort, Psychotherapie, Unfall-Schutz,
                Zahnarzt und mehr — alle 3 Kassen im direkten Vergleich.
              </p>
            </div>
            <Link
              to="/leistungs-check"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              Leistungen checken →
            </Link>
          </div>
        </section>

        {/* Footer links */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200">
          <p className="text-center text-slate-500 text-sm">
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
