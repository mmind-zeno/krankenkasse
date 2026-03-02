import { useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'kkcheck_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) == null;
    } catch {
      return true;
    }
  });

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-800 text-white shadow-lg">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm flex-1">
          Wir nutzen nur technisch notwendige Speicherung (z. B. für Einstellungen). Details in unserem{' '}
          <Link to="/datenschutz" className="underline">Datenschutz</Link>.
        </p>
        <button
          type="button"
          onClick={accept}
          className="btn-primary shrink-0"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
