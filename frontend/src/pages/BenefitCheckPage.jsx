import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BenefitCheck from '../components/modules/BenefitCheck';

export default function BenefitCheckPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">

        {/* Page header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-4">
            Leistungs-Check
          </span>
          <h1 className="heading-h2 text-primary leading-tight">
            Was zahlt Ihre Krankenkasse zurück?
          </h1>
          <p className="text-blue-800/90 mt-2 text-base max-w-2xl">
            Entdecken Sie, welche Zusatzleistungen FKB, Concordia und SWICA für Fitness,
            Zahnarzt, Spital-Komfort, Psychotherapie und mehr bezahlen — mit verifizierten
            Beträgen direkt aus den Produktreglements 2026.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              'Spital-Komfort',
              'Psychotherapie',
              'Zahnarzt',
              'Fitness',
              'Unfall-Schutz',
              'Reise & Ausland',
            ].map((chip) => (
              <span
                key={chip}
                className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-medium border border-blue-200"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <BenefitCheck />
      </main>
      <Footer />
    </div>
  );
}
