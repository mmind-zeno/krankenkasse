import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import faqContent from '../data/faq_content.json';

export default function FAQPage() {
  const [openId, setOpenId] = useState(null);
  const { faqs, categories } = faqContent;
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? faqs : faqs.filter((f) => f.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary mb-2">FAQ</h1>
        <p className="text-slate-600 mb-6">Häufige Fragen zu Franchise, Kassenwechsel und Prämien.</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            Alle
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${filter === c.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full text-left px-4 py-3 font-medium text-slate-900 flex justify-between items-center gap-2"
              >
                {faq.question}
                <span className="text-slate-400 shrink-0" aria-hidden>
                  {openId === faq.id ? '−' : '+'}
                </span>
              </button>
              {openId === faq.id && (
                <div className="px-4 pb-3 text-slate-600 text-sm border-t border-slate-100 pt-2">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
