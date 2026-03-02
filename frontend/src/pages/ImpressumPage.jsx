import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary">Impressum</h1>
        <div className="prose prose-slate mt-4 text-slate-700">
          <p><strong>Angaben gemäss KVG / Informationspflicht</strong></p>
          <p>KK-Check ist ein unabhängiges Informationsangebot von mmind.ai. Es handelt sich um keine Krankenkasse und keine Versicherungsberatung.</p>
          <p><strong>Kontakt</strong><br />mmind.ai — Bei Fragen: Nutzen Sie die Kontaktmöglichkeiten auf mmind.ai.</p>
          <p><strong>Verantwortung</strong><br />Inhaltlich verantwortlich: mmind.ai. Prämien und rechtliche Angaben ohne Gewähr; Massgebend sind die offiziellen Tarife der Krankenkassen und ag.llv.li.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
