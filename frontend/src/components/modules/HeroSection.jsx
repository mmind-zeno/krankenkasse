import { Link } from 'react-router-dom';
import CountdownBanner from './CountdownBanner';

export default function HeroSection() {
  return (
    <section className="bg-hero-gradient text-white rounded-b-3xl overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <CountdownBanner />

        <div className="mt-8 grid sm:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="heading-hero leading-tight mb-4">
              Spare bis zu CHF 800/Jahr bei der Krankenkasse
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Finde deine optimale Franchise — in 30 Sekunden. Gratis, ohne Anmeldung.
            </p>
            <Link
              to="/franchise"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors animate-pulse-glow"
            >
              Jetzt berechnen
              <span aria-hidden>→</span>
            </Link>
            <p className="mt-2 text-sm text-blue-200">Gratis, ohne Anmeldung</p>
          </div>
          <div className="hidden sm:block text-center animate-float">
            <span className="text-8xl" role="img" aria-label="Berg">🏔️</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-6 justify-center text-sm text-blue-200">
          <span>✅ Kostenlos</span>
          <span>🔒 Keine Anmeldung</span>
          <span>🇱🇮 Made in FL</span>
        </div>
      </div>
    </section>
  );
}
