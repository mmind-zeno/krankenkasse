import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <div>
              <p className="font-semibold">KK-Check</p>
              <p className="text-sm text-blue-200">
                von{' '}
                <a
                  href="https://mmind.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded"
                >
                  mmind.ai
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link to="/datenschutz" className="text-blue-200 hover:text-white">
              Datenschutz
            </Link>
            <Link to="/disclaimer" className="text-blue-200 hover:text-white">
              Disclaimer
            </Link>
            <Link to="/impressum" className="text-blue-200 hover:text-white">
              Impressum
            </Link>
            <a href="https://mmind.ai" target="_blank" rel="noopener noreferrer" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded" aria-label="mmind.ai">
              <img src="/MMIND-Logo_white.svg" alt="mmind.ai" className="h-5 w-auto" />
            </a>
          </div>
        </div>
        <p className="mt-4 text-xs text-blue-300">
          Prämien ohne Gewähr. Offizielle Quelle:{' '}
          <a
            href="https://ag.llv.li"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            ag.llv.li
          </a>
        </p>
        <p className="mt-1 text-xs text-blue-300/80">
          Projekt in Kooperation mit Erasmus+.
        </p>
        <p className="mt-1 text-xs text-blue-300/80">
          Version {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '–'}
        </p>
      </div>
    </footer>
  );
}
