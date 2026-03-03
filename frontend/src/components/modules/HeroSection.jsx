import { Link } from 'react-router-dom';
import CountdownBanner from './CountdownBanner';

export default function HeroSection() {
  return (
    <section className="bg-hero-gradient text-white rounded-b-3xl overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <CountdownBanner />

        <div className="mt-6">
          <h1 className="sr-only">Krankenkassen Check Liechtenstein — Spare bis zu CHF 1200/Jahr</h1>
          <img
            src="/headerbild.png"
            alt="Krankenkassen Check Liechtenstein: Spare bis zu CHF 1200/Jahr bei der Krankenkasse. Finde deine optimale Franchise in 30 Sekunden."
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl object-contain"
            width={1200}
            height={630}
            fetchPriority="high"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/franchise"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-colors shadow-lg"
            aria-label="Jetzt Franchise berechnen"
          >
            Jetzt berechnen
            <span aria-hidden>→</span>
          </Link>
          <p className="text-sm text-blue-200 text-center sm:text-left">Gratis, ohne Anmeldung</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-blue-200">
          <span>✅ Kostenlos</span>
          <span>🔒 Keine Anmeldung</span>
          <span>🇱🇮 Made in FL</span>
        </div>
      </div>
    </section>
  );
}
