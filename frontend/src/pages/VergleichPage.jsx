import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PremiumTable from '../components/modules/PremiumTable';

export default function VergleichPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary">Kassenvergleich</h1>
        <p className="text-slate-600 mt-2 mb-6">
          Prämien BASIC/PLUS vergleichen — Franchise wählen, effektive Kosten nach Arbeitgeberbeitrag.
        </p>
        <PremiumTable />
      </main>
      <Footer />
    </div>
  );
}
