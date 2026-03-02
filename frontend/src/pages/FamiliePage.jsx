import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FamilyCalc from '../components/modules/FamilyCalc';

export default function FamiliePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary">Familienrechner</h1>
        <p className="text-slate-600 mt-2 mb-6">Kosten für Familien — Erwachsene, Jugendliche (16–20), Kinder (unter 16 kostenlos).</p>
        <FamilyCalc />
      </main>
      <Footer />
    </div>
  );
}
