import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/modules/HeroSection';

const modules = [
  { to: '/franchise', label: 'Franchise-Optimizer', desc: 'Deine optimale Franchise in 3 Schritten', icon: '🎯' },
  { to: '/vergleich', label: 'Kassenvergleich', desc: 'Prämien BASIC/PLUS vergleichen', icon: '📊' },
  { to: '/familie', label: 'Familienrechner', desc: 'Kosten für Familien', icon: '👨‍👩‍👧‍👦' },
  { to: '/grenzgaenger', label: 'Grenzgänger', desc: 'AT/CH — Wahlrecht & Tipps', icon: '🚗' },
  { to: '/faq', label: 'FAQ', desc: 'Häufige Fragen', icon: '❓' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="heading-h2 text-primary mb-6">Module</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(({ to, label, desc, icon }) => (
              <Link
                key={to}
                to={to}
                className="block p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <span className="text-3xl mb-2 block">{icon}</span>
                <h3 className="font-semibold text-slate-900">{label}</h3>
                <p className="text-sm text-slate-500 mt-1">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200">
          <p className="text-center text-slate-600 text-sm">
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
