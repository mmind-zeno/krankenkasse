import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary">Disclaimer</h1>
        <div className="prose prose-slate mt-4 text-slate-700">
          <p>KK-Check dient ausschliesslich der Information. Es ersetzt keine Beratung durch eine Krankenkasse oder einen Versicherungsberater. Prämien und Berechnungen sind unverbindlich und können von den offiziellen Tarifen abweichen. Massgebend sind die Angaben von ag.llv.li und den jeweiligen Kassen.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
