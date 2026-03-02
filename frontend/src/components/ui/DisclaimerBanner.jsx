import { useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'kkcheck_disclaimer_dismissed';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-amber-900">
        KK-Check dient nur der Information. Kein Ersatz für Beratung durch Kasse oder Berater.{' '}
        <Link to="/disclaimer" className="underline font-medium">Mehr</Link>
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="text-amber-700 hover:text-amber-900 text-sm font-medium shrink-0"
        aria-label="Hinweis schliessen"
      >
        Schliessen
      </button>
    </div>
  );
}
