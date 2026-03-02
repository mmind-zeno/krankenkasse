import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function GrenzgaengerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary">Grenzgänger</h1>
        <p className="text-slate-600 mt-2 mb-6">Wohnhaft in Österreich oder Schweiz, Arbeit in Liechtenstein — Wahlrecht und Tipps.</p>

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <span>🇦🇹</span> Österreich → Arbeit in FL
            </h2>
            <p className="text-slate-600 mt-2">
              Als österreichischer Staatsbürger haben Sie ein <strong>Wahlrecht</strong>: In den ersten <strong>3 Monaten</strong> nach Arbeitsbeginn entscheiden Sie, ob Sie in Liechtenstein oder in Österreich versichert bleiben. Diese Entscheidung ist für die Dauer des Arbeitsverhältnisses bindend.
            </p>
            <p className="text-slate-600 mt-2">
              Wenn Sie sich in FL versichern: Nutzen Sie den <Link to="/franchise" className="text-primary underline font-medium">Franchise-Optimizer</Link> und den <Link to="/vergleich" className="text-primary underline font-medium">Kassenvergleich</Link> für die günstigste Prämie. Bei häufigem Arztbesuch in AT kann <strong>OKP PLUS</strong> (freie Arztwahl) sinnvoll sein.
            </p>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <span>🇨🇭</span> Schweiz → Arbeit in FL
            </h2>
            <p className="text-slate-600 mt-2">
              Schweizer Grenzgänger bleiben <strong>zwingend in der Schweiz versichert</strong>. Sie zahlen keine Prämie in Liechtenstein. Ihr Arbeitgeber in FL kann Sie über das bilaterale Abkommen betreffend.
            </p>
          </section>

          <section className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800">Wechselfristen</h2>
            <p className="text-slate-600 mt-2">
              Kassenwechsel: bis <strong>30. November</strong> (Wirkung per 1. Januar). Franchise ändern: bis <strong>31. Dezember</strong>. Mehr in den <Link to="/faq" className="text-primary underline font-medium">FAQ</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
