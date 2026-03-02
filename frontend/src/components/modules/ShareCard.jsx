import { useState } from 'react';

export default function ShareCard({ title = 'KK-Check Ergebnis', summary = '', optimalFranchise, savings }) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="flex flex-wrap gap-2">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
        WhatsApp
      </a>
      <a href={mailto} className="btn-secondary inline-flex items-center gap-2">
        E-Mail
      </a>
      <button type="button" onClick={copyLink} className="btn-secondary">
        {copied ? 'Kopiert!' : 'Link kopieren'}
      </button>
    </div>
  );
}
