import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function ShareCard({ title = 'KK-Check Ergebnis', summary = '', optimalFranchise, savings }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const text = [title, summary, optimalFranchise != null && `Empfohlene Franchise: CHF ${optimalFranchise}`, savings != null && savings > 0 && `Ersparnis: CHF ${savings}/Jahr`].filter(Boolean).join('\n');
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: '#f1f5f9' });
      const link = document.createElement('a');
      link.download = 'kk-check-ergebnis.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.warn('Bild-Export fehlgeschlagen', e);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Karte nur für Bild-Export (1200×630), ausgeblendet */}
      <div
        ref={cardRef}
        aria-hidden="true"
        className="absolute left-[-9999px] w-[600px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-800"
        style={{ width: 600, height: 315 }}
      >
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {summary && <p className="mt-2 text-sm text-slate-600">{summary}</p>}
        {optimalFranchise != null && <p className="mt-2 font-medium">Empfohlene Franchise: CHF {optimalFranchise}</p>}
        {savings != null && savings > 0 && <p className="mt-1 text-emerald-600">Ersparnis: CHF {savings}/Jahr</p>}
        <p className="mt-4 text-xs text-slate-500">kk-check — krankenkasse.mmind.space</p>
      </div>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
        WhatsApp
      </a>
      <a href={mailto} className="btn-secondary inline-flex items-center gap-2">
        E-Mail
      </a>
      <button type="button" onClick={copyLink} className="btn-secondary">
        {copied ? 'Kopiert!' : 'Link kopieren'}
      </button>
      <button type="button" onClick={downloadImage} className="btn-secondary">
        Bild herunterladen
      </button>
    </div>
  );
}
