import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PremiumTable from '../components/modules/PremiumTable';
import faqContent from '../data/faq_content.json';

const okpFaq = faqContent.faqs.find((f) => f.id === 'basic_vs_plus');

export default function VergleichPage() {
  const [okpOpen, setOkpOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary">Kassenvergleich</h1>
        <p className="text-slate-600 mt-2 mb-4">
          Prämien BASIC/PLUS vergleichen — Franchise wählen, effektive Kosten nach Arbeitgeberbeitrag.
        </p>

        {okpFaq && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setOkpOpen((o) => !o)}
              className="w-full text-left px-4 py-3 font-medium text-slate-900 flex justify-between items-center gap-2"
            >
              {okpFaq.question}
              <span className="text-slate-400 shrink-0" aria-hidden>
                {okpOpen ? '−' : '+'}
              </span>
            </button>
            {okpOpen && (
              <div className="px-4 pb-3 text-slate-600 text-sm border-t border-slate-100 pt-2">
                {okpFaq.answer}
              </div>
            )}
          </div>
        )}

        <PremiumTable />
      </main>
      <Footer />
    </div>
  );
}
